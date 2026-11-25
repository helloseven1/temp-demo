const c_sticky = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'amber');
  return <div style={{ ...BOX(s), width: w, height: h, transform: `rotate(${ctx.rot}deg)`, background: `${c}1A`, border: `2.5px solid ${c}`, borderRadius: s.r, boxShadow: s.cardShade, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, color: c, fontSize: it.size || (it.t?.length > 6 ? 26 : 34), fontWeight: 800, textAlign: 'center', lineHeight: 1.25 }}>{it.t}</div>;
};
