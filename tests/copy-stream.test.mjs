import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { getGeneratedFailureMessage } from '../src/generatedContent.js';

// Exercise the actual request and parsing code without mounting the workbench.
const source = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
const generationCode = source.slice(source.indexOf('const generatedScalar ='), source.indexOf('const GENERATED_THINKING_MESSAGES ='));
const event = (content) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\r\n\r\n`;

function startGeneration({ status = 200, contentType = 'text/event-stream' } = {}) {
  let controller;
  const previews = [];
  const stream = new ReadableStream({ start(value) { controller = value; } });
  const context = vm.createContext({
    TextDecoder,
    getGeneratedFailureMessage,
    textOf: (value) => String(value ?? '').trim(),
    getAccessToken: () => '',
    buildAIVideoPromptInstruction: (prompt) => prompt,
    fetch: async () => new Response(stream, { status, headers: { 'content-type': contentType } }),
  });
  vm.runInContext(`${generationCode}\nglobalThis.generate = requestGeneratedCopy;`, context);
  const completion = context.generate({
    prompt: '写一段视频提示词',
    agent: { purpose: 'ai-video-dialogue-prompt' },
    messages: [],
    onProgress: (text) => previews.push(text),
  });
  return {
    previews,
    completion,
    send: async (text) => {
      controller.enqueue(new TextEncoder().encode(text));
      await new Promise((resolve) => setImmediate(resolve));
    },
    close: () => controller.close(),
  };
}

test('shows unlabelled copy before the stream closes', async () => {
  const run = startGeneration();
  await run.send(event('镜头缓缓推进'));
  assert.equal(run.previews.at(-1), '镜头缓缓推进');
  await run.send(event('，两人开始对话。'));
  assert.equal(run.previews.at(-1), '镜头缓缓推进，两人开始对话。');
  run.close();
  assert.equal((await run.completion).text, run.previews.at(-1));
});

test('decodes an unfinished response envelope immediately', async () => {
  const run = startGeneration();
  await run.send(event('{"response":"你好'));
  assert.equal(run.previews.at(-1), '你好');
  await run.send(event('\\n世界"}'));
  assert.equal(run.previews.at(-1), '你好\n世界');
  run.close();
  assert.equal((await run.completion).text, '你好\n世界');
});

test('preserves repeated tokens and whitespace in deltas', async () => {
  const run = startGeneration();
  for (const chunk of ['哈', '哈', ' ', ' ', '继续']) await run.send(event(chunk));
  run.close();
  assert.equal((await run.completion).text, '哈哈  继续');
});

test('filters reasoning events while displaying the answer', async () => {
  const run = startGeneration();
  await run.send(`data: ${JSON.stringify({ type: 'reasoning', content: '内部思考' })}\n\n`);
  await run.send(`data: ${JSON.stringify({ choices: [{ delta: { reasoning_content: '内部分析' } }] })}\n\n`);
  assert.deepEqual(run.previews, []);
  await run.send(event('正式正文'));
  assert.equal(run.previews.at(-1), '正式正文');
  run.close();
  await run.completion;
});

test('handles event boundaries split across network chunks', async () => {
  const run = startGeneration();
  const frame = event('标题：测试\n文案：正文');
  await run.send(frame.slice(0, 12));
  assert.deepEqual(run.previews, []);
  await run.send(frame.slice(12, -1));
  await run.send(frame.slice(-1));
  assert.equal(run.previews.at(-1), '标题：测试\n文案：正文');
  run.close();
  assert.equal((await run.completion).script.title, '测试');
});

test('reports stream errors even after partial content', async () => {
  const run = startGeneration();
  await run.send(event('部分内容'));
  await run.send('data: {"error":{"message":"生成中断"}}\n\n');
  run.close();
  await assert.rejects(run.completion, /生成中断/);
});


test('rejects a gateway error before parsing its HTML body as generated copy', async () => {
  const run = startGeneration({ status: 504, contentType: 'text/html' });
  await assert.rejects(run.completion, /文案生成失败，请重试/);
  assert.deepEqual(run.previews, []);
});

test('rejects an HTML page even if the gateway reports HTTP 200', async () => {
  const run = startGeneration({ contentType: 'text/html; charset=utf-8' });
  await assert.rejects(run.completion, /文案生成失败，请重试/);
  assert.deepEqual(run.previews, []);
});

test('keeps a readable API error from a failed JSON response', async () => {
  const run = startGeneration({ status: 403, contentType: 'application/json' });
  const rejected = assert.rejects(run.completion, /积分不足/);
  await run.send('{"msg":"积分不足"}');
  run.close();
  await rejected;
  assert.deepEqual(run.previews, []);
});

test('filters HTML embedded in a JSON API error', async () => {
  const run = startGeneration({ status: 502, contentType: 'application/json' });
  const rejected = assert.rejects(run.completion, /文案生成失败，请重试/);
  await run.send('{"msg":"</div>\\n</body>\\n</html>"}');
  run.close();
  await rejected;
  assert.deepEqual(run.previews, []);
});
