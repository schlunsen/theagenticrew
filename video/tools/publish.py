#!/usr/bin/env python3
"""Publish the finished chapter films to the website.

  python3 video/tools/publish.py            # every chapter with a rendered film
  python3 video/tools/publish.py ch03 ch04  # just these
  python3 video/tools/publish.py --book crew [crew09 …]      # the Crew Member's Guide's watercolour films
  python3 video/tools/publish.py --book handson              # the Hands-On Guide's film
Each book has its own film folder and data file, so the series never overwrite each other (see BOOKS).

For each video/build/<ch>/<ch>-<slug>.mp4 (with narration/<ch>.json and build/<ch>/timing.json) it writes:
  website/public/films/<slug>.mp4   web encode (1080p, x264 CRF 29, tune grain: the halftone survives at ~2 Mbit/s)
  website/public/films/<slug>.jpg   poster (the YouTube thumbnail if there is one, else a frame)
  website/public/films/<slug>.vtt   captions built from the narration's word timings
and rewrites website/src/data/films.json, which the /watch pages and the homepage chapter list read.
Encodes are skipped when the web file is newer than the master.
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BUILD, NARR = ROOT / "video" / "build", ROOT / "video" / "narration"
FILMS, SRC = ROOT / "website" / "public" / "films", ROOT / "website" / "src" / "data"
# book → (web folder, url prefix, data file, film ids in order, parts as (numeral, title, first, last) by position in ORDER)
BOOKS = {
    "main": (FILMS, "/films", SRC / "films.json", [f"ch{n:02d}" for n in range(1, 20)] + ["chA", "chB"],
             [("I", "Setting Sail", 1, 2), ("II", "Rigging the Ship", 3, 8), ("III", "Beyond the Harbour", 9, 12),
              ("IV", "Running a Fleet", 13, 15), ("V", "Hard-Won Lessons", 16, 19), ("", "Appendices", 20, 21)]),
    # crew films are keyed by their book chapter number; ORDER lists every chapter that may get a film
    "crew": (FILMS / "crew", "/films/crew", SRC / "films-crew.json", [f"crew{n:02d}" for n in range(1, 20)],
             [("I", "Setting Sail", 1, 2), ("II", "Below Deck", 3, 4), ("III", "Taking the Helm", 5, 9),
              ("IV", "Underway", 10, 12), ("V", "Hard-Won Lessons", 13, 19)]),
    "handson": (FILMS / "hands-on", "/films/hands-on", SRC / "films-handson.json", ["handson00"], [("", "Overview", 1, 1)]),
}
book = "main"
if len(sys.argv) > 2 and sys.argv[1] == "--book":
    book = sys.argv[2]; sys.argv[1:3] = []
PUB, URL, DATA, ORDER, PARTS = BOOKS[book]


def ts(t):
    h, rem = divmod(t, 3600); m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def captions(timing, beats_text):
    """Cues of ≤ 7 words / ≤ 3.2 s, broken at punctuation, using the script's own words (Whisper's spelling can drift)."""
    cues = []
    for bid, b in timing["beats"].items():
        words = b["words"]
        script = beats_text.get(bid, "").split()
        use_script = len(script) == len(words)          # same word count: show the script's spelling
        cur = []
        for i, w in enumerate(words):
            cur.append((script[i] if use_script else w["w"], w["s"], w["e"]))
            end_here = re.search(r"[.,;:!?]$", cur[-1][0]) or len(cur) >= 7 or cur[-1][2] - cur[0][1] > 3.2
            if end_here or i == len(words) - 1:
                cues.append((cur[0][1], max(cur[-1][2], cur[0][1] + .6), " ".join(x[0] for x in cur)))
                cur = []
    out = ["WEBVTT", ""]
    for i, (a, b, text) in enumerate(cues):
        nb = cues[i + 1][0] if i + 1 < len(cues) else b + 1
        out += [f"{ts(a)} --> {ts(min(b + .25, nb))}", text, ""]
    return "\n".join(out)


def main():
    want = sys.argv[1:] or ORDER
    PUB.mkdir(parents=True, exist_ok=True)
    films = {f["id"]: f for f in json.loads(DATA.read_text())} if DATA.exists() else {}
    for idx, ch in enumerate(ORDER):
        if ch not in want:
            continue
        masters = sorted((BUILD / ch).glob(f"{ch}-*.mp4")) if (BUILD / ch).exists() else []
        narr, timing_p = NARR / f"{ch}.json", BUILD / ch / "timing.json"
        if not masters or not narr.exists() or not timing_p.exists():
            continue
        master = masters[-1]
        spec, timing = json.loads(narr.read_text()), json.loads(timing_p.read_text())
        slug = master.stem.split("-", 1)[1]
        num = spec["chapter"]
        web = PUB / f"{slug}.mp4"
        if not web.exists() or web.stat().st_mtime < master.stat().st_mtime:
            print(f"encode {ch} → {web.name}", flush=True)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-c:v", "libx264", "-preset", "slow", "-crf", "29",
                            "-tune", "grain", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(web)], check=True)
        thumb = BUILD / "youtube" / f"thumb-{ch}-1280x720.jpg"
        poster = PUB / f"{slug}.jpg"
        if thumb.exists():
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(thumb), "-q:v", "4", str(poster)], check=True)
        else:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "3", "-i", str(master), "-frames:v", "1", "-vf", "scale=1280:720", "-q:v", "4", str(poster)], check=True)
        beats_text = {b["id"]: b["text"] for b in spec["beats"]}
        (PUB / f"{slug}.vtt").write_text(captions(timing, beats_text))
        n = idx + 1
        part = next(p for p in PARTS if p[2] <= n <= p[3])
        films[num] = {
            "id": num, "order": n, "slug": slug, "title": spec["title"], "next": spec.get("next", ""),
            "part": part[0], "partTitle": part[1],
            "duration": round(timing["duration"], 1),
            "video": f"{URL}/{slug}.mp4", "poster": f"{URL}/{slug}.jpg", "captions": f"{URL}/{slug}.vtt",
            "sizeMB": round(web.stat().st_size / 1e6, 1),
            "transcript": [b["text"] for b in spec["beats"]],
        }
        print(f"  {num}  {spec['title']}  {timing['duration']:.0f}s  {web.stat().st_size / 1e6:.1f} MB")
    DATA.write_text(json.dumps(sorted(films.values(), key=lambda f: f["order"]), indent=1, ensure_ascii=False))
    print(f"{len(films)} films → {DATA.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
