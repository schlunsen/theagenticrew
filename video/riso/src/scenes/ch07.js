// ch07.js: Chapter 7 · Convention Over Configuration. Storyboard: video/storyboards/ch07.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); paint([[x - w * .25, y + h / 2 - 4], [x - w * .32, y + h / 2 + 34], [x - w * .08, y + h / 2 - 4]], { fill: col }); if (o.dots) for (let i = 0; i < 3; i++) paint(ellPts(x - 30 + i * 30, y, 9, 9, 12), { fill: INK.orange }); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const fileIcon = (x, y, s, col = INK.paper, corner = null) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); if (corner) paint([[x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 18 * s, y - 30 * s]], { fill: corner }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const folder = (x, y, w, h, col = INK.navy, tn = .9) => { paint(rrPts(x - w / 2, y - h / 2 - h * .14, w * .4, h * .25, 10), { fill: col, tone: tn }); paint(rrPts(x - w / 2, y - h / 2, w, h, 14), { fill: col, tone: tn }); };
  const stopwatch = (x, y, r, a, col = INK.navy, wedge = 0) => { paint(rrPts(x - r * .18, y - r * 1.32, r * .36, r * .3, 6), { fill: col }); paint(ellPts(x, y, r, r, 40), { fill: col }); paint(ellPts(x, y, r * .8, r * .8, 40), { fill: INK.paper }); if (wedge > .01) { const P = [[x, y]]; for (let i = 0; i <= 24; i++) { const b = -Math.PI / 2 + wedge * TAU * i / 24; P.push([x + Math.cos(b) * r * .78, y + Math.sin(b) * r * .78]); } paint(P, { fill: INK.orange, tone: .7, over: true }); } for (let i = 0; i < 12; i++) { const b = i / 12 * TAU; paint(ellPts(x + Math.cos(b) * r * .66, y + Math.sin(b) * r * .66, r * .05, r * .05, 8), { fill: col }); } paint(ribbon([[x, y], [x + Math.cos(a - Math.PI / 2) * r * .6, y + Math.sin(a - Math.PI / 2) * r * .6]], r * .09, r * .04), { fill: INK.navy }); paint(ellPts(x, y, r * .1, r * .1, 12), { fill: col }); };
  // the motif: an endpoint as three matching cards (handler navy, schema gold, test green)
  const TRIO = [INK.navy, INK.gold, INK.green];
  const trio = (x, y, k = [1, 1, 1], rot = 0, cols = TRIO) => { for (let i = 0; i < 3; i++) { if (k[i] <= .01) continue; push(); translate(x, y + i * 130); rotate(rot * (i - 1)); scale(k[i]); card(-90, -52, 180, 104, cols[i]); pop(); } };
  const brick = (x, y, w, h, col, rot = 0) => { push(); translate(x, y); rotate(rot); paint(rrPts(-w / 2, -h / 2, w, h, 8), { fill: col }); pop(); };
  const burst = (x, y, r0, k, col = INK.orange, n = 12) => { if (k <= 0 || k >= 1) return; for (let i = 0; i < n; i++) { const a = i / n * TAU + .2; paint(ribbon([[x + Math.cos(a) * r0 * (1 + k * .6), y + Math.sin(a) * r0 * (1 + k * .6)], [x + Math.cos(a) * r0 * (1.5 + k * .8), y + Math.sin(a) * r0 * (1.5 + k * .8)]], 16 * (1 - k)), { fill: col }); } };
  const hookIcon = (x, y, s) => { push(); translate(x, y); scale(s); inkLine([[0, -150], [0, 40]], 5, INK.navy, 'ink', 0, { force: true }); arcLine(-50, 40, 50, 26, INK.navy, { a0: 0, a1: Math.PI, cap: 'round' }); paint([[-100, 40], [-120, 0], [-80, 20]], { fill: INK.navy }); paint(ellPts(0, -160, 30, 30, 20), { fill: INK.gold }); pop(); };
  const lock = (x, y, s, col = INK.gold) => { push(); translate(x, y); scale(s); arcLine(0, -30, 34, 12, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(-50, -30, 100, 80, 12), { fill: col }); paint(ellPts(0, 5, 10, 10, 10), { fill: INK.navy }); pop(); };

  // ---------- ident and end card with long titles: the shared ones print one line, so these split it in two ----------
  const split2 = s => { s = s.toUpperCase(); if (s.length <= 16) return [s]; const m = s.length / 2; let best = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (best < 0 || Math.abs(i - m) < Math.abs(best - m))) best = i; return best < 0 ? [s] : [s.slice(0, best), s.slice(best + 1)]; };
  function identLong(T, lt, dur, num, title) {
    const t = onTwos(lt), inK = (a, b) => 1 - backOut(seg(t, a, b));
    riso({ seed: 2, shift: { yellow: [0, -1300 * inK(.05, .7)], orange: [-2300 * inK(.3, .95), 0], federal: [2300 * inK(.55, 1.25), 0] } });
    camBegin(960, 540, 1 + .03 * ease(seg(t, 0, dur)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, H + 100], to: [0, 250], a: .55, b: 0 } });
    paint(rectPts(-200, 860, W + 400, 400), { fill: INK.navy });
    helm(560, 520, 250, TAU / 8 * backOut(seg(t, 2.7, 3.2)) + .06 * wob(t, .25));
    type('THE AGENTIC CREW', 1340, 270, 40, INK.navy, { spacing: .18, pop: seg(t, 1.3, 1.6) });
    type(num, 1340, 450, 230, INK.orange, { pop: seg(t, 1.5, 1.85) });
    type(num, 1352, 460, 230, INK.navy, { pop: seg(t, 1.6, 1.95), over: true, tone: .55 });
    const L = split2(title), sz = Math.max(...L.map(l => l.length)) > 13 ? 66 : 76;
    L.forEach((l, i) => type(l, 1340, 650 + i * sz * 1.12, sz, INK.navy, { pop: seg(t, 1.9 + i * .12, 2.3 + i * .12) }));
    camEnd();
  }

  // ---------- A · the hook: same agent, same afternoon, same model; senior-grade here, a mess there ----------
  function shotHook(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('hook');
    riso({ seed: 71 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tAg = wt('hook', 'agent'), tAft = wt('hook', 'afternoon'), tMod = wt('hook', 'model'), tOne = wt('hook', 'one'), tWr = wt('hook', 'writes'), tSen = wt('hook', 'senior'),
      tAno = wt('hook', 'another'), tProd = wt('hook', 'produces'), tNob = wt('hook', 'nobody'), tPr = wt('hook', 'prompt'), tCode = wt('hook', 'code', 1);
    // the same afternoon, the same model
    const ks = stamp(t, tAft - .15); if (ks > .01) { paint(ellPts(260, 190, 90 * ks, 90 * ks, 40), { fill: INK.gold }); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .2; paint(ribbon([[260 + Math.cos(a) * 110 * ks, 190 + Math.sin(a) * 110 * ks], [260 + Math.cos(a) * 150 * ks, 190 + Math.sin(a) * 150 * ks]], 12), { fill: INK.orange }); } }
    const km = stamp(t, tMod - .15); if (km > .01) { push(); translate(1660, 190); scale(km); for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { paint(rectPts(-60 + i * 36, s * 78 - 8, 16, 16 * s), { fill: INK.navy }); paint(rectPts(s * 78 - 8, -60 + i * 36, 16 * s, 16), { fill: INK.navy }); } paint(rrPts(-75, -75, 150, 150, 16), { fill: INK.navy }); paint(rrPts(-40, -40, 80, 80, 10), { fill: INK.gold }); pop(); }
    // the tidy project: a wall of even bricks and a star
    const split = ease(seg(t, tOne - .2, tOne + .4));
    const nb = Math.floor(12 * seg(t, tWr, tSen));
    for (let i = 0; i < nb; i++) { const r = Math.floor(i / 4), c = i % 4; brick(220 + c * 100 + (r % 2) * 50, 840 - r * 64 - 40, 92, 56, TRIO[(i + r) % 3]); }
    if (t > tSen - .1) paint(starPts(450, 560, 70 * stamp(t, tSen - .1), .45, 5), { fill: INK.gold });
    // the messy project: a crooked heap, stamped out
    const nh = Math.floor(10 * seg(t, tProd, tNob));
    for (let i = 0; i < nh; i++) { const w = 60 + 90 * hash(i + 3), h = 40 + 50 * hash(i + 9); brick(1250 + 260 * (hash(i + 1) - .5) + i * 8, 840 - 30 - i * 30 * hash(i + 5) - 10, w, h, [INK.orange, INK.brown, INK.navy, INK.green][i % 4], (hash(i + 7) - .5) * 1.2); }
    stampX(1290, 700, 150, stamp(t, tNob + .1));
    // the agent: one, then the same agent on both
    const kc = stamp(t, tAg - .2);
    if (kc > .01) {
      clawd(lerp(960, 820, split), 880, 16 * kc, { ...emotions(t, [[tAg - .2, 'happy'], [tWr, 'determined'], [tSen + .2, 'proud']]) });
      if (t > tAno - .2) clawd(1700, 880 + 300 * (1 - stamp(t, tAno - .2)), 16, { ...emotions(t, [[tAno - .2, 'neutral'], [tProd, 'nervous'], [tNob + .1, 'sad']]), flip: true });
    }
    // not the prompt: a bubble, stamped out
    if (t > tPr - .3) { const kp = stamp(t, tPr - .3) * (1 - ease(seg(t, tCode - .5, tCode - .2))); if (kp > .01) { push(); translate(960, 330); scale(kp); bubble(0, 0, 260, 150, INK.paper, { dots: true }); pop(); stampX(960, 330, 90, stamp(t, tPr) * kp); } }
    // it's the code base: both floors light up
    if (t > tCode - .1) { const kf = ease(seg(t, tCode - .1, tCode + .3)); paint(rectPts(260, 900, 560 * kf, 24), { fill: INK.gold }); paint(rectPts(1100, 900, 560 * kf, 24), { fill: INK.orange }); burst(960, 880, 80, seg(t, tCode, tCode + .6), INK.gold, 10); }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · two projects: one pattern and a three-minute review; three patterns and a thirty-minute one ----------
  function shotTwo(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('two');
    riso({ seed: 72 });
    const tEnd = wt('two', 'endpoint'), tSame = wt('two', 'same'), tHand = wt('two', 'handler'), tSch = wt('two', 'schema'), tTest = wt('two', 'test'), tReads = wt('two', 'reads'), tFol = wt('two', 'follows', 1),
      tRev = wt('two', 'review'), tThree = wt('two', 'three'), tSec = wt('two', 'second'), tFold = wt('two', 'folders'), tThr = wt('two', 'thrown'), tRet = wt('two', 'returned'), tNull = wt('two', 'null'),
      tCopy = wt('two', 'copies'), tRev2 = wt('two', 'review', 1), tThirty = wt('two', '30'), tThats = wt('two', 'thats');
    const pan = ease(seg(T, tSec - .5, tSec + .2));
    camBegin(960 + 1920 * pan, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, 3840 + 400, H + 400), { fill: INK.paper });
    paint(rectPts(1920, -200, 2120, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 960, 4240, 400), { fill: INK.navy, tone: .8 });
    // project one: columns that line up
    const X = [340, 620, 900], aligned = ease(seg(t, tSame - .1, tSame + .4));
    X.forEach((x, c) => { const k = [tHand, tSch, tTest].map((tt, i) => stamp(t, Math.min(tt, tEnd + c * .15 + i * .1) - .1)); trio(x, 260 + 30 * (1 - aligned) * (c - 1), k); });
    if (aligned > .01) for (let i = 0; i < 3; i++) paint(rectPts(240, 260 + i * 130 + 60, 760 * aligned, 6), { fill: INK.orange, tone: .6, over: true });
    // the agent adds a fourth column that matches
    const k4 = [0, 1, 2].map(i => stamp(t, tFol + i * .18));
    trio(1180, 260, k4);
    if (k4[2] > .9) paint(rrPts(1080, 190, 200, 400, 20), { fill: 'yellow', tone: .4, over: true });
    clawd(1520, 950, 17, { ...emotions(t, [[b.start, 'neutral'], [tReads - .1, 'thinking', { lookX: -1 }], [tFol, 'determined', { lookX: -1 }], [tRev, 'happy']]), flip: true });
    const kc = stamp(t, tRev - .1); if (kc > .01) { push(); translate(1640, 260); scale(kc); stopwatch(0, 0, 110, TAU * .05 * ease(seg(t, tThree, tThree + .5)), INK.navy, .05 * ease(seg(t, tThree, tThree + .5))); pop(); check(1760, 200, 1, stamp(t, tThree + .6)); }
    // project two: three kinds of folder, three kinds of error
    const X2 = 1920;
    [[X2 + 330, 300, INK.navy, -.08, 220], [X2 + 650, 330, INK.orange, .1, 170], [X2 + 950, 290, INK.green, -.14, 250]].forEach(([x, y, col, rot, w], i) => { const k = stamp(t, tFold - .6 + i * .2); if (k <= .01) return; push(); translate(x, y); rotate(rot); scale(k); folder(0, 0, w, w * .7, col); pop(); });
    const err = (x, t0, fn) => { const k = stamp(t, t0 - .1); if (k <= .01) return; push(); translate(x, 650); scale(k); paint(ellPts(0, 0, 100, 100, 40), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); pop(); };
    err(X2 + 330, tThr, () => { paint(ellPts(0, 12, 48, 48, 28), { fill: INK.dark }); inkLine([[20, -30], [40, -60]], 1.4, INK.brown, 'ink', 0, { force: true }); paint(starPts(44, -66, 20, .4, 6), { fill: INK.orange }); });
    err(X2 + 650, tRet, () => { paint(rectPts(-60, -38, 120, 76), { fill: INK.gold }); paint([[-60, -38], [0, 10], [60, -38]], { fill: INK.orange }); });
    err(X2 + 950, tNull, () => { for (let j = 0; j < 10; j++) { const a = j / 10 * TAU; arcLine(0, 0, 50, 10, INK.navy, { a0: a, a1: a + TAU / 20 }); } });
    // the agent copies whatever it saw last: a card that matches nothing
    if (t > tCopy - .1) { const k = stamp(t, tCopy - .1); push(); translate(X2 + 1270, 520); rotate(.18); scale(k); card(-100, -70, 200, 140, INK.brown); paint(rrPts(-100, 30, 90, 40, 10), { fill: INK.orange }); pop(); }
    clawd(X2 + 1250, 950, 17, { ...emotions(t, [[tSec, 'neutral'], [tCopy - .1, 'nervous'], [tThats, 'sad']]) });
    const kc2 = stamp(t, tRev2 - .1); if (kc2 > .01) { const w = .5 * ease(seg(t, tThirty - .2, tThirty + .7)); push(); translate(X2 + 1270, 200); scale(kc2 * .9); stopwatch(0, 0, 110, TAU * w, INK.navy, w); pop(); }
    if (t > tRev2 - .4) skipper(X2 + 1640, 1060 + 400 * (1 - stamp(t, tRev2 - .4)), 19, skipAct(t, [[tRev2 - .4, 'stand', { mood: 'worried', flip: true }], [tThats - .1, 'facepalm', { mood: 'sad', flip: true }]]));
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- C · implicit context: the agent looks for patterns, like a new hire ----------
  function shotImplicit(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('implicit');
    riso({ seed: 73 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tConv = wt('implicit', 'convention'), tExp = wt('implicit', 'explores'), tPat = wt('implicit', 'patterns'), tTests = wt('implicit', 'tests'), tFile = wt('implicit', 'file'), tGoes = wt('implicit', 'goes'),
      tTools = wt('implicit', 'tools'), tSearch = wt('implicit', 'search'), tFinds = wt('implicit', 'finds'), tAll = wt('implicit', 'all', -1);
    // a grid of file pairs: source (paper) + its test (green corner)
    const cx = c => 250 + c * 330, cy = r => 230 + r * 230;
    const scan = seg(t, tSearch - .2, tFinds);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const last = r === 2 && c === 2, k = last ? stamp(t, tFile - .1) : stamp(t, tConv - .2 + (r * 3 + c) * .06);
      if (k <= .01) continue;
      const dropY = last ? -300 * (1 - ease(seg(t, tFile - .1, tFile + .3))) : 0;
      push(); translate(cx(c), cy(r) + dropY); scale(k); fileIcon(-60, 0, 1.1, INK.paper); pop();
      const kt = last ? ease(seg(t, tGoes - .4, tGoes)) : 1;
      if (kt > .01) { push(); translate(lerp(cx(c) + 400, cx(c), kt) + 60, cy(r)); scale(k); fileIcon(0, 0, 1.1, INK.paper, INK.green); pop(); }
      // the pattern: a gold bracket under each pair
      const kb = last ? ease(seg(t, tGoes, tGoes + .3)) : ease(seg(t, tPat - .1 + (r * 3 + c) * .05, tPat + .3 + (r * 3 + c) * .05));
      if (kb > .01) paint(rrPts(cx(c) - 110, cy(r) + 70, 230 * kb, 12, 6), { fill: INK.gold });
      // the search: every test file flashes
      if (t > tFinds - .1 && kt > .9) paint(rrPts(cx(c) + 10, cy(r) - 65, 100, 130, 10), { fill: 'yellow', tone: .6 * (1 - .5 * seg(t, tAll + .5, tAll + 1.2)), over: true });
    }
    if (scan > 0 && scan < 1) paint(rectPts(100, 100 + 640 * scan, 1060, 10), { fill: INK.orange, over: true });
    check(1180, 180, 1.4, stamp(t, tAll));
    // the new hire with a magnifier
    const mag = seg(t, tExp - .1, tPat + .3);
    if (mag > 0 && mag < 1) { const mx = lerp(200, 1100, ease(mag)), my = 300 + 300 * Math.sin(mag * Math.PI * 1.5); arcLine(mx, my, 90, 18, INK.navy); paint(ellPts(mx, my, 80, 80, 36), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[mx + 64, my + 64], [mx + 150, my + 150]], 28), { fill: INK.navy }); }
    const kt = stamp(t, tTools - .15);
    if (kt > .01) { push(); translate(1560, 360); scale(kt); terminal(0, 0, 420, 260, Math.min(5, 1 + Math.floor(Math.max(0, t - tTools) * 4))); pop(); }
    clawd(1560, 950, 18, { ...emotions(t, [[b.start, 'neutral'], [tExp, 'thinking', { lookX: -1 }], [tPat + .4, 'happy'], [tGoes, 'proud'], [tTools, 'determined', { lookY: -1 }], [tFinds, 'excited']]), flip: true });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- D · the instruction file: AGENTS.md, five sections ----------
  function shotFile(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('file');
    riso({ seed: 74 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tIns = wt('file', 'instruction'), tRoot = wt('file', 'root'), tAg = wt('file', 'agents'), tStd = wt('file', 'standard'), tOv = wt('file', 'overview'), tCmd = wt('file', 'commands'),
      tArch = wt('file', 'architecture'), tConv = wt('file', 'conventions'), tPit = wt('file', 'pitfalls'), tThirty = wt('file', '30'), tSess = wt('file', 'session'), tWeek = wt('file', 'week');
    const DX = 640, DY = 470;
    // roots into the project
    const kr = ease(seg(t, tRoot - .2, tRoot + .5));
    if (kr > 0) for (let i = 0; i < 5; i++) { const ex = DX - 400 + i * 200; inkLine([[DX, DY + 380], [lerp(DX, ex, kr), DY + 380 + 90 * kr]], 1.4, INK.brown, 'ink', 0, { force: true }); folder(lerp(DX, ex, kr), DY + 500, 110 * kr, 70 * kr, INK.brown, .8); }
    // the document
    const kd = stamp(t, tIns - .2);
    if (kd > .01) {
      push(); translate(DX, DY); scale(kd);
      paint(rrPts(-280, -380, 560, 760, 28), { fill: INK.paper, ink: INK.navy, sw: 1.6 });
      if (t > tAg - .15) { const ka = stamp(t, tAg - .15); paint(rrPts(-280, -380, 560, 110, 28), { fill: INK.navy }); paint(rectPts(-280, -300, 560, 30), { fill: INK.navy }); type('AGENTS.MD', 0, -322, 64, INK.gold, { pop: ka }); }
      const sec = [tOv, tCmd, tArch, tConv, tPit];
      sec.forEach((ts, i) => {
        const k = stamp(t, ts - .15); if (k <= .01) return;
        const y = -200 + i * 116;
        push(); translate(-200, y); scale(k);
        if (i === 0) { paint(ellPts(0, 0, 38, 38, 24), { fill: INK.green }); paint(ellPts(0, 0, 14, 38, 20), { fill: INK.paper, tone: .6, over: true }); }
        if (i === 1) { paint(rrPts(-40, -32, 80, 64, 10), { fill: INK.navy }); paint([[-24, -14], [-4, 0], [-24, 14]], { fill: INK.yellow }); paint(rectPts(2, 10, 20, 6), { fill: INK.yellow }); }
        if (i === 2) { paint(rrPts(-40, -32, 80, 64, 6), { fill: INK.navy, tone: .8 }); for (let j = 0; j < 3; j++) { paint(rectPts(-40 + j * 27, -32, 2, 64), { fill: INK.paper }); paint(rectPts(-40, -32 + j * 21, 80, 2), { fill: INK.paper }); } }
        if (i === 3) { paint(rectPts(-44, -14, 88, 28), { fill: INK.gold }); for (let j = 0; j < 7; j++) paint(rectPts(-38 + j * 12, -14, 3, j % 2 ? 10 : 16), { fill: INK.navy }); }
        if (i === 4) { paint([[0, -38], [42, 32], [-42, 32]], { fill: INK.orange }); paint(rectPts(-4, -12, 8, 24), { fill: INK.navy }); paint(ellPts(0, 22, 5, 5, 8), { fill: INK.navy }); }
        pop();
        paint(rrPts(-130, y - 12, 330 * k * (.6 + .4 * hash(i + 4)), 24, 12), { fill: INK.navy, tone: .5 });
        if (t > ts - .15 && t < ts + .7) paint(rrPts(-260, y - 50, 520, 100, 14), { fill: 'yellow', tone: .4 * (1 - seg(t, ts + .3, ts + .7)), over: true });
      });
      pop();
    }
    // the cross-tool standard: badges plug in
    const BX = [1150, 1340, 1530, 1700], BY = [230, 170, 230, 330];
    BX.forEach((x, i) => { const k = stamp(t, tStd - .6 + i * .12); if (k <= .01) return; const e = ease(seg(t, tStd - .6 + i * .12, tStd + i * .12)); inkLine([[DX + 290, DY - 300 + i * 30], [lerp(DX + 290, x, e), lerp(DY - 300 + i * 30, BY[i], e)]], 1, INK.navy, 'ink', 0, { force: true, tone: .7 }); push(); translate(x, BY[i]); scale(k); paint(i % 2 ? rrPts(-50, -50, 100, 100, 20) : ellPts(0, 0, 55, 55, 30), { fill: [INK.orange, INK.navy, INK.green, INK.gold][i] }); paint(ellPts(0, 0, 18, 18, 14), { fill: INK.paper }); pop(); });
    // thirty minutes to write
    const kw = stamp(t, tThirty - .15);
    if (kw > .01) { push(); translate(1450, 560); scale(kw * .85); stopwatch(0, 0, 110, TAU * .5 * ease(seg(t, tThirty, tThirty + .6)), INK.navy, .5 * ease(seg(t, tThirty, tThirty + .6))); pop(); }
    // every session starts with it
    clawd(1560, 960, 18, { ...emotions(t, [[b.start, 'neutral', { lookX: -1 }], [tSess - .1, 'thinking', { lookX: -1 }], [tWeek - .1, 'starstruck']]), flip: true });
    if (t > tWeek - .1) glow(DX, DY, 360 * stamp(t, tWeek - .1), 'yellow', .45);
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · keep it short; point to deeper docs; keep it up to date ----------
  function shotShort(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('short');
    riso({ seed: 75 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tShort = wt('short', 'short'), tTax = wt('short', 'tax'), tPoint = wt('short', 'point'), tDeep = wt('short', 'deeper'), tDocs = wt('short', 'documents'), tDate = wt('short', 'date'),
      tOld = wt('short', 'outdated'), tWorse = wt('short', 'worse'), tTrust = wt('short', 'trust');
    // the scroll: long, then rolled up short
    const roll = backOut(seg(t, tShort - .1, tShort + .4)), h = lerp(820, 300, clamp(roll, 0, 1.1)), sx = 520, sy = 120;
    const old = ease(seg(t, tOld - .1, tOld + .5));
    paint(rrPts(sx - 170, sy, 340, h, 20), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
    if (old > 0) paint(rrPts(sx - 170, sy, 340, h, 20), { fill: INK.brown, tone: .35 * old, over: true });
    const lines = Math.floor((h - 60) / 44);
    for (let i = 0; i < lines; i++) paint(rrPts(sx - 130, sy + 40 + i * 44, 220 * (.5 + .5 * hash(i + 2)), 16, 8), { fill: INK.navy, tone: .5 });
    paint(rrPts(sx - 190, sy - 20, 380, 40, 20), { fill: INK.gold });
    paint(rrPts(sx - 190, sy + h - 20, 380, 40, 20), { fill: INK.gold });
    // every line is a tax on every task: coins pop out
    if (t > tTax - .2) for (let i = 0; i < 5; i++) { const f = seg(t, tTax - .2 + i * .12, tTax + .6 + i * .12); if (f <= 0 || f >= 1) continue; const p = arcPt([sx + 170, sy + 60 + i * 44], [1000 + i * 40, 900], 200, f); paint(ellPts(p[0], p[1], 26, 26, 20), { fill: INK.gold, ink: INK.brown, sw: .8 }); }
    // point to deeper documents: arrows to three books
    const kbk = [0, 1, 2].map(i => stamp(t, tDeep - .15 + i * .1));
    for (let i = 0; i < 3; i++) if (kbk[i] > .01) { push(); translate(1350 + i * 130, 330); scale(kbk[i]); paint(rrPts(-50, -120, 100, 240, 10), { fill: [INK.navy, INK.orange, INK.green][i] }); paint(rectPts(-30, -80, 60, 10), { fill: INK.paper }); pop(); }
    const ka = ease(seg(t, tDocs - .1, tDocs + .4));
    if (ka > 0 && old < 1) for (let i = 0; i < 3; i++) { const x1 = lerp(sx + 180, 1290 + i * 130, ka), y1 = lerp(sy + 150, 330 + 140, ka); inkLine([[sx + 180, sy + 150], [x1, y1]], 1.2, INK.orange, 'ink', 0, { force: true, over: true }); }
    // keep it up to date: a calendar with a refresh loop
    const kc = stamp(t, tDate - .15);
    if (kc > .01) { push(); translate(1060, 300); scale(kc * .8); paint(rrPts(-100, -90, 200, 190, 16), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-100, -90, 200, 50, 16), { fill: INK.orange }); arcLine(0, 30, 50, 12, INK.navy, { a0: t * 3, a1: t * 3 + 4.5, cap: 'round' }); pop(); }
    // outdated: the signpost points the wrong way, and the agent trusts it
    const flip = backOut(seg(t, tOld, tOld + .4));
    push(); translate(900, 960); paint(rectPts(-10, -300, 20, 300), { fill: INK.brown });
    push(); translate(0, -250); scale(lerp(1, -1, clamp(flip, 0, 1)), 1); paint([[-90, -40], [90, -40], [130, 0], [90, 40], [-90, 40]], { fill: old > .5 ? INK.orange : INK.green }); pop(); pop();
    const walk = seg(t, tTrust - .3, tTrust + 1.5), cx = lerp(1350, 700, ease(walk));
    clawd(cx, 950, 16, { ...emotions(t, [[b.start, 'neutral', { lookX: -1 }], [tTax - .1, 'nervous'], [tPoint, 'happy', { lookX: 1 }], [tWorse, 'neutral'], [tTrust - .3, 'happy', { emote: '!', emoteK: 1 }]]), ...(walk > 0 && walk < 1 ? move('walk', T, 1) : {}), flip: true, emoteAge: t - tTrust });
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- F · skills: procedures that load when needed; file → skill → hook ----------
  function shotSkills(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('skills');
    riso({ seed: 76 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tSk = wt('skills', 'skills'), tFile = wt('skills', 'file'), tName = wt('skills', 'name'), tDesc = wt('skills', 'description'), tNeeds = wt('skills', 'needs'), tProg = wt('skills', 'progression'),
      tWrong = wt('skills', 'wrong'), tIns = wt('skills', 'instruction'), tSkill = wt('skills', 'skill', -1), tNever = wt('skills', 'never'), tHook = wt('skills', 'hook');
    const out = ease(seg(t, tProg - .4, tProg));
    // part 1: a shelf of skill folders
    if (out < 1) {
      push(); translate(0, -700 * easeIn(out));
      paint(rectPts(200, 640, 1520, 26), { fill: INK.brown });
      for (let i = 0; i < 5; i++) {
        const k = stamp(t, tSk - .2 + i * .1); if (k <= .01) continue;
        const x = 340 + i * 310, open = i === 2 ? ease(seg(t, tNeeds - .1, tNeeds + .4)) : 0;
        push(); translate(x, 520); scale(k);
        if (open > 0) for (let j = 0; j < 4; j++) { push(); rotate((j - 1.5) * .25 * open); translate(0, -160 * open); paint(rrPts(-70, -90, 140, 180, 10), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let l = 0; l < 3; l++) paint(rectPts(-45, -50 + l * 34, 90, 10), { fill: INK.navy, tone: .5 }); pop(); }
        if (i === 0 && t > tFile - .1) { const kf = ease(seg(t, tFile - .1, tFile + .3)); paint(rrPts(-60, -60 - 70 * kf, 120, 150, 8), { fill: INK.paper, ink: INK.navy, sw: 1 }); }
        folder(0, 20, 230, 170, [INK.navy, INK.green, INK.orange, INK.navy, INK.green][i]);
        paint(rrPts(-95, -80, 70, 14, 7), { fill: INK.paper });
        paint(rrPts(-80, 10, 150 * (.6 + .4 * hash(i + 2)), 14, 7), { fill: INK.paper, tone: .8 });
        if (t > tName - .1) paint(rrPts(-105, -92, 90, 38, 10), { fill: 'yellow', tone: .6, over: true });
        if (t > tDesc - .1) paint(rrPts(-95, -4, 180, 40, 10), { fill: 'yellow', tone: .6, over: true });
        pop();
      }
      pop();
    }
    // part 2: the progression — three rising steps
    const steps = [[420, 860, tIns], [960, 720, tSkill], [1500, 580, tHook]];
    if (out > 0) {
      steps.forEach(([x, y, t0], i) => {
        const k = ease(seg(t, tProg - .2 + i * .15, tProg + .3 + i * .15)); if (k <= 0) return;
        paint(rectPts(x - 240, y + (1 - k) * 400, 480, 1200), { fill: INK.navy, tone: .25 + i * .15 });
        const ki = stamp(t, t0 - .15); if (ki <= .01) return;
        push(); translate(x, y - 140); scale(ki);
        if (i === 0) fileIcon(0, 0, 1.4, INK.paper, INK.gold);
        if (i === 1) { folder(0, 10, 200, 150, INK.green); paint(rrPts(-60, -30, 120, 14, 7), { fill: INK.paper }); }
        if (i === 2) { hookIcon(20, 20, .9); lock(-70, 60, .8); }
        pop();
      });
      // the agent climbs as each tier lands
      const lvl = t < tIns ? -1 : t < tSkill ? 0 : t < tHook ? 1 : 2;
      const from = steps[Math.max(0, lvl - 1)], to = steps[Math.max(0, lvl)], t0 = lvl <= 0 ? tIns : steps[lvl][2];
      const hp = seg(t, t0, t0 + .5), p = arcPt([from[0] + 150, from[1]], [to[0] + 150, to[1]], 120, ease(hp));
      if (t > tProg) clawd(lvl < 0 ? steps[0][0] + 150 : p[0], lvl < 0 ? steps[0][1] : p[1], 10, { ...emotions(t, [[tProg, 'neutral'], [tWrong - .2, 'confused', { emote: '?', emoteK: 1 }], [tIns, 'happy'], [tNever, 'determined'], [tHook + .2, 'proud']]), emoteAge: t - tWrong, flip: true });
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- G · conventions as memory: the same correction, session after session, until it's encoded ----------
  function shotMemory(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('memory');
    riso({ seed: 77 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tMem = wt('memory', 'memory'), tWith = wt('memory', 'without'), tS = [0, 1, 2].map(i => wt('memory', 'session', i)), tEnc = wt('memory', 'encode'), tLint = wt('memory', 'linter'),
      tGone = wt('memory', 'gone'), tGood = wt('memory', 'good');
    // part 1: the agent's long-term memory is the shape of the project
    const p2 = ease(seg(t, tWith - .2, tWith + .3));
    if (p2 < 1) {
      push(); translate(0, 800 * easeIn(p2));
      clawd(760, 880, 22, { ...emotions(t, [[b.start, 'thinking'], [tMem, 'happy']]) });
      const kc = stamp(t, b.start + .2);
      if (kc > .01) { push(); translate(1200, 380); scale(kc); for (const [dx, dy, r] of [[-180, 40, 110], [-60, -60, 140], [100, -40, 130], [200, 60, 100], [0, 80, 150]]) paint(ellPts(dx, dy, r, r * .8, 32), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (const [dx, dy, r] of [[-180, 40, 110], [-60, -60, 140], [100, -40, 130], [200, 60, 100], [0, 80, 150]]) paint(ellPts(dx, dy, r - 6, r * .8 - 6, 32), { fill: INK.paper }); for (let c = 0; c < 3; c++) trio(-140 + c * 140, -70, [.45, .45, .45].map(v => v * stamp(t, tMem - .3 + c * .12)).map(v => v), 0); pop(); paint(ellPts(940, 640, 26, 22, 16), { fill: INK.paper, ink: INK.navy, sw: 1 }); paint(ellPts(1000, 560, 36, 30, 16), { fill: INK.paper, ink: INK.navy, sw: 1 }); }
      pop();
    }
    // part 2: three sessions, the same mistake each time
    if (p2 > 0) {
      const X = [380, 960, 1540], fixed = ease(seg(t, tGone - .2, tGone + .4));
      X.forEach((x, i) => {
        const k = stamp(t, tS[i] - .2); if (k <= .01) return;
        push(); translate(x, 420); scale(k);
        paint(rrPts(-240, -260, 480, 440, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
        type(String(i + 1), -180, -200, 60, INK.navy, { tone: .6 });
        clawd(-60, 130, 11, { ...feel(fixed > .5 ? 'happy' : 'nervous', T) });
        if (fixed < 1) { push(); translate(110, 20); scale(1 - fixed); paint(through([[-50, 20], [-30, -40], [20, -50], [50, -10], [40, 40], [-10, 50], [-50, 20]]), { fill: INK.orange }); pop(); stampX(110, 20, 60, stamp(t, tS[i] + .3) * (1 - fixed), INK.navy); }
        check(110, 20, 1.3, stamp(t, tGone + i * .12));
        pop();
      });
      // encode it once: a slab stamps into the ground, with a ruler (the linter rule)
      const ke = stamp(t, tEnc - .1);
      if (ke > .01) { push(); translate(960, 950 + 200 * (1 - ke)); paint(rrPts(-420, -60, 840, 120, 20), { fill: INK.dark }); for (let c = 0; c < 6; c++) paint(rrPts(-380 + c * 130, -30, 100, 60, 10), { fill: TRIO[c % 3] }); pop(); }
      const kl = stamp(t, tLint - .1);
      if (kl > .01) { push(); translate(1500, 850); rotate(-.1); scale(kl); paint(rectPts(-180, -30, 360, 60), { fill: INK.gold }); for (let j = 0; j < 13; j++) paint(rectPts(-170 + j * 28, -30, 5, j % 2 ? 22 : 36), { fill: INK.navy }); pop(); }
      if (t > tGood - .1 && t < tGood + .7) burst(960, 420, 220, seg(t, tGood - .1, tGood + .7), INK.gold, 16);
    }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · legible, predictable, boring: a town the agent lives in ----------
  function shotBoring(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('boring');
    riso({ seed: 78 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, -100], to: [0, 900], a: .35, b: .1 } });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tEnv = wt('boring', 'environment'), tLive = wt('boring', 'live'), tLeg = wt('boring', 'legible'), tPred = wt('boring', 'predictable'), tBor = wt('boring', 'boring'), tCode = wt('boring', 'code', 1),
      tBel = wt('boring', 'belongs'), tLog = wt('boring', 'log');
    const snap = backOut(seg(t, tPred - .1, tPred + .4)), calm = ease(seg(t, tBor - .1, tBor + .5));
    const house = (x, y, col, k, i) => { if (k <= .01) return; push(); translate(x, y); scale(k); paint(rectPts(-80, -120, 160, 120), { fill: col }); paint([[-100, -120], [0, -210], [100, -120]], { fill: INK.brown }); paint(rectPts(-22, -64, 44, 64), { fill: INK.paper, tone: .9 }); if (t > tLeg - .1 + i * .05) { const ks = stamp(t, tLeg - .1 + i * .05); paint(rrPts(-60 * ks, -170, 120 * ks, 34, 8), { fill: INK.paper, ink: INK.navy, sw: .8 }); paint(rrPts(-40 * ks, -160, 80 * ks, 12, 6), { fill: INK.navy, tone: .7 }); } pop(); };
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
      const i = r * 5 + c, k = stamp(t, tEnv - .3 + i * .06);
      const jx = (hash(i + 3) - .5) * 90 * (1 - clamp(snap)), jy = (hash(i + 8) - .5) * 60 * (1 - clamp(snap));
      const col = calm > .5 ? TRIO[r] : [INK.orange, INK.green, INK.navy, INK.gold, INK.brown][(i * 3) % 5];
      house(260 + c * 250 + r * 125 + jx, 560 + r * 300 + jy, col, k, i);
    }
    // the agent builds one more that matches
    const kn = stamp(t, tCode - .1);
    house(1640, 860, TRIO[1], kn, 11);
    check(1720, 560, 1.3, stamp(t, tBel));
    const walk = seg(t, tLive - .3, tLive + 1.2);
    clawd(lerp(-100, 1460, ease(walk)), 960, 12, { ...emotions(t, [[b.start, 'happy'], [tCode - .2, 'determined'], [tBel, 'proud']]), ...(walk > 0 && walk < 1 ? move('walk', T, 2) : {}) });
    if (t > tBel + .8) { const ks = stamp(t, tBel + .8); skipper(140, 1060 + 300 * (1 - ks), 16, { ...SKIP_POSES.hips, mood: 'proud', t }); }
    // next: the ship's log
    const kl = stamp(t, tLog - .3);
    if (kl > .01) { push(); translate(1600, 200); scale(kl); glow(0, 0, 200, 'yellow', .7); paint(rrPts(-130, -80, 260, 160, 14), { fill: INK.brown }); paint(rrPts(-120, -70, 115, 140, 10), { fill: INK.paper }); paint(rrPts(5, -70, 115, 140, 10), { fill: INK.paper }); for (let j = 0; j < 4; j++) { paint(rectPts(-105, -45 + j * 28, 85, 6), { fill: INK.navy, tone: .6 }); paint(rectPts(20, -45 + j * 28, 85, 6), { fill: INK.navy, tone: .6 }); } pop(); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { identLong(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '08', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotHookIn(T0, lt, dur) { shotHook(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('hook', 0), shotHookIn],
    [shotAt('two'), shotTwo],
    [shotAt('implicit'), shotImplicit],
    [shotAt('file'), shotFile],
    [shotAt('short'), shotShort],
    [shotAt('skills'), shotSkills],
    [shotAt('memory'), shotMemory],
    [shotAt('boring'), shotBoring],
    [B.boring.end + .9, shotEnd],
  ]);
})();
