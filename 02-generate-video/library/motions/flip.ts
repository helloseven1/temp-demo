// 翻转揭示，适合对比
const m_flip = (f: number, from: number, dur: number): any => {
  const p = interpolate(f, [from, from + dur], [0, 1], clampOpt);
  return { transform: `perspective(1000px) rotateX(${(1 - p) * 88}deg) scale(${0.9 + 0.1 * p})`, opacity: p };
};
const D_flip = 18;
