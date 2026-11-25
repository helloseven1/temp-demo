const c_trioSticky = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const notes = [
    { label: '第一步', text: it.t1 || '定向', color: s.accents.amber },
    { label: '第二步', text: it.t2 || '深挖', color: s.accents.blue },
    { label: '第三步', text: it.t3 || '借力', color: s.accents.rose },
  ];
  return <div style={{ ...BOX(s), width: w, height: h }}>
    <div style={{ position: 'absolute', left: 16, top: 96, display: 'flex', gap: 24 }}>
      {notes.map((n, i) => <div key={i} style={{ width: 300, height: 218, background: `${n.color}33`, border: `3px solid ${n.color}`, borderRadius: s.r, boxShadow: s.cardShade, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `rotate(${[0, -2, 2][i]}deg)`, boxSizing: 'border-box' }}>
        <div style={{ color: n.color, fontSize: 22, fontWeight: 800 }}>{n.label}</div>
        <div style={{ color: s.ink, fontSize: it.size || 46, fontWeight: 900 }}>{n.text}</div>
      </div>)}
    </div>
    <div style={{ position: 'absolute', right: 10, top: 4 }}>{c_stamp({ badge: it.badge || '三步', accent: 'red' }, 190, 190, s, { rot: -8 })}</div>
  </div>;
};
