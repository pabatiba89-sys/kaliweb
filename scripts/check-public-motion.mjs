import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const modulePath = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(modulePath.startsWith('/') ? pathToFileURL(modulePath).href : modulePath);
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4322';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  page.on('pageerror', (error) => errors.push(error.message));
  const mutations = [];
  page.on('request', (request) => { if (request.method() !== 'GET') mutations.push(request.url()); });
  await page.goto(`${origin}/zh-cn/`, { waitUntil: 'networkidle' });
  const stage = page.locator('[data-flow-stage]');
  const active = () => stage.getAttribute('data-active');
  const pixels = () => stage.locator('canvas').evaluate((canvas) => canvas.toDataURL());
  const before = await pixels();
  await page.waitForTimeout(400);
  assert.notEqual(await pixels(), before, 'Particle field must actually change over time');
  await page.waitForFunction(() => document.querySelector('[data-flow-stage]').dataset.active !== '0', null, { timeout: 8000 });
  await stage.hover({ position: { x: 70, y: 90 } });
  await page.waitForTimeout(150);
  const rotation = await stage.locator('.flow-stage__surface').evaluate((node) => getComputedStyle(node).transform);
  await stage.hover({ position: { x: 370, y: 230 } });
  await page.waitForTimeout(450);
  assert.notEqual(await stage.locator('.flow-stage__surface').evaluate((node) => getComputedStyle(node).transform), rotation, 'Pointer must change the perspective');
  const hoverIndex = await active();
  await page.waitForTimeout(5800);
  assert.equal(await active(), hoverIndex, 'Hover pauses automatic scene changes');
  await stage.locator('[data-flow-select="3"]').click();
  assert.equal(await active(), '3');
  await page.keyboard.press('End');
  assert.equal(await active(), '4', 'Keyboard selects the final scene');
  await stage.locator('[data-motion-toggle]').click();
  await page.locator('main h1').click();
  await page.mouse.move(0, 0);
  assert.equal(await stage.getAttribute('data-motion-running'), 'false');
  const pausedPixels = await pixels();
  await page.waitForTimeout(600);
  assert.equal(await pixels(), pausedPixels, 'Explicit pause freezes the canvas');
  await stage.locator('[data-motion-toggle]').click();
  await page.locator('main h1').click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(200);
  assert.equal(await stage.getAttribute('data-autoplay'), 'true');
  await page.locator('.public-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  assert.equal(await stage.getAttribute('data-motion-running'), 'false', 'Offscreen canvas stops rendering');
  const offscreenIndex = await active();
  await page.waitForTimeout(600);
  assert.equal(await active(), offscreenIndex);
  await page.locator('#story-editing').scrollIntoViewIfNeeded();
  const playhead = page.locator('#story-editing .timeline-playhead');
  const position = await playhead.evaluate((node) => getComputedStyle(node).insetInlineStart);
  await page.waitForTimeout(500);
  assert.notEqual(await playhead.evaluate((node) => getComputedStyle(node).insetInlineStart), position, 'Editing timeline visibly plays');
  assert.deepEqual(mutations, [], 'Visual effects must not submit tasks');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  assert.equal(await stage.locator('[data-motion-toggle]').isHidden(), true);
  const reducedPixels = await pixels();
  await page.waitForTimeout(500);
  assert.equal(await pixels(), reducedPixels, 'Reduced motion keeps a still illustration');
  await stage.locator('[data-flow-select="1"]').click();
  assert.equal(await active(), '1', 'Manual selection remains available with reduced motion');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(`${origin}/zh-cn/`, { waitUntil: 'networkidle' });
  const mobileStage = mobile.locator('[data-flow-stage]');
  await mobileStage.scrollIntoViewIfNeeded();
  await mobile.waitForFunction(() => document.querySelector('[data-flow-stage]').dataset.autoplay === 'true');
  await mobile.waitForFunction(() => document.querySelector('[data-flow-stage]').dataset.active !== '0', null, { timeout: 8000 });
  await mobileStage.locator('[data-flow-select="4"]').tap();
  assert.equal(await mobileStage.getAttribute('data-active'), '4');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);

  // Check all localized captions at the smallest supported phone width.
  await page.setViewportSize({ width: 390, height: 844 });
  const { supportedLocales } = await import('../src/site/localization.js');
  for (const locale of supportedLocales) {
    await page.goto(`${origin}/${locale}/`, { waitUntil: 'networkidle' });
    for (let index = 0; index < 5; index++) {
      await page.locator(`[data-flow-select="${index}"]`).click();
      const overlaps = await page.locator('[data-flow-stage]').evaluate((root) => {
        const caption = root.querySelector('[data-flow-caption][aria-hidden="false"] strong');
        return caption.getBoundingClientRect().bottom > root.querySelector('.flow-stage__navigation').getBoundingClientRect().top;
      });
      assert.equal(overlaps, false, `${locale}/${index}: caption overlaps controls`);
    }
  }
  assert.deepEqual(errors, [], 'No browser errors');
  console.log('Motion QA passed: temporal particle changes, pointer depth, autoplay, hover/focus, pause, offscreen, reduced motion, touch, 24-language captions and no task submissions.');
} finally { await browser.close(); }
