// thumbnail for chapter 05: one branch per agent task
LOOPS.thumb05 = t => {
  thumbBase(38, '05 · GIT');
  type('ONE TASK.', 1370, 360, 96, INK.navy);
  type('ONE', 1370, 520, 170, INK.orange);
  type('ONE', 1380, 530, 170, INK.navy, { over: true, tone: .45 });
  type('BRANCH.', 1370, 710, 140, INK.navy);
  // a main rail with an agent riding its own branch
  const rail = (x0, x1, y, w) => paint(rrPts(x0, y - w / 2, x1 - x0, w, w / 2), { fill: INK.navy });
  const dot = (x, y, r, c) => paint(ellPts(x, y, r, r, 24), { fill: c, ink: INK.navy, sw: 1.4 });
  rail(40, 820, 900, 22);
  for (let i = 0; i < 5; i++) dot(90 + i * 170, 900, 34, INK.gold);
  inkLine(through([[260, 900], [360, 720], [480, 560], [760, 560]]), 5, INK.orange, 'ink', 0, { force: true });
  dot(560, 560, 34, INK.orange); dot(720, 560, 34, INK.orange);
  clawd(560, 520, 22, { ...feel('excited', 0), noShadow: true });
};
LOOPS.thumb05.len = 2;
