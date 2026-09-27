// brand.js: YouTube channel art for The Agentic Crew, printed in the series inks. Render with --loop=<name> --stills=1.
//   avatar       profile picture (the centre 1080×1080 is cropped to 800×800; YouTube shows it as a circle)
//   avatarHelm   profile picture, alternative: the helm from the book cover
//   banner       channel banner (upscaled to 2560×1440; everything important sits in the 1546×423 safe area)
//   thumb01      thumbnail for Chapter 1 (downscaled to 1280×720)
(() => {
  const ground = () => paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .2 });

  LOOPS.avatar = t => {
    riso({ seed: 31 });
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.navy });
    paint(ellPts(960, 540, 470, 470, 90), { fill: 'yellow', ramp: { c: [960, 540], r0: 0, r: 520, a: 1, b: .25 } });
    helm(960, 560, 360, .2, INK.gold, INK.orange);
    paint(ellPts(960, 560, 250, 250, 60), { fill: 'yellow', tone: .35 });
    skipper(960, 1335, 60, { ...SKIP_POSES.stand, mood: 'grin', noShadow: true, t: 0 });
  };
  LOOPS.avatar.len = 2;

  LOOPS.avatarHelm = t => {
    riso({ seed: 32 });
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: INK.navy });
    paint(ellPts(960, 540, 470, 470, 90), { fill: 'yellow', ramp: { c: [960, 540], r0: 120, r: 520, a: .7, b: 0 }, over: true });
    helm(960, 540, 330, .2, INK.gold, INK.orange);
  };
  LOOPS.avatarHelm.len = 2;

  LOOPS.banner = t => {
    riso({ seed: 33 });
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', ramp: { from: [0, 760], to: [0, 150], a: .75, b: .08 } });
    paint(ellPts(960, 760, 260, 260, 80), { fill: INK.orange, over: true });
    paint(rectPts(-200, 740, W + 400, 600), { fill: INK.gold });
    for (let i = 0; i < 6; i++) paint(rectPts(-200 + (i * 97) % 200, 770 + i * 55, W + 400, 10), { fill: INK.navy, tone: .5, over: true });
    // the chapters as islands along the horizon, far out
    for (let i = 0; i < 9; i++) { const x = 120 + i * 210 + 30 * hash(i); if (x > 380 && x < 1540) continue; paint(ellPts(x, 800 + 20 * hash(i + 3), 70, 26, 28), { fill: INK.green }); inkLine([[x, 790], [x, 730]], .9, INK.dark, 'ink', 0, { force: true }); paint([[x, 730], [x + 40, 742], [x, 754]], { fill: INK.orange }); }
    type('THE AGENTIC CREW', 960, 480, 98, INK.navy);
    type('THE AGENTIC CREW', 965, 485, 98, INK.orange, { over: true, tone: .5 });
    type('ENGINEERING WITH AI AGENTS · ONE CHAPTER AT A TIME', 960, 580, 27, INK.navy, { spacing: .12 });
    skipper(190, 735, 17, { ...SKIP_POSES.wave, mood: 'happy', t: .3 });
    clawd(1740, 735, 15, { ...feel('happy', 0), flip: true });
  };
  LOOPS.banner.len = 2;

  // a thumbnail frame: rays, a paper panel for the words, a chapter chip
  const thumbBase = (seed, chip) => {
    riso({ seed });
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .9 });
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, a2 = a + TAU / 28; paint([[520, 620], [520 + Math.cos(a) * 1600, 620 + Math.sin(a) * 1600], [520 + Math.cos(a2) * 1600, 620 + Math.sin(a2) * 1600]], { fill: INK.orange, tone: .45, over: true }); }
    paint(rrPts(870, 250, 1000, 600, 30), { fill: INK.paper });
    paint(rrPts(60, 50, 360, 80, 40), { fill: INK.navy });
    type(chip, 240, 92, 44, INK.gold, { spacing: .06 });
  };
  window.thumbBase = thumbBase;   // chapter thumbnails in src/scenes/thumbs/ use it
  // Chapter 1: the channel's hook — the video was made by agents, steered by one engineer
  LOOPS.thumb01 = t => {
    thumbBase(34, '01 · INTRO');
    type('MADE BY', 1370, 350, 92, INK.navy);
    type('AI AGENTS.', 1370, 500, 150, INK.orange);
    type('AI AGENTS.', 1379, 509, 150, INK.navy, { over: true, tone: .45 });
    type('STEERED BY ONE HUMAN', 1370, 700, 58, INK.navy, { spacing: .03 });
    skipper(470, 1180, 40, { ...SKIP_POSES.steer, mood: 'grin', noShadow: true, t: 0 });
    helm(470, 1180 - 8.2 * 40, 92, .3, INK.gold, INK.navy);
    clawd(130, 1000, 14, { ...feel('happy', 0) }); clawd(800, 1000, 14, { ...feel('excited', 0), flip: true });
  };
  LOOPS.thumb01.len = 2;
  // Chapter 2: the model only asks; the harness does
  LOOPS.thumb02 = t => {
    thumbBase(35, '02 · AGENTS');
    type('THE MODEL', 1370, 360, 96, INK.navy);
    type('ONLY', 1370, 520, 170, INK.orange);
    type('ONLY', 1380, 530, 170, INK.navy, { over: true, tone: .45 });
    type('ASKS.', 1370, 720, 150, INK.navy);
    clawd(470, 1000, 48, { ...feel('determined', 0) });
    paint(rrPts(330, 240, 300, 170, 50), { fill: INK.paper, ink: INK.navy, sw: 2 }); paint([[400, 400], [380, 470], [450, 405]], { fill: INK.paper });
    type('{ }', 480, 325, 110, INK.orange);
  };
  LOOPS.thumb02.len = 2;
})();
