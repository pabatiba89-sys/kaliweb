const modifiedDates = {
  en: {
    '': '2026-10-27',
    'ai-script-writer': '2026-10-27',
    'ai-video-generator': '2026-10-27',
    'digital-human': '2026-10-27',
    'smart-video-editing': '2026-10-27',
    'social-video-publishing': '2026-10-27',
    'voice-cloning': '2026-10-27',
    'ai-music-generator': '2026-10-27',
    developers: '2026-10-27',
    'personal-brand-video-generator': '2026-10-27',
    'product-marketing-video-maker': '2026-10-27',
    'ai-training-video-generator': '2026-10-27',
  },
};

export function getContentModifiedDate(locale, slug = '') {
  if (['docs', 'docs/getting-started'].includes(slug)) return '2026-11-03';
  if (slug === 'developers') return '2026-11-02';
  if (['docs/mcp', 'docs/skills'].includes(slug)) return '2026-11-02';
  if (['en', 'zh-cn', 'zh-tw'].includes(locale) && slug === 'docs/monetization') return '2026-11-02';
  if (['en', 'zh-cn', 'zh-tw'].includes(locale) && slug === 'docs/personal-branding') return '2026-11-01';
  if (slug.startsWith('docs/')) return '2026-10-30';
  return modifiedDates[locale]?.[slug] || '';
}
