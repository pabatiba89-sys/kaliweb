import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const failures = [];
const workspaceI18n = read('src/i18n.js');
const publicI18n = read('src/site/localization.js');
const workspaceGenerator = read('scripts/generate-translations.mjs');
const publicGenerator = read('scripts/generate-site-translations.mjs');
const main = read('src/main.jsx');
const siteCatalogs = JSON.parse(read('src/site/site-translations.json'));

if (/code:\s*['"]zh-CN-yue['"]/.test(workspaceI18n)) failures.push('Workspace language menu must not include zh-CN-yue.');
if (/\[\s*['"]zh-hk['"]/.test(publicI18n)) failures.push('Public locale routes must not include zh-hk.');
if (/['"]zh-CN-yue['"]\s*:\s*['"]yue['"]/.test(workspaceGenerator)) failures.push('Workspace translation targets must not generate Cantonese UI.');
if (/['"]zh-hk['"]\s*:\s*['"]yue['"]/.test(publicGenerator)) failures.push('Public translation targets must not generate Cantonese UI.');
if (fs.existsSync(new URL('../src/locales/zh-CN-yue.json', import.meta.url))) failures.push('Cantonese workspace locale catalog must not exist.');
if (siteCatalogs['zh-hk']) failures.push('Cantonese public-site catalog must not exist.');
if (!main.includes("{ value: 'zh-CN-yue', label: '中文（粤语）' }")) failures.push('Voice cloning must retain the Cantonese training option.');

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Locale boundary check passed: Cantonese is voice-cloning only.');
