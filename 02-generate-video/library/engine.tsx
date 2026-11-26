// 引擎片段：解析 + 调度（生成器总是内联）。视觉决策全部在风格库（SHELL/PLACE/TITLE/token）；
// 三张登记表 SIZE / RENDER / MOTION_* 全部由 build.py 从库文件自动生成（丢文件即登记）；
// engine 只做查表翻译、时序（错峰/门控/淡出）、动效应用、配音对齐和组合注册。
// 依赖：STYLE（风格片段）、m_* / D_*（动效片段）、c_*（组件片段）、DATA（剧集数据）

// ---- 字幕富文本（[[高亮]] 解析；外壳 SHELL 已下放风格库，此处仅供其调用） ----
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

// ---- 节拍渲染：时序 + 调度（摆位归风格 PLACE、小标题归风格 TITLE、微倾斜归 token tilt） ----
const BeatView: React.FC<{ beat: any; from: number; until: number; frame: number }> = ({ beat, from, until, frame }) => {
  const s = STYLE, tilt = s.tilt || [0, 0, 0, 0, 0];
  const pts = PLACE(beat.layout, beat.items, SIZE);
  // 标题句末也要淡出，否则历史标题会逐句累积在左上角
  const titleOp = m_fade(frame, from, 8).opacity * (frame >= until - 6 ? Math.max(0, (until - frame) / 6) : 1);
  return <>
    {beat.title && (typeof TITLE !== 'undefined') && <TITLE text={beat.title} opacity={titleOp} />}
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
      const rot = (it.kind === 'sticky' || it.kind === 'stamp') ? tilt[i % tilt.length] : 0;
      return <div key={i} style={{ position: 'absolute', left: px - w / 2, top: py - h / 2, width: w, height: h, opacity: op, transform: m.transform, transformOrigin: 'center' }}>
        <div style={{ width: '100%', height: '100%', transform: `rotate(${rot}deg)` }}>
          {RENDER[it.kind](it, w, h, s, { index: i, rot: 0, typing: m.typing, at })}
        </div>
      </div>;
    })}
  </>;
};

// ---- 主组件 ----
// 引擎只算「现在是什么」（当前句、当前章节）；「放哪、长什么样」归风格 SHELL
const Video: React.FC = () => {
  const frame = useCurrentFrame();
  if (typeof SHELL === 'undefined' || typeof PLACE === 'undefined') {
    throw new Error('风格库缺 SHELL / PLACE（视觉全部归风格，见 docs/库字典.md 风格契约）');
  }
  const ch = DATA.chapters.find((c: any) => frame >= c.from && frame < c.to) || DATA.chapters[DATA.chapters.length - 1];
  const si = DATA.subs.findIndex((x: any) => frame >= x.start && frame < x.end);
  const sub = si >= 0 ? DATA.subs[si] : undefined;
  return <SHELL frame={frame} ch={ch} sub={sub}>
    {DATA.audio.map((src: string, i: number) => {
      const sub = DATA.subs[i]; if (!sub) return null;
      return <Sequence key={`a${i}`} from={sub.start} durationInFrames={sub.end - sub.start}><Audio src={staticFile(src)} volume={0.95} /></Sequence>;
    })}
    {DATA.beats.map((beat: any, i: number) => {
      const sub = DATA.subs[beat.sub]; if (!sub) return null;
      return <BeatView key={`b${i}`} beat={beat} from={sub.start} until={sub.end} frame={frame} />;
    })}
  </SHELL>;
};

const Root: React.FC = () => (
  <Composition id={DATA.id} component={Video} durationInFrames={DATA.durationInFrames} fps={STYLE.FPS} width={STYLE.W} height={STYLE.H} />
);
registerRoot(Root);
