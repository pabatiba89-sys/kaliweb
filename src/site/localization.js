import catalogs from './site-translations.json' with { type: 'json' };

export const localeDefinitions = [
  ['en', 'en', 'en', 'English', 'ltr'],
  ['zh-cn', 'zh-CN', 'zh-CN', '简体中文', 'ltr'],
  ['zh-tw', 'zh-TW', 'zh-TW', '繁體中文', 'ltr'],
  ['zh-hk', 'zh-HK', 'zh-HK', '粵語', 'ltr'],
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

export function translateText(value, locale) {
  if (locale === 'en' || !value) return value;
  return catalogs[locale]?.[value] || value;
}

export function localize(value, locale) {
  if (Array.isArray(value)) return value.map((entry) => localize(entry, locale));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, localize(entry, locale)]));
  return typeof value === 'string' ? translateText(value, locale) : value;
}

const navigation = {
  home: 'Home',
  product: 'Product',
  pricing: 'Pricing',
  about: 'About',
  contact: 'Contact',
  workspace: 'Open workspace',
  menu: 'Menu',
  close: 'Close',
  learnMore: 'Learn more',
  cta: 'Start creating',
};

export const publicUiStrings = [
  ...Object.values(navigation),
  'Skip to content', 'Primary navigation', 'Content production workspace',
  'From trend discovery to publish-ready media.', 'Product', 'Company', 'Workspace',
  'AI video', 'Digital humans', 'Voice cloning', 'AI music', 'Product feedback',
  'Open Kali AI', 'Privacy requests', 'Kali AI · Yixiu System',
  'Open the workspace', 'See the production flow', 'Product capabilities',
  'Trend discovery', 'Script generation', 'Digital humans', 'Voice cloning', 'AI music', 'Video publishing',
  'CONNECTED STUDIOS', 'Explore', 'THE WORKFLOW', 'Keep context from the first signal to the final publish',
  'Find the angle', 'Start from a trend, topic, brief, or existing content idea.',
  'Shape the script', 'Use an assistant, refine the copy, and keep the selected context attached.',
  'Assemble production', 'Select approved people, voices, templates, music, covers, and supporting media.',
  'Review and publish', 'Track production status, download the result, or continue into publishing.',
  'READY WHEN YOUR NEXT IDEA IS', 'Build the workflow once. Reuse it for every market.', 'Start creating in Kali AI',
  'WHAT YOU CAN DO', 'Talk to the team', 'HOW IT FITS TOGETHER', 'A clear path from setup to repeatable output',
  'COMMON QUESTIONS', 'Answers before you start', 'KALI AI WORKSPACE',
  'Take the next project from brief to finished media.', 'Start creating',
  'Production overview', 'Ready', 'CONTENT PIPELINE', 'Turn today’s idea into a finished video', 'New video',
  'Discover', 'Trend selected', 'Write', 'Script ready', 'Produce', 'Assets linked', 'Digital human', 'Approved asset', 'Voice ready',
];

export const localeMeta = Object.fromEntries(localeDefinitions.map((definition) => [definition.route, {
  ...definition,
  prefix: `/${definition.route}`,
  ...localize(navigation, definition.route),
}]));
