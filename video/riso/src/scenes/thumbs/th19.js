// thumbnail for chapter 19 · Final Words: the crew is disposable, the ship is not
LOOPS.thumb19 = t => {
  thumbBase(119, '19 · FINAL');
  type('THE CREW IS', 1370, 350, 96, INK.navy);
  type('DISPOSABLE.', 1370, 480, 128, INK.orange);
  type('DISPOSABLE.', 1379, 489, 128, INK.navy, { over: true, tone: .45 });
  type('THE SHIP', 1370, 640, 110, INK.navy);
  type('IS NOT.', 1370, 770, 110, INK.navy);
  // a small ship on a band of sea, the Skipper at the rail
  paint(rectPts(-200, 900, W + 400, 400), { fill: INK.navy, tone: .75 });
  push(); translate(450, 860); scale(.9);
  paint([[-380, -40], [380, -40], [300, 110], [-310, 110]], { fill: INK.navy });
  for (let c = 0; c < 8; c++) paint(rrPts(-290 + c * 76, -10, 50, 40, 8), { fill: c % 3 ? INK.gold : INK.orange });
  inkLine([[0, -40], [0, -560]], 2, INK.dark, 'ink', 0, { force: true });
  paint([[12, -540], [12, -80], [320, -80]], { fill: INK.paper, ink: INK.navy, sw: 1.4 });
  paint([[-12, -470], [-12, -80], [-280, -80]], { fill: INK.paper, ink: INK.navy, sw: 1.4 });
  paint([[12, -560], [230, -530], [12, -500]], { fill: INK.orange });
  pop();
  clawd(240, 820, 9, { ...feel('happy', 0) });
  clawd(640, 820, 9, { ...feel('excited', 0), flip: true });
  skipper(450, 822, 15, { ...SKIP_POSES.wave, mood: 'grin', noShadow: true, t: .3 });
};
LOOPS.thumb19.len = 2;
