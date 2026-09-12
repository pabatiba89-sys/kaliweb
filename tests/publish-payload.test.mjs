import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLocalPublishPayload,
  buildProductionVideoPublishPayload,
  buildUploadedVideoPublishPayload,
  checkLocalPublisher,
  normalizePublishTopics,
  triggerLocalPublish,
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

test('builds the legacy local publisher payload expected by port 5409', () => {
  assert.deepEqual(buildLocalPublishPayload({
    type: '3',
    title: ' 新品发布 ',
    topics: '#新品，出海',
    filePath: 'video.mp4',
    accountCookies: ['douyin.json', 'douyin.json'],
    publishAt: '2026-09-12T18:30',
    publishNow: false,
  }), {
    type: 3,
    title: '新品发布',
    tags: ['新品', '出海'],
    fileList: ['video.mp4'],
    accountList: ['douyin.json'],
    enableTimer: 1,
    videosPerDay: 1,
    sendnow: 'schedule',
    dailyTimes: ['2026-09-12 18:30:00'],
    endpublishTime: '2026-09-12 18:30:00',
    startDays: 0,
    category: 0,
    productLink: '',
    productTitle: '',
  });
});

test('uploads by URL and publishes to every active local platform with the matching account name', async () => {
  const requests = [];
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url, options });
    if (url.endsWith('/uploadFromUrl')) return new Response(JSON.stringify({ code: 200, data: { filepath: 'local-video.mp4' } }), { status: 200 });
    if (url.includes('/getAccounts')) return new Response(JSON.stringify({ code: 200, data: [
      [1, 3, 'douyin.json', '主账号', 1],
      [2, 4, 'kuaishou.json', '主账号', 1],
      [3, 2, 'inactive.json', '主账号', 0],
      [4, 1, 'other.json', '其他账号', 1],
    ] }), { status: 200 });
    return new Response(JSON.stringify({ code: 200, data: null }), { status: 200 });
  };

  const result = await triggerLocalPublish({
    videoUrl: 'https://cdn.example.com/video.mp4',
    title: '发布标题',
    topics: ['AI'],
    accountName: '主账号',
    publishAt: '2026-09-12 18:30',
    fetchImpl,
  });

  assert.deepEqual(result, { filePath: 'local-video.mp4', accountCount: 2, platformCount: 2 });
  assert.equal(requests.length, 4);
  assert.deepEqual(requests.slice(2).map((request) => JSON.parse(request.options.body).type), [3, 4]);
});

test('detects when the local publishing service is unavailable', async () => {
  const unavailable = await checkLocalPublisher({
    fetchImpl: async () => { throw new TypeError('Failed to fetch'); },
  });
  assert.deepEqual(unavailable, {
    ok: false,
    message: '无法连接本地发布服务，请确认 5409 服务已启动',
  });

  const available = await checkLocalPublisher({
    fetchImpl: async () => new Response(JSON.stringify({ code: 200, data: [] }), { status: 200 }),
  });
  assert.deepEqual(available, { ok: true, message: '' });
});
