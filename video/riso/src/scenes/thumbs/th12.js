// thumbnail for chapter 12: where does the model run? A map pin with Clawd in it, between a cloud and a laptop.
LOOPS.thumb12 = t => {
  thumbBase(46, '12 · MODELS');
  type('WHERE DOES', 1370, 360, 92, INK.navy);
  type('THE MODEL', 1370, 500, 120, INK.orange);
  type('THE MODEL', 1379, 509, 120, INK.navy, { over: true, tone: .45 });
  type('RUN?', 1370, 700, 170, INK.navy);
  // a cloud (commercial), a laptop (local), and the pin between them
  for (const [dx, dy, r] of [[-90, 20, 70], [-20, -30, 95], [70, 0, 80], [120, 35, 55], [-140, 45, 45]]) paint(ellPts(200 + dx * .9, 300 + dy * .9, r * .9, r * .81, 28), { fill: INK.navy });
  paint(rrPts(200 - 162, 318, 324, 63, 31), { fill: INK.navy });
  paint(rrPts(610, 760, 230, 150, 14), { fill: INK.navy }); paint(rrPts(624, 773, 202, 122, 8), { fill: INK.paper });
  paint([[585, 932], [865, 932], [838, 910], [612, 910]], { fill: INK.dark });
  paint([[340, 560], [600, 560], [470, 940]], { fill: INK.orange, curv: .1 });
  paint(ellPts(470, 520, 190, 190, 64), { fill: INK.orange });
  paint(ellPts(470, 520, 145, 145, 56), { fill: INK.paper });
  clawd(470, 590, 17, { ...feel('thinking', 0), noShadow: true, emote: '?', emoteK: 1, emoteAge: 1 });
};
LOOPS.thumb12.len = 2;
