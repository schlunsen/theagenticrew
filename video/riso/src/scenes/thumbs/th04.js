// thumbnail for chapter 04: a sandbox gives the agent the freedom to be wrong
LOOPS.thumb04 = t => {
  thumbBase(37, '');
  paint(rrPts(60, 50, 500, 80, 40), { fill: INK.navy }); type('04 · GUARDRAILS', 310, 92, 44, INK.gold, { spacing: .06 });   // a wider chip for the longer label
  type('GIVE IT THE', 1370, 360, 84, INK.navy);
  type('FREEDOM', 1370, 520, 170, INK.orange);
  type('FREEDOM', 1380, 530, 170, INK.navy, { over: true, tone: .45 });
  type('TO BE WRONG.', 1370, 710, 110, INK.navy);
  // Clawd in a sandbox, a toppled tower beside him
  paint(rrPts(90, 800, 760, 200, 24), { fill: INK.brown });
  paint(rrPts(118, 822, 704, 150, 16), { fill: INK.yellow });
  for (let i = 0; i < 40; i++) paint(ellPts(140 + 660 * hash(i + 3), 840 + 110 * hash(i + 60), 7, 7, 8), { fill: INK.navy, tone: .4, over: true });
  [[610, 790, .3, INK.orange], [700, 800, 1.2, INK.navy], [660, 720, .7, INK.gold], [760, 740, -.4, INK.green]].forEach(([x, y, r, c]) => { push(); translate(x, y); rotate(r); paint(rrPts(-55, -38, 110, 76, 8), { fill: c }); pop(); });
  clawd(360, 830, 30, { ...feel('laugh', 0) });
};
LOOPS.thumb04.len = 2;
