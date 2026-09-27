# Brief: making a chapter intro film

You're making 2–3 minute explainer films for *The Agentic Crew*, a free book about engineering with AI agents (Typst sources in `chapters/`). Each film introduces one chapter for the book's YouTube channel and website. Chapters 01 and 02 are done. Study them before you start: they are the reference for quality, pacing and code style.

Paths below are relative to the repo root `/Users/schlunsen/projects/the-agentic-crew`.

## Read first
1. `video/riso/ANIMATION_GUIDE.md` if it exists; otherwise `/Users/schlunsen/.claude/projects/schlunsen/riso-motion/ANIMATION_GUIDE.md` (the medium's rules: riso inks, overprints, halftone, on-twos motion, no flicker, transitions).
2. `video/narration/ch02.json` and `video/riso/src/scenes/ch02.js`: the reference script and scene. **Copy its structure.**
3. `video/riso/src/scenes/common.js` (INK colours, `wt()`, `shotAt()`, `stamp()`, `tIn`/`tOut` seams, `helm`, `card`, `stampX`, `ident`, `endCard`) and `video/riso/src/skipper.js` (the Skipper: `skipper()`, `SKIP_POSES`, `skipAct()`). The Clawd API is documented at the top of `video/riso/src/clawd.js` (`clawd()`, `feel()`, `emotions()`, `move()`, emotes).
4. The chapter's `.typ` file, **in full**.

## Hard rules
- **Only create files for your own chapters.** Do NOT edit `common.js`, `skipper.js`, `core.js`, `riso.js`, `clawd.js`, `timeline.js`, `render.mjs`, `brand.js`, `brand.html`, `ch01*`/`ch02*`, `video/tools/*`, the README, or any website/chapter file. If you need a helper, define it inside your own chapter file.
- **Tone:** explain the chapter's ideas plainly and honestly, as a narrator. No first-person anecdotes ("I did…", "when I…"): the narrator is an AI voice, so the author's experiences must not come out of its mouth. The book's examples can be told neutrally ("Picture a team whose…", "In one well-known incident…"). Make no claims the chapter doesn't make, and invent no statistics. If the chapter marks something `// v2-verify`, leave it out. No hype.
- **Pronunciation:** write numbers and symbols the way they're spoken ("twenty", "two a.m."), and spell out file names and acronyms as they should sound ("agents dot M D", "M C P", "C I"). Avoid the author's surname.

## Pipeline (per chapter XX, e.g. `ch07`)
Environment (bash):
```bash
S=/private/tmp/claude-501/-Users-schlunsen-projects-the-agentic-crew/ae504ced-d229-4310-8954-98d4b7f2200b/scratchpad
. $S/atlas.env                        # ATLASCLOUD_API_KEY (never print or copy it)
PY=$S/tts-env/bin/python               # has mlx-audio, mlx-whisper, requests, numpy, soundfile
```

1. **Script:** `video/narration/chXX.json`, the same shape as ch02.json: `chapter` ("07", or "A"/"B" for appendices), `title` (the chapter title as on the website), `next` (the next film's title), `engine: "atlas"`, `voice: "English_magnetic_voiced_man"`, `lead_in: 4.5`, `tail: 5.0`, and 7–9 `beats` (`id`, `gap` 0.8, `text`), 380–460 words in total (about 2:10–2:45). The first beat is a strong hook: the chapter's most vivid problem or claim, told neutrally. The middle beats cover the chapter's core ideas, with its best concrete example. The last beat lands the takeaway, then teases the next chapter ("Next up: …").
2. **Voice:** `cd <repo> && $PY -u video/tools/voice.py chXX --require agentic 2>&1 | grep -v -i -E "warn|Fetching"`. This writes `video/build/chXX/{beats,voice.wav,timing.json}` and `video/riso/src/scenes/chXX.timing.js`. Every beat must print `match ≥ 0.93`; if one doesn't, rephrase that beat and re-run with `--redo <beatid>`. Then print the words Whisper heard (`timing.json` → beats → words) and **choose cue words by the spelling Whisper produced** (digits like "20", "80"; "git" is sometimes heard as "get" or "kit").
3. **Storyboard:** `video/storyboards/chXX.md`, one table row per shot, as in `storyboards/ch02.md`. Every shot needs an EVENT keyed to a spoken word, a transition at every seam, and at least one deliberate overprint. Use the Skipper (the engineer) and Clawd (the agent) as actors where they help.
4. **Scene:** `video/riso/src/scenes/chXX.js` (IIFE, like ch02.js) and the page `video/riso/chXX.html` (`sed -e 's/ch02/chXX/g' -e 's/Ch 02 · What Is an Agent?/Ch XX · <title>/' video/riso/ch02.html > video/riso/chXX.html`).
   - The shot list is `[0, shotIdent]`, `[shotAt('<firstbeat>', 0), firstShotWithTIn]`, `[shotAt('<beat>'), shot…]` …, `[B.<last>.end + .9, shotEnd]`. `shotEnd` calls `endCard(T0, lt, dur, '<next number>', TIMING.next)`, with `tIn('feed', lt)` and the closing `dotDissolve` as in ch02. The last content shot ends with `tOut('feed', lt, dur)`.
   - Seams: each shot's `tOut(kind, …)` must match the next shot's `tIn(kind, …)` with the same options. Vary the kinds (`ink`, `dots`, `iris`) and don't use the same kind twice in a row.
   - Key every event to `wt('<beat>', '<word>')`. Never hard-code times.
   - Type only when it earns it: a big number, a key word, `{ }`. Keep layouts clear, with nothing overlapping the characters' faces.
5. **Check (required):** render contact sheets and LOOK at them with the Read tool:
   `cd video/riso && node render.mjs --page=chXX.html --sheet=<14–16 times spread across every shot> --cols=4 --w=480 --out=out/check/chXX-a.jpg`.
   Scan for JS errors: `node render.mjs --page=chXX.html --sheet=<one time per shot> --cols=4 --w=200 --out=out/check/chXX-err.jpg 2>&1 | grep -i error` must print nothing. Fix overlaps, empty frames, illegible type and events that land at the wrong time. Do at least two review passes.
6. **Mix:** `cd <repo> && video/tools/mix.sh chXX assets/bgm-hazelwood.mp3` (voice mastered to -16 LUFS, music bed ducked).
7. **Render:** `cd video/riso && rm -rf out/frames-chXX && node render.mjs --page=chXX.html --frames --workers=3 --frames-dir=out/frames-chXX`, then
   `ffmpeg -y -loglevel error -framerate 24 -i out/frames-chXX/f%05d.jpg -i ../build/chXX/mix.m4a -map 0:v -map 1:a -c:a aac -b:a 192k -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -movflags +faststart ../build/chXX/chXX-<slug>.mp4 && rm -rf out/frames-chXX`
   (slug = the title in kebab-case). Always use your own `--frames-dir`: other agents render at the same time.
8. **Thumbnail:** fill in `video/riso/src/scenes/thumbs/thXX.js`, modelled on `LOOPS.thumb02` in `brand.js`: `LOOPS.thumbXX = t => { thumbBase(<seed>, 'XX · SHORT'); …big 2–3-line hook text on the paper panel (x≈1370)…; a character or prop on the left }; LOOPS.thumbXX.len = 2;`. Keep the text inside the panel (x 870–1870, y 250–850). Render it: `node render.mjs --page=brand.html --loop=thumbXX --stills=1 --out=out/brand-XX && ffmpeg -v error -y -i out/brand-XX/t1_00.png -vf scale=1280:720:flags=lanczos -q:v 3 ../build/youtube/thumb-chXX-1280x720.jpg`. Look at it.

## What to report back (per chapter)
A JSON object: `{"chapter","title","file","duration","youtube_title","description" (2–3 sentences, no timestamps),"tags":[…],"cues_ok":true}` plus one line on anything you're unsure of. Keep the report short.
