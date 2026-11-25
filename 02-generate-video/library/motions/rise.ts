// 柔和上浮
const m_rise = (f: number, from: number, dur: number): any => {
  const p = interpolate(f, [from, from + dur], [0, 1], clampOpt);
  return { transform: `translateY(${(1 - easeOut(p)) * 60}px)`, opacity: p };
};
const D_rise = 18;
