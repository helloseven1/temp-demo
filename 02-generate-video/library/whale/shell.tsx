// 外壳骨架（SHELL）：顶部进度条 · 左上品牌 · 右上小旗 · 左上章节徽章 · 底部居中字幕胶囊

// 外壳契约：接收 { frame, ch（当前章节）, sub（当前字幕，可空）, children（内容区） }，
// 决定常驻元素放哪、长什么样；children 是引擎排好的节拍内容，必须渲染。

const SHELL: React.FC<{ frame: number; ch: any; sub?: any; children?: React.ReactNode }> = ({ frame, ch, sub, children }) => {
  const s = STYLE;
  const p = frame / DATA.durationInFrames;
  const badgeAnim = m_drop(frame, ch.from, 12);
  const subOp = sub ? interpolate(frame, [sub.start, sub.start + 5, sub.end - 5, sub.end], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const plain = sub ? sub.text.replace(/\[\[|\]\]/g, '') : '';
  const sf = plain.length <= 22 ? 32 : plain.length <= 38 ? 27 : plain.length <= 55 ? 23 : 20;
  return (
    <AbsoluteFill style={{ background: s.paper, fontFamily: s.font, backgroundImage: `radial-gradient(${s.dot} ${s.dotSize}px, transparent ${s.dotSize}px)`, backgroundSize: `${s.dotGap}px ${s.dotGap}px` }}>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 34, height: 8, background: s.progressTrack, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${p * 100}%`, height: '100%', background: s.progress, borderRadius: 99 }} />
      </div>
      <div style={{ position: 'absolute', left: 60, top: 46 }}>
        <span style={{ color: s.inkSoft, fontSize: 19, fontWeight: 800 }}>{DATA.brand}</span>
      </div>
      <div style={{ position: 'absolute', right: 60, top: 50 }}><Icon name="flag" color={s.accents.rose} size={26} /></div>
      <div style={{ position: 'absolute', left: 62, top: 104, display: 'flex', alignItems: 'center', gap: 12, opacity: badgeAnim.opacity, transform: badgeAnim.transform }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: s.chapterBadge, color: s.card, fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch.badge}</div>
        <div style={{ background: s.chapterName, color: s.chapterNameText, borderRadius: 12, padding: '10px 20px', fontSize: 22, fontWeight: 800 }}>{ch.name}</div>
      </div>
      <AbsoluteFill style={{ top: 190, bottom: 190, left: 60, right: 60 }}>{children}</AbsoluteFill>
      <div style={{ position: 'absolute', left: '50%', bottom: 54, transform: 'translateX(-50%)', maxWidth: s.W - 180, minWidth: 460, width: 'max-content', background: s.subBg, borderRadius: 18, padding: '16px 34px', color: s.subText, fontSize: sf, fontWeight: 700, lineHeight: 1.45, textAlign: 'center', opacity: subOp, boxSizing: 'border-box' }}>
        {sub ? <Rich text={sub.text} /> : '　'}
      </div>
    </AbsoluteFill>
  );
};
