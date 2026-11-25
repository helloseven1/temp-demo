// 震动强调，适合钩子/金句
const m_shock = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 9, stiffness: 320, mass: 0.6 } });
  const shake = f < from + dur ? Math.sin((f - from) * 2.2) * (1 - s) * 8 : 0;
  return { transform: `translateX(${shake}px) scale(${0.7 + 0.3 * s})`, opacity: interpolate(f, [from, from + 5], [0, 1], clampOpt) };
};
const D_shock = 18;
