import { localize, supportedLocales } from './localization.js';

export const homeEn = {
    title: 'Kali — AI Content Production Workspace',
    description: 'Turn trends, scripts, digital humans, voices, music, images, and templates into publish-ready videos in one connected AI workspace.',
    eyebrow: 'AI CONTENT PRODUCTION WORKSPACE',
    headline: 'Create publish-ready videos from any content idea',
    lead: 'Bring trend discovery, writing, reusable AI assets, production, and publishing into one seamless workflow. From first brief to final video, your team keeps moving without rebuilding the process.',
    proof: ['Trend-to-script workflow', 'Reusable digital humans and voices', 'Video, image, and music production', 'Publishing and task management'],
    sectionTitle: 'One connected production system for your entire content workflow',
    sectionLead: 'Use each studio on its own, or move assets and decisions through one consistent workflow from idea to publish.',
};

export const homeByLocale = Object.fromEntries(supportedLocales.map((locale) => [locale, localize(homeEn, locale)]));
