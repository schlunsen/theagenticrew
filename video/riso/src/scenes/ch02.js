// ch02.js: Chapter 2 · What Is an Agent? Storyboard: video/storyboards/ch02.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); paint([[x - w * .25, y + h / 2 - 4], [x - w * .32, y + h / 2 + 34], [x - w * .08, y + h / 2 - 4]], { fill: col }); if (o.dots) for (let i = 0; i < 3; i++) paint(ellPts(x - 30 + i * 30, y, 9, 9, 12), { fill: INK.orange }); };
  const terminal = (x, y, w, h, lines, t) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const gear = (x, y, r, rot, col) => { const P = []; for (let i = 0; i < 48; i++) { const a = rot + i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? r : r * .8; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } paint(P, { fill: col }); paint(ellPts(x, y, r * .35, r * .35, 28), { fill: INK.paper }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const tag = (x, y, s, rot) => { push(); translate(x, y); rotate(rot); scale(s); paint([[-150, -50], [120, -50], [170, 0], [120, 50], [-150, 50]], { fill: INK.orange }); paint(ellPts(125, 0, 14, 14, 12), { fill: INK.paper }); type('AGENT', -20, 2, 60, INK.navy); pop(); };

  // ---------- A · the word: "agent" stuck on everything; be precise ----------
  function shotWord(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('word');
    riso({ seed: 41 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 880, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tAg = wt('word', 'agent'), tChat = wt('word', 'chatbot'), tDep = wt('word', 'deploys'), tPre = wt('word', 'precise'), tDiff = wt('word', 'difference');
    const apart = ease(seg(t, tDiff - .2, tDiff + .5)) * 120;
    // a chatbot (left) and a production system (right)
    const kc = stamp(t, tChat - .2), kd = stamp(t, tDep - .2);
    if (kc > .01) { push(); translate(560 - apart, 520); scale(kc); bubble(0, 0, 360, 220, INK.paper, { dots: true }); pop(); }
    if (kd > .01) {
      push(); translate(1360 + apart, 560); scale(kd);
      for (let i = 0; i < 3; i++) { paint(rrPts(-150, -200 + i * 120, 300, 100, 14), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(ellPts(-110 + j * 30, -150 + i * 120, 9, 9, 10), { fill: j === 0 ? INK.green : INK.yellow }); paint(rrPts(0, -160 + i * 120, 110, 18, 9), { fill: INK.paper, tone: .7 }); }
      paint([[180, 80], [240, -60], [300, 80]], { fill: INK.orange }); paint(rrPts(216, -20, 48, 110, 14), { fill: INK.gold });   // the rocket beside it
      pop();
    }
    // the tag: it lands on the chatbot, then leaps onto production — the same word on two very different things
    const kt = stamp(t, tAg - .1);
    if (kt > .01) {
      const hop = ease(seg(t, tDep, tDep + .5)), p = arcPt([560, 330], [1360, 300], 180, hop), p0 = t < tChat ? [960, 250] : p;
      tag(lerp(960, p0[0], ease(seg(t, tChat - .2, tChat + .2))), p0[1], .9 * kt, -.12 + .2 * hop);
      if (t > tDep + .5) tag(560 - apart, 330, .6, .1);
    }
    // precise: a magnifier sweeps across
    const km = seg(t, tPre - .2, tPre + 1.4);
    if (km > 0 && km < 1) { const mx = lerp(400, 1500, ease(km)), my = 560 + 40 * Math.sin(km * 6); arcLine(mx, my, 110, 22, INK.navy); paint(ellPts(mx, my, 99, 99, 40), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[mx + 80, my + 80], [mx + 190, my + 190]], 34), { fill: INK.navy }); }
    if (apart > 1) { const k = apart / 120; paint(rectPts(960 - 150 * k, 700, 300 * k, 20), { fill: INK.gold }); for (let i = 0; i <= 6; i++) paint(rectPts(960 - 150 * k + i * 50 * k - 3, 680, 6, 40), { fill: INK.navy }); }
    skipper(180, 1040, 15, skipAct(t, [[b.start, 'stand', { mood: 'neutral', lookY: -.6 }], [tChat, 'point', { mood: 'grin', flip: true }], [tDep, 'point', { mood: 'surprised' }], [tPre, 'think', { mood: 'thinking' }], [tDiff, 'present', { mood: 'grin' }]]));
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · the spectrum: autocomplete → copilot → tool-using agent → autonomous ----------
  function shotSpectrum(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('spectrum');
    riso({ seed: 42 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tA = wt('spectrum', 'autocomplete'), tC = wt('spectrum', 'copilot'), tAsk = wt('spectrum', 'ask'), tShift = wt('spectrum', 'shift'), tActs = wt('spectrum', 'acts'),
      tRead = wt('spectrum', 'reads'), tRun = wt('spectrum', 'runs'), tChk = wt('spectrum', 'checks'), tAuto = wt('spectrum', 'autonomous'), tGoal = wt('spectrum', 'goal'), tPull = wt('spectrum', 'pull');
    const X = [300, 740, 1190, 1640], Y = 820;
    // the bar: a halftone ramp from yellow (passive) to federal (autonomous)
    const kb = ease(seg(t, b.start, b.start + .7));
    paint(rrPts(160, Y - 22, 1600 * kb, 44, 22), { fill: 'yellow', ramp: { from: [160, 0], to: [1760, 0], a: 1, b: .3 } });
    paint(rrPts(160, Y - 22, 1600 * kb, 44, 22), { fill: 'federal', ramp: { from: [700, 0], to: [1760, 0], a: 0, b: 1 }, over: true });
    const at = [tA, tC, tActs - .3, tAuto];
    X.forEach((x, i) => { const k = stamp(t, at[i] - .2); if (k > .01) paint(ellPts(x, Y, 34 * k, 34 * k, 24), { fill: t > at[i] - .2 ? INK.orange : INK.paper, ink: INK.navy, sw: 1.2 }); });
    // the pointer slides to the station being described; at "shift" it jumps with a burst
    const si = t < tC ? 0 : t < tShift ? 1 : t < tAuto ? 2 : 3, prev = Math.max(0, si - 1), ts = [tA, tC, tShift, tAuto][si];
    const px = lerp(X[prev], X[si], backOut(seg(t, ts - .15, ts + .3)));
    paint([[px - 30, Y + 90], [px + 30, Y + 90], [px, Y + 44]], { fill: INK.navy });
    if (t > tShift && t < tShift + .6) { const k = seg(t, tShift, tShift + .6); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; paint(ribbon([[X[2] + Math.cos(a) * 60 * (1 + k), Y + Math.sin(a) * 60 * (1 + k)], [X[2] + Math.cos(a) * 130 * (1 + k), Y + Math.sin(a) * 130 * (1 + k)]], 14 * (1 - k)), { fill: INK.orange }); } }
    const dim = i => i < si ? .35 : 1;
    // 1 · autocomplete: a line of code and ghost tokens after the cursor
    if (t > tA - .2) { const k = stamp(t, tA - .2); push(); translate(X[0], 470); scale(k); paint(rrPts(-150, -60, 300, 120, 14), { fill: INK.navy, tone: dim(0) }); paint(rrPts(-120, -12, 120, 24, 10), { fill: INK.paper }); const g = Math.floor(3 * seg(t, tA, tA + 1.2)); for (let i = 0; i < g; i++) paint(rrPts(10 + i * 40, -12, 30, 24, 10), { fill: INK.paper, tone: .35 }); if (frac(t * 2) < .5) paint(rectPts(4, -22, 6, 44), { fill: INK.yellow }); pop(); }
    // 2 · copilot: the Skipper asks, a block of code appears
    if (t > tC - .2) { const k = stamp(t, tC - .2); push(); translate(X[1], 470); scale(k); const kb2 = stamp(t, tAsk); card(-110, -150, 220, 170, INK.orange, { tone: dim(1) * kb2 }); if (t < tAsk + .3) bubble(90, 60, 120, 70, INK.paper, { dots: true }); pop(); }
    // 3 · the tool-using agent: Clawd in a loop, touching a file, a terminal, a check
    if (t > tActs - .3) {
      const k = stamp(t, tActs - .3); push(); translate(X[2], 520); scale(k);
      loopArrow(0, -120, 170, t * 2.2, INK.navy, 16);
      if (t > tRead) fileIcon(-170, -250, .8, INK.paper);
      if (t > tRun) terminal(170, -250, 150, 110, 2, t);
      check(0, -330, 1, stamp(t, tChk));
      clawd(0, 30, 12, { ...feel('determined', T), ...move('bounce', T, 1) });
      pop();
    }
    // 4 · autonomous: a goal flag; Clawd leaves and comes back with a pull request
    if (t > tAuto - .2) {
      const k = stamp(t, tAuto - .2); push(); translate(X[3], 520); scale(k);
      if (t > tGoal - .1) { const kg = stamp(t, tGoal - .1); inkLine([[-120, 20], [-120, -200 * kg]], 1.3, INK.dark, 'ink', 0, { force: true }); paint([[-120, -200 * kg], [-30, -170 * kg], [-120, -140 * kg]], { fill: INK.orange }); }
      const away = seg(t, tGoal, tPull - .2), cx = 40 + 320 * Math.sin(Math.PI * away);
      clawd(cx, 30, 12, { ...feel(t > tPull ? 'proud' : 'determined', T), ...move(away > 0 && away < 1 ? 'walk' : 'idle', T, 4), flip: away > .5 });
      if (t > tPull - .3) { const kp = stamp(t, tPull - .3); push(); translate(40, -170); scale(kp); card(-90, -60, 180, 120, INK.green, { bars: false }); arcLine(-30, 0, 12, 6, INK.paper); arcLine(40, -20, 12, 6, INK.paper); arcLine(40, 30, 12, 6, INK.paper); inkLine(through([[-30, 0], [0, -10], [40, -20]]), 1, INK.paper, 'ink', .5, { force: true }); pop(); }
      pop();
    }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · three things: planning, tool use, iteration; a chatbot vs a cycle; the promotion ----------
  function shotThree(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('three');
    riso({ seed: 43 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    const tPlan = wt('three', 'planning'), tSteps = wt('three', 'steps'), tTool = wt('three', 'tool'), tRes = wt('three', 'result'), tIt = wt('three', 'iteration'),
      tTry = wt('three', 'try'), tObs = wt('three', 'observe'), tAdj = wt('three', 'adjust'), tChat = wt('three', 'chatbot'), tCyc = wt('three', 'cycle'), tProm = wt('three', 'promotion');
    const out = ease(seg(t, tChat - .4, tChat));
    // planning: a goal flag at the top of steps that build one by one
    const k1 = stamp(t, tPlan - .2) * (1 - out);
    if (k1 > .01) { push(); translate(420, 560); scale(k1); const n = Math.floor(5 * seg(t, tSteps - .2, tSteps + .8)); for (let i = 0; i < n; i++) paint(rectPts(-200 + i * 80, 120 - i * 70, 80, 70 * (i + 1)), { fill: INK.navy, tone: .5 + .1 * i }); inkLine([[190, 120 - 5 * 70 + 10], [190, -330]], 1.3, INK.dark, 'ink', 0, { force: true }); paint([[190, -330], [270, -300], [190, -270]], { fill: INK.orange }); pop(); }
    // tool use: a wrench and the result feeding back
    const k2 = stamp(t, tTool - .2) * (1 - out);
    if (k2 > .01) { push(); translate(960, 520); scale(k2); wrench(-60, 60, .9, -.5 + .15 * Math.sin(t * 5)); if (t > tRes - .1) { const kr = ease(seg(t, tRes - .1, tRes + .8)); card(60, -120, 150, 110, INK.orange, { tone: kr }); arcLine(20, -20, 170, 14, INK.navy, { a0: -2.6, a1: -2.6 + 2.2 * kr, cap: 'round' }); } pop(); }
    // iteration: a loop with four stations lighting up in turn
    const k3 = stamp(t, tIt - .2) * (1 - out);
    if (k3 > .01) { push(); translate(1500, 520); scale(k3); loopArrow(0, 0, 180, t * 1.5, INK.navy, 18); const st = [tTry, tObs, tAdj, tAdj + .9]; for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * TAU / 4, on = t > st[i]; paint(ellPts(Math.cos(a) * 180, Math.sin(a) * 180, 44, 44, 24), { fill: on ? INK.orange : INK.paper, ink: INK.navy, sw: 1.2 }); } pop(); }
    // one answer vs a cycle
    if (out > 0) {
      const ka = stamp(t, tChat - .1); push(); translate(560, 480); scale(ka); bubble(0, 0, 380, 220, INK.paper); paint(rrPts(-120, -20, 240, 40, 20), { fill: INK.navy, tone: .6 }); pop();
      const kc = stamp(t, tCyc - .2); if (kc > .01) { push(); translate(1320, 480); scale(kc); loopArrow(0, 0, 170, t * 2.5, INK.orange, 24); pop(); }
      // the promotion: Clawd gets a tool belt and a gold star
      const kp = stamp(t, tProm - .2);
      if (kp > .01) {
        clawd(960, 1000, 20, { ...feel(t > tProm + .2 ? 'proud' : 'surprised', T), dy: -40 * jump(t, tProm + .1, tProm + .6, 3).dy / 3 });
        paint(rectPts(960 - 100, 1000 - 70, 200, 24), { fill: INK.brown }); wrench(1060, 950, .25, .6); paint(starPts(900, 830, 36 * kp, .45, 5), { fill: INK.gold });
      }
    }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 900 });
  }

  // ---------- D · anatomy: model, tools, loop, environment ----------
  function shotAnatomy(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('anatomy');
    riso({ seed: 44 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tFour = wt('anatomy', 'four'), tModel = wt('anatomy', 'model'), tNothing = wt('anatomy', 'nothing'), tTools = wt('anatomy', 'tools'),
      tLoop = wt('anatomy', 'loop'), tEnv = wt('anatomy', 'environment'), tRun = wt('anatomy', 'run');
    const join = ease(seg(t, tRun, tRun + .6));
    const pos = [[520, 320], [1400, 320], [520, 780], [1400, 780]].map(([x, y]) => [lerp(x, 960, join), lerp(y, 560, join)]);
    // blueprint grid
    for (let i = 0; i < 12; i++) paint(rectPts(i * 170, -100, 3, H + 200), { fill: INK.navy, tone: .18 });
    for (let i = 0; i < 7; i++) paint(rectPts(-100, i * 170, W + 200, 3), { fill: INK.navy, tone: .18 });
    // the hub and spokes
    const kh = stamp(t, tFour - .2) * (1 - join);
    if (kh > .01) { for (const p of pos) inkLine([[960, 560], p], 1.2, INK.navy, 'ink', 0, { force: true, tone: .6 }); paint(ellPts(960, 560, 70 * kh, 70 * kh, 32), { fill: INK.gold }); }
    const part = (i, t0, fn) => { const k = stamp(t, t0 - .15) * (1 - join); if (k <= .01) return; push(); translate(...pos[i]); scale(k); paint(rrPts(-220, -150, 440, 300, 30), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
    // model: text in, text out, nothing else
    part(0, tModel, () => {
      paint(rrPts(-80, -80, 160, 160, 40), { fill: INK.navy });
      for (let i = 0; i < 3; i++) { const f = frac(t * .8 + i / 3); paint(rrPts(lerp(-210, -90, f), -50 + i * 40, 60, 16, 8), { fill: INK.orange }); paint(rrPts(lerp(90, 210, f) - 60, -50 + i * 40, 60, 16, 8), { fill: INK.gold }); }
      if (t > tNothing) paint(ellPts(0, 0, 36, 36, 20), { fill: INK.paper });
    });
    // tools: what it may ask for
    part(1, tTools, () => { paint(rrPts(-170, -20, 340, 130, 16), { fill: INK.orange }); paint(rrPts(-60, -60, 120, 50, 20), { fill: INK.paper, ink: INK.orange, sw: 2 }); wrench(-80, -10, .35, -.6); fileIcon(20, -60, .6); terminal(120, -70, 90, 70, 1, t); });
    // loop
    part(2, tLoop, () => loopArrow(0, 0, 100, t * 2.5, INK.navy, 20));
    // environment: a container with the repo and a shell inside
    part(3, tEnv, () => { paint(rrPts(-180, -110, 360, 220, 20), { fill: INK.green, tone: .35 }); for (let i = 0; i < 4; i++) paint(rectPts(-180 + i * 90, -110, 6, 220), { fill: INK.navy, tone: .4 }); fileIcon(-70, 0, .7); terminal(70, 0, 140, 110, 2, t); });
    // they assemble into an agent
    if (join > 0) { glow(960, 600, 300 * join, 'yellow', .8); clawd(960, 700, 26 * join, { ...feel('happy', T) }); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 900 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 600 });
  }

  // ---------- E · how tool calling works: the model only asks; the harness runs it ----------
  function shotCalling(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('calling');
    riso({ seed: 45 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 860, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tNever = wt('calling', 'never'), tStr = wt('calling', 'structured'), tAsk = wt('calling', 'asks'), tH = wt('calling', 'harness'), tAll = wt('calling', 'allowed'),
      tRuns = wt('calling', 'runs'), tBack = wt('calling', 'back'), tRead = wt('calling', 'reads'), tDec = wt('calling', 'decides'), tTrick = wt('calling', 'trick');
    const MX = 330, HX = 960, TX = 1590;
    // the model (Clawd, in its booth), the harness (a machine with a gate), the terminal (the real world)
    paint(rrPts(MX - 190, 380, 380, 480, 30), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
    clawd(MX, 850, 18, { ...emotions(t, [[b.start, 'neutral'], [tNever, 'sad'], [tStr, 'determined'], [tRead - .1, 'thinking'], [tDec, 'idea']]) });
    // "never executes": the terminal is behind glass, out of reach
    const kn = stamp(t, tNever - .2);
    if (kn > .01) { terminal(TX, 560, 320 * kn, 260 * kn, t > tRuns ? Math.min(6, 1 + Math.floor((t - tRuns) * 5)) : 1, t); paint(rectPts(TX - 200, 380, 12, 380), { fill: INK.navy, tone: .35, over: true }); if (t < tStr) stampX(TX, 560, 90, stamp(t, tNever + .2)); }
    const kh = stamp(t, tH - .3);
    if (kh > .01) { push(); translate(HX, 600); scale(kh); paint(rrPts(-170, -200, 340, 400, 30), { fill: INK.navy }); gear(-60, 110, 60, t * 2, INK.gold); gear(55, 130, 42, -t * 2.8, INK.orange); const ok = t > tAll; paint(ellPts(0, -140, 34, 34, 20), { fill: ok ? INK.green : INK.orange }); paint(rrPts(-110, -80, 220, 110, 16), { fill: INK.paper, tone: .9 }); check(0, -30, 1.1, stamp(t, tAll)); pop(); }
    // the request: structured text travelling right; the output travelling back
    const kr = stamp(t, tStr - .1);
    if (kr > .01 && t < tRuns + .2) { const p = arcPt([MX + 40, 480], [HX, 420], 120, ease(seg(t, tAsk, tAsk + .7))); push(); translate(p[0], p[1]); scale(kr); paint(rrPts(-110, -60, 220, 120, 16), { fill: INK.orange }); type('{ }', 0, 4, 70, INK.navy); pop(); }
    if (t > tRuns && t < tBack + .2) { const p = [lerp(HX + 120, TX - 180, ease(seg(t, tRuns, tRuns + .4))), 440]; paint(rrPts(p[0] - 60, p[1] - 30, 120, 60, 12), { fill: INK.orange }); }
    if (t > tBack - .1) { const p = arcPt([TX - 120, 700], [MX + 60, 520], 160, ease(seg(t, tBack - .1, tBack + .8))); card(p[0] - 90, p[1] - 60, 180, 120, INK.gold, { tone: 1 }); }
    // that's the whole trick: the loop drawn through all three
    const kt = seg(t, tTrick - .3, tTrick + .6);
    if (kt > 0) { arcLine(960, 560, 700, 16, INK.orange, { a0: Math.PI * 1.02, a1: Math.PI * (1.02 + .96 * ease(kt)), cap: 'round', over: true }); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 600 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- F · the harness: permissions, context, stopping, where; influence vs control ----------
  function shotHarness(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('harness');
    riso({ seed: 46 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tH = wt('harness', 'harness'), tPerm = wt('harness', 'permissions'), tCtx = wt('harness', 'context'), tStop = wt('harness', 'stop'), tWhere = wt('harness', 'where'),
      tReck = wt('harness', 'reckless'), tSug = wt('harness', 'suggest'), tAllow = wt('harness', 'allow'), tInf = wt('harness', 'influence'), tCtl = wt('harness', 'control');
    // the frame: the harness around the model
    const kf = stamp(t, tH - .3, .5), fx = 960, fy = 520, fw = 900 * kf, fh = 620 * kf;
    if (kf > .01) { paint(rrPts(fx - fw / 2, fy - fh / 2, fw, fh, 40), { fill: INK.navy, tone: .12 }); arcLine(0, 0, 0, 0, INK.navy); paint(rrPts(fx - fw / 2, fy - fh / 2, fw, 40, 20), { fill: INK.navy }); }
    clawd(fx, fy + 190, 18, { ...emotions(t, [[b.start, 'happy'], [tReck - .1, 'mischief'], [tAllow + .3, 'sad'], [tInf, 'neutral']]), dx: t > tReck && t < tAllow + .3 ? 1.5 : 0 });
    // four controls on the frame
    const ctl = (x, y, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(x, y); scale(k); paint(ellPts(0, 0, 80, 80, 36), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
    ctl(fx - 450, fy - 310, tPerm, () => { const shut = t > tAllow; paint(rrPts(-34, -6, 68, 54, 8), { fill: INK.gold }); arcLine(0, shut ? -6 : -20, 24, 10, INK.navy, { a0: Math.PI, a1: TAU }); });
    ctl(fx + 450, fy - 310, tCtx, () => { for (let i = 0; i < 4; i++) card(-40 + i * 4, -40 + i * 12, 80, 30, [INK.orange, INK.gold, INK.navy, INK.green][i], { bars: false }); });
    ctl(fx - 450, fy + 310, tStop, () => { const P = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * TAU / 8; P.push([Math.cos(a) * 52, Math.sin(a) * 52]); } paint(P, { fill: INK.orange }); paint(rectPts(-28, -6, 56, 12), { fill: INK.paper }); });
    ctl(fx + 450, fy + 310, tWhere, () => { paint([[-40, 10], [-10, -24], [20, 10]], { fill: INK.navy }); paint(rectPts(-34, 10, 48, 34), { fill: INK.navy }); for (const [dx, dy, r] of [[20, -10, 18], [38, -18, 22], [56, -8, 16]]) paint(ellPts(dx, dy, r, r * .8, 16), { fill: INK.green }); });
    // reckless: Clawd reaches for the big red button; the lock slams, the button is shielded
    const kb = stamp(t, tReck - .2) * (1 - ease(seg(t, tInf - .4, tInf)));
    if (kb > .01) { push(); translate(fx + 250, fy + 200); scale(kb); paint(rrPts(-70, 0, 140, 50, 12), { fill: INK.navy }); paint(ellPts(0, 0, 60, 30, 28), { fill: INK.orange }); if (t > tAllow) { const ks = stamp(t, tAllow); paint(rrPts(-90, -90 * ks, 180, 150 * ks, 20), { fill: INK.navy, tone: .5, over: true }); } pop(); }
    if (t > tSug - .1 && t < tAllow) bubble(fx - 150, fy - 20, 170, 100, INK.paper, { dots: true });
    // influence (talk to the model) vs control (hand on the lever)
    const kS = stamp(t, tInf - .4);
    if (kS > .01) {
      const lv = t > tCtl ? backOut(seg(t, tCtl, tCtl + .4)) : 0;
      push(); translate(1640, 1060); paint(rrPts(-20, -260, 40, 200, 16), { fill: INK.navy }); push(); translate(0, -260); rotate(-.6 + 1.2 * lv); paint(rrPts(-10, -140, 20, 140, 10), { fill: INK.dark }); paint(ellPts(0, -150, 30, 30, 20), { fill: INK.orange }); pop(); pop();
      if (t > tInf && t < tCtl) bubble(1280, 780, 170, 100, INK.paper, { dots: true });
      skipper(1440, 1060 + 300 * (1 - kS), 16, skipAct(t, [[tInf - .4, 'present', { mood: 'neutral', flip: true }], [tCtl - .1, 'point', { mood: 'grin' }]]));
    }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- G · limits: four failures, each with a mitigation; the rest of the book ----------
  function shotLimits(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('limits');
    riso({ seed: 47 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tMagic = wt('limits', 'magic'), tHal = wt('limits', 'hallucinate'), tDrift = wt('limits', 'drift'), tVic = wt('limits', 'victory'), tLose = wt('limits', 'lose'),
      tMit = wt('limits', 'mitigation'), tRest = wt('limits', 'rest');
    const shelf = ease(seg(t, tRest - .2, tRest + .6));
    // not magic: a top hat, empty
    const km = stamp(t, tMagic - .2) * (1 - ease(seg(t, tHal - .4, tHal - .1)));
    if (km > .01) { push(); translate(960, 560); scale(km); paint(rrPts(-130, -260, 260, 260, 16), { fill: INK.navy }); paint(rrPts(-210, -10, 420, 40, 20), { fill: INK.navy }); stampX(0, -110, 150, stamp(t, tMagic + .2)); pop(); }
    const X = [300, 740, 1180, 1620], Y = lerp(500, 1300, shelf);
    const panel = (i, t0, fn) => { const k = stamp(t, t0 - .15) * (1 - shelf); if (k <= .01) return; push(); translate(X[i], Y); scale(k); paint(rrPts(-190, -220, 380, 440, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); check(120, -170, 1, stamp(t, tMit + i * .15)); pop(); };
    // hallucinated API: a box drawn in dashes, a library that isn't there
    panel(0, tHal, () => { for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, a2 = a + TAU / 32; inkLine([[Math.cos(a) * 110, Math.sin(a) * 110], [Math.cos(a2) * 110, Math.sin(a2) * 110]], 1.6, INK.navy, 'ink', 0, { force: true }); } type('?', 0, 0, 120, INK.orange); });
    // drift beyond the task: an arrow curving away from its small target
    panel(1, tDrift, () => { arcLine(-90, 60, 44, 14, INK.orange); paint(ellPts(-90, 60, 14, 14, 12), { fill: INK.orange }); const k = ease(seg(t, tDrift, tDrift + 1)); inkLine(through([[-150, 150], [-60, 120], [40, 20], [90, -60 - 60 * k], [120 * k + 20, -150 * k]]), 1.8, INK.navy, 'ink', .5, { force: true }); });
    // victory too early: a flag on a half-built bridge
    panel(2, tVic, () => { paint(rectPts(-170, 60, 190, 30), { fill: INK.navy }); paint(rectPts(-170, 90, 30, 100), { fill: INK.navy }); paint(rectPts(-10, 90, 30, 100), { fill: INK.navy }); paint(rectPts(80, 60, 90, 30), { fill: INK.navy, tone: .3 }); inkLine([[0, 60], [0, -110]], 1.3, INK.dark, 'ink', 0, { force: true }); paint([[0, -110], [80, -85], [0, -60]], { fill: INK.orange }); });
    // lose track: a thread that frays into fog
    panel(3, tLose, () => { inkLine(through([[-150, 100], [-80, 40], [0, 80], [60, 0]]), 1.6, INK.navy, 'ink', .5, { force: true }); for (let i = 0; i < 5; i++) paint(ellPts(60 + i * 20 - 40, -30 - i * 18, 60, 36, 20), { fill: INK.navy, tone: .25, over: true }); type('?', 60, -90, 80, INK.orange, { tone: .8 }); });
    // they become the rest of the book: spines on a shelf
    if (shelf > 0) {
      paint(rectPts(360, 820, 1200, 30), { fill: INK.brown });
      const titles = 18;
      for (let i = 0; i < titles; i++) { const k = backOut(seg(t, tRest - .1 + i * .04, tRest + .3 + i * .04)); if (k <= 0) continue; const x = 400 + i * 64, h = 240 + 60 * hash(i); paint(rrPts(x, 820 - h * k, 54, h * k, 6), { fill: [INK.navy, INK.orange, INK.gold, INK.green][i % 4] }); paint(ellPts(x + 27, 820 - h * k + 40, 12 * k, 12 * k, 12), { fill: INK.paper }); }
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- H · Rain Man: the agent counts cards; you decide which casino, what to bet, when to cash out ----------
  function shotRainman(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('rainman');
    riso({ seed: 48 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.navy });
    for (let i = 0; i < 14; i++) paint(starPts(80 + i * 140, 60 + 40 * hash(i), 14 + 8 * hash(i + 5), .35, 4), { fill: INK.yellow, tone: .8 + .2 * pulse(T + hash(i), 4) });
    const tRay = wt('rainman', 'raymond'), tCount = wt('rainman', 'counts'), tChar = wt('rainman', 'charlie'), tCas = wt('rainman', 'casino'), tBet = wt('rainman', 'bet'),
      tCash = wt('rainman', 'cash'), tJob = wt('rainman', 'job'), tNext = wt('rainman', 'context');
    // the table: green felt
    paint(ellPts(900, 900, 900, 260, 80), { fill: INK.green });
    paint(ellPts(900, 900, 820, 220, 80), { fill: INK.green, tone: .7, over: true });
    // the casino marquee
    const kc = stamp(t, tCas - .2);
    if (kc > .01) { push(); translate(1450, 250); scale(kc); paint(rrPts(-260, -90, 520, 180, 30), { fill: INK.orange }); for (let i = 0; i < 12; i++) paint(ellPts(-240 + i * 44, -110 + 220 * (i % 2), 12, 12, 10), { fill: pulse(T + i * .1, 5) > .5 ? INK.yellow : INK.gold }); paint(starPts(0, 0, 70, .45, 5), { fill: INK.yellow }); pop(); }
    // Raymond (the agent): counting cards, very fast
    clawd(620, 860, 20, { ...emotions(t, [[b.start, 'neutral'], [tCount, 'determined'], [tCash + .4, 'happy']]) });
    if (t > tCount - .2) for (let i = 0; i < 5; i++) { const f = frac((t - tCount) * 3 + i / 5), p = arcPt([420, 760], [860, 820], 120, f); push(); translate(p[0], p[1]); rotate(f * 3); paint(rrPts(-34, -48, 68, 96, 8), { fill: INK.paper, ink: INK.navy, sw: .8 }); paint(heartPts(0, 0, 16), { fill: INK.orange }); pop(); }
    // chips: the bet, then cashed out into a bag
    const bet = ease(seg(t, tBet, tBet + .5)), cash = ease(seg(t, tCash, tCash + .7));
    for (let s = 0; s < 3; s++) for (let c = 0; c < 6; c++) { const bx = lerp(1180 + s * 60, 980 + s * 60, bet), by = 900 - c * 16; const p = [lerp(bx, 1560, cash), lerp(by, 960, cash)]; if (cash < .98) paint(ellPts(p[0], p[1], 34, 11, 20), { fill: [INK.orange, INK.gold, INK.paper][s], ink: INK.navy, sw: .5 }); }
    if (t > tCash - .2) { const kb = stamp(t, tCash - .2); paint(through([[1500, 1000], [1480, 900], [1530, 860], [1590, 860], [1640, 900], [1620, 1000], [1500, 1000]]), { fill: INK.gold, alpha: kb }); }
    // Charlie (you): arrives, points at the casino, bets, cashes out, proud
    const kS = stamp(t, tChar - .3);
    if (kS > .01) skipper(lerp(2100, 1300, easeOut(seg(t, tChar - .3, tChar + .5))), 1060, 20, skipAct(t, [[tChar - .3, 'stand', { mood: 'grin', flip: true }], [tCas, 'pointUp', { mood: 'focused' }],
      [tBet, 'present', { mood: 'grin', flip: true }], [tCash, 'point', { mood: 'happy' }], [tJob - .1, 'hips', { mood: 'proud' }]]));
    if (t > tNext - .2) { const k = stamp(t, tNext - .2); glow(960, 420, 260 * k, 'yellow', .9); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '03', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotWordIn(T0, lt, dur) { shotWord(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('word', 0), shotWordIn],
    [shotAt('spectrum'), shotSpectrum],
    [shotAt('three'), shotThree],
    [shotAt('anatomy'), shotAnatomy],
    [shotAt('calling'), shotCalling],
    [shotAt('harness'), shotHarness],
    [shotAt('limits'), shotLimits],
    [shotAt('rainman'), shotRainman],
    [B.rainman.end + .9, shotEnd],
  ]);
})();
