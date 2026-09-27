// chB.js: Appendix B · The State of the Tools. Storyboard: video/storyboards/chB.md
// Deliberately perishable: no product names, prices or version numbers. Every event keyed to a spoken word.
(() => {
  // ---------- small props ----------
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const gear = (x, y, r, rot, col) => { const P = []; for (let i = 0; i < 48; i++) { const a = rot + i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? r : r * .8; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } paint(P, { fill: col }); paint(ellPts(x, y, r * .35, r * .35, 20), { fill: INK.paper }); };
  const fileIcon = (x, y, s, col = INK.paper, o = {}) => { paint([[x - 50 * s, y - 62 * s], [x + 22 * s, y - 62 * s], [x + 50 * s, y - 34 * s], [x + 50 * s, y + 62 * s], [x - 50 * s, y + 62 * s]], { fill: col, ink: INK.navy, sw: 1.2 * s }); for (let i = 0; i < 4; i++) paint(rectPts(x - 32 * s, y - 20 * s + i * 22 * s, 64 * s * (i === 3 ? .6 : 1), 8 * s), { fill: INK.navy, tone: .6 }); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const prCard = (x, y, s, col = INK.green) => { push(); translate(x, y); scale(s); paint(rrPts(-90, -60, 180, 120, 14), { fill: col }); arcLine(-30, 0, 12, 6, INK.paper); arcLine(40, -20, 12, 6, INK.paper); arcLine(40, 30, 12, 6, INK.paper); inkLine(through([[-30, 0], [0, -10], [40, -20]]), 1, INK.paper, 'ink', .5, { force: true }); pop(); };
  const qcard = (x, y, s, col, fn) => { push(); translate(x, y); scale(s); paint(rrPts(-120, -150, 240, 300, 26), { fill: col, ink: INK.navy, sw: 1.4 }); fn(); pop(); };
  const eyeIcon = (x, y, s) => { paint(ellPts(x, y, 70 * s, 44 * s, 32), { fill: INK.paper, ink: INK.navy, sw: 1.6 }); paint(ellPts(x, y, 26 * s, 26 * s, 20), { fill: INK.navy }); };
  const handIcon = (x, y, s) => { push(); translate(x, y); scale(s); paint(rrPts(-40, -20, 80, 70, 20), { fill: SKIN }); for (let i = 0; i < 4; i++) paint(rrPts(-40 + i * 22, -70, 16, 60, 8), { fill: SKIN }); paint(rrPts(-58, -6, 30, 40, 12), { fill: SKIN, rot: .5 }); pop(); };
  const shieldIcon = (x, y, s, mark) => { push(); translate(x, y); scale(s); paint([[0, -90], [80, -50], [80, 30], [0, 100], [-80, 30], [-80, -50]], { fill: INK.navy }); paint([[0, -66], [56, -36], [56, 22], [0, 74], [-56, 22], [-56, -36]], { fill: INK.gold }); if (mark) type('!', 0, 4, 90, INK.orange); pop(); };

  // ---------- A · perishable: a snapshot that shifts and goes stale ----------
  function shotPerish(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('perishable');
    riso({ seed: 201 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tSnap = wt('perishable', 'snapshot'), tShift = wt('perishable', 'shift'), tMonths = wt('perishable', 'months'), tWin = wt('perishable', 'winners'), tJudge = wt('perishable', 'judge'), tExist = wt('perishable', 'exist'),
      tStale = wt('perishable', 'stale'), tDoc = wt('perishable', 'documentation');
    // a polaroid that develops, then yellows (goes stale)
    const kp = stamp(t, tSnap - .3), dev = ease(seg(t, tSnap, tSnap + .8)), stale = ease(seg(t, tStale - .2, tStale + .6));
    push(); translate(600, 500); rotate(-.04); scale(kp);
    paint(rrPts(-260, -240, 520, 600, 16), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
    paint(rrPts(-210, -200, 420, 420, 10), { fill: INK.navy, tone: lerp(1, .3, dev) });
    // three tool icons inside, which swap places on "shift"
    if (dev > .3) { const sw = ease(seg(t, tShift - .1, tShift + .5)); const pos = [[-120, 0], [0, 0], [120, 0]]; const order = sw > .5 ? [2, 0, 1] : [0, 1, 2]; for (let i = 0; i < 3; i++) { const from = pos[i], to = pos[order.indexOf(i)]; const x = lerp(from[0], to[0], sw), y = lerp(from[1], to[1], sw) - 40 * Math.sin(Math.PI * sw); paint(rrPts(x - 40, y - 40, 80, 80, 16), { fill: [INK.orange, INK.gold, INK.green][i] }); } }
    if (stale > 0) paint(rrPts(-260, -240, 520, 600, 16), { fill: 'yellow', tone: .55 * stale, over: true });
    pop();
    // calendar pages flipping on "months"
    if (t > tMonths - .3) { const kc = stamp(t, tMonths - .3); push(); translate(1050, 300); scale(kc); paint(rrPts(-70, -60, 140, 150, 12), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-70, -60, 140, 34, 10), { fill: INK.orange }); const flip = frac(t * 3); paint([[-60, -20], [60, -20], [60 - 30 * flip, 80 - 20 * flip], [-60, 80]], { fill: INK.paper, ink: INK.navy, sw: .8 }); for (let i = 0; i < 3; i++) paint(rectPts(-45, 0 + i * 22, 90, 8), { fill: INK.navy, tone: .5 }); pop(); }
    // trophy X-ed on "winners"
    if (t > tWin - .3 && t < tJudge + .3) { const kw = stamp(t, tWin - .3); push(); translate(1400, 560); scale(kw); paint(rrPts(-60, -80, 120, 100, 20), { fill: INK.gold }); paint(rrPts(-30, 20, 60, 40, 8), { fill: INK.gold }); paint(rrPts(-70, 60, 140, 24, 8), { fill: INK.brown }); pop(); stampX(1400, 540, 110, stamp(t, tWin + .1)); }
    // a magnifier on "judge"
    if (t > tJudge - .2) { const mx = 1400, my = 560; arcLine(mx, my, 90 * stamp(t, tJudge - .2), 20, INK.navy); paint(ellPts(mx, my, 80 * stamp(t, tJudge - .2), 80 * stamp(t, tJudge - .2), 32), { fill: 'yellow', tone: .4, over: true }); paint(ribbon([[mx + 64, my + 64], [mx + 150, my + 150]], 32), { fill: INK.navy }); }
    // a not-yet-existing tool: a dashed outline with ?
    if (t > tExist - .3) { const ke = stamp(t, tExist - .3); push(); translate(1650, 320); scale(ke); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, a2 = a + TAU / 32; inkLine([[Math.cos(a) * 90, Math.sin(a) * 90], [Math.cos(a2) * 90, Math.sin(a2) * 90]], 1.6, INK.navy, 'ink', 0, { force: true }); } type('?', 0, 0, 100, INK.orange); pop(); }
    // the manual opens on "documentation"
    if (t > tDoc - .3) { const kd = ease(seg(t, tDoc - .3, tDoc + .5)); push(); translate(1400, 800); scale(stamp(t, tDoc - .3)); paint([[-160 * kd, -100], [0, -80], [160 * kd, -100], [160 * kd, 100], [0, 120], [-160 * kd, 100]], { fill: INK.paper, ink: INK.navy, sw: 1.4 }); inkLine([[0, -80], [0, 120]], 1.2, INK.navy, 'ink', 0, { force: true }); for (const s of [-1, 1]) for (let i = 0; i < 4; i++) paint(rectPts(s * 30, -50 + i * 34, s * 100 * kd, 8), { fill: INK.navy, tone: .5 }); pop(); }
    skipper(280, 1040, 16, skipAct(t, [[b.start, 'present', { mood: 'neutral' }], [tShift, 'shrug', { mood: 'surprised' }], [tJudge, 'point', { mood: 'focused' }], [tDoc, 'present', { mood: 'grin' }]]));
    camEnd();
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- B · three shapes: terminal, cloud, kits ----------
  function shotShapes(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('shapes');
    riso({ seed: 202 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tThree = wt('shapes', 'three'), tTerm = wt('shapes', 'terminal'), tCloud = wt('shapes', 'cloud'), tPull = wt('shapes', 'pull'), tKits = wt('shapes', 'kits'), tThree2 = wt('shapes', 'three', -1);
    const X = [400, 960, 1520], Y = 500;
    const panel = (i, t0, fn) => { const k = stamp(t, t0 - .2); if (k <= .01) return; push(); translate(X[i], Y); scale(k); paint(rrPts(-250, -230, 500, 460, 30), { fill: INK.paper, ink: INK.navy, sw: 1.6 }); fn(); pop(); };
    // 1 · terminal / editor with Clawd
    panel(0, tTerm, () => { terminal(0, -40, 380, 240, t > tTerm ? Math.min(4, 1 + Math.floor((t - tTerm) * 3)) : 1); clawd(-120, 200, 9, { ...feel('determined', T), ...move('bounce', T, 1) }); });
    // 2 · cloud: a task goes up, a PR comes back
    panel(1, tCloud, () => {
      paint(ellPts(-40, -120, 130, 90, 40), { fill: INK.navy, tone: .3 }); paint(ellPts(60, -140, 90, 70, 32), { fill: INK.navy, tone: .3 }); paint(ellPts(120, -110, 70, 55, 28), { fill: INK.navy, tone: .3 });
      paint(rrPts(-140, -30, 280, 160, 18), { fill: INK.navy, tone: .5 }); for (let i = 0; i < 3; i++) paint(rectPts(-100, 0 + i * 34, 200, 6), { fill: INK.paper, tone: .5 }); type('SANDBOX', 0, 150, 26, INK.navy);
      if (t > tPull - .5) { const f = ease(seg(t, tPull - .5, tPull + .3)); prCard(lerp(0, 200, f), lerp(-30, 210, f), .6); }
    });
    // 3 · kits: parts assembling a small Clawd
    panel(2, tKits, () => {
      const asm = ease(seg(t, tKits, tKits + 1)); const parts = [[-140, -140], [140, -140], [-160, 80], [160, 80]];
      for (const [px, py] of parts) paint(rrPts(lerp(px, -40, asm) - 30, lerp(py, -40, asm) - 30, 60, 60, 12), { fill: INK.orange, tone: .7 });
      if (asm > .6) clawd(0, 150, 11, { ...feel('happy', T) });
      paint(rrPts(-160, 180, 320, 20, 8), { fill: INK.brown });
    });
    // a ribbon tying the three on "three"
    if (t > tThree2 - .3) { const kr = ease(seg(t, tThree2 - .3, tThree2 + .5)); paint(rrPts(340, 760, 1240 * kr, 26, 13), { fill: INK.orange, over: true }); for (let i = 0; i < 3; i++) if (kr > .3) paint(ellPts(X[i], 773, 40, 40, 20), { fill: INK.gold, ink: INK.navy, sw: 1.4 }); }
    type('THREE SHAPES', 960, 200, 74, INK.navy, { pop: seg(t, tThree - .1, tThree + .3), alpha: 1 - seg(t, tTerm - .3, tTerm) });
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · shared conventions: instruction file, protocol, skills, hooks ----------
  function shotStandards(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('standards');
    riso({ seed: 203 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tInstr = wt('standards', 'instruction'), tMd = wt('standards', 'agents'), tProto = wt('standards', 'protocol'), tConn = wt('standards', 'connecting'), tSkills = wt('standards', 'skills'), tNeeds = wt('standards', 'needs'),
      tHooks = wt('standards', 'hooks'), tSame = wt('standards', 'same');
    const X = [420, 960, 1500], Y = 480;
    // 1 · instruction file read by three tools
    const k1 = stamp(t, tInstr - .2);
    if (k1 > .01) { push(); translate(X[0], Y); scale(k1); fileIcon(0, 0, 1.6, INK.paper); type('AGENTS.MD', 0, -120, 26, INK.orange, { pop: seg(t, tMd - .1, tMd + .2) });
      for (let i = 0; i < 3; i++) { const a = -.6 + i * .6; inkLine([[110, -20], [230, -80 + i * 80]], 1.2, INK.navy, 'ink', 0, { force: true, tone: .6 }); paint(ellPts(250, -80 + i * 80, 26, 26, 16), { fill: [INK.navy, INK.gold, INK.green][i] }); } pop(); }
    // 2 · a protocol plug connecting Clawd to a toolbox and a database
    const k2 = stamp(t, tProto - .2);
    if (k2 > .01) { push(); translate(X[1], Y); scale(k2);
      clawd(-160, 120, 9, { ...feel('neutral', T) });
      const conn = ease(seg(t, tConn - .1, tConn + .6));
      inkLine([[-120, 40], [0, 40]], 4, INK.navy, 'ink', 0, { force: true, tone: .6 });
      paint(rrPts(-10, 10, 60, 60, 10), { fill: INK.orange }); paint(rectPts(50, 24, 24, 12), { fill: INK.orange }); paint(rectPts(50, 44, 24, 12), { fill: INK.orange });
      if (conn > 0) { inkLine([[74, 40], [180, -40 * conn]], 4, INK.navy, 'ink', 0, { force: true, tone: .6 }); inkLine([[74, 40], [180, 120 * conn]], 4, INK.navy, 'ink', 0, { force: true, tone: .6 });
        paint(rrPts(160, -110, 130, 100, 12), { fill: INK.gold }); for (let i = 0; i < 3; i++) paint(ellPts(180 + i * 30, -100 + i * 0, 12, 12, 10), { fill: INK.navy });
        for (let i = 0; i < 3; i++) paint(ellPts(220, 60 + i * 30, 60, 14, 24), { fill: INK.green }); }
      type('MCP', 32, 150, 30, INK.navy, { pop: seg(t, tProto, tProto + .3) }); pop(); }
    // 3 · skills folder that opens when needed
    const k3 = stamp(t, tSkills - .2);
    if (k3 > .01) { push(); translate(X[2], Y); scale(k3); const open = ease(seg(t, tNeeds - .3, tNeeds + .4));
      paint([[-150, -80], [-30, -80], [10, -120], [150, -120], [150, 120], [-150, 120]], { fill: INK.brown });
      paint(rrPts(-130, -60 - 80 * open, 260, 160, 10), { fill: INK.paper, ink: INK.navy, sw: 1.2, rot: -.05 * open });
      if (open > .3) { type('SKILL', 0, -110 * open - 20, 30, INK.orange); paint(starPts(90, -30, 20 * open, .45, 5), { fill: INK.gold }); }
      pop(); }
    // 4 · hooks: gears ticking around an action arrow, identical each pass
    if (t > tHooks - .3) { const kh = stamp(t, tHooks - .3); push(); translate(960, 860); scale(kh);
      const step = Math.floor((t - tHooks) * 4); // stepped, so it reads identical on twos
      inkLine([[-260, 0], [200, 0]], 8, INK.navy, 'ink', 0, { force: true }); paint([[200, -30], [260, 0], [200, 30]], { fill: INK.navy });
      gear(-180, 0, 50, step * .5, INK.orange); gear(120, 0, 50, -step * .5, INK.gold);
      type('SAME', 0, -90, 40, INK.navy, { pop: seg(t, tSame - .1, tSame + .2) });
      pop(); }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 500 });
  }

  // ---------- D · models: frontier leads, open-weight closes in, curate context, tokens ----------
  function shotModels(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('models');
    riso({ seed: 204 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .18 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tFast = wt('models', 'fastest'), tLead = wt('models', 'lead'), tImp = wt('models', 'improved'), tLap = wt('models', 'laptop'), tLoop = wt('models', 'loop'), tCur = wt('models', 'curate'), tBurns = wt('models', 'burns');
    // phase 1: a race track — frontier block leads, open-weight closes in
    const p1 = 1 - ease(seg(t, tCur - .5, tCur - .1));
    if (p1 > .01) {
      push(); translate(0, -700 * (1 - p1));
      const Y = 560; paint(rectPts(180, Y + 60, 1560, 12), { fill: INK.navy, tone: .5 });
      const kf = stamp(t, tLead - .3), lead = ease(seg(t, tLead - .2, tLead + .6));
      if (kf > .01) { const x = lerp(360, 1500, lead); paint(rrPts(x - 90, Y - 60, 180, 120, 16), { fill: INK.navy }); type('FRONTIER', x, Y, 26, INK.paper); }
      const ko = stamp(t, tImp - .3), gap = ease(seg(t, tImp - .1, tImp + .8));
      if (ko > .01) { const x = lerp(360, 1320, gap); paint(rrPts(x - 90, Y - 50, 180, 110, 16), { fill: INK.orange }); type('OPEN', x, Y, 28, INK.navy); }
      // the laptop with a looping Clawd
      if (t > tLap - .3) { const kl = stamp(t, tLap - .3); push(); translate(960, 900); scale(kl); paint(rrPts(-160, -110, 320, 200, 12), { fill: INK.navy }); paint(rrPts(-140, -90, 280, 160, 8), { fill: INK.navy, tone: .5 }); paint([[-200, 90], [200, 90], [230, 130], [-230, 130]], { fill: INK.navy, tone: .8 });
        if (t > tLoop - .2) loopArrow(0, -10, 70, t * 2, INK.yellow, 12); clawd(0, 40, 6, { ...feel('happy', T) }); pop(); }
      pop();
    }
    // phase 2: a huge context window; only a few curated cards kept
    if (t > tCur - .3) {
      const kw = stamp(t, tCur - .3);
      push(); translate(700, 470); scale(kw);
      paint(rrPts(-320, -300, 640, 600, 20), { fill: 'none' });
      for (let i = 0; i < 4; i++) paint(rectPts(-320, -300 + i * 200, 640, 8), { fill: INK.navy, tone: .3 });
      paint(rrPts(-320, -300, 16, 600, 4), { fill: INK.navy }); paint(rrPts(304, -300, 16, 600, 4), { fill: INK.navy }); paint(rrPts(-320, -300, 640, 16, 4), { fill: INK.navy }); paint(rrPts(-320, 284, 640, 16, 4), { fill: INK.navy });
      // most cards fade out, a few kept
      const keep = ease(seg(t, tCur, tCur + 1));
      for (let i = 0; i < 12; i++) { const kept = i % 4 === 0, x = -230 + (i % 4) * 150, y = -200 + Math.floor(i / 4) * 190; const al = kept ? 1 : 1 - keep; if (al < .05) continue; paint(rrPts(x - 55, y - 40, 110, 80, 10), { fill: kept ? INK.orange : INK.navy, tone: kept ? 1 : .4, alpha: al }); if (kept) check(x + 30, y - 20, .5, keep); }
      pop();
      type('CURATE', 700, 830, 60, INK.navy, { pop: seg(t, tCur, tCur + .3) });
      // tokens pour into a meter on "burns"
      if (t > tBurns - .3) { const kb = stamp(t, tBurns - .3); push(); translate(1500, 500); scale(kb);
        paint(rrPts(-70, -260, 140, 520, 30), { fill: INK.paper, ink: INK.navy, sw: 1.6 }); const fill = ease(seg(t, tBurns, tBurns + 1.2)); paint(rrPts(-56, 250 - 500 * fill, 112, 500 * fill, 24), { fill: INK.orange });
        for (let i = 0; i < 6; i++) { const f = frac(t * 1.5 + i / 6); paint(ellPts(-30 + 60 * hash(i), -320 + 60 * f, 16, 16, 12), { fill: INK.gold }); } pop(); }
    }
    type('MODELS', 960, 200, 74, INK.navy, { pop: seg(t, tFast - .1, tFast + .3), alpha: 1 - seg(t, tLead - .3, tLead) });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 500 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · the five questions ----------
  function shotQuestions(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('questions');
    riso({ seed: 205 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tSee = wt('questions', 'see'), tTouch = wt('questions', 'touch'), tFb = wt('questions', 'feedback'), tRev = wt('questions', 'review'), tHos = wt('questions', 'hostile');
    const X = [280, 620, 960, 1300, 1640], Y = 480, ts = [tSee, tTouch, tFb, tRev, tHos], cols = [INK.paper, INK.gold, INK.paper, INK.orange, INK.navy];
    qcard(X[0], Y, stamp(t, tSee - .2), cols[0], () => eyeIcon(0, -10, 1.2));
    qcard(X[1], Y, stamp(t, tTouch - .2), cols[1], () => handIcon(0, 30, 1.0));
    qcard(X[2], Y, stamp(t, tFb - .2), cols[2], () => loopArrow(0, 0, 90, t * 2, INK.navy, 18));
    qcard(X[3], Y, stamp(t, tRev - .2), cols[3], () => { arcLine(-10, -20, 60, 16, INK.navy); paint(ribbon([[35, 25], [90, 80]], 24), { fill: INK.navy }); });
    qcard(X[4], Y, stamp(t, tHos - .2), cols[4], () => shieldIcon(0, -10, .9, true));
    // a big "?" behind each as it lands
    for (let i = 0; i < 5; i++) { const k = seg(t, ts[i] - .1, ts[i] + .2); if (k > 0 && k < 1) type('?', X[i], 200, 90, INK.orange, { pop: k }); }
    // the Skipper ticks them off with a clipboard
    skipper(1000, 1040, 15, skipAct(t, [[b.start, 'present', { mood: 'focused' }], [tSee, 'point', { mood: 'grin' }], [tFb, 'point', { mood: 'grin' }], [tHos, 'hips', { mood: 'proud' }]]));
    for (let i = 0; i < 5; i++) check(X[i] + 80, Y + 110, .6, stamp(t, ts[i] + .35));
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- F · hostile: a poisoned ticket, a leak; measure feeling vs being ----------
  function shotHostile(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('hostile');
    riso({ seed: 206 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tRead = wt('hostile', 'reading'), tLeak = wt('hostile', 'leaking'), tWrite = wt('hostile', 'write'), tMeas = wt('hostile', 'measure'), tFeel = wt('hostile', 'feeling'), tSame = wt('hostile', 'same');
    const p1 = 1 - ease(seg(t, tMeas - .5, tMeas - .1));
    if (p1 > .01) {
      push(); translate(0, -700 * (1 - p1));
      clawd(760, 780, 18, { ...emotions(t, [[b.start, 'neutral'], [tRead, 'suspicious'], [tLeak, 'scared']]) });
      // a ticket with a hidden orange line slides in
      if (t < tLeak + .3) { const f = ease(seg(t, b.start + .2, tRead + .3)); push(); translate(lerp(300, 640, f), lerp(400, 640, f)); rotate(-.08); paint(rrPts(-100, -70, 200, 140, 12), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 3; i++) paint(rectPts(-70, -46 + i * 26, 140, 8), { fill: INK.navy, tone: .5 }); paint(rectPts(-70, 32, 140, 10), { fill: INK.orange }); pop(); }
      // the lock box pops open, papers fly out
      const kb = stamp(t, tLeak - .5); push(); translate(1250, 640); scale(kb);
      const open = ease(seg(t, tLeak, tLeak + .4));
      paint(rrPts(-120, -60, 240, 180, 16), { fill: INK.navy }); paint(rrPts(-120, -60 - 140 * open, 240, 40, 12), { fill: INK.navy, tone: .7, rot: -.2 * open });
      paint(rrPts(-40, -20, 80, 70, 10), { fill: INK.gold }); arcLine(0, -20, 30, 10, INK.gold, { a0: Math.PI, a1: TAU });
      pop();
      if (t > tLeak) for (let i = 0; i < 6; i++) { const f = seg(t, tLeak + i * .05, tLeak + .9 + i * .05); if (f <= 0 || f >= 1) continue; const p = arcPt([1250, 580], [1250 + (i - 2.5) * 130, 300], 200, f); push(); translate(p[0], p[1]); rotate(f * 4); paint(rrPts(-34, -44, 68, 88, 6), { fill: INK.paper, ink: INK.navy, sw: .8 }); for (let j = 0; j < 3; j++) paint(rectPts(-22, -26 + j * 20, 44, 6), { fill: INK.orange }); pop(); }
      // short booklets stack on "write"
      if (t > tWrite - .3) for (let i = 0; i < 3; i++) { const k = backOut(seg(t, tWrite - .2 + i * .12, tWrite + .1 + i * .12)); if (k > .01) { push(); translate(400, 900 - i * 44); scale(k); paint(rrPts(-90, -26, 180, 44, 8), { fill: [INK.orange, INK.gold, INK.green][i] }); pop(); } }
      pop();
    }
    // measure: feeling vs being, two bars parting
    if (t > tMeas - .3) {
      type('MEASURE', 960, 200, 70, INK.navy, { pop: seg(t, tMeas - .2, tMeas + .2) });
      const kf = stamp(t, tFeel - .2), part = ease(seg(t, tSame - .3, tSame + .4));
      const bx = 700, Y = 820;
      paint(rectPts(bx - 200, Y, 30, -260 * kf * lerp(1, .55, part)), { fill: INK.orange }); type('FELT FAST', bx - 185, Y + 50, 26, INK.navy, { align: 'left' });
      const cx = 1260;
      paint(rectPts(cx, Y, 30, -260 * kf * lerp(1, 1, part) + (part > 0 ? -100 * part : 0)), { fill: INK.navy }); type('WAS', cx - 10, Y + 50, 26, INK.navy, { align: 'left' });
      if (part > .3) { const rk = ease(seg(t, tSame, tSame + .4)); push(); translate(980, Y - 200); rotate(-.06); paint(rrPts(-320, -18, 640, 36, 6), { fill: INK.gold }); for (let i = 0; i <= 16; i++) paint(rectPts(-300 + i * 37.5 - 3, -18, 6, i % 4 ? 14 : 26), { fill: INK.navy }); pop(); }
    }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · outlast: names change, the book (and the ship) remain ----------
  function shotOutlast(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('outlast');
    riso({ seed: 207 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 900], to: [0, 0], a: .6, b: .12 } });
    const tNames = wt('outlast', 'names'), tChange = wt('outlast', 'change'), tOut2 = wt('outlast', 'outlast'), tCrew = wt('outlast', 'crew'), tShip = wt('outlast', 'ship'), tRead = wt('outlast', 'read');
    // sea band
    { const P = [[-200, 1300]]; for (let i = 0; i <= 48; i++) { const x = -200 + i * 50; P.push([x, 900 + 14 * Math.sin(x * .012 + t * 1.5)]); } P.push([2200, 1300]); paint(P, { fill: INK.navy, tone: .75 }); }
    // name tags flipping / changing
    const p1 = 1 - ease(seg(t, tOut2 - .4, tOut2));
    if (p1 > .01) for (let i = 0; i < 5; i++) { const x = 300 + i * 340, flip = Math.abs(Math.cos((t + i * .3) * 2.2)); push(); translate(x, 360); scale(1, .2 + .8 * flip); rotate(-.05); paint(rrPts(-90, -50, 180, 100, 12), { fill: [INK.orange, INK.gold, INK.green, INK.navy, INK.orange][i], ink: INK.navy, sw: 1.2 }); paint(ellPts(0, -50, 12, 12, 10), { fill: INK.navy }); for (let j = 0; j < 2; j++) paint(rectPts(-56, -12 + j * 26, 112 * (.6 + .4 * hash(i * 3 + j)), 10), { fill: INK.paper }); pop(); }
    // the book stays and glows on "outlast"
    if (t > tOut2 - .4) {
      const k = backOut(seg(t, tOut2 - .4, tOut2 + .2)); glow(960, 480, 360 * ease(seg(t, tOut2, tOut2 + .6)), 'yellow', .8);
      push(); translate(960, 500); scale(k);
      const op = ease(seg(t, tRead - .3, tRead + .4));
      // cover, then it opens
      paint([[-220 * (1 - op) - 10, -170], [-10, -150 - 20 * op], [-10, 180], [-220 * (1 - op) - 10, 160]], { fill: INK.navy, ink: INK.navy, sw: 1.4 });
      paint([[220 * op + 10, -170], [10, -150 - 20 * op], [10, 180], [220 * op + 10, 160]], { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      if (op < .3) { helm(-115, -10, 70, t * .2, INK.gold, INK.orange); type('THE AGENTIC', -115, 90, 24, INK.paper); type('CREW', -115, 125, 30, INK.orange); }
      else { inkLine([[0, -160], [0, 175]], 1.4, INK.navy, 'ink', 0, { force: true }); for (const s of [-1, 1]) for (let i = 0; i < 6; i++) paint(rectPts(s * 24, -110 + i * 44, s * 160 * op, 10, 0), { fill: INK.navy, tone: .5 }); }
      pop();
    }
    // a row of Clawds (the crew) and the ship on their words
    if (t > tCrew - .3) for (let i = 0; i < 4; i++) { const k = backOut(seg(t, tCrew - .2 + i * .08, tCrew + .2 + i * .08)); if (k > .01) clawd(360 + i * 120, 900, 8, { ...feel('happy', T + i * .3), ...move('bounce', T, i) }); }
    if (t > tShip - .3) { const f = ease(seg(t, tShip - .3, tShip + .8)); const sx = lerp(2200, 1480, f); push(); translate(sx, 880); scale(.6); paint([[-380, -40], [380, -40], [300, 110], [-310, 110]], { fill: INK.navy }); inkLine([[0, -40], [0, -520]], 2, INK.dark, 'ink', 0, { force: true }); paint([[12, -500], [12, -80], [300, -80]], { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint([[-12, -430], [-12, -80], [-260, -80]], { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint([[12, -520], [220, -490], [12, -460]], { fill: INK.orange }); pop(); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('feed', lt, dur);
  }

  // ---------- custom end card: read the whole book free ----------
  function endCardB(T0, lt, dur) {
    const T = T0, t = onTwos(lt);
    riso({ seed: 211 });
    camBegin(960, 540, 1.04 - .04 * ease(seg(t, 0, dur)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, -100], to: [0, 700], a: .45, b: 0 } });
    helm(960, 1080, 330, t * .25, INK.gold);
    type('READ THE WHOLE BOOK', 960, 260, 74, INK.navy, { spacing: .04, pop: seg(t, .3, .6) });
    type('FREE', 960, 430, 200, INK.orange, { pop: seg(t, .55, .9) });
    type('FREE', 972, 442, 200, INK.navy, { over: true, tone: .5, pop: seg(t, .65, 1.0) });
    type('THEAGENTICCREW.COM', 960, 620, 68, INK.navy, { spacing: .06, pop: seg(t, .9, 1.3) });
    if (typeof skipper === 'function') skipper(330, 1050, 22, { ...SKIP_POSES.wave, mood: 'happy', t, dy: 400 * (1 - backOut(seg(t, .6, 1.1))) });
    const kc = backOut(seg(t, 1.0, 1.4));
    clawd(1600, 1040 + 300 * (1 - kc), 24, { ...feel('excited', t), flip: true });
    if (t > 1.2) glow(960, 470, 260 * ease(seg(t, 1.2, 1.8)), 'yellow', .5);
    camEnd();
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotPerishIn(T0, lt, dur) { shotPerish(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('perishable', 0), shotPerishIn],
    [shotAt('shapes'), shotShapes],
    [shotAt('standards'), shotStandards],
    [shotAt('models'), shotModels],
    [shotAt('questions'), shotQuestions],
    [shotAt('hostile'), shotHostile],
    [shotAt('outlast'), shotOutlast],
    [B.outlast.end + .9, endCardB],
  ]);
})();
