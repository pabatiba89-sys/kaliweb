import assert from 'node:assert/strict';
import test from 'node:test';
import { groupRealmanSubtitles, buildEditedRealmanSubtitles } from '../src/realmanSubtitles.js';

const recognized = [
  { startMs: 0, endMs: 110, text: '她' },
  { startMs: 160, endMs: 200, text: '好' },
  { startMs: 1300, endMs: 1500, text: '🙂' },
];

test('groups speech around pauses and preserves untouched character timestamps', () => {
  const groups = groupRealmanSubtitles(recognized);
  assert.deepEqual(groups.map(group => group.text), ['她好', '🙂']);
  assert.deepEqual(buildEditedRealmanSubtitles(groups), recognized);
  groups[0].text = '你好';
  assert.deepEqual(buildEditedRealmanSubtitles(groups), [{ ...recognized[0], text: '你' }, ...recognized.slice(1)]);
});

test('insertion only changes timing within the edited segment and supports Unicode characters', () => {
  const groups = groupRealmanSubtitles(recognized);
  groups[0].text = '你真好🙂';
  const result = buildEditedRealmanSubtitles(groups);
  assert.deepEqual(result.slice(0, 4).map(item => item.text), ['你', '真', '好', '🙂']);
  assert.equal(result[0].startMs, 0);
  assert.equal(result[3].endMs, 200);
  assert.deepEqual(result[4], recognized[2]);
  groups[0].text = '';
  assert.deepEqual(buildEditedRealmanSubtitles(groups), [recognized[2]]);
});

test('rejects malformed timestamps and leaves empty recognition results empty', () => {
  assert.throws(() => groupRealmanSubtitles([{ startMs: 100, endMs: 20, text: 'a' }]), /字幕时间轴/);
  assert.deepEqual(groupRealmanSubtitles(null), []);
});
