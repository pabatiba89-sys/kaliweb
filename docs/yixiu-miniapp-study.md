# yixiu 小程序学习笔记

日期：2026-07-08  
源码位置：`/Users/yuerocky/Desktop/yixiu`  
类型：微信小程序  
技术栈：JavaScript、WXML、Less、TDesign MiniProgram

## 结论

yixiu 不是单纯的展示型小程序，而是一个围绕“热点捕捉 -> AI 创作 -> 数字人/声音/音乐/图片资产 -> 视频生产 -> 发布/管理 -> 套餐付费”的 AI 内容生产工作台。

后续做海外独立站时，不应照搬小程序的信息架构。更直接的路径是把它拆成两层：

- 对外官网层：品牌价值、产品能力、案例、价格、语言切换、试用/预约/购买转化。
- 登录后工作台层：保留 AI 创作、数字人、声音、音乐、图片、视频生产、素材和套餐管理。

## 全局架构

- 入口配置：`app.json`
- 主 Tab：`首页`、`热点跟踪`、`创作`、`我的`
- 全局请求：`api/request.js`
- API 域名：`https://yixiuapi.xyaip.fun`
- 认证：接口请求统一带 `access_token`，遇到未登录/过期/认证失败会清理本地登录并跳转登录。
- 全局启动：`app.js` 初始化版本更新检查、未读消息、模拟 WebSocket 消息通道、全局事件总线。
- UI 组件：TDesign MiniProgram、自定义 `t-navbar`、自定义 tab bar。

## 页面地图

### 首页 `pages/home/index`

定位：产品入口和试用转化页。

主要内容：

- Hero：`喀理AI-亿秀`
- 免费体验权益：1 个数字人、1 个声音、3 条 AI 视频
- AI 资产工作台入口
- 品牌场景故事
- 推荐流程

主要跳转：

- 热点跟踪
- 创作助手
- 数字人/声音/视频/音乐/图片管理
- 素材管理
- 视频包装、封面包装、混剪视频生产
- 套餐购买

### 热点跟踪 `pages/hotTracking/index`

定位：选题来源和创作触发器。

主要功能：

- 热点聚合与媒体热点两个视图
- 分类包括综合、科技、财经、民生、AI、争议、教育、游戏、媒体
- 媒体源包括抖音、B站、微博、百度、头条新闻、腾讯新闻、纽约时报、BBC、法广、澎湃新闻
- 点击热点可把选题流转到创作页

核心接口：

- `GET /api/hotlist/list`
- `GET /api/hotlist/search`

### 创作 `pages/message/index`

定位：AI 指令集/智能体列表入口。

主要功能：

- 拉取指令集列表
- 区分用户自建和系统指令集
- 创建、编辑指令集
- 进入聊天创作页
- 承接热点选题脚本流

核心接口：

- `GET /api/instruction_sets`

### AI 对话创作 `pages/videoChat/index`

定位：基于指令集的创作对话页。

主要功能：

- 流式聊天：`/api/chat/stream`
- 支持文字输入和语音输入
- 支持文案创作、音乐创作、图片创作、视频创作等类型
- 音乐创作会生成歌名、风格、歌词，并跳到音乐生产页
- 视频/文案创作会跳到混剪视频生产页并预填当前 AI 回复解析出的字段

核心接口：

- `GET /api/user/info`
- `POST /api/chat/stream`

### 指令集编辑 `pages/instructionSetEditor/index`

定位：创建/编辑 AI 指令集。

主要功能：

- 编辑名称、描述、指令、标签、类型
- 类型包括文案创作、音乐创作、图片创作、视频创作

核心接口：

- `POST /api/instruction_sets/create`
- `POST /api/instruction_sets/edit`
- 旧兼容：`POST /api/instruction_sets/update`

### 数字人/声音/视频资产列表 `pages/aihumanList`

定位：资产管理和视频结果管理。

主要功能：

- 数字人列表、公共数字人列表
- 声音列表、公共声音列表
- 视频生产列表
- 独立视频详情页
- 视频下载保存
- 视频重做
- 视频发布账号选择、立即/定时发布
- 分配团队

核心接口：

- `GET /api/aihuman/list`
- `GET /api/aihuman/common-list`
- `POST /api/aihuman/update`
- `GET /api/ai-voice/list`
- `GET /api/ai-voice/common-list`
- `POST /api/ai-voice/update`
- `GET /api/video/production/list`
- `GET /api/video-mix/detail`
- `POST /api/video/production/assign-team`
- `GET /api/video/production/teams`
- `POST /api/team-notion/publish-video`
- `GET /api/team-notion/publish-account`

### 数字人/声音创建 `pages/aihumanCreate/index`

定位：综合创建页，承担数字人训练、声音克隆、视频生产等多个流程。

主要功能：

- 数字人训练：上传/录制形象视频和授权视频
- 声音训练：录音、语音识别、同意声音授权协议、语言选择
- 视频生产：选择数字人、声音、模板、封面、素材、脚本
- AI 脚本生成和热点选题
- 任务提交前检查权益

核心接口：

- `POST /api/aihuman/train`
- `GET/POST /api/aihuman/auth-videos`
- `POST /api/ai-voice/train`
- `GET /api/aihuman/list`
- `GET /api/ai-voice/list`
- `POST /api/video/production/create`
- `GET /api/shanjian/video-templates`
- `GET /api/shanjian/cover-templates`
- `GET /api/material/list`
- `POST /api/material/add`
- `POST /api/file/upload`
- `POST /api/ai/script/generate`
- `POST /api/script/generate`
- `POST /api/ai/chat`
- `GET /api/hotlist/list`
- `GET /api/user/info`

### 独立数字人训练 `pages/digitalHuman/index`

定位：更轻量的数字人训练页。

主要功能：

- 名称输入
- 视频上传
- 权益不足提示
- 提交训练

核心接口：

- `POST /api/aihuman/train`
- `POST /api/file/upload`
- `GET /api/user/info`

### 图片生成 `pages/imageGeneration/index`

定位：图片生成记录列表。

主要功能：

- 查看生成图片
- 进入图片生成创建页
- 从图片生成结果跳到图片数字人训练

核心接口：

- `GET /api/image-generation/images`

### 图片生成创建 `pages/imageGenerationCreate/index`

定位：AI 图片生成表单。

主要功能：

- 模板/场景模式
- 提示词、镜头语言、参考图上传
- 额度不足时引导购买

核心接口：

- `POST /api/image-generation/create`
- `POST /api/file/upload`

### 图片数字人 `pages/imageDigitalHuman/index`

定位：从图片训练数字人。

主要功能：

- 选择生成图片
- 选择/上传授权视频
- 提交图片数字人训练

核心接口：

- `POST /api/aihuman/image/train`
- `GET/POST /api/aihuman/auth-videos`
- `POST /api/file/upload`

### 音乐列表 `pages/musicGenerated/index`

定位：我的 AI 音乐列表。

主要功能：

- 拉取生成任务列表
- 进入音乐详情
- 新建音乐
- 长按试听/停止

核心接口：

- `GET /api/music/generated`
- `GET /api/music/tasks/<task_id>`

### 音乐详情 `pages/musicGenerated/detail`

定位：单个音乐任务详情。

主要功能：

- 展示一个任务里的多首歌
- 试听
- 下载/联系客服消息卡
- 失败原因展示
- 失败任务重试：预填到音乐生产页
- 从音乐生成视频：直接调用音乐视频生成接口

核心接口：

- `GET /api/music/tasks/<task_id>`
- `POST /api/music/video/generate`
- `GET /api/music/video/by-music/<music_id>`

### 音乐生产 `pages/musicProduction/index`

定位：AI 音乐创建页。

主要功能：

- 三种创建流：一句话描述、专业歌词、纯音乐
- 支持标题、歌词、风格、负面标签
- 支持自建 AI 音乐声音
- 可从 AI 歌词助手或聊天页预填
- 提交后进入音乐列表/详情

核心接口：

- `POST /api/music/generate`
- `GET /api/music/voice/list`
- `GET /api/plan/user-plan`

### AI 音乐声音创建 `pages/musicVoiceCreate/index`

定位：创建可用于音乐生成的自建声音。

主要功能：

- 上传源音频或从声音克隆列表选择音频
- 生成验证短语
- 页面内录制验证音频并上传
- 提交声音创建任务
- 轮询验证任务和创建任务
- 订阅消息授权

核心接口：

- `POST /api/music/voice/validate`
- `GET /api/music/voice/validate/<task_id>`
- `POST /api/music/voice/create`
- `GET /api/music/voice/tasks/<task_id>`
- `GET /api/ai-voice/list`
- `POST /api/file/upload`

### 混剪视频生产 `pages/mixVideoProduction/index`

定位：核心视频生产工作台。

主要功能：

- 视频任务列表和详情
- 创建混剪/口播视频
- 选择数字人、声音、视频模板、封面模板、素材、音乐
- 支持团队视频预设
- 支持发布账号和立即/定时发布
- 支持从聊天页、视频管理页、音乐页预填

核心接口：

- `GET /api/video-mix/list`
- `GET /api/video-mix/detail`
- `POST /api/video-mix/create`
- `POST /api/video/production/create`
- `GET /api/user/info`
- `GET /api/aihuman/list`
- `GET /api/ai-voice/list`
- `POST /api/team-notion/publish-video`
- `GET /api/team-notion/publish-account`
- `GET /api/team-video-preset/list`
- `POST /api/file/upload`

### 资源选择器 `pages/mixVideoSelect/index`

定位：混剪视频创建时的通用资源选择页。

可选资源：

- 数字人
- 声音
- 视频模板
- 封面模板
- 素材
- 音乐

核心接口：

- `GET /api/user/info`
- `GET /api/aihuman/list`
- `GET /api/aihuman/common-list`
- `GET /api/ai-voice/list`
- `GET /api/ai-voice/common-list`
- `GET /api/shanjian/video-templates`
- `GET /api/shanjian/cover-templates`
- `GET /api/material/list`
- `GET /api/music/generated`

### 素材管理 `pages/materialManagement/index`

定位：视频生产素材库。

主要功能：

- 素材列表分页
- 上传素材
- 预览素材
- 选择模式
- 批量删除

核心接口：

- `GET /api/material/list`
- `POST /api/material/add`
- `POST /api/material/delete`
- `POST /api/file/upload`

### 视频包装 / 封面包装

页面：

- `pages/videoPackaging/index`
- `pages/coverPackaging/index`

主要功能：

- 模板列表分页
- 下拉刷新、触底加载

核心接口：

- `GET /api/shanjian/video-templates`
- `GET /api/shanjian/cover-templates`

### 套餐购买 `pages/planPurchase/index`

定位：套餐购买和权益补充。

主要功能：

- 套餐列表
- 虚拟购买订单
- 用户套餐查询
- 微信登录刷新
- 权益类型覆盖数字人、声音、视频、AI 音乐

核心接口：

- `GET /api/plan/list`
- `POST /api/plan/purchase_virtual`
- `GET /api/plan/user-plan`
- `POST /api/user/login`
- `POST /api/user/refresh_wx_session`

### 套餐/团队预设 `pages/packageSetting/index`

定位：团队视频生产预设管理。

主要功能：

- 读取团队视频预设
- 创建/编辑预设
- 设置默认预设
- 选择数字人、声音、模板等资源

核心接口：

- `GET /api/user/info`
- `GET /api/team-video-preset/list`
- `POST /api/team-video-preset/create`
- `POST /api/team-video-preset/update`
- `POST /api/team-video-preset/set-default`

### 我的 `pages/my/index`

定位：个人中心、资产管理、套餐用量和设置入口。

主要功能：

- 登录态展示
- 手机号绑定
- 套餐用量：数字人、声音、视频、AI 音乐
- AI 资产工作台
- 公共资源入口
- 设置、客服、套餐购买

核心接口：

- `GET /api/user/info`
- `POST /api/user/bind_phone_by_code`

### 登录与设置

页面：

- `pages/login/login`
- `pages/loginCode/loginCode`
- `pages/setting/index`
- `pages/setting/agreement`
- `pages/setting/voiceprintAgreement`

主要功能：

- 微信登录
- 头像/昵称授权
- 手机验证码登录兼容
- 用户协议、隐私政策、声音授权协议
- 退出登录

核心接口：

- `POST /api/user/login`
- `POST /api/user/update`
- `POST /api/user/upload_avatar`
- `GET /login/postCodeVerify`

### 数据中心与搜索

页面：

- `pages/dataCenter/index`
- `pages/search/index`

当前判断：

- 数据中心使用 mock 风格接口：`/dataCenter/member`、`/dataCenter/interaction`、`/dataCenter/complete-rate`、`/dataCenter/area`
- 搜索页沿用模板痕迹，接口为 `/api/searchHistory`、`/api/searchPopular`，还存在跳到 `pages/goods/result` 的旧路径，不应作为海外独立站核心功能迁移。

## 核心业务链路

### 内容生产链路

1. 热点跟踪发现选题。
2. 选题进入创作助手。
3. 指令集驱动 AI 对话生成脚本、歌词或创意。
4. 根据类型进入音乐生产或视频生产。
5. 视频生产选择数字人、声音、模板、封面、素材、背景音乐。
6. 任务生成后在资产列表或详情页管理。
7. 视频可下载、重做、分配团队、发布。

### 资产训练链路

1. 用户上传/录制数字人形象视频、授权视频。
2. 提交数字人训练任务。
3. 用户录音或上传音频，签署声音授权协议。
4. 提交声音训练任务。
5. 训练完成后成为视频生产可选资源。

### 音乐链路

1. 用户选择一句话、专业歌词或纯音乐模式。
2. 可选择自建音乐声音。
3. 提交音乐生成任务。
4. 在音乐列表/详情中试听、重试、联系客服下载。
5. 可把生成音乐作为视频背景音乐，或直接触发音乐视频生成。

### 付费与额度链路

1. 关键生产动作前查询用户权益。
2. 数字人、声音、视频、AI 音乐分别有剩余和总额度。
3. 额度不足时引导到套餐购买页。
4. 套餐购买当前是虚拟购买接口，后续独立站需要替换为海外支付方案。

## 海外独立站迁移判断

### 应保留

- AI 内容生产主链路：热点/选题、AI 指令集、脚本生成、视频生产。
- 数字人、声音、音乐、图片四类资产能力。
- 素材库、模板库、团队预设、发布管理。
- 套餐权益体系。
- 登录后工作台。

### 应重构

- 小程序 Tab 信息架构要改成 Web 导航：官网首页、产品、案例、价格、资源、登录/控制台。
- 登录方式从微信登录改为邮箱、Google、Apple、企业 SSO 或手机号区域化方案。
- 微信客服、微信订阅消息、微信相册保存、微信二维码等能力要替换成 Web 可用方案。
- 小程序录音、相机、文件上传权限要改成浏览器权限和上传组件。
- 支付从微信/虚拟购买迁移到 Stripe 或本地化支付。
- 国际化要从一开始做：中文、英文、日语、韩语、德语、俄语。

### 应弱化或暂缓

- 搜索页和数据中心有模板/Mock 痕迹，先不作为 MVP。
- 小程序现场演讲二维码承接逻辑适合国内私域；海外站更应转成官网 Lead Form、Demo Booking、Email Capture、WhatsApp/Telegram/Discord 等渠道。

## 独立站 MVP 建议

### 公开站

- 多语言官网首页
- 产品能力页：AI Video、Digital Human、Voice Clone、AI Music、Image Generation
- Pricing
- Demo/Trial 申请
- 案例/模板展示
- 登录入口

### 控制台

- Dashboard
- AI Assistant
- Video Studio
- Asset Studio
- Music Studio
- Image Studio
- Materials
- Templates
- Billing
- Settings

### 第一阶段不做

- 小程序式底部 Tab
- 微信专属登录/客服/订阅消息
- Mock 数据中心
- 旧搜索商品页

