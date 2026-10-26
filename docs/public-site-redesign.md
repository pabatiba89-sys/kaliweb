# 官网与 SEO 页面改版 · 2026-10-26

## 定稿路线

沿用 Astro 静态生成与现有 URL，在现有站点内实施。统一工作台色板：背景 `#f5faf7`、白色内容面、深绿文字 `#17342f`、品牌绿 `#00a884`、浅薄荷 `#dff5ec`。参考 Apple 官网的大画面、留白、清楚的标题层级和逐段产品叙事，使用 Kali 自有界面，不复制 Apple 素材。

首页采用「产品主张 → 大幅真实工作台截图 → 可操作流程 Demo → 各产品视觉入口 → 视频展示 → 开始创作」。四个产品 SEO 页补专属界面图、操作 Demo 和相关产品链接。帮助页延续手册结构；法律页只统一排版和色调。

## 素材与资源边界

- 工作台总览使用真实、未登录界面截图，不包含账号、资产、订单或团队个人数据。检查发现业务页在未登录时只展示登录提示，故不将这些空页面作为宣传素材；流程改用独立、明确标注的前端演示界面。
- 主视觉和音乐页配图为原创 AI 品牌场景示意图，界面明确标识为示意图，不声称是 Kali 生成的真实成片。
- Demo 是可点击的前端流程讲解，不调用生成接口，不扣费，不将示意输入当成真实生成结果。
- 未收到真实视频前不伪造播放按钮、时长或成功成片。视频数据集中配置，提供后即可挂载原生播放器；缺失素材显示对应功能界面。
- 不增加付费服务、第三方视频 SDK 或运行时图片服务。图片本地 WebP、显式尺寸，首屏外懒加载；视频只预载元信息，不自动有声播放。
- 保留 canonical、hreflang、英文索引白名单、验证标记、JSON-LD 和 `/app/` noindex；视觉不取代可索引正文。

## 需要用户提供的视频

| 位置 | 内容 | 建议规格 |
| --- | --- | --- |
| 首页主片 | 从选题/文案到数字人配置、生成、预览的一次完整过程 | 横版 16:9，45–90 秒，1080p MP4/H.264 |
| 数字人成片 | 真实数字人口播，展示口型、声音、字幕、包装 | 竖版 9:16，15–30 秒，1080p |
| AI 视频 | 一条真实 AI Video Lab 成片，可带对应提示词与参考图 | 16:9 或 9:16，5–15 秒 |
| 混剪/Pro 成片 | 多段素材、字幕和音乐的实际包装效果 | 竖版 9:16，15–30 秒 |
| 音乐视频 | 一段实际生成歌曲及其音乐视频 | 16:9 或 9:16，15–30 秒 |
| 声音对比（可选） | 原始授权录音与克隆后相同文字的两段音频 | 各 10–15 秒，MP3/WAV |

每个成片同时提供：对外标题、封面（可从视频截帧）、制作模式、可公开使用的确认。界面录屏隐藏邮箱、手机号、余额、订单、私人素材与未公开内容。英文官网优先英文示例，也可提供无对白素材。

## 图片制作记录

使用内置 imagegen 生成，未调用付费 CLI；源图保留在 Codex generated_images，站点使用本地 WebP。

- `public/previews/creative-studio.webp`：英文提示词核心为「premium editorial photographic triptych, female presenter in mint daylight studio / pale mint perfume bottle on white stone / silver studio microphone in evergreen recording room; no text, logos, interface or watermark; illustrative brand imagery, not a software output」。
- `public/previews/music-studio.webp`：英文提示词核心为「premium editorial photograph of mint-and-ivory music desk, brushed aluminum synthesizer, green headphones, tactile mixer, soft daylight and leaf shadows; no screen, text, logo or watermark; creative studio illustration, not a software output」。
- `public/previews/workspace.webp`：独立匿名浏览器截图，可通过 `scripts/capture-public-previews.mjs` 刷新。脚本依赖外部 Playwright 和 Sharp，通过 `PLAYWRIGHT_MODULE` 与 `SHARP_MODULE` 指定已有模块，不向生产站添加浏览器依赖。

完整英文生成提示词：

```text
Use case: ads-marketing. Create a premium editorial photographic triptych as ONE wide landscape website image for Kali content creation software. No text, no lettering, no logo, no interface, no frame, no typography, no watermark. Three adjoining photographic scenes with clean straight seams. Left third: waist-up friendly East Asian female presenter about 30 wearing a simple cream shirt, speaking in an airy daylight mint architectural studio, natural skin texture, editorial camera look. Middle third: cinematic close-up pale mint green glass perfume bottle on a sculptural white stone block, subtle water reflections, boutique luxury product cinematography, no label. Right third: tactile brushed silver studio microphone, deep evergreen recording room, beautifully restrained warm rim light. Equal three panels, harmonious pale mint #dff5ec, ivory white, forest green #17342f palette, purposeful lighting, calm sophisticated premium SaaS product campaign, large real photographic detail, wide 3:2 composition suitable for a website media gallery. Avoid generic glowing neon, circuit patterns, extra UI cards, surreal hands. This is conceptual brand imagery, NOT a screenshot or claimed software output.
```

```text
Use case: ads-marketing. A premium editorial photograph for a music creation software website. Wide landscape 3:2 frame. Overhead three-quarter view of an elegant mint-and-ivory music production desk, a compact brushed aluminum synthesizer keyboard diagonally across lower half, one pair of dark green over-ear studio headphones, a small analog audio mixer with tactile knobs at right, a delicate sunlight beam with soft leaf shadow across warm white desk. No computer screen, no interface, no text, no letters, no brand, no logos, no watermark. Realistic detailed materials, restrained Apple-like product photography, soft daylight, quiet artistic atmosphere, evergreen and silver highlights, pale mint #dff5ec white #f5faf7 forest green #17342f color palette. Beautiful physically plausible shapes and proportions. Image is creative studio brand illustration, not a software output.
```

## 视频接入

在 `src/site/showcase.js` 的 `showcaseMedia` 中填入对应位置的 `src`、`poster`，必要时补充 WebVTT 字幕 `captions: [{ src, lang, label }]`。首页 `overview`，各产品用对应 slug。播放器只在有真实地址时渲染，保留 controls、playsinline、preload=metadata，不自动播放。

## 验收

桌面与手机检查首页、四个产品页、帮助页和法律页；验证 Demo 切换与键盘操作、无视频时的回退、播放器接入逻辑、多语言与 RTL、图片可用性、无横向溢出，以及完整构建和 SEO 检查。

2026-10-26 已完成：类型检查零错误/警告/提示；完整构建 458 页；SEO 校验 19 个英文可索引 URL；浏览器 43 项页面/视口检查覆盖 19 个英文页面的桌面和手机布局，以及中/繁中/德/阿/日首页、3 张媒体图片、四步切换、键盘操作、RTL 和不调用生成接口。真实视频播放需在收到素材并配置地址后完成最终验收。
