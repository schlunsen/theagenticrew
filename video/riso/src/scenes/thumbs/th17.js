// thumbnail for chapter 17 · When Not to Use Agents: knowing when to put the agent away
LOOPS.thumb17 = t => {
  thumbBase(171, '17 · WHEN');
  type('KNOW WHEN', 1370, 360, 104, INK.navy);
  type('TO PUT IT', 1370, 530, 140, INK.orange);
  type('TO PUT IT', 1380, 540, 140, INK.navy, { over: true, tone: .45 });
  type('AWAY.', 1370, 720, 150, INK.navy);
  // the Skipper closing a toolbox on a waving agent
  skipper(300, 1040, 30, { ...SKIP_POSES.present, mood: 'grin', noShadow: true, t: 0 });
  clawd(640, 700, 16, { ...feel('happy', 0), aR: 1.5, noShadow: true });
  push(); translate(620, 800); scale(1.3);
  paint(rrPts(-170, -110, 340, 150, 16), { fill: INK.orange }); paint(rrPts(-170, -60, 340, 16, 6), { fill: INK.brown });
  push(); translate(-170, -110); rotate(-.9); paint(rrPts(0, -30, 340, 36, 12), { fill: INK.brown }); pop();
  pop();
};
LOOPS.thumb17.len = 2;
