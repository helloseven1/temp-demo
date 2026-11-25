const c_tick = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const ok = it.ok !== false;
  const c = ok ? s.accents.jade : s.accents.red;
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.rSm, boxShadow: s.cardShade, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
    <span style={{ color: c, fontWeight: 900, fontSize: 26 }}>{ok ? '✓' : '✕'}</span>
    <span style={{ color: ok ? s.ink : s.inkSoft, fontSize: it.size || 25, fontWeight: 650 }}>{it.t}</span>
  </div>;
};
