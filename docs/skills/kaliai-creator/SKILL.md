---
name: kaliai-creator
description: Retrieve digital humans, voices, materials, video and cover templates; clone voices; train video-based or image-based digital humans; and create or track images, music, and digital-human or material-mix videos through the authenticated Kaliai remote MCP service. Use when a user needs any part of a Kaliai digital-human production workflow, account credits, or task status and history.
---

# Kaliai Creator

Use the `kaliai` MCP tools as the only execution layer. The user supplies the normal Kaliai website Token through the MCP connection. Never start a local server, install a runtime, invoke Docker, or ask for upstream service credentials.

## Authenticate safely

- Keep the website Token in the current client's private MCP credentials. For an environment-variable connection, use `KALIAI_TOKEN`; for a Codex desktop or WorkBuddy header connection, use its configured private Authorization header. Never request the Token in a prompt or tool argument.
- If authentication is missing, rejected, or expired, ask the user to sign in to the Kaliai website account center and copy or refresh the normal user Token. Update the credential source actually used by this connection, then restart or reconnect that client. Do not require an environment variable when the connection uses a private header.
- Never echo authorization headers, website Tokens, cookies, or raw provider credentials.

## Execute requests

1. Call `get_account` before an expensive or multi-step workflow.
2. Retrieve existing resources before asking the user for IDs or creating replacements.
3. Choose the smallest operation that satisfies the request.
4. Treat `pending` and `processing` tasks as incomplete; use `get_task` until the task reaches `succeeded` or `failed` when the user asks for a completed artifact.
5. Return the artifact or terminal status first, followed by selected resource IDs, the Kaliai task ID, and any actionable failure.

## Discover resources

- Use `list_digital_humans` to retrieve owned or public digital humans before training a new one.
- Use `list_voices` to retrieve cloned or public voices before cloning a new voice.
- Use `list_materials` to retrieve normal, music, or empty-shot materials.
- Use `list_video_templates` and `list_cover_templates` before video creation; never invent template IDs.
- Use `list_authorization_videos` before digital-human training when authorization input is not already explicit.

## Train and generate

- Use `clone_voice` only with a public training-audio URL and explicit user authorization to use the voice.
- Use `train_digital_human` for video-based training after collecting a training-video URL and authorization video.
- Use `train_image_digital_human` for image-based training after collecting a generated-image ID or public image URL and a valid authorization video.
- Use `generate_image` only after obtaining a public person-image URL plus a scene prompt or scene-image URL.
- Use `generate_music` for songs or instrumentals. Require lyrics or a music prompt for non-instrumental requests.
- Use `generate_video` only after collecting the user-supplied script plus the required digital-human, voice, template, and material inputs. Do not generate or rewrite copy as part of this Skill.
- Use `get_task` for a known task, `list_tasks` for recent history, and `get_account` for credits and limits.

Read [references/api.md](references/api.md) when exact field requirements or task semantics are needed.

## Handle failures

- On insufficient credits, stop and report the required and remaining credits.
- On validation errors, correct only the invalid fields.
- On upstream or network errors, check the original task before resubmitting to avoid duplicate charges.
- On a terminal failure, report the service error without exposing internal provider payloads.
- Never train a voice or digital human without user-provided source media and clear authorization.
