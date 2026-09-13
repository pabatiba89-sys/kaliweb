import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLocalPublishPayload,
  buildProductionVideoPublishPayload,
  buildUploadedVideoPublishPayload,
  checkLocalPublisher,
  getPublishAccountBinding,
  listLocalPublisherAccounts,
  loadPublishAccountBindings,
  normalizePublishTopics,
  savePublishAccountBindings,
  triggerLocalPublish,
} from '../src/publish.js';

const createMemoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

test('normalizes and deduplicates publish topics', () => {
  assert.deepEqual(
    normalizePublishTopics('#第三 话题，第一话题; 第二 话题 #第一话题'),
    ['第三话题', '第一话题', '第二话题'],
  );
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

test('queries by account name and publishes every returned local platform without checking account status', async () => {
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
    topics: ['第三话题', '第一话题', '第二话题'],
    accountName: '主账号',
    publishAt: '2026-09-12 18:30',
    fetchImpl,
  });

  assert.equal(requests.length, 5);
  assert.equal(requests[1].url, 'http://127.0.0.1:5409/getAccounts?name=%E4%B8%BB%E8%B4%A6%E5%8F%B7&nocheck=1');
  assert.deepEqual(requests.slice(2).map((request) => JSON.parse(request.options.body).type), [3, 4, 2]);
  requests.slice(2).forEach((request) => {
    assert.deepEqual(JSON.parse(request.options.body).tags, ['第三话题', '第一话题', '第二话题']);
  });
  assert.deepEqual(result, { filePath: 'local-video.mp4', accountCount: 3, platformCount: 3 });
});

test('stores explicit local account bindings without cookie data', () => {
  const storage = createMemoryStorage();
  savePublishAccountBindings({
    7: [
      { id: 23, type: 4, name: '主账号', cookie: 'must-not-be-saved.json' },
      { id: 24, type: 3, name: '主账号' },
    ],
  }, storage);

  assert.deepEqual(loadPublishAccountBindings(storage), {
    7: [
      { id: '23', type: 4, name: '主账号' },
      { id: '24', type: 3, name: '主账号' },
    ],
  });
  assert.deepEqual(getPublishAccountBinding('7', storage), [
    { id: '23', type: 4, name: '主账号' },
    { id: '24', type: 3, name: '主账号' },
  ]);
});

test('reads the account-management API with the canonical platform mapping', async () => {
  let requestedUrl = '';
  const result = await listLocalPublisherAccounts({
    fetchImpl: async (url) => {
      requestedUrl = url;
      return new Response(JSON.stringify({ code: 200, data: [
        [1, 5, 'tiktok.json', '海外账号', 1],
        [2, 6, 'youtube.json', '海外账号', 0],
      ] }), { status: 200 });
    },
  });

  assert.equal(requestedUrl, 'http://127.0.0.1:5409/getValidAccounts');
  assert.deepEqual(result.accounts, [
    { id: '1', type: 5, name: '海外账号', status: 1, platform: 'TikTok', configured: true },
    { id: '2', type: 6, name: '海外账号', status: 0, platform: 'YouTube', configured: true },
  ]);
});

test('publishes only explicitly bound local account ids', async () => {
  const requests = [];
  const localAccounts = [
    [23, 4, 'kuaishou.json', '同名账号', 1],
    [24, 3, 'douyin.json', '同名账号', 1],
    [25, 2, 'channels.json', '同名账号', 1],
  ];
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url, options });
    if (url.endsWith('/uploadFromUrl')) return new Response(JSON.stringify({ code: 200, data: { filepath: 'video.mp4' } }), { status: 200 });
    return new Response(JSON.stringify({ code: 200, data: null }), { status: 200 });
  };

  const result = await triggerLocalPublish({
    videoUrl: 'https://cdn.example.com/video.mp4',
    title: '显式匹配发布',
    accountName: '云端账号名可以不同',
    accountTargets: [{ id: '24', type: 3, name: '本机抖音账号' }],
    localAccounts,
    publishAt: '2026-09-13 10:00',
    fetchImpl,
  });

  assert.equal(requests.length, 2);
  assert.equal(JSON.parse(requests[1].options.body).type, 3);
  assert.deepEqual(JSON.parse(requests[1].options.body).accountList, ['douyin.json']);
  assert.deepEqual(result, { filePath: 'video.mp4', accountCount: 1, platformCount: 1 });
});

test('blocks publishing when an explicit account binding is stale', async () => {
  const result = await checkLocalPublisher({
    accountTargets: [{ id: '99', type: 3, name: '已删除账号' }],
    fetchImpl: async () => new Response(JSON.stringify({ code: 200, data: [
      [24, 3, 'douyin.json', '其他账号', 1],
    ] }), { status: 200 }),
  });

  assert.deepEqual(result, {
    ok: false,
    message: '本机账号匹配已失效，请到发布设置重新匹配',
    accounts: [],
  });
});

test('posts all local platforms concurrently when accounts were already fetched', async () => {
  const accounts = [
    [1, 3, 'douyin.json', '主账号', 0],
    [2, 4, 'kuaishou.json', '主账号', 0],
  ];
  let startedPosts = 0;
  let releasePosts;
  const allPostsStarted = new Promise((resolve) => { releasePosts = resolve; });
  let finishPosts;
  const postsCanFinish = new Promise((resolve) => { finishPosts = resolve; });
  const fetchImpl = async (url) => {
    if (url.endsWith('/uploadFromUrl')) {
      return new Response(JSON.stringify({ code: 200, data: { filepath: 'local-video.mp4' } }), { status: 200 });
    }
    if (url.endsWith('/postVideo')) {
      startedPosts += 1;
      if (startedPosts === accounts.length) releasePosts();
      await postsCanFinish;
      return new Response(JSON.stringify({ code: 200, data: null }), { status: 200 });
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  const publishing = triggerLocalPublish({
    videoUrl: 'https://cdn.example.com/video.mp4',
    title: '发布标题',
    accountName: '主账号',
    localAccounts: accounts,
    publishAt: '2026-09-12 18:30',
    fetchImpl,
  });
  await allPostsStarted;
  assert.equal(startedPosts, 2);
  finishPosts();
  assert.deepEqual(await publishing, { filePath: 'local-video.mp4', accountCount: 2, platformCount: 2 });
});

test('detects when the local publishing service is unavailable', async () => {
  const unavailable = await checkLocalPublisher({
    fetchImpl: async () => { throw new TypeError('Failed to fetch'); },
  });
  assert.deepEqual(unavailable, {
    ok: false,
    message: '无法连接本地发布服务，请确认 5409 服务已启动',
    accounts: [],
  });

  let requestedUrl = '';
  const available = await checkLocalPublisher({
    accountName: '海外 主账号',
    fetchImpl: async (url) => {
      requestedUrl = url;
      return new Response(JSON.stringify({ code: 200, data: [[1, 3, 'account.json', '海外 主账号', 0]] }), { status: 200 });
    },
  });
  assert.equal(requestedUrl, 'http://127.0.0.1:5409/getAccounts?name=%E6%B5%B7%E5%A4%96+%E4%B8%BB%E8%B4%A6%E5%8F%B7&nocheck=1');
  assert.deepEqual(available, { ok: true, message: '', accounts: [[1, 3, 'account.json', '海外 主账号', 0]] });
});
