# Remotion 视频流水线 · 本机约束规范（AI 必读）

开工前必须先读本文件。先按第 0 节的管线一步步做，再遵守后面的本机硬约束，违反即返工。

---

## 0. 出片管线（AI 照这个顺序做）

目标产物：`H:/Multimodal-workspace/remotion-Pro/02-generate-video/output/<id>/episode.mp4`。
每一步都有明确产物；**没拿到上一步产物，不要进下一步**。

### 第 1 步：准备文案

- 从原始视频来：按本文件第 3 节用 WhisperX 转写，取 `txt`（纯文本、带标点），不要拿 `srt` 当稿子。
- 从新稿来：直接写成一句一行、带标点的中文句子。
- **产物**：一串干净的句子，还没标高亮、还没选组件。

### 第 2 步：切成 `lines`，标高亮

- 一句 = 一页。每句写进 `lines[]` 的 `text`。
- 只把关键词包成 `[[关键词]]`（配音时会自动去掉括号，画面里变高亮色）。
- 不要写 beat、坐标、颜色、时间码；这些由生成器算。
- **产物**：每句都有 `text` 的稿子列表。

### 第 3 步：建片子目录并写 `spec.json`

1. 建目录：`02-generate-video/output/<id>/`（`id` 用小写英文 + 连字符，和 `spec.json` 里的 `id` 同名）。
2. 在里面写 `spec.json`，至少给齐：
   - `id`、`title`、`style`（`paper` / `ink` / `fresh` / `whale`；要类原片风格选 `whale`）
   - `voice`、`rate`
   - `chapters`：`[{badge, name, fromSub, toSub}]`，用字幕下标（`toSub` 不含），不用帧号
   - `lines[]`：每句 `text`、`intent`、`items[]`
3. 每句选一个 `intent`；每个 item 选 `kind`（组件）和可选的 `motion`（动效）。
4. 查表：`docs/库字典.md`（有哪些 id、字段、尺寸、默认配方）；写法示例：`docs/使用规范.md`。

> 组件和动效自由组合。动效优先级：`items[i].motion` ＞ 行级 `motion` ＞ `intent` 默认。

- **产物**：`output/<id>/spec.json`，生成器只认这个文件。

### 第 4 步：只生成 TSX，先检查

```bash
cd "H:/Multimodal-workspace/remotion-Pro/02-generate-video"
python build.py <id>
```

> `python` 已加入用户 PATH，指向带 `edge_tts` 的受管 Python（重开终端后生效）。旧终端若仍指向 3.11，请先重开终端。

- 生成器会：edge-tts 分段配音 → ffprobe 实测时长 → 30fps 算帧边界 → 三库代码 + 文案 + 配音 base64 全内联。
- 产物：`output/<id>/episode.tsx`，单文件自包含。**不要手改它**，下次生成会覆盖。
- 想确认能否被 Remotion 识别：

```bash
cd "H:/Multimodal-workspace/remotion-demo"
npx remotion compositions ../remotion-Pro/02-generate-video/output/<id>/episode.tsx
```

### 第 5 步：渲染成片

```bash
cd "H:/Multimodal-workspace/remotion-Pro/02-generate-video"
python build.py <id> --render
```

- `build.py` 自动切到 `../remotion-demo` 执行 `npx remotion render`（Windows 下用 `shell=True`）。
- **产物**：`output/<id>/episode.mp4`。

### 第 6 步：抽帧核验 + 交付

1. 从成片抽帧到 `output/<id>/qa/`，至少看开头、中段、结尾。
2. 逐项检查：文字在卡片边框内；小标题句末淡出、没有逐句累积；镜头边界落在口播换句点；没有 zoom-through、没有删除线；否定用颜色 + `✓`/`✕`。
3. 渲染后必须**重新导出 MP4 并从成片抽帧核验**，不能只写代码就算完。
4. 把 MP4 直接放出来给用户看；静帧只作补充证据。

### 第 7 步：迭代

- 改 `spec.json` 或 `library/` 后，回到第 4 步重新生成；要更新画面必须带 `--render` 重跑，否则 MP4 还是上一版。
- 配音缓存在 `output/<id>/audio/`；改了文案要换配音就删掉该目录再跑。
- 扩库按 `docs/库字典.md` 第 6 节的登记表改：组件、动效、风格三者互不绑定；改完用已有样片回归。

---

## 1. 显存优先

本机 **16GB 显存**（RTX 5060 Ti），凡能用 GPU 的地方一律用 GPU，不要退回 CPU：

- Remotion 渲染、WhisperX 转写等重活默认走 CUDA。
- 显存吃紧时优先降低并发 / batch_size，而不是降精度或换 CPU。
- 16GB 足够跑 `large-v3-turbo`（~7.5GB 峰值）；若 ComfyUI 等进程占满显存导致 OOM，先关占显存进程或降 `--batch_size 4`。

## 2. Remotion 项目路径

Remotion 工程在 **`..\remotion-demo`**，即 `H:\Multimodal-workspace\remotion-demo`（本目录的上一级）。

- 所有 Remotion 命令在该目录执行；本项目 `remotion-Pro` 只放素材、规范与产物。
- 本项目内的规范文档：`docs/库字典.md`（字典：有什么可选）、`docs/使用规范.md`（怎么选、怎么用、什么禁止）。写 `spec.json` 前先读这两份。
- 原始视频素材：`01-raw-videos/`。

## 3. WhisperX 转写

WhisperX 位于 **`H:\common\whisperx\`**。使用前：

1. **先读** `H:\common\whisperx\README.md`（环境事实、模型选择、常见问题都在里面，别重新排查环境）。
2. **永远用启动脚本** `whisperx-gpu.cmd`，它已固化 `HF_ENDPOINT`、`NLTK_DATA` 和 `--device cuda --compute_type float16`：

```cmd
H:\common\whisperx\whisperx-gpu.cmd <音频文件> --model large-v3-turbo --language zh --output_format txt --output_dir <输出目录>
```

**本项目中文转写实际用法**（必须带标点，且中文 prompt 不能走 CMD）：

```cmd
python 01-raw-videos\01-六郎Talk_AI\_transcribe_punct.py
```
脚本已内置带标点的 `--initial_prompt`，无参数运行即扫该目录全部 mp3；单文件则在脚本名后跟文件名。

要点（详见该目录 README）：
- **转录结果一律用 `txt`**（纯文本，不含时间戳、序号）；需要带时间戳的字幕时才用 `srt`。
- ⚠️ **中文转录必须加 `--initial_prompt`，否则没有标点**（faster-whisper 中文默认不出标点，是模型特性不是故障）。加一段带标点的中文样例即可，实测逗号 0 → 242。Windows 下中文 prompt 要用 **Python `subprocess` 列表传参**，别用 CMD/PowerShell 直传（会乱码）。可复用的批处理脚本：`01-raw-videos/01-六郎Talk_AI/_transcribe_punct.py`（无参数运行扫全目录、绝对路径、stderr 留档）。详见 whisperx README 第一部分"中文标点"与第四条第 8 点。
- ⚠️ **中文转录会有乱码标点（全角 Ｂ/Ｐ/７/４/＞/Ｃ、﹌/﹔、□）= Whisper byte-level BPE 解码缺陷**（中文标点 `EF BC xx` 与乱码同区块，只差第三字节），不是文件损坏、别重转。**别只洗 Ｂ/□，实测还有 ４/Ｐ/７/＞/﹌/﹔/Ｃ，洗一半等于没洗。** `_transcribe_punct.py` 已内置完整字符表的「转录完即清洗」（→`，`），并用 `_scan_suspect.py` 全字符复检（合法残留只有 θ 等符号）；若漏网，补跑同目录 `_clean_txt.py`（带备份、幂等）。详见 whisperx README 第四条第 9 点。
- 模型默认 `large-v3-turbo`；漏字/幻觉时兜底 `large-v3`。
- 短音频也要显式给 `--language zh`，否则易检测错。
- OOM 降 `--batch_size 4`；离线加 `--model_cache_only True`。
- venv 是 uv 创建的，无 pip；装包用 `uv pip install --python H:/common/whisperx/.venv/Scripts/python.exe ...`，且装 PyTorch 前须清空 `UV_INDEX_URL`（否则装回 CPU 版）。
