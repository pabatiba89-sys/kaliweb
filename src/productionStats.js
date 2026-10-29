// These lists share the signed-in user's/team's existing visibility rules.
// production/list without a scene already includes mixed and packaged videos.
export const productionSources = [
  { key: 'studio', kind: 'video', path: '/api/video/production/list' },
  { key: 'seedance', kind: 'video', path: '/api/ai-video/videos', params: { status: 'all' } },
  { key: 'musicVideo', kind: 'video', path: '/api/music/video/list' },
  { key: 'music', kind: 'music', path: '/api/music/generated' },
  { key: 'image', kind: 'image', path: '/api/image-generation/images' },
];

function listData(value) {
  if (Array.isArray(value)) return { list: value };
  if (!value || typeof value !== 'object') return null;
  for (const key of ['list', 'items', 'records', 'rows']) {
    if (Array.isArray(value[key])) return { ...value, list: value[key] };
  }
  return listData(value.data) || listData(value.result);
}

export async function loadProductionSource(source, fetcher, isCurrent = () => true) {
  const rows = new Map();
  for (let page = 1; isCurrent(); page += 1) {
    const result = await fetcher(source.path, { params: { ...source.params, page, page_size: 100 }, timeoutMs: 20000 });
    if (!isCurrent()) throw new Error('cancelled');
    if (!result.ok) throw new Error('unavailable');
    const data = listData(result.data) || listData(result.raw);
    if (!data) throw new Error('invalid list');
    let added = 0;
    for (const item of data.list) {
      const id = item.id ?? item.task_id ?? item.taskId;
      if (id == null) throw new Error('missing identity');
      if (!rows.has(String(id))) added += 1;
      rows.set(String(id), item);
    }
    const total = Number(data.total);
    if (Number.isFinite(total) && rows.size >= total) return [...rows.values()];
    if (!data.list.length) {
      if (Number.isFinite(total) && rows.size < total) throw new Error('incomplete list');
      return [...rows.values()];
    }
    if (!added || page >= 1000) throw new Error('incomplete list');
  }
  throw new Error('cancelled');
}

const isSuccess = (row) => /^(success|succeed|succeeded|completed|complete|done|published|publish_success|已完成|完成|视频生成|成功|已发布)$/i.test(String(row.status ?? row.task_status ?? ''));
const mediaUrl = (row, kind) => kind === 'video'
  ? row.video_url || row.videoUrl
  : kind === 'image' ? row.image_url || row.imageUrl : row.audio_url || row.audioUrl || row.music_url;

// Date-only server timestamps have no timezone. Keep their calendar date rather
// than silently interpreting UTC as a browser-local day. See the API contract.
export function productionDay(row) {
  const raw = row.completed_at || row.finished_at || row.created_at || row.createdAt;
  if (!raw) return '';
  const text = String(raw);
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(text)) return text.slice(0, 10);
  const numeric = Number(raw);
  const date = new Date(Number.isFinite(numeric) ? numeric * (numeric < 1e12 ? 1000 : 1) : raw);
  return Number.isNaN(date.getTime()) ? '' : localDay(date);
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function summarizeProduction(source, rows, day) {
  const entries = source.kind === 'music' ? rows.flatMap((row) => Array.isArray(row.items) && row.items.length
    ? row.items.map((item) => ({ ...item, created_at: item.created_at || row.created_at, status: item.status || row.status }))
    : [row]) : rows;
  const completed = entries.filter((row) => isSuccess(row) && mediaUrl(row, source.kind));
  return { total: completed.length, today: completed.filter((row) => productionDay(row) === day).length };
}
