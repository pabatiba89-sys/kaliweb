import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { basePages } from '../src/site/content.js';
import { supportedLocales } from '../src/site/localization.js';
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
        const stepCount = await tabs.count();
        for (let index = 0; index < stepCount; index++) {
          await tabs.nth(index).click();
          assert.equal(await tabs.nth(index).getAttribute('aria-selected'), 'true');
          assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
          await page.locator('[data-next]').click();
          assert.equal(await tabs.nth((index + 1) % stepCount).getAttribute('aria-selected'), 'true');
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
  for (const locale of supportedLocales) {
    for (const width of [390, 1024]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(`${origin}/${locale}/`, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${locale}: mobile overflow`);
    if (locale !== 'en') assert.notEqual(await page.locator('.walkthrough .eyebrow').textContent(), 'Interactive walkthrough', `${locale}: missing translation`);
    assert.equal(await page.getByRole('tab').count(), 5, `${locale}: full pipeline`);
    if (locale === 'ar') {
      assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
      await page.getByRole('tab').first().focus();
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
    }
    pageCount++;
    }
  }
  await page.setViewportSize({ width: 390, height: 960 });
  for (const locale of ['zh-cn', 'de', 'ar', 'ja', 'hi', 'th']) {
    for (const slug of ['ai-script-writer', 'smart-video-editing', 'social-video-publishing', 'developers']) {
      const response = await page.goto(`${origin}/${locale}/${slug}/`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${locale}/${slug}: mobile overflow`);
      const faq = await page.locator('.faq-list details').evaluateAll((items) => items.map((item) => ({ question: item.querySelector('summary').textContent.replace(/\+$/, '').trim(), answer: item.querySelector('p').textContent })));
      const schema = await page.locator('script[type="application/ld+json"]').evaluate((node) => JSON.parse(node.textContent)['@graph'].find((entry) => entry['@type'] === 'FAQPage'));
      assert.deepEqual(schema.mainEntity.map((entry) => ({ question: entry.name, answer: entry.acceptedAnswer.text })), faq, `${locale}/${slug}: FAQ schema matches visible content`);
      pageCount++;
    }
  }
  assert.deepEqual(errors, [], 'Browser errors');
  console.log(`Public-site QA passed: ${pageCount} page/viewport checks, ${checkedAssets.size} images, demo navigation, keyboard, RTL, and no creation API requests.`);
} finally { await browser.close(); }
