import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCreatorOptionalMedia,
  resolveCreatorOptionalMedia,
} from '../src/videoCreatorOptions.js';

test('defaults background music and cover options to enabled', () => {
  assert.deepEqual(resolveCreatorOptionalMedia(), {
    useBackgroundMusic: true,
    useCover: true,
  });
});

test('restores disabled optional media flags from saved payloads', () => {
  assert.deepEqual(resolveCreatorOptionalMedia(
    { useBackgroundMusic: false },
    { useCover: '0' },
  ), {
    useBackgroundMusic: false,
    useCover: false,
  });
});

test('removes music and cover settings when both options are disabled', () => {
  const settings = buildCreatorOptionalMedia({
    useBackgroundMusic: false,
    useCover: false,
    musicUrl: 'https://cdn.example.com/music.mp3',
    coverTemplateId: 'cover-1',
    coverUrl: 'https://cdn.example.com/cover.jpg',
  });

  assert.equal(settings.useBackgroundMusic, false);
  assert.equal(settings.useCover, false);
  assert.equal(settings.musicUrl, '');
  assert.deepEqual(settings.bgmusic, { url: '' });
  assert.deepEqual(settings.backgroundMusic, {
    audioSwitch: false,
    audioUrl: '',
    url: '',
    volume: 1,
  });
  assert.deepEqual(settings.firstFrameCover, { coverSwitch: false });
});

test('keeps explicit media selections when options are enabled', () => {
  const settings = buildCreatorOptionalMedia({
    musicUrl: 'https://cdn.example.com/music.mp3',
    musicVolume: 0.5,
    coverTemplateId: 'cover-1',
    coverUrl: 'https://cdn.example.com/cover.jpg',
  });

  assert.equal(settings.useBackgroundMusic, true);
  assert.equal(settings.useCover, true);
  assert.equal(settings.backgroundMusic.audioSwitch, true);
  assert.equal(settings.backgroundMusic.volume, 0.5);
  assert.deepEqual(settings.firstFrameCover, {
    coverSwitch: true,
    templateId: 'cover-1',
    imageUrl: 'https://cdn.example.com/cover.jpg',
  });
});

test('keeps background music enabled for automatic matching when no track is selected', () => {
  const settings = buildCreatorOptionalMedia({ useBackgroundMusic: true, musicUrl: '' });

  assert.equal(settings.useBackgroundMusic, true);
  assert.equal(settings.musicUrl, '');
  assert.equal(settings.backgroundMusic.audioSwitch, false);
});
