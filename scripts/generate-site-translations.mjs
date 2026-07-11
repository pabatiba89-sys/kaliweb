import fs from 'node:fs/promises';
import https from 'node:https';
import { basePages } from '../src/site/content.js';
import { homeEn } from '../src/site/home.js';
import { publicUiStrings } from '../src/site/localization.js';

const targets = {
  'zh-cn': 'zh-Hans', 'zh-tw': 'zh-Hant', 'zh-hk': 'yue', es: 'es', fr: 'fr', ru: 'ru', de: 'de',
  pt: 'pt-pt', ar: 'ar', it: 'it', ja: 'ja', ko: 'ko', id: 'id', vi: 'vi', tr: 'tr', nl: 'nl',
  uk: 'uk', th: 'th', pl: 'pl', ro: 'ro', el: 'el', cs: 'cs', fi: 'fi', hi: 'hi',
};

const strings = new Set(publicUiStrings);
const collect = (value) => {
  if (Array.isArray(value)) return value.forEach(collect);
  if (value && typeof value === 'object') return Object.entries(value).forEach(([key, entry]) => {
    if (key !== 'slug') collect(entry);
  });
  if (typeof value === 'string' && value.trim()) strings.add(value.trim());
};
collect(basePages);
collect(homeEn);

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
const getToken = () => request({ hostname: 'edge.microsoft.com', path: '/translate/auth', method: 'GET', headers });
let token = await getToken();

const protect = (text) => text
  .replaceAll('Kali AI', 'KALI_BRAND_TOKEN_9841')
  .replaceAll('Yixiu', 'YIXIU_BRAND_TOKEN_9841')
  .replaceAll('feedback@xyaip.fun', 'FEEDBACK_EMAIL_TOKEN_9841')
  .replaceAll('privacy@xyaip.fun', 'PRIVACY_EMAIL_TOKEN_9841');
const restore = (text) => text
  .replaceAll('KALI_BRAND_TOKEN_9841', 'Kali AI')
  .replaceAll('YIXIU_BRAND_TOKEN_9841', 'Yixiu')
  .replaceAll('FEEDBACK_EMAIL_TOKEN_9841', 'feedback@xyaip.fun')
  .replaceAll('PRIVACY_EMAIL_TOKEN_9841', 'privacy@xyaip.fun');

const sourceTexts = [...strings];
const protectedTexts = sourceTexts.map(protect);
const catalogs = Object.fromEntries(Object.keys(targets).map((locale) => [locale, {}]));
const targetEntries = Object.entries(targets);
const groups = [];
for (let index = 0; index < targetEntries.length; index += 8) groups.push(targetEntries.slice(index, index + 8));
const batches = [];
for (let index = 0; index < protectedTexts.length; index += 80) batches.push({ protectedBatch: protectedTexts.slice(index, index + 80), sourceBatch: sourceTexts.slice(index, index + 80) });

const translateBatch = async (batch, group, retry = true) => {
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
    if (!retry) throw error;
    token = await getToken();
    return translateBatch(batch, group, false);
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

await fs.writeFile(new URL('../src/site/site-translations.json', import.meta.url), `${JSON.stringify(catalogs, null, 2)}\n`);
console.log(`Generated ${sourceTexts.length} public-site phrases for ${Object.keys(targets).length + 1} locales.`);
