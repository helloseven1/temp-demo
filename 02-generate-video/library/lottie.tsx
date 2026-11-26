// lottie 组件：设计师预制动画（Lottie JSON）逐帧 seek
// 契约：props { src（json 素材名，不带扩展名）, t?（下方标签）, loop?（默认 true） }
// from = ctx.at（item 出场帧，engine 传入）→ 动画从本 item 出场那帧开始，而非全局帧
const c_lottie = (it: any, w: number, h: number, s: any, ctx: any): React.ReactNode => {
  const data = (DATA.lottie || {})[it.src];
  if (!data) return null;
  const labelH = it.t ? 42 : 0;
  const side = Math.max(40, Math.min(w, h - labelH));
  return (
    <div style={{ ...BOX(s), width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <Lottie animationData={data} from={ctx.at ?? 0} loop={it.loop !== false} style={{ width: side, height: side }} />
      {it.t ? <div style={{ color: s.inkSoft, fontSize: 22, fontWeight: 800, fontFamily: s.font }}>{it.t}</div> : null}
    </div>
  );
};

// 组件缺省尺寸（布局用；spec 的 w/h 可覆盖）
const SZ_lottie: [number, number] = [300, 300];
