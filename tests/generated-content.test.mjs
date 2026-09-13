import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GENERATED_CONTENT_UNAVAILABLE_MESSAGE,
  getGeneratedRetryPrompt,
  isGeneratedMarkupFailure,
} from '../src/generatedContent.js';

test('rejects an HTML document tail from generated copy', () => {
  assert.equal(isGeneratedMarkupFailure('</div>\n</div>\n</body>\n</html>'), true);
});

test('rejects document markup as soon as it appears in a stream', () => {
  assert.equal(isGeneratedMarkupFailure('<html><body>'), true);
  assert.equal(isGeneratedMarkupFailure('<!doctype html>'), true);
});

test('keeps ordinary copy and harmless angle brackets', () => {
  assert.equal(isGeneratedMarkupFailure('标题：今天的创意\n文案：让好内容走得更远 <3'), false);
  assert.equal(isGeneratedMarkupFailure('用 <div> 作为示例标签。'), false);
});

test('uses the playful retry message', () => {
  assert.equal(GENERATED_CONTENT_UNAVAILABLE_MESSAGE, '文案迷路了，请重新生成。');
});

test('retries a failed generation with the original prompt from the same round', () => {
  const messages = [
    { role: 'user', text: '第一轮需求', roundNo: 1 },
    { role: 'assistant', text: '第一轮结果', roundNo: 1, generated: true },
    { role: 'user', text: '双人对话视频需求', roundNo: 2 },
    { role: 'assistant', text: '生成失败', roundNo: 2, error: true },
  ];

  assert.equal(getGeneratedRetryPrompt(messages, 3), '双人对话视频需求');
});
