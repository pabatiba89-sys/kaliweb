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

const LYRIC_METADATA_LABELS = 'music prompt|vocal style|style|mood|tempo|instruments?|音乐提示|演唱提示|提示词|提示|风格|情绪|速度|节奏|乐器|人声|编曲';
const BRACKETED_LYRIC_PROMPT = new RegExp(
  String.raw`[\[【(（]\s*(?:${LYRIC_SECTION_LABELS})(?:[^\]】)）\r\n]{0,60})?[\]】)）]`,
  'giu',
);
const LYRIC_DIRECTION_WORDS = /(?:vocals?|instrumental|a\s*cappella|spoken|whisper|soft|gentle|powerful|emotional|melodic|upbeat|piano|guitar|drums?|strings?|synth|echo|reverb|fade|build|drop|solo|男声|女声|合唱|和声|独白|说唱|轻声|低语|呢喃|温柔|轻柔|激昂|情绪|渐强|渐弱|淡入|淡出|钢琴|吉他|鼓点|弦乐|合成器|器乐|伴奏|旋律|节奏|演唱|人声)/iu;
const BRACKETED_LYRIC_NOTE = /(\[[^\]\r\n]{1,100}\]|【[^】\r\n]{1,100}】|\([^\)\r\n]{1,100}\)|（[^）\r\n]{1,100}）)/gu;
const LYRIC_PROMPT_PREFIX = new RegExp(
  `^\\s*(?:#{1,6}\\s*)?(?:\\*\\*|__)?\\s*(?:${LYRIC_SECTION_LABELS})(?:\\s*\\d+)?(?:\\*\\*|__)?\\s*(?:[:：|\\-—]+\\s*)?`,
  'iu',
);
const LYRIC_METADATA_LINE = new RegExp(
  `^\\s*(?:#{1,6}\\s*)?(?:\\*\\*|__)?\\s*(?:${LYRIC_METADATA_LABELS})(?:\\*\\*|__)?\\s*[:：|\\-—]+.*$`,
  'iu',
);

export const cleanMusicLyrics = (value) => String(value || '')
  .replace(/```[^\r\n]*\r?\n?/g, '')
  .replace(BRACKETED_LYRIC_PROMPT, '')
  .split(/\r?\n/)
  .map((line) => {
    const withoutNotes = line.replace(BRACKETED_LYRIC_NOTE, (note) => (LYRIC_DIRECTION_WORDS.test(note) ? '' : note));
    if (LYRIC_METADATA_LINE.test(withoutNotes)) return '';
    return withoutNotes.replace(LYRIC_PROMPT_PREFIX, '').trim();
  })
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

export function buildMusicVideoPayload({ taskId, audioId, title, author, source = {} }) {
  const normalizedTitle = String(title || '').trim();
  const normalizedAuthor = String(author || '').trim();
  const domainName = source.domainName || source.domain_name;
  const callBackUrl = source.callBackUrl || source.callbackUrl || source.call_back_url;
  return {
    taskId,
    audioId,
    ...(normalizedTitle ? { title: normalizedTitle } : {}),
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
