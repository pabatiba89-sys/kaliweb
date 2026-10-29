import assert from 'node:assert/strict';
import test from 'node:test';
import { convertRmbToUsdAmount, usesMiniProgramPayment } from '../src/billingPolicy.js';

test('only Simplified Chinese uses Mini Program payment; Traditional Chinese and English use web checkout', () => {
  assert.equal(usesMiniProgramPayment('zh-CN'), true);
  for (const locale of ['zh-TW', 'en-US', 'de-DE', 'ja-JP']) assert.equal(usesMiniProgramPayment(locale), false);
});

test('web checkout displays the same rounded USD amount as the backend pricing rule', () => {
  for (const [rmb, usd] of [[9.9, 2], [60, 9], [200, 28], [1800, 250], [4800, 667]]) {
    assert.equal(convertRmbToUsdAmount(rmb), usd);
  }
});
