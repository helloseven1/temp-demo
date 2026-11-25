// 盖章冲击
const m_stamp = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 18, stiffness: 420, mass: 0.9 } });
  return { transform: `scale(${1.8 - 0.8 * s}) rotate(${(1 - s) * -18}deg)`, opacity: interpolate(f, [from, from + 4], [0, 1], clampOpt) };
};
const D_stamp = 16;
