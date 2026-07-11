import { useEffect } from 'react';

const localeModules = import.meta.glob('./locales/*.json', { import: 'default' });
const catalogCache = { 'en-US': {} };

export const languages = [
  { code: 'zh-CN', label: '简体中文 · zh-CN', dir: 'ltr' },
  { code: 'zh-TW', label: '繁體中文 · zh-TW', dir: 'ltr' },
  { code: 'en-US', label: 'English · en-US', dir: 'ltr' },
  { code: 'es-MX', label: 'Español · es-MX', dir: 'ltr' },
  { code: 'fr-FR', label: 'Français · fr-FR', dir: 'ltr' },
  { code: 'ru-RU', label: 'Русский · ru-RU', dir: 'ltr' },
  { code: 'de-DE', label: 'Deutsch · de-DE', dir: 'ltr' },
  { code: 'pt-PT', label: 'Português · pt-PT', dir: 'ltr' },
  { code: 'ar-AE', label: 'العربية · ar-AE', dir: 'rtl' },
  { code: 'it-IT', label: 'Italiano · it-IT', dir: 'ltr' },
  { code: 'ja-JP', label: '日本語 · ja-JP', dir: 'ltr' },
  { code: 'ko-KR', label: '한국어 · ko-KR', dir: 'ltr' },
  { code: 'id-ID', label: 'Bahasa Indonesia · id-ID', dir: 'ltr' },
  { code: 'vi-VN', label: 'Tiếng Việt · vi-VN', dir: 'ltr' },
  { code: 'tr-TR', label: 'Türkçe · tr-TR', dir: 'ltr' },
  { code: 'nl-NL', label: 'Nederlands · nl-NL', dir: 'ltr' },
  { code: 'uk-UA', label: 'Українська · uk-UA', dir: 'ltr' },
  { code: 'th-TH', label: 'ไทย · th-TH', dir: 'ltr' },
  { code: 'pl-PL', label: 'Polski · pl-PL', dir: 'ltr' },
  { code: 'ro-RO', label: 'Română · ro-RO', dir: 'ltr' },
  { code: 'el-GR', label: 'Ελληνικά · el-GR', dir: 'ltr' },
  { code: 'cs-CZ', label: 'Čeština · cs-CZ', dir: 'ltr' },
  { code: 'fi-FI', label: 'Suomi · fi-FI', dir: 'ltr' },
  { code: 'hi-IN', label: 'हिन्दी · hi-IN', dir: 'ltr' },
];

const LANGUAGE_STORAGE_KEY = 'kali_ui_locale';
const legacyLocaleAliases = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  de: 'de-DE',
  ru: 'ru-RU',
};
const supportedCodes = new Set(languages.map((language) => language.code));
const originalText = new WeakMap();
const lastAppliedText = new WeakMap();
const originalAttributes = new WeakMap();
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'];
const preservedPhrases = new Set([
  'Kali AI',
  'Yixiu Global',
  'Kali AI · Yixiu System',
  '© 2026 上海喀理科技有限公司',
  'TikTok',
  'YouTube',
  'BBC',
]);

const normalizeLocale = (value) => {
  if (!value) return '';
  const aliased = legacyLocaleAliases[value] || value;
  if (supportedCodes.has(aliased)) return aliased;
  const lower = String(aliased).toLowerCase();
  if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-hant')) return 'zh-TW';
  if (lower.startsWith('zh')) return 'zh-CN';
  return languages.find((language) => language.code.toLowerCase().startsWith(`${lower.split('-')[0]}-`))?.code || '';
};

export const getInitialLocale = () => {
  if (typeof window === 'undefined') return 'en-US';
  const stored = normalizeLocale(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  if (stored) return stored;
  return normalizeLocale(window.navigator.language) || 'en-US';
};

const translateValue = (value, locale, catalog) => {
  if (!value || locale === 'en-US') return value;
  if (!catalog) return value;
  const leading = value.match(/^\s*/)?.[0] || '';
  const trailing = value.match(/\s*$/)?.[0] || '';
  const source = value.trim();
  if (preservedPhrases.has(source) || source.includes('Kali AI') || /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(source)) return value;
  return source && catalog[source] ? `${leading}${catalog[source]}${trailing}` : value;
};

const isExcluded = (node) => {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return !element || Boolean(element.closest('[translate="no"], .notranslate, script, style, code, pre'));
};

const translateTextNode = (node, locale, catalog, externalMutation = false) => {
  if (isExcluded(node) || !node.nodeValue?.trim()) return;
  const lastApplied = lastAppliedText.get(node);
  if (externalMutation && node.nodeValue !== lastApplied) originalText.set(node, node.nodeValue);
  if (!originalText.has(node)) originalText.set(node, node.nodeValue);
  const translated = translateValue(originalText.get(node), locale, catalog);
  lastAppliedText.set(node, translated);
  if (node.nodeValue !== translated) node.nodeValue = translated;
};

const translateElementAttributes = (element, locale, catalog) => {
  if (isExcluded(element)) return;
  let originals = originalAttributes.get(element);
  if (!originals) {
    originals = {};
    originalAttributes.set(element, originals);
  }
  TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
    if (!element.hasAttribute(attribute)) return;
    const current = element.getAttribute(attribute) || '';
    if (!(attribute in originals)) originals[attribute] = current;
    const translated = translateValue(originals[attribute], locale, catalog);
    if (current !== translated) element.setAttribute(attribute, translated);
  });
};

const translateTree = (root, locale, catalog) => {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root, locale, catalog);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE || isExcluded(root)) return;
  translateElementAttributes(root, locale, catalog);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, locale, catalog);
    else translateElementAttributes(node, locale, catalog);
    node = walker.nextNode();
  }
};

export function useAutoTranslate(locale) {
  useEffect(() => {
    let cancelled = false;
    let observer;
    const language = languages.find((item) => item.code === locale) || languages.find((item) => item.code === 'en-US');
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
    const start = async () => {
      const modulePath = `./locales/${language.code}.json`;
      const catalog = catalogCache[language.code] || (localeModules[modulePath] ? await localeModules[modulePath]() : {});
      if (cancelled) return;
      catalogCache[language.code] = catalog;
      translateTree(document.body, language.code, catalog);

      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'characterData') {
            translateTextNode(mutation.target, language.code, catalog, true);
            return;
          }
          mutation.addedNodes.forEach((node) => translateTree(node, language.code, catalog));
        });
      });
      observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    };
    start();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [locale]);
}
