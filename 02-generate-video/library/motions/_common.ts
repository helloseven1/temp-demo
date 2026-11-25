// 动效公共工具（生成器总是内联）
const clampOpt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
