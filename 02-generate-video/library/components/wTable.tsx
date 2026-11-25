// whale 套件 · 清单表：表头 + 斑马行 + 序号
const c_wTable = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  const head: string[] = it.head || [];
  const rows: any[][] = it.rows || [];
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
    {head.length > 0 && <div style={{ display: 'flex', gap: 12, padding: '8px 16px', background: c, borderRadius: s.rSm }}>
      {head.map((hd, i) => <div key={i} style={{ flex: i === 0 ? 0.5 : 1, color: '#fff', fontSize: 22, fontWeight: 900 }}>{hd}</div>)}
    </div>}
    {rows.map((row, ri) => <div key={ri} style={{ display: 'flex', gap: 12, padding: '10px 16px', background: ri % 2 ? s.paper : s.paperDeep, borderRadius: s.rSm }}>
      {row.map((cell, ci) => <div key={ci} style={{ flex: ci === 0 ? 0.5 : 1, color: ci === 0 ? c : s.ink, fontSize: it.size || 24, fontWeight: ci === 0 ? 900 : 700, lineHeight: 1.3 }}>{cell}</div>)}
    </div>)}
  </div>;
};
