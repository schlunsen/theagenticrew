#!/usr/bin/env bash
# new-film.sh <id> "<Title>": set up a watercolour crew film in video/crew/<id>/.
#   studio.html  the engine's studio, loading ../engine, timing.js, config.js, ../common.js, ../agent.js and scene.js (scrub bar, ?t=, ?loop=)
#   config.js    PROJECT (duration from TIMING, bpm 100)
#   timing.js    a placeholder TIMING (2 beats, 20 s) until video/tools/voice.py writes the real one
#   scene.js     a working skeleton: ident → one placeholder shot → end card
#   .gitignore   out/
#   the agent is Folio, from ../agent.js (agent(x, y, u, o), which also replaces the engine's clawd())
# Then, from the film folder:  node ../engine/render.mjs --sheet=1,3,6,12,17 --cols=5 --w=384 --out=out/check/a.jpg
set -euo pipefail
if [ $# -lt 2 ]; then echo "usage: $0 <id> \"<Title>\"   e.g. $0 crew04 \"Giving Clear Instructions\"" >&2; exit 1; fi
ID="$1"; TITLE="$2"
HERE="$(cd "$(dirname "$0")" && pwd)"; DIR="$HERE/$ID"
if [ -e "$DIR" ]; then echo "$DIR already exists" >&2; exit 1; fi
if [ ! -d "$HERE/engine/node_modules" ]; then echo "note: run 'npm install' in $HERE/engine first" >&2; fi
NUM="$(printf '%s' "$ID" | tr -cd '0-9')"; [ -n "$NUM" ] || NUM="00"
NUM="$(printf '%02d' "$((10#$NUM))")"; NEXT="$(printf '%02d' "$((10#$NUM + 1))")"
JTITLE="$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$TITLE")"
mkdir -p "$DIR"

cat > "$DIR/studio.html" <<'EOF'
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Crew film studio</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Permanent+Marker&display=block">
<style>
  html, body { margin: 0; background: #1b1820; color: #eee; font: 13px system-ui, sans-serif; }
  main { padding: 12px; display: grid; gap: 8px; }
  #out { width: min(100%, 1280px); aspect-ratio: 16 / 9; height: auto; background: #F3EBDC; }
  .p5Canvas { display: none !important; }
  .bar { display: flex; gap: 10px; align-items: center; max-width: 1280px; }
  #scrub { flex: 1; }
  #tt { font-variant-numeric: tabular-nums; min-width: 190px; }
</style>
<script src="../engine/node_modules/p5/lib/p5.min.js"></script>
<script src="../engine/node_modules/p5.brush/dist/p5.brush.js"></script>
</head>
<body>
<main>
  <canvas id="out" width="1920" height="1080"></canvas>
  <div class="bar"><input id="scrub" type="range" min="0" max="20" step="0.0417" value="0"><span id="tt">loading…</span></div>
</main>
<!-- the narration's timing (TIMING), then PROJECT, which needs it and must exist before core.js -->
<script src="timing.js"></script>
<script src="config.js"></script>
<!-- engine -->
<script src="../engine/src/core.js"></script>
<script src="../engine/src/clawd.js"></script>
<script src="../engine/src/timeline.js"></script>
<script src="../engine/src/sheets.js"></script>
<!-- the series: palette, timing helpers, seams, compass, ident, end card, the Navigator -->
<script src="../common.js"></script>
<!-- the series' agent (Folio): replaces the engine's clawd() -->
<script src="../agent.js"></script>
<!-- this film -->
<script src="scene.js"></script>
<script>
  // studio.html?t=12.5 jumps to a time; ?loop=navigator (or crewcards, emotions, views) shows a standalone loop.
  const q = new URLSearchParams(location.search).get('loop'); if (q && LOOPS[q]) window.LOOP = LOOPS[q];
</script>
</body>
</html>
EOF

cat > "$DIR/config.js" <<'EOF'
// config.js: the film's length comes from the narration (TIMING, from timing.js). bpm drives idles, bounces and pulse().
const PROJECT = { duration: TIMING.duration, bpm: 100, offset: 0 };
EOF

cat > "$DIR/timing.js" <<EOF
// PLACEHOLDER until video/tools/voice.py writes the real narration timing here (same shape).
const TIMING = {"chapter": "$NUM", "title": $JTITLE, "next": "The Next Chapter", "beats": {
 "hook": {"start": 4.5, "end": 8.6, "words": [{"w": "Picture", "s": 4.5, "e": 5.0}, {"w": "a", "s": 5.0, "e": 5.1}, {"w": "crew", "s": 5.1, "e": 5.5}, {"w": "at", "s": 5.6, "e": 5.8}, {"w": "sea.", "s": 5.8, "e": 6.3}, {"w": "The", "s": 6.9, "e": 7.1}, {"w": "chart", "s": 7.1, "e": 7.6}, {"w": "matters.", "s": 7.6, "e": 8.6}]},
 "close": {"start": 9.4, "end": 14.1, "words": [{"w": "Next", "s": 9.4, "e": 9.8}, {"w": "up:", "s": 9.8, "e": 10.2}, {"w": "the", "s": 10.4, "e": 10.6}, {"w": "next", "s": 10.6, "e": 11.0}, {"w": "chapter.", "s": 11.0, "e": 14.1}]}
}, "duration": 20.0};
EOF

cat > "$DIR/scene.js" <<EOF
// scene.js: $ID, $TITLE. A skeleton from new-film.sh: replace the placeholder shot with the storyboard's shots.
// Read ../BRIEF.md and the header of ../common.js. Every time comes from the narration: wt('beat', 'word').
(() => {
  const NUM = '$NUM', NEXT = '$NEXT', TITLE = $JTITLE;
  const ids = Object.keys(B), FIRST = ids[0], LAST = ids[ids.length - 1];

  function identShot(t, lt, dur) { crewIdent(t, lt, dur, NUM, TITLE); }

  // A placeholder set: the Navigator and Folio (the agent) on a painted deck at sea. Replace it.
  function deck(t, lt, dur) {
    camBegin(960 + 40 * Math.sin(lt * .35), 540, 1.02 + .015 * lt);   // the camera always moves
    boilSeed('sky'); paint(rectPts(-300, -300, W + 600, 900), { wash: CREW.pale, fill: CREW.sea, fillOp: 60, bleed: .2, tex: .5, ink: null });
    boilSeed('sea'); paint(rectPts(-300, 560, W + 600, 400, 6), { wash: CREW.sea, fill: CREW.teal, fillOp: 90, bleed: .1, tex: .7, ink: null });
    boilSeed('deck'); paint(rectPts(-300, 820, W + 600, 500, 3), { wash: mixCol(CREW.ochre, CREW.cream, .35), fill: CREW.ochreDk, fillOp: 60, bleed: .05, tex: .7, ink: PAL.ink, sw: 1 });
    const cue = wt(FIRST, 'chart', 0, .6);   // an event keyed to a spoken word
    nav(720, 880, 20, { ...navMood(t, [[0, 'neutral'], [cue, 'idea']]), view: 'q' });
    agent(1220, 880, 26, { ...emotions(t, [[0, 'neutral', { lookX: -.6 }], [cue + .4, 'excited']]), flip: true });
    camEnd();
    seamIn('wipe', lt);          // from the ident
    seamOut('wipe', lt, dur);    // into the end card
  }

  function endShot(t, lt, dur) { crewEnd(t, lt, dur, NEXT, TIMING.next); }

  shots([[0, identShot], [shotAt(FIRST, 0), deck], [B[LAST].end + .9, endShot]]);
})();
EOF

printf 'out/\n' > "$DIR/.gitignore"
echo "created $DIR"
echo "  open:   $DIR/studio.html   (or ?loop=navigator / ?loop=crewcards)"
echo "  check:  cd $DIR && node ../engine/render.mjs --sheet=1,3,6,12,17 --cols=5 --w=384 --out=out/check/a.jpg"
