import { supportedLocales } from './localization.js';
import { getContentRevision } from './content-revisions.js';

const configuredLocales = process.env.SEO_INDEXABLE_LOCALES || 'en';

export const indexableLocales = [...new Set(
  configuredLocales
    .split(',')
    .map((locale) => locale.trim().toLowerCase())
    .filter(Boolean),
)];

if (indexableLocales.length === 0) {
  throw new Error('SEO_INDEXABLE_LOCALES must contain at least one locale.');
}

const invalidLocales = indexableLocales.filter((locale) => !supportedLocales.includes(locale));
if (invalidLocales.length > 0) {
  throw new Error(`Unsupported SEO locale(s): ${invalidLocales.join(', ')}`);
}

export const defaultSeoLocale = indexableLocales.includes('en') ? 'en' : indexableLocales[0];

const englishSeoBySlug = {
  'personal-brand-video-generator': {
    title: 'Personal Brand Video Generator with AI Avatars',
    description: 'Turn expert ideas and scripts into repeatable personal-brand videos with an authorized AI avatar, reusable voice, supporting media, and review workflow.',
    keywords: ['personal brand video generator', 'AI avatar for personal brand', 'personal branding video maker', 'expert video generator', 'AI presenter video'],
  },
  'product-marketing-video-maker': {
    title: 'AI Product Marketing Video Maker for Small Teams',
    description: 'Create product explainers, feature launches, and campaign videos from scripts, screenshots, product clips, authorized presenters, and reusable brand assets.',
    keywords: ['product marketing video maker', 'AI product video generator', 'product explainer video maker', 'feature launch video', 'AI marketing video generator'],
  },
  'ai-training-video-generator': {
    title: 'AI Training Video Generator with Reusable Presenters',
    description: 'Create repeatable training, onboarding, and instructional videos from reviewed scripts with authorized AI presenters, voices, screenshots, and supporting media.',
    keywords: ['AI training video generator', 'employee training video maker', 'onboarding video generator', 'instructional video maker', 'AI presenter training video'],
  },
  'ai-script-writer': { keywords: ['AI script writer', 'social media script generator', 'video script writer', 'content ideas'] },
  'smart-video-editing': { keywords: ['AI video editing', 'smart video editing', 'social media video editing'] },
  'social-video-publishing': { keywords: ['social media video publishing', 'multi platform publishing', 'schedule social media videos'] },
  developers: { keywords: ['Kali MCP', 'AI content API', 'AI video integration'] },
  '': {
    title: 'AI Video Generator & Content Production Workspace | Kali',
    description: 'Create AI avatar and social media videos from trends or scripts with reusable digital humans, voice cloning, music, templates, and publishing workflows.',
    keywords: ['AI video generator', 'AI content creation platform', 'social media video generator', 'script to video AI', 'text to video AI', 'AI avatar video generator', 'digital human video', 'AI voice cloning', 'AI music generator'],
  },
  'ai-video-generator': {
    title: 'AI Video Generator for Avatar & Social Media Videos',
    description: 'Turn topics and scripts into publish-ready AI avatar and social media videos with reusable voices, templates, music, covers, and brand assets.',
    keywords: ['AI video generator', 'text to video AI', 'script to video AI', 'AI avatar video generator', 'talking avatar video', 'social media video generator', 'TikTok video generator', 'short-form video generator', 'faceless video generator'],
  },
  'digital-human': {
    title: 'AI Avatar Generator for Talking-Head Videos',
    description: 'Create reusable AI avatars and digital humans from authorized image or video material, then produce multilingual talking-head and presenter videos.',
    keywords: ['AI avatar generator', 'digital human generator', 'talking avatar generator', 'talking head video generator', 'AI spokesperson', 'AI presenter', 'custom AI avatar', 'digital twin video'],
  },
  'voice-cloning': {
    title: 'AI Voice Cloning & Text to Speech for Video',
    description: 'Train an authorized voice clone from an audio sample, generate multilingual text-to-speech voiceovers, and reuse the voice in AI avatar videos.',
    keywords: ['AI voice cloning', 'voice clone generator', 'text to speech', 'AI text to speech', 'custom AI voice', 'multilingual voiceover', 'voice cloning for video', 'cloned voice text to speech'],
  },
  'ai-music-generator': {
    title: 'AI Music Generator for Songs & Video Soundtracks',
    description: 'Create songs, instrumental music, and video soundtracks from text or lyrics, then preview, download, retry, or continue into music-video production.',
    keywords: ['AI music generator', 'text to music AI', 'AI song generator', 'lyrics to song generator', 'instrumental music generator', 'AI soundtrack generator', 'background music generator', 'music for videos'],
  },
  pricing: {
    title: 'AI Video Generator Pricing & Credits',
    description: 'Compare Kali credits and usage for AI avatar videos, voice cloning, music generation, images, and team content-production workflows.',
    keywords: ['AI video generator pricing', 'AI avatar video pricing', 'AI video credits', 'content production plans', 'voice cloning pricing', 'AI music generator pricing'],
  },
  help: {
    title: 'AI Video Creation Guides',
    description: 'Learn how to create AI avatar videos from trends or scripts, choose a production mode, recover failed tasks, and continue saved video drafts.',
    keywords: ['AI video creation guide', 'how to make AI avatar videos', 'script to video guide', 'digital human video tutorial', 'AI video workflow'],
  },
  'help-trend-to-video': {
    title: 'Turn a Trend into an AI Avatar Video',
    description: 'Follow a practical workflow to select a trend, generate a script, choose an AI avatar and voice, and produce a publish-ready social video.',
    keywords: ['turn trends into videos', 'AI social media video workflow', 'trend to video AI', 'AI avatar video tutorial', 'social video generator'],
  },
  'help-script-to-video': {
    title: 'Turn a Script into an AI Video',
    description: 'Prepare a script, choose the right AI video mode, attach avatars or media, save a draft, and submit a complete video-production task.',
    keywords: ['script to video AI', 'text to video tutorial', 'make video from script', 'AI avatar video from script', 'AI video workflow'],
  },
  'help-video-modes': {
    title: 'Choose the Right AI Video Production Mode',
    description: 'Compare AI avatar, mixed-media, talking-head Pro, and material-video modes by script structure, presenter, and media requirements.',
    keywords: ['AI video production modes', 'AI avatar vs faceless video', 'talking head video workflow', 'mixed media video generator', 'AI video mode comparison'],
  },
  'help-failed-video': {
    title: 'Fix a Failed AI Video Generation Task',
    description: 'Diagnose a failed AI video task, check scripts and media, preserve completed uploads, and retry production without losing your setup.',
    keywords: ['AI video generation failed', 'fix AI video generation', 'AI video troubleshooting', 'retry video generation', 'video generation error'],
  },
  'help-drafts': {
    title: 'Save and Continue AI Video Drafts',
    description: 'Save unfinished AI video projects, restore scripts and scene media, review the production mode, and continue a draft when it is ready.',
    keywords: ['AI video drafts', 'save AI video project', 'continue video draft', 'AI video project workflow', 'reuse AI video setup'],
  },
};

export function isIndexableLocale(locale) {
  return indexableLocales.includes(locale);
}

export function getSeoMetadata(locale, slug = '', fallback = {}) {
  const researched = locale === 'en' ? englishSeoBySlug[slug] : null;
  const revision = getContentRevision(locale, slug);
  return {
    title: revision?.title || researched?.title || fallback.title || '',
    description: revision?.description || researched?.description || fallback.description || '',
    keywords: researched?.keywords || [],
  };
}
