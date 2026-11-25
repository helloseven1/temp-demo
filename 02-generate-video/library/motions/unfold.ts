// 展开：从窄到宽揭开，适合表格/流程/对比板
const m_unfold = (f: number, from: number, dur: number): any => {
  const s = spring({ frame: f - from, fps: 30, durationInFrames: dur, config: { damping: 16, stiffness: 200, mass: 0.8 } });
  return { transform: `scaleX(${0.2 + 0.8 * s}) scaleY(${0.85 + 0.15 * s})`, opacity: interpolate(f, [from, from + 6], [0, 1], clampOpt) };
};
const D_unfold = 18;
