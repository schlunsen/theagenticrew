// scene.js: crew09, Hidden Instructions. See video/storyboards/crew09.md.
// One set (the Navigator's harbour office) and one idea: whatever a stranger wrote FOR THE AGENT is painted in rose ink.
// Every time comes from the narration: wt('beat', 'word').
(() => {
  const NUM = '09', NEXT = '10', TITLE = 'Hidden Instructions';
  const C = CREW, INK = PAL.ink;
  const ROSE = '#C24D63', ROSE_GL = '#FF8FA6', SHEET = '#FBF4E6', LILAC = '#B9A6C2', TEAL_CARD = '#5FA89E';
  const FLOOR = 830;
  const CX = 1050, CY = 705, CU = 22;        // Clawd at the desk: ground point (hidden behind the desk) and size
  const NX = 560;                             // the Navigator's usual spot in the office
  const PORT = [1500, 330, 140];              // porthole centre and radius
  const SLOT = [260, 553];                    // the mail slot in the door
  const BIN = [1405, FLOOR];

  // ---------- small helpers ----------
  const w0 = (b, w, n = 0) => wt(b, w, n);
  const hline = (x0, x1, y, sw, col, br = 'inkfine') => { for (let x = x0; x < x1; x += 1600) inkLine([[x, y], [Math.min(x1, x + 1600), y]], sw, col, br, 0); };
  const pop01 = (t, a, d = .35) => backOut(seg(t, a, a + d));
  // where a hand is (approximately), for props that must touch it
  function navHand(x, y, s, o, which) {
    const vn = o.view && NAV_V[o.view] ? o.view : 'front', V = NAV_V[vn], i = which === 'L' ? 0 : 1;
    const a = which === 'L' ? (o.aL ?? -1.22) : (o.aR ?? -1.28), dir = vn === 'side' ? 1 : (i === 0 ? -1 : 1);
    const sx = V.sh[i] * s, sy = (-7.7 - .5) * s, L = 3.23 * s;
    const vx = dir < 0 ? -Math.cos(a) : Math.cos(a), vy = -Math.sin(a);
    const f = o.flip ? -1 : 1;
    return [x + f * (sx + vx * L) + (o.dx || 0) * s * f, y + sy + vy * L + (o.dy || 0) * s];
  }
  function clawdHand(x, y, u, o, which) {
    const V = VIEWS[o.view] || VIEWS.front, A = V.arms.find(q => q[2] === which) || V.arms[0];
    const [px, dir] = A, a = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2);
    const f = o.flip ? -1 : 1;
    let rx, ry, vx, vy;
    if (dir === 0) { rx = px * u; ry = -4.2 * u; const r = .7 - a; vx = Math.cos(r); vy = Math.sin(r); }
    else { rx = (px + dir * .55 * clamp((Math.abs(a) - .7) / .9)) * u; ry = -4.5 * u; vx = dir < 0 ? -Math.cos(a) : Math.cos(a); vy = -Math.sin(a); }
    return [x + f * (rx + vx * 2.3 * u) + (o.dx || 0) * u * f, y + ry + vy * 2.3 * u + (o.dy || 0) * u];
  }
  function scrib(x0, x1, y, seed, col, sw, k = 1, wl = 30) {
    let x = x0, i = 0; const xe = lerp(x0, x1, clamp(k));
    while (x < xe - 4) {
      const L = Math.min(wl * (.5 + .9 * hash(seed * 13.1 + i * 7.7)), xe - x), p = [];
      for (let j = 0; j <= 4; j++) p.push([x + L * j / 4, y + Math.sin(j * 2.1 + i + seed) * wl * .07]);
      if (L > 3) inkLine(p, sw, col, 'ink', .5);
      x += L + wl * .32; i++;
    }
  }

  function scribWash(x0, x1, y, seed, col, th, wl) {   // the same word-rhythm as scrib(), as flat washes (no ink edge)
    let x = x0, i = 0;
    while (x < x1 - 4) {
      const L = Math.min(wl * (.5 + .9 * hash(seed * 13.1 + i * 7.7)), x1 - x), p = [];
      for (let j = 0; j <= 4; j++) p.push([x + L * j / 4, y + Math.sin(j * 2.1 + i + seed) * wl * .07]);
      if (L > 6) paint(ribbon(p, th, th), { wash: col, ink: null });
      x += L + wl * .32; i++;
    }
  }
  // ---------- props ----------
  function envelope(x, y, w, rot, o = {}) {
    const h = w * .62, col = o.col || SHEET;
    push(); translate(x, y); rotate(rot || 0);
    boilSeed(o.key || 'env');
    paint(rectPts(-w / 2, -h / 2, w, h), { wash: col, fill: mixCol(col, INK, .12), fillOp: 40, tex: .4, ink: INK, sw: clamp(w / 80, .4, 1.2) });
    inkLine([[-w / 2, -h / 2], [0, h * .08], [w / 2, -h / 2]], clamp(w / 110, .3, 1), mixCol(col, INK, .5), 'inkfine', 0);
    if (o.seal) paint(blobPts(0, h * .08, w * .11, 3, .15, 12), { wash: o.seal, ink: INK, sw: clamp(w / 140, .3, .9) });
    pop();
  }
  function plane(x, y, s, rot, col = SHEET) {
    push(); translate(x, y); rotate(rot || 0);
    paint([[s, 0], [-s, -.62 * s], [-.45 * s, 0]], { wash: col, ink: INK, sw: clamp(s / 40, .4, 1.1) });
    paint([[s, 0], [-.45 * s, 0], [-s, .38 * s]], { wash: mixCol(col, INK, .18), ink: INK, sw: clamp(s / 40, .4, 1.1) });
    pop();
  }
  function coin(x, y, r, spin) {
    const k = Math.cos(spin), rx = Math.max(r * .08, r * Math.abs(k));
    paint(ellPts(x + r * .06, y, rx, r, 20), { wash: C.ochreDk, ink: null });
    paint(ellPts(x, y, rx, r, 20), { wash: k > 0 ? C.ochreLt : C.ochre, fill: C.ochre, fillOp: 60, tex: .4, ink: INK, sw: clamp(r / 30, .5, 1.2) });
    if (Math.abs(k) > .35) paint(starPts(x, y, r * .45 * Math.abs(k), .45, 4), { wash: k > 0 ? C.ochre : C.ochreLt, ink: null });
  }
  function card(x, y, w, rot, col = TEAL_CARD, lines = true) {
    push(); translate(x, y); rotate(rot || 0);
    paint(rectPts(-w / 2, -w * .33, w, w * .66), { wash: col, ink: INK, sw: clamp(w / 90, .35, 1) });
    if (lines && w > 30) for (let i = 0; i < 3; i++) inkLine([[-w * .36, -w * .15 + i * w * .15], [w * (i === 2 ? .05 : .34), -w * .15 + i * w * .15]], clamp(w / 150, .3, .8), mixCol(col, INK, .5), 'inkfine', 0);
    pop();
  }
  // A letter sheet. o.detail: the full-frame layout (logo, pitch lines, signature, hidden rows). o.ghost: white-on-white
  // rows faintly there. o.rev 0..1: the rose rows as they are read (row by row). o.icons: [k0..k5] each pictogram's pop.
  // o.shim: x (in sheet units -5..5) of a glint passing over the ghost rows. o.back: seen from behind (rose bleeding through).
  function sheet(cx, cy, w, h, rot, o = {}) {
    push(); translate(cx, cy); rotate(rot || 0);
    const u = w / 10, sw = clamp(w / 300, .35, 1.6), key = o.key || 'sheet';
    boilSeed(key + ' paper');
    paint(rectPts(-w / 2, -h / 2, w, h, w * .003), { wash: SHEET, fill: C.ochreLt, fillOp: 35, bleed: .05, tex: .5, border: .4, ink: INK, sw });
    if (o.back) {
      boilSeed(key + ' back');
      for (let r = 0; r < 4; r++) scrib(-3.6 * u, 3.8 * u, h * .12 + r * h * .08, r + 40, mixCol(SHEET, ROSE, .28 * (o.back || 0)), sw * 1.2, 1, u * 1.1);
    }
    if (!o.back) {
      boilSeed(key + ' pitch');
      const top = -h / 2;
      if (o.detail) {
        paint(blobPts(-3.7 * u, top + 1.0 * u, .5 * u, 2, .1, 16), { wash: C.ochre, fill: C.ochreDk, fillOp: 60, ink: INK, sw });
        inkLine([[-3.0 * u, top + .85 * u], [-.8 * u, top + .85 * u]], sw * 2.4, mixCol(C.ochreDk, INK, .3), 'ink', 0);
        inkLine([[-3.0 * u, top + 1.25 * u], [-1.6 * u, top + 1.25 * u]], sw * 1.2, mixCol(C.ochreDk, INK, .1), 'ink', 0);
        for (let r = 0; r < 6; r++) scrib(-4 * u, (r === 5 ? 1.2 : 4) * u, top + 2.3 * u + r * .62 * u, r + 1, mixCol(INK, C.teal, .25), sw * 1.1, 1, u * .95);
        // a dull little bar chart and a signature
        for (let b = 0; b < 4; b++) paint(rectPts(1.6 * u + b * .55 * u, top + 6.8 * u - (b + 1) * .3 * u, .38 * u, (b + 1) * .3 * u), { wash: mixCol(C.sea, SHEET, .3), ink: INK, sw: sw * .7 });
        scrib(-4 * u, -1 * u, top + 6.3 * u, 9, mixCol(INK, C.teal, .25), sw * 1.1, 1, u * .95);
        inkLine([[-3.8 * u, top + 7.2 * u], [-3.3 * u, top + 6.95 * u], [-2.9 * u, top + 7.3 * u], [-2.4 * u, top + 6.9 * u], [-1.9 * u, top + 7.25 * u]], sw * 1.3, INK, 'ink', .6);
      } else {
        for (let r = 0; r < 5; r++) scrib(-3.8 * u, (r === 4 ? 0 : 3.8) * u, top + h * .16 + r * h * .1, r + 1, mixCol(INK, C.teal, .3), sw * 1.2, 1, u * 1.2);
      }
      // the hidden rows: 5 of them in the lower part of the page
      const hy = r => -h / 2 + h * .655 + r * h * .066;
      if (o.detail || o.rev > 0 || o.ghost > 0) {
        const ic = o.icons || [];
        for (let r = 0; r < 5; r++) {
          const y = hy(r), x0 = (r === 1 ? -1.9 : -2.8) * u;
          boilSeed(key + ' ghost' + r);
          if (o.ghost > 0) {
            const gk = o.shim != null ? Math.exp(-(((o.shim) - 0) ** 2)) : 0;
            scribWash(x0, (r === 4 ? 1.8 : 4) * u, y, r + 20, '#FFFDF8', u * .13, u * .9);
            if (o.shim != null) {   // a glint of light travels along the rows and catches the white ink
              const gx = (o.shim - r * .6) * u;
              if (gx > x0 - u && gx < 4.5 * u) glow(gx, y, u * .9, '#FFFFFF', .5);
            }
          }
          const rk = clamp((o.rev || 0) * 5.4 - r);
          if (rk > 0) { boilSeed(key + ' rose' + r); scrib(x0, (r === 4 ? 1.8 : 4) * u, y, r + 20, ROSE, sw * 1.8, rk, u * .9); }
        }
        const icAt = [[-3.7, 0, 'clawd'], [-3.8, 1, 'invoice'], [-2.7, 1, 'bank'], [-3.6, 2, 'send'], [-3.6, 3, 'bin'], [-3.6, 4, 'shh']];
        icAt.forEach(([ix, r, kind], i) => {
          const k = ic[i] || 0; if (k <= .01) return;
          boilSeed(key + ' icon' + i);
          icon(kind, ix * u, hy(r), u * .46 * backOut(clamp(k)), ROSE, sw * 1.2, o.lit === i);
        });
      }
    }
    pop();
  }
  // rose-ink pictograms for the hidden rows (monochrome, painted in one ink)
  function icon(kind, x, y, s, col, sw, lit) {
    const pale = mixCol(col, SHEET, lit ? .45 : .7);
    push(); translate(x, y);
    const Pp = pts => pts.map(([a, b]) => [a * s, b * s]);
    if (kind === 'clawd') {
      paint(rectPts(-1.1 * s, -.75 * s, 2.2 * s, 1.2 * s), { wash: pale, ink: col, sw });
      for (const lx of [-.9, -.45, .25, .7]) inkLine(Pp([[lx, .45], [lx, .85]]), sw * 1.4, col, 'ink', 0);
      for (const ex of [-.55, .55]) paint(ellPts(ex * s, -.25 * s, .12 * s, .22 * s, 8), { wash: col, ink: null });
      inkLine(Pp([[1.3, -.2], [1.55, .2]]), sw * 1.4, col, 'ink', 0);   // a colon: "Assistant:"
    } else if (kind === 'invoice') {
      paint(Pp([[-.75, -1], [.45, -1], [.75, -.7], [.75, 1], [-.75, 1]]), { wash: pale, ink: col, sw });
      paint(ellPts(0, -.2 * s, .38 * s, .38 * s, 12), { wash: col, ink: null });
      for (let i = 0; i < 2; i++) inkLine(Pp([[-.45, .4 + i * .3], [.45, .4 + i * .3]]), sw * .8, col, 'inkfine', 0);
    } else if (kind === 'bank') {
      paint(Pp([[-1, -.35], [0, -1], [1, -.35]]), { wash: pale, ink: col, sw });
      for (const cx of [-.65, 0, .65]) paint(rectPts((cx - .14) * s, -.25 * s, .28 * s, 1 * s), { wash: pale, ink: col, sw: sw * .8 });
      paint(rectPts(-1.05 * s, .75 * s, 2.1 * s, .25 * s), { wash: col, ink: null });
    } else if (kind === 'send') {
      inkLine(Pp([[-1.1, .5], [-.4, .3], [.2, -.1]]), sw * 1.2, col, 'ink', .5);
      paint(Pp([[1.1, -.6], [-.2, -.25], [.25, 0]]), { wash: pale, ink: col, sw });
      paint(Pp([[1.1, -.6], [.25, 0], [.25, .45]]), { wash: col, ink: col, sw });
    } else if (kind === 'bin') {
      paint(Pp([[-.7, -.55], [.7, -.55], [.55, 1], [-.55, 1]]), { wash: pale, ink: col, sw });
      for (const lx of [-.3, 0, .3]) inkLine(Pp([[lx, -.3], [lx * .85, .8]]), sw * .8, col, 'inkfine', 0);
      paint(rectPts(-.85 * s, -.85 * s, 1.7 * s, .22 * s), { wash: col, ink: null });
    } else if (kind === 'shh') {
      paint(ellPts(0, .1 * s, 1.0 * s, .45 * s, 16), { wash: pale, ink: col, sw });
      inkLine(Pp([[-.9, .1], [0, .2], [.9, .1]]), sw, col, 'ink', .5);
      paint(rrPts(-.18 * s, -1.1 * s, .36 * s, 1.8 * s, .16 * s), { wash: col, ink: col, sw: sw * .6 });
    }
    pop();
  }
  // ---------- the office set ----------
  function porthole(t, o = {}) {
    const [cx, cy, R] = PORT, ph = o.ph ?? .3, a = ph * TAU, el = Math.sin(a);
    boilSeed('port ring');
    paint(ellPts(cx, cy, R * 1.2, R * 1.2, 36), { wash: C.ochre, fill: C.ochreDk, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
    const day = clamp(el * 2.5 + .45), sky = mixCol(mixCol(C.night, C.deep, .5), mixCol(C.pale, C.ochreLt, .35 * (1 - clamp(el * 2))), day);
    boilSeed('port sky');
    paint(ellPts(cx, cy, R, R, 36), { wash: sky, fill: mixCol(sky, C.sea, .3), fillOp: 60, bleed: .1, tex: .5, ink: INK, sw: 1 });
    // sun (day) or moon (night), on an arc inside the glass
    const sx = cx - Math.cos(a) * R * .55, sy = cy + R * .2 - Math.sin(a) * R * .55;
    boilSeed('port sun');
    if (el > -.05) { glow(sx, sy, 70, C.ochreLt, .5 * day); paint(ellPts(sx, sy, 26, 26, 16), { wash: mixCol(C.ochreLt, '#FFF1C8', .4), ink: null }); }
    const mx = cx + Math.cos(a) * R * .55, my = cy + R * .2 + Math.sin(a) * R * .55;
    if (el < .05) paint(ellPts(mx, my, 18, 18, 14), { wash: C.cream, ink: null });
    // sea: the lower segment
    boilSeed('port sea');
    const hy = cy + R * .28, ha = Math.asin((hy - cy) / R), seaPts = [];
    for (let i = 0; i <= 20; i++) { const q = lerp(ha, Math.PI - ha, i / 20); seaPts.push([cx + Math.cos(q) * R * .99, cy + Math.sin(q) * R * .99]); }
    for (let i = 0; i <= 8; i++) { const x = lerp(cx - Math.cos(ha) * R, cx + Math.cos(ha) * R, 1 - i / 8); seaPts.push([x, hy + 4 * Math.sin(i * 1.3 + t * 2)]); }
    paint(seaPts, { wash: mixCol(C.teal, C.deep, 1 - day), fill: C.sea, fillOp: 60 * day, tex: .5, ink: null });
    for (let i = 0; i < 3; i++) { const wx = cx - R * .5 + i * R * .45 + 12 * Math.sin(t * .8 + i); inkLine([[wx - 18, hy + 22 + i * 14], [wx, hy + 16 + i * 14], [wx + 18, hy + 22 + i * 14]], .6, mixCol(C.pale, C.sea, .3), 'inkfine', .6); }
    // the glass: hinged on the left, swings open to let things out
    const op = clamp(o.open || 0);
    boilSeed('port glass');
    if (op < .02) inkLine(_arcPtsL(cx, cy, R * .82, -2.5, -1.6), 1.2, mixCol(C.cream, sky, .2), 'inkfine', .5);
    else {
      const gw = R * Math.cos(op * 1.4);
      paint(ellPts(cx - R * 1.2 + gw * .0 - 8, cy, Math.max(8, R * .95 * Math.cos(op * 1.4) * .5 + 10), R * 1.02, 24), { wash: mixCol(C.pale, C.sea, .25), fill: C.ochre, fillOp: 40, ink: C.ochreDk, sw: 2.2 });
    }
    for (let i = 0; i < 8; i++) { const q = i / 8 * TAU; paint(ellPts(cx + Math.cos(q) * R * 1.1, cy + Math.sin(q) * R * 1.1, 5, 5, 8), { wash: C.ochreDk, ink: null }); }
  }
  function _arcPtsL(cx, cy, r, a0, a1) { const p = []; for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }

  function office(t, o = {}) {
    boilSeed('o wall');
    paint(rectPts(-700, -500, 2000, FLOOR + 500), { wash: '#EAD8B8', fill: C.ochreLt, fillOp: 50, bleed: .15, tex: .6, border: .4, ink: null });
    boilSeed('o wall2');
    paint(rectPts(1250, -500, 2000, FLOOR + 500), { wash: '#EAD8B8', fill: C.ochreLt, fillOp: 50, bleed: .15, tex: .6, border: .4, ink: null });
    [[380, 180, 360], [1250, 120, 400], [2150, 240, 420], [850, 470, 300], [2700, 150, 380]].forEach(([x, y, r], i) => { boilSeed('o bloom' + i); paint(blobPts(x, y, r, i + 11, .18), { fill: mixCol(C.cream, C.ochre, .4), fillOp: 60, bleed: .3, tex: .6, border: .5, ink: null }); });
    // wainscot and floor
    boilSeed('o wains');
    paint(rectPts(-700, 610, 2000, FLOOR - 610), { wash: mixCol(C.teal, C.sea, .45), fill: C.teal, fillOp: 70, bleed: .06, tex: .7, border: .5, ink: null });
    boilSeed('o wains2');
    paint(rectPts(1250, 610, 2000, FLOOR - 610), { wash: mixCol(C.teal, C.sea, .45), fill: C.teal, fillOp: 70, bleed: .06, tex: .7, border: .5, ink: null });
    boilSeed('o wainline');
    hline(-700, 3300, 610, 1.3, INK, 'ink');
    for (let x = -600; x < 3300; x += 170) inkLine([[x, 625], [x, FLOOR - 8]], .5, mixCol(C.teal, INK, .4), 'inkfine', 0);
    boilSeed('o floor');
    paint(rectPts(-700, FLOOR, 2000, 700), { wash: '#B98A55', fill: C.ochreDk, fillOp: 90, bleed: .05, tex: .7, border: .4, ink: null });
    boilSeed('o floor2');
    paint(rectPts(1250, FLOOR, 2000, 700), { wash: '#B98A55', fill: C.ochreDk, fillOp: 90, bleed: .05, tex: .7, border: .4, ink: null });
    boilSeed('o floorline');
    hline(-700, 3300, FLOOR, 1.4, INK, 'ink');
    for (let i = 0; i < 4; i++) hline(-700, 3300, FLOOR + 40 + i * 60 + i * i * 8, .5, mixCol(C.ochreDk, INK, .3));
    // the door with its brass mail slot
    boilSeed('o door');
    paint(rectPts(110, 220, 300, FLOOR - 220), { wash: '#8A5A3A', fill: C.ochreDk, fillOp: 80, tex: .7, border: .5, ink: INK, sw: 1.3 });
    paint(rectPts(150, 270, 220, 200, 2), { fill: mixCol('#8A5A3A', INK, .25), fillOp: 90, tex: .6, ink: mixCol('#8A5A3A', INK, .5), sw: .7 });
    paint(rectPts(150, 620, 220, 170, 2), { fill: mixCol('#8A5A3A', INK, .25), fillOp: 90, tex: .6, ink: mixCol('#8A5A3A', INK, .5), sw: .7 });
    paint(ellPts(375, 560, 13, 13, 12), { wash: C.ochreLt, ink: INK, sw: .8 });
    paint(rectPts(SLOT[0] - 70, SLOT[1] - 20, 140, 40, 1), { wash: C.ochre, fill: C.ochreDk, fillOp: 60, ink: INK, sw: 1 });
    paint(rectPts(SLOT[0] - 55, SLOT[1] - 5, 110, 10), { wash: mixCol(C.night, INK, .3), ink: null });
    porthole(t, o);
    // the wall chart (a small sea chart with a compass rose), pinned above the desk
    if (o.chart !== false) {
      boilSeed('o chart');
      paint(rectPts(810, 150, 420, 290, 2), { wash: C.cream, fill: C.pale, fillOp: 90, bleed: .1, tex: .6, border: .5, ink: INK, sw: 1 });
      paint(blobPts(1080, 330, 90, 4, .25, 18), { fill: C.sea, fillOp: 80, bleed: .15, tex: .5, ink: null });
      for (let i = 0; i < 8; i++) { const q = i / 8 * TAU; inkLine([[960 + Math.cos(q) * 10, 290 + Math.sin(q) * 10], [960 + Math.cos(q) * 190, 290 + Math.sin(q) * 130]], .4, mixCol(C.cream, C.sea, .6), 'inkfine', 0); }
      compassRose(960, 290, 46, { key: 'wallrose', swMul: .6 });
      for (const [px, py] of [[825, 162], [1215, 162]]) paint(ellPts(px, py, 7, 7, 10), { wash: C.rose, ink: INK, sw: .6 });
    }
    // the brass out-box on the wall, right of the porthole
    boilSeed('o outbox');
    paint(rrPts(1695, 680, 110, FLOOR - 680, 14), { wash: C.ochre, fill: C.ochreDk, fillOp: 70, tex: .6, ink: INK, sw: 1.1 });
    paint(rectPts(1712, 710, 76, 12), { wash: mixCol(C.night, INK, .3), ink: null });
    paint(rectPts(1688, 672, 124, 14), { wash: C.ochreDk, ink: INK, sw: .8 });
    paint([[1735, 760], [1765, 760], [1765, 745], [1790, 775], [1765, 805], [1765, 790], [1735, 790]], { wash: C.ochreLt, ink: INK, sw: .6 });
    // filing cabinet
    boilSeed('o cab');
    paint(rectPts(1860, 470, 200, FLOOR - 470), { wash: mixCol(C.sap, C.teal, .35), fill: mixCol(C.sap, INK, .3), fillOp: 70, tex: .6, ink: INK, sw: 1.1 });
    for (let d = 0; d < 3; d++) {
      const dy = 490 + d * 112, op = d === 0 ? (o.drawer || 0) : 0;
      boilSeed('o drawer' + d);
      paint(rectPts(1875 - op * 40, dy + op * 6, 170, 96), { wash: mixCol(C.sap, C.teal, .25), fill: mixCol(C.sap, INK, .25), fillOp: 50, tex: .5, ink: INK, sw: .8 });
      paint(rrPts(1935 - op * 40, dy + 20 + op * 6, 50, 14, 6), { wash: C.ochreLt, ink: INK, sw: .6 });
      if (d > 0 && o.locks) paint(ellPts(1960, dy + 62, 7, 9, 8), { wash: C.ochreDk, ink: INK, sw: .5 });
    }
    // the high shelf, far right
    boilSeed('o shelf');
    paint(rectPts(2200, 330, 380, 18), { wash: '#8A5A3A', ink: INK, sw: 1 });
    for (const bx of [2230, 2540]) inkLine([[bx, 348], [bx + 20, 390], [bx, 390]], 1, INK, 'ink', 0);
    for (let i = 0; i < 4; i++) paint(rectPts(2420 + i * 30, 250 - i * 6, 26, 80 + i * 6), { wash: [C.rose, C.teal, C.ochre, C.sap][i], ink: INK, sw: .7 });
    // waste bin
    binDraw(o.binK || 0);
  }
  function binDraw(k) {
    const [x, y] = BIN;
    boilSeed('o bin');
    paint([[x - 55, y - 120], [x + 55, y - 120], [x + 44, y], [x - 44, y]], { wash: mixCol(C.teal, C.deep, .3), fill: C.deep, fillOp: 60, tex: .5, ink: INK, sw: 1 });
    for (let i = -2; i <= 2; i++) inkLine([[x + i * 20, y - 112], [x + i * 16, y - 6]], .5, mixCol(C.deep, INK, .3), 'inkfine', 0);
    paint(ellPts(x, y - 120, 55, 12, 18), { wash: mixCol(C.deep, INK, .4), ink: INK, sw: .8 });
    if (k > 0) paint(blobPts(x, y - 128, 26 * k, 5, .3, 12), { wash: SHEET, ink: INK, sw: .7 });
  }
  function desk(t, o = {}) {
    boilSeed('o desk');
    paint(rectPts(760, 648, 580, 34, 1), { wash: '#9A6A42', fill: C.ochreDk, fillOp: 90, tex: .7, ink: INK, sw: 1.2 });
    paint(rectPts(790, 682, 520, FLOOR - 682), { wash: '#A77649', fill: C.ochreDk, fillOp: 80, tex: .7, border: .5, ink: INK, sw: 1.1 });
    paint(rectPts(830, 705, 200, 60, 1), { fill: mixCol('#A77649', INK, .25), fillOp: 90, ink: INK, sw: .7 });
    paint(rectPts(1070, 705, 200, 60, 1), { fill: mixCol('#A77649', INK, .25), fillOp: 90, ink: INK, sw: .7 });
    for (const kx of [930, 1170]) paint(ellPts(kx, 735, 8, 8, 8), { wash: C.ochreLt, ink: INK, sw: .5 });
    // the lamp
    if (o.lamp !== false) {
      boilSeed('o lamp');
      glow(1270, 560, 150, '#FFD89A', .55);
      paint(ellPts(1270, 644, 34, 8, 14), { wash: C.ochreDk, ink: INK, sw: .8 });
      inkLine([[1270, 640], [1262, 590], [1250, 572]], 2, INK, 'ink', .5);
      paint([[1215, 580], [1290, 580], [1270, 530], [1232, 530]], { wash: C.ochre, fill: C.ochreLt, fillOp: 80, ink: INK, sw: 1 });
    }
    // the tray of summary cards on the left end
    if (o.cards != null) {
      boilSeed('o tray');
      paint(rectPts(790, 628, 110, 20, 1), { wash: C.ochreDk, ink: INK, sw: .8 });
      const n = Math.min(12, Math.floor(o.cards));
      for (let i = 0; i < n; i++) { boilSeed('o tcard' + i); card(845 + (hash(i) - .5) * 10, 624 - i * 5, 80, (hash(i + 3) - .5) * .12); }
    }
  }

  // ---------- the chart set: the lethal trifecta ----------
  const VC = { o: [820, 400], r: [1100, 400], s: [960, 640] }, VR = 235;
  const VCOL = { o: C.ochre, r: C.rose, s: C.sea };
  function vcircle(key, cx, cy, k, sketch) {
    if (sketch > 0 && k < 1) { boilSeed('vsk' + key); const p = _arcPtsL(cx, cy, VR, -Math.PI / 2, -Math.PI / 2 + TAU * ease(sketch)); if (p.length > 1) inkLine(p, 1.1, mixCol(INK, C.cream, .45), 'HB', .5); }
    if (k <= .01) return;
    boilSeed('vc' + key);
    paint(blobPts(cx, cy, VR * (.6 + .4 * backOut(k)), { o: 2, r: 5, s: 8 }[key], .05, 40), { fill: VCOL[key], fillOp: 190 * clamp(k * 1.5), bleed: .12, tex: .6, border: .6, ink: mixCol(VCOL[key], INK, .45), sw: 1.4 });
  }
  function strongbox(x, y, s, k) {
    if (k <= .01) return; s *= backOut(k);
    boilSeed('ic strong');
    paint(rrPts(x - 1.1 * s, y - .8 * s, 2.2 * s, 1.6 * s, .15 * s), { wash: C.ochreDk, fill: INK, fillOp: 40, tex: .5, ink: INK, sw: 1.1 });
    paint(ellPts(x, y - .1 * s, .5 * s, .5 * s, 16), { wash: C.ochreLt, ink: INK, sw: .9 });
    paint([[x - .1 * s, y - .15 * s], [x + .1 * s, y - .15 * s], [x + .14 * s, y + .25 * s], [x - .14 * s, y + .25 * s]], { wash: INK, ink: null });
    envelope(x - .7 * s, y - 1.1 * s, .9 * s, -.2, { key: 'ic se' });
    boilSeed('ic folder'); paint(rectPts(x + .15 * s, y - 1.45 * s, .9 * s, .65 * s), { wash: C.sea, ink: INK, sw: .8 });
  }
  function strangerEnv(x, y, s, k, t) {
    if (k <= .01) return; s *= backOut(k);
    envelope(x, y, 2.3 * s, -.12 + .04 * Math.sin(t * 2), { col: LILAC, seal: ROSE, key: 'ic str' });
    boilSeed('ic strhat');   // a stranger's hat and dark eyes peeking over the envelope
    paint([[x - .8 * s, y - .9 * s], [x + .8 * s, y - 1.0 * s], [x + .5 * s, y - 1.6 * s], [x - .45 * s, y - 1.55 * s]], { wash: C.night, ink: INK, sw: .8 });
    paint(ellPts(x, y - .92 * s, 1.25 * s, .2 * s, 16), { wash: C.night, ink: INK, sw: .8 });
  }
  function portIcon(x, y, s, k, t, fly) {
    if (k <= .01) return; s *= backOut(k);
    boilSeed('ic port');
    paint(ellPts(x, y, 1.05 * s, 1.05 * s, 24), { wash: C.ochre, ink: INK, sw: 1 });
    paint(ellPts(x, y, .82 * s, .82 * s, 24), { wash: C.pale, fill: C.sea, fillOp: 60, ink: INK, sw: .8 });
    const q = fly == null ? 0 : fly, px = x + lerp(0, 3.2 * s, easeIn(q)), py = y - lerp(0, 1.6 * s, q) + Math.sin(t * 4) * 2;
    boilSeed('ic plane');
    if (q < 1) plane(px, py, .55 * s * (1 - q * .4), -.35 - .2 * q);
  }
  // the three-legged stool with a pirate flag. legs {o, r, s} 0..1, rot = fall (radians), k = rise
  function stool(x, y, s, legs, rot, k, t) {
    if (k <= .01) return;
    push(); translate(x, y); rotate(rot); scale(backOut(k));
    const seatY = -3 * s;
    const leg = (key, x0, x1, back) => { const p = legs[key] ?? 1; if (p <= .02) return; boilSeed('stleg' + key); paint(ribbon([[x0 * s, seatY + .2 * s], [lerp(x0, x1, .5) * s, -1.5 * s], [x1 * s, -(1 - p) * 3 * s]], .5 * s, .42 * s), { wash: back ? mixCol(VCOL[key], INK, .2) : VCOL[key], ink: INK, sw: .9 }); };
    leg('r', .1, .2, true);
    leg('o', -.9, -1.6, false); leg('s', .9, 1.6, false);
    boilSeed('stseat');
    paint(ellPts(0, seatY, 1.9 * s, .5 * s, 20), { wash: '#9A6A42', fill: C.ochreDk, fillOp: 80, ink: INK, sw: 1 });
    // flag pole and a fluttering flag
    boilSeed('stpole');
    inkLine([[0, seatY], [0, seatY - 6 * s]], 1.8, INK, 'ink', 0);
    const fp = [];
    for (let i = 0; i <= 6; i++) fp.push([i / 6 * 3.4 * s, seatY - 6 * s + Math.sin(i * .9 - t * 7) * .22 * s * i / 6]);
    for (let i = 6; i >= 0; i--) fp.push([i / 6 * 3.4 * s, seatY - 3.8 * s + Math.sin(i * .9 - t * 7) * .22 * s * i / 6]);
    boilSeed('stflag');
    paint(fp, { wash: mixCol(C.night, INK, .3), ink: INK, sw: .9 });
    const fx = 1.7 * s, fy = seatY - 4.95 * s + Math.sin(3 * .9 - t * 7) * .1 * s;
    paint(ellPts(fx, fy - .1 * s, .5 * s, .45 * s, 14), { wash: C.cream, ink: null });
    for (const ex of [-.18, .18]) paint(ellPts(fx + ex * s, fy - .12 * s, .1 * s, .12 * s, 8), { wash: INK, ink: null });
    inkLine([[fx - .6 * s, fy + .3 * s], [fx + .6 * s, fy + .75 * s]], 1.5, C.cream, 'ink', 0);
    inkLine([[fx + .6 * s, fy + .3 * s], [fx - .6 * s, fy + .75 * s]], 1.5, C.cream, 'ink', 0);
    pop();
  }

  // ---------- more props ----------
  function glass(x, y, s, bloom) {   // a tumbler of water on the desk; bloom 0..1 = rose ink spreading in it
    boilSeed('glass back');
    paint([[x - s, y - 2.6 * s], [x + s, y - 2.6 * s], [x + .85 * s, y], [x - .85 * s, y]], { fill: C.pale, fillOp: 70, bleed: .05, tex: .3, ink: null });
    boilSeed('glass water');
    paint([[x - .96 * s, y - 2.0 * s], [x + .96 * s, y - 2.0 * s], [x + .85 * s, y], [x - .85 * s, y]], { wash: mixCol(C.pale, C.sea, .35), fill: C.sea, fillOp: 60, tex: .4, ink: null });
    if (bloom > 0) for (let i = 0; i < 5; i++) {
      const q = clamp(bloom * 1.3 - i * .08), bx = x + (hash(i + 3) - .5) * s * 1.1 * q, by = y - 1.8 * s + q * (s * .4 + i * s * .28);
      boilSeed('glass ink' + i);
      paint(blobPts(bx, by, s * (.25 + .5 * q), i + 1, .3, 14), { fill: ROSE, fillOp: 210 * (1 - .3 * q), bleed: .2, tex: .6, ink: null });
    }
    boilSeed('glass rim');
    paint([[x - s, y - 2.6 * s], [x + s, y - 2.6 * s], [x + .85 * s, y], [x - .85 * s, y]], { ink: mixCol(C.sea, INK, .5), sw: 1 });
    inkLine([[x - .96 * s, y - 2.0 * s], [x + .96 * s, y - 2.0 * s]], .7, mixCol(C.sea, INK, .3), 'inkfine', .5);
    inkLine([[x + .55 * s, y - 2.3 * s], [x + .45 * s, y - .4 * s]], 1, C.cream, 'inkfine', 0);
  }
  function matchbox(x, y, s) {
    boilSeed('matchbox');
    paint(rectPts(x - s, y - .6 * s, 2 * s, .6 * s), { wash: C.rose, fill: C.ochre, fillOp: 50, ink: INK, sw: .8 });
    paint(rectPts(x - .7 * s, y - .6 * s, 1.4 * s, .22 * s), { wash: C.cream, ink: INK, sw: .5 });
    for (let i = 0; i < 3; i++) paint(ellPts(x - .4 * s + i * .35 * s, y - .72 * s, .12 * s, .1 * s, 8), { wash: C.rose, ink: INK, sw: .4 });
  }
  function fireLetter(x, y, w, rot, flame, t) {   // a letter with a painted house on it; flame 0..1 sets it alight
    push(); translate(x, y); rotate(rot);
    boilSeed('fire paper');
    paint(rectPts(-w / 2, -w * .65, w, w * 1.3), { wash: SHEET, ink: INK, sw: .9 });
    const s = w * .16;
    boilSeed('fire house');
    paint([[-2 * s, -.4 * s], [0, -2.2 * s], [2 * s, -.4 * s]], { wash: C.rose, ink: INK, sw: .7 });
    paint(rectPts(-1.6 * s, -.4 * s, 3.2 * s, 2 * s), { wash: C.cream, ink: INK, sw: .7 });
    paint(rectPts(-.35 * s, .6 * s, .7 * s, 1 * s), { wash: C.ochreDk, ink: null });
    if (flame > 0) for (let i = 0; i < 3; i++) {
      const fx = (-1.3 + i * 1.3) * s, fh = s * (1.1 + .35 * Math.sin(t * 13 + i * 2)) * flame;
      boilSeed('fire flame' + i);
      paint([[fx - .5 * s, -.2 * s], [fx - .2 * s, -.2 * s - fh * .6], [fx, -.2 * s - fh], [fx + .25 * s, -.2 * s - fh * .55], [fx + .5 * s, -.2 * s]], { wash: C.ochreLt, fill: C.rose, fillOp: 120, ink: INK, sw: .5, curv: .4 });
    }
    boilSeed('fire lines');
    for (let r = 0; r < 3; r++) inkLine([[-w * .38, w * .3 + r * w * .1], [w * (r === 2 ? .05 : .38), w * .3 + r * w * .1]], .6, mixCol(INK, C.teal, .3), 'inkfine', 0);
    pop();
  }
  function screenPanels(x, k, wob) {   // a folding screen that drops in between the reader and the way out
    if (k <= .01) return;
    const top = lerp(-700, 360, easeOut(k)) + (k >= 1 ? 0 : 0), h = FLOOR - 360;
    push(); translate(x, 0); rotate(wob * .04);
    for (let i = 0; i < 3; i++) {
      boilSeed('screen' + i);
      const px = -105 + i * 70;
      paint([[px, top], [px + 68, top + (i % 2 ? 10 : -10)], [px + 68, top + h + (i % 2 ? 10 : -10)], [px, top + h]], { wash: i % 2 ? C.teal : mixCol(C.teal, C.sea, .4), fill: C.deep, fillOp: 50, tex: .6, ink: INK, sw: 1 });
      paint(ellPts(px + 34, top + 140, 22, 22, 12), { wash: C.ochreLt, ink: INK, sw: .6 });
    }
    pop();
  }
  function keyShape(x, y, s, rot, col = C.ochre) {
    push(); translate(x, y); rotate(rot);
    paint(ellPts(0, 0, .55 * s, .55 * s, 14), { wash: col, ink: INK, sw: .8 });
    paint(ellPts(0, 0, .22 * s, .22 * s, 10), { wash: mixCol(C.cream, col, .3), ink: INK, sw: .5 });
    paint(rectPts(.45 * s, -.14 * s, 1.5 * s, .28 * s), { wash: col, ink: INK, sw: .7 });
    paint(rectPts(1.55 * s, .1 * s, .18 * s, .35 * s), { wash: col, ink: INK, sw: .5 });
    paint(rectPts(1.2 * s, .1 * s, .18 * s, .25 * s), { wash: col, ink: INK, sw: .5 });
    pop();
  }
  function keyRing(x, y, s, n, t, seedK = 'ring') {
    boilSeed(seedK);
    inkLine(_arcPtsL(x, y + .9 * s, .9 * s, -Math.PI * .9, Math.PI * 1.1).concat([[x - .85 * s, y + .6 * s]]), 1.4, C.ochreDk, 'ink', .6);
    for (let i = 0; i < n; i++) { const a = Math.PI * .5 + (i - (n - 1) / 2) * .38 + .06 * Math.sin(t * 6 + i); keyShape(x + Math.cos(a) * .9 * s, y + .9 * s + Math.sin(a) * .9 * s, s * (.55 + .15 * hash(i)), a, [C.ochre, C.ochreLt, C.sap, C.rose, C.ochreDk][i % 5]); }
  }
  function lockbox(x, y, s) {
    boilSeed('lockbox');
    paint(rrPts(x - 1.1 * s, y - 1.3 * s, 2.2 * s, 1.3 * s, .12 * s), { wash: C.rose, fill: mixCol(C.rose, INK, .3), fillOp: 70, tex: .5, ink: INK, sw: 1 });
    inkLine([[x - .8 * s, y - 1.3 * s], [x - .8 * s, y - 1.65 * s], [x + .8 * s, y - 1.65 * s], [x + .8 * s, y - 1.3 * s]], 1.4, INK, 'ink', .4);
    paint(ellPts(x, y - .75 * s, .22 * s, .22 * s, 10), { wash: INK, ink: null });
  }
  function stamp(x, y, s) {
    boilSeed('stamp');
    paint(ellPts(x, y - 1.8 * s, .45 * s, .45 * s, 12), { wash: C.ochreDk, ink: INK, sw: .8 });
    paint(rectPts(x - .15 * s, y - 1.5 * s, .3 * s, 1 * s), { wash: C.ochreDk, ink: INK, sw: .6 });
    paint(rectPts(x - .8 * s, y - .5 * s, 1.6 * s, .5 * s), { wash: C.teal, ink: INK, sw: .8 });
  }
  function hardHat(x, y, u) {
    const d = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; d.push([x + Math.cos(a) * 3.5 * u, y + Math.sin(a) * 3.3 * u]); }
    boilSeed('hathand');
    paint(d, { wash: '#F2C53D', ink: INK, sw: 1 });
    paint(rectPts(x - 4.9 * u, y - .6 * u, 9.8 * u, .9 * u), { wash: '#F2C53D', ink: INK, sw: 1 });
  }
  function lensView(cx, cy, r, k, t) {   // the spyglass view: the letter, magnified, with its rose rows showing
    if (k <= .01) return;
    const rr = r * backOut(k);
    boilSeed('lens rim');
    paint(ellPts(cx, cy, rr * 1.12, rr * 1.12, 40), { wash: C.ochre, fill: C.ochreDk, fillOp: 70, ink: INK, sw: 1.4 });
    boilSeed('lens paper');
    paint(ellPts(cx, cy, rr, rr, 40), { wash: SHEET, fill: C.ochreLt, fillOp: 30, tex: .5, ink: INK, sw: 1 });
    glow(cx, cy, rr * 1.1, ROSE_GL, .35 * k);
    for (let r = 0; r < 4; r++) {
      const y = cy - rr * .5 + r * rr * .32, half = Math.sqrt(Math.max(0, rr * rr * .8 - (y - cy) ** 2));
      boilSeed('lens row' + r);
      if (half > 20) scrib(cx - half + rr * .38, cx + half - 10, y, r + 20, ROSE, 2.2, seg(k, .3 + r * .12, .8 + r * .12), rr * .22);
      const ic = ['clawd', 'invoice', 'send', 'shh'][r];
      if (half > 20) icon(ic, cx - half + rr * .18, y, rr * .075 * backOut(seg(k, .2 + r * .12, .5 + r * .12)), ROSE, 1.4, true);
    }
    inkLine(_arcPtsL(cx, cy, rr * .9, -2.6, -1.9), 2, mixCol(SHEET, '#FFFFFF', .6), 'inkfine', .5);
  }

  // =====================================================================================================================
  function identShot(t, lt, dur) { crewIdent(t, lt, dur, NUM, TITLE); }

  // ---------- A: every morning, the post (hook) ----------
  const B0 = () => wt('hook', 'But') - .1;
  const BL = { cx: 960, cy: 540, w: 880, h: 1140 };   // the letter's layout in shot B (world), camera starts at cy 300
  function shotHook(t, lt, dur) {
    const tCon = wt('hook', 'connected'), tMorn = wt('hook', 'morning'), tReads = wt('hook', 'reads'), tTells = wt('hook', 'tells');
    const tLovely = wt('hook', 'lovely'), tThen = wt('hook', 'Then'), tStr = wt('hook', 'stranger'), tArr = wt('hook', 'arrives'), tDull = wt('hook', 'dull');
    const tFly = wt('hook', 'pitch') - .2, tEnd = t - lt + dur;
    const lean = ease(seg(t, tThen + .2, tStr)) * (1 - ease(seg(t, tArr + .1, tArr + .9)));
    camBegin(lerp(890 + 30 * Math.sin(lt * .3), 620, lean), lerp(545, 540, lean), lerp(1.2 + .006 * lt, 1.3, lean));
    // days: sunrise on "morning", three quick days on "lovely job for weeks", morning again on "Then"
    const ph = lerp(-.02, .28, ease(seg(t, tMorn - .3, tMorn + 1))) + 3 * ease(seg(t, tLovely - .2, tThen - .15));
    office(t, { ph });
    // the post: four letters through the slot on "connected", arcing to the desk
    const nArr = [0, 1, 2, 3].filter(i => t > tCon + i * .3 + .75).length;
    const mont = Math.floor(clamp(seg(t, tLovely - .2, tThen - .15)) * 9);
    const cardsN = (t > tTells + .75 ? 1 : 0) + mont;
    // (the desk is painted after Clawd, below)
    const pileN = Math.min(4, nArr) + Math.min(5, mont);
    for (let i = 0; i < 4; i++) {
      const a = tCon + i * .3, k = seg(t, a, a + .75); if (k <= 0 || k >= 1) continue;
      const p = arcPt([SLOT[0] + 20, SLOT[1]], [1165, 630], 220, easeOut(k));
      envelope(p[0], p[1], 70, k * 7 + i, { key: 'fly' + i, seal: C.teal });
    }
    // the Navigator, mug in her far hand; reaches for the summary card on "tells"
    const reach = ease(seg(t, tTells - .1, tTells + .3)) * (1 - ease(seg(t, tTells + 1.0, tTells + 1.4)));
    const nm = navMood(t, [[0, 'neutral'], [tTells + .6, 'happy'], [tLovely + .8, 'proud'], [tThen + .2, 'neutral'], [tDull + .3, 'sleepy']]);
    const nPose = { ...nm, view: 'q', aR: lerp(nm.aR ?? -1.28, -.2, reach), aL: -1.0, emote: nm.emote === 'zzz' ? null : nm.emote };
    nav(NX, FLOOR + 10, 20, { ...nPose, handL: (s, sw, up) => navProp('mug', s, sw, { up, steam: .8 }) });
    // Clawd reads and hands over a summary card
    const readUp = ease(seg(t, tReads - .3, tReads)) * (1 - ease(seg(t, tTells - .2, tTells + .1)));
    const holdS = t > tArr + .4;   // holding the stranger's letter
    const cm = emotions(t, [[0, 'happy'], [tReads - .1, 'neutral', { lookY: .5, lookX: -.1 }], [tTells, 'happy'], [tLovely, 'excited'], [tThen - .1, 'neutral'], [tStr - .1, 'surprised', { lookX: -1 }], [tArr + .45, 'hopeful', { lookY: .3 }], [tDull + .1, 'neutral', { lookY: .6, lookX: .3 * Math.sin(t * 5) }]]);
    const armUp = Math.max(readUp, holdS ? 1 : 0);
    const co = { ...cm, aL: lerp(cm.aL ?? .2, .7, armUp), aR: lerp(cm.aR ?? .2, .7, armUp), noShadow: true };
    clawd(CX, CY, CU, co);
    desk(t, { cards: cardsN });
    for (let i = 0; i < pileN; i++) { boilSeed('pile' + i); envelope(1165 + (hash(i + 9) - .5) * 14, 640 - i * 4, 70, (hash(i) - .5) * .2, { key: 'pile' + i, seal: C.teal }); }
    if (readUp > .02) { boilSeed('readsheet'); sheet(CX, 600 - 20 * readUp, 90 * readUp, 118 * readUp, 0, { key: 'reading' }); }
    // summary cards: one on "tells", then a card per montage day
    { const k = seg(t, tTells, tTells + .75); if (k > 0 && k < 1) { boilSeed('card fly'); const hand = navHand(NX, FLOOR + 10, 20, nPose, 'R'); const p = arcPt([CX - 40, 600], [lerp(hand[0], 845, 0), hand[1]], 160, ease(k)); card(p[0], p[1], 70, k * 6); } }
    for (let i = 0; i < 9; i++) { const a = lerp(tLovely - .2, tThen - .15, i / 9), k = seg(t, a, a + .3); if (k > 0 && k < 1) { boilSeed('mcard' + i); const p = arcPt([CX - 40, 590], [845, 620], 140, k); card(p[0], p[1], 60, k * 5); } }
    // the stranger's letter: pokes through the slot, slides in, hops to Clawd
    const poke = seg(t, tThen + .35, tStr + .2), hop = seg(t, tArr - .1, tArr + .45);
    if (poke > 0 && hop < 1) {
      if (hop <= 0) envelope(SLOT[0] + lerp(-90, 30, easeOut(poke)) + (poke < 1 ? Math.sin(t * 30) * 2 : 0), SLOT[1] + 2, 78, .04, { col: LILAC, seal: ROSE, key: 'strenv' });
      else { const p = arcPt([SLOT[0] + 30, SLOT[1]], [CX, 590], 260, ease(hop)); envelope(p[0], p[1], 78, hop * 6.3, { col: LILAC, seal: ROSE, key: 'strenv' }); }
    }
    if (holdS) {
      const opn = ease(seg(t, tDull - .15, tDull + .3));
      if (opn < .5 && t < tFly) envelope(CX, 588, 78 * (1 - opn), 0, { col: LILAC, seal: ROSE, key: 'strenv' });
      if (opn >= .5 && t < tFly) sheet(CX, 572, 96, 124, 0, { key: 'strsheet', detail: false });
    }
    const hs = toScreen(CX, 572), sc = CAM.zoom;
    camEnd();
    // the letter flies at the lens and becomes the next shot's full-frame page
    if (t >= tFly) {
      const k = easeIn(seg(t, tFly, tEnd - .02)) ** .8, e = BL;
      const x = lerp(hs[0], e.cx, k), y = lerp(hs[1], e.cy + 240, k), w = lerp(96 * sc, e.w, k), h = lerp(124 * sc, e.h, k);
      sheet(x, y, w, h, lerp(0, 0, k) + .15 * Math.sin(k * Math.PI), { key: 'bsheet', detail: k > .6 });
    }
    seamIn('wipe', lt);
  }

  // ---------- B: the paragraph you can't see ----------
  function shotLetter(t, lt, dur) {
    const tBot = wt('hook', 'bottom'), tWhite = wt('hook', 'white'), tCant = wt('hook', 'cant'), tAg = wt('hook', 'agent', 1), tCan = wt('hook', 'can', -1);
    const tAs = wt('letter', 'assistant'), tInv = wt('letter', 'invoices'), tBank = wt('letter', 'bank'), tFwd = wt('letter', 'forward'), tDel = wt('letter', 'delete'), tMen = wt('letter', 'don');
    const rowY = r => BL.cy - BL.h / 2 + BL.h * .655 + r * BL.h * .066;
    const active = t < tAs ? -1 : t < tInv ? 0 : t < tFwd ? 1 : t < tDel ? 2 : t < tMen ? 3 : 4;
    const cyRow = active < 0 ? 760 : rowY(Math.max(0, active)) - 60;
    const cy = kf(t, [[t - lt, 300], [tBot, 300], [tBot + 1.0, 660], [tAs - .4, 690], [tAs + .4, rowY(0) - 40], [tInv - .2, rowY(0) - 40], [tInv + .4, rowY(1) - 40], [tFwd - .2, rowY(1) - 40], [tFwd + .4, rowY(2) - 40], [tDel - .2, rowY(2) - 40], [tDel + .4, rowY(3) - 60], [tMen - .2, rowY(3) - 60], [tMen + .4, rowY(4) - 80]]);
    const zoom = kf(t, [[t - lt, 1], [tBot + 1, 1.02], [tAs, 1.1], [tMen + 1.5, 1.2]]);
    camBegin(960 + 12 * Math.sin(lt * .4), cy, zoom);
    // the desk the letter lies on
    boilSeed('b desk');
    paint(rectPts(-400, -600, 2800, 2600), { wash: '#9A6A42', fill: C.ochreDk, fillOp: 100, bleed: .1, tex: .8, border: .4, ink: null });
    for (let i = 0; i < 7; i++) { boilSeed('b grain' + i); inkLine([[-300, -400 + i * 330], [2300, -380 + i * 330 + 40 * Math.sin(i)]], .6, mixCol('#9A6A42', INK, .35), 'inkfine', .4); }
    // the reading light: Clawd's gaze sweeps the rows
    const rev = ease(seg(t, tCan, tCan + 1.5)) ** .9;
    const icons = [pop01(t, tAs - .1), pop01(t, tInv - .1), pop01(t, tBank - .1), pop01(t, tFwd - .1), pop01(t, tDel - .1), pop01(t, tMen - .1)];
    const lit = t < tAs ? -1 : t < tInv ? 0 : t < tBank ? 1 : t < tFwd ? 2 : t < tDel ? 3 : t < tMen ? 4 : 5;
    const shim = t > tWhite - .1 && t < tWhite + 1.6 ? lerp(-6, 6, seg(t, tWhite - .1, tWhite + 1.6)) : null;
    sheet(BL.cx, BL.cy, BL.w, BL.h, 0, { key: 'bsheet', detail: true, ghost: 1, shim, rev, icons, lit });
    if (rev > 0) {
      const r = clamp(rev * 5.4, 0, 4.99), row = Math.floor(r), gx = lerp(BL.cx - 3.3 * 88, BL.cx + 3.8 * 88, r - row);
      if (rev < 1) glow(gx, rowY(row), 110, ROSE_GL, .6);
      glow(BL.cx, rowY(2), 420, ROSE_GL, .18 * rev);
    }
    if (lit >= 0) { const r = [0, 1, 1, 2, 3, 4][lit], ix = lit === 2 ? -2.7 : -3.75; glow(BL.cx + ix * 88, rowY(r), 90, ROSE_GL, .5 + .2 * Math.sin(t * 6)); }
    camEnd();
    // the Navigator rises into frame and sees nothing
    const nIn = backOut(seg(t, tCant - .55, tCant - .05)) * (1 - ease(seg(t, tAs + .3, tAs + 1.0)));
    if (nIn > .01) {
      const nm = navMood(t, [[0, 'neutral', { lookX: .8, lookY: .5 }], [tCant + .15, 'confused', { lookX: .7, lookY: .6 }], [tCan + .5, 'confused', { lookX: .9, lookY: .5, eyes: 'narrow' }]]);
      nav(300, 1250 + 420 * (1 - nIn), 38, { ...nm, view: 'q', aL: -1.3, aR: -1.3, noShadow: true });
    }
    // Clawd pops up and can read it
    const cIn = backOut(seg(t, tAg - .35, tAg + .05));
    let eye = [1640, 880];
    if (cIn > .01) {
      const lean = ease(seg(t, tAs, tMen + 1));
      const cm = emotions(t, [[0, 'neutral', { lookX: .8, lookY: .5 }], [tCan + .05, 'starstruck', { lookX: .9, lookY: .5, emote: null }], [tAs + .2, 'hopeful', { lookX: .9, lookY: .4 }], [tFwd, 'hopeful', { lookX: 1, lookY: .5, tint: 'rosy', tintK: .5 }]], { take: .6 });
      const gx = 1630 - 60 * lean, gy = 1110 + 460 * (1 - cIn) - 30 * lean;
      clawd(gx, gy, 44, { ...cm, view: 'q', flip: true, aL: -.2, aR: -.1, noShadow: true, rot: -.08 * lean, tintK: (cm.tintK ?? 1) * 1, col: cm.col });
      eye = [gx - 1.5 * 44 * .74 * 1.0 - 20, gy - 6 * 44];
      if (t > tCan) glow(eye[0], eye[1], 90, ROSE_GL, .45 * seg(t, tCan, tCan + .3));
    }
    seamOut('iris', lt, dur, { cx: eye[0], cy: eye[1], col: C.night, half: .5 });
  }

  // ---------- C: will it obey? ----------
  function shotObey(t, lt, dur) {
    const tRead = wt('letter', 'reads'), tJob = wt('letter', 'job'), tObey = wt('letter', 'obeys'), tModel = wt('letter', 'model'), tTool = wt('letter', 'tool'), tLuck = wt('letter', 'luck'), tThat = wt('letter', 'That'), tProb = wt('letter', 'problem');
    const push1 = ease(seg(t, tLuck - .4, tProb + .4));
    camBegin(lerp(1080, 1110, push1) + 10 * Math.sin(lt * .5), lerp(560, 520, push1), lerp(1.3, 1.5, push1) + .01 * lt);
    const open = ease(seg(t, tObey + .2, tObey + .9));
    office(t, { ph: .3, open });
    const cm = emotions(t, [[0, 'hopeful', { lookY: .5 }], [tJob - .05, 'dizzy', { emote: null, tint: 'rosy', tintK: .7 }], [tObey + .1, 'dizzy', { emote: null, tint: 'rosy', tintK: .8, lookX: .6 }]], { take: .6 });
    const wind = ease(seg(t, tObey + .3, tObey + .7)), aim = seg(t, tModel, tProb);
    const co = { ...cm, dx: (cm.dx || 0) * .3, noShadow: true, aL: t < tObey ? .75 : lerp(.75, -.3, wind), aR: t < tObey ? .75 : lerp(.75, .95 + .1 * Math.sin(aim * 3), wind), rot: (cm.rot || 0) * .4 };
    clawd(CX, CY, CU, co);
    desk(t, { cards: 3, lamp: false });
    // the letter: held up (rose side toward Clawd, glow on him), then dropped when the invoice plane is folded
    if (t < tObey + .1) {
      glow(CX, 600, 150, ROSE_GL, .45 + .15 * Math.sin(t * 5));
      sheet(CX, 590, 90, 118, 0, { key: 'cback', back: 1 });
    } else {
      sheet(CX - 150, 640, 110, 26, .02, { key: 'cflat' });
      glow(CX - 150, 630, 70, ROSE_GL, .35);
    }
    // the invoice becomes a paper plane in the raised hand, aimed at the open porthole
    if (t > tObey) {
      const h = clawdHand(CX, CY, CU, co, 'R'), fold = ease(seg(t, tObey, tObey + .45));
      boilSeed('cplane');
      if (fold < 1) { push(); translate(h[0], h[1] - 10); scale(1 - fold * .6, 1); sheet(0, 0, 60, 76, .2, { key: 'cinv' }); pop(); }
      if (fold > .3) plane(h[0] + 20, h[1] - 20, 62, -.3 + .05 * Math.sin(t * 3), mixCol(C.ochreLt, SHEET, .4));
    }
    // the coin: flips on "model" and "tool", hangs spinning on "luck"
    if (t > tModel - .2) {
      const up = backOut(seg(t, tModel - .2, tModel + .3)), hang = ease(seg(t, tLuck - .2, tLuck + .4));
      const bob = Math.abs(Math.sin((t - tModel) * 5)) * 60 * (1 - hang);
      const spin = (t - tModel) * lerp(22, 7, hang);
      boilSeed('coin');
      glow(CX, 390 - bob, 110 * up, C.ochreLt, .6 * hang);
      coin(CX, lerp(600, 420, up) - bob - 30 * hang, 42 * up, spin);
    }
    // the Navigator, back turned with her mug, turns round on "That" and sees it
    const nm = navMood(t, [[0, 'neutral'], [tThat + .35, 'surprised', { lookX: .5 }], [tProb, 'worried', { lookX: .6 }]]);
    const tv = t < tThat ? { view: 'q', flip: true } : turn(t, tThat, tThat + .3, -.125, .125);
    nav(640, FLOOR + 10, 20, { ...nm, ...tv, aR: -.55, handR: (s, sw, up) => navProp('mug', s, sw, { up, steam: .7 }) });
    const eye = toScreen(CX + 10, CY - 6 * CU);
    camEnd();
    seamIn('iris', lt, { cx: eye[0], cy: eye[1], col: C.night, half: .5 });
    seamOut('page', lt, dur, { col: C.cream });
  }

  // ---------- D: prompt injection; a letter is not an order ----------
  function shotWhy(t, lt, dur) {
    const tInj = wt('why', 'injection'), tYou = wt('why', 'You'), tLet = wt('why', 'letter'), tBurn = wt('why', 'burn'), tSum = wt('why', 'summarize', 1), tReach = wt('why', 'reach'), tMatch = wt('why', 'matches');
    const tTo = wt('why', 'agent') - .5, tEvery = wt('why', 'everything'), tReq = wt('why', 'request'), tStr = wt('why', 'stranger'), tWall = wt('why', 'wall'), tBetw = wt('why', 'between');
    const whip = ease(seg(t, tTo - .15, tTo + .3));
    const cx = kf(t, [[t - lt, 1000], [tYou + .1, 1000], [tYou + .9, 820], [tTo - .15, 840]]) * (1 - whip) + 1600 * whip;
    const zoom = kf(t, [[t - lt, 2.3], [tYou + .1, 2.15], [tYou + .9, 1.5], [tTo - .15, 1.55], [tTo + .3, 1.35], [tBetw + 1, 1.45]]);
    const cy = kf(t, [[t - lt, 570], [tYou + .1, 570], [tYou + .9, 560], [tTo + .3, 520]]);
    camBegin(cx, cy, zoom);
    office(t, { ph: .3, chart: true });
    desk(t, { lamp: false });
    // the glass: a drop of rose ink falls in on "injection"
    const drop = seg(t, tInj - .55, tInj), bloom = ease(seg(t, tInj, tInj + 2.2));
    glass(1000, 648, 40, bloom);
    if (drop > 0 && drop < 1) { boilSeed('drop'); const y = lerp(330, 570, easeIn(drop)); paint([[1000, y - 22], [1011, y], [1000, y + 11], [989, y]], { wash: ROSE, ink: INK, sw: .6, curv: .6 }); }
    if (drop >= 1 && t < tInj + .5) { boilSeed('splashring'); const k = seg(t, tInj, tInj + .5); inkLine(_arcPtsL(1000, 568, 20 + 40 * k, Math.PI, TAU), 1, mixCol(C.sea, INK, .3), 'inkfine', .5); }
    // the matchbox on the desk: slides toward her on "reach", she pushes it back on "matches"
    const mx = 1150 - 230 * ease(seg(t, tReach - .5, tReach)) + 200 * ease(seg(t, tMatch, tMatch + .35));
    matchbox(mx, 648, 34);
    // the Navigator: a letter drops into her hand; she summarises it; she does not reach for the matches
    const nm = navMood(t, [[0, 'neutral'], [tLet + .2, 'thinking', { emote: null }], [tBurn + .4, 'neutral', { lookX: .5, lookY: .4, brows: 'raised' }], [tSum - .1, 'happy'], [tMatch - .1, 'stern', { lookX: Math.sin(t * 14) > 0 ? .8 : -.2 }], [tMatch + .9, 'happy']]);
    const hold = ease(seg(t, tLet - .1, tLet + .4)), push2 = ease(seg(t, tMatch - .15, tMatch + .2)) * (1 - ease(seg(t, tMatch + .6, tMatch + 1)));
    const nPose = { ...nm, view: 'q', aR: lerp(-1.28, .6, hold), aL: -1.22 };
    if (t > tSum) nPose.aR = lerp(.6, -.35, ease(seg(t, tSum, tSum + .4)));
    if (t > tMatch - .6) nPose.aR = lerp(nPose.aR, -.5 + .35 * push2, ease(seg(t, tMatch - .6, tMatch - .2)));
    const NXw = 700;
    nav(NXw, FLOOR + 10, 22, nPose);
    const hand = navHand(NXw, FLOOR + 10, 22, nPose, 'R');
    const fl = t < tLet ? arcPt([hand[0] + 60, 200], hand, 0, easeIn(seg(t, tLet - .8, tLet))) : hand;
    if (t > tLet - .8) fireLetter(fl[0] + 40, fl[1] - 50, 90, -.1 + .04 * Math.sin(t * 2), ease(seg(t, tBurn - .1, tBurn + .5)) * (t < tSum + .3 ? 1 : 1 - seg(t, tSum + .3, tSum + .8)), t);
    // her summary: a teal card slides into the tray
    { const k = seg(t, tSum, tSum + .6); if (k > 0) { boilSeed('dcard'); const p = arcPt([hand[0] + 40, hand[1]], [860, 624], 90, ease(k)); card(p[0], p[1], 70, k < 1 ? k * 3 : 0); } }
    boilSeed('d tray'); paint(rectPts(805, 628, 110, 20, 1), { wash: C.ochreDk, ink: INK, sw: .8 });
    // Clawd, front on, lid open: everything pours in, her order and the stranger's letter together
    const GX = 1600, gu = 30, chew = t > tBetw + .3;
    const lid = (t < tEvery - .6 ? 0 : .5) * (chew ? .5 + .5 * Math.cos((t - tBetw) * 14) : 1);
    const cm = emotions(t, [[0, 'hopeful'], [tEvery - .5, 'excited', { emote: null }], [tBetw + .3, 'dizzy', { emote: 'stars', tint: 'rosy', tintK: .6 }]], { take: .5 });
    clawd(GX, FLOOR + 10, gu, { ...cm, view: 'front', lid, aL: 1.2 + .2 * Math.sin(t * 7), aR: 1.2 + .2 * Math.sin(t * 7 + 1), dx: 0, rot: (cm.rot || 0) * .5 });
    const mouthY = FLOOR + 10 - 8 * gu + 20;
    const drops = [];
    for (let i = 0; i < 4; i++) drops.push([tEvery - .3 + i * .28, GX + (i % 2 ? -50 : 50), 'sheet', i]);
    drops.push([tReq - .1, GX - 70, 'order', 9]); drops.push([tStr - .1, GX + 70, 'stranger', 10]);
    drops.push([tWall + .1, GX - 70, 'order', 11]); drops.push([tWall + .3, GX + 70, 'stranger', 12]);
    for (const [a, x, kind, i] of drops) {
      const k = seg(t, a, a + .8); if (k <= 0 || k >= 1) continue;
      const y = lerp(150, mouthY, k * k * .5 + k * .5), xx = lerp(x, GX + (x - GX) * .3, k), r = Math.sin(t * 5 + i) * .4;
      boilSeed('drop' + i);
      if (kind === 'sheet') sheet(xx, y, 60, 76, r, { key: 'dsh' + i });
      else if (kind === 'order') card(xx, y, 72, r, TEAL_CARD);
      else envelope(xx, y, 76, r, { col: LILAC, seal: ROSE, key: 'dst' + i });
    }
    // a flimsy fence rises between the streams on "wall", and falls straight over
    const fu = backOut(seg(t, tWall - .25, tWall + .1)), ff = easeIn(seg(t, tBetw, tBetw + .45));
    if (fu > .01 && ff < 1) {
      push(); translate(GX, mouthY - 20); rotate(ff * 1.55);
      for (let i = 0; i < 3; i++) { boilSeed('fence' + i); paint(rectPts(-33 + i * 22, -420 * fu + (i % 2) * 18, 20, 420 * fu - (i % 2) * 18), { wash: C.ochreLt, fill: C.ochre, fillOp: 60, ink: INK, sw: .9 }); }
      boilSeed('fence bar'); inkLine([[-40, -300 * fu], [40, -305 * fu]], 2, INK, 'ink', 0); inkLine([[-40, -120 * fu], [40, -118 * fu]], 2, INK, 'ink', 0);
      pop();
    }
    const whipK = Math.sin(clamp(seg(t, tTo - .15, tTo + .3)) * Math.PI), mouthS = toScreen(GX, mouthY);
    camEnd();
    if (whipK > .05) for (let i = 0; i < 6; i++) { boilSeed('whip' + i); const y = 80 + i * 115 + 30 * hash(i); inkLine([[-50, y], [W + 50, y + 10 * hash(i + 1)]], 2.5 * whipK, mixCol(C.cream, C.ochre, hash(i) * .5), 'dry', 0); }
    seamIn('page', lt, { col: C.cream });
    seamOut('splash', lt, dur, { cx: mouthS[0], cy: mouthS[1], cols: [C.rose, C.ochre, C.teal], seed: 3 });
  }

  // ---------- E: strangers' text gets in everywhere ----------
  function shotDoors(t, lt, dur) {
    const tEm = wt('doors', 'Email'), tWeb = wt('doors', 'webpages'), tCal = wt('doors', 'calendar'), tSh = wt('doors', 'shared'), tAdd = wt('doors', 'add'), tDesc = wt('doors', 'description');
    const tTell = wt('doors', 'Telling'), tHelp = wt('doors', 'helps'), tFail = wt('doors', 'fail'), tOnce = wt('doors', 'once'), tSo = wt('doors', 'So'), tTrick = wt('doors', 'tricked');
    const pushC = seg(t, tTrick - .4, t - lt + dur);
    const baseZ = lerp(1.08, 1.2, seg(t, tTell, tOnce)), bx = lerp(960, 1000, seg(t, tTell, tOnce));
    camBegin(lerp(bx + 15 * Math.sin(lt * .35), 1020, ease(pushC)), lerp(530, 290, ease(pushC)), baseZ * Math.pow(5.4 / baseZ, easeIn(pushC) * .6 + ease(pushC) * .4));
    office(t, { ph: .3, open: ease(seg(t, tWeb - .4, tWeb)) * (1 - ease(seg(t, tCal, tCal + .5))) });
    const drawFlying = () => {
    const caught = [];
    // rose-tinged things come in through every opening
    const items = [];
    for (let i = 0; i < 3; i++) items.push({ a: tEm - .1 + i * .22, from: [SLOT[0] + 30, SLOT[1]], h: 200, kind: 'env', i });
    for (let i = 0; i < 3; i++) items.push({ a: tWeb + i * .25, from: [PORT[0] - 60, PORT[1] + 20], h: 120, kind: 'page', i: i + 3, flutter: true });
    items.push({ a: tCal - .1, from: [400, FLOOR - 10], h: 60, kind: 'cal', i: 6, slide: true });
    items.push({ a: tSh - .15, from: [CX + 120, -120], h: 0, kind: 'doc', i: 7 });
    for (const it of items) {
      const dur2 = it.slide ? 1.2 : .9, k = seg(t, it.a, it.a + dur2);
      if (k <= 0) continue;
      if (k >= 1) { caught.push(it); continue; }
      let p;
      if (it.slide) { p = k < .6 ? [lerp(it.from[0], 780, ease(k / .6)), FLOOR - 8] : arcPt([780, FLOOR - 8], [CX, 600], 120, ease((k - .6) / .4)); }
      else p = arcPt(it.from, [CX + (it.i % 3 - 1) * 30, 600], it.h, ease(k));
      if (it.flutter) p = [p[0] + 30 * Math.sin(k * 9 + it.i), p[1] + 20 * Math.sin(k * 13)];
      boilSeed('item' + it.i);
      drawItem(it.kind, p[0], p[1], it.i, k * 5 + it.i, t);
    }
    // the add-on: a parcel lands on the desk and pops open with a leaflet
    const pk = seg(t, tDesc - .3, tDesc + .3), popK = backOut(seg(t, tAdd, tAdd + .4));
    if (pk > 0) {
      const py = pk < 1 ? lerp(-100, 640, easeIn(pk)) : 640;
      boilSeed('parcel');
      paint(rectPts(1180, py - 60, 80, 60), { wash: C.ochreLt, fill: C.ochre, fillOp: 60, ink: INK, sw: 1 });
      inkLine([[1220, py - 60], [1220, py]], 2.4, C.rose, 'ink', 0);
      if (popK > .01) { paint([[1180, py - 60], [1180 - 30 * popK, py - 60 - 40 * popK], [1210 - 20 * popK, py - 80 * popK - 50]], { wash: C.ochreLt, ink: INK, sw: .8 }); sheet(1220, py - 60 - 60 * popK, 60, 78, .1 * Math.sin(t * 3), { key: 'leaflet', rev: popK, ghost: 0 }); glow(1220, py - 90, 80 * popK, ROSE_GL, .4); }
    }
    };
    // the hard hat: tossed on "Telling", then things bounce off it; one slips under on "fail"
    const hatK = seg(t, tTell + .1, tTell + .8), hatOn = hatK >= 1;
    const bumps = [tHelp - .1, tHelp + .45, wt('doors', 'time') - .1];
    const cm = emotions(t, [[0, 'neutral'], [tEm - .2, 'excited', { emote: null }], [tTell + .7, 'surprised', { lookY: -1 }], [tHelp + .1, 'proud'], [tFail + .15, 'surprised'], [tOnce, 'dizzy', { tint: 'rosy', tintK: .6 }]], { take: .6 });
    const ring2 = ring(t, bumps.map(b => b + .4), 9, 30);
    const catchA = t < tTell ? .9 + .3 * Math.sin(t * 8) : cm.aL;
    const co = { ...cm, aL: catchA, aR: t < tTell ? .9 + .3 * Math.sin(t * 8 + 2) : cm.aR, hat: hatOn ? 'hard' : null, noShadow: true, sq: (cm.sq || 0) + .1 * ring2 };
    clawd(CX, CY, CU, co);
    desk(t, { cards: 4 });
    drawFlying();
    const nm = navMood(t, [[0, 'neutral', { lookX: .6 }], [tEm + .3, 'surprised'], [tSh, 'worried'], [tTell - .1, 'determined'], [tFail + .3, 'worried'], [tSo, 'thinking', { lookX: .5, lookY: -.8 }]]);
    const toss = seg(t, tTell - .3, tTell + .2);
    const nPose = { ...nm, view: 'q', aR: t < tTell + .3 && t > tTell - .5 ? lerp(-1.28, .84, Math.sin(clamp(toss) * Math.PI * .8)) : nm.aR };
    nav(NX + 90, FLOOR + 10, 20, nPose);
    if (hatK > 0 && !hatOn) { const h = navHand(NX + 90, FLOOR + 10, 20, nPose, 'R'); const p = arcPt(h, [CX, CY - 8 * CU], 160, ease(hatK)); push(); translate(p[0], p[1]); rotate((1 - hatK) * 4); hardHat(0, 0, CU); pop(); }
    else if (hatK <= 0 && t > tTell - .6) { const h = navHand(NX + 90, FLOOR + 10, 20, nPose, 'R'); hardHat(h[0], h[1], CU * .8); }
    // things bouncing off the hat
    bumps.forEach((b, i) => {
      const k = seg(t, b - .5, b + .6); if (k <= 0 || k >= 1) return;
      const top = [CX, CY - 11 * CU];
      const p = k < .45 ? [top[0] + (i - 1) * 20, lerp(-60, top[1], easeIn(k / .45))] : arcPt(top, [CX + (i - 1) * 320 + 160, FLOOR - 20], 180, (k - .45) / .55);
      boilSeed('bump' + i);
      drawItem(i === 1 ? 'page' : 'env', p[0], p[1], 20 + i, k * 8, t);
      if (k > .45 && k < .75) emote('spark', top[0] + 60, top[1] - 20, 22, seg(k, .45, .55), t);
    });
    // one sneaks in low, under the brim, on "fail"
    { const k = seg(t, tFail - .7, tOnce); if (k > 0 && k < 1) { const p = [lerp(PORT[0] - 40, CX + 60, ease(k)), lerp(PORT[1] + 60, CY - 7.3 * CU, ease(k)) + 20 * Math.sin(k * 12)]; boilSeed('sneak'); push(); translate(p[0], p[1]); scale(1 - .7 * easeIn(k)); envelope(0, 0, 70, Math.sin(k * 10) * .3, { col: LILAC, seal: ROSE, key: 'sneak' }); pop(); } }
    if (t > tOnce) glow(CX, CY - 6 * CU, 90, ROSE_GL, .35);
    camEnd();
    seamIn('splash', lt, { cx: 960, cy: 500, cols: [C.rose, C.ochre, C.teal], seed: 3 });
  }
  function drawItem(kind, x, y, i, rot, t) {
    if (kind === 'env') envelope(x, y, 84, rot, { col: LILAC, seal: ROSE, key: 'ienv' + i });
    else if (kind === 'page') sheet(x, y, 70, 90, Math.sin(rot) * .5, { key: 'ipg' + i, rev: 1, ghost: 0 });
    else if (kind === 'cal') {
      push(); translate(x, y); rotate(Math.sin(rot) * .2);
      boilSeed('ical' + i);
      paint(rectPts(-38, -30, 76, 60), { wash: SHEET, ink: INK, sw: .8 });
      paint(rectPts(-38, -30, 76, 14), { wash: C.rose, ink: INK, sw: .6 });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) paint(rectPts(-30 + c * 16, -10 + r * 12, 10, 8), { wash: r === 1 && c === 2 ? ROSE : mixCol(SHEET, INK, .15), ink: null });
      pop();
    } else if (kind === 'doc') sheet(x, y, 76, 98, Math.sin(rot) * .3, { key: 'idoc' + i, rev: 1, ghost: 0 });
  }

  // ---------- F: the lethal trifecta, and taking away a leg ----------
  function shotTrifecta(t, lt, dur) {
    const tLeth = wt('trifecta', 'lethal'), tThree = wt('trifecta', 'Three'), tPriv = wt('trifecta', 'private'), tText = wt('trifecta', 'text'), tSend = wt('trifecta', 'send'), tLink = wt('trifecta', 'link'), tAll = wt('trifecta', 'all');
    const L = n => wt('leg', 'leg', n);
    const tLeg1 = L(0), tFalls = wt('leg', 'falls'), tCant = wt('leg', 'cant'), tSum = wt('leg', 'summary'), tOnly = wt('leg', 'only'), tStr = wt('leg', 'stranger');
    const tNoth = wt('leg', 'nothing'), tSteal = wt('leg', 'steal'), tTake2 = wt('leg', 'take', 1), tLeg2 = L(-1);
    // the chart: the wall chart, pushed into until it fills the frame
    const z = kf(t, [[t - lt, 1.0], [tAll, 1.06], [tAll + 1, 1.1], [tLeg1, 1.04], [t - lt + dur, 1.02]]);
    camBegin(960 + 8 * Math.sin(lt * .3), 520 + 6 * Math.sin(lt * .4), z);
    seaChart(t, 960, 480, { dark: false, k: 1 });
    { const k = ease(seg(lt, .05, 1.1)); compassRose(lerp(636, 1640, k), lerp(520, 210, k), lerp(248, 70, k), { key: 'fcrose', rot: .05 * Math.sin(t * .5) + k * 1.2 }); }
    // the events of the leg beat: one leg taken away at a time, then put back
    const EV = [
      { leg: 'r', t0: tLeg1 - .25, fall: tFalls - .1, back: tFalls + .75, yank: true },
      { leg: 's', t0: tCant - .1, fall: tCant + .55, back: tSum + .8, off: [0, 520] },
      { leg: 'r', t0: tOnly - .1, fall: tStr - .15, back: tStr + .8, off: [620, -60] },
      { leg: 'o', t0: tNoth - .1, fall: tSteal - .3, back: tSteal + .45, off: [-620, -60] },
      { leg: 'r', t0: tTake2 - .1, fall: tLeg2 - .1, back: 1e9, yank: true },
    ];
    const off = { o: [0, 0], r: [0, 0], s: [0, 0] }, legs = { o: 1, r: 1, s: 1 };
    let fallRot = 0, rise = backOut(seg(t, tAll - .1, tAll + .35)), yankP = null;
    for (const e of EV) {
      if (t < e.t0 || t > e.back + .5) continue;
      const out = ease(seg(t, e.t0, e.t0 + .55)), back = ease(seg(t, e.back, e.back + .4)), k = out * (1 - back);
      if (e.off) { off[e.leg] = [e.off[0] * k, e.off[1] * k]; }
      legs[e.leg] = 1 - k;
      if (e.yank && k > 0) yankP = { leg: e.leg, k: seg(t, e.t0, e.t0 + .6) * (1 - back) };
      const f = easeIn(seg(t, e.fall, e.fall + .35));
      fallRot = (e.leg === 'o' ? -1 : 1) * (f * 1.45 + (f >= 1 ? .06 * Math.exp(-(t - e.fall - .35) * 8) * Math.sin((t - e.fall) * 30) : 0)) * (1 - back);
      if (back > 0) rise = backOut(back) * .999 + .001;
    }
    const sk = ease(seg(t, tLeth - .1, tLeth + .9));
    const kO = ease(seg(t, tPriv - .1, tPriv + .6)), kR = ease(seg(t, tText - .1, tText + .6)), kS = ease(seg(t, tSend - .1, tSend + .6));
    for (const [key, kk] of [['o', kO], ['r', kR], ['s', kS]]) vcircle(key, VC[key][0] + off[key][0], VC[key][1] + off[key][1], kk, sk);
    // the danger: where all three meet, the ink darkens
    const danger = seg(t, tAll - .2, tAll + .5) * (legs.o * legs.r * legs.s);
    if (danger > .02) { boilSeed('danger'); paint(blobPts(960, 470, 85 + 8 * Math.sin(t * 5), 6, .2, 20), { fill: mixCol(ROSE, INK, .45), fillOp: 220 * danger, bleed: .2, tex: .6, ink: null }); }
    strongbox(VC.o[0] - 115 + off.o[0], VC.o[1] - 40 + off.o[1], 62, pop01(t, tPriv + .1, .4));
    strangerEnv(VC.r[0] + 115 + off.r[0], VC.r[1] - 30 + off.r[1], 56, pop01(t, tText + .1, .4), t);
    const flyP = t > tLink - .3 ? seg(t, tLink - .3, tLink + .7) : t > tSend + .8 ? seg(t, tSend + .8, tSend + 1.4) * .0 : null;
    const planeFall = legs.s < 1 ? 1 - legs.s : 0;
    portIcon(VC.s[0] + off.s[0], VC.s[1] + 115 + off.s[1] + planeFall * 60, 62, pop01(t, tSend + .1, .4), t, flyP != null && flyP < 1 ? flyP : null);
    // the three-legged stool with the pirate flag, in the overlap
    stool(960, 545, 30, legs, fallRot, rise * (t > tAll - .1 ? 1 : 0), t);
    if (yankP && yankP.k > 0 && yankP.k < 1) {   // the yanked leg flies off
      const p = arcPt([965, 490], [420, 760], 220, ease(yankP.k));
      boilSeed('yank'); push(); translate(p[0], p[1]); rotate(yankP.k * 6);
      paint(ribbon([[0, -45], [0, 0], [0, 45]], 15, 12), { wash: VCOL[yankP.leg], ink: INK, sw: .9 }); pop();
    }
    camEnd();
    // the cast in front of the chart
    const hold = t > tPriv - .8 && t < tLink ? 1 : 0;
    const paintArm = t < tLeth ? -1.2 : lerp(.55, .95, .5 + .5 * Math.sin(t * 3));
    const nm = navMood(t, [[0, 'neutral', { lookX: .8, lookY: -.3 }], [tLeth - .1, 'determined', { lookX: .8 }], [tAll + .2, 'stern', { lookX: .8 }], [tFalls + .1, 'happy'], [tSum - .2, 'neutral', { lookX: .8 }], [tStr, 'happy'], [tSteal, 'proud'], [tTake2, 'determined'], [tLeg2 + .2, 'happy']]);
    const yank = (tt, e) => Math.sin(clamp(seg(tt, e - .35, e + .35)) * Math.PI);
    const swing = Math.max(yank(t, tLeg1), yank(t, tLeg2 - .2));
    const nPose = { ...nm, view: 'q', aR: t < tLeth ? (nm.aR ?? -1.28) : lerp(paintArm, .1, swing), aL: -1.22, noShadow: true };
    nav(250, 1150, 30, { ...nPose, handR: (s, sw, up) => { boilSeed('brush'); push(); rotate(-up + .9); paint(ribbon([[0, 0], [s * 1.4, 0], [s * 2.8, 0]], s * .22, s * .18), { wash: C.ochreDk, ink: INK, sw }); paint([[s * 2.8, -s * .3], [s * 3.9, 0], [s * 2.8, s * .3]], { wash: C.rose, ink: INK, sw, curv: .5 }); pop(); } });
    const cm = emotions(t, [[0, 'neutral', { lookX: -.5, lookY: -.5 }], [tPriv, 'hopeful', { lookX: -.6, lookY: -.6 }], [tAll + .2, 'scared', { emote: 'sweat' }], [tFalls + .15, 'relieved'], [tSum - .3, 'confused'], [tOnly, 'neutral', { lookX: -.6, lookY: -.6 }], [tStr + .1, 'happy'], [tNoth, 'neutral', { lookX: -.6, lookY: -.6 }], [tSteal - .1, 'smug'], [tTake2, 'neutral', { lookX: -.6, lookY: -.6 }], [tLeg2 + .1, 'excited']], { take: .7 });
    const holdCard = t > tSum - .4 && t < tSum + 1.2;
    const co = { ...cm, view: 'q', flip: true, noShadow: true, aR: holdCard ? 1.0 : cm.aR, armR: holdCard ? (u, sw) => { boilSeed('scard'); paint(rectPts(0, -1.4 * u, 2.4 * u, 1.8 * u), { wash: SHEET, ink: INK, sw }); inkLine([[.3 * u, -.8 * u], [.8 * u, -1 * u], [1.2 * u, -.5 * u], [1.7 * u, -1.1 * u], [2 * u, -.4 * u]], sw * 1.2, INK, 'ink', .4); } : null };
    clawd(1720, 1100, 34, co);
    chartBorder(CREW, false);
    seamOut('page', lt, dur, { col: C.cream, dir: -1 });
  }

  // ---------- G: change the job ----------
  function shotChecks(t, lt, dur) {
    const tSplit = wt('checks', 'Split'), tReads = wt('checks', 'reads'), tSum = wt('checks', 'summarizes'), tCant = wt('checks', 'cant'), tSend1 = wt('checks', 'send', 0);
    const tPut = wt('checks', 'Put'), tDraft = wt('checks', 'drafts'), tPress = wt('checks', 'press'), tSend2 = wt('checks', 'send', 1);
    const tGive = wt('checks', 'Give'), tSmall = wt('checks', 'smallest'), tReadO = wt('checks', 'Read', 2), tFold = wt('checks', 'folder'), tKeep = wt('checks', 'keep'), tOut = wt('checks', 'out', 1), tReach = wt('checks', 'reach');
    const thump = t > tPress + .15 ? shakeXY(t, 7 * Math.exp(-(t - tPress - .15) * 9)) : [0, 0];
    const camX = kf(t, [[t - lt, 980], [tSend1 + .2, 1000], [tPut + .8, 1520], [tSend2 + .4, 1540], [tGive + .8, 1930], [tFold + .4, 1950], [tKeep + .7, 2120]]);
    const camY = kf(t, [[t - lt, 600], [tSend2 + .4, 620], [tGive + .8, 580], [tKeep, 570], [tKeep + .7, 520]]);
    const camZ = kf(t, [[t - lt, 1.3], [tSend1, 1.38], [tPut + .8, 1.4], [tSend2 + .4, 1.45], [tGive + .8, 1.3], [tKeep + .7, 1.12]]);
    camBegin(camX + thump[0], camY + thump[1], camZ);
    office(t, { ph: .3, drawer: ease(seg(t, tReadO - .1, tReadO + .4)), locks: true });
    // the folding screen between Clawd's reading desk and the way out
    const bonk = spring(t, tCant + .2, 7, 25);
    screenPanels(1400, seg(t, tSplit - .1, tSplit + .5), bonk);
    desk(t, { cards: 2 });
    // the box on the high shelf
    const lbK = seg(t, tOut - .5, tOut + .2);
    // Clawd: reads at the desk, bonks the screen, hands the card over; then hops out and follows along
    const walk1 = seg(t, tPress + .2, tGive + .9);
    const cx = t < tPress + .2 ? CX : lerp(CX, 2210, ease(walk1));
    const atDesk = t < tPress + .2;
    const cm = emotions(t, [[0, 'neutral', { lookY: .5 }], [tSum - .1, 'happy'], [tCant + .15, 'surprised'], [tSend1 + .2, 'happy', { lookX: -.8 }], [tDraft - .1, 'hopeful', { lookX: 1 }], [tPress + .3, 'excited'], [tSmall + .5, 'starstruck'], [tReadO + .3, 'happy', { lookX: -1 }], [tKeep + .2, 'hopeful', { lookY: -1 }], [tReach + .4, 'relieved']], { take: .6 });
    const reachR = ease(seg(t, tCant - .3, tCant + .1)) * (1 - ease(seg(t, tCant + .4, tCant + .8)));
    const hopK = t > tReach - .3 ? jump(t, tReach - .3, tReach + .45, 6) : { dy: 0, sq: 0 };
    let co;
    if (atDesk) co = { ...cm, noShadow: true, aR: lerp(cm.aR ?? .2, .3, reachR), dx: .6 * reachR, aL: t > tSend1 - .2 && t < tSend1 + .6 ? 1.0 : (t > tReads - .3 && t < tCant - .3 ? .7 : cm.aL), view: t > tDraft - .6 ? 'q' : 'front' };
    else { const w = { walk: (cx - CX) / (4 * CU) }; co = { ...cm, view: walk1 > 0 && walk1 < 1 ? 'side' : 'q', flip: walk1 >= 1, walk: walk1 > 0 && walk1 < 1 ? w.walk : null, dy: (cm.dy || 0) * .3 + hopK.dy, sq: (cm.sq || 0) + hopK.sq, aL: t > tKeep + .2 ? 1.2 : cm.aL, aR: t > tKeep + .2 ? 1.25 : cm.aR }; }
    const cY = atDesk ? CY : FLOOR + 8;
    clawd(cx, cY, CU, co);
    if (atDesk) {
      if (t > tReads - .3 && t < tSum) sheet(CX, 596, 80, 104, 0, { key: 'greads' });
      if (t > tSum - .1 && t < tSend1 + .15) { const h = clawdHand(CX, CY, CU, co, 'R'); card(h[0], h[1] - 10, 58, .1); }
      desk(t, { cards: 2 });
    }
    // the Navigator walks along: split station → out-box → watches the key and the shelf
    const nx = kf(t, [[t - lt, 640], [tPut - .1, 640], [tPut + .9, 1650]]);
    const walking = t > tPut - .1 && t < tPut + .9;
    const nm = navMood(t, [[0, 'determined'], [tSend1 + .3, 'happy'], [tPut, 'determined'], [tPress, 'stern'], [tSend2 + .2, 'proud'], [tGive, 'neutral'], [tSmall + .5, 'happy'], [tKeep, 'determined'], [tReach + .3, 'laugh']]);
    const recv = ease(seg(t, tSend1 - .1, tSend1 + .2)) * (1 - ease(seg(t, tSend1 + .8, tSend1 + 1.2)));
    const stampUp = t > tDraft && t < tSend2 + .3 ? 1 : 0;
    const stampHit = Math.sin(clamp(seg(t, tPress - .3, tPress + .15)) * Math.PI * .5);
    const tossK = seg(t, tSmall - .05, tSmall + .55), boxToss = seg(t, tOut - .7, tOut + .1);
    let aL = -1.22, aR = nm.aR ?? -1.28;
    if (recv > 0) aR = lerp(aR, -.16, recv);
    if (stampUp) { aR = lerp(.9, .19, stampHit); }
    if (t > tGive - .2 && t < tSmall + .6) aR = lerp(-1.28, .3, ease(seg(t, tGive - .2, tGive + .2))) + .4 * Math.sin(clamp(tossK) * Math.PI);
    if (t > tKeep - .3 && t < tOut + .3) aR = lerp(.3, 1.2, ease(boxToss));
    const nPose = { ...nm, view: walking ? 'side' : 'q', walk: walking ? t * 1.7 : null, aL, aR };
    if (walking) { nPose.aL = null; nPose.aR = null; }
    nav(nx, FLOOR + 10, 21, nPose);
    const hand = walking ? [nx, 0] : navHand(nx, FLOOR + 10, 21, nPose, 'R');
    if (recv > .5) card(hand[0] + 10, hand[1], 58, .1);
    // the draft: from Clawd (at the desk) to her; she stamps it and posts it
    { const k = seg(t, tDraft - .1, tDraft + .6); if (k > 0 && t < tSend2 + .35) {
      const ob = [1750, 700];
      let p = k < 1 ? arcPt([CX + 40, 590], [ob[0], ob[1] - 30], 200, ease(k)) : [ob[0], ob[1] - 30];
      if (t > tSend2) p = [ob[0], lerp(ob[1] - 30, ob[1] + 20, seg(t, tSend2, tSend2 + .35))];
      boilSeed('gdraft'); sheet(p[0], p[1], 56, 40, 0, { key: 'gdraft' });
      if (t > tPress + .1) { boilSeed('gmark'); paint(ellPts(p[0], p[1], 12, 12, 12), { wash: C.teal, ink: null }); }
    } }
    if (stampUp) stamp(hand[0], hand[1] + 1.8 * 14, 14);
    // the key ring: one small key off it, to Clawd
    if (t > tGive - .2 && t < tSmall + 1.2) keyRing(hand[0], hand[1], 34, t < tSmall ? 5 : 4, t, 'gring');
    if (tossK > 0) { const dest = clawdHand(2210, FLOOR + 8, CU, { ...co, flip: true, view: 'q', aR: .6 }, 'R'); const p = tossK < 1 ? arcPt(hand, [2150, 640], 220, ease(tossK)) : [2150, 640]; if (t < tReadO + .2) keyShape(p[0], p[1], 22, tossK * 8, C.ochreLt); }
    if (t > tFold - .5) { const k = backOut(seg(t, tFold - .5, tFold)); boilSeed('gfolder'); paint(rectPts(1905, 470 - 70 * k, 90, 70 * k), { wash: C.ochreLt, fill: C.ochre, fillOp: 60, ink: INK, sw: .8 }); }
    // the lockbox, tossed up onto the high shelf
    { const from = [1720, 620], to = [2330, 330]; const p = boxToss <= 0 ? (t > tKeep - .3 ? navHand(nx, FLOOR + 10, 21, nPose, 'R') : null) : boxToss < 1 ? arcPt(from, to, 180, ease(boxToss)) : to; if (p) lockbox(p[0], p[1], 34); }
    const eye = toScreen(cx, cY - 6 * CU);
    camEnd();
    seamIn('page', lt, { col: C.cream, dir: -1 });
    seamOut('iris', lt, dur, { cx: eye[0], cy: eye[1], col: C.night, half: .5 });
  }

  // ---------- H: stop, and look at what it just read ----------
  function shotClose(t, lt, dur) {
    const tSend = wt('close', 'send'), tStop = wt('close', 'stop'), tLook = wt('close', 'look'), tReads = wt('close', 'reads'), tKeys = wt('close', 'keys'), tWorks = wt('close', 'works'), tWrote = wt('close', 'wrote');
    const tTake = wt('close', 'Take'), tAway = wt('close', 'away'), tNext = wt('close', 'Next');
    camBegin(1010 + 10 * Math.sin(lt * .4), kf(t, [[t - lt, 560], [tReads, 540], [tTake + .5, 520], [tNext, 540]]), kf(t, [[t - lt, 1.3], [tLook, 1.38], [tReads, 1.28], [tNext, 1.2], [t - lt + dur, 1.22]]));
    const open = ease(seg(t, t - lt + .2, t - lt + 1)) * (1 - ease(seg(t, tTake + .4, tTake + 1)));
    const binned = seg(t, tAway + .35, tAway + 1.0);
    office(t, { ph: kf(t, [[t - lt, .3], [tNext, .3], [tNext + 2, .26]]), open, binK: binned >= 1 ? 1 : 0 });
    const freed = t > tAway + .15;
    const cm = emotions(t, [[0, 'dizzy', { emote: null, tint: 'rosy', tintK: .7 }], [tStop + .05, 'surprised', { tint: 'rosy', tintK: .4 }], [tLook + .3, 'nervous'], [tReads, 'dizzy', { emote: null, tint: 'rosy', tintK: .7 }], [tAway + .2, 'relieved'], [tNext - .2, 'excited']], { take: .6 });
    // puppet strings: arms jerk on "works"
    const jerk = t > tWorks - .1 && t < tAway + .2 ? Math.sin((t - tWorks) * 9) : 0;
    const planeUp = t < tStop + .1;
    const co = { ...cm, noShadow: true, aR: planeUp ? 1.2 + .1 * Math.sin(t * 3) : t > tReads && !freed ? .6 + .6 * jerk : cm.aR, aL: t > tReads && !freed ? .6 - .6 * jerk : cm.aL, rot: (cm.rot || 0) * .4, dx: (cm.dx || 0) * .3 };
    if (t > tNext) { co.aR = 1.2 + .45 * Math.sin((t - tNext) * 12); }
    clawd(CX, CY, CU, co);
    desk(t, { cards: 5, lamp: false });
    // the rose letter: on the desk, then floating up above Clawd like a puppeteer, then into the bin
    const up = ease(seg(t, tReads - .2, tReads + .6));
    let lp = [CX - 160, 632];
    if (up > 0) lp = [lerp(CX - 160, CX, up), lerp(632, 400, up) + 8 * Math.sin(t * 2)];
    if (binned > 0) lp = arcPt([CX, 400], [BIN[0], BIN[1] - 125], 60, easeIn(binned));
    if (binned < 1) {
      glow(lp[0], lp[1], 110 * (1 - binned), ROSE_GL, .35 + .2 * up);
      sheet(lp[0], lp[1] - 30 * up, lerp(110, 130, up), lerp(26, 170, up), .02 + .1 * Math.sin(binned * 9), { key: 'hletter', rev: up, ghost: 0, back: up > .5 ? 0 : 0 });
    }
    // strings from the letter to Clawd's arms (snap on "away")
    if (up > .5 && !freed) {
      for (const w of ['L', 'R']) { const h = clawdHand(CX, CY, CU, co, w); boilSeed('string' + w); inkLine([[lp[0] + (w === 'L' ? -30 : 30), lp[1] + 50], [lerp(lp[0], h[0], .5), (lp[1] + h[1]) / 2 + 6 * Math.sin(t * 4)], h], 1.1, ROSE, 'inkfine', .4); }
    }
    if (freed && t < tAway + .6) for (const w of ['L', 'R']) { const h = clawdHand(CX, CY, CU, co, w), k = seg(t, tAway + .15, tAway + .6); boilSeed('snap' + w); inkLine([h, [h[0] + (w === 'L' ? -20 : 20), h[1] - 40 + 60 * k]], 1, ROSE, 'inkfine', .6); }
    // the paper plane: aimed at the porthole; dropped on "stop"
    { const h = clawdHand(CX, CY, CU, co, 'R'); const d = seg(t, tStop + .05, tStop + .5);
      if (planeUp) plane(h[0] + 20, h[1] - 20, 58, -.3 + .1 * Math.sin(t * 2), mixCol(C.ochreLt, SHEET, .4));
      else if (d < 1) plane(lerp(h[0], CX + 150, d), lerp(h[1], 636, easeIn(d)), 40, lerp(-.3, .3, d), mixCol(C.ochreLt, SHEET, .4));
      else plane(CX + 150, 636, 40, .12, mixCol(C.ochreLt, SHEET, .4)); }
    // the keys in Clawd's "pocket": hanging from his arm, then lifted off by the Navigator
    const nm = navMood(t, [[0, 'neutral', { lookX: .5 }], [tSend - .2, 'surprised'], [tStop - .1, 'stern'], [tLook + .6, 'idea'], [tReads + .2, 'stern'], [tTake + .2, 'determined'], [tAway + .5, 'proud'], [tNext - .2, 'happy']]);
    const stopA = ease(seg(t, tStop - .25, tStop + .05)) * (1 - ease(seg(t, tLook - .3, tLook)));
    const scope = ease(seg(t, tLook - .2, tLook + .3)) * (1 - ease(seg(t, tReads - .3, tReads + .1)));
    const takeA = ease(seg(t, tTake - .3, tTake + .1)) * (1 - ease(seg(t, tAway + .6, tAway + 1)));
    let aR = nm.aR ?? -1.28;
    aR = lerp(aR, 1.04, stopA); aR = lerp(aR, .14, scope); aR = lerp(aR, -.06, takeA);
    if (t > tNext) aR = 1.1 + .35 * Math.sin((t - tNext) * 11);
    const nPose = { ...nm, view: 'q', aR, aL: -1.22, eyes: scope > .5 ? 'narrow' : nm.eyes, handR: scope > .05 ? (s, sw, up2) => navProp('spyglass', s, sw, { up: up2 - .12, ext: scope }) : null };
    nav(700, FLOOR + 10, 21, nPose);
    const nh = navHand(700, FLOOR + 10, 21, nPose, 'R');
    if (t > tKeys - .3) {
      const ch = clawdHand(CX, CY, CU, co, 'L'), fly = seg(t, tAway - .1, tAway + .4);
      const p = fly <= 0 ? [ch[0], ch[1] + 4] : fly < 1 ? arcPt([ch[0], ch[1]], nh, 120, ease(fly)) : nh;
      const k = pop01(t, tKeys - .3, .3);
      if (t < tNext) { push(); translate(p[0], p[1]); scale(k); keyRing(0, 0, 26, 4, t, 'hring'); pop(); }
    }
    const eyeS = toScreen(CX, CY - 6 * CU);
    camEnd();
    // what she sees through the spyglass
    lensView(560, 330, 190, scope, t);
    if (scope > .05) { const a = toScreen(nh[0], nh[1]); boilSeed('sight'); for (let i = 0; i < 5; i++) { const q = i / 5; inkLine([[lerp(a[0] + 60, 560, q), lerp(a[1] - 20, 330 + 190, q)], [lerp(a[0] + 60, 560, q + .1), lerp(a[1] - 20, 330 + 190, q + .1)]], 1.4 * scope, C.ochreDk, 'inkfine', 0); } }
    seamIn('iris', lt, { cx: eyeS[0], cy: eyeS[1], col: C.night, half: .5 });
    seamOut('wipe', lt, dur);
  }
  // the iris into H opens on Clawd's eye: precompute it with H's opening camera
  function shotCloseWrap(t, lt, dur) {
    shotClose(t, lt, dur);
  }

  function endShot(t, lt, dur) { crewEnd(t, lt, dur, NEXT, TIMING.next); }

  shots([
    [0, identShot],
    [shotAt('hook'), shotHook],
    [B0(), shotLetter],
    [wt('letter', 'agent') - .7, shotObey],
    [shotAt('why'), shotWhy],
    [shotAt('doors'), shotDoors],
    [shotAt('trifecta'), shotTrifecta],
    [shotAt('checks'), shotChecks],
    [shotAt('close'), shotCloseWrap],
    [B.close.end + .9, endShot],
  ]);
})();
