const c_card = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent);
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
    {it.icon && <Icon name={it.icon} color={c} size={Math.min(40, h * 0.26)} />}
    <div style={{ color: s.ink, fontSize: it.size || 30, fontWeight: 750, lineHeight: 1.3 }}>{it.t}</div>
    {it.d && <div style={{ color: s.inkSoft, fontSize: (it.size || 30) * 0.6, lineHeight: 1.45 }}>{it.d}</div>}
  </div>;
};
