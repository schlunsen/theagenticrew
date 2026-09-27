// ch11.js: Chapter 11 · Articulating Intent. Storyboard: video/storyboards/ch11.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const bubble = (x, y, w, h, col = INK.paper, flip = false) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); const s = flip ? -1 : 1; paint([[x - s * w * .25, y + h / 2 - 4], [x - s * w * .32, y + h / 2 + 34], [x - s * w * .08, y + h / 2 - 4]], { fill: col }); };
  const bugIcon = (x, y, s, col = INK.dark) => { paint(ellPts(x, y, 26 * s, 34 * s, 16), { fill: col }); paint(ellPts(x, y - 36 * s, 16 * s, 14 * s, 12), { fill: col }); for (let j = 0; j < 3; j++) paint(ribbon([[x - 46 * s, y - 16 * s + j * 16 * s], [x + 46 * s, y - 16 * s + j * 16 * s]], 5 * s), { fill: col }); };
  const card = (x, y, w, h, n, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: o.fill || INK.paper, ink: INK.navy, sw: 1.1 }); for (let i = 0; i < n; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 28 + i * 34, (w - 48) * (.55 + .4 * hash(i + (o.seed || 0))), 14, 7), { fill: (o.hi === i) ? INK.orange : INK.navy, tone: (o.hi === i) ? 1 : .5 }); };
  const magnifier = (mx, my, r = 90) => { arcLine(mx, my, r, 20, INK.navy); paint(ellPts(mx, my, r - 10, r - 10, 40), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[mx + r * .72, my + r * .72], [mx + r * 1.7, my + r * 1.7]], 30), { fill: INK.navy }); };
  const padlock = (x, y, s, open = 0) => { push(); translate(x, y); scale(s); arcLine(0, -30 - 30 * open, 26, 10, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(-38, -30, 76, 60, 10), { fill: INK.gold }); paint(ellPts(0, -4, 8, 8, 10), { fill: INK.navy }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const snowflake = (x, y, r) => { for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; paint(ribbon([[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], r * .22), { fill: INK.navy }); } };

  // ---------- A · the guess: a vague prompt, a confident wrong answer ----------
  function shotGuess(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('guess');
    riso({ seed: 111 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tFix = wt('guess', 'fix'), tWhich = wt('guess', 'which'), tGuess = wt('guess', 'guess'), tConf = wt('guess', 'confidently'), tHand = wt('guess', 'hand'), tNever = wt('guess', 'never'),
      tSecret = wt('guess', 'secret'), tComm = wt('guess', 'communication'), tRep = wt('guess', 'report');
    const part2 = ease(seg(t, tSecret - .4, tSecret));
    // the scrap: a note with a bug, handed over
    const ks = stamp(t, tFix - .2);
    if (ks > .01 && t < tGuess) { const f = ease(seg(t, tFix + .2, tWhich)); push(); translate(lerp(560, 1100, f), lerp(560, 600, f) + 400 * part2); scale(ks * .8); card(0, 0, 200, 150, 0); bugIcon(0, 10, 1); pop(); }
    // three bugs; the agent picks one; the dart misses
    if (part2 < 1) {
      push(); translate(0, 700 * part2);
      const BX = [1150, 1400, 1650];
      BX.forEach((x, i) => { const k = stamp(t, tWhich + i * .1); if (k > .01) { paint(ellPts(x, 260, 90 * k, 90 * k, 40), { fill: INK.paper, ink: INK.navy, sw: 1 }); bugIcon(x, 270, .9 * k, i === 1 ? INK.orange : INK.dark); } });
      // the target (the real bug) and the dart that lands wide
      const kt = stamp(t, tConf - .3);
      if (kt > .01) { for (let r = 3; r > 0; r--) paint(ellPts(1400, 520, 36 * r * kt, 36 * r * kt, 40), { fill: r % 2 ? INK.orange : INK.paper }); }
      if (t > tConf) { const f = ease(seg(t, tConf, tConf + .4)), p = arcPt([1160, 800], [1650, 420], 120, f); paint(ribbon([[p[0] - 60, p[1] + 30], [p[0], p[1]]], 12, 6), { fill: INK.navy }); paint([[p[0] - 70, p[1] + 20], [p[0] - 76, p[1] + 50], [p[0] - 50, p[1] + 38]], { fill: INK.gold }); }
      pop();
    }
    // the gift nobody asked for
    if (t > tHand - .1 && part2 < 1) { const f = ease(seg(t, tHand - .1, tHand + .5)); push(); translate(lerp(1060, 720, f), 820 - 60 * Math.sin(Math.PI * f) + 500 * part2); paint(rrPts(-60, -50, 120, 100, 10), { fill: INK.orange }); paint(rectPts(-10, -50, 20, 100), { fill: INK.gold, over: true }); paint(rectPts(-60, -8, 120, 16), { fill: INK.gold, over: true }); pop(); }
    // part 2: no magic wand; communication; a good bug report
    if (part2 > 0) {
      const kw = stamp(t, tSecret - .2);
      if (kw > .01 && t < tComm - .2) { push(); translate(960, 330); scale(kw); rotate(-.5); paint(rrPts(-14, -130, 28, 260, 10), { fill: INK.navy }); paint(rrPts(-14, -130, 28, 50, 10), { fill: INK.paper }); pop(); paint(starPts(960 + 70, 330 - 110, 40 * kw, .45, 5), { fill: INK.gold }); stampX(960, 330, 150, stamp(t, tSecret + .3) * (1 - ease(seg(t, tComm - .5, tComm - .2)))); }
      if (t > tComm - .2) { for (let i = 0; i < 3; i++) { const f = frac((t - tComm) * .8 + i / 3), x = lerp(640, 1280, f); paint(ellPts(x, 520 - 60 * Math.sin(f * Math.PI), 24, 24, 16), { fill: INK.gold }); } bubble(760, 360, 180, 110, INK.paper); bubble(1160, 360, 180, 110, INK.paper, true); }
      const kr = stamp(t, tRep - .2);
      if (kr > .01) { push(); translate(960, 620); scale(kr); card(0, 0, 300, 220, 4, { seed: 3 }); bugIcon(100, -60, .6, INK.orange); check(80, 60, 1.3, stamp(t, tRep + .4)); pop(); }
    }
    skipper(360, 1060, 17, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tFix - .2, 'present', { mood: 'grin' }], [tHand + .5, 'shrug', { mood: 'worried' }], [tComm, 'present', { mood: 'happy' }], [tRep, 'point', { mood: 'grin' }]]));
    clawd(part2 > 0 ? lerp(1160, 1500, part2) : 1160, 960, 16, { ...emotions(t, [[b.start, 'happy'], [tGuess, 'determined'], [tConf + .5, 'proud'], [tNever, 'smug'], [tComm, 'happy']]), flip: true });
    camEnd();
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- B · anatomy: what, why, how; give it what tools can't find ----------
  function shotAnatomy(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('anatomy');
    riso({ seed: 112 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    for (let i = 0; i < 12; i++) paint(rectPts(i * 170, -100, 3, H + 200), { fill: INK.navy, tone: .15 });
    for (let i = 0; i < 7; i++) paint(rectPts(-100, i * 170, W + 200, 3), { fill: INK.navy, tone: .15 });
    const tWant = wt('anatomy', 'want'), tMat = wt('anatomy', 'matters'), tSucc = wt('anatomy', 'success'), tLogin = wt('anatomy', 'login'), tCold = wt('anatomy', 'cold'), tTest = wt('anatomy', 'test'),
      tPass = wt('anatomy', 'passing'), tFile = wt('anatomy', 'file'), tFind = wt('anatomy', 'find'), tSym = wt('anatomy', 'symptom'), tDom = wt('anatomy', 'domain'), tInt = wt('anatomy', 'intent');
    // the three tabs
    const TABS = [['WHAT', tWant, tSym], ['WHY', tMat, tDom], ['HOW', tSucc, tInt]];
    TABS.forEach(([w, t0, tp], i) => { const k = stamp(t, t0 - .15); if (k <= .01) return; const x = 560 + i * 280, lift = 20 * Math.sin(Math.PI * seg(t, tp - .1, tp + .5)); push(); translate(x, 200 - lift); scale(k); paint(rrPts(-120, -50, 240, 100, 20), { fill: [INK.orange, INK.gold, INK.paper][i], ink: i === 2 ? INK.navy : null, sw: 1.2 }); type(w, 0, 4, 54, INK.navy); pop(); });
    // the prompt card assembles
    const kc = stamp(t, tLogin - .3);
    if (kc > .01) {
      push(); translate(840, 560); scale(kc);
      paint(rrPts(-400, -250, 800, 500, 24), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      paint(rrPts(-400, -250, 800, 50, 24), { fill: INK.navy });
      const lines = [[tLogin, .8], [tCold, .6], [tTest, .7], [tPass, .5]];
      lines.forEach(([t0, w], i) => { const k = ease(seg(t, t0 - .1, t0 + .4)); if (k > 0) paint(rrPts(-340, -150 + i * 80, 560 * w * k, 26, 13), { fill: INK.navy, tone: .6 }); });
      if (t > tCold) snowflake(-340 + 560 * .6 + 60, -150 + 80 + 13, 30 * stamp(t, tCold));
      if (t > tTest) { const k = stamp(t, tTest); paint(rrPts(-340 + 560 * .7 + 30, -150 + 160 - 8, 90 * k, 42, 21), { fill: INK.green }); paint(rrPts(-340 + 560 * .7 + 30, -150 + 160 - 8, 45 * k, 42, 21), { fill: INK.orange, over: true }); }
      check(-340 + 560 * .5 + 80, -150 + 240 + 13, 1, stamp(t, tPass));
      pop();
    }
    // leave out the file path: it flies off the card; the agent finds it
    if (t > tFile - .2) { const f = ease(seg(t, tFile - .2, tFile + .5)), fp = [lerp(1080, 1560, f), lerp(420, 300, f) - 120 * Math.sin(Math.PI * f)]; fileIcon(fp[0], fp[1], 1); if (t > tFind - .3) { const k = ease(seg(t, tFind - .3, tFind + .3)); magnifier(lerp(1760, fp[0], k), lerp(700, fp[1], k), 90); } }
    clawd(1560, 1000, 15, { ...emotions(t, [[b.start, 'neutral'], [tLogin, 'thinking'], [tFind, 'idea'], [tSym, 'happy']]), flip: true });
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- C · constraints: guardrails on the bridge ----------
  function shotLimits(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('limits');
    riso({ seed: 113 });
    camBegin(960, 660, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 900], to: [0, 0], a: .5, b: .12 } });
    // water under the bridge
    paint(rectPts(-200, 820, W + 400, 400), { fill: INK.navy, tone: .75 });
    for (let i = 0; i < 3; i++) paint(ribbon(Array.from({ length: 24 }, (_, j) => [-200 + j * 100, 880 + i * 60 + 10 * Math.sin(j * .9 + t * 1.5 + i)]), 10), { fill: INK.navy, tone: .5, over: true });
    const tEager = wt('limits', 'eager'), tRew = wt('limits', 'rewritten'), tDeps = wt('limits', 'dependencies'), tPub = wt('limits', 'public'), tCons = wt('limits', 'constraints'), tGuard = wt('limits', 'guardrails'),
      tNo = wt('limits', 'no', 1), tTouch = wt('limits', 'touch'), tStay = wt('limits', 'stay');
    // the bridge deck and piers
    paint(rectPts(-200, 700, W + 400, 50), { fill: INK.brown });
    for (const x of [300, 960, 1620]) paint(rectPts(x - 40, 750, 80, 400), { fill: INK.brown, tone: .9 });
    // the mess an eager agent makes
    const clean = ease(seg(t, tCons - .3, tCons + .2));
    if (t > tRew - .2 && clean < 1) { const f = seg(t, tRew - .2, tRew + .8); push(); translate(1300 + 200 * f, 560 + 500 * f * f * (f > .6 ? 1 : 0)); rotate(f * 2); paint(rrPts(-80, -60, 160, 120, 12), { fill: INK.navy }); pop(); }
    for (let i = 0; i < 3; i++) { const k = stamp(t, tDeps - .1 + i * .12) * (1 - clean); if (k > .01) { push(); translate(560 + i * 110, 700 - 50 - 90 * (i === 2 ? 1 : 0)); scale(k); paint(rrPts(-50, -45, 100, 90, 8), { fill: [INK.orange, INK.gold, INK.green][i] }); paint(rectPts(-50, -8, 100, 14), { fill: INK.brown, over: true }); pop(); } }
    if (t > tPub - .2 && clean < 1) { const k = stamp(t, tPub - .2) * (1 - clean); push(); translate(1500, 500); scale(k); paint(rrPts(-80, -40, 110, 80, 12), { fill: INK.orange }); paint(rectPts(30, -26, 50, 14), { fill: INK.navy }); paint(rectPts(30, 12, 50, 14), { fill: INK.navy }); stampX(0, 0, 70, stamp(t, tPub + .4)); pop(); }
    // the guardrails stamp on, then three posts light
    const kg = ease(seg(t, tGuard - .2, tGuard + .5));
    if (kg > 0) {
      for (const y of [560, 620]) paint(rectPts(-200, y, (W + 400) * kg, 22), { fill: INK.orange, over: true });
      for (let i = 0; i < 12; i++) { const x = -40 + i * 180; if (x < (W + 200) * kg) paint(rectPts(x, 540, 24, 160), { fill: INK.orange, tone: .9 }); }
    }
    [tNo, tTouch, tStay].forEach((t0, i) => { const k = stamp(t, t0 - .1); if (k <= .01) return; const x = 520 + i * 440; paint(rrPts(x - 26, 500 - 30 * k, 52, 220 + 30 * k, 14), { fill: INK.navy }); paint(ellPts(x, 500 - 30 * k, 40 * k, 40 * k, 24), { fill: INK.gold }); check(x + 10, 500 - 30 * k - 4, .6, stamp(t, t0 + .3), INK.navy); });
    // the agent on the bridge: rushing, then steady within the rails
    const run = seg(t, tEager - .3, tRew + .2);
    const cx = lerp(200, 1100, easeOut(run)) + (t > tCons ? lerp(0, -140, ease(seg(t, tCons, tCons + .6))) : 0);
    clawd(cx, 700, 14, { ...emotions(t, [[b.start, 'neutral'], [tEager, 'excited'], [tPub + .4, 'nervous'], [tGuard + .4, 'relieved'], [tStay, 'happy']]), walk: run > 0 && run < 1 ? t * 12 : 0, rot: run > 0 && run < 1 ? .1 : 0 });
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- D · split: a project into verifiable steps; independent ones in parallel ----------
  function shotSplit(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('split');
    riso({ seed: 114 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tDash = wt('split', 'dashboard'), tProj = wt('split', 'project'), tSplit = wt('split', 'split'), tModel = wt('split', 'model'), tEnd = wt('split', 'endpoint'), tFilt = wt('split', 'filtering'),
      tView = wt('split', 'view'), tChk = wt('split', 'checked'), tInd = wt('split', 'independent'), tPar = wt('split', 'parallel');
    const broken = ease(seg(t, tSplit - .1, tSplit + .3)), lanes = ease(seg(t, tInd - .3, tInd + .3));
    // the big block drops in
    const kb = seg(t, tDash - .2, tDash + .3);
    if (kb > 0 && broken < 1) { const y = lerp(-400, 640, easeIn(kb)); paint(rrPts(700, y - 300, 520, 600, 20), { fill: INK.navy, alpha: 1 - broken }); if (t > tProj) paint(rrPts(700, y - 300, 520, 600, 20), { fill: INK.orange, tone: .4 * (1 - broken), over: true }); if (kb >= 1 && t < tProj + .4) for (let i = 0; i < 6; i++) { const a = Math.PI + i * Math.PI / 5, k = seg(t, tDash + .3, tDash + .8); paint(ellPts(960 + Math.cos(a) * (280 + 80 * k), 930 + Math.sin(a) * 40 * k, 20 * (1 - k), 20 * (1 - k), 12), { fill: INK.navy, tone: .5 }); } }
    // four steps
    const ST = [[360, tModel], [720, tEnd], [1080, tFilt], [1440, tView]];
    if (broken > 0) ST.forEach(([x, t0], i) => {
      const k = stamp(t, tSplit + i * .1) * (1 - lanes); if (k <= .01) return;
      const on = ease(seg(t, t0 - .2, t0 + .1)), h = 160 + i * 110; push(); translate(x, 940); scale(k); paint(rectPts(-160, -h, 320, h), { fill: [INK.gold, INK.orange, INK.green, INK.brown][i], tone: .3 + .7 * on });
      push(); translate(0, -h - 90); scale(backOut(seg(t, t0 - .2, t0 + .15)));
      if (i === 0) { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) paint(rectPts(-66 + c * 46, -50 + r * 36, 40, 30), { fill: r ? INK.navy : INK.gold, tone: r ? .4 : 1 }); }
      else if (i === 1) { paint(ellPts(0, 0, 50, 50, 28), { fill: INK.navy }); paint(ribbon([[-90, 0], [-50, 0]], 16), { fill: INK.navy }); paint(ribbon([[50, 0], [90, 0]], 16), { fill: INK.navy }); }
      else if (i === 2) paint([[-70, -50], [70, -50], [14, 20], [14, 60], [-14, 60], [-14, 20]], { fill: INK.navy });
      else { paint(rrPts(-80, -55, 160, 110, 12), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(rectPts(-60 + j * 44, 30 - 20 * (j + 1), 30, 20 * (j + 1)), { fill: INK.gold }); }
      pop();
      check(90, -h + 50, 1, stamp(t, tChk + i * .15), INK.navy);
      pop();
    });
    // three independent lanes, three agents in parallel
    if (lanes > 0) {
      for (let i = 0; i < 3; i++) { const y = 360 + i * 220; paint(rectPts(200, y, 1520 * lanes, 90), { fill: [INK.gold, INK.orange, INK.green][i], tone: .6 }); paint(rectPts(1680, y - 30, 16, 150), { fill: INK.navy }); paint([[1696, y - 30], [1780, y], [1696, y + 30]], { fill: INK.orange }); }
      for (let i = 0; i < 3; i++) { const f = ease(seg(t, tPar - .5 + hash(i) * .2, tPar + 1.2 + hash(i + 2) * .3)); clawd(lerp(280, 1600, f), 360 + i * 220 + 80, 8, { ...feel(f >= 1 ? 'happy' : 'determined', T + i), walk: f > 0 && f < 1 ? t * 12 + i : 0, boilKey: 'p' + i }); }
    } else clawd(1720, 940, 13, { ...emotions(t, [[b.start, 'neutral'], [tProj, 'scared'], [tSplit + .3, 'happy'], [tChk + .5, 'proud']]), flip: true, boilKey: 'main' });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · plan: read, propose, fix it in the plan, not the diff ----------
  function shotPlan(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('plan');
    riso({ seed: 115 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tPlan = wt('plan', 'plan'), tChange = wt('plan', 'change'), tRead = wt('plan', 'read'), tTouch = wt('plan', 'touch'), tVer = wt('plan', 'verify'), tWrong = wt('plan', 'wrong'), tSent = wt('plan', 'sentence'),
      tGiant = wt('plan', 'giant'), tWhole = wt('plan', 'whole');
    // the code, locked
    const kc = stamp(t, tChange - .3);
    if (kc > .01) { push(); translate(1500, 330); scale(kc); paint(rrPts(-220, -150, 440, 300, 20), { fill: INK.navy }); type('{ }', -120, -60, 80, INK.gold); for (let i = 0; i < 4; i++) paint(rrPts(-150 + 30 * (i % 2), 10 + i * 30, 240 - 40 * hash(i), 14, 7), { fill: INK.paper, tone: .7 }); padlock(150, -140, 1.4 * stamp(t, tChange)); pop(); }
    // files fan out on "read"
    for (let i = 0; i < 3; i++) { const k = stamp(t, tRead - .1 + i * .08); if (k > .01) fileIcon(1260 + i * 130, 640 + (i === 1 ? -20 : 0), .9 * k); }
    // the plan sheet: short, one wrong line, fixed in a sentence
    const kp = stamp(t, tPlan - .2);
    const pl = seg(t, tPlan, tVer + .4);
    if (kp > .01) {
      push(); translate(620, 470); scale(kp);
      paint(rrPts(-230, -290, 460, 520, 18), { fill: INK.paper, ink: INK.navy, sw: 1.3 });
      paint(rrPts(-80, -310, 160, 40, 10), { fill: INK.navy });
      const wrongK = ease(seg(t, tWrong - .1, tWrong + .3)), fixed = t > tSent;
      for (let i = 0; i < Math.floor(6 * pl + (t > tPlan ? 1 : 0)); i++) { const w = 330 - 90 * hash(i + 7), y = -220 + i * 64; paint(ellPts(-180, y + 10, 12, 12, 10), { fill: INK.navy }); paint(rrPts(-150, y, w, 20, 10), { fill: i === 3 && wrongK > 0 && !fixed ? INK.orange : INK.navy, tone: i === 3 && wrongK > 0 && !fixed ? 1 : .5 }); if (i === 3) check(w - 110, y + 10, .8, stamp(t, tSent + .2)); }
      if (t > tSent - .5 && t < tSent + .6) { const f = seg(t, tSent - .5, tSent + .6), px = lerp(-140, 190, f); push(); translate(px, -40 + 10 * Math.sin(f * 30)); rotate(-.6); paint(rrPts(-14, -110, 28, 150, 6), { fill: INK.gold }); paint([[-14, 40], [14, 40], [0, 76]], { fill: INK.navy }); pop(); }
      pop();
    }
    // the giant diff: unrolls long, then crumples away
    const kd = ease(seg(t, tGiant - .2, tGiant + .6)), crush = ease(seg(t, tWhole, tWhole + .5));
    if (kd > 0) {
      const h = 880 * kd * (1 - crush * .8), w = 360 * (1 - crush * .5), x = 1500, y0 = 60 + 400 * crush;
      paint(rectPts(x - w / 2, y0, w, h), { fill: INK.paper, ink: INK.navy, sw: 1 });
      for (let i = 0; i < Math.floor(h / 26); i++) paint(rectPts(x - w / 2 + 20, y0 + 12 + i * 26, (w - 40) * (.3 + .6 * hash(i)), 12), { fill: hash(i + 3) > .5 ? INK.green : INK.orange, over: true });
      if (crush > 0) stampX(x, y0 + h / 2, 150, stamp(t, tWhole + .2));
    }
    clawd(1000, 940, 15, { ...emotions(t, [[b.start, 'neutral'], [tPlan, 'thinking'], [tWrong, 'nervous'], [tSent + .2, 'happy'], [tGiant + .2, 'scared'], [tWhole + .5, 'relieved']]), flip: true, aR: kp > .5 ? .8 : 0 });
    skipper(260, 1060, 16, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tPlan, 'point', { mood: 'grin' }], [tWrong, 'think', { mood: 'thinking' }], [tSent, 'present', { mood: 'happy' }]]));
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- F · iterate: debug your own communication ----------
  function shotIterate(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('iterate');
    riso({ seed: 116 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tPerf = wt('iterate', 'perfect'), tWrong = wt('iterate', 'wrong'), tFail = wt('iterate', 'failed'), tErr = wt('iterate', 'error'), tStack = wt('iterate', 'stack'), tDebug = wt('iterate', 'debugging'), tComm = wt('iterate', 'communication');
    const good = t > tComm - .1;
    loopArrow(960, 500, 330, t * .6, INK.navy, 14);
    // the prompt (left) and the output (right)
    const kp = stamp(t, b.start);
    if (kp > .01) { push(); translate(560, 500); scale(kp); card(0, 0, 340, 300, t > tStack ? 6 : 3, { hi: t > tDebug + .3 ? 4 : -1, seed: 5 }); pop(); }
    const ko = stamp(t, tPerf - .3);
    if (ko > .01) {
      push(); translate(1360, 500); scale(ko);
      paint(rrPts(-170, -150, 340, 300, 16), { fill: good ? INK.green : t > tErr ? INK.orange : INK.paper, ink: INK.navy, sw: 1.1, tone: good ? .8 : 1 });
      if (t > tErr && !good) { type('!', 0, -30, 130, INK.paper); paint(rrPts(-110, 80, 220, 18, 9), { fill: INK.paper }); }
      if (!good && t > tWrong) stampX(0, 0, 110, stamp(t, tWrong) * (t > tErr ? 0 : 1));
      if (good) check(0, 0, 2.2, stamp(t, tComm));
      pop();
    }
    if (t > tDebug - .4 && t < tComm + .4) { const k = ease(seg(t, tDebug - .4, tDebug + .3)); magnifier(lerp(760, 590, k), lerp(900, 640, k), 90); }
    skipper(300, 1060, 15, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tFail, 'think', { mood: 'thinking' }], [tDebug, 'point', { mood: 'focused' }], [tComm, 'cheer', { mood: 'happy' }]]));
    clawd(1600, 1020, 13, { ...emotions(t, [[b.start, 'neutral'], [tWrong, 'sad'], [tComm, 'happy']]), flip: true });
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · voice and visuals ----------
  function shotVoice(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('voice');
    riso({ seed: 117 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tTyp = wt('voice', 'typing'), tShr = wt('voice', 'shrink'), tSpeak = wt('voice', 'speaking', 1), tStory = wt('voice', 'story'), tShow = wt('voice', 'show'), tShot = wt('voice', 'screenshot'), tPara = wt('voice', 'paragraphs');
    const talking = t > tSpeak - .2;
    // the keyboard and the shrinking typed prompt
    if (!talking) { paint(rrPts(290, 925, 300, 44, 10), { fill: INK.dark }); for (let i = 0; i < 6; i++) paint(rrPts(306 + i * 46, 935, 38, 14, 4), { fill: INK.paper, tone: .6 }); const s = 1 - .6 * ease(seg(t, tShr - .2, tShr + .6)); push(); translate(600, 460); scale(s * stamp(t, tTyp - .2)); card(0, 0, 360, 260, 5, { seed: 8 }); pop(); }
    // speaking: a long ribbon of speech runs to the agent
    if (talking) {
      const k = ease(seg(t, tSpeak - .2, tStory + .4)) * (1 - ease(seg(t, tShow - .3, tShow)));
      if (k > 0) { const P = Array.from({ length: 20 }, (_, i) => [560 + i * 60 * k, 400 + 50 * Math.sin(i * .9 + t * 3)]); paint(ribbon(P, 70), { fill: INK.gold, over: true }); for (let i = 0; i < 20 * k; i += 2) paint(ellPts(P[i][0], P[i][1], 8, 8, 8), { fill: INK.navy }); }
    }
    // show it: a phone with a broken layout flies to the agent; paragraphs are X-ed
    if (t > tShow - .2) {
      const f = ease(seg(t, tShow - .2, tShot + .3)); push(); translate(lerp(560, 1100, f), lerp(600, 420, f) - 120 * Math.sin(Math.PI * f)); rotate(-.15 + .15 * f);
      paint(rrPts(-110, -200, 220, 400, 30), { fill: INK.navy }); paint(rrPts(-90, -170, 180, 340, 12), { fill: INK.paper });
      paint(rrPts(-70, -140, 140, 40, 8), { fill: INK.orange }); paint(rrPts(-40, -110, 160, 60, 8), { fill: INK.gold, over: true }); for (let i = 0; i < 3; i++) paint(rrPts(-70, -20 + i * 40, 120 - 30 * i, 16, 8), { fill: INK.navy, tone: .5 });
      pop();
      const kp = stamp(t, tPara - .4);
      if (kp > .01) { for (let i = 0; i < 3; i++) { push(); translate(1500, 200 + i * 160); scale(kp); card(0, 0, 280, 130, 3, { seed: i }); pop(); } stampX(1500, 360, 190, stamp(t, tPara + .2)); }
    }
    skipper(420, 1060, 17, skipAct(t, [[b.start, 'type', { mood: 'focused' }], [tShr, 'type', { mood: 'sleepy' }], [tSpeak - .2, 'present', { mood: 'happy' }], [tShow, 'point', { mood: 'grin' }]]));
    clawd(1260, 1000, 15, { ...emotions(t, [[b.start, 'neutral'], [tShr, 'sad'], [tStory, 'happy'], [tShot + .3, 'idea']]), flip: true });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · prompts are code: skills, slash commands, versioned; it's engineering ----------
  function shotSkills(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('skills');
    riso({ seed: 118 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 1100], to: [0, 0], a: .45, b: .1 } });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tCode = wt('skills', 'code'), tSave = wt('skills', 'save'), tSk = wt('skills', 'skills'), tSlash = wt('skills', 'slash'), tGit = wt('skills', 'git'), tRev = wt('skills', 'reviewed'), tEng = wt('skills', 'engineering'), tLocal = wt('skills', 'local');
    // the folder
    const kf = stamp(t, tCode - .3);
    if (kf > .01) { push(); translate(620, 480); scale(kf); paint(rrPts(-240, -200, 180, 60, 16), { fill: INK.gold }); paint(rrPts(-240, -170, 480, 340, 22), { fill: INK.gold }); pop(); }
    // prompt cards file themselves in
    [[tSk, 0], [tSlash, 1]].forEach(([t0, i]) => { const f = ease(seg(t, t0 - .3, t0 + .3)); if (f <= 0) return; push(); translate(lerp(1200, 560 + i * 130, f), lerp(260, 420, f)); rotate(.2 * (1 - f)); card(0, 0, 200, 150, 3, { seed: i * 3 }); if (i === 1) type('/', 60, -40, 60, INK.orange); pop(); });
    if (kf > .01) { push(); translate(620, 480); scale(kf); paint(rrPts(-240, -60, 480, 230, 22), { fill: INK.gold, over: true, tone: .85 }); pop(); }
    // a git branch graph grows
    const kg = ease(seg(t, tGit - .2, tGit + .8));
    if (kg > 0) { inkLine([[1100, 700], [1100 + 600 * kg, 700]], 1.6, INK.navy, 'ink', 0, { force: true }); for (let i = 0; i < 5; i++) if (i / 5 < kg) paint(ellPts(1130 + i * 130, 700, 26, 26, 20), { fill: i === 2 ? INK.orange : INK.navy }); if (kg > .4) inkLine(through([[1260, 700], [1330, 580], [1460, 580], [1520, 700]]), 1.4, INK.orange, 'ink', .5, { force: true }); check(1520, 540, 1.2, stamp(t, tRev + .2)); }
    // it's engineering: the two of them at the helm
    const ke = stamp(t, tEng - .3);
    if (ke > .01) helm(960, 300, 120 * ke, t * .4, INK.gold, INK.navy);
    if (t > tLocal - .2) glow(960, 300, 260 * stamp(t, tLocal - .2), 'yellow', .8);
    skipper(260, 1060, 16, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tSave, 'present', { mood: 'grin' }], [tEng - .2, 'cheer', { mood: 'happy' }]]));
    clawd(1640, 1000, 15, { ...emotions(t, [[b.start, 'neutral'], [tSk, 'happy'], [tEng, 'proud']]), flip: true });
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '12', '');   // the next title is long: print it smaller so it fits the sheet
    type(TIMING.next.toUpperCase(), 960, 600, 64, INK.navy, { pop: seg(onTwos(lt), .8, 1.2) });
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotGuessIn(T0, lt, dur) { shotGuess(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('guess', 0), shotGuessIn],
    [shotAt('anatomy'), shotAnatomy],
    [shotAt('limits'), shotLimits],
    [shotAt('split'), shotSplit],
    [shotAt('plan'), shotPlan],
    [shotAt('iterate'), shotIterate],
    [shotAt('voice'), shotVoice],
    [shotAt('skills'), shotSkills],
    [B.skills.end + .9, shotEnd],
  ]);
})();
