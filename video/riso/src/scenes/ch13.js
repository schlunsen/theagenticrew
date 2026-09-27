// ch13.js: Chapter 13 · Multi-Agent Orchestration. Storyboard: video/storyboards/ch13.md
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
  const folder = (x, y, s, col = INK.gold) => { paint(rrPts(x - 150 * s, y - 120 * s, 120 * s, 40 * s, 12 * s), { fill: col }); paint(rrPts(x - 150 * s, y - 95 * s, 300 * s, 200 * s, 18 * s), { fill: col }); };
  const prCard = (x, y, s) => { push(); translate(x, y); scale(s); card(-90, -60, 180, 120, INK.green, { bars: false }); arcLine(-30, 0, 12, 6, INK.paper); arcLine(40, -20, 12, 6, INK.paper); arcLine(40, 30, 12, 6, INK.paper); inkLine(through([[-30, 0], [0, -10], [40, -20]]), 1, INK.paper, 'ink', .5, { force: true }); pop(); };
  const magnifier = (x, y, s, col = INK.navy) => { arcLine(x, y, 60 * s, 16 * s, col); paint(ellPts(x, y, 52 * s, 52 * s, 30), { fill: 'yellow', tone: .45, over: true }); paint(ribbon([[x + 44 * s, y + 44 * s], [x + 110 * s, y + 110 * s]], 26 * s), { fill: col }); };
  const terminal = (x, y, w, h, lines, dark) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy, tone: dark ? .45 : 1 }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); if (!dark) for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const houseShape = (x, y, w, h, o = {}) => { paint(rectPts(x - w / 2, y - h, w, h), { fill: o.fill || INK.paper, ink: INK.navy, sw: 1.3, tone: o.tone ?? 1 }); paint([[x - w / 2 - 40, y - h], [x + w / 2 + 40, y - h], [x, y - h - w * .45]], { fill: o.roof || INK.orange }); };

  // ---------- A · the house: one carpenter builds a shed; a house takes specialists, in parallel ----------
  function shotHouse(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('house');
    riso({ seed: 131 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tShed = wt('house', 'shed'), tHouse = wt('house', 'house'), tEl = wt('house', 'electrician'), tPl = wt('house', 'plumber'), tRoof = wt('house', 'roofer'),
      tPar = wt('house', 'parallel'), tAg = wt('house', 'agents'), tCoord = wt('house', 'coordination'), tCost = wt('house', 'cost');
    // one carpenter, one shed
    const ks = stamp(t, Math.min(tShed - .2, b.start + .3));
    if (ks > .01) { push(); translate(330, 900); scale(ks); houseShape(0, 0, 220, 170, { fill: INK.gold, roof: INK.brown }); paint(rectPts(-30, -100, 60, 100), { fill: INK.navy }); pop(); }
    const hammer = seg(t, b.start, tHouse) > 0 ? Math.abs(Math.sin(t * 9)) : 0;
    clawd(560, 900, 11, { ...feel(t < tHouse ? 'determined' : 'surprised', T), flip: true, armR: (u, sw) => { push(); rotate(-.8 * hammer); paint(rrPts(-u * .3, -u * 2.4, u * .6, u * 2.6, u * .2), { fill: INK.brown }); paint(rrPts(-u * 1, -u * 3, u * 2, u * .9, u * .2), { fill: INK.navy }); pop(); }, boilKey: 'carp' });
    // the house frame
    const kh = stamp(t, tHouse - .2, .4), fill = ease(seg(t, tPar - .1, tPar + .8));
    if (kh > .01) {
      push(); translate(1250, 900); scale(kh);
      paint(rectPts(-380, -420, 760, 420), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      if (fill > 0) paint(rectPts(-380, -420 * fill, 760, 420 * fill), { fill: INK.gold, tone: .55, over: true });
      for (let i = 0; i < 5; i++) paint(rectPts(-380 + i * 190 - 8, -420, 16, 420), { fill: INK.navy, tone: .5 });
      paint([[-450, -420], [450, -420], [0, -680]], { fill: INK.orange, tone: .35 + .65 * fill });
      pop();
    }
    // three specialists
    const spec = (x, y, t0, u, prop, key) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(x, y); scale(k); prop(); clawd(0, 0, u, { ...feel(t > tCoord ? 'happy' : 'determined', T), ...move('bounce', T, key.length), boilKey: key }); pop(); };
    spec(1000, 700, tEl, 9, () => paint([[20, -190], [-30, -110], [5, -110], [-20, -40], [50, -130], [15, -130], [40, -190]], { fill: INK.yellow, ink: INK.navy, sw: .8 }), 'el');
    spec(1440, 900, tPl, 9, () => { paint(rrPts(-150, -30, 90, 24, 12), { fill: INK.green }); paint(rrPts(-84, -120, 24, 114, 12), { fill: INK.green }); }, 'plum');
    spec(1250, 380, tRoof, 9, () => { for (let i = 0; i < 3; i++) paint(rrPts(60 + i * 26, -40 - i * 16, 40, 20, 6), { fill: INK.brown }); }, 'roof');
    // coordination: dotted links between them; and it costs
    const kc = seg(t, tCoord - .1, tCoord + .6);
    if (kc > 0) { const P = [[1000, 650], [1250, 330], [1440, 850], [1000, 650]]; for (let s = 0; s < 3; s++) for (let i = 0; i < 10; i++) { const f = i / 10; if (f > kc) break; const x = lerp(P[s][0], P[s + 1][0], f), y = lerp(P[s][1], P[s + 1][1], f); paint(ellPts(x, y - 40, 9, 9, 10), { fill: INK.navy, over: true }); } }
    const kt = stamp(t, tCost - .1);
    if (kt > .01) { push(); translate(1720, 250); rotate(.12); scale(kt); paint([[-110, -60], [80, -60], [130, 0], [80, 60], [-110, 60]], { fill: INK.orange }); paint(ellPts(90, 0, 12, 12, 12), { fill: INK.paper }); coin(-20, 0, 40); pop(); }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · seams: coupling can't run in parallel; split by layer, feature, concern ----------
  function shotSeams(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('seams');
    riso({ seed: 132 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tSplit = wt('seams', 'splitting'), tDep = wt('seams', 'depends'), tSeam = wt('seams', 'seams'), tLayer = wt('seams', 'layer'), tContract = wt('seams', 'contract'),
      tFeat = wt('seams', 'feature'), tConc = wt('seams', 'concern'), tRef = wt('seams', 'refactors'), tTests = wt('seams', 'tests'), tDocs = wt('seams', 'docs');
    const gone = ease(seg(t, tLayer - .5, tLayer - .1));
    // the slab of work; two chained pieces can't split; then the seam is cut
    if (gone < 1) {
      const ko = 1 - gone, apart = 90 * ease(seg(t, tSeam + .3, tSeam + .9));
      push(); translate(960, 540); scale(ko * stamp(t, b.start, .4));
      for (const sgn of [-1, 1]) { paint(rrPts(sgn < 0 ? -520 - apart : apart, -260, 520, 520, 24), { fill: INK.navy, tone: .3 }); for (let i = 0; i < 5; i++) paint(rrPts((sgn < 0 ? -470 - apart : 50 + apart), -200 + i * 90, 300 + 100 * hash(i + sgn), 30, 15), { fill: INK.navy, tone: .6 }); }
      // coupled: A → B chained, an X
      if (t > tDep - .2 && t < tSeam) { const k = stamp(t, tDep - .2); for (const x of [-240, 240]) { push(); translate(x, 0); scale(k); card(-110, -80, 220, 160, x < 0 ? INK.orange : INK.gold); pop(); } for (let i = 0; i < 4; i++) arcLine(-110 + i * 70, 0, 26 * k, 10, INK.dark); stampX(0, 0, 150, stamp(t, tDep + .4)); }
      // the seam: a dashed line and scissors running down it
      if (t > tSeam - .2) { const k = ease(seg(t, tSeam - .2, tSeam + .4)); for (let i = 0; i < 12; i++) if (i / 12 < k) paint(rectPts(-6, -300 + i * 52, 12, 30), { fill: INK.orange }); const sy = lerp(-320, 320, k); push(); translate(0, sy); rotate(Math.PI / 2); for (const s of [-1, 1]) { push(); rotate(s * .35 * Math.abs(Math.sin(t * 14))); paint(ribbon([[0, 0], [110, 0]], 22, 4), { fill: INK.navy }); paint(ellPts(-40, s * 26, 30, 20, 16), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); pop(); } pop(); }
      pop();
    }
    // three ways to cut
    const panel = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(360 + i * 600, 540); scale(k); paint(rrPts(-250, -300, 500, 600, 30), { fill: INK.paper, ink: INK.navy, sw: 1.3 }); fn(); pop(); };
    panel(0, tLayer, () => { for (let r = 0; r < 3; r++) paint(rrPts(-190, -230 + r * 170, 380, 110, 16), { fill: [INK.orange, INK.navy, INK.green][r], tone: .8 }); const kc = stamp(t, tContract - .1); if (kc > .01) paint(rectPts(-210 * kc, -106, 420 * kc, 26), { fill: INK.gold, over: true }); });
    panel(1, tFeat, () => { for (let c = 0; c < 3; c++) { const k = stamp(t, tFeat + c * .12); paint(rrPts(-190 + c * 130, -230, 110, 460 * k, 16), { fill: [INK.orange, INK.gold, INK.green][c], tone: .85 }); } });
    panel(2, tConc, () => { const k1 = stamp(t, tRef - .1), k2 = stamp(t, tTests - .1), k3 = stamp(t, tDocs - .1); if (k1 > .01) wrench(-110, -60, .55 * k1, .6); if (k2 > .01) check(110, -150, 1.6 * k2, 1); if (k3 > .01) { push(); translate(0, 170); scale(k3); paint(rectPts(-70, -90, 140, 180), { fill: INK.paper, ink: INK.navy, sw: 1.1 }); for (let i = 0; i < 5; i++) paint(rectPts(-50, -60 + i * 28, 100 - 20 * (i % 2), 10), { fill: INK.navy, tone: .6 }); pop(); } });
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- C · branch per agent: own branch, own worktree; three of each ----------
  function shotWorktree(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('worktree');
    riso({ seed: 133 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tBr = wt('worktree', 'branch'), tTree = wt('worktree', 'tree'), tTwo = wt('worktree', 'two'), tTr = wt('worktree', 'trample'), tDirs = wt('worktree', 'directories'),
      tBrs = wt('worktree', 'branches'), tAg = wt('worktree', 'agents', -1);
    // main
    const km = ease(seg(t, b.start, b.start + .6));
    paint(rrPts(100, 220, 1720 * km, 28, 14), { fill: INK.navy });
    for (let i = 0; i < 8; i++) if (i / 8 < km) paint(ellPts(160 + i * 220, 234, 26, 26, 18), { fill: INK.navy });
    const three = ease(seg(t, tDirs - .4, tDirs));
    // one branch, one worktree, one agent; then a second agent crashes in
    if (three < 1) {
      push(); translate(0, 0); const k1 = 1 - three;
      const kb = ease(seg(t, tBr - .2, tBr + .4));
      if (kb > 0) inkLine(through([[600, 234], [640, 380], [760, 480], [860, 560]].slice(0, 1 + Math.ceil(3 * kb))), 3 * k1, INK.orange, 'ink', .5, { force: true });
      const kf = stamp(t, tTree - .15) * k1;
      if (kf > .01) {
        push(); translate(960, 760); scale(kf * 1.5); folder(0, 0, 1.2);
        const hit = t > tTr - .1 && t < tTr + .9;
        clawd(hit ? -50 : 0, 90, 10, { ...feel(hit ? 'angry' : 'happy', T), noShadow: true, boilKey: 'wa' });
        if (t > tTwo) { const kj = seg(t, tTwo, tTr), p = arcPt([420, 60], [60, 90], 160, ease(kj)); clawd(p[0], p[1], 10, { ...feel(hit ? 'dizzy' : 'mischief', T), noShadow: true, flip: true, boilKey: 'wb' }); }
        if (hit) { const k = seg(t, tTr - .1, tTr + .9); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .5; push(); translate(Math.cos(a) * 200 * k, -40 + Math.sin(a) * 160 * k); rotate(k * 4 + i); paint(rectPts(-24, -30, 48, 60), { fill: INK.paper, ink: INK.navy, sw: .7 }); pop(); } stampX(0, 0, 120, stamp(t, tTr + .2)); }
        pop();
      }
      pop();
    }
    // three directories, three branches, three agents
    if (three > 0) {
      for (let i = 0; i < 3; i++) {
        const x = 420 + i * 540, kb = ease(seg(t, tBrs - .2 + i * .1, tBrs + .3 + i * .1));
        if (kb > 0) inkLine(through([[x - 120, 234], [x - 90, 420], [x, 560]].slice(0, 1 + Math.ceil(2 * kb))), 2.6, [INK.orange, INK.green, INK.brown][i], 'ink', .5, { force: true });
        const kf = stamp(t, tDirs - .1 + i * .12); if (kf > .01) { push(); translate(x, 780); scale(kf); folder(0, 0, 1.1, [INK.orange, INK.green, INK.gold][i]); pop(); }
        const ka = stamp(t, tAg - .2 + i * .1); if (ka > .01) clawd(x, 860, 10 * ka, { ...feel('happy', T), ...move('bounce', T, i), noShadow: true, boilKey: 'wt' + i });
      }
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- D · two shapes: sub-agents (clean context) and background agents (a PR later) ----------
  function shotShapes(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('shapes');
    riso({ seed: 134 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tTwo = wt('shapes', 'two'), tSub = wt('shapes', 'sub'), tClean = wt('shapes', 'clean'), t40 = wt('shapes', '40'), t10 = wt('shapes', '10'), tBg = wt('shapes', 'background'),
      tTick = wt('shapes', 'ticket'), tPull = wt('shapes', 'pull'), tVague = wt('shapes', 'vague');
    const kv = ease(seg(t, tVague - .4, tVague));
    // two panels
    for (let i = 0; i < 2; i++) { const k = stamp(t, tTwo - .2 + i * .15) * (1 - .6 * kv); if (k > .01) { push(); translate(500 + i * 920, 520); scale(k); paint(rrPts(-420, -400, 840, 800, 36), { fill: i ? INK.green : INK.gold, tone: .25 }); pop(); } }
    // left: the main session and its helper
    if (t > tSub - .2) {
      const k = stamp(t, tSub - .2) * (1 - kv);
      push(); translate(500, 520); scale(k);
      paint(rrPts(-340, -330, 300, 200, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 });   // the main window: clean
      if (t > t10 + .6) card(-300, -300, 220, 70, INK.orange);
      check(-80, -300, 1, stamp(t, tClean));
      clawd(-190, 260, 13, { ...feel(t > t10 + .6 ? 'happy' : 'neutral', T), boilKey: 'main' });
      const n = Math.floor(8 * seg(t, t40 - .3, t40 + .8));
      for (let i = 0; i < n; i++) fileIcon(170 + 30 * hash(i) - 15, -250 + i * 34 - 20, .55);
      clawd(190, 260, 9, { ...feel('determined', T), ...move('bounce', T, 5), boilKey: 'helper' });
      if (t > t10 - .1) { const f = ease(seg(t, t10 - .1, t10 + .6)), p = arcPt([180, 60], [-190, -265], 160, f); card(p[0] - 110, p[1] - 35, 220, 70, INK.orange); }
      pop();
    }
    // right: the background agent in a cloud sandbox
    if (t > tBg - .2) {
      const k = stamp(t, tBg - .2) * (1 - kv);
      push(); translate(1420, 520); scale(k);
      cloud(60, -120, 1.4, INK.navy); clawd(60, -40, 8, { ...feel('determined', T), noShadow: true, boilKey: 'bg' });
      if (t > tTick - .2) { const f = ease(seg(t, tTick - .2, tTick + .5)); if (f < 1) { const p = arcPt([-300, 300], [60, -60], 200, f); card(p[0] - 60, p[1] - 40, 120, 80, INK.orange); } }
      if (t > tPull - .4) { const f = ease(seg(t, tPull - .4, tPull + .3)), p = arcPt([60, -60], [-120, 240], 160, f); prCard(p[0], p[1], 1.1); }
      pop();
    }
    // a vague task: neither
    if (kv > 0) { push(); translate(960, 520); scale(stamp(t, tVague - .3)); const P = resample(rrPts(-220, -150, 440, 300, 40), 40); for (let i = 0; i < 40; i += 2) inkLine([P[i], P[i + 1]], 2, INK.navy, 'ink', 0, { force: true }); type('?', 0, 10, 200, INK.orange, { tone: .6 }); stampX(0, 0, 200, stamp(t, tVague + .25)); pop(); }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · the handover: plans → implements → reviews; make it explicit ----------
  function shotHandover(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('handover');
    riso({ seed: 135 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tPlans = wt('handover', 'plans'), tImp = wt('handover', 'implements'), tRev = wt('handover', 'reviews'), tCold = wt('handover', 'cold'), tExp = wt('handover', 'explicit'),
      tPlan = wt('handover', 'plan', 1), tStub = wt('handover', 'stub'), tCheck = wt('handover', 'checklist'), tCont = wt('handover', 'continent');
    const X = [380, 960, 1540];
    const warm = ease(seg(t, tExp, tExp + .6)), cold = t > tCold - .2 ? 1 - ease(seg(t, tCheck, tCheck + .5)) : 0;
    const who = [[tPlans, () => { paint([[-100, -60], [-30, -40], [30, -60], [100, -40], [100, 60], [30, 40], [-30, 60], [-100, 40]], { fill: INK.paper, ink: INK.navy, sw: 1 }); inkLine(through([[-80, 30], [-20, -20], [30, 20], [80, -30]]), 1.2, INK.orange, 'ink', .5, { force: true }); }],
      [tImp, () => wrench(0, 20, .45, .7)], [tRev, () => magnifier(-20, -10, 1)]];
    who.forEach(([t0, prop], i) => {
      const k = stamp(t, Math.min(t0 - .15, b.start + .15 + i * .12)); if (k <= .01) return;
      push(); translate(X[i], 900); scale(k);
      const kp = stamp(t, t0 - .15); if (kp > .01) { push(); translate(0, -330); scale(kp * 1.3); prop(); pop(); }
      const shiver = i === 1 && cold > .5 ? 1.5 * Math.sin(t * 40) : 0;
      clawd(0, 0, 14, { ...feel(i === 1 && cold > .5 ? 'scared' : 'determined', T), dx: shiver * .05, tint: i === 1 && cold > .5 ? 'blue' : undefined, tintK: cold, boilKey: 'h' + i });
      pop();
    });
    // cold: snow over the middle agent
    if (cold > 0) for (let i = 0; i < 16; i++) { const f = frac((t - tCold) * .6 + hash(i)); paint(starPts(X[1] - 220 + 440 * hash(i + 9), 300 + 560 * f, 20, .4, 6), { fill: INK.navy, tone: .7 * cold, over: true }); }
    // the explicit handover: a plan file, stubs, a checklist, passed from the first to the second
    const art = [[tPlan, () => { paint(rectPts(-60, -80, 120, 160), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let i = 0; i < 5; i++) paint(rectPts(-40, -55 + i * 26, 80, 9), { fill: INK.navy, tone: .6 }); }],
      [tStub, () => { card(-75, -55, 150, 110, INK.orange, { bars: false }); type('{ }', 0, 4, 60, INK.navy); }],
      [tCheck, () => { paint(rectPts(-60, -80, 120, 160), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let i = 0; i < 3; i++) { paint(rectPts(-44, -55 + i * 45, 22, 22), { fill: INK.navy }); check(-34, -50 + i * 45, .45, i < 2 ? 1 : 0); paint(rectPts(-10, -50 + i * 45, 60, 10), { fill: INK.navy, tone: .5 }); } }]];
    art.forEach(([t0, fn], i) => { const k = stamp(t, t0 - .15); if (k <= .01) return; const f = ease(seg(t, tCont - .5, tCont + .1)); push(); translate(lerp(520 + i * 190, X[1] - 190 + i * 190, f), lerp(250, 400, f)); scale(k * 1.25); fn(); pop(); });
    // a colleague on another continent
    const kg = stamp(t, tCont - .15);
    if (kg > .01) { push(); translate(1560, 200); scale(kg); paint(ellPts(0, 0, 110, 110, 48), { fill: INK.navy, tone: .5 }); paint(through([[-60, -50], [-10, -70], [20, -30], [-20, 10], [-50, -10]]), { fill: INK.green, over: true }); paint(through([[20, 20], [70, 10], [60, 70], [30, 70]]), { fill: INK.green, over: true }); for (let i = 0; i < 8; i++) { const p = arcPt([-180, 90], [0, -120], 90, i / 8); paint(ellPts(p[0] - 200, p[1], 6, 6, 8), { fill: INK.orange }); } pop(); }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 700 });
  }

  // ---------- F · the merge: clashing branches; prevent, merge agent, human review ----------
  function shotMerge(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('merge');
    riso({ seed: 136 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tMerge = wt('merge', 'merge'), tSch = wt('merge', 'schema'), tMig = wt('merge', 'migration'), tOld = wt('merge', 'old'), tPrev = wt('merge', 'prevent'), tOwn = wt('merge', 'own'),
      tMA = wt('merge', 'merge', 1), tRev = wt('merge', 'review'), tCon = wt('merge', 'contradict');
    const J = [860, 800], cols = [INK.orange, INK.green, INK.brown], starts = [[260, 140], [860, 120], [1460, 140]];
    // main, and three branches converging
    paint(rrPts(100, J[1] - 14, 1720, 28, 14), { fill: INK.navy });
    starts.forEach((s, i) => { const k = ease(seg(t, tMerge - .3 + i * .1, tMerge + .4 + i * .1)); if (k > 0) inkLine(through([s, lerp2(s, J, .5, 60 * (i - 1)), J]).slice(0, Math.max(2, Math.ceil(k * 40))), 2.4, cols[i], 'ink', .5, { force: true }); });
    // the schema and the migration clash
    const ks = stamp(t, tSch - .15);
    if (ks > .01) { push(); translate(420, 360); scale(ks); paint(rectPts(-90, -70, 180, 140), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let r = 0; r < 3; r++) paint(rectPts(-90, -30 + r * 34, 180, 3), { fill: INK.navy }); paint(rectPts(-90, -70, 180, 36), { fill: INK.orange }); pop(); }
    const kg = stamp(t, tMig - .15);
    if (kg > .01) { push(); translate(860, 360); scale(kg); fileIcon(0, 0, 1.1, INK.paper); paint(ribbon([[-40, 80], [40, 80]], 16, 2), { fill: INK.green }); pop(); }
    if (t > tOld && t < tPrev + .2) { const k = seg(t, tOld, tOld + .5); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; paint(ribbon([[640 + Math.cos(a) * 50 * (1 + k), 360 + Math.sin(a) * 50 * (1 + k)], [640 + Math.cos(a) * 120 * (1 + k), 360 + Math.sin(a) * 120 * (1 + k)]], 14 * (1 - k * .7)), { fill: INK.orange }); } }
    // prevention: each agent owns its own files
    if (t > tOwn - .2) for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const k = stamp(t, tOwn - .2 + (i * 2 + j) * .06); if (k > .01) { push(); translate(starts[i][0] + 150 + j * 90, 560); scale(k); fileIcon(0, 0, .85, cols[i]); pop(); } }
    // a merge agent at the junction
    const ka = stamp(t, tMA - .2);
    if (ka > .01) clawd(J[0], J[1] + 150, 11 * ka, { ...feel('determined', T), ...move('bounce', T, 7), boilKey: 'merger' });
    // human review: the Skipper, and a clean merge that contradicts itself
    const kS = stamp(t, tRev - .3);
    if (kS > .01) skipper(lerp(2100, 1560, easeOut(seg(t, tRev - .3, tRev + .4))), 1060, 17, skipAct(t, [[tRev - .3, 'point', { mood: 'focused', flip: true }], [tCon, 'think', { mood: 'worried', flip: true }]]));
    const kc = stamp(t, tCon - .15);
    if (kc > .01) { push(); translate(1220, 540); scale(kc); paint(rectPts(-110, -140, 220, 280), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(ribbon([[-70, -50], [70, -50]], 20, 20), { fill: INK.orange }); paint([[70, -80], [110, -50], [70, -20]], { fill: INK.orange }); paint(ribbon([[70, 50], [-70, 50]], 20, 20), { fill: INK.navy }); paint([[-70, 20], [-110, 50], [-70, 80]], { fill: INK.navy }); pop(); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 700 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }
  const lerp2 = (a, b, k, off = 0) => [lerp(a[0], b[0], k) + off, lerp(a[1], b[1], k)];

  // ---------- G · overhead: you become the bottleneck; the costs eat the gains ----------
  function shotOverhead(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('overhead');
    riso({ seed: 137 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tFour = wt('overhead', 'four'), tCrash = wt('overhead', 'crash'), tElse = wt('overhead', 'elsewhere'), tBott = wt('overhead', 'bottleneck'), tSet = wt('overhead', 'setup'),
      tMer = wt('overhead', 'merging'), tRev = wt('overhead', 'review'), tEats = wt('overhead', 'eats');
    const up = ease(seg(t, tSet - .5, tSet - .1));
    // four terminals, a Clawd in each; one crashes
    for (let i = 0; i < 4; i++) {
      const k = stamp(t, Math.min(tFour, b.start + .3) + i * .1); if (k <= .01) continue;
      const x = 330 + (i % 2) * 460, y = 330 + Math.floor(i / 2) * 330 - 900 * up;
      const dead = i === 3 && t > tCrash;
      push(); translate(x, y); scale(k); terminal(0, 0, 400, 280, 3, dead); clawd(0, 110, 7, { ...feel(dead ? 'ko' : 'determined', T), noShadow: true, boilKey: 'term' + i }); pop();
    }
    // the Skipper looks elsewhere; tasks pile up at him
    skipper(1480, 1060, 19, skipAct(t, [[b.start, 'type', { mood: 'focused', flip: true }], [tElse - .1, 'stand', { mood: 'neutral', lookX: 1 }], [tBott, 'facepalm', { mood: 'worried' }], [tSet, 'think', { mood: 'thinking', flip: true }]]));
    if (t > tBott - .2) { const n = Math.floor(7 * seg(t, tBott - .2, tBott + .7)); for (let i = 0; i < n; i++) card(1160 - 10 * (i % 2), 890 - i * 50 - 900 * up, 170, 42, [INK.orange, INK.gold][i % 2], { bars: false }); }
    // the balance: gains against overhead
    if (up > 0) {
      const w = [tSet, tMer, tRev].filter(x => t > x).length, tip = backOut(seg(t, tEats - .2, tEats + .4)) * .22 + w * .05 - .15;
      push(); translate(640, 520 + 700 * (1 - up));
      paint([[-40, 380], [40, 380], [0, 0]], { fill: INK.navy });
      push(); rotate(tip); paint(rrPts(-420, -14, 840, 28, 14), { fill: INK.dark });
      for (const [sx, gains] of [[-380, true], [380, false]]) {
        push(); translate(sx, 0); rotate(-tip); inkLine([[0, 0], [0, 150]], 1, INK.navy, 'ink', 0, { force: true }); paint(rrPts(-130, 150, 260, 30, 12), { fill: INK.navy });
        if (gains) { star(0, 110, 56); } else { const lab = [tSet, tMer, tRev]; lab.forEach((t0, i) => { const f = backOut(seg(t, t0 - .2, t0 + .2)); if (f > 0) paint(rrPts(-110 + i * 75, lerp(-500, 70, f), 70, 80, 10), { fill: [INK.orange, INK.green, INK.brown][i] }); }); }
        pop();
      }
      pop(); pop();
    }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · the example: notifications; contract first; three agents; 45 vs 90 ----------
  function shotExample(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('example');
    riso({ seed: 138 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tNot = wt('example', 'notifications'), tBack = wt('example', 'backend'), tBell = wt('example', 'bell'), tTests = wt('example', 'tests'), tCon = wt('example', 'contract'),
      tThree = wt('example', 'three'), tBack2 = wt('example', 'backend', 1), t45 = wt('example', '45'), t90 = wt('example', '90');
    const out = ease(seg(t, t45 - .6, t45 - .2));
    const bell = (x, y, s) => { push(); translate(x, y); scale(s); paint(through([[-70, 60], [-60, -10], [-40, -60], [0, -80], [40, -60], [60, -10], [70, 60]]), { fill: INK.gold }); paint(rrPts(-90, 50, 180, 24, 12), { fill: INK.gold }); paint(ellPts(0, 90, 20, 20, 14), { fill: INK.navy }); pop(); };
    if (out < 1) {
      push(); translate(960, 540); scale(1 - out); translate(-960, -540);
      const kn = stamp(t, Math.min(tNot - .2, b.start + .3));
      if (kn > .01) { bell(960, 230, 1.1 * kn * (1 - .45 * ease(seg(t, tCon - .3, tCon)))); if (t < tCon) { paint(ellPts(1030, 150, 36 * kn, 36 * kn, 20), { fill: INK.orange }); type('3', 1030, 154, 44 * kn, INK.paper); } }
      // the contract
      const kc = stamp(t, tCon - .15);
      if (kc > .01) { push(); translate(960, 380); scale(kc); paint(rectPts(-130, -130, 260, 260), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); type('{ }', 0, -40, 80, INK.orange); for (let i = 0; i < 3; i++) paint(rectPts(-90, 30 + i * 30, 180 - 40 * (i % 2), 10), { fill: INK.navy, tone: .6 }); pop(); }
      // three cards: backend, bell, tests
      const X = [420, 960, 1500], T3 = [tBack, tBell, tTests];
      for (let i = 0; i < 3; i++) {
        const k = stamp(t, T3[i] - .15); if (k <= .01) continue;
        const slide = i === 0 ? ease(seg(t, tBack2 - .2, tBack2 + .4)) : 0;
        if (t > tCon) inkLine([[960, 510], [X[i], 640]], 1, INK.navy, 'ink', 0, { force: true, tone: .6 });
        push(); translate(X[i], 780 + 160 * slide); scale(k);
        paint(rrPts(-190, -140, 380, 280, 24), { fill: [INK.navy, INK.gold, INK.green][i], tone: .3 });
        if (i === 0) for (let r = 0; r < 2; r++) { paint(rrPts(-120, -110 + r * 80, 240, 64, 10), { fill: INK.navy }); paint(ellPts(-90, -78 + r * 80, 8, 8, 10), { fill: INK.green }); }
        if (i === 1) bell(0, -60, .55);
        if (i === 2) check(0, -70, 1.4, 1);
        if (t > tThree - .2) clawd(0, 130, 8 * stamp(t, tThree - .2 + i * .1), { ...feel('determined', T), ...move('bounce', T, i), noShadow: true, boilKey: 'ex' + i });
        pop();
      }
      if (t > tBack2 - .2) paint(rrPts(100, 1010, 1720, 24, 12), { fill: INK.navy, alpha: ease(seg(t, tBack2 - .2, tBack2 + .2)) });
      pop();
    }
    // 45 minutes against 90
    if (out > 0) {
      const k1 = ease(seg(t, t45 - .2, t45 + .4)), k2 = ease(seg(t, t90 - .2, t90 + .5));
      paint(rrPts(360, 360, 560 * k1, 120, 30), { fill: INK.orange });
      for (let i = 0; i < 3; i++) if (k1 > .5) clawd(420 + i * 90, 350, 5, { ...feel('happy', T), noShadow: true, boilKey: 'b45' + i });
      if (k1 > .2) type('45 MIN', 360 + 560 * k1 + 210, 424, 90, INK.navy);
      paint(rrPts(360, 640, 1120 * k2, 120, 30), { fill: INK.navy, tone: .75 });
      if (k2 > .3) clawd(420, 630, 5, { ...feel('bored', T), noShadow: true, boilKey: 'b90' });
      if (k2 > .2) type('90 MIN', 360 + 1120 * k2 + 210, 704, 90, INK.navy);
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- I · the crew: five in a boat vs one sailor; knowing when to split ----------
  function shotCrew(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('crew');
    riso({ seed: 139 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 800], to: [0, 0], a: .5, b: .1 } });
    const tFive = wt('crew', 'five'), tSail = wt('crew', 'sailor'), tBoat = wt('crew', 'boat'), tSkill = wt('crew', 'skill'), tPar = wt('crew', 'parallel'), tJudg = wt('crew', 'judgment'), tPipe = wt('crew', 'pipeline');
    // sea
    paint(rectPts(-200, 820, W + 400, 500), { fill: INK.navy });
    for (let i = 0; i < 12; i++) arcLine(80 + i * 170 + 30 * Math.sin(t + i), 830, 60, 10, INK.paper, { a0: Math.PI, a1: TAU, over: false });
    // five Clawds crammed into one boat, bumping
    const bx = 520 + 30 * Math.sin(t * 1.3), by = 820 + 10 * Math.sin(t * 2.1);
    paint([[bx - 330, by - 60], [bx + 330, by - 60], [bx + 250, by + 60], [bx - 250, by + 60]], { fill: INK.brown });
    for (let i = 0; i < 5; i++) { const k = stamp(t, Math.min(tFive, b.start + .2) + i * .08); if (k > .01) clawd(bx - 240 + i * 120, by - 60, 8 * k, { ...feel(i % 2 ? 'dizzy' : 'nervous', T), rot: .18 * Math.sin(t * 5 + i), noShadow: true, boilKey: 'boat' + i }); }
    // one sailor who knows the boat
    const ks = seg(t, tSail - .6, tSail + 1.4);
    if (ks > 0) {
      const sx = lerp(2200, 1400, easeOut(ks)), sy = 820 + 6 * Math.sin(t * 2);
      paint([[sx - 260, sy - 50], [sx + 260, sy - 50], [sx + 190, sy + 60], [sx - 190, sy + 60]], { fill: INK.gold });
      inkLine([[sx + 40, sy - 50], [sx + 40, sy - 520]], 1.6, INK.dark, 'ink', 0, { force: true });
      paint([[sx + 50, sy - 510], [sx + 50, sy - 110], [sx + 280, sy - 110]], { fill: INK.paper, ink: INK.navy, sw: 1 });
      paint([[sx + 30, sy - 480], [sx + 30, sy - 140], [sx - 170, sy - 140]], { fill: INK.orange, tone: .8, over: true });
      skipper(sx - 90, sy - 45, 12, { ...SKIP_POSES.steer, mood: t > tJudg ? 'proud' : 'grin', noShadow: true, t });
      helm(sx - 90, sy - 150, 34, t * .8, INK.gold, INK.navy);
      if (t > tJudg - .2) glow(sx - 90, sy - 330, 200 * stamp(t, tJudg - .2), 'yellow', .45);
    }
    // parallel: pieces in their own lanes
    if (t > tPar - .3) {
      const k = ease(seg(t, tPar - .3, tPar + .4));
      for (let i = 0; i < 3; i++) { const y = 150 + i * 110; for (let j = 0; j < 14; j++) if (j / 14 < k) paint(rectPts(160 + j * 70, y, 36, 8), { fill: INK.navy, tone: .5 }); const px = 160 + 900 * frac((t - tPar) * .3 + i * .33); card(px, y - 60, 110, 50, [INK.orange, INK.gold, INK.green][i], { bars: false }); }
    }
    // next: a pipe slides in
    if (t > tPipe - .3) { const k = easeOut(seg(t, tPipe - .3, tPipe + .4)); push(); translate(lerp(2300, 1450, k), 220); paint(rrPts(-300, -50, 600, 100, 20), { fill: INK.green }); paint(rrPts(-330, -70, 60, 140, 14), { fill: INK.green, tone: .8 }); paint(rrPts(270, -70, 60, 140, 14), { fill: INK.green, tone: .8 }); pop(); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { identLong(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '14', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotHouseIn(T0, lt, dur) { shotHouse(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('house', 0), shotHouseIn],
    [shotAt('seams'), shotSeams],
    [shotAt('worktree'), shotWorktree],
    [shotAt('shapes'), shotShapes],
    [shotAt('handover'), shotHandover],
    [shotAt('merge'), shotMerge],
    [shotAt('overhead'), shotOverhead],
    [shotAt('example'), shotExample],
    [shotAt('crew'), shotCrew],
    [B.crew.end + .9, shotEnd],
  ]);
})();
