// thumbnail for chapter 07: boring code bases make great agents — a tidy wall of matching cards beside a messy heap
LOOPS.thumb07 = t => {
  thumbBase(37, '07 · RULES');
  type('MAKE YOUR', 1370, 360, 96, INK.navy);
  type('CODE', 1370, 520, 170, INK.orange);
  type('CODE', 1380, 530, 170, INK.navy, { over: true, tone: .45 });
  type('BORING.', 1370, 710, 140, INK.navy);
  // a tidy wall of matching bricks, and the agent proud in front of it
  const TRIO = [INK.navy, INK.paper, INK.green];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) paint(rrPts(110 + c * 160 + (r % 2) * 80, 560 - r * 100, 148, 88, 10), { fill: TRIO[(c + r) % 3], ink: INK.navy, sw: 1.4 });
  paint(starPts(470, 170, 80, .45, 5), { fill: INK.paper, ink: INK.navy, sw: 2 });
  clawd(470, 1030, 30, { ...feel('proud', 0) });
};
LOOPS.thumb07.len = 2;
