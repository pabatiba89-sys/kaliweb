import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AI_VIDEO_DEFAULT_MODEL_KEY,
  buildAIVideoPayload,
  buildAIVideoPromptInstruction,
  buildAIVideoPublishPayload,
  getAIVideoDialogueTitle,
  getAIVideoRemakeDraft,
  normalizeAIVideoTopics,
} from '../src/aiVideo.js';

const baseForm = {
  prompt: 'A neon city walk',
  duration: 5,
  resolution: '480p',
  aspectRatio: '9:16',
  generateAudio: true,
  firstFrameUrl: '',
  lastFrameUrl: '',
  characterIds: '',
  audioIds: '',
  seed: '',
};

test('defaults new AI video drafts to Seedance Mini', () => {
  assert.equal(AI_VIDEO_DEFAULT_MODEL_KEY, 'seedance-2-mini');
  assert.equal(getAIVideoRemakeDraft({}).form.model, AI_VIDEO_DEFAULT_MODEL_KEY);
});

test('maps Seedance reference videos and durations for billing', () => {
  const payload = buildAIVideoPayload({ ...baseForm, model: 'seedance-2-fast', mode: 'reference-to-video' }, {
    images: [{ url: 'https://example.com/reference.jpg' }],
    videos: [{ url: 'https://example.com/reference.mp4', duration: 3 }],
    audios: [{ url: 'https://example.com/reference.mp3' }],
  });

  assert.deepEqual(payload.reference_video_urls, ['https://example.com/reference.mp4']);
  assert.deepEqual(payload.reference_video_durations, [3]);
  assert.deepEqual(payload.reference_image_urls, ['https://example.com/reference.jpg']);
  assert.deepEqual(payload.reference_audio_urls, ['https://example.com/reference.mp3']);
});

test('maps Kling image mode and removes unsupported resolution', () => {
  const payload = buildAIVideoPayload({
    ...baseForm,
    model: 'kling-2.6',
    mode: 'image-to-video',
    firstFrameUrl: 'https://example.com/first.jpg',
  }, {});

  assert.deepEqual(payload.image_urls, ['https://example.com/first.jpg']);
  assert.equal(payload.sound, true);
  assert.equal('resolution' in payload, false);
});

test('maps Gemini video input and omits output duration', () => {
  const payload = buildAIVideoPayload({
    ...baseForm,
    model: 'gemini-omni-1.1-flash',
    mode: 'multimodal',
    resolution: '720p',
    characterIds: 'character-1, character-2',
    audioIds: 'audio-1',
  }, {
    videos: [{ url: 'https://example.com/input.mp4', duration: 4 }],
  });

  assert.deepEqual(payload.video_list, [{ url: 'https://example.com/input.mp4' }]);
  assert.deepEqual(payload.character_ids, ['character-1', 'character-2']);
  assert.deepEqual(payload.audio_ids, ['audio-1']);
  assert.equal('duration' in payload, false);
});

test('keeps the explicit MiniMax H3 mode and frame inputs', () => {
  const payload = buildAIVideoPayload({
    ...baseForm,
    model: 'minimax-h3',
    mode: 'image-to-video',
    resolution: '768p',
    firstFrameUrl: 'https://example.com/first.jpg',
    lastFrameUrl: 'https://example.com/last.jpg',
  }, {});

  assert.equal(payload.mode, 'image-to-video');
  assert.equal(payload.first_frame_url, 'https://example.com/first.jpg');
  assert.equal(payload.last_frame_url, 'https://example.com/last.jpg');
});

test('uses a cloned voice audio URL as Seedance reference audio', () => {
  const payload = buildAIVideoPayload(
    { ...baseForm, model: 'seedance-2-fast', mode: 'reference-to-video' },
    { images: [], videos: [], audios: [{ name: 'Cloned voice', url: 'https://example.com/cloned-voice.mp3' }] },
  );

  assert.deepEqual(payload.reference_audio_urls, ['https://example.com/cloned-voice.mp3']);
});

test('restores an AI video detail into an editable remake draft', () => {
  const draft = getAIVideoRemakeDraft({
    model: 'seedance-2-fast',
    mode: 'reference-to-video',
    prompt: 'A cinematic tea-house conversation',
    duration: 8,
    resolution: '480p',
    aspectRatio: '9:16',
    raw: {
      generate_audio: true,
      input: {
        prompt: 'A cinematic tea-house conversation',
        reference_image_urls: ['https://example.com/person.jpg'],
        reference_video_urls: ['https://example.com/motion.mp4'],
        reference_audio_urls: ['https://example.com/music.mp3'],
      },
      pricing_snapshot: { input_video_seconds: '6' },
    },
  });

  assert.equal(draft.form.prompt, 'A cinematic tea-house conversation');
  assert.equal(draft.form.mode, 'reference-to-video');
  assert.equal(draft.references.images[0].url, 'https://example.com/person.jpg');
  assert.equal(draft.references.videos[0].duration, 6);
  assert.equal(draft.references.audios[0].url, 'https://example.com/music.mp3');
});

test('derives Gemini frame mode instead of trusting its generic stored mode', () => {
  const draft = getAIVideoRemakeDraft({
    model: 'gemini-omni-1.1-flash',
    mode: 'multimodal',
    raw: { input: { prompt: 'Animate this frame', first_frame_url: 'https://example.com/first.jpg' } },
  });

  assert.equal(draft.form.mode, 'first-last-frame');
  assert.equal(draft.form.firstFrameUrl, 'https://example.com/first.jpg');
});

test('builds a single-output video prompt instruction with current generation settings', () => {
  const instruction = buildAIVideoPromptInstruction('露天茶馆里的温暖对话', {
    model: 'Seedance 2.0 Fast',
    duration: 5,
    resolution: '480p',
    aspectRatio: '9:16',
    generateAudio: true,
  });

  assert.match(instruction, /只输出最终提示词正文/);
  assert.match(instruction, /当前模型：Seedance 2\.0 Fast/);
  assert.match(instruction, /当前生成设置：5s · 480P · 9:16 · audio enabled/);
  assert.match(instruction, /用户想法：露天茶馆里的温暖对话/);
});

test('normalizes manually entered AI video topics', () => {
  assert.deepEqual(normalizeAIVideoTopics('#AI视频，产品发布\nAI视频; 海外营销'), ['AI视频', '产品发布', '海外营销']);
});

test('uses the first spoken sentence as the AI video title', () => {
  const prompt = '场景：深夜办公室。Elena 抬眼看 Adrian，说：“你那计划滴水不漏，最后漏得一点不剩。今晚重做。”镜头缓慢推进。';
  assert.equal(getAIVideoDialogueTitle(prompt), '你那计划滴水不漏，最后漏得一点不剩。');
  assert.equal(getAIVideoDialogueTitle('No spoken dialogue here.'), 'AI 真人视频');
});

test('builds the dedicated AI video publish payload', () => {
  assert.deepEqual(buildAIVideoPublishPayload({
    videoId: '123',
    title: '  AI 成片标题  ',
    topics: '#话题1, 话题2',
    accountId: '8',
    publishAt: '2026-09-01T12:00',
    publishNow: false,
  }), {
    ai_video_id: 123,
    title: 'AI 成片标题',
    topics: ['话题1', '话题2'],
    publish_account_id: 8,
    publish_time: '2026-09-01 12:00',
    publish_now: false,
  });
});
