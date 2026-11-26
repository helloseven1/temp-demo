// 摆位策略（PLACE）：items → 内容区坐标。摆位是视觉决策，归风格；engine 只调用。

const PLACE = (layout: string, items: any[], SZ: Record<string, [number, number]>): [number, number][] => {
  const n = items.length, cx = 750, cy = 350, out: [number, number][] = [];
  const wh = (i: number) => SZ[items[i].kind] || [390, 190];
  if (layout === 'center') { for (let i = 0; i < n; i++) out.push([cx, cy]); return out; }
  if (layout === 'column') {
    const gap = 34, hs = items.map((_, i) => wh(i)[1]);
    const total = hs.reduce((a: number, b: number) => a + b, 0) + gap * (n - 1);
    let y = cy - total / 2;
    for (let i = 0; i < n; i++) { out.push([cx, y + hs[i] / 2]); y += hs[i] + gap; }
    return out;
  }
  if (layout === 'row') {
    const gap = 40, ws = items.map((_, i) => wh(i)[0]);
    const total = ws.reduce((a: number, b: number) => a + b, 0) + gap * (n - 1);
    let x = cx - total / 2;
    for (let i = 0; i < n; i++) { out.push([x + ws[i] / 2, cy]); x += ws[i] + gap; }
    return out;
  }
  if (layout === 'grid') {
    const cols = n === 4 ? 2 : Math.min(3, n), cw = 410, chh = 210, gxx = 48, gyy = 44;
    const rows = Math.ceil(n / cols);
    const bx = cx - (cols * cw + (cols - 1) * gxx) / 2, by = cy - (rows * chh + (rows - 1) * gyy) / 2;
    for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); out.push([bx + c * (cw + gxx) + cw / 2, by + r * (chh + gyy) + chh / 2]); }
    return out;
  }
  if (layout === 'split') { if (n === 1) { out.push([cx, cy]); return out; } for (let i = 0; i < n; i++) out.push([i % 2 === 0 ? cx - 380 : cx + 380, cy]); return out; }
  if (layout === 'timeline') { const gap = Math.min(360, 1400 / Math.max(n, 1)); const total = gap * (n - 1); for (let i = 0; i < n; i++) out.push([cx - total / 2 + i * gap, cy]); return out; }
  const spots: [number, number][] = [[cx - 420, cy - 150], [cx + 400, cy - 170], [cx - 380, cy + 170], [cx + 420, cy + 160], [cx, cy]];
  for (let i = 0; i < n; i++) out.push(spots[i % spots.length]);
  return out;
};
