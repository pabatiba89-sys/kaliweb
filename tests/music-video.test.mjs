import assert from 'node:assert/strict';
import test from 'node:test';

import { buildMusicVideoPayload, cleanMusicLyrics } from '../src/music.js';

test('cleanMusicLyrics removes section prompts and keeps lyric text', () => {
  const lyrics = [
    '[Intro]',
    '风从城市的缝隙里穿过',
    '[Verse 1: Female Vocal]',
    '我把今天写成一首歌',
    '副歌：你还在这里',
    '**桥段**',
    '别怕夜色太深',
    '[Chorus] 我们一起往前走',
  ].join('\n');

  assert.equal(
    cleanMusicLyrics(lyrics),
    '风从城市的缝隙里穿过\n\n我把今天写成一首歌\n你还在这里\n\n别怕夜色太深\n我们一起往前走',
  );
});

test('buildMusicVideoPayload always carries the entered author', () => {
  assert.deepEqual(buildMusicVideoPayload({
    taskId: 'music-task-1',
    audioId: 'song-1',
    author: '  一修  ',
    source: { domain_name: 'kaliai.fun' },
  }), {
    taskId: 'music-task-1',
    audioId: 'song-1',
    author: '一修',
    domainName: 'kaliai.fun',
  });
});
