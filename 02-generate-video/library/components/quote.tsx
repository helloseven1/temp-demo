const c_quote = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const lines = (it.t || '').split('\n');
  return <div style={{ ...BOX(s), width: w, height: h, background: s.quoteBg, borderRadius: s.r, boxShadow: s.cardShade, padding: '18px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 9, borderLeft: `6px solid ${s.accents.amber}`, textAlign: 'center', overflow: 'hidden' }}>
    {lines.map((l: string, i: number) => <div key={i} style={{ color: s.quoteText, fontSize: (it.size || 26) * 1.25, lineHeight: 1.4, fontWeight: 750, clipPath: ctx.typing !== undefined && i === lines.length - 1 ? `inset(0 ${(1 - ctx.typing) * 100}% 0 0)` : undefined }}>{l}</div>)}
  </div>;
};
