// thumbnail for chapter 09: the agent unchained and plugged in, seeing beyond the repo
LOOPS.thumb09 = t => {
  thumbBase(39, '09 · MCP');
  type('SEE BEYOND', 1370, 360, 96, INK.navy);
  type('THE REPO.', 1370, 520, 130, INK.orange);
  type('THE REPO.', 1379, 529, 130, INK.navy, { over: true, tone: .45 });
  type('PLUG IN WITH MCP', 1370, 720, 62, INK.navy, { spacing: .03 });
  // the broken chain on the ground, the plug and cable in front
  for (let i = 0; i < 5; i++) arcLine(130 + i * 34, 1010 + 10 * Math.sin(i), 16, 8, INK.gold);
  for (let i = 0; i < 3; i++) arcLine(700 + i * 34, 1020 - 6 * i, 16, 8, INK.gold);
  clawd(430, 1000, 42, { ...feel('excited', 0) });
  inkLine(through([[640, 820], [720, 700], [760, 520], [700, 380]]), 2, INK.navy, 'ink', .5, { force: true });
  push(); translate(700, 330); rotate(-Math.PI / 2); paint(rrPts(-70, -40, 100, 80, 14), { fill: INK.orange }); paint(rectPts(30, -26, 50, 14), { fill: INK.navy }); paint(rectPts(30, 12, 50, 14), { fill: INK.navy }); pop();
};
LOOPS.thumb09.len = 2;
