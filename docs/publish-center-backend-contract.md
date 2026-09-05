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
