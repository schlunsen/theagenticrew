// scene.js: crew05, How to Give Good Instructions (The Crew Member's Guide, chapter 05).
// Storyboard: video/storyboards/crew05.md. Every event is keyed to a spoken word: wt('beat', 'word').
// The recurring set is a long harbour-office chart room with two desks back to back: Alex's (left, cool) and
// Maya's (right, warm). Instructions are paper slips handed to Clawd, who paints what they say on an easel board.
(() => {
  const NUM = '05', NEXT = '06', TITLE = 'How to Give Good Instructions';
  const C = CREW, FY = 880;
  const w = (id, word, n = 0) => wt(id, word, n);
  const we = (id, word, n = 0) => wtEnd(id, word, n);
  const bg = (key, pts, o) => { boilSeed(key); paint(pts, o); };
  const cam = (t, keys, sh = [0, 0]) => { const [cx, cy, z] = kf(t, keys); camBegin(cx + sh[0], cy + sh[1], z); return { cx, cy, z }; };
  const VIOLET = '#8E78B0', LILAC = '#B9A2D2';

  // ---------------------------------------------------------------------------------------------------------------
  // Alex: a second captain, the Navigator's build in his own colours (ginger curls, rose sweater, slate scarf) and a
  // flat cap, so he never reads as Maya. NAV's colours are swapped for the one call and restored at once.
  const ALEXC = { hair: '#A8562A', hairLt: '#D98A4E', sweater: '#B8584F', sweaterDk: '#853B38', scarf: '#5D6C80', scarfDk: '#3C495A',
    scarfLt: '#93A3B5', trousers: '#4A4238', boots: '#3A2A22', skin: '#E6B08A', skinDk: '#C98A68' };
  function cap(s, sw, view) {
    const back = view === 'back' || view === 'qback', side = view === 'q' || view === 'side';
    const cx = view === 'q' ? .25 : view === 'side' ? .35 : 0;
    const CAPO = { wash: '#56657A', fill: '#36424F', fillOp: 70, tex: .6, border: .5, ink: PAL.ink, sw: sw * .7, curv: .35 };
    paint(_P(s, [[cx - 2.65, -12.25], [cx - 2.35, -13.55], [cx - .8, -14.3], [cx + 1.2, -14.25], [cx + 2.55, -13.45], [cx + 2.7, -12.3], [cx, -12.05]]), CAPO);
    if (!back) {
      if (side) paint(_P(s, [[cx + 1.3, -12.55], [cx + 3.7, -12.3], [cx + 3.55, -11.9], [cx + 1.2, -12.05]]), { ...CAPO, curv: .2 });
      else paint(ellPts(cx * s, -12.25 * s, 2.95 * s, .42 * s, 18), { ...CAPO, curv: 0 });
    }
    paint(ellPts((cx + .2) * s, -14.3 * s, .32 * s, .2 * s, 10), { wash: '#36424F', ink: PAL.ink, sw: sw * .5 });
  }
  function alex(x, y, s, o = {}) {
    const keep = {}; for (const k in ALEXC) { keep[k] = NAV[k]; NAV[k] = ALEXC[k]; }
    const user = o.draw;
    try { nav(x, y, s, { ...o, draw: (s2, sw) => { cap(s2, sw, o.back ? 'back' : o.view); if (user) user(s2, sw); } }); }
    finally { Object.assign(NAV, keep); }
  }

  // ---------------------------------------------------------------------------------------------------------------
  // props
  // a paper slip; ks = per-line write-on progress 0..1
  function slip(cx, cy, sw_, sh_, rot, ks, key, o = {}) {
    push(); translate(cx, cy); rotate(rot); if (o.sc) scale(o.sc);
    boilSeed(key);
    if (o.glowK > 0) glow(0, 0, Math.max(sw_, sh_) * 1.4, C.ochreLt, o.glowK);
    paint(rectPts(-sw_ / 2, -sh_ / 2, sw_, sh_, Math.min(2, sw_ * .02)), { wash: C.cream, fill: C.ochreLt, fillOp: 45, tex: .6, border: .5, ink: PAL.ink, sw: o.sw ?? .8 });
    const n = ks.length, m = Math.min(sw_, sh_) * .16, gap = (sh_ - 2 * m) / Math.max(1, n);
    ks.forEach((k, i) => {
      if (k <= .01) return;
      const y = -sh_ / 2 + m + gap * (i + .5), full = (sw_ - 2 * m) * (o.lens ? o.lens[i] : .62 + .38 * hash(i * 3.7 + (o.seed || 0)));
      const L = full * clamp(k), x0 = -sw_ / 2 + m, pts = [];
      for (let j = 0; j <= 5; j++) pts.push([x0 + L * j / 5, y + Math.sin(j * 2.1 + i) * gap * .07]);
      inkLine(pts, o.lw ?? 1.1, o.lineCol || PAL.ink, 'ink', .4);
    });
    pop();
  }
  // a slanted writing desk; returns the point where a slip rests
  function lectern(x, fy, key, col = C.ochreDk) {
    boilSeed(key);
    paint(rectPts(x - 9, fy - 96, 18, 96, 1), { wash: col, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: .8 });
    paint(ellPts(x, fy - 4, 46, 9, 14), { wash: mixCol(col, PAL.ink, .2), ink: PAL.ink, sw: .7 });
    paint([[x - 82, fy - 92], [x + 82, fy - 112], [x + 86, fy - 100], [x - 78, fy - 80]], { wash: mixCol(col, C.cream, .15), fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: .9 });
    return [x + 4, fy - 106];
  }
  // an easel board: bx = centre x; returns the drawing area
  function easel(bx, fy, bw, bh, key, surf, rot = 0) {
    const bot = fy - 150, top = bot - bh, L = bx - bw / 2;
    boilSeed(key + 'legs');
    inkLine([[bx, top - 20], [bx + 20, fy - 6]], 9, mixCol(C.ochreDk, PAL.ink, .3), 'ink', 0);
    paint(ribbon([[bx - bw * .32, bot - 20], [bx - bw * .42, fy]], 16, 13), { wash: C.ochreDk, ink: PAL.ink, sw: .8 });
    paint(ribbon([[bx + bw * .32, bot - 20], [bx + bw * .42, fy]], 16, 13), { wash: C.ochreDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(bx - bw * .45, bot - 4, bw * .9, 14, 1), { wash: mixCol(C.ochreDk, C.ochre, .4), ink: PAL.ink, sw: .7 });
    push(); translate(bx, bot); rotate(rot); translate(-bx, -bot);
    boilSeed(key + 'board');
    paint(rrPts(L - 16, top - 16, bw + 32, bh + 32, 8), { wash: C.ochreDk, fill: PAL.ink, fillOp: 40, tex: .6, ink: PAL.ink, sw: 1 });
    paint(rectPts(L, top, bw, bh, 1.5), { wash: surf, fill: mixCol(surf, C.ochreLt, .4), fillOp: 60, tex: .6, border: .5, ink: PAL.ink, sw: .6 });
    return { L, top, w: bw, h: bh, bot, pop: () => pop() };
  }
  function clock(x, y, r, a1, a2, key) {
    boilSeed(key);
    paint(ellPts(x, y, r + 10, r + 10, 30), { wash: C.ochreDk, ink: PAL.ink, sw: 1 });
    paint(ellPts(x, y, r, r, 30), { wash: C.cream, fill: C.ochreLt, fillOp: 50, tex: .5, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8], [x + Math.cos(a) * r * .92, y + Math.sin(a) * r * .92]], .8, PAL.ink, 'inkfine', 0); }
    inkLine([[x, y], [x + Math.cos(a1 - Math.PI / 2) * r * .5, y + Math.sin(a1 - Math.PI / 2) * r * .5]], 3, PAL.ink, 'ink', 0);
    inkLine([[x, y], [x + Math.cos(a2 - Math.PI / 2) * r * .75, y + Math.sin(a2 - Math.PI / 2) * r * .75]], 1.8, C.rose, 'ink', 0);
    paint(ellPts(x, y, 5, 5, 8), { wash: PAL.ink, ink: null });
  }
  function windowAt(x, y, ww, wh, key, sky, sea, sunK = -1) {
    boilSeed(key);
    paint(rectPts(x - ww / 2 - 18, y - wh / 2 - 18, ww + 36, wh + 36, 1), { wash: C.ochreDk, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - ww / 2, y - wh / 2, ww, wh, 1), { wash: sky, fill: mixCol(sky, '#FFFFFF', .3), fillOp: 70, bleed: .2, tex: .5, ink: null });
    if (sunK >= 0) { const sy = lerp(y - wh * .2, y + wh * .2, sunK); boilSeed(key + 'sun'); glow(x + ww * .15, sy, 90, C.ochreLt, .8); paint(ellPts(x + ww * .15, sy, 30, 30, 18), { wash: mixCol(C.ochreLt, C.rose, sunK), ink: null }); }
    boilSeed(key + 'sea');
    paint(rectPts(x - ww / 2, y + wh * .18, ww, wh * .32, 1), { wash: sea, fill: mixCol(sea, PAL.ink, .2), fillOp: 60, tex: .6, ink: null });
    inkLine([[x, y - wh / 2], [x, y + wh / 2]], 3, C.ochreDk, 'ink', 0);
    inkLine([[x - ww / 2, y], [x + ww / 2, y]], 3, C.ochreDk, 'ink', 0);
    paint(rectPts(x - ww / 2 - 26, y + wh / 2 + 10, ww + 52, 16, 1), { wash: C.ochreDk, ink: PAL.ink, sw: .8 });
  }
  // a brush held in Clawd's claw (arm space)
  const brushHook = (col) => (u, sw) => {
    paint(ribbon([[-.2 * u, 0], [1.9 * u, -.1 * u]], .28 * u, .22 * u), { wash: C.ochreDk, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(2.25 * u, -.12 * u, .5 * u, .3 * u, 12), { wash: col, ink: PAL.ink, sw: sw * .6 });
  };
  const slipHook = (ks, key, o = {}) => (u, sw) => slip(.7 * u, -.9 * u, (o.w || 1.5) * u, (o.h || 1.9) * u, o.rot ?? .12, ks, key, { sw: sw * .6, lw: sw * .75, ...o });
  // a map pin
  function pin(x, y, col, k = 1, key = 'pin', big = 1) {
    if (k <= .01) return; boilSeed(key);
    const s = backOut(k) * big;
    inkLine([[x, y], [x, y - 26 * s]], 1.4, PAL.ink, 'ink', 0);
    paint(ellPts(x, y - 30 * s, 11 * s, 11 * s, 12), { wash: col, ink: PAL.ink, sw: .8 });
  }
  // a painted bar
  const bar = (x, yb, bw, bh, col, key, o = {}) => { if (bh < 1) return; boilSeed(key); paint(rectPts(x, yb - bh, bw, bh, .8), { wash: col, washOp: o.op ?? 255, fill: mixCol(col, PAL.ink, .2), fillOp: 50, tex: .5, ink: o.ink === undefined ? PAL.ink : o.ink, sw: o.sw ?? .7 }); };
  function dashRect(x, y, bw, bh, col, sw, key) {
    boilSeed(key);
    const edges = [[[x, y], [x + bw, y]], [[x + bw, y], [x + bw, y + bh]], [[x + bw, y + bh], [x, y + bh]], [[x, y + bh], [x, y]]];
    for (const [a, b] of edges) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.floor(L / 16)); for (let i = 0; i < n; i += 2) { const p = i / n, q = Math.min(1, (i + 1) / n); inkLine([[lerp(a[0], b[0], p), lerp(a[1], b[1], p)], [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]], sw, col, 'inkfine', 0); } }
  }
  function pie(x, y, r, rot, k, key) {
    if (k <= .01) return; const R = r * backOut(k);
    const cols = [VIOLET, LILAC, '#6B5B8C', '#C98FB5'], cuts = [0, .38, .6, .82, 1];
    for (let i = 0; i < 4; i++) {
      const p = [[x, y]]; for (let j = 0; j <= 10; j++) { const a = rot + lerp(cuts[i], cuts[i + 1], j / 10) * TAU; p.push([x + Math.cos(a) * R, y + Math.sin(a) * R]); }
      boilSeed(key + i); paint(p, { wash: cols[i], ink: PAL.ink, sw: .7 });
    }
  }
  // speed streaks for a whip pan (screen space)
  function streaks(k, key, cols) {
    if (k <= .02) return;
    for (let i = 0; i < 14; i++) {
      const y = 40 + hash(i * 3.3) * 1000, L = (500 + 900 * hash(i * 1.9)) * k, x0 = hash(i * 7.1) * W - L / 2;
      boilSeed(key + i); inkLine([[x0, y], [x0 + L, y + 3]], (1.5 + 4 * hash(i)) * k, cols[i % cols.length], 'dry', 0);
    }
  }

  // ---------------------------------------------------------------------------------------------------------------
  // the office set: Alex's cool half (x < 2250), a bulkhead pillar, Maya's warm half; window 2 sinks to evening (sunK)
  function office(t, o = {}) {
    const wallA = mixCol(C.pale, '#8FA3A6', .4), wallM = mixCol(C.cream, C.ochreLt, .3);
    bg('offwallA', rectPts(-700, -800, 2950, 1690), { wash: wallA, fill: mixCol(C.sea, C.teal, .3), fillOp: 55, bleed: .2, tex: .6, border: .5, ink: null });
    bg('offwallM', rectPts(2250, -800, 3000, 1690), { wash: wallM, fill: C.ochreLt, fillOp: 60, bleed: .2, tex: .6, border: .5, ink: null });
    [[300, 150, 380, mixCol(C.teal, C.pale, .5)], [1500, 90, 420, mixCol(C.teal, C.pale, .6)], [3000, 120, 420, C.ochreLt], [4200, 160, 460, mixCol(C.ochreLt, C.rose, .25)]].forEach(([x, y, r, c], i) => bg('offbloom' + i, blobPts(x, y, r, i + 2, .2), { fill: c, fillOp: 70, bleed: .3, tex: .6, border: .5, ink: null }));
    // wainscot
    bg('offwainA', rectPts(-700, 650, 2950, 232), { wash: mixCol(C.teal, C.pale, .35), fill: C.deep, fillOp: 50, tex: .6, ink: null });
    bg('offwainM', rectPts(2250, 650, 3000, 232), { wash: mixCol(C.sea, C.cream, .3), fill: C.teal, fillOp: 45, tex: .6, ink: null });
    for (let i = 0; i < 4; i++) { boilSeed('offrail' + i); inkLine([[-700 + i * 1480, 650], [-700 + (i + 1) * 1480, 650]], 2.2, PAL.ink, 'ink', 0); }
    for (let i = 0; i < 26; i++) { const x = -600 + i * 220; boilSeed('offpanel' + i); inkLine([[x, 668], [x, 872]], .6, mixCol(C.deep, C.pale, .3), 'inkfine', 0); }
    // floor
    bg('offfloor', rectPts(-700, FY, 5950, 800), { wash: mixCol(C.ochre, C.cream, .4), fill: C.ochreDk, fillOp: 60, bleed: .1, tex: .7, border: .5, ink: null });
    for (let i = 0; i < 4; i++) { boilSeed('offfl' + i); inkLine([[-700 + i * 1480, FY], [-700 + (i + 1) * 1480, FY]], 2, PAL.ink, 'ink', 0); }
    [945, 1030, 1150, 1310].forEach((y, j) => { for (let i = 0; i < 4; i++) { boilSeed('offpl' + j + i); inkLine([[-700 + i * 1480, y], [-700 + (i + 1) * 1480, y + 3]], .7, C.ochreDk, 'inkfine', 0); } });
    // windows, clock, pillar
    windowAt(260, 330, 250, 300, 'offwinA', mixCol(C.pale, '#9AA7AE', .5), mixCol(C.teal, '#6F7F86', .4));
    boilSeed('rain'); for (let i = 0; i < 9; i++) { const x = 150 + hash(i) * 220, y = 200 + frac(t * .9 + hash(i * 2)) * 180; inkLine([[x, y], [x - 6, y + 26]], .6, mixCol(C.pale, PAL.ink, .3), 'inkfine', 0); }
    windowAt(2780, 330, 250, 300, 'offwinM', mixCol(C.pale, C.ochreLt, .35), C.sea);
    const sk = o.sunK ?? 0;
    windowAt(4180, 330, 250, 300, 'offwinM2', mixCol(mixCol(C.pale, C.ochreLt, .35), mixCol(C.rose, PAL.indigo, .35), sk), mixCol(C.sea, C.deep, sk * .7), sk);
    clock(870, 250, 66, o.hour ?? 1.2, o.minute ?? 4.1, 'offclock');
    bg('offpillar', rectPts(2160, -800, 180, 1690, 1), { wash: C.deep, fill: C.teal, fillOp: 60, tex: .7, border: .5, ink: null });
    for (const x of [2160, 2340]) for (let i = 0; i < 2; i++) { boilSeed('offpe' + x + i); inkLine([[x, -800 + i * 840], [x, -800 + (i + 1) * 840]], 1.6, PAL.ink, 'ink', 0); }
    boilSeed('offlamp'); inkLine([[2250, 120], [2250, 200]], 1.2, PAL.ink, 'ink', 0);
    glow(2250, 240, 140, C.ochreLt, .6);
    paint([[2222, 200], [2278, 200], [2290, 270], [2210, 270]], { wash: C.ochreLt, fill: C.ochre, fillOp: 70, ink: PAL.ink, sw: 1 });
    paint(rectPts(2204, 268, 92, 14, 1), { wash: C.ochreDk, ink: PAL.ink, sw: .8 });
  }

  // Alex's board, in any state. f = { charts, fake, months, lib, patches[3], tilt }
  function alexBoard(t, f, key = 'aboard') {
    const B0 = easel(1420, FY, 460, 330, key, mixCol(C.pale, '#FFFFFF', .2), f.tilt || 0);
    const yb = B0.top + B0.h - 34, x0 = B0.L + 36;
    // six bars → merging into three fat months
    const mk = ease(f.months || 0), ck = f.charts || 0, fk = f.fake || 0;
    for (let i = 0; i < 6; i++) {
      const g = Math.floor(i / 2), k = seg(ck, i * .1, i * .1 + .5);
      if (k <= 0) continue;
      const hx = x0 + i * 62, bw = 44, fx = x0 + g * 136 + (i % 2) * 30, fw = 118 - (i % 2) * 30;
      const base = 80 + 150 * hash(i * 5.3 + 1), wob = fk * (1 - mk) * 70 * Math.sin(t * 5.5 + i * 2.1);
      const fh = [170, 230, 140][g];
      const bx = lerp(hx, fx, mk), bww = lerp(bw, fw, mk), bh = lerp(base + wob, fh, mk) * backOut(k);
      const col = mixCol(C.sea, C.rose, mk);
      if (fk > .5 && mk < .5) { bar(bx, yb, bww, bh, mixCol(C.sea, C.cream, .7), key + 'gb' + i, { ink: null, op: 150 }); dashRect(bx, yb - bh, bww, bh, VIOLET, 1.4, key + 'gd' + i); }
      else bar(bx, yb, bww, bh, col, key + 'b' + i);
    }
    if (ck > 0) { boilSeed(key + 'axis'); inkLine([[x0 - 10, yb], [B0.L + B0.w - 24, yb]], 1.3, PAL.ink, 'ink', 0); }
    pie(B0.L + B0.w - 92, B0.top + 88, 60, (f.pieRot || 0), f.lib || 0, key + 'pie');
    (f.patches || []).forEach((k, i) => { if (k <= 0) return; const px = B0.L + 70 + hash(i * 9.1) * (B0.w - 140), py = B0.top + 60 + hash(i * 4.4) * (B0.h - 140); boilSeed(key + 'patch' + i); paint(blobPts(px, py, 46 * backOut(k), i + 5, .3, 18), { wash: i % 2 ? C.ochreLt : C.rose, fill: C.rose, fillOp: 60, tex: .5, ink: PAL.ink, sw: .7 }); });
    if (f.glowBars > 0) { boilSeed(key + 'gl'); for (let g = 0; g < 3; g++) { const fx = x0 + g * 136, fh = [170, 230, 140][g]; paint(rectPts(fx - 8, yb - fh - 8, 134, fh + 8, 2), { ink: C.rose, sw: 3 * f.glowBars }); } }
    B0.pop();
    return B0;
  }

  // ---------------------------------------------------------------------------------------------------------------
  function identShot(t, lt, dur) { crewIdent(t, lt, dur, NUM, TITLE); }

  // 1 + 1b. Two captains: Alex's desk, a whip pan across the pillar, Maya's desk, then both at once.
  function twoCaptains(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    // Alex's cues
    const aTypes = w('alex', 'types'), aMake = w('alex', 'make'), aDash = we('alex', 'dashboard', 1);
    const aThrow0 = aDash + .15, aThrow1 = aThrow0 + .55, aBuild = w('alex', 'builds'), aCharts = w('alex', 'charts');
    const aFake = w('alex', 'fake'), aMonths = w('alex', 'months'), aLib = w('alex', 'library'), aHours = w('alex', 'hours'), aGives = w('alex', 'gives');
    // Maya's cues
    const mSame = w('maya', 'same'), mWrites = w('maya', 'writes');
    const mL = [[w('maya', 'connect'), we('maya', 'data')], [w('maya', 'show'), we('maya', 'weeks')], [w('maya', 'stacked'), we('maya', 'person')], [w('maya', 'use'), we('maya', 'have')], [w('maya', 'match'), we('maya', 'cards')]];
    const mHand0 = mL[4][1] + .1, mHand1 = mHand0 + .5, mBuild = w('maya', 'builds'), mFirst = w('maya', 'first');
    const mSame2 = w('maya', 'same', 1), mSame3 = w('maya', 'same', 2), mDiff = w('maya', 'difference');
    const whip0 = B.alex.end + .12, whip1 = whip0 + .55;

    // camera
    const keys = [[t0, [1000, 650, 1.12]], [aTypes - .6, [900, 680, 1.2]], [aTypes + .6, [790, 700, 1.5]], [aThrow0, [800, 700, 1.52]], [aBuild + .2, [1080, 650, 1.2]],
      [whip0, [1090, 650, 1.25]], [whip1, [2960, 690, 1.3]], [mL[0][0], [2930, 710, 1.5]], [mHand0, [2945, 710, 1.53]], [mBuild + .3, [3290, 650, 1.2]],
      [mSame2, [3270, 650, 1.22]], [mSame2 + 1.5, [2100, 600, .53]], [tEnd - 1.4, [2120, 600, .55]], [tEnd, [2260, 700, .95]]];
    const shk = (t > aLib && t < aLib + .3) ? shakeXY(t, 9) : [0, 0];
    const cm = cam(t, keys, shk);

    // clock: normal tick, then two hours whirl round
    const whirl = easeOut(seg(t, aHours, aGives)) * 2 * TAU;
    office(t, { hour: 1.2 + whirl / 12, minute: 4.1 + whirl + t * .01 });

    // ---- Alex's side ----
    const lecA = lectern(655, FY, 'lecA');
    const boardF = { charts: seg(t, aCharts, aCharts + 1.2), fake: seg(t, aFake, aFake + .3), months: seg(t, aMonths, aMonths + .6), lib: seg(t, aLib, aLib + .35),
      pieRot: (t - aLib) * 2.5 * Math.exp(-Math.max(0, t - aLib) * .6), patches: [0, 1, 2].map(i => seg(t, aHours + .2 + i * .4, aHours + .5 + i * .4)), tilt: .06 * easeOut(seg(t, aGives, aGives + .5)) + .03 * spring(t, aGives + .5, 5, 14) };
    alexBoard(t, boardF);
    // Alex's scrap: on the lectern → written → tossed → caught → dropped when Clawd runs → on the floor
    const scrapK = [seg(t, aMake, aDash)];
    let scrap = null;
    const cA = 1000, handA = [cA - 6.9 * 24, FY - 5.4 * 24];
    if (t < aThrow0) scrap = [lecA[0], lecA[1] - 6, -.08, 1];
    else if (t < aThrow1) { const k = seg(t, aThrow0, aThrow1), p = arcPt([lecA[0], lecA[1] - 6], handA, 90, k); scrap = [p[0], p[1], -.08 + k * 6.5, 1]; }
    else if (t < aBuild) scrap = null;   // in Clawd's claw
    else { const k = easeIn(seg(t, aBuild, aBuild + .45)), p = arcPt(handA, [900, FY + 14], -20, k); scrap = [p[0], p[1], lerp(.2, 1.4, k), 1]; }
    const diffK = Math.sin(Math.PI * seg(t, mDiff, mDiff + 1.2));
    if (scrap) slip(scrap[0], scrap[1], 50, 30, scrap[2], scrapK, 'scrapA', { sw: .8, lw: 1.3, lens: [.9], glowK: diffK * .9, sc: 1 + .5 * diffK });

    const writingA = t > aMake - .3 && t < aDash + .05;
    const aMood = navMood(t, [[0, 'neutral'], [aTypes - .3, 'determined'], [aFake + .25, 'confused'], [aLib + .3, 'surprised'], [aHours + .1, 'stern'], [aGives, 'sad']]);
    const jab = t > aHours + .1 && t < aGives - .1;
    alex(560, FY, 19, { ...aMood, view: 'q', seed: 3,
      ...(writingA ? { aR: -.75 + .06 * Math.sin(t * 24), lookY: .7, lookX: .6 } : {}),
      ...(t > aThrow0 - .1 && t < aThrow1 + .2 ? { aR: lerp(-.75, .1, Math.sin(Math.PI * seg(t, aThrow0 - .1, aThrow1 + .2))) } : {}),
      ...(jab ? { aR: .15 + .12 * Math.sin((t - aHours) * 14), point: 'R' } : {}),
      handR: writingA ? (s, sw, up) => { push(); rotate(up + .9); paint(ribbon([[0, 0], [0, -1.6 * s]], .22 * s, .08 * s), { wash: C.cream, ink: PAL.ink, sw: sw * .5 }); pop(); } : null });

    // Clawd on Alex's side (before the whip)
    if (t < whip1) {
      const holding = t >= aThrow1 && t < aBuild;
      let x = cA, o;
      const cMood = emotions(t, [[0, 'happy', { lookX: .6 }], [aTypes, 'excited', { lookX: .5 }], [aThrow1 + .05, 'excited', { lookX: .7, lookY: .5, emote: '!' }], [aCharts, 'determined'], [aFake + .5, 'happy'], [aLib + .3, 'proud'], [aHours + .1, 'nervous'], [aGives + .1, 'sad', { lookX: .8 }]]);
      if (t < aBuild) o = { ...cMood, flip: true, aR: holding ? .55 : (t > aThrow0 ? lerp(.2, .8, seg(t, aThrow0, aThrow1)) : .2), armR: holding ? slipHook(scrapK, 'scrapHeld', { lens: [.9], w: 1.6, h: 1.0 }) : null, ...take(t, aThrow1, .8) };
      else if (t < aBuild + .55) { const k = seg(t, aBuild, aBuild + .55); x = lerp(cA, 1105, ease(k)); o = { ...cMood, ...turn(t, aBuild, aBuild + .2, -.25, .25), walk: k * 3 }; }
      else {
        x = 1105;
        const painting = t > aCharts - .2 && t < aGives;
        o = { ...cMood, view: 'side', aL: painting ? .5 + .45 * Math.sin(t * 9) : -.3, armL: brushHook(t > aMonths ? C.rose : C.sea) };
        if (t > aGives - .1) o = { ...o, ...turn(t, aGives, aGives + .25, .25, -.25), aL: -.3, aR: -.3 };
      }
      clawd(x, FY, 24, { ...o, boilKey: 'clawdA' });
    }

    // ---- Maya's side ----
    const lecM = lectern(2875, FY, 'lecM');
    const bM = easel(3560, FY, 460, 330, 'mboard', '#E4E2DA');
    {
      const hk = ease(seg(t, mBuild + .55, mBuild + .95)), ck = ease(seg(t, mBuild + .75, mBuild + 1.05));
      if (hk > 0) { boilSeed('mhead'); paint(rectPts(bM.L + 14, bM.top + 12, (bM.w - 28) * hk, 42, 1), { wash: C.teal, fill: C.deep, fillOp: 50, tex: .5, ink: PAL.ink, sw: .6 }); }
      if (ck > 0) { boilSeed('mcard'); paint(rectPts(bM.L + 24, bM.top + 70, (bM.w - 48), (bM.h - 88) * ck, 1), { wash: C.cream, fill: '#FFFFFF', fillOp: 40, tex: .4, ink: PAL.ink, sw: .5 }); }
      const yb = bM.top + bM.h - 34;
      for (let i = 0; i < 8; i++) {
        const k = backOut(seg(t, mBuild + 1.0 + i * .12, mBuild + 1.35 + i * .12)); if (k <= 0) continue;
        const x = bM.L + 46 + i * 48, hs = [30 + 30 * hash(i * 2.2), 25 + 30 * hash(i * 3.1), 20 + 26 * hash(i * 4.7)].map(v => v * 1.3 * k);
        let yy = yb; [C.teal, C.ochre, C.rose].forEach((c, j) => { bar(x, yy, 34, hs[j], c, 'mbar' + i + j, { sw: .5 }); yy -= hs[j]; });
      }
      if (hk > 0) { boilSeed('maxis'); inkLine([[bM.L + 36, yb], [bM.L + bM.w - 30, yb]], 1.1 * hk, PAL.ink, 'ink', 0); }
    }
    bM.pop();
    // Maya's slip: written on the lectern → handed over → read → pinned to the board corner
    const mks = mL.map(([a, b]) => seg(t, a, b)), pinAt = [bM.L + 40, bM.top + 30];
    const hM = [3135 - 6.9 * 24, FY - 5.4 * 24];
    let ms = null;
    if (t < mHand0) ms = [lecM[0], lecM[1] - 18, -.1, 1];
    else if (t < mHand1) { const k = ease(seg(t, mHand0, mHand1)), p = arcPt([lecM[0], lecM[1] - 18], hM, 50, k); ms = [p[0], p[1], -.1 + .2 * k, 1]; }
    else if (t < mBuild + .35) ms = null;
    else { const k = ease(seg(t, mBuild + .35, mBuild + .6)), p = arcPt([3250 + 6 * 24, FY - 7 * 24], pinAt, 80, k); ms = [p[0], p[1], lerp(.1, -.08, k), 1]; }
    if (ms) slip(ms[0], ms[1], 64, 92, ms[2], mks, 'slipM', { sw: .8, lw: 1.1, seed: 4, glowK: diffK * .9, sc: 1 + .45 * diffK });
    if (t > mBuild + .6) pin(pinAt[0], pinAt[1] - 34, C.rose, seg(t, mBuild + .6, mBuild + .8), 'mpin');

    const writingM = t > mWrites - .1 && t < mHand0;
    const mMood = navMood(t, [[0, 'neutral'], [mWrites - .3, 'determined'], [mFirst + .1, 'proud'], [mSame2 + .3, 'happy']]);
    nav(2780, FY, 19, { ...mMood, view: 'q', seed: 5,
      ...(writingM ? { aR: -.75 + .05 * Math.sin(t * 22), lookY: .7, lookX: .6, brows: 'soft' } : {}),
      ...(t > mHand0 - .1 && t < mHand1 + .3 ? { aR: lerp(-.75, -.15, Math.sin(Math.PI * seg(t, mHand0 - .1, mHand1 + .3))) } : {}),
      handR: writingM ? (s, sw, up) => { push(); rotate(up + .9); paint(ribbon([[0, 0], [0, -1.6 * s]], .22 * s, .08 * s), { wash: C.ochreLt, ink: PAL.ink, sw: sw * .5 }); pop(); } : null });

    // Clawd on Maya's side (after the whip): the same Clawd trots in
    if (t >= whip1) {
      const enter0 = mSame, enter1 = mSame + 2.0, xM = 3135;
      let x, o;
      const cMood = emotions(t, [[0, 'happy'], [mL[0][0], 'thinking', { lookX: .6, lookY: .4 }], [mHand1, 'determined', { lookX: .7, lookY: .5 }], [mFirst + .05, 'excited'], [mSame2 + .1, 'happy'], [mSame3 + .3, 'thinking'], [mDiff, 'idea']]);
      if (t < enter1) { const k = seg(t, enter0, enter1); x = lerp(2120, xM, ease(k)); o = { ...cMood, view: 'side', walk: (x - 2120) / 70 }; }
      else if (t < mBuild) {
        x = xM;
        const nod = ring(t, mL.map(l => l[0] + .2), 7, 16) * .08;
        o = { ...cMood, ...turn(t, enter1, enter1 + .25, .25, -.25), dy: -Math.abs(nod) * 4, aR: t > mHand1 ? .55 : .2, armR: t > mHand1 ? slipHook(mks, 'slipHeld', { w: 1.6, h: 2.2 }) : null, ...(t > mHand1 - .05 ? take(t, mHand1, .5) : {}) };
      } else if (t < mSame2) {
        const k = seg(t, mBuild, mBuild + .4); x = lerp(xM, 3240, ease(k));
        const painting = t > mBuild + .5;
        const hop = jump(t, mFirst + .35, mFirst + .8, 2);
        o = { ...cMood, ...(t < mBuild + .2 ? turn(t, mBuild, mBuild + .2, -.25, .25) : { view: 'side' }), walk: k * 3, dy: hop.dy, sq: hop.sq,
          aL: painting && t < mFirst + .2 ? .5 + .5 * Math.sin(t * 10) : (t < mBuild + .45 ? .8 : .1), armL: t < mBuild + .45 ? null : brushHook(C.teal) };
      } else {
        const k = seg(t, mSame2, mSame2 + 1.2); x = lerp(3240, 2250, ease(k));
        if (t < mSame2 + 1.2) o = { ...cMood, view: 'side', flip: true, walk: (3240 - x) / 70 };
        else {
          const lk = t < mSame3 + .9 ? -1 : t < mDiff ? 1 : 0;
          o = { ...cMood, view: 'front', lookX: lerp(0, lk, .9), aL: .2, aR: .2 };
        }
      }
      clawd(x, FY, 24, { ...o, boilKey: 'clawdM' });
    }
    camEnd();
    streaks(Math.sin(Math.PI * seg(t, whip0, whip1)), 'whip', [mixCol(C.teal, PAL.ink, .2), C.ochreDk, C.cream]);
    chartBorder(C, false);
    seamIn('wipe', lt);
    seamOut('page', lt, dur, { col: C.cream });
  }

  // 2. Three parts: the wall chart. What (an X), why (the dark lighthouse), how you'll know (the lamp lit).
  function threeParts(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tThree = w('three', 'three'), tWhat = w('three', 'what'), tGuess = w('three', 'guesses'), tConf = w('three', 'confidently');
    const tWhy = w('three', 'why'), tUnd = w('three', 'understands'), tKnow = w('three', 'know'), tSkip = w('three', 'skip'), tCheck = w('three', 'check');
    const cm = cam(t, [[t0, [960, 530, 1.0]], [tWhat, [940, 520, 1.04]], [tGuess, [900, 520, 1.02]], [tWhy, [1000, 490, 1.07]], [tKnow + .5, [1010, 480, 1.08]], [tEnd, [980, 520, 1.03]]], (t > tGuess + .55 && t < tGuess + .75) ? shakeXY(t, 5) : [0, 0]);
    // wall and floor
    bg('twall', rectPts(-400, -400, 2720, 1300), { wash: mixCol(C.cream, C.ochreLt, .3), fill: C.ochreLt, fillOp: 60, bleed: .2, tex: .6, ink: null });
    bg('tfloor', rectPts(-400, FY + 30, 2720, 600), { wash: mixCol(C.ochre, C.cream, .4), fill: C.ochreDk, fillOp: 60, tex: .7, ink: null });
    for (let i = 0; i < 2; i++) { boilSeed('tfl' + i); inkLine([[-400 + i * 1360, FY + 30], [-400 + (i + 1) * 1360, FY + 30]], 2, PAL.ink, 'ink', 0); }
    // the chart in its frame
    const X0 = 330, Y0 = 100, CW = 1260, CH = 640;
    bg('tframe', rectPts(X0 - 26, Y0 - 26, CW + 52, CH + 52, 1), { wash: C.ochreDk, fill: PAL.ink, fillOp: 40, tex: .6, ink: PAL.ink, sw: 1.2 });
    bg('tsea', rectPts(X0, Y0, CW, CH, 1), { wash: C.pale, fill: C.sea, fillOp: 80, bleed: .2, tex: .7, border: .6, ink: PAL.ink, sw: .7 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI; boilSeed('trh' + i); inkLine([[960 - Math.cos(a) * 560, 420 - Math.sin(a) * 280], [960 + Math.cos(a) * 560, 420 + Math.sin(a) * 280]], .4, mixCol(C.pale, C.teal, .5), 'inkfine', 0); }
    // night falls round the lighthouse on "why" (so the lamp can shine)
    const dk = ease(seg(t, tWhy + .1, tWhy + 1.0));
    const IX = 1180, IY = 470;
    if (dk > 0) bg('tdark', blobPts(IX + 20, IY - 110, 330 * (.6 + .4 * dk), 6, .15), { fill: C.deep, fillOp: 215 * dk, bleed: .2, tex: .6, border: .6, ink: null });
    bg('tisland', blobPts(IX, IY + 30, 150, 3, .22, 26).map(([x, y]) => [x, IY + 30 + (y - IY - 30) * .55]), { wash: mixCol(C.sap, C.ochreLt, .35), fill: C.sap, fillOp: 90, tex: .6, ink: PAL.ink, sw: .9 });
    bg('tisland2', blobPts(560, 620, 70, 8, .25, 18).map(([x, y]) => [x, 620 + (y - 620) * .5]), { wash: mixCol(C.sap, C.ochreLt, .45), ink: PAL.ink, sw: .7 });
    // lighthouse
    const LX = IX + 30, LB = IY + 20;
    bg('tlh', [[LX - 26, LB], [LX + 26, LB], [LX + 16, LB - 150], [LX - 16, LB - 150]], { wash: C.cream, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 2; i++) bg('tlhs' + i, [[LX - 24 + i * 5, LB - 30 - i * 55], [LX + 24 - i * 5, LB - 30 - i * 55], [LX + 22 - i * 5, LB - 55 - i * 55], [LX - 22 + i * 5, LB - 55 - i * 55]], { wash: C.rose, ink: null });
    const lit = ease(seg(t, tKnow + .35, tKnow + .8));
    if (lit > 0) { boilSeed('tbeam'); glow(LX, LB - 172, 260 * lit, C.ochreLt, 1); for (const s of [-1, 1]) paint([[LX, LB - 172], [LX + s * 420 * lit, LB - 232], [LX + s * 420 * lit, LB - 120]], { wash: C.ochreLt, washOp: 110, ink: null }); }
    bg('tlamp', rectPts(LX - 20, LB - 190, 40, 40, 1), { wash: lit > .3 ? mixCol(C.ochreLt, C.cream, .3) : mixCol(C.deep, C.teal, .3), ink: PAL.ink, sw: 1 });
    bg('tlroof', [[LX - 28, LB - 188], [LX + 28, LB - 188], [LX, LB - 222]], { wash: C.rose, ink: PAL.ink, sw: 1 });
    if (lit > 0) { boilSeed('tglow2'); glow(LX, LB - 172, 120, '#FFE3A0', lit); }
    // the storm (why) clears when the lamp lights
    const storm = seg(t, tWhy + .2, tWhy + .8) * (1 - seg(t, tKnow + .5, tKnow + 1.2));
    if (storm > .02) {
      const sx = LX - 10, sy = LB - 300;
      boilSeed('tstorm'); paint(blobPts(sx, sy, 140 * backOut(storm), 11, .25, 22).map(([x, y]) => [x, sy + (y - sy) * .55]), { wash: '#6F7A86', fill: PAL.ink, fillOp: 60, tex: .5, ink: PAL.ink, sw: .8 });
      for (let i = 0; i < 6; i++) { const rx = sx - 60 + i * 24, ry = sy + 40 + frac(t * 1.6 + hash(i)) * 90; boilSeed('train' + i); inkLine([[rx, ry], [rx - 8, ry + 22]], 1, mixCol(C.pale, C.sea, .3), 'inkfine', 0); }
    }
    // the X (what)
    const xk = seg(t, tWhat + .5, tWhat + 1.0);
    if (xk > 0) { boilSeed('tx'); const s = 34, ox = IX - 60, oy = IY + 40, k1 = seg(xk, 0, .5), k2 = seg(xk, .5, 1), XC = { wash: '#A8423F', ink: PAL.ink, sw: .8 };
      paint(ribbon([[ox - s, oy - s], [lerp(ox - s, ox + s, k1), lerp(oy - s, oy + s, k1)]], 15, 11), XC);
      if (k2 > 0) paint(ribbon([[ox + s, oy - s], [lerp(ox + s, ox - s, k2), lerp(oy - s, oy + s, k2)]], 15, 11), XC); }
    // three pins, waiting in the chart's margin, then each flies to its mark
    const dests = [[IX - 60 + 48, IY + 40 - 30, tWhat], [LX - 40, LB - 60, tWhy], [LX + 40, LB - 150, tKnow]];
    dests.forEach(([dx, dy, tt], i) => {
      const home = [X0 + 50 + i * 44, Y0 + 60], k = ease(seg(t, tt, tt + .5));
      const p = arcPt(home, [dx, dy], 120, k);
      pin(p[0], p[1], C.ochre, seg(t, tThree + i * .18, tThree + i * .18 + .3), 'tpin' + i, 1.5);
      if (t > tSkip && i === 2) { const pk = Math.sin(Math.PI * seg(t, tSkip - .2, tSkip + .8)); if (pk > 0) { boilSeed('tpinring'); inkLine(ellPts(dx, dy - 30, 40 + 20 * pk, 40 + 20 * pk, 20).concat([[dx + 40 + 20 * pk, dy - 30]]), 2.5 * pk, C.ochre, 'ink', .5); } }
    });
    // Clawd's wrong pin: thrown confidently into open sea, then it fades on "why"
    const wp0 = [1630 - 7 * 30, FY + 40 - 6.2 * 30], wp1 = [690, 300];
    const wk = seg(t, tGuess + .1, tGuess + .6), wf = 1 - seg(t, tWhy - .2, tWhy + .3);
    if (wk > 0 && wf > 0) { const p = arcPt(wp0, wp1, 220, ease(wk)); pin(p[0], p[1] + 30 * seg(t, tWhy - .2, tWhy + .3), C.rose, wf, 'twrong', 1.7); }

    // characters
    const mMood = navMood(t, [[0, 'neutral'], [tWhat - .1, 'determined'], [tConf + .2, 'stern'], [tWhy + .2, 'neutral'], [tUnd + .2, 'happy'], [tKnow + .6, 'proud'], [tCheck, 'happy']]);
    const pointing = (t > tWhat - .1 && t < tWhat + 1.6) || (t > tWhy - .05 && t < tWhy + 1.4) || (t > tKnow - .1 && t < tKnow + 1.2);
    nav(250, FY + 40, 28, { ...mMood, view: 'q', seed: 2, ...(pointing ? { point: 'R', aR: .42 + .03 * Math.sin(t * 3) } : {}) });
    const cMood = emotions(t, [[0, 'happy', { lookX: .8 }], [tThree + .2, 'excited'], [tGuess - .1, 'cool'], [tConf + .5, 'smug'], [tWhy + .1, 'surprised', { lookX: 1, lookY: -.4 }], [tUnd + .1, 'idea', { lookX: 1, lookY: -.3 }], [tKnow + .6, 'starstruck'], [tCheck - .1, 'proud']]);
    const throwA = t > tGuess - .2 && t < tGuess + .4 ? lerp(-.3, 1.3, Math.sin(Math.PI * seg(t, tGuess - .2, tGuess + .4))) : .2;
    const spy = t > tCheck - .5;
    clawd(1630, FY + 40, 30, { ...cMood, flip: true, aR: spy ? lerp(.2, .45, ease(seg(t, tCheck - .5, tCheck))) : throwA, aL: .15,
      armR: spy ? (u, sw) => navProp('spyglass', u * .7, sw, { ext: ease(seg(t, tCheck - .3, tCheck + .2)) }) : null, boilKey: 'c3' });
    const at = toScreen(1630, FY + 40 - 5 * 30);
    camEnd();
    chartBorder(C, false);
    seamIn('page', lt, { col: C.cream });
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1] });
  }

  // 3. Lanes: the eager dinghy repaints every boat; buoys build a channel; inside it Clawd fixes just one pennant.
  function lanes(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tEager = w('lanes', 'eager'), tButton = w('lanes', 'button'), tRedesign = w('lanes', 'redesign'), tCons = w('lanes', 'constraints');
    const tD1 = w('lanes', "don't"), tD2 = w('lanes', "don't", 1), tUse = w('lanes', 'use'), tIn = w('lanes', 'inside'), tCross = w('lanes', 'cross');
    const r0 = tRedesign - .1;
    const dx = kf(t, [[t0, 700], [r0, 720], [r0 + .55, 1700], [r0 + 1.2, 1020], [r0 + 1.7, 820], [tCons + .6, 600], [tIn, 600], [tCross - .5, 1440], [tCross, 1520], [tCross + .45, 1470]]);
    const bumpK = spring(t, tCross, 5, 16);
    const dyy = kf(t, [[t0, 830], [r0, 830], [r0 + .55, 770], [r0 + 1.2, 870], [r0 + 1.7, 830], [tCross - .5, 830], [tCross, 902], [tCross + .45, 845]]) + 10 * Math.sin(t * 2.4);
    const sh = (t > tCross && t < tCross + .3) ? shakeXY(t, 10) : [0, 0];
    cam(t, [[t0, [1000, 640, 1.1]], [r0, [960, 640, 1.1]], [tCons, [980, 660, 1.12]], [tIn, [1000, 660, 1.12]], [tCross, [1230, 690, 1.2]], [tEnd, [1250, 700, 1.24]]], sh);
    // sky, shore, sea
    bg('lsky', rectPts(-400, -400, 2720, 900), { wash: mixCol(C.pale, C.cream, .45), fill: C.ochreLt, fillOp: 50, bleed: .3, tex: .5, ink: null });
    bg('lsun', blobPts(1500, 200, 200, 4, .15), { fill: C.ochreLt, fillOp: 90, bleed: .3, tex: .5, ink: null });
    bg('lshore', [[-400, 470], [200, 430], [700, 455], [1200, 420], [1800, 450], [2320, 430], [2320, 500], [-400, 500]], { wash: mixCol(C.sap, C.teal, .3), fill: C.teal, fillOp: 60, tex: .6, ink: PAL.ink, sw: .8, curv: .4 });
    bg('lsea', rectPts(-400, 495, 2720, 900), { wash: C.sea, fill: C.teal, fillOp: 80, bleed: .15, tex: .7, ink: null });
    for (let i = 0; i < 16; i++) { const y = 560 + (i % 8) * 60, x = ((i * 293 + t * 40 * (1 + i % 3)) % 2600) - 400; boilSeed('lwave' + i); inkLine([[x, y], [x + 40, y - 8], [x + 80, y]], .8, mixCol(C.sea, C.cream, .5), 'inkfine', .6); }
    // moored boats; the eager Clawd paints every hull violet, then the violet drains away on "constraints"
    const passT = [r0 + .15, r0 + .38, r0 + .52], undo = seg(t, tCons, tCons + .8), fixK = seg(t, tIn + .9, tIn + 1.2);
    [860, 1200, 1540].forEach((bx, i) => {
      const by = 560 + 3 * Math.sin(t * 1.6 + i), vk = seg(t, passT[i], passT[i] + .2) * (1 - undo);
      const hull = mixCol(i === 1 ? C.cream : mixCol(C.cream, C.sea, .3), VIOLET, vk);
      boilSeed('lmast' + i); inkLine([[bx, by - 20], [bx, by - 190]], 3, C.ochreDk, 'ink', 0);
      const pc = i === 1 ? mixCol(C.rose, C.ochre, fixK) : C.ochre, fl = Math.sin(t * 4 + i) * 6;
      bg('lpen' + i, [[bx + 2, by - 188], [bx + 70, by - 172 + fl], [bx + 2, by - 150]], { wash: pc, ink: PAL.ink, sw: .8 });
      bg('lhull' + i, [[bx - 115, by - 30], [bx + 115, by - 30], [bx + 85, by + 20], [bx - 85, by + 20]], { wash: hull, fill: mixCol(hull, PAL.ink, .2), fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
      bg('lstripe' + i, [[bx - 108, by - 20], [bx + 108, by - 20], [bx + 102, by - 10], [bx - 102, by - 10]], { wash: mixCol(C.teal, VIOLET, vk), ink: null });
    });
    // violet paint flung during the frenzy
    for (let i = 0; i < 7; i++) {
      const ts = r0 + .08 + i * .18, k = seg(t, ts, ts + .35); if (k <= 0 || k >= 1) continue;
      const p = arcPt([lerp(720, 1700, (i + .5) / 7), 800], [860 + (i % 3) * 340 + 30 * hash(i), 560], 140, k);
      boilSeed('lfling' + i); paint(blobPts(p[0], p[1], 16, i, .3, 12), { wash: VIOLET, ink: null });
    }
    // jetty + Maya
    bg('ljetty', rectPts(-400, 700, 800, 38, 1), { wash: C.ochreDk, fill: PAL.ink, fillOp: 40, tex: .6, ink: PAL.ink, sw: 1 });
    for (const px of [-120, 120, 360]) bg('lpost' + px, rectPts(px - 14, 730, 28, 220, 1), { wash: mixCol(C.ochreDk, PAL.ink, .3), ink: PAL.ink, sw: .8 });
    const mMood = navMood(t, [[0, 'neutral'], [tButton - .2, 'determined'], [r0 + .5, 'surprised'], [tCons - .2, 'determined'], [tIn + .3, 'happy'], [tCross + .15, 'surprised']]);
    const mPoint = (t > tButton - .25 && t < r0 + .3) ? { point: 'R', aR: .55 } : {};
    const tossK = [tD1, tD2, tUse].map(tt => Math.sin(Math.PI * seg(t, tt - .35, tt + .15)));
    const toss = Math.max(...tossK);
    nav(250, 702, 19, { ...mMood, view: 'q', seed: 7, ...mPoint, ...(toss > 0 ? { aR: lerp(-1.1, .7, toss) } : {}) });
    // buoys: a pair pops up on each "don't" / "use"; far row, then the dinghy, then the near row
    const pairs = [[tD1, 760], [tD2, 1140], [tUse, 1520]];
    const buoy = (x, y, k, col, key) => {
      if (k <= .01) return; const s = backOut(k), bob = 5 * Math.sin(t * 2.6 + x * .01);
      boilSeed(key);
      paint(ellPts(x, y + 6 + bob, 40, 10, 14), { fill: C.teal, fillOp: 120, bleed: .2, tex: .4, ink: null });
      paint([[x - 30 * s, y + bob], [x + 30 * s, y + bob], [x + 18 * s, y - 50 * s + bob], [x - 18 * s, y - 50 * s + bob]], { wash: col, fill: mixCol(col, PAL.ink, .2), fillOp: 50, ink: PAL.ink, sw: .9 });
      paint(rectPts(x - 26 * s, y - 24 * s + bob, 52 * s, 10 * s), { wash: C.cream, ink: null });
      inkLine([[x, y - 50 * s + bob], [x, y - 78 * s + bob]], 1.6, PAL.ink, 'ink', 0);
      paint(ellPts(x, y - 82 * s + bob, 8 * s, 8 * s, 10), { wash: col, ink: PAL.ink, sw: .6 });
    };
    const lineK = seg(t, tUse + .4, tUse + 1.2);
    if (lineK > 0) { boilSeed('lfar'); for (let i = 0; i < 18 * lineK; i++) { const x = 560 + i * 60; inkLine([[x, 742], [x + 30, 742]], 2, C.ochre, 'ink', 0); } }
    pairs.forEach(([tt, x], i) => buoy(x, 740, seg(t, tt, tt + .35), C.ochre, 'lbf' + i));
    // the dinghy with Clawd and a paint pot
    {
      const rot = .06 * Math.sin(t * 3) + .12 * bumpK - (t > r0 && t < r0 + 1.8 ? .1 * Math.sin((t - r0) * 7) : 0);
      const cMood = emotions(t, [[0, 'happy', { lookX: -.5 }], [tEager - .1, 'excited'], [r0, 'playful'], [tCons + .2, 'surprised', { lookX: -.6 }], [tD1 + .3, 'neutral', { lookX: -.4 }], [tIn, 'happy'], [tCross + .05, 'dizzy']]);
      push(); translate(dx, dyy); rotate(rot); translate(-dx, -dyy);
      boilSeed('lwake'); if (t > r0 && t < r0 + 1.9 || (t > tIn && t < tCross + .3)) for (let k = 1; k < 4; k++) inkLine([[dx - 150 - k * 50, dyy + 10], [dx - 110 - k * 50, dyy + 4]], 1.2, C.cream, 'inkfine', 0);
      const back = t > r0 + .55 && t < r0 + 1.7 || (t > tCons && t < tCons + .6);
      clawd(dx - 10, dyy + 4, 19, { ...cMood, noLegs: true, noShadow: true, flip: back, aR: t > r0 && t < r0 + 1.7 ? .5 + .6 * Math.sin(t * 12) : (t > tIn + .7 && t < tIn + 1.3 ? 1.0 : .25), aL: .3,
        armR: brushHook(t > tIn ? C.ochre : VIOLET), boilKey: 'cl' });
      // pot
      const potC = t > tIn ? C.ochre : VIOLET;
      bg('lpot', rectPts(dx + 70, dyy - 50, 40, 36, 1), { wash: mixCol(C.ochreDk, C.cream, .3), ink: PAL.ink, sw: .8 });
      bg('lpotp', ellPts(dx + 90, dyy - 50, 20, 6, 10), { wash: potC, ink: PAL.ink, sw: .5 });
      bg('lhullD', [[dx - 150, dyy - 34], [dx + 150, dyy - 40], [dx + 118, dyy + 18], [dx - 110, dyy + 20]], { wash: C.rose, fill: mixCol(C.rose, PAL.ink, .25), fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.1, curv: .15 });
      bg('lhullDs', [[dx - 146, dyy - 30], [dx + 146, dyy - 36], [dx + 140, dyy - 24], [dx - 140, dyy - 20]], { wash: C.cream, ink: null });
      pop();
      if (t > tCross && t < tCross + .6) { const k = seg(t, tCross, tCross + .6); boilSeed('lslosh'); for (let i = 0; i < 4; i++) { const p = arcPt([dx + 90, dyy - 55], [dx + 40 + i * 50, dyy - 20], 120, k); paint(blobPts(p[0], p[1], 14, i, .3, 10), { wash: C.ochre, ink: null }); } }
    }
    if (lineK > 0) { boilSeed('lnear'); for (let i = 0; i < 18 * lineK; i++) { const x = 560 + i * 60; inkLine([[x, 952], [x + 30, 952]], 2.4, C.rose, 'ink', 0); } }
    pairs.forEach(([tt, x], i) => buoy(x, 950 + (i === 2 ? 14 * bumpK : 0), seg(t, tt + .12, tt + .47), C.rose, 'lbn' + i));
    const sp = toScreen(dx + 90, dyy - 60);
    camEnd();
    chartBorder(C, false);
    seamIn('iris', lt, { cx: W * .45, cy: H * .72 });
    seamOut('splash', lt, dur, { cx: sp[0], cy: sp[1], cols: [C.ochre, C.rose, C.teal], seed: 3 });
  }

  // 4. Levels: a gangway of four steps (0-3 pips). Wish, goal, spec, blueprint. Level two is the sweet spot.
  function levels(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const lv = [w('levels', 'level', 1), w('levels', 'level', 2), w('levels', 'level', 3), w('levels', 'level', 4)];
    const tZero = w('levels', 'zero'), tAdd = w('levels', 'add'), tBtn = w('levels', 'button'), tCols = w('levels', 'columns');
    const tBlue = w('levels', 'blueprint'), tUsually = w('levels', 'usually'), tMost = w('levels', 'most'), tTwo2 = w('levels', 'two', 1), tSweet = w('levels', 'sweet');
    const SX = i => 570 + 380 * i, SY = i => 900 - 110 * i;
    cam(t, [[t0, [820, 760, 1.2]], [lv[0] + .3, [760, 730, 1.2]], [lv[1], [880, 700, 1.2]], [lv[2], [1150, 640, 1.2]], [lv[3], [1400, 560, 1.12]], [tMost, [1300, 580, 1.1]], [tSweet, [960, 650, 1.1]], [tEnd, [950, 660, 1.08]]]);
    // the ship's side behind the gangway
    bg('vsky', rectPts(-400, -400, 2720, 900), { wash: mixCol(C.pale, C.cream, .4), fill: C.sea, fillOp: 40, bleed: .3, tex: .5, ink: null });
    bg('vhull', [[-400, 180], [2320, 120], [2320, 1500], [-400, 1500]], { wash: mixCol(C.deep, C.teal, .45), fill: C.deep, fillOp: 70, bleed: .1, tex: .7, ink: PAL.ink, sw: 1 });
    bg('vstripe', [[-400, 230], [2320, 170], [2320, 205], [-400, 265]], { wash: C.ochre, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 5; i++) { const px = 180 + i * 420, py = 340 - i * 9; bg('vport' + i, ellPts(px, py, 44, 44, 20), { wash: C.ochreDk, ink: PAL.ink, sw: 1 }); bg('vportg' + i, ellPts(px, py, 30, 30, 18), { wash: mixCol(C.pale, C.sea, .3), ink: PAL.ink, sw: .6 }); }
    bg('vquay', rectPts(-400, 1000, 2720, 500), { wash: mixCol(C.ochre, C.cream, .4), fill: C.ochreDk, fillOp: 60, tex: .7, ink: null });
    for (let i = 0; i < 2; i++) { boilSeed('vq' + i); inkLine([[-400 + i * 1360, 1000], [-400 + (i + 1) * 1360, 1000]], 2, PAL.ink, 'ink', 0); }
    // steps
    for (let i = 0; i < 4; i++) {
      const x = SX(i) - 190, y = SY(i);
      bg('vstep' + i, rectPts(x, y, 380, 1000 - y + 10, 1), { wash: mixCol(C.ochre, C.cream, .25 - i * .04), fill: C.ochreDk, fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.1 });
      bg('vtread' + i, rectPts(x - 6, y - 4, 392, 20, 1), { wash: C.ochreDk, ink: PAL.ink, sw: .8 });
      for (let p = 0; p < i; p++) bg('vpip' + i + p, ellPts(x + 190 + (p - (i - 1) / 2) * 44, y + 70, 13, 13, 12), { wash: i === 2 ? C.rose : C.cream, ink: PAL.ink, sw: .8 });
      if (i === 0) { boilSeed('vpip0'); inkLine(ellPts(x + 190, y + 70, 13, 13, 14).concat([[x + 203, y + 70]]), 1.2, C.cream, 'ink', .5); }
    }
    // Clawd's path: ground → step 0 → 1 → 2 → 3 → back to 2
    const hops = [[lv[0] - .1, 0], [lv[1] - .05, 1], [lv[2] - .1, 2], [lv[3] - .1, 3], [tMost + .5, 2]];
    let ci = -1; for (const [tt, s] of hops) if (t >= tt + .4) ci = s;
    let cx, cy, hop = { dy: 0, sq: 0 };
    const pos = i => i < 0 ? [300, 1000] : [SX(i) - 40, SY(i)];
    const active = hops.find(([tt]) => t >= tt && t < tt + .4);
    if (active) {
      const [tt, s] = active, prev = hops.indexOf(active) === 0 ? -1 : hops[hops.indexOf(active) - 1][1];
      const k = seg(t, tt, tt + .4), p = arcPt(pos(prev), pos(s), 90, ease(k)); cx = p[0]; cy = p[1];
      hop = { dy: 0, sq: -.14 * Math.sin(Math.PI * k) };
    } else { [cx, cy] = pos(ci); hop = jump(t, 0, 0, 0); const land = hops.filter(([tt]) => t >= tt + .4).pop(); if (land) hop = { dy: 0, sq: .2 * Math.exp(-8 * (t - land[0] - .4)) * Math.cos(20 * (t - land[0] - .4)) }; }
    // props on the steps
    // 0: a dream puff
    const pk = seg(t, tZero, tZero + .5) * (1 - seg(t, lv[1], lv[1] + .5));
    if (pk > 0) { const px = SX(0) + 40, py = SY(0) - 300 + 8 * Math.sin(t * 2); bg('vpuff', blobPts(px, py, 90 * backOut(pk), 2, .22, 24).map(([x, y]) => [x, py + (y - py) * .7]), { wash: C.cream, fill: C.pale, fillOp: 80, tex: .5, ink: PAL.ink, sw: .8 }); for (let i = 0; i < 3; i++) bg('vpuffd' + i, ellPts(px - 70 + i * 22, py + 80 + i * 26, 14 - i * 3, 12 - i * 3, 10), { wash: C.cream, ink: PAL.ink, sw: .6 }); boilSeed('vspark'); emote('spark', px + 40, py - 20, 18, pk, t); }
    // 1: a one-line slip, and three different guesses juggled
    slip(SX(1) + 110, SY(1) - 14, 70, 40, .05, [1], 'vslip1', { lens: [.8] });
    const gk = seg(t, tAdd, tAdd + .4) * (1 - seg(t, lv[2] - .3, lv[2]));
    if (gk > 0) {
      const c = [SX(1) - 40, SY(1) - 220];
      [0, 1, 2].forEach(i => { const a = (t - tAdd) * 3.2 + i * TAU / 3, gx = c[0] + Math.cos(a) * 140 * gk, gy = c[1] + Math.sin(a) * 50 * gk - 20;
        if (i === 0) pie(gx, gy, 30 * gk, a, 1, 'vg0');
        else if (i === 1) bg('vg1', rectPts(gx - 28 * gk, gy - 24 * gk, 56 * gk, 48 * gk, 1), { wash: C.ochreDk, fill: PAL.ink, fillOp: 40, ink: PAL.ink, sw: .8 });
        else bg('vg2', rrPts(gx - 36 * gk, gy - 16 * gk, 72 * gk, 32 * gk, 12 * gk), { wash: C.rose, ink: PAL.ink, sw: .8 }); });
    }
    // 2: a four-line slip, then a neat button and a tidy file
    const lift = ease(seg(t, tTwo2 - .2, tTwo2 + .4)), sweet = seg(t, tSweet - .1, tSweet + .3);
    slip(SX(2) + 115 - 60 * lift, SY(2) - 30 - 220 * lift, 70 + 40 * lift, 80 + 46 * lift, .05 - .05 * lift, [1, 1, 1, 1], 'vslip2', { glowK: sweet * (.8 + .2 * Math.sin(t * 5)) });
    const bk = backOut(seg(t, tBtn, tBtn + .4)) * (1 - seg(t, tBlue - .2, tBlue));
    if (bk > 0) { const bx = SX(2) + 20, by = SY(2) - 250; bg('vbtn', rrPts(bx - 70 * bk, by - 26 * bk, 140 * bk, 52 * bk, 20 * bk), { wash: C.teal, fill: C.deep, fillOp: 50, ink: PAL.ink, sw: 1 }); boilSeed('vbtna'); inkLine([[bx, by - 14 * bk], [bx, by + 12 * bk]], 3, C.cream, 'ink', 0); inkLine([[bx - 10 * bk, by + 2 * bk], [bx, by + 12 * bk], [bx + 10 * bk, by + 2 * bk]], 3, C.cream, 'ink', 0); }
    const fk = backOut(seg(t, tCols, tCols + .4)) * (1 - seg(t, tBlue - .2, tBlue));
    if (fk > 0) { const fx = SX(2) + 170, fy = SY(2) - 250; bg('vfile', rectPts(fx - 40 * fk, fy - 50 * fk, 80 * fk, 100 * fk, 1), { wash: C.cream, ink: PAL.ink, sw: .8 }); boilSeed('vfilec'); for (let i = 1; i < 4; i++) inkLine([[fx - 40 * fk + i * 20 * fk, fy - 40 * fk], [fx - 40 * fk + i * 20 * fk, fy + 40 * fk]], .8, C.teal, 'inkfine', 0); }
    // Clawd (drawn before the blueprint so it buries him)
    const cMood = emotions(t, [[0, 'happy', { lookX: .6, lookY: -.3 }], [tZero + .1, 'confused'], [lv[1] + .4, 'neutral'], [tAdd + .1, 'dizzy'], [lv[2] + .4, 'thinking', { lookX: .6, lookY: .5 }], [tBtn, 'determined'], [tCols + .5, 'proud'], [lv[3] + .4, 'excited'], [tBlue + .1, 'scared'], [tUsually + .2, 'nervous'], [tMost + .9, 'happy'], [tSweet, 'love']]);
    const spin = t > tZero && t < lv[1] - .3 ? spinView((t - tZero) * 1.4) : {};
    clawd(cx, cy, 21, { ...cMood, ...spin, dy: hop.dy, sq: (cMood.sq || 0) + hop.sq, boilKey: 'cv' });
    // 3: the blueprint scroll unrolls down over Clawd, then rolls back up
    const un = ease(seg(t, tBlue - .3, tBlue + .5)) * (1 - ease(seg(t, tMost, tMost + .5)));
    if (un > 0) {
      const top = 90, len = 820 * un, x = SX(3) - 200;
      bg('vscroll', [[x, top], [x + 320, top - 10], [x + 340, top + len], [x - 10, top + len + 12]], { wash: C.cream, fill: C.ochreLt, fillOp: 60, tex: .7, ink: PAL.ink, sw: 1 });
      boilSeed('vscl'); for (let i = 0; i < Math.floor(len / 22); i++) inkLine([[x + 30, top + 26 + i * 22], [x + 30 + 240 * (.6 + .4 * hash(i)), top + 26 + i * 22]], .9, i % 5 ? PAL.ink : C.rose, 'inkfine', 0);
      bg('vroll', ellPts(x + 165, top + len + 6, 190, 28, 20), { wash: mixCol(C.cream, C.ochre, .3), ink: PAL.ink, sw: 1 });
      if (t > tUsually - .3) { boilSeed('vsweat'); emote('sweat', SX(3) + 140, SY(3) - 170, 22, seg(t, tUsually - .3, tUsually), t); }
    }
    // Maya on the quay
    const mMood = navMood(t, [[0, 'neutral'], [tZero + .2, 'confused'], [lv[1] + .3, 'thinking'], [lv[2] + .3, 'happy'], [tBlue, 'surprised'], [tMost, 'neutral'], [tSweet - .1, 'proud']]);
    nav(150, 1002, 20, { ...mMood, view: 'q', seed: 1, ...(t > tTwo2 - .3 ? { point: 'R', aR: .45 } : {}) });
    camEnd();
    chartBorder(C, false);
    seamIn('splash', lt, { cx: W * .55, cy: H * .5, cols: [C.ochre, C.rose, C.teal], seed: 3 });
    seamOut('page', lt, dur, { col: C.cream });
  }

  // 5. Ask for a plan first: stop, read the ten-line plan, fix one line. The same mistake after the build: the tower falls.
  function planShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tBuilt = w('plan', 'built'), tPlan = w('plan', 'plan'), tDont = w('plan', "don't"), tTell = w('plan', 'tell'), tRead = w('plan', 'read');
    const tCheap = w('plan', 'cheapest'), tWrong = w('plan', 'wrong'), tOne = w('plan', 'one'), tFix = w('plan', 'fix'), tFound = w('plan', 'found'), tCosts = w('plan', 'costs', 1), tAft = w('plan', 'afternoon');
    const topple = tCosts + .1;
    const sh = (t > topple + .3 && t < topple + .6) || (t > topple + .8 && t < topple + 1.0) ? shakeXY(t, 12) : [0, 0];
    cam(t, [[t0, [3250, 650, 1.2]], [tPlan, [3200, 660, 1.25]], [tTell, [3350, 640, 1.2]], [tRead - .2, [3380, 620, 1.2]], [tRead + .8, [3500, 560, 1.45]], [tFound - .1, [3510, 560, 1.47]], [tFound + .7, [4320, 640, 1.2]], [tEnd, [4340, 650, 1.26]]], sh);
    office(t, { sunK: ease(seg(t, tFound + .3, tAft + .6)), hour: 2.4, minute: 5 });
    lectern(2875, FY, 'plecM');
    // the plan sheet on Maya's easel
    const bM = easel(3560, FY, 460, 330, 'pboard', '#E4E2DA');
    const sk = ease(seg(t, tTell + .4, tTell + .9));
    const lineK = i => seg(t, tTell + .7 + i * .16, tTell + .9 + i * .16);
    const PX = 3450, PY = bM.top + 18, PW = 220, PH = 294;
    if (sk > 0) {
      bg('psheet', rectPts(PX, PY + (1 - sk) * 60, PW, PH * sk, 1), { wash: C.cream, fill: C.ochreLt, fillOp: 45, tex: .6, ink: PAL.ink, sw: .8 });
      pin(PX + PW / 2, PY + 10, C.rose, sk, 'ppin');
    }
    // the tenth line is the wrong assumption: it glows, gets struck through and replaced by a short fix
    const bad = 5, wrongK = seg(t, tWrong, tWrong + .4), strike = seg(t, tOne - .1, tOne + .3), fix = seg(t, tFix - .5, tFix + .2);
    if (sk >= 1) {
      for (let i = 0; i < 10; i++) {
        const y = PY + 76 + i * 21, L = (PW - 50) * (.55 + .45 * hash(i * 2.9 + 1)) * lineK(i);
        if (i === bad && wrongK > 0) { boilSeed('pbadg'); glow(PX + PW / 2, y, 90 * wrongK, C.rose, .6 * wrongK); paint(rectPts(PX + 18, y - 9, PW - 36, 18, 1), { wash: C.rose, washOp: 150 * wrongK, ink: null }); }
        if (L > 1) { boilSeed('pl' + i); inkLine([[PX + 24, y], [PX + 24 + L * .5, y + 1.5], [PX + 24 + L, y]], 1.4, PAL.ink, 'ink', .3); }
        if (i === bad && strike > 0) { boilSeed('pstrike'); inkLine([[PX + 16, y + 2], [PX + 16 + (PW - 32) * strike, y - 3]], 2.6, C.rose, 'ink', 0); }
        if (i === bad && fix > 0) { boilSeed('pfix'); inkLine([[PX + PW - 10, y - 16], [PX + PW - 10 + 90 * fix, y - 20]], 2.2, C.teal, 'ink', .3); }
      }
    }
    // the reading finger: a small ink marker gliding down the lines
    const rd = seg(t, tRead + .6, tCheap + .6);
    bM.pop();
    if (sk >= 1) crewText([{ txt: 'PLAN', ...(() => { const p = toScreen(PX + PW / 2, PY + 44); return { x: p[0], y: p[1] }; })(), size: 38 * CAM.zoom, col: C.deep, weight: 600, spacing: .18, k: seg(t, tTell + .5, tTell + .9) }]);
    // the tower "after the build"
    const TX = 4450;
    const blocks = [];
    for (let i = 0; i < 7; i++) blocks.push({ w: 170 - i * 8, h: 74, col: i === 0 ? C.rose : [C.teal, C.ochre, C.sea, C.ochreLt, C.teal, C.sap][i - 1] });
    let yb = FY;
    blocks.forEach((b, i) => {
      const fall = seg(t, topple + .15 + i * .05, topple + .75 + i * .05);
      let x = TX - b.w / 2 + (i % 2 ? 8 : -6), y = yb - b.h, rot = 0;
      if (i === 0) x += 150 * ease(seg(t, topple - .35, topple + .15));   // Clawd yanks the bottom block out
      else if (fall > 0) { x += (80 + i * 55) * easeOut(fall); y = lerp(y, FY - b.h * (.6 + .1 * (i % 3)) - (i > 3 ? 70 : 0) * (1 - fall), easeIn(fall)); rot = (.5 + i * .2) * easeIn(fall) * (i % 2 ? 1 : -1); }
      else { rot = .02 * Math.sin(t * 2 + i) * (i / 6); }
      if (i === 0 && t > topple + .15) y = FY - b.h;
      push(); translate(x + b.w / 2, y + b.h / 2); rotate(rot);
      bg('ptb' + i, rectPts(-b.w / 2, -b.h / 2, b.w, b.h, 1), { wash: b.col, fill: mixCol(b.col, PAL.ink, .2), fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 });
      pop();
      yb -= b.h;
    });
    if (t > topple + .8) { const k = seg(t, topple + .8, topple + 1.6); boilSeed('pdust'); for (let i = 0; i < 5; i++) paint(blobPts(TX - 40 + i * 70, FY - 20 - 40 * k, 50 * (1 - k * .5), i, .3, 14), { fill: C.cream, fillOp: 150 * (1 - k), bleed: .3, tex: .4, ink: null }); }
    // characters
    const mx = lerp(2780, 3230, ease(seg(t, tRead - .4, tRead + .5)));
    const mMood = navMood(t, [[0, 'neutral'], [tPlan - .1, 'stern'], [tTell, 'neutral'], [tRead + .5, 'thinking', { lookX: .6, lookY: -.2 }], [tCheap, 'happy'], [tWrong + .1, 'surprised'], [tOne - .1, 'determined'], [tFix + .3, 'proud'], [tFound + .5, 'worried']]);
    const stop = t > tPlan - .25 && t < tDont + .8;
    const readA = rd > 0 && rd < 1 ? .45 - .5 * rd : null;
    const walking = t > tRead - .4 && t < tRead + .5;
    nav(mx, FY, 19, { ...mMood, view: 'q', seed: 5, ...(walking ? { walk: (mx - 2780) / 40 } : {}),
      ...(stop ? { aR: lerp(-1.2, .55, ease(seg(t, tPlan - .25, tPlan + .05))), eyes: 'narrow' } : {}),
      ...(readA != null ? { point: 'R', aR: readA } : {}),
      ...(t > tOne - .3 && t < tFix + .3 ? { aR: .15 + .05 * Math.sin(t * 20), point: 'R' } : {}) });
    // Clawd: bounds in with a paint pot, stopped mid-hop; pins the plan; then, later, pulls the bottom block
    let cx, o;
    const cMood = emotions(t, [[0, 'excited'], [tPlan + .05, 'surprised'], [tDont + .4, 'neutral', { lookX: -.6 }], [tTell, 'happy'], [tRead + .6, 'nervous', { lookX: -.8 }], [tCheap, 'happy', { lookX: -.8 }], [tWrong + .1, 'surprised', { lookX: -.8 }], [tFix + .3, 'relieved'], [tFound + .3, 'excited'], [topple + .3, 'scared'], [topple + 1.3, 'dizzy']]);
    if (t < tPlan) { const k = seg(t, t0, tPlan); cx = lerp(3900, 3420, k); const hp = jump(frac((t - t0) / .7) * .7, .08, .6, 2.5); o = { ...cMood, flip: true, view: 'q', dy: hp.dy, sq: hp.sq, walk: k * 6 }; }
    else if (t < tFound) {
      cx = 3420; const fr = t < tPlan + .35 ? { dy: -2.5 * Math.exp(-(t - tPlan) * 4), sq: -.1 } : jump(t, 0, 0, 0);
      o = { ...cMood, flip: true, dy: fr.dy, sq: fr.sq, ...(t > tTell + .2 && t < tTell + .6 ? { aL: 1.2, aR: .2 } : {}) };
      if (t > tRead - .2) { cx = lerp(3420, 3860, ease(seg(t, tRead - .2, tRead + .5))); o = { ...o, ...(t < tRead + .5 ? { view: 'side', walk: (cx - 3420) / 60, flip: false } : { flip: true }) }; }
    } else {
      const k = seg(t, tFound, tFound + .7); cx = lerp(3860, TX + 140, ease(k));
      o = { ...cMood, view: t < tFound + .7 ? 'side' : 'q', flip: true, walk: (cx - 3860) / 60 };
      if (t > topple - .45) { cx = TX + 140 + 150 * ease(seg(t, topple - .35, topple + .15)); o = { ...o, view: 'side', flip: true, aL: .1, rot: -.1 * Math.sin(Math.PI * seg(t, topple - .45, topple + .2)) }; }
      if (t > topple + .15) { o = { ...o, ...take(t, topple + .4, 1) }; }
    }
    // the paint pot, carried then set down
    const potX = t < tDont + .2 ? cx - 8.5 * 24 * .9 : 3230 + 100, potY = t < tDont + .2 ? FY - 5.4 * 24 + (o.dy || 0) * 24 : FY - 2;
    bg('ppot', rectPts(potX - 24, potY - 44, 48, 44, 1), { wash: mixCol(C.ochreDk, C.cream, .3), ink: PAL.ink, sw: .9 });
    bg('ppotp', ellPts(potX, potY - 44, 24, 7, 10), { wash: C.teal, ink: PAL.ink, sw: .6 });
    clawd(cx, FY, 24, { ...o, boilKey: 'cp' });
    const at = toScreen(TX + 60, FY - 120);
    camEnd();
    chartBorder(C, false);
    seamIn('page', lt, { col: C.cream });
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1] });
  }

  // 6. Targeted follow-ups: Alex's vague flapping vs. Maya's pointed fix: the fat monthly bars split into weeks.
  function follow(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tThats = w('follow', "that's"), tCapt = w('follow', 'captain'), tTarg = w('follow', 'targeted'), tMonthly = w('follow', 'monthly'), tWeekly = w('follow', 'weekly');
    const tWhat = w('follow', "what's"), tInst = w('follow', 'instead'), tCheck = w('follow', 'check');
    cam(t, [[t0, [1000, 660, 1.2]], [tThats, [900, 670, 1.25]], [tCapt + .6, [800, 680, 1.3]], [tTarg, [1250, 650, 1.15]], [tWeekly, [1400, 620, 1.22]], [tEnd, [1380, 640, 1.18]]]);
    office(t, {});
    lectern(655, FY, 'flecA');
    // Alex's board, fat monthly bars; on "weekly" each splits into four slim weeks
    const B0 = easel(1420, FY, 460, 330, 'fboard', mixCol(C.pale, '#FFFFFF', .2), .05);
    const yb = B0.top + B0.h - 34, x0 = B0.L + 36, sk = ease(seg(t, tWeekly, tWeekly + .6));
    const glowB = Math.sin(Math.PI * seg(t, tMonthly - .1, tWeekly));
    for (let g = 0; g < 3; g++) {
      const fx = x0 + g * 136, fh = [170, 230, 140][g];
      for (let j = 0; j < 4; j++) {
        const wx = fx + j * 32, h = fh * (1 - sk) + sk * (fh * (.35 + .5 * hash(g * 4 + j + 1)));
        bar(lerp(fx + j * 29.5, wx, sk), yb, lerp(29.5, 22, sk), h, mixCol(C.rose, C.teal, sk), 'fb' + g + j, { ink: sk > .02 ? PAL.ink : null, sw: .5 });
      }
      if (sk < .02) { boilSeed('fbo' + g); paint(rectPts(fx, yb - fh, 118, fh, .8), { ink: PAL.ink, sw: .7 }); }
      if (glowB > 0) { boilSeed('fbg' + g); paint(rectPts(fx - 8, yb - fh - 8, 134, fh + 8, 2), { ink: C.rose, sw: 3.5 * glowB }); }
    }
    boilSeed('faxis'); inkLine([[x0 - 10, yb], [B0.L + B0.w - 24, yb]], 1.3, PAL.ink, 'ink', 0);
    pie(B0.L + B0.w - 92, B0.top + 88, 60, .4, 1, 'fpie');
    B0.pop();
    // Alex: vague flapping, then a sheepish shrug
    const flap = t > tThats - .4 && t < tCapt;
    const aMood = navMood(t, [[0, 'neutral'], [tThats - .4, 'stern'], [tCapt, 'confused'], [tWeekly + .3, 'surprised'], [tWeekly + 1.3, 'happy']]);
    alex(560, FY, 19, { ...aMood, view: 'q', seed: 3, ...(flap ? { aR: .3 + .5 * Math.sin(t * 9), aL: -.3 - .5 * Math.sin(t * 9 + 1) } : {}) });
    // Clawd between, spinning in confusion, then a happy painter
    const cMood = emotions(t, [[0, 'neutral', { lookX: -.8 }], [tThats + .2, 'confused', { emote: 'scribble' }], [tTarg + .3, 'neutral', { lookX: .8 }], [tMonthly, 'thinking'], [tWeekly, 'determined'], [tWeekly + .7, 'happy']]);
    const spin = t > tThats + .2 && t < tTarg ? spinView((t - tThats) * 1.3) : (t < tTarg ? { flip: true } : { view: 'side' });
    clawd(1085, FY, 24, { ...cMood, ...spin, aL: t > tWeekly - .3 && t < tWeekly + .6 ? .5 + .5 * Math.sin(t * 10) : -.2, armL: t > tTarg ? brushHook(C.teal) : null, boilKey: 'cf' });
    // Maya walks in and points; three pips pop by her hand (what's wrong, instead, check); spyglass on "check"
    const mk = seg(t, tTarg - .5, tTarg + .5), mxp = lerp(2020, 1790, ease(mk));
    const mMood = navMood(t, [[0, 'neutral'], [tTarg - .2, 'determined'], [tWeekly + .4, 'happy'], [tCheck + .2, 'proud']]);
    const pointM = t > tMonthly - .3 && t < tWhat;
    const spy = t > tCheck - .4;
    nav(mxp, FY, 19, { ...mMood, view: 'q', flip: true, seed: 5, ...(mk > 0 && mk < 1 ? { walk: (2020 - mxp) / 40 } : {}), ...(pointM ? { point: 'R', aR: .2 } : {}),
      ...(spy ? { view: 'side', aL: .75, eyes: 'narrow', handL: (s, sw, up) => navProp('spyglass', s, sw, { up, ext: ease(seg(t, tCheck - .3, tCheck + .2)) }) } : {}) });
    [tWhat, tInst, tCheck].forEach((tt, i) => { const k = seg(t, tt, tt + .3); if (k > 0) { boilSeed('fpip' + i); paint(ellPts(mxp - 60 + i * 50, FY - 330, 15 * backOut(k), 15 * backOut(k), 12), { wash: [C.rose, C.ochre, C.teal][i], ink: PAL.ink, sw: .8 }); } });
    const at = toScreen(1420, 560);
    camEnd();
    chartBorder(C, false);
    seamIn('iris', lt, { cx: W * .5, cy: H * .6 });
    seamOut('splash', lt, dur, { cx: at[0], cy: at[1], cols: [C.teal, C.ochre, C.rose], seed: 7 });
  }

  // 7. On deck at golden hour: the good slip handed over, Clawd at the wheel, the compass rose rising.
  function closeShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tOnly = w('close', 'only'), tDesc = w('close', 'describe'), tExpl = w('close', 'explain'), tTool = w('close', 'tool'), tNext = w('close', 'next');
    const roll = .012 * Math.sin(t * 1.1);
    cam(t, [[t0, [860, 640, 1.2]], [tDesc, [940, 620, 1.15]], [tEnd, [1000, 540, 1.02]]]);
    bg('dsky', rectPts(-400, -500, 2720, 1100), { wash: mixCol(C.ochreLt, C.cream, .35), fill: C.rose, fillOp: 60, bleed: .3, tex: .5, ink: null });
    [[1500, 480, 420, C.ochreLt], [300, 80, 360, mixCol(C.rose, C.cream, .3)], [1000, -100, 500, mixCol(C.sea, C.cream, .4)]].forEach(([x, y, r, c], i) => bg('dbloom' + i, blobPts(x, y, r, i + 9, .2), { fill: c, fillOp: 90, bleed: .3, tex: .5, ink: null }));
    boilSeed('dsun'); glow(1500, 540, 300, C.ochreLt, .9);
    bg('dsund', ellPts(1500, 548, 70, 70, 24), { wash: mixCol(C.ochreLt, C.cream, .4), ink: null });
    // the compass rose rises into the sky
    const ck = ease(seg(t, tExpl - .3, tExpl + 1.6));
    if (ck > 0) compassRose(1500, lerp(520, 250, ck), 150, { assemble: ck, rot: (1 - ck) * -1.2 + .03 * Math.sin(t), glow: .4 * ck, key: 'drose' });
    push(); translate(960, 700); rotate(roll); translate(-960, -700);
    bg('dsea', rectPts(-400, 560, 2720, 700), { wash: C.teal, fill: C.deep, fillOp: 70, bleed: .15, tex: .7, ink: null });
    for (let i = 0; i < 12; i++) { const y = 590 + (i % 6) * 26, x = ((i * 337 + t * 60) % 2600) - 400; boilSeed('dglint' + i); inkLine([[x, y], [x + 60, y]], 1.4, C.ochreLt, 'inkfine', 0); }
    // rail and deck
    bg('ddeck', rectPts(-400, 860, 2720, 500), { wash: mixCol(C.ochre, C.cream, .3), fill: C.ochreDk, fillOp: 70, tex: .7, ink: null });
    for (let i = 0; i < 2; i++) { boilSeed('ddk' + i); inkLine([[-400 + i * 1360, 860], [-400 + (i + 1) * 1360, 860]], 2, PAL.ink, 'ink', 0); }
    for (let i = 0; i < 2; i++) { boilSeed('drail' + i); inkLine([[-400 + i * 1360, 690], [-400 + (i + 1) * 1360, 690]], 9, C.ochreDk, 'ink', 0); }
    for (let i = 0; i < 12; i++) { boilSeed('dpost' + i); inkLine([[-300 + i * 200, 690], [-300 + i * 200, 860]], 5, C.ochreDk, 'ink', 0); }
    // the wheel
    const WX = 1330, WY = 650, spin = ease(seg(t, tExpl, tTool + 1)) * 2.2 + .05 * Math.sin(t * 1.4);
    bg('dped', rectPts(WX - 22, WY, 44, 210, 1), { wash: C.ochreDk, ink: PAL.ink, sw: 1 });
    push(); translate(WX, WY); rotate(spin);
    boilSeed('dwheel');
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([[0, 0], [Math.cos(a) * 130, Math.sin(a) * 130]], 6, C.ochreDk, 'ink', 0); paint(ellPts(Math.cos(a) * 140, Math.sin(a) * 140, 11, 11, 10), { wash: C.ochre, ink: PAL.ink, sw: .8 }); }
    inkLine(ellPts(0, 0, 100, 100, 40).concat([[100, 0]]), 12, C.ochre, 'ink', .5);
    paint(ellPts(0, 0, 22, 22, 14), { wash: C.ochreLt, ink: PAL.ink, sw: .8 });
    pop();
    // the slip: from Maya's hand to Clawd's claw
    const give0 = tOnly - .2, give1 = give0 + .5;
    const mMood = navMood(t, [[0, 'happy'], [tDesc, 'neutral'], [tExpl, 'proud'], [tTool + .2, 'happy']]);
    const spyM = t > tTool - .4;
    nav(560, 862, 25, { ...mMood, view: 'q', seed: 4,
      ...(t < give1 + .1 ? { aR: lerp(-.9, -.15, ease(seg(t, t0, give0))), handR: t < give0 + .1 ? (s, sw, up) => { push(); rotate(up); slip(.9 * s, -.5 * s, 2 * s, 2.8 * s, .1, [1, 1, 1, 1, 1], 'dslipM', { sw: sw * .6, lw: sw * .8 }); pop(); } : null } : {}),
      ...(spyM ? { view: 'side', aL: .6, eyes: 'narrow', handL: (s, sw, up) => navProp('spyglass', s, sw, { up, ext: ease(seg(t, tTool - .4, tTool + .1)) }) } : {}) });
    const cx = lerp(960, 1060, ease(seg(t, tDesc + .6, tDesc + 1.1)));
    const cMood = emotions(t, [[0, 'happy', { lookX: 1 }], [give1, 'excited', { lookY: .5 }], [tDesc, 'determined'], [tExpl + .5, 'proud'], [tNext, 'happy']]);
    const atWheel = t > tDesc + .6;
    if (t > give0 && t < give1) { const k = ease(seg(t, give0, give1)), p = arcPt([560 + 110, 862 - 150], [cx - 200, 862 - 170], 60, k); slip(p[0], p[1], 40, 56, .1, [1, 1, 1, 1, 1], 'dslipF', { lw: .8 }); }
    clawd(cx, 862, 30, { ...cMood, ...(atWheel ? { view: 'side', aL: .55 + .12 * Math.sin(t * 3) } : { flip: true, aR: t > give1 ? .6 : .2 }),
      ...(t < tDesc + .6 && t > give1 ? { armR: slipHook([1, 1, 1, 1, 1], 'dslipC', { w: 1.6, h: 2.2 }) } : {}), ...(t > give1 && t < give1 + .5 ? take(t, give1, .6) : {}), boilKey: 'cd' });
    if (atWheel) slip(WX - 4, WY + 120, 40, 56, -.06, [1, 1, 1, 1, 1], 'dslipP', { lw: .8, glowK: .3 });
    pop();
    camEnd();
    chartBorder(C, false);
    seamIn('splash', lt, { cx: W * .5, cy: H * .45, cols: [C.teal, C.ochre, C.rose], seed: 7 });
    seamOut('wipe', lt, dur);
  }

  function endShot(t, lt, dur) { crewEnd(t, lt, dur, NEXT, TIMING.next); }

  shots([[0, identShot], [shotAt('alex'), twoCaptains], [shotAt('three'), threeParts], [shotAt('lanes'), lanes], [shotAt('levels'), levels],
    [shotAt('plan'), planShot], [shotAt('follow'), follow], [shotAt('close'), closeShot], [B.close.end + .9, endShot]]);
})();
