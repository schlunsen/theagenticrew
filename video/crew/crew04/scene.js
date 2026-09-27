// scene.js: crew04, What Is an Agent, Really? (The Crew Member's Guide, chapter 4)
// The loop is a ship's wheel: four stations stand on its rim (spyglass, chart, lever, lens) and Clawd walks on top
// while it turns. It returns at the end on the deck, with the Navigator at the handles. Storyboard:
// video/storyboards/crew04.md. Every time is keyed to a spoken word: wt('beat', 'word').
(() => {
  const NUM = '04', NEXT = '05', TITLE = 'What Is an Agent, Really?';
  const C = CREW, PI = Math.PI;
  const w = (id, word, n = 0) => wt(id, word, n);

  // ---------- small painting helpers ----------
  const bg = (key, pts, o) => { boilSeed(key); paint(pts, o); };
  const ln = (key, pts, sw, col = PAL.ink, br = 'ink', c = .5) => { boilSeed(key); inkLine(pts, sw, col, br, c); };
  const WASH = (col, o = {}) => ({ wash: col, fill: mixCol(col, PAL.ink, .12), fillOp: 45, bleed: .05, tex: .6, border: .4, ink: PAL.ink, sw: 1, ...o });
  const SOFT = (col, op = 120, o = {}) => ({ fill: col, fillOp: op, bleed: .22, tex: .6, border: .5, ink: null, ...o });
  const sc = x => clamp(x);

  // a brass key: bow ring at (0, 0), shaft along +x, teeth down. r = bow radius
  function key(x, y, r, rot = 0, col = C.ochre, k = 'key') {
    push(); translate(x, y); rotate(rot);
    boilSeed(k);
    const sw = clamp(r / 14, .5, 1.4);
    paint(ellPts(0, 0, r, r, 16), { wash: col, fill: C.ochreDk, fillOp: 50, tex: .5, ink: PAL.ink, sw });
    paint(ellPts(0, 0, r * .42, r * .42, 12), { wash: C.cream, ink: PAL.ink, sw: sw * .7 });
    paint([[r * .8, -r * .22], [r * 3.6, -r * .22], [r * 3.6, r * .22], [r * .8, r * .22]], { wash: col, ink: PAL.ink, sw });
    paint([[r * 2.7, r * .2], [r * 3.05, r * .2], [r * 3.05, r * .75], [r * 2.7, r * .75]], { wash: col, ink: PAL.ink, sw: sw * .8 });
    paint([[r * 3.2, r * .2], [r * 3.6, r * .2], [r * 3.6, r * .95], [r * 3.2, r * .95]], { wash: col, ink: PAL.ink, sw: sw * .8 });
    pop();
  }
  // a key ring hanging at Clawd's side (body space, facing right in q/side view): n keys, jingle 0..1
  function keyring(u, sw, n, jingle = 0, T0 = 0) {
    if (n <= 0) return;
    const rx = -3.6 * u, ry = -2.4 * u, r = .75 * u;
    inkLine(ellPts(rx, ry, r, r, 16).concat([[rx + r, ry]]), sw * .9, C.ochreDk, 'ink', .5);
    for (let i = 0; i < n; i++) {
      const a = PI / 2 + (i - (n - 1) / 2) * .45 + jingle * .35 * Math.sin(T0 * 22 + i * 2);
      key(rx + Math.cos(a) * r, ry + Math.sin(a) * r, .38 * u, a, i === 2 ? C.ochreLt : C.ochre, 'ringkey' + i);
    }
  }
  // soft rolling waves on a band of sea
  function waves(key, x0, x1, y0, y1, t, n = 26, col = C.pale, sp = 18) {
    for (let i = 0; i < n; i++) {
      const hy = hash(i * 3.3 + 1), x = x0 + (x1 - x0) * frac(hash(i * 7.1) + t * sp / (x1 - x0)), y = lerp(y0, y1, hy), L = 30 + 50 * hy;
      boilSeed(key + i);
      inkLine([[x - L, y + 4], [x - L * .5, y - 3], [x, y + 2], [x + L * .4, y - 2]], .6 + hy, col, 'inkfine', .6);
    }
  }
  // a planked floor from y0 down
  function planks(key, y0, col, x0 = -500, x1 = W + 500) {
    bg(key, rectPts(x0, y0, x1 - x0, 900), { wash: col, fill: mixCol(col, PAL.ink, .2), fillOp: 70, bleed: .04, tex: .8, border: .5, ink: null });
    ln(key + 'edge', [[x0, y0], [x1, y0 + 2]], 1.2, mixCol(col, PAL.ink, .5), 'ink', 0);
    for (let i = 1; i < 7; i++) { const y = y0 + i * i * 9 + i * 14; ln(key + 'pl' + i, [[x0, y], [x1, y + 3]], .5, mixCol(col, PAL.ink, .35), 'inkfine', 0); }
  }
  // a porthole / round window with a sea view
  function porthole(key, x, y, r, sky = C.pale, sea = C.sea) {
    bg(key + 'rim', ellPts(x, y, r + 16, r + 16, 30), WASH(C.ochre, { sw: 1.2 }));
    bg(key + 'sky', ellPts(x, y, r, r, 30), { wash: sky, ink: PAL.ink, sw: .8 });
    bg(key + 'sea', [[x - r * .98, y + r * .15], [x + r * .98, y + r * .15], [x + r * .7, y + r * .7], [x, y + r], [x - r * .7, y + r * .7]], { wash: sea, ink: null, curv: .4 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; bg(key + 'rv' + i, ellPts(x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8), 4, 4, 8), { wash: C.ochreDk, ink: null }); }
  }

  // ---------- the helm wheel: the loop ----------
  // Stations stand on the rim at local angles i * PI/2; handles stick out between them. ang = the wheel's rotation.
  const ST_ANG = [0, PI / 2, PI, 3 * PI / 2], HANDLE_ANG = [PI / 4, 3 * PI / 4, 5 * PI / 4, 7 * PI / 4];
  function helmWheel(cx, cy, R, ang, o = {}) {
    const k = o.key || 'helm', ghost = o.ghost || 0;
    push(); translate(cx, cy); rotate(ang);
    const wood = C.ochreDk, woodLt = mixCol(C.ochre, C.ochreDk, .4);
    // spokes (8), with handles poking out past the rim between the stations
    for (let i = 0; i < 8; i++) {
      const a = i * PI / 4, c = Math.cos(a), s = Math.sin(a), hnd = i % 2 === 1 && o.handles !== false, L = hnd ? R + R * .2 : R;
      boilSeed(k + 'spoke' + i);
      paint(ribbon([[c * R * .18, s * R * .18], [c * R * .6, s * R * .6], [c * L, s * L]], R * .06, R * .045), { wash: woodLt, fill: wood, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 });
      if (hnd) paint(ellPts(c * (L + R * .02), s * (L + R * .02), R * .05, R * .05, 12), { wash: C.ochre, ink: PAL.ink, sw: .9 });
    }
    // the rim: sixteen felloes
    for (let i = 0; i < 16; i++) {
      const a0 = i / 16 * TAU, a1 = (i + 1) / 16 * TAU, r0 = R * .9, r1 = R * 1.04, P = [];
      for (let j = 0; j <= 4; j++) { const a = lerp(a0, a1, j / 4); P.push([Math.cos(a) * r1, Math.sin(a) * r1]); }
      for (let j = 4; j >= 0; j--) { const a = lerp(a0, a1, j / 4); P.push([Math.cos(a) * r0, Math.sin(a) * r0]); }
      boilSeed(k + 'rim' + i);
      paint(P, { wash: i % 2 ? woodLt : mixCol(woodLt, C.ochre, .3), fill: wood, fillOp: 55, tex: .7, border: .4, ink: PAL.ink, sw: 1 });
    }
    // hub: a small compass rose (the series' motif)
    boilSeed(k + 'hub');
    paint(ellPts(0, 0, R * .22, R * .22, 24), { wash: C.deep, ink: PAL.ink, sw: 1.2 });
    pop();
    compassRose(cx, cy, R * .18, { assemble: 1, rot: ang, glow: o.hubGlow || 0, key: k + 'rose', swMul: .8 });
    if (ghost > .02) for (let g = 0; g < 6; g++) {   // speed: streaks trailing round the rim
      const a0 = ang + g * TAU / 6, P = [];
      for (let j = 0; j <= 10; j++) { const a = a0 + j / 10 * .8 * ghost; P.push([cx + Math.cos(a) * R * (1.3 + .04 * (g % 2)), cy + Math.sin(a) * R * (1.3 + .04 * (g % 2))]); }
      boilSeed(k + 'ghost' + g); inkLine(P, 2.2 * ghost, mixCol(C.ochre, C.cream, .2), 'ink', .5);
    }
  }
  // stations, drawn in local space (base at 0, up = -y), size ~ 1 = 100 px
  function station(i, s, act, o = {}) {
    const k = 'st' + i + (o.key || ''), sw = clamp(s, .6, 1.2);
    const P = pts => pts.map(([a, b]) => [a * 100 * s, b * 100 * s]);
    boilSeed(k);
    if (i === 0) {   // observe: a brass spyglass on a tripod, eyepiece toward the top-left
      inkLine(P([[0, 0], [0, -.55]]), 2 * sw, C.ochreDk, 'ink', 0);
      inkLine(P([[-.28, 0], [0, -.55], [.28, 0]]), 1.6 * sw, C.ochreDk, 'ink', 0);
      push(); translate(0, -.62 * 100 * s); rotate(-.18);
      paint(P([[-.5, -.1], [.2, -.12], [.2, .12], [-.5, .1]]), { wash: C.ochreDk, ink: PAL.ink, sw });
      paint(P([[.15, -.15], [.62, -.18], [.62, .18], [.15, .15]]), { wash: C.ochre, fill: C.ochreLt, fillOp: 60, tex: .5, ink: PAL.ink, sw });
      paint(ellPts(.62 * 100 * s, 0, .05 * 100 * s, .18 * 100 * s, 12), { wash: C.pale, ink: PAL.ink, sw: sw * .7 });
      pop();
      if (act > 0) glow(.55 * 100 * s, -.72 * 100 * s, 60 * s * (1 + act), C.cream, .6 * act);
    } else if (i === 1) {   // plan: a chart on an easel; a route draws across it as he plans
      inkLine(P([[-.25, 0], [-.05, -.9]]), 1.6 * sw, C.ochreDk, 'ink', 0);
      inkLine(P([[.25, 0], [.05, -.9]]), 1.6 * sw, C.ochreDk, 'ink', 0);
      paint(P([[-.42, -.95], [.42, -.95], [.4, -.35], [-.4, -.35]]), { wash: C.cream, fill: C.ochreLt, fillOp: 50, tex: .6, ink: PAL.ink, sw });
      paint(blobPts(.1 * 100 * s, -.7 * 100 * s, 14 * s, 3, .25, 14), { fill: C.sea, fillOp: 110, bleed: .1, tex: .4, ink: null });
      if (act > 0) { const pts = []; for (let j = 0; j <= 10 * act; j++) pts.push([lerp(-.32, .3, j / 10) * 100 * s, (-.45 - .35 * Math.sin(j / 10 * PI) + .05 * Math.sin(j * 1.3)) * 100 * s]); if (pts.length > 1) inkLine(pts, 1.6 * sw, C.rose, 'ink', .5); }
    } else if (i === 2) {   // act: a lever on a box; act 0..1 pulls it over and sparks fly
      paint(P([[-.3, 0], [.3, 0], [.28, -.3], [-.28, -.3]]), WASH(C.teal, { sw }));
      push(); translate(0, -.3 * 100 * s); rotate(lerp(-.55, .55, ease(act)));
      paint(P([[-.04, 0], [.04, 0], [.04, -.62], [-.04, -.62]]), { wash: C.cream, ink: PAL.ink, sw });
      paint(ellPts(0, -.66 * 100 * s, .1 * 100 * s, .1 * 100 * s, 12), { wash: C.rose, ink: PAL.ink, sw });
      pop();
      if (o.spark > 0) for (let j = 0; j < 6; j++) { const a = -PI / 2 + (j - 2.5) * .45, d = (.4 + .5 * o.spark) * 100 * s; paint(starPts(Math.cos(a) * d, -.35 * 100 * s + Math.sin(a) * d, 12 * s * (1 - o.spark), .4, 4), { wash: C.ochreLt, ink: PAL.ink, sw: sw * .5 }); }
    } else {   // check: a big lens on a stand; o.x 0..1 blooms a rose cross in it, o.ok a sap tick
      inkLine(P([[0, 0], [0, -.45]]), 2.2 * sw, C.ochreDk, 'ink', 0);
      paint(P([[-.2, 0], [.2, 0], [.14, -.06], [-.14, -.06]]), { wash: C.ochreDk, ink: PAL.ink, sw });
      paint(ellPts(0, -.78 * 100 * s, .36 * 100 * s, .36 * 100 * s, 24), { wash: C.ochre, ink: PAL.ink, sw: sw * 1.2 });
      paint(ellPts(0, -.78 * 100 * s, .28 * 100 * s, .28 * 100 * s, 24), { wash: mixCol(C.pale, C.cream, .4), fill: C.sea, fillOp: 40, tex: .4, ink: PAL.ink, sw: sw * .6 });
      if (o.x > 0) { const q = backOut(o.x) * .16; inkLine(P([[-q, -.78 - q], [q, -.78 + q]]), 4 * sw, C.rose, 'ink', 0); inkLine(P([[q, -.78 - q], [-q, -.78 + q]]), 4 * sw, C.rose, 'ink', 0); }
      if (o.ok > 0) { const q = backOut(o.ok); inkLine(P([[-.14 * q, -.78], [-.04 * q, -.68], [.16 * q, -.92]]), 4 * sw, C.sap, 'ink', .2); }
    }
  }
  // Clawd's hop over whatever passes the top of the wheel: height (px) from the obstacles' angles (world, with ang)
  function rimHop(ang, u, stH = 1, hdH = .5, sw0 = .56) {
    let h = 0;
    const off = a => { let d = (a + ang + PI / 2) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };
    for (const a of ST_ANG) { const d = off(a), wd = sw0; if (Math.abs(d) < wd) h = Math.max(h, stH * Math.sqrt(1 - (d / wd) ** 2)); }
    for (const a of HANDLE_ANG) { const d = off(a), wd = .34; if (Math.abs(d) < wd) h = Math.max(h, hdH * Math.sqrt(1 - (d / wd) ** 2)); }
    return h * 10 * u;
  }
  function drawStations(cx, cy, R, ang, acts, o = {}) {
    for (let i = 0; i < 4; i++) {
      const a = ST_ANG[i] + ang, r = R * 1.04;
      push(); translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); rotate(a + PI / 2);
      station(i, o.s || 1, acts[i] || 0, { ...(o.extra && o.extra[i] || {}), key: o.key || '' });
      pop();
    }
  }

  // ---------- ident ----------
  function identShot(t, lt, dur) { crewIdent(t, lt, dur, NUM, TITLE); }

  // ---------- A: hook. Tiny agents on the kitchen table ----------
  const TABLE = 860;
  function kitchen(t, lt, dur) {
    const tDidnt = w('hook', "didn't"), tFilter = w('hook', 'filter'), tNews = w('hook', 'newsletter'), tInbox = w('hook', 'inbox');
    const tTraffic = w('hook', 'traffic'), tLeave = w('hook', 'leave'), tPlay = w('hook', 'playlist'), tTaste = w('hook', 'taste');
    const tWatch = w('hook', 'watches'), tDecide = w('hook', 'decide'), tActs = w('hook', 'acts');
    const XP = 640, XT = 1100, XR = 1500;   // phone, tray, radio
    const cam = kf(t, [[4.85, [860, 640, 1.08]], [tDidnt - .6, [900, 660, 1.15]], [tDidnt, [1100, 760, 1.75]], [tFilter + .2, [1150, 750, 1.7]],
      [tTraffic - .7, [1170, 740, 1.6]], [tTraffic - .1, [560, 700, 1.35]], [tPlay - .6, [600, 700, 1.35]], [tPlay, [1420, 740, 1.6]],
      [tTaste + .3, [1400, 740, 1.55]], [tWatch - .5, [920, 740, 1.2]], [tActs + .6, [930, 745, 1.25]]]);
    camBegin(cam[0] + 8 * Math.sin(lt * .5), cam[1], cam[2] + .004 * lt);
    // wall, window with the morning sea, a shelf
    bg('kwall', rectPts(-400, -300, W + 800, 1400), { wash: mixCol(C.cream, C.ochreLt, .25), fill: C.ochreLt, fillOp: 50, bleed: .25, tex: .6, border: .4, ink: null });
    bg('kwin', rrPts(1180, 160, 520, 340, 30), WASH(C.cream, { sw: 1.4 }));
    bg('kwsky', rrPts(1200, 180, 480, 300, 20), { wash: mixCol(C.pale, C.cream, .4), fill: C.ochreLt, fillOp: 50, bleed: .2, tex: .4, ink: null });
    bg('kwsea', rectPts(1200, 360, 480, 120), { wash: C.sea, fill: C.teal, fillOp: 50, bleed: .08, tex: .6, ink: null });
    boilSeed('ksun'); glow(1560, 300, 140, C.ochreLt, .8); bg('ksund', ellPts(1560, 300, 34, 34, 18), { wash: C.ochreLt, ink: null });
    ln('kwbar', [[1440, 180], [1440, 480]], 3, C.ochreDk, 'ink', 0); ln('kwbar2', [[1200, 330], [1680, 330]], 3, C.ochreDk, 'ink', 0);
    waves('kwv', 1210, 1670, 380, 470, t, 7, C.pale, 12);
    bg('kshelf', rectPts(200, 330, 560, 18), WASH(C.ochreDk));
    [[260, C.rose], [330, C.sap], [400, C.sea], [470, C.ochre]].forEach(([x, c], i) => bg('kjar' + i, rrPts(x, 250, 50, 80, 10), WASH(c, { sw: .9 })));
    // the Navigator at the table with her mug
    const nm = navMood(t, [[4.85, 'neutral'], [tDidnt - .2, 'neutral', { lookX: .3 }], [tLeave, 'surprised'], [tPlay + .4, 'happy'], [tWatch - .3, 'neutral', { lookX: .6 }]]);
    const jolt = take(t, tLeave + .05, 1.2);
    bg('kchair', rrPts(170, 880, 230, 140, 14), WASH(C.teal));
    nav(330, 1010, 28, { ...nm, view: 'q', sit: true, noShadow: true, sq: (nm.sq || 0) + jolt.sq * .6, dy: (nm.dy || 0) + jolt.dy * .5, aL: lerp(-.25, .35, seg(t, tLeave, tLeave + .2)) - .2 * Math.sin(lt * .8) * .2, handL: (s, sw, up) => navProp('mug', s, sw, { up, steam: .8 }), boilKey: 'kn' });
    // the table
    bg('ktable', rectPts(500, TABLE, 1500, 34, 2), WASH(mixCol(C.ochre, C.ochreDk, .35), { sw: 1.3 }));
    bg('ktfront', rectPts(510, TABLE + 34, 1480, 60), { wash: mixCol(C.ochreDk, PAL.ink, .15), fill: C.ochreDk, fillOp: 60, tex: .7, ink: PAL.ink, sw: 1 });
    bg('ktleg1', rectPts(560, TABLE + 94, 40, 300), WASH(C.ochreDk)); bg('ktleg2', rectPts(1900, TABLE + 94, 40, 300), WASH(C.ochreDk));
    bg('kfloor', rectPts(-400, 1010, W + 800, 400), { wash: mixCol(C.ochreDk, C.cream, .3), ink: null });
    // --- the phone, flat on the table, and its tiny agent with a red flag
    const ph = seg(t, tTraffic - .15, tTraffic + .05);
    bg('kphone', rrPts(XP - 70, TABLE - 16, 140, 16, 5), { wash: '#2A3036', ink: PAL.ink, sw: .9 });
    const pop2 = backOut(seg(t, tTraffic, tTraffic + .35));
    if (ph > 0) { boilSeed('kphg'); glow(XP, TABLE - 20, 110 * ph, C.sea, .9 * ph * (1 - .5 * seg(t, tPlay, tPlay + 1))); }
    const u0 = 10;
    // tray agent: peeks up behind the tray on "didn't", then climbs out with the envelope
    const peek = seg(t, tDidnt, tDidnt + .25) * (1 - seg(t, tDidnt + .9, tDidnt + 1.1));
    const out1 = seg(t, tFilter - .2, tFilter + .2);
    const walkK = seg(t, tNews - .1, tInbox);
    let tx = XT - 20, ty = TABLE - 50, tdy = 0;
    if (t < tFilter - .2) { ty = lerp(TABLE + 5, TABLE - 42, peek); }
    else { const j = jump(t, tFilter - .2, tFilter + .15, 5); tx = lerp(XT - 20, XT + 60, out1); ty = lerp(TABLE - 42, TABLE, easeIn(out1)); tdy = j.dy; if (walkK > 0) tx = lerp(XT + 60, XT + 150, ease(walkK)); }
    const toss = seg(t, tInbox, tInbox + .45);
    const T1 = emotions(t, [[0, 'neutral', { lookX: -.8 }], [tFilter, 'determined'], [tInbox + .4, 'proud'], [tWatch, 'neutral'], [tDecide - .1, 'idea'], [tActs - .1, 'happy']]);
    const lookSeq = t > tWatch && t < tDecide - .2 ? { lookX: Math.sin((t - tWatch) * 7), eyes: 'look' } : {};
    const hop1 = jump(t, tActs, tActs + .4, 3);
    // the envelope rides overhead, then is tossed into the bin
    const env = t > tFilter - .2 && toss < 1;
    const drawT1 = () => clawd(tx, ty, u0, { ...T1, ...lookSeq, view: t > tFilter && t < tInbox + .2 ? 'q' : 'front', walk: walkK > 0 && walkK < 1 ? walkK * 4 : undefined,
        aL: env && toss === 0 ? 1.3 : T1.aL, aR: env && toss === 0 ? 1.3 : T1.aR, dy: (T1.dy || 0) + tdy / u0 + hop1.dy, sq: (T1.sq || 0) + hop1.sq, noShadow: t < tFilter, boilKey: 'kt1' });
    if (t < tFilter - .2 && peek > 0) drawT1();
    // --- the letter tray and its tiny agent (hides, peeks, hauls the newsletter out and drops it in the bin)
    bg('ktray', [[XT - 90, TABLE - 50], [XT + 90, TABLE - 50], [XT + 80, TABLE], [XT - 80, TABLE]], WASH(C.teal, { sw: 1 }));
    for (let i = 0; i < 3; i++) bg('kletter' + i, rectPts(XT - 70 + i * 12, TABLE - 74 + i * 6, 130, 40, 1), { wash: i === 1 ? C.pale : C.cream, ink: PAL.ink, sw: .7 });
    bg('kbin', [[XT + 200, TABLE - 70], [XT + 300, TABLE - 70], [XT + 285, TABLE], [XT + 215, TABLE]], WASH(C.sap, { sw: 1 }));
    // --- the radio
    bg('kradio', rrPts(XR - 90, TABLE - 110, 180, 110, 16), WASH(C.rose, { sw: 1.1 }));
    bg('kgrill', ellPts(XR - 30, TABLE - 55, 32, 32, 18), { wash: mixCol(C.rose, PAL.ink, .35), ink: PAL.ink, sw: .7 });
    bg('kdial', ellPts(XR + 45, TABLE - 55, 14, 14, 12), WASH(C.cream, { sw: .7 }));
    ln('kant', [[XR + 50, TABLE - 110], [XR + 95, TABLE - 190]], 1.2);
    if (t >= tFilter - .2) drawT1();
    // the tray's front lip hides the tray agent while it's inside
    bg('ktraylip', [[XT - 92, TABLE - 34], [XT + 92, TABLE - 34], [XT + 80, TABLE], [XT - 80, TABLE]], WASH(C.teal, { sw: 1 }));
    if (env) {
      const hand = [tx, ty + tdy + (T1.dy || 0) * u0 - 10.6 * u0];
      const p = toss > 0 ? arcPt(hand, [XT + 250, TABLE - 60], 60, easeIn(toss)) : hand;
      boilSeed('kenv');
      push(); translate(p[0], p[1]); rotate(toss * 2.2);
      paint(rectPts(-28, -18, 56, 36, 1), { wash: C.cream, fill: C.pale, fillOp: 60, ink: PAL.ink, sw: .8 });
      inkLine([[-28, -18], [0, 2], [28, -18]], .7); paint(rectPts(-28, 6, 56, 6), { wash: C.rose, ink: null });
      pop();
    }
    if (toss > .9) { boilSeed('kenvbin'); paint(rectPts(XT + 220, TABLE - 84, 56, 20, 1), { wash: C.cream, ink: PAL.ink, sw: .7 }); }
    bg('kbinlip', [[XT + 203, TABLE - 52], [XT + 297, TABLE - 52], [XT + 285, TABLE], [XT + 215, TABLE]], WASH(C.sap, { sw: 1 }));
    // phone agent: pops up behind the phone waving a red flag
    if (pop2 > 0) {
      const T2 = emotions(t, [[0, 'excited'], [tPlay + .5, 'neutral'], [tDecide - .05, 'idea'], [tActs, 'happy']]);
      const wave = t < tPlay ? .9 + .5 * Math.sin((t - tTraffic) * 14) : .3;
      const lookSeq2 = t > tWatch + .15 && t < tDecide - .2 ? { lookX: Math.sin((t - tWatch) * 7 + 1), eyes: 'look' } : {};
      const hop2 = jump(t, tActs + .15, tActs + .55, 3);
      clawd(XP + 10, TABLE - 16 + 40 * (1 - pop2), u0 * pop2, { ...T2, ...lookSeq2, emote: t < tPlay ? '!' : T2.emote, emoteK: t < tPlay ? seg(t, tTraffic + .2, tTraffic + .4) : T2.emoteK,
        aR: wave, dy: (T2.dy || 0) * .5 + hop2.dy, sq: (T2.sq || 0) + hop2.sq, noShadow: true, boilKey: 'kt2',
        armR: (u, sw) => { inkLine([[0, 0], [0, -5 * u]], sw * 1.2, C.ochreDk, 'ink', 0); paint([[0, -5 * u], [3.2 * u + u * .4 * Math.sin(T * 12), -4.4 * u], [0, -3.4 * u]], { wash: C.rose, fill: mixCol(C.rose, PAL.ink, .2), fillOp: 60, ink: PAL.ink, sw: sw * .7 }); } });
    }
    // radio agent: bops on the radio, notes rising
    const pop3 = backOut(seg(t, tPlay - .1, tPlay + .3));
    if (pop3 > 0) {
      const dnc = t < tWatch - .3 ? move('bounce', t) : {};
      const T3 = emotions(t, [[0, 'happy', { emote: 'music' }], [tWatch - .3, 'neutral'], [tDecide + .05, 'idea'], [tActs, 'happy']]);
      const lookSeq3 = t > tWatch + .3 && t < tDecide - .2 ? { lookX: Math.sin((t - tWatch) * 7 + 2), eyes: 'look' } : {};
      const hop3 = jump(t, tActs + .3, tActs + .7, 3);
      clawd(XR, TABLE - 110 + 40 * (1 - pop3), u0 * pop3, { ...T3, ...dnc, ...lookSeq3, dy: (dnc.dy || T3.dy || 0) + hop3.dy, sq: (T3.sq || 0) + hop3.sq, noShadow: true, boilKey: 'kt3' });
      for (let i = 0; i < 4; i++) { const p = frac((t - tPlay) * .5 + i * .25); if (t < tPlay || t > tWatch) continue; emote('music', XR + 60 + 40 * Math.sin(p * 6 + i), TABLE - 150 - p * 180, 14, 1 - p, t); }
    }
    const at = toScreen(XT + 150, TABLE - 40);
    camEnd();
    seamIn('wipe', lt);
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1], col: C.night });
  }

  // ---------- B: bigger. The tiny agent grows; many things in a row ----------
  function chartRoom(key, t, o = {}) {
    bg(key + 'wall', rectPts(-500, -400, W + 1000, 1500), { wash: mixCol(C.cream, C.ochreLt, .35), fill: C.ochreLt, fillOp: 55, bleed: .25, tex: .7, border: .5, ink: null });
    bg(key + 'wain', rectPts(-500, 640, W + 1000, 330), { wash: mixCol(C.teal, C.sea, .35), fill: C.teal, fillOp: 70, bleed: .06, tex: .7, border: .4, ink: null });
    ln(key + 'rail', [[-500, 640], [W + 500, 642]], 3, C.ochreDk, 'ink', 0);
    for (let i = 0; i < 14; i++) ln(key + 'wp' + i, [[-400 + i * 200, 650], [-400 + i * 200, 960]], .5, mixCol(C.teal, PAL.ink, .3), 'inkfine', 0);
    if (o.port !== false) { porthole(key + 'p1', o.p1 ?? 300, 330, 90); porthole(key + 'p2', o.p2 ?? 1650, 330, 90); }
    planks(key + 'floor', 960, mixCol(C.ochreDk, C.ochre, .35));
  }
  const CARDS = [700, 960, 1220, 1480, 1740];
  function card(i, x, y, flip, face, from = 0) {   // face 0 blank, 1 tick, 2 cross; flip 0..1 turns it over from `from` to `face`
    const sxk = Math.abs(Math.cos(flip * PI)), shown = flip < .5 ? from : face;
    boilSeed('card' + i);
    push(); translate(x, y); scale(Math.max(.04, sxk), 1);
    paint(rrPts(-75, -200, 150, 200, 12), WASH(shown === 1 ? mixCol(C.sap, C.cream, .25) : shown === 2 ? mixCol(C.rose, C.cream, .15) : C.cream, { sw: 1.2 }));
    if (shown === 0) for (let j = 0; j < 3; j++) inkLine([[-45, -150 + j * 40], [45, -150 + j * 40]], .6, mixCol(C.cream, PAL.ink, .3), 'inkfine', 0);
    else if (shown === 1) inkLine([[-40, -100], [-10, -65], [45, -140]], 5, mixCol(C.sap, PAL.ink, .35), 'ink', .2);
    else { inkLine([[-35, -135], [35, -65]], 5, mixCol(C.rose, PAL.ink, .3), 'ink', 0); inkLine([[35, -135], [-35, -65]], 5, mixCol(C.rose, PAL.ink, .3), 'ink', 0); }
    pop();
  }
  function bigger(t, lt, dur) {
    const tBig = w('bigger', 'bigger'), tOne = w('bigger', 'one'), tMany = w('bigger', 'many'), tRow = w('bigger', 'row'), tAdapt = w('bigger', 'adapting'), tGo = w('bigger', 'go');
    // the taps: card 0 on "one", 1–3 through "many things in a row" (3 flips rose), a re-flip on "adapting", then card 4
    const taps = [tOne + .15, tMany + .05, tMany + .55, tRow + .05, tAdapt + .35, tGo + .1];
    const xs = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[3], CARDS[4]].map(x => x - 130);
    const grow = backOut(seg(t, tBig - .15, tBig + .35)), u = lerp(6, 21, grow);
    // position: hops from card to card, arriving .12 s before each tap
    let cx = 380; const hops = [];
    for (let i = 0; i < taps.length; i++) {
      const a = (i === 0 ? tOne - .4 : taps[i - 1] + .08), b = taps[i] - .08, x0 = i === 0 ? 380 : xs[i - 1], x1 = xs[i];
      if (t >= a) cx = lerp(x0, x1, ease(seg(t, a, b)));
      if (x1 !== x0) hops.push(jump(t, a, b, 2.2));
    }
    const hop = hops.reduce((s, h) => ({ dy: s.dy + h.dy, sq: s.sq + h.sq }), { dy: 0, sq: 0 });
    const cam = kf(t, [[20.77, [450, 820, 2.2]], [tBig - .2, [450, 800, 2.0]], [tBig + .5, [620, 700, 1.3]], [tOne + .3, [760, 700, 1.25]], [tMany, [900, 690, 1.2]], [tGo, [1340, 690, 1.2]], [tGo + 1, [1420, 690, 1.24]]]);
    camBegin(cam[0], cam[1], cam[2]);
    chartRoom('cr', t, { p1: 320, p2: 1500 });
    // the bench and the cards
    bg('bench', rectPts(520, 760, 1400, 26), WASH(C.ochreDk)); bg('benchl', rectPts(560, 786, 30, 174), WASH(C.ochreDk)); bg('benchr', rectPts(1850, 786, 30, 174), WASH(C.ochreDk));
    const faces = [1, 1, 1, 2, 1];
    CARDS.forEach((x, i) => {
      const tp = i < 3 ? taps[i] : i === 3 ? taps[3] : taps[5], f = seg(t, tp, tp + .3);
      if (i === 3 && t > taps[4]) card(i, x, 760, seg(t, taps[4], taps[4] + .3), 1, 2);
      else card(i, x, 760, f, faces[i], 0);
    });
    // Clawd
    const moodK = [[0, 'neutral', { lookY: -.3 }], [tBig + .05, 'surprised'], [tOne - .5, 'determined'], [tRow + .25, 'confused'], [tAdapt + .2, 'determined'], [tGo + .3, 'happy']];
    const M = emotions(t, moodK);
    const tapping = taps.some(tp => t > tp - .1 && t < tp + .25);
    const back = t > tRow + .2 && t < tAdapt + .5;
    clawd(cx, 930, u, { ...M, view: t > tOne - .5 ? 'q' : 'front', flip: back && t > tRow + .45 && t < tAdapt + .3, dy: (M.dy || 0) + hop.dy, sq: (M.sq || 0) + hop.sq,
      aR: tapping ? 1.4 : M.aR, boilKey: 'bc' });
    const at = toScreen(cx, 930 - 4 * u);
    camEnd();
    seamIn('iris', lt, { cx: at[0], cy: at[1], col: C.night });
    seamOut('page', lt, dur, { col: C.cream });
  }

  // ---------- C: the loop. The helm wheel ----------
  const HX = 1060, HY = 560, HR = 250;
  function loopShot(t, lt, dur) {
    const tLoop = w('loop', 'loop'), tObs = w('loop', 'observe'), tPlan = w('loop', 'plan'), tAct = w('loop', 'act'), tDo = w('loop', 'do', 1), tCheck = w('loop', 'check');
    const tWork = w('loop', 'work'), tNot = w('loop', 'not'), tRound = w('loop', 'round'), tLearn = w('loop', 'learned'), tSimple = w('loop', 'simple'), tOnce = w('loop', 'once');
    const tPow = w('loop', 'powerful'), tDoz = w('loop', 'dozens');
    const base = -PI / 2 + .62;   // station 0 just right of the top
    const q = PI / 2;
    const steps = [[tPlan - .8, tPlan - .08], [tAct - .75, tAct - .08], [tCheck - .75, tCheck - .08], [tRound - .05, tRound + .75]];
    let ang = base; steps.forEach(([a, b]) => { ang -= q * ease(seg(t, a, b)); });
    // the spin: accelerates from "powerful" through "dozens"
    const s0 = tPow - .2, sp = Math.max(0, t - s0), ramp = 1.4, wmax = 7 * TAU / 4;
    const spin = sp < ramp ? .5 * wmax / ramp * sp * sp : .5 * wmax * ramp + wmax * (sp - ramp);
    ang -= spin;
    const revs = spin / TAU, speed = sp <= 0 ? 0 : clamp(sp / ramp);
    // camera: wide, then in on the stations, out to the small wheel, back for the spin
    const cam = kf(t, [[29.04, [960, 560, .98]], [tLoop, [980, 540, 1.02]], [tObs - .3, [1100, 315, 1.5]], [tCheck + .3, [1080, 325, 1.5]],
      [tNot, [900, 470, 1.15]], [tRound + .8, [1000, 400, 1.3]], [tSimple - .4, [1080, 420, 1.25]], [tSimple + .1, [1280, 560, .98]], [tPow - .4, [1280, 560, .98]], [tPow + .4, [1180, 500, 1.02]]]);
    const sh = shakeXY(t, 5 * speed);
    camBegin(cam[0] + sh[0], cam[1] + sh[1], cam[2] + .01 * Math.sin(lt * .6));
    chartRoom('lr', t, { p1: 260, p2: 2300 });
    // tally marks on the wall: laps
    const laps = Math.floor(revs * 3);
    for (let i = 0; i < Math.min(30, laps); i++) {
      const g = Math.floor(i / 5), j = i % 5, gx = 1470 + (g % 3) * 130, gy = 180 + Math.floor(g / 3) * 140;
      if (j < 4) ln('tally' + i, [[gx + j * 26, gy], [gx + j * 26 + 3, gy + 95]], 2.2, PAL.ink, 'ink', 0);
      else ln('tally' + i, [[gx - 14, gy + 80], [gx + 96, gy + 14]], 2.6, C.rose, 'ink', 0);
    }
    // the pedestal
    bg('ped', [[HX - 60, HY + 40], [HX + 60, HY + 40], [HX + 110, 965], [HX - 110, 965]], WASH(mixCol(C.ochreDk, C.ochre, .3), { sw: 1.3 }));
    bg('pedcap', rrPts(HX - 140, 940, 280, 36, 8), WASH(C.ochreDk));
    // the arrows of the loop, painted round the wheel on "loop"
    const ak = ease(seg(t, tLoop - .1, tLoop + .7));
    for (let i = 0; i < 2; i++) {
      if (ak <= 0) break;
      const a0 = -PI * .15 + i * PI, a1 = a0 + PI * .7 * ak, P = [], rr = HR * 1.55;
      for (let j = 0; j <= 20; j++) { const a = lerp(a0, a1, j / 20); P.push([HX + Math.cos(a) * rr, HY + Math.sin(a) * rr]); }
      ln('arrow' + i, P, 5, C.ochre, 'ink', .5);
      const e = P[P.length - 1], d = [Math.cos(a1 + PI / 2), Math.sin(a1 + PI / 2)], nx = [-d[1], d[0]];
      if (ak > .3) bg('arrowh' + i, [[e[0] + d[0] * 26, e[1] + d[1] * 26], [e[0] + nx[0] * 16, e[1] + nx[1] * 16], [e[0] - nx[0] * 16, e[1] - nx[1] * 16]], { wash: C.ochre, ink: PAL.ink, sw: 1 });
    }
    helmWheel(HX, HY, HR, ang, { key: 'lh', ghost: speed, hubGlow: .3 });
    // station actions
    const aObs = seg(t, tObs, tObs + .3) * (1 - seg(t, tPlan - .9, tPlan - .6));
    const aPlan = seg(t, tPlan + .1, tPlan + 1.3);
    const aAct = ease(seg(t, tDo - .05, tDo + .15)) * (1 - seg(t, tCheck - .9, tCheck - .5)) + ease(seg(t, tRound + .5, tRound + 1)) * 0;
    const spark = seg(t, tDo + .1, tDo + .6);
    const xk = seg(t, tNot - .05, tNot + .3) * (1 - seg(t, tRound - .2, tRound + .2));
    drawStations(HX, HY, HR, ang, [aObs, aPlan > 0 && t < tRound + 1 ? aPlan : 0, aAct, 0], { s: 1.2, extra: [{}, {}, { spark: spark > 0 && spark < 1 ? spark : 0 }, { x: xk }] });
    // Clawd on the rim
    const u = 12.5, top = HY - HR * 1.04;
    const hopH = speed > .3 ? lerp(rimHop(ang, u, 1.2), 10.5 * u, seg(speed, .3, .6)) : rimHop(ang, u, 1.2);
    const walkPh = (base - ang) * HR * 1.04 / (4 * u);
    const moving = steps.some(([a, b]) => t > a && t < b) || speed > 0;
    const M = emotions(t, [[0, 'neutral'], [tObs, 'neutral', { eyes: 'wide', lookX: 1 }], [tPlan + .1, 'thinking'], [tPlan + 1.2, 'idea'], [tAct, 'determined'],
      [tCheck + .1, 'neutral', { lookX: .9, eyes: 'look' }], [tNot + .05, 'confused'], [tRound, 'determined'], [tLearn, 'idea'], [tSimple, 'neutral', { lookX: .8 }], [tPow, 'determined'], [tDoz + .3, 'excited']]);
    const running = speed > .3;
    const lookTop = M.eyes === 'wide' ? { lookY: .3 } : {};
    clawd(HX, top, u, { ...M, ...lookTop, view: moving || t > tObs - .2 ? 'side' : 'q', walk: moving ? walkPh * (running ? 1 : 1) : undefined,
      dy: (M.dy || 0) * (running ? .3 : 1) - hopH / u, aL: t > tDo - .2 && t < tDo + .4 ? .2 : running ? .3 + .5 * Math.sin(t * 30) : M.aL,
      smear: running ? .5 * speed : 0, smearDir: -1, noShadow: hopH > 2, boilKey: 'lc' });
    // the Navigator watches from the left, chart in her far hand; points on "check"; the wind of the spin blows her hair
    const nm = navMood(t, [[0, 'neutral', { lookX: .5 }], [tPlan + .3, 'thinking'], [tCheck, 'neutral', { lookX: .6 }], [tNot, 'stern'], [tLearn, 'happy'], [tPow + .2, 'surprised']]);
    const pointing = t > tNot - .1 && t < tRound + .2;
    nav(520, 965, 21, { ...nm, view: 'q', point: pointing ? 'R' : undefined, aR: pointing ? .35 : -.25, aL: pointing ? -1.2 : nm.aL,
      handR: pointing ? undefined : (s, sw, up) => navProp('chart', s, sw, { up, open: .9 }), wind: speed * .9, boilKey: 'ln' });
    // the small wheel: a simple agent goes round once
    const sk = backOut(seg(t, tSimple - .2, tSimple + .2));
    if (sk > .02) {
      const sx = 1680, sy = 820, sr = 95 * sk, sa = -PI * 2 * ease(seg(t, tSimple + .35, tOnce + .2));
      bg('sped', [[sx - 22 * sk, sy], [sx + 22 * sk, sy], [sx + 44 * sk, 965], [sx - 44 * sk, 965]], WASH(C.ochreDk));
      helmWheel(sx, sy, sr, sa, { key: 'sh', handles: false });
      const sm = emotions(t, [[0, 'neutral'], [tOnce + .3, 'proud']]);
      clawd(sx, sy - sr * 1.04, 6 * sk, { ...sm, view: t < tOnce + .2 ? 'side' : 'front', walk: t > tSimple + .35 && t < tOnce + .2 ? -sa * sr / 24 : undefined, noShadow: true, boilKey: 'ls' });
    }
    const at = toScreen(HX, HY);
    camEnd();
    seamIn('page', lt, { col: C.cream });
    seamOut('splash', lt, dur, SPLASH1);
  }
  const SPLASH1 = { cx: 1000, cy: 480, seed: 3, cols: [C.sea, C.ochre, C.teal] };
  const SPLASH2 = { cx: 960, cy: 560, seed: 7, cols: [C.ochreLt, C.rose, C.sea] };

  // ---------- D: tools. An empty desk; the Navigator hands over keys one by one ----------
  function office(t, lt, dur) {
    const tTools = w('tools', 'tools'), tPic = w('tools', 'picture'), tEmpty = w('tools', 'empty'), tClever = w('tools', 'clever'), tStuck = w('tools', 'stuck');
    const tGive = w('tools', 'give'), tLogin = w('tools', 'login'), tTrack = w('tools', 'track'), tKey1 = w('tools', 'key', 0), tProj = w('tools', 'project'), tChange = w('tools', 'change');
    const tKey2 = w('tools', 'key', 1), tLaunch = w('tools', 'launch'), tShip = w('tools', 'ship'), tAccess = w('tools', 'access'), tDecide = w('tools', 'decide'), tKeys = w('tools', 'keys'), tHand = w('tools', 'hand');
    const cam = kf(t, [[48.06, [980, 620, 1.12]], [tPic, [1000, 650, 1.25]], [tEmpty, [960, 690, 1.35]], [tGive - .6, [880, 660, 1.2]], [tKey2, [960, 640, 1.18]],
      [tLaunch + .1, [1250, 470, 1.35]], [tShip + .9, [1280, 470, 1.35]], [tAccess, [930, 660, 1.25]], [tDecide, [800, 660, 1.35]], [tHand + .5, [760, 660, 1.45]]]);
    camBegin(cam[0], cam[1], cam[2]);
    // wall, window onto the harbour, task board
    bg('owall', rectPts(-400, -300, W + 800, 1400), { wash: mixCol(C.pale, C.cream, .45), fill: C.sea, fillOp: 40, bleed: .25, tex: .6, border: .4, ink: null });
    bg('owin', rrPts(1060, 150, 660, 440, 16), WASH(C.ochre, { sw: 1.4 }));
    bg('owsky', rectPts(1085, 175, 610, 390), { wash: mixCol(C.pale, C.cream, .3), fill: C.ochreLt, fillOp: 40, bleed: .2, tex: .4, ink: null });
    bg('owsea', rectPts(1085, 420, 610, 145), { wash: C.sea, fill: C.teal, fillOp: 60, bleed: .08, tex: .6, ink: null });
    waves('owv', 1100, 1690, 450, 555, t, 8, C.pale, 12);
    // the slipway and the ship: slides down on "ship"
    bg('oslip', [[1100, 330], [1500, 470], [1500, 490], [1100, 350]], WASH(C.ochreDk, { sw: .8 }));
    const sl = easeIn(seg(t, tShip - .45, tShip + .25)), afloat = t > tShip + .25;
    const bob = afloat ? 6 * Math.sin((t - tShip) * 3) * Math.exp(-(t - tShip) * .6) + 3 * Math.sin(t * 2) : 0;
    const shx = lerp(1180, 1470, sl) + (afloat ? 30 * ease(seg(t, tShip + .25, tShip + 3)) : 0), shy = lerp(320, 440, sl) + bob, srot = afloat ? .02 * Math.sin(t * 2) : .33 * (1 - seg(t, tShip + .1, tShip + .35));
    boilSeed('oship'); push(); translate(shx, shy); rotate(srot);
    paint([[-90, -10], [95, -10], [70, 30], [-70, 30]], WASH(C.rose, { sw: 1 }));
    inkLine([[0, -10], [0, -120]], 2, C.ochreDk, 'ink', 0);
    paint([[4, -115], [70, -30], [4, -30]], WASH(C.cream, { sw: .9 })); paint([[-4, -100], [-60, -30], [-4, -30]], WASH(C.cream, { sw: .9 }));
    pop();
    if (t > tShip + .1 && t < tShip + 1.4) { const k = seg(t, tShip + .1, tShip + 1.4); for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * .35; bg('ospl' + i, ellPts(1480 + Math.cos(a) * 90 * easeOut(k), 460 + Math.sin(a) * 110 * easeOut(k) + 200 * k * k, 12 * (1 - k), 16 * (1 - k), 8), { wash: C.pale, ink: PAL.ink, sw: .5 }); } }
    ln('owbar', [[1390, 150], [1390, 590]], 4, C.ochre, 'ink', 0);
    // task board (left): lights on the first key; cards get ticks on "track"
    const k1 = seg(t, tLogin, tLogin + .4);
    bg('oboard', rectPts(240, 180, 440, 300, 3), WASH(mixCol(C.ochreDk, C.ochre, .4), { sw: 1.3 }));
    for (let i = 0; i < 6; i++) {
      const bx = 280 + (i % 3) * 135, by = 210 + Math.floor(i / 3) * 135, tick = seg(t, tTrack + i * .18, tTrack + i * .18 + .2);
      bg('ocard' + i, rectPts(bx, by, 110, 110, 2), { wash: k1 > 0 ? mixCol(C.cream, [C.sea, C.ochreLt, C.rose][i % 3], .25 * k1) : mixCol(C.cream, C.ochreDk, .15), ink: PAL.ink, sw: .8 });
      ln('opin' + i, ellPts(bx + 55, by + 8, 5, 5, 8), 2, C.rose);
      if (tick > 0 && i < 4) ln('otick' + i, [[bx + 30, by + 60], [bx + 48, by + 80], [bx + 30 + 55 * backOut(tick), by + 40 - 10 * tick]], 3.5, mixCol(C.sap, PAL.ink, .3), 'ink', .2);
    }
    // the desk
    const DX = 1000, DT = 790;
    bg('ofloor', rectPts(-400, 960, W + 800, 400), { wash: mixCol(C.ochreDk, C.cream, .25), ink: null });
    // Clawd behind the desk
    const M = emotions(t, [[0, 'excited', { emote: null }], [tPic, 'happy'], [tEmpty, 'confused'], [tClever, 'idea'], [tStuck, 'sad'], [tGive + .2, 'surprised'],
      [tLogin + .2, 'happy'], [tTrack, 'determined'], [tProj + .2, 'excited'], [tChange + .1, 'determined'], [tLaunch + .2, 'excited'], [tShip + .4, 'starstruck'],
      [tAccess - .2, 'proud'], [tDecide + .2, 'hopeful', { lookX: -.8 }], [tHand + .2, 'sad', { lookX: -.8, emote: null }]]);
    const catches = [tLogin, tProj, tLaunch];
    const nKeys = catches.filter(c => t > c + .05).length;
    const reach = catches.some(c => t > c - .55 && t < c + .15) || (t > tDecide && t < tHand);
    const jingle = seg(t, tAccess - .3, tAccess) * (1 - seg(t, tDecide - .3, tDecide));
    const pat = t > tEmpty && t < tClever ? .4 * Math.abs(Math.sin((t - tEmpty) * 9)) : 0;
    const cU = 22, cX = DX + 40;
    const lookShip = t > tLaunch + .2 && t < tAccess - .4;
    clawd(cX, DT + 50, cU, { ...M, view: lookShip ? 'q' : 'front', flip: false, hat: 'bowtie', aL: reach ? .45 : pat ? -.2 - pat : M.aL, aR: jingle > 0 ? .9 + .3 * Math.sin(t * 20) : lookShip ? .3 : M.aR,
      lookX: lookShip ? .9 : M.lookX, lookY: lookShip ? -.6 : M.lookY, boilKey: 'oc',
      armR: jingle > 0 ? (u, sw) => { push(); translate(3.6 * u, 2.4 * u); keyring(u * 1.4, sw, 3, 1, t); pop(); } : undefined,
      draw: jingle > 0 ? undefined : (u, sw) => { push(); translate(9.2 * u, -2.6 * u); keyring(u * 1.2, sw, nKeys, ring(t, catches.map(c => c + .05)) * .5, t); pop(); } });
    // desk top and front (hides his legs)
    bg('odesk', rectPts(DX - 330, DT, 660, 30, 2), WASH(mixCol(C.ochre, C.ochreDk, .4), { sw: 1.3 }));
    bg('odeskf', rectPts(DX - 320, DT + 30, 640, 170), { wash: mixCol(C.ochreDk, PAL.ink, .1), fill: C.ochreDk, fillOp: 50, tex: .7, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 2; i++) bg('odrw' + i, rectPts(DX + 40 + i * 140, DT + 60, 120, 110, 2), WASH(mixCol(C.ochreDk, C.ochre, .25), { sw: .8 }));
    // the lamp: lights on the first key
    const lx = DX + 270;
    bg('olampb', rectPts(lx - 30, DT - 12, 60, 12), WASH(C.teal));
    ln('olampa', [[lx, DT - 12], [lx + 20, DT - 110]], 3, C.teal, 'ink', 0);
    bg('olamps', [[lx - 10, DT - 150], [lx + 60, DT - 130], [lx + 40, DT - 95], [lx - 20, DT - 110]], WASH(C.teal, { sw: .9 }));
    if (k1 > 0) { boilSeed('olampg'); glow(lx + 25, DT - 80, 170, C.ochreLt, .9 * k1); }
    // the model ship: its sail goes up on "change"
    const k2 = seg(t, tProj - .1, tProj + .2), sail = backOut(seg(t, tChange, tChange + .4));
    if (k2 > 0) {
      const mx = DX - 200, my = DT;
      boilSeed('omodel'); push(); translate(mx, my); scale(backOut(k2));
      paint([[-60, -30], [60, -30], [45, 0], [-45, 0]], WASH(C.rose, { sw: .9 }));
      inkLine([[0, -30], [0, -120]], 1.6, C.ochreDk, 'ink', 0);
      if (sail > 0) paint([[4, -118], [4 + 55 * sail, -40], [4, -40]], WASH(C.cream, { sw: .8 }));
      pop();
    }
    // the Navigator: walks in on "give", hands over three keys one by one, holds up a fourth and pockets it
    const nx = lerp(-160, 560, ease(seg(t, tGive - 1.1, tGive - .1)));
    const walking = t > tGive - 1.1 && t < tGive - .1;
    const offers = catches.map(c => [c - .75, c - .25]);
    let aL = -1.2, holding = null;
    offers.forEach(([a, b], i) => { if (t > a - .3 && t < b + .05) { aL = lerp(-1.2, -.05, ease(seg(t, a - .3, a))); holding = i; } });
    const big = t > tDecide - .6 && t < tHand + .1;
    const pocket = seg(t, tHand - .1, tHand + .25);
    const nm = navMood(t, [[0, 'neutral'], [tGive, 'determined'], [tShip + .3, 'happy'], [tDecide - .6, 'stern', { brows: 'raised' }], [tHand + .3, 'neutral', { mouth: 'smile' }]]);
    const aR = big ? lerp(-1.2, lerp(1.1, -1.35, ease(pocket)), ease(seg(t, tDecide - .6, tDecide - .2))) : undefined;
    nav(nx, 965, 23, { ...nm, view: walking ? 'side' : big ? 'q' : 'side', walk: walking ? (t - tGive) * 1.7 : undefined, aL: big ? -1.25 : aL, aR: big ? aR : undefined, boilKey: 'on',
      handL: holding != null && t < catches[holding] - .25 ? (s, sw, up) => key(.3 * s, 0, .65 * s, up - .3, C.ochre, 'hk') : undefined,
      handR: big && pocket < .9 ? (s, sw, up) => key(.3 * s, 0, .8 * s, up + 1.2, C.ochreLt, 'bigk') : undefined });
    // the keys in flight: from her hand to his, on a short deliberate arc
    catches.forEach((c, i) => {
      const k = seg(t, c - .25, c + .05); if (k <= 0 || k >= 1) return;
      const s = 23, ha = -.05, hp = [nx + (-.05 + 3.23 * Math.cos(ha)) * s, 965 - 8.2 * s - 3.23 * Math.sin(ha) * s];
      const cp = [cX - 5.2 * cU, DT + 50 - 6.2 * cU];
      const p = arcPt(hp, cp, 60, ease(k));
      key(p[0], p[1], 15, -.3 + k * TAU, C.ochre, 'fk' + i);
    });
    const kp = [nx + 70, 965 - 175];
    const at = toScreen(kp[0], kp[1]);
    camEnd();
    seamIn('splash', lt, SPLASH1);
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1], col: C.night });
  }

  // ---------- the quay set: sky, sea, lighthouse, planks ----------
  const QY = 830;
  function quay(key, t, o = {}) {
    const x0 = o.x0 ?? -600, x1 = o.x1 ?? 3200, night = o.night || 0;
    bg(key + 'sky', rectPts(x0, -500, x1 - x0, 1060), { wash: o.sky || mixCol(C.pale, C.cream, .35), fill: C.ochreLt, fillOp: 60, bleed: .25, tex: .5, border: .5, ink: null });
    if (night > 0) { bg(key + 'night', rectPts(x0, -500, x1 - x0, 1060), { wash: C.night, washOp: 235 * night, ink: null });
      for (let i = 0; i < 26; i++) { const sx = x0 + (x1 - x0) * hash(i * 5.1), sy = -100 + 520 * hash(i * 2.7); boilSeed(key + 'star' + i); glow(sx, sy, 16 + 10 * hash(i), C.cream, night * (.6 + .4 * Math.sin(t * 4 + i))); } }
    bg(key + 'head', blobPts(o.headX ?? 2400, 560, 520, 4, .08, 30).map(([x, y]) => [x, Math.min(y, 560)]), { wash: mixCol(C.sap, C.teal, .45), fill: C.teal, fillOp: 60, bleed: .1, tex: .6, ink: null });
    bg(key + 'sea', rectPts(x0, 545, x1 - x0, 700), { wash: mixCol(C.sea, C.teal, .2), fill: C.teal, fillOp: 70, bleed: .06, tex: .7, border: .4, ink: null });
    if (night > 0) bg(key + 'nsea', rectPts(x0, 545, x1 - x0, 700), { wash: C.deep, washOp: 200 * night, ink: null });
    waves(key + 'wv', x0, x1, 570, 1000, t, 40, mixCol(C.pale, C.sea, .3), 14);
  }
  function lighthouse(key, x, y, s, lit = 0) {
    bg(key + 'rock', blobPts(x, y + 30 * s, 120 * s, 2, .15, 20).map(([a, b]) => [a, Math.min(b, y + 50 * s)]), WASH(mixCol(C.ochreDk, C.teal, .4)));
    bg(key + 'tower', [[x - 40 * s, y], [x + 40 * s, y], [x + 26 * s, y - 230 * s], [x - 26 * s, y - 230 * s]], WASH(C.cream, { sw: 1.2 }));
    for (let i = 0; i < 2; i++) bg(key + 'band' + i, [[x - (37 - i * 6) * s, y - (40 + i * 80) * s], [x + (37 - i * 6) * s, y - (40 + i * 80) * s], [x + (34 - i * 6) * s, y - (80 + i * 80) * s], [x - (34 - i * 6) * s, y - (80 + i * 80) * s]], WASH(C.rose, { sw: .8 }));
    bg(key + 'lamp', rectPts(x - 26 * s, y - 280 * s, 52 * s, 50 * s), { wash: lit > 0 ? mixCol(C.ochreLt, C.cream, .3) : mixCol(C.pale, C.teal, .3), ink: PAL.ink, sw: 1 });
    bg(key + 'roof', [[x - 36 * s, y - 280 * s], [x + 36 * s, y - 280 * s], [x, y - 320 * s]], WASH(C.teal));
    if (lit > 0) { boilSeed(key + 'lg'); glow(x, y - 255 * s, 220 * s, C.ochreLt, lit); }
  }
  function quayDeck(key, x0, x1, y = QY) {
    bg(key + 'face', rectPts(x0, y + 26, x1 - x0, 90), { wash: mixCol(C.ochreDk, PAL.ink, .2), fill: C.ochreDk, fillOp: 60, tex: .7, ink: PAL.ink, sw: 1 });
    for (let x = x0 + 60; x < x1; x += 260) bg(key + 'pile' + x, rectPts(x, y + 110, 40, 300), WASH(mixCol(C.ochreDk, PAL.ink, .25)));
    bg(key + 'top', rectPts(x0, y, x1 - x0, 30, 2), WASH(mixCol(C.ochre, C.ochreDk, .45), { sw: 1.2 }));
    bg(key + 'below', rectPts(x0, y + 116, x1 - x0, 600), { wash: mixCol(C.ochreDk, C.cream, .15), fill: C.ochreDk, fillOp: 50, tex: .7, ink: null });
    for (let x = x0 + 80; x < x1; x += 120) ln(key + 'pl' + x, [[x, y + 2], [x + 3, y + 28]], .6, mixCol(C.ochreDk, PAL.ink, .4), 'inkfine', 0);
  }
  function stone(key, x, y, r, gl = 0) { bg(key, ellPts(x, y, r, r * .32, 18), WASH(mixCol(C.ochreDk, C.cream, .45), { sw: 1 })); if (gl > 0) { boilSeed(key + 'g'); glow(x, y, r * 2.2, C.ochreLt, gl); } }

  // ---------- E: what an agent is not ----------
  function notShot(t, lt, dur) {
    const tPerson = w('not', 'person'), tGoals = w('not', 'goals'), tFeel = w('not', 'feelings'), tPred = w('not', 'predicts'), tStep = w('not', 'step'), tSee = w('not', 'see');
    const tMot = w('not', 'motivate'), tClear = w('not', 'clear'), tConf = w('not', 'confidently'), tWrong = w('not', 'wrong', 0), tProb = w('not', 'problem'), tBeau = w('not', 'beautiful'), tPrec = w('not', 'precision');
    const tKeep = w('not', 'keep'), tTire = w('not', 'tirelessly'), tDir = w('not', 'direction');
    const cam = kf(t, [[67.17, [880, 640, 1.35]], [tPred - .3, [920, 650, 1.35]], [tStep - .3, [1120, 660, 1.2]], [tMot - .3, [1060, 650, 1.2]], [tClear - .1, [760, 580, .92]],
      [tConf + .2, [900, 580, .95]], [tBeau - .6, [1700, 600, 1.1]], [tPrec + .5, [1900, 620, 1.2]], [tKeep + .2, [1850, 600, 1.0]], [tDir + .5, [1850, 600, .95]]]);
    camBegin(cam[0] + 10 * Math.sin(lt * .4), cam[1], cam[2]);
    quay('eq', t, { headX: 2700 });
    lighthouse('elh', 80, 560, .9, 0);
    // the clear route: a dotted line over the water to the lighthouse, painted on "clear"
    const rk = seg(t, tClear, tClear + 1.1);
    if (rk > 0) for (let i = 0; i < 26 * rk; i++) { const k = i / 26, x = lerp(1380, 180, k), y = 640 + 60 * Math.sin(k * PI) - 30 * k; bg('eroute' + i, ellPts(x, y, 9, 5, 8), { wash: C.rose, ink: null }); }
    quayDeck('ed', -600, 1280);
    bg('ebol', rrPts(250, QY - 70, 50, 70, 14), WASH(mixCol(C.teal, PAL.ink, .2)));
    // stepping stones, the buoy, the rowing boat
    const SX = [1430, 1620, 1800], SY = 880;
    const gl = seg(t, tStep - .1, tStep + .3) * (1 - seg(t, tSee + .3, tSee + .8));
    const BX = 2030, BY = 860, shine = seg(t, tBeau, tPrec + .4);
    SX.forEach((x, i) => stone('es' + i, x, SY, 70, i === 0 ? gl * .9 : 0)); stone('es3', BX - 120, SY, 70);
    // the rowing boat: he climbs in on "keep" and rows out to sea to the right
    const row = seg(t, tKeep + .4, dur + 67.17), bx = 2250 + 700 * row * row * .6 + 380 * row, by = 890 - 90 * row, bs = 1 - .45 * row;
    // Clawd's path: stands on the quay; hops to stone 0 on "see"; on "confidently wrong" hops right, stone to stone, to the buoy; then the boat
    const hopsE = [[tSee - .35, tSee + .05, 1080, SX[0]], [tWrong + .05, tWrong + .4, SX[0], SX[1]], [tWrong + .55, tWrong + .9, SX[1], SX[2]], [tProb - .1, tProb + .3, SX[2], BX - 120], [tKeep - .05, tKeep + .4, BX - 120, 2250]];
    let cx = 1080, cy = QY + 2, hop = { dy: 0, sq: 0 };
    const ys = x => x === 1080 ? QY + 2 : x === 2250 ? 870 : SY - 8;
    hopsE.forEach(([a, b, x0, x1]) => { if (t >= a) { const k = ease(seg(t, a, b)); cx = lerp(x0, x1, k); cy = lerp(ys(x0), ys(x1), k); } const j = jump(t, a, b, 3); hop.dy += j.dy; hop.sq += j.sq; });
    const inBoat = t > tKeep + .4;
    if (inBoat) { cx = bx; cy = by - 20 * bs; }
    // the buoy (polished to a gleam)
    boilSeed('ebuoy'); push(); translate(BX, BY + 5 * Math.sin(t * 2));
    paint([[-40, 0], [40, 0], [22, -110], [-22, -110]], WASH(shine > 0 ? mixCol(C.rose, C.ochreLt, .6 * shine) : C.rose, { sw: 1.2 }));
    paint(rectPts(-36, -60, 72, 18), { wash: C.cream, ink: PAL.ink, sw: .8 });
    pop();
    if (shine > 0) { boilSeed('ebg'); glow(BX, BY - 60, 150 * shine, C.ochreLt, .8 * shine); for (let i = 0; i < 4; i++) { const p = frac(t * .9 + i * .25); emote('spark', BX - 60 + i * 40, BY - 130 - 40 * Math.sin(i * 2), 16 * shine, 1 - p * .6, t); } }
    // Clawd
    const M = emotions(t, [[0, 'neutral', { eyes: 'blank', lookX: -.3 }], [tFeel, 'neutral', { eyes: 'blank' }], [tPred, 'neutral', { eyes: 'look', lookX: .9 }], [tSee + .1, 'neutral', { lookX: -.6 }],
      [tClear + .3, 'idea'], [tConf, 'cool', { emote: null }], [tBeau - .3, 'determined'], [tPrec + .2, 'proud'], [tKeep, 'determined', { eyes: 'shades' }]]);
    const polish = t > tBeau - .3 && t < tPrec + .2;
    const faceR = t > tPred - .1;
    const cu = 17 * (inBoat ? bs : 1);
    if (!inBoat) clawd(cx, cy, cu, { ...M, view: faceR ? 'q' : 'front', flip: !faceR, dy: (M.dy || 0) + hop.dy, sq: (M.sq || 0) + hop.sq, aL: polish ? .5 + .5 * Math.sin(t * 22) : M.aL, boilKey: 'ec' });
    // a heart tries to pop and fizzles on "feelings"
    const hk = seg(t, tGoals, tGoals + .3) * (1 - seg(t, tFeel + .1, tFeel + .5));
    if (hk > 0) { boilSeed('eheart'); emote('heart', cx + 90, cy - 150 - 30 * seg(t, tFeel, tFeel + .5), 22, hk, t - tGoals); }
    // the boat (drawn after Clawd climbs in)
    boilSeed('eboat'); push(); translate(bx, by + 4 * Math.sin(t * 2.2)); scale(bs);
    if (inBoat) clawd(0, -20, 14, { ...feel('determined', t, { eyes: 'shades' }), view: 'side', noShadow: true, noLegs: true, aL: .5 + .6 * Math.sin((t - tKeep) * 7), boilKey: 'ecb' });
    paint([[-110, -30], [110, -30], [80, 20], [-80, 20]], WASH(C.teal, { sw: 1.2 }));
    if (inBoat) { const oa = .4 * Math.sin((t - tKeep) * 7); inkLine([[0, -30], [-150 * Math.cos(oa), 10 + 40 * Math.sin(oa)]], 3, C.ochreDk, 'ink', 0); }
    pop();
    // the Navigator: offers her mug, cheers, points with the chart; runs to the quay end with her spyglass
    const nm = navMood(t, [[0, 'neutral', { lookX: .6 }], [tFeel + .2, 'worried', { emote: null }], [tPred, 'neutral', { lookX: .8 }], [tMot - .1, 'happy'], [tClear - .1, 'determined'], [tConf + .3, 'surprised'], [tBeau, 'worried'], [tTire, 'worried', { emote: 'sweat' }]]);
    const run = seg(t, tKeep + .2, tDir);
    const nx = lerp(820, 1230, ease(run));
    const offer = t < tPred;
    const cheer = t > tMot - .1 && t < tClear - .15;
    const pointK = t > tClear - .1 && t < tConf + .3;
    const spy = t > tDir - .4;
    nav(nx, QY + 4, 23, { ...nm, view: run > 0 && run < 1 ? 'side' : pointK ? 'q' : 'q', flip: pointK, run: run > 0 && run < 1 ? (t - tKeep) * 2.4 : undefined,
      aL: offer ? .05 : cheer ? 1.3 + .1 * Math.sin(t * 12) : spy ? .7 : nm.aL, aR: cheer ? 1.2 - .1 * Math.sin(t * 12) : pointK ? .2 : nm.aR, point: pointK ? 'R' : undefined,
      handL: offer ? (s, sw, up) => navProp('mug', s, sw, { up }) : spy ? (s, sw, up) => navProp('spyglass', s, sw, { up: .1, ext: seg(t, tDir - .3, tDir) }) : undefined,
      handR: pointK ? undefined : undefined, boilKey: 'en' });
    camEnd();
    seamIn('iris', lt, { cx: 700, cy: 480, col: C.night });
    seamOut('page', lt, dur, { col: C.cream, dir: -1 });
  }

  // ---------- F: the spectrum along the quay ----------
  function spectrum(t, lt, dur) {
    const tSpec = w('spectrum', 'spectrum'), tAuto = w('spectrum', 'autocomplete'), tWord = w('spectrum', 'word'), tChat = w('spectrum', 'chat'), tQ = w('spectrum', 'questions');
    const tTool = w('spectrum', 'tool'), tHands = w('spectrum', 'hands'), tRead = w('spectrum', 'read'), tRun = w('spectrum', 'run'), tAuton = w('spectrum', 'autonomous'), tOwn = w('spectrum', 'own');
    const tClose = w('spectrum', 'close'), tLap = w('spectrum', 'laptop'), tCome = w('spectrum', 'come', 1), tFin = w('spectrum', 'finished'), tWait = w('spectrum', 'waiting'), tRev = w('spectrum', 'review');
    const X = [420, 900, 1480, 2260], U = [6.5, 12, 16, 22];
    const cam = kf(t, [[87.21, [1350, 520, .74]], [tSpec + .5, [1350, 540, .76]], [tAuto - .2, [470, 700, 1.6]], [tWord + .4, [480, 700, 1.6]], [tChat - .3, [860, 660, 1.3]],
      [tQ + .6, [880, 660, 1.3]], [tTool - .1, [1480, 640, 1.15]], [tRun + .6, [1500, 640, 1.15]], [tAuton - .1, [2150, 600, 1.0]], [tClose - .3, [2150, 600, 1.0]], [tFin, [2150, 620, 1.1]], [tRev + 1, [2150, 630, 1.14]]]);
    camBegin(cam[0], cam[1], cam[2]);
    const night = seg(t, tClose, tLap + .2) * (1 - seg(t, tCome + .1, tCome + .6));
    quay('fq', t, { headX: 3000, night, x0: -900, x1: 3600 });
    quayDeck('fd', -900, 2500);
    // the spectrum: a band painted along the quay face, pale to deep
    for (let i = 0; i < 10; i++) bg('fband' + i, rectPts(-200 + i * 290, QY + 40, 300, 34, 2), { wash: mixCol(C.pale, C.deep, i / 9), ink: null });
    // 1. autocomplete: a sheet on an easel with her scribbled line; the tiny agent walks the ledge painting the next stroke
    const EX = X[0], EY = QY - 150;
    ln('fe1', [[EX - 120, QY], [EX - 80, EY - 170]], 3, C.ochreDk, 'ink', 0); ln('fe2', [[EX + 120, QY], [EX + 80, EY - 170]], 3, C.ochreDk, 'ink', 0);
    bg('fsheet', [[EX - 140, EY - 190], [EX + 140, EY - 196], [EX + 136, EY - 10], [EX - 136, EY - 4]], WASH(C.cream, { fill: C.ochreLt, fillOp: 40, sw: 1.1 }));
    bg('fledge', rectPts(EX - 150, EY - 4, 300, 14, 1), WASH(C.ochreDk));
    ln('fscrib', [[EX - 110, EY - 100], [EX - 85, EY - 112], [EX - 60, EY - 94], [EX - 35, EY - 110], [EX - 10, EY - 96], [EX + 10, EY - 104]], 3, C.teal, 'ink', .6);
    const ext = seg(t, tAuto + .3, tWord + .2);
    if (ext > 0) { const P = [[EX + 10, EY - 104]]; for (let j = 1; j <= 8 * ext; j++) P.push([EX + 10 + j * 12, EY - 100 + (j % 2 ? -8 : 6)]); if (P.length > 1) ln('fscrib2', P, 3, C.rose, 'ink', .6); }
    const a1 = emotions(t, [[0, 'neutral', { lookY: -.8 }], [tAuto, 'determined'], [tWord + .3, 'proud']]);
    clawd(EX + 10 + 96 * ext, EY - 4, U[0], { ...a1, view: ext > 0 && ext < 1 ? 'side' : 'front', walk: ext > 0 && ext < 1 ? ext * 5 : undefined, aL: ext > 0 && ext < 1 ? 1.3 : a1.aL, noShadow: true, boilKey: 'f1' });
    // 2. chat: she asks (?), it answers (bulb)
    const a2 = emotions(t, [[0, 'neutral'], [tChat + .2, 'thinking'], [tQ, 'idea']]);
    clawd(X[1] + 80, QY, U[1], { ...a2, flip: true, view: 'q', boilKey: 'f2' });
    // 3. tool-equipped: hands! a wrench and a folder
    const hk = backOut(seg(t, tHands - .1, tHands + .25));
    const a3 = emotions(t, [[0, 'neutral'], [tHands, 'excited', { emote: null }], [tRun + .5, 'proud']]);
    const openF = seg(t, tRead, tRead + .3), spinW = seg(t, tRun, tRun + .6);
    clawd(X[2], QY, U[2], { ...a3, aL: hk > 0 ? lerp(.2, 1.1, hk) : a3.aL, aR: hk > 0 ? lerp(.2, 1.1, hk) + .2 * Math.sin(spinW * 12) : a3.aR, boilKey: 'f3',
      armR: hk > 0 ? (u, sw) => { push(); scale(hk); rotate(spinW * TAU); paint([[0, -.35 * u], [2.6 * u, -.35 * u], [2.6 * u, .35 * u], [0, .35 * u]], WASH(mixCol(C.pale, C.teal, .35), { sw })); paint(ellPts(2.9 * u, 0, .7 * u, .7 * u, 12), WASH(mixCol(C.pale, C.teal, .35), { sw })); pop(); } : undefined,
      armL: hk > 0 ? (u, sw) => { push(); scale(hk); paint(rectPts(0, -1.3 * u, 2.4 * u, 2 * u, 1), WASH(C.ochreLt, { sw })); if (openF > 0) paint([[0, -1.3 * u], [2.4 * u, -1.3 * u], [2.4 * u - .6 * u * openF, -1.3 * u - 1.6 * u * openF], [-.6 * u * openF, -1.3 * u - 1.6 * u * openF]], WASH(C.cream, { sw })); pop(); } : undefined });
    if (spinW > 0 && spinW < 1) { boilSeed('fsp'); for (let i = 0; i < 5; i++) emote('spark', X[2] + 260 + 60 * Math.cos(i * 1.3), QY - 280 + 60 * Math.sin(i * 1.3), 16, 1 - spinW, t); }
    // 4. autonomous: a boat with a sail sets off on its own; returns in the morning with a tied crate
    const away = seg(t, tOwn - .2, tClose), back = seg(t, tCome - .1, tFin - .2);
    const out = t < tCome - .1 ? ease(away) : 1 - ease(back);
    const bx = X[3] + 180 + 900 * out, by = 900 - 140 * out, bsc = 1 - .6 * out;
    const crate = t > tFin - .2;
    boilSeed('fboat'); push(); translate(bx, by + 5 * Math.sin(t * 2)); scale(bsc);
    inkLine([[0, -20], [0, -330]], 3, C.ochreDk, 'ink', 0);
    paint([[8, -320], [8 + 170 * (1 - .05 * Math.sin(t * 2)), -60], [8, -60]], WASH(C.cream, { sw: 1.2 }));
    clawd(-60, -20, U[3] * .8, { ...feel(crate ? 'proud' : t < tOwn ? 'determined' : 'happy', t), view: crate ? 'front' : 'q', flip: false, noShadow: true, noLegs: true, boilKey: 'f4b' });
    paint([[-190, -30], [190, -30], [140, 40], [-140, 40]], WASH(C.teal, { sw: 1.4 }));
    pop();
    if (crate) {
      const ck = backOut(seg(t, tFin - .2, tFin + .2)), cxr = X[3] - 20;
      boilSeed('fcrate'); push(); translate(cxr, QY); scale(ck);
      paint(rectPts(-110, -150, 220, 150, 2), WASH(C.ochre, { sw: 1.3 })); inkLine([[-110, -75], [110, -75]], 5, C.rose, 'ink', 0); inkLine([[0, -150], [0, 0]], 5, C.rose, 'ink', 0);
      paint([[0, -150], [-40, -190], [-10, -160]], WASH(C.rose)); paint([[0, -150], [40, -190], [10, -160]], WASH(C.rose));
      pop();
    }
    // the Navigator walks along the spectrum with the camera
    const nX = kf(t, [[0, 250], [tChat - .9, 250], [tChat - .1, 700], [tAuton - 1.2, 700], [tAuton + .6, 1960], [tLap + .6, 1960], [tCome - .2, 1400], [tCome - .1, 1400], [tFin + .3, 1990]]);
    const moving = [[tChat - .9, tChat - .1], [tAuton - 1.2, tAuton + .6], [tLap + .6, tCome - .2], [tCome - .1, tFin + .3]].find(([a, b]) => t > a && t < b);
    const leaving = moving && moving[0] === tLap + .6;
    const nm = navMood(t, [[0, 'neutral', { lookX: .6, lookY: .5 }], [tChat, 'confused'], [tQ + .2, 'happy'], [tTool, 'surprised'], [tAuton + .8, 'neutral'], [tClose, 'sleepy', { emote: null }], [tFin + .4, 'thinking', { emote: null }], [tRev + .2, 'happy']]);
    // laptop on a bollard, its screen toward us: open until "close"
    const lid = 1 - ease(seg(t, tClose, tLap + .2));
    bg('flapb', rrPts(2010, QY - 110, 60, 110, 10), WASH(mixCol(C.teal, PAL.ink, .2)));
    bg('flap', rectPts(1975, QY - 124, 130, 14, 2), WASH('#4A5058'));
    if (lid > .02) { boilSeed('flid'); paint(rectPts(1985, QY - 124 - 90 * lid, 110, 90 * lid, 1), { wash: '#4A5058', ink: PAL.ink, sw: .9 });
      paint(rectPts(1995, QY - 116 - 80 * lid, 90, 74 * lid), { wash: mixCol(C.pale, C.sea, .4), ink: null }); glow(2040, QY - 124 - 45 * lid, 90 * lid, C.sea, .5 * lid); }
    const review = t > tRev - .3;
    nav(nX, QY + 4, 20, { ...nm, view: moving ? 'side' : review ? 'q' : 'q', flip: leaving, walk: moving ? t * 1.7 : undefined, aL: review ? -.2 : t > tClose - .2 && t < tLap + .3 ? -.1 : nm.aL,
      handL: review ? (s, sw, up) => { push(); rotate(up); inkLine([[0, 0], [1.2 * s, 0]], sw * 2, C.ochreDk, 'ink', 0); paint(ellPts(2 * s, 0, .8 * s, .8 * s, 18), { wash: mixCol(C.pale, C.cream, .4), ink: PAL.ink, sw: sw * 1.2 }); pop(); } : undefined,
      boilKey: 'fn', emote: t > tChat && t < tQ + .2 ? '?' : nm.emote, emoteK: t > tChat && t < tQ + .2 ? seg(t, tChat, tChat + .2) : nm.emoteK });
    if (night > .3) { boilSeed('fmoon'); glow(1500, 120, 120, C.cream, night); bg('fmoond', ellPts(1500, 120, 40, 40, 18), { wash: C.cream, washOp: 255 * night, ink: null }); }
    camEnd();
    seamIn('page', lt, { col: C.cream, dir: -1 });
    seamOut('splash', lt, dur, SPLASH2);
  }

  // ---------- G: the engine and the car ----------
  function engineShot(t, lt, dur) {
    const tEng = w('engine', 'engine'), tHarn = w('engine', 'harness', 0), tCar = w('engine', 'car'), tAppr = w('engine', 'approval'), tClick = w('engine', 'clicked'), tHarn2 = w('engine', 'harness', 1);
    const tReck = w('engine', 'reckless'), tTwo = w('engine', 'two'), tWhy = w('engine', 'why', 0), tAllow = w('engine', 'allowed'), tSet = w('engine', 'setting'), tSets = w('engine', 'settings');
    const drop = seg(t, tEng - .35, tEng), land = t > tEng;
    const shk = shakeXY(t, 9 * Math.exp(-6 * Math.max(0, t - tEng)) * (t > tEng ? 1 : 0) + 7 * Math.exp(-6 * Math.max(0, t - tSets - .3)) * (t > tSets + .3 ? 1 : 0));
    // the car's travel: lurches right on "reckless", teeters at the edge, reverses to safety on "settings are yours"
    const lurch = ease(seg(t, tReck - .3, tReck + .6)), backK = ease(seg(t, tSets + .3, tSets + 1.3));
    const carX = 900 + 430 * lurch - 330 * backK, tip = t > tReck + .5 && t < tSets + .5 ? .05 + .02 * Math.sin(t * 5) : lurch * .05 * (1 - backK);
    const cam = kf(t, [[105.67, [960, 730, 1.2]], [tEng - .3, [960, 750, 1.35]], [tCar + .4, [980, 730, 1.2]], [tAppr, [960, 690, 1.4]], [tHarn2 + .6, [1000, 720, 1.25]], [tReck + .5, [1200, 730, 1.25]],
      [tWhy - .2, [1330, 710, 1.4]], [tAllow, [1180, 730, 1.45]], [tSets + .2, [1150, 730, 1.35]], [tSets + 1.5, [1000, 730, 1.3]]]);
    camBegin(cam[0] + shk[0], cam[1] + shk[1], cam[2]);
    quay('gq', t, { headX: 400 });
    quayDeck('gd', -800, 1560);
    bg('gbol', rrPts(1480, QY - 60, 44, 60, 12), WASH(mixCol(C.teal, PAL.ink, .2)));
    // the car, anchored at its rear wheel so it tips over the edge
    const wheelIn = ease(seg(t, tHarn - .3, tHarn + .4)), bodyK = seg(t, tCar - .4, tCar), bodyY = lerp(-700, 0, easeIn(bodyK));
    const glowC = seg(t, tHarn2 - .1, tHarn2 + .3) * (1 - seg(t, tHarn2 + 1.2, tHarn2 + 1.8));
    push(); translate(carX - 170, QY); rotate(tip); translate(170, 0);
    // engine: a clay-coloured block with pistons, two slit eyes (the model)
    const ey = land ? 0 : lerp(-800, 0, easeIn(drop));
    const bonnet = seg(t, tWhy - .2, tWhy + .1) * (1 - seg(t, tSet, tSet + .3));
    const ex = 130;
    boilSeed('geng'); push(); translate(ex, ey + (land ? 8 * Math.exp(-8 * (t - tEng)) * Math.sin(30 * (t - tEng)) : 0) - 40);
    if (t > tEng - .4) {
      for (let i = 0; i < 2; i++) { const pp = land ? 18 * Math.sin(t * 16 + i * PI) : 0; paint(rectPts(-45 + i * 55, -150 + pp, 34, 70), WASH(C.cream, { sw: .9 })); }
      paint(rrPts(-90, -110, 180, 120, 10), WASH(C.ochre, { sw: 1.3 }));
      paint(rectPts(-90, -30, 180, 40), { fill: C.ochreDk, fillOp: 120, bleed: .04, tex: .6, ink: null });
      for (let i = 0; i < 4; i++) inkLine([[-70 + i * 46, -100], [-70 + i * 46, -40]], 1.2, C.ochreDk, 'inkfine', 0);
      if (land) { glow(0, -60, 80, C.ochreLt, .5 + .3 * Math.sin(t * 8)); paint(ellPts(0, -62, 16, 16, 12), { wash: C.cream, ink: PAL.ink, sw: .9 }); }
      if (land) for (let i = 0; i < 3; i++) { const p = frac(t * .8 + i / 3); paint(ellPts(70 + 30 * p, -180 - 120 * p, 14 + 20 * p, 12 + 16 * p, 12), { fill: C.cream, fillOp: 140 * (1 - p), bleed: .2, tex: .3, ink: null }); }
    }
    pop();
    // characters in the seats, after the body lands
    const inCar = t > tCar + .75;
    if (inCar) {
      const cm = emotions(t, [[0, 'happy'], [tReck - .3, 'excited'], [tReck + .6, 'scared'], [tSets + .5, 'relieved']]);
      clawd(-50, -70, 16, { ...cm, view: 'q', noShadow: true, noLegs: true, aL: .6, boilKey: 'gc' });
      const nm = navMood(t, [[0, 'neutral', { lookX: .7 }], [tAppr, 'thinking'], [tClick, 'determined'], [tReck + .1, 'surprised'], [tTwo, 'thinking'], [tSet, 'determined'], [tSets + .5, 'relieved']]);
      const tap = t > tClick - .3 && t < tClick + .4, turnK = t > tSets - .3 && t < tSets + .6;
      nav(-205, -40, 15, { ...nm, view: 'q', noShadow: true, aR: tap || turnK ? .05 : -.3, boilKey: 'gn' });
    }
    pop();
    // before the car: the pair wait on the quay, then hop into the seats on "car"
    if (!inCar) {
      const hk = seg(t, tCar + .2, tCar + .75);
      const cS = arcPt([1320, QY], [carX - 50, QY - 70], 160, ease(hk)), nS = arcPt([560, QY], [carX - 205, QY - 40], 120, ease(hk));
      const cm0 = emotions(t, [[0, 'neutral', { lookX: -.6 }], [tEng - .2, 'surprised'], [tEng + 1, 'excited'], [tCar, 'happy']]);
      clawd(cS[0], cS[1], 16, { ...cm0, flip: true, view: hk > 0 ? 'side' : 'q', noShadow: hk > 0, boilKey: 'gc0' });
      const nm0 = navMood(t, [[0, 'idea'], [tEng - .2, 'surprised'], [tEng + 1, 'neutral', { lookX: .6 }], [tCar, 'happy']]);
      nav(nS[0], nS[1], 15, { ...nm0, view: hk > 0 ? 'side' : 'q', noShadow: hk > 0, boilKey: 'gn0' });
    }
    push(); translate(carX - 170, QY); rotate(tip); translate(170, 0);
    // body: a rounded teal roadster, the harness around the engine
    if (bodyK > 0) {
      boilSeed('gbody'); push(); translate(0, bodyY);
      paint([[-300, -40], [-280, -110], [-120, -120], [-90, -60], [60, -60], [240, -70], [260, -10], [250, 20], [-300, 20]], WASH(C.teal, { sw: 1.6, curv: .3 }));
      paint([[20, -60], [36, -135], [52, -135], [60, -60]], { wash: mixCol(C.pale, C.cream, .3), washOp: 200, ink: PAL.ink, sw: 1 });
      if (glowC > 0) glow(0, -50, 330, C.ochreLt, glowC);
      // bonnet (over the engine): flips open on "why"
      push(); translate(10, -60); rotate(-1.1 * ease(bonnet));
      paint([[0, 0], [230, -10], [240, 10], [0, 12]], WASH(mixCol(C.teal, C.sea, .3), { sw: 1.2 }));
      pop();
      // the dial on the side: the setting
      const dialA = lerp(-.8, .8, ease(seg(t, tSets - .1, tSets + .3)));
      const dg = seg(t, tSet - .2, tSet + .1);
      if (dg > 0) glow(-200, -10, 90, C.ochreLt, dg);
      paint(ellPts(-200, -10, 34, 34, 18), WASH(C.cream, { sw: 1.2 }));
      paint([[-200, -10], [-200 + 30 * Math.cos(-PI / 2 + dialA - .3), -10 + 30 * Math.sin(-PI / 2 + dialA - .3)], [-200 + 30 * Math.cos(-PI / 2 + dialA + .3), -10 + 30 * Math.sin(-PI / 2 + dialA + .3)]], { wash: dialA > 0 ? C.sap : C.rose, ink: null });
      inkLine([[-200, -10], [-200 + 26 * Math.cos(-PI / 2 + dialA), -10 + 26 * Math.sin(-PI / 2 + dialA)]], 3, PAL.ink, 'ink', 0);
      pop();
    }
    // wheels roll in from both sides
    for (const [wx, from] of [[-200, -900], [170, 900]]) {
      const x = lerp(from, wx, wheelIn), rot = (x - wx) / 50;
      if (wheelIn <= 0) continue;
      boilSeed('gw' + wx); push(); translate(x, -5); rotate(rot);
      paint(ellPts(0, 0, 52, 52, 22), WASH('#2A3036', { sw: 1.2 })); paint(ellPts(0, 0, 22, 22, 14), WASH(C.cream, { sw: .8 }));
      inkLine([[-20, 0], [20, 0]], 2, C.ochreDk, 'ink', 0); pop();
    }
    // the approval prompt on the dash: a tick and a cross; she taps the tick
    const pk = backOut(seg(t, tAppr - .1, tAppr + .25)) * (1 - seg(t, tHarn2 + .4, tHarn2 + .8));
    if (pk > .02) {
      boilSeed('gprompt'); push(); translate(-150, -290); scale(pk);
      paint(rrPts(-120, -60, 240, 110, 24), WASH(C.cream, { sw: 1.4 })); paint([[-20, 50], [10, 50], [-30, 80]], { wash: C.cream, ink: PAL.ink, sw: 1 });
      const pressed = seg(t, tClick, tClick + .2);
      paint(ellPts(-50, -5, 34 * (1 - .15 * pressed), 34 * (1 - .15 * pressed), 16), WASH(mixCol(C.sap, C.cream, .2 - .2 * pressed), { sw: 1 }));
      inkLine([[-65, -5], [-53, 8], [-33, -18]], 4, PAL.ink, 'ink', .2);
      paint(ellPts(50, -5, 34, 34, 16), WASH(mixCol(C.rose, C.cream, .2), { sw: 1 }));
      inkLine([[38, -17], [62, 7]], 4, PAL.ink, 'ink', 0); inkLine([[62, -17], [38, 7]], 4, PAL.ink, 'ink', 0);
      pop();
    }
    // the two questions: one over the engine (why suggest), one over the dial (why allowed)
    const q1 = seg(t, tTwo, tTwo + .25) * (1 - seg(t, tSet + .2, tSet + .5)), q2 = seg(t, tTwo + .2, tTwo + .45) * (1 - seg(t, tSets + .4, tSets + .7));
    const q1big = 1 + .4 * spring(t, tWhy, 5, 14), q2big = 1 + .4 * spring(t, tAllow, 5, 14);
    if (q1 > 0) { boilSeed('gq1'); emote('?', ex + 20, -260, 24 * q1big, q1, t - tTwo); }
    if (q2 > 0) { boilSeed('gq2'); emote('?', -200, -110, 24 * q2big, q2, t - tTwo); }
    pop();
    const at = toScreen(carX - 170 - 30, QY - 10);
    camEnd();
    seamIn('splash', lt, SPLASH2);
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1], col: C.night });
  }

  // ---------- H: steering. The deck at golden hour, the same wheel ----------
  function steerShot(t, lt, dur) {
    const tTyp = w('steer', 'typing'), tSteer = w('steer', 'steering'), tLoop = w('steer', 'loop'), tTools = w('steer', 'tools'), tCheck = w('steer', 'check'), tClear = w('steer', 'clear');
    const tMan = w('steer', 'managed'), tSkill = w('steer', 'skill'), tNext = w('steer', 'next');
    const WX = 1120, WY = 540, WR = 235;
    const crane = ease(seg(t, tNext - .3, dur + 126.16));
    const cam = kf(t, [[126.16, [640, 510, 1.3]], [tTyp + .3, [660, 510, 1.3]], [tSteer + .3, [1000, 540, 1.15]], [tCheck - .2, [1040, 520, 1.2]], [tClear + .3, [1180, 500, 1.08]], [tMan, [980, 560, 1.25]], [tSkill + .4, [980, 560, 1.28]]]);
    camBegin(cam[0], cam[1] - 160 * crane, cam[2] * (1 - .22 * crane));
    // sunset sky and sea
    bg('hsky', rectPts(-600, -600, W + 1200, 1100), { wash: mixCol(C.ochreLt, C.rose, .35), fill: C.rose, fillOp: 70, bleed: .3, tex: .5, border: .5, ink: null });
    boilSeed('hsun'); glow(1600, 440, 300, C.ochreLt, 1); bg('hsund', ellPts(1600, 440, 70, 70, 20), { wash: mixCol(C.ochreLt, C.cream, .3), ink: null });
    bg('hsea', rectPts(-600, 470, W + 1200, 700), { wash: mixCol(C.sea, C.teal, .4), fill: C.deep, fillOp: 60, bleed: .06, tex: .7, ink: null });
    waves('hwv', -600, W + 600, 490, 760, t, 30, mixCol(C.ochreLt, C.sea, .4), 40);
    // the lighthouse ahead: lights on "clear"
    lighthouse('hlh', 1760 - 60 * seg(t, tClear, dur + 126), 500, .35, seg(t, tClear, tClear + .5));
    // deck and rail
    bg('hrail', rectPts(-600, 690, W + 1200, 16), WASH(C.ochreDk));
    for (let x = -560; x < W + 600; x += 110) bg('hpost' + x, rectPts(x, 700, 14, 120), WASH(C.ochreDk, { sw: .8 }));
    planks('hdeck', 810, mixCol(C.ochre, C.ochreDk, .45));
    // the typewriter on a barrel: pushed off on "typing"
    const push1 = seg(t, tTyp - .2, tTyp + .5);
    bg('hbarrel', [[300, 810], [440, 810], [455, 700], [285, 700]], WASH(mixCol(C.ochreDk, C.ochre, .3), { sw: 1.2 }));
    ln('hhoop', [[288, 740], [452, 740]], 2, PAL.ink, 'ink', 0);
    boilSeed('htype'); push(); translate(370 - 260 * easeIn(push1), 700 + 400 * easeIn(seg(push1, .35, 1))); rotate(-1.2 * easeIn(seg(push1, .3, 1)));
    paint([[-70, 0], [70, 0], [60, -50], [-60, -50]], WASH('#3A4048', { sw: 1 }));
    for (let i = 0; i < 6; i++) paint(ellPts(-50 + i * 20, -20, 7, 7, 8), { wash: C.cream, ink: PAL.ink, sw: .5 });
    paint(rectPts(-50, -80, 100, 32, 1), { wash: C.cream, ink: PAL.ink, sw: .7 });
    pop();
    // the wheel on its pedestal, turning; Clawd walks the loop on its rim
    bg('hped', [[WX - 50, WY + 40], [WX + 50, WY + 40], [WX + 90, 815], [WX - 90, 815]], WASH(mixCol(C.ochreDk, C.ochre, .3), { sw: 1.3 }));
    const ang = -PI / 2 + .62 - (t > tSteer ? (t - tSteer) * .45 : 0);
    helmWheel(WX, WY, WR, ang, { key: 'hh', handles: false });
    drawStations(WX, WY, WR, ang, [0, 0, 0, 0], { s: .85, key: 'h' });
    const u = 13, top = WY - WR * 1.04;
    const hopH = rimHop(ang, u, .95, 0, .4);
    const cm = emotions(t, [[0, 'neutral', { lookX: -.6 }], [tSteer, 'determined'], [tTools, 'proud'], [tClear, 'determined'], [tSkill, 'happy']]);
    const hop = jump(t, tSkill + .1, tSkill + .5, 3);
    const ringJ = spring(t, tTools, 4, 20);
    clawd(WX, top, u, { ...cm, view: t > tSteer ? 'side' : 'q', walk: t > tSteer ? (t - tSteer) * .45 * WR * 1.04 / (4 * u) : undefined, dy: (cm.dy || 0) * .4 - hopH / u + hop.dy, sq: (cm.sq || 0) + hop.sq,
      noShadow: hopH > 2, boilKey: 'hc', draw: (uu, sw) => keyring(uu, sw, 3, Math.abs(ringJ), t) });
    if (t > tTools - .1 && t < tTools + .8) { boilSeed('hkg'); glow(WX - 3.6 * u, top - 2.4 * u, 60, C.ochreLt, 1 - seg(t, tTools, tTools + .8)); }
    // the Navigator: pushes the typewriter off, strides to the wheel, steers; spyglass on "check", points on "clear"
    const nx = kf(t, [[0, 520], [tTyp + .4, 520], [tSteer + .2, 850]]);
    const walking = t > tTyp + .4 && t < tSteer + .2;
    const atWheel = t > tSteer + .2;
    const spy = t > tCheck - .2 && t < tClear - .1, pt = t > tClear - .1 && t < tMan - .2, face = t > tMan - .2;
    const nm = navMood(t, [[0, 'neutral'], [tTyp - .2, 'determined'], [tSteer + .3, 'happy'], [tCheck, 'neutral', { eyes: 'narrow' }], [tClear, 'determined'], [tMan, 'proud'], [tSkill + .3, 'happy']]);
    nav(nx, 815, 22, { ...nm, view: face || (t > tTyp + .3 && t < tTyp + .5) ? 'front' : 'side', flip: t < tTyp + .4, walk: walking ? t * 1.7 : undefined,
      aL: t < tTyp + .4 ? lerp(-1.2, .05, ease(seg(t, tTyp - .6, tTyp - .2))) : atWheel && !face ? (spy ? .72 : pt ? .25 : .15 + .05 * Math.sin(t * 1.3)) : nm.aL,
      aR: atWheel && !face ? .1 : nm.aR, point: pt ? 'L' : undefined, wind: .4 + .2 * Math.sin(t * .7),
      handL: spy ? (s, sw, up) => navProp('spyglass', s, sw, { up: .06, ext: seg(t, tCheck - .1, tCheck + .3) }) : undefined, boilKey: 'hn' });
    camEnd();
    seamIn('iris', lt, { cx: 700, cy: 470, col: C.night });
    seamOut('wipe', lt, dur);
  }

  function endShot(t, lt, dur) { crewEnd(t, lt, dur, NEXT, TIMING.next); }

  shots([[0, identShot], [shotAt('hook'), kitchen], [shotAt('bigger'), bigger], [shotAt('loop'), loopShot], [shotAt('tools'), office],
    [shotAt('not'), notShot], [shotAt('spectrum'), spectrum], [shotAt('engine'), engineShot], [shotAt('steer'), steerShot], [B.steer.end + .9, endShot]]);
})();
