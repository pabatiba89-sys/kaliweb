# 视频制作可选背景音乐与封面

以下视频制作请求统一使用两个布尔字段：

- 数字人口播 `POST /api/video/production/create`
- 混剪视频 `POST /api/video-mix/create`
- 形象播报 Pro `POST /api/video/custom-virtualman-broadcast/create`
- 素材成片 Pro `POST /api/video-mix/custom-broadcast-mixcut/create`
- 真人视频包装 `POST /api/video/realman-broadcast/create`

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

当前只读后台会在部分正式提交路径中强制随机匹配并开启背景音乐，还可能在没有可用音乐时返回错误。上述五条创建路径都必须按相同规则解析并下传开关；后台完成适配前，前端可正确保存和提交关闭状态，但某些路径的最终成片仍可能不受影响。
