# 音乐视频歌名字段后端契约

## 前端请求

`POST /api/music/video/generate`

```json
{
  "taskId": "music-generation-task-id",
  "audioId": "generated-audio-id",
  "title": "歌曲名称",
  "author": "作者姓名"
}
```

- `title`：必填，去除首尾空白后 1–80 字符。
- `author`：必填，去除首尾空白后 1–50 字符。

## 当前后端缺口

当前 `build_music_video_request` 只接收 `author` 和 `domainName`，会忽略 `title`。后端需：

1. 校验并保留 `title`。
2. 创建 `GeneratedMusicVideo` 时优先使用请求中的 `title`。
3. 在创建任务响应、详情和列表中返回该 `title`。

## 第三方限制

Kie `POST /api/v1/mp4/generate` 当前只提供 `taskId`、`audioId`、`callBackUrl`、`author` 和 `domainName`，不提供覆盖歌曲名称的 `title` 字段。因此：

- 上述改动可保存和展示用户填写的歌曲名称。
- 如果要让最终 MP4 画面中的歌名也被替换，需要自建视频后处理，或等待供应商增加歌名覆盖字段；不应将 `domainName` 误用为歌名。
