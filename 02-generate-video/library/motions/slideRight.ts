const m_slideRight = (f: number, from: number, dur: number): any => {
  const p = interpolate(f, [from, from + dur], [0, 1], clampOpt);
  return { transform: `translateX(${(1 - easeOut(p)) * 160}px)`, opacity: p };
};
const D_slideRight = 16;
