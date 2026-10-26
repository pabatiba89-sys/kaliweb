import { mkdir } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Capture only a fresh anonymous session. Never reuse personal browser storage.
const modulePath = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(modulePath.startsWith('/') ? pathToFileURL(modulePath).href : modulePath);
const sharp = createRequire(import.meta.url)(process.env.SHARP_MODULE || 'sharp');
const baseUrl = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const out = new URL('../public/previews/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await context.addInitScript(() => localStorage.setItem('kali_ui_locale', 'en-US'));
  const page = await context.newPage();
  const capture = async (name) => {
    await page.waitForTimeout(1500);
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await sharp(await page.screenshot()).webp({ quality: 88 }).toFile(fileURLToPath(new URL(`${name}.webp`, out)));
  };
  await page.goto(`${baseUrl}/app/`, { waitUntil: 'networkidle' });
  await capture('workspace');
  await context.close();
} finally {
  await browser.close();
}
