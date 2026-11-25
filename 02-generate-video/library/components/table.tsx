const c_table = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => (
  <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
    {(it.items || []).map((row: any, i: number) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', background: i % 2 ? s.paper : s.paperDeep, borderRadius: s.rSm }}>
      {row.icon && <Icon name={row.icon} color={AC(s, it.accent)} size={24} />}
      <span style={{ color: s.ink, fontSize: it.size || 24, fontWeight: 750 }}>{row.t}</span>
      {row.d && <span style={{ marginLeft: 'auto', color: s.inkSoft, fontSize: 19 }}>{row.d}</span>}
    </div>)}
  </div>
);
