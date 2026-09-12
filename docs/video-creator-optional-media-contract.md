# 视频制作可选背景音乐与封面

数字人口播 `POST /api/video/production/create` 和混剪视频 `POST /api/video-mix/create` 的前端请求新增两个布尔字段：

```json
{
  "useBackgroundMusic": false,
  "useCover": false
}
```

两个字段未传时必须按 `true` 处理，以兼容旧客户端和旧草稿。

## 后台处理要求

- `useBackgroundMusic=true`：请求带有明确音乐 URL 时使用该音乐；未选择音乐时可从音乐库自动匹配。
- `useBackgroundMusic=false`：不得随机匹配音乐，不得因音乐库为空而阻止提交，最终闪剪参数中的 `packRules.backgroundMusic.audioSwitch` 必须为 `false`。
- `useCover=true`：继续处理 `coverUrl`、`coverTemplateId` 和 `processRules.firstFrameCover`。
- `useCover=false`：不得要求封面图片或封面模板，最终闪剪参数中的 `processRules.firstFrameCover.coverSwitch` 必须为 `false`，并忽略旧草稿残留的封面 URL 与模板 ID。
- 暂存和正常提交都必须在 `payload_json` 中保存这两个字段，详情接口原样返回，供前端续作时恢复开关状态。

## 当前兼容差异

当前只读后台会在数字人口播和混剪正式提交时强制随机匹配并开启背景音乐，还会在没有可用音乐时返回错误。后台完成上述适配前，前端关闭音乐的选择可以正确保存和提交，但不会改变最终成片。
