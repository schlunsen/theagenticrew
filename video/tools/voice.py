#!/usr/bin/env python3
"""Narrate a chapter intro in the author's cloned voice, locally.

  video/tools/voice.py ch01            # every beat (skips beats already rendered)
  video/tools/voice.py ch01 --redo loop  # re-take one beat

Reads   video/narration/<ch>.json
Writes  video/build/<ch>/beats/<id>.wav       one take per beat
        video/build/<ch>/voice.wav            the assembled narration track (lead-in, gaps, tail)
        video/build/<ch>/timing.json          beat and word times in video seconds
        video/riso/src/scenes/<ch>.timing.js  the same, as a global the scene reads (TIMING)

Voice engines (--engine):
  atlas  (default) MiniMax Speech 2.6 HD on Atlas Cloud, voice English_magnetic_voiced_man. Needs ATLASCLOUD_API_KEY.
  clone  Qwen3-TTS 1.7B Base (mlx-audio, Apple Silicon) cloned from assets/voice-ref.wav (the author's voice).
Every take is transcribed with Whisper; a take whose words drift from the script is re-generated.
Needs a Python env with:  mlx-audio mlx-whisper soundfile numpy
"""
import argparse, difflib, json, re, sys
from pathlib import Path

import os, subprocess, time
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
REF_AUDIO = ROOT / "assets" / "voice-ref.wav"
REF_TEXT = ("The best software is built by people who care deeply about the problem they are solving. "
            "It's not about the tools you use or the frameworks you pick. It's about understanding what matters, "
            "making smart trade-offs and shipping something that actually works in the real world.")
TTS_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16"
STT_MODEL = "mlx-community/whisper-large-v3-turbo"
SR = 24000
MAX_TAKES = 4
MIN_MATCH = 0.93


def norm(s):
    s = s.lower().replace("colour", "color")
    return re.sub(r"[^a-z0-9 ]+", " ", s).split()


def match(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()


def trim(x, thr=0.01, pad=0.06):
    """Cut leading/trailing silence, keep a short pad."""
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a, b = max(0, idx[0] - int(pad * SR)), min(len(x), idx[-1] + int(pad * SR))
    return x[a:b]


def atlas_tts(text, voice):
    import requests
    H = {"Authorization": "Bearer " + os.environ["ATLASCLOUD_API_KEY"]}
    body = {"model": "minimax/speech-2.6-hd", "text": text, "voice": voice, "speed": 1, "emotion": "auto",
            "language_boost": "English", "format": "wav", "sample_rate": 44100}
    r = requests.post("https://api.atlascloud.ai/api/v1/model/generateAudio", headers=H, json=body, timeout=60).json()
    if r.get("code") != 200:
        raise RuntimeError(r)
    job = r["data"]["id"]
    for _ in range(120):
        d = requests.get(f"https://api.atlascloud.ai/api/v1/model/prediction/{job}", headers=H, timeout=60).json()["data"]
        if d.get("outputs"):
            raw = requests.get(d["outputs"][0], timeout=120).content
            pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "f32le", "-ac", "1", "-ar", str(SR), "pipe:1"],
                                 input=raw, capture_output=True, check=True).stdout
            return np.frombuffer(pcm, dtype=np.float32).copy()
        if d.get("status") in ("failed", "error"):
            raise RuntimeError(d.get("error"))
        time.sleep(2)
    raise TimeoutError(job)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter")
    ap.add_argument("--redo", nargs="*", default=[])
    ap.add_argument("--temperature", type=float, default=0.7)
    ap.add_argument("--engine", choices=["atlas", "clone"], default=None, help="default: the narration file's \"engine\", else atlas")
    ap.add_argument("--voice", default="English_magnetic_voiced_man")
    ap.add_argument("--require", nargs="*", default=[], help="words a take must be heard saying (e.g. agentic)")
    args = ap.parse_args()

    spec = json.loads((ROOT / "video" / "narration" / f"{args.chapter}.json").read_text())
    args.engine = args.engine or spec.get("engine", "atlas")
    out = ROOT / "video" / "build" / args.chapter
    (out / "beats").mkdir(parents=True, exist_ok=True)

    import mlx_whisper
    tts = None

    def transcribe(path):
        r = mlx_whisper.transcribe(str(path), path_or_hf_repo=STT_MODEL, word_timestamps=True, language="en")
        words = [{"w": w["word"].strip(), "s": float(w["start"]), "e": float(w["end"])} for s in r["segments"] for w in s["words"]]
        return r["text"].strip(), words

    for beat in spec["beats"]:
        path = out / "beats" / f"{beat['id']}.wav"
        if path.exists() and beat["id"] not in args.redo:
            continue
        if tts is None and args.engine == "clone":
            from mlx_audio.tts.utils import load_model
            tts = load_model(TTS_MODEL)
        best = None
        for take in range(1, MAX_TAKES + 1):
            if args.engine == "atlas":
                audio = trim(atlas_tts(beat["text"], args.voice))
            else:
                res = list(tts.generate(text=beat["text"], ref_audio=str(REF_AUDIO), ref_text=REF_TEXT,
                                        lang_code="en", temperature=args.temperature))
                audio = trim(np.concatenate([np.array(r.audio, dtype=np.float32) for r in res]))
            sf.write(path, audio, SR)
            heard, _ = transcribe(path)
            m = match(beat["text"], heard)
            if any(w.lower() not in heard.lower() for w in args.require if w.lower() in beat["text"].lower()):
                m = min(m, MIN_MATCH - .01)   # a required word was misheard: take again
            print(f"  {beat['id']:>9}  take {take}  {len(audio) / SR:5.1f}s  match {m:.3f}", flush=True)
            if best is None or m > best[0]:
                best = (m, audio)
            if m >= MIN_MATCH:
                break
        sf.write(path, best[1], SR)
        if best[0] < MIN_MATCH:
            print(f"  !! {beat['id']}: best take only matched {best[0]:.3f}; listen to it", flush=True)

    # assemble: lead-in, beats with their gaps, tail
    track, t = [np.zeros(int(spec["lead_in"] * SR), np.float32)], spec["lead_in"]
    timing = {"chapter": spec["chapter"], "title": spec["title"], "next": spec.get("next", ""), "beats": {}}
    for beat in spec["beats"]:
        if beat.get("gap"):
            track.append(np.zeros(int(beat["gap"] * SR), np.float32)); t += beat["gap"]
        audio, _ = sf.read(out / "beats" / f"{beat['id']}.wav", dtype="float32")
        _, words = transcribe(out / "beats" / f"{beat['id']}.wav")
        dur = len(audio) / SR
        timing["beats"][beat["id"]] = {"start": round(t, 3), "end": round(t + dur, 3),
                                       "words": [{"w": w["w"], "s": round(t + w["s"], 3), "e": round(t + w["e"], 3)} for w in words]}
        track.append(audio); t += dur
    track.append(np.zeros(int(spec["tail"] * SR), np.float32)); t += spec["tail"]
    timing["duration"] = round(t, 3)
    sf.write(out / "voice.wav", np.concatenate(track), SR)
    (out / "timing.json").write_text(json.dumps(timing, indent=1))
    (ROOT / "video" / "riso" / "src" / "scenes" / f"{args.chapter}.timing.js").write_text(
        "// generated by video/tools/voice.py: beat and word times (video seconds) for the narration\n"
        f"const TIMING = {json.dumps(timing)};\n")
    print(f"voice.wav {t:.1f}s  →  {out}")


if __name__ == "__main__":
    sys.exit(main())
