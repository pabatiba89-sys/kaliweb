import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildVoiceSpeedPayload,
  formatVoiceSpeed,
  normalizeVoiceSpeed,
  VOICE_SPEED_MAX,
  VOICE_SPEED_MIN,
  VOICE_SPEED_STEP,
} from '../src/voiceSpeed.js';

test('uses the requested voice speed range and step', () => {
  assert.equal(VOICE_SPEED_MIN, 0.2);
  assert.equal(VOICE_SPEED_MAX, 2);
  assert.equal(VOICE_SPEED_STEP, 0.1);
});

test('normalizes voice speed to one decimal within the supported range', () => {
  assert.equal(normalizeVoiceSpeed(0.1), 0.2);
  assert.equal(normalizeVoiceSpeed(0.26), 0.3);
  assert.equal(normalizeVoiceSpeed(2.1), 2);
  assert.equal(normalizeVoiceSpeed('invalid'), 1);
});

test('formats voice speed with one decimal place', () => {
  assert.equal(formatVoiceSpeed(1), '1.0');
  assert.equal(formatVoiceSpeed(0.2), '0.2');
  assert.equal(formatVoiceSpeed(2), '2.0');
});

test('submits all voice speed aliases with the same normalized value', () => {
  assert.deepEqual(buildVoiceSpeedPayload(1.26), {
    speed: 1.3,
    voice_speed: 1.3,
    voiceSpeed: 1.3,
  });
});
