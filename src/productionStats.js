export const STATISTICS_TIMEZONE = 'Asia/Shanghai';
export const RESOURCE_TYPES = ['video', 'music', 'image', 'material', 'digital_human', 'voice', 'speech'];
const optionValues = {
  scopes: ['team', 'personal'], periods: ['today', 'yesterday', 'last7', 'last30', 'custom'],
  group_by: ['day', 'member'], resource_types: RESOURCE_TYPES,
};
export class StatisticsError extends Error {
  constructor(kind) { super(kind); this.kind = kind; }
}
export function statisticsDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: STATISTICS_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
const isDate = (value) => {
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number(String(value).slice(0,4)) >= 1 && Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value;
};
const validCount = (value) => Number.isSafeInteger(value) && value >= 0;
const fail = (kind = 'unavailable') => { throw new StatisticsError(kind); };

export async function statisticsRequest(path, params, fetcher) {
  const result = await fetcher(path, { params, timeoutMs: 30000 });
  // Business codes may arrive over HTTP 200. Never use HTTP status as the
  // authority or quietly turn a failed response into seven zero counters.
  const code = Number(result.raw?.code);
  if (result.authMissing || code === 401 || result.status === 401) fail('auth');
  if (code === 403 || result.status === 403) fail('forbidden');
  if (code === 400) fail('validation');
  if (!result.ok || result.raw?.code == null || ![0, 200].includes(code) || !result.data) fail();
  return result.data;
}

export function normalizeStatisticsOptions(data) {
  if (data.version !== 1 || data.timezone !== STATISTICS_TIMEZONE || !Number.isInteger(data.max_days) || data.max_days < 1) fail();
  for (const [key, values] of Object.entries(optionValues)) {
    if (!Array.isArray(data[key]) || data[key].length !== values.length || new Set(data[key].map((item) => item.value)).size !== values.length || data[key].some((item) => !values.includes(item.value) || !item.label)) fail();
  }
  if (!Array.isArray(data.members) || data.members.some((item) => !Number.isInteger(item.value) || item.value < 1 || !item.label)) fail();
  const defaults = data.defaults;
  if (!defaults || !optionValues.scopes.includes(defaults.scope) || !optionValues.periods.includes(defaults.period) || !optionValues.group_by.includes(defaults.group_by) || !Array.isArray(defaults.resource_types) || defaults.resource_types.length !== RESOURCE_TYPES.length || RESOURCE_TYPES.some((key) => !defaults.resource_types.includes(key))) fail();
  return { ...data, max_days: Math.min(366, data.max_days) };
}

export function buildStatisticsParams(filters, options, today = statisticsDay()) {
  const scope = filters.scope || options.defaults.scope;
  const group = filters.group_by || options.defaults.group_by;
  const types = filters.resource_types || options.defaults.resource_types;
  if (!optionValues.scopes.includes(scope) || !optionValues.group_by.includes(group) || !types.length || new Set(types).size !== types.length || types.some((key) => !RESOURCE_TYPES.includes(key))) fail('validation');
  const params = { scope, group_by: group, resource_types: types.join(',') };
  if (scope === 'personal' && filters.user_id != null && filters.user_id !== '') {
    const id = Number(filters.user_id);
    if (!options.members.some((item) => item.value === id)) fail('forbidden');
    params.user_id = id;
  }
  if (filters.date) {
    if (filters.period || filters.start_date || filters.end_date || !isDate(filters.date) || filters.date > today) fail('validation');
    params.date = filters.date;
    return params;
  }
  const period = filters.period || options.defaults.period;
  if (!optionValues.periods.includes(period)) fail('validation');
  if (period === 'custom') {
    const { start_date: start, end_date: end } = filters;
    if (!isDate(start) || !isDate(end) || start > end || end > today || (Date.parse(end) - Date.parse(start)) / 86400000 + 1 > options.max_days) fail('validation');
    return { ...params, period: 'custom', start_date: start, end_date: end };
  }
  if (filters.start_date || filters.end_date) fail('validation');
  return { ...params, period };
}

export function normalizeStatisticsDashboard(data, requestedTypes) {
  if (data.version !== 1 || data.timezone !== STATISTICS_TIMEZONE || !isDate(data.start_date) || !isDate(data.end_date) || data.start_date > data.end_date || !['day', 'member'].includes(data.group_by) || !Array.isArray(data.summary) || !Array.isArray(data.series)) fail();
  const seen = new Set();
  for (const row of data.summary) {
    if (!requestedTypes.includes(row.value) || seen.has(row.value) || !validCount(row.period_count) || !validCount(row.total_count)) fail();
    seen.add(row.value);
  }
  if (seen.size !== requestedTypes.length) fail();
  for (const row of data.series) {
    if (data.group_by === 'day' ? !isDate(row.date) : !Number.isInteger(row.user_id)) fail();
    if (!row.counts || requestedTypes.some((key) => !validCount(row.counts[key]))) fail();
  }
  return data;
}

export function statisticsPeriodLabel(data, today = statisticsDay()) {
  if (data.start_date !== data.end_date) return '期间完成';
  return data.start_date === today ? '今日完成' : '当日完成';
}

export async function loadStatisticsDashboard(params, fetcher) {
  return normalizeStatisticsDashboard(await statisticsRequest('/api/statistics/dashboard', params, fetcher), params.resource_types.split(','));
}

export function buildStatisticsQueries(filters, options, day = statisticsDay()) {
  if (!options || !filters) return {};
  let main, error, today;
  try { main = buildStatisticsParams(filters, options, day); } catch (cause) { error = cause.kind || 'unavailable'; }
  try {
    today = buildStatisticsParams({scope:filters.scope, user_id:filters.user_id, period:'today', group_by:'day', resource_types:['video']}, options, day);
  } catch {}
  const reuseToday = main?.period === 'today' && main.resource_types.split(',').includes('video');
  return {main, today, error, reuseToday};
}
