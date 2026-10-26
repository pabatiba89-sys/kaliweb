import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { basePages } from '../src/site/content.js';
const modulePath = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(modulePath.startsWith('/') ? pathToFileURL(modulePath).href : modulePath);
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
const errors = [];
const checkedAssets = new Set();
let pageCount = 0;
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', (error) => errors.push(error.message));
  const paths = ['', ...basePages.map((item) => item.slug)];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    for (const slug of paths) {
      const url = `${origin}/en/${slug ? `${slug}/` : ''}`;
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, url);
      assert.equal(await page.locator('main h1').count(), 1, `${url}: one H1`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `${url}: overflow at ${width}px`);
      const assets = await page.locator('main img').evaluateAll((images) => [...new Set(images.map((image) => image.src))]);
      for (const asset of assets) {
        if (checkedAssets.has(asset)) continue;
        const result = await page.request.get(asset);
        assert.equal(result.status(), 200, `Image missing: ${asset}`);
        assert.match(result.headers()['content-type'], /^image\//, asset);
        checkedAssets.add(asset);
      }
      if (await page.locator('[data-walkthrough]').count()) {
        const apiRequests = [];
        const listener = (request) => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); };
        page.on('request', listener);
        const tabs = page.getByRole('tab');
        for (let index = 0; index < 4; index++) {
          await tabs.nth(index).click();
          assert.equal(await tabs.nth(index).getAttribute('aria-selected'), 'true');
          assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
          await page.locator('[data-next]').click();
          assert.equal(await tabs.nth((index + 1) % 4).getAttribute('aria-selected'), 'true');
        }
        await tabs.first().focus();
        await page.keyboard.press('End');
        assert.equal(await tabs.last().getAttribute('aria-selected'), 'true');
        await page.keyboard.press('Home');
        assert.equal(await tabs.first().getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('[data-previous]').isDisabled(), true);
        assert.equal(apiRequests.length, 0, 'Demo must not call creation APIs');
        page.off('request', listener);
      }
      pageCount++;
    }
  }
  for (const locale of ['zh-cn', 'zh-tw', 'de', 'ar', 'ja']) {
    await page.goto(`${origin}/${locale}/`, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${locale}: mobile overflow`);
    assert.notEqual(await page.locator('.walkthrough .eyebrow').textContent(), 'Interactive walkthrough', `${locale}: missing translation`);
    if (locale === 'ar') {
      assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
      await page.getByRole('tab').first().focus();
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
    }
    pageCount++;
  }
  assert.deepEqual(errors, [], 'Browser errors');
  console.log(`Public-site QA passed: ${pageCount} page/viewport checks, ${checkedAssets.size} images, demo navigation, keyboard, RTL, and no creation API requests.`);
} finally { await browser.close(); }
