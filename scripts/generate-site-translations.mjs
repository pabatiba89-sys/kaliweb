import fs from 'node:fs/promises';
import https from 'node:https';
import { basePages } from '../src/site/content.js';
import { homeEn } from '../src/site/home.js';
import { publicUiStrings } from '../src/site/localization.js';
import { siteLocalizationOverrides } from './localization-overrides.mjs';

const targets = {
  'zh-cn': 'zh-Hans', 'zh-tw': 'zh-Hant', es: 'es', fr: 'fr', ru: 'ru', de: 'de',
  pt: 'pt-pt', ar: 'ar', it: 'it', ja: 'ja', ko: 'ko', id: 'id', vi: 'vi', tr: 'tr', nl: 'nl',
  uk: 'uk', th: 'th', pl: 'pl', ro: 'ro', el: 'el', cs: 'cs', fi: 'fi', hi: 'hi',
};
const requestedLocale = process.argv.find((argument) => argument.startsWith('--locale='))?.split('=')[1];
if (requestedLocale && !targets[requestedLocale]) throw new Error(`Unsupported locale: ${requestedLocale}`);
const activeTargets = requestedLocale ? { [requestedLocale]: targets[requestedLocale] } : targets;

const strings = new Set(publicUiStrings);
const incremental = process.argv.includes('--incremental');
const rawContentKeys = new Set(['slug', 'contentType', 'links', 'related', 'image']);
const collect = (value) => {
  if (Array.isArray(value)) return value.forEach(collect);
  if (value && typeof value === 'object') return Object.entries(value).forEach(([key, entry]) => {
    if (!rawContentKeys.has(key)) collect(entry);
  });
  if (typeof value === 'string' && value.trim()) strings.add(value.trim());
};
collect(basePages);
collect(homeEn);

if (process.argv.includes('--apply-overrides')) {
  const existing = JSON.parse(await fs.readFile(new URL('../src/site/site-translations.json', import.meta.url), 'utf8'));
  const patched = Object.fromEntries(Object.keys(targets).map((locale) => [locale, { ...(existing[locale] || {}), ...(siteLocalizationOverrides[locale] || {}) }]));
  await fs.writeFile(new URL('../src/site/site-translations.json', import.meta.url), `${JSON.stringify(patched, null, 2)}\n`);
  console.log(`Applied curated public-site overrides to ${Object.keys(patched).length} locale files.`);
  process.exit(0);
}

const request = (options, body = '') => new Promise((resolve, reject) => {
  const req = https.request({ ...options, rejectUnauthorized: false }, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const result = Buffer.concat(chunks).toString('utf8');
      if (response.statusCode >= 200 && response.statusCode < 300) resolve(result);
      else reject(new Error(`Translation request failed (${response.statusCode}): ${result.slice(0, 300)}`));
    });
  });
  req.on('error', reject);
  req.setTimeout(30000, () => req.destroy(new Error('Translation request timed out')));
  if (body) req.write(body);
  req.end();
});

const headers = { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/126 Safari/537.36' };
const withRetries = async (operation, attempts = 4) => {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    }
  }
  throw lastError;
};
const getToken = () => withRetries(() => request({ hostname: 'edge.microsoft.com', path: '/translate/auth', method: 'GET', headers }));
let token = await getToken();

const protect = (text) => text
  .replaceAll('Kali', 'KALI_BRAND_TOKEN_9841')
  .replaceAll('Yixiu', 'YIXIU_BRAND_TOKEN_9841')
  .replaceAll('feedback@xyaip.fun', 'FEEDBACK_EMAIL_TOKEN_9841')
  .replaceAll('privacy@xyaip.fun', 'PRIVACY_EMAIL_TOKEN_9841');
const restore = (text) => text
  .replaceAll('KALI_BRAND_TOKEN_9841', 'Kali')
  .replaceAll('YIXIU_BRAND_TOKEN_9841', 'Yixiu')
  .replaceAll('FEEDBACK_EMAIL_TOKEN_9841', 'feedback@xyaip.fun')
  .replaceAll('PRIVACY_EMAIL_TOKEN_9841', 'privacy@xyaip.fun');

const existingCatalogs = (incremental || requestedLocale)
  ? JSON.parse(await fs.readFile(new URL('../src/site/site-translations.json', import.meta.url), 'utf8'))
  : {};
const sourceTexts = [...strings].filter((text) => !(incremental || requestedLocale) || Object.keys(activeTargets).some((locale) => !existingCatalogs[locale]?.[text] && !siteLocalizationOverrides[locale]?.[text]));
const protectedTexts = sourceTexts.map(protect);
const catalogs = Object.fromEntries(Object.keys(activeTargets).map((locale) => [locale, (incremental || requestedLocale) ? { ...(existingCatalogs[locale] || {}) } : {}]));
const targetEntries = Object.entries(activeTargets);
const groups = [];
for (let index = 0; index < targetEntries.length; index += 8) groups.push(targetEntries.slice(index, index + 8));
const batches = [];
for (let index = 0; index < protectedTexts.length; index += 40) batches.push({ protectedBatch: protectedTexts.slice(index, index + 40), sourceBatch: sourceTexts.slice(index, index + 40) });

const translateBatch = async (batch, group, retries = 3) => {
  const query = group.map(([, target]) => `to=${encodeURIComponent(target)}`).join('&');
  const body = JSON.stringify(batch.map((Text) => ({ Text })));
  try {
    const result = await request({
      hostname: 'api-edge.cognitive.microsofttranslator.com',
      path: `/translate?api-version=3.0&${query}`,
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8', 'Content-Length': Buffer.byteLength(body) },
    }, body);
    return JSON.parse(result);
  } catch (error) {
    if (retries <= 0) throw error;
    token = await getToken();
    const retryDelay = /429/.test(error.message) ? (4 - retries) * 8000 : 500;
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    return translateBatch(batch, group, retries - 1);
  }
};

let completed = 0;
for (const { protectedBatch, sourceBatch } of batches) {
  for (const group of groups) {
    const rows = await translateBatch(protectedBatch, group);
    rows.forEach((row, rowIndex) => row.translations.forEach((translation) => {
      const locale = group.find(([, target]) => target.toLowerCase() === translation.to.toLowerCase())?.[0];
      if (locale) catalogs[locale][sourceBatch[rowIndex]] = restore(translation.text);
    }));
    completed += 1;
    console.log(`Translated ${completed}/${batches.length * groups.length} site batches`);
  }
}

Object.entries(siteLocalizationOverrides).forEach(([locale, overrides]) => {
  if (catalogs[locale]) Object.assign(catalogs[locale], overrides);
});

const outputCatalogs = requestedLocale ? { ...existingCatalogs, ...catalogs } : catalogs;
await fs.writeFile(new URL('../src/site/site-translations.json', import.meta.url), `${JSON.stringify(outputCatalogs, null, 2)}\n`);
console.log(`Generated ${sourceTexts.length} public-site phrases for ${Object.keys(activeTargets).length} translated locale(s).`);
