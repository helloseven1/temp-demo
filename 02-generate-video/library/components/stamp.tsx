const c_stamp = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'red');
  return <div style={{ ...BOX(s), width: 190, height: 190, transform: `rotate(${ctx.rot}deg)`, border: `7px double ${c}`, borderRadius: '50%', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, textAlign: 'center', padding: 14, opacity: 0.92 }}>{it.badge || it.t}</div>;
};
