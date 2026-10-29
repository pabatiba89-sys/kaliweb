import assert from 'node:assert/strict';
import test from 'node:test';
import { initialWorkspacePage, readWorkspaceRoute, syncWorkspaceLocation, workspacePagesForLocale, workspacePath } from '../src/workspaceRoutes.js';
import { canCrawl } from '../scripts/robots-policy.mjs';

test('every workspace entry reopens its intended section, including legacy query links', () => {
  for (const locale of ['en', 'zh-cn', 'zh-tw', 'de', 'ar']) {
    for (const { id } of workspacePagesForLocale(locale)) {
      const url = new URL(workspacePath(locale, id), 'https://www.kaliai.fun');
      assert.equal(initialWorkspacePage(url), id);
      assert.equal(readWorkspaceRoute(url.pathname).locale, locale);
      assert.equal(initialWorkspacePage(new URL(`https://www.kaliai.fun/app/?page=${id}`)), id);
    }
  }
  assert.equal(initialWorkspacePage(new URL('https://www.kaliai.fun/app/')), 'home');
  assert.equal(initialWorkspacePage(new URL('https://www.kaliai.fun/app/?page=unknown')), 'home');
});
test('navigation clears obsolete creator state but preserves invite attribution', () => {
  const url = new URL('https://www.kaliai.fun/app/?page=video&creator=prefill&inviteCode=demo');
  assert.equal(syncWorkspaceLocation(url, 'music', 'zh-cn'), '/app/zh-cn/music/?inviteCode=demo');
  assert.ok(!workspacePagesForLocale('en').some((page) => page.id === 'trends'));
  assert.ok(workspacePagesForLocale('zh-cn').some((page) => page.id === 'trends'));
});
test('crawler audit detects Cloudflare-specific blocks despite a wildcard allow', () => {
  const robots = 'User-agent: *\nAllow: /\nUser-agent: Baiduspider\nDisallow: /\nUser-agent: KimiBot\nDisallow: /\nUser-agent: *\nAllow: /';
  assert.equal(canCrawl(robots, 'Baiduspider'), false);
  assert.equal(canCrawl(robots, 'KimiBot'), false);
  assert.equal(canCrawl(robots, 'Googlebot'), true);
  assert.equal(canCrawl('User-agent: GPTBot\nDisallow: /', 'Baiduspider'), true);
  assert.equal(canCrawl('User-agent: *\nDisallow: /*.pdf$', 'Baiduspider', '/guide.pdf'), false);
  assert.equal(canCrawl('User-agent: *\nDisallow: /*.pdf$', 'Baiduspider', '/guide.pdf/info'), true);
  assert.equal(canCrawl('User-agent: *\nDisallow: /api/\nAllow: /', 'Baiduspider', '/app/zh-cn/'), true);
  assert.equal(canCrawl('User-agent: *\nDisallow: /api/\nAllow: /', 'Baiduspider', '/api/user/info'), false);
});
