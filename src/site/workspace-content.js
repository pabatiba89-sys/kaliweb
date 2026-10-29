import { brandCopy } from './brand-copy.js';
import { brandName, localeDefinitions, translateText } from './localization.js';
import { workspacePagesForLocale, workspacePath } from '../workspaceRoutes.js';
const catalogs = import.meta.glob('../locales/*.json', { eager: true, import: 'default' });
export function getWorkspaceContent(locale, page = 'home') {
  const definition = localeDefinitions.find((entry) => entry.route === locale);
  const appLocale = locale === 'en' ? 'en-US' : definition.appLocale;
  const catalog = catalogs[`../locales/${appLocale}.json`] || {};
  const t = (source) => source === 'Packaging Presets'
    ? `${catalog.Templates || translateText('Templates', locale)} · ${brandCopy[locale].editing[0]}`
    : catalog[source] || translateText(source, locale);
  const pages = workspacePagesForLocale(locale).map((entry) => ({ ...entry, label: t(entry.label), path: workspacePath(locale, entry.id) }));
  const current = pages.find((entry) => entry.id === page);
  if (!current) throw new Error(`Unknown workspace page ${locale}/${page}`);
  const copy = brandCopy[locale];
  const workspace = translateText('Content production workspace', locale);
  const summary = current.kind === 'hero' ? copy.hero[1] : copy[current.kind][2];
  return { ...current, pages, workspace, summary,
    title: `${current.label} | ${brandName(locale)} · ${workspace}`,
    description: `${current.label} — ${summary}`,
    home: translateText('Home', locale), help: translateText('Help center', locale),
  };
}
