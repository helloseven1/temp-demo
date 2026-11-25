const c_mascot = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const face = it.face || 'happy';
  const c = s.hero || s.accents.blue;
  const deep = s.heroDeep || c;
  const light = s.heroLight || s.accents.blue;
  const eyes = face === 'wow'
    ? <><circle cx="126" cy="196" r="10" fill={deep}/><circle cx="212" cy="196" r="10" fill={deep}/><circle cx="169" cy="226" r="9" fill={deep}/></>
    : face === 'sad'
      ? <><path d="M112 200 Q126 184 140 200" stroke={deep} strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M198 200 Q212 184 226 200" stroke={deep} strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M158 232 Q169 220 180 232" stroke={deep} strokeWidth="6" fill="none" strokeLinecap="round"/></>
      : face === 'think'
        ? <><path d="M112 194 Q126 180 140 194" stroke={deep} strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="212" cy="196" r="9" fill={deep}/><path d="M160 226 Q170 218 180 226" stroke={deep} strokeWidth="6" fill="none" strokeLinecap="round"/></>
        : <><path d="M112 194 Q126 178 140 194" stroke={deep} strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M198 194 Q212 178 226 194" stroke={deep} strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M156 222 Q169 240 182 222" stroke={deep} strokeWidth="6" fill="none" strokeLinecap="round"/></>;
  const bubble = it.t ? (
    <div style={{ position: 'absolute', left: 158, top: 4, maxWidth: 200, background: s.card, border: `2.5px solid ${c}`, borderRadius: 16, padding: '9px 14px', color: deep, fontSize: it.size || 22, fontWeight: 800, lineHeight: 1.35, whiteSpace: 'pre-wrap', boxShadow: s.cardShade, boxSizing: 'border-box' }}>{it.t}</div>
  ) : null;
  return <div style={{ ...BOX(s), width: w, height: h }}>
    <svg width={w} height={h} viewBox="0 0 360 300">
      <path d="M292 190 C320 160 342 148 352 156 C342 178 344 196 356 214 C332 214 308 208 290 198 Z" fill={deep}/>
      <path d="M42 210 C34 164 76 118 148 108 C226 97 292 126 306 184 C318 234 272 272 190 278 C108 284 52 258 42 210 Z" fill={light} stroke={deep} strokeWidth="4"/>
      <path d="M70 216 C86 250 132 266 190 264 C238 262 276 242 292 212 C252 236 112 240 70 216 Z" fill={s.skin || '#FFF3E6'}/>
      <path d="M78 214 C52 220 36 244 40 268 C64 262 88 244 98 222 Z" fill={c} stroke={deep} strokeWidth="3"/>
      <path d="M268 214 C292 220 308 244 304 268 C280 262 256 244 246 222 Z" fill={c} stroke={deep} strokeWidth="3"/>
      {eyes}
      <circle cx="94" cy="218" r="11" fill={s.blush || '#F4A9B8'} opacity="0.85"/>
      <circle cx="244" cy="218" r="11" fill={s.blush || '#F4A9B8'} opacity="0.85"/>
      <path d="M158 96 C150 78 154 64 166 52 C170 68 176 74 188 80" stroke={deep} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="166" cy="48" r="6" fill={c}/>
      <circle cx="184" cy="38" r="5" fill={c}/>
    </svg>
    {bubble}
  </div>;
};
