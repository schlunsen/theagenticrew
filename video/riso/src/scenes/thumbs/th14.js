// thumbnail for chapter 14: in CI, nobody watches the diff
LOOPS.thumb14 = t => {
  thumbBase(48, '14 · PIPELINE');
  type('IN CI,', 1370, 350, 110, INK.navy);
  type('NOBODY', 1370, 520, 160, INK.orange);
  type('NOBODY', 1380, 530, 160, INK.navy, { over: true, tone: .45 });
  type("IS WATCHING", 1370, 710, 100, INK.navy);
  // a night pipe: a moon, a green lamp, Clawd switching the rules off
  paint(rrPts(60, 200, 760, 560, 40), { fill: INK.navy });
  paint(ellPts(660, 300, 60, 60, 36), { fill: INK.yellow }); paint(ellPts(690, 285, 52, 52, 36), { fill: INK.navy });
  paint(rrPts(90, 560, 700, 110, 55), { fill: INK.green, tone: .85 });
  glow(200, 320, 120, 'yellow', .6); paint(ellPts(200, 320, 50, 50, 30), { fill: INK.green });
  paint(rrPts(330, 390, 180, 84, 42), { fill: INK.navy, tone: .4 }); paint(ellPts(372, 432, 34, 34, 24), { fill: INK.paper, ink: INK.navy, sw: 1 });
  clawd(560, 560, 14, { ...feel('mischief', 0), eyes: 'wink', noShadow: true });
};
LOOPS.thumb14.len = 2;
