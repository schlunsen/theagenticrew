// ch17.js: Chapter 17 · When Not to Use Agents. Storyboard: video/storyboards/ch17.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const pencil = (x, y, s, rot) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -110, 40, 180, 8), { fill: INK.gold }); paint([[-20, 70], [20, 70], [0, 118]], { fill: INK.paper, ink: INK.brown, sw: 1 }); paint([[-6, 104], [6, 104], [0, 118]], { fill: INK.dark }); pop(); };
  const hourglass = (x, y, s, sand = .5) => { push(); translate(x, y); scale(s); paint(rrPts(-70, -110, 140, 20, 8), { fill: INK.brown }); paint(rrPts(-70, 90, 140, 20, 8), { fill: INK.brown }); paint([[-55, -90], [55, -90], [8, 0], [55, 90], [-55, 90], [-8, 0]], { fill: INK.paper, ink: INK.navy, sw: 1 }); paint([[-40 * (1 - sand), -80 + 70 * sand], [40 * (1 - sand), -80 + 70 * sand], [0, -6]], { fill: INK.gold }); paint([[-50 * sand, 88], [50 * sand, 88], [0, 88 - 60 * sand]], { fill: INK.gold }); pop(); };
  const magnifier = (x, y, s, col = INK.dark) => { push(); translate(x, y); scale(s); arcLine(0, 0, 70, 16, col); paint(ellPts(0, 0, 62, 62, 32), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[52, 52], [120, 120]], 24), { fill: col }); pop(); };
  const bulb = (x, y, s, on = 1) => { push(); translate(x, y); scale(s); if (on > .01) glow(0, 0, 120 * on, 'yellow', .7); paint(ellPts(0, 0, 50, 54, 28), { fill: on > .5 ? INK.yellow : INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-22, 48, 44, 30, 6), { fill: INK.navy }); pop(); };
  const hooded = (x, y, s) => { push(); translate(x, y); scale(s); paint([[-110, 0], [-90, -260], [90, -260], [110, 0]], { fill: INK.dark, curv: .3 }); paint(ellPts(0, -330, 90, 100, 36), { fill: INK.dark }); paint(ellPts(0, -310, 56, 64, 30), { fill: INK.navy, tone: .6 }); for (const sd of [-1, 1]) paint(ellPts(sd * 20, -316, 8, 6, 10), { fill: INK.yellow }); pop(); };
  const toolbox = (x, y, s, lid = 0) => { push(); translate(x, y); scale(s); paint(rrPts(-170, -110, 340, 150, 16), { fill: INK.orange }); paint(rrPts(-170, -60, 340, 16, 6), { fill: INK.brown }); push(); translate(-170, -110); rotate(-1.9 * lid); paint(rrPts(0, -30, 340, 36, 12), { fill: INK.brown }); pop(); arcLine(0, -150 + 10 * lid, 50, 12, INK.navy, { a0: Math.PI, a1: TAU }); pop(); };
  const crab = (x, y, s) => { push(); translate(x, y); scale(s); for (const sd of [-1, 1]) { for (let i = 0; i < 3; i++) inkLine([[sd * 60, 10 + i * 16], [sd * 120, 40 + i * 20]], 2, INK.orange, 'ink', 0, { force: true }); paint(ellPts(sd * 130, -60, 36, 28, 18), { fill: INK.orange }); paint([[sd * 110, -60], [sd * 170, -80], [sd * 150, -50]], { fill: INK.paper }); inkLine([[sd * 70, -20], [sd * 120, -50]], 2.2, INK.orange, 'ink', 0, { force: true }); } paint(ellPts(0, 0, 90, 60, 30), { fill: INK.orange }); for (const sd of [-1, 1]) { inkLine([[sd * 20, -50], [sd * 26, -80]], 1.2, INK.dark, 'ink', 0, { force: true }); paint(ellPts(sd * 26, -86, 9, 9, 10), { fill: INK.dark }); } pop(); };

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

  // ---------- A · the best know when to put the agent away ----------
  function shotBest(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('best');
    riso({ seed: 171 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tMost = wt('best', 'most'), tEx = wt('best', 'exactly'), tAway = wt('best', 'away'), tHum = wt('best', 'human'), tTime = wt('best', 'time'), tCred = wt('best', 'credibility');
    // agents everywhere, then only one, packed away
    const pack = ease(seg(t, tEx - .3, tEx + .1));
    for (let i = 0; i < 9; i++) { const k = stamp(t, b.start + .3 + i * .1) * (1 - pack); if (k <= .01) continue; const x = 260 + (i % 5) * 330 + (i > 4 ? 160 : 0), y = 380 + Math.floor(i / 5) * 280; clawd(x + (i > 4 && x < 800 ? 300 : 0), y, 10 * k, { ...feel(['excited', 'playful', 'happy'][i % 3], T + i * .3), boilKey: 'mob' + i }); }
    if (pack > 0) {
      const lid = ease(seg(t, tAway + .1, tAway + .4)), inBox = ease(seg(t, tAway - .3, tAway + .1));
      clawd(1000, lerp(900, 850, inBox), 12, { ...emotions(t, [[tEx, 'happy'], [tAway, 'sleepy']]), noShadow: true, boilKey: 'packed', sy: 1 - .5 * inBox });
      toolbox(1000, 900, 1.1 * stamp(t, tEx - .2), 1 - lid);
      if (t > tAway + .35 && t < tAway + .6) for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .35; paint(ribbon([[1000 + Math.cos(a) * 220, 740 + Math.sin(a) * 120], [1000 + Math.cos(a) * 280, 740 + Math.sin(a) * 160]], 10), { fill: INK.orange }); }
    }
    // a clock (time) and a badge that cracks (credibility)
    const kc = stamp(t, tTime - .15);
    if (kc > .01) { push(); translate(1380, 260); scale(kc); paint(ellPts(0, 0, 90, 90, 40), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); const a = (t - tTime) * 6; inkLine([[0, 0], [Math.cos(a) * 66, Math.sin(a) * 66]], 1.6, INK.orange, 'ink', 0, { force: true }); inkLine([[0, 0], [0, -46]], 2, INK.navy, 'ink', 0, { force: true }); pop(); }
    const kb = stamp(t, tCred - .15);
    if (kb > .01) { push(); translate(1640, 260); scale(kb); paint(starPts(0, 0, 90, .55, 8), { fill: INK.gold }); paint(ellPts(0, 0, 50, 50, 30), { fill: INK.orange }); const kk = ease(seg(t, tCred + .3, tCred + .6)); if (kk > 0) inkLine([[-10, -90], [14, -30], [-12, 10], [16, 60 * kk + 10]], 2, INK.dark, 'ink', 0, { force: true }); pop(); }
    skipper(560, 1040, 17, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tMost - .1, 'shrug', { mood: 'surprised' }], [tEx - .3, 'present', { mood: 'focused' }], [tAway - .1, 'point', { mood: 'grin' }], [tHum - .1, 'type', { mood: 'focused' }], [tCred, 'facepalm', { mood: 'worried' }]]));
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · the overhead tax ----------
  function shotOverhead(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('overhead');
    riso({ seed: 172 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tCost = wt('overhead', 'cost'), steps = ['prompt', 'wait', 'review', 'fix', 'run'].map(w => wt('overhead', w)), tHour = wt('overhead', 'hour'), tBarg = wt('overhead', 'bargain'),
      tRen = wt('overhead', 'renaming'), tSlow = wt('overhead', 'slower'), tTrial = wt('overhead', 'randomized'), tSlow2 = wt('overhead', 'slower', 1), tBel = wt('overhead', 'believing'), tMeas = wt('overhead', 'measurement');
    const phase2 = ease(seg(t, tTrial - .4, tTrial));
    if (phase2 < 1) {
      push(); translate(0, -1000 * phase2);
      // the overhead: five steps in a row
      const icons = [() => pencil(0, 0, .5, .6), () => hourglass(0, 0, .5, seg(t, steps[1], steps[1] + 2)), () => magnifier(-8, -8, .6), () => wrench(0, 20, .3, .7), () => loopArrow(0, 0, 40, T * 3, INK.navy, 12)];
      icons.forEach((fn, i) => { const k = stamp(t, steps[i] - .12); if (k <= .01) return; push(); translate(420 + i * 200, 230); scale(k); paint(ellPts(0, 0, 80, 80, 36), { fill: 'yellow', tone: .5 }); fn(); pop(); });
      const kbr = ease(seg(t, tCost - .2, tCost + .5)); if (kbr > 0) paint(rrPts(320, 340, 1000 * kbr, 16, 8), { fill: INK.orange });
      // an hour-long task vs a rename, each under the same overhead bar
      const bar = (y, w, t0, col) => { const k = ease(seg(t, t0 - .1, t0 + .5)); if (k <= .01) return; paint(rrPts(320, y, 200, 70, 12), { fill: INK.orange }); paint(rrPts(530, y, w * k, 70, 12), { fill: col }); };
      bar(470, 1100, tHour, INK.navy); check(1720, 500, 1.2, stamp(t, tBarg));
      bar(640, 40, tRen, INK.green); stampX(640, 675, 60, stamp(t, tSlow));
      skipper(1700, 1060, 15, skipAct(t, [[b.start, 'think', { mood: 'thinking', flip: true }], [tRen, 'type', { mood: 'focused', flip: true }], [tSlow + .4, 'hips', { mood: 'grin', flip: true }]]));
      pop();
    }
    // the trial: a stopwatch; the real needle slow, the felt one fast
    if (phase2 > 0) {
      push(); translate(0, 1000 * (1 - phase2));
      push(); translate(900, 560); paint(rrPts(-30, -380, 60, 60, 12), { fill: INK.navy }); paint(ellPts(0, 0, 320, 320, 64), { fill: INK.navy }); paint(ellPts(0, 0, 280, 280, 64), { fill: INK.paper });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ribbon([[Math.cos(a) * 240, Math.sin(a) * 240], [Math.cos(a) * 270, Math.sin(a) * 270]], 10), { fill: INK.navy }); }
      const real = -Math.PI / 2 + TAU * .75 * ease(seg(t, tSlow2 - .2, tSlow2 + 1.2)), felt = -Math.PI / 2 + TAU * .3 * ease(seg(t, tBel, tBel + .5));
      if (t > tBel) paint(ribbon([[0, 0], [Math.cos(felt) * 230, Math.sin(felt) * 230]], 28, 6), { fill: INK.green, over: true, tone: .7 });
      paint(ribbon([[0, 0], [Math.cos(real) * 240, Math.sin(real) * 240]], 22, 6), { fill: INK.orange });
      paint(ellPts(0, 0, 26, 26, 20), { fill: INK.dark });
      pop();
      if (t > tBel) { const kb = stamp(t, tBel - .1); push(); translate(1450, 300); scale(kb); paint(ellPts(0, 0, 150, 100, 36), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(ellPts(-120, 110, 22, 22, 14), { fill: INK.paper, ink: INK.navy, sw: 1 }); paint(ellPts(-150, 150, 12, 12, 10), { fill: INK.paper, ink: INK.navy, sw: 1 }); paint(ribbon([[-40, 20], [60, -30]], 18, 4), { fill: INK.green }); pop(); }
      stampX(1450, 300, 110, stamp(t, tMeas));
      clawd(360, 900, 16, { ...emotions(t, [[tTrial - .4, 'neutral'], [tSlow2, 'nervous'], [tMeas, 'surprised']]), boilKey: 'ovc' });
      pop();
    }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · architecture: the thinking is the work ----------
  function shotArch(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('architecture');
    riso({ seed: 173 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tDes = wt('architecture', 'designing'), tThink = wt('architecture', 'thinking'), tTrade = wt('architecture', 'trade'), tCalls = wt('architecture', 'calls'), tUnd = wt('architecture', 'understand'),
      tJudg = wt('architecture', 'judgment'), tSpar = wt('architecture', 'sparring'), tArch = wt('architecture', 'architect');
    const fog = ease(seg(t, tCalls, tCalls + .5)) * (1 - ease(seg(t, tJudg, tJudg + .6)));
    // the drafting table and blueprint
    paint([[380, 940], [420, 640], [460, 640], [440, 940]], { fill: INK.brown }); paint([[980, 940], [940, 640], [980, 640], [1020, 940]], { fill: INK.brown });
    push(); translate(700, 520); rotate(-.08);
    paint(rrPts(-380, -200, 760, 340, 16), { fill: INK.navy });
    const g = seg(t, tDes, tUnd);
    for (let i = 0; i < 5; i++) { const k = stamp(t, tDes + i * .4); if (k > .01) paint(rrPts(-300 + (i % 3) * 220, -150 + Math.floor(i / 3) * 150, 150 * k, 90 * k, 8), { fill: INK.paper, tone: .9 }); }
    if (g > .3) for (let i = 0; i < 3; i++) inkLine([[-150 + i * 220, -105], [-80 + i * 220, 45]], 1.2, INK.paper, 'ink', 0, { force: true });
    if (fog > .01) paint(rrPts(-400, -220, 800, 380, 20), { fill: INK.navy, tone: .75 * fog, over: true });
    pop();
    if (t > tThink - .2 && t < tTrade) bulb(1300, 300, 1.1, stamp(t, tThink - .2));
    // the agent: a pros-and-cons board, then the gavel, then sparring pads
    const kb = stamp(t, tTrade - .2);
    const clawdX = 1450;
    if (kb > .01 && t < tSpar - .2) { push(); translate(1450, 420); scale(kb); paint(rrPts(-170, -130, 340, 260, 16), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rectPts(-3, -110, 6, 220), { fill: INK.navy }); for (let i = 0; i < 3; i++) { paint(rrPts(-140, -80 + i * 60, 100, 14, 7), { fill: INK.green }); paint(rrPts(40, -80 + i * 60, 100, 14, 7), { fill: INK.orange }); } pop(); }
    const gav = t > tCalls - .1 && t < tSpar - .2;
    clawd(clawdX, 930, 18, { ...emotions(t, [[b.start, 'neutral'], [tTrade - .2, 'happy'], [tCalls, 'smug'], [tSpar - .2, 'playful']]), boilKey: 'archc',
      armR: gav ? (u => { push(); rotate(-.6 + .5 * Math.sin((t - tCalls) * 8)); paint(rrPts(-.3 * u, -3 * u, .6 * u, 3 * u, .2 * u), { fill: INK.brown }); paint(rrPts(-1.2 * u, -3.8 * u, 2.4 * u, 1.2 * u, .3 * u), { fill: INK.brown }); pop(); }) :
        t > tSpar - .2 ? (u => paint(ellPts(0, 0, 1.2 * u, 1.4 * u, 18), { fill: INK.orange })) : undefined, aR: t > tSpar - .2 ? 1.2 : undefined });
    const jab = t > tSpar && t < tArch ? Math.max(0, Math.sin((t - tSpar) * 12)) : 0;
    skipper(lerp(700, 1080, ease(seg(t, tSpar - .4, tSpar))) , 1060, 17, { ...skipAct(t, [[b.start, 'think', { mood: 'focused' }], [tThink - .2, 'pointUp', { mood: 'happy' }], [tTrade, 'think', { mood: 'thinking' }], [tUnd - .2, 'shrug', { mood: 'worried' }], [tJudg, 'present', { mood: 'focused' }], [tSpar - .3, 'point', { mood: 'grin' }], [tArch, 'hips', { mood: 'proud' }]]), dy: -10 * jab, prop: t > tArch ? (u => pencil(0, -1.2 * u, .12 * u / 10, -.4)) : null });
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- D · security-critical code: write it yourself; let the agent attack it ----------
  function shotSecurity(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('security');
    riso({ seed: 174 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tBroken = wt('security', 'broken'), tSym = wt('security', 'symptoms'), tAtt = wt('security', 'attacker'), tLooks = wt('security', 'looks'), tYou = wt('security', 'yourself'),
      tEyes = wt('security', 'eyes'), tFlip = wt('security', 'flip'), tAttack = wt('security', 'attack'), tHunt = wt('security', 'hunt'), tPen = wt('security', 'pen');
    const p2 = ease(seg(t, tYou - .4, tYou));
    if (p2 < 1) {
      push(); translate(0, -1000 * p2);
      // a door with a lock; it looks fine
      paint(rrPts(760, 300, 400, 640, 16), { fill: INK.brown }); paint(rrPts(740, 280, 440, 30, 10), { fill: INK.navy });
      push(); translate(960, 600); scale(1.6); paint(rrPts(-34, -6, 68, 54, 8), { fill: INK.gold }); arcLine(0, -6, 24, 10, INK.navy, { a0: Math.PI, a1: TAU }); pop();
      const kc = ease(seg(t, tBroken, tBroken + .5)); if (kc > 0) { const P = [[935, 560], [965, 610], [940, 650], [985, 700]]; inkLine(P.slice(0, 2 + Math.floor(2 * kc)), 2.4, INK.dark, 'ink', 0, { force: true }); }
      paint(ellPts(1400, 300, 60, 60, 30), { fill: INK.green }); paint(rrPts(1370, 360, 60, 40, 8), { fill: INK.navy });
      // the attacker slips through
      const ka = seg(t, tAtt - .2, tAtt + 1.2); if (ka > 0 && ka < 1) hooded(lerp(300, 1500, ease(ka)), 940, .8);
      // code that looks right, with a fake check
      const kl = stamp(t, tLooks - .15); if (kl > .01) { push(); translate(400, 400); scale(kl); card(-140, -100, 280, 200, INK.navy); pop(); check(470, 350, 1.2, stamp(t, tLooks + .2), INK.gold); }
      pop();
    }
    if (p2 > 0) {
      push(); translate(0, 1000 * (1 - p2));
      // write it yourself, human eyes on it
      paint(rrPts(260, 620, 520, 60, 12), { fill: INK.brown });
      paint(rrPts(320, 420, 400, 200, 12), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); const n = Math.floor(5 * seg(t, tYou, tYou + 2)); for (let i = 0; i < n; i++) paint(rrPts(350, 445 + i * 32, 300 * (.5 + .5 * hash(i)), 12, 6), { fill: INK.navy, tone: .7 });
      skipper(560, 1060, 17, { ...skipAct(t, [[tYou - .4, 'type', { mood: 'focused' }], [tFlip, 'present', { mood: 'grin' }], [tPen - .1, 'pointUp', { mood: 'proud' }]]), prop: t > tPen - .1 ? (u => pencil(0, -1 * u, .14 * u / 10, 0)) : null });
      const ke = stamp(t, tEyes - .1) * (1 - ease(seg(t, tFlip - .3, tFlip)));
      if (ke > .01) for (const sd of [-1, 1]) { push(); translate(520 + sd * 90, 260); scale(ke); paint(ellPts(0, 0, 70, 40, 30), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint(ellPts(0, 0, 26, 26, 20), { fill: INK.navy }); pop(); }
      // flip the roles: the agent attacks the token check
      const kf = stamp(t, tFlip - .2);
      if (kf > .01) {
        push(); translate(1260, 520); scale(kf); paint([[-110, -150], [110, -150], [110, 20], [0, 150], [-110, 20]], { fill: INK.navy }); paint(ellPts(0, -30, 40, 40, 20), { fill: INK.gold }); pop();
        const sw = t > tAttack ? Math.max(0, Math.sin((t - tAttack) * 10)) : 0;
        clawd(1600, 940, 17, { ...emotions(t, [[tFlip - .2, 'determined'], [tHunt, 'suspicious']]), boilKey: 'secc', aL: 1 + sw * .6,
          armL: t < tHunt ? (u => { paint(rrPts(0, -.3 * u, 4.2 * u, .6 * u, .2 * u), { fill: INK.dark }); paint(rrPts(3.8 * u, -1.2 * u, .6 * u, 1.4 * u, .2 * u), { fill: INK.dark }); }) : undefined });
        if (sw > .8) for (let i = 0; i < 5; i++) { const a = Math.PI * .8 + i * .2; paint(ribbon([[1380 + Math.cos(a) * 60, 460 + Math.sin(a) * 60], [1380 + Math.cos(a) * 110, 460 + Math.sin(a) * 110]], 8), { fill: INK.orange }); }
        if (t > tHunt - .1) { const mx = 1260 + 60 * Math.sin((t - tHunt) * 3); magnifier(mx, 470, 1.1 * stamp(t, tHunt - .1)); }
      }
      pop();
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · learning: tutors, not ghostwriters; hard news from a person ----------
  function shotLearn(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('learn');
    riso({ seed: 175 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tRes = wt('learn', 'resist'), tWrites = wt('learn', 'writes'), tRust = wt('learn', 'rust'), tWhy = wt('learn', 'why'), tFix = wt('learn', 'fix'), tTut = wt('learn', 'tutors'),
      tSun = wt('learn', 'sunsetting'), tPer = wt('learn', 'person');
    const p2 = ease(seg(t, tSun - .5, tSun - .1));
    if (p2 < 1) {
      push(); translate(0, -1000 * p2);
      const kc = stamp(t, tRust - .2); if (kc > .01) crab(960, 230, .9 * kc);
      // the agent writes it all; the Skipper's head stays empty
      const writing = t > tWrites && t < tWhy;
      paint(rrPts(1240, 520, 460, 300, 16), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
      const n = t > tWrites ? Math.min(8, Math.floor((t - tWrites) * 4)) : 0; for (let i = 0; i < n; i++) paint(rrPts(1270, 545 + i * 32, 380 * (.4 + .6 * hash(i + 1)), 12, 6), { fill: INK.orange, tone: .8 });
      clawd(1470, 940, 15, { ...emotions(t, [[b.start, 'neutral'], [tWrites - .1, 'determined'], [tTut - .2, 'happy']]), boilKey: 'lrn', ...(writing ? move('bounce', T, 1) : {}) });
      // understanding: the bulb lights on "why", goes out on "fix"
      const on = t > tWhy + .1 && t < tFix ? 1 : 0;
      if (t > tWrites) bulb(520, 360, 1.1, on * stamp(t, tWhy + .1));
      if (t > tWrites + .3 && t < tWhy) stampX(520, 360, 60, stamp(t, tWrites + .3), INK.navy);
      // tutors: a chalkboard
      const kt = stamp(t, tTut - .2);
      if (kt > .01) { push(); translate(960, 480); scale(kt); paint(rrPts(-260, -170, 520, 340, 14), { fill: INK.green }); inkLine(through([[-180, 60], [-80, -60], [20, 40], [140, -80]]), 2, INK.paper, 'ink', .5, { force: true }); pop(); }
      skipper(520, 1060, 17, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tRes - .1, 'hips', { mood: 'focused' }], [tWrites, 'shrug', { mood: 'worried' }], [tWhy, 'think', { mood: 'thinking' }], [tFix, 'shrug', { mood: 'sad' }], [tTut, 'present', { mood: 'happy' }]]));
      pop();
    }
    if (p2 > 0) {
      push(); translate(0, 1000 * (1 - p2));
      // sunsetting a product: the sun goes down behind its sign
      const sun = ease(seg(t, tSun, tSun + 1.6));
      paint(ellPts(1200, lerp(420, 800, sun), 150, 150, 50), { fill: INK.orange });
      paint(rectPts(-200, 760, W + 400, 200), { fill: INK.gold });
      paint(rrPts(1000, 520, 400, 200, 16), { fill: INK.navy, over: true }); paint(rrPts(1040, 560, 320, 30, 12), { fill: INK.paper }); paint(rrPts(1040, 620, 200, 30, 12), { fill: INK.paper, tone: .6 });
      paint(rrPts(1180, 720, 40, 220, 8), { fill: INK.brown });
      skipper(620, 1060, 18, skipAct(t, [[tSun - .5, 'stand', { mood: 'sad' }], [tPer - .1, 'present', { mood: 'neutral' }]]));
      pop();
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- F · agents amplify what's there; legacy code, carefully ----------
  function shotMess(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('mess');
    riso({ seed: 176 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tAmp = wt('mess', 'amplify'), tClean = wt('mess', 'clean'), tMess = wt('mess', 'mess'), tLeg = wt('mess', 'legacy'), tTests = wt('mess', 'characterization'), tScope = wt('mess', 'scope'), tTed = wt('mess', 'tedious');
    const p2 = ease(seg(t, tLeg - .4, tLeg));
    const COL = [INK.navy, INK.orange, INK.gold, INK.green];
    if (p2 < 1) {
      push(); translate(0, -1000 * p2);
      clawd(960, 940, 15, { ...emotions(t, [[b.start, 'neutral'], [tClean, 'happy'], [tMess + .3, 'dizzy']]), boilKey: 'amp' });
      // a clean row, copied cleanly
      for (let i = 0; i < 4; i++) { const k = stamp(t, tAmp + i * .08); if (k > .01) paint(rrPts(200 + i * 110, 280, 90 * k, 90 * k, 10), { fill: COL[i] }); }
      for (let i = 0; i < 8; i++) { const k = stamp(t, tClean + .3 + i * .08); if (k > .01) paint(rrPts(1120 + (i % 4) * 110, 230 + Math.floor(i / 4) * 110, 90 * k, 90 * k, 10), { fill: COL[i % 4] }); }
      // a heap, copied into a bigger heap
      for (let i = 0; i < 7; i++) { const k = stamp(t, tMess - .6 + i * .05); if (k > .01) { push(); translate(260 + 180 * hash(i), 640 + 80 * hash(i + 3)); rotate(hash(i + 7) * 2); paint(rrPts(-45 * k, -30 * k, 90 * k, 60 * k, 8), { fill: COL[i % 4] }); pop(); } }
      for (let i = 0; i < 18; i++) { const k = stamp(t, tMess + .3 + i * .04); if (k > .01) { push(); translate(1140 + 420 * hash(i + 11), 580 + 200 * hash(i + 17)); rotate(hash(i + 5) * 3); paint(rrPts(-50 * k, -32 * k, 100 * k, 64 * k, 8), { fill: COL[i % 4] }); pop(); } }
      if (t > tClean) paint(ribbon([[640, 320], [1060, 320]], 16, 4), { fill: INK.navy, tone: .6 });
      if (t > tMess + .2) paint(ribbon([[640, 680], [1060, 680]], 16, 4), { fill: INK.navy, tone: .6 });
      pop();
    }
    if (p2 > 0) {
      push(); translate(0, 1000 * (1 - p2));
      // the legacy monolith, cracked
      paint(rrPts(360, 160, 700, 620, 20), { fill: INK.navy, tone: .85 });
      for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) paint(rrPts(380 + c * 112 + (r % 2) * 30, 180 + r * 100, 96, 84, 6), { fill: INK.navy, tone: .5 + .4 * hash(r * 6 + c) });
      inkLine([[560, 160], [600, 320], [560, 460], [620, 620]], 2.4, INK.paper, 'ink', 0, { force: true });
      // a safety net underneath
      const kn = ease(seg(t, tTests - .1, tTests + .6));
      if (kn > .01) { for (let i = 0; i <= 10; i++) inkLine([[300 + i * 82 * kn, 800], [340 + i * 82 * kn, 880]], 1, INK.orange, 'ink', 0, { force: true }); inkLine(through([[300, 800], [710, 830], [300 + 820 * kn, 800]]), 1.6, INK.orange, 'ink', .5, { force: true }); inkLine(through([[340, 880], [720, 910], [340 + 820 * kn, 880]]), 1.6, INK.orange, 'ink', .5, { force: true }); }
      // a spotlight on one brick
      const ks = stamp(t, tScope - .1);
      if (ks > .01) { paint([[1000, -100], [1120, -100], [860, 420], [700, 420]], { fill: 'yellow', tone: .5 * ks, over: true }); arcLine(780, 380, 70 * ks, 12, INK.orange, { over: true }); }
      // the tedious work: a conveyor of identical bricks
      const kt = stamp(t, tTed - .2);
      if (kt > .01) { paint(rrPts(1150, 840, 700, 30, 15), { fill: INK.dark }); for (let i = 0; i < 6; i++) { const x = 1150 + frac((t - tTed) * .5 + i / 6) * 700; paint(rrPts(x - 40, 770, 80, 66, 8), { fill: INK.gold }); } clawd(1500, 700, 11 * kt, { ...feel('determined', T), noShadow: true, boilKey: 'conv' }); }
      pop();
    }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · craft: skills in your fingers keep you dangerous ----------
  function shotCraft(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('craft');
    riso({ seed: 177 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tHand = wt('craft', 'hand'), tPat = wt('craft', 'pattern'), tFing = wt('craft', 'fingers'), tSolve = wt('craft', 'solve'), tSharp = wt('craft', 'sharp'), tReg = wt('craft', 'regularly'), tDang = wt('craft', 'dangerous');
    // patterns tile behind the bench
    const np = Math.floor(24 * seg(t, tPat - .1, tPat + 1.2));
    for (let i = 0; i < np; i++) { const c = i % 8, r = Math.floor(i / 8); paint(starPts(260 + c * 190, 180 + r * 150, 44, .45, 4, (c + r) % 2 ? 0 : Math.PI / 4), { fill: (c + r) % 2 ? INK.orange : INK.navy, tone: .5, over: true }); }
    // the workbench and a keyboard
    paint(rrPts(260, 760, 800, 50, 14), { fill: INK.brown }); paint(rectPts(300, 810, 40, 130), { fill: INK.brown }); paint(rectPts(980, 810, 40, 130), { fill: INK.brown });
    paint(rrPts(480, 710, 360, 50, 10), { fill: INK.dark }); for (let i = 0; i < 8; i++) paint(rrPts(496 + i * 43, 720, 34, 14, 4), { fill: INK.paper, tone: .7 });
    if (t > tFing - .1) glow(660, 690, 200 * stamp(t, tFing - .1), 'yellow', .6);
    // the agent stuck in a knot
    const kk = stamp(t, tSolve - .3);
    if (kk > .01) { clawd(1480, 940, 16, { ...emotions(t, [[tSolve - .3, 'confused'], [tSharp + .4, 'relieved']]), boilKey: 'knot' }); const un = ease(seg(t, tSharp, tSharp + .8)); for (let i = 0; i < 3; i++) arcLine(1480 + 40 * Math.sin(i * 2), 780 - 30 * i, 120 + 20 * i, 10, INK.orange, { over: true, a0: i, a1: i + TAU * (1 - un) * .9 }); }
    const step = ease(seg(t, tSharp - .3, tSharp + .3)) * (1 - ease(seg(t, tReg - .2, tReg + .3)));
    skipper(lerp(660, 1180, step), 1060, 18, { ...skipAct(t, [[b.start, 'type', { mood: 'focused' }], [tSolve, 'stand', { mood: 'surprised' }], [tSharp - .3, 'point', { mood: 'grin' }], [tReg, 'type', { mood: 'happy' }], [tDang - .1, 'pointUp', { mood: 'proud' }]]), prop: t > tDang - .1 ? (u => { pencil(0, -1.2 * u, .13 * u / 10, 0); }) : null });
    if (t > tDang) { const k = stamp(t, tDang + .1); paint(starPts(700, 460, 70 * k, .25, 4, .3 * (t - tDang)), { fill: INK.yellow }); paint(starPts(700, 460, 40 * k, .3, 4, Math.PI / 4), { fill: INK.orange, over: true }); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · judgment: aggressive, but selective ----------
  function shotJudgment(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('judgment');
    riso({ seed: 178 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tJ = wt('judgment', 'judgment'), tLev = wt('judgment', 'leverage'), lt4 = ['refactors', 'boilerplate', 'exploring', 'writing'].map(w => wt('judgment', w)), tAway = wt('judgment', 'away'),
      h3 = ['thinking', 'accountability', 'craft'].map(w => wt('judgment', w)), tAny = wt('judgment', 'anyone'), tNot = wt('judgment', 'not'), tTeams = wt('judgment', 'teams');
    // the balance
    const ks = stamp(t, tJ - .2, .45), CX = 960, CY = 330;
    const tilt = .12 * (ease(seg(t, lt4[0], lt4[3] + .4)) - ease(seg(t, h3[0], h3[2] + .4))) + .02 * Math.sin(t * 1.5);
    if (ks > .01) {
      push(); translate(CX, 900); scale(ks);
      paint(rrPts(-24, -560, 48, 560, 12), { fill: INK.brown }); paint(rrPts(-140, -30, 280, 40, 14), { fill: INK.brown });
      push(); translate(0, -570); rotate(-tilt);
      paint(rrPts(-560, -14, 1120, 28, 14), { fill: INK.navy });
      for (const [sd, list] of [[-1, 0], [1, 1]]) {
        push(); translate(sd * 520, 0); rotate(tilt);
        inkLine([[0, 0], [-120, 200]], 1.2, INK.navy, 'ink', 0, { force: true }); inkLine([[0, 0], [120, 200]], 1.2, INK.navy, 'ink', 0, { force: true });
        paint([[-180, 200], [180, 200], [130, 250], [-130, 250]], { fill: INK.gold });
        if (list === 0) lt4.forEach((tw, i) => { const k = stamp(t, tw - .1); if (k > .01) clawd(-120 + i * 80, 200, 5 * k, { ...feel('determined', T + i), noShadow: true, boilKey: 'lev' + i }); });
        else h3.forEach((tw, i) => { const k = stamp(t, tw - .1); if (k <= .01) return; push(); translate(-100 + i * 100, 150); scale(k * .6); if (i === 0) bulb(0, 0, 1, 0); if (i === 1) { paint(starPts(0, 0, 70, .55, 8), { fill: INK.gold }); paint(ellPts(0, 0, 40, 40, 24), { fill: INK.orange }); } if (i === 2) pencil(0, 0, .8, .5); pop(); });
        pop();
      }
      pop(); pop();
    }
    if (t > tLev - .1 && t < tAway) glow(CX - 520, 520, 200 * stamp(t, tLev - .1), 'yellow', .5);
    // the toolbox closes, gently, with the agent waving
    const kt = stamp(t, tAny - .2);
    if (kt > .01) { const lid = ease(seg(t, tNot, tNot + .6)); if (lid < .9) clawd(1560, 880, 9, { ...feel('happy', T), aR: 1.4 + .3 * Math.sin(t * 8), noShadow: true, boilKey: 'box' }); toolbox(1560, 940, .8 * kt, 1 - lid); }
    skipper(360, 1060, 17, skipAct(t, [[b.start, 'think', { mood: 'thinking' }], [tLev - .1, 'point', { mood: 'grin' }], [tAway - .1, 'present', { mood: 'focused' }], [tAny - .1, 'type', { mood: 'neutral' }], [tNot - .1, 'hips', { mood: 'proud' }]]));
    if (t > tTeams - .2) glow(960, 250, 300 * stamp(t, tTeams - .2), 'yellow', .8);
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { identTwo(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '18', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotBestIn(T0, lt, dur) { shotBest(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('best', 0), shotBestIn],
    [shotAt('overhead'), shotOverhead],
    [shotAt('architecture'), shotArch],
    [shotAt('security'), shotSecurity],
    [shotAt('learn'), shotLearn],
    [shotAt('mess'), shotMess],
    [shotAt('craft'), shotCraft],
    [shotAt('judgment'), shotJudgment],
    [B.judgment.end + .9, shotEnd],
  ]);
})();
