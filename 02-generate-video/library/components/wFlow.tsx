// whale 套件 · 流程链：序号圆 + 箭头连接 + 说明
const c_wFlow = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  const steps: any[] = it.steps || [];
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
    {steps.map((st, i) => <React.Fragment key={i}>
      {i > 0 && <div style={{ flex: 0.4, height: 5, background: c, opacity: 0.5, position: 'relative' }}>
        <div style={{ position: 'absolute', right: -2, top: -8, width: 0, height: 0, borderLeft: '16px solid ' + c, borderTop: '10px solid transparent', borderBottom: '10px solid transparent' }} />
      </div>}
      <div style={{ flex: 1, background: s.card, border: `2px solid ${c}`, borderRadius: s.r, boxShadow: s.cardShade, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: c, color: '#fff', fontSize: 22, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
        <div style={{ color: s.ink, fontSize: it.size || 26, fontWeight: 850, textAlign: 'center', lineHeight: 1.3 }}>{st.t}</div>
        {st.d && <div style={{ color: s.inkSoft, fontSize: 18, textAlign: 'center' }}>{st.d}</div>}
      </div>
    </React.Fragment>)}
  </div>;
};
