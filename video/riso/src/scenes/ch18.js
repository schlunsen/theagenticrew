// ch18.js: Chapter 18 · Agentic Teams. Storyboard: video/storyboards/ch18.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); if (o.thought) { for (let i = 0; i < 3; i++) paint(ellPts(x + o.thought[0] * (i + 1) / 4, y + h / 2 + o.thought[1] * (i + 1) / 4, 16 - i * 3, 16 - i * 3, 12), { fill: col, ink: INK.navy, sw: .9 }); } else paint([[x - w * .25, y + h / 2 - 4], [x - w * .32, y + h / 2 + 34], [x - w * .08, y + h / 2 - 4]], { fill: col }); if (o.dots) for (let i = 0; i < 3; i++) paint(ellPts(x - 30 + i * 30, y, 9, 9, 12), { fill: INK.orange }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const pr = (x, y, s, col = INK.paper, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-100, -65, 200, 130, 14), { fill: col, ink: INK.navy, sw: 1 }); paint(rrPts(-80, -45, 26, 26, 8), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rrPts(-40, -42 + i * 32, i === 2 ? 70 : 120, 14, 7), { fill: INK.navy, tone: .6 }); pop(); };
  const clock = (x, y, r, t, col = INK.paper) => { paint(ellPts(x, y, r, r, 48), { fill: col, ink: INK.navy, sw: 1.6 }); paint(rrPts(x - r * .15, y - r * 1.25, r * .3, r * .25, 6), { fill: INK.navy }); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ellPts(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, r * .04, r * .04, 8), { fill: INK.navy }); } const a = -Math.PI / 2 + t * 2.2; inkLine([[x, y], [x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7]], r * .012, INK.orange, 'ink', 0, { force: true }); paint(ellPts(x, y, r * .08, r * .08, 12), { fill: INK.navy }); };
  const ship = (x, y, s, rock = 0) => { push(); translate(x, y); rotate(rock); scale(s); paint([[-120, 0], [120, 0], [90, 60], [-90, 60]], { fill: INK.navy }); inkLine([[0, 0], [0, -170]], 1.4, INK.dark, 'ink', 0, { force: true }); paint([[6, -160], [100, -20], [6, -20]], { fill: INK.gold }); paint([[-6, -140], [-80, -20], [-6, -20]], { fill: INK.orange }); pop(); };
  const magnifier = (mx, my, r = 100) => { arcLine(mx, my, r, 22, INK.navy); paint(ellPts(mx, my, r * .9, r * .9, 40), { fill: 'yellow', tone: .4, over: true }); paint(ribbon([[mx + r * .72, my + r * .72], [mx + r * 1.7, my + r * 1.7]], 34), { fill: INK.navy }); };
  const tile = (x, y, s, col, o = {}) => paint(rrPts(x - s / 2, y - s / 2, s, s, s * .14), { fill: col, tone: o.tone ?? 1, over: o.over });
  const scales = (x, y, s, tilt) => { push(); translate(x, y); scale(s); paint(rrPts(-12, -160, 24, 220, 10), { fill: INK.navy }); paint(rrPts(-80, 50, 160, 30, 12), { fill: INK.navy }); push(); translate(0, -160); rotate(tilt); paint(rrPts(-150, -10, 300, 20, 10), { fill: INK.gold }); for (const sx of [-140, 140]) { inkLine([[sx, 0], [sx - 40, 90]], .9, INK.navy, 'ink', 0, { force: true }); inkLine([[sx, 0], [sx + 40, 90]], .9, INK.navy, 'ink', 0, { force: true }); paint([[sx - 60, 90], [sx + 60, 90], [sx + 35, 120], [sx - 35, 120]], { fill: INK.orange }); } pop(); paint(ellPts(0, -160, 20, 20, 16), { fill: INK.orange }); pop(); };

  // ---------- A · the gut: it felt faster; it was slower ----------
  function shotGut(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('gut');
    const tTrial = wt('gut', 'trial'), tDev = wt('gut', 'developers'), tSlow = wt('gut', 'slower'), tBel = wt('gut', 'believed'), tFast = wt('gut', 'faster'),
      tGut = wt('gut', 'gut'), tMeas = wt('gut', 'measuring'), tTeam = wt('gut', 'team');
    const back = ease(seg(t, tTeam - .3, tTeam + .6));
    riso({ seed: 181 });
    camBegin(960, 540 + 60 * back, 1.02 - .22 * back);
    paint(rectPts(-600, -400, W + 1200, H + 800), { fill: 'yellow', tone: .22 });
    paint(rectPts(-600, 1040, W + 1200, 600), { fill: INK.navy, tone: .8 });
    // the stopwatch: a timed trial
    const ks = stamp(t, tTrial - .2);
    if (ks > .01) { push(); translate(980, 330); scale(ks); clock(0, 0, 120, t > tTrial ? t - tTrial : 0); pop(); }
    // the chart: a panel with a baseline; the real bar drops, the felt arrow rises (overprint on the panel)
    const kp = stamp(t, tDev - .2);
    if (kp > .01) {
      push(); translate(1480, 560); scale(kp);
      paint(rrPts(-300, -330, 600, 660, 30), { fill: INK.navy, tone: .14 });
      paint(rectPts(-260, -4, 520, 8), { fill: INK.navy });
      const dn = backOut(seg(t, tSlow - .15, tSlow + .35));
      if (dn > 0) paint(rectPts(-200, 4, 160, 190 * dn), { fill: INK.navy });
      const up = backOut(seg(t, tFast - .15, tFast + .4));
      if (up > 0) { const h = 250 * up; paint(rectPts(40, -h + 40, 120, h - 40), { fill: INK.orange, over: true }); paint([[10, -h + 50], [190, -h + 50], [100, -h - 60]], { fill: INK.orange, over: true }); }
      pop();
    }
    // the thought bubble: it felt faster; X-ed when the ruler lands
    const kb = stamp(t, tBel - .2);
    if (kb > .01) {
      push(); translate(620, 420); scale(kb); bubble(0, 0, 320, 190, INK.paper, { thought: [-160, 190] });
      paint(rectPts(-20, -10, 40, 70), { fill: INK.orange }); paint([[-50, -6], [50, -6], [0, -70]], { fill: INK.orange });
      pop();
      stampX(620, 420, 110, stamp(t, tMeas + .15));
    }
    // "not a measuring instrument": a ruler slams down under the chart
    const kr = stamp(t, tMeas - .15);
    if (kr > .01) { push(); translate(1480, 940 - 200 * (1 - kr)); rotate(-.05); paint(rrPts(-320, -30, 640, 60, 8), { fill: INK.gold }); for (let i = 0; i <= 16; i++) paint(rectPts(-300 + i * 37.5 - 3, -30, 6, i % 4 ? 22 : 38), { fill: INK.navy }); pop(); }
    // the engineer and the agent; the gut pat
    skipper(330, 1040, 16, skipAct(t, [[b.start, 'type', { mood: 'focused' }], [tSlow, 'stand', { mood: 'neutral', lookX: .8 }], [tBel - .1, 'hips', { mood: 'proud' }], [tGut - .1, 'shrug', { mood: 'surprised' }], [tMeas + .3, 'think', { mood: 'thinking' }]]));
    clawd(560, 1040, 13, { ...emotions(t, [[b.start, 'determined'], [tFast, 'happy'], [tMeas + .2, 'surprised'], [tTeam, 'neutral']]) });
    // on a team: more engineers and agents in the row
    if (back > 0) {
      const k = backOut(seg(t, tTeam - .1, tTeam + .5));
      skipper(-110, 1040 + 400 * (1 - k), 15, { ...SKIP_POSES.stand, mood: 'grin', t });
      clawd(90, 1040 + 400 * (1 - k), 12, { ...feel('happy', T + .3) });
      skipper(2040, 1040 + 400 * (1 - k), 15, { ...SKIP_POSES.stand, mood: 'neutral', flip: true, t });
      clawd(1860, 1040 + 400 * (1 - k), 12, { ...feel('neutral', T + .7), flip: true });
    }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · a spike graph, an amplifier, measure outcomes ----------
  function shotSpike(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('spike');
    riso({ seed: 182 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tTen = wt('spike', '10x'), tSpike = wt('spike', 'spike'), tFlat = wt('spike', 'flat'), tBoil = wt('spike', 'boiler'), tRef = wt('spike', 'refactors'), tMin = wt('spike', 'minutes'),
      tSys = wt('spike', 'system'), tRace = wt('spike', 'race'), tAmp = wt('spike', 'amplify'), tTests = wt('spike', 'tests'), tBetter = wt('spike', 'better'), tWeak = wt('spike', 'weak'), tWorse = wt('spike', 'worse'),
      tOc = wt('spike', 'outcomes'), tLead = wt('spike', 'lead'), tShip = wt('spike', 'ship'), tLines = wt('spike', 'lines');
    // phase 1: the chart
    const p1 = 1 - ease(seg(t, tAmp - .5, tAmp - .1));
    if (p1 > .01) {
      push(); translate(0, 700 * (1 - p1));
      const Y = 800, kb = ease(seg(t, b.start, b.start + .6));
      paint(rectPts(200, Y, 1520 * kb, 10), { fill: INK.navy });
      type('10×', 1250, 200, 130, INK.orange, { pop: seg(t, tTen - .1, tTen + .25) });
      type('10×', 1258, 208, 130, INK.navy, { pop: seg(t, tTen, tTen + .35), over: true, tone: .5 });
      const H0 = [140, 200, 110, 170, 150, 90, 180, 80, 130, 160], hot = { 1: tBoil, 3: tRef }, cold = { 5: tSys, 7: tRace };
      for (let i = 0; i < 10; i++) {
        const x = 330 + i * 140, flatK = 1 - backOut(seg(t, tSpike - .1 + i * .03, tSpike + .3 + i * .03));
        let h = lerp(H0[i] * .9, 260, flatK * (t > b.start + .3 ? 1 : 0)) * ease(seg(t, b.start + .1 + i * .04, b.start + .5 + i * .04));
        let col = INK.navy, tn = .45;
        if (hot[i] != null) { const k = backOut(seg(t, hot[i] - .1, hot[i] + .35)); h = lerp(h, 560, k); if (k > 0) { col = INK.orange; tn = 1; } }
        if (cold[i] != null) { const k = seg(t, cold[i] - .1, cold[i] + .2); h = lerp(h, 40, ease(k)); if (k > 0) { col = INK.navy; tn = 1; } }
        if (h > 1) paint(rrPts(x - 45, Y - h, 90, h, 10), { fill: col, tone: tn });
      }
      // "not a flat multiplier": the flat line, broken
      const kf = seg(t, tFlat - .2, tFlat + .3);
      if (kf > 0 && t < tBoil) { for (let i = 0; i < 16 * kf; i++) paint(rectPts(220 + i * 95, 536, 60, 10), { fill: INK.gold }); }
      if (t > tMin - .2) clawd(470, Y - 560 * backOut(seg(t, tBoil - .1, tBoil + .35)), 9, { ...feel('excited', T), dy: jump(t, tMin - .1, tMin + .4, 2).dy });
      pop();
    }
    // phase 2: an amplifier: two towers
    const p2 = ease(seg(t, tAmp - .2, tAmp + .3)) * (1 - ease(seg(t, tOc - .5, tOc - .1)));
    if (p2 > .01) {
      push(); translate(0, 700 * (1 - p2));
      // the amplifier cone and its waves
      const ka = stamp(t, tAmp - .1);
      push(); translate(960, 250); scale(ka); paint([[-60, -30], [-20, -30], [50, -80], [50, 80], [-20, 30], [-60, 30]], { fill: INK.navy }); for (let i = 0; i < 3; i++) { const f = frac((t - tAmp) * 1.2 + i / 3); arcLine(60, 0, 50 + 90 * f, 12, INK.orange, { a0: -.7, a1: .7, cap: 'round' }); } pop();
      // good foundations: a sturdy base, blocks stack up
      paint(rectPts(420, 900, 400, 60), { fill: INK.green });
      const nG = 2 + Math.floor(5 * ease(seg(t, tTests, tBetter + .4)));
      for (let i = 0; i < nG; i++) { const k = backOut(seg(t, tTests + i * .18 - .2, tTests + i * .18 + .1)); if (k > 0) paint(rrPts(470, 900 - (i + 1) * 90 * k, 300, 84, 10), { fill: i % 2 ? INK.gold : INK.orange }); }
      // weak foundations: a cracked base, the tower leans and sheds a block
      paint(rectPts(1100, 900, 180, 60), { fill: INK.brown }); paint(rectPts(1300, 900, 180, 60), { fill: INK.brown }); inkLine([[1290, 900], [1275, 930], [1300, 960]], 1, INK.navy, 'ink', 0, { force: true });
      const lean = .16 * ease(seg(t, tWeak, tWorse + .3));
      push(); translate(1290, 900); rotate(lean);
      for (let i = 0; i < 4; i++) { const fall = i === 3 ? easeIn(seg(t, tWorse, tWorse + .5)) : 0; paint(rrPts(-150 + fall * 260, -(i + 1) * 90 + fall * 330, 300, 84, 10), { fill: INK.navy, tone: .75 }); }
      pop();
      if (t > tWorse) skipper(1700, 1040, 13, { ...SKIP_POSES.facepalm, mood: 'worried', t });
      else if (t > tBetter - .2) skipper(1700, 1040, 13, { ...SKIP_POSES.point, mood: 'grin', flip: true, t });
      pop();
    }
    // phase 3: measure outcomes, not lines
    if (t > tOc - .3) {
      const k1 = stamp(t, tLead - .2), k2 = stamp(t, tShip - .2), k3 = stamp(t, tLines - .2);
      type('OUTCOMES', 960, 190, 96, INK.navy, { pop: seg(t, tOc - .2, tOc + .2) });
      if (k1 > .01) { push(); translate(480, 560); scale(k1); clock(0, 0, 150, t - tLead); pop(); }
      if (k2 > .01) { push(); translate(960, 640); scale(k2); paint(rectPts(-260, 20, 520, 40), { fill: 'federal', tone: .5 }); ship(0, 0, 1.3, .06 * wob(t, .7)); pop(); }
      if (k3 > .01) { push(); translate(1450, 560); scale(k3); for (let i = 0; i < 9; i++) paint(rrPts(-150 + 20 * hash(i), -190 + i * 42, 200 + 100 * hash(i + 4), 22, 11), { fill: INK.navy, tone: .55 }); pop(); stampX(1470, 560, 150, stamp(t, tLines + .25)); }
    }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · code review: the pile, intent over lines, a bot is a filter ----------
  function shotReview(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('review');
    riso({ seed: 183 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tPile = wt('review', 'pile'), tTwo = wt('review', 'two'), tFive = wt('review', 'five'), tExh = wt('review', 'exhausting'), tCor = wt('review', 'correct'), tApp = wt('review', 'approach'),
      tArch = wt('review', 'architects'), tBot = wt('review', 'bot'), tFil = wt('review', 'filter'), tBug = wt('review', 'bug'), tFeat = wt('review', 'features'), tEx = wt('review', 'exist');
    // phase 1: the pile on the desk
    const p1 = 1 - ease(seg(t, tCor - .6, tCor - .2));
    const n = t < tTwo ? Math.min(1, Math.floor((t - tPile + .2) * 3)) : t < tFive ? 2 : Math.min(11, 5 + Math.floor((t - tFive) * 3));
    if (p1 > .01) {
      push(); translate(0, 400 * (1 - p1));
      paint(rrPts(700, 820, 900, 40, 12), { fill: INK.brown }); paint(rectPts(760, 860, 30, 180), { fill: INK.brown }); paint(rectPts(1510, 860, 30, 180), { fill: INK.brown });
      for (let i = 0; i < Math.max(0, n); i++) { const land = [tPile, tPile + .2, tTwo, tFive - .2, tFive - .1, tFive, tFive + .33, tFive + .66, tFive + 1, tFive + 1.33, tFive + 1.66][i]; const k = easeOut(seg(t, land - .2, land + .1)); const st = i % 2; pr(1000 + (st ? 260 : 0) + 20 * hash(i) - 10, 780 - Math.floor(i / 2) * 70 - 500 * (1 - k), 1, INK.paper, .08 * (hash(i + 7) - .5)); }
      pop();
    }
    // phase 2: is this correct → is this the right approach (zoom out to the blueprint)
    const p2 = ease(seg(t, tCor - .4, tCor)) * (1 - ease(seg(t, tBot - .6, tBot - .2)));
    if (p2 > .01) {
      const z = ease(seg(t, tApp - .2, tApp + .5));
      push(); translate(1100, 480); scale(p2 * lerp(1, .32, z));
      paint(rrPts(-420, -260, 840, 520, 30), { fill: INK.paper, ink: INK.navy, sw: 2 });
      for (let i = 0; i < 6; i++) paint(rrPts(-360 + (i % 2) * 60, -200 + i * 70, 420 + 200 * hash(i), 30, 15), { fill: i === 3 ? INK.orange : INK.navy, tone: i === 3 ? 1 : .5 });
      if (z < .3) magnifier(-60 + 60 * Math.sin(t * 2), 30, 110);
      pop();
      if (z > 0) {
        // the blueprint around it: other services and their boundaries
        const kz = ease(seg(t, tApp, tApp + .6));
        const boxes = [[750, 280], [1450, 280], [750, 700], [1450, 700]];
        for (const [x, y] of boxes) inkLine([[1100, 480], [x, y]], 1, INK.navy, 'ink', 0, { force: true, tone: .7 * kz });
        boxes.forEach(([x, y], i) => { const k = backOut(seg(t, tApp + i * .1, tApp + .35 + i * .1)); if (k > .01) paint(rrPts(x - 110 * k, y - 70 * k, 220 * k, 140 * k, 16), { fill: [INK.navy, INK.gold, INK.green, INK.navy][i], tone: i === 3 ? .5 : 1 }); });
        paint(rrPts(560, 150, 1080, 700, 40), { fill: 'federal', tone: .12 * kz, over: true });
      }
    }
    // phase 3: a review bot is a filter
    const p3 = ease(seg(t, tBot - .3, tBot + .1));
    if (p3 > .01) {
      push(); translate(1150, 360); scale(p3);
      paint([[-220, -150], [220, -150], [50, 70], [50, 200], [-50, 200], [-50, 70]], { fill: INK.navy, tone: .85 });
      for (let i = 0; i < 7; i++) inkLine([[-190 + i * 63, -140], [-40 + i * 13, 60]], .6, INK.paper, 'ink', 0, { force: true, tone: .6 });
      pop();
      // cards fall through
      for (let i = 0; i < 4; i++) { const t0 = tBot + .2 + i * .7; if (t < t0 || t > t0 + 1.6) continue; const f = seg(t, t0, t0 + 1.6); pr(1150 + 30 * Math.sin(i), lerp(-100, 900, f), .55 * p3, INK.paper, i * .4 + f); }
      // the bug: caught in the mesh
      if (t > tBug - .6) { const k = backOut(seg(t, tBug - .5, tBug)); const by = lerp(-80, 280, k); push(); translate(1150, by); paint(ellPts(0, 0, 34, 44, 20), { fill: INK.orange }); paint(ellPts(0, -44, 20, 18, 14), { fill: INK.dark }); for (const s of [-1, 1]) for (let j = 0; j < 3; j++) inkLine([[s * 26, -18 + j * 18], [s * 60, -30 + j * 26]], .7, INK.dark, 'ink', 0, { force: true }); pop(); if (t > tBug) paint(ellPts(1150, 280, 90 * backOut(seg(t, tBug, tBug + .3)), 90 * backOut(seg(t, tBug, tBug + .3)), 30), { fill: 'yellow', tone: .5, over: true }); }
      // the feature that shouldn't exist: sails straight through and gets the X
      if (t > tFeat - .2) { const f = ease(seg(t, tFeat - .2, tFeat + .5)); pr(lerp(1150, 700, f), lerp(-120, 760, f), 1.1, INK.gold, -.06); stampX(700, 760, 120, stamp(t, tEx)); }
      clawd(1560, 1040, 16, { ...emotions(t, [[tBot - .3, 'determined'], [tBug, 'proud'], [tFeat + .2, 'confused']]), flip: true, hat: 'hard' });
    }
    skipper(340, 1040, 18, skipAct(t, [[b.start, 'stand', { mood: 'grin', lookX: .8 }], [tFive, 'shrug', { mood: 'surprised' }], [tExh - .2, 'facepalm', { mood: 'worried' }], [tCor, 'think', { mood: 'focused' }], [tArch - .1, 'present', { mood: 'proud' }], [tBot, 'stand', { mood: 'neutral', lookX: .8 }], [tEx - .1, 'point', { mood: 'focused' }]]));
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 400, cy: 800 });
  }

  // ---------- D · juniors: the struggle was the education; explain → pair → draft → multiply ----------
  function shotJunior(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('junior');
    riso({ seed: 184 });
    camBegin(960, 540, 1 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 1000, W + 400, 400), { fill: INK.navy, tone: .7 });
    const tJun = wt('junior', 'juniors'), tStr = wt('junior', 'struggle'), tEdu = wt('junior', 'education'), tTut = wt('junior', 'tutor'), tRep = wt('junior', 'replacement'),
      tExp = wt('junior', 'explains'), tPair = wt('junior', 'pairs'), tUnd = wt('junior', 'understood'), tDraft = wt('junior', 'drafts'), tMul = wt('junior', 'multiply');
    // four steps
    const SX = [560, 860, 1160, 1460], SW = 300, SH = 125, top = i => 1000 - (i + 1) * SH;
    for (let i = 0; i < 4; i++) { const k = backOut(seg(t, b.start + .1 + i * .1, b.start + .45 + i * .1)); if (k > .01) paint(rectPts(SX[i], 1000 - (i + 1) * SH * k, SW, (i + 1) * SH * k + 4), { fill: [INK.gold, INK.orange, INK.brown, INK.navy][i] }); }
    // an icon on each riser
    const icon = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(SX[i] + SW / 2, top(i) + 80); scale(k); paint(ellPts(0, 0, 56, 56, 28), { fill: INK.paper }); fn(); pop(); };
    icon(0, tExp, () => type('?', 0, 4, 76, INK.orange));
    icon(1, tPair, () => { paint(ellPts(-18, 0, 20, 20, 16), { fill: INK.navy }); paint(ellPts(20, 0, 20, 20, 16), { fill: INK.orange }); });
    icon(2, tDraft, () => { paint(rrPts(-26, -34, 52, 68, 6), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(rectPts(-16, -20 + j * 16, 32, 6), { fill: INK.paper }); });
    icon(3, tMul, () => type('×', 0, 0, 90, INK.orange));
    // the junior climbs: floor, then a step on each word
    const stops = [[b.start, 330, 1000], [tExp, SX[0] + 130, top(0)], [tPair, SX[1] + 130, top(1)], [tDraft, SX[2] + 130, top(2)], [tMul, SX[3] + 130, top(3)]];
    let si = 0; while (si + 1 < stops.length && t >= stops[si + 1][0] - .3) si++;
    const A = stops[Math.max(0, si - 1)], Bs = stops[si], hop = si === 0 ? 1 : ease(seg(t, Bs[0] - .3, Bs[0] + .1)), P = arcPt([A[1], A[2]], [Bs[1], Bs[2]], 90, hop);
    skipper(P[0], P[1], 10, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tStr, 'facepalm', { mood: 'worried' }], [tTut, 'think', { mood: 'thinking' }], [tExp, 'stand', { mood: 'grin' }], [tUnd, 'think', { mood: 'focused' }], [tDraft, 'hips', { mood: 'grin' }], [tMul, 'cheer', { mood: 'happy' }]]));
    // the struggle: a tangle over the junior's head, which becomes the lesson
    const kk = stamp(t, tStr - .2) * (1 - ease(seg(t, tTut - .3, tTut)));
    if (kk > .01) { push(); translate(330, 700); scale(kk); const Pk = []; for (let i = 0; i < 22; i++) Pk.push([Math.cos(i * 2.4) * (40 + 50 * hash(i)), Math.sin(i * 2.9) * (30 + 40 * hash(i + 9))]); inkLine(through(Pk), 1.3, INK.navy, 'ink', .6, { force: true }); if (t > tEdu) glow(0, 0, 120 * ease(seg(t, tEdu, tEdu + .4)), 'yellow', .8); pop(); }
    // the tutor: Clawd in a wizard's hat, a step behind the junior
    const kt = stamp(t, tTut - .2);
    if (kt > .01) {
      const cs = Math.max(0, si - 1), C = si <= 1 ? [200, 1000] : [SX[cs - 1] + 70, top(cs - 1)];
      clawd(C[0], C[1] + 300 * (1 - kt), 8, { ...emotions(t, [[tTut - .2, 'happy'], [tRep, 'proud'], [tUnd, 'thinking'], [tMul, 'excited']]), hat: 'wizard' });
      if (t > tRep - .2 && t < tExp) { push(); translate(420, 560); scale(stamp(t, tRep - .2)); bubble(0, 0, 150, 90, INK.paper, { dots: true }); pop(); }
    }
    // multiply: copies fan out from the top step
    if (t > tMul - .1) { const k = backOut(seg(t, tMul - .1, tMul + .4)); glow(SX[3] + 150, top(3) - 150, 260 * k, 'yellow', .7); for (let i = 0; i < 3; i++) pr(SX[3] + 150 + (i - 1) * 190 * k, top(3) - 330 - (i === 1 ? 40 : 0) * k, .6 * k, [INK.gold, INK.orange, INK.gold][i], (i - 1) * .2); }
    type('JUNIORS', 1300, 180, 80, INK.navy, { pop: seg(t, tJun - .1, tJun + .25), alpha: 1 - seg(t, tStr - .2, tStr) });
    camEnd();
    tIn('iris', lt, { cx: 400, cy: 800 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · the bus factor: one fluent engineer; shared instructions, skills, rotation ----------
  function shotBus(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('bus');
    riso({ seed: 185 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 980, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tFl = wt('bus', 'fluent'), tShips = wt('bus', 'ships'), tTouch = wt('bus', 'touched'), tCode = wt('bus', 'codebase'), tBus = wt('bus', 'bus'), tOne = wt('bus', 'one', 1),
      tStruct = wt('bus', 'structural'), tAg = wt('bus', 'agents'), tSk = wt('bus', 'skills'), tRot = wt('bus', 'rotation'), tKn = wt('bus', 'knowledge'), tOutp = wt('bus', 'output');
    // phase 1: the codebase as tiles; one engineer's trail lights them all
    const p1 = 1 - ease(seg(t, tStruct - .4, tStruct));
    if (p1 > .01) {
      push(); translate(0, -900 * (1 - p1));
      const cols = 7, rows = 4, x0 = 620, y0 = 200, s = 120, g = 14;
      const order = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) order.push([r % 2 ? cols - 1 - c : c, r]);
      const lit = Math.floor(order.length * seg(t, tShips - .2, tCode + .3));
      order.forEach(([c, r], i) => { const k = backOut(seg(t, b.start + i * .02, b.start + .3 + i * .02)); if (k > .01) tile(x0 + c * (s + g) + s / 2, y0 + r * (s + g) + s / 2, s * k, i < lit ? INK.orange : INK.navy, { tone: i < lit ? 1 : .3 }); });
      if (lit > 0 && lit < order.length) { const [c, r] = order[lit]; paint(ellPts(x0 + c * (s + g) + s / 2, y0 + r * (s + g) + s / 2, 30, 30, 20), { fill: INK.gold }); }
      // the fluent one, and the rest of the team watching
      skipper(360, 980, 13, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tFl, 'type', { mood: 'focused' }], [tCode, 'hips', { mood: 'proud' }]]));
      for (let i = 0; i < 3; i++) skipper(1600 + i * 110, 980, 9, { ...SKIP_POSES.stand, mood: t > tTouch ? 'worried' : 'neutral', flip: true, t: t + i });
      // the bus, and the number that matters
      const kb = seg(t, tBus - .6, tBus + .3);
      if (kb > 0) { const bx = lerp(-400, 900, easeOut(kb)); paint(rrPts(bx - 240, 800, 480, 170, 30), { fill: INK.gold }); for (let i = 0; i < 4; i++) paint(rrPts(bx - 210 + i * 110, 830, 80, 60, 10), { fill: INK.paper }); paint(ellPts(bx - 150, 975, 38, 38, 20), { fill: INK.dark }); paint(ellPts(bx + 150, 975, 38, 38, 20), { fill: INK.dark }); }
      type('1', 1720, 560, 300, INK.orange, { pop: seg(t, tOne - .1, tOne + .25) });
      type('1', 1732, 572, 300, INK.navy, { pop: seg(t, tOne, tOne + .3), over: true, tone: .5 });
      pop();
    }
    // phase 2: the fix is structural
    if (t > tStruct - .3) {
      const item = (x, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(x, 400); scale(k); fn(); pop(); };
      item(520, tAg, () => { paint([[-120, -160], [70, -160], [120, -110], [120, 160], [-120, 160]], { fill: INK.paper, ink: INK.navy, sw: 1.4 }); for (let i = 0; i < 5; i++) paint(rectPts(-90, -70 + i * 40, 150 + 30 * hash(i), 12), { fill: INK.navy, tone: .55 }); type('AGENTS.MD', 0, -118, 34, INK.orange); });
      item(960, tSk, () => { paint(rrPts(-150, -60, 300, 170, 18), { fill: INK.orange }); arcLine(0, -60, 50, 16, INK.orange, { a0: Math.PI, a1: TAU }); paint(rectPts(-150, 10, 300, 14), { fill: INK.dark }); paint(starPts(0, 60, 34, .45, 5), { fill: INK.yellow }); });
      item(1400, tRot, () => loopArrow(0, 0, 120, t * 2, INK.navy, 22));
      // the team: the knowledge spreads to everyone
      for (let i = 0; i < 4; i++) {
        const x = 420 + i * 360, k = backOut(seg(t, tStruct - .2 + i * .08, tStruct + .2 + i * .08)), lit = seg(t, tKn - .2 + i * .15, tKn + .2 + i * .15);
        if (lit > 0) paint(ellPts(x, 975, 140 * backOut(lit), 34 * backOut(lit), 28), { fill: INK.orange, over: true });
        if (k > .01) skipper(x, 980 + 300 * (1 - k), 10, { ...SKIP_POSES[lit > 0 ? 'cheer' : 'stand'], mood: lit > 0 ? 'happy' : 'neutral', flip: i >= 2, t: t + i * .4 });
      }
      if (t > tKn - .2) for (let i = 0; i < 4; i++) { const f = seg(t, tKn - .2 + i * .1, tKn + .5 + i * .1); if (f > 0 && f < 1) { const p = arcPt([960, 480], [420 + i * 360, 800], 120, ease(f)); paint(ellPts(p[0], p[1], 22, 22, 16), { fill: INK.gold }); } }
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- F · the new standup: intent, not progress; conventions shape every session ----------
  function shotStandup(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('standup');
    riso({ seed: 186 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tSt = wt('standup', 'stand'), tStart = wt('standup', 'start'), tFin = wt('standup', 'finish'), tSt2 = wt('standup', 'stand', 1), tProg = wt('standup', 'progress'), tInt = wt('standup', 'intent'),
      tSend = wt('standup', 'sending'), tProb = wt('standup', 'problem'), tConv = wt('standup', 'conventions'), tShape = wt('standup', 'shape'), tSess = wt('standup', 'session');
    // phase 1: a timeline with two standups; a task starts and finishes between them
    const p1 = 1 - ease(seg(t, tInt - .3, tInt + .1));
    if (p1 > .01) {
      push(); translate(0, -700 * (1 - p1));
      const kl = ease(seg(t, b.start, b.start + .6));
      paint(rectPts(300, 330, 1320 * kl, 12), { fill: INK.navy });
      const flag = (x, t0) => { const k = stamp(t, t0 - .15); if (k <= .01) return; inkLine([[x, 336], [x, 336 - 170 * k]], 1.3, INK.dark, 'ink', 0, { force: true }); paint([[x, 336 - 170 * k], [x + 90, 336 - 140 * k], [x, 336 - 110 * k]], { fill: INK.orange }); };
      flag(420, tSt); flag(1500, tSt2);
      if (t > tStart - .2) { const f = ease(seg(t, tStart, tFin + .3)); const x = lerp(560, 1300, f); pr(x, 440, .9 * stamp(t, tStart - .2), INK.gold); paint(rectPts(560, 520, (x - 560), 14), { fill: INK.orange, over: true }); check(1370, 440, 1.2, stamp(t, tFin + .3)); }
      // three engineers around a table
      for (let i = 0; i < 3; i++) skipper(620 + i * 340, 1000, 12, { ...SKIP_POSES[t > tProg && i === 1 ? 'present' : 'stand'], mood: t > tFin + .3 ? 'surprised' : 'neutral', flip: i === 2, t: t + i });
      paint(ellPts(960, 1010, 620, 70, 60), { fill: INK.brown });
      paint(ellPts(960, 1002, 560, 48, 60), { fill: INK.orange, tone: .4, over: true });
      pop();
    }
    // phase 2: three agents sent after the same problem
    const p2 = ease(seg(t, tInt - .1, tInt + .3)) * (1 - ease(seg(t, tConv - .4, tConv)));
    if (p2 > .01) {
      const kbx = stamp(t, tInt);
      push(); translate(1060, 420); scale(kbx * p2); paint(rrPts(-130, -130, 260, 260, 24), { fill: INK.navy }); type('?', 0, 6, 170, INK.yellow); pop();
      const froms = [[300, 1000], [1060, 1250], [1820, 1000]], to = [[870, 760], [1060, 780], [1250, 760]];
      const run = ease(seg(t, tSend - .5, tProb));
      for (let i = 0; i < 3; i++) {
        const x = lerp(froms[i][0], to[i][0], run), y = lerp(froms[i][1], to[i][1], run);
        paint(ribbon([[froms[i][0], froms[i][1] - 60], [lerp(froms[i][0], to[i][0], run * .9), lerp(froms[i][1], to[i][1], run * .9) - 60]], 26 * p2, 8), { fill: INK.orange, over: true, tone: .8 });
        clawd(x, y, 10 * p2, { ...(t > tProb ? feel('dizzy', T) : feel('determined', T)), ...(t < tProb ? move('run', T, i) : {}), flip: i === 2, dy: t > tProb ? jump(t, tProb, tProb + .35, 1.5).dy : 0, emote: t > tProb ? 'stars' : null, emoteK: 1, emoteAge: t - tProb });
      }
      if (t > tProb - .4) skipper(300, 1040, 15, { ...SKIP_POSES.pointUp, mood: 'focused', t, dy: 400 * (1 - backOut(seg(t, tProb - .4, tProb))) });
    }
    // phase 3: conventions: every agent starts from the same foundation
    if (t > tConv - .3) {
      for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const k = backOut(seg(t, tShape - .3 + (c + r) * .03, tShape + (c + r) * .03)); if (k > .01) tile(240 + c * 180, 220 + r * 170, 130 * k, [INK.navy, INK.gold, INK.navy][r], { tone: r === 1 ? 1 : .35 }); }
      for (let i = 0; i < 5; i++) { const k = backOut(seg(t, tConv - .2 + i * .08, tConv + .2 + i * .08)); if (k > .01) clawd(360 + i * 300, 1000 + 300 * (1 - k), 11, { ...feel('happy', T + i * .2), ...move('bounce', T, i), hat: t > tSess - .1 + i * .06 ? 'hard' : null }); }
    }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · the audit trail: git, the reviewer owns it, keep the logs ----------
  function shotAudit(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('audit');
    riso({ seed: 187 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tInc = wt('audit', 'incident'), tResp = wt('audit', 'responsible'), tSimp = wt('audit', 'simpler'), tGit = wt('audit', 'git'), tTrail = wt('audit', 'trail'), tMark = wt('audit', 'mark'), tCons = wt('audit', 'consistently'),
      tRev = wt('audit', 'reviewer'), tAppr = wt('audit', 'approves'), tOwns = wt('audit', 'owns'), tLogs = wt('audit', 'logs'), tMonths = wt('audit', 'months'), tSaw = wt('audit', 'saw');
    // phase 1: an incident, and a question
    const p1 = 1 - ease(seg(t, tSimp, tSimp + .4));
    if (p1 > .01) {
      push(); translate(620, 600); scale(p1);
      for (let i = 0; i < 3; i++) { paint(rrPts(-170, -220 + i * 130, 340, 110, 14), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(ellPts(-130 + j * 30, -165 + i * 130, 9, 9, 10), { fill: t > tInc && j === 0 ? INK.orange : INK.green }); }
      if (t > tInc - .2) { const k = stamp(t, tInc - .2); paint(rrPts(-50, -300 - 40 * k, 100, 70, 30), { fill: INK.orange }); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .35, r0 = 60 + 20 * pulse(T, 4); paint(ribbon([[Math.cos(a) * r0, -300 + Math.sin(a) * r0], [Math.cos(a) * (r0 + 60), -300 + Math.sin(a) * (r0 + 60)]], 12 * k), { fill: INK.orange }); } }
      pop();
      type('?', 1300, 470, 360 * p1, INK.orange, { pop: seg(t, tResp - .1, tResp + .3) });
      type('?', 1314, 484, 360 * p1, INK.navy, { pop: seg(t, tResp, tResp + .35), over: true, tone: .45 });
    }
    // phase 2: git is the audit trail; mark every agent-assisted commit
    if (t > tGit - .3) {
      const kl = ease(seg(t, tGit - .2, tTrail + .4)), N = 7;
      paint(rectPts(220, 316, 1480 * kl, 14), { fill: INK.navy });
      for (let i = 0; i < N; i++) {
        const x = 280 + i * 230, k = backOut(seg(t, tGit - .1 + i * .15, tGit + .2 + i * .15)); if (k <= .01) continue;
        paint(ellPts(x, 323, 40 * k, 40 * k, 24), { fill: INK.paper, ink: INK.navy, sw: 1.6 });
        const km = stamp(t, tMark + i * .22);
        if (km > .01) { push(); translate(x, 220); rotate(-.2); scale(km); paint([[-55, -24], [40, -24], [62, 0], [40, 24], [-55, 24]], { fill: INK.orange }); paint(ellPts(40, 0, 7, 7, 10), { fill: INK.paper }); pop(); paint(ellPts(x, 323, 18, 18, 14), { fill: INK.orange }); }
      }
    }
    // the reviewer approves: the stamp comes down on the pull request
    if (t > tRev - .3) {
      const kc = stamp(t, tRev - .3);
      pr(1200, 700, 1.5 * kc, INK.paper, -.04);
      const down = t < tAppr ? 0 : backOut(seg(t, tAppr, tAppr + .25));
      if (t > tAppr - .3) { const sy = lerp(470, 640, down); paint(rrPts(1320, sy - 110, 60, 110, 14), { fill: INK.brown }); paint(rrPts(1270, sy, 160, 40, 10), { fill: INK.dark }); }
      if (t > tOwns - .1) { const k = stamp(t, tOwns - .1); paint(ellPts(1240, 720, 110 * k, 110 * k, 40), { fill: INK.orange, tone: .7, over: true }); check(1240, 720, 1.6, k, INK.navy); }
      skipper(1680, 1040 + 300 * (1 - kc), 15, skipAct(t, [[tRev - .3, 'stand', { mood: 'neutral', flip: true }], [tAppr - .1, 'point', { mood: 'focused', flip: true }], [tOwns + .2, 'hips', { mood: 'proud', flip: true }]]));
    }
    // keep the session logs: a scroll unrolls; months later, an eye opens on it
    if (t > tLogs - .3) {
      const ku = ease(seg(t, tLogs - .2, tMonths + .2)), h = 440 * ku;
      paint(rrPts(260, 520, 480, h, 14), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
      for (let i = 0; i < Math.floor(h / 44); i++) paint(rrPts(300, 550 + i * 44, 240 + 140 * hash(i + 2), 14, 7), { fill: i % 3 === 1 ? INK.orange : INK.navy, tone: .6 });
      paint(rrPts(240, 500, 520, 40, 20), { fill: INK.brown }); paint(rrPts(240, 505 + h, 520, 40, 20), { fill: INK.brown });
      const ke = seg(t, tSaw - .3, tSaw + .2);
      if (ke > 0) { const oy = 60 * ease(ke); paint(ellPts(500, 740, 170, oy, 40), { fill: INK.paper, ink: INK.navy, sw: 2 }); paint(ellPts(500, 740, 55 * ease(ke), 55 * ease(ke), 28), { fill: INK.navy }); paint(ellPts(500, 740, 110, 110 * ease(ke), 40), { fill: 'yellow', tone: .5, over: true }); }
      clawd(870, 1040, 11, { ...emotions(t, [[tLogs - .3, 'neutral'], [tSaw, 'surprised']]), flip: false });
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · hiring: judgment over whiteboard speed; an agent for the rest ----------
  function shotHire(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('hire');
    riso({ seed: 188 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tHire = wt('hire', 'hire'), tWb = wt('hire', 'whiteboard'), tSys = wt('hire', 'system'), tJud = wt('hire', 'judgment'), tCom = wt('hire', 'communication'), tBrk = wt('hire', 'breaking'),
      tPie = wt('hire', 'pieces'), tHire2 = wt('hire', 'hire', 1), tRest = wt('hire', 'rest'), tFinal = wt('hire', 'final'), tDying = wt('hire', 'dying');
    // the whiteboard: a binary tree, X-ed
    const pw = stamp(t, tHire - .1) * (1 - ease(seg(t, tSys - .4, tSys)));
    if (pw > .01) {
      push(); translate(960, 430); scale(pw);
      paint(rrPts(-340, -230, 680, 420, 20), { fill: INK.paper, ink: INK.navy, sw: 2.2 });
      const N = [[0, -150], [-150, -40], [150, -40], [-220, 80], [-80, 80], [80, 80], [220, 80]];
      [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([a, c]) => inkLine([N[a], N[c]], 1, INK.navy, 'ink', 0, { force: true }));
      N.forEach(([x, y]) => paint(ellPts(x, y, 30, 30, 18), { fill: INK.gold }));
      pop();
      stampX(960, 430, 190, stamp(t, tWb + .3) * pw);
    }
    // four cards: design, judgment, communication, decomposition
    const X = [420, 780, 1140, 1500], focus = ease(seg(t, tHire2 - .2, tHire2 + .5));
    const cardAt = (i, t0, fn) => {
      let k = stamp(t, t0 - .15); if (k <= .01) return;
      let x = X[i], y = 430, s = k;
      if (i === 1) { x = lerp(x, 960, focus); y = lerp(y, 420, focus); s = k * (1 + .5 * focus); } else s = k * (1 - focus);
      if (s <= .01) return;
      push(); translate(x, y); scale(s); paint(rrPts(-150, -170, 300, 340, 26), { fill: [INK.navy, INK.paper, INK.gold, INK.paper][i], ink: INK.navy, sw: 1.4 }); fn(); pop();
    };
    cardAt(0, tSys, () => { for (let i = 0; i < 4; i++) paint(rectPts(-150 + i * 75, -170, 3, 340), { fill: INK.paper, tone: .3 }); paint(rrPts(-90, -90, 80, 60, 8), { fill: INK.gold }); paint(rrPts(20, -90, 80, 60, 8), { fill: INK.orange }); paint(rrPts(-35, 40, 80, 60, 8), { fill: INK.paper }); inkLine([[-50, -30], [5, 40]], .8, INK.paper, 'ink', 0, { force: true }); inkLine([[60, -30], [5, 40]], .8, INK.paper, 'ink', 0, { force: true }); });
    if (focus > .01 && t > tHire2) glow(960, 420, 360 * focus, 'yellow', .8);
    cardAt(1, tJud, () => scales(0, 40, .85, .12 * Math.sin(t * 1.6)));
    cardAt(2, tCom, () => { bubble(-30, -50, 170, 100, INK.paper, { dots: true }); push(); scale(-1, 1); bubble(-30, 80, 150, 90, INK.paper); pop(); });
    cardAt(3, tBrk, () => { const sp = backOut(seg(t, tPie - .1, tPie + .3)) * 30; for (let i = 0; i < 4; i++) { const dx = (i % 2 ? 1 : -1) * sp, dy = (i < 2 ? -1 : 1) * sp; paint(rrPts(-90 + (i % 2) * 90 + dx, -90 + (i < 2 ? 0 : 90) + dy, 86, 86, 10), { fill: [INK.orange, INK.navy, INK.navy, INK.orange][i] }); } });
    // interviewer and candidate
    skipper(260, 1040, 15, skipAct(t, [[b.start, 'think', { mood: 'thinking' }], [tWb, 'shrug', { mood: 'neutral' }], [tSys, 'present', { mood: 'grin' }], [tHire2, 'pointUp', { mood: 'focused' }], [tRest, 'hips', { mood: 'happy' }]]));
    skipper(1680, 1040, 12, { ...SKIP_POSES[t > tRest ? 'cheer' : 'stand'], mood: t > tRest ? 'happy' : 'neutral', flip: true, t });
    // an agent for the rest: Clawd hops in beside the candidate
    if (t > tRest - .5) { const f = seg(t, tRest - .5, tRest + .1), p = arcPt([2100, 1040], [1460, 1040], 220, ease(f)); clawd(p[0], p[1], 11, { ...(f < 1 ? { ...feel('excited', T), sq: -.1 } : feel('happy', T)), flip: true }); }
    if (t > tFinal - .2) { const k = stamp(t, tFinal - .2); glow(960, 780, 200 * k, 'yellow', .8); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '19', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotGutIn(T0, lt, dur) { shotGut(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('gut', 0), shotGutIn],
    [shotAt('spike'), shotSpike],
    [shotAt('review'), shotReview],
    [shotAt('junior'), shotJunior],
    [shotAt('bus'), shotBus],
    [shotAt('standup'), shotStandup],
    [shotAt('audit'), shotAudit],
    [shotAt('hire'), shotHire],
    [B.hire.end + .9, shotEnd],
  ]);
})();
