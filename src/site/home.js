import { localize, supportedLocales } from './localization.js';

export const homeEn = {
    title: 'Kali AI — AI Content Production Workspace',
    description: 'Turn trends, scripts, digital humans, voices, music, images, and templates into publish-ready videos in one connected AI workspace.',
    eyebrow: 'AI CONTENT PRODUCTION WORKSPACE',
    headline: 'Turn content ideas into videos people can publish',
    lead: 'Kali AI connects discovery, writing, reusable AI assets, production, and publishing so global content teams can move from a trend or brief to a finished video without rebuilding the workflow every time.',
    proof: ['Trend-to-script workflow', 'Reusable digital humans and voices', 'Video, image, and music production', 'Publishing and task management'],
    sectionTitle: 'One production system, not a folder of disconnected tools',
    sectionLead: 'Each studio can work independently, but the real advantage comes from moving assets and decisions through one repeatable workflow.',
};

export const homeByLocale = Object.fromEntries(supportedLocales.map((locale) => [locale, localize(homeEn, locale)]));
