import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
const loaderSource = source.slice(source.indexOf('async function fetchCreatorResource('), source.indexOf('function useCreatorResourceRefresh('));
const hookSource = source.slice(source.indexOf('function useCreatorResourceRefresh('), source.indexOf('function VideoCreatorDialog('));

function loader(response = { ok: true, data: [] }) {
  const calls = [];
  const context = vm.createContext({
    apiFetch: async (path, options) => { calls.push({ path, ...options }); return response; },
    getCreatorPayloadList: (result) => result.data,
    getVoiceItems: (result) => result.data,
    normalizeHuman: (item) => item,
    normalizeVoiceAsset: (item) => item,
    normalizeCreatorPreset: (item) => item,
    hydrateCreatorPresetVoice: (item) => item,
    getStoredUserInfo: () => ({}),
    videoText: (...values) => values.find(Boolean) || '',
    buildPackagingPresetListParams: () => ({}),
    getMusicList: (result) => result.data,
    normalizeMusicItem: (item) => item,
    toList: (items) => items,
    getImageGenerationItems: (result) => result.data,
    normalizeMaterial: (item) => item,
    normalizeTemplate: (item) => item,
    normalizeCreatorAIVideoMaterial: (item) => item,
    normalizeCreatorAIImageMaterial: (item) => item,
    TEMPLATE_PAGE_SIZE: 100, MATERIAL_PAGE_SIZE: 60,
    getTemplateNextCursor: () => 'new-cursor',
    getMaterialNextCursor: () => 'new-material-cursor',
    getTemplateHasMore: () => true,
    getResultMessage: (result) => result.message,
  });
  return { calls, fetch: vm.runInContext(`${loaderSource}; fetchCreatorResource`, context) };
}

test('refreshing each resource only requests its own data', async () => {
  const paths = {
    human: ['/api/aihuman/list', '/api/aihuman/common-list'],
    voice: ['/api/ai-voice/list', '/api/ai-voice/common-list'],
    preset: ['/api/team-video-preset/list'],
    music: ['/api/music/generated'],
    material: ['/api/material/list'],
    aiVideoMaterial: ['/api/ai-video/videos'],
    aiImageMaterial: ['/api/image-generation/images'],
    videoTemplate: ['/api/shanjian/video-templates'],
    coverTemplate: ['/api/shanjian/cover-templates'],
  };
  for (const [type, expected] of Object.entries(paths)) {
    const { calls, fetch } = loader();
    await fetch(type, { templateScene: 'virtualman', resources: {} });
    assert.deepEqual(calls.map((call) => call.path), expected, type);
    assert.ok(calls.every((call) => !call.params.page || call.params.page === 1));
    assert.ok(calls.every((call) => !call.params.sid && !call.params.start_cursor));
  }
});

test('template refresh keeps the production scene and resets pagination', async () => {
  for (const scene of ['virtualman', 'oralMixCutting', 'realMan']) {
    const { calls, fetch } = loader();
    const result = await fetch('videoTemplate', { templateScene: scene, resources: {} });
    assert.equal(calls[0].params.scene, scene);
    assert.equal(calls[0].auth, false);
    assert.equal(calls[0].path, scene === 'realMan' ? '/api/shanjian/realman-video-templates' : '/api/shanjian/video-templates');
    assert.equal(result.paging.page, 1);
    assert.equal(result.paging.cursor, 'new-cursor');
    assert.equal(result.paging.hasMore, true);
  }
});

test('a failed response rejects instead of replacing existing resources with an empty list', async () => {
  const { fetch } = loader({ ok: false, data: [], message: 'Try again' });
  await assert.rejects(fetch('material', { resources: {} }), /Try again/);
});

test('refresh preserves unrelated lists, rejects duplicate clicks, and ignores an old mode response', async () => {
  let cleanup;
  let resolve;
  let calls = 0;
  let resources = { human: ['existing-human'], material: ['old-material'] };
  let paging = {};
  const ref = { current: {} };
  const context = vm.createContext({
    useState: (initial) => [initial, () => {}],
    useRef: (current) => ({ current }),
    useEffect: (effect) => { cleanup = effect(); },
    fetchCreatorResource: () => { calls += 1; return new Promise((done) => { resolve = done; }); },
  });
  const useRefresh = vm.runInContext(`${hookSource}; useCreatorResourceRefresh`, context);
  const hook = useRefresh({ scope: 'oral', resources, setResources: (fn) => { resources = fn(resources); }, setResourcePaging: (fn) => { paging = fn(paging); }, resourceLoadingRef: ref });
  const request = hook.refreshResource('material');
  await hook.refreshResource('material');
  assert.equal(calls, 1);
  resolve({ items: ['new-material'], paging: { page: 1 } });
  await request;
  assert.deepEqual(resources.human, ['existing-human']);
  assert.deepEqual(resources.material, ['new-material']);
  assert.equal(paging.material.page, 1);
  const stale = hook.refreshResource('material');
  cleanup();
  resolve({ items: ['stale-material'], paging: {} });
  await stale;
  assert.deepEqual(resources.material, ['new-material']);
  assert.equal(ref.current.material, false);
});
