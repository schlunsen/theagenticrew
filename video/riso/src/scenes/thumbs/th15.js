// thumbnail for chapter 15 · Building Your Own Agents: the loop is small; the work is everything around it
LOOPS.thumb15 = t => {
  thumbBase(151, '15 · BUILD');
  type('THE LOOP IS', 1370, 360, 96, INK.navy);
  type('THE EASY', 1370, 530, 150, INK.orange);
  type('THE EASY', 1380, 540, 150, INK.navy, { over: true, tone: .45 });
  type('PART.', 1370, 720, 150, INK.navy);
  // a small loop with the agent in it, ringed by what it really needs
  arcLine(480, 600, 330, 70, INK.gold, { over: true });
  arcLine(480, 600, 170, 26, INK.navy, { a0: -1.2, a1: -1.2 + TAU * .82, cap: 'round' });
  clawd(480, 700, 17, { ...feel('determined', 0), noShadow: true });
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * TAU / 6, x = 480 + Math.cos(a) * 330, y = 600 + Math.sin(a) * 330; paint(ellPts(x, y, 64, 64, 32), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); paint(ellPts(x, y, 30, 30, 20), { fill: [INK.orange, INK.navy, INK.green, INK.orange, INK.navy, INK.green][i] }); }
};
LOOPS.thumb15.len = 2;
