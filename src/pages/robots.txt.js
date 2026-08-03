import { DEFAULT_SITE_URL } from '../site/site-config.js';

export function GET({ site }) {
  const origin = site || new URL(DEFAULT_SITE_URL);
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    `Sitemap: ${new URL('/sitemap.xml', origin)}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
