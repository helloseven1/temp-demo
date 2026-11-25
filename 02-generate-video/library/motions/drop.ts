const m_drop = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 12, stiffness: 300, mass: 0.8 } });
  return { transform: `translateY(${(s - 1) * 120}px)`, opacity: interpolate(f, [from, from + 5], [0, 1], clampOpt) };
};
const D_drop = 16;
