const m_slideLeft = (f: number, from: number, dur: number): any => {
  const p = interpolate(f, [from, from + dur], [0, 1], clampOpt);
  return { transform: `translateX(${(1 - easeOut(p)) * -160}px)`, opacity: p };
};
const D_slideLeft = 16;
