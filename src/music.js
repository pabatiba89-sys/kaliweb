const LYRIC_SECTION_LABELS = [
  'pre[ -]?chorus',
  'post[ -]?chorus',
  'build[ -]?up',
  'female vocals?',
  'male vocals?',
  'instrumental',
  'breakdown',
  'interlude',
  'chorus',
  'refrain',
  'bridge',
  'verse',
  'intro',
  'outro',
  'hook',
  'break',
  'build',
  'drop',
  'solo',
  'spoken',
  'choir',
  'duet',
  'rap',
  '预副歌',
  '后副歌',
  '纯音乐',
  '主歌',
  '副歌',
  '前奏',
  '间奏',
  '尾奏',
  '尾声',
  '桥段',
  '过渡',
  '说唱',
  '独白',
  '合唱',
  '男声',
  '女声',
  '对唱',
  '器乐',
].join('|');

const BRACKETED_LYRIC_PROMPT = new RegExp(
  `[\\[\u3010]\s*(?:${LYRIC_SECTION_LABELS})(?:[^\\]\u3011\\r\\n]{0,60})?[\\]\u3011]`,
  'giu',
);
const LYRIC_PROMPT_PREFIX = new RegExp(
  `^\\s*(?:#{1,6}\\s*)?(?:\\*\\*|__)?\\s*(?:${LYRIC_SECTION_LABELS})(?:\\s*\\d+)?(?:\\*\\*|__)?\\s*(?:[:：|\\-—]+\\s*)?`,
  'iu',
);

export const cleanMusicLyrics = (value) => String(value || '')
  .replace(/```[^\r\n]*\r?\n?/g, '')
  .replace(BRACKETED_LYRIC_PROMPT, '')
  .split(/\r?\n/)
  .map((line) => line.replace(LYRIC_PROMPT_PREFIX, '').trim())
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

export function buildMusicVideoPayload({ taskId, audioId, author, source = {} }) {
  const normalizedAuthor = String(author || '').trim();
  const domainName = source.domainName || source.domain_name;
  const callBackUrl = source.callBackUrl || source.callbackUrl || source.call_back_url;
  return {
    taskId,
    audioId,
    ...(normalizedAuthor ? { author: normalizedAuthor } : {}),
    ...(domainName ? { domainName } : {}),
    ...(callBackUrl ? { callBackUrl } : {}),
  };
}

const MUSIC_RESULT_COLLECTION_KEYS = ['videos', 'video_list', 'videoList', 'results', 'list', 'items', 'records', 'rows'];
const MUSIC_RESULT_DETAIL_KEYS = [
  'task_id',
  'taskId',
  'task_type',
  'taskType',
  'music_id',
  'musicId',
  'audio_id',
  'audioId',
  'status',
  'related',
  'video_url',
  'videoUrl',
  'audio_url',
  'audioUrl',
];

export function getFirstMusicResult(result = {}) {
  const raw = result.raw || {};
  const payloads = [result.data, raw.data?.data, raw.data, raw]
    .filter((item) => item && typeof item === 'object');

  for (const payload of payloads) {
    if (Array.isArray(payload)) return payload[0] || {};

    const isDetail = MUSIC_RESULT_DETAIL_KEYS.some((key) => (
      Object.prototype.hasOwnProperty.call(payload, key)
      && payload[key] !== undefined
      && payload[key] !== null
    ));
    if (isDetail) return payload;

    for (const key of MUSIC_RESULT_COLLECTION_KEYS) {
      if (Array.isArray(payload[key])) return payload[key][0] || {};
    }
    if (Object.keys(payload).length) return payload;
  }
  return {};
}

export function getMusicVideoUrl(item = {}) {
  const related = item.related || {};
  const result = item.result || item.result_data || item.resultData || {};
  const relatedResult = related.result || related.result_data || related.resultData || {};
  return [
    item.video_url,
    item.videoUrl,
    item.result_url,
    item.resultUrl,
    item.url,
    item.file_url,
    item.fileUrl,
    item.output_url,
    item.outputUrl,
    result.video_url,
    result.videoUrl,
    result.result_url,
    result.resultUrl,
    result.url,
    related.video_url,
    related.videoUrl,
    related.result_url,
    related.resultUrl,
    related.url,
    relatedResult.video_url,
    relatedResult.videoUrl,
    relatedResult.result_url,
    relatedResult.resultUrl,
    item.provider_video_url,
    item.providerVideoUrl,
    result.provider_video_url,
    result.providerVideoUrl,
    related.provider_video_url,
    related.providerVideoUrl,
    relatedResult.provider_video_url,
    relatedResult.providerVideoUrl,
  ].find((value) => typeof value === 'string' && value.trim()) || '';
}
