import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_VIDEO_TEMPLATE_ASPECT_RATIO,
  filterVideoTemplatesByAspectRatio,
  getVideoTemplateAspectRatio,
} from '../src/videoTemplateRatio.js';

test('defaults video template selection to portrait', () => {
  assert.equal(DEFAULT_VIDEO_TEMPLATE_ASPECT_RATIO, '9:16');
});

test('normalizes API ratios, orientations, and dimensions', () => {
  assert.equal(getVideoTemplateAspectRatio({ ratio: '9:16' }), '9:16');
  assert.equal(getVideoTemplateAspectRatio({ aspect_ratio: '16 / 9' }), '16:9');
  assert.equal(getVideoTemplateAspectRatio({ orientation: 'vertical' }), '9:16');
  assert.equal(getVideoTemplateAspectRatio({ width: 1920, height: 1080 }), '16:9');
  assert.equal(getVideoTemplateAspectRatio({ resolution: '1080×1920' }), '9:16');
  assert.equal(getVideoTemplateAspectRatio({ ratio: '1:1' }), '');
});

test('only keeps templates for the selected aspect ratio', () => {
  const templates = [
    { id: 'portrait', aspectRatio: '9:16' },
    { id: 'landscape', raw: { aspect_ratio: '16:9' } },
    { id: 'unknown', raw: {} },
  ];

  assert.deepEqual(filterVideoTemplatesByAspectRatio(templates, '9:16').map((item) => item.id), ['portrait']);
  assert.deepEqual(filterVideoTemplatesByAspectRatio(templates, '16:9').map((item) => item.id), ['landscape']);
});
