// agent.js: the series' own agent, replacing the engine's Clawd in every crew film. Loaded after ../common.js and
// before the film's scene.js. Pick the design with AGENT_DESIGN below; model sheet: docs/agent.jpg (?loop=agent).
//
// ── Who it is ──────────────────────────────────────────────────────────────────────────────────────────────────────
//   FOLIO (the default): a paper boat folded from the instructions it was given. The instructions are still written on
//   its sail; its face is on the hull; a red pennant flies from the peak; two paper arms, two little legs in dark shoes.
//   Eager, literal, tireless, confidently wrong sometimes: it does exactly what's written on it. When it chomps (lid) the
//   sail and the folded rim hinge back like a jaw, with paper teeth.
//   Alternatives (same rig, same options): 'bob' a harbour buoy with a signal lamp (its lamp cap flips open to chomp),
//   'pip' a brass diving helmet with a porthole face, 'polly' a scarlet parrot. Concepts: docs/agent-concepts*.jpg.
//
// ── How to call it ─────────────────────────────────────────────────────────────────────────────────────────────────
//   agent(x, y, u, o)  (or clawd(x, y, u, o): this file replaces the engine's clawd(), so feel(), emotions(), move(),
//   dancer(), turn(), jump(), take() and every existing clawd() call draw the agent). (x, y) = the ground point between
//   the feet; u = size unit. Same size envelope as Clawd: the hull is ~10u wide (arms pivot at ±4.9u), its top is 6u up
//   and the face sits where Clawd's did (eyes -4.55u, mouth -3.3u), so it still clears desks and rails; the sail's peak
//   is 9.6u up (the pennant ~10.5u), and hats sit on the peak (a hard hat's top ~11.4u, like Clawd's).
//   Options are clawd()'s (see engine/ANIMATION_GUIDE.md "Clawd"):
//     pose:   dx, dy, sq, take, rot, flip, sx, sy, aL, aR, walk, noLegs, noShadow, view (front|q|side|qback|back),
//             smear + smearDir, swMul, boilKey
//     face:   eyes (every engine eye name, or a [left, right] pair), mouth (every engine mouth name), lookX, lookY,
//             squint, blush, gloom, seed, lid 0..1 (the chomp: front view only, like Clawd's lunchbox)
//     colour: tint + tintK, or col / dk / lt (the body's main / shadow / light colours). emotions() cross-fades them
//             smoothly (tintCols() is overridden to use the agent's palette, so there's no snap after a mood change).
//     extras: hat (head hats sit on the peak; face pieces mask / masq / cat whiskers map onto the face; bowtie sits at the
//             bottom of the face), emote + emoteK + emoteAge, draw(u, sw), armL(u, sw), armR(u, sw), lamp (bob / pip)
//   Hooks: the arms pivot exactly where Clawd's did ((±4.9u, -4.5u), 2.2u long; side view (1.6u, -4.2u)), so armL /
//   armR props and any code that computes Clawd's hand position still land in the hand. draw(u, sw) is called in
//   Clawd's body space mapped onto the agent's face: Clawd's eye centres (±2.5u, -6u) land on the agent's eyes (uniform
//   scale AGENT.hook.k), so a mask or glasses drawn for Clawd fits, and other props land near the same parts.
//   agentFace(u) gives that mapping ({ k, oy, eyeX, eyeY } in u) if a scene needs it.
//
// Sheets: LOOPS.agent (the chosen design: views, emotions, props, hats, chomp, tints, next to the Navigator; rendered
// to docs/agent.jpg) and LOOPS.agents (all four designs side by side).
const AGENT_DESIGN = 'folio';   // 'folio' | 'bob' | 'pip' | 'polly'

(() => {
  const P2 = (u, pts) => pts.map(([a, b]) => [a * u, b * u]);
  const DARK = '#4A1F2A';
  const edgeAt = (y, yT, xT, yB, xB) => lerp(xT, xB, (y - yT) / (yB - yT));   // x on a hull edge at height y

  // an egg: rx wider toward the bottom by `pear`
  function eggPts(cx, cy, rx, ry, pear = .1, n = 44, j = 0) {
    const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, s = Math.sin(a); p.push([cx + Math.cos(a) * rx * (1 + pear * s) + jit(j), cy + s * ry + jit(j)]); } return p;
  }
  // the slice of an egg between y0 and y1 (a stripe on a round body)
  function bandPts(cx, cy, rx, ry, y0, y1, pear = 0, n = 14) {
    const xAt = y => { const s = clamp((y - cy) / ry, -1, 1); return rx * (1 + pear * s) * Math.sqrt(Math.max(0, 1 - s * s)); };
    const R = [], L = [];
    for (let i = 0; i <= n; i++) { const y = lerp(y0, y1, i / n); R.push([cx + xAt(y), y]); L.push([cx - xAt(y), y]); }
    return R.concat(L.reverse());
  }

  // ---------------------------------------------------------------------------------------------------------------
  // eyes: round, dark and glinting. One eye around (0, 0); r = its radius in px; s = -1 left, 1 right
  function aEye(k, s, r, o, sw) {
    const lx = (o.lookX || 0) * r * .34, ly = (o.lookY || 0) * r * .3;
    const L = (pts, w = 1.15, c = .4) => inkLine(pts.map(([a, b]) => [a * r, b * r]), sw * w, PAL.ink, 'ink', c);
    const dot = (rx = .8, ry = 1, gl = true) => {
      paint(ellPts(lx, ly, r * rx, r * ry, 14), { wash: PAL.ink, ink: null });
      if (gl && r > 3.5) paint(ellPts(lx - .28 * r * rx, ly - .38 * r * ry, r * .27 * rx, r * .3 * ry, 8), { wash: PAL.cream, ink: null });
    };
    const blink = ['normal', 'look', 'dot', 'wide', 'shine'].includes(k) && ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
    if (blink) { L([[-.85, .15], [0, .3], [.85, .15]], 1.1, .4); return; }
    switch (k) {
      case 'wide':
        paint(ellPts(0, 0, r * 1.05, r * 1.22, 16), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
        paint(ellPts(lx * 1.3, ly * 1.3, r * .6, r * .72, 12), { wash: PAL.ink, ink: null });
        if (r > 3.5) paint(ellPts(lx * 1.3 - .2 * r, ly * 1.3 - .28 * r, r * .2, r * .22, 8), { wash: PAL.cream, ink: null });
        break;
      case 'happy': L([[-.9, .45], [0, -.5], [.9, .45]]); break;
      case 'closed': L([[-.9, -.15], [0, .4], [.9, -.15]]); break;
      case 'sleepy': paint(P2(r, [[-.8, 0], [.8, 0], [.6, .6], [0, .8], [-.6, .6]]), { wash: PAL.ink, ink: null, curv: .4 }); L([[-.95, 0], [.95, 0]], 1, 0); break;
      case 'narrow': paint(ellPts(lx, ly + .25 * r, r * .8, r * .5, 12), { wash: PAL.ink, ink: null }); L([[-1, -.25], [1, -.3]], 1, 0); break;
      case 'angry': case 'determined': {   // top edge slants down toward the middle
        const hi = k === 'angry' ? 1.0 : .7;
        paint(P2(r, [[-.8, s < 0 ? -1 : -1 + hi], [.8, s < 0 ? -1 + hi : -1], [.8, .55], [.35, 1], [-.35, 1], [-.8, .55]]).map(([a, b]) => [a + lx * .5, b]), { wash: PAL.ink, ink: null, curv: .3 });
        if (r > 3.5) paint(ellPts(-.2 * r + lx * .5, .2 * r, r * .2, r * .22, 8), { wash: PAL.cream, ink: null });
        break;
      }
      case 'sad': case 'teary': case 'cry': {   // top edge slants up toward the middle (worried)
        if (k === 'cry') L([[-.9, .3], [-.3, -.1], [.3, .1], [.9, -.2]].map(([a, b]) => [a * -s, b]), 1.2, .3);
        else {
          paint(P2(r, [[-.8, s < 0 ? -.2 : -1], [.8, s < 0 ? -1 : -.2], [.8, .55], [.35, 1], [-.35, 1], [-.8, .55]]), { wash: PAL.ink, ink: null, curv: .3 });
          if (r > 3.5) paint(ellPts(-.2 * r, .15 * r, r * .2, r * .22, 8), { wash: PAL.cream, ink: null });
        }
        if (k === 'teary') paint(ellPts(0, 1.15 * r + Math.sin(T * 9 + s) * .06 * r, .95 * r, .36 * r, 14), { wash: PAL.sky, washOp: 210, fill: '#FFFFFF', fillOp: 60, ink: PAL.ink, sw: sw * .4 });
        if (k === 'cry') {   // a stream down the face and drops flicking off
          const R = []; for (let q = 0; q <= 4; q++) R.push([(s * .45 + Math.sin(T * 8 + q * 1.3 + s) * .12 * q / 4) * r, (.5 + q * .55) * r]);
          paint(ribbon(R, .5 * r, .8 * r), { wash: PAL.sky, washOp: 230, fill: '#FFFFFF', fillOp: 70, ink: PAL.ink, sw: sw * .4 });
          const ph = frac(T * 1.8 + (s > 0 ? .5 : 0)), p = arcPt([s * .8 * r, .3 * r], [s * 3 * r, 1.6 * r], 1.4 * r, ph);
          paint(ellPts(p[0], p[1], .22 * r * (1 - ph * .5), .3 * r * (1 - ph * .5), 8), { wash: PAL.sky, ink: PAL.ink, sw: sw * .35 });
        }
        break;
      }
      case 'squeeze': L([[-.6 * -s, -.7], [.6 * -s, 0], [-.6 * -s, .7]], 1.2, 0); break;
      case 'shine': dot(1, 1.15, false);
        paint(ellPts(lx - .3 * r, ly - .4 * r, r * .32, r * .36, 8), { wash: PAL.cream, ink: null });
        paint(ellPts(lx + .3 * r, ly + .45 * r, r * .15, r * .15, 8), { wash: PAL.cream, ink: null }); break;
      case 'scared':
        paint(ellPts(0, 0, r * 1.05, r * 1.25, 16), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
        paint(ellPts((o.lookX || 0) * r * .3 + Math.sin(T * 40) * .06 * r, .1 * r, r * .32, r * .4, 10), { wash: PAL.ink, ink: null }); break;
      case 'blank': paint(ellPts(0, 0, r * .9, r * 1.1, 14), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 }); break;
      case 'spark':
        paint(ellPts(0, 0, r * 1.5, r * 1.5, 16), { fill: PAL.ochre, fillOp: 80, bleed: .3, ink: null });
        paint(starPts(0, 0, r * 1.4 * (1 + .12 * Math.sin(T * 14)), .4), { wash: PAL.cream, fill: PAL.ochre, fillOp: 90, ink: PAL.ink, sw: sw * .5 }); break;
      case 'heart': paint(heartPts(0, .1 * r, r * .95 * (1 + .1 * pulse(T))), { wash: '#E2476E', ink: PAL.ink, sw: sw * .5 }); break;
      case 'x': L([[-.8, -.8], [.8, .8]], 1, 0); L([[.8, -.8], [-.8, .8]], 1, 0); break;
      case 'swirl': {   // hypnotised: a turning spiral on a pale eye
        paint(ellPts(0, 0, r * 1.25, r * 1.35, 16), { wash: '#EFE6FA', ink: PAL.ink, sw: sw * .6 });
        const sp = []; for (let i = 0; i < 40; i++) { const a = i * .42 - T * 7 * s, rr = (.08 + i * .026) * r; sp.push([Math.cos(a) * rr, Math.sin(a) * rr * 1.08]); }
        inkLine(sp, Math.max(sw * .7, r * .1), '#4B2E7A', 'inkfine', .5); break;
      }
      case 'red':
        paint(ellPts(0, 0, r * 1.5, r * 1.5, 16), { fill: '#E0283F', fillOp: 110, bleed: .35, ink: null });
        paint(ellPts(0, 0, r * .85, r, 12), { wash: '#FF2F4A', ink: PAL.ink, sw: sw * .5 }); break;
      default: dot();
    }
  }
  // both eyes: pts = [[x, y, side], ...] in px. Sunglasses span both.
  function aEyes(u, o, sw, pts, r) {
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const sqz = clamp(o.squint || 0);
    if (kinds[0] === 'shades') {
      const lens = (cx, cy) => [[cx - 1.35 * r, cy - .75 * r], [cx + 1.35 * r, cy - .75 * r], [cx + 1.2 * r, cy + .35 * r], [cx + .5 * r, cy + .85 * r], [cx - .5 * r, cy + .85 * r], [cx - 1.2 * r, cy + .35 * r]];
      if (pts.length > 1) inkLine([[pts[0][0] + 1.2 * r, pts[0][1] - .5 * r], [(pts[0][0] + pts[1][0]) / 2, pts[0][1] - .75 * r], [pts[1][0] - 1.2 * r, pts[1][1] - .5 * r]], sw * .8, PAL.ink, 'ink', .5);
      else inkLine([[pts[0][0] - 1.3 * r, pts[0][1] - .5 * r], [pts[0][0] - 3.2 * r, pts[0][1] - .6 * r]], sw * .8, PAL.ink, 'ink', 0);
      for (const [ex, ey] of pts) {
        paint(lens(ex, ey), { wash: '#2A2740', ink: PAL.ink, sw: sw * .8, curv: .3 });
        inkLine([[ex - .75 * r, ey - .1 * r], [ex - .25 * r, ey - .5 * r]], sw * .45, PAL.cream, 'inkfine', 0);
      }
      return;
    }
    for (const [ex, ey, s] of pts) {
      push(); translate(ex, ey);
      if (sqz > .8) inkLine([[-.9 * r, .1 * r], [.9 * r, .1 * r]], sw * 1.1, PAL.ink, 'ink', 0);
      else { if (sqz > 0) scale(1 + sqz * .15, 1 - sqz); aEye(kinds[s < 0 ? 0 : 1], s, r, o, sw); }
      pop();
    }
  }
  // mouths, around (0, 0); m = the mouth's half-width in px
  function aMouth(k, m, sw) {
    if (!k) return;
    const P = pts => pts.map(([a, b]) => [a * m, b * m]), L = (pts, w = .9, c = .6) => inkLine(P(pts), sw * w, PAL.ink, 'ink', c);
    switch (k) {
      case 'smile': L([[-1, -.2], [0, .35], [1, -.2]]); break;
      case 'frown': L([[-1, .3], [0, -.2], [1, .3]]); break;
      case 'flat': L([[-.8, 0], [.8, 0]], .9, 0); break;
      case 'wobble': L([[-1, 0], [-.5, -.25], [0, 0], [.5, -.25], [1, 0]], .8, .3); break;
      case 'cat': L([[-1, -.1], [-.5, .3], [0, -.1], [.5, .3], [1, -.1]], .8, .5); break;
      case 'smirk': L([[-.9, .1], [.2, .15], [1, -.35]], .9, .5); break;
      case 'pout': L([[-.45, .1], [0, -.2], [.45, .1]], 1, .6); L([[-.25, .35], [0, .45], [.25, .35]], .6, .6); break;
      case 'o': paint(ellPts(0, .05 * m, .38 * m, .45 * m, 12), { wash: DARK, ink: PAL.ink, sw: sw * .5 }); break;
      case 'O': case 'yawn': paint(ellPts(0, .15 * m, .7 * m, (k === 'yawn' ? 1.1 : .9) * m, 14), { wash: DARK, ink: PAL.ink, sw: sw * .6 }); paint(ellPts(0, .65 * m, .4 * m, .2 * m, 10), { wash: PAL.rose, ink: null }); break;
      case 'wail': { const w = Math.sin(T * 30) * .06;
        paint(P([[-1.2, -.2 + w], [-.4, -.4], [.4, -.4 - w], [1.2, -.2], [.9, .9], [-.9, .9]]), { wash: DARK, ink: PAL.ink, sw: sw * .6, curv: .3 });
        paint(ellPts(0, .7 * m, .6 * m, .2 * m, 10), { wash: PAL.rose, ink: null }); break; }
      case 'laugh': paint(P([[-1.2, -.3], [1.2, -.3], [.8, .6], [0, 1.0], [-.8, .6]]), { wash: DARK, ink: PAL.ink, sw: sw * .6, curv: .4 }); paint(ellPts(0, .62 * m, .55 * m, .24 * m, 10), { wash: PAL.rose, ink: null }); break;
      case 'grin': case 'open':
        paint(P([[-1.1, -.25], [1.1, -.25], [.7, .6], [0, .85], [-.7, .6]]), { wash: DARK, ink: PAL.ink, sw: sw * .6, curv: .4 });
        paint(ellPts(0, .55 * m, .5 * m, .2 * m, 10), { wash: PAL.rose, ink: null }); break;
      case 'tongue': L([[-1, -.2], [0, .3], [1, -.25]]); paint(P([[.1, .1], [.8, .05], [.75, .6], [.45, .8], [.12, .6]]), { wash: PAL.rose, ink: PAL.ink, sw: sw * .45, curv: .5 }); break;
      case 'teeth': paint(P([[-1, -.3], [1, -.3], [1, .4], [-1, .4]]), { wash: PAL.cream, ink: PAL.ink, sw: sw * .55 }); L([[-.95, .05], [.95, .05]], .4, 0); for (const tx of [-.5, 0, .5]) L([[tx, -.28], [tx, .38]], .35, 0); break;
      default: L([[-1, -.2], [0, .35], [1, -.2]]);
    }
  }
  // a chomp: a dark mouth opening with a row of teeth top and bottom; k = 0..1 open
  function chompMouth(m, k, sw, teeth = PAL.cream) {
    const h = (.25 + 1.3 * k) * m, w = (1 + .35 * k) * m;
    paint(ellPts(0, 0, w, h, 18), { wash: DARK, ink: PAL.ink, sw: sw * .6 });
    if (h > .3 * m) paint(ellPts(0, h * .45, w * .55, h * .3, 12), { wash: PAL.rose, ink: null });
    const n = 4, th = Math.min(.45 * m, h * .45);
    for (let i = 0; i < n; i++) {
      const tx = lerp(-w * .7, w * .7, (i + .5) / n), yt = -h * Math.sqrt(Math.max(0, 1 - (tx / w) ** 2)) * .92;
      paint([[tx - .22 * m, yt], [tx + .22 * m, yt], [tx, yt + th]], { wash: teeth, ink: PAL.ink, sw: sw * .35 });
      paint([[tx - .22 * m, -yt], [tx + .22 * m, -yt], [tx, -yt - th * .8]], { wash: teeth, ink: PAL.ink, sw: sw * .35 });
    }
  }

  // ---------------------------------------------------------------------------------------------------------------
  // a head hat from the engine, sitting on a point (px, py in u) at scale k (the engine's hats sit on y = -8u)
  function headHat(u, h, sw, px, py, k) {
    if (!h || ['mask', 'masq', 'bowtie'].includes(h)) return;
    push(); translate(px * u, py * u); scale(k); translate(0, 8 * u); hat(u, h, sw / k * .8); pop();
  }
  // Clawd's face space (eyes at ±2.5u, -6u) mapped onto the design's eyes: a uniform scale about the feet line
  const faceMap = D => { const k = D.face.ex / 2.5; return { k, oy: D.face.ey + 6 * k }; };
  function inFace(D, u, fn) { const m = faceMap(D); push(); translate(0, m.oy * u); scale(m.k); fn(); pop(); }
  // face pieces for Clawd's face, mapped: mask (under the eyes), masq / cat whiskers (over them)
  function faceHatUnder(S) {
    if (S.o.hat !== 'mask' || S.V.one) return;
    const { u, sw, D } = S;
    inFace(D, u, () => paint(P2(u, [[-5.3, -7.7], [5.3, -7.7], [4.4, -4.7], [.6, -5.4], [-.6, -5.4], [-4.4, -4.7]]), { wash: PAL.violet, ink: PAL.ink, sw: sw * .7 }));
  }
  function faceHatOver(S) {
    const { u, sw, D, o, V } = S;
    if (o.hat === 'masq' && !V.one) inFace(D, u, () => faceHat(u, 'masq', sw, [-1, 1]));
    if (o.hat === 'cat') inFace(D, u, () => faceHat(u, 'cat', sw, V.one ? [1] : [-1, 1]));
  }
  // gloom: a dark wash over a box (in u) with hanging lines from its top
  function gloomBox(u, sw, g, x0, x1, y0, y1) {
    paint(rectPts(x0 * u, y0 * u, (x1 - x0) * u, (y1 - y0) * u, u * .05), { fill: PAL.indigo, fillOp: 150 * g, bleed: .08, tex: .5, border: .6, ink: null });
    const n = Math.max(3, Math.round((x1 - x0) * .7));
    for (let i = 0; i < n; i++) { const gx = lerp(x0 + .5, x1 - .5, i / (n - 1)); inkLine([[gx * u, (y0 + .1) * u], [gx * u + jit(u * .05), (y0 + (y1 - y0) * .9 * g * (.7 + .3 * hash(i))) * u]], sw * .45, PAL.ink, 'inkfine', 0); }
  }
  // the lamp level from the mood (bob and pip)
  const lampOf = o => o.lamp ?? (o.emote === 'bulb' || o.eyes === 'shine' || o.eyes === 'spark' ? 1 : o.eyes === 'swirl' ? .9 : o.emote === 'dots' ? .7 : .35 + .35 * pulse(T, 3));
  const lampCol = o => o.lampCol || (o.eyes === 'swirl' ? '#B58CE8' : o.eyes === 'scared' ? '#FF6B5A' : '#FFC766');

  // ---------------------------------------------------------------------------------------------------------------
  // the rig. Arms use the engine's VIEWS table and Clawd's exact arm transform, so hooks and hand maths still match.
  function rig(D, x, y, u, o = {}) {
    const id = o.boilKey ?? ++CLAWD_N, key = `${D.name} ${id}`, rs = p => boilSeed(`${key} ${p}`);
    x += (o.dx || 0) * u;
    const vn = VIEWS[o.view] ? o.view : 'front', EV = VIEWS[vn], V = D.views[vn];
    const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sm = clamp(o.smear || 0);
    const sw = clamp(u / 15, .45, 2.4) * (o.swMul || 1);
    const tc = agentTint(D, o), C = { ...D.col, main: tc.col, dk: tc.dk, lt: tc.lt };
    const lid = vn === 'front' ? clamp(o.lid || 0) : 0;

    rs('shadow');
    if (!o.noShadow) { const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .06); paint(ellPts(x, y + u * .15, u * D.shadow * f * (V.shW ?? 1), u * f, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null }); }
    if (sm > .05) smearTrail(x, y + dy, u, { R: V.R ?? 5 }, sm, o.smearDir ?? (o.flip ? -1 : 1), C.main);

    push(); translate(x, y + dy); if (o.rot) rotate(o.rot);
    scale((o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35), (o.sy ?? 1) * (1 - sq));
    const S = { u, sw, o, C, V, vn, rs, sm, lid, D };

    const arm = ([px, dir, which, layer]) => {
      rs('arm' + which);
      const a = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), hook = which === 'L' ? o.armL : o.armR;
      const A = D.arm, far = layer === 2, col = far ? mixCol(C[A.col] || A.col, PAL.ink, .28) : (C[A.col] || A.col);
      const fill = C[A.fill] || A.fill || mixCol(col, PAL.ink, .25);
      push(); translate((px + dir * .55 * clamp((Math.abs(a) - .7) / .9)) * u, -4.5 * u);
      let d = dir, len = 2.2;
      // side view: Clawd's pivot is (1.6u, -4.2u); a design whose face sits lower moves it (V.arm) so the arm clears the face
      if (dir === 0) { if (V.arm) translate((V.arm[0] - px) * u, (V.arm[1] + 4.2) * u); translate(0, .3 * u); rotate(.7 - a); d = 1; len = 2.1; } else rotate(dir < 0 ? a : -a);
      const r0 = dir === 0 ? -.2 : -A.root, bend = (A.bend ?? .15) * u;
      paint(ribbon([[d * r0 * u, 0], [d * len * .5 * u, bend], [d * len * u, 0]], A.w0 * u, A.w1 * u), { wash: col, fill, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .75 });
      if (A.rings && u > 9) for (const q of A.rings) inkLine([[d * len * q * u, -A.w0 * u * .42 + bend * .6], [d * len * q * u, A.w0 * u * .42 + bend * .6]], sw * .45, mixCol(col, PAL.ink, .45), 'inkfine', 0);
      translate(d * len * u, 0);
      if (A.hand) A.hand(S, far, d);
      else { const hc = C[A.hcol] || A.hcol; paint(ellPts(d * .1 * u, 0, A.hr * u, A.hr * u * .92, 12), { wash: far ? mixCol(hc, PAL.ink, .25) : hc, ink: PAL.ink, sw: sw * .6 }); }
      if (hook) { if (d < 0) scale(-1, 1); hook(u, sw); }
      pop();
    };

    if (D.behind) { rs('behind'); D.behind(S); }
    EV.arms.filter(a => a[3] !== 1).forEach(arm);
    if (!o.noLegs) legs(S);
    rs('body'); D.body(S);
    EV.arms.filter(a => a[3] === 1).forEach(arm);
    rs('draw'); if (o.draw) inFace(D, u, () => o.draw(u, sw));
    pop();

    rs('emote');
    if (o.emote) {
      const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
      const ex = x + dir * (top ? (V.peak ?? 0) : (V.R ?? 5) + .4) * u, ey = y + dy + (top ? D.emoteTop : D.emoteSide) * u * (1 - sq);
      emote(o.emote, ex, ey, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
    }
    rs('after');
  }

  // legs: stepping with o.walk (from the concept rig)
  function legs(S) {
    const { u, sw, o, V, D, rs } = S, G = D.legs, side = S.vn === 'side';
    const idx = side ? [1, 0] : [0, 1];
    for (const i of idx) {
      rs('leg' + i);
      let x = (V.legX || 0) + (i ? 1 : -1) * G.x * (side ? .22 : V.legW ?? 1), lift = 0;
      if (o.walk != null) {
        const ph = (o.walk + (i ? .5 : 0)) * TAU;
        if (side) { x += Math.sin(ph) * G.stride; lift = Math.max(0, Math.cos(ph)) * G.lift; } else lift = Math.max(0, Math.sin(ph)) * G.lift;
      }
      G.draw(S, x, lift, side && i === 1, side);
    }
  }

  // tint: the engine's tint maths on the design's palette (main / dk / lt), or col / dk / lt passed in
  function agentTint(D, o) {
    const c = { col: o.col || D.col.main, dk: o.dk || D.col.dk, lt: o.lt || D.col.lt };
    const tc = o.tint && (TINT[o.tint] || o.tint), k = clamp(o.tintK ?? 1);
    if (!tc || k <= 0) return c;
    const s = D.tintK ?? 1;
    return { col: mixCol(c.col, tc, .55 * k * s), dk: mixCol(c.dk, mixCol(tc, PAL.ink, .35), .5 * k * s), lt: mixCol(c.lt, mixCol(tc, '#FFFFFF', .4), .45 * k * s) };
  }

  // ===============================================================================================================
  // FOLIO: a paper boat folded from the instructions it was given
  // hull: top y -6.0 (the folded rim to -5.5), bottom -2.3 (legs below); sail peak -9.6; pennant to ~-10.5.
  // The face (eyes y -4.55, mouth -3.3) sits where Clawd's did, so it clears desks and boat rails Clawd was staged behind.
  const HT = -6.0, RIM = -5.5, HB = -2.3, PK = -9.6, FEY = -4.55, FMY = -3.3, FCY = -3.75, BTY = -2.45;
  const FOLIO = {
    name: 'folio', title: 'Folio', what: 'a paper boat folded from its instructions',
    shadow: 5.0, emoteTop: -11.9, emoteSide: -8.9,
    col: { main: '#F1E4C4', lt: '#FBF4E2', dk: '#C9B385', line: '#4E6A94', flag: '#D8473B', shoe: '#3E3C4C', mast: '#8A6A44' },
    face: { ex: 1.95, ey: FEY },
    arm: { root: .8, w0: .62, w1: .5, bend: .14, col: 'main', fill: 'dk', hr: .48, hcol: 'main' },
    legs: { x: 1.5, stride: .7, lift: .6,
      draw: (S, x, lift, far) => {
        const { u, sw, C } = S, col = far ? mixCol(C.main, PAL.ink, .3) : C.main, shoe = far ? mixCol(C.shoe, PAL.ink, .3) : C.shoe;
        paint(rectPts((x - .25) * u, -2.6 * u, .5 * u, (2.35 - lift) * u, u * .03), { wash: col, fill: C.dk, fillOp: 40, tex: .4, ink: PAL.ink, sw: sw * .55 });
        paint(ellPts((x + (S.vn === 'side' ? .25 : 0)) * u, (-.36 - lift) * u, .72 * u, .38 * u, 14), { wash: shoe, ink: PAL.ink, sw: sw * .55 });
      } },
    //  hull: [top-left x, top-right x, bottom-left x, bottom-right x]; flaps: inner x of the end flaps at the top;
    //  sail: [base-left x, base-right x]; peak: the peak's x; fx / fw / mx: face shift, face width, mouth x
    views: {
      front: { fx: 0, fw: 1, mx: 0, hull: [-5.1, 5.1, -3.3, 3.3], flaps: [-3.3, 3.3], sail: [-3.2, 3.2], peak: 0, R: 5.1 },
      q:     { fx: .75, fw: .86, mx: 0, hull: [-4.4, 5.3, -2.8, 3.5], rise: [0, .35], flaps: [-3.1, 3.7], sail: [-2.7, 3.4], peak: .45, R: 5.3, legX: .3, legW: .9 },
      side:  { fx: 1.4, fw: .62, mx: 1.6, one: true, arm: [1.2, -3.0], hull: [-3.4, 4.8, -2.4, 2.4], rise: [.25, 1.1], flaps: [-2.7, 3.0], sail: [-2.3, 2.2], peak: -.05, R: 4.5, shW: .8 },
      qback: { back: true, hull: [-5.3, 4.4, -3.5, 2.8], rise: [.35, 0], flaps: [-3.7, 3.1], sail: [-3.3, 2.6], peak: -.45, R: 4.4, legX: -.3, legW: .9 },
      back:  { back: true, hull: [-5.1, 5.1, -3.3, 3.3], flaps: [-3.3, 3.3], sail: [-3.2, 3.2], peak: 0, R: 5.1 },
    },
    body: S => {
      const { u, sw, o, V, lid } = S;
      if (lid > .01) return folioChomp(S);
      folioSail(S);
      folioHull(S, HT);
      folioRim(S);
      if (o.gloom > .02) gloomBox(u, sw, o.gloom, V.hull[0] + 1.4, V.hull[1] - 1.4, RIM, RIM + 1.7);
      if (!V.back) folioFace(S, true);
      folioTop(S);
      if (o.hat === 'bowtie' && !V.back) folioBowtie(S);
    },
  };
  // the sail: two faces of a folded triangle (lit left, shaded right), written on
  function folioSail(S) {
    const { u, sw, C, V } = S, [s0, s1] = V.sail, px = V.peak;
    paint(P2(u, [[s0, HT + .1], [px, PK], [px, HT + .1]]), { wash: C.lt, fill: C.main, fillOp: 60, tex: .6, ink: null });
    paint(P2(u, [[px, HT + .1], [px, PK], [s1, HT + .1]]), { wash: C.main, fill: C.dk, fillOp: 80, tex: .6, ink: null });
    if (u > 6) {   // the instructions it was folded from: rows of handwriting (faint, from behind)
      const lc = V.back ? mixCol(C.line, C.main, .55) : C.line, rows = V.one ? 3 : 4;
      for (let i = 0; i < rows; i++) {
        const yy = -8.5 + i * .72, f = (yy - PK) / (HT - PK), wl = (px - s0) * f - .35, wr = (s1 - px) * f - .35;
        if (wl > .25) inkLine(P2(u, [[px - wl, yy], [px - wl * .45, yy - .06], [px - .18, yy + .03]]), sw * .55, lc, 'inkfine', .3);
        if (wr > .6 && i !== 1) inkLine(P2(u, [[px + .18, yy + .05], [px + wr * .55, yy], [px + wr * (i === 3 ? .7 : 1), yy + .02]]), sw * .55, mixCol(lc, C.dk, .3), 'inkfine', .3);
      }
    }
    paint(P2(u, [[s0, HT + .1], [px, PK], [s1, HT + .1]]), { ink: PAL.ink, sw: sw * .9 });
    inkLine(P2(u, [[px, HT + .1], [px, PK + .1]]), sw * .45, mixCol(C.dk, PAL.ink, .2), 'inkfine', 0);
  }
  // the hull from yTop down, with its folded end flaps (a paper boat's triangles)
  function folioHull(S, yTop) {
    const { u, sw, C, V } = S, [tl, tr, bl, br] = V.hull;
    const xl = edgeAt(yTop, HT, tl, HB, bl), xr = edgeAt(yTop, HT, tr, HB, br);
    const [rl, rr] = yTop === HT && V.rise ? V.rise : [0, 0];   // raised ends (a bow pointing up in the turned views)
    const hull = P2(u, [[xl, yTop - rl], [xr, yTop - rr], [br, HB], [bl, HB]]);
    paint(hull, { wash: C.main, fill: C.lt, fillOp: 50, tex: .6, ink: null });
    if (V.flaps) {
      const [fl, fr] = V.flaps, back = V.back;
      const flap = (xo, xi, xb, op) => { const k = (yTop - HT) / (HB - HT), xin = lerp(xi, xb, k); paint(P2(u, [[xo, yTop - (xo < 0 ? rl : rr)], [xb, HB], [xin, yTop]]), { fill: C.dk, fillOp: op, bleed: .04, tex: .5, border: .4, ink: null }); inkLine(P2(u, [[xin, yTop + .05], [xb, HB - .05]]), sw * .45, mixCol(C.dk, PAL.ink, .35), 'inkfine', 0); };
      const turned = S.vn === 'q' || S.vn === 'side';
      flap(xl, fl, bl, back ? 150 : (turned ? 170 : 120));
      flap(xr, fr, br, back ? 120 : (turned ? 110 : 150));
    }
    paint(P2(u, [[xl, HB - .7], [xr, HB - .7], [br, HB], [bl, HB]].map(([a, b], i) => [i < 2 ? edgeAt(HB - .7, HT, i ? tr : tl, HB, i ? br : bl) : a, b])), { fill: C.dk, fillOp: 70, bleed: .05, tex: .5, border: .5, ink: null });
    paint(hull, { ink: PAL.ink, sw });
  }
  // the folded rim along the top of the hull
  function folioRim(S) {
    const { u, sw, C, V } = S, [tl, tr, bl, br] = V.hull;
    const xl = edgeAt(RIM, HT, tl, HB, bl), xr = edgeAt(RIM, HT, tr, HB, br);
    const [rl, rr] = V.rise || [0, 0];
    paint(P2(u, [[tl, HT - rl], [tr, HT - rr], [xr, RIM], [xl, RIM]]), { wash: C.lt, fill: C.main, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .8 });
  }
  // the face on the hull: cheeks, eyes, mouth (and the face pieces)
  function folioFace(S, withMouth) {
    const { u, sw, o, V } = S, sides = V.one ? [1] : [-1, 1];
    push(); translate(V.fx * u, 0); scale(V.fw, 1);
    if (o.blush) for (const s of sides) {
      paint(ellPts(s * 2.75 * u, FCY * u, .5 * u, .26 * u, 12), { fill: PAL.rose, fillOp: 200 * clamp(o.blush === true ? 1 : o.blush), bleed: .2, ink: null });
      if (o.blush > .6 && u > 9) for (let k = 0; k < 3; k++) inkLine([[(s * 2.75 - .35 + k * .3) * u, (FCY + .15) * u], [(s * 2.75 - .2 + k * .3) * u, (FCY - .2) * u]], sw * .4, mixCol(PAL.rose, PAL.ink, .3), 'inkfine', 0);
    }
    faceHatUnder(S);
    aEyes(u, o, sw, sides.map(s => [s * 1.95 * u, FEY * u, s]), .66 * u);
    if (withMouth) { push(); translate(V.mx * u, FMY * u); aMouth(o.mouth, .52 * u, sw); pop(); }
    faceHatOver(S);
    pop();
  }
  // mast and pennant at the peak, or a hat sitting on the peak instead
  function folioTop(S) {
    const { u, sw, o, C, V } = S, px = V.peak;
    if (o.hat && !['mask', 'masq', 'bowtie', 'cat'].includes(o.hat)) { headHat(u, o.hat, sw, px, PK + .2, .6); return; }
    const fl = Math.sin(T * 6 + (o.seed || 0)) * .15, dir = V.back ? -1 : 1;
    inkLine(P2(u, [[px, PK + .1], [px, PK - .95]]), sw * 1.1, C.mast, 'ink', 0);
    paint(P2(u, [[px, PK - .95], [px + dir * 1.25, PK - .7 + fl], [px, PK - .42]]), { wash: C.flag, fill: mixCol(C.flag, PAL.ink, .2), fillOp: 50, ink: PAL.ink, sw: sw * .5 });
    if (o.hat === 'cat') for (const s of [-1, 1]) paint(P2(u, [[px + s * .3, PK + .9], [px + s * 1.0, PK - .3], [px + s * 1.5, PK + 1.4]]), { wash: C.main, fill: PAL.rose, fillOp: 60, ink: PAL.ink, sw: sw * .6 });
  }
  function folioBowtie(S) {
    const { u, sw, V } = S, bx = V.fx + V.mx * V.fw;
    for (const s of [-1, 1]) paint(P2(u, [[bx, BTY], [bx + s * 1.1 * V.fw, BTY - .45], [bx + s * 1.1 * V.fw, BTY + .45]]), { wash: PAL.rose, fill: '#C8324A', fillOp: 60, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(bx * u, BTY * u, .28 * u, .28 * u, 10), { wash: '#C8324A', ink: PAL.ink, sw: sw * .45 });
  }
  // the chomp (front view): the rim and the sail hinge back at the left end like a jaw; paper teeth point into the
  // dark wedge between them, each sized to the gap at its spot (like Clawd's lunchbox)
  function folioChomp(S) {
    const { u, sw, o, C, V, lid } = S, [tl, tr, bl, br] = V.hull;
    const hx = edgeAt(RIM, HT, tl, HB, bl), rx = edgeAt(RIM, HT, tr, HB, br), A = lid * 1.25, span = rx - hx;
    const gap = xx => (xx - hx) * Math.sin(A);
    const tooth = (tx, dir) => {
      const h = Math.min(.75, .42 * gap(tx + .5)); if (h < .12) return;
      paint(P2(u, [[tx, RIM], [tx + 1.0, RIM], [tx + .5, RIM + dir * h]]), { wash: C.lt, ink: PAL.ink, sw: sw * .45 });
    };
    folioHull(S, RIM);
    if (o.gloom > .02) gloomBox(u, sw, o.gloom, tl + 1.6, tr - 1.6, RIM, RIM + 1.5);
    // the open mouth, the tongue and the lower teeth
    paint(P2(u, [[hx, RIM], [rx, RIM], [hx + span * Math.cos(A), RIM - span * Math.sin(A)]]), { wash: DARK, ink: null });
    const th = Math.min(.5, .3 * gap(1.8));
    if (th > .08) paint(ellPts(1.6 * u, (RIM - th * .7) * u, 2.0 * u, th * u, 16), { wash: PAL.rose, fill: '#E2476E', fillOp: 60, ink: null });
    for (let i = 0; i < 7; i++) tooth(hx + .5 + i * 1.3, -1);
    folioFace(S, false);
    if (o.hat === 'bowtie') folioBowtie(S);
    // the jaw: rim + sail + pennant (or hat), hinged at the left end of the rim
    push(); translate(hx * u, RIM * u); rotate(-A); translate(-hx * u, -RIM * u);
    folioSail(S);
    folioRim(S);
    for (let i = 0; i < 6; i++) tooth(hx + 1.1 + i * 1.3, 1);
    folioTop(S);
    pop();
  }

  // ===============================================================================================================
  // BOB: a living harbour buoy, striped, with a signal lamp that blinks while it thinks (its cap flips open to chomp)
  const BOB_B = { cy: -5.0, rx: 4.6, ry: 3.2, pear: -.06 };
  const roundViews = (fxQ, fxS) => ({
    front: { fx: 0, fw: 1, mx: 0, peak: 0, R: 4.8 },
    q:     { fx: fxQ, fw: .82, mx: 0, peak: .35, R: 4.8, legX: .3, legW: .9 },
    side:  { fx: fxS, fw: .5, mx: 1.4, one: true, peak: .3, R: 4.8, legW: .3 },
    qback: { back: true, fx: -fxQ, fw: .82, peak: -.35, R: 4.8, legX: -.3, legW: .9 },
    back:  { back: true, fx: 0, fw: 1, peak: 0, R: 4.8 },
  });
  const BOB = {
    name: 'bob', title: 'Bob', what: 'a harbour buoy with a signal lamp',
    shadow: 4.8, emoteTop: -11.6, emoteSide: -8.6,
    col: { main: '#E0674F', lt: '#F29A80', dk: '#A23C33', band: '#F4ECDC', iron: '#3E3C4C', brass: '#D9A04E' },
    face: { ex: 1.7, ey: -5.05 },
    arm: { root: .8, w0: .72, w1: .62, bend: .15, col: 'main', hr: .55, hcol: 'band' },
    legs: { x: 1.8, stride: .6, lift: .55,
      draw: (S, x, lift, far) => {
        const { u, sw, C } = S, c = far ? mixCol(C.iron, PAL.ink, .3) : C.iron;
        paint(rectPts((x - .3) * u, -1.6 * u, .6 * u, (1.1 - lift) * u), { wash: c, ink: PAL.ink, sw: sw * .5 });
        paint(rrPts((x - .8 + (S.vn === 'side' ? .15 : 0)) * u, (-.82 - lift) * u, 1.6 * u, .85 * u, .4 * u), { wash: c, fill: PAL.ink, fillOp: 30, tex: .4, ink: PAL.ink, sw: sw * .65 });
      } },
    views: roundViews(.9, 1.9),
    behind: S => {   // the iron keel under the buoy
      const { u, sw, C } = S;
      paint(P2(u, [[-2.1, -2.4], [2.1, -2.4], [1.6, -1.0], [-1.6, -1.0]]), { wash: C.iron, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7 });
    },
    body: S => {
      const { u, sw, o, C, V, lid } = S, { cy, rx, ry, pear } = BOB_B;
      const Bd = eggPts(0, cy * u, rx * u, ry * u, pear, 48);
      paint(Bd, { wash: C.main, ink: null });
      paint(bandPts(0, cy * u, rx * u, ry * u, -6.5 * u, -3.6 * u, pear), { wash: C.band, fill: mixCol(C.band, C.dk, .2), fillOp: 30, tex: .5, ink: null });
      paint(ellPts((-1.6 - (V.fx || 0) * .4) * u, -7.1 * u, 1.5 * u, .6 * u, 14, 0, -.3), { fill: C.lt, fillOp: 140, bleed: .2, tex: .6, border: .6, ink: null });
      paint(bandPts(0, cy * u, rx * u, ry * u, -2.8 * u, -1.9 * u, pear), { fill: C.dk, fillOp: 110, bleed: .05, tex: .5, border: .5, ink: null });
      for (const yy of [-6.5, -3.6]) { const s = (yy - cy) / ry, hw = rx * Math.sqrt(1 - s * s) * (1 + pear * s); inkLine([[-hw * u, yy * u], [(V.fx || 0) * .5 * u, (yy + .14) * u], [hw * u, yy * u]], sw * .6, PAL.ink, 'inkfine', .5); }
      if (o.gloom > .02) gloomBox(u, sw, o.gloom, -3.3, 3.3, -7.6, -5.6);
      paint(Bd, { ink: PAL.ink, sw });
      if (!V.back) {
        const sides = V.one ? [1] : [-1, 1];
        push(); translate(V.fx * u, 0); scale(V.fw, 1);
        if (o.blush) for (const s of sides) paint(ellPts(s * 2.8 * u, -4.3 * u, .5 * u, .25 * u, 10), { fill: PAL.rose, fillOp: 200 * clamp(o.blush === true ? 1 : o.blush), bleed: .2, ink: null });
        faceHatUnder(S);
        aEyes(u, o, sw, sides.map(s => [s * 1.7 * u, -5.05 * u, s]), .62 * u);
        push(); translate(V.mx * u, -4.05 * u);
        if (lid > .01) chompMouth(.62 * u, lid, sw); else aMouth(o.mouth, .5 * u, sw);
        pop();
        faceHatOver(S);
        if (o.hat === 'bowtie') { for (const s of [-1, 1]) paint(P2(u, [[0, -2.35], [s * 1.1, -2.85], [s * 1.1, -1.85]]), { wash: PAL.rose, fill: '#C8324A', fillOp: 60, ink: PAL.ink, sw: sw * .5 }); paint(ellPts(0, -2.35 * u, .3 * u, .3 * u, 10), { wash: '#C8324A', ink: PAL.ink, sw: sw * .45 }); }
        pop();
      }
      // the lamp (or a hat on the dome)
      const lx = V.peak;
      if (o.hat && !['mask', 'masq', 'bowtie', 'cat'].includes(o.hat)) { headHat(u, o.hat, sw, lx * .6, -8.0, .62); return; }
      const L = Math.max(lampOf(o), lid);
      paint(rectPts((lx - .4) * u, -8.6 * u, .8 * u, .55 * u), { wash: C.iron, ink: PAL.ink, sw: sw * .5 });
      if (L > .05) glow(lx * u, -9.2 * u, 2.4 * u * (.6 + .4 * L), lampCol(o), .95 * L);
      paint(ellPts(lx * u, -9.2 * u, .52 * u, .62 * u, 14), { wash: mixCol('#FFC766', '#FFF2C8', .5 * L), fill: '#F2A33A', fillOp: 60 * (1 - L), ink: null });
      for (const s of [-1, 1]) inkLine([[(lx + s * .58) * u, -8.6 * u], [(lx + s * .58) * u, -9.8 * u]], sw * 1.1, PAL.ink, 'ink', 0);
      push(); translate((lx - .85) * u, -9.8 * u); rotate(-lid * 2.1); translate(-(lx - .85) * u, 9.8 * u);
      paint(P2(u, [[lx - .85, -9.8], [lx + .85, -9.8], [lx, -10.5]]), { wash: C.brass, ink: PAL.ink, sw: sw * .6 });
      pop();
      if (o.hat === 'cat') for (const s of [-1, 1]) paint(P2(u, [[s * 1.2, -7.9], [s * 2.2, -9.6], [s * 3.0, -7.4]]), { wash: C.main, fill: PAL.rose, fillOp: 60, ink: PAL.ink, sw: sw * .6 });
    },
  };

  // ===============================================================================================================
  // PIP: a little brass diving helmet with a porthole for a face and a valve wheel on top (the porthole swings open to chomp)
  const PIP = {
    name: 'pip', title: 'Pip', what: 'a brass diving helmet',
    shadow: 4.6, emoteTop: -11.4, emoteSide: -8.8,
    col: { main: '#D9A04E', lt: '#F2C77E', dk: '#9A6433', glass: '#DCEBE3', suit: '#4E5A6E', boot: '#2E2B38' },
    face: { ex: .85, ey: -5.35 },
    arm: { root: 1.0, w0: .95, w1: .85, bend: .15, col: 'suit', rings: [.3, .5, .7], hr: .62, hcol: 'main' },
    legs: { x: 1.3, stride: .6, lift: .55,
      draw: (S, x, lift, far) => {
        const { u, sw, C } = S, c = far ? mixCol(C.suit, PAL.ink, .3) : C.suit, b = far ? mixCol(C.boot, PAL.ink, .3) : C.boot;
        paint(rectPts((x - .5) * u, -2.1 * u, u, (1.8 - lift) * u, u * .03), { wash: c, ink: PAL.ink, sw: sw * .7 });
        paint(rrPts((x - .8 + (S.vn === 'side' ? .2 : 0)) * u, (-.75 - lift) * u, 1.6 * u, .8 * u, .36 * u), { wash: b, fill: PAL.ink, fillOp: 40, tex: .4, ink: PAL.ink, sw: sw * .65 });
        paint(rectPts((x - .77 + (S.vn === 'side' ? .2 : 0)) * u, (-.17 - lift) * u, 1.54 * u, .14 * u), { wash: C.main, ink: null });
      } },
    views: roundViews(1.0, 2.0),
    body: S => {
      const { u, sw, o, C, V, lid } = S, cy = -5.3;
      const H = ellPts(0, cy * u, 4.2 * u, 3.5 * u, 44);
      paint(H, { wash: C.main, ink: null });
      paint(ellPts(-1.7 * u, -7.4 * u, 1.8 * u, .85 * u, 18, 0, -.4), { fill: C.lt, fillOp: 160, bleed: .2, tex: .7, border: .7, ink: null });
      paint(bandPts(0, cy * u, 4.2 * u, 3.5 * u, -3.5 * u, -1.9 * u), { fill: C.dk, fillOp: 120, bleed: .08, tex: .6, border: .5, ink: null });
      if (o.gloom > .02) gloomBox(u, sw, o.gloom, -2.8, 2.8, -8.4, -6.8);
      paint(H, { ink: PAL.ink, sw });
      if (u > 9) for (const a of [-2.3, -1.9, -1.25, -.85]) paint(ellPts(Math.cos(a) * 3.8 * u, cy * u + Math.sin(a) * 3.15 * u, .14 * u, .14 * u, 8), { wash: C.dk, ink: null });
      if (S.vn === 'q' || S.vn === 'side') paint(ellPts((S.vn === 'side' ? -1.7 : -2.9) * u, -5.2 * u, .55 * u, .75 * u, 14), { wash: C.glass, ink: PAL.ink, sw: sw * .6 });
      // the collar in front of the helmet's foot
      paint(P2(u, [[-3.4, -2.8], [3.4, -2.8], [2.9, -1.6], [-2.9, -1.6]]), { wash: C.dk, fill: C.main, fillOp: 70, tex: .5, ink: PAL.ink, sw: sw * .8 });
      if (u > 9) for (const bx of [-2, 0, 2]) paint(ellPts(bx * u, -2.2 * u, .17 * u, .17 * u, 8), { wash: C.lt, ink: PAL.ink, sw: sw * .35 });
      if (!V.back) {
        const cyF = -5.05, sides = V.one ? [1] : [-1, 1], A = lid * 1.3;
        push(); translate(V.fx * u, 0); scale(V.fw, 1);
        if (lid > .01) {   // the porthole door swings open on its left hinge, the mouth inside
          paint(ellPts(0, cyF * u, 2.1 * u, 2.1 * u, 28), { wash: DARK, ink: PAL.ink, sw: sw * .8 });
          push(); translate(.6 * u, (cyF + .3) * u); chompMouth(.9 * u, lid, sw, PAL.cream); pop();
          translate(-2.6 * u, 0); scale(Math.max(.15, Math.cos(A)), 1); translate(2.6 * u, 0);
        }
        paint(ellPts(0, cyF * u, 2.6 * u, 2.6 * u, 32), { wash: C.lt, fill: C.main, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .9 });
        if (u > 9) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2; paint(ellPts(Math.cos(a) * 2.3 * u, cyF * u + Math.sin(a) * 2.3 * u, .14 * u, .14 * u, 8), { wash: C.dk, ink: null }); }
        paint(ellPts(0, cyF * u, 2.02 * u, 2.02 * u, 30), { wash: C.glass, fill: '#FFFFFF', fillOp: 40, tex: .4, ink: null });
        const L = lampOf(o);
        if (L > .5) glow(0, cyF * u, 2.8 * u, lampCol(o), (L - .4) * 1.2);
        paint(ellPts(0, cyF * u, 2.02 * u, 2.02 * u, 30), { ink: PAL.ink, sw: sw * .7 });
        if (o.blush) for (const s of sides) paint(ellPts(s * 1.25 * u, (cyF + .6) * u, .4 * u, .22 * u, 10), { fill: PAL.rose, fillOp: 180 * clamp(o.blush === true ? 1 : o.blush), bleed: .2, ink: null });
        faceHatUnder(S);
        aEyes(u, o, sw, sides.map(s => [s * .85 * u, (cyF - .3) * u, s]), .55 * u);
        if (lid <= .01) { push(); translate(V.mx * .4 * u, (cyF + .85) * u); aMouth(o.mouth, .45 * u, sw); pop(); }
        faceHatOver(S);
        inkLine([[.6 * u, (cyF - 1.55) * u], [1.2 * u, (cyF - 1.2) * u], [1.55 * u, (cyF - .6) * u]], sw * .9, '#FFFFFF', 'inkfine', .6);
        pop();
        if (o.hat === 'bowtie') { const bx = V.fx; for (const s of [-1, 1]) paint(P2(u, [[bx, -2.2], [bx + s * 1.1, -2.7], [bx + s * 1.1, -1.7]]), { wash: PAL.rose, fill: '#C8324A', fillOp: 60, ink: PAL.ink, sw: sw * .5 }); paint(ellPts(bx * u, -2.2 * u, .3 * u, .3 * u, 10), { wash: '#C8324A', ink: PAL.ink, sw: sw * .45 }); }
      }
      // the valve wheel on its crown (turns while it works), or a hat
      const lx = V.peak;
      if (o.hat && !['mask', 'masq', 'bowtie', 'cat'].includes(o.hat)) { headHat(u, o.hat, sw, lx * .5, -8.6, .66); return; }
      if (o.hat === 'cat') for (const s of [-1, 1]) paint(P2(u, [[s * 1.3, -8.5], [s * 2.5, -10.3], [s * 3.4, -7.8]]), { wash: C.main, fill: PAL.rose, fillOp: 60, ink: PAL.ink, sw: sw * .6 });
      const cyV = -9.7, a0 = o.spin ?? (T * .4), R = .72;
      inkLine([[lx * u, -8.75 * u], [lx * u, (cyV + .3) * u]], sw * 1.6, PAL.ink, 'ink', 0);
      push(); translate(lx * u, cyV * u); scale(V.fw < 1 ? .75 : 1, 1); rotate(a0);
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; inkLine([[0, 0], [Math.cos(a) * (R + .3) * u, Math.sin(a) * (R + .3) * u]], sw * .9, C.dk, 'ink', 0); paint(ellPts(Math.cos(a) * (R + .32) * u, Math.sin(a) * (R + .32) * u, .16 * u, .16 * u, 8), { wash: C.main, ink: PAL.ink, sw: sw * .35 }); }
      const ring = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; ring.push([Math.cos(a) * R * u, Math.sin(a) * R * u]); }
      inkLine(ring, sw * 1.7, C.dk, 'ink', .5); inkLine(ring, sw * .7, C.lt, 'inkfine', .5);
      paint(ellPts(0, 0, .24 * u, .24 * u, 10), { wash: C.lt, ink: PAL.ink, sw: sw * .45 });
      pop();
    },
  };
  PIP.arm.col = PIP.col.suit; PIP.arm.hcol = 'main';

  // ===============================================================================================================
  // POLLY: a scarlet parrot who says exactly what it's told (the beak gapes to chomp)
  const POLLY = {
    name: 'polly', title: 'Polly', what: 'a scarlet parrot',
    shadow: 4.4, emoteTop: -11.4, emoteSide: -8.8,
    col: { main: '#D8473B', lt: '#EE7A5E', dk: '#9E2E2C', patch: '#F4ECDC', beak: '#EFE2C2', wingBand: '#F0B94A', tip: '#3C6FAE', leg: '#8C7F86' },
    face: { ex: 1.45, ey: -5.75 },
    arm: { root: 1.0, w0: 1.3, w1: .4, bend: .35, col: 'main', fill: '#F0B94A', hr: .4, hcol: 'main',
      hand: (S, far, d) => { const { u, sw } = S; for (let i = -1; i <= 1; i++) paint(ribbon([[0, 0], [d * .55 * u, i * .32 * u], [d * .95 * u, i * .5 * u]], .34 * u, .1 * u), { wash: far ? mixCol('#3C6FAE', PAL.ink, .3) : '#3C6FAE', ink: PAL.ink, sw: sw * .45 }); } },
    legs: { x: .9, stride: .45, lift: .45,
      draw: (S, x, lift, far) => {
        const { u, sw, C } = S, c = far ? mixCol(C.leg, PAL.ink, .3) : C.leg, side = S.vn === 'side';
        paint(rectPts((x - .18) * u, -1.8 * u, .36 * u, (1.7 - lift) * u), { wash: c, ink: PAL.ink, sw: sw * .5 });
        for (const k of side ? [-.5, 0, .5] : [-.6, 0, .6]) inkLine([[x * u, (-.15 - lift) * u], [(x + k + (side ? .4 : 0)) * u, (-.02 - lift) * u]], sw * 1.6, mixCol(c, PAL.ink, .3), 'ink', 0);
      } },
    views: roundViews(.8, 1.7),
    behind: S => {   // tail feathers, down and back
      const { u, sw, C, vn } = S, bx = vn === 'side' ? -2.4 : -1.4;
      for (const [dx, len, c] of [[-.3, 3.3, C.tip], [.5, 2.8, C.main]]) paint(ribbon([[(bx + dx) * u, -2.6 * u], [(bx + dx - 1.0) * u, -1.1 * u], [(bx + dx - 1.5 - len * .15) * u, .1 * u]], 1.05 * u, .3 * u), { wash: c, fill: mixCol(c, PAL.ink, .3), fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .7 });
    },
    body: S => {
      const { u, sw, o, C, V, lid } = S;
      const Bd = eggPts(0, -4.9 * u, 4.0 * u, 3.4 * u, .12, 48);
      paint(Bd, { wash: C.main, ink: null });
      if (!V.back) paint(ellPts(V.fx * .5 * u, -2.9 * u, 2.4 * u, 1.5 * u, 20), { fill: C.lt, fillOp: 140, bleed: .15, tex: .6, border: .6, ink: null });
      paint(ellPts(-1.5 * u, -7.0 * u, 1.4 * u, .8 * u, 16, 0, -.4), { fill: C.lt, fillOp: 110, bleed: .2, tex: .6, border: .6, ink: null });
      if (o.gloom > .02) gloomBox(u, sw, o.gloom, -2.8, 2.8, -8.0, -6.3);
      paint(Bd, { ink: PAL.ink, sw });
      if (u > 9 && !V.back) for (let r = 0; r < 2; r++) for (let i = -1; i <= 1; i++) { const cx = (V.fx * .5 + i * 1.0 + (r ? .5 : 0)) * u, cy = (-3.2 + r * .8) * u; inkLine([[cx - .4 * u, cy], [cx, cy + .28 * u], [cx + .4 * u, cy]], sw * .4, C.dk, 'inkfine', .6); }
      // crest
      const cx = V.peak * .8;
      for (const [a, len, c] of [[-.55, 1.6, C.main], [.05, 1.9, C.wingBand], [.6, 1.5, C.main]]) {
        const tip = [cx * u + Math.sin(a) * len * u, -8.1 * u - Math.cos(a) * len * u];
        if (!(o.hat && !['mask', 'masq', 'bowtie', 'cat'].includes(o.hat))) paint(ribbon([[cx * u, -8.0 * u], [lerp(cx * u, tip[0], .5) + a * .2 * u, lerp(-8.0 * u, tip[1], .5)], tip], .6 * u, .12 * u), { wash: c, ink: PAL.ink, sw: sw * .55 });
      }
      if (!V.back) {
        push(); translate(V.fx * u, 0); scale(V.fw, 1);
        const sides = V.one ? [1] : [-1, 1], cyF = -5.75;
        for (const s of sides) {
          const px = s * 1.45, tear = [];
          for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, pt = Math.max(0, Math.cos(a - (s < 0 ? .75 : Math.PI - .75))), rr = 1 + .55 * pt ** 3; tear.push([(px + Math.cos(a) * .95 * rr) * u, (cyF + Math.sin(a) * 1.05 * rr) * u]); }
          paint(tear, { wash: C.patch, ink: PAL.ink, sw: sw * .5, curv: .3 });
        }
        if (o.blush) for (const s of sides) paint(ellPts(s * 1.9 * u, (cyF + .95) * u, .42 * u, .22 * u, 10), { fill: PAL.rose, fillOp: 190 * clamp(o.blush === true ? 1 : o.blush), bleed: .2, ink: null });
        faceHatUnder(S);
        aEyes(u, o, sw, sides.map(s => [s * 1.45 * u, (cyF - .1) * u, s]), .55 * u);
        faceHatOver(S);
        pop();
        // the beak: the mouth sets how far it opens (lid gapes it wide); a smile curls its corners
        const m = o.mouth, open = Math.max(['open', 'O', 'grin', 'laugh', 'wail', 'yawn', 'teeth', 'tongue'].includes(m) ? 1 : m === 'o' ? .5 : 0, lid * 2.2);
        const bx = V.one ? 2.9 : V.fx * 1.1;
        push(); translate(bx * u, -4.75 * u); scale(1.3);
        if (open > 0) {
          push(); rotate(V.one ? .45 * Math.min(1, open) : 0); translate(0, .35 * open * u);
          paint(P2(u, V.one ? [[-.5, -.1], [.55, -.05], [.2, .45], [-.4, .4]] : [[-.55, -.15], [.55, -.15], [.3, .45], [0, .6], [-.3, .45]]), { wash: '#3A2F35', ink: PAL.ink, sw: sw * .55, curv: .4 });
          if (!V.one) paint(ellPts(0, .15 * u, .3 * u, .15 * u, 10), { wash: PAL.rose, ink: null });
          pop();
          if (lid > .01 && !V.one) paint(ellPts(0, (.1 + .2 * open) * u, .5 * u, .35 * open * u, 12), { wash: DARK, ink: null });
        } else paint(P2(u, V.one ? [[-.4, .05], [.5, .1], [.35, .5], [-.3, .45]] : [[-.5, .1], [.5, .1], [.28, .62], [-.28, .62]]), { wash: '#3A2F35', ink: PAL.ink, sw: sw * .5, curv: .3 });
        const up = V.one ? [[-.55, -.7], [.35, -.75], [1.1, -.3], [1.25, .55], [.95, .75], [.7, .2], [-.55, .15]] : [[-.85, -.65], [.85, -.65], [.8, .05], [.4, .7], [0, 1.1], [-.4, .7], [-.8, .05]];
        paint(P2(u, up), { wash: C.beak, fill: mixCol(C.beak, PAL.ink, .2), fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7, curv: .35 });
        if (!V.one && ['smile', 'cat', 'smirk'].includes(m)) for (const s of [-1, 1]) inkLine(P2(u, [[s * .62, .0], [s * .9, -.25]]), sw * .7, PAL.ink, 'ink', 0);
        if (!V.one && ['frown', 'wobble'].includes(m)) for (const s of [-1, 1]) inkLine(P2(u, [[s * .62, .05], [s * .85, .3]]), sw * .7, PAL.ink, 'ink', 0);
        pop();
        if (o.hat === 'bowtie') { const bx2 = V.fx * .5; for (const s of [-1, 1]) paint(P2(u, [[bx2, -2.1], [bx2 + s * 1.1, -2.6], [bx2 + s * 1.1, -1.6]]), { wash: PAL.ochre, fill: PAL.violet, fillOp: 50, ink: PAL.ink, sw: sw * .5 }); paint(ellPts(bx2 * u, -2.1 * u, .3 * u, .3 * u, 10), { wash: PAL.violet, ink: PAL.ink, sw: sw * .45 }); }
      }
      if (o.hat && !['mask', 'masq', 'bowtie', 'cat'].includes(o.hat)) headHat(u, o.hat, sw, cx, -8.0, .6);
    },
  };

  // ===============================================================================================================
  const DESIGNS = { folio: FOLIO, bob: BOB, pip: PIP, polly: POLLY };
  const D = DESIGNS[AGENT_DESIGN] || FOLIO;
  if (!DESIGNS[AGENT_DESIGN]) console.warn(`agent.js: unknown AGENT_DESIGN "${AGENT_DESIGN}", using folio`);
  window.AGENT = { design: D.name, title: D.title, what: D.what, get hook() { return faceMap(D); } };
  window.agentFace = () => ({ ...faceMap(D), eyeX: D.face.ex, eyeY: D.face.ey });
  window.agentDraw = (x, y, u, o) => rig(D, x, y, u, o);
  window.agentDesigns = Object.fromEntries(Object.entries(DESIGNS).map(([k, d]) => [k, (x, y, u, o) => rig(d, x, y, u, o)]));

  // Replace the engine's Clawd everywhere: clawd() (and so dancer(), crewEnd(), the sheets) draws the agent, and
  // tintCols() (which emotions() uses for its colour cross-fade) works on the agent's palette.
  clawd = window.agentDraw;
  tintCols = o => agentTint(D, o);

  // ---------------------------------------------------------------------------------------------------------------
  // model sheets (labels are fine here)
  const label = (txt, x, y, size = 18, alpha = .75) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha });
  const floor = y => { boilSeed('afloor' + y); inkLine([[40, y + 6], [W / 2, y + 4], [W - 40, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5); };
  const wrench = (u, sw) => {
    push(); rotate(-1.35);
    paint(rrPts(-.25 * u, -.22 * u, 2.6 * u, .44 * u, .2 * u), { wash: '#8C98A8', fill: '#5A6678', fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .6 });
    paint(P2(u, [[2.2, -.55], [3.1, -.75], [3.35, -.25], [2.75, -.2], [2.75, .2], [3.35, .25], [3.1, .75], [2.2, .55]]), { wash: '#8C98A8', fill: '#5A6678', fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .6, curv: .2 });
    pop();
  };
  const letterProp = (u, sw) => { paint(rectPts(0, -1.4 * u, 2.4 * u, 1.8 * u), { wash: CREW.cream, ink: PAL.ink, sw }); inkLine([[.3 * u, -.8 * u], [.8 * u, -1 * u], [1.2 * u, -.5 * u], [1.7 * u, -1.1 * u], [2 * u, -.4 * u]], sw * 1.1, CREW.teal, 'ink', .4); };
  const burglar = (uu, sw) => {   // handson00's mask, drawn for Clawd's face: it lands on the agent's eyes
    paint(rectPts(-5.15 * uu, -7.1 * uu, 10.3 * uu, 1.9 * uu), { wash: '#1A2233', ink: PAL.ink, sw: sw * .6 });
    for (const ex of [-2.5, 2.5]) { paint(ellPts(ex * uu, -6.15 * uu, .9 * uu, .55 * uu, 10), { wash: CREW.pale, ink: null }); paint(ellPts(ex * uu, -6.15 * uu, .35 * uu, .35 * uu, 8), { wash: PAL.ink, ink: null }); }
  };

  LOOPS.agent = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    label(D.title.toUpperCase(), 230, 50, 40, .9); label(D.what, 230, 92, 18);
    label(`agent(x, y, u, o)  —  AGENT_DESIGN = '${D.name}'`, 1600, 52, 18);
    // row 1: key views, walk, flip, and with the Navigator (s = .75u)
    const y1 = 340, u1 = 16;
    [['front', {}], ['q', { view: 'q' }], ['side', { view: 'side' }], ['qback', { view: 'qback' }], ['back', { view: 'back' }], ['q, flip', { view: 'q', flip: true }]]
      .forEach(([n, v], i) => { const x = 120 + i * 222; clawd(x, y1, u1, { ...feel('neutral', t, { seed: i }), ...v, boilKey: 'av' + i }); label(n, x, y1 + 34); });
    clawd(1455, y1, u1, { ...move('walk', t), eyes: 'normal', view: 'side', boilKey: 'awk' }); label('walk', 1455, y1 + 34);
    nav(1640, y1, u1 * .75, { ...navFeel('happy', t), view: 'q', boilKey: 'anv' });
    clawd(1800, y1, u1, { ...feel('neutral', t), flip: true, view: 'q', boilKey: 'anc' }); label('with the Navigator (s = .75u)', 1720, y1 + 34);
    floor(y1);
    // row 2: emotions
    const y2 = 600, names = ['neutral', 'happy', 'excited', 'laugh', 'love', 'proud', 'sad', 'cry', 'angry', 'furious', 'scared', 'surprised', 'confused', 'thinking', 'idea', 'dizzy', 'cool', 'sleepy'];
    names.forEach((n, i) => { const x = 60 + i * 104; clawd(x, y2, 9, { ...feel(n, t, { seed: i }), boilKey: 'ae' + i }); label(n, x, y2 + 28, 15); });
    floor(y2);
    // row 3: props, hooks, hats, chomp, the tint cross-fade
    const y3 = 975, u3 = 12, ph = t % 4;
    const row = [
      ['armR: wrench', x => clawd(x, y3, u3, { ...feel('determined', t), aR: 1.0 + .3 * Math.sin(t * 6), armR: wrench, boilKey: 'ap0' })],
      ['armL: letter', x => clawd(x, y3, u3, { ...feel('happy', t), view: 'q', aL: .7, armL: letterProp, boilKey: 'ap1' })],
      ['draw: mask', x => clawd(x, y3, u3, { ...feel('mischief', t), hat: 'beanie', draw: burglar, boilKey: 'ap2' })],
      ['hat: hard', x => clawd(x, y3, u3, { ...feel('proud', t), hat: 'hard', boilKey: 'ap3' })],
      ['hat: party', x => clawd(x, y3, u3, { ...feel('excited', t), hat: 'party', emote: null, boilKey: 'ap4' })],
      ['bowtie', x => clawd(x, y3, u3, { ...feel('happy', t), hat: 'bowtie', view: 'q', boilKey: 'ap5' })],
      ['lid (chomp)', x => clawd(x, y3, u3, { ...feel('hopeful', t), lid: .25 + .25 * Math.abs(Math.sin(t * 7)), aL: 1.2, aR: 1.2, emote: null, boilKey: 'ap6' })],
      ['furious', x => clawd(x, y3, u3, { ...feel('furious', t), boilKey: 'ap7' })],
      ['tint cross-fade', x => clawd(x, y3, u3, { ...emotions(ph, [[0, 'neutral'], [1, 'angry'], [2.4, 'love'], [3.6, 'neutral']]), boilKey: 'ap8' })],
    ];
    row.forEach(([n, f], i) => { const x = 115 + i * 210; f(x); label(n, x, y3 + 34, 16); });
    floor(y3);
  };
  LOOPS.agent.len = 4;

  // all four designs side by side, a few poses each
  LOOPS.agents = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    Object.entries(window.agentDesigns).forEach(([k, fn], r) => {
      const fy = 220 + r * 262, d = DESIGNS[k];
      label(d.title.toUpperCase() + (k === D.name ? '  (in use)' : ''), 120, fy - 190, 24, .9);
      nav(120, fy, 12, { ...navFeel('neutral', t, { seed: r }), view: 'q', boilKey: 'gn' + r });
      [['front', {}], ['q', { view: 'q' }], ['side', { view: 'side', ...move('walk', t) }], ['back', { view: 'back' }]].forEach(([n, v], i) => fn(290 + i * 200, fy, 16, { ...feel('neutral', t, { seed: i }), ...v, boilKey: `gv${r}${i}` }));
      fn(1100, fy, 16, { ...feel('happy', t), hat: 'hard', boilKey: 'gh' + r });
      fn(1300, fy, 16, { ...feel('furious', t), boilKey: 'gf' + r });
      fn(1500, fy, 16, { ...feel('determined', t), aR: 1, armR: wrench, boilKey: 'gw' + r });
      fn(1700, fy, 16, { ...feel('mischief', t), hat: 'beanie', draw: burglar, boilKey: 'gm' + r });
      floor(fy);
    });
  };
  LOOPS.agents.len = 4;
})();

// agent(x, y, u, o): the series' agent (the same as clawd(), which this file replaces). See the header.
function agent(x, y, u, o = {}) { return clawd(x, y, u, o); }
