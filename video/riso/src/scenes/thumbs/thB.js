// thumbnail for appendix B · The State of the Tools: the tools shift; ask the right questions
LOOPS.thumbB = t => {
  thumbBase(211, 'B · TOOLS');
  type('THE TOOLS', 1370, 350, 104, INK.navy);
  type('SHIFT.', 1370, 490, 150, INK.orange);
  type('SHIFT.', 1379, 499, 150, INK.navy, { over: true, tone: .45 });
  type('ASK THE RIGHT', 1370, 660, 62, INK.navy, { spacing: .02 });
  type('QUESTIONS.', 1370, 760, 78, INK.navy, { spacing: .02 });
  // a magnifier over a shifting stack of tool tiles
  push(); translate(430, 620); scale(1.1);
  paint(rrPts(-150, -150, 300, 300, 30), { fill: INK.paper, ink: INK.navy, sw: 2 });
  const cols = [INK.orange, INK.gold, INK.green, INK.navy];
  for (let i = 0; i < 4; i++) paint(rrPts(-100 + (i % 2) * 100 + (i - 1.5) * 6, -100 + Math.floor(i / 2) * 100 + (i % 2 ? 14 : -8), 80, 80, 14), { fill: cols[i] });
  arcLine(120, 120, 90, 22, INK.navy);
  paint(ellPts(120, 120, 80, 80, 32), { fill: 'yellow', tone: .35, over: true });
  type('?', 120, 128, 90, INK.orange);
  paint(ribbon([[184, 184], [300, 300]], 40), { fill: INK.navy });
  pop();
  clawd(180, 1010, 15, { ...feel('thinking', 0), emote: '?', emoteK: 1, emoteAge: .5 });
};
LOOPS.thumbB.len = 2;
