# 系统发布账号管理后台配合明细

> 状态：2026-09-13 已按本契约完成后台实现并上线，前端可直接调用。

## 目标

发布设置页允许团队主账号直接新增、修改 Kali 系统发布账号。系统账号仍只保存名称，并通过名称与本机 5409 平台账号自动关联。

现有 `team_publish_accounts` 表已经具备 `id`、`team_phone`、`account_name`、`is_active` 和时间字段，本次无需数据库迁移。

## 1. 扩展系统账号列表

### `GET /api/team-notion/publish-account`

保留现有参数和账号列表，在 `data` 中增加当前用户是否可管理的标记：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 12,
        "team_phone": "13800138000",
        "account_name": "喀理AIP",
        "is_active": true,
        "created_at": "2026-09-13 10:00:00",
        "updated_at": "2026-09-13 10:00:00"
      }
    ],
    "total": 1,
    "team_phone": "13800138000",
    "can_manage": true
  }
}
```

`can_manage` 只有当前登录用户是该团队主账号时为 `true`。团队成员仍可读取账号并用于发布，但不能新增或修改。

## 2. 新增系统账号

### `POST /api/team-notion/publish-account/create`

请求体：

```json
{
  "account_name": "喀理AIP"
}
```

处理要求：

1. 使用现有 JWT 登录校验。
2. 只允许当前团队主账号操作；普通成员返回 HTTP `403`。
3. 团队归属必须从当前登录用户解析，不能接受请求体指定任意 `team_phone`。
4. `account_name` 去除首尾空白和换行后长度为 1–80 个字符。
5. 同一团队内名称重复时返回 HTTP `409`，提示“系统账号名称已存在”。
6. 创建记录时固定 `is_active=true`。

成功响应：

```json
{
  "code": 200,
  "msg": "系统账号添加成功",
  "data": {
    "account": {
      "id": 12,
      "team_phone": "13800138000",
      "account_name": "喀理AIP",
      "is_active": true
    }
  }
}
```

## 3. 修改系统账号名称

### `POST /api/team-notion/publish-account/update`

请求体：

```json
{
  "id": 12,
  "account_name": "语文刘老师"
}
```

处理要求：

1. 权限、团队解析和名称校验与新增接口一致。
2. `id` 必须是正整数。
3. 查询条件必须同时包含 `id + 当前 team_phone + is_active=true`，禁止跨团队修改。
4. 目标账号不存在时返回 HTTP `404`；同团队新名称冲突时返回 HTTP `409`。
5. 更新成功后返回完整账号对象。

成功响应：

```json
{
  "code": 200,
  "msg": "系统账号已更新",
  "data": {
    "account": {
      "id": 12,
      "team_phone": "13800138000",
      "account_name": "语文刘老师",
      "is_active": true
    }
  }
}
```

## 4. 一致性和测试要求

- 接口错误继续使用项目统一的 `error(...)` 响应格式，前端直接展示 `msg/message`。
- 创建和修改都应捕获唯一索引冲突并回滚事务，不能返回数据库异常文本。
- 名称保存成功后无需维护本机账号 ID 映射；前端重新读取列表并按完全相同的名称关联。
- 本次不增加删除系统账号功能，也不改变现有发布接口的 `publish_account_id` 校验。
- 后端测试至少覆盖：团队主账号成功新增、普通成员被拒绝、重复名称、跨团队修改被拒绝、无效 ID、空名称、超长名称，以及更新后列表立即返回新名称。
