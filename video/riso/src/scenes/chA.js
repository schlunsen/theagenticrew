// chA.js: Appendix A · Agents as Pentesters. Storyboard: video/storyboards/chA.md
// Defensive, authorized security testing told as a case study in agentic engineering. Abstract diagrams only.
// Orange = the intentionally hostile agent; the emphasis throughout is guardrails and human oversight.
// Every event keyed to a spoken word (wt(beat, word)).
(() => {
  // ---------- small props ----------
  const check = (x, y, s, k, col = INK.green) => { if (k > .01) paint(ribbon([[x - 40 * s, y], [x - 10 * s, y + 30 * s], [x + 50 * s, y - 40 * s]].map(([px, py]) => [x + (px - x) * k, y + (py - y) * k]), 18 * s), { fill: col, over: true }); };
  const loopArrow = (x, y, r, rot, col = INK.navy, w = 22) => { arcLine(x, y, r, w, col, { a0: rot, a1: rot + TAU * .82, cap: 'round' }); const a = rot + TAU * .82, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r, tx = -Math.sin(a), ty = Math.cos(a); paint([[px + Math.cos(a) * w * 1.6, py + Math.sin(a) * w * 1.6], [px - Math.cos(a) * w * 1.6, py - Math.sin(a) * w * 1.6], [px + tx * w * 2.2, py + ty * w * 2.2]], { fill: col }); };
  const gear = (x, y, r, rot, col) => { const P = []; for (let i = 0; i < 48; i++) { const a = rot + i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? r : r * .8; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } paint(P, { fill: col }); paint(ellPts(x, y, r * .35, r * .35, 20), { fill: INK.paper }); };
  const fileIcon = (x, y, s, col = INK.paper) => { paint([[x - 44 * s, y - 56 * s], [x + 20 * s, y - 56 * s], [x + 44 * s, y - 30 * s], [x + 44 * s, y + 56 * s], [x - 44 * s, y + 56 * s]], { fill: col, ink: INK.navy, sw: 1.1 * s }); for (let i = 0; i < 3; i++) paint(rectPts(x - 28 * s, y - 12 * s + i * 20 * s, 56 * s, 7 * s), { fill: INK.navy, tone: .6 }); };
  const card = (x, y, w, h, col = INK.navy, o = {}) => { paint(rrPts(x, y, w, h, Math.min(w, h) * .14), { fill: col, tone: o.tone ?? 1, over: o.over }); if (o.bars !== false) for (let i = 0; i < 3; i++) paint(rrPts(x + w * .12, y + h * (.22 + i * .22), w * (i === 2 ? .45 : .74), h * .09, h * .045), { fill: o.bar || INK.paper }); };
  // a small agent worker (an orange block bot with slit eyes) at (x,y) ground, size u
  const shield = (x, y, s, col = INK.navy) => { push(); translate(x, y); scale(s); paint([[0, -110], [95, -66], [95, 34], [0, 120], [-95, 34], [-95, -66]], { fill: col }); paint([[0, -84], [68, -50], [68, 24], [0, 90], [-68, 24], [-68, -50]], { fill: INK.paper, tone: .0 }); pop(); };
  const catBadge = (x, y, s, col) => { paint(ellPts(x, y, 30 * s, 30 * s, 20), { fill: col, ink: INK.navy, sw: 1.2 }); };
  const meter = (x, y, w, k, col = INK.orange) => { paint(rrPts(x, y, w, 26, 13), { fill: INK.navy, tone: .25 }); paint(rrPts(x, y, w * clamp(k), 26, 13), { fill: col }); };

  // ---------- A · the hook: slow manual pentests; the code changes daily ----------
  function shotHack(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('hack');
    riso({ seed: 221 });
    camBegin(960, 540, 1.02 + .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tPipe = wt('hack', 'pipeline'), tSlow = wt('hack', 'manual'), tYear = wt('hack', 'year'), tDay = wt('hack', 'day'), tDrift = wt('hack', 'drifts');
    // the pipeline: a conveyor of commits
    const kp = stamp(t, tPipe - .2);
    if (kp > .01) {
      push(); translate(0, 300 * (1 - kp));
      paint(rrPts(200, 340, 1520, 30, 15), { fill: INK.navy, tone: .5 });
      for (let i = 0; i < 8; i++) { const x = 260 + ((i * 200 + t * 90) % 1520); paint(ellPts(x, 320, 24, 24, 18), { fill: INK.orange }); }
      // a source file / target box at the end
      fileIcon(1650, 260, 1.1);
      pop();
    }
    // a calendar, one lonely marked day (once a year)
    if (t > tSlow - .2) { const kc = stamp(t, tSlow - .2); push(); translate(560, 620); scale(kc); paint(rrPts(-160, -140, 320, 300, 18), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint(rrPts(-160, -140, 320, 56, 14), { fill: INK.navy }); for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) paint(rrPts(-130 + c * 62, -60 + r * 64, 44, 44, 8), { fill: INK.navy, tone: .18 }); if (t > tYear - .2) { const km = stamp(t, tYear - .2); paint(rrPts(-130 + 3 * 62, -60 + 64, 44 * km, 44 * km, 8), { fill: INK.orange }); } pop(); }
    // commits stream by daily; the shield meter droops
    if (t > tDay - .2) {
      const kd = stamp(t, tDay - .2);
      push(); translate(1300, 620); scale(kd);
      for (let i = 0; i < 6; i++) { const x = ((i * 90 + t * 120) % 540) - 270; paint(rrPts(x - 24, -40, 48, 60, 8), { fill: INK.gold }); }
      type('DAILY', 0, 90, 34, INK.navy);
      pop();
      shield(1300, 500, .8 * kd);
      const droop = ease(seg(t, tDrift - .2, tDrift + 1));
      meter(1180, 700, 240, 1 - .8 * droop);
    }
    skipper(300, 900, 15, skipAct(t, [[b.start, 'stand', { mood: 'neutral', lookY: -.4 }], [tSlow, 'think', { mood: 'thinking' }], [tDrift, 'shrug', { mood: 'worried' }]]));
    camEnd();
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- B · the phases: scan, map, five specialists in parallel ----------
  function shotPhases(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('phases');
    riso({ seed: 222 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tPhase = wt('phases', 'phases'), tScan = wt('phases', 'scan'), tSource = wt('phases', 'source'), tMap = wt('phases', 'map'), tLogin = wt('phases', 'login'), tFive = wt('phases', 'five'), tPar = wt('phases', 'parallel');
    // a pipeline spine
    const spine = ease(seg(t, b.start + .2, b.start + .9));
    paint(rectPts(160, 540, 1600 * spine, 10), { fill: INK.navy, tone: .5 });
    // station 1: scan a target + read a source file
    const k1 = stamp(t, tScan - .2);
    if (k1 > .01) { push(); translate(360, 420); scale(k1); paint(rrPts(-140, -130, 280, 260, 24), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      paint(rrPts(-90, -90, 180, 90, 12), { fill: INK.navy, tone: .5 }); for (let i = 0; i < 3; i++) { const yy = -70 + i * 26; paint(rectPts(-70, yy, 120 * (t > tScan ? clamp((t - tScan) * 2 - i * .3) : 0), 8), { fill: INK.orange }); }
      if (t > tSource - .1) fileIcon(0, 60, .8);
      type('1', 0, 170, 40, INK.orange); pop(); }
    // station 2: map endpoints + a login door
    const k2 = stamp(t, tMap - .2);
    if (k2 > .01) { push(); translate(760, 420); scale(k2); paint(rrPts(-140, -130, 280, 260, 24), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      const nodes = [[-70, -60], [10, -80], [70, -30], [-30, 10], [50, 50], [-80, 60]]; nodes.forEach((n, i) => { if (i > 0) inkLine([nodes[i - 1], n], 1.2, INK.navy, 'ink', 0, { force: true, tone: .6 }); }); nodes.forEach(n => paint(ellPts(n[0], n[1], 12, 12, 12), { fill: INK.navy }));
      if (t > tLogin - .1) { paint(rrPts(30, -30, 60, 90, 8), { fill: INK.gold }); paint(ellPts(78, 15, 6, 6, 10), { fill: INK.navy }); }
      type('2', 0, 170, 40, INK.orange); pop(); }
    // station 3: five specialists fan out in parallel
    const k3 = stamp(t, tFive - .2);
    if (k3 > .01) {
      push(); translate(1360, 440); scale(k3);
      paint(ellPts(0, -140, 44, 44, 24), { fill: INK.navy });   // the dispatcher
      const cats = [INK.orange, INK.gold, INK.green, INK.brown, INK.orange];
      for (let i = 0; i < 5; i++) { const kk = backOut(seg(t, tPar - .1 + i * .06, tPar + .25 + i * .06)); if (kk <= .01) continue; const x = (i - 2) * 90 * kk, y = 60; inkLine([[0, -110], [x, y - 40]], 1.4, INK.navy, 'ink', 0, { force: true, tone: .6 }); catBadge(x, y, kk, cats[i]); for (let j = 0; j < 2; j++) paint(rectPts(x - 20, y + 30 + j * 12, 40, 6), { fill: INK.navy, tone: .4 }); }
      type('3', 0, 180, 40, INK.orange); pop();
    }
    type('PHASES', 960, 200, 74, INK.navy, { pop: seg(t, tPhase - .1, tPhase + .3), alpha: 1 - seg(t, tScan - .3, tScan) });
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['federal', 'yellow'] });
  }

  // ---------- C · confirm by exploiting; scanner vs pentester; report; durable workflow ----------
  function shotExploit(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('exploit');
    riso({ seed: 223 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tFive = wt('exploit', 'five'), tProve = wt('exploit', 'prove'), tMaybe = wt('exploit', 'maybe'), tShows = wt('exploit', 'shows'), tWrites = wt('exploit', 'writes'), tScores = wt('exploit', 'scores'), tCrash = wt('exploit', 'crashes');
    const p1 = 1 - ease(seg(t, tMaybe - .5, tMaybe - .1));
    // five agents stamp "confirmed" on findings
    if (p1 > .01) {
      push(); translate(0, -600 * (1 - p1));
      for (let i = 0; i < 5; i++) { const x = 340 + i * 320, kk = stamp(t, tFive - .2 + i * .06); if (kk <= .01) continue;
        card(x - 90, 340, 180, 120, INK.paper, { bar: INK.navy, tone: 1 }); paint(rrPts(x - 90, 340, 180, 120, 16), { fill: 'none' });
        const kc = backOut(seg(t, tProve - .1 + i * .05, tProve + .3 + i * .05)); if (kc > .01) { paint(ellPts(x + 55, 360, 40 * kc, 40 * kc, 20), { fill: INK.orange, over: true }); check(x + 55, 360, .6, kc, INK.navy); } }
      type('CONFIRMED', 960, 250, 54, INK.navy, { spacing: .1, pop: seg(t, tProve, tProve + .4) });
      pop();
    }
    // scanner ("maybe", ?) vs pentester (proof, check)
    const p2 = ease(seg(t, tMaybe - .2, tMaybe + .2)) * (1 - ease(seg(t, tWrites - .5, tWrites - .1)));
    if (p2 > .01) {
      push(); translate(560, 500); scale(p2); paint(rrPts(-180, -160, 360, 320, 26), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); type('?', 0, -30, 120, INK.gold); type('SCANNER', 0, 120, 34, INK.navy); pop();
      const kk = ease(seg(t, tShows - .2, tShows + .3));
      push(); translate(1360, 500); scale(p2); paint(rrPts(-180, -160, 360, 320, 26), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); check(0, 0, 2.4, kk, INK.green); type('PENTESTER', 0, 120, 32, INK.navy); pop();
    }
    // a reporting agent prints a scored report
    if (t > tWrites - .3) {
      const kr = stamp(t, tWrites - .3);
      push(); translate(760, 500); scale(kr);
      paint(rrPts(-160, -220, 320, 440, 20), { fill: INK.paper, ink: INK.navy, sw: 1.6 });
      const rows = Math.floor(6 * ease(seg(t, tWrites, tWrites + 1.2)));
      for (let i = 0; i < rows; i++) { paint(rrPts(-130, -180 + i * 62, 180 + 60 * hash(i), 16, 8), { fill: INK.navy, tone: .55 }); const sc = stamp(t, tScores + i * .08); if (sc > .01) paint(rrPts(90, -186 + i * 62, 60 * sc, 30, 8), { fill: [INK.orange, INK.gold, INK.green][i % 3] }); }
      type('REPORT', 0, -250, 30, INK.orange); pop();
    }
    // a durable workflow: a gear resumes a crashed station
    if (t > tCrash - .4) {
      const kg = stamp(t, tCrash - .4);
      push(); translate(1450, 780); scale(kg);
      for (let i = 0; i < 4; i++) paint(rrPts(-200 + i * 110, -30, 90, 60, 10), { fill: i === 2 ? INK.navy : INK.navy, tone: i === 2 ? (t > tCrash ? 1 : .2) : .6 });
      if (t > tCrash) { const resume = ease(seg(t, tCrash, tCrash + .5)); paint(rrPts(-90, -30, 90, 60 * resume, 10), { fill: INK.orange }); }
      gear(180, 0, 46, t * 2, INK.gold);
      pop();
    }
    skipper(300, 1040, 15, skipAct(t, [[b.start, 'stand', { mood: 'focused' }], [tShows, 'present', { mood: 'grin' }], [tCrash, 'point', { mood: 'neutral' }]]));
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('iris', lt, dur, { cx: 960, cy: 540 });
  }

  // ---------- D · sentinel: watch the repo, route by what changed, skip if nothing ----------
  function shotSentinel(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('sentinel');
    riso({ seed: 224 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tCont = wt('sentinel', 'continuously'), tHours = wt('sentinel', 'hours'), tChanged = wt('sentinel', 'changed'), tQuery = wt('sentinel', 'query'), tTemplate = wt('sentinel', 'template'), tDocker = wt('sentinel', 'docker'), tSkip = wt('sentinel', 'skips');
    // a clock over a repo
    const kc = stamp(t, tCont - .2);
    if (kc > .01) { push(); translate(360, 320); scale(kc); paint(ellPts(0, 0, 90, 90, 40), { fill: INK.paper, ink: INK.navy, sw: 2 }); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ellPts(Math.cos(a) * 70, Math.sin(a) * 70, 5, 5, 8), { fill: INK.navy }); } const a = -Math.PI / 2 + (t - tCont) * 2.4; inkLine([[0, 0], [Math.cos(a) * 60, Math.sin(a) * 60]], 3, INK.orange, 'ink', 0, { force: true }); paint(ellPts(0, 0, 8, 8, 10), { fill: INK.navy }); type('EVERY FEW HOURS', 0, 150, 26, INK.navy, { pop: seg(t, tHours - .1, tHours + .3) }); pop(); }
    // a router: a changed file flicks to the matching agent
    const kr = stamp(t, tChanged - .3);
    if (kr > .01) {
      push(); translate(960, 560); scale(kr);
      paint([[-120, -100], [120, -100], [60, 40], [60, 120], [-60, 120], [-60, 40]], { fill: INK.navy });   // funnel/router
      type('ROUTE', 0, 190, 30, INK.navy);
      const lanes = [[-520, -260, tQuery, 'injection', INK.orange], [0, -300, tTemplate, 'XSS', INK.gold], [520, -260, tDocker, 'full scan', INK.green]];
      lanes.forEach(([lx, ly, tw, lbl, col]) => {
        const kk = stamp(t, tw - .2); if (kk <= .01) return;
        // the changed file drops in
        const drop = ease(seg(t, tw - .3, tw)); fileIcon(lx, ly - 40 + 100 * drop, .7 * kk);
        // routed out to a category agent below
        const route = ease(seg(t, tw, tw + .5));
        if (route > 0) { inkLine([[0, -40], [lx * route, 300 * route]], 2, INK.navy, 'ink', 0, { force: true, tone: .6 }); catBadge(lx * route, 300 * route, kk, col); }
      });
      pop();
    }
    // nothing changed? skip
    if (t > tSkip - .3) { const ks = stamp(t, tSkip - .3); push(); translate(960, 920); scale(ks); paint(rrPts(-150, -50, 300, 100, 50), { fill: INK.green, tone: .4 }); type('SKIP', 0, 4, 60, INK.navy); pop(); check(1140, 900, 1.2, stamp(t, tSkip + .1)); }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('dots', lt, dur, { col: 'orange', cx: 960, cy: 540 });
  }

  // ---------- E · guardrails for a hostile agent: absolute rules ----------
  function shotHostile(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('hostile');
    riso({ seed: 225 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tHos = wt('hostile', 'hostile'), tWorld = wt('hostile', 'world'), tProd = wt('hostile', 'production'), tAuth = wt('hostile', 'authorization'), tVer = wt('hostile', 'verify'), tSand = wt('hostile', 'sandbox'), tRestr = wt('hostile', 'restrictive', -1);
    // the hostile agent faces outward; a shield wraps the world behind it
    const kw = stamp(t, tHos - .2);
    if (kw > .01) { glow(300, 500, 220 * ease(seg(t, tWorld - .2, tWorld + .4)), 'yellow', .4); paint(ellPts(300, 500, 130, 130, 48), { fill: 'federal', tone: .35 }); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; inkLine([[300, 500], [300 + Math.cos(a) * 130, 500 + Math.sin(a) * 130]], 1, INK.navy, 'ink', 0, { force: true, tone: .5 }); } shield(300, 500, 1.4 * kw); }
    // four absolute rules stamp in
    const X = [720, 1100, 1480, 1120], Y = [400, 400, 400, 760];
    const rule = (i, t0, fn, label) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(X[i], Y[i]); scale(k); paint(rrPts(-160, -130, 320, 260, 26), { fill: INK.paper, ink: INK.navy, sw: 1.6 }); fn(); type(label, 0, 150, 26, INK.navy); pop(); };
    // NO production
    rule(0, tProd, () => { for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { paint(rrPts(-110 + c * 80, -80 + r * 70, 60, 50, 8), { fill: INK.navy }); } paint(ellPts(0, -30, 100, 100, 40), { fill: 'none' }); arcLine(0, -30, 90, 14, INK.orange); paint(ribbon([[-64, -94], [64, 34]], 22), { fill: INK.orange, over: true }); }, 'NOT PROD');
    // signed authorization page
    rule(1, tAuth, () => { fileIcon(0, -20, 1.2); paint(ribbon([[-40, 60], [0, 80], [60, 40]], 8), { fill: INK.orange }); }, 'AUTHORIZED');
    // a human check on each finding
    rule(2, tVer, () => { skipper(0, 90, 6, { ...SKIP_POSES.point, mood: 'focused', noShadow: true, t }); check(60, -40, 1.4, ease(seg(t, tVer, tVer + .4))); }, 'VERIFY');
    // a sandbox box around the agent
    rule(3, tSand, () => { paint(rrPts(-120, -100, 240, 200, 16), { fill: INK.green, tone: .3 }); for (let i = 0; i < 5; i++) paint(rectPts(-120 + i * 60, -100, 6, 200), { fill: INK.navy, tone: .4 }); clawd(0, 70, 7, { ...feel('neutral', T) }); }, 'SANDBOX');
    // a dial locked to "restrictive"
    if (t > tRestr - .3) { const kd = stamp(t, tRestr - .3); push(); translate(560, 780); scale(kd); paint(ellPts(0, 0, 100, 100, 40), { fill: INK.paper, ink: INK.navy, sw: 2 }); const a = Math.PI * .8; inkLine([[0, 0], [Math.cos(a) * 70, Math.sin(a) * 70]], 5, INK.orange, 'ink', 0, { force: true }); paint(ellPts(0, 0, 10, 10, 10), { fill: INK.navy }); type('RESTRICTIVE', 0, 150, 26, INK.navy); pop(); }
    camEnd();
    tIn('dots', lt, { col: 'orange', cx: 960, cy: 540 });
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- F · feedback loop; deduplication ----------
  function shotFeedback(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('feedback');
    riso({ seed: 226 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tFail = wt('feedback', 'fails'), tBack = wt('feedback', 'back'), tWall = wt('feedback', 'firewall'), tDiff = wt('feedback', 'different'), tDup = wt('feedback', 'duplicate'), tMerged = wt('feedback', 'merged'), tTen = wt('feedback', '10');
    const p1 = 1 - ease(seg(t, tDup - .5, tDup - .1));
    if (p1 > .01) {
      push(); translate(0, -600 * (1 - p1));
      // the agent, a wall (firewall), an attempt that bounces
      clawd(360, 640, 16, { ...emotions(t, [[b.start, 'determined'], [tFail, 'confused'], [tDiff, 'idea']]) });
      paint(rectPts(1150, 300, 40, 460), { fill: INK.navy });                        // the wall
      for (let i = 0; i < 6; i++) paint(rectPts(1150, 320 + i * 74, 40, 40), { fill: INK.orange, tone: .5 }); type('WALL', 1170, 800, 28, INK.navy);
      // attempt 1: straight at the wall, bounces (X)
      const a1 = seg(t, tFail - .6, tFail);
      if (a1 > 0 && t < tDiff) { const x = lerp(480, 1120, a1); paint(ellPts(x, 460, 22, 22, 14), { fill: INK.orange }); if (t > tWall - .1) stampX(1120, 440, 70, stamp(t, tWall)); }
      // a note of the failure feeds a retry loop
      if (t > tWall - .1 && t < tDiff + .3) { push(); translate(360, 380); scale(stamp(t, tWall)); paint(rrPts(-90, -60, 180, 120, 12), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); for (let i = 0; i < 3; i++) paint(rectPts(-60, -34 + i * 24, 120, 8), { fill: INK.navy, tone: .5 }); paint(rectPts(-60, 38, 90, 10), { fill: INK.orange }); pop(); }
      loopArrow(360, 560, 130, t * 1.6 + 2, INK.navy, 12);
      // attempt 2: a different path, over the top, gets through (check)
      if (t > tDiff) { const a2 = ease(seg(t, tDiff, tDiff + .8)); const p = arcPt([480, 460], [1320, 460], 360, a2); paint(ellPts(p[0], p[1], 22, 22, 14), { fill: INK.green }); if (a2 >= 1) check(1320, 440, 1.2, 1); }
      pop();
    }
    // deduplication: many finding-cards collapse into one
    if (t > tDup - .3) {
      const N = 10, kk = stamp(t, tDup - .3), merge = ease(seg(t, tMerged - .2, tTen + .3));
      // ten cards, merging into positions of 2-3 stacks
      for (let i = 0; i < N; i++) {
        const startX = 300 + (i % 5) * 300, startY = 320 + Math.floor(i / 5) * 220;
        const group = i % 2; const endX = 700 + group * 500, endY = 560;
        const x = lerp(startX, endX, merge), y = lerp(startY, endY, merge);
        card(x - 90, y - 60, 180, 120, [INK.orange, INK.gold][group], { tone: 1 - .5 * (i > 1 ? merge : 0), bar: INK.paper });
      }
      if (merge > .5) { type('10', 500, 900, 90, INK.navy, { pop: seg(t, tTen - .1, tTen + .2) }); paint(ribbon([[560, 890], [650, 890]], 12), { fill: INK.navy }); type('2', 720, 900, 90, INK.orange, { pop: seg(t, tTen, tTen + .3) }); type('REAL ISSUES', 1100, 900, 44, INK.navy, { align: 'left' }); }
    }
    camEnd();
    tIn('ink', lt, { cols: ['orange', 'federal'] });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- G · model tiers; the dashboard as human oversight ----------
  function shotOversight(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('oversight');
    riso({ seed: 227 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tModel = wt('oversight', 'model'), tCap = wt('oversight', 'capable'), tExp = wt('oversight', 'exploits'), tCheap = wt('oversight', 'cheaper'), tDash = wt('oversight', 'dashboard'), tLoop = wt('oversight', 'loop'), tReal = wt('oversight', 'real', -1);
    const p1 = 1 - ease(seg(t, tDash - .5, tDash - .1));
    // three agents sized by role
    if (p1 > .01) {
      push(); translate(0, -600 * (1 - p1));
      const k1 = stamp(t, tCap - .2);
      if (k1 > .01) { clawd(500, 620, 24 * k1, { ...feel('determined', T) }); type('EXPLOIT', 500, 720, 34, INK.navy, { pop: seg(t, tExp - .1, tExp + .2) }); }
      const k2 = stamp(t, tCheap - .3);
      if (k2 > .01) { clawd(1050, 620, 13 * k2, { ...feel('neutral', T) }); type('ANALYZE', 1050, 700, 26, INK.navy); }
      const k3 = stamp(t, tCheap - .1);
      if (k3 > .01) { clawd(1450, 620, 11 * k3, { ...feel('happy', T) }); type('REPORT', 1450, 690, 24, INK.navy); }
      pop();
    }
    // the dashboard: live rows, a human confirms, "is this real?"
    if (t > tDash - .3) {
      const kd = stamp(t, tDash - .3);
      push(); translate(760, 500); scale(kd);
      paint(rrPts(-380, -280, 760, 520, 24), { fill: INK.navy, tone: .85 });
      paint(rrPts(-380, -280, 760, 56, 20), { fill: INK.dark });
      for (let i = 0; i < 3; i++) paint(ellPts(-340 + i * 26, -252, 8, 8, 10), { fill: [INK.orange, INK.yellow, INK.green][i] });
      const rows = Math.floor(5 * ease(seg(t, tDash, tDash + 1.4)));
      for (let i = 0; i < rows; i++) { const yy = -180 + i * 78; paint(rrPts(-340, yy, 680, 60, 12), { fill: INK.paper, tone: .9 }); paint(rrPts(-320, yy + 22, 240 + 120 * hash(i), 14, 7), { fill: INK.navy, tone: .6 }); paint(rrPts(120, yy + 14, 70, 34, 8), { fill: [INK.orange, INK.gold, INK.green][i % 3] }); const conf = stamp(t, tLoop + i * .1); if (conf > .01) check(250, yy + 30, .6, conf); }
      pop();
      skipper(1560, 1040, 15, skipAct(t, [[tDash - .3, 'stand', { mood: 'focused', flip: true }], [tLoop, 'point', { mood: 'grin', flip: true }], [tReal - .1, 'think', { mood: 'thinking' }]]));
      if (t > tReal - .3) { const kq = stamp(t, tReal - .3); glow(760, 300, 240 * ease(seg(t, tReal, tReal + .4)), 'yellow', .5); push(); translate(1200, 300); scale(kq); paint(rrPts(-140, -70, 280, 140, 20), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); type('IS THIS REAL?', 0, 4, 34, INK.navy); paint([[-60, 60], [-90, 110], [-20, 66]], { fill: INK.paper }); pop(); }
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 540 });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }

  // ---------- H · it's every principle at its limit ----------
  function shotLimit(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('limit');
    riso({ seed: 228 });
    camBegin(960, 540, 1.03 - .03 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 1040, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tPrin = wt('limit', 'principle'), tLim = wt('limit', 'limit'), tSafely = wt('limit', 'safely'), tAttack = wt('limit', 'attack'), tEasier = wt('limit', 'easier'), tNext = wt('limit', 'next');
    // the pieces converge into one system
    const join = ease(seg(t, tPrin, tLim + .3));
    const pos = [[420, 340], [960, 300], [1500, 340], [420, 760], [960, 820], [1500, 760]];
    const draw = [
      () => { for (let i = 0; i < 5; i++) paint(rectPts(-60 + i * 24, -60, 14, 120, 0), { fill: INK.navy, tone: .5 }); },   // phases
      () => shield(0, 20, .8),                                                                                              // guardrails
      () => loopArrow(0, 0, 70, t * 2, INK.navy, 14),                                                                       // loop
      () => { for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) paint(rrPts(-70 + c * 50, -40 + r * 44, 40, 34, 6), { fill: INK.navy, tone: .5 }); },  // dashboard
      () => { for (let i = 0; i < 3; i++) catBadge((i - 1) * 60, 0, 1, [INK.orange, INK.gold, INK.green][i]); },            // agents
      () => fileIcon(0, 0, 1),                                                                                              // report
    ];
    for (let i = 0; i < 6; i++) { const k = stamp(t, b.start + .1 + i * .06) * (1 - join * .5); const p = [lerp(pos[i][0], 960, join), lerp(pos[i][1], 560, join)]; if (k <= .01) continue; push(); translate(...p); scale(k * lerp(1, .5, join)); paint(rrPts(-110, -110, 220, 220, 24), { fill: INK.paper, ink: INK.navy, sw: 1.4, alpha: 1 - .5 * join }); draw[i](); pop(); }
    // they become one system with a big check
    if (join > .3) { glow(960, 540, 360 * ease(seg(t, tSafely - .2, tSafely + .5)), 'yellow', .7); if (t > tAttack - .2) check(960, 540, 3.4, backOut(seg(t, tAttack - .2, tAttack + .4))); }
    if (t > tEasier - .2) type('EASIER', 960, 250, 74, INK.navy, { pop: seg(t, tEasier - .2, tEasier + .3) });
    // the cast
    skipper(330, 1040, 16, skipAct(t, [[b.start, 'stand', { mood: 'neutral' }], [tSafely, 'present', { mood: 'grin' }], [tEasier, 'hips', { mood: 'proud' }]]));
    clawd(1560, 1040, 16, { ...emotions(t, [[b.start, 'determined'], [tAttack, 'proud']]), flip: true });
    if (t > tNext - .2) { const k = stamp(t, tNext - .2); glow(960, 480, 260 * k, 'yellow', .9); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tOut('ink', lt, dur, { cols: ['orange', 'federal'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, 'B', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }
  function shotHackIn(T0, lt, dur) { shotHack(T0, lt, dur); tIn('ink', lt, { cols: ['orange', 'federal'] }); }

  const B = TIMING.beats;
  shots([
    [0, shotIdent],
    [shotAt('hack', 0), shotHackIn],
    [shotAt('phases'), shotPhases],
    [shotAt('exploit'), shotExploit],
    [shotAt('sentinel'), shotSentinel],
    [shotAt('hostile'), shotHostile],
    [shotAt('feedback'), shotFeedback],
    [shotAt('oversight'), shotOversight],
    [shotAt('limit'), shotLimit],
    [B.limit.end + .9, shotEnd],
  ]);
})();
