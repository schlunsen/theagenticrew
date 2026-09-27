// cast.js: model sheet for the series cast: the Skipper (engineer) in his named poses, Clawd (agent) for scale.
(() => {
  LOOPS.cast = t => {
    riso({ seed: 21, inks: ['federal', 'orange', 'yellow'] });
    paint(rectPts(-200, -200, W + 400, H + 400), { fill: 'yellow', tone: .16 });
    const row = [['stand', 'neutral'], ['wave', 'happy'], ['point', 'grin'], ['think', 'thinking'], ['shrug', 'worried'], ['cheer', 'starstruck']];
    row.forEach(([pose, mood], i) => {
      const x = 180 + i * 312, y = 500;
      paint(rectPts(x - 150, y + 4, 300, 8), { fill: INK.navy, tone: .4 });
      skipper(x, y, 24, { ...SKIP_POSES[pose], mood, t });
      type(pose.toUpperCase() + ' · ' + mood, x, y + 44, 22, INK.navy, { spacing: .08 });
    });
    const row2 = [['steer', 'focused'], ['facepalm', 'sad'], ['hips', 'proud'], ['type', 'focused'], ['present', 'happy']];
    row2.forEach(([pose, mood], i) => {
      const x = 180 + i * 312, y = 1010;
      paint(rectPts(x - 150, y + 4, 300, 8), { fill: INK.navy, tone: .4 });
      skipper(x, y, 24, { ...SKIP_POSES[pose], mood, t });
      if (pose === 'steer') helm(x, y - 8.6 * 24, 70, t * .5);
      type(pose.toUpperCase() + ' · ' + mood, x, y + 44 - 1080 + 1080, 22, INK.navy, { spacing: .08 });
    });
    // Clawd beside the Skipper at the same unit, for scale
    skipper(1650, 1010, 24, { ...SKIP_POSES.present, mood: 'happy', t });
    clawd(1800, 1010, 24 * .75, { ...feel('happy', t), flip: true });
  };
  LOOPS.cast.len = 4;
})();
