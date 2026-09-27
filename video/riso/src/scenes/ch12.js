// ch12.js: Chapter 12 · Local, Commercial, and Hybrid Models. Storyboard: video/storyboards/ch12.md
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

  // ---------- A · the bill: eight engineers, nobody watching; meanwhile, patient data can't leave ----------
  function shotBill(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('bill');
    riso({ seed: 121 });
    const tEight = wt('bill', 'eight'), tMeter = wt('bill', 'meter'), tBill = wt('bill', 'bill'), t22 = wt('bill', '2'), tMean = wt('bill', 'meanwhile'),
      tHealth = wt('bill', 'healthcare'), tPat = wt('bill', 'patient'), tOuts = wt('bill', 'outside'), tLocal = wt('bill', 'local');
    const pan = ease(seg(t, tMean - .2, tMean + .8));
    const zin = 1 - ease(seg(t, tMeter - .6, tMeter + .2));
    camBegin(lerp(960, 735, zin) + 1920 * pan, lerp(540, 850, zin), 1.02 + .58 * zin);
    paint(rectPts(-200, -200, W * 2 + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W * 2 + 400, 400), { fill: INK.navy, tone: .8 });
    // eight Clawds at laptops, stamping in one by one
    for (let i = 0; i < 8; i++) {
      const x = 170 + i * 150, k = stamp(t, tEight - .35 + i * .06);
      if (k <= .01) continue;
      push(); translate(x, 900); scale(k);
      clawd(-34, 0, 9, { ...emotions(t, [[b.start, 'happy'], [t22 - .05, 'surprised'], [t22 + .9, 'nervous']]), ...(t < t22 ? move('bounce', T, i) : jump(t, t22 + i * .03, t22 + .4 + i * .03, 2)), boilKey: 'c' + i });
      laptop(50, 0, .18);
      pop();
    }
    // the meter: nobody is watching it, it spins
    const km = stamp(t, tMeter - .25);
    if (km > .01) {
      push(); translate(620, 380); scale(km);
      paint(ellPts(0, 0, 190, 190, 60), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      arcLine(0, 0, 150, 26, 'yellow', { a0: Math.PI * .8, a1: Math.PI * 1.6 });
      arcLine(0, 0, 150, 26, INK.orange, { a0: Math.PI * 1.6, a1: Math.PI * 2.2, over: true });
      const spin = t > tMeter ? (t - tMeter) * 7 : 0, a = Math.PI * .8 + (spin % (Math.PI * 1.4));
      inkLine([[0, 0], [Math.cos(a) * 140, Math.sin(a) * 140]], 2.2, INK.navy, 'ink', 0, { force: true });
      paint(ellPts(0, 0, 22, 22, 16), { fill: INK.navy });
      pop();
    }
    // the bill unrolls; the number stamps on it
    const len = 720 * easeOut(seg(t, tBill - .2, tBill + .5));
    receipt(1540, 60, 400, len, 3);
    if (t > t22 - .1) { const k = stamp(t, t22 - .1, .35); push(); translate(1540, 520); rotate(-.08); scale(k); type('$2,200', 0, 0, 110, INK.orange); type('$2,200', 7, 7, 110, INK.navy, { over: true, tone: .5 }); pop(); }
    // meanwhile: a hospital, a cloud it may not use, a local model at its door
    const HX = 1920 + 820;
    paint(rrPts(HX - 330, 330, 660, 570, 20), { fill: INK.paper, ink: INK.navy, sw: 1.3 });
    paint(rectPts(HX - 330, 330, 660, 70), { fill: INK.navy });
    paint(rectPts(HX - 22, 250, 44, 110), { fill: INK.orange }); paint(rectPts(HX - 55, 283, 110, 44), { fill: INK.orange });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) paint(rrPts(HX - 280 + c * 140, 450 + r * 150, 90, 90, 10), { fill: INK.navy, tone: .35 });
    const kp = stamp(t, tPat - .1);
    if (kp > .01) { glow(HX - 95, 495, 110 * kp, 'yellow', .8); heart(HX - 95, 495, 34 * kp); }
    const kc = stamp(t, tHealth);
    if (kc > .01) {
      push(); translate(1920 + 1560, 330); scale(kc); cloud(0, 0, 1, INK.navy); pop();
      for (let i = 0; i < 6; i++) paint(rectPts(HX + 340 + i * 70, 520 - i * 25, 40, 12), { fill: INK.navy, tone: .6 });
      stampX(1920 + 1560, 340, 120, stamp(t, tOuts + .1));
    }
    const kl = stamp(t, tLocal - .2);
    if (kl > .01) { push(); translate(HX + 460, 900); scale(kl); glow(0, -150, 300, 'yellow', .8); laptop(0, -10, 1.1); clawd(0, -70, 10, { ...feel('determined', T), noShadow: true }); pop(); }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · where does the model run? trust, cost, capability ----------
  function shotWhere(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('where');
    riso({ seed: 122 });
    camBegin(960, 540, 1 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tWhere = wt('where', 'where'), tRun = wt('where', 'run'), tInfra = wt('where', 'infrastructure'), tDec = wt('where', 'decision'),
      tTrust = wt('where', 'trust'), tCost = wt('where', 'cost'), tCap = wt('where', 'capability');
    // two places: a cloud and a laptop
    const k1 = stamp(t, b.start), k2 = stamp(t, b.start + .25);
    if (k1 > .01) { push(); translate(330, 420); scale(k1); cloud(0, 0, 1.05, INK.navy); pop(); }
    if (k2 > .01) { push(); translate(1590, 520); scale(k2); laptop(0, 0, 1); pop(); }
    // the pin: Clawd in its head
    const kp = stamp(t, tWhere - .15, .4);
    if (kp > .01) {
      push(); translate(960, 330 + 30 * wob(T, .5)); scale(kp);
      arcLine(0, 440, 150, 20, 'yellow', {});
      paint([[-150, 30], [150, 30], [0, 420]], { fill: INK.orange, curv: .1 });
      paint(ellPts(0, 0, 200, 200, 64), { fill: INK.orange });
      paint(ellPts(0, 0, 150, 150, 56), { fill: INK.paper });
      const look = t < tInfra ? Math.sin((t - tWhere) * 3) : 0;
      clawd(0, 70, 14, { ...feel(t > tDec ? 'thinking' : 'neutral', T), lookX: look, noShadow: true });
      pop();
      paint(ellPts(960, 770, 190, 50, 40), { fill: 'yellow', tone: .8, over: true });   // the pin's ground ring, overprinted
    }
    // "infrastructure": a server rack drops in, then falls away at "decision"
    const kr = stamp(t, tInfra - .1) * (1 - easeIn(seg(t, tDec - .1, tDec + .3)));
    if (kr > .01) { push(); translate(960, 880 + 200 * seg(t, tDec - .1, tDec + .3)); scale(kr); for (let i = 0; i < 2; i++) { paint(rrPts(-210, -110 + i * 90, 420, 76, 12), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(ellPts(-170 + j * 30, -72 + i * 90, 9, 9, 10), { fill: j === 0 ? INK.green : INK.yellow }); } pop(); }
    // the three things it's really about
    const icon = (x, t0, fn) => { const k = stamp(t, t0 - .1); if (k <= .01) return; push(); translate(x, 950); scale(k); paint(ellPts(0, 0, 90, 90, 40), { fill: INK.navy }); fn(); pop(); };
    icon(560, tTrust, () => lock(0, 20, .7));
    icon(960, tCost, () => coin(0, 0, 56));
    icon(1360, tCap, () => star(0, 0, 62));
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 400 });
  }

  // ---------- C · the frontier: reasoning, tools, staying in the lines; context rot ----------
  function shotFrontier(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('frontier');
    riso({ seed: 123 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tFront = wt('frontier', 'frontier'), tReas = wt('frontier', 'reasoning'), tTools = wt('frontier', 'tools'), tLines = wt('frontier', 'lines'),
      tCtx = wt('frontier', 'context'), t80 = wt('frontier', '80'), t20 = wt('frontier', '20', -1);
    const sink = ease(seg(t, tCtx - .4, tCtx + .3));
    // the mountains, with Clawd on the summit
    if (sink < 1) {
      push(); translate(0, 800 * sink);
      mountain(420, 1000, 900, 520, INK.navy, { tone: .55 });
      mountain(1500, 1000, 1000, 480, INK.navy, { tone: .55 });
      mountain(960, 1000, 1000, 680, INK.navy);
      mountain(1160, 1000, 700, 420, INK.green, { over: true, tone: .8 });
      const kf = stamp(t, tFront - .1);
      if (kf > .01) { inkLine([[1010, 330], [1010, 330 - 190 * kf]], 1.4, INK.dark, 'ink', 0, { force: true }); paint([[1010, 330 - 190 * kf], [1110, 300 - 190 * kf + 20], [1010, 250 - 190 * kf + 40]], { fill: INK.gold }); }
      clawd(930, 330, 12, { ...emotions(t, [[b.start, 'happy'], [tFront, 'proud'], [tReas, 'idea'], [tTools + .4, 'determined']]), emote: t > tReas && t < tTools ? 'bulb' : undefined, emoteK: stamp(t, tReas), emoteAge: t - tReas });
      // tools: three cards click in with checks
      for (let i = 0; i < 3; i++) { const t0 = tTools + i * .2, k = stamp(t, t0 - .1); if (k <= .01) continue; const x = 1340 + i * 170, y = 200; push(); translate(x, y); scale(k); card(-70, -55, 140, 110, [INK.orange, INK.gold, INK.navy][i]); check(40, -40, .7, stamp(t, t0 + .25)); pop(); }
      // stays in the lines
      const kl = ease(seg(t, tLines - .1, tLines + .5));
      if (kl > 0) for (const x of [820, 1040]) paint(rectPts(x - 7, 330 - 260 * kl, 14, 260 * kl), { fill: INK.orange, over: true });
      pop();
    }
    // two context windows: 80% full and 20% full
    if (sink > 0) {
      const win = (x, t0, full, mood, tf = t0) => {
        const k = stamp(t, tCtx + (x > 960 ? .2 : 0)) * sink; if (k <= .01) return;
        push(); translate(x, 520); scale(k);
        paint(rrPts(-260, -300, 520, 520, 26), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
        paint(rrPts(-260, -300, 520, 50, 20), { fill: INK.navy });
        const f = full * ease(seg(t, tf - .5, tf + .3)), hh = 440 * f;
        paint(rectPts(-230, 200 - hh, 460, hh), { fill: INK.orange, tone: .85 });
        for (let i = 0; i < Math.floor(f * 10); i++) paint(rrPts(-200, 200 - 44 * (i + 1) + 8, 260 + 100 * hash(i + x), 20, 10), { fill: INK.navy, tone: .5, over: true });
        pop();
        if (t > t0 - .2) { const kt = stamp(t, t0 - .1); type(Math.round(full * 100) + '%', x, 125, 110 * kt, INK.navy); }
        clawd(x, 1000, 13, { ...feel(t > t0 ? mood : 'neutral', T), emote: t > t0 && mood === 'dizzy' ? 'swirl' : undefined, emoteK: stamp(t, t0), emoteAge: t - t0, boilKey: 'w' + x });
      };
      win(560, t80, .8, 'dizzy');
      win(1360, t20, .2, 'determined', t80 + .6);
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 400 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- D · local: nothing leaves, every token free; but the hardware, and the drift ----------
  function shotLocal(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('local');
    riso({ seed: 124 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .75 });
    const tLeave = wt('local', 'leaves'), tMach = wt('local', 'machine'), tFree = wt('local', 'free'), tHard = wt('local', 'hardware'), tMem = wt('local', 'memory'),
      tLong = wt('local', 'long'), tDrift = wt('local', 'drift'), tPlan = wt('local', 'plan');
    const side = ease(seg(t, tHard - .3, tHard + .3));
    const LX = lerp(900, 560, side), LY = lerp(720, 600, side), LS = lerp(2.1, 1.4, side);
    // the laptop with Clawd on its screen
    const kl = stamp(t, b.start, .4);
    if (kl > .01) {
      push(); translate(LX, LY); scale(LS * kl);
      laptop(0, 0, 1, { tone: .45 });
      clawd(0, -40, 9, { ...feel(t > tFree ? 'happy' : 'neutral', T), noShadow: true });
      // a file tries to leave and bounces back
      if (t > tLeave - .4 && t < tLeave + 1) { const k = seg(t, tLeave - .4, tLeave + 1), x = 60 + 170 * Math.sin(Math.PI * Math.min(1, k * 1.4)); fileIcon(x, -110, .45); if (k > .3 && k < .5) for (let i = 0; i < 4; i++) paint(ribbon([[150, -150 + i * 25], [175, -160 + i * 30]], 6), { fill: INK.orange }); }
      const kk = stamp(t, tMach - .1); if (kk > .01) { push(); translate(140, -180); scale(kk); lock(0, 0, .7, ease(seg(t, tMach, tMach + .3))); pop(); }
      pop();
    }
    // free: a $0 tag
    const kf = stamp(t, tFree - .1) * (1 - side);
    if (kf > .01) { push(); translate(1560, 300); rotate(.12); scale(kf * 1.2); paint([[-150, -70], [110, -70], [170, 0], [110, 70], [-150, 70]], { fill: INK.orange }); paint(ellPts(120, 0, 14, 14, 12), { fill: INK.paper }); type('$0', -20, 4, 96, INK.navy); pop(); }
    // hardware: memory sticks stamp in, then stack tall
    if (side > 0) {
      const n = 1 + Math.floor(5 * seg(t, tMem - .1, tMem + .7));
      for (let i = 0; i < n; i++) { const k = stamp(t, (i === 0 ? tHard - .1 : tMem - .1 + i * .14)); if (k <= .01) continue; push(); translate(1380, 700 - i * 100); rotate(.04 * (hash(i) - .5)); scale(k); ram(0, 0, 1.1, i % 2 ? INK.green : INK.gold); pop(); }
    }
    // the drift: a dashed plan across the floor; Clawd walks it, veers off, the plan blows away
    if (t > tLong - .2) {
      const k = ease(seg(t, tLong - .2, tLong + .4));
      for (let i = 0; i < 18; i++) if (i / 18 < k) paint(rrPts(120 + i * 95, 1000, 55, 14, 7), { fill: INK.yellow });
      const walk = seg(t, tLong, tDrift), off = ease(seg(t, tDrift, tDrift + .8));
      const cx = lerp(160, 900, walk) + 260 * off, cy = 1000 - 0 * off + 60 * off;
      clawd(cx, cy, 11, { ...emotions(t, [[tLong, 'determined'], [tDrift + .2, 'confused']]), ...move(off < 1 ? 'walk' : 'idle', T, 2), rot: .25 * off, boilKey: 'walker' });
      if (t > tLong) { const fly = ease(seg(t, tPlan - .1, tPlan + .9)), p = arcPt([cx + 40, cy - 110], [cx + 700, 200], 180, fly); push(); translate(p[0], p[1]); rotate(fly * 5); paint(rectPts(-36, -46, 72, 92), { fill: INK.paper, ink: INK.navy, sw: .8 }); for (let i = 0; i < 3; i++) paint(rectPts(-24, -26 + i * 20, 48, 6), { fill: INK.orange }); pop(); }
    }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · cost: the conversation re-sent every step; limits; the 3 a.m. loop ----------
  function shotCost(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('cost');
    riso({ seed: 125 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tWork = wt('cost', 'working'), tStep = wt('cost', 'step'), tRes = wt('cost', 'resends'), tThou = wt('cost', 'thousands'), tLim = wt('cost', 'limits'),
      tScope = wt('cost', 'scope'), tCap = wt('cost', 'cap'), tStops = wt('cost', 'stops'), tPipe = wt('cost', 'pipeline'), tLoop = wt('cost', 'loop'), t3 = wt('cost', '3'), tBill = wt('cost', 'bill');
    // Clawd at work; the stack of re-sent conversation grows each step
    clawd(560, 940, 15, { ...emotions(t, [[b.start, 'determined'], [tThou, 'nervous'], [tLim + .3, 'relieved']]), ...move(t < tLim ? 'bounce' : 'idle', T, 3), boilKey: 'worker', flip: true });
    laptop(800, 940, .55);
    const n = Math.min(14, Math.floor(1 + 3 * seg(t, tWork, tStep + .3) + 5 * seg(t, tRes, tRes + 1.5) + 7 * seg(t, tThou - 1.2, tThou + .3)));
    for (let i = 0; i < n; i++) { const k = stamp(t, tWork + i * .05, .2); paint(rrPts(200 - 5 * (i % 2), 900 - (i + 1) * 52, 240, 44, 10), { fill: [INK.orange, INK.gold, INK.paper][i % 3], ink: INK.navy, sw: .7, tone: k }); }
    // tokens fly from the work onto the stack
    if (t < tLim) for (let i = 0; i < 4; i++) { const f = frac((t - b.start) * 1.2 + i / 4), top = 900 - n * 52; const p = arcPt([760, 820], [320, top - 30], 160, f); coin(p[0], p[1], 20); }
    // the lid: a limit slams onto the stack
    if (t > tLim - .2) { const k = backOut(seg(t, tLim - .2, tLim + .2)); const top = 900 - (n + 1) * 52; paint(rrPts(170, lerp(-100, top - 20, k), 300, 40, 14), { fill: INK.navy }); }
    // three limit badges
    const badge = (x, t0, fn) => { const k = stamp(t, t0 - .1); if (k <= .01) return; push(); translate(x, 230); scale(k); paint(ellPts(0, 0, 100, 100, 40), { fill: INK.paper, ink: INK.navy, sw: 1.3 }); fn(); pop(); };
    badge(1080, tScope, () => { arcLine(0, 0, 60, 12, INK.navy); inkLine([[-80, 0], [80, 0]], 1.2, INK.navy, 'ink', 0, { force: true }); inkLine([[0, -80], [0, 80]], 1.2, INK.navy, 'ink', 0, { force: true }); paint(ellPts(0, 0, 16, 16, 12), { fill: INK.orange }); });
    badge(1370, tCap, () => { for (let i = 0; i < 5; i++) paint(rrPts(-60 + i * 26, -30, 16, 60, 8), { fill: i < 3 ? INK.navy : INK.orange, tone: i < 3 ? 1 : .5 }); });
    badge(1660, tStops, () => { const P = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * TAU / 8; P.push([Math.cos(a) * 70, Math.sin(a) * 70]); } paint(P, { fill: INK.orange }); paint(rectPts(-40, -9, 80, 18), { fill: INK.paper }); });
    // the pipeline at night: an agent in a retry loop, 3 a.m., the surprise bill
    const kn = stamp(t, tPipe - .2, .4);
    if (kn > .01) {
      push(); translate(1370, 650); scale(kn);
      paint(rrPts(-430, -250, 860, 500, 30), { fill: INK.navy });
      for (let i = 0; i < 9; i++) paint(starPts(-380 + i * 95, -200 + 40 * hash(i + 3), 8 + 6 * hash(i), .35, 4), { fill: INK.yellow, tone: .8 });
      paint(rectPts(-430, 120, 860, 30), { fill: INK.brown });
      const lk = stamp(t, tLoop - .15);
      if (lk > .01) { push(); translate(-240, 10); scale(lk); loopArrow(0, 0, 130, t * 4, INK.orange, 16); clawd(0, 80, 8, { ...feel('dizzy', T), noShadow: true, boilKey: 'looper', rot: .1 * Math.sin(t * 8) }); pop(); }
      const kc = stamp(t, t3 - .1); if (kc > .01) { push(); translate(90, -40); scale(kc); clock(0, 0, 90, 3); pop(); }
      pop();
      const len = 470 * easeOut(seg(t, tBill - .3, tBill + .3));
      receipt(1700, 380, 200, len, 5);
      if (len > 400) { push(); translate(1700, 700); rotate(-.1); type('!', 0, 0, 120 * stamp(t, tBill + .2), INK.orange); pop(); }
    }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 620 });
  }

  // ---------- F · the return: felt faster, measured slower; measure outcomes ----------
  function shotRoi(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('roi');
    riso({ seed: 126 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tMeas = wt('roi', 'measure'), tTrial = wt('roi', 'trial'), tSlow = wt('roi', 'slower'), tBel = wt('roi', 'believing'), tFast = wt('roi', 'faster'),
      tEvid = wt('roi', 'evidence'), tTrack = wt('roi', 'track'), tLead = wt('roi', 'lead'), tFail = wt('roi', 'failure');
    const shift = ease(seg(t, tTrack - .3, tTrack + .3));
    const GX = lerp(1060, 820, shift), GY = 640, GS = lerp(1, .78, shift);
    // the speedometer
    const kg = stamp(t, b.start, .4);
    if (kg > .01) {
      push(); translate(GX, GY); scale(GS * kg);
      paint(ellPts(0, 0, 380, 380, 72), { fill: INK.navy, tone: .12 });
      arcLine(0, 0, 320, 50, INK.orange, { a0: Math.PI, a1: Math.PI * 1.33 });
      arcLine(0, 0, 320, 50, 'yellow', { a0: Math.PI * 1.33, a1: Math.PI * 1.67 });
      arcLine(0, 0, 320, 50, INK.green, { a0: Math.PI * 1.67, a1: TAU });
      for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; paint(ribbon([[Math.cos(a) * 250, Math.sin(a) * 250], [Math.cos(a) * 280, Math.sin(a) * 280]], 8), { fill: INK.navy }); }
      // the felt needle: a ghost that swings to fast
      const gA = Math.PI * 1.5 + Math.PI * .42 * backOut(seg(t, tBel - .1, tFast + .2));
      if (t > tBel - .1) { paint(ribbon([[0, 0], [Math.cos(gA) * 270, Math.sin(gA) * 270]], 34, 6), { fill: INK.orange, over: true, tone: .7 }); }
      // the measured needle: it drops to slow
      const mA = Math.PI * 1.5 - Math.PI * .3 * backOut(seg(t, tSlow - .1, tSlow + .3)) + .02 * wob(T, 2);
      paint(ribbon([[0, 0], [Math.cos(mA) * 280, Math.sin(mA) * 280]], 30, 6), { fill: INK.navy });
      paint(ellPts(0, 0, 40, 40, 20), { fill: INK.navy });
      if (t > tEvid - .1) stampX(Math.cos(gA) * 170, Math.sin(gA) * 170, 90, stamp(t, tEvid - .1));
      pop();
    }
    // the developers in the trial: the Skipper at a laptop
    const kS = stamp(t, tTrial - .3);
    if (kS > .01) {
      skipper(lerp(-200, 280, easeOut(seg(t, tTrial - .3, tTrial + .4))), 1060, 17, skipAct(t, [[tTrial - .3, 'type', { mood: 'focused' }], [tBel, 'cheer', { mood: 'happy' }], [tEvid, 'shrug', { mood: 'worried' }], [tTrack, 'present', { mood: 'grin' }]]));
    }
    // outcomes: a stopwatch and a bar chart
    const kw = stamp(t, tLead - .1);
    if (kw > .01) { push(); translate(1500, 330); scale(kw); paint(rrPts(-20, -150, 40, 40, 8), { fill: INK.navy }); paint(ellPts(0, 0, 120, 120, 48), { fill: INK.gold }); paint(ellPts(0, 0, 96, 96, 44), { fill: INK.paper }); const a = -Math.PI / 2 + (t - tLead) * 3; inkLine([[0, 0], [Math.cos(a) * 80, Math.sin(a) * 80]], 1.4, INK.navy, 'ink', 0, { force: true }); pop(); }
    const kb = stamp(t, tFail - .1);
    if (kb > .01) { push(); translate(1500, 830); scale(kb); paint(rectPts(-180, 100, 360, 12), { fill: INK.navy }); for (let i = 0; i < 4; i++) { const h = (80 + 50 * i) * ease(seg(t, tFail + i * .1, tFail + .4 + i * .1)); paint(rectPts(-160 + i * 90, 100 - h, 60, h), { fill: i === 3 ? INK.orange : INK.navy, tone: i === 3 ? 1 : .7 }); } pop(); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 620 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- G · privacy: code that can't leave; a local model; the private cloud boundary ----------
  function shotPrivacy(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('privacy');
    riso({ seed: 127 });
    const tLeave = wt('privacy', 'leave'), tGov = wt('privacy', 'government'), tPat = wt('privacy', 'patient'), tFin = wt('privacy', 'financial'), tOnly = wt('privacy', 'only'),
      tMid = wt('privacy', 'middle'), tFront = wt('privacy', 'frontier'), tBound = wt('privacy', 'boundary'), tData = wt('privacy', 'data');
    const pull = ease(seg(t, tMid - .3, tMid + .6));
    camBegin(lerp(960, 1160, pull), lerp(540, 480, pull), lerp(1.05, .82, pull));
    paint(rectPts(-600, -600, W + 1200, H + 1200), { fill: 'yellow', tone: .2 });
    paint(rectPts(-600, 920, W + 1200, 700), { fill: INK.navy, tone: .8 });
    // the building
    const BX = 960;
    paint(rrPts(BX - 400, 300, 800, 620, 20), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
    paint([[BX - 460, 310], [BX + 460, 310], [BX, 150]], { fill: INK.navy });
    for (let i = 0; i < 5; i++) paint(rectPts(BX - 330 + i * 150, 620, 50, 300), { fill: INK.navy, tone: .3 });
    const win = (i, t0, fn) => { const x = BX - 250 + i * 250, k = stamp(t, t0 - .1); paint(rrPts(x - 80, 380, 160, 160, 14), { fill: k > .01 ? INK.gold : INK.navy, tone: k > .01 ? .6 : .3 }); if (k > .01) { push(); translate(x, 460); scale(k); fn(); pop(); } };
    win(0, tGov, () => { paint(rectPts(-50, 40, 100, 14), { fill: INK.navy }); for (let j = 0; j < 3; j++) paint(rectPts(-40 + j * 32, -30, 16, 70), { fill: INK.navy }); paint([[-60, -30], [60, -30], [0, -65]], { fill: INK.navy }); });
    win(1, tPat, () => heart(0, 0, 44));
    win(2, tFin, () => coin(0, 0, 50));
    // files try to leave through the wall and bounce back
    for (let i = 0; i < 3; i++) { const t0 = tLeave - .5 + i * .2, k = seg(t, t0, t0 + 1.1); if (k <= 0 || k >= 1) continue; const x = BX + 150 + 220 * Math.sin(Math.PI * Math.min(1, k * 1.2)); fileIcon(x, 700 + i * 70, .8); }
    if (t > tLeave && t < tLeave + .5) for (let i = 0; i < 5; i++) paint(ribbon([[BX + 400, 640 + i * 40], [BX + 440, 630 + i * 44]], 7), { fill: INK.orange });
    paint(rectPts(BX + 385, 300, 30, 620), { fill: INK.navy });   // the wall
    // the only option: a local model in the door
    const ko = stamp(t, tOnly - .15);
    if (ko > .01) { push(); translate(BX, 900); scale(ko); glow(0, -110, 230, 'yellow', .85); laptop(0, 0, .7); clawd(0, -40, 6, { ...feel('happy', T), noShadow: true }); pop(); }
    // the middle path: a frontier model inside your own boundary
    const kc = seg(t, tFront - .3, tFront + .5);
    if (kc > 0) { const y = lerp(-300, 330, backOut(kc)); cloud(1780, y, 1.3, INK.navy); clawd(1780, y + 60, 7, { ...feel('happy', T), noShadow: true, boilKey: 'cl' }); }
    const kb = ease(seg(t, tBound - .4, tBound + .6));
    if (kb > 0) {
      const P = resample(rrPts(460, 60, 1640, 900, 80), 90), N = P.length, m = Math.floor(N * kb);
      for (let i = 0; i < m; i += 2) inkLine([P[i], P[(i + 1) % N]], 2.4, INK.orange, 'ink', 0, { force: true, over: true });
    }
    if (t > tData) { const k = stamp(t, tData); for (let i = 0; i < 3; i++) fileIcon(1640 + i * 130, 700, .8 * k); }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 600 });
  }

  // ---------- H · routing: which model, for which step ----------
  function shotRouting(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('routing');
    riso({ seed: 128 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tLoc = wt('routing', 'local'), tCom = wt('routing', 'commercial'), tWhich = wt('routing', 'which'), tStep = wt('routing', 'step'), tExp = wt('routing', 'exploration'),
      tPlan = wt('routing', 'planning'), tMatt = wt('routing', 'matters'), tImp = wt('routing', 'implementation'), tFol = wt('routing', 'follows');
    // local or commercial: a face-off, then folded away
    const fold = ease(seg(t, tWhich - .2, tWhich + .3));
    if (fold < 1) {
      const kl = stamp(t, Math.min(tLoc - .1, b.start + .1)) * (1 - fold), kc = stamp(t, Math.min(tCom - .1, b.start + .3)) * (1 - fold);
      if (kl > .01) { push(); translate(560, 560); scale(kl); laptop(0, 0, 1.3); pop(); }
      if (kc > .01) { push(); translate(1360, 460); scale(kc); cloud(0, 0, 1.3, INK.navy); pop(); }
      if (kl > .01 && kc > .01) type('?', 960, 470, 200 * kl, INK.orange);
    }
    const X = [380, 960, 1540], Y = 850;
    // the track
    const kt = ease(seg(t, tWhich, tStep + .2));
    if (kt > 0) { paint(rrPts(200, Y + 20, 1520 * kt, 26, 13), { fill: INK.navy }); for (let i = 0; i < 20; i++) if (i / 20 < kt) paint(rectPts(220 + i * 76, Y + 46, 30, 22), { fill: INK.navy, tone: .5 }); }
    // three stations
    const station = (i, t0, u, mood, prop, extra) => {
      const kb = stamp(t, tStep + i * .15); if (kb <= .01) return;
      push(); translate(X[i], Y);
      push(); scale(kb); paint(rrPts(-200, -560, 400, 330, 30), { fill: [INK.gold, INK.orange, INK.green][i], tone: .35 }); pop();
      const k = stamp(t, t0 - .15);
      if (k > .01) { push(); scale(k); prop(); clawd(0, 0, u, { ...feel(mood, T), ...move('bounce', T, i), boilKey: 'st' + i }); if (extra) extra(); pop(); }
      pop();
    };
    station(0, tExp, 8, 'happy', () => { arcLine(-20, -410, 70, 18, INK.navy); paint(ellPts(-20, -410, 60, 60, 30), { fill: 'yellow', tone: .5, over: true }); paint(ribbon([[30, -360], [100, -290]], 26), { fill: INK.navy }); coin(120, -500, 30); });
    station(1, tPlan, 17, t > tMatt ? 'determined' : 'thinking', () => { paint([[-150, -500], [-50, -470], [50, -500], [150, -470], [150, -290], [50, -320], [-50, -290], [-150, -320]], { fill: INK.paper, ink: INK.navy, sw: 1 }); inkLine(through([[-120, -330], [-40, -420], [40, -360], [110, -450]]), 1.4, INK.orange, 'ink', .5, { force: true }); }, () => star(0, -170, 36 * stamp(t, tMatt - .1)));
    station(2, tImp, 12, 'determined', () => wrench(0, -380, .6, .6));
    // the task card rides from station to station
    if (t > tExp - .2) {
      const legs = [[tExp, X[0]], [tPlan, X[1]], [tImp, X[2]]];
      let x = X[0] - 180; for (const [t0, xx] of legs) x = lerp(x, xx + 150, ease(seg(t, t0 - .4, t0)));
      push(); translate(x, Y - 10 - 20 * Math.abs(Math.sin(t * 6))); card(-50, -40, 100, 70, INK.orange); pop();
      if (t > tFol) check(X[2] + 150, Y - 160, 1.2, stamp(t, tFol));
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 600 });
    tOut('iris', lt, dur, { cx: 960, cy: 560 });
  }

  // ---------- I · the model is a tool: pick the one for the job; next, many agents ----------
  function shotTool(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('tool');
    riso({ seed: 129 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tRel = wt('tool', 'religious'), tPrag = wt('tool', 'pragmatists'), tMeas = wt('tool', 'measure'), tSw = wt('tool', 'switch'), tTool = wt('tool', 'tool'),
      tReach = wt('tool', 'reach'), tMulti = wt('tool', 'multi'), tEnough = wt('tool', 'enough');
    // the pegboard
    paint(rrPts(560, 90, 1260, 620, 24), { fill: INK.brown, tone: .45 });
    for (let r = 0; r < 6; r++) for (let c = 0; c < 13; c++) paint(ellPts(610 + c * 96, 140 + r * 100, 8, 8, 10), { fill: INK.dark, tone: .7 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    // three Clawds on hooks: small, big, medium. At "switch" the outer two swap; at "reach" the Skipper picks the middle one.
    const sw = ease(seg(t, tSw - .1, tSw + .5)), pick = ease(seg(t, tReach - .1, tReach + .5));
    const slots = [[800, 11, 'happy'], [1190, 19, 'cool'], [1560, 15, 'neutral']];
    slots.forEach(([x0, u, mood], i) => {
      let x = x0, y = 520;
      if (i === 0) x = lerp(800, 1560, sw); if (i === 2) x = lerp(1560, 800, sw);
      if (sw > 0 && sw < 1 && i !== 1) y -= 120 * Math.sin(Math.PI * sw) * (i === 0 ? 1 : -.4);
      if (i === 1) { x = lerp(x, 760, pick); y = lerp(y, 940, pick); }
      inkLine([[x0, 160], [x0, 200]], 1.4, INK.dark, 'ink', 0, { force: true });
      clawd(x, y, u, { ...feel(i === 1 && pick > .9 ? 'excited' : mood, T), noShadow: y < 900, boilKey: 'peg' + i });
      if (i === 1 && t > tRel - .3 && t < tPrag) { const k = stamp(t, tRel - .3); arcLine(x, y - 10 * u, 70 * k, 12, INK.gold, {}); glow(x, y - 8 * u, 160 * k, 'yellow', .6); stampX(x, y - 6 * u, 110, stamp(t, tRel + .3)); }
    });
    // measure: a ruler across the small one
    const km = stamp(t, tMeas - .1) * (1 - ease(seg(t, tSw - .3, tSw)));
    if (km > .01) { push(); translate(800, 380); rotate(-.1); scale(km); paint(rectPts(-160, -24, 320, 48), { fill: INK.gold }); for (let i = 0; i < 11; i++) paint(rectPts(-150 + i * 30, -24, 5, i % 2 ? 18 : 30), { fill: INK.navy }); pop(); }
    // the Skipper: a pragmatist
    skipper(360, 1050, 19, skipAct(t, [[b.start, 'think', { mood: 'thinking', flip: false }], [tPrag, 'hips', { mood: 'proud' }], [tMeas, 'present', { mood: 'focused' }], [tReach - .3, 'point', { mood: 'grin' }], [tMulti, 'cheer', { mood: 'happy' }]]));
    // next: many agents
    for (let i = 0; i < 6; i++) { const k = stamp(t, tMulti - .1 + i * .08); if (k <= .01) continue; clawd(1000 + i * 150, 1010, 10 * k, { ...feel('excited', T), ...move('hop', T, i + 3), boilKey: 'm' + i }); }
    if (t > tEnough - .3) glow(1370, 900, 240 * stamp(t, tEnough - .3), 'yellow', .6);
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 560 });
    tOut('feed', lt, dur);
  }

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
  function shotIdent(T0, lt, dur) { identLong(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '13', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotBillIn(T0, lt, dur) { shotBill(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('bill', 0), shotBillIn],
    [shotAt('where'), shotWhere],
    [shotAt('frontier'), shotFrontier],
    [shotAt('local'), shotLocal],
    [shotAt('cost'), shotCost],
    [shotAt('roi'), shotRoi],
    [shotAt('privacy'), shotPrivacy],
    [shotAt('routing'), shotRouting],
    [shotAt('tool'), shotTool],
    [B.tool.end + .9, shotEnd],
  ]);
})();
