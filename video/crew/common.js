// common.js: the shared pieces of the watercolour crew films (The Crew Member's Guide, reusable by the Hands-On Guide).
// Loaded after the engine (core.js, clawd.js, timeline.js, sheets.js) and the film's timing.js, before ../agent.js and the
// film's scene.js. The series' agent is Folio (a paper boat), in agent.js: agent(x, y, u, o), which also replaces the
// engine's clawd(), so every mention of Clawd below means the agent (model sheet: docs/agent.jpg).
// Read video/crew/BRIEF.md and video/crew/engine/ANIMATION_GUIDE.md first. Model sheets: video/crew/docs/navigator.jpg
// and docs/cards.jpg (scrub them live at studio.html?loop=navigator and ?loop=crewcards).
//
// ── Palette ───────────────────────────────────────────────────────────────────────────────────────────────────────────
//   CREW.night / deep / teal / sea / pale      darkest sea → deep sea-teal → sea-teal → the cover's sea → pale shallows
//   CREW.ochre / ochreLt / ochreDk             the compass gold (cover #d5954a / #efbf7c) and its shadow side
//   CREW.cream / paper / rose / sap / ink      warm lights, paper (= PAL.paper), accents, and the ink line (= PAL.ink)
//   HANDSON: the same keys in the Hands-On Guide's black / red / cream, for crewIdent/crewEnd's o.palette.
//
// ── Narration timing (TIMING comes from the film's timing.js, written by video/tools/voice.py) ───────────────────────
//   B                              TIMING.beats: B.hook.start, B.hook.end, B.hook.words = [{ w, s, e }, ...]
//   wt(beatId, word, n = 0, fb=.5)  time the nth word starting with `word` starts (n = -1: the last). Matching ignores case
//                                  and punctuation. Not heard: warns in the console and falls back to fb of the beat.
//   wtEnd(beatId, word, n = 0)     the time that word ENDS (same matching)
//   shotAt(beatId, gap = .8)       a shot's start: half-way through the silence before the beat, so a seam covers the cut
//
// ── Seams: motivated transitions between shots ─────────────────────────────────────────────────────────────────────
//   seamOut(kind, lt, dur, o)      call LAST in the outgoing shot (screen space, after camEnd): covers the frame in its
//                                  final o.half seconds (default .45)
//   seamIn(kind, lt, o)            call LAST in the incoming shot: uncovers it in its first o.half seconds
//   kinds: 'wipe'    the brush wipe (ident → first shot, last shot → end card only). o.cols = [c1, c2]
//          'iris'    an ink iris closes on (o.cx, o.cy) and reopens on the next shot's (o.cx, o.cy). o.col
//          'splash'  paint splashes across the lens, then runs off and drains away. o.cx, o.cy = where it hits,
//                    o.cols = [3 colours], o.seed
//          'page'    a sheet of chart paper slides over from the right with a curled edge, then peels off to the left.
//                    o.col = the paper, o.dir = -1 to go the other way
//   Use the same kind (and matching o) on both sides of a cut. Aim the iris with toScreen() while the camera is active.
//
// ── Motif and cards ─────────────────────────────────────────────────────────────────────────────────────────────────
//   compassRose(cx, cy, r, o)      the painted compass rose. o.assemble 0..1 (the pieces paint in), o.rot (radians,
//                                  0 = north up), o.glow 0..1 (light at its heart; shows on dark grounds), o.pal, o.key
//   crewIdent(t, lt, dur, num, title, o)    the opening card, ~4.5 s: sea chart, compass assembling, series line, big
//                                  chapter number, title (wraps to 2 lines), brush wipe out. o.series ("THE HANDS-ON
//                                  GUIDE"), o.palette (e.g. HANDSON). Call it as the whole first shot.
//   crewEnd(t, lt, dur, nextNum, nextTitle, o)   the end card, ~5 s: brush wipe in, "NEXT" + number + title (or, when
//                                  nextTitle is '', o.closing || 'theagenticcrew.com'), the compass turning, the Navigator
//                                  waving, Clawd hopping, an iris out at the very end. o.series, o.palette as above.
//   seaChart(t, hx, hy, o)         the chart ground the cards use (a set for films too): washes, blooms, rhumb lines from
//                                  (hx, hy). o.dark (true = deep sea, false = cream), o.k 0..1 lines draw in, o.pal
//   chartBorder(pal, dark)         the chart's graduated neatline round the frame; call in screen space (after camEnd)
//   blobPts(cx, cy, r, seed, bump) a soft irregular blob outline (splashes, puddles, islands)
//   crewText(items)                painted lettering in Fraunces (the website's serif), composited now so later paint
//                                  covers it: items = [{ txt, x, y, size, col, weight, italic, spacing (em), align,
//                                  k (0..1 write-on), alpha }]. The films may use at most three words (see BRIEF.md).
//
// ── The Navigator ───────────────────────────────────────────────────────────────────────────────────────────────────
//   nav(x, y, s, o)                the human crew member (named nav, not navigator: window.navigator is the browser's)
//                                   (see docs/navigator.jpg). (x, y) = the ground point between the
//                                  feet; s = her unit. She is ~13.8s tall (head centre 11.1s up); at s = .75u next to a
//                                  clawd(u) her eyes are level with Clawd's top edge, ~2u above his eyes. Medium shot: s 16–22; close-up 35+.
//     pose:  dx, dy (in s; -dy = up), sq (squash; negative stretches), rot, flip, sx, noShadow, boilKey
//            aL, aR  arm angles, Clawd's convention: 0 = straight out, + = up, -1.25 = hanging, ±1.5 = vertical.
//                    aL is the screen-left arm of the front view; in 'q' and 'side' (facing right) aL is the NEAR arm,
//                    drawn in front of her, and aR the far one; in 'side' 0 points forward.
//            walk / run  a phase (e.g. t * 1.6): legs step, arms swing unless you set aL/aR, body bobs (run leans)
//            sit     seated on something 1.9s high (draw its top at y - 1.9s); (x, y) stays the floor point
//            point   'L' | 'R': that hand points (index finger out along the arm); aim it with aL / aR
//     view:  view 'front' | 'q' | 'side' | 'qback' | 'back' (all face right; flip to face left), or back: true.
//            Works with the engine's turn(t, t0, t1, a0, a1) and spinView(a).
//     face:  eyes 'dot' | 'wide' | 'closed' | 'happy' | 'look' | 'narrow' | 'x', lookX / lookY (-1..1), squint 0..1,
//            brows 'soft' (default) | 'worried' | 'up' | 'stern' | 'raised' | 'none', mouth 'smile' | 'o' | 'flat' |
//            'grin' | 'wobble' | 'frown' | 'open', blush 0..1, seed (blink timing)
//     extras: emote + emoteK + emoteAge (the engine's painted emotes), wind 0..1 (hair and scarf blow back),
//            handL(s, sw, up) / handR(s, sw, up) hooks at the hand in arm space (x runs outward; rotate(up) turns the
//            space upright, so a mug stays level), draw(s, sw) in body space (feet at 0, head centre (0, -11.1s) standing)
//   navFeel(name, t, over)         one mood, alive (face + idle body), like the engine's feel(). Names: neutral, happy,
//                                  laugh, proud, worried, surprised, thinking, confused, stern, determined, sad, relieved,
//                                  idea, sleepy
//   navMood(t, keys, o)            acted mood changes, like emotions(): keys = [[t0, 'neutral'], [t1, 'surprised', {…}]]
//   navProp(kind, s, sw, o)        props for her hands: 'spyglass' (o.ext 0..1 drawn out), 'chart' (o.open 0..1: rolled
//                                  → unrolled), 'tablet' (o.glow), 'mug' (o.steam). Use in a hook:
//                                    nav(x, y, s, { aR: .3, handR: (s, sw, up) => navProp('mug', s, sw, { up }) })
//                                  o.up = the hook's third argument keeps it level; omit it to follow the arm.
//
// Everything here is a pure function of t (frames render in parallel), paints with paint()/inkLine() and seeds its own
// boil with boilSeed(). Nothing in here writes lettering except crewText, crewIdent and crewEnd.

// ---------------------------------------------------------------------------------------------------------------------
const CREW = {
  night: '#0A2224', deep: '#123638', teal: '#2F7F79', sea: '#74C3B5', pale: '#CDE7DE',
  ochre: '#D5954A', ochreLt: '#EFBF7C', ochreDk: '#9A6433',
  cream: '#F6EEDD', paper: PAL.paper, rose: '#DA8577', sap: '#86A866', ink: PAL.ink,
};
const HANDSON = {
  night: '#141111', deep: '#221E1C', teal: '#4A3F3A', sea: '#E8DFC8', pale: '#F5F0E8',
  ochre: '#D42B2B', ochreLt: '#EC6B5A', ochreDk: '#8E1C1C',
  cream: '#F5F0E8', paper: PAL.paper, rose: '#DA8577', sap: '#86A866', ink: PAL.ink,
};

// ---------- fonts: the page only counts as ready once Fraunces has loaded too ----------
(() => {
  let ready = false, fonts = false;
  const want = ['400 100px Fraunces', 'italic 400 100px Fraunces', '600 100px Fraunces', 'italic 300 100px Fraunces'];
  Promise.all(want.map(f => document.fonts.load(f))).catch(() => {}).then(() => { fonts = true; });
  Object.defineProperty(window, 'ready', { configurable: true, get: () => ready && fonts, set: v => { ready = v; } });
})();

// ---------- narration timing ----------
const B = TIMING.beats;
const _nw = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
function _beat(id) { const b = B[id]; if (!b) throw new Error(`no beat "${id}" in TIMING (beats: ${Object.keys(B).join(', ')})`); return b; }
function _word(id, word, n) {
  const b = _beat(id), k = _nw(word), hits = b.words.filter(w => _nw(w.w).startsWith(k));
  return hits[n < 0 ? hits.length + n : n];
}
function wt(id, word, n = 0, fb = .5) {
  const h = _word(id, word, n); if (h) return h.s;
  const b = _beat(id); console.warn(`wt: "${word}" (#${n}) not heard in ${id}`); return lerp(b.start, b.end, fb);
}
function wtEnd(id, word, n = 0) {
  const h = _word(id, word, n); if (h) return h.e;
  const b = _beat(id); console.warn(`wtEnd: "${word}" (#${n}) not heard in ${id}`); return lerp(b.start, b.end, .5);
}
const shotAt = (id, gap = .8) => _beat(id).start - Math.min(.45, gap / 2 + .05);

// ---------- lettering ----------
let _TXC = null;
function _font(size, o) { return `${o.italic ? 'italic ' : ''}${o.weight || 400} ${size}px "Fraunces", Georgia, serif`; }
function crewText(items) {
  flushLetters();
  if (!_TXC) { _TXC = document.createElement('canvas'); _TXC.width = W; _TXC.height = H; }
  const c = letG.drawingContext, x2 = _TXC.getContext('2d');
  letG.clear();
  for (const it of items) {
    const k = clamp(it.k ?? 1); if (k <= 0 || !it.txt) continue;
    const size = it.size, lift = (1 - easeOut(k)) * size * .12;
    x2.setTransform(1, 0, 0, 1, 0, 0); x2.clearRect(0, 0, W, H);
    x2.font = _font(size, it); x2.letterSpacing = ((it.spacing || 0) * size) + 'px';
    x2.textAlign = 'left'; x2.textBaseline = 'middle';
    const w = x2.measureText(it.txt).width - (it.spacing || 0) * size, al = it.align || 'center';
    const x0 = al === 'left' ? it.x : al === 'right' ? it.x - w : it.x - w / 2, y = it.y + lift;
    // pigment: a darker edge where the wash pools, then the flat colour, then a faint second pass offset a hair
    x2.lineJoin = 'round'; x2.strokeStyle = mixCol(it.col, it.edge || PAL.ink, .45); x2.lineWidth = Math.max(1, size * .025);
    x2.globalAlpha = .55; x2.strokeText(it.txt, x0, y);
    x2.globalAlpha = 1; x2.fillStyle = it.col; x2.fillText(it.txt, x0, y);
    x2.globalAlpha = .18; x2.fillStyle = mixCol(it.col, '#FFFFFF', .5); x2.fillText(it.txt, x0 - size * .012, y - size * .015);
    x2.globalAlpha = 1;
    if (k < 1) {   // write on from the left with a soft wet edge
      const f = Math.max(40, size * .8), e = lerp(x0 - f, x0 + w + f, k), g = x2.createLinearGradient(e - f, 0, e, 0);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x2.globalCompositeOperation = 'destination-in'; x2.fillStyle = g; x2.fillRect(0, 0, W, H); x2.globalCompositeOperation = 'source-over';
    }
    c.globalAlpha = clamp(it.alpha ?? 1); c.drawImage(_TXC, 0, 0); c.globalAlpha = 1;
  }
  flushBrush();
  push(); resetMatrix(); translate(-W / 2, -H / 2); image(letG, 0, 0); pop();
}
// Fit a title into at most `lines` lines no wider than maxW, starting at `size`: returns { lines: [...], size }.
function fitTitle(txt, size, maxW, lines = 2, o = {}) {
  if (!_TXC) { _TXC = document.createElement('canvas'); _TXC.width = W; _TXC.height = H; }
  const c = _TXC.getContext('2d'), words = txt.split(/\s+/).filter(Boolean);
  for (let s = size; s > 12; s *= .93) {
    c.font = _font(s, o); c.letterSpacing = ((o.spacing || 0) * s) + 'px';
    const wd = str => c.measureText(str).width;
    if (wd(txt) <= maxW) return { lines: [txt], size: s };
    if (lines >= 2 && words.length > 1) {
      let best = null;
      for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' '), b = words.slice(i).join(' '), m = Math.max(wd(a), wd(b));
        if (!best || m < best.m) best = { m, L: [a, b] };
      }
      if (best.m <= maxW) return { lines: best.L, size: s };
    }
  }
  return { lines: [txt], size: 12 };
}

// ---------- small painting helpers ----------
const _P = (s, pts) => pts.map(([a, b]) => [a * s, b * s]);
function _arcPts(cx, cy, r, a0, a1, n = 48) { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }
// A soft, irregular watercolour blob (bumpy circle), stable per seed.
function blobPts(cx, cy, r, seed = 0, bump = .12, n = 30) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, q = 1 + bump * (Math.sin(a * 3 + seed * 5.1) * .6 + Math.sin(a * 7 + seed * 2.3) * .4) + jit(bump * .15); p.push([cx + Math.cos(a) * r * q, cy + Math.sin(a) * r * q]); } return p;
}

// ---------- the compass rose ----------
function compassRose(cx, cy, r, o = {}) {
  const A = clamp(o.assemble ?? 1), pal = { ...CREW, ...(o.pal || {}) }, key = o.key || 'rose';
  const sw = clamp(r / 160, .35, 2.2) * (o.swMul || 1), g = clamp(o.glow || 0);
  if (A <= 0) return;
  if (g > 0) { boilSeed(key + 'glow'); glow(cx, cy, r * (1.1 + .5 * g), pal.ochreLt, .55 * g); }
  push(); translate(cx, cy); rotate(o.rot || 0);
  // rings: the outer ring paints round from north, then the inner ring
  const ring = (rad, k, w, col, nm) => { if (k <= 0) return; boilSeed(key + nm); inkLine(_arcPts(0, 0, rad, -Math.PI / 2, -Math.PI / 2 + TAU * k, 64), w, col, 'ink', .5); };
  ring(r, ease(seg(A, 0, .35)), sw * 1.5, pal.ochre, 'r1');
  ring(r * .9, ease(seg(A, .08, .4)), sw * .6, pal.ochre, 'r2');
  ring(r * .6, ease(seg(A, .16, .45)), sw * .8, mixCol(pal.ochre, pal.sea, .3), 'r3');
  // ticks between the two outer rings, every eighth a long one
  const tk = seg(A, .15, .55);
  boilSeed(key + 'ticks');
  for (let i = 0; i < 64; i++) {
    if (i / 64 >= tk) break;
    const a = -Math.PI / 2 + i / 64 * TAU, r0 = i % 8 === 0 ? r * .84 : i % 2 ? r * .94 : r * .91;
    inkLine([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r * .995, Math.sin(a) * r * .995]], sw * (i % 8 ? .45 : .8), pal.ochre, 'inkfine', 0);
  }
  // a point: two halves, lit and shaded, growing out from the heart
  const point = (a, len, wd, lit, dark, k, nm) => {
    if (k <= 0.01) return;
    const L = len * backOut(k), c = Math.cos(a), s = Math.sin(a), px = -s, py = c;
    const tip = [c * L, s * L], b1 = [px * wd, py * wd], b2 = [-px * wd, -py * wd], hub = [0, 0];
    boilSeed(key + nm);
    paint([hub, b1, tip], { wash: lit, fill: mixCol(lit, '#FFFFFF', .3), fillOp: 60, bleed: .05, tex: .5, ink: null });
    paint([hub, tip, b2], { wash: dark, fill: mixCol(dark, PAL.ink, .2), fillOp: 50, bleed: .05, tex: .5, ink: null });
    paint([b1, tip, b2, hub], { ink: PAL.ink, sw: sw * .7 });
  };
  for (let i = 0; i < 8; i++) {   // small pale points on the sixteenths
    const a = -Math.PI / 2 + Math.PI / 8 + i * Math.PI / 4;
    point(a, r * .5, r * .045, pal.pale, pal.sea, seg(A, .4 + i * .02, .6 + i * .02), 'p16' + i);
  }
  for (let i = 0; i < 4; i++) {   // sea-teal diagonals
    const a = -Math.PI / 4 + i * Math.PI / 2;
    point(a, r * .7, r * .075, pal.sea, pal.teal, seg(A, .5 + i * .04, .72 + i * .04), 'p8' + i);
  }
  for (let i = 0; i < 4; i++) {   // the four ochre cardinal points, north first
    const a = -Math.PI / 2 + i * Math.PI / 2;
    point(a, r * (i === 0 ? 1.04 : .98), r * .11, pal.ochreLt, pal.ochreDk, seg(A, .62 + i * .05, .88 + i * .05), 'p4' + i);
  }
  // a small north mark outside the ring (a painted diamond, not a letter)
  const nk = backOut(seg(A, .85, 1));
  if (nk > .02) { boilSeed(key + 'north'); paint(_P(r, [[0, -1.19], [.045, -1.12], [0, -1.07], [-.045, -1.12]]).map(([x, y]) => [x * nk, -r * 1.12 + (y + r * 1.12) * nk]), { wash: pal.ochreLt, ink: PAL.ink, sw: sw * .5 }); }
  // the cream hub
  const hk = backOut(seg(A, .8, 1));
  if (hk > .02) { boilSeed(key + 'hub'); paint(ellPts(0, 0, r * .07 * hk, r * .07 * hk, 16), { wash: pal.cream, ink: PAL.ink, sw: sw * .6 }); }
  pop();
}

// ---------- seams ----------
function seamOut(kind, lt, dur, o = {}) { const h = o.half ?? .45; if (lt > dur - h) _seam(kind, .5 * (lt - (dur - h)) / h, o); }
function seamIn(kind, lt, o = {}) { const h = o.half ?? .45; if (lt < h) _seam(kind, .5 + .5 * lt / h, o); }
function _seam(kind, p, o) {
  if (p <= 0 || p >= 1) return;
  flushLetters();
  boilSeed('seam ' + kind);
  if (kind === 'wipe') brushWipe(p, o.cols || [CREW.ochre, CREW.sea]);
  else if (kind === 'iris') _inkIris(p, o);
  else if (kind === 'splash') _splash(p, o);
  else if (kind === 'page') _page(p, o);
  else console.warn('seam: unknown kind ' + kind);
}
// ink iris: closes onto (cx, cy) by p = .44, stays shut through the cut, reopens from the next shot's (cx, cy)
function _inkIris(p, o) {
  const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, col = o.col || CREW.night, far = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 80;
  const r = p < .5 ? far * (1 - easeIn(seg(p, 0, .44))) : far * easeOut(seg(p, .56, 1)) ** 1.2;
  if (r < 6) { paint(rectPts(-80, -80, W + 160, H + 160), { wash: col, ink: null }); return; }
  const pts = []; for (let i = 0; i < 90; i++) { const a = i / 90 * TAU, q = 1 + .025 * Math.sin(a * 5 + 1.3) + jit(.008); pts.push([cx + Math.cos(a) * r * q, cy + Math.sin(a) * r * q]); }
  irisShape(pts, col);
  inkLine(pts.concat([pts[0]]), clamp(r / 90, 1, 4), mixCol(col, PAL.ink, .4), 'dry', .5);
  inkLine(pts.concat([pts[0]]), 1, PAL.ink, 'ink', .5);
}
// paint splash: blobs burst from (cx, cy) and cover the lens; on the other side they slide down and drain away
function _splash(p, o) {
  const cols = o.cols || [CREW.sea, CREW.ochre, CREW.teal], cx = o.cx ?? W * .55, cy = o.cy ?? H * .45, sd = o.seed || 1;
  const n = 11, out = p < .5, k = out ? seg(p, 0, .48) : seg(p, .5, 1);
  if (out && k > .9) paint(rectPts(-80, -80, W + 160, H + 160), { wash: cols[2], washOp: 255 * seg(k, .9, 1), ink: null });
  for (let i = 0; i < n; i++) {
    const a = hash(i * 7.3 + sd) * TAU, d = i === 0 ? 0 : 380 + 520 * hash(i * 3.1 + sd), tx = cx + Math.cos(a) * d, ty = cy + Math.sin(a) * d * .7;
    const R = (i === 0 ? 700 : 430 + 260 * hash(i * 5.7 + sd)), dl = i === 0 ? 0 : .08 + .3 * hash(i * 9.1 + sd);
    let g, x, y;
    if (out) { const q = seg(k, dl, dl + .55); g = easeOut(q); x = lerp(cx, tx, easeOut(q)); y = lerp(cy, ty, easeOut(q)); }
    else { const q = seg(k, .25 * hash(i * 2.2 + sd), .75 + .25 * hash(i * 2.2 + sd)); g = 1 - easeIn(q) ** .8; x = tx; y = ty + 520 * easeIn(q); }
    if (g < .02) continue;
    const col = cols[i % 3];
    boilSeed('splash' + i);
    paint(blobPts(x, y, R * g, i + sd, .16), { wash: col, fill: mixCol(col, PAL.ink, .2), fillOp: 70, bleed: .12, tex: .7, border: .7, ink: null });
    for (let j = 0; j < 3; j++) {   // droplets flung ahead / drips running down
      const b = a + (j - 1) * .5, dd = R * g * (1.05 + .25 * hash(i * 13 + j));
      const dx = x + Math.cos(b) * dd, dy = y + Math.sin(b) * dd * .8 + (out ? 0 : 160 * k * (1 + j));
      paint(ellPts(dx, dy, (18 + 22 * hash(i + j * 3)) * g, (18 + 22 * hash(i + j * 3)) * g * (out ? 1 : 1.6), 12), { wash: col, ink: null });
    }
  }
}
// page turn: a sheet of chart paper slides over from the right (curled leading edge), then peels off to the left
function _page(p, o) {
  const col = o.col || CREW.cream, dir = o.dir || 1, out = p < .5, k = ease(out ? seg(p, 0, .5) : seg(p, .5, 1));
  const e = lerp(W + 260, -260, k), curl = 150 * (1 - Math.abs(k - .5));
  push(); if (dir < 0) { translate(W, 0); scale(-1, 1); }
  boilSeed('page');
  const x0 = out ? e : -300, x1 = out ? W + 300 : e;   // the covered span
  if (x1 - x0 > 4) {
    // shadow cast on the uncovered picture
    const sx = out ? e : e;
    paint(rectPts(out ? sx - 120 : sx, -60, 120, H + 120), { fill: PAL.ink, fillOp: 70, bleed: .2, tex: .3, border: .1, ink: null });
    paint(rectPts(x0, -60, x1 - x0, H + 120, 4), { wash: col, fill: mixCol(col, CREW.ochre, .25), fillOp: 45, bleed: .1, tex: .8, border: .5, ink: null });
    // faint rhumb lines on the sheet
    for (let i = 0; i < 5; i++) { const y = 130 + i * 200; boilSeed('pageline' + i); inkLine([[Math.max(x0, -100), y + (x0 - W / 2) * .08], [Math.min(x1, W + 100), y + (x1 - W / 2) * .08]], .5, mixCol(col, CREW.sea, .45), 'inkfine', 0); }
    // the curl: a lit roll at the moving edge
    const cx = out ? e : e, w = curl * (out ? 1 : -1);
    boilSeed('pagecurl');
    paint([[cx, -60], [cx - w * .9, -60], [cx - w, H * .5], [cx - w * .7, H + 60], [cx, H + 60]], { wash: mixCol(col, '#FFFFFF', .35), fill: mixCol(col, PAL.ink, .15), fillOp: 60, bleed: .1, tex: .5, ink: PAL.ink, sw: 1, curv: .3 });
    inkLine([[cx - w * .45, -40], [cx - w * .55, H * .5], [cx - w * .35, H + 40]], .6, mixCol(col, PAL.ink, .35), 'inkfine', .5);
  }
  pop();
}

// ---------- the sea-chart ground (used by the cards; films may reuse it as a set) ----------
// A watercolour sea chart: deep washes, soft blooms, rhumb lines radiating from (hx, hy), a graduated neatline.
// o: { pal, dark (true: deep sea; false: cream paper), k (0..1 rhumb lines drawing in), border (false: call chartBorder()
// after camEnd instead, so the neatline doesn't drift with the camera) }
function seaChart(t, hx, hy, o = {}) {
  const P = { ...CREW, ...(o.pal || {}) }, dark = o.dark ?? true, k = clamp(o.k ?? 1);
  boilSeed('chart base');
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: dark ? P.deep : P.cream, ink: null });
  const blooms = dark
    ? [[hx, hy, 560, mixCol(P.teal, P.sea, .15), 150], [W * .8, H * .28, 560, mixCol(P.deep, P.teal, .6), 150], [W * .1, H * .9, 480, P.night, 190], [W * .95, H * .98, 560, P.night, 180], [W * .62, H * .8, 400, mixCol(P.deep, P.sea, .3), 120], [W * .1, H * .08, 380, P.night, 150]]
    : [[hx, hy, 640, P.pale, 150], [W * .15, H * .2, 420, mixCol(P.cream, P.ochreLt, .45), 110], [W * .88, H * .25, 460, mixCol(P.pale, P.sea, .3), 110], [W * .8, H * .9, 420, P.pale, 120]];
  blooms.forEach(([x, y, r, c, op], i) => { boilSeed('bloom' + i); paint(blobPts(x, y, r, i + 3, .18), { fill: c, fillOp: op, bleed: .3, tex: .6, border: .5, ink: null }); });
  // rhumb lines: 32 directions from the hub, drawing outward
  const lc = dark ? mixCol(P.deep, P.sea, .42) : mixCol(P.cream, P.sea, .55);
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * TAU, kk = ease(seg(k, (i % 8) * .04, .6 + (i % 8) * .05)), L = 2300 * kk; if (L < 10) continue;
    boilSeed('rhumb' + i);
    inkLine([[hx + Math.cos(a) * 40, hy + Math.sin(a) * 40], [hx + Math.cos(a) * L, hy + Math.sin(a) * L]], i % 4 ? .35 : .6, i % 8 === 0 ? mixCol(lc, P.ochre, .4) : lc, 'inkfine', 0);
  }
  if (o.border) chartBorder(P, dark);
}
// The graduated neatline of a chart, round the frame edge. Call it in screen space (after camEnd) so it stays put.
function chartBorder(P = CREW, dark = true) {
  {
    const m = 34, g = 12, bc = dark ? mixCol(P.ochreDk, P.deep, .25) : mixCol(P.ochre, P.cream, .25);
    boilSeed('neat');
    for (const [a, b] of [[[m, m], [W - m, m]], [[W - m, m], [W - m, H - m]], [[W - m, H - m], [m, H - m]], [[m, H - m], [m, m]]]) {
      inkLine([a, b], .8, bc, 'inkfine', 0);
      const ia = [a[0] + Math.sign(W / 2 - a[0]) * g, a[1] + Math.sign(H / 2 - a[1]) * g], ib = [b[0] + Math.sign(W / 2 - b[0]) * g, b[1] + Math.sign(H / 2 - b[1]) * g];
      inkLine([ia, ib], .5, bc, 'inkfine', 0);
    }
    for (let i = 0; i < 24; i++) if (i % 2 === 0) {   // alternating filled blocks along top and bottom
      const x = lerp(m, W - m, i / 24), w = (W - 2 * m) / 24;
      boilSeed('neatb' + i);
      paint(rectPts(x, m, w, g), { wash: bc, ink: null }); paint(rectPts(x + w, H - m - g, w, g), { wash: bc, ink: null });
    }
    for (let i = 0; i < 14; i++) if (i % 2 === 0) {
      const y = lerp(m, H - m, i / 14), h = (H - 2 * m) / 14;
      boilSeed('neatc' + i);
      paint(rectPts(m, y + h, g, h), { wash: bc, ink: null }); paint(rectPts(W - m - g, y, g, h), { wash: bc, ink: null });
    }
  }
}

// ---------- ident ----------
function crewIdent(t, lt, dur, num, title, o = {}) {
  const P = { ...CREW, ...(o.palette || {}) }, series = o.series || 'THE CREW MEMBER’S GUIDE';
  const RX = 560, RY = 545, RR = 285;
  camBegin(960 + 14 * Math.sin(lt * .5), 540 - 6 * lt, 1.0 + .018 * lt);
  seaChart(t, RX, RY, { pal: P, dark: true, k: seg(lt, .1, 1.6) });
  // the compass paints itself in, swings past north and settles
  const A = seg(lt, .3, 1.9), swing = .5 * Math.exp(-2.6 * Math.max(0, lt - 1.4)) * Math.cos(4.2 * Math.max(0, lt - 1.4));
  compassRose(RX, RY, RR, { assemble: A, rot: lt < 1.4 ? lerp(-.9, .5, ease(seg(lt, .3, 1.4))) : swing, glow: .35 + .25 * seg(lt, 1.4, 2.2) + .06 * Math.sin(lt * 2.4), pal: P, key: 'identrose' });
  camEnd();
  chartBorder(P, true);
  // lettering, right of the rose
  const LX = 985, MAXW = 1920 - LX - 110;
  const ft = fitTitle(title, 92, MAXW, 2, { weight: 400 });
  const two = ft.lines.length > 1, ty = two ? 745 : 770, lh = ft.size * 1.08;
  const items = [
    { txt: series, x: LX, y: two ? 265 : 290, size: 30, col: P.sea, weight: 600, spacing: .26, align: 'left', k: seg(lt, .9, 1.5) },
    { txt: num, x: LX - 8, y: two ? 470 : 500, size: 250, col: P.ochreLt, italic: true, weight: 300, align: 'left', k: seg(lt, 1.25, 1.85) },
  ];
  ft.lines.forEach((L, i) => items.push({ txt: L, x: LX, y: ty + i * lh - (two ? lh * .5 : 0), size: ft.size, col: P.cream, weight: 400, align: 'left', k: seg(lt, 1.75 + i * .3, 2.45 + i * .3) }));
  // a short ochre rule under the number
  const rk = ease(seg(lt, 1.6, 2.1));
  if (rk > 0) { boilSeed('identrule'); inkLine([[LX, two ? 610 : 640], [LX + 360 * rk, (two ? 610 : 640) + 2]], 1.2, P.ochre, 'ink', 0); }
  crewText(items);
  // open: the paint blooms out of bare paper from the compass
  if (lt < .7) { const r = 30 + 2300 * easeIn(seg(lt, 0, .7)); boilSeed('identopen'); irisShape(blobPts(RX, RY, r, 7, .1, 40), PAL.paper); }
  seamOut('wipe', lt, dur, { cols: [P.ochre, P.sea] });
}

// ---------- end card ----------
function crewEnd(t, lt, dur, nextNum, nextTitle, o = {}) {
  const P = { ...CREW, ...(o.palette || {}) }, has = !!(nextTitle && nextTitle.trim());
  camBegin(960, 540 + 8 * Math.sin(lt * .6), 1.03 - .03 * ease(seg(lt, 0, dur)));
  seaChart(t, 960, 1010, { pal: P, dark: false });
  // the ground: a soft sandy shore the pair stand on
  boilSeed('endshore');
  paint(blobPts(960, 1180, 1250, 2, .04, 40), { fill: mixCol(P.ochreLt, P.cream, .35), fillOp: 160, bleed: .15, tex: .6, border: .5, ink: null });
  compassRose(960, 1010, 300, { assemble: .75 + .25 * ease(seg(lt, .2, 1.2)), rot: lt * .22 + .03 * Math.sin(lt * 1.3), glow: .15, pal: P, key: 'endrose' });
  // the Navigator pops up and waves; Clawd bounds in and hops
  const nk = backOut(seg(lt, .75, 1.2)), ck = backOut(seg(lt, .95, 1.4)), wv = lt - 1.2;
  const nm = navFeel('happy', t);
  nav(400, 990 + 620 * (1 - nk), 23, { ...nm, aL: -1.25, aR: lt > 1.2 ? lerp(-1.2, .95 + .35 * Math.sin(wv * 11), ease(seg(wv, 0, .25))) : -1.2, eyes: 'happy', mouth: 'grin', noShadow: nk < .95 });
  const hop = jump((lt - 1.4) % .9, .15, .6, 2.2);
  clawd(1530, 990 + 620 * (1 - ck), 29, { ...feel('excited', t), flip: true, dy: lt > 1.4 ? hop.dy : 0, sq: lt > 1.4 ? hop.sq : 0, emote: 'spark', emoteK: seg(lt, 1.5, 1.8), noShadow: ck < .95 });
  camEnd();
  chartBorder(P, false);
  // lettering
  const items = [];
  if (has) {
    const ft = fitTitle(nextTitle, 84, 1300, 2, { weight: 400 });
    items.push({ txt: 'NEXT', x: 960, y: 175, size: 30, col: P.teal, weight: 600, spacing: .4, k: seg(lt, .3, .7) });
    items.push({ txt: nextNum, x: 960, y: 318, size: 170, col: P.ochre, italic: true, weight: 300, k: seg(lt, .45, .95) });
    ft.lines.forEach((L, i) => items.push({ txt: L, x: 960, y: 480 + i * ft.size * 1.08, size: ft.size, col: P.deep, weight: 400, k: seg(lt, .7 + i * .25, 1.3 + i * .25) }));
  } else {
    items.push({ txt: o.series || 'THE CREW MEMBER’S GUIDE', x: 960, y: 250, size: 30, col: P.teal, weight: 600, spacing: .3, k: seg(lt, .3, .8) });
    items.push({ txt: o.closing || 'theagenticcrew.com', x: 960, y: 395, size: 104, col: P.deep, italic: true, weight: 300, k: seg(lt, .55, 1.3) });
  }
  crewText(items);
  seamIn('wipe', lt, { cols: [P.ochre, P.sea] });
  // out: an ink iris closes on the compass heart
  if (lt > dur - .75) { boilSeed('endiris'); _inkIris(.5 * seg(lt, dur - .75, dur - .05), { cx: 960, cy: 1000, col: P.night }); }
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------- the Navigator ----------
const NAV = {
  skin: '#EDBE98', skinDk: '#D89878', hair: '#2F2226', hairLt: '#5A4148', cheek: '#E58A80',
  sweater: '#2F857E', sweaterDk: '#1F5E5A', scarf: CREW.ochre, scarfDk: CREW.ochreDk, scarfLt: CREW.ochreLt,
  trousers: '#343C4E', boots: '#553629', mouth: '#6A2A35',
};
// per view: face offset (fx), eye half-spacing (ex), hair mass shift (hx), torso width (bw), leg x's, shoulder x's
const NAV_V = {
  front: { fx: 0, ex: .82, hx: 0, bw: 1, legs: [-.62, .62], sh: [-1.72, 1.72], layer: [1, 1], face: true },
  q:     { fx: .72, ex: .66, hx: -.38, bw: .9, legs: [-.45, .55], sh: [-1.45, 1.55], layer: [1, 0], face: true },
  side:  { fx: 1.25, ex: 0, hx: -.8, bw: .64, legs: [-.1, .12], sh: [-.05, .1], layer: [1, 0], face: true },
  qback: { fx: -.6, ex: 0, hx: .2, bw: .92, legs: [-.55, .45], sh: [-1.55, 1.45], layer: [0, 1], face: false },
  back:  { fx: 0, ex: 0, hx: 0, bw: 1, legs: [-.62, .62], sh: [-1.72, 1.72], layer: [1, 1], face: false },
};
function nav(x, y, s, o = {}) {
  const id = o.boilKey ?? ++CLAWD_N, rs = part => boilSeed(`nav ${id} ${part}`);
  const vn = o.back ? 'back' : (NAV_V[o.view] ? o.view : 'front'), V = NAV_V[vn], front = vn === 'front', side = vn === 'side';
  const sw = clamp(s / 17, .4, 1.5) * (o.swMul || 1), J = s * .04, sq = (o.sq || 0) + (o.take || 0);
  const Pp = pts => _P(s, pts);
  const walk = o.walk, run = o.run, moving = walk != null || run != null, ph = run != null ? run : walk;
  const sit = !!o.sit, SIT = sit ? 1.4 : -.5;   // the upper body sits .5s above the torso-space origin; sitting lowers it 1.9s
  const bob = moving ? -(run != null ? .35 : .14) * Math.abs(Math.sin(ph * TAU)) : 0;
  const dy = ((o.dy || 0) + bob) * s;
  x += (o.dx || 0) * s;
  rs('shadow');
  if (!o.noShadow) { const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x, y + s * .1, s * 2.7 * f * (side ? .85 : 1), s * .62 * f, 20), { fill: PAL.ink, fillOp: 85, bleed: .25, tex: .3, border: .1, ink: null }); }

  push();
  translate(x, y + dy);
  const lean = run != null ? .13 : 0;
  if (o.rot || lean) rotate((o.rot || 0) + lean);
  scale((o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .5), 1 - sq);

  // ---- legs ----
  const hipY = -3.25 + SIT;   // -3.75 standing, -1.85 seated
  const leg = (i) => {
    rs('leg' + i);
    const lx = V.legs[i], far = !front && vn !== 'back' && i === 1, col = far ? mixCol(NAV.trousers, PAL.ink, .3) : NAV.trousers;
    const bootCol = far ? mixCol(NAV.boots, PAL.ink, .3) : NAV.boots, fwd = front || vn === 'back' ? 0 : 1;
    push(); translate(lx * s, hipY * s);
    if (sit) {
      if (fwd) {   // thigh forward, shin down
        paint(rrPts(-.5 * s, -.45 * s, 3.0 * s, .95 * s, .4 * s), { wash: col, fill: PAL.indigo, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7 });
        paint(rrPts(1.75 * s, -.2 * s, .88 * s, 1.95 * s, .35 * s), { wash: col, fill: PAL.indigo, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7 });
        paint(ellPts(2.45 * s, 1.72 * s, .62 * s, .34 * s, 14), { wash: bootCol, ink: PAL.ink, sw: sw * .6 });
      } else {     // seen from the front: knees toward us, shins down
        paint(rrPts(-.5 * s, -.2 * s, 1.0 * s, 1.95 * s, .4 * s), { wash: col, fill: PAL.indigo, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7 });
        paint(ellPts(0, -.05 * s, .55 * s, .45 * s, 14), { wash: mixCol(col, '#FFFFFF', .1), ink: PAL.ink, sw: sw * .6 });
        paint(ellPts(.05 * s, 1.72 * s, .6 * s, .34 * s, 14), { wash: bootCol, ink: PAL.ink, sw: sw * .6 });
      }
      pop(); return;
    }
    let a = 0, lift = 0;
    if (moving) {
      const q = Math.sin((ph + (i ? .5 : 0)) * TAU);
      if (fwd) a = -q * (run != null ? .75 : .42) * (side ? 1 : .7);
      else lift = Math.max(0, q) * .5;
    }
    rotate(a);
    const L = -hipY - .15 - lift;
    paint(Pp([[-.5, -.1], [.5, -.1], [.4, L - .25], [-.4, L - .25]]), { wash: col, fill: PAL.indigo, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(fwd * .22 * s, (L - .12) * s, (fwd ? .66 : .56) * s, .34 * s, 14), { wash: bootCol, fill: PAL.ink, fillOp: 40, tex: .4, ink: PAL.ink, sw: sw * .6 });
    pop();
  };
  const legs = () => { if (vn === 'q' || side) { leg(1); leg(0); } else { leg(0); leg(1); } };
  const lapLegs = sit && (vn === 'q' || side);   // seated in profile, the thighs lie over the sweater's hem
  if (!lapLegs) legs();

  // everything above the hips
  push(); translate(0, SIT * s);

  // ---- arms ----
  const swing = moving && o.aL == null && o.aR == null;
  const armA = (which) => {
    const given = which === 'L' ? o.aL : o.aR;
    if (!swing) return given ?? (which === 'L' ? -1.22 : -1.28);
    const q = Math.sin((ph + (which === 'L' ? .5 : 0)) * TAU);
    if (run != null) return front ? -.9 + .35 * q : -.9 + .75 * q;
    return front ? -1.25 + .1 * q : -1.57 + .42 * q;
  };
  const arm = (which) => {
    const i = which === 'L' ? 0 : 1, far = !front && vn !== 'back' && V.layer[i] === 0;
    const a = armA(which), hook = which === 'L' ? o.handL : o.handR, pointing = o.point === which || (o.point === true && which === 'R');
    const dir = side ? 1 : (i === 0 ? -1 : 1);
    rs('arm' + which);
    const col = far ? mixCol(NAV.sweater, PAL.ink, .25) : NAV.sweater, sk = far ? mixCol(NAV.skin, PAL.ink, .15) : NAV.skin;
    push(); translate(V.sh[i] * s, -7.7 * s);
    rotate(dir < 0 ? a : -a);
    const L = 2.95, bend = pointing ? 0 : .16;
    const path = Pp([[0, 0], [L * .5 * dir, bend], [L * dir, 0]]);
    paint(ribbon(path, 1.0 * s, .78 * s), { wash: col, fill: NAV.sweaterDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .7 });
    inkLine(Pp([[L * .82 * dir, -.36], [L * .84 * dir, .36]]), sw * .5, NAV.sweaterDk, 'inkfine', 0);   // cuff
    translate(L * dir * s + dir * .28 * s, 0);
    if (dir < 0) scale(-1, 1);
    if (pointing) {
      paint(ribbon(Pp([[0, 0], [.55, -.05], [.95, -.08]]), .3 * s, .24 * s), { wash: sk, ink: PAL.ink, sw: sw * .5 });
      paint(ellPts(0, .05 * s, .44 * s, .4 * s, 12), { wash: sk, ink: PAL.ink, sw: sw * .55 });
    } else paint(ellPts(0, 0, .46 * s, .46 * s, 12), { wash: sk, ink: PAL.ink, sw: sw * .55 });
    if (hook) { rs('hook' + which); hook(s, sw, a); }
    pop();
  };
  const behind = [], inFront = [];
  for (const w of ['L', 'R']) (V.layer[w === 'L' ? 0 : 1] === 0 && !front && vn !== 'back' ? behind : inFront).push(w);
  behind.forEach(arm);

  // ---- hair: a curly bob. The mass behind the head is drawn before the body, so it tucks behind the shoulders ----
  const hy = -10.6, R = 2.3, hairCol = NAV.hair, wind = o.wind || 0;
  const bobPts = (cx, cy, seed, full) => {
    const p = [], n = 44;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, sa = Math.sin(a), ca = Math.cos(a);
      const rx = R * (1.1 + .2 * Math.pow(Math.max(0, sa), .7)), ry = sa < 0 ? R * 1.12 : R * (full ? .84 : .8);
      const curl = 1 + .085 * Math.abs(Math.sin(a * 6.5 + seed)) + jit(.008);
      p.push([cx + ca * rx * curl - Math.max(0, sa) * wind * .7, cy + sa * ry * curl]);
    }
    return p;
  };
  const curls = (spots, key) => {
    if (s <= 9) return;
    rs(key);
    spots.forEach(([cx, cy], i) => { const sp = []; for (let k = 0; k < 8; k++) { const a = k * .85 + i * 1.7, r = .08 + k * .05; sp.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } inkLine(Pp(sp), sw * .45, NAV.hairLt, 'inkfine', .6); });
  };
  const HAIR = { wash: hairCol, fill: NAV.hairLt, fillOp: 55, tex: .7, border: .5, ink: PAL.ink, sw: sw * .75, curv: .2 };
  if (vn !== 'back' && vn !== 'qback') {
    rs('hairback');
    paint(Pp(bobPts(V.hx, hy - .15, 1.3, false)), HAIR);
    curls(side ? [[-2.3, -10.2], [-1.6, -9.2], [-2.6, -11.4]] : [[-2.55, -9.6], [2.55, -9.6], [-2.75, -10.7], [2.75, -10.7]].map(([a, b]) => [a + V.hx, b]), 'curlsback');
  }

  // ---- torso ----
  rs('torso');
  const bw = V.bw, bx = side ? .15 : 0;
  const torso = Pp([[-1.45, -8.3], [0, -8.42], [1.45, -8.3], [1.85, -7.8], [1.9, -7.0], [1.72, -5.5], [2.05, -3.05], [0, -2.95], [-2.05, -3.05], [-1.72, -5.5], [-1.9, -7.0], [-1.85, -7.8]].map(([a, b]) => [a * bw + bx, b]));
  paint(torso, { wash: NAV.sweater, fill: NAV.sweaterDk, fillOp: 60, bleed: .08, tex: .7, border: .6, ink: null, curv: .25 });
  paint(Pp([[-2.0 * bw + bx, -3.6], [2.0 * bw + bx, -3.6], [2.05 * bw + bx, -3.05], [-2.05 * bw + bx, -3.05]]), { fill: NAV.sweaterDk, fillOp: 120, bleed: .03, tex: .6, border: .4, ink: null });
  if (s > 8) {   // knit: a rib at the hem and two cables down the front
    for (let i = -4; i <= 4; i++) inkLine(Pp([[i * .42 * bw + bx, -3.55], [i * .38 * bw + bx, -3.12]]), sw * .35, NAV.sweaterDk, 'inkfine', 0);
    if (!side) for (const cxk of vn === 'back' || vn === 'qback' ? [0] : [-.72, .72]) {
      const cx = cxk * bw + bx + (vn === 'q' ? .3 : 0), pts = [];
      for (let k = 0; k <= 8; k++) pts.push([cx + (k % 2 ? .12 : -.12), -7.5 + k * .47]);
      inkLine(Pp(pts), sw * .35, NAV.sweaterDk, 'inkfine', .6);
    }
  }
  paint(torso, { ink: PAL.ink, sw: sw * .9, curv: .25 });
  if (lapLegs) { push(); translate(0, -SIT * s); legs(); pop(); }

  // ---- scarf: a chunky band round the neck ----
  rs('scarf');
  const fxs = vn === 'q' ? .35 : side ? .45 : vn === 'qback' ? -.3 : 0, backV = vn === 'back' || vn === 'qback';
  const SCARF = { wash: NAV.scarf, fill: NAV.scarfDk, fillOp: 60, tex: .6, border: .5, ink: PAL.ink, sw: sw * .7 };
  paint(ribbon(Pp([[-1.5 * bw + fxs, -8.62], [fxs, -8.1], [1.5 * bw + fxs, -8.62]]), 1.25 * s, 1.25 * s), SCARF);
  if (s > 9) inkLine(Pp([[-1.1 * bw + fxs, -8.55], [fxs, -8.15], [1.1 * bw + fxs, -8.55]]), sw * .4, NAV.scarfDk, 'inkfine', .5);

  // ---- head ----
  rs('head');
  paint(Pp([[-.42 + V.fx * .3, -8.95], [.42 + V.fx * .3, -8.95], [.42 + V.fx * .3, -8.4], [-.42 + V.fx * .3, -8.4]]), { wash: NAV.skinDk, ink: null });
  const face = [];
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * TAU; let r = R;
    if (side) r += .3 * Math.exp(-((a - .14) ** 2) / .01);   // nose on the profile
    face.push([V.fx * .22 + Math.cos(a) * r * .98, hy + Math.sin(a) * r]);
  }
  if (vn === 'back' || vn === 'qback') {
    paint(Pp(face), { wash: NAV.skin, ink: PAL.ink, sw: sw * .8 });
    rs('hairfull');
    paint(Pp(bobPts(V.hx, hy - .1, 2.1, true)), HAIR);
    curls([[-1.3, -12.2], [.2, -12.7], [1.4, -12.1], [-1.9, -10.4], [.1, -10.9], [1.8, -10.2], [-.9, -9.3], [1.0, -9.3]].map(([a, b]) => [a + V.hx, b]), 'curlsfull');
  } else {
    paint(Pp(face), { wash: NAV.skin, fill: NAV.skinDk, fillOp: 35, tex: .5, border: .6, ink: PAL.ink, sw: sw * .8 });
    // fringe: curly bangs swept from a parting on the heading side
    rs('fringe');
    const f = V.fx * .5, fr = [];
    for (let i = 0; i <= 16; i++) { const a = Math.PI * (side ? 1.0 : 1.0) + i / 16 * Math.PI; fr.push([f * .25 + Math.cos(a) * R * 1.1 * (side && Math.cos(a) > 0 ? .98 : 1), hy - .1 + Math.sin(a) * R * 1.12 * (1 + .035 * Math.abs(Math.sin(i * 1.9)))]); }
    const edge = side
      ? [[2.15, hy - .5], [1.8, hy - 1.05], [1.25, hy - .9], [.65, hy - .8], [.1, hy - .5], [-.4, hy + .1], [-.75, hy + .95], [-2.3, hy + .3]]
      : [[2.28, hy + .55], [2.0, hy - .35], [1.6 + f * .6, hy - .95], [1.2 + f, hy - 1.5], [.75 + f, hy - 1.12], [.15 + f, hy - 1.02], [-.55 + f, hy - .92], [-1.25 + f * .6, hy - .7], [-1.9, hy - .2], [-2.28, hy + .6]];
    for (const e of edge) fr.push(e);
    paint(Pp(fr), { ...HAIR, curv: .35 });
    curls(side ? [[.9, -12.2], [-.4, -12.6], [-1.4, -11.9]] : [[-1.5, -12.25], [-.3, -12.7], [.9 + f, -12.55], [1.9 + f * .5, -11.9]], 'curls');
    // earrings: small ochre drops at the jaw
    rs('earrings');
    for (const ex of side ? [-.25] : vn === 'q' ? [-1.55] : [-1.98, 1.98]) paint(ellPts(ex * s, (hy + 1.45) * s, .16 * s, .21 * s, 10), { wash: NAV.scarfLt, ink: PAL.ink, sw: sw * .35 });
    navFace(s, sw, V, vn, o);
  }

  // ---- scarf ends: two tails hanging over the chest (over the shoulder, down the back, in the back views) ----
  rs('scarftail');
  {
    const sway = .16 * Math.sin(T * 1.7 + 1) + (moving ? .22 * Math.sin(ph * TAU) : 0) - (run != null ? .9 : 0) - wind * .9 - (o.dy || 0) * .08;
    const tx = backV ? -.9 : side ? 1.2 : vn === 'q' ? 1.3 : 1.0;
    const tailEnd = (P, w) => {
      const [a, b] = [P[P.length - 2], P[P.length - 1]];
      for (const q of [.55, .75]) { const c = [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]; inkLine([[c[0] - w * .45, c[1]], [c[0] + w * .45, c[1] + .02 * s]], sw * .9, NAV.scarfDk, 'ink', 0); }
      if (s > 8) for (let k = -2; k <= 2; k++) inkLine([[b[0] + k * w * .17, b[1] - .02 * s], [b[0] + k * w * .19 + sway * .12 * s, b[1] + .4 * s]], sw * .45, NAV.scarfDk, 'inkfine', 0);
    };
    const t2 = Pp([[tx - .4, -8.25], [tx - .5 + sway * .2, -7.2], [tx - .45 + sway * .6, -6.35]]);
    paint(ribbon(t2, .85 * s, .8 * s), { ...SCARF, wash: mixCol(NAV.scarf, NAV.scarfDk, .3) }); tailEnd(t2, .8 * s);
    const t1 = Pp([[tx, -8.35], [tx + .18 + sway * .3, -7.0], [tx + .12 + sway, -5.35]]);
    paint(ribbon(t1, 1.0 * s, .92 * s), SCARF); tailEnd(t1, .92 * s);
  }

  inFront.forEach(arm);
  pop();   // upper-body offset
  rs('draw'); if (o.draw) o.draw(s, sw);
  pop();
  rs('emote');
  if (o.emote) {
    const dir = o.flip ? -1 : 1, top = EMOTE_TOP.includes(o.emote);
    emote(o.emote, x + dir * (top ? .2 : 3.2) * s, y + dy + ((top ? -15.4 : -13.6) + SIT) * s * (1 - sq), s * 1.05, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// The face: eyes, brows, mouth, cheeks, nose. Positions in s; the face centre shifts toward the heading by V.fx.
function navFace(s, sw, V, vn, o) {
  const hy = -10.6, fx = V.fx, ey = hy + .3, side = vn === 'side';
  const eyes = side ? [fx] : [fx - V.ex, fx + V.ex], lx = (o.lookX || 0) * .22 * s, ly = (o.lookY || 0) * .2 * s;
  const e = o.eyes || 'dot', sqz = clamp(o.squint || 0);
  const blink = ['dot', 'look', 'wide'].includes(e) && ((T * .85 + (o.seed || 0) * 1.3 + 2) % 3.7) < .12;
  // cheeks
  const bl = o.blush ?? .35;
  if (bl > .02) for (const cx of side ? [fx - .35] : [eyes[0] - .5, eyes[1] + .5]) paint(ellPts(cx * s, (hy + .95) * s, .48 * s, .27 * s, 12), { fill: NAV.cheek, fillOp: 150 * clamp(bl), bleed: .25, tex: .4, ink: null });
  eyes.forEach((ex, i) => {
    const cx = ex * s, cy = ey * s, far = vn === 'q' && i === 1 ? .82 : 1;
    push(); translate(cx, cy); scale(far, 1);
    const line = (pts, w = 1, c = .4) => inkLine(_P(s, pts), sw * w, PAL.ink, 'ink', c);
    if (sqz > .65 || e === 'closed') line([[-.3, -.05], [0, .14], [.3, -.05]], .9);
    else if (e === 'happy') line([[-.3, .1], [0, -.16], [.3, .1]], .95);
    else if (e === 'x') { line([[-.22, -.22], [.22, .22]], .8, 0); line([[.22, -.22], [-.22, .22]], .8, 0); }
    else if (blink) line([[-.26, 0], [.26, 0]], .8, 0);
    else if (e === 'narrow') { paint(ellPts(lx * .6, .04 * s + ly * .3, .24 * s, .11 * s * (1 - sqz), 10), { wash: PAL.ink, ink: null }); line([[-.32, -.1], [.32, -.12]], .7, 0); }
    else {
      const big = e === 'wide' ? 1.3 : 1, k = 1 - sqz * .8;
      paint(ellPts(lx, ly, .2 * s * big, .27 * s * big * k, 12), { wash: PAL.ink, ink: null });
      if (s > 9) paint(ellPts(lx + .07 * s * big, ly - .09 * s * big * k, .065 * s * big, .065 * s * big * k, 8), { wash: PAL.cream, ink: null });
    }
    // a lash flick at the outer corner
    const sd = side ? 1 : (i === 0 ? -1 : 1), shut = sqz > .65 || ['closed', 'happy'].includes(e) || blink;
    if (s > 7 && e !== 'x') line(shut ? [[sd * .28, -.02], [sd * .42, -.14]] : [[sd * .15 + lx / s, -.22 + ly / s], [sd * .33 + lx / s, -.34 + ly / s]], .6, 0);
    pop();
  });
  // brows
  const b = o.brows || 'soft';
  if (b !== 'none') eyes.forEach((ex, i) => {
    const sd = side ? 1 : (i === 0 ? -1 : 1), inner = ex - sd * .26, outer = ex + sd * .3, by = hy - .62;
    let yi = by, yo = by;
    if (b === 'worried') { yi = by - .2; yo = by + .08; }
    else if (b === 'stern') { yi = by + .14; yo = by - .12; }
    else if (b === 'up') { yi = yo = by - .25; }
    else if (b === 'raised') { if (i === (side ? 0 : 1)) { yi = by - .3; yo = by - .22; } }
    const far = vn === 'q' && i === 1 ? .82 : 1, mid = (inner + outer) / 2;
    inkLine(_P(s, [[mid + (inner - mid) * far, yi], [mid, (yi + yo) / 2 - .05], [mid + (outer - mid) * far, yo]]), sw * .65, NAV.hair, 'ink', .5);
  });
  // nose
  if (!side) inkLine(_P(s, [[fx + (vn === 'q' ? .32 : .05), hy + .45], [fx + (vn === 'q' ? .42 : .14), hy + .62], [fx + (vn === 'q' ? .28 : 0), hy + .68]]), sw * .45, NAV.skinDk, 'inkfine', .5);
  // mouth
  const m = o.mouth || 'smile', mx = (side ? fx + .45 : fx + (vn === 'q' ? .12 : 0)), my = hy + 1.18, L = (pts, w = .75, c = .6) => inkLine(_P(s, pts.map(([a, b2]) => [mx + a, my + b2])), sw * w, PAL.ink, 'ink', c);
  const fill = (pts, c = .4) => paint(_P(s, pts.map(([a, b2]) => [mx + a, my + b2])), { wash: NAV.mouth, ink: PAL.ink, sw: sw * .5, curv: c });
  if (m === 'smile') L(side ? [[-.3, -.02], [0, .12], [.22, -.06]] : [[-.42, -.06], [0, .18], [.42, -.06]]);
  else if (m === 'frown') L([[-.38, .12], [0, -.06], [.38, .12]]);
  else if (m === 'flat') L([[-.33, .02], [.33, .02]], .7, 0);
  else if (m === 'wobble') L([[-.45, .02], [-.22, -.08], [0, .03], [.22, -.08], [.45, .02]], .6, .3);
  else if (m === 'o') paint(ellPts(mx * s, (my + .06) * s, .17 * s, .22 * s, 10), { wash: NAV.mouth, ink: PAL.ink, sw: sw * .45 });
  else if (m === 'open') paint(ellPts(mx * s, (my + .12) * s, .3 * s, .36 * s, 12), { wash: NAV.mouth, ink: PAL.ink, sw: sw * .5 });
  else if (m === 'grin') {
    fill(side ? [[-.28, -.08], [.28, -.12], [.12, .3], [-.18, .26]] : [[-.52, -.1], [.52, -.1], [.3, .32], [-.3, .32]]);
    if (s > 10) paint(_P(s, (side ? [[-.24, -.06], [.24, -.1], [.2, .02], [-.2, .04]] : [[-.46, -.08], [.46, -.08], [.4, .03], [-.4, .03]]).map(([a, b2]) => [mx + a, my + b2])), { wash: PAL.cream, ink: null });
  }
}

// ---------- the Navigator's moods ----------
const NAVE = {
  neutral:    { eyes: 'dot', mouth: 'smile', brows: 'soft', take: .3, body: t => { const b = _b(t); return { dy: -.06 * b.ab, aL: -1.22 + .03 * b.s1, aR: -1.28 - .03 * b.s1 }; } },
  happy:      { eyes: 'happy', mouth: 'grin', brows: 'up', blush: .6, take: .6, body: t => { const b = _b(t); return { dy: -.35 * b.ab, sq: .05 * b.hit, aL: -1.05 + .12 * b.s1, aR: -1.05 - .12 * b.s1 }; } },
  laugh:      { eyes: 'happy', mouth: 'grin', brows: 'up', blush: .8, take: .7, body: t => { const c = Math.abs(Math.sin(t * TAU * 4)); return { dy: -.18 * c, sq: .05 * c - .02, rot: -.05 + .02 * Math.sin(t * TAU * 4), aL: -1.35, aR: -.5 + .1 * c }; } },
  proud:      { eyes: 'closed', mouth: 'smile', brows: 'up', blush: .45, emote: 'spark', take: .5, body: t => { const b = _b(t); return { sq: -.05, dy: -.1 * b.hit, aL: -.62, aR: -.62, rot: .015 * b.s1 }; } },
  worried:    { eyes: 'dot', mouth: 'wobble', brows: 'worried', emote: 'sweat', blush: .2, take: .5, body: t => ({ lookX: .4 * Math.sin(t * 1.7), sq: .03, aL: -1.4 + .05 * Math.sin(t * 9), aR: -1.35, dy: -.03 * Math.abs(Math.sin(t * 9)) }) },
  surprised:  { eyes: 'wide', mouth: 'o', brows: 'up', emote: '!', fade: true, take: 1.2, body: t => { const b = _b(t); return { sq: -.06, dy: -.1 - .05 * b.ab, aL: .2 + .05 * b.s2, aR: .25 - .05 * b.s2 }; } },
  thinking:   { eyes: 'look', mouth: 'flat', brows: 'raised', emote: 'dots', take: .4, body: t => { const b = _b(t); return { lookX: .5, lookY: -.7, rot: .03, aL: -1.25, aR: 1.32 + .04 * b.s1, dy: -.04 * b.ab }; } },
  confused:   { eyes: 'dot', mouth: 'wobble', brows: 'raised', emote: '?', take: .5, body: t => { const b = _b(t); return { rot: .07 * Math.sin(b.bp * Math.PI / 4), aL: -.4 + .08 * Math.sin(t * TAU * 1.5), aR: -.3 - .08 * Math.sin(t * TAU * 1.5), dy: -.04 * b.ab }; } },
  stern:      { eyes: 'narrow', mouth: 'flat', brows: 'stern', take: .5, body: t => { const b = _b(t); return { sq: .02, aL: -1.38, aR: -1.38, dy: -.03 * b.ab }; } },
  determined: { eyes: 'dot', mouth: 'smile', brows: 'stern', take: .6, body: t => { const b = _b(t); return { rot: .05, sq: -.03 + .03 * b.hit, dy: -.1 * b.ab, aL: -1.1 + .15 * b.s1, aR: -.2 }; } },
  sad:        { eyes: 'dot', mouth: 'frown', brows: 'worried', blush: .1, take: .3, body: t => ({ lookY: .7, sq: .05 + .01 * Math.sin(t * 1.3), aL: -1.42, aR: -1.42, rot: .02 * Math.sin(t * .8) }) },
  relieved:   { eyes: 'closed', mouth: 'smile', brows: 'worried', emote: 'sweat', take: .4, body: t => { const br = Math.sin(t * TAU * .3); return { sq: .03 + .03 * br, aL: -1.35, aR: -1.35 }; } },
  idea:       { eyes: 'wide', mouth: 'grin', brows: 'up', emote: 'bulb', take: 1, body: t => { const b = _b(t); return { dy: -.25 * b.ab, aR: 1.3 + .05 * b.s2, aL: -1.2, point: 'R' }; } },
  sleepy:     { eyes: 'closed', mouth: 'o', brows: 'soft', emote: 'zzz', take: .2, body: t => { const br = Math.sin(t * TAU * .3); return { sq: .03 + .03 * br, rot: .04 * Math.sin(t * .8), aL: -1.4, aR: -1.4 }; } },
};
function navFeel(name, t, over = {}) {
  const E = NAVE[name] || NAVE.neutral;
  return { eyes: E.eyes, mouth: E.mouth, brows: E.brows, blush: E.blush ?? .35, emote: E.emote, ...(E.body ? E.body(t) : {}), ...over };
}
function navMood(t, keys, o = {}) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [tc, name, over] = keys[i], age = t - tc, cur = navFeel(name, t, over), E = NAVE[name] || NAVE.neutral;
  const tn = i + 1 < keys.length ? keys[i + 1][0] : Infinity, tkS = o.take ?? 1;
  let squint = cur.squint || 0;
  if (tn - t < .1) squint = Math.max(squint, 1 - (tn - t) / .1);
  if (i > 0 && age < .14) squint = Math.max(squint, 1 - age / .14);
  const prev = i > 0 ? navFeel(keys[i - 1][1], t, keys[i - 1][2]) : null;
  if (prev && age < .5) {
    const base = { dy: 0, sq: 0, aL: -1.22, aR: -1.28, rot: 0, dx: 0, lookX: 0, lookY: 0, blush: .35 };
    const k = backOut(seg(age, 0, .4));
    for (const f in base) cur[f] = lerp(prev[f] ?? base[f], cur[f] ?? base[f], k);
  }
  const t1 = prev ? take(t, tc, (E.take ?? .5) * tkS * .6) : { sq: 0, dy: 0 };
  const En = i + 1 < keys.length ? NAVE[keys[i + 1][1]] || NAVE.neutral : null, t2 = En ? take(t, tn, (En.take ?? .5) * tkS * .6) : { sq: 0, dy: 0 };
  cur.sq = (cur.sq || 0) + t1.sq * .7 + t2.sq * .7; cur.dy = (cur.dy || 0) + t1.dy * .45 + t2.dy * .45;
  cur.squint = squint;
  const same = prev && prev.emote === cur.emote;
  cur.emoteK = same ? 1 : seg(age, .06, .32) * (E.fade && !(over && over.emote) ? 1 - seg(age, 1.4, 1.8) : 1);
  cur.emoteAge = age;
  return cur;
}

// ---------- props for her hands ----------
function navProp(kind, s, sw, o = {}) {
  push(); if (o.up != null) rotate(o.up);
  const Pp = pts => _P(s, pts);
  if (kind === 'spyglass') {   // brass telescope: held at the eye end, pointing along +x; o.ext 0..1 draws it out
    const e = clamp(o.ext ?? 1);
    paint(Pp([[-.2, -.32], [1.6, -.32], [1.6, .32], [-.2, .32]]), { wash: CREW.ochreDk, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .6 });
    paint(Pp([[1.5, -.42], [1.5 + 1.3 * e + .3, -.42], [1.5 + 1.3 * e + .3, .42], [1.5, .42]]), { wash: CREW.ochre, fill: CREW.ochreLt, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .6 });
    paint(Pp([[1.7 + 1.3 * e, -.55], [2.55 + 1.3 * e, -.6], [2.55 + 1.3 * e, .6], [1.7 + 1.3 * e, .55]]), { wash: CREW.ochreLt, ink: PAL.ink, sw: sw * .6 });
    inkLine(Pp([[1.6, -.42], [1.6, .42]]), sw * .6, CREW.ochreDk, 'inkfine', 0);
    paint(ellPts((2.58 + 1.3 * e) * s, 0, .12 * s, .52 * s, 10), { wash: CREW.pale, ink: PAL.ink, sw: sw * .4 });
  } else if (kind === 'chart') {   // sea chart: o.open 0 = a tied roll, 1 = unrolled sheet held from the hand
    const k = clamp(o.open ?? 0);
    if (k < .05) {
      paint(Pp([[-1.6, -.42], [1.6, -.42], [1.6, .42], [-1.6, .42]]), { wash: CREW.cream, fill: CREW.ochreLt, fillOp: 60, tex: .6, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(1.6 * s, 0, .2 * s, .42 * s, 10), { wash: mixCol(CREW.cream, CREW.ochre, .3), ink: PAL.ink, sw: sw * .5 });
      inkLine(Pp([[-.3, -.44], [-.3, .44]]), sw * .9, CREW.rose, 'ink', 0);
    } else {
      const w = 5.4 * ease(k), h = 3.8;
      paint(Pp([[-.2, -h * .5], [w, -h * .5 - .1], [w, h * .5], [-.2, h * .5 + .1]]), { wash: CREW.cream, fill: CREW.ochreLt, fillOp: 55, tex: .7, border: .6, ink: PAL.ink, sw: sw * .6 });
      if (w > 2) {
        paint(blobPts(w * .55 * s, -.2 * s, .9 * s, 3, .25, 18), { fill: CREW.sea, fillOp: 90, bleed: .15, tex: .5, ink: null });
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; inkLine(Pp([[w * .45 - Math.cos(a) * w * .38, .6 - Math.sin(a) * 1.2], [w * .45 + Math.cos(a) * w * .38, .6 + Math.sin(a) * 1.2]]), sw * .3, CREW.ochreDk, 'inkfine', 0); }
        inkLine(Pp([[w * .2, 1.2], [w * .35, .7], [w * .5, 1.0], [w * .7, .4]]), sw * .5, CREW.rose, 'ink', .5);
      }
      paint(ellPts(w * s, 0, .25 * s, h * .52 * s, 12), { wash: mixCol(CREW.cream, CREW.ochre, .3), ink: PAL.ink, sw: sw * .5 });
    }
  } else if (kind === 'tablet') {   // a tablet held in the hand, screen toward us; o.glow lights it
    paint(rrPts(-.3 * s, -1.5 * s, 2.3 * s, 3 * s, .3 * s), { wash: '#2A3036', ink: PAL.ink, sw: sw * .6 });
    paint(rrPts(-.1 * s, -1.3 * s, 1.9 * s, 2.6 * s, .15 * s), { wash: mixCol(CREW.pale, CREW.sea, .3 + .3 * (o.glow || 0)), ink: null });
    for (let i = 0; i < 3; i++) paint(rrPts(.15 * s, (-1 + i * .6) * s, (i === 2 ? .8 : 1.4) * s, .28 * s, .1 * s), { wash: i ? CREW.teal : CREW.ochre, ink: null });
  } else if (kind === 'mug') {   // a mug held upright; o.steam 0..1
    paint(Pp([[-.1, -1.05], [1.25, -1.05], [1.15, .55], [0, .55]]), { wash: CREW.cream, fill: CREW.sea, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .6, curv: .2 });
    inkLine(Pp([[.05, -.55], [1.2, -.55]]), sw * .9, CREW.teal, 'ink', 0);
    inkLine(Pp([[1.2, -.8], [1.65, -.65], [1.6, -.05], [1.15, 0]]), sw * .9, PAL.ink, 'ink', .6);
    const st = o.steam ?? .8;
    if (st > 0) for (let i = 0; i < 2; i++) { const p = frac(T * .6 + i * .5), x0 = (.35 + i * .45) * s, pts = []; for (let k = 0; k < 5; k++) pts.push([x0 + Math.sin(k * 1.4 + T * 3 + i) * .15 * s, (-1.2 - k * .3 - p * .6) * s]); inkLine(pts, sw * .5 * st * (1 - p), mixCol(CREW.cream, CREW.sea, .3), 'inkfine', .6); }
  }
  pop();
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------- model sheets (labels are fine here) ----------
(() => {
  const label = (txt, x, y, size = 19) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .75 });
  const floor = (y) => { boilSeed('floor' + y); inkLine([[40, y + 6], [W / 2, y + 4], [W - 40, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5); };

  LOOPS.navigator = t => {
    // row 1: key views, with Clawd for scale (s = .75u)
    const y1 = 355, s1 = 16.5;
    const views = [['front', {}], ['q', { view: 'q' }], ['side', { view: 'side' }], ['qback', { view: 'qback' }], ['back', { view: 'back' }], ['q, flip', { view: 'q', flip: true }]];
    views.forEach(([n, v], i) => { const x = 140 + i * 232; nav(x, y1, s1, { ...navFeel('neutral', t, { seed: i }), ...v }); label(n, x, y1 + 36); });
    clawd(1770, y1, 22, { ...feel('neutral', t), flip: true }); nav(1550, y1, s1, { ...navFeel('happy', t), view: 'q' }); label('with Clawd (s = .75u)', 1640, y1 + 36);
    floor(y1);
    // row 2: poses and props
    const y2 = 700, s2 = 13;
    const poses = [
      ['walk', x => nav(x, y2, s2, { ...navFeel('neutral', t), view: 'side', walk: t * 1.6 })],
      ['run', x => nav(x, y2, s2, { ...navFeel('determined', t), view: 'side', run: t * 2.6 })],
      ['sit', x => { boilSeed('stool'); paint(rrPts(x - 30, y2 - 1.9 * s2, 60, 1.9 * s2, 6), { wash: CREW.ochreDk, ink: PAL.ink, sw: .6 }); nav(x - 8, y2, s2, { ...navFeel('neutral', t), view: 'q', sit: true, noShadow: true, aL: -1.0, aR: -.9 }); }],
      ['point', x => nav(x, y2, s2, { ...navFeel('determined', t), view: 'q', point: 'R', aR: .25 })],
      ['wave', x => nav(x, y2, s2, { ...navFeel('happy', t), aR: 1.25 + .45 * Math.sin(t * 11) })],
      ['spyglass', x => nav(x, y2, s2, { ...navFeel('neutral', t), view: 'side', eyes: 'narrow', aL: .72, handL: (s, sw, up) => navProp('spyglass', s, sw, { up, ext: .5 + .5 * Math.sin(t * 2) }) })],
      ['chart', x => nav(x, y2, s2, { ...navFeel('thinking', t), view: 'q', aR: -.2, handR: (s, sw, up) => navProp('chart', s, sw, { up, open: .5 + .5 * Math.sin(t * 1.6) }) })],
      ['tablet', x => nav(x, y2, s2, { ...navFeel('neutral', t), view: 'q', lookX: .6, lookY: .5, aL: -.55, handL: (s, sw, up) => navProp('tablet', s, sw, { up, glow: .5 }) })],
      ['mug', x => nav(x, y2, s2, { ...navFeel('relieved', t), emote: null, aR: -.55, handR: (s, sw, up) => navProp('mug', s, sw, { up }) })],
    ];
    poses.forEach(([n, f], i) => { const x = 120 + i * 208; f(x); label(n, x, y2 + 34); });
    floor(y2);
    // row 3: moods
    const y3 = 1010, s3 = 11.5, names = Object.keys(NAVE);
    names.forEach((n, i) => { const x = 75 + i * 137; nav(x, y3, s3, navFeel(n, t, { seed: i })); label(n, x, y3 + 30, 17); });
    floor(y3);
  };
  LOOPS.navigator.len = 4;

  // Close-ups: views and a few moods at s = 42 (a close-up), cropped at the chest.
  LOOPS.navface = t => {
    const row = [['front', {}], ['q', { view: 'q' }], ['side', { view: 'side' }], ['back', { view: 'back' }], ['happy', { ...navFeel('happy', t) }]];
    row.forEach(([n, v], i) => { const x = 200 + i * 380; nav(x, 1010, 36, { ...navFeel('neutral', t, { seed: i }), aL: -1.3, aR: -1.3, ...v, emote: null }); label(n, x, 60, 24); });
  };
  LOOPS.navface.len = 4;

  // The cards: 0–4.5 ident, 4.5–9.5 end card, 9.5–12.5 the compass assembling, 12.5–17 the Hands-On ident.
  LOOPS.crewcards = t => {
    if (t < 4.5) crewIdent(t, t, 4.5, '04', 'Working With Your Crew When You Don’t Write Code');
    else if (t < 9.5) crewEnd(t, t - 4.5, 5, '05', 'Reading the Chart Before You Sail');
    else if (t < 12.5) {
      const lt = t - 9.5;
      seaChart(t, 960, 540, { dark: true, border: false });
      [0, .25, .5, .75, 1].forEach((a, i) => { compassRose(220 + i * 370, 520, 150, { assemble: a, glow: a, key: 'sheet' + i }); crewText([{ txt: 'assemble ' + a, x: 220 + i * 370, y: 760, size: 26, col: CREW.pale, italic: true }]); });
      compassRose(960, 1000, 120, { assemble: seg(lt, 0, 2), rot: lt * .5, glow: .5, key: 'live' });
      crewText([{ txt: 'compassRose(cx, cy, r, { assemble, rot, glow })', x: 960, y: 150, size: 34, col: CREW.pale, italic: true }]);
    } else crewIdent(t, t - 12.5, 4.5, '03', 'Your First Session', { series: 'THE HANDS-ON GUIDE', palette: HANDSON });
  };
  LOOPS.crewcards.len = 17;
})();
