// 图片素材组件：从 DATA.assets 取 base64 data URL（素材由 build.py 扫描 spec 内联，保证 TSX 自包含）
const c_img = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const src = (typeof DATA !== 'undefined' && DATA.assets && DATA.assets[it.src]) || '';
  const pad = it.pad ?? 16;
  const label = it.t;
  const labelH = label ? 44 : 0;
  const imgW = w - pad * 2;
  const imgH = h - pad * 2 - labelH;
  const bg = it.bare ? 'transparent' : s.card;
  const border = it.bare ? 'none' : `2px solid ${s.cardBorder}`;
  return <div style={{ ...BOX(s), width: w, height: h, background: bg, border, borderRadius: s.r, boxShadow: it.bare ? 'none' : s.cardShade, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: pad }}>
    {src
      ? <img src={src} alt={it.src} style={{ width: imgW, height: imgH, objectFit: it.fit || 'contain', display: 'block' }} />
      : <div style={{ color: s.accents.red, fontSize: 18, fontWeight: 700, textAlign: 'center' }}>缺素材: {it.src}</div>}
    {label && <div style={{ color: s.ink, fontSize: 22, fontWeight: 800, textAlign: 'center', marginTop: 6, lineHeight: 1.25 }}>{label}</div>}
  </div>;
};
