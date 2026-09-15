import assert from 'node:assert/strict';
import test from 'node:test';

import { AFFILIATE_UI_ENABLED, parseFeatureFlag } from '../src/featureFlags.js';

test('affiliate UI is hidden by default', () => {
  assert.equal(AFFILIATE_UI_ENABLED, false);
});

test('feature flags require an explicit enabled value', () => {
  for (const value of ['1', 'true', 'TRUE', 'yes', 'on']) {
    assert.equal(parseFeatureFlag(value), true);
  }
  for (const value of [undefined, null, '', '0', 'false', 'off']) {
    assert.equal(parseFeatureFlag(value), false);
  }
});
