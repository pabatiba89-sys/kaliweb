import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPackagingPresetPayload,
  getVoiceSpeakerId,
  matchesVoiceIdentifier,
} from '../src/packagingPreset.js';

test('saves the selected speaker ID instead of the voice training ID', () => {
  const payload = buildPackagingPresetPayload({
    mode: 'edit',
    id: 'preset-1',
    human: { id: 'human-1', title: 'Adrian', cover: 'human.jpg' },
    voice: { id: 'speaker-1', voiceId: 'voice-training-1', speakerId: 'speaker-1' },
    videoTemplate: { id: 'video-template-1', title: 'Clean', cover: 'video.jpg' },
    coverTemplate: { id: 'cover-template-1', title: 'Blue', cover: 'cover.jpg' },
    isDefault: true,
  });

  assert.equal(payload.speakerId, 'speaker-1');
  assert.equal(Object.hasOwn(payload, 'voiceId'), false);
});

test('does not silently fall back to a voice training ID', () => {
  assert.equal(getVoiceSpeakerId({ id: 'voice-training-1', voiceId: 'voice-training-1' }), '');
});

test('matches current speaker IDs and legacy voice IDs when hydrating presets', () => {
  const voice = { id: 'speaker-1', speakerId: 'speaker-1', voiceId: 'voice-training-1' };
  assert.equal(matchesVoiceIdentifier(voice, 'speaker-1'), true);
  assert.equal(matchesVoiceIdentifier(voice, 'voice-training-1'), true);
  assert.equal(matchesVoiceIdentifier(voice, ''), false);
});
