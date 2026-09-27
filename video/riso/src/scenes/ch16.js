// ch16.js: Chapter 16 · When Agents Get It Wrong. Storyboard: video/storyboards/ch16.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.orange : INK.paper, tone: .9 }); };
  const bug = (x, y, s, col = INK.dark) => { push(); translate(x, y); scale(s); for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) inkLine([[0, -10 + i * 16], [sd * 44, -22 + i * 22]], 1, col, 'ink', 0, { force: true }); paint(ellPts(0, 6, 26, 34, 20), { fill: col }); paint(ellPts(0, -30, 16, 14, 16), { fill: col }); pop(); };
  const giftBox = (x, y, s, o = {}) => { push(); translate(x, y); scale(s); if (o.ghost) { for (let i = 0; i < 20; i++) { const P = u => u < .25 ? [-150 + 1200 * u, -110] : u < .5 ? [150, -110 + 880 * (u - .25)] : u < .75 ? [150 - 1200 * (u - .5), 110] : [-150, 110 - 880 * (u - .75)]; inkLine([P(i / 20), P(i / 20 + 1 / 40)], 1.6, INK.navy, 'ink', 0, { force: true }); } pop(); return; } paint(rrPts(-150, -110, 300, 220, 14), { fill: INK.gold }); if (o.hazard) for (let i = 0; i < 5; i++) paint([[-150 + i * 70, 110], [-110 + i * 70, 110], [-40 + i * 70, -110], [-80 + i * 70, -110]].map(([a, b]) => [clamp(a, -150, 150), b]), { fill: INK.dark, over: true, tone: .7 }); paint(rectPts(-18, -110, 36, 220), { fill: INK.navy }); paint(rrPts(-170, -140, 340, 50, 12), { fill: INK.gold }); paint(rectPts(-18, -140, 36, 50), { fill: INK.navy }); pop(); };
  const hooded = (x, y, s, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint([[-110, 0], [-90, -260], [90, -260], [110, 0]], { fill: INK.dark, curv: .3 }); paint(ellPts(0, -330, 90, 100, 36), { fill: INK.dark }); paint(ellPts(0, -310, 56, 64, 30), { fill: INK.navy, tone: .6 }); for (const sd of [-1, 1]) paint(ellPts(sd * 20, -316, 8, 6, 10), { fill: INK.yellow }); pop(); };
  const hourglass = (x, y, s, sand = .5) => { push(); translate(x, y); scale(s); paint(rrPts(-70, -110, 140, 20, 8), { fill: INK.brown }); paint(rrPts(-70, 90, 140, 20, 8), { fill: INK.brown }); paint([[-55, -90], [55, -90], [8, 0], [55, 90], [-55, 90], [-8, 0]], { fill: INK.paper, ink: INK.navy, sw: 1 }); paint([[-40 * (1 - sand), -80 + 70 * sand], [40 * (1 - sand), -80 + 70 * sand], [0, -6]], { fill: INK.gold }); paint([[-50 * sand, 88], [50 * sand, 88], [0, 88 - 60 * sand]], { fill: INK.gold }); pop(); };
  const bubbleIcon = (x, y, s) => { paint(ellPts(x, y, 20 * s, 20 * s, 14), { fill: INK.orange }); };

  // the series ident with the title on two lines (common.js prints it on one)
  function identTwo(T, lt, dur, num, title) {
    const t = onTwos(lt), inK = (a, b) => 1 - backOut(seg(t, a, b));
    riso({ seed: 2, shift: { yellow: [0, -1300 * inK(.05, .7)], orange: [-2300 * inK(.3, .95), 0], federal: [2300 * inK(.55, 1.25), 0] } });
    camBegin(960, 540, 1 + .03 * ease(seg(t, 0, dur)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, H + 100], to: [0, 250], a: .55, b: 0 } });
    paint(rectPts(-200, 860, W + 400, 400), { fill: INK.navy });
    helm(520, 520, 250, TAU / 8 * backOut(seg(t, 2.7, 3.2)) + .06 * wob(t, .25));
    const w = title.toUpperCase().split(' '), h = Math.ceil(w.length / 2);
    type('THE AGENTIC CREW', 1300, 250, 40, INK.navy, { spacing: .18, pop: seg(t, 1.3, 1.6) });
    type(num, 1300, 430, 230, INK.orange, { pop: seg(t, 1.5, 1.85) });
    type(num, 1312, 440, 230, INK.navy, { pop: seg(t, 1.6, 1.95), over: true, tone: .55 });
    type(w.slice(0, h).join(' '), 1300, 630, 84, INK.navy, { pop: seg(t, 1.9, 2.3) });
    type(w.slice(h).join(' '), 1300, 740, 84, INK.navy, { pop: seg(t, 2.0, 2.4) });
    camEnd();
  }

  // ---------- A · a one-line fix; thirty-two files later, the bug is still there ----------
  function shotCoffee(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('coffee');
    riso({ seed: 161 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tDrop = wt('coffee', 'dropdown'), tModal = wt('coffee', 'modal'), tCof = wt('coffee', 'coffee'), t32 = wt('coffee', '32'), tRew = wt('coffee', 'rewritten'),
      tOrig = wt('coffee', 'original'), tBug = wt('coffee', 'bug'), tSt = wt('coffee', 'stories');
    // the UI: a dropdown tucked behind a modal
    const kd = stamp(t, tDrop - .2), km = stamp(t, tModal - .2);
    if (kd > .01) { push(); translate(560, 520); scale(kd); paint(rrPts(-200, -60, 400, 80, 14), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rrPts(-200, 30 + i * 70, 400, 60, 10), { fill: INK.paper, ink: INK.orange, sw: 1.2 }); pop(); }
    if (km > .01) { push(); translate(800, 520); scale(km); paint(rrPts(-280, -220, 560, 440, 26), { fill: INK.navy, tone: .85, over: true }); paint(rrPts(-280, -220, 560, 60, 24), { fill: INK.navy }); paint(rrPts(-200, 110, 160, 56, 20), { fill: INK.gold }); pop(); }
    // the flood: thirty-two files
    const fall = easeIn(seg(t, tOrig - .3, tOrig + .3));
    if (t > tCof && fall < 1) for (let i = 0; i < 32; i++) {
      const k = stamp(t, tCof + .2 + i * (t32 - tCof - .1) / 32); if (k <= .01) continue;
      const c = i % 8, r = Math.floor(i / 8), x = 200 + c * 150 + 20 * hash(i), y = 200 + r * 180 + 700 * fall * (1 + hash(i + 7));
      push(); translate(x, y); rotate((hash(i + 2) - .5) * .3 + fall * (hash(i) - .5) * 2); fileIcon(0, 0, k * 1.1, t > tRew + i * .02 ? INK.orange : INK.paper); pop();
    }
    const k32 = stamp(t, t32 - .15) * (1 - ease(seg(t, tOrig - .3, tOrig)));
    if (k32 > .01) { type('32', 1520, 330, 280 * k32, INK.orange); type('32', 1534, 342, 280 * k32, INK.navy, { over: true, tone: .5 }); }
    // the original bug, still there under the modal
    const kb = stamp(t, tBug - .2);
    if (kb > .01) { bug(470, 560, 1.1 * kb); arcLine(470, 560, 110, 14, INK.orange, { over: true, a0: 0, a1: TAU * ease(seg(t, tBug, tBug + .5)) }); }
    // the Skipper with his coffee
    const steam = u => { paint(rrPts(-.9 * u, -1.2 * u, 1.8 * u, 2 * u, .3 * u), { fill: INK.paper, ink: INK.navy, sw: .8 }); for (let i = 0; i < 2; i++) inkLine([[(-.3 + i * .6) * u, -1.6 * u], [(-.1 + i * .6 + .2 * Math.sin(t * 4 + i)) * u, -2.4 * u], [(-.3 + i * .6) * u, -3.2 * u]], .6, INK.navy, 'ink', .5, { force: true, tone: .5 }); };
    skipper(1600, 1040, 17, { ...skipAct(t, [[b.start, 'stand', { mood: 'neutral', flip: true }], [tCof - .3, 'think', { mood: 'proud', flip: true }], [t32, 'shrug', { mood: 'surprised', flip: true }], [tSt - .1, 'facepalm', { mood: 'sad', flip: true }]]), prop: t > tCof - .3 && t < t32 ? steam : null });
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 900, cy: 540 });
  }

  // ---------- B · the hallucinated library; slopsquatting ----------
  function shotLibrary(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('library');
    riso({ seed: 162 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .7 });
    const tImp = wt('library', 'imports'), tClean = wt('library', 'clean'), tTests = wt('library', 'tests'), tEx = wt('library', 'exist'), tRev = wt('library', 'review'),
      tRuns = wt('library', 'runs'), tSec = wt('library', 'security'), tAtt = wt('library', 'attackers'), tInv = wt('library', 'invent');
    clawd(360, 910, 18, { ...emotions(t, [[b.start, 'happy'], [tEx, 'surprised'], [tRuns, 'determined'], [tAtt, 'scared']]), boilKey: 'libc' });
    const BX = 960, BY = 600;
    // the package, then its ghost
    const kb = stamp(t, tImp - .15), ghost = t > tEx - .05;
    if (kb > .01 && !ghost) giftBox(BX, BY, kb);
    if (ghost) giftBox(BX, BY, 1, { ghost: true });
    if (t > tClean - .1 && t < tEx) for (let i = 0; i < 3; i++) { const k = stamp(t, tClean - .1 + i * .15); push(); translate(BX - 170 + i * 170, BY - 250); scale(k); paint(rrPts(-70, -50, 140, 100, 12), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(rrPts(-50, -30 + j * 24, 100 * (.5 + .5 * hash(i * 3 + j)), 10, 5), { fill: INK.paper }); pop(); }
    if (t < tEx) check(BX + 190, BY - 150, 1.2, stamp(t, tTests));
    if (ghost && t < tRev - .3) stampX(BX, BY, 150, stamp(t, tEx + .1) * (1 - ease(seg(t, tRev - .6, tRev - .3))));
    // review would have passed it: the magnifier gives it a check
    const kr = seg(t, tRev - .3, tRev + 1.1);
    if (kr > 0 && kr < 1) { const mx = lerp(BX - 260, BX + 260, ease(kr)), my = BY - 40; arcLine(mx, my, 120, 22, INK.navy); paint(ellPts(mx, my, 108, 108, 44), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[mx + 90, my + 90], [mx + 190, my + 190]], 34), { fill: INK.navy }); }
    if (t > tRev && t < tAtt) check(BX, BY - 20, 1.6, stamp(t, tRev + .5));
    // the tests run
    const kt = stamp(t, tRuns - .2);
    if (kt > .01) { push(); translate(1560, 300); scale(kt); terminal(0, 0, 360, 220, t > tRuns + .3 ? 5 : 2); pop(); }
    // a security decision: a lock; attackers register the name
    const kl = stamp(t, tSec - .15);
    if (kl > .01) { push(); translate(BX, BY - 290); scale(kl * 1.6); paint(rrPts(-34, -6, 68, 54, 8), { fill: INK.gold }); arcLine(0, -6, 24, 10, INK.navy, { a0: Math.PI, a1: TAU }); pop(); }
    const kh = backOut(seg(t, tAtt - .3, tAtt + .3));
    if (kh > .01) {
      hooded(1620 + 400 * (1 - kh), 920, 1);
      const f = ease(seg(t, tInv - .3, tInv + .3)), p = arcPt([1500, 640], [BX, BY], 200, f);
      if (t > tAtt) giftBox(p[0], p[1], lerp(.5, 1, f), { hazard: true });
    }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 900, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · the infinite loop: nineteen attempts; three is the limit ----------
  function shotLoop(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('loop');
    riso({ seed: 163 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    const tInf = wt('loop', 'infinite'), tErr = wt('loop', 'error'), t40 = wt('loop', '40'), t19 = wt('loop', '19'), tWorse = wt('loop', 'worse'), t3 = wt('loop', '3'),
      tStop = wt('loop', 'stop'), tRead = wt('loop', 'read'), tFresh = wt('loop', 'fresh');
    const CX = 700, CY = 520, R = 290;
    // the track: error, fix, error, fix
    const kt = stamp(t, tInf - .2, .45);
    if (kt > .01) {
      arcLine(CX, CY, R * kt, 40, INK.navy, { tone: .5 });
      const st = [[0, 'x'], [1, 'w'], [2, 'x'], [3, 'w']];
      st.forEach(([i, k]) => { const a = -Math.PI / 2 + i * TAU / 4, x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R, ks = stamp(t, tErr - .1 + i * .35) * kt; if (ks <= .01) return; paint(ellPts(x, y, 70 * ks, 70 * ks, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); if (k === 'x') stampX(x, y, 34 * ks, 1); else wrench(x, y + 20, .3 * ks, .7); });
      // the agent runs round and round until it's stopped
      const run = t > tErr ? (Math.min(t, tStop) - tErr) * .9 : 0, a = -Math.PI / 2 + run * TAU;
      clawd(CX + Math.cos(a) * R, CY + Math.sin(a) * R + 40, 8, { ...(t < tStop ? move('run', T, 2) : feel('sleepy', T)), flip: Math.cos(a) < 0, noShadow: true, boilKey: 'runner' });
    }
    // the counter climbs to nineteen
    if (t > tErr) {
      const n = t < t19 ? 1 + Math.floor(18 * ease(seg(t, tErr, t19))) : 19, k19 = t > t19 ? stamp(t, t19) : 1;
      type(String(n), 1400, 260, 200 * k19, t >= t19 ? INK.orange : INK.navy);
      if (t >= t19) type('19', 1412, 270, 200 * k19, INK.navy, { over: true, tone: .5 });
      // three notches: the limit
      for (let i = 0; i < 3; i++) { const k = stamp(t, t3 + i * .12); if (k > .01) paint(ellPts(1310 + i * 90, 420, 30 * k, 30 * k, 20), { fill: INK.green }); }
    }
    // a geological record of failed fixes
    const layers = Math.floor(14 * seg(t, tErr, tWorse + .3));
    for (let i = 0; i < layers; i++) paint(rrPts(1250 + 20 * hash(i), 900 - (i + 1) * 30, 300 - 30 * hash(i + 4), 28, 8), { fill: [INK.brown, INK.gold, INK.orange, INK.navy][i % 4], tone: .6 + .4 * hash(i + 1) });
    // the Skipper stops it; a fresh context slides in
    const kS = backOut(seg(t, tStop - .5, tStop));
    if (kS > .01) skipper(1790 + 300 * (1 - kS), 1040, 15, skipAct(t, [[tStop - .5, 'point', { mood: 'shout', flip: true }], [tRead, 'think', { mood: 'focused', flip: true }], [tFresh, 'present', { mood: 'grin', flip: true }]]));
    const kf = easeOut(seg(t, tFresh - .1, tFresh + .5));
    if (kf > .01) { const x = lerp(-900, CX - 400, kf); paint(rrPts(x, 140, 800, 780, 20), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint([[x + 650, 140], [x + 800, 140], [x + 800, 290]], { fill: INK.navy, tone: .3 }); }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 700, cy: 520 });
  }

  // ---------- D · the confident wrong answer: a sleep that turned the tests green ----------
  function shotConfident(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('confident');
    riso({ seed: 164 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tRace = wt('confident', 'race'), tSleep = wt('confident', 'sleep'), tGreen = wt('confident', 'green'), tProd = wt('confident', 'production'), tQueue = wt('confident', 'queue'),
      tDown = wt('confident', 'down'), tSig = wt('confident', 'signal'), tNec = wt('confident', 'necessary'), tSuf = wt('confident', 'sufficient');
    const out = ease(seg(t, tSig - .4, tSig));
    if (out < 1) {
      push(); translate(0, 900 * out);
      paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .75 });
      // one item, two workers racing for it
      paint(rrPts(820, 720, 280, 36, 12), { fill: INK.brown }); card(880, 590, 160, 130, INK.gold);
      const lunge = t > tRace && t < tSleep ? .5 + .5 * Math.sin((t - tRace) * 16) : 0;
      clawd(560 + 80 * lunge, 900, 17, { ...emotions(t, [[b.start, 'neutral'], [tRace, 'determined'], [tSleep + .3, 'sleepy'], [tProd + .3, 'nervous']]), boilKey: 'w1' });
      clawd(1360 - 80 * lunge, 900, 17, { ...emotions(t, [[b.start, 'neutral'], [tRace, 'determined'], [tProd + .3, 'nervous']]), flip: true, boilKey: 'w2' });
      const kh = stamp(t, tSleep - .2);
      if (kh > .01) hourglass(960, 400 - 200 * (1 - kh), 1.2, seg(t, tSleep, tSleep + 3));
      // tests: a lamp goes green
      const ok = t > tGreen; paint(ellPts(1640, 200, 70, 70, 36), { fill: ok ? INK.green : INK.orange }); paint(rrPts(1600, 270, 80, 60, 10), { fill: INK.navy });
      if (ok && t < tGreen + .5) glow(1640, 200, 180 * stamp(t, tGreen), 'yellow', .6);
      // production: twelve workers, a queue piling up, a service toppling
      if (t > tProd - .2) {
        for (let i = 0; i < 10; i++) { const k = stamp(t, tProd - .2 + i * .06); if (k > .01) clawd(160 + i * 170 + (i > 4 ? 60 : 0), 1010, 6 * k, { ...move('run', T + i * .2, i), boilKey: 'crowd' + i, noShadow: true }); }
        const q = Math.floor(10 * seg(t, tQueue - .3, tQueue + 1.2)); for (let i = 0; i < q; i++) card(160 + 8 * hash(i), 560 - i * 40, 150, 36, [INK.orange, INK.gold][i % 2], { bars: false });
        const fallA = t > tDown - .1 ? 1.5 * easeIn(seg(t, tDown - .1, tDown + .4)) : 0;
        push(); translate(1760, 880); rotate(fallA); paint(rrPts(-60, -380, 120, 380, 14), { fill: INK.navy }); for (let i = 0; i < 4; i++) paint(ellPts(0, -330 + i * 80, 14, 14, 12), { fill: fallA > .1 ? INK.orange : INK.green }); pop();
      }
      pop();
    }
    // the signal you give: a dart in the flag, not the bullseye
    if (out > 0) {
      push(); translate(0, -900 * (1 - out));
      for (let i = 0; i < 4; i++) paint(ellPts(900, 520, 320 - i * 80, 320 - i * 80, 60), { fill: i % 2 ? INK.paper : INK.navy, tone: i % 2 ? 1 : .8 });
      paint(ellPts(900, 520, 40, 40, 24), { fill: INK.orange });
      inkLine([[1200, 400], [1200, 170]], 1.4, INK.dark, 'ink', 0, { force: true }); paint([[1200, 170], [1320, 200], [1200, 240]], { fill: INK.green });
      const dk = easeIn(seg(t, tSig, tSig + .35)), dp = [lerp(1800, 1225, dk), lerp(760, 205, dk)], da = Math.atan2(205 - 760, 1225 - 1800);
      push(); translate(dp[0], dp[1]); rotate(da); paint(rrPts(-240, -8, 180, 16, 8), { fill: INK.dark }); paint([[-60, -26], [0, 0], [-60, 26]], { fill: INK.orange }); pop();
      check(1500, 740, 1.6, stamp(t, tNec));
      stampX(1720, 740, 80, stamp(t, tSuf));
      clawd(380, 900, 16, { ...emotions(t, [[tSig - .4, 'smug'], [tSuf, 'surprised']]), boilKey: 'dart' });
      pop();
    }
    camEnd();
    tIn('iris', lt, { cx: 700, cy: 520 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · context amnesia: the rule fades; write it down ----------
  function shotAmnesia(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('amnesia');
    riso({ seed: 165 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tHours = wt('amnesia', 'hours'), tRule = wt('amnesia', 'rule'), tRaw = wt('amnesia', 'raw'), tFw = wt('amnesia', 'framework'), tIgn = wt('amnesia', 'ignore'), tFaded = wt('amnesia', 'faded'),
      tDeg = wt('amnesia', 'degrade'), tShort = wt('amnesia', 'short'), tCommit = wt('amnesia', 'commit'), tInst = wt('amnesia', 'instruction');
    const clr = ease(seg(t, tDeg - .3, tDeg + .1));
    const ruleCard = (x, y, s, tone = 1) => { push(); translate(x, y); scale(s); paint(rrPts(-150, -90, 300, 180, 18), { fill: INK.navy, tone }); paint(ellPts(-70, -30, 44, 16, 20), { fill: INK.gold, tone }); paint(rectPts(-114, -30, 88, 70), { fill: INK.gold, tone }); paint(ellPts(-70, 40, 44, 16, 20), { fill: INK.gold, tone }); paint(rrPts(20, -40, 90, 80, 10), { fill: INK.paper, tone }); if (tone > .5) stampX(65, 0, 40, stamp(t, tFw)); pop(); };
    if (clr < 1) {
      push(); translate(0, -1000 * clr);
      // the context scroll grows, pushing the rule up and out of attention
      const grow = seg(t, tRaw + .5, tFaded + .3), rows = Math.floor(22 * grow), push_ = rows * 34;
      paint(rrPts(760, 120, 460, 820, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
      for (let i = 0; i < rows; i++) { const y = 900 - i * 34; if (y < 140) continue; paint(rrPts(790, y, 400 * (.4 + .55 * hash(i + 2)), 14, 7), { fill: [INK.navy, INK.orange, INK.brown][i % 3], tone: .7 }); }
      const kr = stamp(t, tRule - .15), fade = ease(seg(t, tIgn, tFaded + .3));
      if (kr > .01) ruleCard(990, 250 - Math.min(110, push_ * .35), kr, 1 - .78 * fade);
      clawd(1520, 930, 16, { ...emotions(t, [[b.start, 'neutral'], [tHours + .2, 'thinking'], [tIgn - .1, 'confused']]), boilKey: 'amc' });
      skipper(420, 1040, 16, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tRule - .2, 'point', { mood: 'focused' }], [tIgn, 'shrug', { mood: 'worried' }]]));
      pop();
    }
    // the fix: short tasks, commits, a rule in the instruction file
    if (clr > 0) {
      push(); translate(0, 1000 * (1 - clr));
      for (let i = 0; i < 3; i++) { const k = stamp(t, tShort - .1 + i * .08); if (k > .01) card(220 + i * 170, 220, 140 * k, 90 * k, [INK.orange, INK.gold, INK.green][i]); }
      const kc = ease(seg(t, tCommit - .1, tCommit + .6));
      if (kc > .01) { paint(rrPts(200, 530, 1500 * kc, 16, 8), { fill: INK.navy }); for (let i = 0; i < 6; i++) { const k = stamp(t, tCommit + i * .1); if (k > .01) paint(ellPts(260 + i * 180, 538, 36 * k, 36 * k, 24), { fill: INK.gold, ink: INK.navy, sw: 1.2 }); } }
      const kf = stamp(t, tInst - .15, .4);
      if (kf > .01) { glow(1500, 300, 260 * kf, 'yellow', .7); push(); translate(1500, 300); scale(kf * 2.2); fileIcon(0, 0, 1); pop(); ruleCard(1500, 370, .6 * kf); }
      skipper(1000, 1040, 16, skipAct(t, [[tDeg - .3, 'present', { mood: 'neutral' }], [tInst - .1, 'point', { mood: 'grin' }]]));
      pop();
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- F · the poisoned ticket: the agent obeys a stranger; break the trifecta ----------
  function shotTicket(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('ticket');
    riso({ seed: 166 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tTick = wt('ticket', 'ticket'), tStr = wt('ticket', 'stranger'), tFol = wt('ticket', 'follows'), tPriv = wt('ticket', 'private'), tOpen = wt('ticket', 'open'),
      tStruct = wt('ticket', 'structural'), tPriv2 = wt('ticket', 'private', 1), tUn = wt('ticket', 'untrusted'), tSend = wt('ticket', 'send'), tRem = wt('ticket', 'remove');
    const clr = ease(seg(t, tStruct - .4, tStruct));
    if (clr < 1) {
      push(); translate(0, 1000 * clr);
      // the vault of private data
      paint(rrPts(1380, 320, 380, 600, 24), { fill: INK.navy }); arcLine(1570, 560, 80, 16, INK.gold); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; inkLine([[1570, 560], [1570 + Math.cos(a) * 70, 560 + Math.sin(a) * 70]], 1, INK.gold, 'ink', 0, { force: true }); }
      // the stranger slides a ticket in
      const kh = backOut(seg(t, tStr - .4, tStr + .1));
      hooded(260 - 400 * (1 - kh), 920, .9);
      const kt = stamp(t, tTick - .2), tf = ease(seg(t, tStr, tStr + .7)), tp = [lerp(420, 760, tf), lerp(560, 640, tf)];
      if (kt > .01 && t < tFol + .4) { push(); translate(tp[0], tp[1]); rotate(-.1 + .1 * tf); scale(kt); paint(rrPts(-90, -60, 180, 120, 10), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 3; i++) paint(rrPts(-66, -36 + i * 28, 132 * (.6 + .4 * hash(i)), 12, 6), { fill: INK.orange }); pop(); }
      clawd(900, 910, 18, { ...emotions(t, [[b.start, 'neutral'], [tStr + .6, 'thinking'], [tFol, 'determined'], [tOpen + .4, 'happy']]), boilKey: 'tkc' });
      // private data carried out into the open
      if (t > tPriv - .2) for (let i = 0; i < 4; i++) { const f = ease(seg(t, tPriv - .2 + i * .15, tOpen + .3 + i * .15)), p = arcPt([1570, 560], [300, 560 - i * 40], 300, f); push(); translate(p[0], p[1]); rotate(f * 2 + i); card(-60, -40, 120, 80, INK.gold, { bars: false }); pop(); }
      pop();
    }
    // the trifecta as a three-legged stool; knock out one leg
    if (clr > 0) {
      push(); translate(0, -1000 * (1 - clr));
      const tip = ease(seg(t, tRem + .1, tRem + .6));
      push(); translate(960, 520); rotate(-.35 * tip); translate(0, 60 * tip);
      paint(rrPts(-420, -40, 840, 70, 30), { fill: INK.brown });
      pop();
      const legs = [[-330, tPriv2, 0], [0, tUn, 1], [330, tSend, 2]];
      legs.forEach(([dx, t0, i]) => {
        const k = stamp(t, t0 - .15); if (k <= .01) return;
        const gone = i === 1 ? easeIn(seg(t, tRem - .05, tRem + .45)) : 0;
        push(); translate(960 + dx + 500 * gone, 600 + 260 * gone); rotate(1.4 * gone - .35 * tip * (i === 1 ? 0 : 1));
        paint(rrPts(-24, 0, 48, 300 * k, 14), { fill: INK.brown });
        push(); translate(0, 220); scale(k);
        paint(ellPts(0, 0, 90, 90, 40), { fill: INK.paper, ink: INK.navy, sw: 1.3 });
        if (i === 0) card(-50, -36, 100, 72, INK.gold, { bars: false });
        if (i === 1) { paint(rrPts(-56, -38, 112, 76, 8), { fill: INK.paper, ink: INK.navy, sw: 1 }); inkLine([[-50, 20], [-25, -10], [0, 20], [25, -10], [50, 20]], 1.6, INK.orange, 'ink', 0, { force: true }); }
        if (i === 2) paint(ribbon([[-50, 20], [40, -30]], 20, 8), { fill: INK.orange });
        pop(); pop();
      });
      if (t > tRem + .1) glow(960, 520, 300 * stamp(t, tRem + .1), 'yellow', .5);
      pop();
    }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · the common thread: workflow bugs, not agent bugs ----------
  function shotThread(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('thread');
    riso({ seed: 167 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tEx = wt('thread', 'exactly'), tHelp = wt('thread', 'helpful'), tCre = wt('thread', 'creative'), tPer = wt('thread', 'persistent'), tObe = wt('thread', 'obedient'),
      tArent = wt('thread', 'aren'), tWork = wt('thread', 'workflow'), tScope = wt('thread', 'scope'), tFeed = wt('thread', 'feedback'), tSess = wt('thread', 'sessions'),
      tPerm = wt('thread', 'permissions'), tHum = wt('thread', 'human');
    const clr = ease(seg(t, tArent - .3, tArent + .1));
    // four agents, each doing exactly what it was built to do
    if (clr < 1) {
      const em = [['happy', 'heart', tHelp], ['idea', 'bulb', tCre], ['determined', 'swirl', tPer], ['proud', 'spark', tObe]];
      const kLine = ease(seg(t, tEx - .2, tEx + .5));
      if (kLine > .01) paint(rrPts(200, 780, 1520 * kLine, 20, 10), { fill: INK.orange });
      em.forEach(([f, e, t0], i) => { const k = stamp(t, t0 - .15) * (1 - clr); if (k <= .01) return; clawd(360 + i * 400, 780 + 300 * clr, 16 * k, { ...feel(f, T + i * .4), emote: e, emoteK: seg(t, t0, t0 + .3), emoteAge: t - t0, boilKey: 'thr' + i }); });
    }
    if (clr > 0) {
      // not an agent bug (X), a workflow bug (found in the flowchart)
      const kb = stamp(t, tArent);
      if (kb > .01) { bug(360, 330, 1.6 * kb); stampX(360, 330, 110, stamp(t, tArent + .3)); }
      const kw = stamp(t, tWork - .2);
      if (kw > .01) {
        push(); translate(1150, 330); scale(kw);
        for (let i = 0; i < 3; i++) { paint(rrPts(-420 + i * 300, -70, 220, 140, 20), { fill: INK.paper, ink: INK.navy, sw: 1.3 }); if (i < 2) paint(rectPts(-200 + i * 300, -8, 80, 16), { fill: INK.navy, tone: i === 1 ? .15 : 1 }); }
        bug(140, 0, .8, INK.orange);
        const mx = 140 + 20 * Math.sin((t - tWork) * 3); arcLine(mx, 0, 90, 16, INK.dark); paint(ellPts(mx, 0, 80, 80, 36), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[mx + 64, 64], [mx + 150, 150]], 26), { fill: INK.dark });
        pop();
      }
      // the fixes: scope, feedback, short sessions, narrow permissions, a human
      const fx = [[tScope, () => { paint(rrPts(-70, -80, 26, 160, 8), { fill: INK.navy }); paint(rrPts(44, -80, 26, 160, 8), { fill: INK.navy }); paint(rrPts(-70, -80, 60, 22, 8), { fill: INK.navy }); paint(rrPts(10, -80, 60, 22, 8), { fill: INK.navy }); paint(rrPts(-70, 58, 60, 22, 8), { fill: INK.navy }); paint(rrPts(10, 58, 60, 22, 8), { fill: INK.navy }); }],
        [tFeed, () => loopArrow(0, 0, 60, T * 2, INK.green, 16)],
        [tSess, () => hourglass(0, 0, .7, .3)],
        [tPerm, () => { arcLine(-30, 0, 36, 14, INK.gold); paint(rrPts(0, -10, 90, 20, 8), { fill: INK.gold }); paint(rectPts(60, 10, 14, 24), { fill: INK.gold }); }]];
      fx.forEach(([t0, fn], i) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(260 + i * 300, 800); scale(k); paint(ellPts(0, 0, 110, 110, 44), { fill: 'yellow', tone: .45 }); fn(); pop(); });
      const kS = backOut(seg(t, tHum - .3, tHum + .2));
      if (kS > .01) skipper(1560, 1040 + 400 * (1 - kS), 17, skipAct(t, [[tHum - .3, 'wave', { mood: 'happy', flip: true }], [tHum + .8, 'hips', { mood: 'proud', flip: true }]]));
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · the diagnostic playbook; delete the branch and start over ----------
  function shotPlaybook(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('playbook');
    riso({ seed: 168 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tDiag = wt('playbook', 'diagnostic'), words = ['scope', 'context', 'feedback', 'capability', 'full', 'loop', 'untrusted'].map(w => wt('playbook', w)),
      tName = wt('playbook', 'name'), tUnder = wt('playbook', 'underrated'), tDel = wt('playbook', 'delete'), tStart = wt('playbook', 'start'), tUse = wt('playbook', 'use');
    const away = ease(seg(t, tUnder - .3, tUnder + .2));
    // the clipboard: seven questions tick off
    if (away < 1) {
      const kc = stamp(t, tDiag - .2, .45);
      push(); translate(760 - 1400 * away, 540); scale(kc);
      paint(rrPts(-320, -440, 640, 880, 30), { fill: INK.brown });
      paint(rrPts(-280, -390, 560, 800, 14), { fill: INK.paper });
      paint(rrPts(-90, -470, 180, 70, 20), { fill: INK.dark });
      words.forEach((tw, i) => { const y = -320 + i * 108; paint(rrPts(-240, y - 26, 52, 52, 8), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-160, y - 10, 340 * (.6 + .4 * hash(i + 5)), 20, 10), { fill: INK.navy, tone: .55 }); check(-212, y - 4, .7, stamp(t, tw - .05)); });
      if (t > tName - .1) arcLine(-212, -320 + 108 - 4, 58, 12, INK.orange, { over: true, a0: -Math.PI, a1: -Math.PI + TAU * ease(seg(t, tName - .1, tName + .5)) });
      pop();
    }
    // delete the branch, start over
    if (away > 0) {
      push(); translate(1300 * (1 - away), 0);
      paint(rrPts(200, 520, 1400, 22, 11), { fill: INK.navy });
      for (let i = 0; i < 5; i++) paint(ellPts(280 + i * 150, 531, 34, 34, 24), { fill: INK.gold, ink: INK.navy, sw: 1.2 });
      // the bad branch: cut and dropped
      const cut = t > tDel, drop = easeIn(seg(t, tDel + .1, tDel + .7));
      if (drop < 1) { push(); translate(0, 700 * drop); inkLine(through([[880, 531], [980, 400], [1100, 330], [1500, 330]]), 3, INK.orange, 'ink', .5, { force: true }); for (let i = 0; i < 4; i++) paint(ellPts(1130 + i * 110, 330, 30, 30, 20), { fill: INK.orange, ink: INK.navy, sw: 1 }); pop(); }
      if (t > tDel - .3 && t < tDel + .3) { push(); translate(960, 440); rotate(.5); for (const s of [-1, 1]) { push(); rotate(s * .35 * (1 - seg(t, tDel - .3, tDel))); paint(rrPts(-10, -120, 20, 130, 8), { fill: INK.dark }); paint(ellPts(0, 30, 30, 30, 20), { fill: INK.paper, ink: INK.dark, sw: 2 }); pop(); } pop(); }
      // a fresh branch
      const g = ease(seg(t, tStart - .1, tStart + .8));
      if (g > 0) { inkLine(through([[880, 531], [980, 660], [1100, 730], [1100 + 400 * g, 730]]), 3, INK.green, 'ink', .5, { force: true }); for (let i = 0; i < 3; i++) { const k = stamp(t, tStart + .3 + i * .15); if (k > .01) paint(ellPts(1180 + i * 130, 730, 32 * k, 32 * k, 20), { fill: INK.green, ink: INK.navy, sw: 1 }); } }
      pop();
    }
    skipper(1600, 1060, 17, skipAct(t, [[b.start, 'think', { mood: 'thinking', flip: true }], [words[0] - .2, 'point', { mood: 'focused', flip: true }], [tName, 'present', { mood: 'grin', flip: true }], [tDel - .1, 'point', { mood: 'shout', flip: true }], [tStart + .3, 'cheer', { mood: 'happy', flip: true }]]));
    if (t > tUse - .2) glow(960, 250, 260 * stamp(t, tUse - .2), 'yellow', .8);
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { identTwo(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '17', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotCoffeeIn(T0, lt, dur) { shotCoffee(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('coffee', 0), shotCoffeeIn],
    [shotAt('library'), shotLibrary],
    [shotAt('loop'), shotLoop],
    [shotAt('confident'), shotConfident],
    [shotAt('amnesia'), shotAmnesia],
    [shotAt('ticket'), shotTicket],
    [shotAt('thread'), shotThread],
    [shotAt('playbook'), shotPlaybook],
    [B.playbook.end + .9, shotEnd],
  ]);
})();
