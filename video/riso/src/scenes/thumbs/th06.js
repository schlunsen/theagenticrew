// thumbnail for chapter 06: tests are the agent's eyes — a blindfolded agent, and a row of green test lamps
LOOPS.thumb06 = t => {
  thumbBase(36, '06 · TESTS');
  type('NO TESTS?', 1370, 360, 110, INK.navy);
  type('FLYING', 1370, 530, 160, INK.orange);
  type('FLYING', 1380, 540, 160, INK.navy, { over: true, tone: .45 });
  type('BLIND.', 1370, 720, 150, INK.navy);
  // the agent, blindfolded
  clawd(470, 1000, 46, { ...feel('nervous', 0), draw: u => { paint(rectPts(-5.4 * u, -7.1 * u, 10.8 * u, 2.2 * u), { fill: INK.navy }); paint([[5.2 * u, -6.4 * u], [7.2 * u, -7.6 * u], [6.8 * u, -5.4 * u]], { fill: INK.navy }); } });
  // the test lamps that would let it see: two dark, one green
  [[250, 'off'], [470, 'off'], [690, 'green']].forEach(([x, s]) => {
    paint(ellPts(x, 330, 80, 80, 40), { fill: INK.paper, ink: INK.navy, sw: 2 });
    if (s === 'green') { paint(ellPts(x, 330, 66, 66, 40), { fill: INK.green }); paint(ellPts(x - 22, 308, 16, 16, 14), { fill: INK.paper, tone: .8 }); }
  });
};
LOOPS.thumb06.len = 2;
