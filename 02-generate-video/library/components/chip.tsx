const c_chip = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'jade');
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${c}`, borderRadius: 999, boxShadow: s.cardShade, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 14px', color: c, fontSize: it.size || 21, fontWeight: 750, whiteSpace: 'nowrap' }}>
    {it.icon && <Icon name={it.icon} color={c} size={22} />}{it.t}
  </div>;
};
