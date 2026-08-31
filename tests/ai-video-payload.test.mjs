import assert from 'node:assert/strict';
import test from 'node:test';

import { buildAIVideoPayload } from '../src/aiVideo.js';

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
