// skipper.js: the engineer — "the Skipper" — the human half of the cast, drawn to sit next to Clawd (the agent).
// Flat riso figure: navy peacoat with gold buttons, a white-crowned captain's cap, a short navy beard, peach skin
// printed as an orange+yellow halftone. Everything goes through paint()/inkLine(), so it registers and overprints.
//
//   skipper(x, y, u, o)   (x, y) = ground point between the boots; u = size unit (the figure is ~17u tall, 7u wide).
//                          Sizes: wide 10–14, medium 18–24, close-up 34–50. Clawd at the same u is about half his height.
//   o: pose  { dy, sq, lean (rad), flip, hands: { L: [x, y] | angle, R: ... } }   hand targets are in body units
//             (origin at the feet, y up is negative, like Clawd), reached with a two-bone arm; a number is a hanging angle.
//      face  { mood, lookX, lookY, blink }  — mood: neutral, happy, grin, proud, surprised, worried, sad, focused,
//             thinking, starstruck, shout, sleepy
//      extras{ prop: (u) => {} drawn in the right hand's space, capTip (0..1) }
//   SKIP_POSES: named poses to spread in: skipper(x, y, u, { ...SKIP_POSES.point, mood: 'happy' }).
//   skipAct(t, [[t0, 'pose', {mood...}], ...]) blends between named poses over .3 s with a little overshoot.
const SKIN = { orange: .32, yellow: .42 }, SKIN_DK = { orange: .55, yellow: .6 }, COAT = { federal: 1 },
  COAT_DK = { federal: 1, orange: .55 }, BRASS = { orange: .55, yellow: 1 }, BEARD = { federal: .85, orange: .45 };

const SKIP_POSES = {
  stand:   { hands: { L: .12, R: .12 } },
  hips:    { hands: { L: [-3.6, -6.6], R: [3.6, -6.6] } },
  wave:    { hands: { L: .12, R: [4.6, -15.2] }, wave: 1 },
  point:   { hands: { L: .15, R: [7.4, -10.6] }, point: 'R' },
  pointUp: { hands: { L: .15, R: [4.4, -16.4] }, point: 'R' },
  think:   { hands: { L: [1.2, -7.4], R: [0.9, -11.2] } },
  shrug:   { hands: { L: [-4.8, -9.8], R: [4.8, -9.8] }, sq: .02 },
  cheer:   { hands: { L: [-3.6, -17.4], R: [3.6, -17.4] } },
  steer:   { hands: { L: [-2.2, -8.6], R: [2.2, -8.6] } },
  facepalm:{ hands: { L: .1, R: [0.3, -13.2] } },
  type:    { hands: { L: [-1.6, -7.2], R: [1.6, -7.2] }, typing: 1 },
  present: { hands: { L: .15, R: [6.6, -8.4] } },
};

// mood → face parts
const SKIP_FACES = {
  neutral:   { eyes: 'dot', brows: 0, mouth: 'smile' },
  happy:     { eyes: 'happy', brows: .25, mouth: 'grin' },
  grin:      { eyes: 'dot', brows: .15, mouth: 'grin' },
  proud:     { eyes: 'closed', brows: .2, mouth: 'smile' },
  surprised: { eyes: 'wide', brows: .7, mouth: 'o' },
  worried:   { eyes: 'dot', brows: -.6, mouth: 'wobble' },
  sad:       { eyes: 'dot', brows: -.7, mouth: 'frown' },
  focused:   { eyes: 'narrow', brows: -.25, mouth: 'flat' },
  thinking:  { eyes: 'dot', brows: .35, mouth: 'flat', look: [.5, -.6] },
  starstruck:{ eyes: 'star', brows: .6, mouth: 'open' },
  shout:     { eyes: 'narrow', brows: -.5, mouth: 'open' },
  sleepy:    { eyes: 'closed', brows: 0, mouth: 'flat' },
};

function skipper(x, y, u, o = {}) {
  const F = SKIP_FACES[o.mood || 'neutral'] || SKIP_FACES.neutral;
  const lookX = o.lookX ?? (F.look ? F.look[0] : 0), lookY = o.lookY ?? (F.look ? F.look[1] : 0);
  const sq = o.sq || 0, P = (px, py) => [px * u, py * u];
  push(); translate(x, y + (o.dy || 0)); if (o.flip) scale(-1, 1); scale(1 + sq * .6, 1 - sq); rotate(o.lean || 0);

  // shadow on the ground
  if (!o.noShadow) paint(ellPts(0, 0, 4 * u, .7 * u, 28), { fill: COAT, tone: .25, over: true });
  // legs and boots
  for (const s of [-1, 1]) {
    paint(rrPts((s < 0 ? -1.7 : .35) * u, -3.4 * u, 1.35 * u, 3 * u, .4 * u), { fill: COAT_DK });
    paint(rrPts((s < 0 ? -2.1 : .2) * u, -1.05 * u, 1.9 * u, 1.05 * u, .5 * u), { fill: COAT_DK });
  }
  // the coat: a peacoat that flares a little to the hem
  paint([P(-2.7, -10.6), P(2.7, -10.6), P(3.5, -3.0), P(-3.5, -3.0)].map(p => p), { fill: COAT, curv: .12 });
  paint([P(-1.3, -10.6), P(1.3, -10.6), P(0, -8.2)], { fill: INK.paper });                 // shirt V
  paint([P(-.35, -10.3), P(.35, -10.3), P(.2, -8.9), P(0, -8.5), P(-.2, -8.9)], { fill: BRASS });  // tie
  for (const bx of [-.95, .95]) for (const by of [-7.4, -5.9, -4.4]) paint(ellPts(bx * u, by * u, .3 * u, .3 * u, 12), { fill: BRASS });

  // arms (two bones each), drawn behind the head, in front of the coat
  const hands = o.hands || SKIP_POSES.stand.hands, hp = {}, arms = [];
  for (const side of ['L', 'R']) {
    const s = side === 'L' ? -1 : 1, S = [2.55 * s, -9.9], L1 = 2.6, L2 = 2.5;
    let T = hands[side];
    if (typeof T === 'number' || T == null) { const a = T ?? .12; T = [S[0] + s * Math.sin(a) * (L1 + L2 - .05), S[1] + Math.cos(a) * (L1 + L2 - .05)]; }
    if (o.wave && side === 'R') T = [T[0] + .9 * Math.sin(T_WAVE(o)), T[1]];
    if (o.typing) T = [T[0], T[1] + .35 * Math.sin((o.t || 0) * 22 + s)];
    const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.min(L1 + L2 - .02, Math.max(.5, Math.hypot(dx, dy))), th = Math.atan2(dy, dx);
    const al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const e1 = th + al, e2 = th - al, E1 = [S[0] + Math.cos(e1) * L1, S[1] + Math.sin(e1) * L1], E2 = [S[0] + Math.cos(e2) * L1, S[1] + Math.sin(e2) * L1];
    const E = (E1[0] * s > E2[0] * s) ? E1 : E2;                      // elbow bends away from the body
    const H = [S[0] + Math.cos(th) * d, S[1] + Math.sin(th) * d];
    const C = [lerp(E[0], H[0], .78), lerp(E[1], H[1], .78)];          // cuff
    hp[side] = H;
    arms.push({ side, S, E, H, C, front: H[1] < -10.6 && Math.abs(H[0]) < 2.6 });
  }
  const drawArm = ({ side, S, E, H, C }) => {
    paint(ribbon([P(...S), P(...E), P(...C)], 1.25 * u, 1.05 * u), { fill: COAT, curv: .4 });
    paint(ribbon([P(...C), P(lerp(C[0], H[0], .45), lerp(C[1], H[1], .45))], 1.08 * u, 1.05 * u), { fill: BRASS });
    paint(ellPts(H[0] * u, H[1] * u, .72 * u, .72 * u, 18), { fill: SKIN });
    if (o.point === side) { const a = Math.atan2(H[1] - E[1], H[0] - E[0]); paint(ribbon([P(...H), P(H[0] + Math.cos(a) * 1.2, H[1] + Math.sin(a) * 1.2)], .42 * u, .36 * u), { fill: SKIN }); }
  };
  arms.filter(a => !a.front).forEach(drawArm);
  if (o.prop) { push(); translate(hp.R[0] * u, hp.R[1] * u); o.prop(u); pop(); }

  // head
  const hx = lookX * .25 * u, hy = -12.9 * u + lookY * .12 * u, tilt = (o.tilt || 0) + lookX * .04;
  push(); translate(hx, hy); rotate(tilt);
  paint(rrPts(-.8 * u, 1.4 * u, 1.6 * u, 1.3 * u, .4 * u), { fill: SKIN_DK });              // neck
  paint(rrPts(-2.25 * u, -2.5 * u, 4.5 * u, 4.9 * u, 2 * u), { fill: SKIN });               // face
  paint(ellPts(-2.3 * u, -.1 * u, .5 * u, .7 * u, 14), { fill: SKIN_DK });                  // ears
  paint(ellPts(2.3 * u, -.1 * u, .5 * u, .7 * u, 14), { fill: SKIN_DK });
  // beard: jaw to jaw under the mouth
  paint([P(-2.25, .1), P(-2.1, 1.2), P(-1.1, 2.55), P(0, 2.8), P(1.1, 2.55), P(2.1, 1.2), P(2.25, .1), P(1.3, .9), P(0, .75), P(-1.3, .9)], { fill: BEARD, curv: .5 });
  // eyes
  const ex = lookX * .35, ey = lookY * .25, eyeY = -.55;
  const blink = o.blink ? 1 : 0;
  for (const s of [-1, 1]) {
    const cx = (s * .95 + ex) * u, cy = (eyeY + ey) * u;
    const kind = blink ? 'closed' : F.eyes;
    if (kind === 'dot') paint(ellPts(cx, cy, .3 * u, .42 * u, 14), { fill: COAT_DK });
    else if (kind === 'wide') { paint(ellPts(cx, cy, .5 * u, .6 * u, 16), { fill: INK.paper }); paint(ellPts(cx, cy, .28 * u, .34 * u, 12), { fill: COAT_DK }); }
    else if (kind === 'narrow') paint(rrPts(cx - .4 * u, cy - .12 * u, .8 * u, .26 * u, .12 * u), { fill: COAT_DK });
    else if (kind === 'happy') inkLine([[cx - .38 * u, cy + .12 * u], [cx, cy - .22 * u], [cx + .38 * u, cy + .12 * u]], u * .06, COAT_DK, 'ink', .6, { force: true });
    else if (kind === 'closed') inkLine([[cx - .38 * u, cy], [cx, cy + .18 * u], [cx + .38 * u, cy]], u * .06, COAT_DK, 'ink', .6, { force: true });
    else if (kind === 'star') paint(starPts(cx, cy, .55 * u, .42, 4), { fill: BRASS });
    // brows: + raises them, - knits them toward the middle
    const b = F.brows, by = cy - (.75 + .25 * Math.max(0, b)) * u;
    paint(ribbon([[cx - s * .45 * u, by + (b < 0 ? -b * .28 * u : 0)], [cx + s * .45 * u, by - (b < 0 ? -b * .12 * u : b * .1 * u)]].map(p => s < 0 ? p : p), .22 * u), { fill: BEARD });
  }
  paint(ellPts(0, .15 * u, .38 * u, .3 * u, 12), { fill: SKIN_DK });                         // nose
  // mouth, knocked out of the beard so it reads
  const my = 1.1 * u;
  const mouth = { smile: () => inkLine([[-.6 * u, my - .05 * u], [0, my + .22 * u], [.6 * u, my - .05 * u]], u * .09, INK.paper, 'ink', .6, { force: true }),
    grin: () => paint([[-.8 * u, my - .1 * u], [.8 * u, my - .1 * u], [.45 * u, my + .45 * u], [-.45 * u, my + .45 * u]], { fill: INK.paper, curv: .4 }),
    o: () => paint(ellPts(0, my + .1 * u, .32 * u, .4 * u, 14), { fill: COAT_DK }),
    open: () => paint(ellPts(0, my + .1 * u, .55 * u, .45 * u, 16), { fill: COAT_DK }),
    flat: () => inkLine([[-.5 * u, my], [.5 * u, my]], u * .09, INK.paper, 'ink', 0, { force: true }),
    frown: () => inkLine([[-.55 * u, my + .2 * u], [0, my - .05 * u], [.55 * u, my + .2 * u]], u * .09, INK.paper, 'ink', .6, { force: true }),
    wobble: () => inkLine([[-.6 * u, my], [-.3 * u, my - .12 * u], [0, my], [.3 * u, my - .12 * u], [.6 * u, my]], u * .08, INK.paper, 'ink', .3, { force: true }) };
  (mouth[F.mouth] || mouth.smile)();
  // the cap: white crown, navy band, dark peak, brass badge; it can tip
  push(); translate(0, -2.1 * u); rotate(-.35 * (o.capTip || 0)); translate(0, -.8 * u * (o.capTip || 0));
  paint([P(-2.5, -.2), P(2.5, -.2), P(3.0, -1.9), P(-3.0, -1.9)], { fill: INK.paper, curv: .25, ink: COAT_DK, sw: u * .03 });
  paint(rrPts(-2.55 * u, -.55 * u, 5.1 * u, .75 * u, .2 * u), { fill: COAT });
  paint([P(-2.3, .05), P(2.3, .05), P(1.9, .75), P(-1.9, .75)], { fill: COAT_DK, curv: .3 });
  inkLine([[-2.2 * u, -.2 * u], [2.2 * u, -.2 * u]], u * .05, BRASS, 'ink', 0, { force: true });
  paint(starPts(0, -1.05 * u, .5 * u, .45, 5), { fill: BRASS });
  pop();
  pop();
  arms.filter(a => a.front).forEach(drawArm);      // a hand at the face goes in front of it
  pop();
}
const T_WAVE = o => (o.t || 0) * 9;

// Acted pose changes: [[t0, 'pose', { mood, ... }], ...] → options to spread into skipper(), with a .3 s blend and
// a little overshoot on the hands, plus a small dip (anticipation) at each change.
function skipAct(t, keys) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [t0, name, extra = {}] = keys[i], prev = keys[Math.max(0, i - 1)];
  const A = SKIP_POSES[prev[1]] || SKIP_POSES.stand, B = SKIP_POSES[name] || SKIP_POSES.stand;
  const k = i === 0 ? 1 : backOut(seg(t, t0, t0 + .3));
  const hands = {};
  for (const s of ['L', 'R']) {
    const h = (P, side) => { const v = P.hands[side]; if (Array.isArray(v)) return v; const a = v ?? .12, sgn = side === 'L' ? -1 : 1; return [2.55 * sgn + sgn * Math.sin(a) * 5.05, -9.9 + Math.cos(a) * 5.05]; };
    const a = h(A, s), b = h(B, s); hands[s] = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  }
  const dip = i === 0 ? 0 : Math.sin(Math.PI * seg(t, t0 - .08, t0 + .22)) * .03;
  return { ...B, ...extra, hands, sq: (B.sq || 0) + dip, t };
}
