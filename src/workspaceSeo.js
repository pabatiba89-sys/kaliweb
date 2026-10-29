// Refresh the public document when the existing SPA changes section or language.
// This leaves the React tree and unsaved creation forms mounted.
export async function refreshWorkspaceDocument(pathname, signal) {
  const canonical = new URL(pathname, window.location.origin);
  if (document.querySelector('link[rel="canonical"]')?.getAttribute('href') === canonical.href) return;
  const response = await fetch(pathname, { signal });
  if (!response.ok) return;
  const next = new DOMParser().parseFromString(await response.text(), 'text/html');
  const nextCanonical = next.querySelector('link[rel="canonical"]');
  if (!nextCanonical || new URL(nextCanonical.href).pathname !== pathname || signal.aborted) return;
  document.title = next.title;
  for (const selector of [
    'meta[name="description"]', 'meta[name="robots"]', 'meta[property^="og:"]',
    'link[rel="canonical"]', 'link[rel="alternate"]', 'script[type="application/ld+json"]',
  ]) {
    document.head.querySelectorAll(selector).forEach((element) => element.remove());
    next.head.querySelectorAll(selector).forEach((element) => document.head.append(document.importNode(element, true)));
  }
  const guide = next.querySelector('.workspace-guide');
  if (guide) document.querySelector('.workspace-guide')?.replaceWith(document.importNode(guide, true));
}
