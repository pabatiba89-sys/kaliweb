# Kaliai MCP Tool Reference

## Authentication

The MCP client reads the normal website user Token from its configured private credential source and sends it as a Bearer token. Use `KALIAI_TOKEN` only for an environment-variable connection; private HTTP-header connections use the configured Authorization header. The hosted MCP service must validate it with the same authentication logic used by normal Kaliai website API requests, then reuse the resulting user, team, permissions, and credit account. Tool arguments never contain Tokens.

## Status model

- `pending`: accepted but not running.
- `processing`: running or archiving results.
- `succeeded`: terminal success; inspect `result` for resource IDs or final URLs.
- `failed`: terminal failure; inspect `error`. The hosted service handles applicable credit refunds.

## Resource tools

### `get_account`

Return credit balance, lifetime grants and spend, scopes, and rate limit.

### `list_digital_humans`

Retrieve digital humans. Support `scope=owned|common`, `page`, `page_size`, and optional provider cursor `sid`. Return stable local and provider digital-human IDs, names, status, cover image, and preview fields when available.

### `list_voices`

Retrieve voices. Support `scope=owned|common`, `page`, and `page_size`. Return stable local and provider voice or speaker IDs, name, language, speed, and training status.

### `list_materials`

Retrieve reusable media. Required: `category=material|music|kongjing`. Optional: `type`, `page`, and `page_size`. Return material ID, name, URL, type, and duration when available.

### `list_video_templates`

Retrieve video templates. Optional: `page_size`, `sid`, `scene`, `search_key`, `search_value`, and `sort_by`. Default `scene=virtualman` and `sort_by=desc`.

### `list_cover_templates`

Retrieve cover templates. Optional: `page_size`, `sid`, and `sort_by`.

### `list_authorization_videos`

Retrieve authorization videos available for digital-human training. Return selection mode, selected ID when auto-selectable, and candidate IDs, names, person names, URLs, and authorization text.

## Training tools

### `clone_voice`

Required: public `audio_url`. Optional: `name`, `speed`, `language`, `model`, and `demo_text`. Keep `speed` within `0.2-2`; default language is `zh`.

### `train_digital_human`

Train from video. Required: public `video_url` and either `authorization_video_id` or public `auth_video_url`. Optional: `auth_text`, `name`, and `cover_url`.

### `train_image_digital_human`

Train from an image. Require exactly one of `generated_image_id` or public `image_url`, plus a valid authorization video selection. Optional: `auth_text`, `name`, and `cover_url`.

## Generation tools

### `generate_image`

Required: public `person_image_url`. Provide at least one of `scene_image_url` or `prompt`. Supported aspect ratios are `auto`, `1:1`, `3:2`, and `2:3`.

### `generate_music`

Required: `title`, `style`. Require `prompt` unless `instrumental=true`. Optional: `model`, `vocal_gender`, and `voice_id`.

### `generate_video`

Required: user-supplied `title`, `script`, `ai_human_id`, `voice_id`, `video_template_id`, and non-empty `materials`. Optional: cover template and background-music fields. Pass advanced provider payloads only when the user already has validated values.

The Skill does not provide text or copywriting generation. The user supplies the final script for video creation.

## Task tools

### `get_task`

Required: public Kaliai `task_id`. Use `refresh=true` to request the current hosted-service state.

### `list_tasks`

Support pagination and optional operation filters:

- `image.generate`
- `music.generate`
- `video.generate`
- `voice.clone`
- `digital_human.train`
- `digital_human.image_train`

## Retry safety

The current website API does not expose an idempotency contract. After a network or upstream error, query task history before resubmitting a cloning, training, or generation request to avoid duplicate credit charges.
