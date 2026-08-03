import { pagePath, pagesByLocale } from '../site/content.js';
import { indexableLocales } from '../site/seo.js';
import { DEFAULT_SITE_URL } from '../site/site-config.js';

export function GET({ site }) {
  const origin = site || new URL(DEFAULT_SITE_URL);
  const paths = indexableLocales.flatMap((locale) => [pagePath(locale), ...pagesByLocale[locale].map((page) => pagePath(locale, page.slug))]);
  const urls = paths.map((path) => `  <url><loc>${new URL(path, origin)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
