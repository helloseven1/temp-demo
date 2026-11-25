// whale 套件 · 金句框：深色底 + 大引号 + 白字 + 署名
const c_wQuote = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const typing = ctx && typeof ctx.typing === 'number' ? ctx.typing : 1;
  const full: string = it.t || '';
  const shown = typing >= 1 ? full : full.slice(0, Math.max(1, Math.ceil(full.length * typing)));
  return <div style={{ ...BOX(s), width: w, height: h, background: s.quoteBg, borderRadius: s.r, boxShadow: s.cardShade, padding: '28px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
    <div style={{ position: 'absolute', left: 26, top: 8, color: s.accents.amber, fontSize: 120, fontFamily: 'Georgia, serif', lineHeight: 1, opacity: 0.5 }}>“</div>
    <div style={{ color: s.quoteText, fontSize: it.size || 46, fontWeight: 800, lineHeight: 1.45, textAlign: 'center', paddingTop: 12 }}>{shown}</div>
    {it.by && <div style={{ color: s.accents.amber, fontSize: 22, fontWeight: 700, textAlign: 'right', marginTop: 14 }}>— {it.by}</div>}
  </div>;
};
