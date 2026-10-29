// Public entry routes contain no account records or task identifiers.
export const workspacePages = [
  { id: 'home', label: 'Home', kind: 'hero' },
  { id: 'trends', label: 'Hot Trends', kind: 'trend', chineseOnly: true },
  { id: 'assistant', label: 'AI Agents', kind: 'script' },
  { id: 'video', label: 'Avatar Talking Videos', kind: 'avatar' },
  { id: 'ai-video', label: 'Seedance', kind: 'video' },
  { id: 'music', label: 'AI Music', kind: 'music' },
  { id: 'image', label: 'AI Images', kind: 'hero' },
  { id: 'speech', label: 'Text to Speech', kind: 'voice' },
  { id: 'assets', label: 'Digital Human Assets', kind: 'avatar' },
  { id: 'materials', label: 'B-roll Library', kind: 'editing' },
  { id: 'publish', label: 'Publishing Center', kind: 'publishing' },
  { id: 'billing', label: 'Credits & orders', kind: 'hero' },
  { id: 'team', label: 'Team Center', kind: 'hero' },
  { id: 'presets', label: 'Packaging Presets', kind: 'editing' },
  { id: 'templates', label: 'Templates', kind: 'editing' },
  { id: 'publish-settings', label: 'Publish Settings', kind: 'publishing' },
  { id: 'settings', label: 'Settings', kind: 'hero' },
  { id: 'password-reset', label: 'Forgot password?', kind: 'hero' },
];
export const workspacePagesForLocale = (locale) => workspacePages.filter((page) => !page.chineseOnly || locale.startsWith('zh-'));
export function workspacePath(locale = 'en', page = 'home') {
  return `/app/${locale}/${page === 'home' ? '' : `${page}/`}`;
}
export function workspaceLocale(language) {
  const code = language.toLowerCase();
  return code.startsWith('zh-tw') ? 'zh-tw' : code.startsWith('zh') ? 'zh-cn' : code.split('-')[0];
}
export function readWorkspaceRoute(pathname) {
  const [root, locale, page = 'home'] = pathname.split('/').filter(Boolean);
  return root === 'app' && locale ? { locale, page: page || 'home' } : null;
}
export function initialWorkspacePage(location) {
  const page = new URLSearchParams(location.search).get('page') || readWorkspaceRoute(location.pathname)?.page || 'home';
  return workspacePages.some((entry) => entry.id === page) ? page : 'home';
}
export function syncWorkspaceLocation(location, page, locale) {
  const url = new URL(location.href);
  const supported = workspacePages.some((entry) => entry.id === page);
  url.pathname = workspacePath(locale, supported ? page : 'home');
  url.searchParams.delete('page');
  url.searchParams.delete('creator');
  return `${url.pathname}${url.search}${url.hash}`;
}
