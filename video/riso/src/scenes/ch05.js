// ch05.js: Chapter 5 · Git as Agent Infrastructure. Storyboard: video/storyboards/ch05.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const dot = (x, y, r, col = INK.gold, k = 1) => { if (k > .01) paint(ellPts(x, y, r * k, r * k, 24), { fill: col, ink: INK.navy, sw: 1.1 }); };
  const rail = (x0, x1, y, w = 12, col = INK.navy) => paint(rrPts(Math.min(x0, x1), y - w / 2, Math.abs(x1 - x0), w, w / 2), { fill: col });
  const card = (x, y, w, h, col, lines, o = {}) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: col, ink: o.ink, sw: o.ink ? 1.1 : 0 }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 26 + i * 30, (w - 48) * (i === lines - 1 ? .55 : .8 + .2 * hash(i + 7)), 12, 6), { fill: o.bar || INK.navy, tone: .7 }); };
  const diffPanel = (x, y, w, h, k = 1, hl = -1) => { push(); translate(x, y); scale(k); paint(rrPts(-w / 2, -h / 2, w, h, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); const n = Math.floor((h - 60) / 34); for (let i = 0; i < n; i++) { const c = i % 5 === 1 ? INK.green : i % 5 === 3 ? INK.orange : INK.navy; paint(rrPts(-w / 2 + 30, -h / 2 + 34 + i * 34, 16, 16, 4), { fill: c, tone: c === INK.navy ? .3 : 1 }); paint(rrPts(-w / 2 + 60, -h / 2 + 36 + i * 34, (w - 110) * (.4 + .5 * hash(i + 11)), 12, 6), { fill: c, tone: c === INK.navy ? .45 : .8 }); } if (hl >= 0) paint(rrPts(-w / 2 + 10, -h / 2 + 24 + hl * 34, w - 20, 36 * 3, 10), { fill: 'yellow', tone: .6, over: true }); pop(); };
  const branchIcon = (x, y, s, col = INK.navy, d = INK.orange) => { inkLine([[x - 60 * s, y + 70 * s], [x - 60 * s, y - 70 * s]], 3 * s, col, 'ink', 0, { force: true }); inkLine(through([[x - 60 * s, y + 30 * s], [x - 10 * s, y + 10 * s], [x + 50 * s, y - 30 * s]]), 3 * s, col, 'ink', .5, { force: true }); for (const [px, py] of [[-60, 70], [-60, -70], [50, -30]]) paint(ellPts(x + px * s, y + py * s, 20 * s, 20 * s, 16), { fill: d, ink: col, sw: 1 * s }); };
  const book = (x, y, s) => { paint(rrPts(x - 70 * s, y - 55 * s, 140 * s, 110 * s, 10 * s), { fill: INK.green }); paint(rectPts(x - 4 * s, y - 55 * s, 8 * s, 110 * s), { fill: INK.navy }); for (let i = 0; i < 3; i++) paint(rectPts(x + 14 * s, y - 30 * s + i * 22 * s, 40 * s, 6 * s), { fill: INK.paper }); };
  const undoArrow = (x, y, s) => { arcLine(x, y, 50 * s, 16 * s, INK.orange, { a0: Math.PI * 1.1, a1: Math.PI * 2.3, cap: 'round' }); const a = Math.PI * 1.1, px = x + Math.cos(a) * 50 * s, py = y + Math.sin(a) * 50 * s; paint([[px - 26 * s, py - 4 * s], [px + 18 * s, py - 16 * s], [px + 4 * s, py + 26 * s]], { fill: INK.orange }); };
  const magnifier = (x, y, s, col = INK.navy) => { arcLine(x, y, 44 * s, 14 * s, col); paint(ellPts(x, y, 38 * s, 38 * s, 24), { fill: 'yellow', tone: .45, over: true }); paint(ribbon([[x + 32 * s, y + 32 * s], [x + 80 * s, y + 80 * s]], 20 * s), { fill: col }); };
  const cap = (x, y, s) => { paint([[x - 50 * s, y], [x + 50 * s, y], [x + 60 * s, y - 36 * s], [x - 60 * s, y - 36 * s]], { fill: INK.paper, ink: INK.navy, sw: .8 }); paint(rrPts(x - 52 * s, y - 8 * s, 104 * s, 18 * s, 6 * s), { fill: INK.navy }); paint(starPts(x, y - 22 * s, 10 * s, .45, 5), { fill: INK.gold }); };
  const split2 = s => { const w = s.toUpperCase().split(' '); let best = 1, bd = 1e9; for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < bd) { bd = d; best = i; } } return [w.slice(0, best).join(' '), w.slice(best).join(' ')]; };

  // ---------- A · twenty files, one commit or five; Git as the backbone ----------
  function shotTwenty(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('twenty');
    riso({ seed: 71 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const t20 = wt('twenty', '20'), tCom = wt('twenty', 'commit'), tBrk = wt('twenty', 'breaks'), tUnt = wt('twenty', 'untangling'), tFive = wt('twenty', 'five'), tRev = wt('twenty', 'revert'),
      tKeep = wt('twenty', 'keep'), tBack = wt('twenty', 'backbone'), tUndo = wt('twenty', 'undo'), tPar = wt('twenty', 'parallel'), tRevw = wt('twenty', 'review'), tDoc = wt('twenty', 'documentation');
    const crush = ease(seg(t, tCom - .3, tCom + .2)), five = ease(seg(t, tFive - .3, tFive + .4)), spine = ease(seg(t, tBack - .4, tBack + .3));
    const DX = i => 460 + i * 250, DY = 520;
    // twenty files flood in
    for (let i = 0; i < 20; i++) {
      const k = stamp(t, t20 - .2 + i * .04); if (k <= .01 || five >= 1) continue;
      const hx = 180 + 1560 * hash(i + 2), hy = 180 + 520 * hash(i + 30), grp = Math.floor(i / 4);
      const tx = five > 0 ? DX(grp) : 960, ty = five > 0 ? DY : 480;
      const m = five > 0 ? five : crush, x = lerp(crush > 0 && five > 0 ? 960 : hx, tx, m), y = lerp(crush > 0 && five > 0 ? 480 : hy, ty, m);
      if (crush > .95 && five === 0) continue;
      push(); translate(x, y); rotate((hash(i + 9) - .5) * .8 * (1 - m)); scale(k * (1 - .6 * m)); fileIcon(0, 0, 1); pop();
    }
    // one big commit, which breaks
    if (crush > .9 && five < 1) {
      const k = stamp(t, tCom) * (1 - five), br = t > tBrk ? 1 : 0;
      push(); translate(960, 480); scale(k); paint(rrPts(-200, -160, 400, 320, 30), { fill: br ? INK.brown : INK.gold }); if (br) { inkLine([[-40, -160], [20, -60], [-30, 20], [40, 160]], 2.2, INK.paper, 'ink', 0, { force: true }); paint(rrPts(-200, -160, 400, 320, 30), { fill: INK.orange, tone: .5, over: true }); } pop();
    }
    // five clean commits on a rail; the broken one comes out
    if (five > 0 && spine < 1) {
      rail(DX(0), lerp(DX(0), DX(4), five), DY, 14);
      for (let i = 0; i < 5; i++) {
        const out = i === 3 ? ease(seg(t, tRev, tRev + .5)) : 0, k = stamp(t, tFive - .1 + i * .08) * (1 - spine);
        const col = i === 3 ? (t > tRev - .2 ? INK.orange : INK.gold) : (t > tKeep ? INK.green : INK.gold);
        dot(DX(i), DY - 260 * out, 56, col, k * (1 - out * .3));
        if (i === 3 && t > tRev) stampX(DX(i), DY - 260 * out, 60, stamp(t, tRev + .1));
      }
    }
    // the backbone: the rail becomes a spine with four jobs
    if (spine > 0) {
      paint(rrPts(200, 600 - 20 * spine, 1520, 40 * spine, 20), { fill: INK.navy });
      for (let i = 0; i < 7; i++) dot(300 + i * 220, 600, 34, INK.gold, spine);
      const jobs = [[tUndo, 380, (x, y) => undoArrow(x, y, 1.3)], [tPar, 800, (x, y) => { rail(x - 90, x + 90, y - 40, 14, INK.navy); rail(x - 90, x + 90, y + 40, 14, INK.orange); dot(x - 40, y - 40, 18); dot(x + 40, y + 40, 18); }],
        [tRevw, 1200, (x, y) => magnifier(x - 10, y - 10, 1.2)], [tDoc, 1600, (x, y) => book(x, y, 1.1)]];
      jobs.forEach(([t0, x, fn]) => { const k = stamp(t, t0 - .2); if (k <= .01) return; push(); translate(x, 360); scale(k); paint(ellPts(0, 0, 120, 120, 40), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(0, 0); pop(); inkLine([[x, 480], [x, 580]], 1.4, INK.navy, 'ink', 0, { force: true, tone: k }); });
    }
    clawd(1500, 940, 15, { ...emotions(t, [[b.start, 'neutral'], [t20, 'excited'], [tBrk, 'scared'], [tFive, 'determined'], [tKeep, 'happy'], [tBack, 'proud']]), flip: true });
    const kS = stamp(t, tBrk - .2);
    if (kS > .01) {
      skipper(360, 1040 + 300 * (1 - kS), 15, skipAct(t, [[tBrk - .2, 'shrug', { mood: 'worried' }], [tFive, 'present', { mood: 'grin' }], [tBack, 'hips', { mood: 'happy' }]]));
      const sc = seg(t, tUnt - .3, tUnt + .4) * (1 - ease(seg(t, tFive - .4, tFive)));
      if (sc > 0) { const P = []; for (let i = 0; i < 30 * sc; i++) P.push([360 + 110 * Math.sin(i * 1.7) * (1 - i / 60), 850 + 130 * Math.cos(i * 2.3) - i * 3]); if (P.length > 2) inkLine(P, 1.2, INK.orange, 'ink', .6, { force: true }); }
    }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 600 });
  }

  // ---------- B · small commits: a save point before anything risky ----------
  function shotSmall(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('small');
    riso({ seed: 72 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 900, W + 400, 400), { fill: 'yellow', tone: .45 });
    const tSm = wt('small', 'small'), tOft = wt('small', 'often'), tLog = wt('small', 'logical'), tTest = wt('small', 'tests'), tRisk = wt('small', 'risky'), tSave = wt('small', 'save');
    const RY = 700, stops = [[tSm, 260, INK.gold], [tOft, 480, INK.gold], [tLog, 760, INK.gold], [tTest, 1040, INK.green], [tRisk, 1340, INK.yellow]];
    rail(120, lerp(120, 1840, ease(seg(t, b.start - .3, b.start + .5))), RY, 16);
    // the risky zone ahead
    const kz = stamp(t, tRisk - .6, .4);
    if (kz > .01) { const P = [[1460, RY + 200]]; for (let i = 0; i <= 10; i++) P.push([1460 + i * 50, RY - 60 - (i % 2 ? 120 : 20) * kz]); P.push([1920 + 100, RY + 200]); paint(P, { fill: INK.orange, tone: .85 }); paint(P, { fill: INK.navy, tone: .25, over: true }); }
    stops.forEach(([t0, x, col], i) => {
      const k = stamp(t, t0 - .1); if (k <= .01) return;
      if (i === 4) { const g = stamp(t, tSave - .1); if (g > .01) glow(x, RY, 200 * g, 'yellow', .9); push(); translate(x, RY); rotate(Math.PI / 4); scale(k); paint(rrPts(-50, -50, 100, 100, 12), { fill: INK.gold, ink: INK.navy, sw: 1.2 }); pop(); }
      else dot(x, RY, 46, col, k);
      if (i === 3) check(x, RY - 110, 1.2, stamp(t, t0 + .2));
    });
    // Clawd walks the rail, dropping a commit at each stop
    const xs = [[b.start, 140], [tSm - .1, 260], [tOft - .1, 480], [tLog - .1, 760], [tTest - .1, 1040], [tRisk - .1, 1110]];
    const cx = kf(t, xs.map(([a, x]) => [a, x]), ease), moving = xs.some(([a], i) => i > 0 && t > xs[i - 1][0] + .05 && t < a - .05);
    clawd(cx + 100, RY - 12, 12, { ...emotions(t, [[b.start, 'neutral'], [tSm, 'happy'], [tRisk - .3, 'nervous'], [tSave, 'relieved']]), ...(moving ? move('walk', T, 1) : {}) });
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 600 });
    tOut('iris', lt, dur, { cx: 1300, cy: 700 });
  }

  // ---------- C · let the agent write the commit message ----------
  function shotMessage(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('message');
    riso({ seed: 73 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tWrite = wt('message', 'write'), tDiff = wt('message', 'diff'), tFacts = wt('message', 'facts'), tFix = wt('message', 'fix'), tNoise = wt('message', 'noise'), tExp = wt('message', 'explains'),
      tSix = wt('message', 'six'), tCo = wt('message', 'author'), tSearch = wt('message', 'searchable'), tName = wt('message', 'name');
    // the diff feeds the agent
    const kd = stamp(t, tDiff - .3) * (1 - ease(seg(t, tFix - .5, tFix)));
    if (kd > .01) diffPanel(420, 460, 460, 420, kd);
    if (t > tDiff && t < tFix) for (let i = 0; i < 5; i++) { const f = frac((t - tDiff) * 1.2 + i / 5), p = arcPt([600, 400 + i * 30], [900, 700], 80, f); paint(rrPts(p[0] - 30, p[1] - 8, 60, 16, 8), { fill: i % 2 ? INK.green : INK.orange }); }
    clawd(960, 900, 16, { ...emotions(t, [[b.start, 'neutral'], [tDiff, 'thinking'], [tFacts, 'determined'], [tExp, 'happy'], [tName, 'proud']]) });
    // the lazy message
    const kf2 = stamp(t, tFix - .3);
    if (kf2 > .01) { push(); translate(460, 380); rotate(-.06); scale(kf2); paint(rrPts(-260, -80, 520, 160, 16), { fill: INK.paper, ink: INK.navy, sw: 1.1 }); type('fix auth bug', 0, 4, 64, INK.navy, { tone: .8 }); pop(); stampX(460, 380, 110, stamp(t, tNoise)); }
    // the agent's message: it writes itself out
    const ke = stamp(t, tFacts - .2);
    if (ke > .01) {
      push(); translate(1420, 440); scale(ke);
      paint(rrPts(-300, -250, 600, 500, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-300, -250, 600, 60, 18), { fill: INK.navy });
      const n = Math.floor(9 * seg(t, tFacts, tExp + 1.4));
      for (let i = 0; i < n; i++) paint(rrPts(-260, -160 + i * 40, (i === 0 ? 420 : 500 * (.5 + .5 * hash(i + 21))), 14, 7), { fill: i === 0 ? INK.orange : INK.navy, tone: i === 0 ? 1 : .6 });
      // co-authors: the agent's mark and the captain's cap
      if (t > tCo - .15) { const kc = stamp(t, tCo - .15); paint(rrPts(-270, 160, 540, 70, 14), { fill: INK.gold, tone: kc }); push(); translate(-200, 196); scale(kc); paint(rrPts(-30, -22, 60, 40, 6), { fill: INK.orange }); paint(rectPts(-14, -12, 6, 12), { fill: INK.dark }); paint(rectPts(8, -12, 6, 12), { fill: INK.dark }); pop(); push(); translate(-110, 214); scale(kc); cap(0, 0, .7); pop(); }
      if (t > tSearch - .2) { push(); translate(210, 196); scale(stamp(t, tSearch - .2) * .55); magnifier(0, -10, 1); pop(); }
      pop();
      if (t > tName - .1) { const k = stamp(t, tName - .1); paint(starPts(1720, 700, 60 * k, .45, 5), { fill: INK.gold, ink: INK.navy, sw: 1 }); }
    }
    // six months later: calendar pages flip
    if (t > tSix - .3 && t < tCo + .3) { const k = stamp(t, tSix - .3) * (1 - ease(seg(t, tCo - .1, tCo + .3))); push(); translate(420, 720); scale(k); const fl = Math.floor(seg(t, tSix, tSix + 1) * 6); for (let i = 5; i >= 0; i--) if (i >= fl) { paint(rrPts(-120 + i * 4, -110 - i * 4, 240, 220, 14), { fill: INK.paper, ink: INK.navy, sw: 1 }); paint(rrPts(-120 + i * 4, -110 - i * 4, 240, 50, 14), { fill: INK.orange }); } type(String(Math.min(6, fl)), 0, 20, 110, INK.navy); pop(); }
    const kS = stamp(t, tName - .4);
    if (kS > .01) skipper(1760, 1040 + 300 * (1 - kS), 13, skipAct(t, [[tName - .4, 'stand', { mood: 'neutral', flip: true }], [tName, 'point', { mood: 'proud', flip: true }]]));
    camEnd();
    tIn('iris', lt, { cx: 1300, cy: 700 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- D · a branch per task ----------
  function shotBranch(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('branch');
    riso({ seed: 74 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tBr = wt('branch', 'branch'), tIso = wt('branch', 'isolation'), tScope = wt('branch', 'scope'), tRoll = wt('branch', 'rollback'), tDel = wt('branch', 'delete'), tName = wt('branch', 'name'), tMan = wt('branch', 'manifest');
    const MY = 820, g1 = 1 - ease(seg(t, tName - .4, tName));
    // main
    rail(80, 1840, MY, 18);
    for (let i = 0; i < 8; i++) dot(160 + i * 240, MY, 34, INK.gold);
    // the branch forks up; later it's snipped and falls
    const grow = ease(seg(t, tBr - .5, tBr + .3)), fall = easeIn(seg(t, tDel + .1, tDel + .8));
    if (grow > 0 && fall < 1 && g1 > .01) {
      push(); translate(0, fall * 700); rotate(fall * .3);
      const P = through([[640, MY], [760, MY - 160], [900, 440], [1300, 440]]), n = Math.max(2, Math.floor(P.length * grow));
      inkLine(P.slice(0, n), 3.4, INK.orange, 'ink', 0, { force: true });
      for (let i = 0; i < 3; i++) if (grow > .6 + i * .12) dot(1000 + i * 150, 440, 34, INK.orange);
      clawd(lerp(760, 1180, ease(seg(t, tBr, tIso))), 440 - 38, 10, { ...emotions(t, [[b.start, 'happy'], [tDel, 'surprised']]), noShadow: true });
      // isolation: a glass dome; review scope: brackets
      const kd = stamp(t, tIso - .2);
      if (kd > .01) { paint(rrPts(860, 440 - 320 * kd, 560, 320 * kd + 30, 140), { fill: INK.navy, tone: .18, over: true }); inkLine(through([[860, 470], [860, 300], [1000, 180], [1280, 180], [1420, 300], [1420, 470]]), 1.4, INK.navy, 'ink', .4, { force: true, tone: kd }); }
      const ks = stamp(t, tScope - .2);
      if (ks > .01) for (const s of [-1, 1]) { const x = 1140 + s * 330 * ks; inkLine([[x - s * 30, 160], [x, 160], [x, 520], [x - s * 30, 520]], 2.4, INK.orange, 'ink', 0, { force: true }); }
      pop();
    }
    // delete: the scissors
    if (t > tDel - .4 && t < tDel + .9) { const k = stamp(t, tDel - .4), c = Math.abs(Math.sin((t - tDel) * 14)) * .4; push(); translate(680, MY - 80); scale(k); for (const s of [-1, 1]) { push(); rotate(s * (.3 + c)); paint(ribbon([[0, 0], [150, 0]], 18, 4), { fill: INK.navy }); paint(ellPts(-40, 0, 30, 20, 16), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); pop(); } pop(); }
    if (t > tRoll - .2 && t < tDel) { const k = stamp(t, tRoll - .2); push(); translate(420, 560); scale(k); arcLine(0, 0, 70, 20, INK.orange, { a0: Math.PI * 1.1, a1: Math.PI * 2.3, cap: 'round' }); pop(); }
    // the manifest: a column of named branch flags
    if (t > tName - .3) for (let i = 0; i < 4; i++) {
      const k = stamp(t, lerp(tName, tMan, i / 3) - .1); if (k <= .01) continue;
      const y = 180 + i * 140;
      push(); translate(960, y); scale(k);
      inkLine([[-460, 60], [-460, -50]], 1.4, INK.dark, 'ink', 0, { force: true });
      paint([[-460, -50], [320, -50], [380, 0], [320, 50], [-460, 50]], { fill: [INK.orange, INK.gold, INK.green, INK.navy][i] });
      paint(rrPts(-420, -14, 160, 28, 14), { fill: INK.paper, tone: .9 }); paint(rrPts(-240, -14, 360 * (.5 + .5 * hash(i + 3)), 28, 14), { fill: INK.paper, tone: .6 });
      pop();
    }
    if (t > tName - .3) clawd(1640, MY - 14, 12, { ...feel('happy', T), ...move('bounce', T, 2), flip: true });
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- E · worktrees for parallel agents ----------
  function shotWorktree(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('worktree');
    riso({ seed: 75 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tPar = wt('worktree', 'parallel'), tOne = wt('worktree', 'one'), tFight = wt('worktree', 'fight'), tWork = wt('worktree', 'work', 1), tHist = wt('worktree', 'history'), tCheap = wt('worktree', 'cheapest'),
      tTrack = wt('worktree', 'tracks'), tEnv = wt('worktree', 'environment'), tInst = wt('worktree', 'install');
    const sp = ease(seg(t, tWork - .3, tWork + .4)), FX = [lerp(960, 560, sp), lerp(960, 1360, sp)], FY = 440;
    // the trunk: one history underneath
    const kr = ease(seg(t, tHist - .4, tHist + .3));
    if (kr > 0) { paint(rrPts(900, 820, 120, 260, 20), { fill: INK.brown }); for (const s of [0, 1]) inkLine(through([[960, 840], [lerp(960, FX[s], .5), 760], [FX[s], 700]]).slice(0, Math.max(2, Math.floor(8 * kr))), 3, INK.brown, 'ink', 0, { force: true }); dot(960, 900, 40, INK.gold, kr); }
    // folders: one at first, then two
    const folder = (x, k, col) => { if (k <= .01) return; push(); translate(x, FY); scale(k); paint(rrPts(-280, -230, 200, 60, 16), { fill: INK.brown }); paint(rrPts(-280, -200, 560, 440, 22), { fill: col }); paint(rrPts(-280, -200, 560, 440, 22), { fill: INK.navy, tone: .12, over: true }); pop(); };
    const kf1 = stamp(t, tOne - .3, .4);
    if (sp < .05) folder(960, kf1, INK.gold);
    else { folder(FX[0], 1, INK.gold); folder(FX[1], 1, INK.gold); for (let s = 0; s < 2; s++) branchIcon(FX[s] + 180, FY - 110, .7, INK.navy, s ? INK.orange : INK.green); }
    // two agents; they fight in one folder, then each gets its own
    const fight = t > tFight - .1 && sp < .1;
    if (fight) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * 3; paint(ellPts(960 + Math.cos(a) * 150, FY + 100 + Math.sin(a) * 70, 70, 50, 16), { fill: INK.navy, tone: .3, over: true }); }
    const kA = stamp(t, tPar - .3);
    if (kA > .01) for (let s = 0; s < 2; s++) {
      const x0 = s ? 1600 : 320, xIn = s ? 1040 : 880, x = sp > 0 ? lerp(xIn, FX[s], sp) : lerp(x0, xIn, ease(seg(t, tOne - .2, tOne + .5)));
      const y = sp > 0 || t > tOne ? FY + 200 : 900;
      clawd(x + (fight ? 20 * Math.sin(t * 30 + s * 3) : 0), y, 12 * kA, { ...emotions(t, [[b.start, 'neutral'], [tFight, 'angry'], [tWork + .2, 'happy'], [tEnv, 'determined']]), flip: s === 1 });
    }
    // cheapest sandbox: a coin
    if (t > tCheap - .2 && t < tTrack) { const k = stamp(t, tCheap - .2); paint(ellPts(960, 180, 70 * k, 70 * k, 32), { fill: INK.gold, ink: INK.navy, sw: 1.2 }); paint(ellPts(960, 180, 44 * k, 44 * k, 28), { fill: INK.orange, tone: .6, over: true }); }
    // not tracked: an env key and a package bounce off
    const bounce = (t0, fn, sx) => { if (t < t0 - .6) return; const f = seg(t, t0 - .6, t0 + .8), x = lerp(sx, sx < 960 ? 820 : 1100, ease(seg(f, 0, .45))) + (sx < 960 ? -1 : 1) * 260 * easeOut(seg(f, .45, 1)), y = 110 + 40 * Math.sin(f * 3); push(); translate(x, y); fn(); pop(); stampX(x, y, 60, stamp(t, t0 + .1)); };
    bounce(tEnv, () => { arcLine(0, 0, 34, 14, INK.gold); paint(rrPts(28, -9, 90, 18, 8), { fill: INK.gold }); paint(rectPts(90, 0, 12, 26), { fill: INK.gold }); }, -150);
    bounce(tInst, () => { paint(rrPts(-60, -50, 120, 100, 10), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rectPts(-60, -10, 120, 16), { fill: INK.gold }); }, 2070);
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 400 });
  }

  // ---------- F · the tool does it; cloud agents; the same shape ----------
  function shotCloud(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('cloud');
    riso({ seed: 76 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tCr = wt('cloud', 'create'), tCl = wt('cloud', 'cloud'), tClone = wt('cloud', 'clone'), tPull = wt('cloud', 'pull'), tShape = wt('cloud', 'shape'), tCopy = wt('cloud', 'copy'), tDed = wt('cloud', 'dedicated'), tDiff = wt('cloud', 'diff');
    const g1 = 1 - ease(seg(t, tShape - .4, tShape));
    if (g1 > .01) {
      // the repo on the laptop, and a gear that builds a worktree beside it
      push(); translate(420, 640); scale(g1);
      paint(rrPts(-230, -170, 460, 300, 20), { fill: INK.navy }); paint(rrPts(-200, -140, 400, 240, 12), { fill: 'yellow', tone: .25 }); paint([[-280, 130], [280, 130], [320, 180], [-320, 180]], { fill: INK.navy, tone: .75 });
      branchIcon(-60, -20, .8, INK.navy, INK.gold);
      pop();
      if (t > tCr - .3) { const k = stamp(t, tCr - .3) * g1, r = t * 2; push(); translate(700, 360); scale(k); const P = []; for (let i = 0; i < 48; i++) { const a = r + i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? 70 : 56; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); } paint(P, { fill: INK.gold }); paint(ellPts(0, 0, 24, 24, 16), { fill: INK.paper }); pop(); const kw = stamp(t, tCr + .3) * g1; if (kw > .01) { push(); translate(700, 560); scale(kw * .6); branchIcon(0, 0, 1, INK.navy, INK.green); pop(); } }
      // the cloud, with an agent inside; the repo is cloned up, a pull request comes down
      const kc = stamp(t, tCl - .3) * g1;
      if (kc > .01) { push(); translate(1320, 300); scale(kc); for (const [dx, dy, r] of [[-200, 40, 150], [0, -50, 200], [210, 40, 140]]) paint(ellPts(dx, dy, r, r * .75, 40), { fill: INK.navy, tone: .85 }); paint(rrPts(-340, 20, 690, 150, 75), { fill: INK.navy, tone: .85 }); pop(); clawd(1320, 390, 10 * kc, { ...feel(t > tPull ? 'proud' : 'determined', T), ...move('idle', T, 3), noShadow: true }); }
      if (t > tClone - .1 && t < tPull) { const p = arcPt([420, 560], [1320, 300], 200, ease(seg(t, tClone - .1, tClone + .8))); push(); translate(p[0], p[1]); scale(.5); branchIcon(0, 0, 1, INK.navy, INK.gold); pop(); }
      if (t > tPull - .2) { const p = arcPt([1320, 360], [1560, 760], 120, ease(seg(t, tPull - .2, tPull + .5))); push(); translate(p[0], p[1]); scale(g1); card(0, 0, 220, 150, INK.green, 3, { bar: INK.paper }); pop(); }
      const kS = stamp(t, tPull - .4);
      if (kS > .01) skipper(1760, 1040 + 300 * (1 - kS * g1), 14, skipAct(t, [[tPull - .4, 'stand', { mood: 'neutral', flip: true }], [tPull + .3, 'present', { mood: 'grin', flip: true }]]));
    }
    // the same shape every time
    if (t > tShape - .2) {
      const trio = [[tCopy, 480, () => { card(-20, -20, 200, 150, INK.paper, 3, { ink: INK.navy }); card(20, 20, 200, 150, INK.gold, 3, { ink: INK.navy }); }], [tDed, 960, () => branchIcon(0, 0, 1.3, INK.navy, INK.orange)], [tDiff, 1440, () => diffPanel(0, 0, 260, 240, 1)]];
      trio.forEach(([t0, x, fn]) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(x, 480); scale(k); paint(ellPts(0, 0, 200, 200, 48), { fill: 'yellow', tone: .5 }); fn(); pop(); });
      for (let i = 0; i < 2; i++) { const k = ease(seg(t, trio[i + 1][0] - .4, trio[i + 1][0])); if (k > 0) paint(ribbon([[680 + i * 480, 480], [680 + i * 480 + 80 * k, 480]], 22), { fill: INK.navy }); }
      clawd(960, 940, 13, { ...feel('happy', T), ...move('bounce', T, 1) });
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 400 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- G · review through the diff; review at volume ----------
  function shotReview(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('review');
    riso({ seed: 77 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    const tDiff = wt('review', 'diff'), tTest = wt('review', 'test'), tScope = wt('review', 'scope'), tInt = wt('review', 'interfaces'), tBot = wt('review', 'bottleneck'), tSmall = wt('review', 'small'), tCI = wt('review', 'ci'), tWeek = wt('review', 'week');
    const g1 = 1 - ease(seg(t, tBot - 1.2, tBot - .8)), g2 = ease(seg(t, tBot - 1, tBot - .6));
    if (g1 > .01) {
      const hl = t > tTest - .1 ? (t > tInt - .1 ? 7 : 0) : -1;
      diffPanel(820, 520, 900, 760, stamp(t, tDiff - .3) * g1, hl);
      // scope creep: a stray file sneaks in from the edge, flagged
      if (t > tScope - .6) { const f = ease(seg(t, tScope - .6, tScope + .1)), x = lerp(1700, 1360, f); push(); translate(x, 300); rotate(.2 * Math.sin(t * 6)); scale(g1); fileIcon(0, 0, 1.2, INK.paper); paint(rrPts(-48, -62, 96, 124, 10), { fill: INK.orange, tone: .45, over: true }); pop(); if (t > tScope + .1) { inkLine([[x + 60, 400], [x + 60, 230]], 1.3 * g1, INK.dark, 'ink', 0, { force: true }); paint([[x + 60, 230], [x + 140, 256], [x + 60, 282]], { fill: INK.orange, alpha: g1 }); } }
      if (t > tInt - .2) { const k = stamp(t, tInt - .2) * g1; push(); translate(1440, 700); scale(k); paint(rrPts(-60, -40, 120, 80, 14), { fill: INK.gold }); paint(rectPts(-40, -80, 18, 40), { fill: INK.gold }); paint(rectPts(22, -80, 18, 40), { fill: INK.gold }); paint(rectPts(-10, 40, 20, 50), { fill: INK.gold }); pop(); }
      clawd(1600, 960, 13, { ...emotions(t, [[b.start, 'neutral'], [tScope, 'suspicious'], [tInt + .3, 'thinking']]), flip: true, dy: 30 * (1 - g1) });
    }
    if (g2 > .01) {
      // a bottleneck: pull requests jam, then shrink and flow
      push(); translate(0, 0); scale(1);
      const BX = 820;
      paint([[BX - 360, 160], [BX + 360, 160], [BX + 360, 470], [BX + 90, 590], [BX + 90, 720], [BX - 90, 720], [BX - 90, 590], [BX - 360, 470]], { fill: INK.navy, tone: .22 * g2 });
      inkLine([[BX - 360, 160], [BX - 360, 470], [BX - 90, 590], [BX - 90, 720]], 1.6, INK.navy, 'ink', 0, { force: true, tone: g2 }); inkLine([[BX + 360, 160], [BX + 360, 470], [BX + 90, 590], [BX + 90, 720]], 1.6, INK.navy, 'ink', 0, { force: true, tone: g2 });
      pop();
      const shrink = ease(seg(t, tSmall - .2, tSmall + .4));
      for (let i = 0; i < 9; i++) {
        const s = lerp(1.3, .55, shrink), jam = [BX - 220 + (i % 3) * 220, 260 + Math.floor(i / 3) * 110];
        let x = jam[0], y = jam[1];
        if (shrink > .5) { const f = frac((t - tSmall) * .5 + i / 9); x = lerp(jam[0], BX, Math.min(1, f * 2)); y = lerp(jam[1], 1000, f); if (f > .72) continue; }
        push(); translate(x, y); scale(s * g2); card(0, 0, 150, 90, [INK.green, INK.gold, INK.orange][i % 3], 2, { bar: INK.paper }); pop();
      }
      // the machines take the first pass
      const km = stamp(t, tCI - .3);
      if (km > .01) { push(); translate(BX, 860); scale(km); paint(rrPts(-200, -80, 400, 160, 24), { fill: INK.navy }); for (let i = 0; i < 3; i++) paint(ellPts(-110 + i * 110, -10, 30, 30, 20), { fill: t > tCI + .2 * i ? INK.green : INK.orange }); pop(); check(BX + 240, 780, 1.1, stamp(t, tCI + .4)); }
      // don't start what you can't review this week
      if (t > tWeek - .3) { const k = stamp(t, tWeek - .3); push(); translate(1520, 420); scale(k); paint(rrPts(-170, -150, 340, 300, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-170, -150, 340, 60, 18), { fill: INK.orange }); for (let i = 0; i < 7; i++) paint(rrPts(-150 + i * 44, -60, 34, 34, 6), { fill: i < 5 ? INK.navy : INK.navy, tone: i < 5 ? .6 : .2 }); paint(rrPts(-160, 30, 320, 30, 15), { fill: INK.green }); paint(rrPts(60, 30, 100, 30, 15), { fill: INK.orange, over: true }); pop(); }
      skipper(1540, 1040, 14, skipAct(t, [[tBot - .8, 'think', { mood: 'worried', flip: true }], [tSmall, 'present', { mood: 'grin', flip: true }], [tWeek, 'hips', { mood: 'happy', flip: true }]]));
    }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- H · agents read your history; next ----------
  function shotHistory(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('history');
    riso({ seed: 78 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, W + 400, 400), { fill: 'yellow', tone: .45 });
    const tRead = wt('history', 'read'), tLog = wt('history', 'log'), tBlame = wt('history', 'blame'), tFix = wt('history', 'fix'), tGuess = wt('history', 'guessing'), tCom = wt('history', 'commit'),
      tBr = wt('history', 'branch'), tPull = wt('history', 'pull'), tCtx = wt('history', 'context'), tTest = wt('history', 'testing');
    const g1 = 1 - ease(seg(t, tCom - .5, tCom - .1)), conv = ease(seg(t, tCtx - .2, tCtx + .5));
    if (g1 > .01) {
      // the log: a scroll of commits rolling up
      push(); translate(700, 500); scale(stamp(t, b.start, .4) * g1);
      paint(rrPts(-380, -380, 760, 720, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
      rail(-300, -300 + 1, 0, 1);
      inkLine([[-300, -350], [-300, 320]], 2, INK.navy, 'ink', 0, { force: true });
      const off = ((t - b.start) * 60) % 110;
      for (let i = 0; i < 7; i++) { const y = -320 + i * 110 - off + 55; if (y < -340 || y > 310) continue; dot(-300, y, 22, i % 3 === 0 ? INK.green : INK.gold); paint(rrPts(-250, y - 12, 480 * (.5 + .5 * hash(i + Math.floor((t - b.start) * 60 / 110) * 7)), 24, 12), { fill: INK.navy, tone: .55 }); }
      if (t > tBlame - .2) { const k = stamp(t, tBlame - .2); push(); translate(160, 0); scale(k * 1.6); magnifier(0, 0, 1); pop(); }
      pop();
      // a history of "fix bug"
      if (t > tFix - .2) { const k = stamp(t, tFix - .2) * g1; push(); translate(1400, 330); rotate(.05); scale(k); paint(rrPts(-200, -70, 400, 140, 16), { fill: INK.paper, ink: INK.navy, sw: 1.1 }); type('fix bug', 0, 4, 60, INK.navy, { tone: .8 }); pop(); }
    }
    clawd(1400, 960, 16, { ...emotions(t, [[b.start, 'neutral'], [tRead, 'thinking'], [tGuess - .2, 'confused', { emote: '?' }], [tCom, 'neutral'], [tCtx + .2, 'starstruck'], [tTest, 'determined']]), flip: true });
    // every message, branch name and pull request is context
    const pieces = [[tCom, 480, (s) => card(0, 0, 240, 170, INK.gold, 3)], [tBr, 960, (s) => branchIcon(0, 0, 1.1, INK.navy, INK.orange)], [tPull, 1440, (s) => card(0, 0, 240, 170, INK.green, 3, { bar: INK.paper })]];
    pieces.forEach(([t0, x, fn]) => { const k = stamp(t, t0 - .2); if (k <= .01 || conv >= 1) return; push(); translate(lerp(x, 960, conv), lerp(420, 380, conv)); scale(k * (1 - .7 * conv)); fn(); pop(); });
    if (conv > 0) { glow(960, 380, 300 * conv, 'yellow', .95); paint(starPts(960, 380, 110 * backOut(seg(t, tCtx + .3, tCtx + .7)), .42, 8, t * .3), { fill: INK.gold }); }
    // next: testing, the feedback loop
    if (t > tTest - .3) { const k = stamp(t, tTest - .3, .4); push(); translate(960, 380); scale(k); arcLine(0, 0, 200, 22, INK.navy, { a0: -.4, a1: TAU * .78, cap: 'round' }); check(0, 0, 2, stamp(t, tTest + .2)); pop(); }
    const kS = stamp(t, tCom - .4);
    if (kS > .01) skipper(300, 1040 + 300 * (1 - kS), 16, skipAct(t, [[tCom - .4, 'present', { mood: 'grin' }], [tCtx, 'hips', { mood: 'happy' }], [tTest, 'wave', { mood: 'grin', t }]]));
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) {
    const long = TIMING.title.length > 16;
    ident(T0, lt, dur, TIMING.chapter, long ? '' : TIMING.title);
    if (long) {   // too long for ident's title line: two smaller lines, same timing and camera
      const t = onTwos(lt), [a, c] = split2(TIMING.title);
      camBegin(960, 540, 1 + .03 * ease(seg(t, 0, dur)));
      type(a, 1340, 675, 64, INK.navy, { pop: seg(t, 1.9, 2.3) });
      type(c, 1340, 755, 64, INK.navy, { pop: seg(t, 2.0, 2.4) });
      camEnd();
    }
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }
  function shotEnd(T0, lt, dur) {
    const long = TIMING.next.length > 16;
    endCard(T0, lt, dur, '06', long ? '' : TIMING.next);
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
  function shotTwentyIn(T0, lt, dur) { shotTwenty(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('twenty', 0), shotTwentyIn],
    [shotAt('small'), shotSmall],
    [shotAt('message'), shotMessage],
    [shotAt('branch'), shotBranch],
    [shotAt('worktree'), shotWorktree],
    [shotAt('cloud'), shotCloud],
    [shotAt('review'), shotReview],
    [shotAt('history'), shotHistory],
    [B.history.end + .9, shotEnd],
  ]);
})();
