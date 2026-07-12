import fs from 'node:fs/promises';

const replacements = [
  ['Kali AI', 'Kali'],
  ['KALI AI', 'KALI'],
  ['Yixiu Global', 'Yixiu'],
  ['Yixiu System', 'Yixiu'],
  ['YIXIU SYSTEM', 'YIXIU'],
  ['亿秀系统', 'Yixiu'],
  ['億秀系統', 'Yixiu'],
  ['亿秀', 'Yixiu'],
  ['藝秀', 'Yixiu'],
  ['艺秀', 'Yixiu'],
  ['same yixiu trial package', 'same Yixiu trial package'],
];

const transformText = (value) => replacements.reduce((current, [from, to]) => current.replaceAll(from, to), String(value));
const transformCatalog = (catalog) => Object.fromEntries(
  Object.entries(catalog)
    .filter(([key]) => key !== 'Digital Human Training')
    .map(([key, value]) => [transformText(key), transformText(value)]),
);

const localeDirectory = new URL('../src/locales/', import.meta.url);
const localeFiles = (await fs.readdir(localeDirectory)).filter((file) => file.endsWith('.json'));
await Promise.all(localeFiles.map(async (file) => {
  const url = new URL(file, localeDirectory);
  const catalog = JSON.parse(await fs.readFile(url, 'utf8'));
  const transformed = transformCatalog(catalog);
  transformed['Kali · Yixiu'] = 'Kali · Yixiu';
  await fs.writeFile(url, `${JSON.stringify(transformed, null, 2)}\n`);
}));

const publicCatalogUrl = new URL('../src/site/site-translations.json', import.meta.url);
const publicCatalog = JSON.parse(await fs.readFile(publicCatalogUrl, 'utf8'));
const transformedPublicCatalog = Object.fromEntries(Object.entries(publicCatalog).map(([locale, catalog]) => [locale, transformCatalog(catalog)]));
await fs.writeFile(publicCatalogUrl, `${JSON.stringify(transformedPublicCatalog, null, 2)}\n`);

console.log(`Migrated brand names in ${localeFiles.length} workspace catalogs and the public-site catalog.`);
