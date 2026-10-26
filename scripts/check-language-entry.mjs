import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../src/worker.js';
const cases = [
  ['CN', '', 'en-US', 'zh-cn'], ['JP', '', 'en-US', 'ja'],
  ['DE', '', 'en-US', 'de'], ['TW', '', 'en-US', 'zh-tw'],
  ['US', '', 'en-US', 'en'], ['FR', 'ja', 'en-US', 'ja'],
  ['', '', 'ko-KR', 'ko'], ['JP', '%E0%A4%A', 'en-US', 'ja'],
];
for (const [country, cookie, browserLanguage, expected] of cases) {
  const request = new Request('https://www.kaliai.fun/?inviteCode=demo', { headers: { 'Accept-Language': browserLanguage, Cookie: `kali_site_locale=${cookie}` } });
  Object.defineProperty(request, 'cf', { value: { country } });
  const response = await worker.fetch(request, { ASSETS: { fetch() { throw new Error('Root must reach the locale worker before static assets'); } } });
  assert.equal(response.status, 302);
  assert.equal(new URL(response.headers.get('Location')).pathname, `/${expected}/`);
  assert.equal(new URL(response.headers.get('Location')).searchParams.get('inviteCode'), 'demo');
  assert.match(response.headers.get('Cache-Control'), /no-store/);
}
let passedThrough = false;
await worker.fetch(new Request('https://www.kaliai.fun/zh-cn/'), { ASSETS: { fetch() { passedThrough = true; return new Response('ok'); } } });
assert.equal(passedThrough, true, 'Explicit language URLs must remain stable');
assert.match(fs.readFileSync('wrangler.jsonc', 'utf8'), /"run_worker_first":\s*\["\/"\]/);
assert.equal(fs.existsSync('public/_redirects'), false, 'No fixed root redirect may override geo routing');
console.log('Language entry checks passed: IP country, saved preference, browser fallback, malformed cookie, query preservation, no-store and worker-first routing.');
