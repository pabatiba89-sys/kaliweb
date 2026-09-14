import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getTrainingMediaDurationIssue,
  TRAINING_MEDIA_MAX_DURATION,
  TRAINING_MEDIA_MIN_DURATION,
} from '../src/trainingMediaDuration.js';

test('uses a 30-second to 2-minute training media range', () => {
  assert.equal(TRAINING_MEDIA_MIN_DURATION, 30);
  assert.equal(TRAINING_MEDIA_MAX_DURATION, 120);
});

test('accepts both duration boundaries', () => {
  assert.equal(getTrainingMediaDurationIssue(30), '');
  assert.equal(getTrainingMediaDurationIssue(120), '');
});

test('rejects durations outside the training range', () => {
  assert.equal(getTrainingMediaDurationIssue(29.99), 'too-short');
  assert.equal(getTrainingMediaDurationIssue(120.01), 'too-long');
});

test('rejects missing or unreadable durations', () => {
  assert.equal(getTrainingMediaDurationIssue(0), 'unreadable');
  assert.equal(getTrainingMediaDurationIssue(Number.NaN), 'unreadable');
  assert.equal(getTrainingMediaDurationIssue('invalid'), 'unreadable');
});
