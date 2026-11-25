const c_big = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent);
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center' }}>
    <div style={{ color: c, fontSize: it.size || 68, fontWeight: 900, lineHeight: 1.15 }}>{it.t}</div>
    {it.d && <div style={{ color: s.inkSoft, fontSize: (it.size || 68) * 0.36, lineHeight: 1.4 }}>{it.d}</div>}
  </div>;
};
