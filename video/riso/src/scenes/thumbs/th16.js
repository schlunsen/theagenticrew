// thumbnail for chapter 16 · When Agents Get It Wrong: a one-line fix, thirty-two files changed
LOOPS.thumb16 = t => {
  thumbBase(161, '16 · WRONG');
  type('ONE-LINE FIX.', 1370, 360, 92, INK.navy);
  type('32 FILES', 1370, 530, 150, INK.orange);
  type('32 FILES', 1380, 540, 150, INK.navy, { over: true, tone: .45 });
  type('CHANGED.', 1370, 720, 130, INK.navy);
  // a storm of files around a startled agent
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = 300 + 60 * hash(i), x = 480 + Math.cos(a) * r, y = 560 + Math.sin(a) * r * .8; push(); translate(x, y); rotate((hash(i + 3) - .5) * .8); paint([[-40, -52], [18, -52], [40, -30], [40, 52], [-40, 52]], { fill: i % 3 ? INK.paper : INK.orange, ink: INK.navy, sw: 1.2 }); for (let j = 0; j < 3; j++) paint(rectPts(-26, -14 + j * 20, 52, 7), { fill: INK.navy, tone: .6 }); pop(); }
  clawd(480, 760, 26, { ...feel('surprised', 0), emote: '!', emoteK: 1, emoteAge: 1 });
};
LOOPS.thumb16.len = 2;
