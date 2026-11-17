export function isSingleSubtitleCharacter(text) {
  return typeof text === 'string' && Array.from(text).length === 1 && !/[\r\n\t]/u.test(text);
}

export function groupRealmanSubtitles(entries) {
  if (!Array.isArray(entries) || !entries.length) return [];
  const groups = [];
  let chars = [];
  for (const entry of entries) {
    if (!entry || !Number.isInteger(entry.startMs) || !Number.isInteger(entry.endMs)
        || entry.startMs < 0 || entry.endMs < entry.startMs || entry.endMs > 310000
        || typeof entry.text !== 'string' || Array.from(entry.text).length !== 1) {
      throw new Error('字幕时间轴或文字格式有误，请重新识别。');
    }
    if (chars.length && entry.startMs - chars.at(-1).endMs > 750) {
      groups.push(chars);
      chars = [];
    }
    chars.push(entry);
    if (chars.length >= 32 || /[。！？!?；;\n]/u.test(entry.text)) {
      groups.push(chars);
      chars = [];
    }
  }
  if (chars.length) groups.push(chars);
  return groups;
}

export function replaceRealmanSubtitleCharacter(groups, groupIndex, itemIndex, text) {
  if (!isSingleSubtitleCharacter(text) || !groups[groupIndex]?.[itemIndex]) return groups;
  return groups.map((group, index) => {
    if (index !== groupIndex) return group;
    return group.map((item, characterIndex) => characterIndex === itemIndex ? { ...item, text } : item);
  });
}

export async function fetchRealmanVideoFile(url, signal) {
  const response = await fetch(url, { signal, credentials: 'omit' });
  if (!response.ok || !response.body) throw new Error('无法读取在线成片，请下载视频后从本地选择。');
  const video = await response.blob();
  const isMov = /\.mov$/i.test(new URL(url, window.location.href).pathname) || response.headers.get('content-type')?.startsWith('video/quicktime');
  return new File([video], isMov ? 'source.mov' : 'source.mp4', { type: isMov ? 'video/quicktime' : 'video/mp4' });
}
