// whale 套件 · 左右对比：红叉旧 / 绿勾新 + 中间 VS
const c_wVersus = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const red = s.accents.red, jade = s.accents.jade;
  const panel = (title: string, text: string, color: string, good: boolean) => <div style={{ flex: 1, background: `${color}12`, border: `3px solid ${color}`, borderRadius: s.r, padding: '22px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, color: '#fff', fontSize: 30, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{good ? '✓' : '✕'}</div>
      <div style={{ color, fontSize: 26, fontWeight: 900 }}>{title}</div>
    </div>
    <div style={{ color: s.ink, fontSize: it.size || 32, fontWeight: 750, lineHeight: 1.4 }}>{text}</div>
  </div>;
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
    {panel(it.beforeTitle || '旧做法', it.before || '', red, false)}
    <div style={{ width: 76, height: 76, borderRadius: '50%', background: s.chapterName, color: s.chapterNameText, fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>VS</div>
    {panel(it.afterTitle || '新做法', it.after || '', jade, true)}
  </div>;
};
