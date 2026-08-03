import { supportedLocales } from './localization.js';

const configuredLocales = process.env.SEO_INDEXABLE_LOCALES || 'en';

export const indexableLocales = [...new Set(
  configuredLocales
    .split(',')
    .map((locale) => locale.trim().toLowerCase())
    .filter(Boolean),
)];

if (indexableLocales.length === 0) {
  throw new Error('SEO_INDEXABLE_LOCALES must contain at least one locale.');
}

const invalidLocales = indexableLocales.filter((locale) => !supportedLocales.includes(locale));
if (invalidLocales.length > 0) {
  throw new Error(`Unsupported SEO locale(s): ${invalidLocales.join(', ')}`);
}

export const defaultSeoLocale = indexableLocales.includes('en') ? 'en' : indexableLocales[0];

export function isIndexableLocale(locale) {
  return indexableLocales.includes(locale);
}
