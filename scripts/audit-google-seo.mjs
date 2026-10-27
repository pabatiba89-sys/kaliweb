const explicitOrigin = process.env.SEO_AUDIT_ORIGIN;
const origin = new URL(explicitOrigin || 'https://www.kaliai.fun').origin;
const errors = [];
const warnings = [];

function textMatch(source, pattern) {
  return source.match(pattern)?.[1]?.trim() || '';
}

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'KaliGoogleSeoAudit/1.0 (+https://www.kaliai.fun/en/)' },
    redirect: 'follow',
  });
  return { response, body: await response.text() };
}

const robotsUrl = new URL('/robots.txt', origin);
const { response: robotsResponse, body: robots } = await fetchText(robotsUrl);
if (!robotsResponse.ok) errors.push(`${robotsUrl} returned ${robotsResponse.status}`);
if (!/User-agent:\s*\*/i.test(robots)) errors.push('robots.txt does not define the default crawler group');
const defaultCrawlerGroups = [...robots.matchAll(/User-agent:\s*\*\s*\n([\s\S]*?)(?=\nUser-agent:|$)/gi)]
  .map((entry) => entry[1]);
if (defaultCrawlerGroups.some((group) => /^Disallow:\s*\/\s*$/im.test(group))) {
  errors.push('robots.txt blocks the whole site');
}

const sitemapDeclaration = textMatch(robots, /^Sitemap:\s*(\S+)/im);
const sitemapUrl = explicitOrigin ? new URL('/sitemap.xml', origin).href : (sitemapDeclaration || new URL('/sitemap.xml', origin).href);
if (!sitemapDeclaration) warnings.push('robots.txt does not declare a sitemap URL');

const { response: sitemapResponse, body: sitemap } = await fetchText(sitemapUrl);
if (!sitemapResponse.ok) errors.push(`${sitemapUrl} returned ${sitemapResponse.status}`);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((entry) => decodeEntities(entry[1]));
if (urls.length === 0) errors.push('sitemap.xml contains no URLs');
if (new Set(urls).size !== urls.length) errors.push('sitemap.xml contains duplicate URLs');

const titles = new Map();
const descriptions = new Map();
const discoveredInternalPaths = new Set();
const batchSize = 6;

for (let offset = 0; offset < urls.length; offset += batchSize) {
  const batch = urls.slice(offset, offset + batchSize);
  const results = await Promise.all(batch.map(async (url) => {
    try {
      const fetchUrl = explicitOrigin ? new URL(new URL(url).pathname, origin).href : url;
      return { url, fetchUrl, ...(await fetchText(fetchUrl)) };
    } catch (error) {
      return { url, error };
    }
  }));

  for (const result of results) {
    if (result.error) {
      errors.push(`${result.url} could not be fetched: ${result.error.message}`);
      continue;
    }
    const { url, fetchUrl, response, body } = result;
    if (!response.ok) errors.push(`${url} returned ${response.status}`);

    const title = decodeEntities(textMatch(body, /<title>([^<]+)<\/title>/i));
    const description = decodeEntities(textMatch(body, /<meta name="description" content="([^"]*)"/i));
    const robotsMeta = textMatch(body, /<meta name="robots" content="([^"]*)"/i);
    const canonical = decodeEntities(textMatch(body, /<link rel="canonical" href="([^"]+)"/i));
    const h1Count = (body.match(/<h1(?:\s|>)/gi) || []).length;
    const hasJsonLd = /<script[^>]+type="application\/ld\+json"/i.test(body);
    const hasBreadcrumb = /"@type":"BreadcrumbList"/.test(body);

    if (!title) errors.push(`${url} has no title`);
    if (!description) errors.push(`${url} has no meta description`);
    if (!robotsMeta.includes('index') || robotsMeta.includes('noindex')) errors.push(`${url} is not indexable`);
    if (canonical !== url) errors.push(`${url} has mismatched canonical ${canonical || '(missing)'}`);
    if (h1Count !== 1) errors.push(`${url} has ${h1Count} H1 elements`);
    if (!hasJsonLd) errors.push(`${url} has no JSON-LD`);
    if (new URL(url).pathname !== '/en/' && !hasBreadcrumb) errors.push(`${url} has no BreadcrumbList schema`);

    if (title) titles.set(title, [...(titles.get(title) || []), url]);
    if (description) descriptions.set(description, [...(descriptions.get(description) || []), url]);

    for (const match of body.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
      try {
        const linked = new URL(decodeEntities(match[1]), fetchUrl);
        if (linked.origin === origin) discoveredInternalPaths.add(linked.pathname);
      } catch {
        warnings.push(`${url} contains an invalid link: ${match[1]}`);
      }
    }
  }
}

for (const [title, titleUrls] of titles) {
  if (titleUrls.length > 1) errors.push(`duplicate title "${title}" on ${titleUrls.join(', ')}`);
}
for (const [description, descriptionUrls] of descriptions) {
  if (descriptionUrls.length > 1) errors.push(`duplicate description "${description}" on ${descriptionUrls.join(', ')}`);
}
for (const url of urls) {
  if (new URL(url).pathname !== '/en/' && !discoveredInternalPaths.has(new URL(url).pathname)) {
    errors.push(`${url} has no internal link from another sitemap page`);
  }
}

if (warnings.length > 0) console.warn(`SEO audit warnings:\n- ${warnings.join('\n- ')}`);
if (errors.length > 0) {
  console.error(`SEO audit failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Google SEO audit passed for ${urls.length} indexable URLs at ${origin}.`);
