const m_fade = (f: number, from: number, dur: number): any => {
  const p = interpolate(f, [from, from + dur], [0, 1], clampOpt);
  return { transform: 'none', opacity: p };
};
const D_fade = 12;
