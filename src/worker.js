const API_ORIGIN = 'https://yixiuapi.xyaip.fun';
const LOCALE_COOKIE = 'kali_site_locale';
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = new Set([
  'en', 'zh-cn', 'zh-tw', 'es', 'fr', 'ru', 'de', 'pt', 'ar', 'it', 'ja', 'ko',
  'id', 'vi', 'tr', 'nl', 'uk', 'th', 'pl', 'ro', 'el', 'cs', 'fi', 'hi',
]);

const localeCountries = {
  'zh-cn': ['CN'],
  'zh-tw': ['TW', 'HK', 'MO'],
  es: ['ES', 'MX', 'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'GT', 'HN', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE'],
  fr: ['FR', 'MC', 'SN', 'CI', 'CM', 'CD', 'CG', 'ML', 'NE', 'BF', 'GA', 'TG', 'BJ'],
  ru: ['RU', 'BY', 'KZ', 'KG'],
  de: ['DE', 'AT', 'CH', 'LI'],
  pt: ['PT', 'BR', 'AO', 'MZ'],
  ar: ['AE', 'SA', 'EG', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'IQ', 'MA', 'DZ', 'TN'],
  it: ['IT', 'SM', 'VA'],
  ja: ['JP'],
  ko: ['KR'],
  id: ['ID'],
  vi: ['VN'],
  tr: ['TR'],
  nl: ['NL'],
  uk: ['UA'],
  th: ['TH'],
  pl: ['PL'],
  ro: ['RO', 'MD'],
  el: ['GR', 'CY'],
  cs: ['CZ'],
  fi: ['FI'],
  hi: ['IN'],
};

const countryLocale = new Map(
  Object.entries(localeCountries).flatMap(([locale, countries]) =>
    countries.map((country) => [country, locale])),
);

const readCookie = (request, name) => {
  const cookieHeader = request.headers.get('cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const [key, ...valueParts] = part.trim().split('=');
    if (key === name) return decodeURIComponent(valueParts.join('='));
  }
  return '';
};

const localeFromAcceptLanguage = (header) => {
  const preferred = String(header || '').split(',')[0].trim().toLowerCase();
  if (preferred.startsWith('zh-tw') || preferred.startsWith('zh-hant') || preferred.startsWith('zh-hk')) return 'zh-tw';
  if (preferred.startsWith('zh')) return 'zh-cn';

  const language = preferred.split('-')[0];
  return SUPPORTED_LOCALES.has(language) ? language : DEFAULT_LOCALE;
};

const defaultLocaleForRequest = (request) => {
  const savedLocale = readCookie(request, LOCALE_COOKIE);
  if (SUPPORTED_LOCALES.has(savedLocale)) return savedLocale;

  const country = String(request.cf?.country || request.headers.get('cf-ipcountry') || '').toUpperCase();
  return countryLocale.get(country) || localeFromAcceptLanguage(request.headers.get('accept-language'));
};

const isApiRequest = (pathname) =>
  pathname === '/api' ||
  pathname.startsWith('/api/') ||
  pathname === '/login' ||
  pathname.startsWith('/login/');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' && (request.method === 'GET' || request.method === 'HEAD')) {
      const locale = defaultLocaleForRequest(request);
      return Response.redirect(new URL(`/${locale}/${url.search}`, url), 302);
    }

    if (!isApiRequest(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const upstreamUrl = new URL(`${url.pathname}${url.search}`, API_ORIGIN);
    const upstreamRequest = new Request(upstreamUrl, request);

    return fetch(upstreamRequest);
  },
};
