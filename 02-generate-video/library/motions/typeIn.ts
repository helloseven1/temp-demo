// 逐字显现（调用方按 typing 比例裁剪）
const m_typeIn = (f: number, from: number, dur: number): any => ({
  transform: 'none', opacity: 1, typing: interpolate(f, [from, from + dur], [0, 1], clampOpt),
});
const D_typeIn = 24;
