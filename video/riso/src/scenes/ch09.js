// ch09.js: Chapter 9 · Extending the Agent's Reach. Storyboard: video/storyboards/ch09.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const terminal = (x, y, w, h, lines) => { paint(rrPts(x - w / 2, y - h / 2, w, h, 16), { fill: INK.navy }); paint(rrPts(x - w / 2, y - h / 2, w, 30, 12), { fill: INK.dark }); for (let i = 0; i < 3; i++) paint(ellPts(x - w / 2 + 22 + i * 22, y - h / 2 + 15, 6, 6, 10), { fill: [INK.orange, INK.yellow, INK.green][i] }); for (let i = 0; i < lines; i++) paint(rrPts(x - w / 2 + 24, y - h / 2 + 50 + i * 26, (w - 60) * (.35 + .6 * hash(i + 3)), 12, 6), { fill: i === lines - 1 ? INK.yellow : INK.paper, tone: .9 }); };
  const wrench = (x, y, s, rot, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-20, -150, 40, 250, 18), { fill: col }); paint(ellPts(0, -160, 56, 56, 28), { fill: col }); paint(rrPts(-18, -225, 36, 70, 6), { fill: INK.paper }); pop(); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  // a browser window: kind 0 logs, 1 ticket, 2 schema, 3 docs, 4 chart, 5 chat
  const win = (x, y, w, h, kind, head = INK.navy) => {
    paint(rrPts(x - w / 2, y - h / 2, w, h, 14), { fill: INK.paper, ink: INK.navy, sw: 1.1 });
    paint(rrPts(x - w / 2, y - h / 2, w, 34, 12), { fill: head });
    paint(rrPts(x - w / 2 + 16, y - h / 2 - 16, w * .38, 26, 8), { fill: head });   // the tab
    const L = x - w / 2 + 24, T = y - h / 2 + 56, iw = w - 48, ih = h - 76;
    if (kind === 0) for (let i = 0; i < 6; i++) paint(rrPts(L, T + i * ih / 6, iw * (.4 + .55 * hash(i + 9)), ih / 12, 5), { fill: i === 3 ? INK.orange : INK.navy, tone: i === 3 ? 1 : .55 });
    else if (kind === 1) { paint(rrPts(L, T, iw * .5, ih * .18, 6), { fill: INK.orange }); for (let i = 0; i < 3; i++) paint(rrPts(L, T + ih * (.35 + i * .2), iw * (.9 - i * .2), ih * .1, 5), { fill: INK.navy, tone: .5 }); }
    else if (kind === 2) { for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) paint(rectPts(L + c * iw / 3 + 3, T + r * ih / 4 + 3, iw / 3 - 6, ih / 4 - 6), { fill: r === 0 ? INK.gold : INK.navy, tone: r === 0 ? 1 : .3 }); }
    else if (kind === 3) { paint(rectPts(L, T, iw * .6, ih * .14), { fill: INK.navy }); for (let i = 0; i < 4; i++) paint(rrPts(L, T + ih * (.3 + i * .17), iw * (.95 - .1 * hash(i)), ih * .07, 4), { fill: INK.navy, tone: .4 }); }
    else if (kind === 4) { const P = [[L, T + ih]]; for (let i = 0; i <= 8; i++) P.push([L + i * iw / 8, T + ih * (.8 - .6 * hash(i + 2))]); P.push([L + iw, T + ih]); paint(P, { fill: INK.green, tone: .8 }); }
    else { paint(rrPts(L, T, iw * .7, ih * .3, 12), { fill: INK.gold }); paint(rrPts(L + iw * .3, T + ih * .5, iw * .7, ih * .3, 12), { fill: INK.navy, tone: .5 }); }
  };
  const clip = (x, y, s, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-50, -64, 100, 128, 10), { fill: INK.gold, over: true }); paint(rrPts(-22, -74, 44, 22, 6), { fill: INK.navy }); for (let i = 0; i < 3; i++) paint(rectPts(-32, -30 + i * 26, 64, 9), { fill: INK.navy, tone: .6 }); pop(); };
  const chainLinks = (x0, y0, x1, y1, n, k, sag = 30) => { for (let i = 0; i < n * k; i++) { const f = i / (n - 1), x = lerp(x0, x1, f), y = lerp(y0, y1, f) + Math.sin(f * Math.PI) * sag; arcLine(x, y, 16, 8, INK.gold, {}); } };
  const padlock = (x, y, s, open = 0) => { push(); translate(x, y); scale(s); arcLine(0, -30 - 20 * open, 26, 10, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(-38, -30, 76, 60, 10), { fill: INK.gold }); paint(ellPts(0, -4, 8, 8, 10), { fill: INK.navy }); pop(); };
  const server = (x, y, s, col = INK.navy, light = INK.green) => { push(); translate(x, y); scale(s); for (let i = 0; i < 2; i++) { paint(rrPts(-110, -80 + i * 84, 220, 72, 12), { fill: col }); paint(ellPts(-80, -44 + i * 84, 9, 9, 10), { fill: light }); paint(rrPts(-40, -50 + i * 84, 110, 14, 7), { fill: INK.paper, tone: .7 }); } pop(); };
  const dbCyl = (x, y, rx, h, col = INK.gold) => { paint(rectPts(x - rx, y - h / 2, rx * 2, h), { fill: col }); paint(ellPts(x, y + h / 2, rx, rx * .3, 48), { fill: col }); for (let i = 1; i < 3; i++) paint(ribbon(Array.from({ length: 13 }, (_, j) => { const a = j / 12 * Math.PI; return [x - Math.cos(a) * rx, y - h / 2 + i * h / 3 + Math.sin(a) * rx * .3]; }), 8), { fill: INK.navy, tone: .7 }); paint(ellPts(x, y - h / 2, rx, rx * .3, 48), { fill: INK.orange }); };
  const cable = (P, col = INK.navy, w = 1.1, k = 1) => { const c = through(P, 8), n = Math.max(2, Math.round(c.length * k)); inkLine(c.slice(0, n), w, col, 'ink', 0, { force: true }); };
  const plug = (x, y, s, col = INK.orange) => { push(); translate(x, y); scale(s); paint(rrPts(-70, -34, 90, 68, 12), { fill: col, over: true }); paint(rectPts(20, -22, 44, 12), { fill: INK.navy }); paint(rectPts(20, 10, 44, 12), { fill: INK.navy }); pop(); };

  // ---------- A · tabs: the agent chained to a desk while the engineer shuttles between six tabs ----------
  function shotTabs(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('tabs');
    riso({ seed: 91 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tLogs = wt('tabs', 'logs'), tTick = wt('tabs', 'ticket'), tSch = wt('tabs', 'schema'), tSix = wt('tabs', 'six'), tCopy = wt('tabs', 'copy'), tPaste = wt('tabs', 'paste'),
      tRep = wt('tabs', 'repeat'), tAgent = wt('tabs', 'agent'), tLocal = wt('tabs', 'local'), tBril = wt('tabs', 'brilliant'), tChain = wt('tabs', 'chained');
    // the tabs: three stamp in, then fan out to six
    const fan = backOut(seg(t, tSix - .1, tSix + .4));
    const P3 = [[1000, 380], [1360, 350], [1700, 390]], P6 = [[900, 330], [1180, 290], [1460, 320], [1740, 350], [1060, 610], [1580, 600]];
    const kinds = [0, 1, 2, 3, 4, 5], heads = [INK.navy, INK.orange, INK.green, INK.navy, INK.brown, INK.orange], tt = [tLogs, tTick, tSch, tSix, tSix + .1, tSix + .2];
    for (let i = 0; i < 6; i++) {
      const k = stamp(t, tt[i] - .15); if (k <= .01) continue;
      const p0 = i < 3 ? P3[i] : P6[i], p = [lerp(p0[0], P6[i][0], fan), lerp(p0[1], P6[i][1], fan)], s = lerp(1, .82, fan) * k;
      push(); translate(p[0], p[1]); scale(s); rotate((hash(i) - .5) * .08); win(0, 0, 320, 230, kinds[i], heads[i]); pop();
    }
    // copy, paste, repeat: the Skipper ferries a clipboard between tabs
    const hops = [tCopy, tPaste, tRep], xs = [980, 1580, 1080, 1520];
    let hx = xs[0]; for (let i = 0; i < 3; i++) hx = lerp(hx, xs[i + 1], ease(seg(t, hops[i] - .1, hops[i] + .45)));
    const kS = stamp(t, tSix);
    if (kS > .01) {
      skipper(hx, 1050 + 320 * (1 - kS), 16, { ...skipAct(t, [[tSix, 'stand', { mood: 'neutral' }], [tCopy - .1, 'present', { mood: 'focused', flip: false }], [tPaste - .1, 'present', { mood: 'focused', flip: true }], [tRep - .1, 'present', { mood: 'worried', flip: false }], [tAgent, 'shrug', { mood: 'worried', flip: true }]]),
        prop: t > tCopy - .2 && t < tAgent ? (u => clip(0, -u * 1.2, u / 36)) : null });
    }
    // the agent: at its terminal on the left, only local files around it, then chained
    terminal(420, 520, 300, 200, 3);
    paint(rectPts(160, 640, 520, 30), { fill: INK.brown });
    paint(rectPts(190, 670, 26, 240), { fill: INK.brown }); paint(rectPts(624, 670, 26, 240), { fill: INK.brown });
    const mood = emotions(t, [[b.start, 'neutral'], [tAgent - .1, 'hopeful'], [tBril, 'happy'], [tChain + .1, 'sad']]);
    clawd(420, 970, 20, { ...mood, flip: false });
    for (let i = 0; i < 3; i++) { const k = stamp(t, tLocal - .1 + i * .08); if (k > .01) fileIcon(270 + i * 150, 340 - (i === 1 ? 30 : 0), .7 * k); }
    if (t > tBril && t < tChain) { const k = seg(t, tBril, tBril + .4); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .35; paint(ribbon([[420 + Math.cos(a) * 190, 880 + Math.sin(a) * 190], [420 + Math.cos(a) * (190 + 60 * k), 880 + Math.sin(a) * (190 + 60 * k)]], 12), { fill: INK.gold }); } }
    const kc = seg(t, tChain - .15, tChain + .4);
    if (kc > 0) { paint(rrPts(50, 960, 110, 70, 12), { fill: INK.dark }); chainLinks(105, 965, 350, 955, 10, kc, 30); if (kc > .9) padlock(230, 1010, .9 * stamp(t, tChain + .3)); }
    camEnd();
    tOut('dots', lt, dur, { col: 'federal', cx: 420, cy: 800 });
  }

  // ---------- B · MCP: the chain snaps; a standard plug; servers expose tools; one server, every agent ----------
  function shotMcp(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('mcp');
    riso({ seed: 92 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: 'yellow', tone: .35 });
    const tProt = wt('mcp', 'protocol'), tMcp = wt('mcp', 'mcp'), tUsb = wt('mcp', 'usb'), tSrv = wt('mcp', 'mcp', 1), tTools = wt('mcp', 'tools'), tPlug = wt('mcp', 'plug'),
      tCalls = wt('mcp', 'calls'), tTrans = wt('mcp', 'translates'), tStripe = wt('mcp', 'stripe'), tEvery = wt('mcp', 'every');
    const swap = ease(seg(t, tStripe - .3, tStripe + .2));   // the three servers give way to one new one
    // the chain from shot A, snapping on "Protocol"
    if (t < tProt + .8) { const k = seg(t, tProt, tProt + .8); for (let i = 0; i < 9; i++) { const f = i / 8, x = lerp(80, 300, f), y = 930 + Math.sin(f * Math.PI) * 20, dx = (i < 4 ? -1 : 1) * 200 * k * (1 + hash(i)), dy = -300 * k + 700 * k * k; if (k < 1) arcLine(x + dx, y + dy, 16, 8, INK.gold); } }
    // "MCP": printed once, big, orange with a navy overprint
    const km = seg(t, tMcp - .1, tMcp + .25);
    type('MCP', 960 - 300 * swap, 170, 150, INK.orange, { pop: km });
    type('MCP', 972 - 300 * swap, 180, 150, INK.navy, { pop: seg(t, tMcp, tMcp + .35), over: true, tone: .5 });
    // the agent, its cable and the plug
    const agents = swap > 0 ? [[300, 900], [300, 520], [300, 700]] : [[300, 900]];
    const hub = [760, 700];
    const kp = ease(seg(t, tUsb - .15, tUsb + .35));
    if (swap < 1) {
      push(); translate(0, 0);
      cable([[380, 860], [520, 820], [hub[0] - 150 - 60 * (1 - kp), hub[1]]], INK.navy, 1.2);
      paint(rrPts(hub[0] - 20, hub[1] - 70, 120, 140, 18), { fill: INK.navy, alpha: 1 - swap });
      plug(hub[0] - 60 - 120 * (1 - kp), hub[1], 1);
      pop();
    }
    // three servers on the right, each with its tools
    const SY = [300, 580, 860];
    for (let i = 0; i < 3; i++) {
      const k = stamp(t, tSrv - .1 + i * .1) * (1 - swap); if (k <= .01) continue;
      const sx = 1420 + 400 * swap;
      cable([[hub[0] + 100, hub[1]], [1100, lerp(hub[1], SY[i], .6)], [sx - 120, SY[i]]], INK.navy, 1, ease(seg(t, tSrv, tSrv + .5)));
      server(sx, SY[i], .9 * k, INK.navy, [INK.green, INK.gold, INK.orange][i]);
      const kt = stamp(t, tTools + i * .1); if (kt > .01) wrench(sx + 170, SY[i] + 10, .35 * kt, .5 + .15 * Math.sin(t * 4 + i));
    }
    // a call travels from the agent through the plug to a server, and comes out translated
    if (t > tCalls - .2 && t < tStripe - .3) {
      const f = seg(t, tCalls - .2, tTrans + .5), P = through([[380, 860], [hub[0], hub[1]], [1100, 480], [1300, SY[1]]], 8), i = Math.min(P.length - 1, Math.floor(f * (P.length - 1)));
      const tr = t > tTrans; paint(tr ? rrPts(P[i][0] - 26, P[i][1] - 26, 52, 52, 8) : ellPts(P[i][0], P[i][1], 26, 26, 20), { fill: tr ? INK.orange : INK.gold });
      if (tr) { const k2 = ease(seg(t, tTrans, tTrans + .6)); paint(rrPts(1560 + 160 * k2, SY[1] - 22, 44, 44, 8), { fill: INK.orange }); }
    }
    // Stripe: one new server; every compatible agent plugs in
    if (swap > 0) {
      const ks = stamp(t, tStripe - .1);
      push(); translate(1400, 600); scale(ks); server(0, 0, 1.2, INK.orange, INK.yellow); paint(starPts(0, -170, 50, .45, 5), { fill: INK.navy }); pop();
      agents.forEach(([x, y], i) => { const ka = stamp(t, (i === 0 ? tStripe : tEvery) + i * .12); if (ka <= .01) return; cable([[x + 80, y - 40], [800, lerp(y, 600, .5)], [1250, 600]], INK.navy, 1.1, ease(seg(t, tEvery + i * .12, tEvery + .6 + i * .12))); clawd(x, y, 10 * ka, { ...feel(t > tEvery + .5 ? 'happy' : 'neutral', T + i * .3), boilKey: 'b' + i }); });
    } else {
      clawd(300, 900, 15, { ...emotions(t, [[b.start, 'sad'], [tProt + .2, 'surprised'], [tUsb + .3, 'excited'], [tCalls, 'determined']]), boilKey: 'b0' });
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 420, cy: 800 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- C · clipboard to captain: the repo is a sliver of the context; the human middleware ----------
  function shotClipboard(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('clipboard');
    riso({ seed: 93 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tRepo = wt('clipboard', 'repo'), tMiss = wt('clipboard', 'missing'), tBug = wt('clipboard', 'bug'), tLogs = wt('clipboard', 'logs'), tSch = wt('clipboard', 'schema'), tDocs = wt('clipboard', 'docs'),
      tWithout = wt('clipboard', 'without'), tMid = wt('clipboard', 'middleware'), tShut = wt('clipboard', 'shuttling'), tWith = wt('clipboard', 'with', 1), tCap = wt('clipboard', 'captain');
    const C = [960, 470], R = 270;
    // the context ring: a small wedge is the repo; the rest is empty
    const kr = stamp(t, b.start - .1, .5);
    paint(ellPts(C[0], C[1], R * kr, R * kr, 72), { fill: INK.paper });
    if (t > tMiss - .1) paint(ellPts(C[0], C[1], R * kr, R * kr, 72), { fill: INK.navy, tone: .18 * ease(seg(t, tMiss - .1, tMiss + .4)), over: true });
    const kw = ease(seg(t, tRepo - .1, tRepo + .4));
    if (kw > 0) { const P = [C]; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * .9 * kw; P.push([C[0] + Math.cos(a) * R, C[1] + Math.sin(a) * R]); } paint(P, { fill: INK.gold }); }
    arcLine(C[0], C[1], R * kr, 14, INK.navy);
    // the four places the rest lives
    const IC = [[380, 250, tBug], [380, 650, tLogs], [1540, 250, tSch], [1540, 650, tDocs]];
    IC.forEach(([x, y, t0], i) => { const k = stamp(t, t0 - .1); if (k <= .01) return; push(); translate(x, y); scale(.8 * k); win(0, 0, 280, 200, [1, 0, 2, 3][i], [INK.orange, INK.navy, INK.green, INK.navy][i]); pop(); });
    // the bug: a little beetle on the ticket
    if (t > tBug) { const k = stamp(t, tBug); paint(ellPts(470, 320, 26 * k, 34 * k, 16), { fill: INK.dark }); for (let j = 0; j < 3; j++) paint(ribbon([[440, 305 + j * 16], [496, 305 + j * 16]], 5), { fill: INK.dark }); }
    // the agent in the middle of the ring
    const cap = ease(seg(t, tCap - .1, tCap + .4));
    clawd(C[0], C[1] + 200, 16, { ...emotions(t, [[b.start, 'neutral'], [tMiss, 'confused'], [tCap + .2, 'excited']]) });
    // cables: once the Skipper is captain, every system talks to the agent directly
    if (cap > 0) IC.forEach(([x, y], i) => cable([[x + (x < 960 ? 120 : -120), y], [lerp(x, C[0], .5), lerp(y, C[1] + 60, .3)], [C[0] + (x < 960 ? -90 : 90), C[1] + 110]], INK.orange, 2.2, ease(seg(t, tCap + i * .08, tCap + .5 + i * .08))));
    // the human middleware: running between the tabs with a clipboard
    const kS = stamp(t, tWithout - .2);
    if (kS > .01) {
      const run = seg(t, tMid - .2, tWith), ph = Math.sin(run * Math.PI * 4 - Math.PI / 2) * .5 + .5, sx = cap > 0 ? lerp(lerp(560, 1360, ph), 1560, cap) : lerp(560, 1360, ph);
      const moving = run > 0 && run < 1 && cap === 0;
      skipper(sx, 1060 + 300 * (1 - kS), 14, { ...skipAct(t, [[tWithout - .2, 'stand', { mood: 'neutral' }], [tMid - .2, 'present', { mood: 'worried' }], [tCap - .1, 'steer', { mood: 'grin' }]]),
        flip: moving ? Math.cos(run * Math.PI * 4 - Math.PI / 2) < 0 : cap > 0, dy: moving ? -Math.abs(Math.sin(t * 14)) * 14 : 0, prop: cap === 0 && t > tMid - .2 ? (u => clip(0, -u * 1.2, u / 36)) : null });
      if (cap > 0) helm(1560 + 30, 1060 - 8.6 * 14, 70 * cap, t * .6, INK.gold, INK.navy);
      if (t > tCap - .1 && t < tCap + .8) { const k = seg(t, tCap - .1, tCap + .8), p = arcPt([1360, 900], [1180, 1100], 120, k); clip(p[0], p[1], .8, k * 4); }
    }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- D · design: the model only sees what you wrote about the tool; five rules ----------
  function shotDesign(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('design');
    riso({ seed: 94 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    for (let i = 0; i < 12; i++) paint(rectPts(i * 170, -100, 3, H + 200), { fill: INK.navy, tone: .15 });
    for (let i = 0; i < 7; i++) paint(rectPts(-100, i * 170, W + 200, 3), { fill: INK.navy, tone: .15 });
    const tBuild = wt('design', 'building'), tNever = wt('design', 'never'), tWrote = wt('design', 'wrote'), tVerb = wt('design', 'verbs'), tPar = wt('design', 'parameter'), tRet = wt('design', 'return'),
      tCor = wt('design', 'correct'), tFoc = wt('design', 'focused'), tLim = wt('design', 'limit'), tSo = wt('design', 'so');
    const up = ease(seg(t, tSo - .3, tSo + .2));
    // part 1: the card and the hidden code
    if (up < 1) {
      push(); translate(0, -700 * up);
      const kc = stamp(t, tBuild - .1);
      if (kc > .01) { push(); translate(1320, 470); scale(kc); paint(rrPts(-230, -170, 460, 340, 20), { fill: INK.navy }); type('{ }', -120, -70, 90, INK.gold); for (let i = 0; i < 5; i++) paint(rrPts(-150 + 30 * (i % 2), -10 + i * 30, 240 - 40 * hash(i), 14, 7), { fill: INK.paper, tone: .7 }); pop(); }
      const kd = stamp(t, tBuild + .3);
      if (kd > .01) { push(); translate(760, 470); scale(kd); paint(rrPts(-200, -140, 400, 280, 20), { fill: INK.paper, ink: INK.navy, sw: 1.3 }); paint(rrPts(-200, -140, 400, 60, 20), { fill: INK.gold }); for (let i = 0; i < 3; i++) paint(rrPts(-160, -40 + i * 50, 320 - 80 * i, 18, 9), { fill: INK.navy, tone: .55 }); pop(); }
      // a wall drops between the card and the code
      const kw = ease(seg(t, tNever - .1, tNever + .3));
      if (kw > 0) paint(rrPts(1010, 200 - 400 * (1 - kw), 50, 560, 12), { fill: INK.navy, tone: .6 });
      if (t > tNever + .2) stampX(1320, 470, 130, stamp(t, tNever + .3));
      if (t > tWrote - .1) glow(760, 470, 320 * ease(seg(t, tWrote - .1, tWrote + .4)), 'yellow', .7);
      pop();
    }
    // part 2: five small rules
    const X = [360, 700, 1040, 1380, 1720], Y = 470;
    const panel = (i, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(X[i], Y); scale(k); paint(rrPts(-150, -170, 300, 340, 26), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); check(90, 130, .8, stamp(t, t0 + .5)); pop(); };
    // verbs: an action arrow
    panel(0, tVerb, () => { paint(ribbon([[-90, 0], [50, 0]], 40), { fill: INK.orange }); paint([[40, -60], [110, 0], [40, 60]], { fill: INK.orange }); paint(ellPts(-90, 0, 30, 30, 20), { fill: INK.navy, over: true }); });
    // every parameter: labelled fields
    panel(1, tPar, () => { for (let i = 0; i < 3; i++) { paint(rrPts(-110, -110 + i * 75, 70, 18, 9), { fill: INK.navy }); paint(rrPts(-110, -84 + i * 75, 220, 30, 8), { fill: INK.gold, tone: .6 }); } });
    // errors that say what went wrong: a slip flies back to the agent
    panel(2, tRet, () => { paint(rrPts(-100, -100, 200, 130, 14), { fill: INK.orange }); type('!', 0, -36, 90, INK.paper); for (let i = 0; i < 2; i++) paint(rrPts(-80, 60 + i * 30, 160 - 50 * i, 14, 7), { fill: INK.navy, tone: .5 }); });
    // focused: one clean wrench, the tangle crossed out
    panel(3, tFoc, () => { wrench(-50, 30, .45, -.4); inkLine(through([[20, -80], [110, -110], [60, -20], [120, 10], [40, 40], [110, 90]]), 1.2, INK.navy, 'ink', .6, { force: true }); stampX(75, 0, 50, stamp(t, tFoc + .25)); });
    // limit output: a wide stream through a funnel, one thin line out
    panel(4, tLim, () => { for (let i = 0; i < 7; i++) paint(rectPts(-110 + i * 32, -140, 20, 50), { fill: INK.navy, tone: .5 }); paint([[-120, -80], [120, -80], [20, 20], [20, 80], [-20, 80], [-20, 20]], { fill: INK.gold, over: true }); paint(rectPts(-6, 80, 12, 50 * ease(seg(t, tLim + .2, tLim + .8))), { fill: INK.orange }); });
    // the agent: reading; the error slip reaches it and it corrects itself
    const ag = [240, 1000];
    clawd(up > 0 ? lerp(420, ag[0], up) : 420, up > 0 ? lerp(900, ag[1], up) : 900, lerp(16, 13, up), { ...emotions(t, [[b.start, 'thinking'], [tNever + .2, 'confused'], [tWrote, 'happy'], [tRet + .6, 'surprised'], [tCor, 'idea'], [tCor + .8, 'happy']]) });
    if (t > tRet + .2 && t < tCor + .2) { const p = arcPt([X[2], Y - 30], [ag[0] + 90, ag[1] - 150], 200, ease(seg(t, tRet + .2, tCor))); paint(rrPts(p[0] - 50, p[1] - 32, 100, 64, 10), { fill: INK.orange }); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · skills: tools are the hands, resources the map, skills the training ----------
  function shotSkills(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('skills');
    riso({ seed: 95 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.green, tone: .7 });
    const tAct = wt('skills', 'act'), tRes = wt('skills', 'resources'), tMap = wt('skills', 'map'), tSk = wt('skills', 'skills'), tFold = wt('skills', 'folder'), tDesc = wt('skills', 'describes'),
      tHands = wt('skills', 'hands'), tTrain = wt('skills', 'training');
    // the map: unfolds panel by panel behind the agent on the left
    const km = ease(seg(t, tRes, tMap + .3));
    if (km > 0) {
      const n = 4, pw = 130;
      for (let i = 0; i < n; i++) { const k = clamp(km * n - i); if (k <= 0) continue; paint(rectPts(320 + i * pw, 260, pw * k, 360), { fill: i % 2 ? INK.gold : INK.paper, ink: INK.navy, sw: .8 }); }
      if (km > .9) { inkLine(through([[350, 560], [460, 420], [600, 500], [720, 330], [820, 380]]), 1, INK.orange, 'ink', .5, { force: true, over: true }); paint(starPts(820, 380, 30, .45, 5), { fill: INK.orange }); paint(ellPts(560, 380, 70, 50, 24), { fill: INK.green, tone: .6, over: true }); }
    }
    // the skill: a folder with a document inside
    const kf = stamp(t, tFold - .15), open = ease(seg(t, tTrain - .2, tTrain + .5));
    if (kf > .01) {
      push(); translate(1400, 500); scale(kf);
      paint(rrPts(-200, -170, 150, 50, 14), { fill: INK.gold }); paint(rrPts(-200, -140, 400, 300, 20), { fill: INK.gold });
      const dy = -120 * ease(seg(t, tDesc - .1, tDesc + .4)) - 120 * open;
      paint(rrPts(-150, -150 + dy, 300, 260 + 120 * open, 12), { fill: INK.paper, ink: INK.navy, sw: 1 });
      type('SKILL.md', 0, -110 + dy, 40, INK.navy);
      for (let i = 0; i < 3 + Math.round(2 * open); i++) { paint(ellPts(-110, -55 + dy + i * 42, 13, 13, 12), { fill: INK.orange }); paint(rrPts(-85, -63 + dy + i * 42, 190 - 50 * hash(i), 16, 8), { fill: INK.navy, tone: .5 }); }
      paint(rrPts(-200, -30, 400, 190, 20), { fill: INK.gold, over: true, tone: .8 });
      pop();
    }
    // the agent with its wrench: the hands
    const kw = stamp(t, tAct - .15);
    clawd(760, 920, 22, { ...emotions(t, [[b.start, 'neutral'], [tAct, 'determined'], [tMap, 'happy'], [tFold, 'thinking'], [tTrain + .2, 'proud']]), aR: .6,
      armR: kw > .01 ? ((u) => wrench(u * .6, 0, u / 70 * kw, 1.3)) : null });
    if (t > tHands - .1 && t < tHands + .8) glow(990, 700, 170 * Math.sin(Math.PI * seg(t, tHands - .1, tHands + .8)), 'yellow', .7);
    if (t > tTrain + .2) { const k = stamp(t, tTrain + .2); paint(starPts(760, 640, 40 * k, .45, 5), { fill: INK.orange }); }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- F · read-only as a fact: the promise is stepped around; the database refuses ----------
  function shotReadonly(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('readonly');
    riso({ seed: 96 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tStakes = wt('readonly', 'stakes'), tDel = wt('readonly', 'delete'), tFact = wt('readonly', 'fact'), tProm = wt('readonly', 'promise'), tCraft = wt('readonly', 'crafted'), tStep = wt('readonly', 'stepped'),
      tGuar = wt('readonly', 'guarantee'), tCan = wt('readonly', 'cannot'), tWrite = wt('readonly', 'write');
    const DX = 1180, DY = 580;
    // stakes: a stack of chips rising under the database
    const ks = ease(seg(t, tStakes - .3, tStakes + .3));
    dbCyl(DX, DY, 230 * stamp(t, b.start - .1, .4), 400);
    // delete: data blocks fly out of the top
    if (t > tDel - .1 && t < tFact + .2) for (let i = 0; i < 6; i++) { const f = seg(t, tDel - .1 + i * .06, tDel + .8 + i * .06), p = arcPt([DX - 100 + i * 40, DY - 200], [DX - 500 + i * 180, 1100], 260, f); if (f > 0 && f < 1) { push(); translate(p[0], p[1]); rotate(f * 4 + i); paint(rrPts(-34, -24, 68, 48, 8), { fill: INK.navy }); pop(); } }
    // the promise: a paper note pinned on the front
    const kn = stamp(t, tProm - .15), fall = seg(t, tStep, tStep + .8);
    if (kn > .01 && t < tGuar) { push(); translate(DX + 40, DY + 30 + 700 * fall * fall); rotate(-.08 + 1.2 * fall); scale(kn); paint(rrPts(-120, -90, 240, 180, 8), { fill: INK.paper, ink: INK.navy, sw: .9 }); for (let i = 0; i < 3; i++) paint(rrPts(-90, -50 + i * 38, 180 - 50 * i, 14, 7), { fill: INK.navy, tone: .5 }); paint(ellPts(0, -80, 14, 14, 12), { fill: INK.orange }); pop(); }
    // the crafted query curves around the note and gets in
    if (t > tCraft - .2 && t < tGuar) {
      const f = ease(seg(t, tCraft - .2, tStep + .3)), P = through([[640, 760], [900, 900], [1480, 820], [1440, 560], [DX + 60, DY - 60]], 8), i = Math.min(P.length - 1, Math.floor(f * (P.length - 1)));
      inkLine(P.slice(0, i + 1), .9, INK.orange, 'ink', 0, { force: true, over: true });
      push(); translate(P[i][0], P[i][1]); paint(rrPts(-80, -44, 160, 88, 12), { fill: INK.orange }); type('{ }', 0, 3, 50, INK.navy); pop();
    }
    // the guarantee: a vault drops over the database; a pencil bounces off
    const kv = ease(seg(t, tGuar - .1, tGuar + .35));
    if (kv > 0) {
      const vy = lerp(-600, DY, backOut(seg(t, tGuar - .1, tGuar + .35)));
      paint(rrPts(DX - 290, vy - 270, 580, 540, 30), { fill: INK.navy, tone: .55, over: true });
      for (let i = 0; i < 4; i++) paint(rectPts(DX - 290 + 40 + i * 150, vy - 270, 16, 540), { fill: INK.navy, tone: .6, over: true });
      padlock(DX, vy - 290, 1.3);
    }
    if (t > tCan - .3) {
      const hit = tWrite + .1, fin = seg(t, tCan - .3, hit), bo = seg(t, hit, hit + .7);
      const px = t < hit ? lerp(1850, DX + 320, easeIn(fin)) : DX + 320 + 300 * bo, py = t < hit ? 380 : 380 - 260 * bo + 500 * bo * bo;
      push(); translate(px, py); rotate(-.8 + (t < hit ? 0 : 5 * bo)); paint(rrPts(-18, -120, 36, 200, 8), { fill: INK.gold }); paint([[-18, 80], [18, 80], [0, 130]], { fill: INK.navy }); paint(rrPts(-18, -150, 36, 30, 6), { fill: INK.orange }); pop();
      if (t > hit && t < hit + .5) for (let i = 0; i < 6; i++) { const a = -Math.PI * .1 + i * .5, k = seg(t, hit, hit + .5); paint(ribbon([[DX + 300 + Math.cos(a) * 50 * (1 + k), 390 + Math.sin(a) * 50 * (1 + k)], [DX + 300 + Math.cos(a) * 110 * (1 + k), 390 + Math.sin(a) * 110 * (1 + k)]], 12 * (1 - k)), { fill: INK.orange }); }
    }
    clawd(560, 960, 16, { ...emotions(t, [[b.start, 'neutral'], [tDel, 'scared'], [tProm, 'hopeful'], [tStep, 'mischief'], [tGuar + .3, 'surprised'], [tWrite + .4, 'relieved']]) });
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 560, cy: 860 });
  }

  // ---------- G · integration creep: a hundred tools crowd the context; curate; a familiar CLI ----------
  function shotCreep(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('creep');
    riso({ seed: 97 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tCreep = wt('creep', 'creep'), tConn = wt('creep', 'connected'), tDef = wt('creep', 'definitions'), tWord = wt('creep', 'word'), tHund = wt('creep', 'hundred'), tWorse = wt('creep', 'worse'),
      tCur = wt('creep', 'curate'), tTab = wt('creep', 'tab'), tCli = wt('creep', 'cli'), tFree = wt('creep', 'free');
    const CX = 820, CY = 440;
    // the tags: a trickle, then a swarm; the scissors trim them to three
    const N = 48, grow = seg(t, tCreep - .3, tHund + .3), cut = seg(t, tCur, tCur + .7);
    for (let i = 0; i < N; i++) {
      const born = lerp(tCreep - .3, tHund + .2, Math.pow(i / N, .7)); if (t < born) continue;
      const keep = i < 3, ring = Math.floor(i / 16), a = i * 2.39 + ring * .3, r = 210 + ring * 95 + 30 * hash(i);
      const k = stamp(t, born, .25), drop = keep ? 0 : cut;
      let x = CX + Math.cos(a) * r * k, y = CY + Math.sin(a) * r * .5 * k;
      if (keep) { const tg = [[CX - 260, 230], [CX, 190], [CX + 260, 230]][i]; x = lerp(x, tg[0], ease(cut)); y = lerp(y, tg[1], ease(cut)); }
      y += 1500 * drop * drop; if (y > 1300) continue;
      push(); translate(x, y); rotate((hash(i + 4) - .5) * .6 + drop * 3 * (hash(i) - .5)); paint(rrPts(-60, -24, 120, 48, 12), { fill: [INK.orange, INK.gold, INK.green, INK.brown][i % 4], over: !keep }); paint(ellPts(-38, 0, 8, 8, 10), { fill: INK.paper }); pop();
    }
    if (t > tTab - .1) { const k = stamp(t, tTab - .1); push(); translate(CX, 190); scale(k); win(0, -10, 200, 130, 3, INK.navy); pop(); }
    // scissors snap on "Curate"
    if (t > tCur - .3 && t < tCur + .8) { const k = seg(t, tCur - .3, tCur + .8), sx = lerp(300, 1300, k), o = .35 * Math.abs(Math.sin(k * 18)); push(); translate(sx, 420); for (const s of [-1, 1]) { push(); rotate(s * o); paint(rrPts(0, -12, 150, 24, 12), { fill: INK.navy }); arcLine(-30, s * 30, 26, 10, INK.orange); pop(); } pop(); }
    // the context meter fills with definitions before any word is typed
    const fill = ease(seg(t, tDef - .2, tWord + .3)) * .92 * (1 - .75 * ease(cut));
    paint(rrPts(1640, 180, 120, 680, 24), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
    paint(rrPts(1656, 196 + 648 * (1 - fill), 88, 648 * fill, 16), { fill: INK.orange, ramp: { from: [0, 844], to: [0, 196], a: 1, b: .45 } });
    paint(rrPts(1656, 196, 88, 648, 16), { fill: 'yellow', tone: .4, over: true });
    // a familiar CLI: a terminal, no definitions needed
    const kt = stamp(t, tCli - .15);
    if (kt > .01) { push(); translate(1280, 780); scale(kt); terminal(0, 0, 360, 220, 2); type('$ _', -110, 60, 50, INK.yellow, { align: 'left' }); pop(); }
    clawd(CX, 900, 17, { ...emotions(t, [[b.start, 'happy'], [tConn + .8, 'nervous'], [tWorse, 'dizzy'], [tCur + .5, 'relieved'], [tCli + .2, 'happy']]) });
    camEnd();
    tIn('iris', lt, { cx: 560, cy: 860 });
    tOut('dots', lt, dur, { col: 'federal', cx: 820, cy: 800 });
  }

  // ---------- H · start here: database, ticket tracker, monitoring; the world talks back ----------
  function shotStart(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('start');
    riso({ seed: 98 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 1100], to: [0, 0], a: .45, b: .1 } });
    const tDb = wt('start', 'database'), tTick = wt('start', 'ticket'), tMon = wt('start', 'monitoring'), tCap = wt('start', 'capable'), tWorld = wt('start', 'world'),
      tTalk = wt('start', 'talk'), tBack = wt('start', 'back'), tAtt = wt('start', 'attack');
    // three steps, each with what to connect
    const ST = [[260, 900], [620, 780], [980, 660]], tt = [tDb, tTick, tMon];
    for (let i = 0; i < 3; i++) {
      const k = stamp(t, tt[i] - .2); if (k <= .01) continue;
      const [x, y] = ST[i]; paint(rectPts(x - 180, y + (1 - k) * 400, 360, 1200), { fill: INK.navy, tone: .75 + .08 * i });
      push(); translate(x, y - 110); scale(k * .8);
      translate(-90 / .8, 0); if (i === 0) dbCyl(0, 0, 70, 110); else if (i === 1) win(0, 0, 200, 150, 1, INK.orange); else win(0, 0, 200, 150, 4, INK.green);
      pop();
    }
    // the agent hops up a step on each word
    let step = 0; for (let i = 0; i < 3; i++) if (t > tt[i] + .1) step = i;
    const hopT = tt[step] + .1, hk = seg(t, hopT, hopT + .45), from = ST[Math.max(0, step - 1)], to = ST[step];
    const pAg = step === 0 ? [ST[0][0] + 80, ST[0][1]] : arcPt([from[0] + 80, from[1]], [to[0] + 80, to[1]], 120, ease(hk));
    const kClaw = stamp(t, tDb - .2);
    // the world: a globe rises; cables reach it
    const kg = backOut(seg(t, tWorld - .5, tWorld));
    if (kg > .01) {
      const gx = 1480, gy = 420, r = 200 * kg;
      if (t > tAtt - .1) glow(gx, gy, 380 * ease(seg(t, tAtt - .1, tAtt + .6)), 'orange', .9);
      paint(ellPts(gx, gy, r, r, 72), { fill: INK.navy });
      for (const [dx, dy, rx, ry] of [[-60, -60, 80, 50], [70, 30, 70, 90], [-40, 110, 60, 30]]) paint(ellPts(gx + dx * kg, gy + dy * kg, rx * kg, ry * kg, 24), { fill: INK.gold, over: true });
      if (t > tWorld) cable([[pAg[0] + 90, pAg[1] - 60], [1150, 500], [gx - r, gy]], INK.navy, 1.1, ease(seg(t, tWorld, tWorld + .5)));
    }
    // and the world talks back: an orange arrow comes out of it at the agent
    if (t > tTalk - .1) {
      const k = ease(seg(t, tTalk - .1, tBack + .3)), P = through([[1300, 480], [1200, 380], [1100, 470]], 6), q = [lerp(1300, pAg[0] + 120, k), lerp(480, pAg[1] - 180, k)];
      paint(ribbon(through([[1300, 470], [lerp(1300, q[0], .5), Math.min(470, q[1]) - 120], q], 6), 60, 26), { fill: INK.orange, over: true });
      paint([[q[0] + 10, q[1] - 70], [q[0] + 30, q[1] + 60], [q[0] - 80, q[1] + 20]], { fill: INK.orange });
    }
    if (kClaw > .01) clawd(pAg[0], pAg[1], 15 * kClaw, { ...emotions(t, [[b.start, 'happy'], [tCap, 'proud'], [tWorld, 'starstruck'], [tBack, 'surprised', { emote: '!' }]]), flip: false });
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 820, cy: 800 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '10', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotTabsIn(T0, lt, dur) { shotTabs(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('tabs', 0), shotTabsIn],
    [shotAt('mcp'), shotMcp],
    [shotAt('clipboard'), shotClipboard],
    [shotAt('design'), shotDesign],
    [shotAt('skills'), shotSkills],
    [shotAt('readonly'), shotReadonly],
    [shotAt('creep'), shotCreep],
    [shotAt('start'), shotStart],
    [B.start.end + .9, shotEnd],
  ]);
})();
