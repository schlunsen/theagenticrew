// thumbnail for chapter 10: a stranger's text steering the agent — plan as if injection will happen
LOOPS.thumb10 = t => {
  thumbBase(40, '10 · RISK');
  type('YOUR AGENT', 1370, 350, 96, INK.navy);
  type('OBEYS', 1370, 510, 170, INK.orange);
  type('OBEYS', 1380, 520, 170, INK.navy, { over: true, tone: .45 });
  type('STRANGERS.', 1370, 700, 120, INK.navy);
  // the hooded stranger whispering to Clawd
  push(); translate(700, 1000); scale(-1.4, 1.4);
  paint([[-110, 0], [110, 0], [80, -230], [-80, -230]], { fill: INK.navy, curv: .15 });
  paint(ellPts(0, -290, 95, 105, 40), { fill: INK.navy }); paint(ellPts(18, -280, 55, 66, 30), { fill: INK.dark });
  pop();
  clawd(330, 1000, 36, { ...feel('dizzy', 0) });
  paint(rrPts(420, 300, 220, 160, 20), { fill: INK.orange }); type('{ }', 530, 380, 90, INK.navy);
};
LOOPS.thumb10.len = 2;
