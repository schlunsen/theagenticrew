// ch10.js: Chapter 10 · The Agent Attack Surface. Storyboard: video/storyboards/ch10.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const bubble = (x, y, w, h, col = INK.paper) => { paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { fill: col, ink: INK.navy, sw: 1.2 }); paint([[x - w * .25, y + h / 2 - 4], [x - w * .32, y + h / 2 + 34], [x - w * .08, y + h / 2 - 4]], { fill: col }); };
  // the hooded stranger: a navy silhouette, never a face
  const stranger = (x, y, s, o = {}) => { push(); translate(x, y); scale(o.flip ? -s : s, s); rotate(o.lean || 0);
    paint([[-110, 0], [110, 0], [80, -230], [-80, -230]], { fill: INK.navy, curv: .15 });
    paint(ellPts(0, -290, 95, 105, 40), { fill: INK.navy }); paint(ellPts(18, -280, 55, 66, 30), { fill: INK.dark });
    if (o.arm) paint(ribbon([[60, -200], [150, -230 - 40 * o.arm]], 36, 28), { fill: INK.navy });
    pop(); };
  const issueCard = (x, y, s, col = INK.orange, hi = 0) => { push(); translate(x, y); scale(s); paint(rrPts(-150, -110, 300, 220, 16), { fill: INK.paper, ink: INK.navy, sw: 1.1 }); paint(ellPts(-110, -72, 16, 16, 12), { fill: col }); paint(rrPts(-82, -82, 180, 20, 10), { fill: INK.navy }); for (let i = 0; i < 4; i++) paint(rrPts(-120, -30 + i * 32, 240 - 40 * hash(i + 2), 14, 7), { fill: INK.navy, tone: .45 }); if (hi > 0) paint(rrPts(-132, 24, 264 * hi, 60, 10), { fill: 'yellow', over: true }); paint(ellPts(0, -110, 12, 12, 10), { fill: INK.orange }); pop(); };
  const safe = (x, y, s, open = 0) => { push(); translate(x, y); scale(s); paint(rrPts(-110, -120, 220, 240, 18), { fill: INK.navy }); paint(rrPts(-90, -100, 180, 200, 12), { fill: INK.dark }); if (open < .5) { paint(ellPts(0, 0, 44, 44, 28), { fill: INK.gold }); paint(rectPts(-6, -40, 12, 40), { fill: INK.navy }); } else paint(rrPts(-60, -40, 120, 90, 10), { fill: INK.gold }); pop(); };
  const goldBox = (x, y, s) => { paint(rrPts(x - 55 * s, y - 40 * s, 110 * s, 80 * s, 10 * s), { fill: INK.gold }); paint(rectPts(x - 55 * s, y - 8 * s, 110 * s, 14 * s), { fill: INK.orange, over: true }); };
  const globe = (x, y, r) => { paint(ellPts(x, y, r, r, 60), { fill: INK.navy }); for (const [dx, dy, rx, ry] of [[-.3, -.3, .4, .25], [.35, .15, .35, .45], [-.2, .55, .3, .15]]) paint(ellPts(x + dx * r, y + dy * r, rx * r, ry * r, 24), { fill: INK.gold, over: true }); };
  const keyRing = (x, y, s, rot = 0) => { push(); translate(x, y); rotate(rot); scale(s); arcLine(0, 0, 26, 7, INK.gold); for (let i = 0; i < 3; i++) { push(); rotate(.9 + i * .45); paint(ellPts(0, 50, 16, 16, 14), { fill: INK.gold }); paint(rectPts(-5, 60, 10, 60), { fill: INK.gold }); paint(rectPts(0, 100, 16, 8), { fill: INK.gold }); pop(); } pop(); };
  const padlock = (x, y, s, open = 0) => { push(); translate(x, y); scale(s); arcLine(0, -30 - 30 * open, 26, 10, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(-38, -30, 76, 60, 10), { fill: INK.gold }); paint(ellPts(0, -4, 8, 8, 10), { fill: INK.navy }); pop(); };
  const envelope = (x, y, s, col = INK.paper) => { paint(rrPts(x - 50 * s, y - 32 * s, 100 * s, 64 * s, 6 * s), { fill: col, ink: INK.navy, sw: .8 * s }); inkLine([[x - 50 * s, y - 32 * s], [x, y + 4 * s], [x + 50 * s, y - 32 * s]], .7 * s, INK.navy, 'ink', 0, { force: true }); };

  // ---------- A · the issue: a stranger's paragraph, addressed to the agent ----------
  function shotIssue(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('issue');
    riso({ seed: 101 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 920, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tStr = wt('issue', 'stranger'), tPar = wt('issue', 'paragraph'), tAg = wt('issue', 'agent', 1), tHelp = wt('issue', 'helpfully'), tPriv = wt('issue', 'private'), tPub = wt('issue', 'public', 1),
      tNoth = wt('issue', 'nothing'), tBrok = wt('issue', 'broken'), tDes = wt('issue', 'designed');
    // the board of issues
    paint(rrPts(560, 150, 760, 520, 24), { fill: INK.brown, tone: .9 });
    for (let i = 0; i < 3; i++) issueCard(700 + i * 240, 290, .7 * stamp(t, b.start + .1 * i), [INK.green, INK.navy, INK.green][i]);
    // the stranger walks in and pins the new card
    const ks = seg(t, tStr - 1, tStr), leave = seg(t, tPar + .6, tPar + 1.4);
    if (leave < 1) stranger(lerp(2000, 1620, easeOut(ks)) + 500 * easeIn(leave), 920, 1.1, { arm: t > tStr - .2 && t < tPar + .6 ? 1 : 0, flip: true });
    const kc = stamp(t, tStr - .1);
    if (kc > .01) issueCard(940, 520, .85 * kc, INK.orange, ease(seg(t, tPar - .1, tPar + .5)));
    // the paragraph reaches the agent
    if (t > tAg - .1 && t < tAg + 1) { const k = ease(seg(t, tAg - .1, tAg + .4)); inkLine([[900, 580], lerp2([900, 580], [470, 740], k)], 1.4, INK.orange, 'ink', 0, { force: true, over: true }); }
    // helpfully: from the safe to the public stage
    safe(1200, 800, .9, t > tHelp ? 1 : 0);
    paint(rectPts(-200, 880, 560, 60), { fill: INK.gold });                     // the public stage
    const kl = ease(seg(t, tPub - .2, tPub + .3));
    if (kl > 0) paint([[180, -100], [240, -100], [460, 880], [-40, 880]], { fill: 'yellow', tone: .55 * kl, over: true });
    const go = seg(t, tAg + .7, tHelp + .1), carry = seg(t, tHelp + .3, tPub), cx = carry > 0 ? lerp(1060, 170, ease(carry)) : lerp(470, 1060, ease(go)), walking = (go > 0 && go < 1) || (carry > 0 && carry < 1);
    clawd(cx, 920, 17, { ...emotions(t, [[b.start, 'neutral'], [tAg, 'thinking'], [tHelp - .2, 'happy'], [tPub + .6, 'proud']]), flip: carry > 0 && carry < 1, walk: walking ? t * 8 : 0, aR: t > tHelp + .2 && carry < 1 ? .9 : 0, aL: t > tHelp + .2 && carry < 1 ? .9 : 0 });
    if (t > tHelp + .2) goldBox(t < tPub ? cx : 170, t < tPub ? 920 - 17 * 9.5 : 850, 1.1);
    // every part worked
    [[940, 380, tNoth], [1200, 650, tBrok], [700, 180, tDes]].forEach(([x, y, t0]) => check(x, y, 1.3, stamp(t, t0)));
    camEnd();
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }
  const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

  // ---------- B · tokens: no wall between data and instructions; injection ----------
  function shotTokens(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('tokens');
    riso({ seed: 102 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tIdea = wt('tokens', 'idea'), tInst = wt('tokens', 'instructions'), tSep = wt('tokens', 'separation'), tReq = wt('tokens', 'request'), tFile = wt('tokens', 'file'), tPage = wt('tokens', 'page'),
      tRes = wt('tokens', 'result'), tTok = wt('tokens', 'tokens'), tInj = wt('tokens', 'injection'), tSome = wt('tokens', 'someone'), tInst2 = wt('tokens', 'instead');
    const part1 = 1 - ease(seg(t, tSep + .3, tReq - .1));
    // part 1: instructions left, data right, a wall between; the wall sinks
    if (part1 > 0) {
      push(); translate(0, 700 * (1 - part1));
      for (let i = 0; i < 3; i++) { const k = stamp(t, b.start + .3 + i * .15); if (k > .01) { paint(rrPts(360 - 110 * k, 260 + i * 170 - 60 * k, 220 * k, 120 * k, 16), { fill: INK.orange }); paint(ribbon([[330, 260 + i * 170], [400, 260 + i * 170]], 16), { fill: INK.paper }); paint([[390, 240 + i * 170], [420, 260 + i * 170], [390, 280 + i * 170]], { fill: INK.paper }); } }
      for (let i = 0; i < 3; i++) { const k = stamp(t, b.start + .9 + i * .15); if (k > .01) { push(); translate(1560, 260 + i * 170); scale(k); paint(rrPts(-110, -60, 220, 120, 16), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let j = 0; j < 3; j++) paint(rrPts(-80, -34 + j * 28, 160 - 40 * j, 12, 6), { fill: INK.navy, tone: .5 }); pop(); } }
      const kw = ease(seg(t, tIdea, tIdea + .4)), sink = ease(seg(t, tSep - .2, tSep + .4));
      paint(rrPts(930, 140 + 780 * (1 - kw) + 780 * sink, 60, 780, 14), { fill: INK.navy });
      pop();
    }
    // part 2: four kinds of text fall into one stream and become identical beads
    if (part1 < 1) {
      const drops = [tReq, tFile, tPage, tRes], xs = [360, 720, 1080, 1440];
      paint(rrPts(200, 700, 1520, 120, 60), { fill: INK.navy, tone: .15 });
      drops.forEach((t0, i) => {
        const k = stamp(t, t0 - .15), f = ease(seg(t, tTok - .3, tTok + .2)); if (k <= .01) return;
        const x = xs[i] + 60, y = lerp(360, 760, f);
        if (f < 1) { push(); translate(x, y); scale(1.4 * k * (1 - .7 * f)); if (i === 0) bubble(0, 0, 220, 130); else if (i === 1) fileIcon(0, 0, 1.3); else if (i === 2) { paint(rrPts(-120, -90, 240, 180, 14), { fill: INK.paper, ink: INK.navy, sw: 1 }); globe(0, 10, 60); } else { paint(rrPts(-120, -80, 240, 160, 14), { fill: INK.gold }); type('{ }', 0, 4, 70, INK.navy); } pop(); }
      });
      // the beads: all the same
      const kb = seg(t, tTok - .1, tTok + .3);
      if (kb > 0) for (let i = 0; i < 18; i++) { const x = 260 + i * 84 + 40 * frac(t * .5), inj = t > tInj && i === 11; paint(ellPts(x, 760, 30 * backOut(clamp(kb * 2 - i / 18)), 30 * backOut(clamp(kb * 2 - i / 18)), 20), { fill: inj ? INK.orange : INK.gold }); }
      // injection: the stranger's card slides into the stream
      if (t > tInj - .3) { const k = ease(seg(t, tInj - .3, tInj + .3)), gone = seg(t, tSome, tSome + .6); push(); translate(lerp(1300, 1210, k), lerp(200, 700, k)); scale(1 - gone * .9); issueCard(0, -150, .6, INK.orange, 1); pop(); stranger(1640, 620, .8 * (1 - ease(seg(t, tSome + .4, tSome + 1))), { arm: 1, flip: true }); }
      const turn = t > tInst2 - .2;
      clawd(960, 1040, 14, { ...emotions(t, [[b.start, 'neutral'], [tTok, 'thinking'], [tInst2 - .2, 'determined']]), view: turn ? 'q' : 'front' });
      if (turn) { const k = ease(seg(t, tInst2 - .2, tInst2 + .4)); paint(ribbon([[1040, 960], [1040 + 180 * k, 960 - 80 * k]], 18, 6), { fill: INK.orange }); }
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- C · unsolved: a spam filter is not a lock; plan for the worst it can do ----------
  function shotUnsolved(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('unsolved');
    riso({ seed: 103 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tBound = wt('unsolved', 'boundary'), tSpam = wt('unsolved', 'spam'), tLock = wt('unsolved', 'lock'), tUns = wt('unsolved', 'unsolved'), tPlan = wt('unsolved', 'plan'), tTrick = wt('unsolved', 'tricked'), tWorst = wt('unsolved', 'worst');
    const out = ease(seg(t, tPlan - .4, tPlan));
    // a dashed boundary around the agent that lets things through
    if (out < 1) {
      push(); translate(0, 800 * out);
      const kb = seg(t, tBound - .3, tBound + .5);
      for (let i = 0; i < 20 * kb; i++) { const a = i / 20 * TAU; arcLine(960, 700, 260, 16, INK.navy, { a0: a, a1: a + TAU / 40 }); }
      // the funnel: envelopes fall in, all caught but one
      const kf = stamp(t, tSpam - .6);
      if (kf > .01) {
        push(); translate(420, 400); scale(kf);
        paint([[-170, -120], [170, -120], [40, 60], [40, 150], [-40, 150], [-40, 60]], { fill: INK.gold });
        for (let i = 0; i < 5; i++) { const f = frac(t * .7 + i / 5); if (i !== 2) envelope(-100 + i * 50, -300 + 190 * Math.min(1, f * 1.4), .6); }
        const f2 = seg(t, tSpam, tSpam + 1.2); envelope(lerp(0, 380, f2), lerp(-260, 400, f2) + (f2 > 0 && f2 < 1 ? -120 * Math.sin(f2 * Math.PI) : 0), .7, INK.orange);
        pop();
      }
      // the lock pops open
      const kl = stamp(t, tLock - .5);
      if (kl > .01) { padlock(1500, 420, 2.4 * kl, backOut(seg(t, tLock, tLock + .3))); stampX(1500, 420, 150, stamp(t, tLock + .3)); }
      // unsolved
      if (t > tUns - .15) { type('?', 960, 330, 260, INK.orange, { pop: seg(t, tUns - .15, tUns + .2) }); type('?', 972, 340, 260, INK.navy, { pop: seg(t, tUns - .05, tUns + .3), over: true, tone: .5 }); }
      pop();
    }
    // the blast radius: drawn wide round the agent, then shrunk small
    if (out > 0) {
      const draw = ease(seg(t, tTrick - .4, tTrick + .3)), shrink = ease(seg(t, tWorst, tWorst + .8)), r = lerp(470, 200, shrink);
      paint(ellPts(960, 700, r * draw, r * draw * .7, 64), { fill: INK.orange, tone: .35, over: true });

      for (let i = 0; i < 3; i++) paint(ellPts(960, 700, r * draw * (1 - i * .25), r * draw * .7 * (1 - i * .25), 64), { fill: INK.orange, tone: .12, over: true });
    }
    clawd(960, 800, 16, { ...emotions(t, [[b.start, 'neutral'], [tSpam + .6, 'nervous'], [tLock + .3, 'scared'], [tPlan, 'determined'], [tWorst + .7, 'relieved']]) });
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- D · the lethal trifecta ----------
  function shotTrifecta(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('trifecta');
    riso({ seed: 104 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tLeth = wt('trifecta', 'lethal'), tPriv = wt('trifecta', 'private'), tUntr = wt('trifecta', 'untrusted'), tSend = wt('trifecta', 'send'), tTwo = wt('trifecta', 'two'), tThree = wt('trifecta', 'three'),
      tAny = wt('trifecta', 'anyone'), tRem = wt('trifecta', 'remove');
    const rem = ease(seg(t, tRem - .1, tRem + .5));
    const C = [[820, 380], [1100, 380], [960, 620]], cols = ['yellow', 'orange', 'federal'], ts = [tPriv, tUntr, tSend], R = 250;
    const kd = seg(t, tLeth - .2, tLeth + .6);
    if (kd > 0) C.forEach(([x, y], i) => { if (t < ts[i] - .1) for (let j = 0; j < 24 * kd; j++) { const a = j / 24 * TAU; arcLine(x, y, R, 10, INK.navy, { a0: a, a1: a + TAU / 48 }); } });
    C.forEach(([x, y], i) => {
      const k = stamp(t, ts[i] - .15, .4); if (k <= .01) return;
      const dx = i === 1 ? 700 * rem : 0, pulse2x = t > tTwo && t < tThree && i < 2 ? 0 : 0;
      paint(ellPts(x + dx, y, R * k, R * k, 72), { fill: cols[i], tone: .75 + pulse2x, over: true });
      // the icon, pushed away from the centre
      const ix = x + dx + (i === 0 ? -120 : i === 1 ? 120 : 0), iy = y + (i === 2 ? 120 : -80);
      push(); translate(ix, iy); scale(k * .6);
      if (i === 0) safe(0, 0, .9); else if (i === 1) { envelope(0, 0, 1.6, INK.paper); paint(ellPts(0, 10, 16, 16, 12), { fill: INK.orange }); } else { paint(ribbon([[-90, 0], [60, 0]], 50), { fill: INK.paper }); paint([[50, -70], [130, 0], [50, 70]], { fill: INK.paper }); }
      pop();
    });
    // any two: fine; all three: the centre flashes a warning
    if (t > tTwo - .1 && t < tThree) { check(960 + 0, 300, 1.2, stamp(t, tTwo)); }
    if (t > tThree) {
      const k = stamp(t, tThree) * (1 - rem);
      if (k > .01) { const cx = 960, cy = 470, fl = .5 + .5 * pulse(T, 4); push(); translate(cx, cy); scale(k); paint([[0, -80], [80, 60], [-80, 60]], { fill: INK.dark }); paint(rrPts(-9, -40, 18, 60, 9), { fill: INK.yellow }); paint(ellPts(0, 40, 10, 10, 10), { fill: INK.yellow }); pop(); if (t > tAny && t < tRem) glow(cx, cy, 200 * fl, 'orange', .5); }
    }
    if (rem > 0) check(960, 470, 1.4, stamp(t, tRem + .5));
    // the stranger reaches for the data on "anyone"
    if (t > tAny - .4) { const k = easeOut(seg(t, tAny - .4, tAny + .3)), back = ease(seg(t, tRem, tRem + .6)); stranger(lerp(2150, 1650, k) + 600 * back, 1000, 1, { arm: 1, flip: true }); }
    clawd(360, 1000, 14, { ...emotions(t, [[b.start, 'neutral'], [tThree + .2, 'scared'], [tRem + .5, 'happy']]) });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · doors: where untrusted text gets in ----------
  function shotDoors(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('doors');
    riso({ seed: 105 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tDoors = wt('doors', 'doors'), tIss = wt('doors', 'issues'), tWeb = wt('doors', 'web'), tLog = wt('doors', 'log'), tTool = wt('doors', 'tool'), tInst = wt('doors', 'instruction'), tPoint = wt('doors', 'pointing'), tProm = wt('doors', 'prompt');
    const X = [300, 630, 960, 1290, 1620], ts = [tIss, tWeb, tLog, tTool, tInst];
    for (let i = 0; i < 5; i++) {
      const k = stamp(t, tDoors - .3 + i * .07); if (k <= .01) continue;
      const x = X[i], y = 520, w = 230, h = 380, op = ease(seg(t, ts[i] - .1, ts[i] + .3));
      push(); translate(x, 900); scale(k); translate(-x, -900);
      paint(rrPts(x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 400, 20), { fill: INK.brown });
      paint(rectPts(x - w / 2, y - h / 2, w, h + 190), { fill: INK.dark });
      // what comes through
      if (op > .2) { push(); translate(x, y + 40); scale(ease(seg(t, ts[i], ts[i] + .4)));
        if (i === 0) issueCard(0, 0, .6, INK.orange); else if (i === 1) globe(0, 0, 80);
        else if (i === 2) { paint(rrPts(-90, -80, 180, 160, 12), { fill: INK.paper }); for (let j = 0; j < 5; j++) paint(rrPts(-70, -60 + j * 28, 140 - 40 * hash(j), 12, 6), { fill: j === 3 ? INK.orange : INK.navy, tone: .6 }); }
        else if (i === 3) { paint([[-90, -40], [60, -40], [100, 0], [60, 40], [-90, 40]], { fill: INK.orange }); paint(ellPts(55, 0, 10, 10, 10), { fill: INK.paper }); }
        else if (t < tPoint - .2) fileIcon(0, 0, 1.2);
        pop(); }
      // the door leaf swings open (drawn as a narrowing panel)
      const lw = w * (1 - .8 * op);
      paint(rectPts(x - w / 2, y - h / 2, lw, h + 190), { fill: [INK.orange, INK.gold, INK.green, INK.gold, INK.orange][i] });
      paint(ellPts(x - w / 2 + lw - 20, y + 120, 10, 10, 10), { fill: INK.navy });
      pop();
    }
    // the stranger in the last door, whispering
    if (t > tPoint - .3) { const k = ease(seg(t, tPoint - .3, tPoint + .3)); stranger(1620, 900 + 300 * (1 - k), .85, { arm: .5, flip: true }); if (t > tPoint + .3) bubble(1400, 380, 150, 90, INK.paper); }
    clawd(960, 1010, 15, { ...emotions(t, [[b.start, 'neutral'], [tIss, 'thinking'], [tTool, 'nervous'], [tProm, 'dizzy']]) });
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- F · exits: data leaves through more than email ----------
  function shotExits(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('exits');
    riso({ seed: 106 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tMail = wt('exits', 'email'), tImg = wt('exits', 'image'), tPub = wt('exits', 'public'), tWeb = wt('exits', 'web'), tName = wt('exits', 'name'), tOut2 = wt('exits', 'outsider'), tExit = wt('exits', 'exit');
    // the sandbox
    paint(rrPts(600, 300, 720, 640, 30), { fill: INK.navy, tone: .12 });

    paint(rrPts(600, 300, 720, 30, 14), { fill: INK.navy });
    clawd(960, 900, 17, { ...emotions(t, [[b.start, 'happy'], [tImg + .4, 'surprised'], [tOut2, 'sad']]) });
    // email: an envelope, the exit everyone knows, crossed out as the only one
    const km = stamp(t, tMail - .2) * (1 - ease(seg(t, tImg - .3, tImg)));
    if (km > .01) envelope(960, 520, 2 * km, INK.paper);
    // four exits in the walls, each leaking a gold packet
    const EX = [[600, 440, tImg, -1], [1320, 440, tPub, 1], [600, 760, tWeb, -1], [1320, 760, tName, 1]];
    EX.forEach(([x, y, t0, s], i) => {
      const k = stamp(t, t0 - .15); if (k <= .01) return;
      paint(rectPts(x - 16, y - 60, 32, 120), { fill: INK.paper });
      const ix = x + s * 260; push(); translate(ix, y); scale(k);
      if (i === 0) { paint(rrPts(-90, -70, 180, 140, 8), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint([[-70, 50], [-20, -20], [20, 30], [45, 0], [70, 50]], { fill: INK.green }); paint(ellPts(40, -35, 16, 16, 12), { fill: INK.gold }); }
      else if (i === 1) bubble(0, 0, 200, 120, INK.paper);
      else if (i === 2) globe(0, 0, 80);
      else { paint(rectPts(-8, -40, 16, 140), { fill: INK.brown }); paint([[-90, -70], [60, -70], [95, -40], [60, -10], [-90, -10]], { fill: INK.orange }); }
      pop();
      for (let j = 0; j < 3; j++) { const f = frac((t - t0) * .8 + j / 3); if (t < t0) continue; const px = lerp(x - s * 140, x + s * 180, f); paint(rrPts(px - 22, y - 16 - 40, 44, 32, 6), { fill: INK.gold, over: true }); }
    });
    // the stranger collects on the far side
    if (t > tOut2 - .4) { const k = easeOut(seg(t, tOut2 - .4, tOut2 + .3)); stranger(lerp(2150, 1780, k), 1080, 1, { arm: 1, flip: true }); }
    if (t > tExit - .1) { const k = stamp(t, tExit - .1); push(); translate(960, 200); scale(k); paint(rrPts(-120, -50, 240, 100, 14), { fill: INK.green }); paint(ribbon([[-70, 0], [40, 0]], 26), { fill: INK.paper }); paint([[30, -40], [80, 0], [30, 40]], { fill: INK.paper }); pop(); }
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 700 });
  }

  // ---------- G · supply: skills, plugins and servers are dependencies ----------
  function shotSupply(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('supply');
    riso({ seed: 107 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tSk = wt('supply', 'skills'), tDep = wt('supply', 'dependencies'), tRead = wt('supply', 'read'), tPin = wt('supply', 'pin'), tRev = wt('supply', 'review'), tQui = wt('supply', 'quietly'), tApp = wt('supply', 'approved');
    paint(rectPts(360, 700, 1200, 30), { fill: INK.brown });
    const X = [560, 960, 1360], flip = ease(seg(t, tQui, tQui + .4));
    X.forEach((x, i) => {
      const k = stamp(t, tSk - .2 + i * .25); if (k <= .01) return;
      push(); translate(x, 700); scale(k);
      paint(rrPts(-140, -240, 280, 240, 16), { fill: [INK.gold, INK.orange, INK.green][i] });
      paint(rectPts(-140, -140, 280, 26), { fill: INK.brown, over: true });
      // the tag
      const bad = i === 1 && flip > .5; push(); translate(0, -300); scale(1, Math.abs(Math.cos(flip * Math.PI * (i === 1 ? 1 : 0))) + .001);
      paint(rrPts(-100, -34, 200, 68, 12), { fill: bad ? INK.orange : INK.paper, ink: INK.navy, sw: 1 }); for (let j = 0; j < 2; j++) paint(rrPts(-76, -18 + j * 22, 150 - 50 * j, 10, 5), { fill: INK.navy, tone: bad ? .9 : .5 }); pop();
      if (t > tPin) { const kp = stamp(t, tPin + i * .1); paint(ellPts(-100, -250 - 20 * (1 - kp), 16, 16, 12), { fill: INK.navy }); paint(rectPts(-104, -250, 8, 30 * kp), { fill: INK.navy }); }
      check(90, -60, 1, stamp(t, tRev + i * .12));
      pop();
    });
    // the magnifier sweeps on "read"
    const km = seg(t, tRead - .2, tRead + .9);
    if (km > 0 && km < 1) { const mx = lerp(460, 1460, ease(km)), my = 480; arcLine(mx, my, 110, 22, INK.navy); paint(ellPts(mx, my, 99, 99, 40), { fill: 'yellow', tone: .35, over: true }); paint(ribbon([[mx + 80, my + 80], [mx + 180, my + 180]], 34), { fill: INK.navy }); }
    clawd(1700, 940, 14, { ...emotions(t, [[b.start, 'neutral'], [tRev + .3, 'happy'], [tQui + .3, 'suspicious']]), flip: true });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 700 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · layers: scoped tokens, reader and actor, closed network, a human, a log ----------
  function shotLayers(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('layers');
    riso({ seed: 108 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tScope = wt('layers', 'scoped'), tRead = wt('layers', 'reader'), tPriv = wt('layers', 'privileges'), tPass = wt('layers', 'passing'), tStr = wt('layers', 'structured'), tAct = wt('layers', 'actor'),
      tClose = wt('layers', 'closed'), tHum = wt('layers', 'human'), tLog = wt('layers', 'log');
    // scoped, short-lived: a small key with a timer
    const kk = stamp(t, tScope - .15);
    if (kk > .01) { push(); translate(260, 230); scale(kk); arcLine(0, 0, 60, 10, INK.navy); const a = -Math.PI / 2 + TAU * seg(t, tScope, tScope + 14); paint(ribbon([[0, 0], [Math.cos(a) * 44, Math.sin(a) * 44]], 8), { fill: INK.orange }); keyRing(120, -20, .8, .3); pop(); }
    // the reader, behind glass, no keys
    const kr = stamp(t, tRead - .2);
    if (kr > .01) { clawd(560, 900, 15 * kr, { ...emotions(t, [[tRead - .2, 'neutral'], [tPriv, 'sad'], [tPass, 'happy']]), boilKey: 'r' }); issueCard(420, 470, .6 * kr, INK.orange, 1); stranger(160, 940, .8 * kr, { flip: false }); }
    // the glass wall with a slot
    const kg = ease(seg(t, tRead, tRead + .4));
    if (kg > 0) { paint(rectPts(880, 940 - 700 * kg, 50, 700 * kg), { fill: INK.navy, tone: .35, over: true }); paint(rectPts(880, 640, 50, 60), { fill: INK.paper }); }
    // the structured card through the slot
    if (t > tPass - .2) { const f = ease(seg(t, tPass, tStr + .6)); push(); translate(lerp(640, 1160, f), 670 - 60 * Math.sin(Math.PI * f)); scale(stamp(t, tPass - .2)); paint(rrPts(-70, -40, 140, 80, 12), { fill: INK.gold }); type('{ }', 0, 3, 46, INK.navy); pop(); }
    // the actor, with the keys
    const ka = stamp(t, tAct - .2);
    if (ka > .01) { clawd(1300, 900, 15 * ka, { ...feel(t > tStr + .6 ? 'happy' : 'determined', T), boilKey: 'a' }); keyRing(1420, 740, .7 * ka, .2 * Math.sin(t * 3)); }
    // the closed network: a gate drops on a cable
    if (t > tClose - .2) { const k = backOut(seg(t, tClose - .2, tClose + .2)); inkLine([[1450, 330], [1900, 330]], 1.4, INK.navy, 'ink', 0, { force: true }); paint(rrPts(1600, 330 - 150 + 150 * (1 - k) * -1 - 0, 50, 150 * k + 20, 10), { fill: INK.orange }); }
    // a human approving anything outbound
    if (t > tHum - .3) { const k = stamp(t, tHum - .3); skipper(1700, 1040 + 300 * (1 - k), 13, skipAct(t, [[tHum - .3, 'stand', { mood: 'focused', flip: true }], [tHum + .2, 'point', { mood: 'grin', flip: true }]])); check(1560, 560, 1.2, stamp(t, tHum + .4)); }
    // a log the agent can't edit: a scroll unrolls
    if (t > tLog - .2) { const k = ease(seg(t, tLog - .2, tLog + .6)); paint(rectPts(760, 120, 360, 300 * k), { fill: INK.paper, ink: INK.navy, sw: 1 }); for (let i = 0; i < Math.floor(8 * k); i++) paint(rrPts(790, 140 + i * 34, 300 - 80 * hash(i), 12, 6), { fill: INK.navy, tone: .5 }); paint(rrPts(740, 100, 400, 34, 17), { fill: INK.brown }); paint(rrPts(740, 110 + 300 * k, 400, 34, 17), { fill: INK.brown }); padlock(1170, 130, .6); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- I · the pilot: let them steer, keep the keys ----------
  function shotPilot(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('pilot');
    riso({ seed: 109 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.navy });
    for (let i = 0; i < 14; i++) paint(starPts(80 + i * 140, 60 + 60 * hash(i), 12 + 8 * hash(i + 5), .35, 4), { fill: INK.yellow, tone: .8 + .2 * pulse(T + hash(i), 4) });
    paint(ellPts(1650, 200, 80, 80, 48), { fill: INK.yellow });
    for (let i = 0; i < 3; i++) paint(ribbon(Array.from({ length: 24 }, (_, j) => [-200 + j * 100, 700 + i * 50 + 12 * Math.sin(j * .8 + t * 1.5 + i)]), 16), { fill: INK.navy, tone: .5, over: true });
    paint(rectPts(-200, 860, W + 400, 400), { fill: INK.brown });                 // the deck
    for (let i = 0; i < 12; i++) paint(rectPts(i * 170, 860, 6, 300), { fill: INK.dark });
    const tHarb = wt('pilot', 'harbor'), tHelm = wt('pilot', 'helm'), tKeys = wt('pilot', 'keys'), tHold = wt('pilot', 'hold'), tSteer = wt('pilot', 'steer'), tKeep = wt('pilot', 'keep'), tNext = wt('pilot', 'articulating');
    // the helm, and the pilot (Clawd) stepping up to it
    const turn = TAU / 8 * backOut(seg(t, tSteer - .1, tSteer + .4)) + .05 * wob(t, .3);
    helm(760, 600, 170, turn);
    const walk = seg(t, tHarb, tHelm);
    clawd(lerp(330, 760, ease(walk)), 880, 18, { ...emotions(t, [[b.start, 'neutral'], [tHelm, 'determined'], [tSteer + .3, 'happy']]), walk: walk > 0 && walk < 1 ? t * 8 : 0, aL: t > tHelm ? .7 : 0, aR: t > tHelm ? .7 : 0 });
    // the Skipper and the keys
    const pocket = ease(seg(t, tHold - .1, tHold + .4)), lift = backOut(seg(t, tKeep - .1, tKeep + .4));
    const pose = t > tKeep - .1 ? 'pointUp' : t > tHold ? 'hips' : 'present';
    skipper(1400, 1040, 20, skipAct(t, [[b.start, 'stand', { mood: 'neutral', flip: true }], [tKeys - .3, 'present', { mood: 'grin', flip: true }], [tHold, 'hips', { mood: 'proud', flip: true }], [tKeep - .1, 'pointUp', { mood: 'happy', flip: true }]]));
    if (t > tKeys - .3 && (t < tHold || t > tKeep - .1)) { const up = t > tKeep - .1; keyRing(up ? 1400 - 4.4 * 20 : 1400 - 6.6 * 20, up ? 1040 - 16.4 * 20 - 40 * lift : 1040 - 8.4 * 20, .9, .3 * Math.sin(t * 9)); }
    if (t > tNext - .2) glow(960, 380, 240 * stamp(t, tNext - .2), 'yellow', .8);
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '11', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotIssueIn(T0, lt, dur) { shotIssue(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('issue', 0), shotIssueIn],
    [shotAt('tokens'), shotTokens],
    [shotAt('unsolved'), shotUnsolved],
    [shotAt('trifecta'), shotTrifecta],
    [shotAt('doors'), shotDoors],
    [shotAt('exits'), shotExits],
    [shotAt('supply'), shotSupply],
    [shotAt('layers'), shotLayers],
    [shotAt('pilot'), shotPilot],
    [B.pilot.end + .9, shotEnd],
  ]);
})();
