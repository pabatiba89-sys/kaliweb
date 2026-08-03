import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_SITE_URL } from '../src/site/site-config.js';

const publicDir = path.resolve('public');
const keyFiles = fs.readdirSync(publicDir).filter((file) => /^[a-f0-9]{32}\.txt$/.test(file));

if (keyFiles.length !== 1) {
  throw new Error(`Expected exactly one IndexNow key file in public/, found ${keyFiles.length}.`);
}

const keyFile = keyFiles[0];
const key = path.basename(keyFile, '.txt');
const keyContents = fs.readFileSync(path.join(publicDir, keyFile), 'utf8').trim();

if (keyContents !== key) {
  throw new Error('IndexNow key file contents must match its filename.');
}

const siteUrl = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
const sitemapUrl = new URL('/sitemap.xml', siteUrl);
const sitemapResponse = await fetch(sitemapUrl);

if (!sitemapResponse.ok) {
  throw new Error(`Unable to read ${sitemapUrl}: HTTP ${sitemapResponse.status}.`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((entry) => entry[1]);

if (urlList.length === 0) {
  throw new Error('The production sitemap does not contain any URLs.');
}

if (urlList.some((url) => new URL(url).origin !== siteUrl.origin)) {
  throw new Error(`Every submitted URL must use ${siteUrl.origin}.`);
}

const payload = {
  host: siteUrl.host,
  key,
  keyLocation: new URL(`/${keyFile}`, siteUrl).href,
  urlList,
};

if (process.argv.includes('--dry-run')) {
  console.log(`IndexNow dry run passed: ${urlList.length} URL(s) ready for ${siteUrl.host}.`);
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (![200, 202].includes(response.status)) {
  const body = (await response.text()).trim();
  throw new Error(`IndexNow submission failed: HTTP ${response.status}${body ? ` — ${body}` : ''}`);
}

console.log(`IndexNow accepted ${urlList.length} URL(s) for ${siteUrl.host}: HTTP ${response.status}.`);
