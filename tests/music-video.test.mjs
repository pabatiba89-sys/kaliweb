import assert from 'node:assert/strict';
import test from 'node:test';

import { buildMusicVideoPayload, cleanMusicLyrics, getFirstMusicResult, getMusicVideoUrl } from '../src/music.js';

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

test('getFirstMusicResult keeps a video detail object even when items is empty', () => {
  const detail = {
    task_id: 'video-task-1',
    status: 'succeeded',
    video_url: 'https://cdn.example.com/music-video.mp4',
    related: { author: '一修' },
    items: [],
  };

  assert.equal(getFirstMusicResult({ data: detail, raw: { code: 200, data: detail } }), detail);
});

test('getFirstMusicResult keeps music task items on the parent detail object', () => {
  const detail = {
    task_id: 'music-task-1',
    status: 'succeeded',
    related: { title: '你是我的挚爱' },
    items: [{ music_id: 'song-1' }, { music_id: 'song-2' }],
  };

  assert.equal(getFirstMusicResult({ data: detail }), detail);
});

test('getFirstMusicResult still unwraps list-only responses', () => {
  const first = { task_id: 'video-task-1' };

  assert.equal(getFirstMusicResult({ data: { list: [first] } }), first);
});

test('getMusicVideoUrl reads archived and provider URL fallbacks', () => {
  assert.equal(getMusicVideoUrl({ related: { result_data: { video_url: 'https://cdn.example.com/final.mp4' } } }), 'https://cdn.example.com/final.mp4');
  assert.equal(getMusicVideoUrl({ provider_video_url: 'https://provider.example.com/result.mp4' }), 'https://provider.example.com/result.mp4');
});
