// thumbnail for chapter 11: agents don't ask clarifying questions, they guess
LOOPS.thumb11 = t => {
  thumbBase(41, '11 · INTENT');
  type("AGENTS DON'T ASK.", 1370, 360, 78, INK.navy);
  type('THEY', 1370, 510, 150, INK.orange);
  type('THEY', 1379, 519, 150, INK.navy, { over: true, tone: .45 });
  type('GUESS.', 1370, 690, 150, INK.navy);
  // Clawd, confidently wrong: a dart stuck beside the target
  for (let r = 3; r > 0; r--) paint(ellPts(560, 360, 50 * r, 50 * r, 48), { fill: r % 2 ? INK.orange : INK.paper });
  push(); translate(760, 200); rotate(-.6); paint(ribbon([[-90, 0], [0, 0]], 16, 8), { fill: INK.navy }); paint([[-100, -14], [-120, 0], [-100, 14], [-80, 0]], { fill: INK.gold }); pop();
  clawd(430, 1000, 40, { ...feel('smug', 0) });
};
LOOPS.thumb11.len = 2;
