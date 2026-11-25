const c_balance = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const L = it.left || { t: '' }, R = it.right || { t: '' };
  const c = AC(s, it.accent || 'amber');
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Icon name="bulb" color={c} size={64} />
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
      <div style={{ color: s.accents.red, fontSize: it.size || 26, fontWeight: 800 }}>{L.t}</div>
      <div style={{ color: s.accents.jade, fontSize: it.size || 26, fontWeight: 800 }}>{R.t}</div>
    </div>
  </div>;
};
