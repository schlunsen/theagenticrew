// ch19.js: Chapter 19 · Final Words. Storyboard: video/storyboards/ch19.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); if (o.thought) { for (let i = 0; i < 3; i++) paint(ellPts(x + o.thought[0] * (i + 1) / 4, y + h / 2 + o.thought[1] * (i + 1) / 4, 16 - i * 3, 16 - i * 3, 12), { fill: col, ink: INK.navy, sw: .9 }); } if (o.dots) for (let i = 0; i < 3; i++) paint(ellPts(x - 30 + i * 30, y, 9, 9, 12), { fill: INK.orange, tone: o.dotTone ?? 1 }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const pr = (x, y, s, col = INK.paper, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-100, -65, 200, 130, 14), { fill: col, ink: INK.navy, sw: 1 }); paint(rrPts(-80, -45, 26, 26, 8), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rrPts(-40, -42 + i * 32, i === 2 ? 70 : 120, 14, 7), { fill: INK.navy, tone: .6 }); pop(); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const bug = (x, y, s, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint(ellPts(0, 0, 34, 44, 20), { fill: INK.orange }); paint(ellPts(0, -44, 20, 18, 14), { fill: INK.dark }); for (const sd of [-1, 1]) for (let j = 0; j < 3; j++) inkLine([[sd * 26, -18 + j * 18], [sd * 60, -30 + j * 26]], .7, INK.dark, 'ink', 0, { force: true }); pop(); };
  // a child: a small round figure, no beard, no cap
  const child = (x, y, u, o = {}) => {
    push(); translate(x, y + (o.dy || 0));
    paint(ellPts(0, 0, 3 * u, .6 * u, 20), { fill: INK.navy, tone: .25, over: true });
    for (const s of [-1, 1]) paint(rrPts((s < 0 ? -1.4 : .3) * u, -2.6 * u, 1.1 * u, 2.6 * u, .4 * u), { fill: INK.navy });
    paint(rrPts(-2.2 * u, -7 * u, 4.4 * u, 4.8 * u, 1.4 * u), { fill: INK.orange });
    for (const s of [-1, 1]) paint(ellPts(s * 2.5 * u, (o.armsUp ? -8.2 : -3.4) * u, .6 * u, .6 * u, 12), { fill: SKIN });
    const hy = -9.6 * u + (o.lookUp ? -.3 * u : 0);
    paint(ellPts(0, hy, 2.4 * u, 2.5 * u, 32), { fill: SKIN });
    paint([[-2.5 * u, hy - .2 * u], [-2 * u, hy - 2.2 * u], [0, hy - 2.8 * u], [2 * u, hy - 2.2 * u], [2.5 * u, hy - .2 * u], [1.2 * u, hy - 1.4 * u], [-1.2 * u, hy - 1.4 * u]], { fill: INK.navy, curv: .5 });
    const ly = o.lookUp ? -.4 * u : 0;
    for (const s of [-1, 1]) paint(ellPts(s * .9 * u, hy + .2 * u + ly, .3 * u, (o.wide ? .45 : .35) * u, 12), { fill: INK.dark });
    if (o.wide) paint(ellPts(0, hy + 1.3 * u + ly, .35 * u, .4 * u, 12), { fill: INK.dark }); else inkLine([[-.6 * u, hy + 1.1 * u], [0, hy + 1.4 * u], [.6 * u, hy + 1.1 * u]], u * .09, INK.dark, 'ink', .6, { force: true });
    pop();
  };
  const sea = (y, t, col = INK.navy, tn = .7) => { const P = [[-200, 1300]]; for (let i = 0; i <= 48; i++) { const x = -200 + i * 50; P.push([x, y + 14 * Math.sin(x * .012 + t * 1.6)]); } P.push([2200, 1300]); paint(P, { fill: col, tone: tn }); };
  const shipHull = (x, y, s, rock = 0, o = {}) => {
    push(); translate(x, y); rotate(rock); scale(s);
    paint([[-420, -40], [420, -40], [330, 120], [-340, 120]], { fill: INK.navy });
    if (o.tiles) for (let r = 0; r < 2; r++) for (let c = 0; c < 9; c++) { const k = backOut(seg(o.t, o.tiles + (c + r * 9) * .03, o.tiles + .3 + (c + r * 9) * .03)); if (k > .01) paint(rrPts(-310 + c * 68 + r * 20 - 24 * k, -10 + r * 60 - 20 * k, 48 * k, 40 * k, 8), { fill: (c + r) % 3 ? INK.gold : INK.orange }); }
    inkLine([[0, -40], [0, -520]], 2, INK.dark, 'ink', 0, { force: true });
    const sk = o.sails ?? 1;
    paint([[12, -500], [12, -80], [300 * sk, -80]], { fill: INK.paper, ink: INK.navy, sw: 1.2 });
    paint([[-12, -440], [-12, -80], [-260 * sk, -80]], { fill: INK.paper, ink: INK.navy, sw: 1.2 });
    if (o.stripes) { const k = o.stripes; for (let i = 0; i < 4; i++) paint(rectPts(20, -150 - i * 90, 200 * k * (1 - i * .2), 18), { fill: INK.orange, over: true }); }
    pop();
  };

  // ---------- A · the question: is the computer fixing itself? ----------
  function shotQuestion(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('question');
    riso({ seed: 191 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tLap = wt('question', 'lap'), tRef = wt('question', 'refactor'), tFiles = wt('question', 'files'), tTests = wt('question', 'tests'), tGreen = wt('question', 'green'),
      tChild = wt('question', 'child'), tAsks = wt('question', 'asks'), tBetter = wt('question', 'better'), tDef = wt('question', 'definition'), tRew = wt('question', 'rewritten');
    const late = ease(seg(t, tDef - .6, tDef - .1));
    // the big screen: files open and close, test bars fill, green checks appear
    const ks = stamp(t, b.start + .2);
    push(); translate(1250 + 60 * late, 440 - 120 * late); scale(ks * (1 - .35 * late));
    paint(rrPts(-460, -300, 920, 580, 30), { fill: INK.navy });
    paint(rrPts(-430, -270, 860, 520, 20), { fill: INK.navy, tone: .6 });
    paint(rrPts(-40, 280, 80, 80, 6), { fill: INK.navy });
    for (let i = 0; i < 4; i++) { const t0 = tFiles + i * .25, k = t < t0 ? 0 : Math.sin(Math.PI * seg(t, t0, t0 + 1.2)); if (t > tRef - .1) { const open = t > t0 && t < t0 + 1.2; paint(rrPts(-390 + i * 100, -230 - 20 * k, 80, 100, 8), { fill: open ? INK.paper : INK.gold, tone: open ? 1 : .85 }); } }
    for (let i = 0; i < 4; i++) { const k = ease(seg(t, tTests + i * .15, tTests + .6 + i * .15)); paint(rrPts(-390, -80 + i * 70, 500, 34, 17), { fill: INK.paper, tone: .25 }); if (k > 0) paint(rrPts(-390, -80 + i * 70, 500 * k, 34, 17), { fill: INK.gold }); check(220, -60 + i * 70, .6, stamp(t, tGreen + i * .12)); }
    pop();
    // the engineer and the child on his lap (beside him, looking up)
    skipper(360, 1040, 20, skipAct(t, [[b.start, 'type', { mood: 'focused', lookX: .6 }], [tChild, 'stand', { mood: 'grin', lookX: .9, lookY: .4 }], [tBetter, 'think', { mood: 'thinking' }]]));
    const kc = stamp(t, tLap - .2);
    if (kc > .01) child(660, 1040 + 300 * (1 - kc), 17, { lookUp: t > tChild - .2, wide: t > tAsks - .1 && t < tBetter, armsUp: t > tAsks && t < tAsks + 1.2, dy: jump(t, tAsks, tAsks + .4, 1).dy * 40 });
    // the question
    const kq = stamp(t, tAsks - .1) * (1 - late);
    if (kq > .01) { type('?', 690, 560, 300 * kq, INK.orange); type('?', 704, 574, 300 * kq, INK.navy, { over: true, tone: .45 }); }
    // the definition of engineering, rewritten: a second ink pass overprints it
    type('ENGINEERING', 1000, 800, 120, INK.navy, { pop: seg(t, tDef - .1, tDef + .3) });
    if (t > tRew - .2) { const k = ease(seg(t, tRew - .2, tRew + .4)); type('ENGINEERING', 1000 + 14 + 300 * (1 - k), 814, 120, INK.orange, { over: true }); }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · molting: the shell falls away; the animal underneath ----------
  function shotMolting(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('molting');
    riso({ seed: 192 });
    camBegin(960, 540, 1 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, W + 400, 400), { fill: 'yellow', ramp: { from: [0, 960], to: [0, 1100], a: .8, b: .3 } });
    const tDying = wt('molting', 'dying'), tMolt = wt('molting', 'molting'), tFall = wt('molting', 'falling'), tKey = wt('molting', 'keystrokes'), tSyn = wt('molting', 'syntax'), tBoil = wt('molting', 'boilerplate'),
      tAnim = wt('molting', 'animal'), tBuild = wt('molting', 'build'), tRight = wt('molting', 'right'), tAlive = wt('molting', 'alive');
    // "not dying": a small tombstone that is X-ed and sinks
    const kd = stamp(t, tDying - .3) * (1 - ease(seg(t, tMolt, tMolt + .4)));
    if (kd > .01) { push(); translate(1500, 960 + 200 * (1 - kd)); paint(rrPts(-90, -220, 180, 220, 80), { fill: INK.navy, tone: .5 }); pop(); stampX(1500, 850, 90, stamp(t, tDying + .1) * kd); }
    // Clawd underneath
    const free = t > tAnim - .2;
    if (t > tAlive - .1) glow(960, 780, 330 * ease(seg(t, tAlive - .1, tAlive + .4)), 'yellow', .9);
    clawd(960, 960, 30, { ...emotions(t, [[b.start, 'sleepy'], [tMolt, 'surprised'], [tAnim, 'happy'], [tRight, 'proud'], [tAlive, 'excited']]), dy: jump(t, tAlive, tAlive + .5, 2.5).dy, sq: jump(t, tAlive, tAlive + .5, 2.5).sq });
    // the shell: three dark chunks around Clawd, cracking and falling one by one
    const crack = seg(t, tMolt, tMolt + .3);
    const chunk = (i, t0, P, fn) => {
      const f = easeIn(seg(t, t0, t0 + .7)); if (f >= 1) return;
      const dx = [-1, 0, 1][i] * (20 * crack + 380 * f), dy = 700 * f * f, rot = [-1, .3, 1][i] * 1.2 * f;
      push(); translate(960 + dx, 700 + dy); rotate(rot); paint(P, { fill: INK.navy, tone: .92 }); if (f > 0) fn(); pop();
    };
    chunk(0, tKey, [[-230, -230], [-60, -250], [-90, -60], [-40, 110], [-230, 260], [-260, 0]], () => { for (let i = 0; i < 3; i++) paint(rrPts(-200 + i * 50, -60, 40, 40, 8), { fill: INK.paper }); });
    chunk(1, tSyn, [[-60, -250], [70, -260], [100, -60], [40, 110], [-40, 110], [-90, -60]], () => type('{ }', 0, -80, 70, INK.orange));
    chunk(2, tBoil, [[70, -260], [240, -230], [270, 0], [240, 260], [40, 110], [100, -60]], () => { for (let i = 0; i < 4; i++) paint(rrPts(110, -80 + i * 34, 110, 16, 8), { fill: INK.paper, tone: .8 }); });
    if (crack > 0 && t < tKey + .2) for (let i = 0; i < 3; i++) inkLine([[960 + [-80, 40, 100][i], 460 + i * 60], [960 + [-60, 60, 80][i], 560 + i * 90]], 1.2, INK.yellow, 'ink', 0, { force: true });
    // knows what to build (a flag), knows when it's right (a check)
    if (free) {
      const kb = stamp(t, tBuild - .2); if (kb > .01) { inkLine([[600, 960], [600, 960 - 300 * kb]], 1.6, INK.dark, 'ink', 0, { force: true }); paint([[600, 960 - 300 * kb], [720, 920 - 300 * kb], [600, 880 - 300 * kb]], { fill: INK.orange }); }
      check(1330, 640, 2.2, stamp(t, tRight - .1));
    }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · amplifiers: mediocre at terrifying speed; highways, not shovels; boring things compound ----------
  function shotAmplify(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('amplify');
    riso({ seed: 193 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tAmp = wt('amplify', 'amplifiers'), tMed = wt('amplify', 'mediocre'), tTerr = wt('amplify', 'terrifying'), tGreat = wt('amplify', 'great'), tHigh = wt('amplify', 'highways'), tShov = wt('amplify', 'shovels'),
      tThrive = wt('amplify', 'thrive'), tBor = wt('amplify', 'boring'), tCtx = wt('amplify', 'context'), tGuard = wt('amplify', 'guardrails'), tTests = wt('amplify', 'tests'), tConv = wt('amplify', 'conventions'),
      tTools = wt('amplify', 'tools'), tQ = wt('amplify', 'quarter'), tJud = wt('amplify', 'judgment'), tComp = wt('amplify', 'compounds');
    // phase 1: two lanes
    const p1 = 1 - ease(seg(t, tThrive - .5, tThrive - .1));
    if (p1 > .01) {
      push(); translate(0, -800 * (1 - p1));
      const ka = stamp(t, tAmp - .2);
      push(); translate(960, 170); scale(ka); paint([[-70, -40], [-20, -40], [60, -100], [60, 100], [-20, 40], [-70, 40]], { fill: INK.navy }); for (let i = 0; i < 3; i++) { const f = frac((t - tAmp) * 1.2 + i / 3); arcLine(70, 0, 60 + 100 * f, 14, INK.orange, { a0: -.7, a1: .7, cap: 'round' }); } pop();
      // lane 1: a mediocre engineer, crooked blocks pouring out fast
      paint(rectPts(-200, 560, W + 400, 14), { fill: INK.navy, tone: .4 });
      const k1 = stamp(t, tMed - .2);
      if (k1 > .01) {
        skipper(200, 540, 10, { ...SKIP_POSES.shrug, mood: 'neutral', t, dy: 300 * (1 - k1) });
        clawd(380, 540, 9, { ...feel(t > tTerr ? 'dizzy' : 'neutral', T), ...(t > tTerr ? move('run', T, 2) : {}) });
        if (t > tTerr - .3) for (let i = 0; i < 12; i++) { const f = frac((t - tTerr) * 1.6 + i / 12); const x = lerp(470, 1900, f), y = 520 - 30 * hash(i) - 60 * Math.abs(Math.sin(f * 9 + i)); push(); translate(x, y); rotate(f * 5 + i); paint(rrPts(-28, -20, 56, 40, 6), { fill: INK.brown, tone: .9 }); pop(); }
      }
      // lane 2: a great engineer, a clean road laid out fast; the shovel is X-ed
      paint(rectPts(-200, 960, W + 400, 200), { fill: INK.green, tone: .45 });
      const k2 = stamp(t, tGreat - .2);
      if (k2 > .01) {
        skipper(200, 960, 12, { ...SKIP_POSES.point, mood: 'grin', t, dy: 300 * (1 - k2) });
        const road = ease(seg(t, tGreat, tShov + .4));
        paint(rectPts(400, 900, 1500 * road, 60), { fill: INK.navy });
        for (let i = 0; i < 14 * road; i++) paint(rectPts(430 + i * 105, 924, 60, 12), { fill: INK.yellow });
        clawd(400 + 1500 * road, 900, 10, { ...feel('determined', T), ...move('run', T, 1) });
        if (t > tShov - .3) { const ks = stamp(t, tShov - .3); push(); translate(1500, 720); rotate(.5); scale(ks); paint(rrPts(-10, -150, 20, 200, 8), { fill: INK.brown }); paint([[-50, 50], [50, 50], [40, 130], [0, 150], [-40, 130]], { fill: INK.navy, tone: .6 }); pop(); stampX(1500, 730, 110, stamp(t, tShov + .1)); }
      }
      pop();
    }
    // phase 2: the boring things; tools change; judgment compounds
    if (t > tThrive - .3) {
      const X = [360, 760, 1160, 1560];
      const up = ease(seg(t, tTools - .4, tTools)); const st = (i, t0, fn) => { const k = stamp(t, t0 - .15) * (1 - .55 * up); if (k <= .01) return; push(); translate(lerp(X[i], 660 + i * 200, up), lerp(480, 200, up)); scale(k); paint(rrPts(-160, -160, 320, 320, 30), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
      st(0, tCtx, () => { for (let i = 0; i < 4; i++) paint(rrPts(-80 + i * 10, -70 + i * 30, 150, 60, 10), { fill: [INK.orange, INK.gold, INK.navy, INK.green][i] }); });
      st(1, tGuard, () => { paint(rectPts(-120, -20, 240, 20), { fill: INK.navy }); paint(rectPts(-120, 40, 240, 20), { fill: INK.navy }); for (let i = 0; i < 4; i++) paint(rectPts(-110 + i * 70, -50, 20, 150), { fill: INK.gold }); });
      st(2, tTests, () => check(0, 10, 2.2, 1));
      st(3, tConv, () => { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) paint(rrPts(-100 + c * 70, -100 + r * 70, 55, 55, 8), { fill: INK.navy, tone: r === 1 ? 1 : .45 }); });
      type('BORING', 960, 170, 90, INK.navy, { pop: seg(t, tBor - .1, tBor + .25), alpha: 1 - seg(t, tTools - .4, tTools) });
      if (t > tTools - .2) {
        // a turntable of tools, swapping each quarter
        const kt = stamp(t, tTools - .2), spin = Math.floor((t - tTools) * 3) * TAU / 6;
        push(); translate(480, 720); scale(kt); paint(ellPts(0, 120, 230, 50, 40), { fill: INK.navy, tone: .5 }); rotate(spin * .3);
        for (let i = 0; i < 3; i++) { const a = i * TAU / 3 + spin; paint(rrPts(Math.cos(a) * 130 - 50, Math.sin(a) * 60 - 50, 100, 100, 18), { fill: [INK.orange, INK.gold, INK.green][i] }); }
        pop();
        // judgment compounds: an orange curve climbing over a navy grid
        const kg = stamp(t, tJud - .2);
        if (kg > .01) {
          push(); translate(960, 960); scale(kg * .95);
          for (let i = 0; i < 7; i++) paint(rectPts(i * 110, -520, 4, 520), { fill: INK.navy, tone: .35 });
          for (let i = 0; i < 5; i++) paint(rectPts(0, -i * 110, 700, 4), { fill: INK.navy, tone: .35 });
          const k = ease(seg(t, tComp - .2, tComp + 1.2)), P = []; for (let i = 0; i <= 30 * k; i++) { const x = i / 30 * 680; P.push([x, -Math.pow(i / 30, 2.6) * 500]); }
          if (P.length > 1) inkLine(P, 3, INK.orange, 'ink', .4, { force: true, over: true });
          pop();
        }
      }
    }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- D · promoted: from typist to captain; nobody loved the boilerplate ----------
  function shotPromoted(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('promoted');
    riso({ seed: 194 });
    camBegin(960, 540, 1 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tProm = wt('promoted', 'promotion'), tTyp = wt('promoted', 'typist'), tCap = wt('promoted', 'captain'), tAuto = wt('promoted', 'automated'), tLoved = wt('promoted', 'loved'), tParse = wt('promoted', 'parsers'),
      tWant = wt('promoted', 'wanted'), tMatter = wt('promoted', 'matter');
    const capt = backOut(seg(t, tCap - .1, tCap + .4));
    // the desk (a keyboard) becomes a helm
    if (capt < .5) { const k = 1 - ease(seg(t, tCap - .1, tCap + .2)); paint(rrPts(540, 800, 360 * k, 30, 10), { fill: INK.brown }); paint(rrPts(560, 770, 300 * k, 30, 8), { fill: INK.navy }); for (let i = 0; i < 8 * k; i++) paint(rrPts(574 + i * 35, 776, 26, 18, 4), { fill: INK.paper, tone: .7 }); }
    if (capt > 0) { helm(560, 700, 150 * capt, t * .6); glow(560, 700, 260 * capt, 'yellow', .6); }
    skipper(560, 1040, 18, skipAct(t, [[b.start, 'type', { mood: 'focused' }], [tProm, 'type', { mood: 'surprised' }], [tCap, 'steer', { mood: 'proud' }], [tAuto, 'steer', { mood: 'grin', lookX: .8 }]]));
    if (t > tCap && t < tCap + .7) { const k = seg(t, tCap, tCap + .7); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; paint(ribbon([[560 + Math.cos(a) * 200 * (1 + k), 700 + Math.sin(a) * 200 * (1 + k)], [560 + Math.cos(a) * 280 * (1 + k), 700 + Math.sin(a) * 280 * (1 + k)]], 14 * (1 - k)), { fill: INK.orange }); } }
    // a machine churns out boilerplate; X-ed
    const km = stamp(t, tAuto - .2) * (1 - ease(seg(t, tWant - .3, tWant)));
    if (km > .01) {
      push(); translate(1350, 640); scale(km);
      paint(rrPts(-170, -140, 340, 280, 26), { fill: INK.navy });
      const g1 = t * 3; for (let i = 0; i < 8; i++) { const a = g1 + i * TAU / 8; paint(ellPts(-60 + Math.cos(a) * 50, -20 + Math.sin(a) * 50, 14, 14, 10), { fill: INK.gold }); }
      paint(ellPts(-60, -20, 36, 36, 20), { fill: INK.gold });
      for (let i = 0; i < 5; i++) { const f = frac(t * .9 + i / 5); paint(rrPts(90 + f * 140, 60 - 20 * i * 0, 120, 16, 6), { fill: INK.paper, tone: 1 - f * .5 }); }
      for (let i = 0; i < 6; i++) paint(rrPts(200, 120 - i * 18, 150, 14, 4), { fill: INK.paper, ink: INK.navy, sw: .5 });
      pop();
      if (t > tLoved - .2 && t < tParse) { const kh = stamp(t, tLoved - .2); paint(heartPts(1350, 380, 50 * kh), { fill: INK.orange, tone: .5 }); }
      stampX(1350, 640, 170, stamp(t, tParse));
    }
    // something that matters: a lighthouse rises, its beam sweeping
    const kl = backOut(seg(t, tWant - .1, tMatter + .2));
    if (kl > .01) {
      push(); translate(1350, 1040); scale(1, kl);
      paint([[-90, 0], [90, 0], [55, -460], [-55, -460]], { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      for (let i = 0; i < 3; i++) paint([[-85 + i * 12, -60 - i * 140], [85 - i * 12, -60 - i * 140], [80 - i * 12, -120 - i * 140], [-80 + i * 12, -120 - i * 140]], { fill: INK.orange });
      paint(rrPts(-70, -560, 140, 100, 16), { fill: INK.navy }); paint(rrPts(-45, -540, 90, 60, 10), { fill: INK.yellow }); paint([[-80, -560], [80, -560], [0, -640]], { fill: INK.orange });
      pop();
      if (t > tMatter - .2) { const a = -.3 + .25 * Math.sin((t - tMatter) * 2), kb = ease(seg(t, tMatter - .2, tMatter + .3)); paint([[1350, 1040 - 510 * kl], [1350 - 900 * kb, 1040 - 510 * kl - 900 * kb * Math.tan(a) - 120], [1350 - 900 * kb, 1040 - 510 * kl - 900 * kb * Math.tan(a) + 120]], { fill: 'yellow', tone: .7, over: true }); }
    }
    type('TYPIST', 560, 250, 80, INK.navy, { pop: seg(t, tTyp - .1, tTyp + .2), alpha: 1 - seg(t, tCap - .1, tCap + .1) });
    type('CAPTAIN', 560, 250, 90, INK.orange, { pop: seg(t, tCap, tCap + .3), alpha: 1 - seg(t, tAuto + .5, tAuto + .8) });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · what the book got wrong: security, review is the bottleneck, the harness ----------
  function shotWrong(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('wrong');
    riso({ seed: 195 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tHon = wt('wrong', 'honest'), tWr = wt('wrong', 'wrong'), tSec = wt('wrong', 'security'), tInt = wt('wrong', 'integration'), tText = wt('wrong', 'text'), tBot = wt('wrong', 'bottleneck'), tRev = wt('wrong', 'review'),
      tCap = wt('wrong', 'capacity'), tCheap = wt('wrong', 'cheap'), tHum = wt('wrong', 'human'), tAtt = wt('wrong', 'attention'), tHar = wt('wrong', 'harness'), tMod = wt('wrong', 'model');
    // a notebook page and an eraser
    const pn = stamp(t, tHon - .2) * (1 - ease(seg(t, tSec - .3, tSec)));
    if (pn > .01) {
      push(); translate(960, 520); scale(pn); rotate(-.03);
      paint(rrPts(-340, -260, 680, 520, 20), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      for (let i = 0; i < 6; i++) paint(rectPts(-300, -190 + i * 70, 600, 4), { fill: INK.navy, tone: .4 });
      const er = seg(t, tWr - .1, tWr + .6);
      for (let i = 0; i < 3; i++) paint(rrPts(-260, -130 + i * 70, 440, 24, 12), { fill: INK.navy, tone: i === 1 ? .8 * (1 - er) : .8 });
      if (er > 0 && er < 1) { push(); translate(-240 + 460 * er, -80 + 20 * Math.sin(er * 30)); rotate(.4); paint(rrPts(-40, -70, 80, 140, 14), { fill: INK.orange }); paint(rrPts(-40, 20, 80, 50, 10), { fill: INK.gold }); pop(); }
      pop();
    }
    // security: three pipes feed the agent; someone else's text slides in
    const ps = ease(seg(t, tSec - .2, tSec + .2)) * (1 - ease(seg(t, tBot - .4, tBot)));
    if (ps > .01) {
      push(); translate(0, 600 * (1 - ps));
      const src = [[330, 250], [330, 540], [330, 830]];
      src.forEach(([x, y], i) => { const k = stamp(t, tSec - .1 + i * .2); if (k <= .01) return; inkLine([[x + 90, y], [1000, y], [1300, 560]], 3, INK.navy, 'ink', 0, { force: true, tone: .5 }); push(); translate(x, y); scale(k); paint(ellPts(0, 0, 80, 80, 32), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
        if (i === 0) bubble(0, 0, 90, 60, INK.orange); else if (i === 1) { for (let j = 0; j < 3; j++) paint(ellPts(0, -24 + j * 22, 40, 12, 20), { fill: INK.navy }); } else { paint(rrPts(-40, -26, 80, 52, 6), { fill: INK.gold }); paint(ellPts(-40, 0, 10, 10, 10), { fill: INK.paper }); }
        pop(); });
      clawd(1420, 720, 18, { ...emotions(t, [[tSec - .2, 'happy'], [tText + .4, 'scared']]) });
      if (t > tText - .5) { const f = ease(seg(t, tText - .5, tText + .3)), p = [lerp(420, 1250, f), lerp(250, 520, f * f)]; push(); translate(p[0], p[1]); rotate(-.1); paint(rrPts(-70, -50, 140, 100, 10), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let j = 0; j < 3; j++) paint(rectPts(-50, -26 + j * 22, 100, 8), { fill: INK.navy, tone: .5 }); pop(); if (t > tText + .3) { const k = stamp(t, tText + .3); type('!', 1560, 400, 200 * k, INK.orange); } }
      pop();
    }
    // the bottleneck: a dozen PRs squeeze toward one reviewer; agents are cheap, attention is not
    if (t > tBot - .3) {
      const kb = stamp(t, tBot - .3) * (1 - ease(seg(t, tHar - .4, tHar)));
      if (kb > .01) {
        push(); translate(0, 0);
        paint([[700, 200], [1100, 200], [1100, 380], [1180, 470], [1180, 610], [1100, 700], [1100, 880], [700, 880]].map(([x, y]) => [lerp(900, x, kb), lerp(540, y, kb)]), { fill: INK.navy, tone: .25 });
        for (let i = 0; i < 12; i++) { const f = seg(t, tRev + (i % 12) * .15 - .4, tRev + 6), x = lerp(260 + (i % 3) * 140, 1230, Math.min(1, f * (1 - i / 14))), y = lerp(280 + Math.floor(i / 3) * 150, 540, Math.min(1, f * (1 - i / 14))); pr(x, y, .55 * kb, INK.paper, .1 * (hash(i) - .5)); }
        skipper(1500, 1000, 14, { ...SKIP_POSES[t > tRev + .3 ? 'facepalm' : 'stand'], mood: t > tRev + .3 ? 'worried' : 'neutral', flip: true, t });
        if (t > tCap - .2) for (let i = 0; i < 8; i++) { const k = backOut(seg(t, tCheap - .2 + i * .06, tCheap + .1 + i * .06)); if (k > .01) clawd(160 + i * 150, 1040, 7 * k, { ...feel('happy', T + i * .3), ...move('bounce', T, i) }); }
        if (t > tAtt - .3) { const k = stamp(t, tAtt - .3); push(); translate(1750, 380); scale(k); paint([[-60, -90], [60, -90], [8, 0], [60, 90], [-60, 90], [-8, 0]], { fill: INK.paper, ink: INK.navy, sw: 1.6 }); const f = frac((t - tAtt) * .4); paint([[-45 * (1 - f), -80 + 70 * f], [45 * (1 - f), -80 + 70 * f], [0, -4]], { fill: INK.orange }); paint([[-50 * f, 84 - 30 * f], [50 * f, 84 - 30 * f], [0, 84], [0, 84]], { fill: INK.orange }); paint(rectPts(-70, -104, 140, 16), { fill: INK.brown }); paint(rectPts(-70, 90, 140, 16), { fill: INK.brown }); pop(); }
        pop();
      }
    }
    // the harness: a frame locks around Clawd
    if (t > tHar - .3) {
      const k = stamp(t, tHar - .3, .45);
      paint(rrPts(960 - 380 * k, 540 - 300 * k, 760 * k, 600 * k, 40), { fill: INK.navy, tone: .15 });
      arcLine(960, 540, 1, 1, INK.navy);
      paint(rrPts(960 - 380 * k, 540 - 300 * k, 760 * k, 40, 20), { fill: INK.navy });
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) paint(ellPts(960 + sx * 340 * k, 540 + sy * 260 * k + (sy < 0 ? 20 : 0), 26 * k, 26 * k, 16), { fill: INK.gold });
      clawd(960, 760, 22 * k, { ...emotions(t, [[tHar - .3, 'neutral'], [tMod, 'happy']]) });
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- F · the crew: fresh every time, like dockworkers at every port ----------
  function shotCrew(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('crew');
    riso({ seed: 196 });
    const tLoy = wt('crew', 'loyalty'), tShipm = wt('crew', 'shipmates'), tAg = wt('crew', 'agents'), tRem = wt('crew', 'remember'), tEach = wt('crew', 'each'), tFresh = wt('crew', 'fresh'),
      tDis = wt('crew', 'disappears'), tDock = wt('crew', 'dock'), tPort = wt('crew', 'port');
    const pan = ease(seg(t, tDock - .3, tPort + .6));
    camBegin(960 + 900 * pan, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 2400, H + 400), { fill: 'yellow', ramp: { from: [0, 800], to: [0, 0], a: .6, b: .1 } });
    sea(860, t);
    // the dock
    paint(rectPts(-200, 800, 1300, 50), { fill: INK.brown }); for (let i = 0; i < 7; i++) paint(rectPts(-100 + i * 180, 850, 30, 250), { fill: INK.brown, tone: .8 });
    // further ports along the shore
    for (let i = 0; i < 3; i++) { const x = 1500 + i * 520; paint(rectPts(x, 800, 320, 40), { fill: INK.brown }); paint(rectPts(x + 40, 840, 24, 200), { fill: INK.brown, tone: .8 }); paint(rectPts(x + 250, 840, 24, 200), { fill: INK.brown, tone: .8 }); inkLine([[x + 160, 800], [x + 160, 640]], 1.3, INK.dark, 'ink', 0, { force: true }); paint([[x + 160, 640], [x + 250, 670], [x + 160, 700]], { fill: INK.orange }); }
    // the ship at the dock
    shipHull(1300, 820, .7, .02 * wob(t, .3));
    // loyalty: hearts over a shipmate
    skipper(260, 800, 15, skipAct(t, [[b.start, 'stand', { mood: 'grin', lookX: .6 }], [tLoy, 'hips', { mood: 'happy' }], [tAg, 'shrug', { mood: 'neutral' }], [tDis, 'think', { mood: 'thinking' }]]));
    if (t > tLoy - .2 && t < tAg) for (let i = 0; i < 3; i++) { const k = stamp(t, tLoy - .2 + i * .15), y = 520 - 60 * seg(t, tLoy, tAg) - i * 40; paint(heartPts(420 + i * 90, y, 30 * k), { fill: INK.orange }); }
    if (t > tShipm - .1 && t < tAg) clawd(560, 800, 11, { ...feel('love', T) });
    // one agent: arrives, blank bubble fades (no memory), works, vanishes
    const cycle = (t0, t1, x0, seed) => {
      if (t < t0 || t > t1 + .4) return;
      const f = seg(t, t0, t0 + .8), gone = seg(t, t1, t1 + .3);
      if (gone < 1) clawd(lerp(x0 - 300, x0, ease(f)), 800, 11 * (1 - gone), { ...feel(f < 1 ? 'determined' : 'happy', T + seed), ...(f < 1 ? move('walk', T, seed) : move('bounce', T, seed)) });
      if (gone > 0) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; paint(ellPts(x0 + Math.cos(a) * 80 * gone, 740 + Math.sin(a) * 60 * gone, 26 * (1 - gone), 26 * (1 - gone), 12), { fill: INK.navy, tone: .4 }); }
    };
    cycle(tAg - .2, tDis, 700, 1);
    if (t > tRem - .1 && t < tEach) { const k = stamp(t, tRem - .1) * (1 - seg(t, tRem + .7, tEach)); push(); translate(820, 560); scale(k); bubble(0, 0, 200, 120, INK.paper, { thought: [-80, 110], dots: true, dotTone: .2 }); pop(); }
    cycle(tFresh - .4, tDis + .3, 900, 2);
    cycle(tDock - .5, tPort + .3, 1700, 3);
    cycle(tDock, tPort + .6, 2220, 4);
    cycle(tDock + .4, tPort + 1.2, 2740, 5);
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · the ship: the continuity; the crew is disposable, the ship is not ----------
  function shotShip(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('ship');
    riso({ seed: 197 });
    camBegin(960, 540, 1 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 900], to: [0, 0], a: .7, b: .12 } });
    const tMar = wt('ship', 'maritime'), tShip = wt('ship', 'ship'), tCont = wt('ship', 'continuity'), tCharts = wt('ship', 'charts'), tLog = wt('ship', 'logbook'), tRig = wt('ship', 'rigging'),
      tCode = wt('ship', 'code'), tConv = wt('ship', 'conventions'), tTests = wt('ship', 'tests'), tAg = wt('ship', 'agents'), tBuild = wt('ship', 'build'), tFresh = wt('ship', 'fresh'), tDisp = wt('ship', 'disposable'), tNot = wt('ship', 'not', -1);
    const rock = .015 * wob(t, .25);
    const ks = stamp(t, tShip - .3, .5);
    if (t > tNot - .2) { const k = ease(seg(t, tNot - .2, tNot + .4)); paint(ellPts(960, 520, 700 * k, 520 * k, 64), { fill: 'yellow', ramp: { c: [960, 520], r0: 0, r: 700 * k + 1, a: 1, b: 0 } }); }
    push(); translate(0, 400 * (1 - ks));
    shipHull(960, 760, 1, rock, { tiles: tCode - .1, t, sails: 1, stripes: ease(seg(t, tConv - .1, tConv + .5)) });
    // tests along the rail
    for (let i = 0; i < 6; i++) check(720 + i * 90, 690, .5, stamp(t, tTests + i * .08), INK.green);
    // AGENTS.MD pennant at the masthead
    if (t > tAg - .2) { const k = ease(seg(t, tAg - .2, tAg + .4)); paint([[972, 240], [972 + 300 * k, 270], [972, 300]], { fill: INK.orange }); type('AGENTS.MD', 972 + 120 * k, 270, 24, INK.navy, { alpha: k }); }
    pop();
    sea(870, t, INK.navy, .75);
    // charts, logbook, rigging: stamped in the corners, then they fade into the ship
    const fadeOut = 1 - ease(seg(t, tCode - .4, tCode));
    const corner = (x, y, t0, fn) => { const k = stamp(t, t0 - .15) * fadeOut; if (k <= .01) return; push(); translate(x, y); scale(k); paint(ellPts(0, 0, 110, 110, 40), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
    corner(260, 260, tCharts, () => { paint(rrPts(-70, -50, 140, 100, 8), { fill: INK.gold }); inkLine(through([[-50, 30], [-10, -10], [20, 20], [55, -30]]), 1, INK.navy, 'ink', .5, { force: true }); type('×', 50, -30, 40, INK.orange); });
    corner(1660, 260, tLog, () => { paint(rrPts(-60, -70, 120, 140, 10), { fill: INK.brown }); paint(rrPts(-45, -55, 90, 110, 6), { fill: INK.paper }); for (let i = 0; i < 4; i++) paint(rectPts(-32, -38 + i * 22, 64, 7), { fill: INK.navy, tone: .6 }); });
    corner(1660, 560, tRig, () => { for (let i = 0; i < 4; i++) inkLine([[-60 + i * 40, 60], [0, -70]], 1, INK.navy, 'ink', 0, { force: true }); for (let i = 0; i < 3; i++) inkLine([[-50 + i * 6, 20 - i * 30], [50 - i * 6, 20 - i * 30]], .8, INK.navy, 'ink', 0, { force: true }); });
    // a fresh crew hops aboard; one hops overboard on "disposable", with a splash
    for (let i = 0; i < 3; i++) {
      const t0 = tFresh - .3 + i * .2, f = seg(t, t0, t0 + .5); if (f <= 0) continue;
      const tx = 700 + i * 170;
      if (i === 0 && t > tDisp) { const g = seg(t, tDisp, tDisp + .7), p = arcPt([tx, 720], [260, 1000], 260, g); if (g < 1) clawd(p[0], p[1], 7, { ...feel('happy', T), rot: g * 3 }); else { const s = seg(t, tDisp + .7, tDisp + 1.2); for (let j = 0; j < 5; j++) paint(ellPts(260 + (j - 2) * 30 * (1 + s), 880 - 80 * Math.sin(Math.PI * s) * (1 - Math.abs(j - 2) * .3), 14 * (1 - s), 14 * (1 - s), 10), { fill: INK.paper }); } continue; }
      const p = arcPt([tx - 700, 900], [tx, 720], 200, ease(f));
      clawd(p[0], p[1], 7, { ...feel(f < 1 ? 'excited' : 'determined', T + i * .3), ...(f >= 1 ? move('bounce', T, i) : {}) });
    }
    if (t > tDisp + .9) { const f = seg(t, tDisp + .9, tDisp + 1.5), p = arcPt([-100, 900], [700, 720], 200, ease(f)); clawd(p[0], p[1], 7, { ...feel('happy', T + 2), ...(f >= 1 ? move('bounce', T, 7) : {}) }); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · go build something: tonight, open a terminal ----------
  function shotBuild(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('build');
    riso({ seed: 198 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.navy });
    for (let i = 0; i < 16; i++) paint(starPts(60 + i * 125, 50 + 60 * hash(i), 10 + 8 * hash(i + 5), .35, 4), { fill: INK.yellow, tone: .8 + .2 * pulse(T + hash(i), 4) });
    paint(rectPts(-200, 1000, W + 400, 400), { fill: INK.dark });
    const tTon = wt('build', 'tonight'), tTerm = wt('build', 'terminal'), tBug = wt('build', 'bug'), tAgent = wt('build', 'agent'), tCtx = wt('build', 'context'), tGuard = wt('build', 'guardrail'), tWatch = wt('build', 'watch'),
      tHap = wt('build', 'happens'), tInv = wt('build', 'invented'), tBuild = wt('build', 'build'), tCap = wt('build', 'captain'), tApp = wt('build', 'appendix'), tPen = wt('build', 'pen');
    const late = ease(seg(t, tCap - .9, tCap - .4)), spark = ease(seg(t, tInv - .2, tInv + .3));
    // a moon, tonight
    const km = stamp(t, tTon - .2); if (km > .01) paint(ellPts(1700, 200, 70 * km, 70 * km, 36), { fill: INK.yellow });
    // the terminal glows
    const kt = stamp(t, tTerm - .2) * (1 - late);
    if (kt > .01) {
      glow(960, 460, 520 * kt, 'yellow', .6);
      push(); translate(960, 470); scale(kt); paint(rrPts(-396, -246, 792, 492, 24), { fill: INK.gold }); terminal(0, 0, 760, 460, t > tAgent ? Math.min(12, 3 + Math.floor((t - tAgent) * 4)) : 3); paint(rrPts(-380, -230, 760, 460, 16), { fill: 'yellow', tone: .18, over: true }); pop();
      // the bug crawls; Clawd goes after it; context and a guardrail; squashed on "happens"
      if (t > tBug - .2) { const sq = t > tHap; const bx = sq ? 1180 : 760 + 200 * seg(t, tBug, tHap) + 20 * Math.sin(t * 9); if (!sq) bug(bx, 600, .7, .4 * Math.sin(t * 6)); else { const k = seg(t, tHap, tHap + .5); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; paint(ribbon([[bx + Math.cos(a) * 50 * (1 + k), 620 + Math.sin(a) * 50 * (1 + k)], [bx + Math.cos(a) * 100 * (1 + k), 620 + Math.sin(a) * 100 * (1 + k)]], 12 * (1 - k)), { fill: INK.orange }); } paint(ellPts(bx, 640, 50, 12, 20), { fill: INK.orange, tone: .6 }); } }
      if (t > tCtx - .2) { const k = stamp(t, tCtx - .2); push(); translate(560, 820); scale(k); for (let i = 0; i < 3; i++) paint(rrPts(-60 + i * 8, -40 + i * 16, 120, 50, 8), { fill: [INK.orange, INK.gold, INK.paper][i] }); pop(); }
      if (t > tGuard - .2) { const k = stamp(t, tGuard - .2); push(); translate(1380, 900); scale(k); paint(rectPts(-160, -60, 320, 16), { fill: INK.gold }); paint(rectPts(-160, -10, 320, 16), { fill: INK.gold }); for (let i = 0; i < 5; i++) paint(rectPts(-150 + i * 75, -80, 14, 180), { fill: INK.paper, tone: .8 }); pop(); }
    }
    if (t > tAgent - .3) { const f = seg(t, tAgent - .3, tHap), x = t > tHap ? 1060 : lerp(1500, 1000, ease(f)); clawd(x, 1000, 13 * (1 - late), { ...emotions(t, [[tAgent - .3, 'determined'], [tHap, 'proud']]), flip: t < tHap, ...(t < tHap - .1 ? move('run', T, 1) : move('bounce', T, 1)) }); }
    // invented: sparks; the captain at the helm
    if (spark > 0) {
      for (let i = 0; i < 14; i++) { const f = frac((t - tInv) * .6 + hash(i)), a = hash(i + 3) * TAU; paint(starPts(960 + Math.cos(a) * 700 * f, 480 + Math.sin(a) * 420 * f, 44 * (1 - f) * spark, .35, 4), { fill: i % 2 ? INK.yellow : INK.orange }); }
      const kc = backOut(seg(t, tCap - .4, tCap));
      if (kc > .01) { helm(960, 1000 - 8.4 * 20, 110 * kc, t * .3, INK.gold, INK.navy); glow(960, 700, 300 * kc, 'yellow', .6); }
    }
    skipper(t > tCap - .4 ? 960 : 330, 1000, t > tCap - .4 ? 20 : 15, t > tCap - .4 ? { ...SKIP_POSES.steer, mood: 'proud', t, dy: 400 * (1 - backOut(seg(t, tCap - .4, tCap))) } : skipAct(t, [[b.start, 'stand', { mood: 'grin', lookX: .8 }], [tTerm, 'point', { mood: 'grin' }], [tWatch, 'think', { mood: 'focused' }], [tHap, 'cheer', { mood: 'happy' }], [tInv, 'hips', { mood: 'proud' }]]));
    if (t > tPen - .2) { const k = stamp(t, tPen - .2); glow(1700, 200, 240 * k, 'yellow', .9); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, 'A', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotQuestionIn(T0, lt, dur) { shotQuestion(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('question', 0), shotQuestionIn],
    [shotAt('molting'), shotMolting],
    [shotAt('amplify'), shotAmplify],
    [shotAt('promoted'), shotPromoted],
    [shotAt('wrong'), shotWrong],
    [shotAt('crew'), shotCrew],
    [shotAt('ship'), shotShip],
    [shotAt('build'), shotBuild],
    [B.build.end + .9, shotEnd],
  ]);
})();
