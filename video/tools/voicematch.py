#!/usr/bin/env python3
"""Find an EQ that gives a processed voice the tonal balance (bass / mids / treble) of a reference recording.

  video/tools/voicematch.py <reference.wav> <voice.wav> "<pre-chain>" "<post-chain>" [target LUFS]

The full chain is  pre , EQ , post , volume , true-peak limiter — so the match is measured on exactly what the
listener hears. Iterates: render → measure bands against the reference and integrated loudness against the target →
nudge each band's gain and the output gain, until every band is within 1 dB and loudness within 0.2 LU (max 8 rounds).
Prints the final ffmpeg chain for  EQ , post , volume , limiter  on the last line.
"""
import subprocess, sys, tempfile, os
import numpy as np

SR = 32000
CENTRES = {"bass": 160, "low-mid": 400, "presence": 3200, "brilliance": 6800, "air": 11000}
BANDS = {"bass": (100, 250), "low-mid": (250, 600), "presence": (2000, 5000), "brilliance": (5000, 9000), "air": (9000, 11800)}
CAP = {"bass": 10, "low-mid": 6, "presence": 6, "brilliance": 6, "air": 3}


def frames(path, chain=None):
    cmd = ["ffmpeg", "-v", "error", "-i", path] + (["-af", chain] if chain else []) + ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    n = 1024; fr = x[: len(x) // n * n].reshape(-1, n); rms = np.sqrt((fr ** 2).mean(1) + 1e-12)
    return fr[rms > np.percentile(rms[rms > 1e-5], 40)]          # voiced frames only, same rule for both files


def bands(fr):
    P = (np.abs(np.fft.rfft(fr * np.hanning(fr.shape[1]), axis=1)) ** 2).mean(0)
    f = np.fft.rfftfreq(fr.shape[1], 1 / SR)
    lv = lambda a, b: 10 * np.log10(P[(f >= a) & (f < b)].mean() + 1e-20)
    mid = lv(600, 2000)
    return {k: lv(a, b) - mid for k, (a, b) in BANDS.items()}


def eq_chain(g):
    return ",".join(f"equalizer=f={CENTRES[k]}:t=o:w=1.2:g={v:.1f}" for k, v in g.items() if abs(v) >= .3) or "anull"


LIMIT = "alimiter=limit=0.84:attack=4:release=100:level=false"   # -1.5 dBFS ceiling


def lufs(path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float([l for l in out.splitlines() if l.strip().startswith("I:")][-1].split()[1])


def main():
    ref_path, voice, pre, post = sys.argv[1:5]
    target = float(sys.argv[5]) if len(sys.argv) > 5 else -16.0
    ref = bands(frames(ref_path))
    gains, vol = {k: 0.0 for k in CENTRES}, 0.0
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    for rnd in range(1, 9):
        tail = f"{eq_chain(gains)},{post},volume={vol:.2f}dB,{LIMIT}"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voice, "-af", f"{pre},{tail}", "-c:a", "pcm_f32le", tmp], check=True)
        got, L = bands(frames(tmp)), lufs(tmp)
        diff = {k: ref[k] - got[k] for k in CENTRES}
        print(f"  round {rnd}: " + "  ".join(f"{k} {diff[k]:+.1f}" for k in CENTRES) + f"   {L:.1f} LUFS", file=sys.stderr)
        done = all(abs(diff[k]) < 1 or abs(gains[k]) >= CAP[k] and diff[k] * gains[k] > 0 for k in CENTRES)   # a band at its cap counts as done
        if done and abs(L - target) < .2:
            break
        for k in CENTRES:
            gains[k] = float(np.clip(gains[k] + .8 * diff[k], -CAP[k], CAP[k]))
        vol += target - L
    os.unlink(tmp)
    print(f"{eq_chain(gains)},{post},volume={vol:.2f}dB,{LIMIT}")


if __name__ == "__main__":
    main()
