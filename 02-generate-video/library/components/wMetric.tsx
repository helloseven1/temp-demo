// whale 套件 · 数据卡：顶部色条 + 大数字 + 单位 + 说明
const c_wMetric = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    <div style={{ height: 12, background: c, flexShrink: 0 }} />
    <div style={{ flex: 1, padding: '18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
      <div style={{ color: c, fontSize: it.size || 84, fontWeight: 900, lineHeight: 1 }}>
        {it.num}<span style={{ fontSize: (it.size || 84) * 0.4, marginLeft: 6 }}>{it.unit || ''}</span>
      </div>
      <div style={{ color: s.ink, fontSize: 24, fontWeight: 800, lineHeight: 1.35 }}>{it.t}</div>
      {it.d && <div style={{ color: s.inkSoft, fontSize: 19, lineHeight: 1.4 }}>{it.d}</div>}
    </div>
  </div>;
};
