// thumbnail for chapter 03: an agent is only as good as what it can see
LOOPS.thumb03 = t => {
  thumbBase(36, '');
  paint(rrPts(60, 50, 440, 80, 40), { fill: INK.navy }); type('03 · CONTEXT', 280, 92, 44, INK.gold, { spacing: .06 });   // a wider chip for the longer label
  type('ONLY AS GOOD AS', 1370, 360, 72, INK.navy);
  type('WHAT IT', 1370, 510, 150, INK.orange);
  type('WHAT IT', 1380, 520, 150, INK.navy, { over: true, tone: .45 });
  type('CAN SEE.', 1370, 700, 140, INK.navy);
  // Clawd inside the model's window, lit up
  glow(470, 640, 360, 'yellow', .9);
  paint(rrPts(170, 300, 600, 560, 30), { fill: INK.navy, tone: .14 });
  paint(rrPts(170, 300, 600, 56, 24), { fill: INK.navy });
  for (let i = 0; i < 3; i++) paint(ellPts(210 + i * 34, 328, 10, 10, 12), { fill: [INK.orange, INK.yellow, INK.green][i] });
  inkLine([[170, 340], [170, 830], [200, 860], [740, 860], [770, 830], [770, 340]], 1.8, INK.navy, 'ink', .4, { force: true });
  [[260, 420, INK.orange], [380, 400, INK.gold], [500, 425, INK.green], [620, 405, INK.navy]].forEach(([x, y, c], i) => { push(); translate(x, y); rotate((i % 2 ? 1 : -1) * .08); card(-50, -38, 100, 76, c, { bars: false }); pop(); });
  clawd(470, 820, 30, { ...feel('starstruck', 0) });
};
LOOPS.thumb03.len = 2;
