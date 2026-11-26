// 节拍小标题（TITLE）：胶囊式（引擎只传文本和透明度，样式与位置全归风格）

const TITLE: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ position: 'absolute', left: 0, top: 6, fontFamily: STYLE.font, color: STYLE.chapterNameText, background: STYLE.chapterName, borderRadius: STYLE.rSm, padding: '6px 18px', fontSize: 22, fontWeight: 700, opacity }}>{text}</div>
);
