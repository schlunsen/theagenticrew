// thumbnail for appendix A · Agents as Pentesters: hack yourself first — behind absolute guardrails
LOOPS.thumbA = t => {
  thumbBase(221, 'A · PENTEST');
  type('HACK', 1370, 350, 150, INK.orange);
  type('HACK', 1379, 359, 150, INK.navy, { over: true, tone: .45 });
  type('YOURSELF', 1370, 500, 116, INK.navy);
  type('FIRST.', 1370, 630, 116, INK.navy);
  type('BEHIND ABSOLUTE GUARDRAILS', 1370, 770, 40, INK.navy, { spacing: .02 });
  // a shield with a check, an orange agent held inside a sandbox box
  push(); translate(430, 560); scale(1.5);
  paint([[0, -110], [95, -66], [95, 34], [0, 120], [-95, 34], [-95, -66]], { fill: INK.navy });
  paint([[0, -84], [68, -50], [68, 24], [0, 90], [-68, 24], [-68, -50]], { fill: INK.gold });
  paint(ribbon([[-34, -6], [-6, 24], [40, -34]], 16), { fill: INK.green, over: true });
  pop();
  // sandbox box with an orange agent
  push(); translate(430, 1000); scale(1);
  paint(rrPts(-130, -90, 260, 150, 16), { fill: INK.green, tone: .3 });
  for (let i = 0; i < 5; i++) paint(rectPts(-130 + i * 65, -90, 6, 150), { fill: INK.navy, tone: .5 });
  pop();
  clawd(430, 1010, 12, { ...feel('mischief', 0) });
  clawd(150, 1010, 11, { ...feel('determined', 0) });
};
LOOPS.thumbA.len = 2;
