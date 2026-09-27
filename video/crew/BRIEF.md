# Brief: watercolour films for the Crew Member's Guide (and the Hands-On Guide)

You're making a 2–3 minute narrated explainer film for one chapter of a free book in *The Agentic Crew* series. These films are a **different series** from the main book's riso films (`video/riso/`): they are **hand-painted watercolour and ink**, painted in code with p5.js + p5.brush on John Heibel's [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) (MIT), vendored in `video/crew/engine/`. The look and the working method are inspired by his music video [*I'm Upping My P(doom)*](https://github.com/JohnHeibel/PDoomVideo).

Paths are relative to the repo root `/Users/schlunsen/projects/the-agentic-crew`.

## Read first, in this order
1. `video/crew/engine/ANIMATION_GUIDE.md` — **in full**. It's the medium: its rules (handmade, alive, one piece, transitions always, something happens in every scene), the workflow (storyboard → build → review loop → render), the painting API and Clawd (whose API our agent keeps). Obey it, with the two exceptions below.
2. `video/crew/common.js` — the series' shared pieces: the palette, narration timing (`wt`, `shotAt`, `B`), the painted **ident** and **end card**, the **Navigator** character, and the seam helper. Its header documents the API.
3. `video/crew/agent.js` — the header: the agent (Folio), its options and how Clawd's hooks, hats and chomp map onto it. Where the guide says Clawd, read Folio.
4. `video/crew/<your film>/` — your film folder (see "Setup"). `video/crew/crew04/` is the reference once it exists; if it does, study its scene before you start.
5. The chapter source, **in full** (the path is given in your task).

## What the series is
- **Audience:** people who are good with computers but don't write code (the Crew guide), or engineers doing exercises (the Hands-On guide). Explain plainly. No jargon without a picture.
- **Cast:** **Folio** (the agent: a paper boat folded from the instructions it was given, still written on its sail; face on the hull, red pennant at the peak. Eager, literal, tireless, confidently wrong sometimes: it does exactly what's written on it) and **the Navigator** (the human: a non-programmer who knows the waters — she directs, checks, decides). She is the protagonist; Folio is her crew. Use both in most shots. Folio replaces the engine's Clawd: draw it with `agent(x, y, u, o)` (`clawd()` is the same function, and everything in the guide's Clawd section — `feel`, `emotions`, `move`, `turn`, hats, hooks, `lid` — works on it). Model sheet: `video/crew/docs/agent.jpg`.
- **Motif:** the compass rose (the crew guide's cover). It assembles in the ident and turns in the end card.
- **Palette (crew guide):** sea-teal, ochre, cream paper, with rose and sap as accents — `CREW` in common.js. Soft, warm, saturated-but-gentle watercolour; clear contrast between characters and ground.

## Lessons taken from the P(doom) video — apply them
- **Sets, not cards.** Each beat happens in a *place* (a chart room, a ship's deck, a harbour office, a cluttered workbench, a post room) and the camera moves through it. Recurring sets tie the film together; escalate them rather than inventing a new one every shot.
- **Motivated transitions.** Brush wipes only at the ident and the end card. Between beats, the *action* carries you across the cut: a push into an object that becomes the next set, a door slam, a page turn, paint splashing across the lens, an iris shaped like a keyhole or an envelope, a whip pan.
- **Something happens in every shot.** A character does something, something breaks, transforms, fills up, falls. Never a static illustration under a voice.
- **Emotion morphs, never snaps:** `mood()` / `feel()` with a take and an emote.
- **Camera always moves:** push, pan, tilt, drift, or a small shake on a hit.
- **Text-light.** Tell it with pictures and acting. Allowed: the ident and end card; at most **three** short words or one number per film, when the word *is* the point (e.g. "PLAN", "3"). No labels on things, no captions repeating the narration.
- **One clear focal action per shot, big silhouettes.** The viewer has one listen to get it.

## The two exceptions to ANIMATION_GUIDE.md
1. **Timing comes from the narration, not a beat grid.** Every event is keyed to a spoken word: `wt('beatId', 'word')`. Never hard-code a time. `PROJECT.bpm` still drives idle bounce and `pulse()`; it's set in your `config.js`.
2. **The ident and end card may use lettering** (they do so via common.js).

## Pipeline (per film, id e.g. `crew09`)
Environment (bash):
```bash
S=/private/tmp/claude-501/-Users-schlunsen-projects-the-agentic-crew/ae504ced-d229-4310-8954-98d4b7f2200b/scratchpad
. $S/atlas.env                        # ATLASCLOUD_API_KEY (never print or copy it)
PY=$S/tts-env/bin/python               # has mlx-audio, mlx-whisper, requests, numpy, soundfile
```

0. **Setup:** `video/crew/new-film.sh <id> "<Title>"` creates `video/crew/<id>/` with `studio.html`, `config.js` and an empty `scene.js`. Everything you write goes in that folder, plus `video/narration/<id>.json` and `video/storyboards/<id>.md`.
1. **Script:** `video/narration/<id>.json` with `chapter` (the number shown, e.g. "09"), `title`, `next` (the next chapter's title, or "" for the last film), `engine: "atlas"`, `voice` (given in your task), `timing_js: "crew/<id>/timing.js"`, `lead_in: 4.5`, `tail: 5.0`, and 7–9 `beats` (`id`, `gap` 0.8, `text`), **380–460 words** (≈ 2:20–2:50).
   - Beat 1 is a hook: the chapter's most vivid scene or claim. Middle beats: the chapter's core ideas with its best concrete example. Last beat: the takeaway, then "Next up: …" (skip that if `next` is "").
   - **Tone:** a warm, plain-spoken narrator. No first-person author anecdotes ("I did…"): the narrator is an AI voice. Tell the book's stories neutrally ("Picture…", "Meet Morten…"). Make no claims the chapter doesn't make; invent no statistics.
   - **Pronunciation:** write numbers and symbols as spoken ("twenty", "two a.m."); spell out acronyms as they sound ("A P I", "agents dot M D"). Avoid the author's surname.
2. **Voice:** `$PY -u video/tools/voice.py <id> 2>&1 | grep -v -i -E "warn|Fetching"`. Every beat must print `match ≥ 0.93`; if not, rephrase that beat and re-run with `--redo <beatid>`. Then print the words Whisper heard (`video/build/<id>/timing.json` → beats → words) and **pick cue words by Whisper's spelling**.
3. **Storyboard:** `video/storyboards/<id>.md` — first "The idea" (one paragraph: the film's one visual idea and its recurring set), then one table row per shot: time/beat, the cue word, what *happens*, the camera move, and how it transitions out. Show it the P(doom) storyboard's level of invention.
4. **Scene:** `video/crew/<id>/scene.js`, an IIFE. Shots are registered with `shots([[0, identShot], [shotAt('hook', 0), …], …, [B.<last>.end + .9, endShot]])`. `identShot` calls `crewIdent(t, lt, dur, '<num>', '<title>')`, `endShot` calls `crewEnd(t, lt, dur, '<next num>', TIMING.next)`. Pure functions of `t`; `hash()` for randomness; `boilSeed()` per object as the guide explains.
5. **Review loop (required, at least two passes):** from your film folder,
   `node ../engine/render.mjs --sheet=<14–16 times across every shot> --cols=4 --w=480 --out=out/check/a.jpg` and **look at it with the Read tool**. Use `--strip=a:b` to check motion around key hits and `--crop` for faces. Fix: empty or static frames, clutter, illegible staging, characters off-model, events landing at the wrong word, transitions that don't carry. The console must show no JS errors.
6. **Mix:** `video/tools/mix.sh <id> assets/bgm-hazelwood.mp3`.
7. **Render:** from your film folder:
   `rm -rf out/frames && node ../engine/render.mjs --frames --workers=3` — wait until it finishes (frame count = round(duration × 24)), then
   `node ../engine/render.mjs --encode --audio=../../build/<id>/mix.m4a --out=out/tmp.mp4 && mv out/tmp.mp4 ../../build/<id>/<id>-<slug>.mp4 && rm -rf out/frames`
   (slug = the title in kebab-case). Never encode while frames are still rendering.
8. **Poster:** pick the single most striking frame: `node ../engine/render.mjs --stills=<t> --out=out/poster` then `ffmpeg -v error -y -i out/poster/<file>.png -vf scale=1280:720:flags=lanczos -q:v 3 ../../build/youtube/thumb-<id>-1280x720.jpg` (create the folder if needed). Look at it.

## Hard rules
- Only create or edit files for **your own film**: `video/crew/<id>/`, `video/narration/<id>.json`, `video/storyboards/<id>.md`, `video/build/<id>/`, the poster. Do NOT edit `video/crew/engine/`, `video/crew/common.js`, `video/crew/agent.js`, `video/tools/`, `video/riso/`, the website, or book chapters. If you need a helper, write it inside your scene's IIFE. If you find a real bug in a shared file, report it.
- Up to three films render at once on this laptop: always render from your own folder (it has its own `out/`).
- Keep the key private. Never print `ATLASCLOUD_API_KEY`.

## Report back
A JSON object: `{"id","chapter","title","file","duration","description" (2–3 sentences),"poster","cues_ok":true}` plus one line on anything you're unsure of. Keep it short.
