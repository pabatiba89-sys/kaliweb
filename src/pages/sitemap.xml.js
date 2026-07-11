import { pagePath, pagesByLocale, supportedLocales } from '../site/content.js';

export function GET({ site }) {
  const origin = site || new URL('https://kali.xyaip.fun');
  const paths = supportedLocales.flatMap((locale) => [pagePath(locale), ...pagesByLocale[locale].map((page) => pagePath(locale, page.slug))]);
  const urls = paths.map((path) => `  <url><loc>${new URL(path, origin)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
