// ch04.js: Chapter 4 · Guardrails, Trust, and Sandboxes. Storyboard: video/storyboards/ch04.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); paint([[x - w * .25, y + h / 2 - 4], [x - w * .32, y + h / 2 + 34], [x - w * .08, y + h / 2 - 4]], { fill: col }); if (o.dots) for (let i = 0; i < o.dots; i++) paint(ellPts(x - (o.dots - 1) * 15 + i * 30, y, 9, 9, 12), { fill: INK.orange }); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const padlock = (x, y, s, col = INK.gold) => { arcLine(x, y - 30 * s, 34 * s, 14 * s, INK.navy, { a0: Math.PI, a1: TAU }); paint(rectPts(x - 34 * s - 7 * s, y - 30 * s, 14 * s, 30 * s), { fill: INK.navy }); paint(rectPts(x + 34 * s - 7 * s, y - 30 * s, 14 * s, 30 * s), { fill: INK.navy }); paint(rrPts(x - 50 * s, y - 10 * s, 100 * s, 80 * s, 10 * s), { fill: col }); paint(ellPts(x, y + 25 * s, 10 * s, 10 * s, 12), { fill: INK.navy }); };
  const branch = (x, y, s, col = INK.navy, dot = INK.orange) => { inkLine([[x - 60 * s, y + 70 * s], [x - 60 * s, y - 70 * s]], 3 * s, col, 'ink', 0, { force: true }); inkLine(through([[x - 60 * s, y + 30 * s], [x - 10 * s, y + 10 * s], [x + 50 * s, y - 30 * s]]), 3 * s, col, 'ink', .5, { force: true }); for (const [px, py] of [[-60, 70], [-60, -70], [50, -30]]) paint(ellPts(x + px * s, y + py * s, 20 * s, 20 * s, 16), { fill: dot, ink: col, sw: 1 * s }); };
  const toggle = (x, y, s, on) => { paint(rrPts(x - 70 * s, y - 34 * s, 140 * s, 68 * s, 34 * s), { fill: on ? INK.green : INK.orange }); paint(ellPts(x + (on ? 36 : -36) * s, y, 28 * s, 28 * s, 20), { fill: INK.paper }); };
  const popup = (x, y, s, col = INK.paper) => { paint(rrPts(x - 110 * s, y - 70 * s, 220 * s, 140 * s, 14 * s), { fill: col, ink: INK.navy, sw: 1 * s }); paint(rrPts(x - 110 * s, y - 70 * s, 220 * s, 26 * s, 10 * s), { fill: INK.navy }); paint(rrPts(x - 80 * s, y - 25 * s, 160 * s, 12 * s, 6 * s), { fill: INK.navy, tone: .5 }); paint(rrPts(x + 10 * s, y + 15 * s, 80 * s, 36 * s, 12 * s), { fill: INK.green }); };
  const gear = (x, y, r, rot, col) => { const P = []; for (let i = 0; i < 48; i++) { const a = rot + i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? r : r * .8; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } paint(P, { fill: col }); paint(ellPts(x, y, r * .35, r * .35, 28), { fill: INK.paper }); };
  // long titles: print on two lines, split at the most even word break
  const split2 = s => { const w = s.toUpperCase().split(' '); let best = 1, bd = 1e9; for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < bd) { bd = d; best = i; } } return [w.slice(0, best).join(' '), w.slice(best).join(' ')]; };

  // ---------- A · the wipe: a resourceful agent routes around a single wall ----------
  function shotWipe(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('wipe');
    riso({ seed: 61 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tBlock = wt('wipe', 'blocked'), tUndo = wt('wipe', 'undo'), tGit = wt('wipe', 'git'), tCo = wt('wipe', 'checkout'), tAll = wt('wipe', 'allowed'), tHarm = wt('wipe', 'harmless'),
      tWipe = wt('wipe', 'wiped'), tEng = wt('wipe', 'engineer'), tMal = wt('wipe', 'malicious'), tRes = wt('wipe', 'resourceful');
    // the folder and its files (one with a gold star: the engineer's own work)
    const kf = stamp(t, b.start + .1, .4);
    if (kf > .01) { push(); translate(520, 600); scale(kf); paint(rrPts(-260, -120, 180, 60, 16), { fill: INK.brown }); paint(rrPts(-260, -90, 520, 330, 20), { fill: INK.brown }); pop(); }
    for (let i = 0; i < 6; i++) {
      const x0 = 330 + i * 76, y0 = 520 - 20 * Math.sin(i * 1.3), k = stamp(t, b.start + .3 + i * .06), star = i === 4;
      if (k <= .01) continue;
      const fl = t > tWipe - .1 ? easeIn(seg(t, tWipe - .1 + i * .06 + (star ? .9 : 0), tWipe + .7 + i * .06 + (star ? .9 : 0))) : 0;
      if (fl >= 1) continue;
      push(); translate(x0 + fl * (900 + 200 * hash(i)), y0 - fl * (700 + 200 * hash(i + 4))); rotate(fl * (4 + i)); scale(k);
      fileIcon(0, 0, 1.2, star ? INK.gold : INK.paper); if (star) paint(starPts(0, -80, 26, .45, 5), { fill: INK.orange });
      pop();
    }
    if (kf > .01) paint(rrPts(520 - 270, 600 + 10, 540, 230, 20), { fill: INK.gold, tone: .9 });
    // the wave that wipes the folder
    const wv = seg(t, tWipe - .25, tWipe + .6);
    if (wv > 0 && wv < 1) { const x = lerp(-500, 1400, ease(wv)); const P = [[x - 420, 900], [x - 420, 520]]; for (let i = 0; i <= 12; i++) { const a = i / 12; P.push([x - 420 + 420 * a, 520 - 160 * Math.sin(a * Math.PI * .9) + 60 * a]); } P.push([x + 30, 900]); paint(P, { fill: INK.navy, tone: .55, over: true, curv: .3 }); paint(ellPts(x - 40, 440, 60, 40, 20), { fill: INK.paper, tone: .8 }); }
    // the blocked delete: a trash can, stamped out
    const kt = stamp(t, tBlock - .3);
    if (kt > .01) { push(); translate(1500, 330); scale(kt); paint([[-80, -60], [80, -60], [64, 120], [-64, 120]], { fill: INK.navy }); paint(rrPts(-100, -90, 200, 30, 12), { fill: INK.navy }); for (let i = -1; i <= 1; i++) paint(rectPts(i * 40 - 6, -30, 12, 120), { fill: INK.paper, tone: .5 }); pop(); stampX(1500, 350, 130, stamp(t, tBlock + .1)); }
    // the allowed command: a git lever
    const kl = stamp(t, tGit - .3);
    if (kl > .01) {
      push(); translate(1450, 720); scale(kl);
      paint(rrPts(-140, -60, 280, 140, 20), { fill: INK.navy }); branch(-60, 10, .45, INK.gold, INK.gold);
      const th = t > tCo ? backOut(seg(t, tCo, tCo + .3)) : 0; push(); translate(70, -60); rotate(-.7 + 1.4 * th); paint(rrPts(-9, -130, 18, 130, 9), { fill: INK.dark }); paint(ellPts(0, -135, 26, 26, 18), { fill: INK.orange }); pop();
      pop();
      check(1560, 580, 1.2, stamp(t, tAll));
    }
    clawd(1050, 900, 17, { ...emotions(t, [[b.start, 'neutral'], [tBlock + .2, 'sad'], [tUndo, 'thinking'], [tCo, 'determined'], [tWipe, 'surprised'], [tMal, 'nervous'], [tRes, 'idea']]) });
    const kS = stamp(t, tEng - .3);
    if (kS > .01) skipper(160, 1040 + 300 * (1 - kS), 15, { ...SKIP_POSES.shrug, mood: 'surprised' });
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 1050, cy: 800 });
  }

  // ---------- B · the line: too loose is negligent, too tight is useless ----------
  function shotLine(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('line');
    riso({ seed: 62 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tNeg = wt('line', 'negligence'), tTight = wt('line', 'tight'), tUse = wt('line', 'useless'), tLine = wt('line', 'line');
    const CX = 820, CY = 820, R = 520, kg = ease(seg(t, b.start - .2, b.start + .6));
    // the gauge: reckless (orange) · the line (green) · locked (navy), in halftone bands
    arcLine(CX, CY, R, 110, INK.orange, { a0: Math.PI, a1: Math.PI + Math.PI * .36 * kg });
    if (kg > .36) arcLine(CX, CY, R, 110, INK.green, { a0: Math.PI * 1.36, a1: Math.PI * (1.36 + Math.min(.28, (kg - .36))) });
    if (kg > .64) arcLine(CX, CY, R, 110, INK.navy, { a0: Math.PI * 1.64, a1: Math.PI * (1.64 + (kg - .64)) });
    arcLine(CX, CY, R - 80, 30, INK.yellow, { a0: Math.PI, a1: TAU, over: true, tone: .6 });
    // the needle
    const a = kf(t, [[b.start, 1.5], [tNeg - .2, 1.5], [tNeg + .2, 1.1], [tTight, 1.1], [tUse, 1.9], [tLine - .5, 1.9], [tLine + .1, 1.5]], backOut) * Math.PI;
    paint(ribbon([[CX, CY], [CX + Math.cos(a) * (R - 60), CY + Math.sin(a) * (R - 60)]], 36, 8), { fill: INK.dark });
    paint(ellPts(CX, CY, 50, 50, 28), { fill: INK.dark });
    // burst at the reckless end
    if (t > tNeg && t < tNeg + .8) { const k = seg(t, tNeg, tNeg + .8), px = CX + Math.cos(Math.PI * 1.1) * R, py = CY + Math.sin(Math.PI * 1.1) * R; for (let i = 0; i < 10; i++) { const aa = i / 10 * TAU; paint(ribbon([[px + Math.cos(aa) * 80 * (1 + k), py + Math.sin(aa) * 80 * (1 + k)], [px + Math.cos(aa) * 170 * (1 + k), py + Math.sin(aa) * 170 * (1 + k)]], 18 * (1 - k)), { fill: INK.orange }); } }
    // Clawd: wild, then boxed in, then just right
    const boxed = ease(seg(t, tUse - .3, tUse)) * (1 - ease(seg(t, tLine - .4, tLine)));
    clawd(1620, 980, 17, { ...emotions(t, [[b.start, 'neutral'], [tNeg, 'excited'], [tUse - .1, 'bored'], [tLine, 'relieved']]) });
    if (boxed > .01) { paint(rrPts(1620 - 150, 980 - 250 * boxed - 20, 300, 250 * boxed + 30, 16), { fill: INK.navy, tone: .6, over: true }); for (let i = 0; i < 4; i++) paint(rectPts(1620 - 130 + i * 80, 980 - 240 * boxed, 14, 240 * boxed), { fill: INK.navy }); }
    if (t > tLine) paint(starPts(CX, CY - R - 90, 50 * stamp(t, tLine), .4, 5), { fill: INK.gold });
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 1050, cy: 800 });
    tOut('iris', lt, dur, { cx: 820, cy: 600 });
  }

  // ---------- C · the mixing board: one slider per kind of action ----------
  function shotBoard(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('board');
    riso({ seed: 63 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tMix = wt('board', 'mixing'), tSl = wt('board', 'slider'), W5 = ['reading', 'writing', 'shell', 'network', 'git'].map(w => wt('board', w)), tFree = wt('board', 'freely'),
      tMig = wt('board', 'migration'), tApp = wt('board', 'approval'), tDiff = wt('board', 'differ'), tTest = wt('board', 'test'), tSafe = wt('board', 'safe'), tInst = wt('board', 'installing'), tPrompt = wt('board', 'prompt');
    const kb = stamp(t, tMix - .3, .4);
    if (kb > .01) { push(); translate(740, 560); scale(kb); paint(rrPts(-600, -380, 1200, 760, 40), { fill: INK.navy }); paint(rrPts(-560, -340, 1120, 90, 20), { fill: INK.dark, tone: .7 }); pop(); }
    const X = i => 300 + i * 220, TOP = 380, BOT = 820;
    const icons = [
      (x, y) => fileIcon(x, y, .55),
      (x, y) => { fileIcon(x - 10, y, .55); paint(ribbon([[x - 20, y + 30], [x + 40, y - 40]], 14), { fill: INK.orange }); },
      (x, y) => terminal(x, y, 110, 80, 1),
      (x, y) => { paint(ellPts(x, y, 42, 42, 32), { fill: INK.green }); arcLine(x, y, 42, 6, INK.paper); paint(rectPts(x - 42, y - 3, 84, 6), { fill: INK.paper }); paint(ellPts(x, y, 16, 42, 20), { fill: INK.green, ink: INK.paper, sw: 1 }); },
      (x, y) => branch(x + 5, y, .5, INK.paper, INK.gold),
    ];
    const split = ease(seg(t, tDiff - .2, tDiff + .3));
    for (let i = 0; i < 5; i++) {
      const k = stamp(t, W5[i] - .2); if (k <= .01) continue;
      const x = X(i);
      push(); translate(x, 262); scale(k * 1.35); icons[i](0, 0); pop();
      // the level each slider sits at
      let lv = .2;
      if (i === 0) lv = lerp(.2, .95, backOut(seg(t, tFree - .1, tFree + .3)));
      if (i === 1 || i === 3) lv = .35;
      if (i === 4) lv = .45;
      const lvY = v => lerp(BOT, TOP, v);
      if (i === 2 && split > 0) {
        for (const s of [-1, 1]) { const xx = x + s * 50 * split; paint(rrPts(xx - 10, TOP, 20, BOT - TOP, 10), { fill: INK.dark }); const v = s < 0 ? lerp(.2, .9, backOut(seg(t, tSafe - .2, tSafe + .2))) : lerp(.2, .5, backOut(seg(t, tInst, tInst + .3))); paint(rrPts(xx - 44, lvY(v) - 24, 88, 48, 12), { fill: INK.gold }); }
      } else {
        paint(rrPts(x - 10, TOP, 20, (BOT - TOP) * k, 10), { fill: INK.dark });
        paint(rrPts(x - 60, lvY(lv) - 26, 120, 52, 14), { fill: INK.gold });
        paint(rectPts(x - 50, lvY(lv) - 3, 100, 6), { fill: INK.navy });
      }
    }
    // the shell split: the tests are safe, an install deserves a prompt
    if (t > tSafe - .1) check(X(2) - 50, 330, 1, stamp(t, tSafe));
    if (t > tPrompt - .3) { push(); translate(X(2) + 140, 520); scale(stamp(t, tPrompt - .3)); bubble(0, 0, 150, 90, INK.paper); type('?', 0, 2, 70, INK.orange); pop(); }
    // a migration needs explicit approval
    const km = stamp(t, tMig - .3);
    if (km > .01) {
      push(); translate(1620, 400); scale(km);
      for (let i = 2; i >= 0; i--) { paint(rectPts(-110, -60 + i * 70, 220, 70), { fill: INK.green }); paint(ellPts(0, -60 + i * 70 + 70, 110, 30, 32), { fill: INK.green, tone: .7, over: true }); }
      paint(ellPts(0, -60, 110, 30, 32), { fill: INK.green, tone: .6 });
      padlock(0, 60, .9, t > tApp ? INK.gold : INK.orange);
      pop();
      check(1720, 260, 1.2, stamp(t, tApp + .2));
    }
    const kS = stamp(t, tMig);
    if (kS > .01) skipper(1640, 1040 + 300 * (1 - kS), 13, skipAct(t, [[tMig, 'stand', { mood: 'focused', flip: true }], [tApp, 'pointUp', { mood: 'grin', flip: true }], [tTest, 'present', { mood: 'happy', flip: true }]]));
    camEnd();
    tIn('iris', lt, { cx: 820, cy: 600 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- D · the ratchet: trust grows on evidence; main stays denied ----------
  function shotRatchet(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('ratchet');
    riso({ seed: 64 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 980, W + 400, 400), { fill: 'yellow', tone: .45 });
    const tDay = wt('ratchet', 'day'), tWatch = wt('ratchet', 'watch'), tWeek = wt('ratchet', 'week'), tMonth = wt('ratchet', 'month'), tCom = wt('ratchet', 'commits'), tAllow = wt('ratchet', 'allow'),
      tLog = wt('ratchet', 'log'), tMain = wt('ratchet', 'main'), tDen = wt('ratchet', 'denied'), tInv = wt('ratchet', 'invisible'), tRig = wt('ratchet', 'rigid');
    const steps = [tDay, tWeek, tMonth];
    // the ratchet wheel: one tooth per step, a pawl that clicks
    const rot = steps.reduce((s, ts) => s + TAU / 16 * backOut(seg(t, ts - .1, ts + .2)), 0);
    gear(300, 520, 190, rot, INK.navy);
    paint(ellPts(300, 520, 40, 40, 20), { fill: INK.gold });
    paint(ribbon([[520, 290], [420, 360]], 34, 14), { fill: INK.orange });
    // three steps
    const panel = (i, fn) => { const k = stamp(t, steps[i] - .2); if (k <= .01) return; push(); translate(760 + i * 360, 250); scale(k); paint(rrPts(-150, -110, 300, 220, 22), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); pop(); };
    panel(0, () => { paint(ellPts(0, 0, 100, 56, 36), { fill: INK.navy, tone: .25 }); paint(ellPts(0, 0, 44, 44, 28), { fill: INK.navy }); paint(ellPts(14, -14, 12, 12, 12), { fill: INK.paper }); if (t > tWatch) paint(rrPts(-60, 70, 120, 14, 7), { fill: INK.orange }); });
    panel(1, () => { terminal(-30, 0, 170, 130, 3); check(70, 20, 1, stamp(t, tWeek + .5)); });
    panel(2, () => branch(0, 0, .9, INK.navy, t > tCom ? INK.green : INK.orange));
    // the allowlist grows into a log of trust decisions
    const ka = stamp(t, tAllow - .2);
    if (ka > .01) {
      push(); translate(1120, 520); scale(ka);
      paint(rrPts(-420, -110, 840, 230, 18), { fill: INK.paper, ink: INK.navy, sw: 1.1 });
      const n = Math.floor(8 * seg(t, tAllow, tLog + .8));
      for (let i = 0; i < n; i++) { const c = i % 4, r = Math.floor(i / 4); paint(rrPts(-390 + c * 200, -80 + r * 100, 170, 60, 12), { fill: INK.green, tone: .85 }); check(-390 + c * 200 + 130, -50 + r * 100, .4, 1, INK.paper); }
      pop();
    }
    // Clawd trots through the invisible fence, then hits the rigid wall in front of main
    const walk = seg(t, tInv - .6, tRig), wx = lerp(560, 1300, walk), bump = t > tRig ? take(t, tRig + .05, 1) : { sq: 0, dy: 0 };
    for (let i = 0; i < 6; i++) paint(rectPts(880, 780 + i * 34, 14, 18), { fill: INK.navy, tone: .35 });
    const kw = stamp(t, tMain - .2, .3);
    if (kw > .01) { const h = 300 * kw; paint(rrPts(1420, 980 - h, 90, h, 10), { fill: INK.brown }); for (let i = 0; i < 4; i++) paint(rectPts(1420, 980 - h + i * 90, 90, 8), { fill: INK.dark }); padlock(1465, 980 - h + 140, 1, INK.gold); }
    if (kw > .01) { branch(1720, 820, 1, INK.navy, INK.gold); stampX(1465, 700, 70, stamp(t, tDen)); }
    clawd(wx, 980, 14, { ...emotions(t, [[b.start, 'neutral'], [tInv, 'happy'], [tRig + .05, 'dizzy']]), ...(walk > 0 && walk < 1 ? move('walk', T, 1) : {}), flip: false, sq: bump.sq, dx: t > tRig ? -1.2 * ease(seg(t, tRig, tRig + .3)) : 0 });
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- E · plan mode and hooks: advice, policy, law ----------
  function shotHooks(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('hooks');
    riso({ seed: 65 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tPlan = wt('hooks', 'plan'), tRead = wt('hooks', 'read'), tNoth = wt('hooks', 'nothing'), tApp = wt('hooks', 'approve'), tNever = wt('hooks', 'never'), tHook = wt('hooks', 'hooks'),
      tBefore = wt('hooks', 'before'), tDone = wt('hooks', 'done'), tArg = wt('hooks', 'argue'), tIns = wt('hooks', 'instructions'), tAdv = wt('hooks', 'advice'), tPol = wt('hooks', 'policy'), tLaw = wt('hooks', 'law');
    const g1 = 1 - ease(seg(t, tNever - .3, tNever)), g2 = ease(seg(t, tNever - .1, tNever + .2)) * (1 - ease(seg(t, tIns - .4, tIns))), g3 = ease(seg(t, tIns - .2, tIns + .2));
    // plan mode: a blueprint to read; a pencil it may not use; the Skipper's approval stamp
    if (g1 > .01) {
      push(); translate(760, 480); scale(stamp(t, tPlan - .3) * g1);
      paint(rrPts(-340, -240, 680, 480, 24), { fill: INK.navy });
      for (let i = 1; i < 8; i++) paint(rectPts(-340 + i * 85, -240, 3, 480), { fill: INK.paper, tone: .25 });
      for (let i = 1; i < 6; i++) paint(rectPts(-340, -240 + i * 80, 680, 3), { fill: INK.paper, tone: .25 });
      paint(rrPts(-240, -140, 200, 120, 10), { fill: INK.paper, tone: .8 }); paint(rrPts(40, -60, 220, 200, 10), { fill: INK.paper, tone: .6 }); inkLine([[-40, -80], [40, 0]], 1.4, INK.paper, 'ink', 0, { force: true });
      pop();
      if (t > tNoth - .3) { push(); translate(1330, 380); rotate(.6); scale(stamp(t, tNoth - .3) * g1); paint(rrPts(-20, -110, 40, 200, 8), { fill: INK.orange }); paint([[-20, 90], [20, 90], [0, 130]], { fill: INK.gold }); pop(); stampX(1330, 380, 90 * g1, stamp(t, tNoth)); }
      if (t > tApp - .1) { push(); translate(760, 480); rotate(-.15); scale(stamp(t, tApp) * g1); arcLine(0, 0, 150, 26, INK.green, { over: true }); check(0, 0, 2.2, 1); pop(); }
      clawd(1300, 960, 16, { ...emotions(t, [[b.start, 'neutral'], [tRead, 'thinking'], [tApp + .2, 'happy']]), flip: true });
      const kS = stamp(t, tApp - .5);
      if (kS > .01) skipper(260, 1000 + 300 * (1 - kS) * 1 + 300 * (1 - g1), 16, skipAct(t, [[tApp - .5, 'stand', { mood: 'focused' }], [tApp, 'point', { mood: 'grin' }]]));
    }
    // hooks: a gate the tool runs every time; the model can't argue with it
    if (g2 > .01) {
      const hk = easeOut(seg(t, tHook - .4, tHook));
      push(); translate(960, lerp(-200, 180, hk)); scale(g2); inkLine([[0, -300], [0, 0]], 3, INK.dark, 'ink', 0, { force: true }); arcLine(0, 50, 50, 22, INK.gold, { a0: -Math.PI / 2, a1: Math.PI * .95 }); paint(rrPts(-11, -10, 22, 70, 10), { fill: INK.gold }); pop();
      const kg = stamp(t, tHook - .1) * g2;
      if (kg > .01) {
        push(); translate(960, 620); scale(kg);
        paint(rrPts(-190, -300, 80, 640, 20), { fill: INK.navy }); paint(rrPts(110, -300, 80, 640, 20), { fill: INK.navy }); paint(rrPts(-190, -340, 380, 70, 20), { fill: INK.navy });
        const scan = frac(t * 1.2); paint(rectPts(-110, -270 + 560 * scan, 220, 10), { fill: INK.orange, over: true });
        pop();
      }
      const cardAt = (t0, col, ok) => { if (t < t0 - .6) return; const f = seg(t, t0 - .6, t0 + .6), x = lerp(420, ok ? 1500 : 960, ease(f)); push(); translate(x, 640); scale(g2); popup(0, 0, .9, col); pop(); if (ok && g2 > .5) check(x + 60, 560, g2, stamp(t, t0 + .5)); };
      cardAt(tBefore, INK.paper, true); cardAt(tDone, INK.gold, true);
      const push2 = t > tArg - .3 ? Math.max(0, Math.sin((t - tArg + .3) * 9)) * (1 - seg(t, tArg, tArg + .8)) : 0;
      clawd(640 + 110 * push2, 960, 15, { ...emotions(t, [[tNever, 'determined'], [tArg - .2, 'angry'], [tArg + .6, 'dizzy']]), sq: -.1 * push2, dy: 20 * (1 - g2) });
    }
    // advice · policy · law
    if (g3 > .01) {
      type('ADVICE', 960, 250, 90, INK.navy, { pop: seg(t, tAdv - .15, tAdv + .2), tone: .55 });
      type('POLICY', 960, 450, 120, INK.navy, { pop: seg(t, tPol - .15, tPol + .2) });
      type('LAW', 940, 700, 220, INK.orange, { pop: seg(t, tLaw - .15, tLaw + .2) });
      type('LAW', 952, 712, 220, INK.navy, { pop: seg(t, tLaw - .1, tLaw + .25), over: true, tone: .5 });
      if (t > tLaw) for (let i = 0; i < 12; i++) { const k = seg(t, tLaw + .05, tLaw + .7), a = i / 12 * TAU; paint(ribbon([[940 + Math.cos(a) * 260 * (1 + k), 700 + Math.sin(a) * 140 * (1 + k)], [940 + Math.cos(a) * 330 * (1 + k), 700 + Math.sin(a) * 180 * (1 + k)]], 16 * (1 - k)), { fill: INK.orange }); }
      clawd(1650, 960, 14, { ...feel('surprised', T), flip: true });
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 620 });
  }

  // ---------- F · bypass modes: only in a throwaway container ----------
  function shotBypass(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('bypass');
    riso({ seed: 66 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tSkip = wt('bypass', 'skip'), tCont = wt('bypass', 'container'), tSup = wt('bypass', 'supply'), tPack = wt('bypass', 'packages'), tAg = wt('bypass', 'agents'), tMach = wt('bypass', 'machines'),
      tSw = wt('bypass', 'switched'), tSec = wt('bypass', 'secrets');
    const g1 = 1 - ease(seg(t, tSup - .5, tSup - .1)), g2 = ease(seg(t, tSup - .3, tSup + .1));
    if (g1 > .01) {
      paint(rectPts(-200, 900, W + 400, 400), { fill: 'yellow', tone: .35 });
      // the container closes around a skip-all switch; inside, it's safe to play
      const kc = stamp(t, tCont - .3, .4) * g1;
      if (kc > .01) { push(); translate(960, 640); scale(kc); paint(rrPts(-560, -300, 1120, 560, 16), { fill: INK.orange }); for (let i = 0; i < 14; i++) paint(rectPts(-520 + i * 76, -270, 20, 500), { fill: INK.orange, tone: .6, over: true }); paint(rrPts(-500, -240, 1000, 440, 12), { fill: INK.paper, tone: .9 }); pop(); }
      push(); translate(960, 500); scale(stamp(t, tSkip - .3) * g1); toggle(0, 0, 2.2, t < tSkip + .1); pop();
      clawd(960, 850, 15, { ...feel(t > tCont ? 'happy' : 'neutral', T), ...(t > tCont ? move('hop', T, 2) : {}) });
    }
    if (g2 > .01) {
      paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
      // a laptop: the developer's machine, with the agent on it and its guardrail switch
      push(); translate(1100, 560); scale(g2);
      paint(rrPts(-380, -300, 760, 460, 24), { fill: INK.navy }); paint(rrPts(-340, -260, 680, 380, 12), { fill: 'yellow', tone: .25 });
      paint([[-460, 170], [460, 170], [520, 240], [-520, 240]], { fill: INK.navy, tone: .75 });
      pop();
      clawd(1000, 660, 12 * g2, { ...emotions(t, [[tSup, 'neutral'], [tSw, 'scared']]) });
      push(); translate(1300, 420); scale(g2); toggle(0, 0, 1, t < tSw + .1); pop();
      // the malicious package creeps in
      const kp = stamp(t, tPack - .3);
      if (kp > .01) {
        const px = lerp(-150, 420, easeOut(seg(t, tPack - .3, tPack + .4))) + 120 * ease(seg(t, tMach - .3, tMach + .6)), py = 820;
        push(); translate(px, py); scale(kp); paint([[-120, -110], [120, -110], [150, 110], [-150, 110]], { fill: INK.dark }); paint(rectPts(-120, -40, 240, 20), { fill: INK.brown }); for (const s of [-1, 1]) { glow(s * 50, -60, 50, 'yellow', .8); paint(ellPts(s * 50, -60, 16, 10, 12), { fill: INK.yellow }); } pop();
        // it reaches for the switch
        const reach = ease(seg(t, tSw - .6, tSw)) * (1 - ease(seg(t, tSw + .6, tSw + 1)));
        if (reach > 0) inkLine(through([[px + 120, py - 60], [lerp(px + 120, 1100, reach), lerp(py - 60, 520, reach) - 120 * reach], [lerp(px + 120, 1260, reach), lerp(py - 60, 420, reach)]]), 3, INK.dark, 'ink', .5, { force: true });
        // secrets float out: keys
        if (t > tSec - .3) for (let i = 0; i < 3; i++) { const f = ease(seg(t, tSec - .3 + i * .15, tSec + .8 + i * .15)), kx = lerp(1000 + i * 120, px + 20 * i, f), ky = lerp(560, py - 170 - 40 * i, f) - 120 * Math.sin(f * Math.PI); push(); translate(kx, ky); rotate(f * 2); arcLine(0, 0, 26, 12, INK.gold); paint(rrPts(20, -7, 70, 14, 6), { fill: INK.gold }); paint(rectPts(70, 0, 10, 22), { fill: INK.gold }); pop(); }
      }
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 620 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- G · defense in depth: every layer catches something ----------
  function shotDepth(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('depth');
    riso({ seed: 67 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.brown, tone: .55 });
    const tWall = wt('depth', 'wall'), tDef = wt('depth', 'defense'), L = ['allow', 'hooks', 'sandbox', 'commit', 'review'].map(w => wt('depth', w)), tFlag = wt('depth', 'flag');
    // one wall: a ball simply goes around it
    const g1 = 1 - ease(seg(t, tDef - .3, tDef));
    if (g1 > .01) {
      const kw = stamp(t, b.start + .1) * g1; paint(rrPts(900, 900 - 360 * kw, 90, 360 * kw, 10), { fill: INK.navy });
      const f = seg(t, tWall - .4, tWall + .9), p = arcPt([200, 860], [1700, 860], 560, ease(f));
      if (f > 0) paint(ellPts(p[0], p[1], 40 * g1, 40 * g1, 24), { fill: INK.orange });
    }
    // five layers, each catching one
    const X = i => 380 + i * 290;
    const icon = [
      (x, y) => { paint(rrPts(x - 55, y - 60, 110, 120, 10), { fill: INK.paper }); for (let j = 0; j < 3; j++) paint(rrPts(x - 40, y - 40 + j * 34, 80, 14, 7), { fill: INK.green }); },
      (x, y) => { arcLine(x, y + 20, 32, 16, INK.gold, { a0: -Math.PI / 2, a1: Math.PI * .95 }); paint(rrPts(x - 8, y - 50, 16, 70, 8), { fill: INK.gold }); },
      (x, y) => { paint(rrPts(x - 60, y - 20, 120, 60, 8), { fill: INK.brown }); paint(rectPts(x - 50, y - 20, 100, 24), { fill: INK.yellow }); },
      (x, y) => { inkLine([[x - 60, y], [x + 60, y]], 2, INK.paper, 'ink', 0, { force: true }); for (let j = 0; j < 3; j++) paint(ellPts(x - 50 + j * 50, y, 16, 16, 14), { fill: INK.gold }); },
      (x, y) => { arcLine(x - 10, y - 10, 30, 10, INK.paper); paint(ribbon([[x + 12, y + 12], [x + 50, y + 50]], 16), { fill: INK.paper }); },
    ];
    if (t > tDef - .2) for (let i = 0; i < 5; i++) {
      const k = stamp(t, L[i] - .3); if (k <= .01) continue;
      const x = X(i);
      push(); translate(x, 900); scale(1, k); paint(rrPts(-50, -520, 100, 520, 16), { fill: INK.navy, tone: .78, over: true }); pop();
      push(); translate(x, 300); scale(k); paint(ellPts(0, 0, 80, 80, 36), { fill: INK.navy }); icon[i](0, 0); pop();
      // the ball this layer catches: it rolls in from the left and stops against the layer
      const f = ease(seg(t, L[i] - .6, L[i] + .1)), bx = lerp(-100, x - 95, f);
      if (f > 0) { paint(ellPts(bx, 860 - 20 * Math.abs(Math.sin(f * 9)) * (1 - f), 38, 38, 24), { fill: INK.orange }); check(bx, 760, .9, stamp(t, L[i] + .2)); }
    }
    const kS = stamp(t, L[4] - .4);
    if (kS > .01) skipper(1760, 1040 + 300 * (1 - kS), 14, skipAct(t, [[L[4] - .4, 'stand', { mood: 'focused', flip: true }], [tFlag - .2, 'point', { mood: 'grin', flip: true }]]));
    if (t > tFlag - .2) { const k = stamp(t, tFlag - .2); inkLine([[X(4) - 95, 820], [X(4) - 95, 820 - 170 * k]], 1.3, INK.dark, 'ink', 0, { force: true }); paint([[X(4) - 95, 650 + 170 * (1 - k)], [X(4) - 5, 680 + 170 * (1 - k)], [X(4) - 95, 710 + 170 * (1 - k)]], { fill: INK.orange }); }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- H · approval fatigue ----------
  function shotFatigue(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('fatigue');
    riso({ seed: 68 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 980, W + 400, 400), { fill: 'yellow', tone: .45 });
    const tGate = wt('fatigue', 'gates'), tClick = wt('fatigue', 'click'), t40 = wt('fatigue', '40'), tRead = wt('fatigue', 'reading'), tSafe = wt('fatigue', 'safe'), tNoth = wt('fatigue', 'nothing'),
      tFive = wt('fatigue', 'five'), tAllow = wt('fatigue', 'allow');
    const g1 = 1 - ease(seg(t, tSafe - .5, tSafe - .1));
    // pop-ups pile up; a counter races to forty
    if (g1 > .01) {
      const n = Math.floor(14 * seg(t, tGate - .2, t40 + .8));
      for (let i = 0; i < n; i++) popup(900 + 460 * hash(i + 1), 280 + 460 * hash(i + 20), 1.1 * g1);
      const c = Math.round(40 * ease(seg(t, tClick, t40 + .3)));
      if (c > 0) { type(String(c), 1700, 180, 130, INK.orange, { alpha: g1 }); type(String(c), 1710, 190, 130, INK.navy, { over: true, tone: .45, alpha: g1 }); }
    }
    // a guardrail that feels safe and protects nothing: a hollow shield
    if (t > tSafe - .3 && t < tFive - .1) { const k = stamp(t, tSafe - .3) * (1 - ease(seg(t, tFive - .4, tFive - .1))); push(); translate(1200, 500); scale(k); const S = [[-170, -160], [0, -220], [170, -160], [150, 70], [0, 220], [-150, 70]]; inkLine([...S, S[0], S[1]], 6, INK.navy, 'ink', .35, { force: true }); pop(); stampX(1200, 500, 150 * k, stamp(t, tNoth)); }
    // five of the same fold into one allowlist entry
    if (t > tFive - .3) {
      const fold = ease(seg(t, tAllow - .5, tAllow));
      for (let i = 0; i < 5; i++) { const k = stamp(t, tFive - .3 + i * .1); if (k <= .01 || fold >= 1) continue; popup(lerp(820 + i * 230, 1280, fold), 480, .9 * k * (1 - .6 * fold)); }
      if (fold > .8) { const k = stamp(t, tAllow - .1); paint(rrPts(1280 - 300 * k, 440, 600 * k, 80, 20), { fill: INK.green }); check(1280 + 220, 480, .7 * k, 1, INK.paper); paint(rrPts(1280 - 250 * k, 468, 380 * k, 24, 12), { fill: INK.paper, tone: .8 }); }
    }
    skipper(420, 1040, 18, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tClick, 'type', { mood: 'focused', t }], [tRead - .2, 'type', { mood: 'sleepy', t }], [tSafe, 'shrug', { mood: 'worried' }], [tFive, 'present', { mood: 'grin' }], [tAllow, 'hips', { mood: 'happy' }]]));
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 760 });
  }

  // ---------- I · the sandbox: the freedom to be wrong ----------
  function shotSandbox(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('sandbox');
    riso({ seed: 69 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tBox = wt('sandbox', 'sandbox'), tWrong = wt('sandbox', 'wrong'), tWork = wt('sandbox', 'work'), tCont = wt('sandbox', 'container'), tCloud = wt('sandbox', 'cloud'), tThrow = wt('sandbox', 'throw'),
      tCheap = wt('sandbox', 'cheap'), tFree = wt('sandbox', 'free'), tGit = wt('sandbox', 'git');
    // the box: tips away on "throw", and a fresh one drops in
    const tip = easeIn(seg(t, tThrow - .1, tThrow + .5)), fresh = t > tThrow + .3 ? backOut(seg(t, tThrow + .3, tThrow + .7)) : 0;
    const box = (dx, dy, rot, withTower) => {
      push(); translate(960 + dx, 900 + dy); rotate(rot);
      paint(rrPts(-520, -180, 1040, 200, 20), { fill: INK.brown });
      paint(rrPts(-490, -160, 980, 150, 14), { fill: INK.yellow });
      for (let i = 0; i < 40; i++) paint(ellPts(-470 + 940 * hash(i + 3), -140 + 120 * hash(i + 60), 6, 6, 8), { fill: INK.navy, tone: .4, over: true });
      if (withTower) {
        // a tower of blocks; it falls on "wrong"
        for (let i = 0; i < 6; i++) { const fall = ease(seg(t, tWrong - .3 + i * .05, tWrong + .3 + i * .05)), bx = 220 + fall * (60 + 50 * i) , by = -200 - i * 80 + fall * (i * 80 + 20); push(); translate(bx, by); rotate(fall * (1 + i * .4)); paint(rrPts(-60, -40, 120, 80, 8), { fill: [INK.orange, INK.navy, INK.gold, INK.green][i % 4], over: i % 2 === 1 }); pop(); }
      }
      pop();
    };
    const kb = stamp(t, tBox - .4, .4);
    if (tip < 1 && kb > .01) {
      push(); translate(960, 900); scale(kb); translate(-960, -900);
      box(1400 * tip, -200 * Math.sin(tip * Math.PI), .9 * tip, true);
      pop();
      clawd(700 + 1400 * tip, 740 - 200 * Math.sin(tip * Math.PI), 16, { ...emotions(t, [[b.start, 'happy'], [tWrong, 'surprised'], [tWrong + .6, 'laugh']]), rot: .9 * tip });
    }
    if (fresh > 0) { box(0, -1200 * (1 - fresh), 0, false); clawd(700, 740 - 1200 * (1 - fresh), 16, { ...feel(t > tFree ? 'excited' : 'happy', T) }); }
    // worktree, container, cloud
    const g = 1 - ease(seg(t, tGit - .5, tGit - .1));
    const cards = [[tWork, 520, (x, y) => branch(x, y, .8, INK.navy, INK.gold)], [tCont, 960, (x, y) => { paint(rrPts(x - 90, y - 60, 180, 120, 8), { fill: INK.orange }); for (let i = 0; i < 5; i++) paint(rectPts(x - 76 + i * 34, y - 50, 10, 100), { fill: INK.orange, tone: .6, over: true }); }],
      [tCloud, 1400, (x, y) => { for (const [dx, dy, r] of [[-50, 10, 50], [10, -20, 64], [70, 10, 46]]) paint(ellPts(x + dx, y + dy, r, r * .8, 24), { fill: INK.navy }); paint(rrPts(x - 100, y + 10, 220, 50, 25), { fill: INK.navy }); }]];
    cards.forEach(([t0, x, fn]) => { const k = stamp(t, t0 - .2) * g; if (k <= .01) return; push(); translate(x, 260); scale(k); paint(rrPts(-150, -130, 300, 260, 24), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(0, 0); pop(); });
    if (t > tFree - .2) for (let i = 0; i < 6; i++) { const k = stamp(t, tFree - .2 + i * .06); paint(starPts(300 + i * 270, 560 + 60 * Math.sin(i * 2), 36 * k, .35, 4), { fill: INK.gold }); }
    if (t > tGit - .3) { const k = stamp(t, tGit - .3, .4); glow(960, 290, 300 * k, 'yellow', .9); push(); translate(960, 290); scale(k * 1.4); branch(0, 0, 1.2, INK.navy, INK.orange); pop(); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 760 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) {
    const long = TIMING.title.length > 16;
    ident(T0, lt, dur, TIMING.chapter, long ? '' : TIMING.title);
    if (long) {   // too long for ident's title line: two smaller lines, same timing and camera
      const t = onTwos(lt), [a, c] = split2(TIMING.title);
      camBegin(960, 540, 1 + .03 * ease(seg(t, 0, dur)));
      type(a, 1340, 675, 58, INK.navy, { pop: seg(t, 1.9, 2.3) });
      type(c, 1340, 750, 58, INK.navy, { pop: seg(t, 2.0, 2.4) });
      camEnd();
    }
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }
  function shotEnd(T0, lt, dur) {
    const long = TIMING.next.length > 16;
    endCard(T0, lt, dur, '05', long ? '' : TIMING.next);
    if (long) {   // too long for endCard's title line: two smaller lines
      const t = onTwos(lt), [a, c] = split2(TIMING.next);
      camBegin(960, 540, 1.04 - .04 * ease(seg(t, 0, dur)));
      type(a, 960, 556, 70, INK.navy, { pop: seg(t, .8, 1.2) });
      type(c, 960, 636, 70, INK.navy, { pop: seg(t, .9, 1.3) });
      camEnd();
    }
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotWipeIn(T0, lt, dur) { shotWipe(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('wipe', 0), shotWipeIn],
    [shotAt('line'), shotLine],
    [shotAt('board'), shotBoard],
    [shotAt('ratchet'), shotRatchet],
    [shotAt('hooks'), shotHooks],
    [shotAt('bypass'), shotBypass],
    [shotAt('depth'), shotDepth],
    [shotAt('fatigue'), shotFatigue],
    [shotAt('sandbox'), shotSandbox],
    [B.sandbox.end + .9, shotEnd],
  ]);
})();
