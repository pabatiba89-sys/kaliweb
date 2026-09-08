const TIMESTAMP_PATTERN = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
const SECTION_PATTERN = /^\[[^\]]+\]$/;

const fractionToSeconds = (value = '') => {
  if (!value) return 0;
  return Number(`0.${value.padEnd(3, '0').slice(0, 3)}`);
};

const timestampToSeconds = (minutes, seconds, fraction) => (
  (Number(minutes) * 60) + Number(seconds) + fractionToSeconds(fraction)
);

const getLineWeight = (text) => {
  const compactLength = String(text || '').replace(/\s+/g, '').length;
  return Math.max(1, Math.min(2.4, compactLength / 9));
};

export const parseMusicLyrics = (value, duration = 0) => {
  const sourceLines = String(value || '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!sourceLines.length) return [];

  const rows = [];
  let hasTimestamps = false;

  sourceLines.forEach((line, sourceIndex) => {
    const timestamps = [];
    TIMESTAMP_PATTERN.lastIndex = 0;
    for (const match of line.matchAll(TIMESTAMP_PATTERN)) {
      timestamps.push(timestampToSeconds(match[1], match[2], match[3]));
    }
    TIMESTAMP_PATTERN.lastIndex = 0;
    const text = line.replace(TIMESTAMP_PATTERN, '').trim();

    if (timestamps.length && text) {
      hasTimestamps = true;
      timestamps.forEach((start, duplicateIndex) => rows.push({
        id: `${sourceIndex}-${duplicateIndex}`,
        text,
        kind: 'lyric',
        start,
      }));
      return;
    }

    if (text) {
      rows.push({
        id: String(sourceIndex),
        text,
        kind: SECTION_PATTERN.test(text) ? 'section' : 'lyric',
        start: null,
      });
    }
  });

  if (hasTimestamps) {
    const timedLyrics = rows
      .filter((row) => row.kind === 'lyric' && Number.isFinite(row.start))
      .sort((a, b) => a.start - b.start);
    return timedLyrics.map((row, index) => ({
      ...row,
      end: timedLyrics[index + 1]?.start ?? Math.max(Number(duration) || 0, row.start + 4),
      estimated: false,
    }));
  }

  const lyricRows = rows.filter((row) => row.kind === 'lyric');
  if (!lyricRows.length) return rows;

  const safeDuration = Number.isFinite(Number(duration)) && Number(duration) > 0
    ? Number(duration)
    : Math.max(lyricRows.length * 4.2, 1);
  const leadIn = Math.min(8, Math.max(1.5, safeDuration * 0.035));
  const leadOut = Math.min(6, Math.max(1, safeDuration * 0.025));
  const usableDuration = Math.max(lyricRows.length, safeDuration - leadIn - leadOut);
  const totalWeight = lyricRows.reduce((sum, row) => sum + getLineWeight(row.text), 0);
  let elapsed = leadIn;

  const timedById = new Map();
  lyricRows.forEach((row) => {
    const lineDuration = usableDuration * (getLineWeight(row.text) / totalWeight);
    timedById.set(row.id, {
      ...row,
      start: elapsed,
      end: Math.min(safeDuration, elapsed + lineDuration),
      estimated: true,
    });
    elapsed += lineDuration;
  });

  let previousLyricEnd = leadIn;
  return rows.map((row, index) => {
    if (row.kind === 'lyric') {
      const timed = timedById.get(row.id);
      previousLyricEnd = timed?.end ?? previousLyricEnd;
      return timed;
    }
    const nextLyric = rows.slice(index + 1).find((candidate) => candidate.kind === 'lyric');
    const nextStart = nextLyric ? timedById.get(nextLyric.id)?.start : null;
    return {
      ...row,
      start: Number.isFinite(nextStart) ? nextStart : previousLyricEnd,
      end: Number.isFinite(nextStart) ? nextStart : safeDuration,
      estimated: true,
    };
  });
};

export const getActiveMusicLyricIndex = (rows, currentTime) => {
  const time = Number(currentTime) || 0;
  let activeIndex = -1;
  rows.forEach((row, index) => {
    if (row.kind === 'lyric' && Number(row.start) <= time) activeIndex = index;
  });
  return activeIndex;
};
