// 摇摆：吉祥物/便签入场后轻微左右摆，活泼不抢戏
const m_wobble = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 12, stiffness: 260, mass: 0.7 } });
  const wob = Math.sin((f - from) / 4) * 6 * (1 - Math.min(1, (f - from) / dur));
  return { transform: `translateY(${(1 - s) * 20}px) scale(${0.7 + 0.3 * s}) rotate(${wob}deg)`, opacity: interpolate(f, [from, from + 6], [0, 1], clampOpt) };
};
const D_wobble = 22;
