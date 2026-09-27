// ch08.js: Chapter 8 · The Ship's Log. Storyboard: video/storyboards/ch08.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  // ---------- small props ----------
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const burst = (x, y, r0, k, col = INK.orange, n = 12) => { if (k <= 0 || k >= 1) return; for (let i = 0; i < n; i++) { const a = i / n * TAU + .2; paint(ribbon([[x + Math.cos(a) * r0 * (1 + k * .6), y + Math.sin(a) * r0 * (1 + k * .6)], [x + Math.cos(a) * r0 * (1.5 + k * .8), y + Math.sin(a) * r0 * (1.5 + k * .8)]], 16 * (1 - k)), { fill: col }); } };
  const fileIcon = (x, y, s, col = INK.paper, corner = null) => { paint([[x - 40 * s, y - 52 * s], [x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 40 * s, y + 52 * s], [x - 40 * s, y + 52 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); if (corner) paint([[x + 18 * s, y - 52 * s], [x + 40 * s, y - 30 * s], [x + 18 * s, y - 30 * s]], { fill: corner }); for (let i = 0; i < 3; i++) paint(rectPts(x - 26 * s, y - 14 * s + i * 20 * s, 52 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  // the motif: the logbook. open 0..1
  const logbook = (x, y, s, open = 1, col = INK.brown) => { push(); translate(x, y); scale(s); if (open < .05) { paint(rrPts(-70, -95, 140, 190, 12), { fill: col }); paint(rectPts(-50, -60, 100, 14), { fill: INK.gold }); pop(); return; } paint(rrPts(-150 * open, -95, 300 * open, 190, 12), { fill: col }); paint(rrPts(-138 * open, -84, 132 * open, 168, 8), { fill: INK.paper }); paint(rrPts(6 * open, -84, 132 * open, 168, 8), { fill: INK.paper }); for (let j = 0; j < 5; j++) { paint(rectPts(-120 * open, -60 + j * 28, 96 * open, 6), { fill: INK.navy, tone: .6 }); paint(rectPts(24 * open, -60 + j * 28, 96 * open, 6), { fill: INK.navy, tone: .6 }); } pop(); };
  const page = (x, y, s, rot = 0, col = INK.paper) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-50, -64, 100, 128, 6), { fill: col, ink: INK.navy, sw: .8 }); for (let j = 0; j < 3; j++) paint(rectPts(-32, -34 + j * 24, 64, 6), { fill: INK.navy, tone: .5 }); pop(); };
  const note = (x, y, s, rot = 0, col = INK.gold) => { push(); translate(x, y); rotate(rot); scale(s); paint(rrPts(-70, -50, 140, 100, 8), { fill: col }); paint(rectPts(-50, -22, 100, 8), { fill: INK.navy, tone: .7 }); paint(rectPts(-50, 2, 70, 8), { fill: INK.navy, tone: .7 }); pop(); };
  const ship = (x, y, s, rot = 0, dent = 0) => { push(); translate(x, y); rotate(rot); scale(s); paint([[-200, -20], [200, -20], [150, 70], [-150, 70]], { fill: INK.brown }); if (dent > .01) paint(ellPts(90, 30, 30 * dent, 26 * dent, 14), { fill: INK.dark }); paint(rectPts(-8, -300, 16, 290), { fill: INK.dark }); paint([[14, -290], [170, -60], [14, -60]], { fill: INK.paper, ink: INK.navy, sw: 1 }); paint([[-14, -250], [-150, -60], [-14, -60]], { fill: INK.gold }); paint([[8, -300], [80, -280], [8, -260]], { fill: INK.orange }); pop(); };
  const drum = (x, y, s, gap = false, spark = 0) => { push(); translate(x, y); scale(s); paint(rectPts(-70, -60, 140, 120), { fill: INK.navy }); paint(ellPts(0, 60, 70, 22, 28), { fill: INK.navy }); paint(ellPts(0, -60, 70, 22, 28), { fill: INK.navy, tone: .6 }); for (let j = 0; j < 2; j++) paint(rectPts(-70, -20 + j * 40, 140, 5), { fill: INK.paper, tone: .6 }); if (gap) paint(rrPts(20, -10, 40, 50, 6), { fill: INK.paper }); if (spark > .01) paint(starPts(60, -70, 40 * spark, .35, 6), { fill: INK.orange }); pop(); };
  const sea = (y0, t) => { paint(rectPts(-200, y0, W + 400, H - y0 + 200), { fill: INK.navy, tone: .55 }); for (let i = 0; i < 9; i++) { const x = i * 240 + 60 * Math.sin(t * .8 + i); paint(ribbon(through([[x - 60, y0 + 40 + (i % 3) * 60], [x, y0 + 26 + (i % 3) * 60], [x + 60, y0 + 40 + (i % 3) * 60]]), 8), { fill: INK.paper, tone: .5, over: true }); } };
  const hookIcon = (x, y, s, col = INK.gold) => { push(); translate(x, y); scale(s); inkLine([[0, -900], [0, 40]], 5, col, 'ink', 0, { force: true }); arcLine(-50, 40, 50, 26, col, { a0: 0, a1: Math.PI, cap: 'round' }); paint([[-100, 40], [-120, 0], [-80, 20]], { fill: col }); pop(); };
  const lampG = (x, y, r, on) => { paint(ellPts(x, y, r, r, 30), { fill: INK.paper, ink: INK.navy, sw: 1.1 }); if (on) { paint(ellPts(x, y, r * .82, r * .82, 30), { fill: INK.green }); paint(ellPts(x - r * .28, y - r * .28, r * .22, r * .22, 14), { fill: INK.paper, tone: .8 }); } };

  // ---------- ident and end card with long titles: the shared ones print one line, so these split it in two ----------
  const split2 = s => { s = s.toUpperCase(); if (s.length <= 16) return [s]; const m = s.length / 2; let best = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (best < 0 || Math.abs(i - m) < Math.abs(best - m))) best = i; return best < 0 ? [s] : [s.slice(0, best), s.slice(best + 1)]; };
  function endCardLong(T, lt, dur, nextNum, nextTitle) {
    const t = onTwos(lt);
    riso({ seed: 11 });
    camBegin(960, 540, 1.04 - .04 * ease(seg(t, 0, dur)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, -100], to: [0, 700], a: .45, b: 0 } });
    helm(960, 1080, 330, t * .25, INK.gold);
    type('NEXT', 960, 220, 44, INK.navy, { spacing: .3, pop: seg(t, .3, .6) });
    type(nextNum, 960, 380, 190, INK.orange, { pop: seg(t, .5, .85) });
    const L = split2(nextTitle), sz = L.length > 1 ? 84 : 92;
    L.forEach((l, i) => type(l, 960, 555 + i * sz * 1.1, sz, INK.navy, { pop: seg(t, .8 + i * .12, 1.2 + i * .12) }));
    skipper(330, 1050, 22, { ...SKIP_POSES.wave, mood: 'happy', t, dy: 400 * (1 - backOut(seg(t, .6, 1.1))) });
    const kc = backOut(seg(t, 1.0, 1.4));
    clawd(1600, 1040 + 300 * (1 - kc), 24, { ...feel('thinking', t), emote: '?', emoteK: kc, emoteAge: t - 1.2, flip: true });
    camEnd();
  }

  // ---------- A · amnesia: a ship without a log forgets; every session starts from scratch ----------
  function shotAmnesia(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('amnesia');
    riso({ seed: 81 });
    const tLog = wt('amnesia', 'log'), tForg = wt('amnesia', 'forgets', 1), tShal = wt('amnesia', 'shallow'), tAgain = wt('amnesia', 'again'), tSess = wt('amnesia', 'sessions'),
      tAmn = wt('amnesia', 'amnesia'), tYest = wt('amnesia', 'yesterday'), tThree = wt('amnesia', 'three'), tWeek = wt('amnesia', 'week');
    const p2 = ease(seg(T, tSess - .4, tSess + .2));
    camBegin(960, 540 + 1080 * p2, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    // --- the sea (y 0..1080)
    paint(rectPts(-200, -200, W + 400, 1280), { fill: 'yellow', ramp: { from: [0, 0], to: [0, 700], a: .15, b: .45 } });
    paint(ellPts(1560, 200, 110, 110, 40), { fill: INK.gold });
    // the shallows: rocks rise
    const kr = ease(seg(t, tShal - .2, tShal + .4));
    if (kr > 0) for (let i = 0; i < 3; i++) { const rx = 1180 + i * 110, rh = (90 + 40 * hash(i + 2)) * kr; paint([[rx - 70, 720], [rx - 10, 720 - rh], [rx + 50, 720 - rh * .6], [rx + 80, 720]], { fill: INK.dark }); }
    sea(700, t);
    const sail = seg(t, b.start, tAgain), bump = t > tAgain ? spring(t, tAgain, 5, 22) : 0;
    const sx = lerp(420, 1000, ease(sail));
    ship(sx, 720 + 10 * Math.sin(t * 2), .9, -.04 * Math.sin(t * 1.6) + .15 * bump);
    if (t > tAgain && t < tAgain + .6) burst(sx + 190, 680, 50, seg(t, tAgain, tAgain + .6), INK.orange, 8);
    // the log, and its pages blowing away
    const kl = stamp(t, tLog - .2);
    if (kl > .01) { const blow = ease(seg(t, tForg - .3, tForg + 1)); logbook(300, 320, kl * (1 - blow * .6), 1 - blow); for (let i = 0; i < 5; i++) { const f = seg(t, tForg - .4 + i * .15, tForg + 1.2 + i * .15); if (f > 0 && f < 1) page(300 + 900 * f, 320 - 200 * Math.sin(f * 3 + i) - 100 * f, .7, f * 6 + i); } }
    // --- amnesia (y 1080..2160)
    const Y = 1080;
    paint(rectPts(-200, Y + 100, W + 400, 1200), { fill: INK.paper });
    paint(rectPts(-200, Y + 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    if (p2 > 0) {
      clawd(660, Y + 950, 22, { ...emotions(t, [[tSess, 'neutral'], [tAmn - .1, 'dizzy'], [tYest, 'confused', { emote: '?', emoteK: 1 }]]), emoteAge: t - tYest });
      // a blank slate
      const ks = stamp(t, tAmn - .2); if (ks > .01) { push(); translate(660, Y + 400); scale(ks); paint(rrPts(-220, -150, 440, 300, 20), { fill: INK.brown }); paint(rrPts(-195, -125, 390, 250, 12), { fill: INK.dark }); pop(); }
      // yesterday: a calendar page
      const ky = stamp(t, tYest - .15); if (ky > .01) { push(); translate(1250, Y + 330); scale(ky); paint(rrPts(-120, -120, 240, 240, 18), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-120, -120, 240, 60, 18), { fill: INK.orange }); paint(rrPts(-50, -20, 100, 90, 12), { fill: INK.navy, tone: .5 }); pop(); stampX(1250, Y + 350, 90, stamp(t, tYest + .4), INK.navy); }
      // three approaches, last week: three paths fading out
      for (let i = 0; i < 3; i++) { const k = ease(seg(t, tThree - .1 + i * .12, tThree + .4 + i * .12)), fade = 1 - ease(seg(t, tWeek, tWeek + .7)); if (k <= 0) continue; const y = Y + 620 + i * 90; inkLine([[1040, y], [lerp(1040, 1640, k), y - 40 * Math.sin(i)]], 1.6, [INK.orange, INK.gold, INK.green][i], 'ink', 0, { force: true, tone: .3 + .7 * fade }); paint(ellPts(1040, y, 16, 16, 12), { fill: INK.navy, tone: .3 + .7 * fade }); }
    }
    camEnd();
    tOut('dots', lt, dur, { col: 'yellow', cx: 960, cy: 540 });
  }

  // ---------- B · lost: an hour of learning, gone with the context window ----------
  function shotLost(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('lost');
    riso({ seed: 82 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tHour = wt('lost', 'hour'), tFail = wt('lost', 'fail'), tQuirk = wt('lost', 'quirk'), tClean = wt('lost', 'clean'), tComm = wt('lost', 'committed'), tKnow = wt('lost', 'knowledge'),
      tWin = wt('lost', 'window'), tGone = wt('lost', 'gone'), tTom = wt('lost', 'tomorrows'), tSame = wt('lost', 'same'), tDead = wt('lost', 'dead');
    const tom = ease(seg(t, tTom - .3, tTom + .3));
    // the hour: a clock ring filling
    const kh = stamp(t, tHour - .2) * (1 - tom);
    if (kh > .01) { push(); translate(200, 180); scale(kh); arcLine(0, 0, 90, 18, INK.navy, { tone: .3 }); arcLine(0, 0, 90, 18, INK.orange, { a0: -Math.PI / 2, a1: -Math.PI / 2 + TAU * seg(t, tHour, tComm), cap: 'round' }); pop(); }
    // the session's work: two dead ends, a quirk, a clean solution
    const WX = 1100, WY = 420;
    const knowledge = (k, flyOut) => {
      [[WX - 330, WY], [WX - 110, WY]].forEach(([x, y], i) => { const kk = stamp(t, tFail - .1 + i * .35) * k; if (kk <= .01) return; push(); translate(x, y - 300 * flyOut * (i + 1) * .5); scale(kk * (1 - flyOut)); paint(rrPts(-90, -70, 180, 140, 14), { fill: INK.paper, ink: INK.navy, sw: 1 }); inkLine(through([[-60, 40], [-10, 0], [40, 10], [60, -30]]), 1.4, INK.navy, 'ink', .5, { force: true }); pop(); stampX(x, y - 300 * flyOut * (i + 1) * .5, 50, kk * (1 - flyOut)); });
      const kq = stamp(t, tQuirk - .1) * k; if (kq > .01) { push(); translate(WX + 110, WY - 300 * flyOut); scale(kq * (1 - flyOut)); paint(rrPts(-90, -70, 180, 140, 14), { fill: INK.paper, ink: INK.navy, sw: 1 }); drum(0, 5, .45, false, 1); pop(); }
    };
    // the context window: the knowledge sits inside it until the shutters close
    const kw = stamp(t, tWin - .3) * (1 - tom), shut = ease(seg(t, tGone - .4, tGone));
    const fade = ease(seg(t, tGone - .1, tGone + .5));
    if (tom < 1) {
      push(); translate(WX - 110, WY); scale(1.3); translate(-(WX - 110), -WY);
      if (kw > .01) { push(); translate(WX - 110, WY); scale(kw); paint(rrPts(-360, -170, 720, 340, 20), { fill: INK.navy, tone: .15 }); arcLine(0, 0, 0, 0, INK.navy); pop(); }
      knowledge(1 - tom, fade);
      if (kw > .01) { push(); translate(WX - 110, WY); scale(kw); for (const s of [-1, 1]) paint(rectPts(s < 0 ? -380 : 380 - 380 * shut, -190, 380 * shut, 380), { fill: INK.navy, tone: .85 }); paint(rrPts(-380, -190, 760, 26, 10), { fill: INK.navy }); pop(); }
      pop();
      // the clean solution and the commit
      const kc = stamp(t, tClean - .1) * (1 - tom); if (kc > .01) { push(); translate(1660, 420); scale(kc); fileIcon(0, 0, 1.4, INK.paper, INK.green); pop(); check(1700, 330, 1.2, stamp(t, tClean + .3) * (1 - tom)); }
      const kg = stamp(t, tComm - .1) * (1 - tom); if (kg > .01) { inkLine([[1500, 700], [1820, 700]], 1.4, INK.navy, 'ink', 0, { force: true }); for (let i = 0; i < 3; i++) paint(ellPts(1540 + i * 110, 700, i === 2 ? 26 * kg : 20, i === 2 ? 26 * kg : 20, 18), { fill: i === 2 ? INK.orange : INK.navy }); }
    }
    // tomorrow: a new sun, the same two dead ends
    if (tom > 0) {
      paint(ellPts(1650, 200, 100 * tom, 100 * tom, 40), { fill: INK.gold });
      for (let i = 0; i < 2; i++) { const x = 800 + i * 480; paint(rrPts(x - 160, 640, 320, 30, 15), { fill: INK.navy, tone: .4 }); const k = stamp(t, tSame + i * .5); if (k > .01) stampX(x, 520, 80, k); }
    }
    const cx = t < tTom ? 340 : lerp(340, 1280, ease(seg(t, tSame - .2, tDead + .3)));
    clawd(cx, 950, 18, { ...emotions(t, [[b.start, 'neutral'], [tFail, 'determined'], [tQuirk, 'surprised'], [tClean, 'proud'], [tGone - .1, 'sad'], [tTom, 'happy'], [tDead, 'confused', { emote: '?', emoteK: 1 }]]), ...(t > tSame - .2 && t < tDead + .3 ? move('walk', T, 2) : {}), emoteAge: t - tDead });
    camEnd();
    tIn('dots', lt, { col: 'yellow', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- C · the usual tools only go so far ----------
  function shotLimits(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('limits');
    riso({ seed: 83 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tIns = wt('limits', 'instruction'), tNob = wt('limits', 'nobody'), tGit = wt('limits', 'git'), tLearn = wt('limits', 'learned'), tSess = wt('limits', 'session'), tRem = wt('limits', 'remembers'), tDay = wt('limits', 'day');
    const X = [360, 960, 1560];
    const panel = (i, t0, fn) => { const k = stamp(t, t0 - .2); if (k <= .01) return; push(); translate(X[i], 520); scale(k); paint(rrPts(-270, -330, 540, 660, 30), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); pop(); };
    // instruction files: stable knowledge; a small discovery bounces off
    panel(0, tIns, () => {
      fileIcon(0, -60, 2.2, INK.paper, INK.gold);
      const f = seg(t, tNob - .3, tNob + .9); if (f > 0 && f < 1) { const p = f < .5 ? arcPt([-220, -300], [-40, -150], 60, f * 2) : arcPt([-40, -150], [-200, 250], 80, (f - .5) * 2); note(p[0], p[1], .6, f * 3); }
      if (t > tNob + .9) note(-170, 250, .6, .4);
    });
    // git history: what changed, not what was learned
    panel(1, tGit, () => {
      inkLine([[0, -250], [0, 250]], 1.6, INK.navy, 'ink', 0, { force: true });
      for (let i = 0; i < 5; i++) { const y = -220 + i * 110; paint(ellPts(0, y, 26, 26, 20), { fill: INK.orange }); paint(rrPts(50, y - 14, 150, 28, 14), { fill: INK.navy, tone: .5 }); const kq = stamp(t, tLearn - .1 + i * .08); if (kq > .01) type('?', -110, y, 70 * kq, INK.orange); }
    });
    // session summaries: only if someone remembers, at the end of a long day
    panel(2, tSess, () => {
      paint(rrPts(-120, -260, 240, 300, 14), { fill: INK.gold, tone: .5 }); for (let i = 0; i < 2; i++) paint(rectPts(-90, -210 + i * 40, 180 * (1 - i * .4), 12), { fill: INK.navy, tone: .6 });
      const km = stamp(t, tDay - .4); if (km > .01) { paint(ellPts(170, -270, 50 * km, 50 * km, 30), { fill: INK.yellow }); paint(ellPts(195, -285, 44 * km, 44 * km, 30), { fill: INK.paper }); }
      skipper(0, 320, 12, { ...SKIP_POSES[t > tRem ? 'think' : 'stand'], mood: t > tDay - .3 ? 'sleepy' : t > tRem ? 'thinking' : 'neutral', t });
    });
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- D · active memory: capture, organise, serve; every past session feeds this one; the shoal ----------
  function shotActive(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('active');
    riso({ seed: 84 });
    const tCap = wt('active', 'captures'), tOrg = wt('active', 'organizes'), tServ = wt('active', 'serves'), tFlows = wt('active', 'flows'), tPast = wt('active', 'past'), tTeam = wt('active', 'teammates'),
      tNote = wt('active', 'note'), tShoal = wt('active', 'shoal'), tEast = wt('active', 'east'), tDam = wt('active', 'damaged'), tOne = wt('active', 'one', -1);
    const p2 = ease(seg(T, tNote - .5, tNote + .1));
    camBegin(960 + 1920 * p2, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, 4240, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 960, 2120, 400), { fill: INK.navy, tone: .8 });
    // the memory cabinet
    const CX = 1000, CY = 540;
    const kc = stamp(t, b.start - .1);
    if (kc > .01) {
      push(); translate(CX, CY); scale(kc);
      paint(rrPts(-170, -250, 340, 500, 20), { fill: INK.brown });
      for (let i = 0; i < 3; i++) { const out = i === 1 ? 60 * Math.sin(Math.PI * seg(t, tOrg, tOrg + .8)) : i === 0 ? 40 * Math.sin(Math.PI * seg(t, tOrg + .2, tOrg + 1)) : 0; paint(rrPts(-140 + out, -220 + i * 150, 280, 130, 12), { fill: INK.gold }); paint(rrPts(-40 + out, -165 + i * 150, 80, 20, 10), { fill: INK.brown }); }
      pop();
      logbook(CX, CY - 330, .7 * kc, 1);
    }
    // captures: cards fly in
    for (let i = 0; i < 3; i++) { const f = seg(t, tCap - .2 + i * .2, tCap + .5 + i * .2); if (f > 0 && f < 1) { const p = arcPt([560, 700 - i * 60], [CX - 60, CY], 120, ease(f)); note(p[0], p[1], .6 * (1 - .5 * f), f * 2); } }
    // serves: a card out to the agent
    const fs = seg(t, tServ - .1, tServ + .6); if (fs > 0) { const p = arcPt([CX + 100, CY], [1560, 720], 140, ease(fs)); if (fs < 1 || t < tFlows) note(p[0], p[1], .7, 0); }
    // every past session: ghost agents hand their notes forward
    for (let i = 0; i < 4; i++) { const k = stamp(t, tPast - .2 + i * .12); if (k <= .01) continue; const x = 160 + i * 140; clawd(x, 950, 9 * k, { ...feel(i === 3 && t > tTeam ? 'happy' : 'neutral', T + i), tint: 'blue', tintK: .7, noShadow: true }); const f = frac((t - tFlows) * .8 + i * .25); if (t > tFlows) note(lerp(x + 40, CX - 150, f), 820 - 200 * Math.sin(f * Math.PI), .35, 0); }
    clawd(1560, 950, 18, { ...emotions(t, [[b.start, 'neutral', { lookX: -1 }], [tServ + .3, 'happy'], [tFlows, 'starstruck']]), flip: true });
    // --- the chart: a shoal, a note, a swerve east
    const X0 = 1920;
    paint(rectPts(X0 - 20, -200, 2140, H + 400), { fill: 'yellow', tone: .25 });
    push(); translate(X0 + 200, 0); sea(640, t); pop();
    const ks = ease(seg(t, tShoal - .3, tShoal + .3));
    if (ks > 0) { paint(ellPts(X0 + 1050, 860, 260 * ks, 90 * ks, 40), { fill: INK.orange, tone: .7, over: true }); for (let i = 0; i < 4; i++) paint([[X0 + 900 + i * 90, 880], [X0 + 940 + i * 90, 820 - 30 * hash(i)], [X0 + 990 + i * 90, 880]], { fill: INK.dark, alpha: ks }); }
    const kn = stamp(t, tShoal - .1); if (kn > .01) { push(); translate(X0 + 1500, 250); rotate(-.06); scale(kn); paint(rrPts(-240, -130, 480, 260, 14), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); for (let i = 0; i < 3; i++) paint(rectPts(-190, -70 + i * 50, 380 * (1 - i * .25), 14), { fill: INK.navy, tone: .6 }); paint([[140, 100], [230, 100], [230, 20]], { fill: INK.orange }); pop(); }
    // the ship: steered east (up and away from the shoal) on "east"
    const swerve = ease(seg(t, tEast - .2, tEast + 1)), shx = X0 + 380 + 900 * seg(t, tNote - .2, tOne + .5), shy = 720 - 160 * swerve;
    ship(shx, shy + 8 * Math.sin(t * 2), .7, -.18 * swerve * (1 - seg(t, tEast + 1, tEast + 1.6)));
    // what the note cost someone: a dented hull, shown small
    const kd = stamp(t, tDam - .15); if (kd > .01) { push(); translate(X0 + 380, 330); scale(kd * .8); paint(ellPts(0, 0, 170, 150, 40), { fill: INK.paper, ink: INK.navy, sw: 1 }); ship(0, 70, .5, .3, 1); pop(); }
    if (t > tOne - .3) { const k = stamp(t, tOne - .3); glow(X0 + 1500, 250, 330 * k, 'yellow', .6); }
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · the palace: wings, rooms, drawers; load at the start, store during, a hook at the end ----------
  function shotPalace(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('palace');
    riso({ seed: 85 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tWing = wt('palace', 'wings'), tRoom = wt('palace', 'rooms'), tDraw = wt('palace', 'drawers'), tVerb = wt('palace', 'verbatim'), tStart = wt('palace', 'start'), tLoads = wt('palace', 'loads'),
      tStores = wt('palace', 'stores'), tEnd = wt('palace', 'end'), tHook = wt('palace', 'hook'), tSaves = wt('palace', 'saves');
    const PX = 760;
    // the palace: a keep, then two wings, then rooms (windows)
    const kk = stamp(t, b.start);
    if (kk > .01) { push(); translate(PX, 940); scale(kk); paint(rectPts(-160, -520, 320, 520), { fill: INK.navy }); paint([[-190, -520], [0, -680], [190, -520]], { fill: INK.orange }); pop(); }
    for (const s of [-1, 1]) { const kw = stamp(t, tWing - .15 + (s > 0 ? .12 : 0)); if (kw <= .01) continue; push(); translate(PX + s * 340, 940); scale(kw); paint(rectPts(-180, -340, 360, 340), { fill: INK.navy, tone: .8 }); paint([[-200, -340], [0, -440], [200, -340]], { fill: INK.brown }); pop(); }
    const win = [[-470, -250], [-340, -250], [-210, -250], [210, -250], [340, -250], [470, -250], [-60, -420], [60, -420], [-60, -280], [60, -280]];
    win.forEach(([dx, dy], i) => { const k = stamp(t, tRoom - .1 + i * .05); if (k > .01) paint(rrPts(PX + dx - 34 * k, 940 + dy - 44 * k, 68 * k, 88 * k, 30 * k), { fill: INK.gold }); });
    // a drawer slides out with a verbatim page
    const kd = ease(seg(t, tDraw - .2, tDraw + .4));
    if (kd > 0) { paint(rrPts(PX - 90, 780, 180 + 0, 110, 10), { fill: INK.brown }); paint(rrPts(PX - 80, 790 + 130 * kd, 160, 90, 8), { fill: INK.gold }); if (t > tVerb - .1) page(PX, 790 + 130 * kd - 40, .8 * stamp(t, tVerb - .1), 0); }
    // the lifecycle: load, store, hook
    const tr = (a, b2, t0) => { const f = seg(t, t0, t0 + .7); if (f > 0 && f < 1) { const p = arcPt(a, b2, 160, ease(f)); note(p[0], p[1], .6, 0); } };
    tr([PX + 200, 500], [1560, 780], tLoads - .2);
    tr([1560, 780], [PX + 200, 500], tStores - .1);
    if (t > tStart - .2 && t < tStores + 1.4) { const ks = stamp(t, tStart - .2); paint(ellPts(1620, 180, 70 * ks, 70 * ks, 30), { fill: INK.gold }); }
    const kh = ease(seg(t, tHook - .3, tHook + .3));
    if (kh > 0) { hookIcon(PX + 60, lerp(-200, 700, kh), 1); if (t > tSaves) { const ks = stamp(t, tSaves); push(); translate(PX, 830); scale(ks); arcLine(0, -30, 34, 12, INK.navy, { a0: Math.PI, a1: TAU }); paint(rrPts(-50, -30, 100, 80, 12), { fill: INK.orange }); pop(); } }
    if (t > tEnd - .2) { const k = stamp(t, tEnd - .2); paint(ellPts(1620, 180, 70 * k, 70 * k, 30), { fill: INK.navy }); paint(ellPts(1650, 165, 62 * k, 62 * k, 30), { fill: 'yellow', tone: .22 }); }
    clawd(1560, 940, 17, { ...emotions(t, [[b.start, 'neutral', { lookX: -1 }], [tLoads, 'idea'], [tStores - .1, 'determined'], [tSaves, 'relieved']]), flip: true });
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- F · shared memory: one agent writes it down, another reads it before it starts ----------
  function shotShared(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('shared');
    riso({ seed: 86 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tStore = wt('shared', 'store'), tPar = wt('shared', 'parallel'), tBlind = wt('shared', 'blind'), tFinds = wt('shared', 'finds'), tWrites = wt('shared', 'writes'), tAnother = wt('shared', 'another'),
      tReads = wt('shared', 'reads'), tDiary = wt('shared', 'diary'), tAll = wt('shared', 'all', -1);
    // two lanes
    const kl = ease(seg(t, tPar - .4, tPar + .2));
    paint(rectPts(-200, 420 - 10, (W + 400) * kl, 20), { fill: INK.navy, tone: .35 });
    paint(rectPts(-200, 960, W + 400, 400), { fill: INK.navy, tone: .8 });
    paint(rectPts(-200, 380, W + 400, 30), { fill: INK.navy, tone: .8 });
    // the shared log in the middle
    const kb = stamp(t, tStore - .2); if (kb > .01) logbook(960, 560, 1.1 * kb, 1);
    // agent one (top lane): finds the gap in the database, writes a note
    drum(420, 250, .9, true, t > tFinds && t < tFinds + .8 ? 1 : 0);
    clawd(640, 380, 12, { ...emotions(t, [[b.start, 'neutral'], [tBlind - .2, 'nervous'], [tFinds, 'surprised'], [tWrites, 'determined'], [tWrites + .8, 'happy']]), flip: true });
    const fw = seg(t, tWrites, tWrites + .7); if (fw > 0 && fw < 1) { const p = arcPt([720, 260], [960, 520], 120, ease(fw)); note(p[0], p[1], .5, fw * 3); }
    if (t > tWrites + .7) { paint(rrPts(1000, 480, 100, 40, 6), { fill: INK.gold, over: true }); }
    // agent two (bottom lane): the frontend; takes the note before starting
    const kF = stamp(t, tAnother - .2); if (kF > .01) { push(); translate(1500, 820); scale(kF); paint(rrPts(-160, -110, 320, 220, 14), { fill: INK.navy }); paint(rrPts(-140, -90, 280, 40, 8), { fill: INK.orange }); paint(rrPts(-140, -30, 130, 100, 8), { fill: INK.paper, tone: .8 }); paint(rrPts(10, -30, 130, 40, 8), { fill: INK.green }); pop(); }
    const fr = seg(t, tReads - .1, tReads + .6); if (fr > 0) { const p = arcPt([1040, 520], [1220, 780], 120, ease(fr)); if (fr < 1) note(p[0], p[1], .5, 0); }
    clawd(1240, 950, 13, { ...emotions(t, [[b.start, 'neutral'], [tBlind - .2, 'nervous'], [tReads + .4, 'idea'], [tDiary, 'happy']]) });
    // diaries: each agent's own, readable by all
    for (let i = 0; i < 3; i++) { const k = stamp(t, tDiary - .2 + i * .12); if (k <= .01) continue; const open = ease(seg(t, tAll - .3 + i * .1, tAll + .2 + i * .1)); logbook(1440 + i * 180, 200, .55 * k, open, [INK.navy, INK.green, INK.orange][i]); }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- G · be choosy; memory is an attack surface ----------
  function shotCurate(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('curate');
    riso({ seed: 87 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 940, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tStore = wt('curate', 'store'), tUnd = wt('curate', 'undocumented'), tDec = wt('curate', 'decisions'), tFail = wt('curate', 'failed'), tSkip = wt('curate', 'skip'), tAtt = wt('curate', 'attack'),
      tPois = wt('curate', 'poison'), tVan = wt('curate', 'vanish'), tNext = wt('curate', 'next'), tWeek = wt('curate', 'week');
    const CHX = 700, BNX = 1400;
    // the chest (keep) and the bin (skip)
    const kc = stamp(t, tStore - .2);
    if (kc > .01) { push(); translate(CHX, 940); scale(kc); paint(rrPts(-200, -220, 400, 220, 16), { fill: INK.brown }); paint(rrPts(-210, -260, 420, 70, 20), { fill: INK.brown, tone: .8 }); paint(rectPts(-20, -240, 40, 60), { fill: INK.gold }); pop(); }
    const kb = stamp(t, tSkip - .3);
    if (kb > .01) { push(); translate(BNX, 940); scale(kb); paint([[-110, -240], [110, -240], [90, 0], [-90, 0]], { fill: INK.navy, tone: .7 }); paint(rrPts(-130, -270, 260, 36, 14), { fill: INK.navy }); pop(); }
    // items fly into the chest
    const item = (t0, fn, dst = [CHX, 720]) => { const k = stamp(t, t0 - .15), f = seg(t, t0 + .5, t0 + 1.1); if (k <= .01 || f >= 1) return; const p = arcPt([dst[0] - 160, 300], dst, 140, ease(f)); push(); translate(lerp(dst[0] - 160, p[0], f > 0 ? 1 : 0), f > 0 ? p[1] : 300); scale(k * (1 - .5 * f)); paint(ellPts(0, 0, 90, 90, 36), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(); pop(); };
    item(tUnd, () => { paint(ellPts(0, 10, 34, 24, 20), { fill: INK.orange }); paint(ellPts(34, 10, 13, 13, 12), { fill: INK.dark }); type('?', -10, -40, 50, INK.navy); });
    item(tDec, () => { arcLine(0, 0, 50, 10, INK.navy); paint([[0, -40], [14, 0], [0, 40], [-14, 0]], { fill: INK.orange }); });
    item(tFail, () => { inkLine(through([[-50, 30], [-10, -10], [30, 0], [45, -40]]), 1.4, INK.navy, 'ink', .5, { force: true }); stampX(0, 0, 36, 1); });
    item(tSkip, () => fileIcon(0, 0, .9, INK.paper), [BNX, 720]);
    // the poisoned note: it sneaks into the chest, and comes back next week
    const kp = stamp(t, tPois - .2), sneak = seg(t, tPois, tVan + .2), back = seg(t, tNext - .3, tWeek + .3);
    if (kp > .01 && (sneak < 1 || back > 0)) {
      const p = back > 0 ? arcPt([CHX, 720], [1180, 700], 200, easeOut(back)) : arcPt([CHX + 520, 250], [CHX, 720], 120, ease(sneak));
      push(); translate(p[0], p[1]); scale(kp * (back > 0 ? 1 : 1 - .4 * sneak)); note(0, 0, .8, .1, INK.dark); for (let i = 0; i < 3; i++) paint(ellPts(-30 + i * 30, 50 + 12 * ((i + 1) % 2) + 6 * Math.sin(t * 4 + i), 8, 12, 10), { fill: INK.dark }); pop();
    }
    if (t > tAtt - .1 && t < tPois + .5) glow(CHX + 520, 250, 150, 'orange', .4);
    const kcal = stamp(t, tNext - .2); if (kcal > .01) { push(); translate(1640, 260); scale(kcal); paint(rrPts(-110, -110, 220, 220, 18), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); paint(rrPts(-110, -110, 220, 55, 18), { fill: INK.orange }); for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) paint(rectPts(-80 + c * 44, -30 + r * 50, 30, 30), { fill: r === 1 && c === 1 ? INK.orange : INK.navy, tone: .6 }); pop(); }
    clawd(1180, 940, 16, { ...emotions(t, [[b.start, 'neutral', { lookX: -1 }], [tUnd, 'happy', { lookX: -1 }], [tAtt, 'suspicious'], [tWeek, 'scared']]), flip: true });
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- H · promote what keeps coming up; the crew is temporary, the log sails on ----------
  function shotLog(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('log');
    riso({ seed: 88 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    const tNote = wt('log', 'note'), tComing = wt('log', 'coming'), tProm = wt('log', 'promote'), tConv = wt('log', 'convention'), tTest = wt('log', 'test'), tCrew = wt('log', 'crew'), tTemp = wt('log', 'temporary'),
      tLog = wt('log', 'log'), tVoy = wt('log', 'voyage'), tUnd = wt('log', 'understanding'), tReach = wt('log', 'reach');
    const dawn = ease(seg(t, tVoy - .3, tVoy + .8));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 700], to: [0, 0], a: .25 + .4 * dawn, b: .05 } });
    if (dawn > 0) paint(ellPts(1500, 700, 220 * dawn, 220 * dawn, 48), { fill: INK.gold });
    sea(700, t);
    // the notes that keep coming up: three copies stack, then merge into a convention and a test
    const merge = ease(seg(t, tProm - .1, tProm + .4));
    const kpart = 1 - ease(seg(t, tCrew - .6, tCrew - .2));
    if (kpart > .01) {
      for (let i = 0; i < 3; i++) { const k = stamp(t, tNote - .2 + i * .25); if (k > .01 && merge < 1) note(lerp(1300 + i * 30, 1400, merge), lerp(250 + i * 40, 290, merge), .9 * k * (1 - merge), (i - 1) * .12); }
      const kc = stamp(t, tConv - .15) * kpart; if (kc > .01) { push(); translate(1260, 280); scale(kc); fileIcon(0, 0, 1.6, INK.paper, INK.gold); pop(); }
      const kt = stamp(t, tTest - .1) * kpart; if (kt > .01) { push(); translate(1560, 280); scale(kt); lampG(0, 0, 70, t > tTest + .3); pop(); }
    }
    // the ship, its log aboard; the crew changes
    const sail = ease(seg(t, tVoy - .2, tReach + .6)), sx = lerp(620, 1100, sail);
    push(); translate(sx, 740 + 8 * Math.sin(t * 2)); rotate(-.03 * Math.sin(t * 1.6));
    ship(0, 0, 1.5, 0);
    logbook(-165, -95, .6, 1);
    // crew A leaves on "temporary", crew B arrives
    const swap = ease(seg(t, tTemp - .3, tTemp + .5));
    for (let i = 0; i < 2; i++) {
      if (swap < 1) clawd(100 + i * 110, -30, 8, { ...feel('happy', T + i), dy: -14 * swap, noShadow: true, tint: 'blue', tintK: .6 * swap, sx: 1 - swap, sy: 1 - swap });
      if (swap > 0) clawd(100 + i * 110, -30, 8 * swap, { ...feel(t > tUnd ? 'excited' : 'happy', T + i + 2), noShadow: true });
    }
    pop();
    const kl = t > tLog - .2 && t < tLog + 1 ? Math.sin(Math.PI * seg(t, tLog - .2, tLog + 1)) : 0;
    if (kl > 0) glow(sx - 165, 650, 140 * kl, 'yellow', .8);
    if (t > tReach - .3) glow(1500, 520, 300 * stamp(t, tReach - .3), 'yellow', .7);
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCardLong(T0, lt, dur, '09', TIMING.next);   // endCard() with the title split over two lines
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotAmnesiaIn(T0, lt, dur) { shotAmnesia(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('amnesia', 0), shotAmnesiaIn],
    [shotAt('lost'), shotLost],
    [shotAt('limits'), shotLimits],
    [shotAt('active'), shotActive],
    [shotAt('palace'), shotPalace],
    [shotAt('shared'), shotShared],
    [shotAt('curate'), shotCurate],
    [shotAt('log'), shotLog],
    [B.log.end + .9, shotEnd],
  ]);
})();
