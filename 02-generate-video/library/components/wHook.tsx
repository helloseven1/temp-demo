// whale 套件 · 钩子冲击卡：竖色条 + 大字 + 副标 + 红章 + 插画
const c_wHook = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  const red = s.accents.red;
  return <div style={{ ...BOX(s), width: w, height: h, background: s.card, border: `2px solid ${s.cardBorder}`, borderRadius: s.r, boxShadow: s.cardShade, display: 'flex', overflow: 'hidden' }}>
    <div style={{ width: 14, background: c, flexShrink: 0 }} />
    <div style={{ flex: 1, padding: '26px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, minWidth: 0 }}>
      {it.badge && <div style={{ width: 'max-content', background: `${red}1A`, border: `2px solid ${red}`, color: red, borderRadius: 99, padding: '5px 18px', fontSize: 20, fontWeight: 900 }}>{it.badge}</div>}
      <div style={{ color: s.ink, fontSize: it.size || 62, fontWeight: 900, lineHeight: 1.2 }}>{it.t}</div>
      {it.d && <div style={{ color: s.inkSoft, fontSize: 26, lineHeight: 1.45 }}>{it.d}</div>}
    </div>
    {it.icon && <div style={{ width: 220, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c_illustration({ name: it.icon, accent: it.accent || 'blue', size: 150 }, 190, 190, s, {})}</div>}
  </div>;
};
