// ch01.js: Chapter 1 · Introduction (v3: AI narrator, cold open about how the channel is made). Storyboard: video/storyboards/ch01.md
// Every event is keyed to a spoken word (wt(beat, word)), so a re-voiced beat carries the pictures with it.
(() => {
  function mic(x, y, s, col = INK.navy) { paint(rrPts(x - 34 * s, y - 120 * s, 68 * s, 110 * s, 34 * s), { fill: col }); for (let i = 0; i < 4; i++) paint(rectPts(x - 22 * s, y - 100 * s + i * 20 * s, 44 * s, 6 * s), { fill: INK.paper, tone: .8 }); arcLine(x, y - 60 * s, 52 * s, 9 * s, col, { a0: 0, a1: Math.PI }); paint(rectPts(x - 5 * s, y - 8 * s, 10 * s, 60 * s), { fill: col }); paint(rrPts(x - 40 * s, y + 48 * s, 80 * s, 14 * s, 7 * s), { fill: col }); }
  function wave(x, y, w, h, t, col, o = {}) { const n = 26; for (let i = 0; i < n; i++) { const a = Math.abs(Math.sin(i * 1.7 + t * 6) * Math.sin(i * .45 + t * 2.3)), bh = h * (.15 + .85 * a) * (o.k ?? 1); paint(rrPts(x + i * w / n, y - bh / 2, w / n * .6, bh, 5), { fill: col, over: o.over, tone: o.tone }); } }
  // ---------- shot D · skill: not a weak model; missing context, too-wide scope, the wheel ----------
  function shotSkill(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('skill');
    riso({ seed: 6 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    paint(rectPts(-200, 880, W + 400, 400), { fill: 'yellow', tone: .4 });
    const tSkill = wt('skill', 'skill'), tWeak = wt('skill', 'weak'), tCtx = wt('skill', 'context'), tScope = wt('skill', 'scoped'),
      tRun = wt('skill', 'run'), tWheel = wt('skill', 'wheel'), tComp = wt('skill', 'complicated'), tObv = wt('skill', 'obvious');
    // "a skill": a level bar fills up
    const kS = stamp(t, tSkill - .2) * (1 - ease(seg(t, tWeak - .3, tWeak)));
    if (kS > .01) { paint(rrPts(560, 440, 800 * kS, 90, 45), { fill: INK.navy, tone: .25 }); paint(rrPts(560, 440, 800 * kS * ease(seg(t, tSkill, tSkill + 1.4)), 90, 45), { fill: INK.gold }); for (let i = 1; i < 5; i++) paint(rectPts(560 + i * 160 * kS, 440, 8, 90), { fill: INK.paper }); }
    // not a weak model: Clawd is strong
    const kW = stamp(t, tWeak - .3) * (1 - ease(seg(t, tCtx - .5, tCtx - .1)));
    if (kW > .01) { glow(960, 700, 300 * kW, 'yellow', .8); clawd(960, 880, 30 * kW, { ...feel('proud', t), ...move('bounce', t, 3) }); }
    // three causes, one panel each
    const panel = (x, t0, fn) => { const k = stamp(t, t0 - .15); if (k <= .01) return; push(); translate(x, 520); scale(k); paint(rrPts(-240, -270, 480, 540, 36), { fill: INK.navy, tone: .12 }); fn(t - t0); pop(); };
    // missing context: an agent in a fog, scattered pages that fly in and stack
    panel(390, tCtx, dt => {
      const k = ease(seg(dt, .5, 1.8));
      for (let i = 0; i < 5; i++) { const a = i * 1.3, x = lerp(Math.cos(a) * 180, -40 + i * 6, k), y = lerp(-150 + Math.sin(a) * 80, -150 - i * 12, k); push(); translate(x, y); rotate(lerp(a, 0, k) * .5); card(-60, -40, 120, 80, INK.orange, { tone: .9 }); pop(); }
      paint(ellPts(0, 110, 200, 90, 36), { fill: INK.navy, tone: .35 * (1 - k), over: true });
      clawd(0, 210, 13, { ...feel(k > .7 ? 'happy' : 'confused', T) });
    });
    // scoped too wide: a huge box shrinks to a task-sized one
    panel(960, tScope, dt => {
      const k = backOut(seg(dt, .6, 1.3)), w = lerp(420, 150, k), h = lerp(460, 150, k);
      paint(rrPts(-w / 2, -h / 2 - 20, w, h, 20), { fill: INK.orange, tone: lerp(.5, 1, k) });
      inkLine([[-w / 2 - 10, -h / 2 - 30], [w / 2 + 10, -h / 2 - 30]], 1.2, INK.navy, 'ink', 0, { force: true });
      if (k > .9) paint(ribbon([[-40, -20], [-10, 15], [50, -50]], 16), { fill: INK.yellow, over: true });
    });
    // let it run, or take the wheel back
    panel(1530, tRun - .2, dt => {
      const grab = t > tWheel;
      helm(0, -30, 120, grab ? .3 * Math.exp(-(t - tWheel) * 2) * Math.sin((t - tWheel) * 12) : (t - tRun) * 3, INK.gold, INK.navy);
      if (grab) skipper(0, 250, 12, { ...SKIP_POSES.steer, mood: 'focused', t, noShadow: true });
      else clawd(0, 250, 12, { ...feel('excited', T), ...move('run', T, 2) });
    });
    // not complicated, just not obvious: a light comes on over the Skipper
    const kO = stamp(t, tComp - .2);
    if (kO > .01) {
      skipper(960, 1060 + 300 * (1 - kO), 16, skipAct(t, [[tComp - .2, 'shrug', { mood: 'neutral' }], [tObv, 'pointUp', { mood: 'grin' }]]));
      if (t > tObv) { const kl = ease(seg(t, tObv, tObv + .4)); glow(1060, 700, 200 * kl, 'yellow', .9); paint(ellPts(1060, 700, 44 * kl, 44 * kl, 28), { fill: INK.yellow }); paint(rrPts(1060 - 18 * kl, 744, 36 * kl, 22 * kl, 5), { fill: INK.navy }); }
    }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 1420, cy: 360 });
    tOut('ink', lt, dur, { cols: ['yellow', 'orange'] });
  }

  // ---------- shot E · honest: the field moves fast; nobody has it figured out; principles, failures left in ----------
  function book(cx, cy, s, open, t) {
    push(); translate(cx, cy); scale(s);
    if (open > .02) {
      paint([[-10, -200], [-10, 200], [-340 * open, 220], [-340 * open, -180]], { fill: INK.paper, ink: INK.navy, sw: 1.2 });
      paint([[10, -200], [10, 200], [340 * open, 220], [340 * open, -180]], { fill: INK.paper, ink: INK.navy, sw: 1.2 });
    }
    const cw = 330 * (1 - open);
    if (cw > 4) { paint(rrPts(-cw / 2, -220, cw, 440, 14), { fill: INK.navy }); if (cw > 200) { helm(0, -30, 90 * (cw / 330), t * .3); paint(rrPts(-110, 130, 220, 26, 8), { fill: INK.gold }); } }
    pop();
  }
  function shotHonest(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('honest');
    riso({ seed: 10 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .25 });
    const tNo = wt('honest', 'hype'), tFast = wt('honest', 'moves'), tNobody = wt('honest', 'nobody'), tMe = wt('honest', 'figured'), tPrin = wt('honest', 'principles'),
      tHeld = wt('honest', 'held'), tFail = wt('honest', 'failures');
    // the field moves fast: calendar pages tear off faster and faster
    const kCal = stamp(t, b.start + .1) * (1 - ease(seg(t, tNobody - .5, tNobody - .1)));
    if (kCal > .01) {
      const cx = 960, cy = 470, rate = 1 + 8 * ease(seg(t, tFast - .6, tFast + 1.2)), ph = (t - b.start) * rate;
      push(); translate(cx, cy); scale(kCal);
      paint(rrPts(-200, -220, 400, 440, 20), { fill: INK.paper, ink: INK.navy, sw: 1.4 });
      paint(rrPts(-200, -220, 400, 90, 20), { fill: INK.orange });
      for (let i = 0; i < 6; i++) paint(rrPts(-150 + (i % 3) * 110, -90 + Math.floor(i / 3) * 110, 80, 80, 10), { fill: INK.navy, tone: .5 });
      for (let j = 0; j < 3; j++) { const f = frac(ph + j / 3); push(); translate(260 * f + 40 * j, -200 - 300 * f * f); rotate(f * 2.4); paint(rrPts(-200, -20, 400, 300, 16), { fill: INK.paper, ink: INK.navy, sw: 1, alpha: 1 - f }); pop(); }
      pop();
    }
    // nobody has it all figured out: a chart with a big question mark; the Skipper shrugs at "me"
    const kQ = stamp(t, tNobody - .2) * (1 - ease(seg(t, tPrin - .5, tPrin - .1)));
    if (kQ > .01) {
      push(); translate(960, 470); scale(kQ);
      paint(rrPts(-330, -230, 660, 460, 20), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
      for (let i = 0; i < 10; i++) { const p = [-260 + i * 58, 40 * Math.sin(i * 1.3)]; paint(ellPts(p[0], p[1] + 80, 7, 7, 10), { fill: INK.navy }); }
      type('?', 60, -30, 300, INK.orange, { pop: seg(t, tNobody, tNobody + .3) });
      pop();
    }
    // principles that held up; the failures left in
    const kB = stamp(t, tPrin - .2);
    if (kB > .01) {
      const open = ease(seg(t, tPrin, tPrin + .6));
      const up = ease(seg(t, tNo - .5, tNo - .1)); book(960, lerp(470, 330, up), lerp(1.1, .75, up) * kB, open, t);
      if (t > tHeld && t < tNo - .5) for (let i = 0; i < 4; i++) { const k = stamp(t, tHeld + i * .15); if (k > .01) paint(ribbon([[-190, -110 + i * 80], [-160, -80 + i * 80], [-100, -140 + i * 80]].map(([x, y]) => [960 + x * 1.1, 470 + y * 1.1]), 14 * k), { fill: INK.green }); }
      if (t > tFail && t < tNo - .5) for (let i = 0; i < 3; i++) { const k = stamp(t, tFail + .1 + i * .18); if (k > .01) { const x = 1100 + i * 50, y = 380 + i * 90; card(x - 70, y - 35, 140, 70, INK.orange, { tone: .9, bars: false }); stampX(x, y, 26, k, INK.navy); } }
    }
    // no hype, no doom, no prompt tricks: the book slides up, three things get stamped out
    if (t > tNo - .4) {
      const items = [[wt('honest', 'hype'), 640, (x, y) => megaphone(x, y, .7)], [wt('honest', 'doom'), 960, (x, y) => doom(x, y, .65, t)], [wt('honest', 'tricks'), 1280, (x, y) => pot(x, y, .7)]];
      for (const [t0, x, fn] of items) { const k = stamp(t, t0 - .25); if (k <= .01) continue; push(); translate(x, 880); scale(k); translate(-x, -880); paint(ellPts(x, 880, 150, 150, 40), { fill: INK.paper, ink: INK.navy, sw: 1.2 }); fn(x, 880); pop(); stampX(x, 880, 110, stamp(t, t0 + .15)); }
    }
    skipper(360, 1060, 18, skipAct(t, [[b.start, 'think', { mood: 'thinking', lookX: .8 }], [tMe - .1, 'shrug', { mood: 'grin' }], [tPrin, 'present', { mood: 'neutral' }], [tFail, 'hips', { mood: 'proud' }]]));
    camEnd();
    tIn('ink', lt, { cols: ['yellow', 'orange'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 960, cy: 540 });
  }
  function iconKeys(x, y, s) { paint(rrPts(x - 60 * s, y - 36 * s, 120 * s, 72 * s, 10 * s), { fill: INK.gold }); for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) paint(rectPts(x - 48 * s + c * 20 * s, y - 26 * s + r * 20 * s, 14 * s, 13 * s), { fill: INK.navy }); }
  function iconCode(x, y, s) { inkLine([[x - 20 * s, y - 40 * s], [x - 55 * s, y], [x - 20 * s, y + 40 * s]], 2.6 * s, INK.orange, 'ink', 0, { force: true }); inkLine([[x + 20 * s, y - 40 * s], [x + 55 * s, y], [x + 20 * s, y + 40 * s]], 2.6 * s, INK.orange, 'ink', 0, { force: true }); }
  function iconShip(x, y, s) { paint([[x - 60 * s, y], [x + 60 * s, y], [x + 40 * s, y + 34 * s], [x - 40 * s, y + 34 * s]], { fill: INK.navy }); paint([[x, y - 70 * s], [x, y - 6 * s], [x + 50 * s, y - 6 * s]], { fill: INK.orange }); }
  function iconBulb(x, y, s) { glow(x, y - 10 * s, 70 * s, 'yellow', .8); paint(ellPts(x, y - 10 * s, 38 * s, 38 * s, 28), { fill: INK.yellow }); paint(rrPts(x - 16 * s, y + 24 * s, 32 * s, 22 * s, 5 * s), { fill: INK.navy }); }
  function iconEye(x, y, s) { paint(through([[x - 60 * s, y], [x, y - 36 * s], [x + 60 * s, y], [x, y + 36 * s], [x - 60 * s, y]]), { fill: INK.paper, ink: INK.navy, sw: 1.4 * s }); paint(ellPts(x, y, 22 * s, 22 * s, 20), { fill: INK.navy }); }
  function iconTalk(x, y, s) { paint(rrPts(x - 60 * s, y - 44 * s, 120 * s, 80 * s, 26 * s), { fill: INK.paper, ink: INK.navy, sw: 1.4 * s }); paint([[x - 30 * s, y + 30 * s], [x - 44 * s, y + 62 * s], [x - 6 * s, y + 34 * s]], { fill: INK.navy }); for (let i = 0; i < 3; i++) paint(ellPts(x - 30 * s + i * 30 * s, y - 4 * s, 9 * s, 9 * s, 12), { fill: INK.orange }); }
  function shotLoop(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('loop');
    riso({ seed: 8 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    const tBreak = wt('loop', 'changing'), tAg = wt('loop', 'agents'), tTests = wt('loop', 'tests'), tEighty = wt('loop', 'more'),
      tThink = wt('loop', 'describing'), tRev = wt('loop', 'reviewing'), tSteer = wt('loop', 'steering');
    const brk = seg(t, tBreak, tBreak + .9), toBars = ease(seg(t, tEighty - .4, tEighty));
    // the old loop: a ring with three nodes, turning steadily; it cracks and flies apart
    if (brk < 1) {
      const spin = (t - b.start) * .5, R = 300, cx = 960, cy = 540;
      for (let i = 0; i < 3; i++) {
        const a0 = spin + i * TAU / 3 + .25, a1 = a0 + TAU / 3 - .5, fly = easeIn(brk) * 900, am = (a0 + a1) / 2;
        push(); translate(Math.cos(am) * fly, Math.sin(am) * fly + 300 * easeIn(brk)); rotate(brk * (i - 1) * .8);
        arcLine(cx, cy, R, 34, INK.navy, { a0, a1, cap: 'round' });
        const na = spin + i * TAU / 3, nx = cx + Math.cos(na) * R, ny = cy + Math.sin(na) * R;
        paint(ellPts(nx, ny, 86, 86, 40), { fill: INK.paper, ink: INK.navy, sw: 1.2 });
        [iconKeys, iconCode, iconShip][i](nx, ny, .8);
        pop();
      }
    }
    // agents at work: Clawd in the middle, files flipping around him, tests going green
    const ka = seg(t, tAg - .3, tAg) * (1 - toBars);
    if (ka > 0) {
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * .5, x = 960 + Math.cos(a) * 470, y = 620 + Math.sin(a) * 380;
        const fl = Math.abs(Math.cos((t - tAg) * 3 + i)), k = stamp(t, tAg + i * .12) * (1 - toBars);
        if (k > .01) { push(); translate(x, y); scale(k * fl, k); card(-60, -80, 120, 160, i % 2 ? INK.navy : INK.orange, { tone: .9 }); pop(); }
        const kt = stamp(t, tTests + i * .1) * (1 - toBars);
        if (kt > .01) paint(ribbon([[x - 40, y + 10], [x - 10, y + 40], [x + 50, y - 30]].map(([px, py]) => [x + (px - x) * kt, y + (py - y) * kt]), 20), { fill: INK.yellow, over: true });
      }
      clawd(960, 800 + 400 * toBars, 24, { ...emotions(t, [[tAg, 'determined'], [tTests, 'proud']]), ...move('bounce', t, 2) });
    }
    // eighty percent: a tall keyboard bar shrinks, three bars grow — thinking, reviewing, steering
    if (toBars > 0) {
      const base = 900, sh = ease(seg(t, tEighty, tThink));
      const bar = (x, h, col, k) => { if (k > .01) paint(rrPts(x - 90, base - h * k, 180, h * k + 10, 14), { fill: col }); };
      bar(440, lerp(600, 150, sh), INK.navy, toBars); iconKeys(440, base - lerp(600, 150, sh) * toBars - 80, .9 * toBars);
      const grow = [[tThink, 820, iconTalk], [tRev, 1120, iconEye], [tSteer, 1420, (x, y, s) => helm(x, y, 55 * s, t * .6)]];
      for (const [tg, x, ic] of grow) { const k = backOut(seg(t, tg, tg + .5)); bar(x, 480, INK.gold, k); if (k > .01) ic(x, base - 480 * k - 90, k); }
      paint(rectPts(260, base, 1400, 14), { fill: INK.navy });
    }
    if (toBars > 0) skipper(1740, 1040 + 500 * (1 - backOut(toBars)), 17, skipAct(t, [[tEighty - .4, 'type', { mood: 'focused' }], [tThink, 'think', { mood: 'thinking', lookX: -.8 }], [tRev, 'present', { mood: 'grin', flip: false }], [tSteer, 'steer', { mood: 'happy' }]]));
    else if (brk < .3) skipper(1680, 1040, 17, skipAct(t, [[b.start, 'type', { mood: 'focused', lookX: -.6 }], [tBreak - .1, 'stand', { mood: 'surprised', lookX: -.8 }]]));
    camEnd();
    tIn('ink', lt, { cols: ['federal', 'yellow'] });
    tOut('dots', lt, dur, { col: 'federal', cx: 1420, cy: 360 });
  }

  function pot(x, y, s) { paint(rrPts(x - 110 * s, y - 70 * s, 220 * s, 150 * s, 30 * s), { fill: INK.navy }); paint(rrPts(x - 140 * s, y - 86 * s, 280 * s, 26 * s, 13 * s), { fill: INK.navy }); for (let i = 0; i < 3; i++) inkLine(through([[x - 40 * s + i * 40 * s, y - 110 * s], [x - 30 * s + i * 40 * s, y - 150 * s], [x - 45 * s + i * 40 * s, y - 190 * s]]), 1.2 * s, INK.navy, 'ink', .5, { force: true, tone: .6 }); }
  function megaphone(x, y, s) { paint([[x - 110 * s, y - 30 * s], [x + 90 * s, y - 110 * s], [x + 90 * s, y + 110 * s], [x - 110 * s, y + 30 * s]], { fill: INK.navy }); paint(rrPts(x - 150 * s, y - 36 * s, 50 * s, 72 * s, 10 * s), { fill: INK.navy }); for (let i = 0; i < 3; i++) arcLine(x + 110 * s, y, (40 + i * 34) * s, 9 * s, INK.orange, { a0: -.6, a1: .6 }); }
  function doom(x, y, s, t) { for (const [dx, dy, r] of [[-70, 0, 70], [0, -40, 90], [80, 0, 70]]) paint(ellPts(x + dx * s, y + dy * s, r * 1.2 * s, r * s, 36), { fill: INK.dark }); paint([[x - 10 * s, y + 50 * s], [x + 30 * s, y + 50 * s], [x + 5 * s, y + 110 * s], [x + 35 * s, y + 110 * s], [x - 20 * s, y + 200 * s], [x - 5 * s, y + 130 * s], [x - 30 * s, y + 130 * s]], { fill: INK.yellow, over: false }); }
  function gear(x, y, r, rot, col) { const P = []; for (let i = 0; i < 48; i++) { const a = rot + i / 48 * TAU, rr = (Math.floor(i / 3) % 2) ? r : r * .8; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } paint(P, { fill: col }); paint(ellPts(x, y, r * .35, r * .35, 28), { fill: INK.paper }); }
  // ---------- COLD OPEN · the crew that made this video, and the one engineer steering it ----------
  const note = (x, y, s, col) => { paint(ellPts(x, y, 16 * s, 12 * s, 16, 0, -.4), { fill: col }); paint(rectPts(x + 12 * s, y - 60 * s, 6 * s, 60 * s), { fill: col }); paint([[x + 12 * s, y - 60 * s], [x + 40 * s, y - 44 * s], [x + 18 * s, y - 40 * s]], { fill: col }); };
  function shotMaking(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('cold');
    const inK = (a, c) => 1 - backOut(seg(lt, a, c));
    riso({ seed: 3, shift: lt < 1.3 ? { yellow: [0, -1300 * inK(0, .5)], orange: [-2300 * inK(.2, .75), 0], federal: [2300 * inK(.4, .95), 0] } : {} });
    const tScript = wt('cold', 'script'), tVoice = wt('cold', 'voice'), tAnim = wt('cold', 'animation'), tMusic = wt('cold', 'music'),
      tNone = wt('cold', 'none'), tRas = wt('cold', 'rasmus'), tSteer = wt('cold', 'steered'), tEng = wt('cold', 'engineering');
    const pull = ease(seg(t, tEng - .3, tEng + 1.2));
    camBegin(960, lerp(700, 600, pull), lerp(1.38, .96, pull) + .03 * ease(seg(t, 0, tEng)));
    paint(rectPts(-400, -400, W + 800, H + 800), { fill: 'yellow', ramp: { from: [0, 900], to: [0, 0], a: .55, b: .08 } });
    paint(rectPts(-400, 930, W + 800, 600), { fill: INK.navy, tone: .85 });
    for (let i = 0; i < 5; i++) paint(rectPts(-400 + (i * 131 + t * 40) % 260, 960 + i * 38, W + 800, 8), { fill: INK.yellow, tone: .5, over: true });
    // the ship reveals itself on the pull-back: sails behind, hull under the deck
    if (pull > 0) {
      for (const [x, h] of [[520, 560], [1400, 620]]) { const k = backOut(seg(t, tEng - .1, tEng + .5)); paint(rectPts(x - 8, 900 - h * k, 16, h * k), { fill: INK.dark }); paint([[x + 14, 880 - h * k], [x + 14, 860], [x + 14 + 300 * k, 860]], { fill: INK.paper, ink: INK.navy, sw: 1.4 }); }
      paint([[60, 900], [1860, 900], [1720, 1040], [200, 1040]], { fill: INK.brown, alpha: pull });
    }
    paint(rectPts(80, 880, 1760, 24), { fill: INK.dark });   // the deck
    const helmRot = t > tSteer ? .6 * Math.sin((t - tSteer) * 2.2) : 0, sway = helmRot * 8;
    // four crew stations, each doing one part of the video
    const crew = [[300, tScript, 'script'], [640, tVoice, 'voice'], [1280, tAnim, 'anim'], [1620, tMusic, 'music']];
    for (const [x, t0, kind] of crew) {
      const k = stamp(t, Math.min(t0 - .25, 1.2 + crew.findIndex(c => c[0] === x) * .25)); if (k <= .01) continue;
      const bob = sway * (x < 960 ? 1 : -1);
      push(); translate(x, 880); scale(k); translate(-x, -880);
      if (kind === 'script') { for (let i = 0; i < 4; i++) { const f = frac(t * .7 + i / 4); push(); translate(x - 40 + 90 * f, 640 - 200 * f); rotate(f); card(-50, -36, 100, 72, INK.paper, { bar: INK.navy }); pop(); } card(x - 90, 700, 180, 120, INK.navy, { tone: .9 }); }
      if (kind === 'voice') { mic(x - 70, 780, .75); wave(x - 20, 690, 200, 80, t, INK.orange); }
      if (kind === 'anim') { const r = t * 3; for (const dy of [0, 70]) { paint(ellPts(x, 690 + dy, 60, 30, 28), { fill: dy ? INK.orange : INK.navy }); inkLine([[x - 60 * Math.cos(r), 690 + dy], [x + 60 * Math.cos(r), 690 + dy]], 1, INK.paper, 'ink', 0, { force: true }); } const f = frac(t * .5); card(x + 40 + 140 * f, 640, 110, 150, INK.paper, { bars: false }); paint(ellPts(x + 95 + 140 * f, 715, 30, 30, 20), { fill: INK.gold }); }
      if (kind === 'music') for (let i = 0; i < 3; i++) { const f = frac(t * .6 + i / 3); note(x - 40 + i * 40, 740 - 160 * f, 1.1, [INK.orange, INK.navy, INK.gold][i]); }
      clawd(x, 880, 13, { ...feel(kind === 'music' ? 'happy' : 'determined', T), ...move('bounce', T + x, 2), dx: bob / 13 });
      pop();
      // the lines from the helm: nobody works alone
      if (t > tNone) { const kl = ease(seg(t, tNone, tNone + .8)); const P = []; for (let i = 0; i <= 12; i++) { const f = i / 12 * kl; P.push([lerp(960, x, f), lerp(710, 760, f) - 60 * Math.sin(Math.PI * f)]); } inkLine(P, .9, INK.navy, 'ink', .5, { force: true, tone: .8 }); }
    }
    // the Skipper at the helm, in the middle; his name when it's said
    const ks = stamp(t, .15);
    if (ks > .01) {
      skipper(960, 880, 19, { ...skipAct(t, [[b.start, 'steer', { mood: 'focused' }], [tRas, 'steer', { mood: 'grin' }]]), dy: 300 * (1 - ks) });
      helm(960, 880 - 8.6 * 19 + 300 * (1 - ks), 78, helmRot, INK.gold, INK.navy);
      if (t > tRas - .1) { glow(960, 600, 260 * ease(seg(t, tRas - .1, tRas + .4)), 'yellow', .7); const kn = stamp(t, tRas - .1); paint(rrPts(960 - 130 * kn, 920, 260 * kn, 56, 28), { fill: INK.navy }); if (kn > .5) type('RASMUS', 960, 949, 34, INK.gold, { spacing: .12 }); }
    }
    camEnd();
    tOut('ink', lt, dur, { cols: ['orange', 'federal'] });
  }

  // ---------- SERIES · a free book, one short film per chapter ----------
  function topicIcon(i, s) {
    const c = INK.navy;
    if (i === 0) for (let j = 0; j < 3; j++) card(-40 + j * 6, -34 + j * 12, 80, 40, [INK.orange, INK.gold, c][j], { bars: false });     // context
    if (i === 1) { paint(rrPts(-34, -6, 68, 52, 8), { fill: INK.gold }); arcLine(0, -6, 24, 10, c, { a0: Math.PI, a1: TAU }); }       // guardrails
    if (i === 2) { inkLine([[-20, 40], [-20, -40]], 1.4, c, 'ink', 0, { force: true }); inkLine(through([[-20, 20], [10, 0], [22, -30]]), 1.4, c, 'ink', .5, { force: true }); for (const [x, y] of [[-20, 40], [-20, -40], [22, -34]]) paint(ellPts(x, y, 13, 13, 12), { fill: INK.orange }); }   // git
    if (i === 3) paint(ribbon([[-34, 0], [-8, 26], [38, -30]], 16), { fill: INK.green });                                             // tests
    if (i === 4) { paint(rrPts(-40, -44, 80, 88, 8), { fill: c }); paint(rectPts(-4, -44, 8, 88), { fill: INK.gold }); }               // memory: the log
    if (i === 5) { paint([[-38, -38], [38, -38], [38, 4], [0, 44], [-38, 4]], { fill: c, curv: .3 }); paint(ribbon([[-14, 0], [-2, 12], [18, -12]], 8), { fill: INK.paper }); }   // security
    if (i === 6) for (let j = 0; j < 3; j++) paint(rrPts(-46 + j * 32, -10 - (j % 2) * 14, 26, 22, 5), { fill: INK.orange });          // fleets
    if (i === 7) { paint(ellPts(0, 0, 40, 40, 28), { fill: INK.paper, ink: c, sw: 1.2 }); stampX(0, 0, 26, 1, INK.orange); }          // when not to
  }
  function shotSeries(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('series');
    riso({ seed: 12 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .22 });
    paint(rectPts(-200, 930, W + 400, 400), { fill: INK.navy, tone: .8 });
    const tFree = wt('series', 'free'), tRas = wt('series', 'rasmus'), tFilm = wt('series', 'film'), tMin = wt('series', 'minutes');
    const words = ['context', 'guardrails', 'get', 'tests', 'memory', 'security', 'fleets', 'not'];
    // the book, with a FREE stamp; the author beside it
    const kb = stamp(t, b.start + .2);
    book(420, 470, .9 * kb, ease(seg(t, tFilm, tFilm + .5)) * .4, t);
    if (t > tFree) { const k = stamp(t, tFree); push(); translate(420, 610); rotate(-.2); scale(k); paint(rrPts(-150, -48, 300, 96, 16), { fill: INK.orange, over: true }); type('FREE', 0, 4, 76, INK.paper); pop(); }
    if (t > tRas - .3) skipper(150, 1000, 15, { ...skipAct(t, [[tRas - .3, 'wave', { mood: 'happy' }], [tFilm, 'present', { mood: 'grin' }]]), dy: 300 * (1 - stamp(t, tRas - .3)) });
    // a film strip runs out of the book, and chapter films stamp in as the topics are named
    const kf = ease(seg(t, tFilm - .2, tFilm + .5));
    if (kf > 0) { paint(rectPts(560, 200, 1300 * kf, 40), { fill: INK.dark }); for (let i = 0; i < 20; i++) { const x = 560 + ((i * 70 + t * 120) % 1300); if (x < 560 + 1300 * kf) paint(rrPts(x, 212, 36, 16, 6), { fill: INK.paper }); } }
    for (let i = 0; i < 8; i++) {
      const k = stamp(t, wt('series', words[i]) - .1); if (k <= .01) continue;
      const x = 840 + (i % 4) * 250, y = 400 + Math.floor(i / 4) * 290;
      push(); translate(x, y); scale(k); rotate((hash(i) - .5) * .08);
      paint(rrPts(-110, -120, 220, 240, 18), { fill: INK.paper, ink: INK.navy, sw: 1.3 });
      paint(rrPts(-110, -120, 220, 56, 18), { fill: [INK.navy, INK.orange, INK.gold, INK.green][i % 4] });
      type(String([3, 4, 5, 6, 8, 10, 13, 17][i]).padStart(2, '0'), -60, -91, 34, INK.paper);
      push(); translate(0, 30); topicIcon(i, 1); pop();
      pop();
    }
    // about two minutes each: a stopwatch
    if (t > tMin - .2) { const k = stamp(t, tMin - .2); push(); translate(1740, 150); scale(k); arcLine(0, 0, 60, 14, INK.navy); paint(rectPts(-12, -92, 24, 22), { fill: INK.navy }); arcLine(0, 0, 38, 30, INK.orange, { a0: -Math.PI / 2, a1: -Math.PI / 2 + TAU * seg(t, tMin, tMin + 1) * .8 }); pop(); }
    camEnd();
    tIn('dots', lt, { col: 'federal', cx: 960, cy: 540 });
    tOut('iris', lt, dur, { cx: 960, cy: 600 });
  }

  // ---------- NEXT · the teaser for Chapter 2, subscribe, the free book ----------
  function shotNext(T0, lt, dur) {
    const T = T0, t = onTwos(T), b = beat('next');
    riso({ seed: 14 });
    camBegin(960, 540, 1 + .02 * ease(seg(T, b.start, b.end)));
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.paper });
    const tAgent = wt('next', 'agent'), tHint = wt('next', 'hint'), tNever = wt('next', 'never'), tSub = wt('next', 'subscribe'), tFree = wt('next', 'free');
    const up = ease(seg(t, tSub - .5, tSub));
    // the question and the hint: Clawd reaches for a terminal behind glass
    push(); translate(0, -1100 * up);
    const kq = stamp(t, tAgent - .2);
    if (kq > .01) type('?', 660, 420, 320 * kq, INK.orange);
    const kt = stamp(t, tHint - .1);
    if (kt > .01) { push(); translate(1280, 520); scale(kt); paint(rrPts(-200, -140, 400, 280, 18), { fill: INK.navy }); for (let i = 0; i < 4; i++) paint(rrPts(-160, -80 + i * 44, 200 + 100 * hash(i), 16, 8), { fill: INK.paper, tone: .8 }); paint(rectPts(-240, -170, 12, 340), { fill: INK.navy, tone: .35, over: true }); pop(); stampX(1280, 520, 150, stamp(t, tNever + .2)); }
    clawd(900, 880, 20, { ...emotions(t, [[b.start, 'thinking'], [tHint, 'determined'], [tNever + .3, 'surprised']]), dx: t > tHint && t < tNever + .3 ? 3 : 0 });
    pop();
    // subscribe: a big printed button, pressed; the Skipper points at it
    if (up > 0) {
      const press = t > tSub + .6 ? 1 - .12 * Math.exp(-(t - tSub - .6) * 8) * Math.sin((t - tSub - .6) * 30) : 1, k = stamp(t, tSub - .2);
      push(); translate(960, 420); scale(k * press);
      paint(rrPts(-380, -80, 760, 160, 80), { fill: INK.orange });
      type('SUBSCRIBE', 60, 4, 80, INK.paper);
      paint(through([[-320, 30], [-320, -10], [-300, -40], [-270, -40], [-250, -10], [-250, 30]]), { fill: INK.paper }); paint(ellPts(-285, 42, 10, 10, 10), { fill: INK.paper });
      pop();
      const ku = stamp(t, tFree - .1);
      if (ku > .01) { type('THEAGENTICCREW.COM', 960, 660, 76 * ku, INK.navy, { spacing: .02 }); paint(rectPts(960 - 440 * ku, 710, 880 * ku, 10), { fill: INK.gold }); }
      skipper(280, 1060, 18, { ...skipAct(t, [[tSub - .3, 'point', { mood: 'happy' }], [tFree, 'present', { mood: 'grin' }]]), dy: 400 * (1 - k) });
      clawd(1640, 1040, 20, { ...feel('excited', T), ...move('hop', T, 3), flip: true, dy: 400 * (1 - k) });
    }
    camEnd();
    tIn('iris', lt, { cx: 960, cy: 600 });
    tOut('feed', lt, dur);
  }

  function shotIdent(T0, lt, dur) { ident(T0, lt, dur, TIMING.chapter, TIMING.title); tIn('ink', lt, { cols: ['orange', 'federal'] }); tOut('ink', lt, dur, { cols: ['federal', 'yellow'] }); }
  function shotEnd(T0, lt, dur) {
    endCard(T0, lt, dur, '02', TIMING.next);
    tIn('feed', lt);
    if (lt > dur - .7) dotDissolve(seg(lt, dur - .7, dur) * .5, 'federal');
  }

  const B = TIMING.beats;
  shots([
    [0, shotMaking],
    [B.cold.end + .5, shotIdent],
    [shotAt('loop'), shotLoop],
    [shotAt('skill'), shotSkill],
    [shotAt('honest'), shotHonest],
    [shotAt('series'), shotSeries],
    [shotAt('next'), shotNext],
    [B.next.end + .9, shotEnd],
  ]);
})();
