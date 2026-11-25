// whale 套件 · 天平权衡：真天平 SVG + 左右文案（配 tilt 动效）
const c_wBalance = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const L = it.left || { t: '' }, R = it.right || { t: '' };
  const c = AC(s, it.accent || 'amber');
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <svg width={300} height={150} viewBox="0 0 300 150">
      <path d="M150 24 L150 132 M96 132 L204 132" stroke={s.inkSoft} strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M52 52 L248 52" stroke={c} strokeWidth="9" strokeLinecap="round" fill="none"/>
      <circle cx="150" cy="52" r="10" fill={c}/>
      <path d="M52 52 L52 78 M24 78 L80 78 L68 104 L36 104 Z" stroke={c} strokeWidth="5" fill={`${c}22`}/>
      <path d="M248 52 L248 78 M220 78 L276 78 L264 104 L232 104 Z" stroke={c} strokeWidth="5" fill={`${c}22`}/>
    </svg>
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
      <div style={{ width: 300, color: it.leftColor || s.accents.red, fontSize: it.size || 26, fontWeight: 850, textAlign: 'center' }}>{L.t}</div>
      <div style={{ width: 300, color: it.rightColor || s.accents.jade, fontSize: it.size || 26, fontWeight: 850, textAlign: 'center' }}>{R.t}</div>
    </div>
  </div>;
};
