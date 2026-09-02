import assert from 'node:assert/strict';
import test from 'node:test';

import { buildRealmanPackagingPayload } from '../src/realmanVideo.js';

test('builds a real-person packaging payload without digital-human-only fields', () => {
  const payload = buildRealmanPackagingPayload({
    sourceVideo: { videoUrl: 'https://cdn.example.com/source.mp4', duration: 4.2, prompt: 'do not submit this as a script' },
    title: 'Neon city package',
    topic: 'Office humor',
    language: 'en-US',
    template: { id: 'style-8' },
    music: { audioUrl: 'https://cdn.example.com/music.mp3' },
    cover: { url: 'https://cdn.example.com/video-cover.jpg' },
    materials: [
      { type: 'image', url: 'https://cdn.example.com/cover.jpg' },
      { type: 'video', fileUrl: 'https://cdn.example.com/cutaway.mp4' },
    ],
  });

  assert.equal(payload.videoUrl, 'https://cdn.example.com/source.mp4');
  assert.equal(payload.tags, 'Office humor');
  assert.equal(payload.tag, 'Office humor');
  assert.equal(payload.videoTemplateId, 'style-8');
  assert.equal(payload.durationSeconds, 5);
  assert.equal(payload.coverUrl, 'https://cdn.example.com/video-cover.jpg');
  assert.equal(payload.cover, 'https://cdn.example.com/video-cover.jpg');
  assert.deepEqual(payload.processRules, {
    firstFrameCover: {
      coverSwitch: true,
      imageUrl: 'https://cdn.example.com/video-cover.jpg',
    },
  });
  assert.deepEqual(payload.shanjianData.processRules, payload.processRules);
  assert.deepEqual(payload.materials, [
    { type: 'image', fileUrl: 'https://cdn.example.com/cover.jpg' },
    { type: 'video', fileUrl: 'https://cdn.example.com/cutaway.mp4' },
  ]);
  assert.equal(payload.shanjianData.packRules.backgroundMusic.volume, 0.3);
  for (const key of ['script', 'content', 'subtitle', 'subtitles', 'introduceCard', 'speakerId', 'virtualmanId']) {
    assert.equal(Object.hasOwn(payload, key), false);
    assert.equal(Object.hasOwn(payload.shanjianData, key), false);
  }
});

test('leaves background music unset so the backend can pick one automatically', () => {
  const payload = buildRealmanPackagingPayload({
    sourceVideo: { video_url: 'https://cdn.example.com/source.mp4', duration_seconds: 5 },
    title: 'Auto music',
    template: { style_id: 'style-9' },
  });

  assert.equal(payload.styleId, 'style-9');
  assert.equal(payload.packRules.materialSwitch, false);
  assert.equal(Object.hasOwn(payload.packRules, 'backgroundMusic'), false);
  assert.equal(payload.coverUrl, '');
  assert.deepEqual(payload.processRules, {});
});
