// ch15.js: Chapter 15 · Building Your Own Agents. Storyboard: video/storyboards/ch15.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); const d = o.tail ?? 1; paint([[x - w * .25 * d, y + h / 2 - 4], [x - w * .32 * d, y + h / 2 + 34], [x - w * .08 * d, y + h / 2 - 4]], { fill: col }); if (o.dots) for (let i = 0; i < 3; i++) paint(ellPts(x - 30 + i * 30, y, 9, 9, 12), { fill: INK.orange }); };
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const tagShape = (x, y, s, col = INK.orange) => { push(); translate(x, y); scale(s); paint([[-70, -34], [50, -34], [84, 0], [50, 34], [-70, 34]], { fill: col }); paint(ellPts(52, 0, 10, 10, 12), { fill: INK.paper }); pop(); };
  const toggle = (x, y, on, col) => { paint(rrPts(x - 34, y - 16, 68, 32, 16), { fill: INK.dark }); paint(ellPts(x + (on ? 16 : -16), y, 13, 13, 16), { fill: col }); };
  const lock = (x, y, s, shut = 1) => { paint(rrPts(x - 34 * s, y - 6 * s, 68 * s, 54 * s, 8 * s), { fill: INK.gold }); arcLine(x, y - (6 + 14 * (1 - shut)) * s, 24 * s, 10 * s, INK.navy, { a0: Math.PI, a1: TAU }); };
  const envelope = (x, y, s, col = INK.paper) => { paint(rrPts(x - 80 * s, y - 52 * s, 160 * s, 104 * s, 8 * s), { fill: col, ink: INK.navy, sw: 1.1 * s }); inkLine([[x - 76 * s, y - 48 * s], [x, y + 8 * s], [x + 76 * s, y - 48 * s]], 1.1 * s, INK.navy, 'ink', 0, { force: true }); };
  const coin = (x, y, r, col = INK.gold) => { paint(ellPts(x, y, r, r, 28), { fill: col }); arcLine(x, y, r * .7, r * .12, INK.orange, { over: true }); };
  const scroll = (x, y, s, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-110, -140, 220, 280, 10), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-130, -160, 260, 36, 18), { fill: INK.gold }); paint(rrPts(-130, 124, 260, 36, 18), { fill: INK.gold }); for (let i = 0; i < 6; i++) paint(rrPts(-80, -100 + i * 36, 160 * (.5 + .5 * hash(i + 9)), 12, 6), { fill: INK.navy, tone: .6 }); pop(); };

  // ---------- A · hundreds of decisions, invisible when you use it, yours when you build it ----------
  function shotDecisions(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('decisions');
    riso({ seed: 151 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tHund = wt('decisions', 'hundreds'), tProm = wt('decisions', 'prompt'), tTools = wt('decisions', 'tools'), tComp = wt('decisions', 'compacted'),
      tInv = wt('decisions', 'invisible'), tBuild = wt('decisions', 'build'), tYours = wt('decisions', 'yours');
    // the panel: a window onto the agent, and twenty switches
    const PX = 700, PY = 170, PW = 1000, PH = 680;
    const kp = stamp(t, b.start + .1, .45);
    push(); translate(PX + PW / 2, PY + PH); scale(1, kp); translate(-(PX + PW / 2), -(PY + PH));
    paint(rrPts(PX, PY, PW, PH, 36), { fill: INK.navy });
    paint(rrPts(PX + 50, PY + 50, 400, 330, 24), { fill: INK.paper });
    clawd(PX + 250, PY + 340, 16, { ...emotions(t, [[b.start, 'neutral'], [tInv - .1, 'sleepy'], [tBuild, 'surprised'], [tYours, 'happy']]), noShadow: true });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
      const i = r * 4 + c, tf = tHund + .05 + hash(i + 3) * 1.1, ty = tYours - .1 + i * .03;
      toggle(PX + 580 + c * 105, PY + 90 + r * 120, t > tf ? (hash(i) > .35) : false, t > ty ? INK.orange : INK.paper);
    }
    // what somebody chose: the prompt, the tools, what survives compaction
    const ki = [tProm, tTools, tComp].map(x => stamp(t, x - .15));
    if (ki[0] > .01) { push(); translate(PX + 110, PY + 520); scale(ki[0]); card(-60, -70, 120, 140, INK.paper, { bar: INK.navy }); pop(); }
    if (ki[1] > .01) wrench(PX + 250, PY + 540, .45 * ki[1], .5);
    if (ki[2] > .01) { const sq = 1 - .55 * ease(seg(t, tComp + .1, tComp + .5)); push(); translate(PX + 390, PY + 590); scale(ki[2]); for (let i = 0; i < 4; i++) card(-60, -(i + 1) * 36 * sq, 120, 32 * sq + 2, [INK.orange, INK.gold, INK.paper, INK.green][i], { bars: false }); pop(); }
    pop();
    // invisible: a curtain of navy halftone drops over the panel; building lifts it
    const cur = ease(seg(t, tInv - .2, tInv + .4)) * (1 - ease(seg(t, tBuild - .1, tBuild + .5)));
    if (cur > .01) paint(rrPts(PX - 20, PY - 20, PW + 40, (PH + 40) * cur, 36), { fill: INK.navy, tone: .8, over: true });
    // the Skipper: uses it from the front, then steps round to the builder's side
    const side = ease(seg(t, tBuild, tBuild + .7)), sx = lerp(400, 1770, side), sy = 1010 + 60 * Math.sin(Math.PI * side);
    skipper(sx, sy, 18, skipAct(t, [[b.start, 'type', { mood: 'focused' }], [tInv - .1, 'shrug', { mood: 'thinking' }], [tBuild, 'stand', { mood: 'grin', flip: side > .5 }], [tYours - .1, 'cheer', { mood: 'happy', flip: true }]]));
    if (t > tYours) { const k = seg(t, tYours, tYours + .6); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ribbon([[1200 + Math.cos(a) * 380 * (1 + k * .4), 510 + Math.sin(a) * 380 * (1 + k * .4)], [1200 + Math.cos(a) * 440 * (1 + k * .4), 510 + Math.sin(a) * 440 * (1 + k * .4)]], 14 * (1 - k)), { fill: INK.orange, over: true }); } }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 1200, cy: 500 });
  }

  // ---------- B · the loop fits on a page; the work is everything around it ----------
  function shotLoop(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('loop');
    riso({ seed: 152 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    for (let i = 0; i < 12; i++) paint(rectPts(i * 170, -100, 3, H + 200), { fill: INK.navy, tone: .15 });
    const tTruth = wt('loop', 'truth'), tPage = wt('loop', 'page'), tCall = wt('loop', 'call'), tTools = wt('loop', 'tools'), tRes = wt('loop', 'results'), tRep = wt('loop', 'repeat'),
      tDis = wt('loop', 'disappoint'), tEasy = wt('loop', 'easy'), tEv = wt('loop', 'everything');
    const CX = 1060, CY = 540;
    // one page
    // a tall stack of pages (what you'd expect) collapses into one
    const kp = stamp(t, b.start + .3, .4), col = ease(seg(t, tPage - .25, tPage + .25));
    if (kp > .01) for (let i = 7; i >= 0; i--) { const off = i * 34 * (1 - col); if (i > 0 && col >= 1) continue; push(); translate(CX + off, CY - off); scale(kp); rotate(-.02 + (i ? .015 * (hash(i) - .5) : 0)); paint(rrPts(-400, -440, 800, 880, 16), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint([[250, -440], [400, -440], [400, -290]], { fill: INK.navy, tone: .3 }); pop(); }
    // the loop on it: model, tools, results back, repeat; then it shrinks to what it is
    const sh = 1 - .55 * ease(seg(t, tEasy - .1, tEasy + .5));
    const kr = seg(t, tCall - .1, tRep + .2), spin = t > tRep ? (t - tRep) * 2.4 : 0;
    push(); translate(CX, CY); scale(sh);
    if (kr > 0) arcLine(0, 0, 240, 22, INK.navy, { a0: -Math.PI / 2 + spin, a1: -Math.PI / 2 + spin + TAU * .96 * ease(kr), cap: 'round' });
    const km = stamp(t, tCall - .1), kt = stamp(t, tTools - .1), kres = stamp(t, tRes - .15);
    if (km > .01) { push(); translate(0, -240); scale(km); paint(ellPts(0, 0, 96, 96, 40), { fill: INK.gold }); clawd(0, 58, 9, { ...feel('determined', T), noShadow: true }); pop(); }
    if (kt > .01) { paint(ellPts(240, 0, 90 * kt, 90 * kt, 40), { fill: INK.orange }); wrench(240, 30, .38 * kt, .6, INK.paper); }
    if (kres > .01) { const f = ease(seg(t, tRes, tRes + .7)), a = lerp(0, Math.PI, f); push(); translate(Math.cos(a) * 240, Math.sin(a) * 240); scale(kres); card(-60, -44, 120, 88, INK.green); pop(); }
    pop();
    // everything around it: context, a lock, a log, a check, a budget gauge, a person
    if (t > tEv - .2) {
      const parts = [
        () => { for (let i = 0; i < 3; i++) card(-50 + i * 6, -40 + i * 16, 100, 44, [INK.orange, INK.gold, INK.navy][i], { bars: false }); },
        () => lock(0, 0, 1.3),
        () => { paint(rrPts(-50, -60, 100, 120, 10), { fill: INK.navy }); for (let i = 0; i < 4; i++) paint(rrPts(-34, -40 + i * 24, 68 * (.5 + .5 * hash(i)), 10, 5), { fill: INK.paper }); },
        () => { paint(ellPts(0, 0, 60, 60, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); check(0, 4, .9, 1); },
        () => { arcLine(0, 10, 56, 16, INK.navy, { a0: Math.PI, a1: TAU }); inkLine([[0, 10], [36 * Math.cos(-.6 - .4 * Math.sin(t * 3)), 10 + 36 * Math.sin(-.6 - .4 * Math.sin(t * 3))]], 1.4, INK.orange, 'ink', 0, { force: true }); },
        () => { paint(ellPts(0, -24, 30, 30, 20), { fill: INK.navy }); paint(rrPts(-46, 8, 92, 56, 28), { fill: INK.navy }); paint(starPts(0, -52, 14, .45, 5), { fill: INK.gold }); },
      ];
      arcLine(CX, CY, 320, 60, INK.gold, { over: true, a0: -Math.PI / 2, a1: -Math.PI / 2 + TAU * ease(seg(t, tEv - .1, tEv + .9)) });
      parts.forEach((fn, i) => { const k = stamp(t, tEv - .1 + i * .1); if (k <= .01) return; const a = -Math.PI / 2 + i * TAU / 6; push(); translate(CX + Math.cos(a) * 320, CY + Math.sin(a) * 320); scale(k); paint(ellPts(0, 0, 82, 82, 36), { fill: 'yellow', tone: .55 }); fn(); pop(); });
    }
    skipper(300, 1040, 17, skipAct(t, [[b.start, 'stand', { mood: 'neutral', flip: false }], [tTruth - .1, 'think', { mood: 'thinking' }], [tPage - .1, 'present', { mood: 'surprised' }], [tDis - .1, 'shrug', { mood: 'worried' }], [tEasy, 'point', { mood: 'grin' }], [tEv, 'present', { mood: 'focused' }]]));
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 1200, cy: 500 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · a workflow first; the open loop only where the path can't be known ----------
  function shotWorkflow(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('workflow');
    riso({ seed: 153 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    const tEv = wt('workflow', 'everything'), tRes = wt('workflow', 'resist'), tMost = wt('workflow', 'most'), tOrd = wt('workflow', 'ordinary'), tModel = wt('workflow', 'model'),
      tFetch = wt('workflow', 'fetch'), tClass = wt('workflow', 'classify'), tDraft = wt('workflow', 'draft'), tQueue = wt('workflow', 'cue'), tDebug = wt('workflow', 'debugging'),
      tDep = wt('workflow', 'depends'), tSkel = wt('workflow', 'skeleton'), tMus = wt('workflow', 'muscles');
    // everything an agent: Clawds multiply; resist it
    const out = ease(seg(t, tMost - .3, tMost + .1));
    if (out < 1) {
      for (let i = 0; i < 8; i++) { const k = stamp(t, tEv - .1 + i * .07) * (1 - out); if (k <= .01) continue; const x = 400 + (i % 4) * 370, y = 470 + Math.floor(i / 4) * 340; clawd(x, y, 11 * k, { ...feel(i % 2 ? 'excited' : 'playful', T + i * .3), boilKey: 'mob' + i }); }
      stampX(960, 480, 300, stamp(t, tRes) * (1 - out));
    }
    // the pipeline: ordinary code with model calls at fixed points
    const Y = 380, X = [330, 750, 1170, 1590];
    const kpipe = ease(seg(t, tOrd - .2, tOrd + .6)), pulseK = t > tSkel ? .35 * Math.exp(-3 * (t - tSkel)) * (1 + Math.sin((t - tSkel) * 14)) : 0;
    if (kpipe > .01) { paint(rrPts(160, Y - 20, 1600 * kpipe, 40, 20), { fill: INK.navy, tone: .75 + pulseK }); X.forEach((x, i) => { const k = stamp(t, tOrd + .1 + i * .12); if (k > .01) paint(rrPts(x - 150 * k, Y - 120 * k, 300 * k, 240 * k, 26), { fill: INK.navy, tone: .25 }); }); }
    const box = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(X[i], Y); scale(k); paint(rrPts(-150, -120, 300, 240, 26), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
    box(0, tFetch, () => fileIcon(0, 0, 1));
    box(1, tClass, () => tagShape(0, 0, 1.3));
    box(2, tDraft, () => { bubble(0, -10, 200, 120, INK.paper, { dots: true }); });
    box(3, tQueue, () => { paint(rrPts(-100, 10, 200, 70, 12), { fill: INK.brown }); card(-70, -70, 140, 90, INK.paper, { bar: INK.navy }); });
    // model calls: small orange diamonds sitting on two of the boxes
    for (const [i, d] of [[1, 0], [2, .12]]) { const k = stamp(t, tModel + d); if (k > .01) { push(); translate(X[i], Y - 150); rotate(TAU / 8); scale(k); paint(rrPts(-34, -34, 68, 68, 8), { fill: INK.orange }); pop(); } }
    // the open loop, only where each step depends on the last
    const kd = stamp(t, tDebug - .2, .45);
    if (kd > .01) {
      push(); translate(960, 800); scale(kd);
      paint(rrPts(-330, -200, 660, 360, 30), { fill: INK.green, tone: .35 });
      inkLine([[0, -200], [0, -300]], 3, INK.navy, 'ink', 0, { force: true });
      loopArrow(0, -40, 150, t * (t > tDep ? 4 : 2), INK.orange, 18);
      clawd(0, 100, 12, { ...emotions(t, [[tDebug - .2, 'thinking'], [tMus, 'proud']]), aL: t > tMus ? 1.5 : undefined, aR: t > tMus ? 1.5 : undefined, boilKey: 'dbg' });
      pop();
    }
    // the human at the end of the line
    const tHum = wt('workflow', 'human'), kS = backOut(seg(t, tOrd, tOrd + .5));
    if (t > tOrd) skipper(1590, 1010 + 300 * (1 - kS), 15, skipAct(t, [[tOrd, 'stand', { mood: 'neutral', flip: true }], [tHum - .1, 'wave', { mood: 'grin', flip: true }], [tDebug, 'think', { mood: 'thinking', flip: true }], [tMus, 'hips', { mood: 'proud', flip: true }]]));
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 800 });
  }

  // ---------- D · the model has no memory: you build the context every turn ----------
  function shotContext(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('context');
    riso({ seed: 154 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .7 });
    const tMem = wt('context', 'memory'), tSend = wt('context', 'send'), tBuild = wt('context', 'build'), tIns = wt('context', 'instructions'), tState = wt('context', 'state'),
      tHist = wt('context', 'history'), tComp = wt('context', 'compacted'), tTrim = wt('context', 'trimmed'), tConf = wt('context', 'confused'), tCtx = wt('context', 'context'), tModel = wt('context', 'model');
    // the agent: an empty thought
    clawd(420, 910, 20, { ...emotions(t, [[b.start, 'neutral'], [tMem, 'sleepy'], [tSend, 'neutral'], [tConf - .1, 'confused'], [tModel - .1, 'happy']]), boilKey: 'ctxc' });
    const kb = stamp(t, tMem - .15) * (1 - ease(seg(t, tSend - .2, tSend + .1)));
    if (kb > .01) { push(); translate(470, 460); scale(kb); bubble(0, 0, 320, 200, INK.paper, { tail: -1 }); paint(rrPts(-100, -30, 200, 60, 30), { fill: INK.navy, tone: .12 }); pop(); }
    // the window: what the model sees this turn
    const FX = 1000, FY = 120, FW = 620, FH = 760;
    const kf = stamp(t, tSend - .2, .4);
    if (kf > .01) {
      push(); translate(FX + FW / 2, FY + FH / 2); scale(kf); translate(-(FX + FW / 2), -(FY + FH / 2));
      paint(rrPts(FX, FY, FW, FH, 24), { fill: INK.navy, tone: .12, ink: INK.navy, sw: 1.6 });
      paint(rrPts(FX, FY, FW, 44, 20), { fill: INK.navy });
      pop();
      const ka = ease(seg(t, tSend, tSend + .6)); if (ka > 0) paint(ribbon([[FX - 20, 620], [lerp(FX - 20, 640, ka), 700]], 22, 6), { fill: INK.orange });
    }
    // the layers: instructions, state, history (compacted), tool results (trimmed)
    const L = FX + 40, LW = FW - 80;
    let y = FY + 80;
    const k1 = stamp(t, tIns - .1); if (k1 > .01) { paint(rrPts(L, y, LW * k1, 120, 14), { fill: INK.navy }); for (let i = 0; i < 3; i++) paint(rrPts(L + 30, y + 24 + i * 30, (LW - 120) * (.5 + .4 * hash(i)) * k1, 12, 6), { fill: INK.paper }); }
    y += 140;
    const k2 = stamp(t, tState - .1); if (k2 > .01) paint(rrPts(L, y, LW * k2, 100, 14), { fill: INK.gold });
    y += 120;
    const k3 = stamp(t, tHist - .1), hh = lerp(250, 90, ease(seg(t, tComp, tComp + .5)));
    if (k3 > .01) { paint(rrPts(L, y, LW * k3, hh, 14), { fill: INK.brown }); for (let i = 0; i < Math.floor(hh / 30); i++) paint(rectPts(L + 24, y + 16 + i * 30, (LW - 60) * k3, 6), { fill: INK.paper, tone: .8 }); }
    y += hh + 20;
    const k4 = stamp(t, tTrim - .9), cut = t > tTrim + .1, drop = ease(seg(t, tTrim + .1, tTrim + .8));
    if (k4 > .01) {
      paint(rrPts(L, y, LW * k4, 80, 14), { fill: INK.orange });
      if (!cut) paint(rectPts(L + LW - 10, y + 10, 400 * k4, 60), { fill: INK.orange, over: false });
      else if (drop < 1) { push(); translate(L + LW + 200, y + 40 + 500 * drop * drop); rotate(.6 * drop); paint(rectPts(-200, -30, 400, 60), { fill: INK.orange, tone: 1 - drop }); pop(); }
      if (t > tTrim - .15 && t < tTrim + .35) { inkLine([[L + LW + 2, y - 30], [L + LW + 2, y + 110]], 2, INK.navy, 'ink', 0, { force: true }); }
    }
    // it's usually the context: a magnifier over the stack
    const km = stamp(t, tCtx - .1);
    if (km > .01) { const mx = FX + FW / 2 + 60 * Math.sin((t - tCtx) * 2), my = 520; push(); translate(mx, my); scale(km); arcLine(0, 0, 170, 26, INK.dark); paint(ellPts(0, 0, 157, 157, 56), { fill: 'yellow', tone: .4, over: true }); paint(ribbon([[120, 120], [240, 240]], 40), { fill: INK.dark }); pop(); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 800 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · tools are the product: read, write, irreversible; idempotent writes ----------
  function shotTools(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('tools');
    riso({ seed: 155 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tSort = wt('tools', 'sort'), tRead = wt('tools', 'read'), tFree = wt('tools', 'freely'), tWrite = wt('tools', 'write'), tIns = wt('tools', 'inside'), tIrr = wt('tools', 'irreversible'),
      tEmail = wt('tools', 'email'), tCard = wt('tools', 'card'), tAppr = wt('tools', 'approval'), tMake = wt('tools', 'make'), tIdem = wt('tools', 'idempotent'), tRetry = wt('tools', 'retry'), tOne = wt('tools', 'one', -2);
    const up = ease(seg(t, tMake - .3, tMake + .3)), OY = -1150 * up;
    // three lanes, sorted by side effect
    if (up < 1) {
      push(); translate(0, OY);
      const X = [400, 960, 1520];
      const lane = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(X[i], 480); scale(k); paint(rrPts(-230, -320, 460, 640, 30), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
      // read: an eye; lookups flow freely
      lane(0, tRead, () => {
        paint(ellPts(0, -200, 110, 60, 40), { fill: INK.green }); paint(ellPts(0, -200, 40, 40, 24), { fill: INK.navy });
        if (t > tFree - .1) for (let i = 0; i < 4; i++) { const f = frac((t - tFree) * .9 + i / 4); paint(rrPts(-60 + 40 * Math.sin(i * 2), -100 + f * 360, 120, 40, 20), { fill: INK.green, tone: 1 - f * .6, over: true }); }
      });
      // write: a pencil, kept inside the run
      lane(1, tWrite, () => {
        push(); translate(0, -200); rotate(-.7); paint(rrPts(-22, -110, 44, 190, 8), { fill: INK.gold }); paint([[-22, 80], [22, 80], [0, 130]], { fill: INK.brown }); pop();
        const kb = stamp(t, tIns - .15); if (kb > .01) { for (let i = 0; i < 18; i++) { const a = i / 18, a2 = a + 1 / 36; const P = s => s < .25 ? [-160 + 320 * s * 4, -30] : s < .5 ? [160, -30 + 300 * (s - .25) * 4] : s < .75 ? [160 - 320 * (s - .5) * 4, 270] : [-160, 270 - 300 * (s - .75) * 4]; inkLine([P(a), P(a2)], 1.6 * kb, INK.navy, 'ink', 0, { force: true }); } const d = ease(seg(t, tIns, tIns + 1.2)); inkLine(through([[-110, 200], [-60, 60], [0, 180], [60, 40], [110, 160]].slice(0, 2 + Math.floor(3 * d))), 2, INK.orange, 'ink', .5, { force: true }); }
      });
      // irreversible: an email and a card, behind a gate that needs approval
      lane(2, tIrr, () => {
        const ke = stamp(t, tEmail - .15), kc = stamp(t, tCard - .15);
        if (ke > .01) { push(); translate(0, -170); scale(ke); envelope(0, 0, 1); pop(); }
        if (kc > .01) { push(); translate(0, 60); scale(kc); paint(rrPts(-110, -66, 220, 132, 14), { fill: INK.orange }); paint(rectPts(-110, -36, 220, 26), { fill: INK.dark }); paint(rrPts(-80, 20, 70, 26, 6), { fill: INK.gold }); pop(); }
        const kg = ease(seg(t, tAppr - .15, tAppr + .25));
        if (kg > .01) for (let i = 0; i < 5; i++) paint(rrPts(-200 + i * 95, -300, 26, 600 * kg, 10), { fill: INK.navy, over: true });
        check(120, 230, 1, stamp(t, tAppr + .3));
      });
      pop();
    }
    // idempotent: one refund stays one refund
    if (up > 0) {
      push(); translate(0, 1150 * (1 - up));
      paint(rrPts(760, 600, 400, 300, 30), { fill: INK.navy }); paint(rrPts(880, 590, 160, 26, 13), { fill: INK.dark });
      const drop1 = easeIn(seg(t, tIdem - .1, tIdem + .4)), y1 = lerp(200, 640, drop1);
      if (drop1 < 1) coin(960, y1, 70);
      if (t > tRetry - .1) { const f = seg(t, tRetry - .1, tRetry + 1.1), p = f < .45 ? [lerp(560, 960, f / .45), lerp(220, 520, easeIn(f / .45))] : arcPt([960, 520], [1500, 900], 260, (f - .45) / .55); coin(p[0], p[1], 70, INK.gold); if (f > .4 && f < .7) arcLine(960, 590, 190, 20, INK.orange, { a0: Math.PI * 1.15, a1: Math.PI * 1.85, over: true }); }
      clawd(420, 900, 16, { ...emotions(t, [[tMake, 'determined'], [tRetry, 'surprised'], [tOne + .3, 'happy']]), boilKey: 'toolc' });
      const k1 = stamp(t, tOne - .1); if (k1 > .01) { type('1', 1480, 420, 330 * k1, INK.orange); type('1', 1494, 432, 330 * k1, INK.navy, { over: true, tone: .5 }); }
      pop();
    }
    skipper(1830, 1060 - 1150 * up, 12, skipAct(t, [[b.start, 'stand', { mood: 'neutral', flip: true }], [tAppr - .1, 'point', { mood: 'focused', flip: true }], [tAppr + .5, 'hips', { mood: 'grin', flip: true }]]));
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- F · asking a human is a tool call: save, ask, stop, resume ----------
  function shotHuman(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('human');
    riso({ seed: 156 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    const tMan = wt('human', 'manager'), tMeet = wt('human', 'meeting'), tSave = wt('human', 'saves'), tSlack = wt('human', 'slack'), tStop = wt('human', 'stops'),
      t18 = wt('human', '18'), tAns = wt('human', 'answer'), tLoop = wt('human', 'loop'), tLeft = wt('human', 'left');
    const night = Math.sin(Math.PI * seg(t, t18 - .1, tAns - .2));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    if (night > .01) paint(rectPts(-200, -200, W + 400, 1120), { fill: INK.navy, tone: .6 * night, over: true });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    // the door: the manager, then the meeting
    const DX = 1540;
    paint(rrPts(DX - 170, 360, 340, 540, 16), { fill: INK.dark });
    if (t > tMan - .3) skipper(DX, 900, 16, { ...skipAct(t, [[tMan - .3, 'wave', { mood: 'grin', flip: true }], [tMeet - .2, 'think', { mood: 'focused', flip: true }]]), dy: 300 * (1 - backOut(seg(t, tMan - .3, tMan + .1))) });
    const shut = ease(seg(t, tMeet, tMeet + .35)) * (1 - ease(seg(t, tAns - .6, tAns - .2)));
    if (shut > .01) { paint(rrPts(DX - 170, 360, 340 * shut, 540, 14), { fill: INK.brown }); paint(ellPts(DX - 170 + 300 * shut, 640, 16, 16, 12), { fill: INK.gold }); }
    paint(rrPts(DX - 190, 340, 380, 30, 10), { fill: INK.navy });
    // the agent with the refund
    const zz = t > tStop && t < tAns;
    clawd(420, 890, 18, { ...emotions(t, [[b.start, 'neutral'], [tMeet, 'thinking'], [tStop, 'sleepy'], [tAns, 'surprised'], [tLoop, 'happy']]), boilKey: 'humc',
      armR: t < tSave + .1 ? (u => { paint(rrPts(0, -2 * u, 3 * u, 2.2 * u, .3 * u), { fill: INK.green }); coin(1.5 * u, -.9 * u, .6 * u); }) : undefined });
    // save the run into a drawer
    const kd = stamp(t, tSave - .3);
    if (kd > .01) { push(); translate(900, 820); scale(kd); paint(rrPts(-150, -80, 300, 160, 16), { fill: INK.navy }); paint(rrPts(-50, -20, 100, 22, 11), { fill: INK.gold }); pop(); }
    if (t > tSave - .1 && t < tSave + .6) { const f = ease(seg(t, tSave - .1, tSave + .5)), p = arcPt([520, 780], [900, 760], 180, f); push(); translate(p[0], p[1]); scale(1 - .5 * f); card(-60, -44, 120, 88, INK.green); pop(); }
    // ask on Slack; later, the answer comes back
    if (t > tSlack - .15 && t < tSlack + .9) { const f = ease(seg(t, tSlack - .15, tSlack + .7)), p = arcPt([900, 700], [DX - 60, 470], 200, f); bubble(p[0], p[1], 150, 90, INK.paper, { dots: true }); }
    if (t > tAns - .2) { const f = ease(seg(t, tAns - .2, tAns + .6)), p = arcPt([DX - 60, 470], [560, 560], 200, f); push(); translate(p[0], p[1]); bubble(0, 0, 150, 90, INK.paper); check(0, 0, .7, stamp(t, tAns + .4)); pop(); }
    // eighteen hours: a clock spins, the sun and the moon cross
    const kc = stamp(t, t18 - .2) * (1 - ease(seg(t, tAns + .4, tAns + .8)));
    if (kc > .01) {
      const f = seg(t, t18, tAns - .3);
      const sp = arcPt([700, 420], [1260, 420], 280, clamp(f * 1.8)), mp = arcPt([700, 420], [1260, 420], 280, clamp(f * 1.8 - .8));
      if (f < .56) paint(ellPts(sp[0], sp[1], 60, 60, 36), { fill: INK.gold, over: true });
      if (f > .44) { paint(ellPts(mp[0], mp[1], 56, 56, 36), { fill: INK.yellow, over: true }); paint(ellPts(mp[0] + 24, mp[1] - 14, 46, 46, 36), { fill: INK.navy, tone: .6 * night }); }
      push(); translate(960, 250); scale(kc); paint(ellPts(0, 0, 110, 110, 48), { fill: INK.paper, ink: INK.navy, sw: 1.6 });
      const a = f * TAU * 18 * .25; inkLine([[0, 0], [Math.cos(a - Math.PI / 2) * 80, Math.sin(a - Math.PI / 2) * 80]], 1.6, INK.navy, 'ink', 0, { force: true }); inkLine([[0, 0], [Math.cos(a / 12 - Math.PI / 2) * 50, Math.sin(a / 12 - Math.PI / 2) * 50]], 2.4, INK.orange, 'ink', 0, { force: true }); pop();
    }
    // picks up where it left off
    const kl = stamp(t, tLoop - .1);
    if (kl > .01) { push(); translate(420, 760); scale(kl); loopArrow(0, 0, 220, (t - tLoop) * 3, INK.orange, 18); pop(); }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- G · evals: realistic tasks, each with a check; run them on every change ----------
  function shotEvals(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('evals');
    riso({ seed: 157 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tWorks = wt('evals', 'works'), tTasks = wt('evals', 'tasks'), tCheck = wt('evals', 'check'), t20 = wt('evals', '20'), tFail = wt('evals', 'failure'), tCase = wt('evals', 'case'),
      tTweak = wt('evals', 'tweak'), tUp = wt('evals', 'upgrade'), tBuild = wt('evals', 'builders'), tClev = wt('evals', 'cleverest'), tThey = wt('evals', 'they'), tBest = wt('evals', 'best');
    // the rack: twenty cards, each with a check
    const GX = 860, GY = 190, FAIL = 12;
    for (let i = 0; i < 20; i++) {
      const c = i % 5, r = Math.floor(i / 5); let x = GX + c * 190, y = GY + r * 175;
      const k = i === 0 ? stamp(t, tTasks - .15) : stamp(t, t20 + i * .045);
      if (k <= .01) continue;
      const failing = i === FAIL && t > tFail - .1 && t < tCase;
      // the first task is shown big, then files into the rack on "20"
      const big = i === 0 ? 1 - ease(seg(t, t20 - .2, t20 + .3)) : 0;
      x = lerp(x, 1180, big); y = lerp(y, 420, big);
      push(); translate(x + 80, y + 70); scale(k * (1 + 1.6 * big));
      paint(rrPts(-80, -70, 160, 140, 18), { fill: failing ? INK.orange : INK.paper, ink: INK.navy, sw: 1 });
      for (let j = 0; j < 3; j++) paint(rrPts(-60, -40 + j * 30, j === 2 ? 60 : 110, 12, 6), { fill: INK.navy, tone: .7 });
      if (i === FAIL && t > tCase) arcLine(0, 0, 100, 10, INK.gold, { over: true });
      pop();
      const t0 = i === 0 ? tCheck : t20 + .3 + i * .045;
      const again = Math.max(t > tTweak ? tTweak + .2 + i * .03 : -1, t > tUp ? tUp + .2 + i * .03 : -1);
      if (failing) stampX(x + 80, y + 70, 50, stamp(t, tFail));
      else if (!(i === FAIL && t > tFail - .1 && t < tCase + .2)) check(x + 80 + 50 * (1 + 1.6 * big), y + 70 - 30 * (1 + 1.6 * big), .7 * (1 + 1.6 * big), again > 0 ? stamp(t, again) : stamp(t, t0));
    }
    // twenty, then the dial and the chip; a clever prompt; the best evals
    const k20 = stamp(t, t20 - .15) * (1 - ease(seg(t, tBuild - .3, tBuild)));
    if (k20 > .01) { type('20', 400, 380, 300 * k20, INK.orange); type('20', 414, 392, 300 * k20, INK.navy, { over: true, tone: .5 }); }
    const kd = stamp(t, tTweak - .2) * (1 - ease(seg(t, tBuild - .3, tBuild)));
    if (kd > .01) { push(); translate(280, 800); scale(kd); paint(ellPts(0, 0, 90, 90, 40), { fill: INK.navy }); const a = -2 + 2.4 * backOut(seg(t, tTweak, tTweak + .4)); inkLine([[0, 0], [Math.cos(a) * 70, Math.sin(a) * 70]], 2, INK.gold, 'ink', 0, { force: true }); pop(); }
    const ku = stamp(t, tUp - .2) * (1 - ease(seg(t, tBuild - .3, tBuild)));
    if (ku > .01) { push(); translate(560, 800); scale(ku); rotate(.2 * (1 - seg(t, tUp, tUp + .4))); paint(rrPts(-80, -80, 160, 160, 12), { fill: INK.gold }); for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { paint(rectPts(-60 + i * 36, s * 80 - (s < 0 ? 24 : 0), 16, 24), { fill: INK.navy }); paint(rectPts(s * 80 - (s < 0 ? 24 : 0), -60 + i * 36, 24, 16), { fill: INK.navy }); } paint(rrPts(-40, -40, 80, 80, 8), { fill: INK.navy }); pop(); }
    const ks = stamp(t, tClev - .2), wilt = ease(seg(t, tThey - .1, tThey + .5));
    if (ks > .01) { scroll(420, 520 + 120 * wilt, .9 * ks * (1 - .3 * wilt), -.5 * wilt); if (wilt < .3) for (let i = 0; i < 4; i++) paint(starPts(420 + Math.cos(i * 1.6) * 190, 520 + Math.sin(i * 1.6) * 190, 26, .35, 4), { fill: INK.orange }); stampX(420, 560, 130, stamp(t, tThey)); }
    const kb = stamp(t, tBest - .1);
    if (kb > .01) { glow(1330, 520, 520 * kb, 'yellow', .7); paint(starPts(1330, 110, 70 * kb, .45, 5), { fill: INK.gold }); }
    skipper(160 + 40 * (1 - stamp(t, tWorks - .3)), 1060, 14, skipAct(t, [[b.start, 'think', { mood: 'thinking' }], [tTasks, 'point', { mood: 'grin' }], [tFail, 'facepalm', { mood: 'worried' }], [tCase, 'point', { mood: 'focused' }], [tBest - .1, 'cheer', { mood: 'happy' }]]));
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · untrusted input, less possible; the harness opens up; build a small one ----------
  function shotSides(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('sides');
    riso({ seed: 158 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tUn = wt('sides', 'untrusted'), tLess = wt('sides', 'less'), tRew = wt('sides', 'reward'), tUsing = wt('sides', 'using'), tBlack = wt('sides', 'black'), tBox = wt('sides', 'box'),
      tBuild = wt('sides', 'build'), tSmall = wt('sides', 'small'), tWrong = wt('sides', 'wrong');
    const clr = ease(seg(t, tRew - .4, tRew));
    // untrusted input, and fewer things made possible
    if (clr < 1) {
      push(); translate(0, 900 * clr);
      const ke = stamp(t, tUn - .3);
      if (ke > .01) { push(); translate(480, 420); scale(ke); rotate(-.08); envelope(0, 0, 1.8); for (let i = 0; i < 2; i++) inkLine([[-120 + i * 12, 30 + i * 12], [-60, -10 + i * 12], [0, 40 + i * 12], [60, -10 + i * 12], [120, 30 + i * 12]], 2.4, INK.orange, 'ink', 0, { force: true, over: true }); pop(); }
      for (let i = 0; i < 6; i++) { const x = 900 + i * 160, k = stamp(t, tUn + .2 + i * .06); if (k <= .01) continue; push(); translate(x, 700); scale(k); paint(rrPts(-60, 0, 120, 40, 10), { fill: INK.navy }); paint(ellPts(0, 0, 48, 26, 24), { fill: i === 2 ? INK.green : INK.orange }); if (i !== 2) { const ks = stamp(t, tLess + i * .05); if (ks > .01) paint(rrPts(-72, -80 * ks, 144, 130 * ks, 16), { fill: INK.navy, tone: .6, over: true }); } pop(); }
      pop();
    }
    // the reward: the Skipper at the helm; the black box opens and shows the loop inside
    if (clr > 0) {
      const kS = backOut(seg(t, tRew - .3, tRew + .3));
      skipper(560, 1060 + 330 * (1 - kS), 18, skipAct(t, [[tRew - .3, 'steer', { mood: 'grin' }], [tBuild - .1, 'point', { mood: 'happy' }], [tWrong - .1, 'think', { mood: 'surprised' }]]));
      if (t < tBuild - .1) helm(560, 1060 - 8.2 * 18 + 330 * (1 - kS) + 400 * ease(seg(t, tBuild - .4, tBuild - .1)), 80, .2 * Math.sin(t * .8), INK.gold, INK.navy);
      const kb = stamp(t, tUsing - .2);
      if (kb > .01) {
        push(); translate(1340, 800); scale(kb);
        const open = backOut(seg(t, tBox, tBox + .5));
        if (open > .01) { glow(0, -200, 260 * open, 'yellow', .8); loopArrow(0, -200, 120 * clamp(open), t * 2.5, INK.gold, 20); }
        paint(rrPts(-240, -170, 480, 300, 20), { fill: INK.dark });
        push(); translate(-240, -170); rotate(-1.9 * clamp(open)); paint(rrPts(0, -40, 480, 44, 14), { fill: INK.navy }); pop();
        pop();
      }
      // build one, even a small one: a little Clawd hops out
      const kc = stamp(t, tSmall - .2);
      if (kc > .01) { const j = jump(t, tSmall - .1, tSmall + .5, 5); clawd(1700, 940, 13 * kc, { ...emotions(t, [[tSmall - .2, 'happy'], [tWrong - .05, 'surprised']]), dy: j.dy, sq: j.sq, flip: true, boilKey: 'small' }); }
      if (t > tWrong - .2) glow(960, 300, 280 * stamp(t, tWrong - .2), 'yellow', .8);
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  // the series ident (as common.js ident()), with a long title set on two lines so it stays inside the frame
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
  function shotIdent(T0, lt, dur) { identTwo(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '16', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotDecisionsIn(T0, lt, dur) { shotDecisions(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('decisions', 0), shotDecisionsIn],
    [shotAt('loop'), shotLoop],
    [shotAt('workflow'), shotWorkflow],
    [shotAt('context'), shotContext],
    [shotAt('tools'), shotTools],
    [shotAt('human'), shotHuman],
    [shotAt('evals'), shotEvals],
    [shotAt('sides'), shotSides],
    [B.sides.end + .9, shotEnd],
  ]);
})();
