import assert from 'node:assert/strict';
import test from 'node:test';
import { groupRealmanSubtitles, replaceRealmanSubtitleCharacter } from '../src/realmanSubtitles.js';

const recognized = [
  { startMs: 0, endMs: 110, text: '她' },
  { startMs: 160, endMs: 200, text: '好' },
  { startMs: 1300, endMs: 1500, text: '🙂' },
];

test('replaces only the selected character without changing any timestamps', () => {
  const groups = groupRealmanSubtitles(recognized);
  assert.deepEqual(groups, [recognized.slice(0, 2), recognized.slice(2)]);
  const edited = replaceRealmanSubtitleCharacter(groups, 0, 0, '你');
  assert.deepEqual(edited.flat(), [{ ...recognized[0], text: '你' }, ...recognized.slice(1)]);
  assert.deepEqual(groups.flat(), recognized);
});

test('rejects empty and multi-character edits and accepts one Unicode character', () => {
  const groups = groupRealmanSubtitles(recognized);
  for (const text of ['', '你好', '\n']) {
    assert.equal(replaceRealmanSubtitleCharacter(groups, 0, 0, text), groups);
  }
  assert.deepEqual(replaceRealmanSubtitleCharacter(groups, 1, 0, '𠮷').flat(), [
    ...recognized.slice(0, 2), { ...recognized[2], text: '𠮷' },
  ]);
});

test('rejects malformed timestamps and leaves empty recognition results empty', () => {
  assert.throws(() => groupRealmanSubtitles([{ startMs: 100, endMs: 20, text: 'a' }]), /字幕时间轴/);
  assert.deepEqual(groupRealmanSubtitles(null), []);
});
