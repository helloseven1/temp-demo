const c_illustration = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const name = it.name || 'bulb';
  const c = AC(s, it.accent || 'blue');
  const red = s.accents.red, amber = s.accents.amber, jade = s.accents.jade;
  const soft = s.paperDeep || s.paper;
  let body: React.ReactNode;
  if (name === 'calendar') {
    body = <><rect x="16" y="28" width="88" height="76" rx="10" fill="#FFFFFF" stroke={c} strokeWidth="5"/><rect x="16" y="28" width="88" height="24" rx="10" fill={c}/><rect x="34" y="18" width="8" height="20" rx="4" fill={c}/><rect x="78" y="18" width="8" height="20" rx="4" fill={c}/><circle cx="60" cy="76" r="20" fill="none" stroke={red} strokeWidth="6"/><path d="M48 76h24M60 64v24" stroke={red} strokeWidth="5" strokeLinecap="round"/></>;
  } else if (name === 'shovel') {
    body = <><rect x="54" y="14" width="14" height="58" rx="7" fill={c}/><path d="M42 68h38l10 34H32z" fill="#B9C2CC" stroke={s.inkSoft} strokeWidth="4"/><ellipse cx="34" cy="104" rx="22" ry="9" fill="#8A6B4F"/><ellipse cx="70" cy="108" rx="26" ry="8" fill="#A07C5B"/><ellipse cx="98" cy="101" rx="18" ry="7" fill="#8A6B4F"/></>;
  } else if (name === 'magnifier') {
    body = <><circle cx="52" cy="50" r="30" fill="#EAF3FB" stroke={c} strokeWidth="7"/><path d="M74 72l28 28" stroke={c} strokeWidth="14" strokeLinecap="round"/><path d="M40 50h24M52 38v24" stroke={c} strokeWidth="4" strokeLinecap="round" opacity="0.6"/></>;
  } else if (name === 'traffic') {
    body = <><rect x="38" y="12" width="44" height="96" rx="14" fill={s.ink} /><circle cx="60" cy="34" r="12" fill={red}/><circle cx="60" cy="60" r="12" fill={amber}/><circle cx="60" cy="86" r="12" fill={jade}/><rect x="56" y="100" width="8" height="12" fill={s.inkSoft}/></>;
  } else if (name === 'gear') {
    body = <><g fill={c}><rect x="54" y="8" width="12" height="24" rx="4"/><rect x="54" y="88" width="12" height="24" rx="4"/><rect x="8" y="54" width="24" height="12" rx="4"/><rect x="88" y="54" width="24" height="12" rx="4"/><rect x="22" y="22" width="22" height="10" rx="4" transform="rotate(45 33 27)"/><rect x="76" y="88" width="22" height="10" rx="4" transform="rotate(45 87 93)"/></g><circle cx="60" cy="60" r="34" fill={c}/><circle cx="60" cy="60" r="14" fill={soft}/></>;
  } else if (name === 'compass') {
    body = <><circle cx="60" cy="60" r="44" fill="#FFFFFF" stroke={c} strokeWidth="6"/><path d="M60 24l14 34-14 38-14-38z" fill={red}/><path d="M60 24v72" stroke={s.ink} strokeWidth="3"/><circle cx="60" cy="60" r="6" fill={s.ink}/></>;
  } else if (name === 'box') {
    body = <><path d="M20 50l40-18 40 18-40 18z" fill={amber}/><path d="M20 50v46l40 18V68z" fill="#D99B2B"/><path d="M100 50v46l-40 18V68z" fill="#C98A22"/><path d="M60 68v46" stroke="#9A6A18" strokeWidth="4"/></>;
  } else if (name === 'doc') {
    body = <><path d="M28 12h44l20 20v76H28z" fill="#FFFFFF" stroke={c} strokeWidth="5"/><path d="M72 12v22h20" fill="none" stroke={c} strokeWidth="5"/><path d="M42 54h36M42 70h36M42 86h24" stroke={s.inkSoft} strokeWidth="5" strokeLinecap="round"/></>;
  } else if (name === 'coins') {
    body = <><ellipse cx="46" cy="82" rx="28" ry="12" fill={amber}/><path d="M18 82v14c0 7 12 12 28 12s28-5 28-12V82" fill="#D99B2B"/><ellipse cx="76" cy="48" rx="28" ry="12" fill="#F5CE55"/><path d="M48 48v14c0 7 12 12 28 12s28-5 28-12V48" fill="#D99B2B"/></>;
  } else if (name === 'clock') {
    body = <><circle cx="60" cy="60" r="44" fill="#FFFFFF" stroke={c} strokeWidth="6"/><path d="M60 32v30l22 14" stroke={s.ink} strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="60" cy="60" r="5" fill={s.ink}/></>;
  } else if (name === 'target') {
    body = <><circle cx="60" cy="60" r="44" fill="#FFFFFF" stroke={c} strokeWidth="6"/><circle cx="60" cy="60" r="28" fill="none" stroke={c} strokeWidth="6"/><circle cx="60" cy="60" r="12" fill={red}/></>;
  } else {
    body = <><path d="M60 14a26 26 0 0 0-15 47c5 4 7 9 7 15h16c0-6 2-11 7-15A26 26 0 0 0 60 14z" fill={amber} stroke="#D99B2B" strokeWidth="4"/><rect x="50" y="78" width="20" height="8" rx="3" fill={s.inkSoft}/><rect x="53" y="90" width="14" height="8" rx="3" fill={s.inkSoft}/></>;
  }
  return <div style={{ ...BOX(s), width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
    <svg width={it.size || 130} height={it.size || 130} viewBox="0 0 120 120">{body}</svg>
    {it.t && <div style={{ color: s.ink, fontSize: 21, fontWeight: 800, textAlign: 'center', lineHeight: 1.3 }}>{it.t}</div>}
  </div>;
};
