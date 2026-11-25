"""生成器：spec.json + 三库 -> 单个自包含 TSX -> 用 remotion 命令渲染。

本项目（remotion-Pro）只放库和剧集，不建 Remotion 工程。
每集自包含在一个目录：output/<id>/{spec.json, episode.tsx, episode.mp4, audio/, qa/}。
渲染统一在 ../../remotion-demo 执行，命令读取 output/<id>/episode.tsx。

用法：
    python build.py <id>              # 生成 TSX（含配音、base64 内联）
    python build.py <id> --render     # 生成 + 调用 demo 的 remotion 渲染

自包含含义：最终 TSX 把风格/动效/组件代码和音频(base64 data URL)全部内联，
单独一个文件拷到任何 Remotion 工程都能渲染，不依赖本项目的其它文件。
"""

import asyncio
import base64
import json
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
LIB = ROOT / "library"
OUTPUT = ROOT / "output"
DEMO = ROOT.parent.parent / "remotion-demo"
FPS = 30
GAP, HEAD, TAIL = 0.20, 0.30, 0.45

MOTION_IDS = ["pop", "rise", "stamp", "slideLeft", "slideRight", "flip", "typeIn", "fade", "drop", "shock", "tilt", "wobble", "unfold"]

# intent -> 默认排版/动效/错峰/标题（组装规则，改这里=改整套节奏）
RECIPE = {
    "hook":       ("center", "shock", 0, "误区"),
    "claim":      ("center", "pop", 0, "观点"),
    "contrast":   ("split", "flip", 5, "对比"),
    "enumerate":  ("grid", "pop", 3, "并列"),
    "steps":      ("timeline", "slideRight", 5, "步骤"),
    "quote":      ("center", "typeIn", 0, "原话"),
    "checklist":  ("column", "rise", 4, "清单"),
    "proof":      ("row", "rise", 4, "论据"),
    "conclusion": ("center", "stamp", 0, "结论"),
    "transition": ("center", "fade", 0, ""),
}


def probe(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)], text=True)
    return float(out.strip())


async def synth(text: str, target: Path, voice: str, rate: str) -> None:
    await edge_tts.Communicate(text, voice, rate=rate).save(str(target))


def read_lib(path: Path) -> str:
    return path.read_text(encoding="utf-8").rstrip()


async def build(spec_id: str) -> Path:
    ep = OUTPUT / spec_id
    if not ep.is_dir():
        raise SystemExit(f"没有这一集: output/{spec_id}/（先建目录并放 spec.json）")
    spec = json.loads((ep / "spec.json").read_text(encoding="utf-8"))
    style_id = spec["style"]
    style_path = LIB / "styles" / f"{style_id}.ts"
    if not style_path.exists():
        raise SystemExit(f"风格库无此风格: {style_id}（可选 paper/ink/fresh/whale）")

    # ---- 1. 配音 + 实测时间轴 ----
    audio_dir = ep / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)
    voice = spec.get("voice", "zh-CN-XiaoxiaoNeural")
    rate = spec.get("rate", "+8%")
    lines = spec["lines"]
    print(f"[{spec_id}] {len(lines)} 句, 风格 {style_id}, 音色 {voice}")

    mp3s = []
    for i, line in enumerate(lines):
        text = line["text"].replace("[[", "").replace("]]", "")
        target = audio_dir / f"sub-{i:02d}.mp3"
        if not target.exists():
            await synth(text, target, voice, rate)
        mp3s.append(target)

    t = HEAD
    bounds = []
    for target in mp3s:
        d = probe(target)
        start = round(t * FPS)
        t += d + GAP
        end = round(t * FPS)
        bounds.append([start, end])
    total = bounds[-1][1] + round(TAIL * FPS)

    subs = [{"start": b[0], "end": b[1], "text": ln["text"]} for b, ln in zip(bounds, lines)]
    chapters = [
        {"from": bounds[c["fromSub"]][0], "to": bounds[c["toSub"] - 1][1],
         "badge": c["badge"], "name": c["name"]}
        for c in spec["chapters"]
    ]

    # ---- 2. 按 intent 组装 beat（spec 不写 beat） ----
    # 动效逐项解析：item.motion > 行级 motion > intent 默认
    beats = []
    for i, line in enumerate(lines):
        layout, line_motion, stagger, title = line.get("layout"), line.get("motion"), None, line.get("title")
        r_layout, r_motion, r_stagger, r_title = RECIPE[line["intent"]]
        default_motion = line_motion or r_motion
        items = []
        for it in line["items"]:
            item = dict(it)
            item["motion"] = it.get("motion") or default_motion
            items.append(item)
        beats.append({
            "sub": i, "intent": line["intent"],
            "title": title if title is not None else r_title,
            "layout": layout or r_layout,
            "motion": default_motion,
            "stagger": r_stagger,
            "items": items,
        })

    # ---- 3. 校验 spec 引用的 id 都在库里（片段本身全量内联） ----
    used_kinds = {it["kind"] for line in lines for it in line["items"]}
    used_motions = {it["motion"] for b in beats for it in b["items"]} | {b["motion"] for b in beats} | {"drop", "fade"}  # 含逐项动效 + 外壳章节/标题用
    alias = {"iconChip": "chip", "steps": "flow"}                 # 合法别名，映射到真实片段
    lib_kinds = {p.stem for p in (LIB / "components").glob("*.tsx") if not p.name.startswith("_")}
    unknown = {k for k in used_kinds if alias.get(k, k) not in lib_kinds}
    if unknown:
        raise SystemExit(f"组件库缺片段: {sorted(unknown)}")
    missing_m = used_motions - set(MOTION_IDS)
    if missing_m:
        raise SystemExit(f"动效库缺片段: {sorted(missing_m)}")

    parts = []
    parts.append("/* 自动生成：库元素内联拼装，单文件自包含。修改请改 output/<id>/spec.json 和 library/，再跑 build.py */")
    parts.append('import React from "react";')
    parts.append('import { AbsoluteFill, Sequence, Audio, useCurrentFrame, interpolate, spring, Composition, registerRoot } from "remotion";')
    parts.append("")
    parts.append("// ===== 风格库 =====")
    parts.append(read_lib(style_path))
    parts.append("")
    parts.append("// ===== 动效库（全量内联：引擎的查表引用所有 id） =====")
    parts.append(read_lib(LIB / "motions" / "_common.ts"))
    for m in MOTION_IDS:
        parts.append(read_lib(LIB / "motions" / f"{m}.ts"))
    parts.append("")
    parts.append("// ===== 组件库（全量内联：引擎的查表引用所有 id） =====")
    parts.append(read_lib(LIB / "components" / "_icons.tsx"))
    for comp in sorted(p.stem for p in (LIB / "components").glob("*.tsx") if not p.name.startswith("_")):
        parts.append(read_lib(LIB / "components" / f"{comp}.tsx"))

    # ---- 4. 数据：音频 + 图片素材 base64 内联 ----
    def b64url(p: Path) -> str:
        return "data:audio/mpeg;base64," + base64.b64encode(p.read_bytes()).decode("ascii")

    # 图片素材：spec 里 kind=img 的 item 用 src 指定素材名
    # 先找单集私有 output/<id>/assets/<src>.*，再找共享 library/assets/**/<src>.*
    used_src = {it["src"] for line in lines for it in line["items"]
                if it.get("kind") == "img" and it.get("src")}
    exts = (".png", ".jpg", ".jpeg", ".webp", ".svg")
    def find_asset(src: str) -> Path:
        for base in (ep / "assets", LIB / "assets"):
            for ext in exts:
                p = base / f"{src}{ext}"
                if p.is_file():
                    return p
            if base.is_dir():  # 共享库按子目录归档，如 assets/whale/calendar.png
                for ext in exts:
                    hits = list(base.glob(f"**/{src}{ext}"))
                    if hits:
                        return hits[0]
        return None

    assets = {}
    for src in sorted(used_src):
        p = find_asset(src)
        if not p:
            raise SystemExit(f"图片素材缺失: {src}（放到 library/assets/**/ 或 output/{spec_id}/assets/，支持 png/jpg/webp/svg）")
        mime = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                ".webp": "image/webp", ".svg": "image/svg+xml"}[p.suffix.lower()]
        assets[src] = f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode("ascii")

    default_mascot = {"t": "鲸鲸!!", "face": "happy"} if style_id == "whale" else None
    mascots = [line.get("mascot") or spec.get("mascot") or default_mascot for line in lines]
    data = {
        "id": spec["id"], "title": spec["title"],
        "brand": spec.get("brand", spec["title"]),
        "durationInFrames": total, "subs": subs, "chapters": chapters, "beats": beats,
        "mascot": spec.get("mascot") or default_mascot, "mascots": mascots,
        "assets": assets,
        "audio": [b64url(p) for p in mp3s],
    }
    parts.append("")
    parts.append("// ===== 剧集数据（配音已 base64 内联） =====")
    parts.append("const DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";")
    parts.append("")
    parts.append("// ===== 引擎：把库元素组装成视频 =====")
    parts.append(read_lib(LIB / "engine.tsx"))

    tsx = ep / "episode.tsx"
    tsx.write_text("\n\n".join(parts) + "\n", encoding="utf-8")
    size_kb = tsx.stat().st_size / 1024
    print(f"  生成 output/{spec_id}/episode.tsx  {total / FPS:.2f}s ({total} 帧)  组件 {sorted(used_kinds)}  动效 {sorted(used_motions)}  {size_kb:.0f}KB")
    return tsx


async def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("用法: python build.py <spec-id> [--render]")
    spec_id = sys.argv[1]
    tsx = await build(spec_id)
    if "--render" in sys.argv:
        out_mp4 = OUTPUT / spec_id / "episode.mp4"
        # 从 demo 目录执行 remotion（依赖在 demo），entry 用相对 demo 的路径
        entry = f"../remotion-Pro/02-generate-video/output/{spec_id}/episode.tsx"
        # Windows 下 npx 是 .cmd，subprocess 需 shell=True 才能找到
        cmd = f'npx remotion render "{entry}" {spec_id} "{out_mp4}"'
        print("渲染:", cmd, f"(cwd={DEMO})")
        subprocess.run(cmd, cwd=DEMO, check=True, shell=True)
        print(f"DONE {out_mp4}")


if __name__ == "__main__":
    asyncio.run(main())
