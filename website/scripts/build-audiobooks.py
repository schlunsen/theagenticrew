#!/usr/bin/env python3
"""Index the audiobook MP3s for the website's player.

  python3 website/scripts/build-audiobooks.py

Scans website/public/audiobook/ for each edition below, keeps only the chapters whose MP3 exists, measures each
duration with ffprobe, and writes website/src/data/audiobooks.json. The <Listen> component reads it, so the player
never lists a chapter that has no audio. Re-run after adding or regenerating audio.
"""
import json, subprocess
from pathlib import Path

WEB = Path(__file__).resolve().parents[1]
PUB = WEB / "public"

ENGINEERING = [
    ("01-introduction", "01", "Introduction"), ("02-what-is-an-agent", "02", "What Is an Agent?"),
    ("03-context", "03", "Context"), ("04-guardrails-trust-and-sandboxes", "04", "Guardrails, Trust, and Sandboxes"),
    ("05-git", "05", "Git as Agent Infrastructure"), ("06-testing-as-the-feedback-loop", "06", "Testing as the Feedback Loop"),
    ("07-convention-over-configuration", "07", "Convention Over Configuration"), ("08-the-ships-log", "08", "The Ship's Log"),
    ("09-extending-the-agents-reach", "09", "Extending the Agent's Reach"), ("10-articulating-intent", "10", "Articulating Intent"),
    ("11-local-commercial-and-hybrid-models", "11", "Local, Commercial, and Hybrid Models"),
    ("12-multi-agent-orchestration", "12", "Multi-Agent Orchestration"), ("13-agents-in-the-pipeline", "13", "Agents in the Pipeline"),
    ("14-when-agents-get-it-wrong", "14", "When Agents Get It Wrong"), ("15-when-not-to-use-agents", "15", "When Not to Use Agents"),
    ("16-agentic-teams", "16", "Agentic Teams"), ("17-final-words", "17", "Final Words"),
]
CREW = [
    ("00-front-matter", "", "Front Matter", "Preliminars"),
    ("01-welcome-to-the-crew", "01", "Welcome to the Crew", "Benvingut a la tripulació"),
    ("02-the-ground-is-shifting", "02", "The Ground Is Shifting", "El terra s'està movent"),
    ("03-whats-under-the-hood", "03", "What's Under the Hood", "Què hi ha sota el capó"),
    ("04-what-is-an-agent", "04", "What Is an Agent, Really?", "Què és un agent, realment?"),
    ("05-how-to-give-good-instructions", "05", "How to Give Good Instructions", "Com donar bones instruccions"),
    ("06-what-the-agent-can-see", "06", "What the Agent Can See", "Què pot veure l'agent"),
    ("07-the-trust-gradient", "07", "The Trust Gradient", "El gradient de confiança"),
    ("08-extending-the-crews-reach", "08", "Extending the Crew's Reach", "Ampliant l'abast de la tripulació"),
    ("09-the-padlock", "09", "The Padlock", "El cadenat"),
    ("10-reading-the-output-like-a-pro", "10", "Reading the Output Like a Pro", "Llegir la sortida com un professional"),
    ("11-building-something-real", "11", "Building Something Real", "Construir alguna cosa real"),
    ("12-building-something-else", "12a", "Building Something Else", "Construir alguna altra cosa"),
    ("12-when-things-go-wrong", "12b", "When Things Go Wrong", "Quan les coses surten malament"),
    ("13-when-to-do-it-yourself", "13", "When to Do It Yourself", "Quan fer-ho tu mateix"),
    ("14-being-the-human-in-the-loop", "14", "Being the Human in the Loop", "Ser l'humà en el procés"),
    ("15-talking-to-your-tech-team", "15", "Talking to Your Tech Team", "Parlant amb el teu equip tècnic"),
    ("16-keeping-your-finger-on-the-pulse", "16", "Keeping Your Finger on the Pulse", "Mantenir el pols"),
    ("17-final-words", "17", "Final Words", "Paraules finals"),
    ("18-getting-started", "18", "Getting Started", "Per començar"),
    ("99-dedication", "", "Dedication", "Dedicatòria"),
]
# edition id → (book, book title, label, language, folder, chapters, note)
EDITIONS = [
    ("eng", "engineering", "The Agentic Crew", "English", "en", "audiobook/adult/kitt",
     [(i, n, t) for i, n, t in ENGINEERING], "Narrates the first edition; the second-edition chapters are on the way."),
    ("crew-sky", "crew", "Crew Member's Guide", "English · Sky", "en", "audiobook/crew/sky", [(i, n, t) for i, n, t, _ in CREW], ""),
    ("crew-amy", "crew", "Crew Member's Guide", "English · Amy", "en", "audiobook/crew/female", [(i, n, t) for i, n, t, _ in CREW], ""),
    ("crew-ca", "crew", "Guia del tripulant", "Català · Amy", "ca", "audiobook/crew-ca/female", [(i, n, c) for i, n, _, c in CREW], ""),
]


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return round(float(out), 1) if out else 0.0


def main():
    editions = []
    for eid, book, book_title, label, lang, folder, chapters, note in EDITIONS:
        tracks = []
        for cid, num, title in chapters:
            f = PUB / folder / f"{cid}.mp3"
            if f.exists():
                tracks.append({"id": cid, "number": num, "title": title, "src": f"/{folder}/{cid}.mp3", "duration": duration(f)})
        full = PUB / folder / "full-book.mp3"
        editions.append({"id": eid, "book": book, "bookTitle": book_title, "label": label, "lang": lang, "note": note,
                         "tracks": tracks, "full": f"/{folder}/full-book.mp3" if full.exists() else None,
                         "fullMB": round(full.stat().st_size / 1e6) if full.exists() else 0,
                         "totalMinutes": round(sum(t["duration"] for t in tracks) / 60)})
        missing = [c[0] for c in chapters if not (PUB / folder / f"{c[0]}.mp3").exists()]
        print(f"{eid:9s} {len(tracks):2d} tracks, {editions[-1]['totalMinutes']} min" + (f"  (no audio: {', '.join(missing)})" if missing else ""))
    (WEB / "src" / "data" / "audiobooks.json").write_text(json.dumps(editions, indent=1, ensure_ascii=False))
    print("wrote website/src/data/audiobooks.json")


if __name__ == "__main__":
    main()
