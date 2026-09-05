import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildProductionVideoPublishPayload,
  buildUploadedVideoPublishPayload,
  normalizePublishTopics,
} from '../src/publish.js';

test('normalizes and deduplicates publish topics', () => {
  assert.deepEqual(normalizePublishTopics('#AI视频，出海; AI视频\n产品'), ['AI视频', '出海', '产品']);
});

test('builds a production video payload with legacy aliases', () => {
  assert.deepEqual(buildProductionVideoPublishPayload({
    videoId: '18',
    title: ' 新品发布 ',
    topics: '#新品,#出海',
    accountId: '7',
    accountName: 'TikTok 主账号',
    publishAt: '2026-09-06T10:30',
    publishNow: false,
  }), {
    id: 18,
    video_id: 18,
    videoId: 18,
    title: '新品发布',
    topics: ['新品', '出海'],
    tags: ['新品', '出海'],
    publish_account_id: 7,
    publishAccountId: 7,
    account: 'TikTok 主账号',
    account_name: 'TikTok 主账号',
    accountName: 'TikTok 主账号',
    publish_time: '2026-09-06 10:30',
    publishTime: '2026-09-06 10:30',
    publish_now: false,
    publishNow: false,
  });
});

test('builds an uploaded video payload for the dedicated backend endpoint', () => {
  const payload = buildUploadedVideoPublishPayload({
    videoUrl: 'https://cdn.example.com/video.mp4',
    uploadKey: 'uploads/video.mp4',
    fileName: 'video.mp4',
    fileSize: 1024,
    duration: 12.5,
    title: '上传成片',
    topics: ['品牌'],
    accountId: 3,
    accountName: 'YouTube',
    publishAt: '2026-09-06 09:00',
    publishNow: true,
  });

  assert.equal(payload.source, 'upload');
  assert.equal(payload.video_url, 'https://cdn.example.com/video.mp4');
  assert.equal(payload.upload_key, 'uploads/video.mp4');
  assert.equal(payload.publish_now, true);
  assert.deepEqual(payload.topics, ['品牌']);
});
