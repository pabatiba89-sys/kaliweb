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
