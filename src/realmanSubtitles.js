import { VIDEO_AUDIO_MAX_BYTES } from './videoAudio.js';

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
  return groups.map((items) => ({
    items,
    text: items.map((item) => item.text).join(''),
  }));
}

export function buildEditedRealmanSubtitles(groups) {
  return groups.flatMap(({ items, text }) => {
    if (text === items.map((item) => item.text).join('')) return items;
    if (!text.trim()) return [];
    const characters = Array.from(text.replace(/[\r\n]/gu, ' '));
    if (characters.length === items.length) {
      return items.map((item, index) => ({ ...item, text: characters[index] }));
    }
    // Keep other segments untouched when words are inserted or removed.
    const start = items[0].startMs;
    const end = Math.max(...items.map((item) => item.endMs));
    const boundary = (index) => start + Math.round((end - start) * index / characters.length);
    return characters.map((character, index) => ({ startMs: boundary(index), endMs: boundary(index + 1), text: character }));
  });
}

export async function fetchRealmanVideoFile(url, signal) {
  const response = await fetch(url, { signal, credentials: 'omit' });
  if (!response.ok || !response.body) throw new Error('无法读取在线成片，请下载视频后从本地选择。');
  if (Number(response.headers.get('content-length')) > VIDEO_AUDIO_MAX_BYTES) {
    await response.body.cancel();
    throw new Error('视频不能超过 100 MB。');
  }
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > VIDEO_AUDIO_MAX_BYTES) {
        await reader.cancel();
        throw new Error('视频不能超过 100 MB。');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const isMov = /\.mov$/i.test(new URL(url, window.location.href).pathname) || response.headers.get('content-type')?.startsWith('video/quicktime');
  return new File(chunks, isMov ? 'source.mov' : 'source.mp4', { type: isMov ? 'video/quicktime' : 'video/mp4' });
}
