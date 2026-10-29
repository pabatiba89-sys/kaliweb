// Evaluate the most specific user-agent group and longest matching path rule.
export function canCrawl(robots, userAgent, pathname = '/') {
  const groups = [];
  let group = null;
  let hasRules = false;
  for (const line of robots.split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!match) continue;
    const [, rawKey, value] = match;
    const key = rawKey.toLowerCase();
    if (key === 'user-agent') {
      if (!group || hasRules) { group = { agents: [], rules: [] }; groups.push(group); hasRules = false; }
      group.agents.push(value.toLowerCase());
    } else if (group && (key === 'allow' || key === 'disallow')) {
      hasRules = true;
      if (value) group.rules.push({ allow: key === 'allow', path: value });
    }
  }
  const agent = userAgent.toLowerCase();
  const score = (group) => Math.max(-1, ...group.agents.map((entry) => entry === '*' ? 0 : agent.includes(entry) ? entry.length : -1));
  const specificity = Math.max(-1, ...groups.map(score));
  if (specificity < 0) return true;
  const matches = groups.filter((group) => score(group) === specificity).flatMap((group) => group.rules).filter((rule) => {
    const end = rule.path.endsWith('$');
    const pattern = end ? rule.path.slice(0, -1) : rule.path;
    const expression = pattern.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + (end ? '$' : '');
    return new RegExp(`^${expression}`).test(pathname);
  }).sort((a, b) => b.path.replaceAll('*', '').length - a.path.replaceAll('*', '').length || Number(b.allow) - Number(a.allow));
  return matches[0]?.allow ?? true;
}
