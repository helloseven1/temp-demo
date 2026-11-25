const c_lensBar = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const c = AC(s, it.accent || 'blue');
  const row = (label: string, pct: number, color: string) => <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 200, color: s.ink, fontSize: 23, fontWeight: 800, textAlign: 'right' }}>{label}</div>
    <div style={{ flex: 1, height: 24, background: s.progressTrack, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }}/>
    </div>
  </div>;
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 20px', boxSizing: 'border-box' }}>
    <div style={{ color: s.ink, fontSize: it.size || 38, fontWeight: 900, textAlign: 'center' }}>{it.t || '多做了什么？'}</div>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {row(it.before || '回答更长', 42, s.accents.red)}
      {row(it.after || '多做了什么', 90, c)}
    </div>
    <div style={{ position: 'absolute', right: 4, bottom: 0 }}>{c_illustration({ name: 'magnifier', accent: it.accent || 'blue', size: 110 }, 130, 130, s, {})}</div>
  </div>;
};
