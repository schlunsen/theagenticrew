// scene.js: handson00, The Hands-On Guide (an overview film for the whole Hands-On Guide).
// Storyboard: video/storyboards/handson00.md. Every event is keyed to a spoken word (Q('beat', 'word')).
// The world is a night-time drafting room painted as a blueprint ("Workshop Blueprint": deep blueprint blue, line cyan,
// chalk, safety amber). Things arrive as cyan line work and flood with paint when they're done; the ten-handled wheel on
// the wall lights one handle per exercise, and at the end it becomes real and the Navigator takes the helm.
(() => {
  // ---------------------------------------------------------------------------------------------------------------
  // palette: the same keys as CREW, in the Hands-On Guide's blueprint colours
  const P = {
    night: '#081a33', deep: '#0f2a4f', teal: '#1a3d6e', sea: '#9fd3f5', pale: '#eef4fa',
    ochre: '#f2a33a', ochreLt: '#ffc56e', ochreDk: '#9a6a2a', cream: '#e4ecf5', paper: PAL.paper,
    rose: '#E07A68', sap: '#8CCB8E', ink: PAL.ink,
  };
  const WOOD = '#8A5530', WOODLT = '#B77A45', WOODDK = '#55321C', STEEL = '#3C5170', STEELDK = '#22324A', SCREEN = '#181208';
  const FLOOR = '#0b1a31', GREEN = '#7FCB86', RED = '#E4604F';
  const FY = 900, TT = 750;   // floor line, table top
  const SERIES = 'THE HANDS-ON GUIDE';

  // exact-word cue (Whisper's spelling, case and punctuation ignored); n = which occurrence
  const Q = (id, word, n = 0) => {
    const k = _nw(word), hits = B[id].words.filter(x => _nw(x.w) === k), h = hits[n < 0 ? hits.length + n : n];
    if (!h) { console.warn(`W: "${word}" (#${n}) not heard in ${id}`); return lerp(B[id].start, B[id].end, .5); }
    return h.s;
  };
  const bg = (key, pts, o) => { boilSeed(key); paint(pts, o); };
  let VIEW = { x0: 0, x1: W, y0: 0, y1: H };
  function cam(t, keys, sh = [0, 0]) {
    const [cx, cy, z] = kf(t, keys);
    camBegin(cx + sh[0], cy + sh[1], z);
    VIEW = { x0: cx - W / 2 / z - 80, x1: cx + W / 2 / z + 80, y0: cy - H / 2 / z - 80, y1: cy + H / 2 / z + 80 };
    return { cx, cy, z };
  }
  function dash(a, b, col, sw, len, k = 1) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.floor(L / len));
    for (let i = 0; i < n * k; i += 2) { const p = i / n, q = Math.min(1, (i + 1) / n, k); inkLine([[lerp(a[0], b[0], p), lerp(a[1], b[1], p)], [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]], sw, col, 'inkfine', 0); }
  }
  const arcLine = (cx, cy, r, a0, a1, n = 40) => { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
  // outline a rectangle progressively (k 0..1 round the perimeter from the top-left)
  function traceRect(x, y, w, h, k, col, sw, key) {
    if (k <= 0) return; boilSeed(key);
    const E = [[[x, y], [x + w, y]], [[x + w, y], [x + w, y + h]], [[x + w, y + h], [x, y + h]], [[x, y + h], [x, y]]];
    const per = 2 * (w + h); let left = k * per;
    for (const [a, b] of E) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (left <= 0) break; const q = Math.min(1, left / L); inkLine([a, [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]], sw, col, 'inkfine', 0); left -= L; }
  }
  function tracePoly(pts, k, col, sw, key, closed = false) {
    if (k <= 0) return; boilSeed(key);
    const Q = closed ? pts.concat([pts[0]]) : pts; let per = 0; for (let i = 1; i < Q.length; i++) per += Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]);
    let left = k * per;
    for (let i = 1; i < Q.length && left > 0; i++) { const a = Q[i - 1], b = Q[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), q = Math.min(1, left / L); inkLine([a, [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]], sw, col, 'inkfine', 0); left -= L; }
  }

  // ---------------------------------------------------------------------------------------------------------------
  // the room: a blueprint wall ruled with cyan grid, a dark floor. span = [x0, x1] world extent (fixed per shot).
  // o.alarm 0..1 tints it rose; o.warm 0..1 adds amber light.
  function room(t, span, o = {}) {
    const [xa, xb] = span, ya = -800;
    bg('wall', rectPts(xa, ya, xb - xa, FY - ya + 4), { wash: P.deep, fill: mixCol(P.deep, P.teal, .7), fillOp: 110, bleed: .2, tex: .6, border: .5, ink: null });
    for (let i = 0; xa + 350 + i * 700 < xb; i++) {
      const x = xa + 350 + i * 700, y = 60 + 380 * hash(i * 3.7 + xa * .001);
      bg('wbloom' + i, blobPts(x, y, 380 + 120 * hash(i + 2), i + 3, .2), { fill: i % 2 ? P.teal : P.night, fillOp: 110, bleed: .3, tex: .6, border: .5, ink: null });
    }
    if (o.warm > 0) (o.warmAt || []).forEach(([x, y, r], i) => bg('wwarm' + i, blobPts(x, y, r, i + 11, .2), { fill: P.ochreDk, fillOp: 120 * o.warm, bleed: .3, tex: .5, border: .5, ink: null }));
    // grid: every 120 px, every fifth line stronger; only the lines in view, each segment seeded by its world place
    const G = 120, cMin = mixCol(P.deep, P.sea, .2), cMaj = mixCol(P.deep, P.sea, .38), V = VIEW, SEG = 480;
    for (let x = Math.ceil(Math.max(xa, V.x0) / G) * G; x <= Math.min(xb, V.x1); x += G) {
      const maj = Math.round(x / G) % 5 === 0;
      for (let ys = Math.floor(Math.max(ya, V.y0) / SEG) * SEG; ys < Math.min(FY, V.y1); ys += SEG) {
        boilSeed('gv' + x + '_' + ys); inkLine([[x, Math.max(ys, ya)], [x, Math.min(ys + SEG, FY)]], maj ? .9 : .5, maj ? cMaj : cMin, 'inkfine', 0);
      }
    }
    for (let y = Math.ceil(Math.max(ya, V.y0) / G) * G; y < Math.min(FY, V.y1); y += G) {
      const maj = Math.round(y / G) % 5 === 0;
      for (let xs = Math.floor(Math.max(xa, V.x0) / SEG) * SEG; xs < Math.min(xb, V.x1); xs += SEG) {
        boilSeed('gh' + y + '_' + xs); inkLine([[Math.max(xs, xa), y], [Math.min(xs + SEG, xb), y]], maj ? .9 : .5, maj ? cMaj : cMin, 'inkfine', 0);
      }
    }
    // floor
    bg('floor', rectPts(xa, FY, xb - xa, 900), { wash: FLOOR, fill: P.night, fillOp: 90, bleed: .1, tex: .6, border: .4, ink: null });
    for (let xs = Math.floor(Math.max(xa, V.x0) / SEG) * SEG; xs < Math.min(xb, V.x1); xs += SEG) {
      boilSeed('skirt' + xs); inkLine([[xs, FY], [xs + SEG, FY]], 2.2, mixCol(P.sea, P.deep, .45), 'ink', 0);
      [36, 96, 190, 330].forEach((d, j) => { boilSeed('board' + xs + j); inkLine([[xs, FY + d], [xs + SEG, FY + d + 2]], .6, mixCol(FLOOR, P.sea, .18), 'inkfine', 0); });
    }
    if (o.alarm > 0) { bg('alarm', rectPts(xa, ya, xb - xa, 1800), { wash: '#7A2F45', washOp: 150 * o.alarm, ink: null }); }
  }
  // the sheet's neatline: a thin double cyan frame with zone ticks, in screen space (after camEnd)
  function sheetBorder() {
    const m = 30, g = 10, c = mixCol(P.sea, P.deep, .35);
    boilSeed('neat');
    for (const d of [0, g]) {
      const a = m + d;
      inkLine([[a, a], [W - a, a]], d ? .5 : .9, c, 'inkfine', 0); inkLine([[W - a, a], [W - a, H - a]], d ? .5 : .9, c, 'inkfine', 0);
      inkLine([[W - a, H - a], [a, H - a]], d ? .5 : .9, c, 'inkfine', 0); inkLine([[a, H - a], [a, a]], d ? .5 : .9, c, 'inkfine', 0);
    }
    for (let i = 1; i < 8; i++) { const x = lerp(m, W - m, i / 8); inkLine([[x, m], [x, m + g]], .6, c, 'inkfine', 0); inkLine([[x, H - m - g], [x, H - m]], .6, c, 'inkfine', 0); }
    for (let i = 1; i < 5; i++) { const y = lerp(m, H - m, i / 5); inkLine([[m, y], [m + g, y]], .6, c, 'inkfine', 0); inkLine([[W - m - g, y], [W - m, y]], .6, c, 'inkfine', 0); }
  }

  // ---------------------------------------------------------------------------------------------------------------
  // THE HELM: the cover's wheel, drawn to dimension, with ten handles (one per exercise).
  // o: draw 0..1 (line work draws in), lit (0..10 handles painted amber), litK (their opacity), real 0..1 (the whole
  // wheel painted in wood and brass), rot, dims (centre lines + a dimension line), key
  function helm(cx, cy, r, o = {}) {
    const key = o.key || 'helm', dk = clamp(o.draw ?? 1), real = clamp(o.real || 0), rot = o.rot || 0, lit = o.lit || 0, litK = o.litK ?? 1;
    const sw = clamp(r / 130, .45, 2.4) * (o.swMul || 1), N = 10, A0 = -Math.PI / 2, lc = mixCol(P.sea, P.deep, real * .8);
    if (o.glow > 0) { boilSeed(key + 'glow'); glow(cx, cy, r * 1.6, P.ochre, o.glow); }
    if (o.dims && dk > 0 && real < 1) {
      const dc = mixCol(P.sea, P.deep, .45 + real * .4), k1 = ease(seg(dk, 0, .5)), k2 = ease(seg(dk, .55, 1));
      boilSeed(key + 'cl1'); dash([cx - r * 1.65, cy], [cx + r * 1.65, cy], dc, .6 * sw, 18 * sw, k1);
      boilSeed(key + 'cl2'); dash([cx, cy - r * 1.65], [cx, cy + r * 1.65], dc, .6 * sw, 18 * sw, k1);
      boilSeed(key + 'pcd'); for (let i = 0; i < 36 * k1; i += 2) inkLine(arcLine(cx, cy, r * 1.22, A0 + i / 36 * TAU, A0 + (i + 1) / 36 * TAU, 4), .5 * sw, dc, 'inkfine', .5);
      if (k2 > 0) {
        const yb = cy + r * 1.5, x0 = cx - r * 1.22, x1 = cx + r * 1.22, xm = lerp(x0, x1, k2);
        boilSeed(key + 'dim');
        inkLine([[x0, cy + r * .3], [x0, yb + 12 * sw]], .5 * sw, dc, 'inkfine', 0); inkLine([[x1, cy + r * .3], [x1, yb + 12 * sw]], .5 * sw, dc, 'inkfine', 0);
        inkLine([[x0, yb], [xm, yb]], .8 * sw, lc, 'inkfine', 0);
        paint([[x0, yb], [x0 + 16 * sw, yb - 5 * sw], [x0 + 16 * sw, yb + 5 * sw]], { wash: lc, ink: null });
        if (k2 > .98) paint([[x1, yb], [x1 - 16 * sw, yb - 5 * sw], [x1 - 16 * sw, yb + 5 * sw]], { wash: lc, ink: null });
        // a leader from a handle to the right
        const ha = A0 + TAU * 1 / N, hx = cx + Math.cos(ha) * r * 1.22, hy = cy + Math.sin(ha) * r * 1.22;
        inkLine([[hx, hy], [lerp(hx, cx + r * 1.5, k2), lerp(hy, cy - r * 1.25, k2)], [lerp(hx, cx + r * 1.95, k2), cy - r * 1.25]], .6 * sw, dc, 'inkfine', 0);
      }
    }
    push(); translate(cx, cy); rotate(rot);
    // the painted wheel (wood and brass), piece by piece
    if (real > 0) {
      const ks = ease(seg(real, 0, .45)), kr = ease(seg(real, .2, .7)), kh = seg(real, .4, .9), kb = backOut(seg(real, .6, 1));
      for (let i = 0; i < N; i++) {
        const a = A0 + i / N * TAU, c = Math.cos(a), s = Math.sin(a);
        if (ks > 0) { boilSeed(key + 'rsp' + i); paint(ribbon([[c * r * .12, s * r * .12], [c * r * lerp(.12, 1.08, ks), s * r * lerp(.12, 1.08, ks)]], r * .075, r * .055), { wash: WOOD, fill: WOODDK, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .6 }); }
        const hk = backOut(clamp(kh * 1.6 - i * .06));
        if (hk > .02) { boilSeed(key + 'rh' + i); paint(ribbon([[c * r * 1.06, s * r * 1.06], [c * r * (1.06 + .28 * hk), s * r * (1.06 + .28 * hk)]], r * .1, r * .075), { wash: WOODLT, fill: WOOD, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .6 }); }
      }
      if (kr > 0) {
        boilSeed(key + 'rrim');
        paint(ribbon(arcLine(0, 0, r * .9, A0, A0 + TAU * kr, 72), r * .18, r * .18), { wash: WOOD, fill: WOODDK, fillOp: 70, tex: .6, border: .4, ink: PAL.ink, sw: sw * .8 });
        inkLine(arcLine(0, 0, r * .93, A0 + .05, A0 + TAU * kr - .05, 60), Math.max(1, r * .012), WOODLT, 'ink', .5);
        for (let i = 0; i < 20 * kr; i++) { const a = A0 + i / 20 * TAU; paint(ellPts(Math.cos(a) * r * .9, Math.sin(a) * r * .9, r * .02, r * .02, 6), { wash: P.ochre, ink: null }); }
      }
      if (kb > .02) {
        boilSeed(key + 'rhub');
        paint(ellPts(0, 0, r * .2 * kb, r * .2 * kb, 20), { wash: P.ochre, fill: P.ochreDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
        paint(ellPts(0, 0, r * .09 * kb, r * .09 * kb, 14), { wash: P.ochreLt, ink: PAL.ink, sw: sw * .6 });
      }
    }
    // the line work
    const la = 1 - ease(seg(real, .3, 1));
    if (la > .02 && dk > 0) {
      const col = mixCol(P.deep, P.sea, la);
      const ringK = (rad, a, b, nm, w) => { const k = ease(seg(dk, a, b)); if (k <= 0) return; boilSeed(key + nm); inkLine(arcLine(0, 0, rad, A0, A0 + TAU * k, 64), w * sw, col, 'inkfine', .5); };
      ringK(r, 0, .35, 'r1', 1.2); ringK(r * .8, .06, .4, 'r2', .9); ringK(r * .19, .12, .45, 'r3', .9); ringK(r * .08, .15, .5, 'r4', .7);
      for (let i = 0; i < N; i++) {
        const a = A0 + i / N * TAU, c = Math.cos(a), s = Math.sin(a), k = ease(seg(dk, .3 + i * .03, .6 + i * .03));
        if (k <= 0) continue;
        boilSeed(key + 'sp' + i);
        const px = -s * r * .035, py = c * r * .035;
        inkLine([[c * r * .19 + px, s * r * .19 + py], [c * r * lerp(.19, 1.14, k) + px, s * r * lerp(.19, 1.14, k) + py]], .8 * sw, col, 'inkfine', 0);
        inkLine([[c * r * .19 - px, s * r * .19 - py], [c * r * lerp(.19, 1.14, k) - px, s * r * lerp(.19, 1.14, k) - py]], .8 * sw, col, 'inkfine', 0);
        if (k > .95) inkLine(ellPts(c * r * 1.22, s * r * 1.22, r * .075, r * .075, 14).concat([[c * r * 1.22 + r * .075, s * r * 1.22]]), .9 * sw, col, 'inkfine', .5);
      }
    }
    // lit handles: amber paint and a little light
    for (let i = 0; i < N; i++) {
      const lk = clamp(lit - i) * litK; if (lk <= .01 || real > .9) continue;
      const a = A0 + i / N * TAU, hx = Math.cos(a) * r * 1.22, hy = Math.sin(a) * r * 1.22, pk = backOut(clamp(lit - i));
      boilSeed(key + 'lit' + i);
      glow(hx, hy, r * .32 * lk, P.ochre, .8 * lk);
      paint(ellPts(hx, hy, r * .085 * pk, r * .085 * pk, 14), { wash: mixCol(P.deep, P.ochre, lk), fill: P.ochreLt, fillOp: 90 * lk, tex: .4, ink: PAL.ink, sw: sw * .6 });
    }
    pop();
  }

  // ---------------------------------------------------------------------------------------------------------------
  // furniture and props
  function table(x0, x1, key, top = TT) {
    bg(key + 'legL', rectPts(x0 + 30, top + 20, 26, FY - top - 20, 1), { wash: WOODDK, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: .9 });
    bg(key + 'legR', rectPts(x1 - 56, top + 20, 26, FY - top - 20, 1), { wash: WOODDK, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: .9 });
    bg(key + 'rail', rectPts(x0 + 40, top + 20, x1 - x0 - 80, 30, 1), { wash: WOOD, fill: WOODDK, fillOp: 70, tex: .6, ink: PAL.ink, sw: .8 });
    bg(key + 'top', rectPts(x0, top, x1 - x0, 22, 1), { wash: WOODLT, fill: WOOD, fillOp: 70, tex: .7, border: .5, ink: PAL.ink, sw: 1 });
  }
  // the amber terminal; (x, y) = bottom centre; o: on 0..1, lines (float, typed lines), seed, bright
  function terminal(t, x, y, s, o = {}) {
    const key = o.key || 'term', on = clamp(o.on ?? 1), W2 = 110 * s, Hh = 150 * s;
    if (on > 0) { boilSeed(key + 'halo'); glow(x, y - 26 * s - Hh * .5, 300 * s * (o.bright || 1), P.ochre, .35 * on); }
    boilSeed(key + 'body');
    paint(rectPts(x - 24 * s, y - 28 * s, 48 * s, 28 * s), { wash: STEELDK, ink: PAL.ink, sw: .8 });
    paint(ellPts(x, y - 3 * s, 62 * s, 8 * s, 14), { wash: STEELDK, ink: PAL.ink, sw: .7 });
    paint(rrPts(x - W2, y - 26 * s - Hh, 2 * W2, Hh, 16 * s), { wash: STEEL, fill: STEELDK, fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
    const sx = x - W2 + 16 * s, sy = y - 26 * s - Hh + 14 * s, sww = 2 * W2 - 32 * s, sh = Hh - 36 * s;
    paint(rrPts(sx, sy, sww, sh, 10 * s), { wash: mixCol(SCREEN, '#3b2a0c', on * .7), ink: PAL.ink, sw: .7 });
    paint(ellPts(x + W2 - 22 * s, y - 26 * s - 10 * s, 5 * s, 5 * s, 8), { wash: on > .5 ? GREEN : STEELDK, ink: null });
    if (on > .05) {
      const n = o.lines ?? 2, rows = 5, lh = sh / (rows + 1), first = Math.max(0, Math.ceil(n) - rows), lc = mixCol(SCREEN, P.ochreLt, on);
      boilSeed(key + 'txt');
      let cx = sx + 22 * s, cy = sy + lh;
      for (let i = 0; i < rows; i++) {
        const li = first + i, k = clamp(n - li); if (k <= 0 && i > 0) break;
        const y2 = sy + lh * (i + 1), L = (sww - 60 * s) * (.3 + .6 * hash(li * 3.1 + (o.seed || 0))) * k;
        inkLine([[sx + 12 * s, y2 - 4 * s], [sx + 18 * s, y2], [sx + 12 * s, y2 + 4 * s]], 1.1 * s, lc, 'inkfine', 0);
        if (L > 2) inkLine([[sx + 26 * s, y2], [sx + 26 * s + L, y2]], 2.6 * s, lc, 'ink', 0);
        cx = sx + 30 * s + L; cy = y2;
      }
      if (Math.floor(T * 2.4) % 2 === 0) paint(rectPts(cx, cy - 6 * s, 8 * s, 12 * s), { wash: lc, ink: null });
      boilSeed(key + 'bloom'); glow(sx + sww / 2, sy + sh / 2, sww * .75, P.ochre, .3 * on * (o.bright || 1));
    }
  }
  function keyboard(x, y, s, key, press = 0) {
    boilSeed(key);
    paint([[x - 70 * s, y], [x + 70 * s, y], [x + 60 * s, y - 14 * s], [x - 60 * s, y - 14 * s]], { wash: STEEL, fill: STEELDK, fillOp: 60, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 7; i++) { const kx = x - 48 * s + i * 16 * s, dn = press && Math.floor(T * 12 + i * 3) % 4 === 0 ? 2 * s : 0; paint(rectPts(kx - 5 * s, y - 11 * s + dn, 10 * s, 5 * s), { wash: mixCol(STEEL, P.pale, .4), ink: null }); }
  }
  // a book on a reading stand; (x, y) = bottom centre; o.open 0..1, o.flip (x-scale, -1..1), o.blank, o.lines
  function book(x, y, o = {}) {
    const key = o.key || 'book', open = clamp(o.open ?? 1), fs = o.flip ?? 1, w = lerp(120, 250, ease(open)), h = 160;
    push(); translate(x, y); if (o.rot) rotate(o.rot); scale(Math.max(.05, Math.abs(fs)) * (o.sc || 1), o.sc || 1);
    boilSeed(key);
    if (!o.noStand) { paint([[-40, 0], [40, 0], [26, -20], [-26, -20]], { wash: WOODDK, ink: PAL.ink, sw: .8 }); }
    const y0 = -h - 12;
    if (open < .5) {
      paint(rrPts(-w / 2 - 6, y0 - 4, w + 12, h + 8, 6), { wash: '#2B4E7E', fill: P.night, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 });
      paint(rectPts(-w / 2 + 14, y0 + 26, w - 28, 14), { wash: P.ochre, ink: null }); paint(rectPts(-w / 2 + 14, y0 + 50, (w - 28) * .6, 8), { wash: P.sea, ink: null });
    } else {
      paint(rrPts(-w / 2 - 8, y0 - 4, w + 16, h + 10, 6), { wash: '#2B4E7E', ink: PAL.ink, sw: 1 });
      for (const sd of [-1, 1]) paint([[0, y0 + 6], [sd * (w / 2 - 2), y0], [sd * (w / 2 - 2), y0 + h], [0, y0 + h + 4]], { wash: P.pale, fill: mixCol(P.pale, P.sea, .4), fillOp: 45, tex: .5, ink: PAL.ink, sw: .7 });
      if (!o.blank && fs >= 0) for (const sd of [-1, 1]) for (let i = 0; i < 7; i++) { const yy = y0 + 22 + i * 18, L = (w / 2 - 34) * (.6 + .4 * hash(i * 2.3 + sd)) * clamp((o.lines ?? 7) - i); if (L > 1) inkLine([[sd > 0 ? 14 : -w / 2 + 16, yy], [sd > 0 ? 14 + L : -w / 2 + 16 + L, yy]], 1.1, mixCol(P.deep, P.pale, .2), 'inkfine', 0); }
    }
    pop();
  }
  function plane(x, y, s, rot, key) {
    push(); translate(x, y); rotate(rot); boilSeed(key);
    paint([[42 * s, 0], [-30 * s, -20 * s], [-16 * s, 0]], { wash: P.pale, ink: PAL.ink, sw: .8 });
    paint([[42 * s, 0], [-16 * s, 0], [-30 * s, 14 * s]], { wash: mixCol(P.pale, P.sea, .4), ink: PAL.ink, sw: .8 });
    pop();
  }
  // a paper slip; ks = per-line write-on progress
  function slip(cx, cy, sw_, sh_, rot, ks, key, o = {}) {
    push(); translate(cx, cy); rotate(rot); if (o.sc) scale(o.sc);
    boilSeed(key);
    if (o.glowK > 0) glow(0, 0, Math.max(sw_, sh_) * 1.3, P.ochre, o.glowK);
    paint(rectPts(-sw_ / 2, -sh_ / 2, sw_, sh_, Math.min(2, sw_ * .02)), { wash: P.pale, fill: P.sea, fillOp: 30, tex: .6, border: .5, ink: PAL.ink, sw: o.sw ?? .8 });
    const n = ks.length, m = Math.min(sw_, sh_) * .16, gap = (sh_ - 2 * m) / Math.max(1, n);
    ks.forEach((k, i) => {
      if (k <= .01) return;
      const y = -sh_ / 2 + m + gap * (i + .5), full = (sw_ - 2 * m) * (.6 + .4 * hash(i * 3.7 + (o.seed || 0))), L = full * clamp(k), x0 = -sw_ / 2 + m;
      const hl = o.hl && o.hl[i];
      if (hl > 0) { paint(rectPts(x0 - 4, y - gap * .35, sw_ - 2 * m + 8, gap * .7), { wash: hl > 0 ? (o.hlCol && o.hlCol[i]) || P.ochre : P.ochre, washOp: 200 * hl, ink: null }); }
      inkLine([[x0, y], [x0 + L * .5, y + gap * .05], [x0 + L, y]], o.lw ?? 1.1, P.deep, 'ink', .4);
    });
    pop();
  }
  const penHook = (s, sw, up) => { push(); rotate(up + .9); paint(ribbon([[0, 0], [0, -1.6 * s]], .22 * s, .08 * s), { wash: P.ochre, ink: PAL.ink, sw: sw * .5 }); pop(); };
  const brushHook = (col) => (u, sw) => {
    paint(ribbon([[-.2 * u, 0], [1.9 * u, -.1 * u]], .28 * u, .22 * u), { wash: WOODLT, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(2.25 * u, -.12 * u, .5 * u, .3 * u, 12), { wash: col, ink: PAL.ink, sw: sw * .6 });
  };
  // the Navigator's captain's cap (body space, drawn from nav's draw hook)
  function captainCap(s, sw, view, drop = 0) {
    const cx = view === 'q' ? .25 : view === 'side' ? .35 : 0, dy = -drop * 6;
    const CAPO = { wash: '#1E2E4C', fill: P.night, fillOp: 60, tex: .6, border: .5, ink: PAL.ink, sw: sw * .7, curv: .35 };
    paint(_P(s, [[cx - 2.6, -12.3 + dy], [cx - 2.3, -13.7 + dy], [cx - .6, -14.5 + dy], [cx + 1.4, -14.4 + dy], [cx + 2.6, -13.6 + dy], [cx + 2.7, -12.3 + dy]]), CAPO);
    paint(_P(s, [[cx - 2.62, -12.95 + dy], [cx + 2.68, -12.95 + dy], [cx + 2.7, -12.35 + dy], [cx - 2.6, -12.3 + dy]]), { wash: P.ochre, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts((cx + .1) * s, (-13.8 + dy) * s, .38 * s, .32 * s, 10), { wash: P.ochreLt, ink: PAL.ink, sw: sw * .4 });
    if (view === 'q' || view === 'side') paint(_P(s, [[cx + 1.4, -12.45 + dy], [cx + 3.7, -12.15 + dy], [cx + 3.5, -11.8 + dy], [cx + 1.3, -12.0 + dy]]), { ...CAPO, curv: .2 });
    else paint(ellPts(cx * s, (-12.2 + dy) * s, 2.9 * s, .38 * s, 18), { ...CAPO, curv: 0 });
  }
  // a second person (a visitor to the shop): the Navigator's build in her own colours
  const VISC = { hair: '#B07A3E', hairLt: '#D8A565', sweater: '#C9674F', sweaterDk: '#8E4232', scarf: '#E9E1CF', scarfDk: '#B9AE96', scarfLt: '#F4EEDF', trousers: '#2E3A4A', boots: '#3A2A22' };
  function visitor(x, y, s, o = {}) {
    const keep = {}; for (const k in VISC) { keep[k] = NAV[k]; NAV[k] = VISC[k]; }
    try { nav(x, y, s, o); } finally { Object.assign(NAV, keep); }
  }
  // postcards for the travel bucket list app. kind 0..4; o.flip 0..1 (back shows a check), o.border colour
  function card(x, y, cw, ch, kind, o = {}) {
    const key = o.key || 'card' + kind, fl = clamp(o.flip || 0), sx = Math.cos(fl * Math.PI), back = sx < 0, sc = o.sc ?? 1;
    push(); translate(x + cw / 2, y + ch / 2); rotate(o.rot || 0); scale(Math.max(.05, Math.abs(sx)) * sc, sc);
    boilSeed(key);
    if (o.border) paint(rectPts(-cw / 2 - 7, -ch / 2 - 7, cw + 14, ch + 14, 1), { wash: o.border, ink: PAL.ink, sw: .7 });
    paint(rectPts(-cw / 2, -ch / 2, cw, ch, 1), { wash: P.pale, fill: P.sea, fillOp: 25, tex: .5, ink: PAL.ink, sw: .9 });
    const ix = -cw / 2 + 8, iy = -ch / 2 + 8, iw = cw - 16, ih = ch * .68;
    if (back) {
      paint(ribbon([[-cw * .18, 0], [-cw * .04, ch * .16], [cw * .22, -ch * .2]], 12, 9), { wash: P.ochre, ink: PAL.ink, sw: .7 });
    } else {
      const sky = [mixCol(P.sea, P.pale, .4), mixCol(P.sea, P.pale, .2), mixCol(P.rose, P.ochreLt, .5), mixCol(P.teal, P.sea, .4), mixCol(P.sea, P.pale, .5)][kind];
      paint(rectPts(ix, iy, iw, ih), { wash: sky, ink: null });
      if (kind === 0) { paint(ellPts(ix + iw * .75, iy + ih * .3, 10, 10, 10), { wash: P.ochreLt, ink: null }); paint([[ix, iy + ih], [ix + iw * .45, iy + ih * .2], [ix + iw * .9, iy + ih]], { wash: '#3D6A8E', ink: PAL.ink, sw: .6 }); paint([[ix + iw * .34, iy + ih * .45], [ix + iw * .45, iy + ih * .2], [ix + iw * .56, iy + ih * .45]], { wash: P.pale, ink: null }); }
      else if (kind === 1) { paint(rectPts(ix, iy + ih * .7, iw, ih * .3), { wash: '#3E88A8', ink: null }); paint(ellPts(ix + iw * .5, iy + ih * .74, iw * .3, ih * .1, 12), { wash: P.ochreLt, ink: PAL.ink, sw: .5 }); paint(ribbon([[ix + iw * .5, iy + ih * .72], [ix + iw * .56, iy + ih * .3]], 5, 3), { wash: WOOD, ink: null }); for (const d of [-1, 1]) paint(ribbon([[ix + iw * .56, iy + ih * .3], [ix + iw * (.56 + d * .2), iy + ih * .42]], 8, 2), { wash: '#5E9E5E', ink: null }); }
      else if (kind === 2) { paint(rectPts(ix, iy + ih * .78, iw, ih * .22), { wash: '#3E6E98', ink: null }); paint([[ix + iw * .42, iy + ih * .8], [ix + iw * .58, iy + ih * .8], [ix + iw * .54, iy + ih * .25], [ix + iw * .46, iy + ih * .25]], { wash: P.pale, ink: PAL.ink, sw: .5 }); paint(rectPts(ix + iw * .45, iy + ih * .45, iw * .1, ih * .1), { wash: P.rose, ink: null }); paint(ellPts(ix + iw * .5, iy + ih * .2, 6, 6, 8), { wash: P.ochreLt, ink: null }); }
      else if (kind === 3) { [[.08, .5], [.28, .3], [.5, .45], [.7, .2]].forEach(([a, b], j) => paint(rectPts(ix + iw * a, iy + ih * b, iw * .18, ih * (1 - b)), { wash: j % 2 ? '#2A4A73' : '#3A5F8C', ink: PAL.ink, sw: .4 })); paint(ellPts(ix + iw * .85, iy + ih * .2, 7, 7, 8), { wash: P.pale, ink: null }); }
      else { paint(ellPts(ix + iw * .5, iy + ih * .38, iw * .2, iw * .2, 14), { wash: P.rose, ink: PAL.ink, sw: .5 }); paint(rectPts(ix + iw * .45, iy + ih * .72, iw * .1, ih * .12), { wash: WOOD, ink: PAL.ink, sw: .4 }); }
      for (let i = 0; i < 2; i++) inkLine([[ix, iy + ih + 12 + i * 11], [ix + iw * (.7 - i * .25), iy + ih + 12 + i * 11]], .9, mixCol(P.deep, P.pale, .3), 'inkfine', 0);
    }
    paint(ellPts(0, -ch / 2 + 2, 6, 6, 8), { wash: P.rose, ink: PAL.ink, sw: .5 });
    pop();
  }
  // a test lamp
  function lamp(x, y, r, col, on, key) {
    boilSeed(key);
    inkLine([[x, y - r - 18], [x, y - r]], 1, mixCol(P.sea, P.deep, .3), 'inkfine', 0);
    paint(rectPts(x - r * .5, y - r - 4, r, 8), { wash: STEELDK, ink: PAL.ink, sw: .6 });
    if (on > 0) glow(x, y, r * 3.2 * on, col, .8 * on);
    paint(ellPts(x, y, r, r, 14), { wash: mixCol(STEELDK, col, on), fill: mixCol(col, '#FFFFFF', .4), fillOp: 90 * on, tex: .4, ink: PAL.ink, sw: .7 });
  }
  // the pegboard's tool shapes (drawn at (x, y) = centre), as outlines or painted
  function tool(kind, x, y, k, fill, key) {
    const oc = P.sea;
    boilSeed(key + 'o');
    const outline = pts => { for (let i = 0; i < pts.length; i += 2) { const a = pts[i], b = pts[(i + 1) % pts.length]; inkLine([a, b], 1.2, oc, 'inkfine', 0); } };
    const shape = {
      0: [[-55, -40], [55, -40], [55, 34], [-55, 34]],                                               // terminal
      1: [[-55, -45], [55, -45], [55, 45], [-55, 45]],                                               // crate
      2: [[-10, 50], [10, 50], [10, 0], [45, -40], [30, -52], [0, -15], [-30, -52], [-45, -40], [-10, 0]], // branching key
      3: [[-60, -12], [10, -12], [55, -42], [55, 42], [10, 12], [-60, 12]],                           // speaking trumpet
    }[kind];
    const pts = shape.map(([a, b]) => [x + a, y + b]);
    if (fill <= 0) { for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; for (let j = 0; j < 4; j += 2) inkLine([[lerp(a[0], b[0], j / 4), lerp(a[1], b[1], j / 4)], [lerp(a[0], b[0], (j + 1) / 4), lerp(a[1], b[1], (j + 1) / 4)]], 1.1, oc, 'inkfine', 0); } return; }
    const s = backOut(fill);
    push(); translate(x, y); scale(s); translate(-x, -y);
    boilSeed(key + 'f');
    if (kind === 0) { paint(rrPts(x - 55, y - 40, 110, 74, 8), { wash: STEEL, ink: PAL.ink, sw: .9 }); paint(rrPts(x - 45, y - 32, 90, 50, 5), { wash: SCREEN, ink: PAL.ink, sw: .6 }); inkLine([[x - 36, y - 12], [x - 28, y - 7], [x - 36, y - 2]], 1.4, P.ochreLt, 'ink', 0); inkLine([[x - 22, y - 2], [x + 10, y - 2]], 2, P.ochreLt, 'ink', 0); }
    else if (kind === 1) { paint(rectPts(x - 55, y - 45, 110, 90, 1), { wash: WOODLT, fill: WOOD, fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 }); inkLine([[x - 55, y - 15], [x + 55, y - 15]], 1.2, WOODDK, 'ink', 0); inkLine([[x - 55, y + 15], [x + 55, y + 15]], 1.2, WOODDK, 'ink', 0); inkLine([[x - 50, y - 40], [x + 50, y + 40]], 1.2, WOODDK, 'ink', 0); }
    else if (kind === 2) { paint(pts, { wash: P.ochre, fill: P.ochreDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 }); paint(ellPts(x, y + 42, 14, 14, 12), { wash: P.ochreLt, ink: PAL.ink, sw: .7 }); }
    else { paint(pts, { wash: mixCol(P.ochre, WOODLT, .4), fill: P.ochreDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 }); paint(ellPts(x + 55, y, 8, 42, 12), { wash: P.ochreDk, ink: PAL.ink, sw: .7 }); }
    pop();
  }
  // mini security agent: a small Clawd in a burglar's mask and beanie
  function agent(x, y, u, o = {}) {
    clawd(x, y, u, { ...o, hat: 'beanie', draw: (uu, sw) => {
      paint(rectPts(-5.15 * uu, -7.1 * uu, 10.3 * uu, 1.9 * uu), { wash: '#1A2233', ink: PAL.ink, sw: sw * .6 });
      for (const ex of [-2.5, 2.5]) { paint(ellPts(ex * uu, -6.15 * uu, .9 * uu, .55 * uu, 10), { wash: P.pale, ink: null }); paint(ellPts((ex + .3 * (o.lookX || 0)) * uu, -6.15 * uu, .35 * uu, .35 * uu, 8), { wash: PAL.ink, ink: null }); }
    } });
  }
  // an armchair (seat top at fy - 1.9 * s so the Navigator sits on it)
  function armchair(x, fy, s, key) {
    const C = '#7A3E3A', CD = '#4E2626';
    bg(key + 'back', rrPts(x - 3.4 * s, fy - 7.4 * s, 6.8 * s, 6 * s, 1.4 * s), { wash: C, fill: CD, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1 });
    bg(key + 'seat', rrPts(x - 3.6 * s, fy - 2.3 * s, 7.2 * s, 1.6 * s, .5 * s), { wash: mixCol(C, P.rose, .2), fill: CD, fillOp: 50, tex: .5, ink: PAL.ink, sw: .9 });
    bg(key + 'base', rectPts(x - 3.4 * s, fy - .8 * s, 6.8 * s, .8 * s, 1), { wash: CD, ink: PAL.ink, sw: .8 });
  }
  function armchairArms(x, fy, s, key) {
    for (const d of [-1, 1]) bg(key + 'arm' + d, rrPts(x + d * 3.6 * s - 1 * s, fy - 3.6 * s, 2 * s, 3.4 * s, .8 * s), { wash: mixCol('#7A3E3A', P.rose, .15), fill: '#4E2626', fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
  }
  // a tall window onto the night harbour. o.sky (0 night .. 1 day), o.lights (0..1 far windows lit), o.open 0..1, o.slide
  function harbourWindow(t, x, y, ww, wh, key, o = {}) {
    const day = o.day || 0;
    bg(key + 'frame', rectPts(x - ww / 2 - 20, y - wh / 2 - 20, ww + 40, wh + 40, 1), { wash: WOOD, fill: WOODDK, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    const sky = mixCol(P.night, mixCol(P.sea, P.ochreLt, .3), day);
    bg(key + 'sky', rectPts(x - ww / 2, y - wh / 2, ww, wh, 1), { wash: sky, fill: mixCol(sky, P.teal, .5), fillOp: 80, bleed: .2, tex: .5, ink: null });
    if (o.sun != null) { const a = lerp(Math.PI * 1.05, Math.PI * 1.95, o.sun), sx = x + Math.cos(a) * ww * .45, sy = y + wh * .18 + Math.sin(a) * wh * .5; if (o.sun > 0 && o.sun < 1) { boilSeed(key + 'sun'); glow(sx, sy, 120, P.ochreLt, .9); paint(ellPts(sx, sy, 26, 26, 16), { wash: mixCol(P.ochreLt, P.rose, Math.abs(o.sun - .5) * 2), ink: null }); } }
    if (o.moon) { boilSeed(key + 'moon'); glow(x + ww * .25, y - wh * .3, 70, P.pale, .4 * o.moon); paint(ellPts(x + ww * .25, y - wh * .3, 20, 20, 16), { wash: P.pale, ink: null }); }
    // far harbour: a skyline with windows
    const hy = y + wh * .12, sl = o.slide || 0;
    const blds = [[-.5, .2], [-.34, .05], [-.16, .28], [.02, -.02], [.2, .16], [.36, .08]];
    blds.forEach(([bx, bt], i) => {
      const x0 = x + ((bx * ww + sl + ww * 2) % (ww * 1.2)) - ww * .6, w2 = ww * .15;
      if (x0 < x - ww / 2 - 1 || x0 + w2 > x + ww / 2 + 1) return;
      bg(key + 'b' + i, rectPts(x0, hy + bt * wh, w2, wh / 2 - (hy + bt * wh - y), 1), { wash: mixCol(P.night, P.teal, .6), ink: null });
      for (let j = 0; j < 4; j++) { const lk = clamp(((o.lights || 0) * 24) - (i * 4 + j)), wx = x0 + w2 * (.25 + .5 * (j % 2)), wy = hy + bt * wh + 18 + Math.floor(j / 2) * 26; if (lk > 0) { boilSeed(key + 'w' + i + j); glow(wx, wy, 26 * lk, P.ochre, .7 * lk); paint(rectPts(wx - 5, wy - 7, 10, 12), { wash: mixCol(P.teal, P.ochreLt, lk), ink: null }); } }
    });
    bg(key + 'sea', rectPts(x - ww / 2, y + wh * .38, ww, wh * .12, 1), { wash: mixCol(P.night, P.teal, .4 + .3 * day), ink: null });
    for (let i = 0; i < 4; i++) { boilSeed(key + 'gl' + i); const gx = x - ww * .4 + ((i * 97 + sl * 1.5 + t * 20) % (ww * .8)); inkLine([[gx, y + wh * .42 + i * 6], [gx + 26, y + wh * .42 + i * 6]], 1, mixCol(P.ochre, P.teal, .4), 'inkfine', 0); }
    // sashes: the right one swings open (x-scale)
    const op = clamp(o.open || 0);
    boilSeed(key + 'mull');
    inkLine([[x, y - wh / 2], [x, y + wh / 2]], 5, WOODDK, 'ink', 0);
    inkLine([[x - ww / 2, y], [x - 2, y]], 4, WOODDK, 'ink', 0);
    if (op < .98) { const rx = lerp(x + ww / 2, x + 4, 0), rw = (ww / 2) * (1 - op); inkLine([[x + ww / 2 - rw, y], [x + ww / 2, y]], 4, WOODDK, 'ink', 0); inkLine([[x + ww / 2 - rw, y - wh / 2], [x + ww / 2 - rw, y + wh / 2]], 3, WOODDK, 'ink', 0); }
    bg(key + 'sill', rectPts(x - ww / 2 - 30, y + wh / 2 + 16, ww + 60, 16, 1), { wash: WOODLT, ink: PAL.ink, sw: .8 });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // the wheel's handles light one per exercise, across the whole film
  const HANDLES = () => [
    Q('bench', 'ai') + .9, Q('bench', 'simulation') + .5, Q('build', 'animated') + .9, Q('build', 'code') + .3, Q('live', 'domain') + .9,
    Q('live', 'report') + .4, Q('net', 'push') + .5, Q('net', 'files') + .5, Q('saas', 'every') + .5, Q('log', 'walked') + .2];
  let _H = null;
  const litAt = t => { _H = _H || HANDLES(); return _H.reduce((s, h) => s + seg(t, h, h + .35), 0); };

  // ---------------------------------------------------------------------------------------------------------------
  // 0. Ident: the ten-handled wheel draws itself to dimension; the guide's lettering writes on at the right.
  function identShot(t, lt, dur) {
    const RX = 560, RY = 560, RR = 230;
    camBegin(960 + 14 * Math.sin(lt * .5), 540 - 6 * lt, 1.0 + .018 * lt);
    VIEW = { x0: -100, x1: W + 100, y0: -100, y1: H + 100 };
    room(t, [-300, 2300]);
    bg('idfloorcover', rectPts(-300, FY - 4, 2600, 600), { wash: P.deep, fill: mixCol(P.deep, P.teal, .7), fillOp: 110, bleed: .2, tex: .6, border: .5, ink: null });
    helm(RX, RY, RR, { draw: seg(lt, .25, 2.4), dims: true, rot: 0, glow: .12 + .12 * seg(lt, 1.6, 2.6), lit: 10 * seg(lt, 2.3, 3.2), litK: 1, key: 'idh' });
    camEnd();
    sheetBorder();
    const LX = 985;
    crewText([
      { txt: 'THE AGENTIC CREW', x: LX, y: 285, size: 30, col: P.ochre, weight: 600, spacing: .26, align: 'left', k: seg(lt, .9, 1.5) },
      { txt: 'Hands-On', x: LX - 6, y: 440, size: 150, col: P.pale, weight: 400, align: 'left', k: seg(lt, 1.2, 1.9) },
      { txt: 'Guide', x: LX - 2, y: 600, size: 150, col: P.ochreLt, italic: true, weight: 300, align: 'left', k: seg(lt, 1.6, 2.3) },
      { txt: '10 exercises', x: LX, y: 790, size: 46, col: P.sea, italic: true, weight: 300, align: 'left', k: seg(lt, 2.4, 3.0) },
    ]);
    const rk = ease(seg(lt, 2.1, 2.6));
    if (rk > 0) { boilSeed('identrule'); inkLine([[LX, 705], [LX + 360 * rk, 707]], 1.2, P.ochre, 'ink', 0); }
    if (lt < .7) { const r = 30 + 2300 * easeIn(seg(lt, 0, .7)); boilSeed('identopen'); irisShape(blobPts(RX, RY, r, 7, .1, 40), PAL.paper); }
    seamOut('wipe', lt, dur, { cols: [P.ochre, P.sea] });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 1. Hook: the book gets snatched away; the terminal lights; the wall wheel's ten handles blink; she types, things
  // are drawn on the wall and become real; "you just need to be willing to try".
  function hookShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tBook = Q('hook', 'book'), tRead = Q('hook', 'read'), tDo = Q('hook', 'do'), tEx = Q('hook', 'exercise'), tNot = Q('hook', 'not');
    const tTen = Q('hook', '10'), tOpen = Q('hook', 'open'), tType = Q('hook', 'type'), tWatch = Q('hook', 'watch'), tReal = Q('hook', 'real');
    const tServ = Q('hook', 'servers'), tWith = Q('hook', 'with'), tBeside = Q('hook', 'beside'), tProg = Q('hook', 'programmer'), tWill = Q('hook', 'willing');
    const land = tNot + .75, shk = (t > land && t < land + .25) ? shakeXY(t, 8) : [0, 0];
    cam(t, [[t0, [1040, 610, 1.32]], [tBook, [980, 620, 1.42]], [tDo - .2, [1060, 610, 1.36]], [tNot + .9, [1180, 620, 1.25]], [tTen - .1, [1150, 610, 1.28]], [tTen + .4, [1110, 400, 1.45]],
      [tOpen - .05, [1110, 405, 1.45]], [tOpen + .7, [1000, 640, 1.38]], [tWatch + .2, [1040, 630, 1.3]], [tWatch + 1.0, [1340, 540, 1.05]], [tServ + 1.1, [1350, 550, 1.05]],
      [tWith + .2, [960, 640, 1.38]], [tProg - .3, [880, 640, 1.55]], [tWill + .3, [910, 650, 1.6]], [tEnd - .5, [990, 650, 1.85]], [tEnd, [1000, 652, 2.0]]], shk);
    room(t, [-400, 2500], { warm: seg(t, tEx, tEx + .6) * .6, warmAt: [[1000, 700, 420]] });
    // the wheel on the wall; on "ten" its handles blink round
    const blinkK = 1 - seg(t, tOpen + .1, tOpen + .6);
    helm(1100, 352, 104, { lit: 10 * seg(t, tTen, tTen + .9), litK: blinkK, dims: true, key: 'hh' });
    if (t > tTen + .1 && t < tOpen + .8) {
      const p = toScreen(1100 + 104 * 1.95 + 20, 352 - 104 * 1.25);
      crewText([{ txt: '10', x: p[0] + 36 * CAM.zoom, y: p[1] - 4 * CAM.zoom, size: 64 * CAM.zoom, col: P.ochreLt, italic: true, weight: 300, k: seg(t, tTen + .2, tTen + .7), alpha: blinkK }]);
    }
    // what she makes, drawn on the wall and then painted: a little house, then a server
    const zap = seg(t, tWatch, tWatch + .5);
    if (zap > 0 && zap < 1) { const p = arcPt([1010, 620], [1470, 420], 160, ease(zap)); boilSeed('zap'); glow(p[0], p[1], 50, P.sea, .8); paint(ellPts(p[0], p[1], 7, 7, 8), { wash: P.pale, ink: null }); }
    const hk = seg(t, tWatch + .45, tReal - .15), hf = seg(t, tReal - .05, tReal + .55);
    const HX = 1480, HY = 330;
    if (hf > 0) {
      bg('hwall', rectPts(HX - 100, HY + 60 + 150 * (1 - hf), 200, 150 * hf), { wash: mixCol(P.pale, P.ochreLt, .35), fill: P.ochreLt, fillOp: 50, tex: .6, ink: PAL.ink, sw: .8 });
      const rk = seg(hf, .4, 1); if (rk > 0) bg('hroof', [[HX - 125, HY + 62], [HX, HY - 40 + 102 * (1 - rk)], [HX + 125, HY + 62]], { wash: P.rose, fill: mixCol(P.rose, PAL.ink, .2), fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
      if (hf > .7) { bg('hdoor', rectPts(HX - 22, HY + 140, 44, 70), { wash: WOOD, ink: PAL.ink, sw: .7 }); boilSeed('hwin'); glow(HX + 55, HY + 110, 40, P.ochre, .7); paint(rectPts(HX + 40, HY + 95, 32, 30), { wash: P.ochreLt, ink: PAL.ink, sw: .6 }); }
    }
    if (hf < 1) {
      const oc = mixCol(P.sea, P.deep, hf);
      traceRect(HX - 100, HY + 60, 200, 150, seg(hk, 0, .55), oc, 1.4, 'hol1');
      tracePoly([[HX - 125, HY + 62], [HX, HY - 40], [HX + 125, HY + 62]], seg(hk, .5, .85), oc, 1.4, 'hol2');
      traceRect(HX - 22, HY + 140, 44, 70, seg(hk, .8, 1), oc, 1.1, 'hol3');
    }
    const SX = 1790, sk = seg(t, tServ - .1, tServ + .35), sf = seg(t, tServ + .35, tServ + .85);
    if (sf > 0) { bg('srv', rectPts(SX - 60, 210 + 300 * (1 - sf), 120, 300 * sf), { wash: STEEL, fill: STEELDK, fillOp: 70, tex: .5, ink: PAL.ink, sw: .9 }); if (sf > .95) for (let i = 0; i < 5; i++) { boilSeed('srvl' + i); const on = Math.floor(T * 5 + i * 1.7) % 3 !== 0; paint(rectPts(SX - 44, 236 + i * 54, 70, 16), { wash: STEELDK, ink: PAL.ink, sw: .5 }); paint(ellPts(SX + 40, 244 + i * 54, 5, 5, 8), { wash: on ? GREEN : P.ochre, ink: null }); } }
    if (sf < 1) traceRect(SX - 60, 210, 120, 300, sk, mixCol(P.sea, P.deep, sf), 1.4, 'srvo');

    // the table, keyboard, terminal and the book on its stand
    table(680, 1400, 'ht');
    const on = seg(t, tEx + .05, tEx + .35);
    const typing = t > tType - .15 && t < tWatch + .6;
    terminal(t, 1010, TT, 1, { on, lines: 1 + 3 * seg(t, tType, tWatch + .6) + 2 * seg(t, tBeside, tProg), bright: 1 + .6 * seg(t, tEnd - 1.2, tEnd), key: 'ht' });
    keyboard(880, TT, 1, 'hkb', typing);
    // the book: open on the stand → snatched → flung → on the floor
    const grab = tNot - .15, fly0 = tNot + .05;
    if (t < grab) book(1010, TT, { open: ease(seg(t, tBook - .1, tBook + .4)), key: 'hb' });
    else if (t < fly0) { const k = seg(t, grab, fly0); book(lerp(1010, 1080, k), TT - 60 * k, { open: 1 - k, noStand: true, key: 'hb' }); book(1010, TT, { open: 0, sc: .001, key: 'hbs' }); }
    else if (t < land) { const k = seg(t, fly0, land), p = arcPt([1080, TT - 60], [1760, FY + 10], 280, k); book(p[0], p[1], { open: 0, noStand: true, rot: k * 5.2, key: 'hb' }); }
    else { book(1760, FY + 10, { open: 0, noStand: true, rot: 5.2 + .06 * spring(t, land, 5, 18), key: 'hb' }); if (t < land + .6) { const k = seg(t, land, land + .6); boilSeed('hpuff'); for (let i = 0; i < 4; i++) paint(blobPts(1700 + i * 45, FY - 10 - 50 * k, 30 * (1 - k * .5), i, .3, 12), { fill: P.pale, fillOp: 120 * (1 - k), bleed: .3, tex: .4, ink: null }); } }
    if (t >= grab) { bg('hstand', [[970, TT], [1050, TT], [1036, TT - 20], [984, TT - 20]], { wash: WOODDK, ink: PAL.ink, sw: .8 }); }

    // the Navigator: reads, is surprised, looks up at the wheel, types, watches, worries, squares up
    const nMood = navMood(t, [[0, 'neutral', { lookX: .7, lookY: .2 }], [tRead - .3, 'thinking', { lookX: .8, lookY: .3, aR: -1.2 }], [tEx + .1, 'surprised'], [tTen, 'neutral', { lookX: .4, lookY: -1 }],
      [tType - .3, 'determined', { lookX: .7, lookY: .4 }], [tWatch + .35, 'surprised', { lookX: 1, lookY: -.8 }], [tReal + .2, 'happy', { lookX: 1, lookY: -.6 }], [tBeside, 'happy', { lookX: 1, lookY: 0 }],
      [tProg - .25, 'worried', { view: 'front', lookX: 0 }], [tWill - .15, 'determined', { view: 'q' }]]);
    const reading = t > tBook - .2 && t < tDo + .3;
    const nx = 760;
    nav(nx, FY, 20, { view: 'q', ...nMood, seed: 2,
      ...(reading ? { aR: lerp(-1.2, .3, ease(seg(t, tBook - .2, tBook + .2))) } : {}),
      ...(typing ? { aR: -.02 + .09 * Math.sin(t * 23), aL: -1.2 } : {}),
      ...(t > tWill - .1 ? { aR: lerp(-.9, .75, backOut(seg(t, tWill - .1, tWill + .25))) + .12 * Math.abs(Math.sin((t - tWill) * 7)) * seg(t, tWill + .3, tWill + .5) } : {}) });
    // Clawd: floor → hop onto the table → taps the terminal on → flings the book → hops down beside her
    const hop1 = [tDo - .15, tDo + .4], down = [tWith - .2, tWith + .4];
    let cx = 1560, cy = FY, co = {};
    const cMood = emotions(t, [[0, 'happy', { lookX: -.8 }], [tDo - .3, 'excited', { lookX: -.6 }], [tEx + .1, 'proud'], [tNot - .2, 'mischief'], [land + .1, 'laugh'],
      [tTen, 'happy', { lookY: -1 }], [tType, 'determined', { lookX: -.8, lookY: .4 }], [tWatch + .4, 'starstruck', { lookY: -1, lookX: .5 }], [tWith, 'happy'], [tProg, 'neutral', { lookX: -.8 }], [tWill + .1, 'excited']]);
    if (t < hop1[0]) { cx = 1560; cy = FY; co = { flip: true, view: 'q' }; }
    else if (t < hop1[1]) { const k = seg(t, hop1[0], hop1[1]), p = arcPt([1560, FY], [1250, TT], 160, ease(k)); cx = p[0]; cy = p[1]; co = { flip: true, view: 'q', sq: -.15 * Math.sin(Math.PI * k) }; }
    else if (t < down[0]) {
      cx = 1250; cy = TT;
      const land1 = .22 * Math.exp(-9 * (t - hop1[1])) * Math.cos(22 * (t - hop1[1]));
      const tap = Math.sin(Math.PI * seg(t, tEx - .25, tEx + .15)), fling = Math.sin(Math.PI * seg(t, grab - .1, fly0 + .15));
      co = { flip: true, view: 'q', sq: land1, aL: -.2 + .8 * tap + 1.4 * fling, rot: -.12 * fling };
      if (t > land) co = { ...co, ...turn(t, land - .1, land + .1, -.25, -.25) };
    } else if (t < down[1]) { const k = seg(t, down[0], down[1]), p = arcPt([1250, TT], [1000, FY], 120, ease(k)); cx = p[0]; cy = p[1]; co = { flip: true, view: 'q', sq: -.12 * Math.sin(Math.PI * k) }; }
    else {
      cx = 1000; cy = FY;
      const bump = Math.sin(Math.PI * seg(t, tBeside, tBeside + .35)), hp = jump(t, tWill + .3, tWill + .75, 2);
      co = { flip: true, view: 'q', dx: -.6 * bump, rot: .08 * bump, dy: hp.dy, sq: hp.sq, aL: t > tWill + .2 ? .9 : .2 };
    }
    clawd(cx, cy, 20, { ...cMood, ...co, dy: (cMood.dy || 0) + (co.dy || 0), sq: (cMood.sq || 0) + (co.sq || 0), boilKey: 'ch' });
    const at = toScreen(1010, TT - 26 - 75);
    camEnd();
    sheetBorder();
    seamIn('wipe', lt, { cols: [P.ochre, P.sea] });
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1], col: P.night });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 2. The workshop (pegboard fills with tools; Clawd is the fifth), then the first pull request: fork the book,
  // write a review, fold it into a paper plane and send it out of the window to the lit harbour.
  function benchShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tWork = Q('bench', 'workshop'), tools = [Q('bench', 'terminal'), Q('bench', 'package'), Q('bench', 'git'), Q('bench', 'github')], tAI = Q('bench', 'ai');
    const tEx2 = Q('bench', 'exercise', 1), tPull = Q('bench', 'pull'), tFork = Q('bench', 'fork'), tWrite = Q('bench', 'write'), tProp = Q('bench', 'propose');
    const tPeople = Q('bench', 'people'), tRead = Q('bench', 'read'), tSim = Q('bench', 'simulation');
    cam(t, [[t0, [700, 560, 1.22]], [tools[0], [690, 540, 1.2]], [tAI + .6, [760, 560, 1.2]], [tEx2 + .1, [800, 560, 1.2]], [tFork - .2, [1800, 600, 1.3]], [tWrite + 1, [1760, 620, 1.38]],
      [tProp, [1860, 580, 1.2]], [tProp + 1, [2080, 520, 1.22]], [tSim, [2090, 520, 1.28]], [tEnd, [2100, 520, 1.32]]]);
    room(t, [-500, 3200], { warm: .3 + .4 * seg(t, tAI, tSim), warmAt: [[600, 450, 500], [2350, 500, 400]] });
    helm(1400, 300, 85, { lit: litAt(t), key: 'bh', dims: false });
    // workbench + pegboard
    bg('peg', rectPts(200, 200, 1000, 560, 1), { wash: mixCol(P.teal, P.deep, .3), fill: P.night, fillOp: 60, tex: .6, border: .5, ink: PAL.ink, sw: 1 });
    boilSeed('pegholes'); for (let i = 0; i < 18; i++) for (let j = 0; j < 9; j++) if ((i + j) % 2 === 0) paint(ellPts(240 + i * 54, 230 + j * 60, 3, 3, 6), { wash: P.night, ink: null });
    table(150, 1250, 'bt');
    // tool slots: Clawd throws each tool, it clacks into its outline and fills with paint
    const slots = [[340, 350], [540, 360], [740, 360], [950, 360]];
    const crate = [230, FY - 70];
    tools.forEach((tc, i) => {
      const th0 = tc - .25, th1 = tc + .2, f = seg(t, th1, th1 + .3);
      tool(i, slots[i][0], slots[i][1], 1, f, 'tl' + i);
      if (t > th0 && t < th1) { const k = seg(t, th0, th1), p = arcPt([crate[0] + 120, crate[1] - 150], slots[i], 180, ease(k)); push(); translate(p[0], p[1]); rotate(k * 6); translate(-p[0], -p[1]); tool(i, p[0], p[1], 1, 1, 'tlf' + i); pop(); }
    });
    // the Clawd-shaped fifth outline
    const cSlot = [980, 690], hopIn = [tAI - .05, tAI + .5];
    if (t < hopIn[1] + .1) { boilSeed('cslot'); dash([cSlot[0] - 100, cSlot[1] - 120], [cSlot[0] + 100, cSlot[1] - 120], P.sea, 1.2, 12); dash([cSlot[0] + 100, cSlot[1] - 120], [cSlot[0] + 100, cSlot[1] - 40], P.sea, 1.2, 12); dash([cSlot[0] - 100, cSlot[1] - 40], [cSlot[0] + 100, cSlot[1] - 40], P.sea, 1.2, 12); dash([cSlot[0] - 100, cSlot[1] - 120], [cSlot[0] - 100, cSlot[1] - 40], P.sea, 1.2, 12); for (const lx of [-70, -30, 30, 70]) dash([cSlot[0] + lx, cSlot[1] - 40], [cSlot[0] + lx, cSlot[1]], P.sea, 1.2, 10); }
    // a crate of tools
    bg('crate', rectPts(crate[0] - 70, crate[1], 150, 70, 1), { wash: WOODLT, fill: WOOD, fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 });
    // the drafting table with the book, the window, the harbour
    table(1480, 2080, 'bt2');
    const WX = 2350, WY = 440;
    const lightsK = seg(t, tPeople - .3, tRead + .3), flash = t > tSim - .1 ? Math.max(0, Math.sin((t - tSim) * 12)) * (1 - seg(t, tSim + .8, tSim + 1.2)) : 0;
    harbourWindow(t, WX, WY, 380, 460, 'bw', { lights: lightsK, open: seg(t, tProp - .6, tProp - .2) });
    if (flash > 0) { boilSeed('bflash'); glow(WX + 40, WY + 40, 80, P.ochreLt, flash); }
    const forkK = ease(seg(t, tFork, tFork + .5));
    book(1700 - 90 * forkK, TT, { open: 1, key: 'bb1' });
    if (forkK > 0) { book(1700 + 150 * forkK, TT, { open: 1, key: 'bb2' }); boilSeed('bfork'); const k = forkK; inkLine(through([[1700 - 90 * k, TT - 190], [1700 + 30 * k, TT - 250], [1700 + 150 * k, TT - 190]]), 2, P.sea, 'ink', .5); paint(ellPts(1700 - 90 * k, TT - 190, 6, 6, 8), { wash: P.sea, ink: null }); paint(ellPts(1700 + 150 * k, TT - 190, 6, 6, 8), { wash: P.sea, ink: null }); }
    // the Navigator: directs at the pegboard, then walks to the table, writes, folds, throws
    const walk0 = tEx2 - .1, walk1 = tFork - .3, nx = lerp(640, 1480, ease(seg(t, walk0, walk1)));
    const writing = t > tWrite - .1 && t < tProp - .5, fold = seg(t, tProp - .5, tProp - .1), thr = seg(t, tProp - .1, tProp + .25);
    const nMood = navMood(t, [[0, 'neutral', { lookX: -.6 }], [tWork - .2, 'determined', { lookY: -.6 }], [tAI - .1, 'surprised', { lookX: .8, lookY: -.3 }], [tAI + .6, 'laugh'], [tEx2, 'determined'],
      [tWrite - .2, 'thinking', { lookX: .6, lookY: .6 }], [tProp - .3, 'determined', { lookX: 1, lookY: -.3 }], [tPeople, 'surprised', { lookX: 1, lookY: -.3 }], [tSim + .1, 'happy', { lookX: 1 }]]);
    const pointAt = tools.concat([tAI]).find(tc => t > tc - .45 && t < tc + .15);
    const slotAll = slots.concat([[cSlot[0], cSlot[1] - 80]]);
    let nav_o = { view: 'q', seed: 4 };
    if (pointAt != null && nx < 700) { const i = tools.concat([tAI]).indexOf(pointAt), sp = slotAll[i], a = Math.atan2(-(sp[1] - (FY - 7.7 * 20)), sp[0] - (nx + 31)); nav_o = { ...nav_o, point: 'R', aR: clamp(a, -.4, 1.4) }; }
    if (t > walk0 && t < walk1) nav_o = { ...nav_o, view: 'side', walk: (nx - 640) / 42 };
    if (writing) nav_o = { ...nav_o, aR: -.55 + .06 * Math.sin(t * 22), handR: penHook };
    if (fold > 0 && thr < 1) nav_o = { ...nav_o, aR: lerp(-.4, 1.1, easeIn(thr)) };
    nav(nx, FY, 20, { ...nMood, ...nav_o });
    // the review: a slip on the table (written), folded into a plane in her hand, thrown out of the window
    const slipAt = [nx + 150, TT - 40];
    if (t > tWrite - .4 && fold < 1) slip(slipAt[0], slipAt[1] - 30 * fold, 110 * (1 - .6 * fold), 70 * (1 - .5 * fold), -.05 + fold * .3, [seg(t, tWrite, tWrite + .5), seg(t, tWrite + .45, tWrite + .95), seg(t, tWrite + .9, tWrite + 1.3), seg(t, tWrite + 1.2, tWrite + 1.5)], 'brev', { lw: 1.1 });
    if (fold >= 1) {
      const hand = [nx + 31 + 65 * Math.cos(1.1), FY - 154 - 65 * Math.sin(1.1)];
      const fk = seg(t, tProp + .1, tProp + 1.2);
      if (fk <= 0) plane(hand[0], hand[1], .9, -.3, 'bplane');
      else if (fk < 1) { const p = arcPt(hand, [WX + 40, WY + 30], 160, ease(fk)), q = arcPt(hand, [WX + 40, WY + 30], 160, ease(fk) + .01); plane(p[0], p[1], .9 * (1 - .7 * fk), Math.atan2(q[1] - p[1], q[0] - p[0]), 'bplane'); }
    }
    // Clawd: throws from the crate, hops into his own outline, then helps fork the book
    const cMood = emotions(t, [[0, 'excited', { lookX: .6, lookY: -.5 }], [tAI - .15, 'surprised', { lookY: -.8, lookX: .8 }], [tAI + .5, 'proud'], [tEx2 + .3, 'happy'], [tFork - .1, 'mischief'], [tFork + .5, 'excited'],
      [tWrite, 'neutral', { lookX: -.6, lookY: .3 }], [tProp, 'excited', { lookX: 1, lookY: -.3 }], [tPeople + .2, 'starstruck'], [tSim, 'love']]);
    let cx = 340, cy = FY, co = { view: 'q' };
    const throwing = tools.find(tc => t > tc - .45 && t < tc + .2);
    if (t < hopIn[0]) co = { view: 'q', aL: throwing != null ? lerp(-.3, 1.3, Math.sin(Math.PI * seg(t, throwing - .45, throwing + .2))) : .1 };
    else if (t < hopIn[1]) { const k = seg(t, hopIn[0], hopIn[1]), p = arcPt([340, FY], cSlot, 200, ease(k)); cx = p[0]; cy = p[1]; co = { view: 'front', sq: -.14 * Math.sin(Math.PI * k), noShadow: true }; }
    else if (t < tEx2 + .3) { cx = cSlot[0]; cy = cSlot[1]; const s2 = .2 * Math.exp(-8 * (t - hopIn[1])) * Math.cos(20 * (t - hopIn[1])); co = { view: 'front', sq: s2, aL: .9, aR: .9, noShadow: true }; }
    else if (t < tEx2 + .75) { const k = seg(t, tEx2 + .3, tEx2 + .75), p = arcPt(cSlot, [1180, FY], 120, ease(k)); cx = p[0]; cy = p[1]; co = { view: 'side', sq: -.12 * Math.sin(Math.PI * k) }; }
    else { const k = seg(t, tEx2 + .75, tFork - .2); cx = lerp(1180, 1980, ease(k)); co = k < 1 ? { view: 'side', walk: (cx - 1180) / 60 } : { flip: true, view: 'q', aL: t > tFork - .1 && t < tFork + .6 ? .6 : .1 }; }
    clawd(cx, cy, 20, { ...cMood, ...co, dy: (cMood.dy || 0) + (co.dy || 0), sq: (cMood.sq || 0) + (co.sq || 0), boilKey: 'cb' });
    camEnd();
    sheetBorder();
    seamIn('iris', lt, { cx: W * .45, cy: H * .45, col: P.night });
    seamOut('page', lt, dur, { col: mixCol(P.pale, P.sea, .2) });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 3. Building: a presentation (pictures, narration, animated background), then the travel bucket list app.
  function buildShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tPres = Q('build', 'presentation'), tDesc = Q('build', 'describe'), tPic = Q('build', 'pictures'), tNarr = Q('build', 'narration'), tAnim = Q('build', 'animated');
    const tNext = Q('build', 'next'), tTravel = Q('build', 'travel'), tScratch = Q('build', 'scratch'), tDesc2 = Q('build', 'describe', 1), tWrites = Q('build', 'writes');
    const tReview = Q('build', 'review'), tClick = Q('build', 'click'), tBetter = Q('build', 'better'), tVision = Q('build', 'vision'), tCode = Q('build', 'code');
    const pop0 = tWrites + .2, pops = [0, 1, 2, 3, 4].map(i => pop0 + i * .22);
    const shk = pops.some(p => t > p && t < p + .12) ? shakeXY(t, 4) : [0, 0];
    cam(t, [[t0, [860, 580, 1.22]], [tPres, [860, 560, 1.24]], [tAnim + .8, [900, 560, 1.28]], [tNext + .2, [900, 560, 1.25]], [tTravel + .6, [1820, 560, 1.2]], [tReview, [1830, 540, 1.24]], [tBetter + .4, [1840, 540, 1.28]], [tEnd, [1860, 560, 1.34]]], shk);
    room(t, [-400, 3000], { warm: .5, warmAt: [[900, 400, 500], [1850, 450, 520]] });
    helm(2400, 330, 85, { lit: litAt(t), key: 'buh', dims: false });
    // the presentation: an easel on a low table, the slide drops in; picture, a horn with sound, wheeling stars
    const EX = 900, SL = [EX - 280, 230, 560, 340];
    bg('easleg1', ribbon([[EX - 200, 560], [EX - 260, FY]], 18, 14), { wash: WOOD, ink: PAL.ink, sw: .8 });
    bg('easleg2', ribbon([[EX + 200, 560], [EX + 260, FY]], 18, 14), { wash: WOOD, ink: PAL.ink, sw: .8 });
    bg('easbar', rectPts(EX - 300, 560, 600, 20, 1), { wash: WOODLT, ink: PAL.ink, sw: .8 });
    const drop = backOut(seg(t, Q('build', 'building') + .1, Q('build', 'building') + .6));
    const sy = lerp(-500, SL[1], drop);
    if (drop > 0) {
      bg('slframe', rectPts(SL[0] - 18, sy - 18, SL[2] + 36, SL[3] + 36, 1), { wash: STEELDK, ink: PAL.ink, sw: 1 });
      const ak = seg(t, tAnim, tAnim + .5);
      bg('slbg', rectPts(SL[0], sy, SL[2], SL[3], 1), { wash: mixCol(P.night, mixCol(P.teal, '#3a2d6e', .5), ak), ink: null });
      if (ak > 0) for (let i = 0; i < 16; i++) { const a = (t - tAnim) * (.5 + .3 * hash(i)) + i * 1.7, rr = 40 + 240 * hash(i * 2.1), px = SL[0] + SL[2] / 2 + Math.cos(a) * rr, py = sy + SL[3] / 2 + Math.sin(a) * rr * .5; if (px < SL[0] + 8 || px > SL[0] + SL[2] - 8 || py < sy + 8 || py > sy + SL[3] - 8) continue; boilSeed('star' + i); paint(starPts(px, py, 7 * ak * (1 + .4 * Math.sin(T * 4 + i)), .4, 4), { wash: i % 3 ? P.sea : P.ochreLt, ink: null }); }
      const pk = backOut(seg(t, tPic, tPic + .45));
      if (pk > .02) {
        const cx = SL[0] + SL[2] * .42, cy = sy + SL[3] * .58;
        push(); translate(cx, cy); scale(pk); translate(-cx, -cy);
        bg('picsun', ellPts(cx + 110, cy - 90, 40, 40, 16), { wash: P.ochreLt, ink: PAL.ink, sw: .7 });
        bg('picmtn', [[cx - 200, cy + 110], [cx - 40, cy - 110], [cx + 60, cy + 10], [cx + 110, cy - 40], [cx + 220, cy + 110]], { wash: '#4F7FA8', fill: P.teal, fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 });
        bg('picsnow', [[cx - 90, cy - 40], [cx - 40, cy - 110], [cx + 8, cy - 42], [cx - 40, cy - 60]], { wash: P.pale, ink: null });
        pop();
      }
      const nk = backOut(seg(t, tNarr, tNarr + .4));
      if (nk > .02) {
        const hx = SL[0] + SL[2] - 70, hy = sy + SL[3] - 60;
        bg('horn', [[hx - 30 * nk, hy + 10 * nk], [hx + 10 * nk, hy - 5 * nk], [hx + 55 * nk, hy - 45 * nk], [hx + 55 * nk, hy + 45 * nk], [hx + 10 * nk, hy + 18 * nk]], { wash: P.ochre, fill: P.ochreDk, fillOp: 60, ink: PAL.ink, sw: .8 });
        for (let i = 0; i < 3; i++) { const p = frac((t - tNarr) * .9 + i / 3), r = 30 + 70 * p; boilSeed('snd' + i); inkLine(arcLine(hx + 60, hy, r, -.6, .6, 10), 2 * (1 - p), P.ochreLt, 'ink', .5); }
      }
      boilSeed('sldots'); for (let i = 0; i < 4; i++) paint(ellPts(EX - 45 + i * 30, sy + SL[3] + 40, 7, 7, 8), { wash: i === 0 ? P.ochre : mixCol(P.sea, P.deep, .4), ink: null });
    }
    // the app: a board pinned on the wall above a terminal on a small table
    const AX = 1500, AY = 180, AW = 680, AH = 360;
    bg('appbd', rectPts(AX, AY, AW, AH, 1), { wash: mixCol(P.deep, P.teal, .5), fill: P.night, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    traceRect(AX + 10, AY + 10, AW - 20, AH - 20, 1, mixCol(P.sea, P.deep, .35), .8, 'appbdo');
    table(1680, 2020, 'at');
    const typing = t > tWrites - .1 && t < pops[4] + .3;
    terminal(t, 1850, TT, .85, { on: 1, lines: 1 + 5 * seg(t, tWrites - .1, pops[4] + .3), key: 'at' });
    keyboard(1740, TT, .9, 'akb', typing);
    if (typing) for (let i = 0; i < 6; i++) { const p = frac((t - tWrites) * 1.6 + i / 6), x = 1850 + (hash(i) - .5) * 80, y = lerp(TT - 170, AY + AH - 20, p); boilSeed('code' + i); inkLine([[x, y], [x + 24, y]], 3 * (1 - p), P.ochreLt, 'ink', 0); }
    const better = ease(seg(t, tBetter + .1, tBetter + .5)), wig = ring(t, [tBetter + .1], 6, 16);
    for (let i = 0; i < 5; i++) {
      const k = backOut(seg(t, pops[i], pops[i] + .3)); if (k <= .02) continue;
      const cxp = AX + 30 + i * 128, cyp = AY + 70 + (i % 2) * 40;
      card(cxp, cyp, 110, 150, i, { sc: k * (1 + .05 * wig), flip: i === 1 ? seg(t, tClick + .1, tClick + .45) : 0, border: better > 0 ? mixCol(mixCol(P.deep, P.teal, .5), [P.ochre, P.sea, P.rose, P.ochreLt, P.sap][i], better) : null, rot: .03 * wig * (i % 2 ? 1 : -1), key: 'bc' + i });
    }
    // the Navigator: describes (a cyan speech line), walks right, describes, reviews, clicks, asks for better, holds up her chart
    const walk0 = tNext, walk1 = tTravel + .6, nx = lerp(420, 1450, ease(seg(t, walk0, walk1)));
    const nMood = navMood(t, [[0, 'neutral', { lookX: .8, lookY: -.3 }], [tDesc - .2, 'determined'], [tPic, 'surprised', { lookX: 1, lookY: -.5 }], [tPic + .5, 'happy', { lookX: 1, lookY: -.4 }], [tNext, 'determined'],
      [tDesc2 - .1, 'determined', { lookX: 1 }], [tReview - .1, 'thinking', { lookX: 1, lookY: -1 }], [tClick + .3, 'happy', { lookY: -.8 }], [tBetter - .3, 'determined', { lookY: -.8 }], [tVision - .2, 'proud'], [tCode, 'laugh']]);
    const talking = (t > tDesc && t < tDesc + 1.9) || (t > tDesc2 && t < tDesc2 + 1);
    let no = { view: 'q', seed: 3 };
    if (talking) no = { ...no, aR: .1 + .25 * Math.sin(t * 5), mouth: Math.floor(t * 8) % 2 ? 'open' : 'smile' };
    if (t > walk0 && t < walk1) no = { ...no, view: 'side', walk: (nx - 420) / 42 };
    if ((t > tClick - .25 && t < tClick + .4) || (t > tBetter - .35 && t < tBetter + .3)) no = { ...no, point: 'R', aR: .95 };
    if (t > tVision - .3) no = { ...no, aR: lerp(-.9, .15, ease(seg(t, tVision - .3, tVision + .1))), handR: (s, sw, up) => navProp('chart', s, sw, { up, open: ease(seg(t, tVision - .1, tVision + .5)) }) };
    nav(nx, FY, 20, { ...nMood, ...no });
    // her description: a cyan dash-line curling from her to Clawd
    const sayK = t < tNext ? seg(t, tDesc, tDesc + 1.2) * (1 - seg(t, tDesc + 2.0, tDesc + 2.5)) : seg(t, tDesc2, tDesc2 + .6) * (1 - seg(t, tDesc2 + 1.2, tDesc2 + 1.5));
    const cxN = t < tNext ? 1270 : 2150;
    if (sayK > 0) { const a = [nx + 60, FY - 230], b = [cxN - 80, FY - 200], pts = through([a, [lerp(a[0], b[0], .3), a[1] - 90], [lerp(a[0], b[0], .7), b[1] - 110], b]); const n = Math.floor(pts.length * sayK); boilSeed('say'); for (let i = 0; i + 1 < n; i += 2) inkLine([pts[i], pts[i + 1]], 2.2, P.sea, 'ink', 0); }
    // Clawd: listens, flicks paint at the slide; hops over to the terminal and types; paints the cards brighter
    const cMood = emotions(t, [[0, 'happy', { lookX: -.8 }], [tDesc, 'thinking', { lookX: -.8, lookY: -.2 }], [tPic - .3, 'determined', { lookX: -.6, lookY: -.6 }], [tPic + .3, 'proud'], [tNext, 'excited'],
      [tDesc2, 'thinking', { lookX: -1 }], [tWrites - .1, 'determined', { lookX: -.6, lookY: .3 }], [pops[4] + .4, 'proud'], [tReview, 'nervous', { lookX: -.8 }], [tClick + .4, 'happy'], [tBetter + .05, 'excited'], [tCode - .1, 'proud']]);
    let cx = 1270, co = { flip: true, view: 'q' };
    const flick = [tPic - .15, tNarr - .15, tAnim - .15].find(tt => t > tt && t < tt + .35);
    if (t < tNext + .2) co = { ...co, aL: flick != null ? lerp(-.2, 1.2, Math.sin(Math.PI * seg(t, flick, flick + .35))) : .2, armL: brushHook(P.ochre) };
    else if (t < tTravel + .8) { const k = seg(t, tNext + .2, tTravel + .8); cx = lerp(1270, 2150, ease(k)); co = { view: 'side', walk: (cx - 1270) / 60 }; }
    else { cx = 2150; co = { flip: true, view: 'q', aL: typing ? .1 + .25 * Math.sin(t * 30) : (t > tBetter && t < tBetter + .5 ? lerp(0, 1.2, Math.sin(Math.PI * seg(t, tBetter, tBetter + .5))) : (t > tCode - .2 ? 1.2 : .2)), armL: t > tBetter - .1 ? brushHook(P.rose) : null }; }
    clawd(cx, FY, 20, { ...cMood, ...co, boilKey: 'cbu' });
    const sp = toScreen(cx - 150, FY - 190);
    camEnd();
    sheetBorder();
    seamIn('page', lt, { col: mixCol(P.pale, P.sea, .2) });
    seamOut('splash', lt, dur, { cx: sp[0], cy: sp[1], cols: [P.ochre, P.sea, P.teal], seed: 4 });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 4. Going live and pentesting: the plane bonks the bell jar; a server swings in and gets painted; Clawd logs in,
  // locks it, lights the beacon, the signpost points; then the alarm, three masked agents, a panel pops, a report.
  function liveShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tLap = Q('live', 'laptop'), tSend = Q('live', 'send'), tCant = Q('live', "can't"), tRent = Q('live', 'rent'), tServer = Q('live', 'server');
    const tRuns = Q('live', 'runs'), tLogs = Q('live', 'logs'), tLocks = Q('live', 'locks'), tHttps = Q('live', 'https'), tDomain = Q('live', 'domain');
    const tAttack = Q('live', 'attack'), tTeam = Q('live', 'team'), tProbes = Q('live', 'probes'), tExp = Q('live', 'exploits'), tRep = Q('live', 'report'), tWrites = Q('live', 'writes');
    const landS = tServer + .45, pry = tExp + .25;
    const shk = (t > landS && t < landS + .25) ? shakeXY(t, 9) : (t > pry && t < pry + .25) ? shakeXY(t, 7) : [0, 0];
    cam(t, [[t0, [760, 620, 1.5]], [tSend, [770, 610, 1.58]], [tCant + .5, [790, 620, 1.58]], [tRent, [1100, 560, 1.12]], [tRuns + .5, [1250, 580, 1.18]], [tDomain + .5, [1380, 560, 1.12]],
      [tAttack + .3, [1350, 580, 1.15]], [tTeam + .5, [1450, 560, 1.22]], [tWrites, [1330, 600, 1.25]], [tEnd, [1300, 610, 1.32]]], shk);
    const alarm = seg(t, tAttack, tAttack + .4);
    room(t, [-300, 2800], { alarm: alarm * (.8 + .2 * Math.sin(t * 7)), warm: .4 * (1 - alarm), warmAt: [[760, 600, 380]] });
    helm(2000, 300, 85, { lit: litAt(t), key: 'lh', dims: false });
    // the laptop in a bell jar
    table(520, 1000, 'lt');
    const LX = 760, lift = ease(seg(t, tDomain, tDomain + .5));
    bg('lapbase', [[LX - 110, TT], [LX + 110, TT], [LX + 100, TT - 14], [LX - 100, TT - 14]], { wash: STEEL, ink: PAL.ink, sw: .9 });
    bg('lapscr', rectPts(LX - 95, TT - 150, 190, 136, 1), { wash: STEELDK, ink: PAL.ink, sw: .9 });
    bg('lapin', rectPts(LX - 84, TT - 140, 168, 116, 1), { wash: mixCol(P.teal, P.deep, .3), ink: null });
    for (let i = 0; i < 4; i++) { const k = 1 - seg(t, tDomain + .2, tDomain + .6); if (k > 0) bg('lapc' + i, rectPts(LX - 74 + i * 40, TT - 120 + (i % 2) * 14, 32 * k, 44 * k, 1), { wash: [P.pale, P.ochreLt, P.pale, P.rose][i], ink: PAL.ink, sw: .5 }); }
    boilSeed('lapglow'); glow(LX, TT - 80, 160, P.sea, .25);
    // the plane: launches from the screen and bonks on the glass, slides down
    const pl0 = tSend + .3, bonk = tFriend(), slideEnd = tCant + .5;
    function tFriend() { return Q('live', 'friend') + .1; }
    if (t > pl0) {
      let p, r = -.6;
      if (t < bonk) { const k = seg(t, pl0, bonk); p = arcPt([LX + 20, TT - 100], [LX + 150, TT - 260], 40, easeIn(k)); r = -.7; }
      else if (t < slideEnd) { const k = seg(t, bonk, slideEnd); p = [LX + 150 - 20 * k, lerp(TT - 260, TT - 40, easeIn(k))]; r = lerp(-.7, 1.4, k); }
      else p = [LX + 130, TT - 30], r = 1.4;
      if (lift < .2) plane(p[0], p[1], .6, r, 'lpl');
      if (t > bonk && t < bonk + .3) { boilSeed('lbonk'); emote('!', LX + 190, TT - 300, 16, seg(t, bonk, bonk + .1), t - bonk); }
    }
    // the jar
    const jy = -380 * lift;
    boilSeed('jar');
    const jar = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; jar.push([LX + Math.cos(a) * 185, TT - 200 + Math.sin(a) * 120 + jy]); } jar.push([LX + 185, TT + jy]); jar.push([LX - 185, TT + jy]);
    paint(jar, { fill: P.pale, fillOp: 30, bleed: .1, tex: .3, border: .4, ink: mixCol(P.pale, P.sea, .4), sw: 1.4, curv: .3 });
    inkLine([[LX - 140, TT - 250 + jy], [LX - 160, TT - 100 + jy]], 3, mixCol(P.pale, P.sea, .2), 'ink', .5);
    paint(ellPts(LX, TT - 336 + jy, 18, 12, 10), { wash: mixCol(P.pale, P.sea, .5), ink: PAL.ink, sw: .8 });
    // the server: swings down on a crane hook as line work, lands, floods with paint from the floor up
    const SX = 1650, SW = 240, SH = 400, dropK = seg(t, tRent - .1, landS), sDy = -900 * (1 - easeIn(dropK));
    const fillK = seg(t, landS + .05, landS + .7);
    const top = FY - SH + sDy;
    boilSeed('crane'); if (dropK < 1 || t < landS + .8) { const up = t > landS ? -600 * ease(seg(t, landS + .2, landS + .8)) : 0; inkLine([[SX, -700], [SX, top - 30 + up]], 2, mixCol(P.sea, P.deep, .3), 'ink', 0); inkLine(arcLine(SX, top - 20 + up, 18, -.3, Math.PI + .3, 10), 3, P.ochreDk, 'ink', .4); }
    if (fillK > 0) {
      bg('srvbody', rectPts(SX - SW / 2, FY - SH * fillK + sDy, SW, SH * fillK, 1), { wash: STEEL, fill: STEELDK, fillOp: 70, tex: .6, border: .5, ink: PAL.ink, sw: 1 });
      if (fillK >= 1) {
        const lights = seg(t, tLogs + .1, tLogs + .6);
        for (let i = 0; i < 6; i++) {
          const y = top + 40 + i * 52;
          if (i === 2 && t > pry) continue;
          bg('bay' + i, rectPts(SX - SW / 2 + 22, y, SW - 44, 34, 1), { wash: STEELDK, ink: PAL.ink, sw: .6 });
          const lk = clamp(lights * 6 - i), blink = Math.floor(T * 6 + i * 2.3) % 4 !== 0;
          boilSeed('bl' + i); if (lk > 0) { glow(SX + SW / 2 - 40, y + 17, 18, alarm > .5 ? RED : P.ochre, .8 * lk); } paint(ellPts(SX + SW / 2 - 40, y + 17, 6, 6, 8), { wash: lk > 0 && blink ? (alarm > .5 && i % 2 ? RED : P.ochreLt) : mixCol(STEELDK, P.sea, .2), ink: null });
          inkLine([[SX - SW / 2 + 34, y + 17], [SX - 10, y + 17]], 1, mixCol(STEELDK, P.sea, .3), 'inkfine', 0);
        }
        // the pried panel flies off
        if (t > pry) { const k = seg(t, pry, pry + .7), p = arcPt([SX - 20, top + 160], [SX + 330, FY - 10], 200, k); push(); translate(p[0], p[1]); rotate(k * 4); bg('panel', rectPts(-98, -17, 196, 34, 1), { wash: STEELDK, ink: PAL.ink, sw: .8 }); pop(); if (t < pry + .5) { boilSeed('spark'); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t * 3, r = 30 + 60 * seg(t, pry, pry + .5); inkLine([[SX + Math.cos(a) * r * .4 - 20, top + 160 + Math.sin(a) * r * .4], [SX + Math.cos(a) * r - 20, top + 160 + Math.sin(a) * r]], 2, P.ochreLt, 'ink', 0); } } bg('hole', rectPts(SX - SW / 2 + 22, top + 144, SW - 44, 34, 1), { wash: P.night, ink: PAL.ink, sw: .6 }); for (let i = 0; i < 3; i++) { boilSeed('wire' + i); inkLine([[SX - 70 + i * 50, top + 150], [SX - 60 + i * 50 + 10 * Math.sin(t * 5 + i), top + 175]], 2, [P.rose, P.ochre, P.sea][i], 'ink', .5); } }
        // padlock
        const lk = seg(t, tLocks - .1, tLocks + .3);
        if (lk > 0) { const ly = lerp(top - 200, top + 190, easeIn(lk)) + (lk >= 1 ? 6 * spring(t, tLocks + .3, 6, 20) : 0), lx = SX + SW / 2 + 6; bg('lock', rrPts(lx - 30, ly, 60, 50, 8), { wash: P.ochre, fill: P.ochreDk, fillOp: 60, ink: PAL.ink, sw: 1 }); boilSeed('shackle'); inkLine(arcLine(lx, ly, 20, Math.PI, TAU, 12), 7, STEELDK, 'ink', .5); paint(ellPts(lx, ly + 22, 6, 8, 8), { wash: P.night, ink: null }); }
        // beacon on top
        const bk = seg(t, tHttps, tHttps + .3), bc = alarm > .5 ? RED : GREEN;
        bg('beaconb', rectPts(SX - 30, top - 14, 60, 14, 1), { wash: STEELDK, ink: PAL.ink, sw: .8 });
        if (bk > 0) { boilSeed('beacong'); glow(SX, top - 40, 120 * bk * (1 + .15 * Math.sin(t * 8)), bc, .9 * bk); }
        bg('beacon', [[SX - 26, top - 14], [SX + 26, top - 14], [SX + 20, top - 60], [SX - 20, top - 60]], { wash: mixCol(STEELDK, bc, bk), fill: mixCol(bc, '#FFFFFF', .4), fillOp: 90 * bk, ink: PAL.ink, sw: .9, curv: .3 });
        // a keyhole the key turns in (logs in)
        const kk = seg(t, tLogs - .2, tLogs + .3);
        if (kk > 0 && t < tLocks + .5) { push(); translate(SX - SW / 2 - 4, top + 210); rotate(Math.PI / 2 * ease(seg(t, tLogs, tLogs + .3))); bg('key', ribbon([[0, 0], [-60, 0]], 8, 8), { wash: P.ochreLt, ink: PAL.ink, sw: .7 }); bg('keyb', ellPts(-70, 0, 18, 18, 12), { wash: P.ochreLt, ink: PAL.ink, sw: .7 }); pop(); }
      }
    }
    if (fillK < 1 && dropK > 0) traceRect(SX - SW / 2, top, SW, SH, Math.min(1, dropK * 2), mixCol(P.sea, P.deep, fillK), 1.6, 'srvo');
    // the signpost: swings round to point at the server; the app beams in
    const PX = 2150, sgK = ease(seg(t, tDomain - .15, tDomain + .4)) + .1 * spring(t, tDomain + .4, 6, 14);
    bg('post', rectPts(PX - 8, 520, 16, FY - 520, 1), { wash: WOOD, ink: PAL.ink, sw: .8 });
    push(); translate(PX, 540); rotate(lerp(-1.5, 0, sgK)); scale(-1, 1);
    bg('arrow', [[-10, -30], [150, -30], [190, 0], [150, 30], [-10, 30]], { wash: P.ochre, fill: P.ochreDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    pop();
    const beam = seg(t, tDomain + .3, tDomain + .9);
    if (beam > 0 && beam < 1) { const p = arcPt([LX, TT - 90], [SX, top + 120], 260, ease(beam)); boilSeed('beam'); glow(p[0], p[1], 70, P.sea, .8); card(p[0] - 30, p[1] - 40, 60, 80, 0, { key: 'beamc' }); }
    // the report: a scroll unrolls from the server's slot into her hands
    const rk = ease(seg(t, tWrites, tRep + .6));
    const nx = lerp(470, 1000, ease(seg(t, tAttack - .3, tAttack + .9)));
    if (rk > 0) {
      const x1 = SX - SW / 2, x0 = lerp(x1, nx + 110, rk), ry = FY - 330;
      bg('scroll', [[x0, ry - 70], [x1, ry - 80], [x1, ry + 60], [x0, ry + 70]], { wash: P.pale, fill: P.sea, fillOp: 25, tex: .6, ink: PAL.ink, sw: .9 });
      for (let i = 0; i < 6; i++) { const mx = lerp(x1 - 30, x0 + 20, (i + .5) / 6); if ((x1 - mx) / (x1 - x0 + 1) > rk + .02) continue; boilSeed('rep' + i); paint(ellPts(mx, ry - 30, 9, 9, 8), { wash: [RED, P.ochre, RED, P.ochre, P.sap, P.ochre][i], ink: PAL.ink, sw: .5 }); inkLine([[mx - 22, ry], [mx + 22, ry]], 1.2, P.deep, 'inkfine', 0); inkLine([[mx - 22, ry + 18], [mx + 10, ry + 18]], 1.2, P.deep, 'inkfine', 0); }
      bg('scrollr', ellPts(x0, ry - 5, 14, 60, 12), { wash: mixCol(P.pale, P.sea, .3), ink: PAL.ink, sw: .8 });
    }
    // the Navigator
    const nMood = navMood(t, [[0, 'neutral', { lookX: .8, lookY: .2 }], [tLap - .1, 'proud'], [tSend - .2, 'happy', { lookX: .8, lookY: -.2 }], [tCant - .1, 'sad', { lookX: .8, lookY: .6 }], [tRent, 'surprised', { lookX: 1, lookY: -.6 }],
      [tRuns + .3, 'happy', { lookX: 1 }], [tHttps + .2, 'proud'], [tAttack - .3, 'stern', { lookX: 1 }], [tTeam + .3, 'surprised', { lookX: 1, lookY: -.5 }], [tProbes + .3, 'thinking', { lookX: 1 }], [tRep, 'stern', { lookX: 1, lookY: .4 }], [tRep + .9, 'happy', { lookX: 1, lookY: .4 }]]);
    let no = { view: 'q', seed: 6 };
    if (t > tSend - .3 && t < tSend + .3) no = { ...no, aR: .1, point: 'R' };
    if (t > tAttack - .3 && t < tAttack + .9) no = { ...no, view: 'side', walk: (nx - 420) / 42 };
    else if (t > tAttack + .9 && t < tTeam) no = { ...no, point: 'R', aR: .3 };
    if (rk > .7) no = { ...no, aR: -.25, aL: -1.1 };
    nav(nx, FY, 20, { ...nMood, ...no });
    // Clawd: proud of the laptop, trots to the server, turns the key; then watches the attack
    const cMood = emotions(t, [[0, 'proud', { lookX: -.6 }], [tCant, 'sad', { lookX: -.6, lookY: .5 }], [tRent + .1, 'surprised', { lookY: -1 }], [tRuns, 'determined'], [tLocks + .3, 'proud'], [tDomain + .3, 'excited'],
      [tAttack + .1, 'scared', { lookX: 1 }], [tTeam + .4, 'surprised', { lookY: -.6 }], [tProbes + .3, 'nervous'], [tExp + .3, 'surprised'], [tRep, 'relieved']]);
    const cw0 = tRuns - .2, cw1 = tRuns + .7;
    let cx = 1110, co = { flip: true, view: 'q' };
    if (t > cw0 && t < cw1) { const k = seg(t, cw0, cw1); cx = lerp(1110, 1380, ease(k)); co = { view: 'side', walk: (cx - 1110) / 60 }; }
    else if (t >= cw1) { cx = 1380; co = { view: 'q', aL: t > tLogs - .3 && t < tLogs + .4 ? .3 : .1 }; if (t > tAttack) co = { ...co, flip: false, ...take(t, tAttack + .1, .8) }; }
    clawd(cx, FY, 20, { ...cMood, ...co, dy: (cMood.dy || 0) + (co.dy || 0), sq: (cMood.sq || 0) + (co.sq || 0), boilKey: 'cl' });
    // three masked security agents drop in on ropes and probe
    [[SX - 190, 0], [SX + 190, .15], [SX - 40, .3]].forEach(([ax, dl], i) => {
      const k = seg(t, tTeam + dl, tTeam + dl + .45); if (k <= 0) return;
      const ay = i === 2 ? top - 14 : FY, yy = lerp(-200, ay, easeOut(k)) + (k >= 1 ? 0 : 0);
      boilSeed('rope' + i); inkLine([[ax, -700], [ax, yy - 90]], 1.6, mixCol(P.pale, P.sea, .3), 'ink', 0);
      const probe = t > tProbes + i * .15 ? Math.sin((t - tProbes) * 12 + i) : 0, isPry = i === 0 && t > tExp - .2 && t < pry + .3;
      agent(ax, yy, 10, { ...feel(i === 2 ? 'mischief' : 'determined', t + i * .3), view: i === 2 ? 'front' : 'q', flip: i === 1, lookX: i === 1 ? -1 : 1, aL: isPry ? lerp(.2, 1.3, seg(t, tExp - .2, pry)) : .3 + .4 * probe, noShadow: k < .95, boilKey: 'ag' + i,
        armL: i === 1 ? (u, sw) => { paint(ellPts(1.4 * u, 0, 1.1 * u, 1.1 * u, 12), { wash: P.pale, fillOp: 0, ink: PAL.ink, sw: sw * 1.2 }); paint(ribbon([[-.4 * u, 0], [.4 * u, 0]], .3 * u, .3 * u), { wash: WOOD, ink: null }); } : i === 0 ? (u, sw) => paint(ribbon([[0, 0], [2.4 * u, -.4 * u]], .4 * u, .3 * u), { wash: STEELDK, ink: PAL.ink, sw: sw * .6 }) : null });
    });
    const at = toScreen(lerp(SX - SW / 2, nx + 110, .5), FY - 330);
    camEnd();
    sheetBorder();
    seamIn('splash', lt, { cx: W * .5, cy: H * .5, cols: [P.ochre, P.sea, P.teal], seed: 4 });
    seamOut('iris', lt, dur, { cx: at[0], cy: at[1], col: P.night });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 5. Tests and the pipeline: a card breaks unseen; Clawd paints blindfolded; the lamps give him eyes; then the
  // Navigator steps back into her armchair while a pipeline of agents sorts the feedback and she falls asleep.
  function netShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tChange = Q('net', 'change'), tBroke = Q('net', 'broke'), tWithout = Q('net', 'without'), tBlind = Q('net', 'blindfolded'), tGive = Q('net', 'give'), tEyes = Q('net', 'eyes');
    const tGreen = Q('net', 'green'), tRed = Q('net', 'red'), tPush = Q('net', 'push'), tStep = Q('net', 'step'), tPipe = Q('net', 'pipeline'), tMessy = Q('net', 'messy');
    const tSorts = Q('net', 'sorts'), tFiles = Q('net', 'files'), tSleep = Q('net', 'sleep');
    cam(t, [[t0, [960, 560, 1.25]], [tBroke, [990, 560, 1.22]], [tBlind, [940, 580, 1.28]], [tGreen, [960, 540, 1.26]], [tPush + .3, [960, 560, 1.2]], [tStep + .3, [1250, 580, 1.08]], [tPipe + .5, [2200, 560, .98]], [tFiles + .4, [2210, 560, .98]], [tEnd, [2050, 600, 1.03]]]);
    room(t, [-300, 3400], { warm: .3, warmAt: [[1000, 400, 500]] });
    helm(2270, 200, 75, { lit: litAt(t), key: 'nh', dims: false });
    // the board with its five cards and five lamps above
    const AX = 640, AY = 230, AW = 680, AH = 360;
    bg('nbd', rectPts(AX, AY, AW, AH, 1), { wash: mixCol(P.deep, P.teal, .5), fill: P.night, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    // blindfold splotches on the wall (and one on the board)
    [[AX - 90, 330], [AX + AW + 60, 420], [AX + 300, AY - 60], [AX - 40, 560]].forEach(([x, y], i) => { const k = seg(t, tBlind + .15 + i * .22, tBlind + .35 + i * .22); if (k > 0) bg('splot' + i, blobPts(x, y, 34 * backOut(k), i + 7, .35, 14), { wash: [P.rose, P.ochre, P.sea, P.rose][i], fill: PAL.ink, fillOp: 30, ink: null }); });
    const fall0 = tBroke - .05, fall1 = fall0 + .55, fix0 = tRed + .5, fix1 = tRed + 1.3;
    for (let i = 0; i < 5; i++) {
      const cxp = AX + 30 + i * 128, cyp = AY + 70 + (i % 2) * 40;
      let x = cxp, y = cyp, rot = 0;
      if (i === 0) rot = .05 * spring(t, tChange + .1, 5, 16) * 3;
      if (i === 4) {
        if (t > fall0 && t < fix0) { const k = seg(t, fall0, fall1); rot = lerp(0, 1.4, easeIn(k)); y = lerp(cyp, FY - 150, easeIn(k)); x = cxp + 60 * k; }
        else if (t >= fix0 && t < fix1) { const k = ease(seg(t, fix0, fix1)); const p = arcPt([cxp + 60, FY - 150], [cxp, cyp], 120, k); x = p[0]; y = p[1]; rot = lerp(1.4, 0, k); }
      }
      card(x, y, 110, 150, i, { border: [P.ochre, P.sea, P.rose, P.ochreLt, P.sap][i], rot, key: 'nc' + i });
      const lk = seg(t, tEyes + .1 + i * .08, tEyes + .3 + i * .08), gk = seg(t, tGreen - .1 + i * .1, tGreen + .1 + i * .1);
      const red = i === 4 && t > tRed - .1 && t < fix1 + .1, rip = t > tPush + .05 ? Math.max(0, Math.sin(Math.PI * seg(t, tPush + .05 + i * .06, tPush + .3 + i * .06))) : 0;
      lamp(cxp + 55, AY - 36, 16, red ? RED : mixCol(P.pale, GREEN, gk), lk * (.6 + .4 * gk) + .5 * rip, 'lamp' + i);
    }
    // the big button on its pedestal
    const pressK = Math.sin(Math.PI * seg(t, tPush - .2, tPush + .15));
    bg('pedestal', rectPts(430, FY - 170, 70, 170, 1), { wash: STEEL, fill: STEELDK, fillOp: 60, ink: PAL.ink, sw: .9 });
    bg('button', ellPts(465, FY - 180 + 8 * pressK, 34, 14, 14), { wash: GREEN, ink: PAL.ink, sw: .9 });
    // the pipeline, to the right
    const HX = 1860;
    bg('hopper', [[HX - 110, 300], [HX + 110, 300], [HX + 40, 440], [HX - 40, 440]], { wash: STEEL, fill: STEELDK, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    bg('pipe', ribbon([[HX, 440], [HX, 520], [2700, 520]], 50, 50), { wash: mixCol(STEEL, P.sea, .15), fill: STEELDK, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    const running = seg(t, tPipe - .3, tPipe + .2);
    [2130, 2440].forEach((sx, j) => {
      bg('stn' + j, rrPts(sx - 110, 330, 220, 200, 14), { wash: STEEL, fill: STEELDK, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
      bg('stnw' + j, rrPts(sx - 80, 360, 160, 110, 10), { wash: mixCol(SCREEN, '#3b2a0c', running), ink: PAL.ink, sw: .8 });
      if (running > 0) { boilSeed('stng' + j); glow(sx, 415, 110, P.ochre, .45 * running); }
      clawd(sx, 468, 8, { ...feel(j ? 'determined' : 'thinking', t + j), view: 'front', noShadow: true, noLegs: true, aL: .3 + .4 * Math.sin(t * 14 + j), aR: .3 - .4 * Math.sin(t * 13 + j), boilKey: 'stc' + j });
      boilSeed('gear' + j); push(); translate(sx + 90, 318); rotate((t - tPipe) * 2 * running * (j ? -1 : 1)); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([[Math.cos(a) * 18, Math.sin(a) * 18], [Math.cos(a) * 28, Math.sin(a) * 28]], 5, P.ochreDk, 'ink', 0); } paint(ellPts(0, 0, 20, 20, 12), { wash: P.ochre, ink: PAL.ink, sw: .7 }); pop();
    });
    // crumpled feedback tumbles in; sorted cards drop into three bins; the file drawer closes
    for (let i = 0; i < 5; i++) { const k = seg(t, tMessy - .3 + i * .18, tMessy + .3 + i * .18); if (k <= 0 || k >= 1) continue; const p = arcPt([HX - 260 + i * 40, 0], [HX, 420], 60, easeIn(k)); boilSeed('crump' + i); paint(blobPts(p[0], p[1], 26, i + 3, .35, 12), { wash: P.pale, fill: P.sea, fillOp: 40, tex: .6, ink: PAL.ink, sw: .8 }); inkLine([[p[0] - 12, p[1] - 6], [p[0] + 4, p[1] + 8], [p[0] + 14, p[1] - 4]], .8, P.deep, 'inkfine', .5); }
    const bins = [2560, 2700, 2840], BC = [P.ochre, P.sea, P.rose];
    for (let i = 0; i < 6; i++) { const k = seg(t, tSorts - .1 + i * .15, tSorts + .35 + i * .15); if (k <= 0) continue; const b = i % 3, p = arcPt([2700, 540], [bins[b], FY - 120 - (Math.floor(i / 3)) * 16], 80, easeIn(k)); bg('sc' + i, rectPts(p[0] - 30, p[1] - 20, 60, 40, 1), { wash: BC[b], ink: PAL.ink, sw: .7 }); }
    bins.forEach((bx, i) => bg('bin' + i, [[bx - 62, FY - 150], [bx + 62, FY - 150], [bx + 52, FY], [bx - 52, FY]], { wash: mixCol(STEEL, BC[i], .25), fill: STEELDK, fillOp: 50, tex: .5, ink: PAL.ink, sw: .9 }));
    const dk = seg(t, tFiles + .1, tFiles + .45), dOut = 1 - dk;
    bg('cab', rectPts(2990, FY - 330, 170, 330, 1), { wash: STEEL, fill: STEELDK, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    bg('drawer', rectPts(2990 - 110 * dOut, FY - 300, 170, 90, 1), { wash: mixCol(STEEL, P.pale, .15), ink: PAL.ink, sw: .9 });
    bg('drawerh', rrPts(2990 - 110 * dOut + 60, FY - 262, 50, 14, 6), { wash: P.ochre, ink: PAL.ink, sw: .6 });
    bg('drawer2', rectPts(2990, FY - 190, 170, 90, 1), { wash: mixCol(STEEL, P.pale, .1), ink: PAL.ink, sw: .9 });
    // the window above the armchair, the armchair, her mug
    const CHX = 1560;
    harbourWindow(t, CHX, 330, 200, 300, 'nw', { lights: .6, moon: seg(t, tLoop(), tSleep) });
    function tLoop() { return Q('net', 'loop'); }
    armchair(CHX, FY, 20, 'nac');
    // the Navigator
    const sit0 = tStep - .1, walk1 = tStep + 1.0, nx = t < sit0 ? 560 : lerp(560, CHX - 10, ease(seg(t, sit0, walk1)));
    const seated = t > walk1;
    const nMood = navMood(t, [[0, 'neutral', { lookX: .8, lookY: -.3 }], [tChange - .1, 'happy', { lookX: .8, lookY: -.3 }], [tWithout, 'neutral', { lookX: 1 }], [tBlind + .2, 'worried', { lookX: 1 }], [tGive - .2, 'determined'],
      [tGreen, 'happy', { lookY: -.8 }], [tRed, 'surprised', { lookY: -.8, lookX: 1 }], [tRed + 1.2, 'relieved'], [tPush - .3, 'determined'], [tStep, 'happy'], [tMessy, 'relieved', { emote: null }], [tSleep - .8, 'sleepy']]);
    let no = { view: 'q', seed: 5 };
    if (t > tChange - .2 && t < tChange + .3) no = { ...no, point: 'R', aR: .6 };
    if (t > tGive - .2 && t < tEyes + .3) no = { ...no, aR: lerp(-.3, 1.1, ease(seg(t, tGive - .2, tEyes))) };
    if (t > tPush - .35 && t < tPush + .2) no = { ...no, flip: true, aR: lerp(.2, -.4, ease(seg(t, tPush - .35, tPush))) };
    if (t > sit0 && !seated) no = { ...no, view: 'side', walk: (nx - 560) / 42 };
    if (seated) no = { ...no, view: 'front', sit: true, noShadow: true, aL: -1.0, aR: -.65, handR: (s, sw, up) => navProp('mug', s, sw, { up, steam: 1 - seg(t, tSleep - .8, tSleep) }) };
    nav(nx, FY, 20, { ...nMood, ...no });
    if (seated) armchairArms(CHX, FY, 20, 'nac');
    // Clawd: blindfolded painter, sees again, re-pins the card
    const cMood = emotions(t, [[0, 'happy', { lookX: -.6 }], [tBroke + .5, 'neutral'], [tBlind - .2, 'determined'], [tEyes + .1, 'surprised', { lookY: -1 }], [tGreen, 'happy', { lookY: -1 }], [tRed + .05, 'surprised', { lookY: -1, lookX: 1 }],
      [fix1, 'relieved'], [tPush, 'excited'], [tStep + .6, 'happy'], [tPipe + .3, 'starstruck', { lookX: 1 }], [tSleep - .5, 'sleepy']]);
    const blind = t > tWithout - .1 && t < tEyes;
    let cx = 1050, co = { view: 'front', flip: true };
    if (blind) co = { view: 'front', aL: .6 + .9 * Math.sin(t * 9), aR: .4 - .9 * Math.sin(t * 8), armR: brushHook(P.rose), rot: .08 * Math.sin(t * 5), dx: 1.2 * Math.sin(t * 2.3),
      draw: (u, sw) => { paint([[-5.3 * u, -7.1 * u], [5.3 * u, -7.1 * u], [5.3 * u, -5.2 * u], [-5.3 * u, -5.2 * u]], { wash: P.pale, fill: P.sea, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .8 }); for (const d of [-1, 1]) paint(ribbon([[5.2 * u, -6.2 * u], [6.9 * u, -5.4 * u + d * .5 * u + .4 * u * Math.sin(T * 7 + d)]], .8 * u, .4 * u), { wash: P.pale, ink: PAL.ink, sw: sw * .5 }); } };
    // the blindfold flies off
    const bfk = seg(t, tEyes - .05, tEyes + .6);
    if (t > fix0 - .4 && t < fix1 + .3) { const k = seg(t, fix0 - .4, fix0); cx = lerp(1050, 1250, ease(k)); co = { view: 'q', aL: t > fix0 ? 1.1 : .3 }; }
    else if (t > fix1 + .3) cx = 1250;
    if (t > tStep + .5) { const k = seg(t, tStep + .5, tPipe + .5); cx = lerp(1250, 1790, ease(k)); co = k < 1 ? { view: 'side', walk: (cx - 1250) / 60 } : { view: 'q', lookX: 1 }; }
    clawd(cx, FY, 20, { ...cMood, ...co, boilKey: 'cn' });
    if (bfk > 0 && bfk < 1) { const p = arcPt([1050, FY - 130], [700, -100], 200, bfk); push(); translate(p[0], p[1]); rotate(bfk * 8); bg('bfly', ribbon([[-60, 0], [0, -6], [60, 0]], 22, 16), { wash: P.pale, ink: PAL.ink, sw: .7 }); pop(); }
    camEnd();
    sheetBorder();
    seamIn('iris', lt, { cx: W * .5, cy: H * .6, col: P.night });
    seamOut('page', lt, dur, { col: mixCol(P.pale, P.sea, .2), dir: -1 });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 6. Your own SaaS: the blueprint of a little shop floods into paint; sign up, log in, payments, AI, tests; the plane
  // flies out this time; a high five; the wheel with nine handles lit.
  function saasShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tNine = Q('saas', '9'), tReal = Q('saas', 'real'), tProd = Q('saas', 'product'), tIdea = Q('saas', 'idea'), tLaunch = Q('saas', 'launch'), tDay = Q('saas', 'day');
    const tSign = Q('saas', 'sign'), tLog = Q('saas', 'log'), tPay = Q('saas', 'payments'), tAI = Q('saas', 'ai'), tTests = Q('saas', 'tests'), tLive = Q('saas', 'live');
    const tText = Q('saas', 'text'), tFriend = Q('saas', 'friend'), tCo = Q('saas', 'co'), tEvery = Q('saas', 'every'), tTog = Q('saas', 'together');
    cam(t, [[t0, [980, 560, 1.12]], [tReal + .6, [980, 570, 1.15]], [tSign - .3, [960, 600, 1.25]], [tTests + .3, [1000, 560, 1.18]], [tLive, [1420, 560, 1.12]], [tCo + .4, [1520, 620, 1.3]], [tEvery + .1, [1520, 600, 1.28]], [tTog, [1480, 450, 1.12]], [tEnd, [1480, 440, 1.15]]]);
    room(t, [-300, 2800], { warm: .3 + .5 * seg(t, tReal, tEvery), warmAt: [[1000, 500, 600], [1550, 250, 350]] });
    helm(1560, 220, 100, { lit: litAt(t), key: 'sh', dims: true, draw: 1 });
    // the room window: the sun crosses it "in a day"; the plane flies out through it
    const WX = 2150, WY = 400;
    const sun = seg(t, tLaunch - .2, tDay + .6);
    harbourWindow(t, WX, WY, 330, 420, 'sw', { day: Math.sin(Math.PI * sun) * .9, sun: sun > 0 && sun < 1 ? sun : null, lights: .4 + .6 * seg(t, tFriend, tFriend + 1), open: seg(t, tLive - .2, tLive + .2) });
    // the shop: line work on the wall, flooded with paint on "real"
    const S0 = 560, S1 = 1320, ST = 250, fk = t < tReal - .05 ? 0 : 1, pk = k => backOut(seg(t, tReal - .05 + k * .12, tReal + .3 + k * .12));
    const lc = mixCol(P.sea, P.deep, 0);
    if (fk) {
      const a = pk(0), b = pk(1), c = pk(2), d = pk(3), e = pk(4);
      if (a > .02) bg('shwall', rectPts(S0, lerp(FY, ST + 120, a), S1 - S0, (FY - ST - 120) * a, 1), { wash: mixCol(P.pale, P.ochreLt, .3), fill: P.ochreLt, fillOp: 60, tex: .6, border: .5, ink: PAL.ink, sw: 1 });
      if (b > .02) bg('shsign', rectPts(S0 + 60, ST + 120 - 70 * b, S1 - S0 - 120, 70 * b, 1), { wash: P.deep, fill: P.night, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
      if (b > .6) helm(S0 + (S1 - S0) / 2, ST + 85, 22, { real: 1, rot: t * .5, key: 'shlogo' });
      if (c > .02) { for (let i = 0; i < 7; i++) bg('awn' + i, [[S0 - 20 + i * (S1 - S0 + 40) / 7, ST + 130], [S0 - 20 + (i + 1) * (S1 - S0 + 40) / 7, ST + 130], [S0 - 20 + (i + 1) * (S1 - S0 + 40) / 7, ST + 130 + 90 * c], [S0 - 20 + (i + .5) * (S1 - S0 + 40) / 7, ST + 150 + 90 * c], [S0 - 20 + i * (S1 - S0 + 40) / 7, ST + 130 + 90 * c]], { wash: i % 2 ? P.pale : P.ochre, ink: PAL.ink, sw: .8 }); }
      if (d > .02) {
        bg('shwin', rectPts(S0 + 50, 470, 380 * d, 280, 1), { wash: mixCol(P.teal, P.deep, .2), fill: P.night, fillOp: 40, tex: .4, ink: PAL.ink, sw: 1 });
        bg('shsill', rectPts(S0 + 40, 750, 400 * d, 16, 1), { wash: WOODLT, ink: PAL.ink, sw: .8 });
      }
      if (e > .02) bg('shdoorf', rectPts(1030, 540, 210, FY - 540, 1), { wash: WOODDK, ink: PAL.ink, sw: 1 });
    }
    if (!fk || pk(4) < 1) {
      const oc = mixCol(P.sea, P.deep, fk ? seg(t, tReal, tReal + .8) : 0);
      traceRect(S0, ST + 120, S1 - S0, FY - ST - 120, 1, oc, 1.4, 'sho1'); traceRect(S0 + 60, ST + 50, S1 - S0 - 120, 70, 1, oc, 1.2, 'sho2');
      traceRect(S0 + 50, 470, 380, 280, 1, oc, 1.2, 'sho3'); traceRect(1030, 540, 210, FY - 540, 1, oc, 1.2, 'sho4');
      boilSeed('shdim'); dash([S0, ST - 20], [S1, ST - 20], oc, 1, 16); inkLine([[S0, ST - 40], [S0, ST]], 1, oc, 'inkfine', 0); inkLine([[S1, ST - 40], [S1, ST]], 1, oc, 'inkfine', 0);
    }
    if (fk) {
      // inside the window: a till (payments) and a lamp (the AI feature)
      const tillK = backOut(seg(t, tReal + .6, tReal + 1));
      if (tillK > .02) { bg('till', rrPts(S0 + 90, 750 - 110 * tillK, 150, 110 * tillK, 10), { wash: P.ochreDk, fill: WOODDK, fillOp: 50, ink: PAL.ink, sw: .9 }); bg('tillscr', rectPts(S0 + 110, 750 - 100 * tillK, 110, 34 * tillK, 1), { wash: mixCol(SCREEN, P.ochre, seg(t, tPay + .3, tPay + .5)), ink: PAL.ink, sw: .6 }); }
      const coinK = seg(t, tPay - .2, tPay + .3);
      if (coinK > 0 && coinK < 1) { const p = arcPt([S0 + 300, 420], [S0 + 165, 650], 80, easeIn(coinK)); bg('coin', ellPts(p[0], p[1], 16 * Math.abs(Math.cos(coinK * 12)) + 3, 16, 12), { wash: P.ochreLt, ink: PAL.ink, sw: .7 }); }
      if (t > tPay + .3 && t < tPay + 1.2) { boilSeed('ching'); emote('spark', S0 + 250, 600, 20, seg(t, tPay + .3, tPay + .5), t - tPay); }
      const aiK = seg(t, tAI - .1, tAI + .3);
      bg('lampcord', [[S0 + 340, 470], [S0 + 342, 470], [S0 + 342, 540], [S0 + 340, 540]], { wash: PAL.ink, ink: PAL.ink, sw: 1 });
      if (aiK > 0) { boilSeed('aiglow'); glow(S0 + 340, 575, 150 * aiK, P.ochre, .9 * aiK); }
      bg('lampsh', [[S0 + 300, 575], [S0 + 380, 575], [S0 + 360, 540], [S0 + 320, 540]], { wash: mixCol(STEELDK, P.ochreLt, aiK), ink: PAL.ink, sw: .8 });
      if (aiK > .5) { boilSeed('aisp'); emote('spark', S0 + 390, 520, 16, seg(t, tAI + .1, tAI + .3), t - tAI); }
      // test lamps along the awning
      for (let i = 0; i < 7; i++) { const k = seg(t, tTests - .1 + i * .07, tTests + .1 + i * .07); if (k > 0) { const x = S0 + 20 + i * (S1 - S0 - 40) / 6, y = ST + 245; boilSeed('awl' + i); glow(x, y, 30 * k, GREEN, .8 * k); paint(ellPts(x, y, 9, 9, 10), { wash: mixCol(STEELDK, GREEN, k), ink: PAL.ink, sw: .5 }); } }
      // the door: opens for the visitor on "sign up"; a key turns on "log in"
      const open = seg(t, tSign - .3, tSign) * (1 - seg(t, tLog + .6, tLog + 1));
      const vk = seg(t, tSign - .35, tSign + .9);
      if (vk > 0 && vk < 1) visitor(lerp(1450, 1135, ease(vk)), FY, 13, { ...navFeel('happy', t), view: 'side', flip: true, walk: vk * 6, boilKey: 'vis' });
      bg('door', rectPts(1045, 555, 180 * (1 - .8 * open), FY - 555, 1), { wash: WOOD, fill: WOODDK, fillOp: 60, tex: .6, ink: PAL.ink, sw: .9 });
      if (open < .5) { bg('doorwin', rectPts(1070, 585, 130, 110, 1), { wash: mixCol(P.teal, P.ochreLt, aiK * .3), ink: PAL.ink, sw: .7 }); }
      const kk = seg(t, tLog - .2, tLog + .2);
      if (kk > 0 && t < tLog + 1.2 && open < .2) { push(); translate(1200, 740); rotate(Math.PI / 2 * ease(seg(t, tLog, tLog + .3))); bg('skey', ribbon([[0, 0], [-46, 0]], 7, 7), { wash: P.ochreLt, ink: PAL.ink, sw: .7 }); bg('skeyb', ellPts(-54, 0, 13, 13, 10), { wash: P.ochreLt, ink: PAL.ink, sw: .7 }); pop(); }
      if (vk >= 1 && t < tLog + .8 && open > .5) { boilSeed('visin'); }
    }
    // the Navigator: idea, watches the day go by, folds and throws the plane, high-fives Clawd
    const nx = 1500;
    const nMood = navMood(t, [[0, 'neutral', { lookX: -1, lookY: -.3 }], [tReal, 'surprised', { lookX: -1, lookY: -.4 }], [tIdea - .2, 'idea', { flip: false }], [tDay, 'happy', { lookX: 1 }], [tSign - .3, 'happy', { lookX: -1 }],
      [tLive - .3, 'determined', { lookX: 1, lookY: -.3 }], [tFriend + .3, 'proud'], [tCo - .3, 'laugh'], [tEvery, 'happy', { lookY: -1 }]]);
    const thr = seg(t, tText - .5, tText - .1);
    let no = { view: 'q', seed: 7, flip: t < tIdea - .2 || (t > tSign - .4 && t < tLive - .4) };
    if (t > tLive - .6 && t < tText + .2) no = { ...no, flip: false, aR: t < tText - .5 ? -.6 : lerp(-.6, 1.1, easeIn(thr)), handR: t < tText - .1 ? (s, sw, up) => plane(1.4 * s, -.3 * s, .8, up - .2, 'splh') : null };
    const hf = Math.sin(Math.PI * seg(t, tCo - .3, tCo + .5));
    if (hf > 0) no = { ...no, flip: false, aR: lerp(-.8, 1.35, hf) };
    nav(nx, FY, 20, { ...nMood, ...no });
    const fk2 = seg(t, tText - .1, tFriend + .6);
    if (fk2 > 0 && fk2 < 1) { const h = [nx + 31 + 65 * Math.cos(1.1), FY - 154 - 65 * Math.sin(1.1)], p = arcPt(h, [WX + 300, WY - 40], 200, ease(fk2)), q = arcPt(h, [WX + 300, WY - 40], 200, ease(fk2) + .01); plane(p[0], p[1], .9 * (1 - .6 * fk2), Math.atan2(q[1] - p[1], q[0] - p[0]), 'splane'); }
    if (hf > .85) { boilSeed('hi5'); emote('spark', nx + 120, FY - 260, 26, seg(t, tCo, tCo + .15), t - tCo); }
    // Clawd
    const cMood = emotions(t, [[0, 'happy', { lookX: -1 }], [tReal, 'starstruck', { lookX: -1 }], [tSign, 'excited', { lookX: -1 }], [tPay + .2, 'love'], [tAI, 'surprised'], [tTests + .2, 'proud'], [tLive, 'happy', { lookX: 1 }], [tCo - .3, 'excited'], [tEvery + .3, 'proud', { lookY: -1 }]]);
    const cx = 1760, hop = jump(t, tCo - .35, tCo + .35, 2.2);
    clawd(cx, FY, 20, { ...cMood, flip: true, view: 'q', dy: (cMood.dy || 0) + hop.dy, sq: (cMood.sq || 0) + hop.sq, aL: hf > 0 ? lerp(.2, 1.3, hf) : .2, boilKey: 'cs' });
    const at = toScreen(1560, 220);
    camEnd();
    sheetBorder();
    seamIn('page', lt, { col: mixCol(P.pale, P.sea, .2), dir: -1 });
    seamOut('splash', lt, dur, { cx: at[0], cy: at[1], cols: [P.ochre, P.sea, P.teal], seed: 9 });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 7. Captain's log: the book turns around; she writes her own orders and pins them on the terminal; Clawd obeys (and
  // doesn't touch the red box); the tenth handle lights, the wheel becomes real and comes down; she takes the helm.
  function logShot(t, lt, dur) {
    const t0 = t - lt, tEnd = t0 + dur;
    const tTurns = Q('log', 'turns'), tNineL = Q('log', 'nine'), tFollowed = Q('log', 'followed'), tNow = Q('log', 'now'), tWrite = Q('log', 'write'), tClaw = Q('log', 'claw');
    const tFile = Q('log', 'file'), tHow = Q('log', 'how'), tMatters = Q('log', 'matters'), tNot = Q('log', 'not'), tTouch = Q('log', 'touch'), tWalked = Q('log', 'walked');
    const tPass = Q('log', 'passenger'), tLeave = Q('log', 'leave'), tCapt = Q('log', 'captain'), tOpen = Q('log', 'open'), tStart = Q('log', 'start');
    cam(t, [[t0, [1060, 640, 1.35]], [tWrite, [990, 640, 1.42]], [tFile + .3, [1200, 630, 1.3]], [tTouch + .3, [1300, 640, 1.3]], [tWalked + .1, [1020, 520, 1.12]], [tPass + .6, [860, 480, 1.05]],
      [tCapt + .2, [760, 560, 1.22]], [tStart + .3, [820, 540, 1.16]], [tEnd, [850, 520, 1.1]]]);
    room(t, [-500, 2600], { warm: .4 + .6 * seg(t, tPass, tCapt), warmAt: [[1000, 700, 420], [450, 450, 520], [1100, 250, 380]] });
    // the window: harbour lights slide by once she turns the wheel
    const sail = ease(seg(t, tOpen, tEnd + 2)) * 600;
    harbourWindow(t, 1780, 380, 320, 420, 'lw', { lights: 1, slide: sail });
    // the wheel: on the wall; the tenth handle lights, it floods with paint, lifts off and settles on a pedestal
    const realK = seg(t, tPass - .05, tPass + .7), mv = ease(seg(t, tPass + .6, tLeave + .1));
    const hx = lerp(1080, 420, mv), hy = lerp(352, 560, mv) - 120 * Math.sin(Math.PI * mv), hr = lerp(104, 140, mv);
    const spin = ease(seg(t, tOpen, tStart + .8)) * -1.4 + .04 * Math.sin(t * 1.3) * seg(t, tCapt, tCapt + .5);
    const pedK = backOut(seg(t, tPass + .4, tPass + .9));
    if (pedK > .02) { bg('ped', rectPts(420 - 28, FY - 330 * pedK, 56, 330 * pedK, 1), { wash: WOOD, fill: WOODDK, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 }); bg('pedb', rectPts(420 - 70, FY - 30, 140, 30, 1), { wash: WOODDK, ink: PAL.ink, sw: .9 }); }
    helm(hx, hy, hr, { lit: litAt(t), real: realK, rot: spin, dims: mv < .05, draw: 1, glow: .25 * realK, key: 'lgh' });
    if (realK > 0 && realK < 1) { boilSeed('lflood'); glow(hx, hy, hr * 2, P.ochreLt, .6 * Math.sin(Math.PI * realK)); }
    // the table, the terminal, the book, the red-roped box
    table(680, 1400, 'lt');
    const bright = 1 + 1.2 * Math.sin(Math.PI * seg(t, tOpen, tStart + .6));
    terminal(t, 1040, TT, 1, { on: 1, lines: 2 + 3 * seg(t, tOpen, tStart + .5), bright, key: 'lt' });
    keyboard(890, TT, 1, 'lkb', false);
    // the book: flips round (its back is blank); nine instruction pages flutter out of it
    const flipK = seg(t, tTurns - .1, tTurns + .5), fs = Math.cos(flipK * Math.PI);
    book(1275, TT, { open: 1, flip: fs, key: 'lb' });
    for (let i = 0; i < 9; i++) {
      const k = seg(t, tNineL - .1 + i * .18, tNineL + 1.2 + i * .18); if (k <= 0 || k >= 1) continue;
      const p = arcPt([1275, TT - 90], [1275 + 500 + 140 * hash(i), -200], 260 + 80 * hash(i * 2), easeIn(k));
      slip(p[0], p[1], 60, 44, k * 5 + i, [1, 1, 1], 'lpg' + i, { lw: .9 });
    }
    // her orders: a sheet written on the table, then pinned on the terminal
    const writing = t > tWrite - .1 && t < tClaw + .2;
    const pin = seg(t, tFile - .2, tFile + .3);
    const lines = [seg(t, tWrite, tWrite + .5), seg(t, tWrite + .45, tWrite + .9), seg(t, tWrite + .85, tWrite + 1.3), seg(t, tWrite + 1.25, tWrite + 1.6)];
    const hl = [0, seg(t, tMatters - .1, tMatters + .2) * (1 - seg(t, tMatters + 1, tMatters + 1.4)), 0, seg(t, tTouch - .3, tTouch) * (1 - seg(t, tTouch + 1.2, tTouch + 1.5))];
    if (t > tNow - .2) {
      const a = [930, TT - 30], b = [1040, TT - 26 - 150 - 30], p = arcPt(a, b, 60, ease(pin));
      slip(p[0], p[1], lerp(130, 150, pin), lerp(90, 110, pin), lerp(-.04, .03, pin), lines, 'lorders', { lw: 1.4, hl, hlCol: [0, P.ochre, 0, RED], glowK: .15 * seg(t, tFile, tFile + .4) });
      if (pin >= 1) { boilSeed('lopin'); paint(ellPts(b[0], b[1] - 44, 8, 8, 8), { wash: P.rose, ink: PAL.ink, sw: .6 }); }
    }
    // the red-roped box at the table's end
    const BXX = 1760;
    for (const px of [BXX - 110, BXX + 110]) { bg('rpost' + px, rectPts(px - 7, FY - 150, 14, 150, 1), { wash: P.ochreDk, ink: PAL.ink, sw: .7 }); bg('rpk' + px, ellPts(px, FY - 154, 12, 12, 10), { wash: P.ochre, ink: PAL.ink, sw: .6 }); }
    boilSeed('rrope'); inkLine(through([[BXX - 110, FY - 140], [BXX, FY - 100], [BXX + 110, FY - 140]]), 5, RED, 'ink', .5);
    bg('rbox', rectPts(BXX - 60, FY - 110, 120, 110, 1), { wash: '#6E3030', fill: '#4A1E1E', fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
    bg('rbtn', ellPts(BXX, FY - 118, 26, 10, 12), { wash: RED, ink: PAL.ink, sw: .7 });
    // the Navigator
    const toWheel0 = tLeave - .3, toWheel1 = tCapt - .1, nx = lerp(760, 590, ease(seg(t, toWheel0, toWheel1)));
    const capK = seg(t, tCapt - .1, tCapt + .25);
    const nMood = navMood(t, [[0, 'neutral', { lookX: .8, lookY: .2 }], [tTurns, 'surprised', { lookX: 1 }], [tNineL, 'thinking', { lookX: 1, lookY: -.6 }], [tNow - .2, 'determined', { lookX: .8, lookY: .6 }],
      [tFile, 'proud'], [tMatters, 'determined', { lookX: 1 }], [tTouch - .2, 'stern', { lookX: 1 }], [tTouch + .6, 'laugh'], [tWalked - .1, 'surprised', { lookX: -.6, lookY: -1, view: 'q', flip: true }],
      [tPass + .5, 'happy', { flip: true, lookY: -.3 }], [tCapt + .2, 'proud', { flip: true }], [tOpen, 'determined', { flip: true }], [tStart, 'happy', { flip: true }]]);
    let no = { view: 'q', seed: 2 };
    if (writing) no = { ...no, aR: -.55 + .06 * Math.sin(t * 22), handR: penHook };
    if (t > tTouch - .3 && t < tTouch + .4) no = { ...no, point: 'R', aR: .3 };
    if (t > toWheel0 && t < toWheel1) no = { ...no, view: 'side', flip: true, walk: (760 - nx) / 42 };
    if (t >= toWheel1) no = { ...no, view: 'q', flip: true, aR: .55 + .12 * Math.sin((t - tOpen) * 3) * seg(t, tOpen, tOpen + .3), aL: .75 };
    if (t > tWalked - .1 && t < toWheel0) no = { ...no, flip: true };
    nav(nx, FY, 20, { ...nMood, ...no, draw: capK > 0 ? (s, sw) => captainCap(s, sw, 'q', 1 - easeIn(capK)) : null });
    if (capK > 0 && capK < 1) { boilSeed('capspark'); }
    // Clawd on the table: reads, salutes, reaches for the box and snatches his claw back, salutes the captain
    const cMood = emotions(t, [[0, 'happy', { lookX: -.8 }], [tTurns, 'surprised', { lookX: -.4 }], [tNineL, 'neutral', { lookY: -1, lookX: .6 }], [tWrite, 'thinking', { lookX: -1, lookY: .3 }], [tFile + .3, 'thinking', { lookX: -.8, lookY: -.3 }],
      [tHow, 'proud'], [tNot - .1, 'mischief', { lookX: 1 }], [tTouch + .1, 'scared', { lookX: -1 }], [tWalked, 'surprised', { lookX: -1, lookY: -1 }], [tPass + .6, 'starstruck', { lookX: -1 }], [tCapt + .2, 'proud', { lookX: -1 }]]);
    const salute = (t > tHow - .1 && t < tHow + .8) || (t > tCapt + .2);
    const reach = Math.sin(Math.PI * seg(t, tNot - .2, tTouch + .3));
    clawd(1500, FY, 21, { ...cMood, view: 'q', flip: reach > .05 ? false : true, aL: reach > .05 ? lerp(.1, .45, reach) - (t > tTouch ? .9 * seg(t, tTouch, tTouch + .15) : 0) : (salute ? 1.35 : .2), dx: reach * 2.2 - (t > tTouch ? 1.2 * seg(t, tTouch, tTouch + .2) * reach : 0), boilKey: 'clg' });
    camEnd();
    sheetBorder();
    seamIn('splash', lt, { cx: W * .5, cy: H * .45, cols: [P.ochre, P.sea, P.teal], seed: 9 });
    seamOut('wipe', lt, dur, { cols: [P.ochre, P.sea] });
  }

  // ---------------------------------------------------------------------------------------------------------------
  // 8. End card: the real wheel turning on the blueprint sheet, the series line and the site.
  function endShot(t, lt, dur) {
    camBegin(960, 540 + 8 * Math.sin(lt * .6), 1.03 - .03 * ease(seg(lt, 0, dur)));
    VIEW = { x0: -100, x1: W + 100, y0: -100, y1: H + 100 };
    room(t, [-300, 2300], { warm: .6, warmAt: [[960, 1000, 520]] });
    bg('endfloor', rectPts(-300, FY - 4, 2600, 600), { wash: P.deep, fill: mixCol(P.deep, P.teal, .7), fillOp: 110, bleed: .2, tex: .6, border: .5, ink: null });
    helm(960, 1010, 290, { real: 1, rot: lt * .22 + .03 * Math.sin(lt * 1.3), glow: .25, key: 'endh' });
    const nk = backOut(seg(lt, .6, 1.05)), ck = backOut(seg(lt, .8, 1.25)), wv = lt - 1.05;
    nav(400, 990 + 620 * (1 - nk), 23, { ...navFeel('happy', t), aL: -1.25, aR: lt > 1.05 ? lerp(-1.2, .95 + .35 * Math.sin(wv * 11), ease(seg(wv, 0, .25))) : -1.2, eyes: 'happy', mouth: 'grin', noShadow: nk < .95, draw: (s, sw) => captainCap(s, sw, 'front') });
    const hop = jump((lt - 1.25) % .9, .15, .6, 2.2);
    clawd(1530, 990 + 620 * (1 - ck), 29, { ...feel('excited', t), flip: true, dy: lt > 1.25 ? hop.dy : 0, sq: lt > 1.25 ? hop.sq : 0, emote: 'spark', emoteK: seg(lt, 1.35, 1.65), noShadow: ck < .95 });
    camEnd();
    sheetBorder();
    crewText([
      { txt: SERIES, x: 960, y: 250, size: 30, col: P.sea, weight: 600, spacing: .3, k: seg(lt, .3, .8) },
      { txt: 'theagenticcrew.com', x: 960, y: 395, size: 104, col: P.pale, italic: true, weight: 300, k: seg(lt, .5, 1.2) },
    ]);
    seamIn('wipe', lt, { cols: [P.ochre, P.sea] });
    if (lt > dur - .75) { boilSeed('endiris'); _inkIris(.5 * seg(lt, dur - .75, dur - .05), { cx: 960, cy: 1000, col: P.night }); }
  }

  shots([[0, identShot], [shotAt('hook'), hookShot], [shotAt('bench'), benchShot], [shotAt('build'), buildShot], [shotAt('live'), liveShot],
    [shotAt('net'), netShot], [shotAt('saas'), saasShot], [shotAt('log'), logShot], [B.log.end + .9, endShot]]);
})();
