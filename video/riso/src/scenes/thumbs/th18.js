// thumbnail for chapter 18 · Agentic Teams: agents don't fix a team, they amplify it
LOOPS.thumb18 = t => {
  thumbBase(118, '18 · TEAMS');
  type('AGENTS', 1370, 360, 110, INK.navy);
  type('AMPLIFY', 1370, 530, 160, INK.orange);
  type('AMPLIFY', 1380, 540, 160, INK.navy, { over: true, tone: .45 });
  type('YOUR TEAM', 1370, 720, 120, INK.navy);
  skipper(300, 1000, 30, { ...SKIP_POSES.cheer, mood: 'happy', noShadow: true, t: 0 });
  skipper(620, 1000, 26, { ...SKIP_POSES.hips, mood: 'grin', flip: true, noShadow: true, t: 0 });
  clawd(160, 1000, 14, { ...feel('excited', 0) });
  clawd(470, 1000, 13, { ...feel('happy', 0), hat: 'hard' });
  clawd(790, 1000, 14, { ...feel('proud', 0), flip: true });
};
LOOPS.thumb18.len = 2;
