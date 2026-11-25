const c_flow = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: c, color: s.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900 }}>{ctx.index + 1}</div>
    <div style={{ color: s.ink, fontSize: it.size || 25, fontWeight: 800 }}>{it.t}</div>
    {it.d && <div style={{ color: s.inkSoft, fontSize: 17, textAlign: 'center' }}>{it.d}</div>}
  </div>;
};
