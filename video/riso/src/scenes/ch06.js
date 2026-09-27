// ch06.js: Chapter 6 · Testing as the Feedback Loop. Storyboard: video/storyboards/ch06.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  // a test lamp: off (paper), run (yellow), fail (orange), green, hollow (a green ring with nothing in it)
  const LAMP = { run: INK.yellow, fail: INK.orange, green: INK.green };
  const lamp = (x, y, r, state = 'off', k = 1) => {
    if (k <= .01) return; r *= k;
    paint(ellPts(x, y, r, r, 32), { fill: INK.paper, ink: INK.navy, sw: 1.1 * k });
    if (state === 'hollow') { arcLine(x, y, r * .72, r * .22, INK.green, { over: true }); return; }
    if (LAMP[state]) { paint(ellPts(x, y, r * .82, r * .82, 32), { fill: LAMP[state] }); paint(ellPts(x - r * .28, y - r * .28, r * .22, r * .22, 14), { fill: INK.paper, tone: .8 }); }
  };
  // a repository: a folder-shaped box
  const repo = (x, y, w, h, col = INK.navy, tn = .9) => { paint(rrPts(x - w / 2, y - h / 2 - 40, w * .38, 70, 18), { fill: col, tone: tn }); paint(rrPts(x - w / 2, y - h / 2, w, h, 24), { fill: col, tone: tn }); };
  // the rate limiter: a turnstile gate (two posts and a bar)
  const gate = (x, y, s, rot = 0, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-110, -120, 40, 200, 12), { fill: INK.navy }); paint(rrPts(70, -120, 40, 200, 12), { fill: INK.navy }); paint(rrPts(-90, -70, 180, 34, 17), { fill: col }); paint(rrPts(-90, -10, 180, 34, 17), { fill: col }); paint(rectPts(-140, 76, 280, 14), { fill: INK.navy }); pop(); };
  const rosette = (x, y, s) => { push(); translate(x, y); scale(s); paint([[-30, 10], [-60, 120], [-20, 90], [0, 130], [10, 10]], { fill: INK.orange }); paint([[0, 10], [10, 130], [30, 90], [60, 120], [30, 10]], { fill: INK.orange, over: true }); paint(starPts(0, 0, 70, .7, 14), { fill: INK.gold }); paint(ellPts(0, 0, 36, 36, 24), { fill: INK.orange }); pop(); };
  const stopwatch = (x, y, r, a, col = INK.navy) => { paint(rrPts(x - r * .18, y - r * 1.32, r * .36, r * .3, 6), { fill: col }); paint(ellPts(x, y, r, r, 40), { fill: col }); paint(ellPts(x, y, r * .8, r * .8, 40), { fill: INK.paper }); for (let i = 0; i < 12; i++) { const b = i / 12 * TAU; paint(ellPts(x + Math.cos(b) * r * .66, y + Math.sin(b) * r * .66, r * .05, r * .05, 8), { fill: col }); } paint(ribbon([[x, y], [x + Math.cos(a - Math.PI / 2) * r * .6, y + Math.sin(a - Math.PI / 2) * r * .6]], r * .09, r * .04), { fill: INK.orange }); paint(ellPts(x, y, r * .1, r * .1, 12), { fill: col }); };
  const ghost = (x, y, s, k = 1) => { if (k <= .01) return; push(); translate(x, y); scale(s * k); const P = [[-60, 40], [-60, -30]]; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; P.push([Math.cos(a) * 60, -30 + Math.sin(a) * 60]); } P.push([60, 40], [40, 20], [20, 40], [0, 20], [-20, 40], [-40, 20]); paint(P, { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(ellPts(-20, -30, 9, 14, 12), { fill: INK.navy }); paint(ellPts(20, -30, 9, 14, 12), { fill: INK.navy }); pop(); };
  const bug = (x, y, s, ph = 0) => { push(); translate(x, y); scale(s); for (let i = -1; i <= 1; i++) { const w = 6 * Math.sin(ph * 14 + i); inkLine([[i * 14, 0], [i * 18 + w, 26]], .7, INK.dark, 'ink', 0, { force: true }); inkLine([[i * 14, 0], [i * 18 - w, -26]], .7, INK.dark, 'ink', 0, { force: true }); } paint(ellPts(0, 0, 34, 22, 20), { fill: INK.orange }); paint(ellPts(34, 0, 13, 13, 12), { fill: INK.dark }); pop(); };
  const blindfold = u => { paint(rectPts(-5.4 * u, -7.1 * u, 10.8 * u, 2.2 * u), { fill: INK.navy }); paint([[5.2 * u, -6.4 * u], [7.2 * u, -7.6 * u], [6.8 * u, -5.4 * u]], { fill: INK.navy }); };
  const burst = (x, y, r0, k, col = INK.orange, n = 12) => { if (k <= 0 || k >= 1) return; for (let i = 0; i < n; i++) { const a = i / n * TAU + .2; paint(ribbon([[x + Math.cos(a) * r0 * (1 + k * .6), y + Math.sin(a) * r0 * (1 + k * .6)], [x + Math.cos(a) * r0 * (1.5 + k * .8), y + Math.sin(a) * r0 * (1.5 + k * .8)]], 16 * (1 - k)), { fill: col }); } };
  // a test card: n assertion rows, each with a lamp; rowState(i) → lamp state
  const testCard = (x, y, w, h, n, rowState, rowK = () => 1, head = INK.navy) => {
    paint(rrPts(x - w / 2, y - h / 2, w, h, 26), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
    paint(rrPts(x - w / 2, y - h / 2, w, 70, 26), { fill: head }); paint(rectPts(x - w / 2, y - h / 2 + 44, w, 26), { fill: head });
    paint(rrPts(x - w / 2 + 30, y - h / 2 + 24, w * .45, 22, 11), { fill: INK.paper, tone: .8 });
    const rh = (h - 110) / n;
    for (let i = 0; i < n; i++) { const k = rowK(i); if (k <= .01) continue; const ry = y - h / 2 + 100 + rh * (i + .5); lamp(x - w / 2 + 50, ry, rh * .32, rowState(i), k); paint(rrPts(x - w / 2 + 90, ry - 8, (w - 150) * (.5 + .45 * hash(i + 11)) * k, 16, 8), { fill: INK.navy, tone: .55 }); }
  };

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
  function endCardLong(T, lt, dur, nextNum, nextTitle) {
    const t = onTwos(lt);
    riso({ seed: 11 });
    camBegin(960, 540, 1.04 - .04 * ease(seg(t, 0, dur)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, -100], to: [0, 700], a: .45, b: 0 } });
    helm(960, 1080, 330, t * .25, INK.gold);
    type('NEXT', 960, 220, 44, INK.navy, { spacing: .3, pop: seg(t, .3, .6) });
    type(nextNum, 960, 380, 190, INK.orange, { pop: seg(t, .5, .85) });
    const L = split2(nextTitle), sz = L.length > 1 ? 84 : 92;
    L.forEach((l, i) => type(l, 960, 555 + i * sz * 1.1, sz, INK.navy, { pop: seg(t, .8 + i * .12, 1.2 + i * .12) }));
    skipper(330, 1050, 22, { ...SKIP_POSES.wave, mood: 'happy', t, dy: 400 * (1 - backOut(seg(t, .6, 1.1))) });
    const kc = backOut(seg(t, 1.0, 1.4));
    clawd(1600, 1040 + 300 * (1 - kc), 24, { ...feel('thinking', t), emote: '?', emoteK: kc, emoteAge: t - 1.2, flip: true });
    camEnd();
  }

  // ---------- A · blind: two code bases, the first has no tests; the limiter never ran ----------
  function shotBlind(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('blind');
    riso({ seed: 61 });
    const tTwo = wt('blind', 'two'), tAg = wt('blind', 'agent'), tTask = wt('blind', 'task'), tFirst = wt('blind', 'first'), tTests = wt('blind', 'tests'),
      tWrite = wt('blind', 'writes'), tStop = wt('blind', 'stops'), tKnow = wt('blind', 'know'), tThree = wt('blind', 'three'), tDays = wt('blind', 'days'), tLater = wt('blind', 'later'),
      tProd = wt('blind', 'production'), tMid = wt('blind', 'middleware'), tWrong = wt('blind', 'wrong'), tNever = wt('blind', 'never'), tDeco = wt('blind', 'decoration');
    // the camera carries us from the desk (x 0..1920) to production (x 1920..3840)
    const pan = ease(seg(T, tThree - .5, tThree + .2));
    camBegin(960 + 1920 * pan, 540, 1.02 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, 3840 + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, 3840 + 400, 400), { fill: INK.navy, tone: .8 });
    // --- the desk: two code bases, one agent, one task
    const first = ease(seg(t, tFirst - .2, tFirst + .5));
    const kL = stamp(t, tTwo - .1), kR = stamp(t, tTwo + .1);
    const Lx = lerp(560, 700, first), Ly = 480, Rx = lerp(1360, 2400, first);
    if (kL > .01) {
      push(); translate(Lx, Ly); scale(kL * lerp(1, 1.2, first)); repo(0, 0, 420, 320);
      // code lines, typed from "writes"
      const n = Math.floor(6 * seg(t, tWrite, tStop));
      for (let i = 0; i < n; i++) paint(rrPts(-170 + (i % 3) * 20, -120 + i * 34, 180 + 140 * hash(i + 2), 16, 8), { fill: i === n - 1 ? INK.yellow : INK.paper, tone: .9 });
      // where the tests would be: empty dashed lamps, X-ed on "tests"
      for (let i = 0; i < 5; i++) { const x = -140 + i * 70; for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; arcLine(x, 110, 20, 5, INK.paper, { a0: a, a1: a + TAU / 16 }); } }
      pop();
      stampX(Lx, Ly + 110 * lerp(1, 1.2, first), 90, stamp(t, tTests));
    }
    if (kR > .01 && Rx < 2300) { push(); translate(Rx, Ly); scale(kR); repo(0, 0, 420, 320); for (let i = 0; i < 5; i++) lamp(-140 + i * 70, 110, 22, 'off'); for (let i = 0; i < 4; i++) paint(rrPts(-170, -120 + i * 34, 160 + 140 * hash(i + 7), 16, 8), { fill: INK.paper, tone: .9 }); pop(); }
    // the task: a rate limiter
    const kT = stamp(t, tTask - .1) * (1 - ease(seg(t, tFirst - .2, tFirst + .2)));
    if (kT > .01) { push(); translate(960, 220); scale(kT); paint(rrPts(-150, -110, 300, 220, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); gate(0, 10, .7); pop(); }
    // the agent drops in between them, then works at the first
    if (t > tAg - .3) {
      const drop = backOut(seg(t, tAg - .3, tAg + .1)), cx = lerp(960, 1250, first);
      const face = emotions(t, [[tAg - .3, 'happy'], [tWrite - .1, 'determined'], [tStop, 'neutral'], [tKnow - .1, 'confused', { emote: '?', emoteK: 1 }]]);
      const typing = t > tWrite && t < tStop ? { aL: .6 + .4 * Math.sin(t * 30), aR: .6 - .4 * Math.sin(t * 30) } : {};
      clawd(cx, 880 - 500 * (1 - drop), 18, { ...face, ...typing, flip: first > .5, emoteAge: t - tKnow });
    }
    // --- production, three days later
    if (pan > 0) {
      const X0 = 1920;
      // calendar pages tear off: three, days, later
      push(); translate(X0 + 330, 300);
      paint(rrPts(-130, -140, 260, 280, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-130, -140, 260, 70, 20), { fill: INK.orange });
      [tThree, tDays, tLater].forEach((tp, i) => { const k = seg(t, tp, tp + .45); if (k < 1) { push(); translate(80 * k, 200 * k * k); rotate(.8 * k); paint(rectPts(-110, -60, 220, 180), { fill: INK.paper, ink: INK.navy, sw: 1, alpha: 1 - k * .5 }); paint(rrPts(-40, -10, 80, 70, 12), { fill: INK.navy, tone: .5 + .15 * i }); pop(); } });
      pop();
      // the pipe to the server, requests flowing along it
      const kp = ease(seg(t, tProd - .3, tProd + .3));
      if (kp > 0) {
        const px0 = X0 + 560, px1 = lerp(px0, X0 + 1560, kp);
        paint(rrPts(px0, 610, px1 - px0, 80, 40), { fill: INK.navy, tone: .35 });
        const flood = seg(t, tNever, tNever + 1);
        for (let i = 0; i < 14; i++) { const f = frac(t * (.35 + .25 * flood) + i / 14), rx = lerp(px0 + 20, X0 + 1560, f); if (rx < px1) paint(rrPts(rx - 26, 632, 52, 36, 10), { fill: i % 3 ? INK.paper : INK.gold }); }
        // the server rack: its lights go orange as the flood arrives
        push(); translate(X0 + 1650, 560); scale(stamp(t, tProd));
        for (let i = 0; i < 3; i++) { paint(rrPts(-120, -220 + i * 130, 240, 110, 14), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(ellPts(-80 + j * 30, -165 + i * 130, 10, 10, 10), { fill: flood > .3 + j * .15 ? INK.orange : INK.green }); }
        pop();
      }
      // the limiter: mounted off to the side, so the requests never pass through it
      const kg = stamp(t, tMid - .1);
      if (kg > .01) {
        const wrong = backOut(seg(t, tWrong - .1, tWrong + .3));
        gate(X0 + 1050, lerp(640, 370, wrong), .9 * kg, -.35 * wrong);
        if (t > tDeco - .1) rosette(X0 + 1050 - 20, 290, stamp(t, tDeco - .1) * .8);
      }
      clawd(X0 + 330, 900, 14, { ...emotions(t, [[tThree, 'neutral'], [tNever, 'surprised'], [tDeco, 'sad']]), flip: false });
    }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · the suite: run, two fail, adjust, green; three new tests; night and day ----------
  function shotSuite(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('suite');
    riso({ seed: 62 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tSuite = wt('suite', 'suite'), tRuns = wt('suite', 'runs'), tFail = wt('suite', 'fail'), tRead = wt('suite', 'reads'), tAdj = wt('suite', 'adjusts'), tAgain = wt('suite', 'again'),
      tGreen = wt('suite', 'green'), tThree = wt('suite', 'three'), tNight = wt('suite', 'night'), tDay = wt('suite', 'day'), tDiff = wt('suite', 'difference');
    const split = ease(seg(t, tNight - .3, tNight + .4));
    // night: the untested code base, its decorative limiter under a moon
    if (split > 0) {
      paint(rectPts(-200, -200, 1100 * split + 200, H + 400), { fill: INK.navy });
      push(); translate(-700 * (1 - split), 0);
      paint(ellPts(300, 220, 80, 80, 40), { fill: INK.yellow }); paint(ellPts(340, 200, 70, 70, 40), { fill: INK.navy });
      for (let i = 0; i < 6; i++) paint(starPts(120 + i * 140, 110 + 90 * hash(i + 3), 10 + 6 * hash(i), .35, 4), { fill: INK.yellow, tone: .8 });
      gate(480, 640, 1.1, -.35); rosette(460, 520, .8);
      pop();
    }
    // day: a sun behind the tested board
    const kd = stamp(t, tDay - .1);
    const bx = lerp(960, 1440, split), bs = lerp(1, .56, split), by = lerp(430, 440, split);
    if (kd > .01) { paint(ellPts(bx + 260, by - 250, 150 * kd, 150 * kd, 48), { fill: INK.yellow }); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .3; paint(ribbon([[bx + 260 + Math.cos(a) * 180 * kd, by - 250 + Math.sin(a) * 180 * kd], [bx + 260 + Math.cos(a) * 240 * kd, by - 250 + Math.sin(a) * 240 * kd]], 14), { fill: INK.gold }); } }
    // the board of eight tests
    const kb = stamp(t, tSuite - .3, .45);
    const sweep = (t0, i) => t > t0 + i * .1;
    const state = i => {
      const failing = i === 2 || i === 5;
      if (t > tGreen - .05) return 'green';
      if (sweep(tAgain, i)) return t > tAgain + 1 ? 'green' : 'run';
      if (t > tFail - .25) return failing ? 'fail' : 'green';
      if (sweep(tRuns, i)) return 'run';
      return 'off';
    };
    if (kb > .01) {
      push(); translate(bx, by); scale(kb * bs);
      repo(0, 0, 1240, 440, INK.navy, .92);
      for (let i = 0; i < 8; i++) { const x = -525 + i * 150; lamp(x, -60, 52, state(i)); if ((i === 2 || i === 5) && t > tFail - .1 && t < tGreen - .05) stampX(x, -60, 50, stamp(t, tFail - .1 + (i === 5 ? .1 : 0))); }
      for (let i = 0; i < 3; i++) { const k = stamp(t, tThree - .1 + i * .15); lamp(-150 + i * 150, 110, 52, t > tThree + .8 + i * .15 ? 'green' : 'run', k); }
      burst(0, -60, 300, seg(t, tGreen - .05, tGreen + .6), INK.gold, 16);
      pop();
    }
    // the agent reads the failures and adjusts
    if (t > tAdj - .1 && t < tAgain + .3) wrench(lerp(1180, 1150, split), 860, .6, -.6 + .5 * Math.sin((t - tAdj) * 8));
    const cx = lerp(960, 1440, split), cu = lerp(18, 14, split);
    clawd(cx, 1000, cu, { ...emotions(t, [[b.start, 'neutral'], [tRuns, 'determined'], [tFail, 'surprised'], [tRead, 'thinking', { lookY: -1 }], [tAdj, 'determined'], [tGreen, 'excited'], [tNight, 'happy'], [tDiff, 'proud']]) });
    // the difference: the board pulses once
    if (t > tDiff - .1 && t < tDiff + .6) glow(bx, by, 380 * bs * Math.sin(Math.PI * seg(t, tDiff - .1, tDiff + .6)), 'yellow', .6);
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- C · the agent's eyes: it can't look; it can run tests. Green, red, blind. The quality of the signal ----------
  function shotEyes(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('eyes');
    riso({ seed: 63 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tLook = wt('eyes', 'look'), tFeel = wt('eyes', 'feel'), tRun = wt('eyes', 'run'), tRead = wt('eyes', 'read'), tGreen = wt('eyes', 'green'), tRed = wt('eyes', 'red'),
      tNo = wt('eyes', 'no'), tBlind = wt('eyes', 'blind'), tQual = wt('eyes', 'quality'), tExp = wt('eyes', 'expected'), tGot = wt('eyes', 'got'), tAct = wt('eyes', 'act'),
      tBare = wt('eyes', 'bare'), tSil = wt('eyes', 'silence');
    const part2 = ease(seg(t, tQual - .3, tQual + .3));
    // part 1: the screen, then the terminal and its lamp
    if (part2 < 1) {
      push(); translate(0, 700 * part2);
      const MX = 1250, MY = 450;
      paint(rrPts(MX - 60, MY + 180, 120, 90, 10), { fill: INK.navy }); paint(rrPts(MX - 160, MY + 250, 320, 30, 15), { fill: INK.navy });
      paint(rrPts(MX - 280, MY - 200, 560, 400, 28), { fill: INK.navy });
      const term = t > tRun - .1, dark = t > tNo - .1;
      if (!term) { paint(rrPts(MX - 250, MY - 170, 500, 340, 16), { fill: INK.paper }); paint(rrPts(MX - 220, MY - 140, 200, 120, 12), { fill: INK.orange, tone: .7 }); paint(rrPts(MX + 10, MY - 140, 200, 40, 12), { fill: INK.navy, tone: .5 }); paint(rrPts(MX + 10, MY - 80, 150, 24, 12), { fill: INK.navy, tone: .3 }); paint(rrPts(MX - 220, MY + 20, 430, 110, 12), { fill: INK.gold, tone: .5 }); }
      else if (!dark) { const n = Math.min(7, 1 + Math.floor((t - tRun) * 5)); for (let i = 0; i < n; i++) paint(rrPts(MX - 230, MY - 160 + i * 44, (300 + 150 * hash(i + 21)), 18, 9), { fill: i === n - 1 ? INK.yellow : INK.paper, tone: .9 }); }
      if (!term) stampX(MX, MY, 120, stamp(t, tFeel));
      // the lamp: green, red, off
      const kl = stamp(t, tGreen - .15);
      lamp(1690, 250, 110, dark ? 'off' : t > tRed - .05 ? 'fail' : 'green', kl);
      // flying blind: fog over everything
      if (t > tBlind - .2) { const kf = ease(seg(t, tBlind - .2, tBlind + .5)); for (let i = 0; i < 7; i++) paint(ellPts(200 + i * 260, 520 + 80 * Math.sin(i * 1.7 + t), 220 * kf, 130 * kf, 28), { fill: INK.navy, tone: .22, over: true }); }
      pop();
    }
    // the agent: back to the screen, then acting on the lamp
    const step = t < tGreen ? 0 : t < tRed ? backOut(seg(t, tGreen, tGreen + .4)) * 1.5 : t < tNo ? 1.5 - 3 * backOut(seg(t, tRed, tRed + .4)) : -1.5;
    const cx = lerp(560, 420, part2);
    const face = emotions(t, [[b.start, 'neutral', { lookX: .8 }], [tFeel, 'confused', { lookX: .8 }], [tRead - .1, 'thinking', { lookX: 1 }], [tGreen, 'happy'], [tRed, 'surprised'], [tNo, 'nervous'], [tQual, 'neutral', { lookX: 1 }], [tAct, 'idea'], [tBare, 'confused', { lookX: 1 }]]);
    const blind = t > tBlind - .1 && t < tQual;
    clawd(cx, 930, 20, { ...face, dx: step, draw: blind ? blindfold : undefined });
    // part 2: two messages, a clear one and a bare one
    if (part2 > 0) {
      const k1 = stamp(t, tExp - .15);
      if (k1 > .01) {
        push(); translate(1180, 350); scale(k1);
        paint(rrPts(-380, -170, 760, 340, 30), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
        type('WANT 429', 0, -60, 110, INK.navy);
        if (t > tGot - .1) { const kg = stamp(t, tGot - .1); type('GOT 200', 0, 80, 110, INK.orange, { pop: kg }); }
        pop();
        if (t > tAct - .1) { const ka = ease(seg(t, tAct - .1, tAct + .4)); paint(ellPts(1180, 350, 420 * ka, 200 * ka, 48), { fill: 'yellow', tone: .45, over: true }); check(1520, 190, 1.2, stamp(t, tAct)); }
      }
      const k2 = stamp(t, tBare - .15), fade = ease(seg(t, tSil - .2, tSil + .6));
      if (k2 > .01 && fade < 1) {
        push(); translate(1180, 790); scale(k2 * (1 - .3 * fade));
        paint(rrPts(-300, -110, 600, 220, 26), { fill: INK.navy, tone: .3 * (1 - fade) + .05 });
        for (let i = 0; i < 3; i++) paint(rrPts(-240, -60 + i * 44, 200 + 200 * hash(i + 31), 20, 10), { fill: INK.navy, tone: .35 * (1 - fade), over: true });
        pop();
      }
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- D · write the test first: make this pass. Seven assertions, fail, fail, green ----------
  function shotTdd(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('tdd');
    riso({ seed: 64 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    for (let i = 0; i < 12; i++) paint(rectPts(i * 170, -100, 3, H + 200), { fill: INK.navy, tone: .14 });
    const tTest = wt('tdd', 'test'), tPass = wt('tdd', 'pass'), tSeven = wt('tdd', 'seven'), tFirst = wt('tdd', 'first', 1), tFail = wt('tdd', 'fail'), tAdds = wt('tdd', 'adds'),
      tAgain = wt('tdd', 'again'), tVal = wt('tdd', 'validation'), tGreen = wt('tdd', 'green'), tCycle = wt('tdd', 'cycle'), tMeans = wt('tdd', 'means'), tProg = wt('tdd', 'programming');
    // the card: in the Skipper's hand, then handed over on "pass"
    const fly = ease(seg(t, tPass - .2, tPass + .5)), p = arcPt([520, 640], [900, 500], 160, fly), cs = lerp(.35, 1, fly);
    const kc = stamp(t, tTest - .2);
    const rowK = i => fly < 1 ? 1 : stamp(t, tSeven - .1 + i * .08);
    const row = i => {
      if (t > tGreen - .05) return 'green';
      if (i < 5) return t > tFirst + .1 + i * .15 ? 'green' : 'off';
      if (i === 5) return t > tAdds + .3 ? 'green' : t > tFail - .1 ? 'fail' : 'off';
      return t > tVal + .2 ? 'green' : t > tAgain - .1 ? 'fail' : 'off';
    };
    if (kc > .01) { push(); translate(p[0], p[1]); scale(kc * cs); testCard(0, 0, 560, 640, 7, row, rowK, t > tGreen ? INK.green : INK.navy); burst(0, 0, 340, seg(t, tGreen - .05, tGreen + .6), INK.gold, 16); pop(); }
    if (t > tFail - .1 && t < tAdds + .3) stampX(p[0] - 230, p[1] - 320 + 100 + 530 / 7 * 5.5, 40, stamp(t, tFail - .1));
    if (t > tAgain - .1 && t < tVal + .2) stampX(p[0] - 230, p[1] - 320 + 100 + 530 / 7 * 6.5, 40, stamp(t, tAgain - .1));
    // "{ }": the test is the program
    if (t > tProg - .2) { const kp = stamp(t, tProg - .2); push(); translate(900, 500); rotate(-.12); scale(kp); paint(rrPts(-170, -90, 340, 180, 30), { fill: INK.orange, tone: .9, over: true }); type('{ }', 0, 6, 130, INK.navy); pop(); }
    // the Skipper writes the test and hands it over
    skipper(300, 1060, 19, skipAct(t, [[b.start, 'stand', { mood: 'focused' }], [tTest - .3, 'present', { mood: 'focused' }], [tPass - .1, 'point', { mood: 'grin' }], [tSeven + .6, 'hips', { mood: 'neutral' }], [tGreen, 'cheer', { mood: 'happy' }], [tCycle + .6, 'hips', { mood: 'proud' }]]));
    // the agent loops against it
    const iter = t > tFirst - .2 && t < tGreen;
    clawd(1560, 960, 20, { ...emotions(t, [[b.start, 'neutral'], [tPass + .2, 'determined'], [tFail, 'surprised'], [tAdds - .1, 'determined'], [tAgain, 'nervous'], [tVal - .1, 'determined'], [tGreen, 'excited'], [tCycle + .6, 'happy'], [tProg, 'proud']]),
      ...(iter ? { aL: .6 + .4 * Math.sin(t * 28), aR: .6 - .4 * Math.sin(t * 28) } : {}), flip: true });
    if (iter) loopArrow(1560, 820, 170, -t * 3, INK.navy, 14);
    // each cycle took seconds
    const ks = stamp(t, tCycle - .15) * (1 - ease(seg(t, tProg - .5, tProg - .1)));
    if (ks > .01) { push(); translate(1560, 380); scale(ks); stopwatch(0, 0, 130, (t - tCycle) * 9); pop(); }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · what makes a good agentic test: fast, deterministic, isolated, clear, behaviour ----------
  function shotGood(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('good');
    riso({ seed: 65 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tFast = wt('good', 'fast'), tMin = wt('good', 'minutes'), tHand = wt('good', 'handful'), tSec = wt('good', 'seconds'), tHund = wt('good', 'hundreds'), tDet = wt('good', 'deterministic'),
      tFlaky = wt('good', 'flaky'), tGhost = wt('good', 'ghost'), tIso = wt('good', 'isolated'), tClear = wt('good', 'clear'), tBeh = wt('good', 'behavior'), tImpl = wt('good', 'implementation');
    // the badges along the bottom
    const X = [330, 645, 960, 1275, 1590], BY = 880;
    const badge = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(X[i], BY); scale(k); paint(ellPts(0, 0, 120, 120, 48), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
    badge(0, tFast, () => paint([[20, -85], [-50, 10], [0, 10], [-20, 85], [55, -20], [5, -20]], { fill: INK.gold }));
    badge(1, tDet, () => { arcLine(0, 0, 70, 14, INK.navy); arcLine(0, 0, 38, 12, INK.navy); paint(ellPts(0, 0, 18, 18, 16), { fill: INK.orange }); });
    badge(2, tIso, () => { for (let i = 0; i < 3; i++) paint(rrPts(-86 + i * 62, -26 + (i % 2) * 20 - 10, 48, 48, 8), { fill: [INK.navy, INK.orange, INK.green][i] }); });
    badge(3, tClear, () => { paint(rrPts(-75, -55, 150, 110, 14), { fill: INK.navy }); paint(rrPts(-55, -30, 110, 20, 10), { fill: INK.paper }); paint(rrPts(-55, 5, 70, 20, 10), { fill: INK.yellow }); });
    badge(4, tBeh, () => { paint([[-100, -12], [-60, -12], [-60, -28], [-36, 0], [-60, 28], [-60, 12], [-100, 12]], { fill: INK.orange }); paint(rrPts(-32, -40, 64, 80, 10), { fill: INK.navy }); paint([[40, -12], [70, -12], [70, -28], [96, 0], [70, 28], [70, 12], [40, 12]], { fill: INK.green }); });
    // speed: a handful of tries per hour vs hundreds
    const out = ease(seg(t, tDet - .2, tDet + .3));
    if (out < 1) {
      push(); translate(0, -500 * easeIn(out));
      const k1 = stamp(t, tMin - .2);
      if (k1 > .01) { push(); translate(300, 280); scale(k1); paint(rrPts(-70, -70, 140, 140, 24), { fill: INK.navy }); paint([[-35, -45], [35, -45], [0, 0]], { fill: INK.gold }); paint([[-35, 45], [35, 45], [0, 0]], { fill: INK.gold, tone: .5 }); pop(); }
      const n1 = Math.floor(5 * seg(t, tMin, tHand + .4));
      for (let i = 0; i < n1; i++) paint(ellPts(500 + i * 240, 280, 30, 30, 20), { fill: INK.orange });
      const k2 = stamp(t, tSec - .2);
      if (k2 > .01) { push(); translate(300, 520); scale(k2 * .55); stopwatch(0, 0, 120, (t - tSec) * 10); pop(); }
      const n2 = Math.floor(160 * seg(t, tSec, tHund + .5));
      for (let i = 0; i < n2; i++) { const c = i % 40, r = Math.floor(i / 40); paint(ellPts(470 + c * 31, 470 + r * 32, 11, 11, 10), { fill: INK.orange, tone: .9 }); }
      if (n2 > 60) paint(rrPts(440, 450, 1260, 150, 20), { fill: 'yellow', tone: .35, over: true });
      pop();
    }
    // deterministic: a flaky failure sends the agent chasing a ghost
    const chase = seg(t, tFlaky - .1, tGhost + .1), gk = 1 - easeIn(seg(t, tGhost, tGhost + .3));
    const gx = lerp(420, 1500, ease(chase)), gy = 380 + 60 * Math.sin(t * 5);
    if (t > tFlaky - .3 && gk > 0) ghost(gx, gy, 1.3, gk * stamp(t, tFlaky - .3));
    {
      const cx = lerp(200, 1250, ease(chase));
      clawd(cx, 690, 15, { ...emotions(t, [[b.start, 'neutral', { lookY: -.6, lookX: .6 }], [tFlaky - .4, 'determined'], [tGhost + .1, 'confused', { emote: '?', emoteK: 1 }], [tIso, 'happy'], [tImpl, 'proud']]), ...(chase > 0 && chase < 1 ? move('run', T, 2) : {}), emoteAge: t - tGhost });
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- F · coverage: not everything; where the agent works. Hot paths, contracts, seams, negative tests ----------
  function shotCoverage(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('coverage');
    riso({ seed: 66 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tFull = wt('coverage', 'full'), tWorks = wt('coverage', 'works'), tHot = wt('coverage', 'hot'), tCon = wt('coverage', 'contracts'), tSeams = wt('coverage', 'seams'),
      tNeg = wt('coverage', 'negative'), tSimp = wt('coverage', 'simplify'), tVal = wt('coverage', 'validation'), tGarb = wt('coverage', 'garbage');
    // the codebase map: 4 × 3 module tiles
    const TW = 280, TH = 190, G = 26, X0 = 180, Y0 = 170;
    const tile = (c, r) => [X0 + c * (TW + G), Y0 + r * (TH + G)];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const k = stamp(t, b.start - .3 + (r * 4 + c) * .03); if (k <= .01) continue; const [x, y] = tile(c, r); paint(rrPts(x + TW / 2 * (1 - k), y + TH / 2 * (1 - k), TW * k, TH * k, 18), { fill: INK.navy, tone: .22 }); for (let i = 0; i < 3; i++) paint(rrPts(x + 30, y + 40 + i * 42, (TW - 80) * (.4 + .5 * hash(r * 9 + c * 3 + i)) * k, 16, 8), { fill: INK.navy, tone: .4 }); }
    // "full coverage": a roller tries to paint it all, and is stamped out
    const roll = seg(t, tFull - .3, tFull + .9), rOut = 1 - ease(seg(t, tWorks - .6, tWorks - .2));
    if (roll > 0 && rOut > 0) {
      const rx = lerp(X0 - 60, X0 + 4 * (TW + G), ease(roll));
      paint(rectPts(X0 - 20, Y0 - 20, (rx - X0 + 20), 3 * (TH + G) + 20), { fill: 'yellow', tone: .45 * rOut, over: true });
      paint(rrPts(rx - 30, Y0 - 40, 60, 3 * (TH + G) + 40, 30), { fill: INK.orange, alpha: rOut }); paint(rectPts(rx - 6, Y0 + 3 * (TH + G), 12, 140 * rOut), { fill: INK.navy });
      stampX(X0 + 2 * (TW + G) - G / 2, Y0 + 1.5 * (TH + G) - G / 2, 200, stamp(t, tFull + .35) * rOut);
    }
    // the hot path: where the agent works
    const path = [[0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [3, 0]];
    path.forEach(([c, r], i) => { const k = stamp(t, tHot - .1 + i * .1); if (k <= .01) return; const [x, y] = tile(c, r); paint(rrPts(x, y, TW, TH, 18), { fill: INK.orange, tone: .75 * Math.min(1, k), over: true }); });
    // seams between the hot tiles glow gold
    if (t > tSeams - .1) path.slice(1).forEach(([c, r], i) => { const [pc, pr] = path[i], k = ease(seg(t, tSeams - .1 + i * .08, tSeams + .3 + i * .08)); const [x, y] = tile(Math.max(c, pc), Math.max(r, pr)); if (c !== pc) paint(rrPts(x - G + 4, y + 20, G - 8, (TH - 40) * k, 6), { fill: INK.gold }); else paint(rrPts(x + 20, y - G + 4, (TW - 40) * k, G - 8, 6), { fill: INK.gold }); });
    // contracts: seals where the map meets the outside
    [[0, 1], [3, 0], [3, 2]].forEach(([c, r], i) => { const k = stamp(t, tCon - .1 + i * .12); if (k <= .01) return; const [x, y] = tile(c, r); const sx = c === 0 ? x - 10 : x + TW + 10, sy = y + TH / 2; paint(starPts(sx, sy, 52 * k, .78, 16), { fill: INK.gold }); paint(ellPts(sx, sy, 30 * k, 30 * k, 20), { fill: INK.navy }); });
    // the agent walks onto the hot path
    if (t > tWorks - .5) { const w = seg(t, tWorks - .5, tWorks + .5), [x, y] = tile(1, 2); clawd(lerp(-100, x + TW / 2, ease(w)), y + TH - 20, 11, { ...emotions(t, [[tWorks - .5, 'determined'], [tWorks + .5, 'happy'], [tGarb, 'proud']]), ...(w < 1 ? move('walk', T, 1) : {}) }); }
    // negative tests: a shield rejects the garbage
    const ksh = stamp(t, tNeg - .1);
    if (ksh > .01) {
      push(); translate(1570, 520); scale(ksh);
      paint([[-110, -150], [110, -150], [110, 10], [0, 160], [-110, 10]], { fill: INK.navy, curv: .15 });
      paint([[-70, -110], [70, -110], [70, 0], [0, 105], [-70, 0]], { fill: INK.green, curv: .15, over: true });
      check(0, -20, 1.1, stamp(t, tVal));
      pop();
      const inK = ease(seg(t, tSimp - .6, tVal)), bk = seg(t, tVal, tGarb + .6);
      const gx = bk > 0 ? lerp(1720, 2200, easeOut(bk)) : lerp(2150, 1720, inK), gy = bk > 0 ? 540 - 400 * Math.sin(Math.PI * .5 * bk) : 560;
      if (inK > 0) { push(); translate(gx, gy); rotate(bk * 6); paint(through([[-60, 30], [-50, -30], [0, -50], [50, -25], [60, 30], [10, 50], [-60, 30]]), { fill: INK.brown }); paint(ellPts(-10, -5, 16, 12, 10), { fill: INK.gold }); pop(); for (let i = 0; i < 3; i++) paint(ellPts(gx - 40 + 40 * i + 20 * Math.sin(t * 9 + i), gy - 90 + 12 * Math.cos(t * 11 + i), 7, 5, 8), { fill: INK.dark }); }
      if (t > tVal && t < tVal + .5) burst(1680, 540, 60, seg(t, tVal, tVal + .5), INK.orange, 8);
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- G · when tests mislead: green lights that mean nothing; a test that is furniture ----------
  function shotMislead(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('mislead');
    riso({ seed: 67 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tBad = wt('mislead', 'bad'), tWorse = wt('mislead', 'worse'), tTests = wt('mislead', 'tests'), tMock = wt('mislead', 'mock'), tLoose = wt('mislead', 'loose'), tCopy = wt('mislead', 'copy'),
      tGreen = wt('mislead', 'green'), tNoth = wt('mislead', 'nothing'), tIf = wt('mislead', 'if'), tSlip = wt('mislead', 'slip'), tFurn = wt('mislead', 'furniture');
    // a bad suite: a big green light that cracks
    const kL = stamp(t, tBad - .15) * (1 - ease(seg(t, tTests - .4, tTests - .1)));
    if (kL > .01) {
      push(); translate(960, 460); scale(kL); paint(rrPts(-120, 170, 240, 260, 20), { fill: INK.navy }); lamp(0, 0, 210, 'green');
      if (t > tWorse) { const kc = ease(seg(t, tWorse, tWorse + .25)); inkLine([[-200 * kc, -60], [-80 * kc, 10], [-20 * kc, -40], [60 * kc, 30], [200 * kc, -10]], 3, INK.paper, 'ink', 0, { force: true }); }
      pop();
    }
    // three kinds of misleading test
    const X = [390, 960, 1530], PY = 500, drop = ease(seg(t, tIf - .3, tIf + .2));
    const panel = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01 || drop >= 1) return; push(); translate(X[i], PY + 900 * easeIn(drop)); scale(k); paint(rrPts(-230, -210, 460, 420, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); lamp(160, -150, 44, t > tNoth + i * .12 ? 'hollow' : 'green', stamp(t, tGreen - .1 + i * .12)); pop(); };
    // tests the mock: a cardboard cut-out being checked
    panel(0, tMock, () => { paint(rectPts(-6, 60, 12, 120), { fill: INK.brown }); paint(rrPts(-110, -80, 220, 150, 10), { fill: INK.brown, tone: .45 }); for (const x of [-80, -35, 20, 65]) paint(rectPts(x, 70, 20, 30), { fill: INK.brown, tone: .45 }); paint(rectPts(-60, -40, 16, 36), { fill: INK.dark }); paint(rectPts(44, -40, 16, 36), { fill: INK.dark }); check(-120, -140, 1, stamp(t, tMock + .2)); });
    // too loose: a net with holes a bug walks through
    panel(1, tLoose, () => { for (let i = 0; i < 3; i++) { inkLine([[-160 + i * 160, -150], [-160 + i * 160, 170]], 1.2, INK.navy, 'ink', 0, { force: true }); inkLine([[-190, -110 + i * 130], [190, -110 + i * 130]], 1.2, INK.navy, 'ink', 0, { force: true }); } bug(lerp(-200, 200, frac((t - tLoose) * .4)), 90, .8, t); });
    // copies the implementation: two identical cards
    panel(2, tCopy, () => { card(-190, -90, 160, 200, INK.navy); card(30, -90, 160, 200, INK.navy); paint(rectPts(-22, -20, 44, 14), { fill: INK.orange }); paint(rectPts(-22, 10, 44, 14), { fill: INK.orange }); });
    // the subtle bug slips past the test; the test turns out to be furniture
    if (drop > 0) {
      const chair = ease(seg(t, tFurn - .2, tFurn + .3)), kg = stamp(t, tIf - .1);
      push(); translate(960, 880); scale(kg);
      if (chair < .5) { const s = 1 - chair * 2; gate(0, -90, 1.4 * (s * .9 + .1)); }
      else { const s = (chair - .5) * 2; push(); scale(backOut(s)); paint(rrPts(-170, -300, 340, 260, 60), { fill: INK.brown }); paint(rrPts(-230, -170, 90, 170, 40), { fill: INK.brown, tone: .8 }); paint(rrPts(140, -170, 90, 170, 40), { fill: INK.brown, tone: .8 }); paint(rrPts(-150, -110, 300, 100, 30), { fill: INK.orange, over: true }); paint(rectPts(-190, -10, 30, 20), { fill: INK.dark }); paint(rectPts(160, -10, 30, 20), { fill: INK.dark }); pop(); }
      pop();
      const bx = lerp(500, 1500, ease(seg(t, tSlip - .5, tSlip + 1.2)));
      if (t > tSlip - .5) bug(bx, 870, .7, t);
      clawd(1640, 900, 15, { ...emotions(t, [[tIf, 'suspicious', { lookX: -1 }], [tFurn, 'confused', { emote: '?', emoteK: 1 }]]), flip: true, emoteAge: t - tFurn });
    }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · the virtuous cycle; the review shifts; go write tests ----------
  function shotCycle(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('cycle');
    riso({ seed: 68 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tCyc = wt('cycle', 'cycle'), tComp = wt('cycle', 'compounds'), tTests = wt('cycle', 'tests'), tAuto = wt('cycle', 'autonomous'), tIter = wt('cycle', 'iteration'), tTime = wt('cycle', 'time'),
      tReview = wt('cycle', 'review'), tWork = wt('cycle', 'work'), tAppr = wt('cycle', 'approach'), tTune = wt('cycle', 'tune'), tChase = wt('cycle', 'chase'), tGo = wt('cycle', 'go'),
      tWrite = wt('cycle', 'write'), tNext = wt('cycle', 'convention');
    // the loop: it spins faster and faster (the cycle compounds)
    const CX = 720, CY = 480, R = 260, kl = stamp(t, tCyc - .2, .45);
    const s0 = Math.max(0, t - tComp), spin = t * .8 + .35 * s0 * s0 * .5;
    if (kl > .01) { push(); translate(CX, CY); scale(kl); loopArrow(0, 0, R, spin, INK.navy, 20); arcLine(0, 0, R, 20, INK.gold, { a0: spin + 1.2, a1: spin + 2.4, over: true }); pop(); }
    // the stations
    const st = (a, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(CX + Math.cos(a) * R, CY + Math.sin(a) * R); scale(k); paint(ellPts(0, 0, 105, 105, 40), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
    const allGreen = t > tWrite;
    st(-Math.PI / 2, tTests, () => { paint(rrPts(-50, -62, 100, 124, 12), { fill: INK.navy }); for (let i = 0; i < 3; i++) lamp(-20, -30 + i * 34, 12, t > tTime + i * .1 ? 'green' : 'off'); for (let i = 0; i < 3; i++) paint(rrPts(0, -36 + i * 34, 34, 10, 5), { fill: INK.paper }); });
    st(Math.PI / 6, tAuto, () => clawd(0, 55, 8.5, { ...feel('happy', T), ...move('bounce', T, 3), noShadow: true }));
    st(Math.PI * 5 / 6, tIter, () => stopwatch(0, 10, 62, (t - tIter) * 8));
    if (t > tTime - .1 && t < tTime + .6) glow(CX, CY - R, 170 * Math.sin(Math.PI * seg(t, tTime - .1, tTime + .6)), 'yellow', .7);
    // what's worth tuning later: a prompt dial and a shiny model, sliding away
    const away = easeIn(seg(t, tGo - .4, tGo + .2)) * 900;
    const kd = stamp(t, tTune - .1), km = stamp(t, tChase - .1);
    if (kd > .01 && away < 890) { push(); translate(1250 + away, 200); scale(kd * 1.1); paint(ellPts(0, 0, 90, 90, 40), { fill: INK.navy }); paint(ellPts(0, 0, 60, 60, 32), { fill: INK.gold }); paint(ribbon([[0, 0], [Math.cos(t * 2) * 55, Math.sin(t * 2) * 55]], 12, 6), { fill: INK.navy }); pop(); }
    if (km > .01 && away < 890) { push(); translate(1600 + away, 200); scale(km * 1.1); paint(rrPts(-100, -80, 200, 160, 20), { fill: INK.orange }); paint(starPts(70, -70, 40, .4, 4), { fill: INK.yellow }); paint(starPts(-80, 60, 26, .4, 4), { fill: INK.yellow }); pop(); }
    // the Skipper: the review shifts from "does it work" to "is it the right approach"; then writes a test
    const kS = stamp(t, tReview - .4);
    if (kS > .01) {
      const prop = t < tAppr - .1
        ? u => { paint(rrPts(-2.2 * u, -3.6 * u, 4.4 * u, 5.4 * u, .4 * u), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 3; i++) check(-.2 * u, -2.4 * u + i * 1.5 * u, .45, stamp(t, tWork + i * .12)); }
        : t < tWrite - .1 ? u => { paint(rrPts(-3 * u, -4 * u, 6 * u, 4.6 * u, .3 * u), { fill: INK.navy }); inkLine([[-2.2 * u, -2.4 * u], [0, -3.2 * u], [2 * u, -1.6 * u]], 1.2, INK.paper, 'ink', 0, { force: true }); paint(rectPts(-1.9 * u, -1.3 * u, 2.2 * u, 1.1 * u), { fill: INK.paper, tone: .7 }); paint(ellPts(1.4 * u, -.8 * u, .6 * u, .6 * u, 16), { fill: INK.gold }); }
        : u => { paint(rrPts(-2.2 * u, -3.6 * u, 4.4 * u, 5.4 * u, .4 * u), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 3; i++) { lamp(-1.1 * u, -2.5 * u + i * 1.5 * u, .5 * u, t > tWrite + .3 + i * .2 ? 'green' : 'off'); paint(rrPts(-.3 * u, -2.7 * u + i * 1.5 * u, 2 * u, .4 * u, .2 * u), { fill: INK.navy, tone: .6 }); } };
      skipper(1470, 1060 + 450 * (1 - kS), 25, { ...skipAct(t, [[tReview - .4, 'present', { mood: 'focused', flip: true }], [tAppr - .1, 'present', { mood: 'grin', flip: true }], [tTune, 'think', { mood: 'thinking', flip: true }], [tWrite - .1, 'present', { mood: 'happy', flip: true }]]), prop });
    }
    if (allGreen) glow(CX, CY - R, 160 * ease(seg(t, tWrite, tWrite + .5)), 'yellow', .5);
    if (t > tNext - .2) glow(CX, CY, 330 * stamp(t, tNext - .2), 'yellow', .8);
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { identLong(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCardLong(T0, lt, dur, '07', TIMING.next);   // endCard() with the title split over two lines
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotBlindIn(T0, lt, dur) { shotBlind(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('blind', 0), shotBlindIn],
    [shotAt('suite'), shotSuite],
    [shotAt('eyes'), shotEyes],
    [shotAt('tdd'), shotTdd],
    [shotAt('good'), shotGood],
    [shotAt('coverage'), shotCoverage],
    [shotAt('mislead'), shotMislead],
    [shotAt('cycle'), shotCycle],
    [B.cycle.end + .9, shotEnd],
  ]);
})();
