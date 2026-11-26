"""生成器：spec.json + 三库 -> 单个自包含 TSX -> 用 remotion 命令渲染。

单项目布局：02-generate-video 住在 Remotion 工程内，库/生成器/spec/成片都在 02-generate-video/，依赖（node_modules）在项目根。
每集自包含在一个目录：output/<id>/{spec.json, episode.tsx, episode.mp4, audio/, qa/}。
渲染在项目根执行，命令读取 02-generate-video/output/<id>/episode.tsx。

用法：
    python build.py <id>              # 生成 TSX（含配音、base64 内联）
    python build.py <id> --render     # 生成 + 调用 demo 的 remotion 渲染

自包含含义：最终 TSX 把风格/动效/组件代码和音频(base64 data URL)全部内联，
单独一个文件拷到任何 Remotion 工程都能渲染，不依赖本项目的其它文件。
"""

import asyncio
import base64
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
LIB = ROOT / "library"
OUTPUT = ROOT / "output"
DEMO = ROOT.parent                      # 项目根（node_modules 所在，npx 在这执行）
FPS = 30
GAP, HEAD, TAIL = 0.20, 0.30, 0.45


def _find_ffprobe() -> str:
    """ffprobe 定位：优先 PATH；其次项目根 npm 装的 ffprobe-static 二进制。"""
    hit = shutil.which("ffprobe")
    if hit:
        return hit
    for plat in ("win32/x64/ffprobe.exe", "linux/x64/ffprobe", "linux/arm64/ffprobe",
                 "darwin/x64/ffprobe", "darwin/arm64/ffprobe"):
        cand = DEMO / "node_modules" / "ffprobe-static" / "bin" / plat
        if cand.is_file():
            return str(cand)
    raise SystemExit("找不到 ffprobe：装进 PATH，或在项目根执行 npm i ffprobe-static")


FFPROBE = _find_ffprobe()

MOTION_IDS = sorted(p.stem for p in (LIB / "motions").glob("*.ts")
                    if not p.name.startswith("_"))   # 动效登记=文件存在，新增动效丢文件即可

# intent -> 默认排版/动效/错峰/标题（组装规则，改这里=改整套节奏）
RECIPE = json.loads((LIB / "recipe.json").read_text(encoding="utf-8"))
# 意图配方（数据文件）：intent -> 默认布局/动效/错峰/小标题，改它=改全厂默认节奏


def probe(path: Path) -> float:
    out = subprocess.check_output(
        [FFPROBE, "-v", "error", "-show_entries", "format=duration",
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
    # 每风格一个目录，可拆多文件：按 tokens→shell→place→title 固定顺序内联，其余文件按文件名追加
    style_dir = LIB / "styles" / style_id
    if not style_dir.is_dir():
        raise SystemExit(f"风格库无此风格: {style_id}（可选 paper/ink/fresh/whale；每风格一个目录）")
    ORDER = ("tokens", "shell", "place", "title")
    frags = [style_dir / (base + ".tsx") for base in ORDER]
    frags += [p for p in sorted(style_dir.glob("*.tsx")) if p.stem not in ORDER]
    frags = [p for p in frags if p.is_file()]
    if not frags:
        raise SystemExit(f"风格目录为空: {style_dir}")
    SEP = chr(10) + chr(10)  # 片段拼接空行（避免转义歧义）
    style_src = SEP.join(read_lib(f) for f in frags)
    for piece in ("const STYLE", "const SHELL", "const PLACE"):   # TITLE 为可选件
        if piece not in style_src:
            raise SystemExit(f"风格缺 {piece}: {style_id}（视觉全部归风格，见 docs/库字典.md 风格契约）")

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
        # 零字节缓存视为无效（TTS 偶发 NoAudioReceived 会留下空文件）
        if not target.exists() or target.stat().st_size == 0:
            target.unlink(missing_ok=True)
            for attempt in range(3):          # edge-tts 偶发断流，重试 3 次
                try:
                    await synth(text, target, voice, rate)
                    if target.stat().st_size > 0:
                        break
                except Exception:
                    target.unlink(missing_ok=True)
                    if attempt == 2:
                        raise
                    await asyncio.sleep(1.5 * (attempt + 1))
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
        r = RECIPE.get(line["intent"])
        if r is None:
            raise SystemExit(f"未知 intent: {line['intent']}（可用：{', '.join(sorted(RECIPE))} → 参考 docs/库字典.md §4）")
        default_motion = line_motion or r["motion"]
        items = []
        for it in line["items"]:
            item = dict(it)
            item["motion"] = it.get("motion") or default_motion
            items.append(item)
        beats.append({
            "sub": i, "intent": line["intent"],
            "title": title if title is not None else r["title"],
            "layout": layout or r["layout"],
            "motion": default_motion,
            "stagger": r["stagger"],
            "items": items,
        })

    # ---- 3. 校验 spec 引用的 id 都在库里（片段本身全量内联） ----
    used_kinds = {it["kind"] for line in lines for it in line["items"]}
    used_motions = {it["motion"] for b in beats for it in b["items"]} | {b["motion"] for b in beats} | {"drop", "fade"}  # 含逐项动效 + 外壳章节/标题用
    alias = {"iconChip": "chip", "steps": "flow"}                 # 合法别名，映射到真实片段
    # 媒体装载器：library 根级 *.tsx（与 engine 同级；engine.tsx 除外），与组件同等「丢文件即登记」
    players = {p.stem: read_lib(p) for p in LIB.glob("*.tsx") if p.stem != "engine"}
    lib_kinds = ({p.stem for p in (LIB / "components").glob("*.tsx") if not p.name.startswith("_")}
                 | set(players))
    unknown = {k for k in used_kinds if alias.get(k, k) not in lib_kinds}
    if unknown:
        raise SystemExit(f"组件库缺片段: {sorted(unknown)}")
    missing_m = used_motions - set(MOTION_IDS)
    if missing_m:
        raise SystemExit(f"动效库缺片段: {sorted(missing_m)}")

    parts = []
    parts.append("/* 自动生成：库元素内联拼装，单文件自包含。修改请改 output/<id>/spec.json 和 library/，再跑 build.py */")
    parts.append('import React from "react";')
    parts.append('import { AbsoluteFill, Sequence, Audio, useCurrentFrame, interpolate, spring, Composition, registerRoot, staticFile } from "remotion";')
    # 官方原语（@remotion/* 已装在项目根 node_modules；未用到的会被打包器 tree-shake 掉，不增体积）
    parts.append('import { Rect, Circle, Ellipse, Triangle, Polygon, Star, Heart, Pie, Arrow, Callout, Spark } from "@remotion/shapes";')
    parts.append('import { evolvePath, getLength, getPointAtLength, interpolatePath } from "@remotion/paths";')
    parts.append('import { noise2D, noise3D } from "@remotion/noise";')
    parts.append('import { Trail, CameraMotionBlur } from "@remotion/motion-blur";')
    parts.append('import { Lottie, getLottieMetadata } from "@remotion/lottie";')
    parts.append('import { Gif } from "@remotion/gif";')
    parts.append("")
    parts.append("// ===== 风格库 =====")
    parts.append(style_src)
    # ---- 按需内联：只带本期用到的组件/动效（含组件间引用的传递闭包） ----
    comp_stems = {p.stem for p in (LIB / "components").glob("*.tsx") if not p.name.startswith("_")}
    comp_src = {k: read_lib(LIB / "components" / f"{k}.tsx") for k in comp_stems}
    comp_src.update(players)

    def comp_closure(roots: set) -> set:
        """roots 及其引用的 c_xxx 全部落网（如 wHook 内部调 c_illustration）。"""
        seen, queue = set(roots), list(roots)
        while queue:
            k = queue.pop()
            src = comp_src.get(alias.get(k, k))
            if not src:
                continue
            for ref in set(re.findall(r"c_([A-Za-z0-9]+)", src)):
                if ref not in seen:
                    seen.add(ref)
                    queue.append(ref)
        return seen

    def motion_closure(roots: set) -> set:
        seen, queue = set(roots), list(roots)
        while queue:
            m0 = queue.pop()
            p = LIB / "motions" / f"{m0}.ts"
            if not p.is_file():
                continue
            for ref in set(re.findall(r"m_([A-Za-z0-9]+)", read_lib(p))):
                if ref in MOTION_IDS and ref not in seen:
                    seen.add(ref)
                    queue.append(ref)
        return seen

    kinds = comp_closure(used_kinds)          # 组件闭包（含别名归一后的真名）
    motions = motion_closure(used_motions)    # used_motions 已含外壳 drop、engine fade

    parts.append("")
    parts.append("// ===== 动效库（按需内联） =====")
    parts.append(read_lib(LIB / "motions" / "_common.ts"))
    for m in sorted(motions):
        parts.append(read_lib(LIB / "motions" / f"{m}.ts"))
    parts.append("")
    parts.append("// ===== 组件库（按需内联：有具体长相的视觉件） =====")
    parts.append(read_lib(LIB / "components" / "_icons.tsx"))
    for k in sorted(k for k in kinds if alias.get(k, k) in comp_stems):
        parts.append(comp_src[alias.get(k, k)])
    parts.append("")
    parts.append("// ===== 媒体装载器（library 根级 *.tsx，engine 同级；内容无关的通用播放器） =====")
    for k in sorted(k for k in kinds if alias.get(k, k) in players):
        parts.append(comp_src[alias.get(k, k)])
    # 组件必须自带 SZ_ 尺寸声明（丢文件即登记的一部分）
    for k in sorted(kinds):
        cs = comp_src[alias.get(k, k)]
        if f"SZ_{alias.get(k, k)}" not in cs:
            raise SystemExit(f"组件缺 SZ_{alias.get(k, k)} 尺寸声明: {alias.get(k, k)}.tsx（见 docs/库字典.md §2）")

    parts.append("")
    parts.append("// ===== 登记表（按本期用量生成，engine 只查表） =====")
    all_keys = sorted(used_kinds | kinds)     # used_kinds 含 spec 原始写法（别名键）
    render_entries = ", ".join(f"{k}: c_{alias.get(k, k)}" for k in all_keys)
    size_entries = ", ".join(f"{k}: SZ_{alias.get(k, k)}" for k in all_keys)
    motion_entries = ", ".join(f"{m}: m_{m}" for m in sorted(motions))
    dur_entries = ", ".join(f"{m}: D_{m}" for m in sorted(motions))
    parts.append(f"const SIZE: Record<string, [number, number]> = {{ {size_entries} }};")
    parts.append(f"const RENDER: Record<string, any> = {{ {render_entries} }};")
    parts.append(f"const MOTION_FN: Record<string, any> = {{ {motion_entries} }};")
    parts.append(f"const MOTION_DUR: Record<string, number> = {{ {dur_entries} }};")

    # ---- 4. 数据：音频 + 图片素材 base64 内联 ----
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

    # 图片素材零拷贝：私有素材（output/<id>/assets/）原地不动；共享素材拷一份到本集 assets/
    # DATA.assets 只存 public-dir 相对路径，渲染经 --public-dir 伺服（与配音同一条链路）
    (ep / "assets").mkdir(exist_ok=True)
    assets = {}
    for src in sorted(used_src):
        p = find_asset(src)
        if not p:
            raise SystemExit(f"图片素材缺失: {src}（放到 library/assets/**/ 或 output/{spec_id}/assets/，支持 png/jpg/webp/svg）")
        staged = ep / "assets" / p.name
        if p != staged:
            shutil.copy2(p, staged)
        assets[src] = f"{spec_id}/assets/{p.name}"

    # Lottie 素材：src 写 json 名（不带扩展名），解析成对象内联进 DATA.lottie（非 base64）
    used_lottie = {it["src"] for line in lines for it in line["items"]
                   if it.get("kind") == "lottie" and it.get("src")}
    lottie = {}
    for src in sorted(used_lottie):
        hit = None
        for base in (ep / "assets", LIB / "assets"):
            cand = base / f"{src}.json"
            if cand.is_file():
                hit = cand
                break
            if base.is_dir():
                hits = list(base.glob(f"**/{src}.json"))
                if hits:
                    hit = hits[0]
                    break
        if not hit:
            raise SystemExit(f"Lottie 素材缺失: {src}.json（放到 library/assets/**/ 或 output/{spec_id}/assets/）")
        lottie[src] = json.loads(hit.read_text(encoding="utf-8"))

    default_mascot = {"t": "鲸鲸!!", "face": "happy"} if style_id == "whale" else None
    mascots = [line.get("mascot") or spec.get("mascot") or default_mascot for line in lines]
    data = {
        "id": spec["id"], "title": spec["title"],
        "brand": spec.get("brand", spec["title"]),
        "durationInFrames": total, "subs": subs, "chapters": chapters, "beats": beats,
        "mascot": spec.get("mascot") or default_mascot, "mascots": mascots,
        "assets": assets,
        "lottie": lottie,
        "audio": [f"{spec_id}/audio/{p.name}" for p in mp3s],  # public-dir（=output/）相对路径
    }
    parts.append("")
    parts.append("// ===== 剧集数据（配音走 public-dir 引用，文件留在 audio/ 原地，零拷贝） =====")
    parts.append("const DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";")
    parts.append("")
    parts.append("// ===== 引擎：把库元素组装成视频 =====")
    parts.append(read_lib(LIB / "engine.tsx"))

    tsx = ep / "episode.tsx"
    tsx.write_text("\n\n".join(parts) + "\n", encoding="utf-8")
    size_kb = tsx.stat().st_size / 1024
    print(f"  生成 output/{spec_id}/episode.tsx  {total / FPS:.2f}s ({total} 帧)  组件 {len(kinds)}/{len(comp_src)} 按需内联  动效 {len(motions)}/{len(MOTION_IDS)}  {size_kb:.0f}KB")
    return tsx


async def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("用法: python build.py <spec-id> [--render]")
    spec_id = sys.argv[1]
    tsx = await build(spec_id)
    if "--render" in sys.argv:
        out_mp4 = OUTPUT / spec_id / "episode.mp4"
        # 从 demo 目录执行 remotion（依赖在 demo），entry 用相对 demo 的路径
        entry = f"02-generate-video/output/{spec_id}/episode.tsx"
        # Windows 下 npx 是 .cmd，subprocess 需 shell=True 才能找到
        cmd = f'npx remotion render "{entry}" {spec_id} "{out_mp4}" --public-dir "02-generate-video/output"'
        print("渲染:", cmd, f"(cwd={DEMO})")
        subprocess.run(cmd, cwd=DEMO, check=True, shell=True)
        print(f"DONE {out_mp4}")


if __name__ == "__main__":
    asyncio.run(main())
