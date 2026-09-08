import assert from 'node:assert/strict';
import test from 'node:test';

import { getActiveMusicLyricIndex, parseMusicLyrics } from '../src/musicLyrics.js';

test('parses LRC timestamps and uses them for active-line selection', () => {
  const rows = parseMusicLyrics('[00:03.50]第一句\n[00:08.25]第二句', 20);

  assert.equal(rows.length, 2);
  assert.equal(rows[0].start, 3.5);
  assert.equal(rows[1].start, 8.25);
  assert.equal(rows[0].estimated, false);
  assert.equal(getActiveMusicLyricIndex(rows, 2), -1);
  assert.equal(getActiveMusicLyricIndex(rows, 7), 0);
  assert.equal(getActiveMusicLyricIndex(rows, 10), 1);
});

test('builds a stable estimated timeline for plain lyrics', () => {
  const rows = parseMusicLyrics('[Verse]\n短句\n这是一句更长的歌词\n\n[Chorus]\n最后一句', 60);
  const lyricRows = rows.filter((row) => row.kind === 'lyric');

  assert.equal(rows.length, 5);
  assert.equal(lyricRows.length, 3);
  assert.equal(lyricRows.every((row) => row.estimated), true);
  assert.equal(lyricRows[0].start > 0, true);
  assert.equal(lyricRows[1].start > lyricRows[0].start, true);
  assert.equal(lyricRows[2].start > lyricRows[1].start, true);
  assert.equal(getActiveMusicLyricIndex(rows, lyricRows[1].start + 0.01), rows.indexOf(lyricRows[1]));
});

test('ignores empty lyric input', () => {
  assert.deepEqual(parseMusicLyrics('  \n\n ', 120), []);
});
