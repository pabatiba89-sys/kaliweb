import assert from 'node:assert/strict';
import { brandCopy } from '../src/site/brand-copy.js';
import { motionCopy } from '../src/site/motion-copy.js';
import { capabilitySlugs, getBrandContent, newMarketingPages } from '../src/site/brand-content.js';
import { supportedLocales } from '../src/site/localization.js';
import { pagesByLocale } from '../src/site/content.js';
const keys = ['trend', ...Object.keys(capabilitySlugs)];
assert.deepEqual(Object.keys(brandCopy).sort(), [...supportedLocales].sort());
assert.deepEqual(Object.keys(motionCopy).sort(), [...supportedLocales].sort());
for (const locale of supportedLocales) {
  const copy = brandCopy[locale];
  assert.equal(motionCopy[locale].length, 2, `${locale}: animation controls`);
  for (const [key, count] of [['hero', 4], ['ui', 18], ...keys.map((key) => [key, 3])]) {
    assert.equal(copy[key].length, count, `${locale}.${key}: field coverage`);
    copy[key].forEach((value) => assert.ok(typeof value === 'string' && value.trim(), `${locale}.${key}: empty text`));
  }
  assert.equal(copy.audience.length, 3);
  const revisions = getBrandContent(locale);
  assert.equal(revisions[''].walkthrough.steps.length, 5);
  const titles = new Set();
  const descriptions = new Set();
  for (const [slug, page] of Object.entries(revisions)) {
    assert.ok(page.title && page.headline && page.description, `${locale}/${slug}: metadata`);
    assert.ok(!titles.has(page.title), `${locale}/${slug}: duplicate title`);
    titles.add(page.title);
    assert.ok(!descriptions.has(page.description), `${locale}/${slug}: duplicate description`);
    descriptions.add(page.description);
    if (locale !== 'en') assert.notEqual(page.headline, getBrandContent('en')[slug].headline, `${locale}/${slug}: English fallback`);
    for (const target of page.related || []) assert.ok(pagesByLocale[locale].some((p) => p.slug === target), `${locale}/${slug}: related ${target}`);
  }
  for (const page of newMarketingPages) assert.ok(pagesByLocale[locale].some((p) => p.slug === page.slug));
}
console.log('Brand content passed: 24 complete locales, 5 demo stages, unique metadata, 4 new pages and related links.');
