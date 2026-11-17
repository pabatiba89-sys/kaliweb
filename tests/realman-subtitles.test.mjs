import assert from 'node:assert/strict';
import test from 'node:test';
import { groupRealmanSubtitles, editRealmanSubtitleCharacters } from '../src/realmanSubtitles.js';

const recognized = [
  { startMs: 0, endMs: 110, text: '她' },
  { startMs: 160, endMs: 200, text: '好' },
  { startMs: 1300, endMs: 1500, text: '🙂' },
];

test('replaces only the selected character without changing any timestamps', () => {
  const groups = groupRealmanSubtitles(recognized);
  assert.deepEqual(groups, [recognized.slice(0, 2), recognized.slice(2)]);
  const edited = editRealmanSubtitleCharacters(groups, 0, 0, '你');
  assert.deepEqual(edited.flat(), [{ ...recognized[0], text: '你' }, ...recognized.slice(1)]);
  assert.deepEqual(groups.flat(), recognized);
});

test('inserts missing characters as separate entries without shifting neighboring subtitles', () => {
  const groups = groupRealmanSubtitles(recognized);
  const edited = editRealmanSubtitleCharacters(groups, 0, 0, '𠮷她');
  assert.deepEqual(edited.flat(), [
    { startMs: 0, endMs: 55, text: '𠮷' },
    { startMs: 55, endMs: 110, text: '她' },
    ...recognized.slice(1),
  ]);
});

test('rejects malformed timestamps and leaves empty recognition results empty', () => {
  assert.throws(() => groupRealmanSubtitles([{ startMs: 100, endMs: 20, text: 'a' }]), /字幕时间轴/);
  assert.deepEqual(groupRealmanSubtitles(null), []);
});

test('removes the deleted subtitle and drops empty rows without shifting timestamps', () => {
  const groups = groupRealmanSubtitles(recognized);
  const firstDeleted = editRealmanSubtitleCharacters(groups, 0, 0, '');
  assert.deepEqual(firstDeleted.flat(), recognized.slice(1));
  const rowDeleted = editRealmanSubtitleCharacters(firstDeleted, 0, 0, '');
  assert.deepEqual(rowDeleted, [[recognized[2]]]);
  assert.deepEqual(editRealmanSubtitleCharacters(rowDeleted, 0, 0, ''), []);
});
