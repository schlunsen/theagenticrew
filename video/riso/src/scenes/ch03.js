// ch03.js: Chapter 3 · Context. Storyboard: video/storyboards/ch03.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const bubble = (x, y, w, h, col = INK.paper, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); paint([[x - w * .25, y + h / 2 - 4], [x - w * .32, y + h / 2 + 34], [x - w * .08, y + h / 2 - 4]], { fill: col }); if (o.dots) for (let i = 0; i < o.dots; i++) paint(ellPts(x - (o.dots - 1) * 15 + i * 30, y, 9, 9, 12), { fill: INK.orange }); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  // the motif: the model's window, a navy frame with a title bar
  const win = (x, y, w, h, k = 1, o = {}) => { if (k <= .01) return; push(); translate(x, y); scale(k); paint(rrPts(-w / 2, -h / 2, w, h, 26), { fill: o.glass || INK.navy, tone: o.tone ?? .12 }); paint(rrPts(-w / 2, -h / 2, w, 44, 20), { fill: o.bar || INK.navy }); for (let i = 0; i < 3; i++) paint(ellPts(-w / 2 + 30 + i * 26, -h / 2 + 22, 8, 8, 12), { fill: [INK.orange, INK.yellow, INK.green][i] }); inkLine([[-w / 2, -h / 2 + 30], [-w / 2, h / 2 - 26], [-w / 2 + 26, h / 2], [w / 2 - 26, h / 2], [w / 2, h / 2 - 26], [w / 2, -h / 2 + 30]], 1.3, INK.navy, 'ink', .4, { force: true }); pop(); };
  const trace = (x, y, s, col = INK.paper) => { paint(rrPts(x - 90 * s, y - 60 * s, 180 * s, 120 * s, 12 * s), { fill: col, ink: INK.navy, sw: 1 * s }); for (let i = 0; i < 4; i++) paint(rrPts(x - 70 * s + (i % 2) * 20 * s, y - 40 * s + i * 24 * s, (i === 2 ? 130 : 90) * s, 10 * s, 5 * s), { fill: i === 2 ? INK.orange : INK.navy, tone: i === 2 ? 1 : .6 }); };
  const book = (x, y, s) => { paint(rrPts(x - 70 * s, y - 55 * s, 140 * s, 110 * s, 10 * s), { fill: INK.green }); paint(rectPts(x - 4 * s, y - 55 * s, 8 * s, 110 * s), { fill: INK.navy }); for (let i = 0; i < 3; i++) paint(rectPts(x + 14 * s, y - 30 * s + i * 22 * s, 40 * s, 6 * s), { fill: INK.paper }); };
  const accent = (x, y, s = 1, col = INK.orange) => paint(ribbon([[x - 8 * s, y + 10 * s], [x + 10 * s, y - 12 * s]], 9 * s, 5 * s), { fill: col });
  const compass = (x, y, r, rot) => { paint(ellPts(x, y, r, r, 36), { fill: INK.gold }); paint(ellPts(x, y, r * .8, r * .8, 36), { fill: INK.paper }); push(); translate(x, y); rotate(rot); paint([[0, -r * .7], [r * .16, 0], [0, r * .7], [-r * .16, 0]], { fill: INK.navy }); paint([[0, -r * .7], [r * .16, 0], [-r * .16, 0]], { fill: INK.orange }); pop(); };
  const fence = (x, y, s, k) => { for (let i = 0; i < 5; i++) { const kk = stamp(k, i * .08); if (kk <= .01) continue; paint([[x - 100 * s + i * 50 * s - 12 * s, y], [x - 100 * s + i * 50 * s + 12 * s, y], [x - 100 * s + i * 50 * s + 12 * s, y - 90 * s * kk], [x - 100 * s + i * 50 * s, y - 104 * s * kk], [x - 100 * s + i * 50 * s - 12 * s, y - 90 * s * kk]], { fill: INK.brown }); } if (k > .3) { paint(rectPts(x - 115 * s, y - 70 * s, 230 * s, 12 * s), { fill: INK.brown }); paint(rectPts(x - 115 * s, y - 34 * s, 230 * s, 12 * s), { fill: INK.brown }); } };

  // ---------- A · the bug: same bug, two briefings ----------
  function shotBug(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('bug');
    riso({ seed: 51 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tBug = wt('bug', 'payments'), tAcc = wt('bug', 'accented'), tPay = wt('bug', 'pay', 1), tEng = wt('bug', 'engineer'), tTell = wt('bug', 'tells'), tPatch = wt('bug', 'patch'),
      tStrip = wt('bug', 'strips'), tWorse = wt('bug', 'worse'), tSec = wt('bug', 'second'), tLog = wt('bug', 'error'), tTrace = wt('bug', 'trace'), tDocs = wt('bug', 'docs'),
      tThree = wt('bug', 'three'), tFour = wt('bug', 'four');
    const reset = t > tSec - .2;
    // the address card, with accents over its letters
    const ka = stamp(t, tBug - .1);
    if (ka > .01) {
      push(); translate(640, 260); scale(ka);
      paint(rrPts(-300, -110, 600, 220, 24), { fill: INK.paper, ink: INK.navy, sw: 1.3 });
      const W3 = [[150, 110, 70], [90, 160], [120, 80, 100]];
      W3.forEach((row, r) => { let x = -250; row.forEach((w, i) => { paint(rrPts(x, -50 + r * 50, w, 22, 11), { fill: INK.navy, tone: .75 }); if ((r + i) % 2 === 0) { const off = !reset && t > tStrip ? easeIn(seg(t, tStrip + i * .05 + r * .08, tStrip + .6 + r * .08)) : 0; if (off < 1 && t > tAcc - .1) { push(); translate(x + w * .6, -64 + r * 50 - 260 * off); rotate(off * 5); accent(0, 0, 1.2 * stamp(t, tAcc - .1 + r * .08)); pop(); } } x += w + 26; }); });
      pop();
    }
    // the payment card: fails, then passes
    const kp = stamp(t, tPay - .3);
    if (kp > .01) {
      push(); translate(1300, 260); scale(kp);
      paint(rrPts(-170, -105, 340, 210, 22), { fill: INK.gold }); paint(rectPts(-170, -60, 340, 36), { fill: INK.navy }); paint(rrPts(-130, 20, 70, 50, 8), { fill: INK.yellow, ink: INK.brown, sw: .8 });
      pop();
      if (!reset) stampX(1300, 260, 100, stamp(t, tPay));
      check(1300, 260, 2, stamp(t, tFour + .4));
    }
    // the engineer and the agent
    const kS = stamp(t, tEng - .3);
    if (kS > .01) skipper(260, 1040 + 300 * (1 - kS), 16, skipAct(t, [[tEng - .3, 'present', { mood: 'neutral', flip: false }], [tWorse, 'facepalm', { mood: 'worried' }], [tSec - .1, 'present', { mood: 'focused' }], [tFour, 'hips', { mood: 'happy' }]]));
    clawd(1000, 900, 17, { ...emotions(t, [[b.start, 'neutral'], [tTell + .3, 'confused'], [tPatch, 'determined'], [tWorse, 'nervous'], [tSec, 'neutral'], [tTrace, 'thinking'], [tFour, 'happy']]) });
    // the vague brief: a small bubble with one dot
    if (t > tTell - .1 && t < tPatch) { const k = stamp(t, tTell - .1); push(); translate(560, 640); scale(k); bubble(0, 0, 140, 80, INK.paper, { dots: 1 }); pop(); }
    // the bad patch, and the verdict
    if (!reset && t > tPatch - .2) { const k = stamp(t, tPatch - .2); push(); translate(1330, 700); scale(k); paint(rrPts(-100, -70, 200, 140, 14), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rrPts(-70, -40 + i * 30, 140 - i * 30, 12, 6), { fill: INK.paper }); pop(); }
    if (!reset) stampX(640, 260, 190, stamp(t, tWorse));
    // the second briefing: the real materials, one per word
    const items = [[tLog, 520, 560, (s) => terminal(0, 0, 200 * s, 140 * s, 3)], [tTrace, 780, 520, (s) => trace(0, 0, s)], [tDocs, 1240, 520, (s) => book(0, 0, s)], [tThree, 1520, 560, (s) => { fileIcon(-60, 0, .7 * s); fileIcon(0, -10, .7 * s); fileIcon(60, 0, .7 * s); }]];
    if (t < tFour + .2) items.forEach(([t0, x, y, fn]) => { if (t < t0 - .15) return; const p = arcPt([340, 700], [x, y], 160, easeOut(seg(t, t0 - .15, t0 + .3))), k = stamp(t, t0 - .15) * 1.4; push(); translate(p[0], p[1]); fn(k); pop(); });
    // the four-line fix
    if (t > tFour - .2) {
      const k = stamp(t, tFour - .2); push(); translate(1000, 600); scale(k * (1 - .1 * ease(seg(t, tFour + .2, tFour + .5))));
      paint(rrPts(-150, -110, 300, 220, 20), { fill: INK.green });
      for (let i = 0; i < 4; i++) { const kk = stamp(t, tFour + i * .1); paint(rrPts(-110, -75 + i * 44, 200 * kk * (i % 2 ? .7 : 1), 18, 9), { fill: INK.paper }); }
      pop();
    }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 1000, cy: 700 });
  }

  // ---------- B · same model, same agent: what differs is what it can see ----------
  function shotSkill(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('skill');
    riso({ seed: 52 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 860, W + 400, 400), { fill: 'yellow', tone: .35 });
    const tS1 = wt('skill', 'same'), tS2 = wt('skill', 'same', 1), tSee = wt('skill', 'see'), tProm = wt('skill', 'prompting'), tCtx = wt('skill', 'context'), tCur = wt('skill', 'curating'), tLand = wt('skill', 'lands');
    // two identical agents, an equals sign between
    const kL = stamp(t, tS1 - .2), kR = stamp(t, tS2 - .3);
    const ke = stamp(t, tS2);
    if (ke > .01) for (const dy of [-22, 22]) paint(rrPts(960 - 60 * ke, 640 + dy - 12, 120 * ke, 24, 12), { fill: INK.navy });
    // the window drops over the right one: what it can see
    const kw = stamp(t, tSee - .25, .4), wy = lerp(-400, 560, ease(seg(t, tSee - .25, tSee + .1)));
    if (t > tSee - .25) { glow(1300, 600, 340 * stamp(t, tSee), 'yellow', .7); win(1300, wy, 520, 520, kw); }
    // cards land in the window, one at a time
    for (let i = 0; i < 4; i++) { const t0 = lerp(tCur, tLand + .4, i / 3); if (t < t0 - .2) continue; const k = ease(seg(t, t0 - .2, t0 + .1)); card(1090 + i * 110, lerp(-200, 380, k) - 40, 90, 64, [INK.orange, INK.gold, INK.green, INK.navy][i], { bars: false, tone: .95 }); }
    if (kL > .01) clawd(640, 780, 18 * kL, { ...emotions(t, [[b.start, 'neutral'], [tSee + .2, 'sad']]), emote: null });
    if (kR > .01) clawd(1300, 780, 18 * kR, { ...emotions(t, [[b.start, 'neutral'], [tSee + .1, 'starstruck'], [tCtx, 'happy']]) });
    // not prompting: a bubble crossed out over the left one
    if (t > tProm - .3) { const k = stamp(t, tProm - .3); push(); translate(640, 470); scale(k); bubble(0, 0, 220, 120, INK.paper, { dots: 3 }); pop(); stampX(640, 470, 90, stamp(t, tProm + .25)); }
    // context engineering: the word, stamped, gold over navy
    if (t > tCtx - .15) { type('CONTEXT', 960, 180, 150, INK.navy, { pop: seg(t, tCtx - .15, tCtx + .2) }); type('CONTEXT', 972, 190, 150, INK.orange, { pop: seg(t, tCtx - .1, tCtx + .25), over: true, tone: .8 }); }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 1000, cy: 700 });
    tOut('iris', lt, dur, { cx: 1300, cy: 600 });
  }

  // ---------- C · the workbench, and the workshop behind it ----------
  function shotBench(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('bench');
    riso({ seed: 53 });
    const tWb = wt('bench', 'workbench'), tLim = wt('bench', 'limited'), tLay = wt('bench', 'lay'), tNeeds = wt('bench', 'needs'), tDes = wt('bench', 'designing'), tDraw = wt('bench', 'drawers'), tPull = wt('bench', 'pull'), tWall = wt('bench', 'wall');
    const back = ease(seg(t, tDes - .2, tDes + .9));
    camBegin(960, lerp(760, 540, back), lerp(1.45, 1, back) + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.brown, tone: .5 });
    // the wall behind: a pegboard of tools, and labelled drawers
    if (back > 0) {
      const kb = stamp(t, tDes - .1, .4);
      push(); translate(1200, 380); scale(kb);
      paint(rrPts(-440, -230, 880, 400, 20), { fill: INK.navy, tone: .3 });
      for (let i = 0; i < 16; i++) for (let j = 0; j < 7; j++) paint(ellPts(-410 + i * 55, -200 + j * 55, 5, 5, 8), { fill: INK.navy, tone: .8 });
      pop();
      const tools = [[900, 360, .5, 0], [1030, 380, .45, .1], [1330, 340, .5, -.08], [1460, 380, .4, .12]];
      tools.forEach(([x, y, s, r], i) => { const k = stamp(t, tDes + .1 + i * .08); if (k <= .01) return; if (i === 2 && t > tPull - .1) return; push(); translate(x, y); scale(k); if (i % 2) { paint(rrPts(-14, -110, 28, 200, 12), { fill: INK.gold, over: true }); paint(rrPts(-60, -140, 120, 50, 14), { fill: INK.orange, over: true }); } else wrench(0, 40, s * 1.2, r, INK.gold); pop(); });
      // drawers
      push(); translate(440, 440); scale(stamp(t, tDes + .2, .4));
      paint(rrPts(-220, -290, 440, 580, 20), { fill: INK.brown });
      for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { paint(rrPts(-195 + i * 132, -265 + j * 136, 118, 118, 10), { fill: INK.gold, tone: .8 }); const kk = stamp(t, tDraw - .2 + (i + j) * .05); if (kk > .01) { paint(rrPts(-172 + i * 132, -238 + j * 136, 72 * kk, 22, 4), { fill: INK.paper }); } paint(ellPts(-136 + i * 132, -190 + j * 136, 12, 12, 12), { fill: INK.navy }); }
      pop();
    }
    // the bench
    const BX = 960, BY = 780, bw = 1000 * stamp(t, b.start + .1, .4);
    paint(rectPts(BX - bw / 2, BY, bw, 44), { fill: INK.brown });
    paint(rectPts(BX - bw / 2 + 40, BY + 44, 36, 180), { fill: INK.brown }); paint(rectPts(BX + bw / 2 - 76, BY + 44, 36, 180), { fill: INK.brown });
    // limited: clamps bite the ends
    const kc = ease(seg(t, tLim - .1, tLim + .3));
    if (kc > 0) for (const s of [-1, 1]) { const x = BX + s * (bw / 2 + 120 - 110 * kc); push(); translate(x, BY + 20); scale(s, 1); paint([[-40, -90], [30, -90], [30, 90], [-40, 90], [-40, 60], [0, 60], [0, -60], [-40, -60]], { fill: INK.navy }); paint(rectPts(-80, -12, 50, 24), { fill: INK.orange }); pop(); }
    // three things for this task
    const lay = [[tLay, 640, (k) => fileIcon(0, -52, 1)], [lerp(tLay, tNeeds, .5), 860, () => { paint(rrPts(-80, -110, 160, 110, 14), { fill: INK.orange }); stampX(0, -55, 30, 1, INK.navy); }], [tNeeds, 1080, () => { paint(rrPts(-80, -120, 160, 120, 10), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let i = 0; i < 3; i++) paint(rectPts(-80, -90 + i * 30, 160, 4), { fill: INK.navy, tone: .7 }); paint(rectPts(-20, -120, 4, 120), { fill: INK.navy, tone: .7 }); }]];
    lay.forEach(([t0, x, fn]) => { if (t < t0 - .2) return; const y = lerp(-300, BY, easeIn(seg(t, t0 - .2, t0 + .05))), sq = t > t0 + .05 ? .2 * Math.exp(-10 * (t - t0 - .05)) * Math.cos(25 * (t - t0)) : 0; push(); translate(x, y); scale(1 + sq, 1 - sq); fn(); pop(); });
    // Clawd, on the bench; he pulls the right tool off the wall
    const jmp = jump(t, tPull - .05, tPull + .45, 5);
    const has = t > tPull + .2;
    clawd(1300, BY, 15, { ...emotions(t, [[b.start, 'neutral'], [tLay, 'happy'], [tDes, 'surprised'], [tPull - .3, 'determined'], [tWall, 'proud']]), dy: jmp.dy * 1.4, sq: jmp.sq, flip: true, aR: has ? 1.2 : .2, armR: has ? (u) => wrench(0, 0, .22, -1.2) : null });
    if (t > tPull - .1 && !has) { const p = arcPt([1330, 380], [1280, 690], -60, ease(seg(t, tPull - .1, tPull + .2))); wrench(p[0], p[1], .6, -.08 + 2 * seg(t, tPull - .1, tPull + .2)); }
    camEnd();
    tIn('iris', lt, { cx: 1300, cy: 600 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- D · the ladder: describe, paste, let it find ----------
  function shotLadder(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('ladder');
    riso({ seed: 54 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tLad = wt('ladder', 'ladder'), tL0 = wt('ladder', 'level'), tDesc = wt('ladder', 'describe'), tLost = wt('ladder', 'lost'), tL1 = wt('ladder', 'level', 1), tPaste = wt('ladder', 'paste'),
      tAgain = wt('ladder', 'again'), tL2 = wt('ladder', 'level', 2), tRun = wt('ladder', 'run'), tRead = wt('ladder', 'read'), tInt = wt('ladder', 'intent'), tCon = wt('ladder', 'constraints');
    const LX = 900, RY = [880, 620, 360];
    // the ladder
    const kl = ease(seg(t, tLad - .5, tLad + .2));
    for (const s of [-1, 1]) paint(rrPts(LX + s * 130 - 16, 980 - 820 * kl, 32, 820 * kl, 12), { fill: INK.brown });
    RY.forEach((y, i) => { const k = stamp(t, [tL0, tL1, tL2][i] - .25); if (k <= .01) return; paint(rrPts(LX - 130, y - 12, 260 * k, 24, 10), { fill: INK.brown }); type(String(i), LX - 250, y - 70, 120, i === 2 ? INK.orange : INK.navy, { pop: seg(t, [tL0, tL1, tL2][i] - .2, [tL0, tL1, tL2][i] + .15) }); });
    for (let y = 750; y > 980 - 820 * kl; y -= 130) if (!RY.some(r => Math.abs(r - y) < 60)) paint(rrPts(LX - 130, y - 8, 260, 16, 8), { fill: INK.brown, tone: .5 });
    // Clawd climbs a rung per level
    const lvl = t < tL1 ? 0 : t < tL2 ? 1 : 2, tj = [0, tL1, tL2][lvl];
    const cy = lvl === 0 ? RY[0] : lerp(RY[lvl - 1], RY[lvl], ease(seg(t, tj, tj + .4))), jj = lvl > 0 ? jump(t, tj, tj + .4, 2) : { dy: 0, sq: 0 };
    clawd(LX, cy - 12, 12, { ...emotions(t, [[b.start, 'neutral'], [tLost, 'confused'], [tL1, 'neutral'], [tAgain, 'bored'], [tL2, 'determined'], [tRead + .3, 'happy']]), dy: jj.dy, sq: jj.sq });
    // level 0: the Skipper describes; it arrives as a fuzzy blob
    const kS = stamp(t, tL0 - .3);
    if (kS > .01) skipper(330, 1000 + 300 * (1 - kS), 16, skipAct(t, [[tL0 - .3, 'present', { mood: 'neutral' }], [tDesc, 'shrug', { mood: 'grin' }], [tL1, 'point', { mood: 'focused' }], [tAgain, 'facepalm', { mood: 'worried' }], [tL2, 'stand', { mood: 'neutral' }], [tInt - .2, 'present', { mood: 'grin' }], [tCon, 'pointUp', { mood: 'happy' }]]));
    if (t > tDesc - .2 && t < tL1) {
      const kb = stamp(t, tDesc - .2); push(); translate(540, 640); scale(kb); bubble(0, 0, 200, 110, INK.paper); inkLine([[-60, 0], [-30, -20], [0, 15], [30, -15], [60, 5]], 1.2, INK.navy, 'ink', .6, { force: true }); pop();
      const f = ease(seg(t, tDesc + .6, tLost)), p = arcPt([600, 620], [LX + 150, RY[0] - 170], 120, f), fuzz = seg(t, tLost - .3, tLost + .2);
      if (f > 0) for (let i = 0; i < 7; i++) paint(ellPts(p[0] + (hash(i) - .5) * 110 * fuzz, p[1] + (hash(i + 9) - .5) * 80 * fuzz, 44 + 16 * fuzz, 36 + 14 * fuzz, 18), { fill: INK.navy, tone: .75 - .4 * fuzz, over: true });
    }
    // level 1: the raw trace, pasted, and pasted again
    if (t > tPaste - .1 && t < tL2 + .2) { const k = stamp(t, tPaste - .1, .2); trace(1260, 560, 1.3 * k); if (t > tAgain - .15) { const k2 = stamp(t, tAgain - .15, .2); trace(1290, 590, 1.3 * k2, INK.paper); } }
    // level 2: the agent runs the test and reads the trace itself
    if (t > tRun - .3) { const kt = stamp(t, tRun - .3); push(); translate(1300, 330); scale(kt); terminal(0, 0, 300, 220, Math.min(6, 1 + Math.floor(Math.max(0, t - tRun) * 5))); pop(); }
    if (t > tRead - .1 && t < tRead + .7) { const p = arcPt([1300, 330], [LX + 60, RY[2] - 60], 80, ease(seg(t, tRead - .1, tRead + .4))); trace(p[0], p[1], .6 * (1 - easeIn(seg(t, tRead + .35, tRead + .7)))); }
    // what no tool can find: intent and constraints, from the Skipper
    if (t > tInt - .2) { const p = arcPt([420, 700], [1640, 330], 200, easeOut(seg(t, tInt - .2, tInt + .3))); compass(p[0], p[1], 80 * stamp(t, tInt - .2), .4 * Math.sin(t * 3)); }
    if (t > tCon - .15) fence(1640, 660, 1.1, seg(t, tCon - .15, tCon + .6));
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- E · infrastructure vs injection ----------
  function shotInfra(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('infra');
    riso({ seed: 55 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(1080, -200, 1100, H + 400), { fill: INK.paper });
    const tInf = wt('infra', 'infrastructure'), tVs = wt('infra', 'versus'), tInj = wt('infra', 'injection'), tOnce = wt('infra', 'once'), tEvery = wt('infra', 'every'),
      tTool = wt('infra', 'tool'), tIntg = wt('infra', 'integrations'), tRepo = wt('infra', 'repo'), tIns = wt('infra', 'instruction'), tInj2 = wt('infra', 'injection', 1),
      tHand = wt('infra', 'hand'), tSame = wt('infra', 'same'), tThird = wt('infra', 'third'), tProm = wt('infra', 'promote');
    // the split
    const kv = ease(seg(t, tVs - .3, tVs + .2));
    for (let i = 0; i < 14; i++) if (i / 14 < kv) paint(rrPts(1074, -20 + i * 82, 12, 50, 6), { fill: INK.navy });
    // the foundation: a slab, then a block per piece of infrastructure
    const ks = stamp(t, tInf - .2);
    if (ks > .01) paint(rrPts(560 - 440 * ks, 880, 880 * ks, 70, 12), { fill: INK.navy });
    const blocks = [[tTool, 340, 790, () => wrench(0, 10, .3, -.7)], [tIntg, 780, 790, () => { paint(rrPts(-40, -30, 80, 60, 12), { fill: INK.gold }); paint(rectPts(-24, -60, 12, 30), { fill: INK.gold }); paint(rectPts(12, -60, 12, 30), { fill: INK.gold }); paint(rectPts(-6, 30, 12, 34), { fill: INK.gold }); }],
      [tRepo, 340, 690, () => { for (let i = 0; i < 3; i++) { paint(rrPts(-50 + i * 30, -34 + i * 24, 60, 18, 6), { fill: INK.gold }); } paint(rectPts(-44, -20, 6, 60), { fill: INK.gold }); }], [tIns, 780, 690, () => fileIcon(0, 0, .55, INK.gold)]];
    blocks.forEach(([t0, x, y, fn]) => { const k = stamp(t, t0 - .15); if (k <= .01) return; const yy = lerp(y - 300, y, easeIn(seg(t, t0 - .15, t0 + .05))); push(); translate(x, yy); scale(k); paint(rrPts(-210, -45, 420, 90, 12), { fill: INK.navy, tone: .85 }); push(); scale(1.25); fn(); pop(); pop(); });
    // sessions pass over it, each one ticked
    if (t > tEvery - .2) for (let i = 0; i < 6; i++) { const f = (t - tEvery) * .45 - i * .33; if (f < 0 || f > 1) continue; const x = lerp(140, 980, f), k = Math.min(1, Math.sin(f * Math.PI) * 3); push(); translate(x, 440); scale(k * 1.5); card(-70, -55, 140, 110, INK.paper, { bar: INK.navy }); check(30, 10, .9, 1); pop(); }
    // injection: the Skipper pastes by hand
    const kS = stamp(t, tInj - .3);
    if (kS > .01) skipper(1680, 1020 + 300 * (1 - kS), 16, skipAct(t, [[tInj - .3, 'stand', { mood: 'neutral', flip: true }], [tInj2, 'point', { mood: 'focused', flip: true }], [tThird, 'facepalm', { mood: 'worried', flip: true }], [tProm, 'pointUp', { mood: 'happy', flip: true }]]));
    { const kb = stamp(t, tInj2 - .2); if (kb > .01) { push(); translate(1340, 560); scale(kb); paint(rrPts(-160, -200, 320, 400, 20), { fill: INK.brown, tone: .8 }); pop(); } }
    const pastes = [tHand - .3, tSame, tThird];
    const promo = ease(seg(t, tProm, tProm + .5));
    pastes.forEach((t0, i) => { if (t < t0 - .1) return; const k = stamp(t, t0 - .1, .2); const last = i === 2; const p = last ? arcPt([1340, 520 + i * 20], [560, 590], 260, promo) : [1340 + i * 8, 520 + i * 20]; push(); translate(p[0], p[1]); scale(k * (last ? lerp(1, 1.6, promo) : 1)); card(-110, -80, 220, 160, last && promo > .9 ? INK.gold : INK.paper, { bar: INK.navy }); pop(); });
    // tally: third time
    [tSame, lerp(tSame, tThird, .5), tThird].forEach((t0, i) => { const k = stamp(t, t0); if (k > .01) paint(ribbon([[1230 + i * 40, 300], [1230 + i * 40, 300 - 90 * k]], 14), { fill: INK.orange, over: true }); });
    if (t > tThird + .1) paint(ribbon([[1205, 280], [1335, 225]], 12), { fill: INK.orange, over: true, alpha: stamp(t, tThird + .1) });
    if (promo > .9) glow(560, 590, 220 * stamp(t, tProm + .45), 'yellow', .8);
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 560, cy: 600 });
  }

  // ---------- F · the context window tax ----------
  function shotTax(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('tax');
    riso({ seed: 56 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tMore = wt('tax', 'more'), tTw = wt('tax', 'twice'), tMon = wt('tax', 'money'), tAtt = wt('tax', 'attention'), tDet = wt('tax', 'details'), tMid = wt('tax', 'middle'),
      tDeg = wt('tax', 'degrades'), tRot = wt('tax', 'rot'), tBig = wt('tax', 'bigger'), tBefore = wt('tax', 'before'), tAsk = wt('tax', 'ask'), tDiff = wt('tax', 'differently');
    const p1 = 1 - ease(seg(t, tDet - .5, tDet - .1)), p2 = ease(seg(t, tDet - .3, tDet + .2)) * (1 - ease(seg(t, tBefore - .5, tBefore - .1)));
    // more is not better: a token pile tips over; then two costs
    if (p1 > .01) {
      const kc = stamp(t, tMore - .3);
      for (let i = 0; i < 9; i++) { const k = stamp(t, tMore - .3 + i * .05); if (k > .01 && t < tTw) paint(ellPts(960 + (i % 3 - 1) * 12, 700 - i * 40, 90 * k, 26 * k, 24), { fill: i % 2 ? INK.gold : INK.orange, ink: INK.navy, sw: .6 }); }
      if (t > tTw - .2) {
        push(); translate(640, 540); scale(stamp(t, tMon - .3) * p1); paint(ellPts(0, 0, 190, 190, 60), { fill: INK.gold }); paint(ellPts(0, 0, 150, 150, 60), { fill: INK.orange, tone: .7, over: true }); paint(rrPts(-22, -90, 44, 180, 18), { fill: INK.navy }); pop();
        push(); translate(1280, 540); scale(stamp(t, tAtt - .3) * p1); paint(ellPts(0, 0, 190, 190, 60), { fill: INK.gold }); paint(ellPts(0, 0, 140, 80, 40), { fill: INK.paper }); paint(ellPts(0, 0, 58, 58, 30), { fill: INK.navy }); paint(ellPts(18, -18, 16, 16, 12), { fill: INK.paper }); pop();
        const kt = stamp(t, tTw); if (kt > .01) type('×2', 960, 540, 140, INK.navy, { pop: seg(t, tTw - .1, tTw + .2), alpha: p1 });
      }
    }
    // a long context: the middle fades, quality drops, it rots; a bigger window doesn't cure it
    if (p2 > .01) {
      const wide = ease(seg(t, tBig - .1, tBig + .5)), N = 9, span = lerp(1400, 1760, wide), x0 = 960 - span / 2;
      win(960, 480, span + 120, 380, p2);
      for (let i = 0; i < N; i++) {
        const k = stamp(t, tDet - .2 + i * .06) * p2; if (k <= .01) continue;
        const mid = Math.abs(i - (N - 1) / 2) <= 2, fade = mid ? ease(seg(t, tMid - .1, tMid + .5)) : 0, rot = ease(seg(t, tRot - .2 + hash(i) * .4, tRot + .4 + hash(i) * .4));
        const x = x0 + span * (i + .5) / N, col = rot > .5 ? INK.brown : (i === 4 ? INK.orange : [INK.navy, INK.green, INK.gold][i % 3]);
        push(); translate(x, 510); scale(k); card(-62, -90, 124, 180, col, { tone: 1 - .72 * fade, bar: INK.paper });
        if (rot > 0) for (let j = 0; j < 7; j++) paint(ellPts((hash(i * 7 + j) - .5) * 100, (hash(i * 3 + j + 40) - .5) * 150, 10 * rot, 10 * rot, 10), { fill: INK.dark, over: true });
        pop();
      }
      // quality meter
      const km = stamp(t, tDeg - .4) * p2;
      if (km > .01) { const q = lerp(1, .22, ease(seg(t, tDeg, tDeg + 1.2))); paint(rrPts(560, 820, 800 * km, 50, 25), { fill: INK.navy, tone: .2 }); paint(rrPts(560, 820, 800 * km * q, 50, 25), { fill: q > .5 ? INK.green : INK.orange }); }
    }
    // the question: will it decide differently because it saw this? Only that card goes through
    if (t > tBefore - .3) {
      const kg = stamp(t, tBefore - .3);
      push(); translate(1180, 620); scale(kg); paint(rrPts(-40, -380, 80, 280, 24), { fill: INK.navy }); paint(rrPts(-40, 100, 80, 280, 24), { fill: INK.navy }); paint(rrPts(-70, -110, 140, 20, 10), { fill: INK.orange }); paint(rrPts(-70, 90, 140, 20, 10), { fill: INK.orange }); pop();
      clawd(520, 900, 20, { ...emotions(t, [[tBefore - .3, 'thinking', { emote: '?' }], [tDiff, 'happy']]), flip: false });
      const cards = [[0, INK.gold, true], [1, INK.navy, false], [2, INK.brown, false]];
      cards.forEach(([i, col, ok]) => { const t0 = tAsk + i * .35; if (t < t0 - .2) return; const f = seg(t, t0, t0 + 1.2), k = stamp(t, t0 - .2);
        let x, y; if (ok) { const g = t > tDiff - .2 ? ease(seg(t, tDiff - .2, tDiff + .4)) : 0; x = lerp(760, 820, ease(f)) + g * 700; y = 620; }
        else { const fw = ease(seg(f, 0, .5)), bk = easeOut(seg(f, .5, 1)); x = lerp(780, 1070, fw) - bk * 160; y = i === 1 ? 380 : 860; y += 30 * bk; }
        push(); translate(x, y - (ok ? 0 : 0)); rotate(ok ? 0 : -.3 * seg(f, .5, 1)); scale(k); card(-70, -50, 140, 100, col, { bars: true }); pop();
        if (ok) check(x + 110, y - 60, 1.1, stamp(t, tDiff + .3)); });
    }
    camEnd();
    tIn('iris', lt, { cx: 560, cy: 600 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- G · keeping the window clean ----------
  function shotClean(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('clean');
    riso({ seed: 57 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tNoise = wt('clean', 'noise'), tComp = wt('clean', 'compact'), tBrief = wt('clean', 'brief'), tNotes = wt('clean', 'notes'), tSub = wt('clean', 'sub'), tConc = wt('clean', 'conclusion'),
      tPh = wt('clean', 'phases'), tRes = wt('clean', 'research'), tPlan = wt('clean', 'plan'), tImp = wt('clean', 'implement'), tFresh = wt('clean', 'fresh');
    const g1 = 1 - ease(seg(t, tPh - .4, tPh)), g2 = ease(seg(t, tPh - .1, tPh + .3));
    if (g1 > .01) {
      const WX = 660, WY = 520;
      win(WX, WY, 860, 640, g1 * stamp(t, b.start - .1, .4));
      // noise piles up, then crushes into one brief
      const crush = ease(seg(t, tComp - .1, tComp + .5));
      for (let i = 0; i < 34; i++) { const t0 = lerp(b.start, tNoise + .3, hash(i + 2)), k = stamp(t, t0); if (k <= .01 || crush >= 1) continue;
        const x = WX + (hash(i) - .5) * 740, y = WY + 40 + (hash(i + 50) - .5) * 480, px = lerp(x, WX, crush), py = lerp(y, WY + 30, crush);
        push(); translate(px, py); rotate((hash(i + 7) - .5) * 1.4 * (1 - crush)); scale(k * g1 * (1 - .7 * crush)); paint(rrPts(-50, -22, 100 + 40 * hash(i + 3), 44, 8), { fill: [INK.navy, INK.orange, INK.green, INK.brown][i % 4], tone: .85, over: i % 3 === 0 }); pop(); }
      if (t > tComp + .3) { const k = stamp(t, tComp + .3); push(); translate(WX, WY + 30); scale(k * g1); card(-110, -80, 220, 160, INK.gold, { bar: INK.navy }); pop(); }
      clawd(WX - 260, WY + 300, 12, { ...emotions(t, [[b.start, 'neutral'], [tNoise - .3, 'dizzy'], [tBrief, 'relieved'], [tConc, 'happy']]), dy: 0 });
      // notes, kept outside the window
      if (t > tNotes - .3) { push(); translate(1460, 300); scale(stamp(t, tNotes - .3) * g1); paint(rrPts(-150, -150, 300, 300, 16), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rectPts(-150, -150, 300, 40), { fill: INK.orange }); const n = Math.floor(6 * seg(t, tNotes, tNotes + 1.5)); for (let i = 0; i < n; i++) paint(rrPts(-120, -85 + i * 36, 200 - 40 * hash(i), 12, 6), { fill: INK.navy, tone: .7 }); pop(); }
      // a sub-agent explores in its own window and returns one card
      if (t > tSub - .5) {
        const ks = stamp(t, tSub - .5) * g1; win(1460, 790, 380, 300, ks, { tone: .2 });
        if (ks > .01) { for (let i = 0; i < 8; i++) fileIcon(1330 + (i % 4) * 88, 740 + Math.floor(i / 4) * 90, .45 * ks, t > tConc ? INK.paper : INK.paper); clawd(1460, 925, 7 * ks, { ...feel(t > tConc - .3 ? 'proud' : 'determined', T), ...move(t < tConc - .3 ? 'bounce' : 'idle', T, 2) }); }
        if (t > tConc - .2) { const p = arcPt([1460, 720], [WX + 170, WY + 60], 200, ease(seg(t, tConc - .2, tConc + .5))); push(); translate(p[0], p[1]); scale(.7); card(-70, -50, 140, 100, INK.green, { bar: INK.paper }); pop(); }
      }
    }
    // three phases, each in a fresh window
    if (g2 > .01) {
      const P = [[tRes, 380], [tPlan, 960], [tImp, 1540]];
      for (let i = 0; i < 2; i++) { const k = ease(seg(t, P[i + 1][0] - .4, P[i + 1][0])); if (k > 0) { paint(ribbon([[P[i][1] + 240, 520], [P[i][1] + 240 + 100 * k, 520]], 24), { fill: INK.navy }); if (k > .9) paint([[P[i][1] + 350, 490], [P[i][1] + 350, 550], [P[i][1] + 390, 520]], { fill: INK.navy }); } }
      P.forEach(([t0, x], i) => {
        const k = stamp(t, tPh - .1 + i * .1) * g2, on = t > t0 - .1;
        win(x, 520, 420, 420, k, { bar: on ? INK.orange : INK.navy, tone: .1 });
        if (k < .01) return; const ki = stamp(t, t0 - .1); if (ki <= .01) return;
        push(); translate(x, 550); scale(ki);
        if (i === 0) { arcLine(-20, -20, 70, 18, INK.navy); paint(ellPts(-20, -20, 60, 60, 30), { fill: 'yellow', tone: .5, over: true }); paint(ribbon([[30, 30], [100, 100]], 26), { fill: INK.navy }); }
        if (i === 1) for (let j = 0; j < 3; j++) { paint(rrPts(-110, -80 + j * 60, 36, 36, 6), { fill: INK.paper, ink: INK.navy, sw: 1 }); paint(rrPts(-50, -70 + j * 60, 150, 16, 8), { fill: INK.navy, tone: .6 }); check(-92, -64 + j * 60, .45, stamp(t, t0 + .2 + j * .15)); }
        if (i === 2) { wrench(-40, 20, .45, -.6); paint(rrPts(10, -80, 110, 150, 12), { fill: INK.green }); for (let j = 0; j < 3; j++) paint(rrPts(26, -56 + j * 40, 70, 12, 6), { fill: INK.paper }); }
        pop();
      });
      if (t > tFresh - .1) for (let i = 0; i < 3; i++) { const k = stamp(t, tFresh - .1 + i * .08); paint(starPts(380 + i * 580 + 170, 340, 40 * k, .35, 4), { fill: INK.gold }); }
      clawd(960, 960, 12, { ...feel('happy', T), ...move('bounce', T, 3), dy: 20 * (1 - g2) });
    }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- H · durable context; the takeaway; next ----------
  function shotDurable(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('durable');
    riso({ seed: 58 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, W + 400, 400), { fill: 'yellow', tone: .45 });
    const tEnds = wt('durable', 'ends'), tGone = wt('durable', 'gone'), tCom = wt('durable', 'commit'), tNotes = wt('durable', 'notes'), tPerm = wt('durable', 'permanent'), tIns = wt('durable', 'instruction'),
      tCode = wt('durable', 'code'), tRepo = wt('durable', 'repo'), tDocs = wt('durable', 'docs'), tCtx = wt('durable', 'context'), tNext = wt('durable', 'next'), tGuard = wt('durable', 'guardrails');
    const conv = ease(seg(t, tCtx - .2, tCtx + .5));
    // the session window shutters closed and drops away
    const shut = ease(seg(t, tGone - .5, tGone)), drop = easeIn(seg(t, tGone + .2, tGone + .7));
    if (drop < 1) {
      push(); translate(0, drop * 900);
      win(960, 520, 820, 560, 1);
      clawd(960, 760, 16, { ...emotions(t, [[b.start, 'neutral'], [tEnds, 'surprised']]) });
      paint(rrPts(550, 262, 820, 520 * shut, 16), { fill: INK.navy, tone: .9 });
      for (let i = 0; i < 6; i++) if (520 * shut > i * 88 + 40) paint(rectPts(550, 262 + i * 88 + 40, 820, 8), { fill: INK.dark });
      pop();
    }
    // durable: commits, notes, the instruction file
    const kc = ease(seg(t, tCom - .2, tCom + .8)) * (1 - conv);
    if (kc > 0) { inkLine([[300, 250], [lerp(300, 1620, kc), 250]], 2, INK.navy, 'ink', 0, { force: true }); for (let i = 0; i < 6; i++) { const x = 300 + i * 264; if ((x - 300) / 1320 <= kc) paint(ellPts(x, 250, 30, 30, 20), { fill: i === 5 ? INK.orange : INK.gold, ink: INK.navy, sw: 1 }); } }
    const piece = (t0, x, y, fn) => { const k = stamp(t, t0 - .2); if (k <= .01) return; const p = [lerp(x, 960, conv), lerp(y, 560, conv)]; push(); translate(p[0], p[1]); scale(k * (1 - .6 * conv)); fn(); pop(); };
    piece(tNotes, 520, 560, () => { paint(rrPts(-120, -150, 240, 300, 16), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rectPts(-120, -150, 240, 40), { fill: INK.orange }); for (let i = 0; i < 5; i++) paint(rrPts(-90, -80 + i * 42, 170 - 30 * hash(i), 12, 6), { fill: INK.navy, tone: .7 }); });
    piece(tIns, 1400, 560, () => { paint(rrPts(-130, -160, 260, 320, 16), { fill: INK.gold }); paint(rectPts(-130, -160, 260, 60), { fill: INK.navy }); paint(starPts(0, -130, 22, .45, 5), { fill: INK.gold }); for (let i = 0; i < 4; i++) paint(rrPts(-95, -60 + i * 46, 190 - 40 * (i % 2), 14, 7), { fill: INK.navy, tone: .8 }); });
    // code, repo, docs: all context now
    piece(tCode, 700, 830, () => { paint(rrPts(-90, -60, 180, 120, 14), { fill: INK.navy }); type('{ }', 0, 2, 60, INK.gold); });
    piece(tRepo, 960, 830, () => { for (let i = 0; i < 3; i++) paint(rrPts(-70 + i * 30, -50 + i * 34, 90, 26, 8), { fill: INK.green }); paint(rectPts(-66, -30, 8, 90), { fill: INK.green }); });
    piece(tDocs, 1220, 830, () => book(0, 0, 1));
    if (conv > 0) { glow(960, 560, 380 * conv, 'yellow', .95); paint(starPts(960, 560, 120 * backOut(seg(t, tCtx + .3, tCtx + .7)), .42, 8, t * .3), { fill: INK.gold }); }
    const kA = stamp(t, tCode - .4);
    if (kA > .01) { skipper(300, 1040 + 300 * (1 - kA), 17, skipAct(t, [[tCode - .4, 'stand', { mood: 'neutral' }], [tCtx, 'present', { mood: 'happy' }], [tNext, 'wave', { mood: 'grin', t }]])); clawd(1620, 1040 + 300 * (1 - kA), 18, { ...emotions(t, [[tCode - .4, 'neutral'], [tCtx + .2, 'starstruck'], [tGuard, 'determined']]), flip: true }); }
    // a shield: what comes next
    if (t > tGuard - .2) { const k = stamp(t, tGuard - .2, .4); push(); translate(960, 470); scale(k); const S = [[-150, -140], [0, -190], [150, -140], [130, 60], [0, 190], [-130, 60]]; paint(S, { fill: INK.navy, tone: .25, over: true, curv: .35 }); inkLine([...S, S[0], S[1]], 5, INK.navy, 'ink', .35, { force: true }); pop(); }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    // a long next title would run off the card at endCard's size: print it on two lines instead
    const long = TIMING.next.length > 16;
    endCard(T0, lt, dur, '04', long ? '' : TIMING.next);
    if (long) {
      const t = onTwos(lt), w = TIMING.next.toUpperCase().split(' '); let best = 1, bd = 1e9;
      for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < bd) { bd = d; best = i; } }
      camBegin(960, 540, 1.04 - .04 * ease(seg(t, 0, dur)));
      type(w.slice(0, best).join(' '), 960, 556, 70, INK.navy, { pop: seg(t, .8, 1.2) });
      type(w.slice(best).join(' '), 960, 636, 70, INK.navy, { pop: seg(t, .9, 1.3) });
      camEnd();
    }
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotBugIn(T0, lt, dur) { shotBug(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('bug', 0), shotBugIn],
    [shotAt('skill'), shotSkill],
    [shotAt('bench'), shotBench],
    [shotAt('ladder'), shotLadder],
    [shotAt('infra'), shotInfra],
    [shotAt('tax'), shotTax],
    [shotAt('clean'), shotClean],
    [shotAt('durable'), shotDurable],
    [B.durable.end + .9, shotEnd],
  ]);
})();
