// ch14.js: Chapter 14 · Agents in the Pipeline. Storyboard: video/storyboards/ch14.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const cloud = (x, y, s, col = INK.paper, o = {}) => { for (const [dx, dy, r] of [[-90, 20, 70], [-20, -30, 95], [70, 0, 80], [120, 35, 55], [-140, 45, 45]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .9, 28), { fill: col, over: o.over }); paint(rrPts(x - 180 * s, y + 20 * s, 360 * s, 70 * s, 35 * s), { fill: col, over: o.over }); };
  // a laptop: (x, y) = the hinge centre; the screen is 300s × 200s above it
  const laptop = (x, y, s, o = {}) => { paint(rrPts(x - 160 * s, y - 210 * s, 320 * s, 210 * s, 16 * s), { fill: INK.navy }); paint(rrPts(x - 140 * s, y - 192 * s, 280 * s, 172 * s, 8 * s), { fill: o.screen || INK.yellow, tone: o.tone ?? .5 }); paint([[x - 190 * s, y + 26 * s], [x + 190 * s, y + 26 * s], [x + 160 * s, y], [x - 160 * s, y]], { fill: INK.dark }); };
  const coin = (x, y, r, k = 1) => { if (k <= .01) return; paint(ellPts(x, y, r * k, r * k, 28), { fill: INK.gold }); arcLine(x, y, r * .72 * k, r * .1 * k, INK.orange); };
  const lock = (x, y, s, shut = 1) => { arcLine(x, y - 40 * s - 20 * s * (1 - shut), 34 * s, 14 * s, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(x - 55 * s, y - 40 * s, 110 * s, 90 * s, 14 * s), { fill: INK.gold }); paint(ellPts(x, y, 12 * s, 12 * s, 14), { fill: INK.navy }); };
  const receipt = (x, y, w, len, lines = 7) => { if (len < 2) return; const P = [[x - w / 2, y], [x + w / 2, y], [x + w / 2, y + len]]; for (let i = 0; i <= 10; i++) P.push([x + w / 2 - i * w / 10, y + len + (i % 2 ? 18 : 0)]); paint(P, { fill: INK.paper, ink: INK.navy, sw: 1.1 }); for (let i = 0; i < lines; i++) { const ly = y + 50 + i * 60; if (ly > y + len - 40) break; paint(rrPts(x - w / 2 + 34, ly, (w - 68) * (.45 + .5 * hash(i + 7)), 14, 7), { fill: INK.navy, tone: .5 }); } };
  const clock = (x, y, r, hr) => { paint(ellPts(x, y, r, r, 40), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ellPts(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, 5, 5, 8), { fill: INK.navy }); } const ah = -Math.PI / 2 + hr / 12 * TAU; inkLine([[x, y], [x + Math.cos(ah) * r * .5, y + Math.sin(ah) * r * .5]], 1.6, INK.navy, 'ink', 0, { force: true }); inkLine([[x, y], [x, y - r * .72]], 1.1, INK.orange, 'ink', 0, { force: true }); };
  const ram = (x, y, s, col = INK.green) => { paint(rrPts(x - 150 * s, y - 40 * s, 300 * s, 80 * s, 8 * s), { fill: col }); for (let i = 0; i < 4; i++) paint(rectPts(x - 125 * s + i * 66 * s, y - 25 * s, 44 * s, 36 * s), { fill: INK.navy }); for (let i = 0; i < 12; i++) paint(rectPts(x - 140 * s + i * 24 * s, y + 30 * s, 12 * s, 16 * s), { fill: INK.gold }); };
  const star = (x, y, r, col = INK.gold) => paint(starPts(x, y, r, .45, 5), { fill: col });
  const heart = (x, y, r, col = INK.orange) => paint(heartPts(x, y, r), { fill: col });
  // evenly spaced points along a closed outline (for dashed lines)
  const resample = (P, n) => { const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], b = P[i % P.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } const out = []; let j = 0; for (let k = 0; k < n; k++) { const d = k / n * L[P.length]; while (L[j + 1] < d) j++; const a = P[j], b = P[(j + 1) % P.length], f = (d - L[j]) / Math.max(1e-6, L[j + 1] - L[j]); out.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); } return out; };
  const mountain = (x, y, w, h, col, o = {}) => paint([[x - w / 2, y], [x, y - h], [x + w / 2, y]], { fill: col, tone: o.tone ?? 1, over: o.over });

  // the series ident (as common.js ident()), with a long title broken over two lines so it fits beside the helm
  function identLong(T, lt, dur, num, title) {
    const t = onTwos(lt), inK = (a, b) => 1 - backOut(seg(t, a, b));
    riso({ seed: 2, shift: { yellow: [0, -1300 * inK(.05, .7)], orange: [-2300 * inK(.3, .95), 0], federal: [2300 * inK(.55, 1.25), 0] } });
    camBegin(960, 540, 1 + .03 * ease(seg(t, 0, dur)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, H + 100], to: [0, 250], a: .55, b: 0 } });
    paint(rectPts(-200, 860, W + 400, 400), { fill: INK.navy });
    helm(560, 520, 250, TAU / 8 * backOut(seg(t, 2.7, 3.2)) + .06 * wob(t, .25));
    type('THE AGENTIC CREW', 1340, 250, 40, INK.navy, { spacing: .18, pop: seg(t, 1.3, 1.6) });
    type(num, 1340, 420, 210, INK.orange, { pop: seg(t, 1.5, 1.85) });
    type(num, 1352, 430, 210, INK.navy, { pop: seg(t, 1.6, 1.95), over: true, tone: .55 });
    const w = title.toUpperCase().split(' '); let best = 1, bd = 1e9;
    for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < bd) { bd = d; best = i; } }
    const L = [w.slice(0, best).join(' '), w.slice(best).join(' ')], sz = Math.max(L[0].length, L[1].length) > 18 ? 60 : 72;
    L.forEach((ln, i) => type(ln, 1340, 620 + i * sz * 1.15, sz, INK.navy, { pop: seg(t, 1.9 + i * .12, 2.3 + i * .12) }));
    camEnd();
  }
  const prCard = (x, y, s) => { push(); translate(x, y); scale(s); card(-90, -60, 180, 120, INK.green, { bars: false }); arcLine(-30, 0, 12, 6, INK.paper); arcLine(40, -20, 12, 6, INK.paper); arcLine(40, 30, 12, 6, INK.paper); inkLine(through([[-30, 0], [0, -10], [40, -20]]), 1, INK.paper, 'ink', .5, { force: true }); pop(); };
  const magnifier = (x, y, s, col = INK.navy) => { arcLine(x, y, 60 * s, 16 * s, col); paint(ellPts(x, y, 52 * s, 52 * s, 30), { fill: 'yellow', tone: .45, over: true }); paint(ribbon([[x + 44 * s, y + 44 * s], [x + 110 * s, y + 110 * s]], 26 * s), { fill: col }); };
  const lamp = (x, y, r, col, on = 1) => { if (on > .01) glow(x, y, r * 2.2 * on, col === INK.green ? 'yellow' : 'orange', .6); paint(ellPts(x, y, r, r, 30), { fill: col, tone: .35 + .65 * on }); };
  const squiggle = (x, y, w, col = INK.orange) => { const P = []; for (let i = 0; i <= 8; i++) P.push([x + i * w / 8, y + (i % 2 ? 8 : -8)]); inkLine(P, 1.1, col, 'ink', 0, { force: true }); };
  const moon = (x, y, r) => { paint(ellPts(x, y, r, r, 40), { fill: INK.yellow }); paint(ellPts(x + r * .45, y - r * .2, r * .85, r * .85, 40), { fill: INK.navy }); };
  const keyShape = (x, y, s, col = INK.gold) => { push(); translate(x, y); scale(s); arcLine(-60, 0, 34, 18, col); paint(rrPts(-28, -10, 120, 20, 8), { fill: col }); paint(rectPts(60, 8, 14, 26), { fill: col }); paint(rectPts(80, 8, 12, 18), { fill: col }); pop(); };

  // ---------- A · lint: the agent keeps the pipeline green by switching the rules off ----------
  function shotLint(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('lint');
    riso({ seed: 141 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tLint = wt('lint', 'lint'), tGreen = wt('lint', 'green'), tLoves = wt('lint', 'loves'), tNot = wt('lint', 'notices'), tRules = wt('lint', 'rules'), tVan = wt('lint', 'vanished'),
      tSw = wt('lint', 'switched'), tConf = wt('lint', 'config');
    const side = ease(seg(t, tNot - .4, tNot + .2));
    // the pipe and its lamp
    push(); translate(-260 * side, 0);
    paint(rrPts(80, 380, 1300, 120, 60), { fill: INK.green, tone: .85 });
    for (let i = 0; i < 6; i++) paint(rectPts(160 + i * 220, 372, 24, 136), { fill: INK.green });
    lamp(1460, 300, 56, t > tGreen ? INK.green : INK.orange, t > tGreen ? 1 : .6);
    paint(rrPts(1430, 360, 60, 140, 10), { fill: INK.navy });
    // code cards ride through; squiggles are zapped by Clawd
    if (t > tLint - .3) for (let i = 0; i < 4; i++) { const f = frac((t - tLint) * .35 + i / 4), x = 120 + 1200 * f; card(x - 70, 395, 140, 90, INK.paper, { bar: INK.navy }); if (f < .5) squiggle(x - 50, 470, 100); }
    clawd(720, 360, 11, { ...emotions(t, [[b.start, 'determined'], [tGreen, 'proud'], [tSw - .1, 'mischief']]), boilKey: 'fixer' });
    if (t > tLint && t < tNot) { const zk = frac(t * 1.4); if (zk < .3) paint([[720, 380], [700, 420], [730, 420], [712, 470]].map(p => p), { fill: INK.yellow, ink: INK.navy, sw: .6 }); }
    pop();
    // the team loves it
    const kS = stamp(t, Math.min(tLoves - .5, b.start + .5));
    skipper(lerp(-300, 330, easeOut(kS)) - 200 * side, 1050, 17, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tLoves - .1, 'cheer', { mood: 'happy' }], [tNot, 'think', { mood: 'thinking' }], [tVan, 'shrug', { mood: 'worried' }]]));
    // the rules sheet: rows vanish; a toggle flips off; the config
    const kr = stamp(t, tNot - .1);
    if (kr > .01) {
      push(); translate(1600, 640); scale(kr * .9);
      paint(rectPts(-230, -300, 460, 600), { fill: INK.paper, ink: INK.navy, sw: 1.3 });
      for (let i = 0; i < 7; i++) { const gone = seg(t, tVan - .2 + i * .15, tVan + .1 + i * .15); if (gone >= 1) continue; paint(rectPts(-170, -230 + i * 62, 230 * (1 - gone), 20), { fill: INK.navy, tone: .6 }); check(120, -222 + i * 62, .45, 1 - gone); }
      const kc = stamp(t, tConf - .15); if (kc > .01) { push(); translate(150, 230); scale(kc); const P = []; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? 60 : 48; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); } paint(P, { fill: INK.orange }); paint(ellPts(0, 0, 20, 20, 16), { fill: INK.paper }); pop(); }
      pop();
      const ks = stamp(t, tSw - .2); if (ks > .01) { push(); translate(1060, 760); scale(ks); const off = ease(seg(t, tSw, tSw + .3)); paint(rrPts(-110, -50, 220, 100, 50), { fill: off > .5 ? INK.navy : INK.green, tone: off > .5 ? .4 : 1 }); paint(ellPts(lerp(55, -55, off), 0, 40, 40, 24), { fill: INK.paper, ink: INK.navy, sw: 1 }); pop(); }
    }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · the dark: the watched signal was gamed; at your desk vs in the pipeline ----------
  function shotDark(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('dark');
    riso({ seed: 142 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tSig = wt('dark', 'signal'), tGame = wt('dark', 'gain'), tDesk = wt('dark', 'desk'), tFile = wt('dark', 'file'), tPipe = wt('dark', 'pipeline'), tDark = wt('dark', 'dark'), tGr = wt('dark', 'green'), tRed = wt('dark', 'red');
    const split = ease(seg(t, tDesk - .4, tDesk));
    // the watched signal: always green; Clawd winks
    if (split < 1) {
      push(); translate(960, 540); scale(1 - split); translate(-960, -540);
      paint(rrPts(760, 160, 400, 560, 60), { fill: INK.navy });
      lamp(960, 300, 80, INK.orange, 0); lamp(960, 560, 80, INK.green, 1);
      const ke = stamp(t, tSig - .2);
      if (ke > .01) { push(); translate(1500, 860); scale(ke); clawd(0, 0, 14, { ...feel(t > tGame - .1 ? 'mischief' : 'neutral', T), eyes: t > tGame - .1 && t < tGame + 1 ? 'wink' : undefined, boilKey: 'wink' }); pop(); }
      pop();
    }
    // at your desk (lit) vs in the pipeline (dark)
    if (split > 0) {
      paint(rectPts(-200, 880, 1160, 400), { fill: INK.brown, tone: .5 });
      skipper(300, 1040, 16, { ...SKIP_POSES.think, mood: 'focused', t });
      clawd(640, 880, 11, { ...feel('determined', T), boilKey: 'deskc' });
      for (let i = 0; i < 4; i++) { const k = stamp(t, tFile - .2 + i * .12); if (k > .01) { fileIcon(360 + i * 150, 420, 1.1 * k); } }
      const kd = ease(seg(t, tPipe - .2, tDark));
      if (kd > 0) {
        paint(rectPts(960, -200, 1200 * ease(seg(t, tPipe - .2, tPipe + .3)), H + 400), { fill: INK.navy, tone: .5 + .45 * ease(seg(t, tDark - .2, tDark + .3)) });
        clawd(1440, 880, 11, { ...feel('determined', T), tint: 'blue', tintK: .8, boilKey: 'darkc' });
        lamp(1330, 330, 60, INK.green, stamp(t, tGr - .1)); lamp(1560, 330, 60, INK.orange, stamp(t, tRed - .1));
      }
    }
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- C · safe to automate, easy to verify; spot-check a few ----------
  function shotSteps(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('steps');
    riso({ seed: 143 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tSafe = wt('steps', 'safe'), tVer = wt('steps', 'verify'), tScr = wt('steps', 'screening'), tRel = wt('steps', 'release'), tExp = wt('steps', 'explaining'), tFail = wt('steps', 'failed'),
      tComf = wt('steps', 'comfortable'), tSpot = wt('steps', 'spot'), tFew = wt('steps', 'few');
    const out = ease(seg(t, tComf - .5, tComf - .1));
    // safe + verify: two badges; then three job cards
    if (out < 1) {
      push(); translate(960, 540); scale(1 - out); translate(-960, -540);
      const kb1 = stamp(t, tSafe - .15), kb2 = stamp(t, tVer - .15);
      if (kb1 > .01) { push(); translate(760, 200); scale(kb1); paint(through([[0, -90], [80, -60], [70, 30], [0, 90], [-70, 30], [-80, -60]]), { fill: INK.green }); check(0, 0, 1, 1, INK.paper); pop(); }
      if (kb2 > .01) { push(); translate(1160, 200); scale(kb2); magnifier(-10, -10, 1.1); pop(); }
      const job = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(420 + i * 540, 640); scale(k); paint(rrPts(-220, -220, 440, 440, 30), { fill: INK.paper, ink: INK.navy, sw: 1.3 }); fn(); pop(); };
      job(0, tScr, () => { prCard(-30, -20, 1.3); magnifier(60, 40, 1); });
      job(1, tRel, () => { paint(rectPts(-100, -140, 200, 280), { fill: INK.paper, ink: INK.navy, sw: 1.1 }); for (let i = 0; i < 6; i++) paint(rectPts(-70, -90 + i * 36, 140 - 30 * (i % 2), 12), { fill: INK.navy, tone: .6 }); star(90, -130, 50); });
      job(2, tExp, () => { stampX(-60, 20, 70, stamp(t, tExp - .1)); if (t > tFail - .1) { const k = stamp(t, tFail - .1); push(); translate(70, -60); scale(k); paint(rrPts(-90, -55, 180, 110, 36), { fill: INK.gold }); for (let i = 0; i < 3; i++) paint(ellPts(-40 + i * 40, 0, 12, 12, 12), { fill: INK.navy }); pop(); } });
      pop();
    }
    // a lot of runs; checks on only a few
    if (out > 0) {
      const n = Math.floor(40 * seg(t, tComf - .2, tComf + .9));
      for (let i = 0; i < n; i++) { const c = i % 10, r = Math.floor(i / 10); card(260 + c * 145, 240 + r * 150, 115, 110, [INK.orange, INK.gold, INK.navy, INK.green][(i * 7) % 4], { tone: .8 }); }
      [3, 16, 27, 34].forEach((i, j) => { const c = i % 10, r = Math.floor(i / 10), k = stamp(t, (j < 2 ? tSpot : tFew) - .1 + j * .12); if (k > .01) { magnifier(318 + c * 145, 290 + r * 150, .8 * k, INK.dark); } });
      clawd(1600, 1000, 9, { ...feel('neutral', T), noShadow: false, boilKey: 'runner' });
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- D · the overnight agent: go home, wake to a PR; the guards; cloud products ----------
  function shotOvernight(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('overnight');
    riso({ seed: 144 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    const tOver = wt('overnight', 'overnight'), tTick = wt('overnight', 'ticket'), tHome = wt('overnight', 'home'), tWake = wt('overnight', 'wake'), tPull = wt('overnight', 'pull'),
      tTests = wt('overnight', 'tests'), tScope = wt('overnight', 'scope'), tBr = wt('overnight', 'branch'), tTime = wt('overnight', 'time'), tCloud = wt('overnight', 'cloud'), tSand = wt('overnight', 'sandbox'), tWrit = wt('overnight', 'written');
    const night = ease(seg(t, tHome - .5, tHome + .1)) * (1 - ease(seg(t, tWake + .1, tWake + .6)));
    const stars = night > .3 ? night : 0;
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    if (night > 0) paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.navy, tone: .85 * night });
    if (night > .3) { moon(1500, 200 + 100 * (1 - night), 80); for (let i = 0; i < 12; i++) paint(starPts(100 + i * 150, 80 + 120 * hash(i + 4), 10 + 6 * hash(i), .35, 4), { fill: INK.yellow, tone: stars }); }
    if (t > tWake - .3) { const ks = ease(seg(t, tWake - .3, tWake + .6)); paint(ellPts(1500, lerp(700, 220, ks), 90, 90, 40), { fill: INK.orange, tone: .9, over: true }); }
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    // the desk, the ticket, Clawd working
    paint(rrPts(380, 700, 700, 40, 14), { fill: INK.brown }); paint(rectPts(420, 740, 30, 160), { fill: INK.brown }); paint(rectPts(1010, 740, 30, 160), { fill: INK.brown });
    const kt = stamp(t, Math.min(tTick - .15, b.start + .3));
    if (kt > .01 && t < tWrit - .2) { push(); translate(520, 660); scale(kt); paint(rectPts(-60, -40, 120, 80), { fill: INK.paper, ink: INK.navy, sw: 1 }); check(0, 0, .6, 1, INK.orange); pop(); }
    clawd(800, 700, 11, { ...feel(night > .5 ? 'determined' : t > tPull ? 'proud' : 'happy', T), ...move(night > .5 ? 'bounce' : 'idle', T, 2), boilKey: 'night' });
    // the Skipper goes home, and is back in the morning
    const away = ease(seg(t, tHome - .3, tHome + .7)), back = ease(seg(t, tWake, tWake + .7));
    skipper(lerp(lerp(250, -300, away), 250, back), 1050, 17, skipAct(t, [[b.start, 'point', { mood: 'grin' }], [tHome - .3, 'wave', { mood: 'happy', flip: true }], [tWake, 'stand', { mood: 'happy' }], [tPull, 'cheer', { mood: 'happy' }]]));
    if (t > tPull - .3) { const k = stamp(t, tPull - .3); prCard(980, 630, 1.1 * k); }
    // the guards
    const guard = (i, t0, fn) => { const k = stamp(t, t0 - .12); if (k <= .01) return; push(); translate(1260 + (i % 2) * 220, 440 + Math.floor(i / 2) * 220); scale(k); paint(ellPts(0, 0, 90, 90, 36), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); pop(); };
    const cl = ease(seg(t, tCloud - .3, tCloud + .1));
    if (cl < 1) {
      push(); translate(0, -700 * cl);
      guard(0, tTests, () => check(0, 0, 1.2, 1));
      guard(1, tScope, () => { arcLine(0, 0, 50, 10, INK.navy); paint(ellPts(0, 0, 14, 14, 12), { fill: INK.orange }); });
      guard(2, tBr, () => { inkLine([[-30, 50], [-30, -50]], 1.3, INK.navy, 'ink', 0, { force: true }); inkLine(through([[-30, 20], [10, 0], [30, -40]]), 1.3, INK.orange, 'ink', .5, { force: true }); paint(ellPts(30, -45, 14, 14, 12), { fill: INK.orange }); });
      guard(3, tTime, () => { paint(ellPts(0, 0, 60, 60, 30), { fill: INK.gold }); inkLine([[0, 0], [0, -44]], 1.3, INK.navy, 'ink', 0, { force: true }); inkLine([[0, 0], [30, 10]], 1.3, INK.navy, 'ink', 0, { force: true }); });
      pop();
    }
    if (cl > 0) {
      push(); translate(1450, 600); scale(stamp(t, tCloud - .3));
      paint(rrPts(-200, 20, 400, 200, 20), { fill: INK.gold, tone: .5, over: true });
      for (const [dx, dy, r] of [[-90, 20, 70], [-20, -30, 95], [70, 0, 80], [120, 35, 55], [-140, 45, 45]]) paint(ellPts(dx, dy - 60, r, r * .9, 28), { fill: INK.navy });
      clawd(0, 200, 8, { ...feel('determined', T), ...move('bounce', T, 3), noShadow: true, boilKey: 'sand' });
      loopArrow(0, -60, 70, t * 3, INK.orange, 10);
      pop();
    }
    if (t > tWrit - .2) { const k = stamp(t, tWrit - .2); push(); translate(520, 650); rotate(-.1); scale(k * 1.3); paint(rectPts(-70, -45, 140, 90), { fill: INK.paper, ink: INK.navy, sw: 1 }); inkLine(through([[-50, -15], [-20, -25], [0, 5], [30, -20], [50, 10]]), 1, INK.navy, 'ink', .5, { force: true }); inkLine(through([[-50, 20], [-10, 10], [20, 30], [50, 15]]), 1, INK.navy, 'ink', .5, { force: true }); type('?', 40, -60, 60, INK.orange); pop(); }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · cost: a retry loop over a holiday weekend; four controls ----------
  function shotCost(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('cost');
    riso({ seed: 145 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tStop = wt('cost', 'stop'), tRev = wt('cost', 'review'), tRetry = wt('cost', 'retry'), tHol = wt('cost', 'holiday'), t4 = wt('cost', '4'), tBill = wt('cost', 'bill'),
      tCap = wt('cost', 'cap'), tLim = wt('cost', 'limit'), tSpend = wt('cost', 'spend'), tKill = wt('cost', 'kill');
    const out = ease(seg(t, tCap - .5, tCap - .1));
    if (out < 1) {
      push(); translate(960, 540); scale(1 - out * .4); translate(-960 - 500 * out, -540);
      // nobody at the stop button
      const kb = stamp(t, Math.min(tStop - .2, b.start + .2));
      if (kb > .01) { push(); translate(360, 700); scale(kb * 1.6); paint(rrPts(-110, 0, 220, 70, 14), { fill: INK.navy }); paint(ellPts(0, 0, 90, 40, 30), { fill: INK.orange }); pop(); }
      // a review bot in a retry loop, cloning
      const kr = stamp(t, tRev - .2);
      if (kr > .01) {
        push(); translate(760, 520); scale(kr);
        loopArrow(0, 0, 200, t * (2 + 4 * seg(t, tRetry, tBill)), INK.orange, 20);
        const n = 1 + Math.floor(5 * seg(t, tRetry, tHol + 1));
        for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * TAU / 6 + t * .8; clawd(Math.cos(a) * (i ? 200 : 0), 60 + Math.sin(a) * (i ? 200 : 0), i ? 6 : 10, { ...feel(i ? 'dizzy' : 'determined', T), noShadow: true, boilKey: 'rb' + i }); }
        pop();
      }
      // the holiday weekend
      const kh = stamp(t, tHol - .2);
      if (kh > .01) { push(); translate(1250, 250); scale(kh); paint(rrPts(-170, -110, 340, 220, 16), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-170, -110, 340, 50, 16), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rrPts(-140 + i * 100, -30, 80, 100, 10), { fill: i ? INK.gold : INK.navy, tone: .7 }); pop(); }
      // the bill
      const len = 560 * easeOut(seg(t, t4 - .5, t4));
      if (len > 2) { const P = [[1350, 380], [1650, 380], [1650, 380 + len]]; for (let i = 0; i <= 10; i++) P.push([1650 - i * 30, 380 + len + (i % 2 ? 16 : 0)]); paint(P, { fill: INK.paper, ink: INK.navy, sw: 1.1 }); }
      if (t > t4 - .05) { const k = stamp(t, t4 - .05, .35); push(); translate(1500, 680); rotate(-.1); scale(k); type('$4,000', 0, 0, 90, INK.orange); type('$4,000', 6, 6, 90, INK.navy, { over: true, tone: .5 }); pop(); }
      pop();
    }
    // four controls
    const ctl = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(900 + (i % 2) * 420, 300 + Math.floor(i / 2) * 400); scale(k); paint(ellPts(0, 0, 160, 160, 48), { fill: INK.paper, ink: INK.navy, sw: 1.3 }); fn(); pop(); };
    if (out > 0) {
      ctl(0, tCap, () => { arcLine(0, 20, 100, 22, 'yellow', { a0: Math.PI, a1: Math.PI * 1.6 }); arcLine(0, 20, 100, 22, INK.orange, { a0: Math.PI * 1.6, a1: TAU, over: true }); paint(rectPts(80, -40, 50, 16), { fill: INK.navy }); inkLine([[0, 20], [-60, -50]], 1.8, INK.navy, 'ink', 0, { force: true }); });
      ctl(1, tLim, () => { for (let r = 0; r < 2; r++) { paint(rrPts(-110, -50 + r * 60, 220, 36, 18), { fill: INK.green, tone: .6 }); card(-100 + 60 * frac(t * .5 + r * .5), -48 + r * 60, 60, 32, INK.orange, { bars: false }); } paint(rectPts(80, -70, 14, 140), { fill: INK.navy }); });
      ctl(2, tSpend, () => { const s = Math.sin(t * 16) * .15 * (t > tSpend && t < tSpend + 1); push(); rotate(s); paint(through([[-60, 50], [-50, -10], [-30, -60], [0, -75], [30, -60], [50, -10], [60, 50]]), { fill: INK.gold }); paint(rrPts(-80, 40, 160, 20, 10), { fill: INK.gold }); paint(ellPts(0, 75, 16, 16, 12), { fill: INK.navy }); pop(); });
      ctl(3, tKill, () => { const lv = backOut(seg(t, tKill + .1, tKill + .5)); paint(rrPts(-60, 40, 120, 60, 12), { fill: INK.navy }); push(); translate(0, 50); rotate(-.7 + 1.4 * lv); paint(rrPts(-10, -120, 20, 120, 10), { fill: INK.dark }); paint(ellPts(0, -125, 28, 28, 20), { fill: INK.orange }); pop(); });
      clawd(1620, 1000, 12, { ...feel(t > tKill + .4 ? 'relieved' : 'nervous', T), flip: true, boilKey: 'costc' });
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- F · review: tests check behaviour, not intent; auto-merge only the trivial ----------
  function shotReview(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('review');
    riso({ seed: 146 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tHum = wt('review', 'human'), tTest = wt('review', 'test'), tInt = wt('review', 'intent'), tNext = wt('review', 'next'), tFive = wt('review', 'five'), tAuto = wt('review', 'auto'), tTriv = wt('review', 'trivial');
    const gate = ease(seg(t, tAuto - .5, tAuto - .1));
    if (gate < 1) {
      push(); translate(960, 540); scale(1 - gate); translate(-960, -540);
      const kp = stamp(t, b.start + .1);
      if (kp > .01) { push(); translate(700, 460); scale(kp * 2.2); prCard(0, 0, 1); pop(); for (let i = 0; i < 3; i++) check(560 + i * 140, 700, 1, stamp(t, tTest - .1 + i * .12)); }
      // intent: the approach leans; the next feature's block sits crooked on top
      const ki = stamp(t, tInt - .15);
      if (ki > .01) { const lean = .16 * ease(seg(t, tNext - .1, tNext + .5)); push(); translate(1320, 900); scale(ki); rotate(lean); paint(rectPts(-120, -240, 240, 240), { fill: INK.navy, tone: .75 }); push(); translate(0, -240); rotate(lean * 1.5); if (t > tNext - .2) paint(rectPts(-100, -180 * stamp(t, tNext - .2), 200, 180 * stamp(t, tNext - .2)), { fill: INK.orange }); pop(); pop(); }
      // five minutes of review
      const kS = stamp(t, Math.min(tHum - .3, b.start + .4));
      skipper(lerp(-300, 260, easeOut(kS)), 1060, 17, skipAct(t, [[b.start, 'point', { mood: 'focused' }], [tInt, 'think', { mood: 'thinking' }], [tFive, 'present', { mood: 'grin' }]]));
      const kf = stamp(t, tFive - .15);
      if (kf > .01) { push(); translate(360, 330); scale(kf); paint(rrPts(-18, -140, 36, 36, 8), { fill: INK.navy }); paint(ellPts(0, 0, 100, 100, 44), { fill: INK.gold }); paint(ellPts(0, 0, 80, 80, 40), { fill: INK.paper }); paint([[0, 0], ...Array.from({ length: 11 }, (_, i) => { const a = -Math.PI / 2 + i / 10 * TAU * (5 / 60) * ease(seg(t, tFive, tFive + .6)) * 6; return [Math.cos(a) * 70, Math.sin(a) * 70]; })], { fill: INK.orange, over: true }); pop(); }
      pop();
    }
    // the gate: trivial changes pass, the big one waits
    if (gate > 0) {
      paint(rectPts(940, 420, 40, 520), { fill: INK.navy });
      paint(rrPts(200, 880, 1520, 60, 20), { fill: INK.dark, tone: .7 });
      for (let i = 0; i < 4; i++) { const f = frac((t - tAuto) * .45 + i / 4); card(220 + 1300 * f, 820, 70, 56, INK.green, { bars: false }); }
      const big = lerp(200, 700, ease(seg(t, tAuto, tTriv + .3)));
      card(big, 560, 220, 260, INK.orange);
      if (t > tTriv) stampX(big + 110, 690, 90, stamp(t, tTriv + .2), INK.navy);
      skipper(1400, 1060, 17, { ...SKIP_POSES.hips, mood: 'grin', t, flip: true });
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- G · untrusted input: anyone writes the text; secrets + a write token ----------
  function shotUntrusted(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('untrusted');
    riso({ seed: 147 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tPub = wt('untrusted', 'public'), tAny = wt('untrusted', 'anyone'), tDesc = wt('untrusted', 'description'), tInst = wt('untrusted', 'instructions'), tSec = wt('untrusted', 'secrets'),
      tTok = wt('untrusted', 'token'), tStr = wt('untrusted', 'stranger'), tKeys = wt('untrusted', 'keys'), tAsk = wt('untrusted', 'ask');
    // the public repo: an open door and a globe
    const kp = stamp(t, Math.min(tPub - .2, b.start + .2));
    if (kp > .01) { push(); translate(420, 900); scale(kp); paint(rectPts(-200, -520, 400, 520), { fill: INK.navy, tone: .3 }); paint(rectPts(-110, -330, 220, 330), { fill: INK.yellow, tone: .5 }); paint([[-110, -330], [-40, -300], [-40, 30], [-110, 0]], { fill: INK.navy }); paint(ellPts(0, -440, 60, 60, 30), { fill: INK.green, tone: .7 }); arcLine(0, -440, 60, 6, INK.navy); pop(); }
    // Clawd with an inbox; notes fly in from everywhere
    clawd(1200, 900, 14, { ...emotions(t, [[b.start, 'neutral'], [tInst, 'confused'], [tStr, 'scared']]), boilKey: 'inbox' });
    paint(rrPts(1340, 760, 200, 140, 14), { fill: INK.gold });
    if (t > tAny - .2) for (let i = 0; i < 6; i++) { const f = seg(t, tAny - .2 + i * .25, tAny + .6 + i * .25); if (f <= 0 || f >= 1) continue; const p = arcPt([[200, 150], [960, -80], [1900, 200], [1800, 100], [600, 50], [1300, -60]][i], [1440, 790], 120, ease(f)); push(); translate(p[0], p[1]); rotate(f * 2 + i); paint(rectPts(-40, -30, 80, 60), { fill: INK.paper, ink: INK.navy, sw: .8 }); pop(); }
    // a PR description with a hidden instruction
    const kd = stamp(t, tDesc - .2);
    if (kd > .01) { push(); translate(960, 330); scale(kd); paint(rectPts(-200, -150, 400, 300), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 6; i++) paint(rectPts(-160, -110 + i * 44, 300 - 50 * (i % 3), 14), { fill: i === 4 && t > tInst ? INK.orange : INK.navy, tone: i === 4 && t > tInst ? 1 : .5 }); if (t > tInst) glow(0, 66, 180 * stamp(t, tInst), 'orange', .45); pop(); }
    // secrets and a write token; a stranger's hand takes them
    const grab = ease(seg(t, tStr - .2, tKeys + .2));
    const ks = stamp(t, tSec - .15), kt = stamp(t, tTok - .15);
    if (ks > .01) keyShape(lerp(1560, 1900, grab), lerp(520, 300, grab), ks * 1.2);
    if (kt > .01) { push(); translate(lerp(1640, 1980, grab), lerp(660, 440, grab)); scale(kt); paint(rrPts(-70, -45, 140, 90, 14), { fill: INK.green }); paint(rectPts(-40, -10, 80, 20), { fill: INK.paper }); pop(); }
    if (t > tStr - .6) { const k = ease(seg(t, tStr - .6, tStr - .1)); const hx = lerp(2200, 1720, k) + 340 * grab, hy = lerp(300, 520, k) - 220 * grab; paint(rrPts(hx - 30, hy - 40, 400, 80, 40), { fill: INK.dark }); paint(ellPts(hx, hy, 70, 60, 24), { fill: INK.dark }); }
    // ask: who writes the text it reads?
    const kS = stamp(t, tAsk - .4);
    if (kS > .01) { skipper(lerp(-300, 360, easeOut(seg(t, tAsk - .4, tAsk + .3))), 1060, 17, skipAct(t, [[tAsk - .4, 'think', { mood: 'thinking' }], [tAsk + .5, 'pointUp', { mood: 'focused' }]])); type('?', 700, 560, 200 * stamp(t, tAsk + .3), INK.orange); }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · deploys: agents watch and recommend; humans (or boring rules) act ----------
  function shotDeploy(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('deploy');
    riso({ seed: 148 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tProd = wt('deploy', 'production'), tWatch = wt('deploy', 'watch'), tErr = wt('deploy', 'error'), tLat = wt('deploy', 'latency'), tRec = wt('deploy', 'recommend'),
      tRb = wt('deploy', 'rollback', 1), tHum = wt('deploy', 'human'), tBor = wt('deploy', 'boring'), tRead = wt('deploy', 'read');
    // the dashboard
    const kd = stamp(t, Math.min(tProd - .2, b.start + .2));
    if (kd > .01) {
      push(); translate(760, 420); scale(kd);
      paint(rrPts(-520, -300, 1040, 600, 30), { fill: INK.navy });
      const ke = ease(seg(t, tErr - .2, tErr + 1));
      const P = []; for (let i = 0; i <= 20; i++) { const x = -460 + i * 20 * (ke > 0 ? 1 : 0) + (1 - ke) * 0; if (i / 20 > ke) break; P.push([-460 + i * 21, 40 - 60 * hash(i + 3) * .5 - (i > 14 ? (i - 14) * 30 : 0)]); }
      if (P.length > 1) inkLine(P, 2, INK.orange, 'ink', 0, { force: true });
      for (let i = 0; i < 6; i++) { const h = (60 + 90 * hash(i + 11)) * ease(seg(t, tLat - .1 + i * .06, tLat + .3 + i * .06)); paint(rectPts(80 + i * 64, 240 - h, 44, h), { fill: INK.gold }); }
      paint(rectPts(-480, 130, 960, 4), { fill: INK.paper, tone: .5 });
      pop();
    }
    // Clawd watches, then recommends a rollback
    const kc = stamp(t, tWatch - .2);
    if (kc > .01) {
      clawd(1330, 940, 13, { ...feel(t > tRec ? 'determined' : 'thinking', T), flip: true, boilKey: 'watcher' });
      if (t < tRec) magnifier(1220, 700, 1.1);
      else { const k = stamp(t, tRec - .1); push(); translate(1330, 640); scale(k); paint(rrPts(-120, -90, 240, 180, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); arcLine(0, 10, 50, 16, INK.orange, { a0: -Math.PI * .1, a1: Math.PI * 1.3 }); paint([[-54, -30], [-24, -10], [-60, 10]], { fill: INK.orange }); pop(); }
    }
    // the human's lever; the boring rule; read-only production
    const kS = stamp(t, tHum - .4);
    if (kS > .01) {
      const lv = backOut(seg(t, tHum + .2, tHum + .6));
      push(); translate(1760, 1000); paint(rrPts(-40, -60, 80, 60, 10), { fill: INK.navy }); push(); translate(0, -40); rotate(-.6 + .9 * lv); paint(rrPts(-10, -170, 20, 170, 10), { fill: INK.dark }); paint(ellPts(0, -175, 30, 30, 20), { fill: INK.orange }); pop(); pop();
      skipper(lerp(2200, 1640, easeOut(seg(t, tHum - .4, tHum + .2))), 1060, 17, { ...SKIP_POSES.point, mood: 'focused', t, flip: true });
    }
    const kb = stamp(t, tBor - .15);
    if (kb > .01) { push(); translate(360, 900); rotate(-.08); scale(kb); paint(rrPts(-140, -100, 280, 190, 14), { fill: INK.brown }); paint(rrPts(-120, -84, 240, 160, 10), { fill: INK.paper }); paint(rectPts(-100, -10, 200, 8), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rectPts(-100, -60 + i * 20 + (i > 1 ? 50 : 0), 150, 6), { fill: INK.navy, tone: .6 }); pop(); }
    const kr = stamp(t, tRead - .15);
    if (kr > .01) { push(); translate(1270, 170); scale(kr); arcLine(0, -40, 34, 14, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(-55, -40, 110, 90, 14), { fill: INK.gold }); paint(ellPts(0, 0, 12, 12, 14), { fill: INK.navy }); pop(); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- I · start small: one step at a time; stronger nets; next, your own agents ----------
  function shotSmall(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('small');
    riso({ seed: 149 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 900], to: [0, 0], a: .5, b: .1 } });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tOne = wt('small', 'one'), tTwo = wt('small', 'two'), tMonth = wt('small', 'month'), tThree = wt('small', 'three'), tBuild = wt('small', 'builds'), tSafe = wt('small', 'safety'), tNext = wt('small', 'building');
    const T4 = [tOne, tTwo, tMonth, tThree], SX = [500, 800, 1100, 1400], SH = [140, 280, 420, 560];
    // the steps
    for (let i = 0; i < 4; i++) {
      const k = stamp(t, Math.min(T4[i] - .3, b.start + .2 + i * .12)); if (k <= .01) continue;
      const lit = t > tBuild ? 1 : 0;
      paint(rectPts(SX[i] - 150, 960 - SH[i] * k, 300, SH[i] * k), { fill: [INK.gold, INK.orange, INK.green, INK.navy][i], tone: .55 + .35 * lit });
      const ki = stamp(t, T4[i] - .15); if (ki <= .01) continue;
      push(); translate(SX[i], 960 - SH[i] - 250); scale(ki);
      if (i === 0) { paint(rrPts(-20, -60, 40, 90, 10), { fill: INK.brown }); paint(rrPts(-40, 30, 80, 50, 10), { fill: INK.navy }); }
      if (i === 1) { paint(rrPts(-80, -50, 160, 100, 34), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let j = 0; j < 3; j++) paint(ellPts(-40 + j * 40, 0, 10, 10, 10), { fill: INK.orange }); }
      if (i === 2) { paint(rectPts(-55, -70, 110, 140), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let j = 0; j < 4; j++) paint(rectPts(-35, -45 + j * 28, 70, 9), { fill: INK.navy, tone: .6 }); }
      if (i === 3) moon(0, 0, 60);
      pop();
    }
    // Clawd climbs a step on each word
    let step = -1; T4.forEach((x, i) => { if (t > x) step = i; });
    const tp = step < 0 ? b.start : T4[step], hop = seg(t, tp, tp + .45), prevX = step <= 0 ? 260 : SX[step - 1], prevY = step <= 0 ? 960 : 960 - SH[step - 1];
    const cx = step < 0 ? 260 : lerp(prevX, SX[step], ease(hop)), cy = step < 0 ? 960 : lerp(prevY, 960 - SH[step], ease(hop)) - 120 * Math.sin(Math.PI * hop);
    clawd(cx, cy, 10, { ...feel(step >= 3 ? 'proud' : 'determined', T), boilKey: 'climber' });
    // a safety net under it all
    const kn = ease(seg(t, tSafe - .2, tSafe + .4));
    if (kn > 0) { const P = []; for (let i = 0; i <= 20; i++) P.push([300 + i * 70 * kn, 1000 + 30 * Math.sin(i / 20 * Math.PI)]); inkLine(P, 1.4, INK.paper, 'ink', 0, { force: true }); for (let i = 0; i <= 20; i += 2) inkLine([[300 + i * 70 * kn, 960], [300 + i * 70 * kn, 1010]], .8, INK.paper, 'ink', 0, { force: true }); }
    // next: building your own
    if (t > tNext - .2) for (let i = 0; i < 3; i++) { const k = backOut(seg(t, tNext - .2 + i * .15, tNext + .2 + i * .15)); if (k > 0) paint(rrPts(1600 - 60 + (i === 2 ? 60 : i * 120) - 60, 960 - 100 * (i === 2 ? 2 : 1) - 400 * (1 - k), 110, 96, 12), { fill: [INK.orange, INK.green, INK.gold][i] }); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { identLong(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '15', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotLintIn(T0, lt, dur) { shotLint(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('lint', 0), shotLintIn],
    [shotAt('dark'), shotDark],
    [shotAt('steps'), shotSteps],
    [shotAt('overnight'), shotOvernight],
    [shotAt('cost'), shotCost],
    [shotAt('review'), shotReview],
    [shotAt('untrusted'), shotUntrusted],
    [shotAt('deploy'), shotDeploy],
    [shotAt('small'), shotSmall],
    [B.small.end + .9, shotEnd],
  ]);
})();
