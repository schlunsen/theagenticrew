// thumbnail for chapter 08: agent memory — every session starts with amnesia unless it keeps a log
LOOPS.thumb08 = t => {
  thumbBase(38, '08 · MEMORY');
  type('YOUR AGENT', 1370, 360, 96, INK.navy);
  type('FORGETS', 1370, 520, 150, INK.orange);
  type('FORGETS', 1380, 530, 150, INK.navy, { over: true, tone: .45 });
  type('EVERY SESSION.', 1370, 710, 88, INK.navy);
  // the logbook, open, with a page flying off
  push(); translate(470, 300); paint(rrPts(-230, -140, 460, 280, 18), { fill: INK.brown, ink: INK.navy, sw: 2 }); paint(rrPts(-212, -122, 200, 244, 10), { fill: INK.paper }); paint(rrPts(12, -122, 200, 244, 10), { fill: INK.paper });
  for (let j = 0; j < 6; j++) { paint(rectPts(-190, -90 + j * 34, 150, 9), { fill: INK.navy, tone: .6 }); if (j < 2) paint(rectPts(34, -90 + j * 34, 150, 9), { fill: INK.navy, tone: .6 }); }
  pop();
  push(); translate(760, 160); rotate(.5); paint(rrPts(-60, -76, 120, 152, 8), { fill: INK.paper, ink: INK.navy, sw: 1.4 }); pop();
  clawd(470, 1030, 30, { ...feel('dizzy', 0) });
};
LOOPS.thumb08.len = 2;
