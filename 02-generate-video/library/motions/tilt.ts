// 倾斜回摆：天平/权衡从一侧摆到另一侧
const m_tilt = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 11, stiffness: 220, mass: 0.9 } });
  return { transform: `rotate(${(1 - s) * -10 + s * 4}deg)`, opacity: interpolate(f, [from, from + 5], [0, 1], clampOpt) };
};
const D_tilt = 20;
