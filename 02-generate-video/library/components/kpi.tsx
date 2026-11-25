const c_kpi = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <div style={{ color: c, fontSize: it.size || 72, fontWeight: 900, lineHeight: 1 }}>{it.t}</div>
    <div style={{ color: s.inkSoft, fontSize: 20 }}>{it.d}</div>
  </div>;
};
