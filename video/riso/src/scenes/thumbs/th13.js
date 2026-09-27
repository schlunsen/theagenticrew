// thumbnail for chapter 13: several agents beat one only when the work splits cleanly
LOOPS.thumb13 = t => {
  thumbBase(47, '13 · CREW');
  type('SPLIT THE', 1370, 360, 110, INK.navy);
  type('WORK,', 1370, 520, 160, INK.orange);
  type('WORK,', 1380, 530, 160, INK.navy, { over: true, tone: .45 });
  type('ALONG THE SEAMS', 1370, 710, 78, INK.navy);
  // three folders, a Clawd in each, on their own branches
  paint(rrPts(80, 230, 700, 26, 13), { fill: INK.navy });
  [[200, INK.orange], [440, INK.green], [680, INK.navy]].forEach(([x, col], i) => {
    inkLine(through([[x - 60, 243], [x - 40, 420], [x, 520]]), 2.4, col === INK.navy ? INK.brown : col, 'ink', .5, { force: true });
    paint(rrPts(x - 110, 520, 90, 30, 10), { fill: col }); paint(rrPts(x - 110, 540, 220, 170, 16), { fill: col });
    clawd(x, 690, 11, { ...feel(['happy', 'determined', 'excited'][i], 0), noShadow: true });
  });
  skipper(460, 1075, 15, { ...SKIP_POSES.present, mood: 'grin', t: 0 });
};
LOOPS.thumb13.len = 2;
