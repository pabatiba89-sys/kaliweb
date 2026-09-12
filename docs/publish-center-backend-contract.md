# 独立发布中心后台接口清单

前端独立发布中心复用以下现有接口：

- `GET /api/team-notion/publish-account`：读取当前团队的可用发布账号。
- `POST /api/team-notion/publish-video`：发布混剪或数字人成片。
- `POST /api/team-notion/publish-ai-video`：发布 AI Video Lab 成片。

本地上传视频还需要后台新增：

## `POST /api/team-notion/publish-uploaded-video`

请求体：

```json
{
  "source": "upload",
  "video_url": "https://owned-storage.example.com/video.mp4",
  "upload_key": "uploads/video.mp4",
  "file_name": "video.mp4",
  "file_size": 10485760,
  "duration": 25.4,
  "title": "对外发布标题",
  "topics": ["话题一", "话题二"],
  "publish_account_id": 12,
  "publish_time": "2026-09-06 10:30",
  "publish_now": false
}
```

后台必须按当前登录用户解析团队，并完成以下校验：

1. `publish_account_id` 属于当前团队且启用。
2. `video_url` / `upload_key` 来自当前用户本次上传获得的自有存储对象，禁止接受任意外链。
3. 文件是后台允许的视频格式，且大小、时长满足发布平台限制。
4. 标题非空；话题按现有 `format_tags_text` 规则格式化。
5. 复用现有 Notion 发布字段和立即/定时发布语义。

成功响应应返回 `notion_page_id`、`notion_page_url`、`team_phone`，以及一条可追踪的上传发布记录。

同时建议调整现有 `POST /api/team-notion/publish-video`：构建 Notion 页面时优先使用请求体中的 `title`，缺失时再回退到视频任务标题。否则独立发布中心里用户修改的混剪/数字人标题不会生效。

## 团队未配置账号时的本地发布 workflow

前端在发布账号接口成功返回空列表时，公开展示 MIT 开源项目 [dreammis/social-auto-upload](https://github.com/dreammis/social-auto-upload)，作为团队自托管发布能力的参考实现。

推荐链路：

1. 在实际执行发布的电脑安装 `social-auto-upload`，使用当前主线 `sau` CLI 完成平台登录与账号检查。
2. 账号 Cookie 与账号文件只保留在该电脑，不上传到 Kali 或团队后台。
3. 在本机增加受访问令牌保护的桥接服务，接收 Kali 的视频、标题、话题、账号与发布时间，再映射成 `sau` CLI 命令。
4. 本地桥接服务回传任务 ID、执行状态和平台结果，Kali 只负责发布控制与状态展示。

`social-auto-upload` 仓库内的 Flask Web API 默认监听 `5409`，但项目方已将 Web 端标记为历史实现，不保证与当前 uploader/CLI 同步，因此不应作为生产环境的直接依赖。若需要浏览器直连本地桥接接口，还必须处理访问令牌、CORS、HTTPS 页面访问本地 HTTP 服务的限制，以及浏览器 Private Network Access 策略；更稳妥的生产方案是由本地桥接服务主动拉取已签名任务。

## 当前 5409 直连行为

2026-09-12 起，按当前产品要求，发布中心、视频详情和 AI Video Lab 的发布按钮在 Kali 发布接口成功后立即调用本机 `http://127.0.0.1:5409`：

1. `GET /getAccounts?name=<所选发布账号名称>&nocheck=1` 读取该名称对应的全部本地平台账号；账号名必须进行 URL 编码。
2. 本地账号响应成功后立即关闭发布弹窗，再继续创建 Kali 发布任务。
3. `POST /uploadFromUrl` 下载成片到本机。
4. 不再根据本地账号的 `status` 判断是否有效；只按平台类型分组，并发调用全部 `POST /postVideo`。

Kali 接口成功但本地接口失败时，前端必须明确提示“发布任务已保存，但本地发布未调起”。启用此直连路径时，不应再让原 n8n 定时流程处理同一条 Notion `视频生成` 记录，否则可能重复发布。5409 服务仍只应运行在本机，禁止直接暴露公网。

发布按钮在调用 Kali 接口前必须先请求 `/getAccounts?name=<所选发布账号名称>&nocheck=1` 检测本地服务并一次性取得账号。检测不到 5409 时中止本次提交，保留用户已填写的发布配置，并展示本地工具启动说明、安装下载入口和“检测并继续发布”操作；重新检测成功后关闭弹窗、创建 Kali 发布任务，并复用本次取得的账号执行上述本地发布链路，不重复请求账号。
