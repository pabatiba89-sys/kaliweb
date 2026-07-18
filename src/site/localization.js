import catalogs from './site-translations.json' with { type: 'json' };

export const localeDefinitions = [
  ['en', 'en', 'en', 'English', 'ltr'],
  ['zh-cn', 'zh-CN', 'zh-CN', '简体中文', 'ltr'],
  ['zh-tw', 'zh-TW', 'zh-TW', '繁體中文', 'ltr'],
  ['es', 'es', 'es-MX', 'Español', 'ltr'],
  ['fr', 'fr', 'fr-FR', 'Français', 'ltr'],
  ['ru', 'ru', 'ru-RU', 'Русский', 'ltr'],
  ['de', 'de', 'de-DE', 'Deutsch', 'ltr'],
  ['pt', 'pt-PT', 'pt-PT', 'Português', 'ltr'],
  ['ar', 'ar', 'ar-AE', 'العربية', 'rtl'],
  ['it', 'it', 'it-IT', 'Italiano', 'ltr'],
  ['ja', 'ja', 'ja-JP', '日本語', 'ltr'],
  ['ko', 'ko', 'ko-KR', '한국어', 'ltr'],
  ['id', 'id', 'id-ID', 'Bahasa Indonesia', 'ltr'],
  ['vi', 'vi', 'vi-VN', 'Tiếng Việt', 'ltr'],
  ['tr', 'tr', 'tr-TR', 'Türkçe', 'ltr'],
  ['nl', 'nl', 'nl-NL', 'Nederlands', 'ltr'],
  ['uk', 'uk', 'uk-UA', 'Українська', 'ltr'],
  ['th', 'th', 'th-TH', 'ไทย', 'ltr'],
  ['pl', 'pl', 'pl-PL', 'Polski', 'ltr'],
  ['ro', 'ro', 'ro-RO', 'Română', 'ltr'],
  ['el', 'el', 'el-GR', 'Ελληνικά', 'ltr'],
  ['cs', 'cs', 'cs-CZ', 'Čeština', 'ltr'],
  ['fi', 'fi', 'fi-FI', 'Suomi', 'ltr'],
  ['hi', 'hi', 'hi-IN', 'हिन्दी', 'ltr'],
].map(([route, hreflang, appLocale, label, dir]) => ({ route, hreflang, appLocale, label, dir }));

export const supportedLocales = localeDefinitions.map((locale) => locale.route);

const isChineseLocale = (locale) => String(locale || '').startsWith('zh-');
export const brandName = (locale) => isChineseLocale(locale) ? '喀理' : 'Kali';
export const productName = (locale) => isChineseLocale(locale) ? '亿秀' : 'Yixiu';
const yixiuVariants = ['一秀', '一修', '奕秀', '伊秀', 'Исиу', 'Исю', 'Ісю', 'Їсіу', 'ييشيو', 'يي شيو', '이쉬우', '이시우', 'यिक्सिउ'];
const normalizeProductName = (value) => yixiuVariants.reduce((current, variant) => current.replaceAll(variant, 'Yixiu'), String(value));
const applyProductNames = (value, locale) => {
  const normalized = normalizeProductName(value);
  return isChineseLocale(locale) ? normalized.replaceAll('Kali', '喀理').replaceAll('Yixiu', '亿秀') : normalized;
};

export function translateText(value, locale) {
  if (!value) return value;
  if (value === 'Kali · Yixiu') return `${brandName(locale)} · ${productName(locale)}`;
  const translated = locale === 'en' ? value : (catalogs[locale]?.[value] || value);
  return applyProductNames(translated, locale);
}

const rawContentKeys = new Set(['slug', 'contentType', 'links', 'related', 'image']);

export function localize(value, locale, key = '') {
  if (rawContentKeys.has(key)) return value;
  if (Array.isArray(value)) return value.map((entry) => localize(entry, locale));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([entryKey, entry]) => [entryKey, localize(entry, locale, entryKey)]));
  return typeof value === 'string' ? translateText(value, locale) : value;
}

const navigation = {
  home: 'Home',
  product: 'Product',
  pricing: 'Pricing',
  help: 'Help',
  about: 'About',
  contact: 'Contact',
  workspace: 'Open the workspace',
  menu: 'Menu',
  close: 'Close',
  learnMore: 'Learn more',
  cta: 'Create with Kali',
};

export const publicUiStrings = [
  ...Object.values(navigation),
  'Skip to content', 'Primary navigation', 'Content production workspace',
  'From trend discovery to publish-ready media.', 'Product', 'Company', 'Workspace',
  'AI video', 'Digital humans', 'Voice cloning', 'AI music', 'Product feedback',
  'Open Kali', 'Help center', 'Privacy requests', 'Kali · Yixiu',
  'Payment policy', 'Refund policy',
  'Open the workspace', 'See the production flow', 'Product capabilities',
  'Trend discovery', 'Script generation', 'Digital humans', 'Voice cloning', 'AI music', 'Video publishing',
  'CONNECTED STUDIOS', 'Explore', 'THE WORKFLOW', 'Keep every decision connected from first insight to final publish',
  'Find the angle', 'Start from a trend, topic, brief, or existing content idea.',
  'Shape the script', 'Use an assistant, refine the copy, and keep the selected context attached.',
  'Assemble production', 'Select approved people, voices, templates, music, covers, and supporting media.',
  'Review and publish', 'Track production status, download the result, or continue into publishing.',
  'READY FOR YOUR NEXT IDEA', 'Build once. Create for every market.', 'Create with Kali',
  'WHAT YOU CAN DO', 'Talk to the team', 'HOW IT FITS TOGETHER', 'A clear path from setup to repeatable output',
  'COMMON QUESTIONS', 'Answers before you start', 'KALI WORKSPACE',
  'Bring your next idea to life.', 'Create with Kali',
  'Production overview', 'Ready', 'CONTENT PIPELINE', 'Turn today’s idea into a finished video', 'New video',
  'Discover', 'Trend selected', 'Write', 'Script ready', 'Produce', 'Assets linked', 'Digital human', 'Approved asset', 'Voice ready',
  'START HERE', 'Guides grouped by the production path', 'BATCH PLAN', 'Build the help center in useful layers',
  'STEP BY STEP', 'Follow the workflow in order', 'CHECK BEFORE YOU SUBMIT', 'IF SOMETHING GOES WRONG',
  'RELATED GUIDES', 'Continue with the next useful article',
];

export const localeMeta = Object.fromEntries(localeDefinitions.map((definition) => [definition.route, {
  ...definition,
  prefix: `/${definition.route}`,
  ...localize(navigation, definition.route),
}]));
