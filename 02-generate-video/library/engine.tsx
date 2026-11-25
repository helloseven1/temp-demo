// 引擎片段：把三库的零件组装成视频（生成器总是内联）
// 依赖：STYLE（风格片段）、m_* / D_*（动效片段）、c_*（组件片段）、DATA（剧集数据）

// ---- 组件尺寸表（查组件库登记） ----
const SIZE: Record<string, [number, number]> = {
  sticky: [390, 190], card: [430, 250], chip: [300, 100], iconChip: [300, 100],
  quote: [1320, 290], big: [1400, 220], stamp: [210, 210], tick: [580, 90],
  compare: [1320, 300], balance: [900, 260], table: [1240, 380],
  flow: [390, 230], steps: [390, 230], kpi: [440, 260],
  trioSticky: [1180, 330], lensBar: [1100, 280], illustration: [240, 240], mascot: [360, 300], img: [240, 240],
  wHook: [1320, 300], wQuote: [1320, 280], wVersus: [1320, 300], wBalance: [900, 260],
  wTable: [1240, 380], wMetric: [440, 260], wFlow: [1320, 220],
};
const RENDER: Record<string, any> = {
  sticky: c_sticky, card: c_card, chip: c_chip, iconChip: c_chip, quote: c_quote,
  big: c_big, stamp: c_stamp, tick: c_tick, compare: c_compare, balance: c_balance,
  table: c_table, flow: c_flow, steps: c_flow, kpi: c_kpi,
  trioSticky: c_trioSticky, lensBar: c_lensBar, illustration: c_illustration, mascot: c_mascot, img: c_img,
  wHook: c_wHook, wQuote: c_wQuote, wVersus: c_wVersus, wBalance: c_wBalance,
  wTable: c_wTable, wMetric: c_wMetric, wFlow: c_wFlow,
};
const MOTION_FN: Record<string, any> = {
  pop: m_pop, rise: m_rise, stamp: m_stamp, slideLeft: m_slideLeft, slideRight: m_slideRight,
  flip: m_flip, typeIn: m_typeIn, fade: m_fade, drop: m_drop, shock: m_shock, tilt: m_tilt,
  wobble: m_wobble, unfold: m_unfold,
};
const MOTION_DUR: Record<string, number> = {
  pop: D_pop, rise: D_rise, stamp: D_stamp, slideLeft: D_slideLeft, slideRight: D_slideRight,
  flip: D_flip, typeIn: D_typeIn, fade: D_fade, drop: D_drop, shock: D_shock, tilt: D_tilt,
  wobble: D_wobble, unfold: D_unfold,
};

// ---- 意图配方：intent 决定布局/动效/错峰/标题 ----
const RECIPE: Record<string, any> = {
  hook:       { layout: 'center', motion: 'shock', stagger: 0, title: '误区' },
  claim:      { layout: 'center', motion: 'pop', stagger: 0, title: '观点' },
  contrast:   { layout: 'split', motion: 'flip', stagger: 5, title: '对比' },
  enumerate:  { layout: 'grid', motion: 'pop', stagger: 3, title: '并列' },
  steps:      { layout: 'timeline', motion: 'slideRight', stagger: 5, title: '步骤' },
  quote:      { layout: 'center', motion: 'typeIn', stagger: 0, title: '原话' },
  checklist:  { layout: 'column', motion: 'rise', stagger: 4, title: '清单' },
  proof:      { layout: 'row', motion: 'rise', stagger: 4, title: '论据' },
  conclusion: { layout: 'center', motion: 'stamp', stagger: 0, title: '结论' },
  transition: { layout: 'center', motion: 'fade', stagger: 0, title: '' },
};

// ---- 排版：按布局+尺寸算中心点 ----
const positions = (layout: string, items: any[]): [number, number][] => {
  const n = items.length, cx = 750, cy = 350, out: [number, number][] = [];
  const wh = (i: number) => SIZE[items[i].kind] || [390, 190];
  if (layout === 'center') { for (let i = 0; i < n; i++) out.push([cx, cy]); return out; }
  if (layout === 'column') {
    const gap = 34, hs = items.map((_, i) => wh(i)[1]);
    const total = hs.reduce((a: number, b: number) => a + b, 0) + gap * (n - 1);
    let y = cy - total / 2;
    for (let i = 0; i < n; i++) { out.push([cx, y + hs[i] / 2]); y += hs[i] + gap; }
    return out;
  }
  if (layout === 'row') {
    const gap = 40, ws = items.map((_, i) => wh(i)[0]);
    const total = ws.reduce((a: number, b: number) => a + b, 0) + gap * (n - 1);
    let x = cx - total / 2;
    for (let i = 0; i < n; i++) { out.push([x + ws[i] / 2, cy]); x += ws[i] + gap; }
    return out;
  }
  if (layout === 'grid') {
    const cols = n === 4 ? 2 : Math.min(3, n), cw = 410, chh = 210, gx = 48, gy = 44;
    const rows = Math.ceil(n / cols);
    const bx = cx - (cols * cw + (cols - 1) * gx) / 2, by = cy - (rows * chh + (rows - 1) * gy) / 2;
    for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); out.push([bx + c * (cw + gx) + cw / 2, by + r * (chh + gy) + chh / 2]); }
    return out;
  }
  if (layout === 'split') { if (n === 1) { out.push([cx, cy]); return out; } for (let i = 0; i < n; i++) out.push([i % 2 === 0 ? cx - 380 : cx + 380, cy]); return out; }
  if (layout === 'timeline') { const gap = Math.min(360, 1400 / Math.max(n, 1)); const total = gap * (n - 1); for (let i = 0; i < n; i++) out.push([cx - total / 2 + i * gap, cy]); return out; }
  const spots: [number, number][] = [[cx - 420, cy - 150], [cx + 400, cy - 170], [cx - 380, cy + 170], [cx + 420, cy + 160], [cx, cy]];
  for (let i = 0; i < n; i++) out.push(spots[i % spots.length]);
  return out;
};

// ---- 外壳：背景/进度/章节/字幕/吉祥物 ----
const Rich: React.FC<{ text: string }> = ({ text }) => {
  const out: React.ReactNode[] = []; let rest = text, k = 0;
  while (rest.includes('[[')) {
    const a = rest.indexOf('[['); out.push(rest.slice(0, a)); rest = rest.slice(a + 2);
    const b = rest.indexOf(']]'); if (b < 0) { out.push(rest); break; }
    out.push(<span key={k++} style={{ color: STYLE.hi, fontWeight: 900 }}>{rest.slice(0, b)}</span>);
    rest = rest.slice(b + 2);
  }
  out.push(rest); return <>{out}</>;
};

const Shell: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => {
  const s = STYLE;
  const p = frame / DATA.durationInFrames;
  const ch = DATA.chapters.find((c: any) => frame >= c.from && frame < c.to) || DATA.chapters[DATA.chapters.length - 1];
  const badgeAnim = m_drop(frame, ch.from, 12);
  const si = DATA.subs.findIndex((x: any) => frame >= x.start && frame < x.end);
  const sub = si >= 0 ? DATA.subs[si] : undefined;
  const mas = DATA.mascots?.[si] || DATA.mascot;
  const subOp = sub ? interpolate(frame, [sub.start, sub.start + 5, sub.end - 5, sub.end], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const plain = sub ? sub.text.replace(/\[\[|\]\]/g, '') : '';
  const sf = plain.length <= 22 ? 32 : plain.length <= 38 ? 27 : plain.length <= 55 ? 23 : 20;
  const fy = Math.sin(frame / 26) * 5;
  return (
    <AbsoluteFill style={{ background: s.paper, fontFamily: s.font, backgroundImage: `radial-gradient(${s.dot} ${s.dotSize}px, transparent ${s.dotSize}px)`, backgroundSize: `${s.dotGap}px ${s.dotGap}px` }}>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 34, height: 8, background: s.progressTrack, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${p * 100}%`, height: '100%', background: s.progress, borderRadius: 99 }} />
      </div>
      <div style={{ position: 'absolute', left: 60, top: 46, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="whale" color={s.progress} size={30} />
        <span style={{ color: s.inkSoft, fontSize: 19, fontWeight: 800 }}>{DATA.brand}</span>
      </div>
      <div style={{ position: 'absolute', right: 60, top: 50 }}><Icon name="flag" color={s.accents.rose} size={26} /></div>
      <div style={{ position: 'absolute', left: 62, top: 104, display: 'flex', alignItems: 'center', gap: 12, opacity: badgeAnim.opacity, transform: badgeAnim.transform }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: s.chapterBadge, color: s.card, fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch.badge}</div>
        <div style={{ background: s.chapterName, color: s.chapterNameText, borderRadius: 12, padding: '10px 20px', fontSize: 22, fontWeight: 800 }}>{ch.name}</div>
      </div>
      <AbsoluteFill style={{ top: 190, bottom: 190, left: 60, right: 60 }}>{children}</AbsoluteFill>
      {mas && s.hero ? (
        <div style={{ position: 'absolute', left: 18, bottom: 70, width: 360, height: 300, transform: `translateY(${fy}px)` }}>
          {c_mascot(mas, 360, 300, s, {})}
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 34, bottom: 150, transform: `translateY(${fy}px)` }}>
          <div style={{ width: 92, height: 92, borderRadius: '50%', background: s.progress, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 24px ${s.progress}55`, border: `4px solid ${s.card}` }}>
            <Icon name="whale" color={s.card} size={52} />
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', left: '50%', bottom: 54, transform: 'translateX(-50%)', maxWidth: s.W - 180, minWidth: 460, width: 'max-content', background: s.subBg, borderRadius: 18, padding: '16px 34px', color: s.subText, fontSize: sf, fontWeight: 700, lineHeight: 1.45, textAlign: 'center', opacity: subOp, boxSizing: 'border-box' }}>
        {sub ? <Rich text={sub.text} /> : '　'}
      </div>
    </AbsoluteFill>
  );
};

// ---- 节拍渲染：摆位 + 套动效 + 退场 ----
const TILT = [0, -3, 3, -2, 2];
const BeatView: React.FC<{ beat: any; from: number; until: number; frame: number }> = ({ beat, from, until, frame }) => {
  const s = STYLE, pts = positions(beat.layout, beat.items);
  // 标题句末也要淡出，否则历史标题会逐句累积在左上角
  const titleOp = m_fade(frame, from, 8).opacity * (frame >= until - 6 ? Math.max(0, (until - frame) / 6) : 1);
  return <>
    {beat.title && <div style={{ position: 'absolute', left: 0, top: 6, fontFamily: s.font, color: s.chapterNameText, background: s.chapterName, borderRadius: s.rSm, padding: '6px 18px', fontSize: 22, fontWeight: 700, opacity: titleOp }}>{beat.title}</div>}
    {beat.items.map((it: any, i: number) => {
      const at = from + 5 + i * beat.stagger;
      const motion = it.motion || beat.motion;
      const m = MOTION_FN[motion](frame, at, MOTION_DUR[motion]);
      const fadeOut = frame >= until - 7 ? Math.max(0, (until - frame) / 7) : 1;
      // 入场门控：未到出场帧一律不可见，避免 typeIn 等 opacity 恒 1 的动效跨页串味
      const enterGate = frame < at ? 0 : 1;
      const op = m.opacity * fadeOut * enterGate;
      if (op <= 0.001) return null;
      const [px, py] = pts[i] || [750, 350];
      const [w, h] = it.w && it.h ? [it.w, it.h] : (SIZE[it.kind] || [390, 190]);
      const rot = (it.kind === 'sticky' || it.kind === 'stamp') ? TILT[i % TILT.length] : 0;
      return <div key={i} style={{ position: 'absolute', left: px - w / 2, top: py - h / 2, width: w, height: h, opacity: op, transform: m.transform, transformOrigin: 'center' }}>
        <div style={{ width: '100%', height: '100%', transform: `rotate(${rot}deg)` }}>
          {RENDER[it.kind](it, w, h, s, { index: i, rot: 0, typing: m.typing })}
        </div>
      </div>;
    })}
  </>;
};

// ---- 主组件 ----
const Video: React.FC = () => {
  const frame = useCurrentFrame();
  return <Shell frame={frame}>
    {DATA.audio.map((src: string, i: number) => {
      const sub = DATA.subs[i]; if (!sub) return null;
      return <Sequence key={`a${i}`} from={sub.start} durationInFrames={sub.end - sub.start}><Audio src={src} volume={0.95} /></Sequence>;
    })}
    {DATA.beats.map((beat: any, i: number) => {
      const sub = DATA.subs[beat.sub]; if (!sub) return null;
      return <BeatView key={`b${i}`} beat={beat} from={sub.start} until={sub.end} frame={frame} />;
    })}
  </Shell>;
};

const Root: React.FC = () => (
  <Composition id={DATA.id} component={Video} durationInFrames={DATA.durationInFrames} fps={STYLE.FPS} width={STYLE.W} height={STYLE.H} />
);
registerRoot(Root);
