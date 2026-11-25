// 弹入：带回弹，快节奏首选
const m_pop = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 13, stiffness: 260, mass: 0.7 } });
  return { transform: `translateY(${(1 - s) * 28}px) scale(${0.6 + 0.4 * s})`, opacity: interpolate(f, [from, from + 6], [0, 1], clampOpt) };
};
const D_pop = 14;
