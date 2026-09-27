// common.js: shared pieces for The Agentic Crew chapter intros. Read ANIMATION_GUIDE.md (riso-motion) first.
// Inks for the series: Federal Blue + Orange + Yellow — the book cover's navy and gold, printed as riso.
//   NAVY  federal            GOLD  orange+yellow overprint     GREEN federal+yellow     BROWN federal+orange
const INK = {
  navy: { federal: 1 }, gold: { orange: .55, yellow: 1 }, orange: { orange: 1 }, yellow: { yellow: 1 },
  green: { federal: .75, yellow: 1 }, brown: { federal: .7, orange: 1 }, dark: { federal: 1, orange: .8 },
  paper: {},
};

// ---------- narration timing (TIMING comes from <ch>.timing.js, written by video/tools/voice.py) ----------
const beat = id => TIMING.beats[id];
const _nw = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// Time a word starts in a beat: wt('hook', 'seams'); n picks the nth match (-1 = the last); falls back to a fraction of the beat.
function wt(id, word, n = 0, fb = .5) {
  const b = beat(id), k = _nw(word), hits = b.words.filter(w => _nw(w.w).startsWith(k));
  const h = hits[n < 0 ? hits.length + n : n]; if (h) return h.s;
  console.warn(`wt: "${word}" not heard in ${id}`); return lerp(b.start, b.end, fb);
}
// Shot start for a beat: half-way through the silence before it, so a transition covers the cut in the gap.
const shotAt = (id, gap = .8) => beat(id).start - Math.min(.45, gap / 2 + .05);

// ---------- motion ----------
const stamp = (t, t0, d = .32) => backOut(seg(t, t0, t0 + d));     // 0 → overshoot → 1: things stamp in
const gone = (t, t0, d = .3) => 1 - easeIn(seg(t, t0, t0 + d));    // 1 → 0

// ---------- seams: call tIn at the start of a shot and tOut at the end with the same kind ----------
const HALF = .45;
function tOut(kind, lt, dur, o = {}) { if (lt > dur - HALF) seam(kind, (lt - (dur - HALF)) / (2 * HALF), o); }
function tIn(kind, lt, o = {}) { if (lt < HALF) seam(kind, .5 + lt / (2 * HALF), o); }
function seam(kind, p, o) {
  if (kind === 'ink') inkSlide(p, o.cols || ['orange', 'federal']);
  else if (kind === 'dots') dotDissolve(p, o.col || 'federal', { cx: o.cx, cy: o.cy });
  else if (kind === 'iris') { const r = p < .5 ? lerp(1500, 0, ease(p * 2)) : lerp(0, 1500, ease((p - .5) * 2)); iris(o.cx ?? W / 2, o.cy ?? H / 2, r, o.col || INK.navy); }
  else if (kind === 'feed') paperFeed(p);
}

// ---------- set pieces ----------
// The ship's wheel from the cover. rot in radians.
function helm(cx, cy, r, rot = 0, col = INK.gold, hub = INK.navy) {
  for (let i = 0; i < 8; i++) {
    const a = rot + i * TAU / 8, c = Math.cos(a), s = Math.sin(a);
    inkLine([[cx + c * r * .18, cy + s * r * .18], [cx + c * r * 1.08, cy + s * r * 1.08]], r * .028, col, 'ink', 0, { force: true });
    paint(ellPts(cx + c * r * 1.2, cy + s * r * 1.2, r * .085, r * .085, 18), { fill: col });
  }
  arcLine(cx, cy, r, r * .13, col);
  arcLine(cx, cy, r * .55, r * .06, col);
  paint(ellPts(cx, cy, r * .2, r * .2, 36), { fill: hub });
  paint(ellPts(cx, cy, r * .08, r * .08, 20), { fill: col });
}

// The engineer: a head-and-shoulders silhouette in federal with a gold captain's cap. (x, y) = bottom centre; s = scale.
function captain(x, y, s = 1, o = {}) {
  const dy = o.dy || 0, sq = o.sq || 0;
  push(); translate(x, y + dy); scale(s * (1 + sq * .5), s * (1 - sq));
  paint(rrPts(-150, -190, 300, 200, 90), { fill: o.body || INK.navy });           // shoulders
  paint(ellPts(0, -265, 78, 86, 48), { fill: o.body || INK.navy });               // head
  paint([[-96, -318], [96, -318], [82, -372], [-82, -372]], { fill: INK.gold, curv: .2 });   // cap crown
  paint(rrPts(-104, -326, 208, 26, 13), { fill: INK.dark });                      // brim band
  paint(starPts(0, -348, 16, .45, 5), { fill: INK.navy });                        // badge
  pop();
}

// A UI card: a rounded rectangle with a few text bars.
function card(x, y, w, h, col = INK.navy, o = {}) {
  paint(rrPts(x, y, w, h, Math.min(w, h) * .12), { fill: col, tone: o.tone ?? 1, over: o.over });
  if (o.bars !== false) for (let i = 0; i < 3; i++) paint(rrPts(x + w * .12, y + h * (.22 + i * .22), w * (i === 2 ? .45 : .76), h * .09, h * .045), { fill: o.bar || INK.paper });
}

// A big stamped X (a rubber stamp, not a label): k = stamp progress.
function stampX(cx, cy, r, k, col = INK.orange) {
  if (k <= .01) return;
  push(); translate(cx, cy); scale(k * 1.0); rotate(-.08);
  paint(ribbon([[-r, -r], [r, r]], r * .22), { fill: col, over: true });
  paint(ribbon([[r, -r], [-r, r]], r * .22), { fill: col, over: true });
  pop();
}

// The series ident: the helm assembles one ink at a time, the chapter number and title stamp in.
function ident(T, lt, dur, num, title) {
  const t = onTwos(lt), inK = (a, b) => 1 - backOut(seg(t, a, b));
  riso({ seed: 2, shift: { yellow: [0, -1300 * inK(.05, .7)], orange: [-2300 * inK(.3, .95), 0], federal: [2300 * inK(.55, 1.25), 0] } });
  camBegin(960, 540, 1 + .03 * ease(seg(t, 0, dur)));
  paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, H + 100], to: [0, 250], a: .55, b: 0 } });
  paint(rectPts(-200, 860, W + 400, 400), { fill: INK.navy });
  const turn = TAU / 8 * backOut(seg(t, 2.7, 3.2)) + .06 * wob(t, .25);
  helm(560, 520, 250, turn);
  type('THE AGENTIC CREW', 1340, 300, 40, INK.navy, { spacing: .18, pop: seg(t, 1.3, 1.6) });
  type(num, 1340, 490, 230, INK.orange, { pop: seg(t, 1.5, 1.85) });
  type(num, 1352, 500, 230, INK.navy, { pop: seg(t, 1.6, 1.95), over: true, tone: .55 });
  type(title.toUpperCase(), 1340, 700, title.length > 14 ? 70 : 96, INK.navy, { pop: seg(t, 1.9, 2.3) });
  camEnd();
}

// End card: what's next.
function endCard(T, lt, dur, nextNum, nextTitle) {
  const t = onTwos(lt);
  riso({ seed: 11 });
  camBegin(960, 540, 1.04 - .04 * ease(seg(t, 0, dur)));
  paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, -100], to: [0, 700], a: .45, b: 0 } });
  helm(960, 1080, 330, t * .25, INK.gold);
  type('NEXT', 960, 250, 44, INK.navy, { spacing: .3, pop: seg(t, .3, .6) });
  type(nextNum, 960, 420, 190, INK.orange, { pop: seg(t, .5, .85) });
  type(nextTitle.toUpperCase(), 960, 600, 92, INK.navy, { pop: seg(t, .8, 1.2) });
  if (typeof skipper === 'function') skipper(330, 1050, 22, { ...SKIP_POSES.wave, mood: 'happy', t, dy: 400 * (1 - backOut(seg(t, .6, 1.1))) });
  const kc = backOut(seg(t, 1.0, 1.4));
  clawd(1600, 1040 + 300 * (1 - kc), 24, { ...feel('thinking', t), emote: '?', emoteK: kc, emoteAge: t - 1.2, flip: true });
  camEnd();
}
