const c_compare = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const L = it.left || { t: '' }, R = it.right || { t: '' };
  const half = (w - 30) / 2;
  const cell = (d: any, c: string, tag: string) => <div style={{ width: half, height: h, background: s.card, border: `2px solid ${c}`, borderRadius: s.r, boxShadow: s.cardShade, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
    <div style={{ color: c, fontSize: 17, fontWeight: 900, letterSpacing: 1 }}>{tag}</div>
    <div style={{ color: s.ink, fontSize: it.size || 27, fontWeight: 800 }}>{d.t}</div>
    {d.d && <div style={{ color: s.inkSoft, fontSize: 18 }}>{d.d}</div>}
  </div>;
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', gap: 30 }}>{cell(L, s.accents.red, '旧做法 ✕')}{cell(R, s.accents.jade, '新做法 ✓')}</div>;
};
