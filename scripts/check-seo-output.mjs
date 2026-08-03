import fs from 'node:fs';
import path from 'node:path';
import { defaultSeoLocale, indexableLocales } from '../src/site/seo.js';

const distDir = path.resolve('dist');
const placeholderOrigin = 'https://kali.xyaip.fun';
const errors = [];

const htmlFiles = fs.readdirSync(distDir, { recursive: true })
  .filter((file) => file.endsWith('.html'))
  .map((file) => String(file).split(path.sep).join('/'));

const publicFiles = htmlFiles.filter((file) => file !== 'index.html' && !file.startsWith('app/'));
const canonicalByFile = new Map();

function match(html, pattern) {
  return html.match(pattern)?.[1] || '';
}

for (const file of publicFiles) {
  const html = fs.readFileSync(path.join(distDir, file), 'utf8');
  const [locale, ...rest] = file.split('/');
  const slugParts = rest.slice(0, -1);
  const slugPath = slugParts.length > 0 ? `${slugParts.join('/')}/` : '';
  const shouldIndex = indexableLocales.includes(locale);
  const robots = match(html, /<meta name="robots" content="([^"]+)">/i);
  const canonical = match(html, /<link rel="canonical" href="([^"]+)">/i);
  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gi)]
    .map((entry) => ({ code: entry[1], href: entry[2] }));

  if (!canonical) errors.push(`${file}: missing canonical URL`);
  canonicalByFile.set(file, canonical);

  if (shouldIndex) {
    if (!robots.includes('index') || robots.includes('noindex')) {
      errors.push(`${file}: indexable locale does not use an index robots directive`);
    }

    const xDefault = hreflangs.find((entry) => entry.code === 'x-default');
    const expectedXDefaultPath = `/${defaultSeoLocale}/${slugPath}`;
    if (!xDefault || new URL(xDefault.href).pathname !== expectedXDefaultPath) {
      errors.push(`${file}: x-default must point to ${expectedXDefaultPath}`);
    }

    const languageAlternates = hreflangs.filter((entry) => entry.code !== 'x-default');
    if (languageAlternates.length !== indexableLocales.length) {
      errors.push(`${file}: expected ${indexableLocales.length} indexable language alternate(s)`);
    }
  } else {
    if (!robots.includes('noindex')) errors.push(`${file}: unreviewed locale must be noindex`);
    if (hreflangs.length > 0) errors.push(`${file}: noindex locale must not publish hreflang alternates`);
  }
}

const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((entry) => entry[1]);
const expectedUrls = [...canonicalByFile.entries()]
  .filter(([file]) => indexableLocales.includes(file.split('/')[0]))
  .map(([, canonical]) => canonical)
  .sort();

if (JSON.stringify([...sitemapUrls].sort()) !== JSON.stringify(expectedUrls)) {
  errors.push('sitemap URLs do not exactly match indexable public pages');
}

const appHtml = fs.readFileSync(path.join(distDir, 'app/index.html'), 'utf8');
if (!/<meta name="robots" content="[^"]*noindex/i.test(appHtml)) {
  errors.push('/app/ must remain noindex');
}

if (errors.length > 0) {
  console.error(`SEO output check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

const origin = new URL(expectedUrls[0]).origin;
if (!process.env.SITE_URL && origin === placeholderOrigin) {
  console.warn(`SEO output check warning: SITE_URL is not set; canonical URLs still use ${placeholderOrigin}.`);
}

console.log(`SEO output check passed: ${expectedUrls.length} indexable URL(s), locales: ${indexableLocales.join(', ')}.`);
