import assert from 'node:assert/strict';
import test from 'node:test';

import worker from '../src/worker.js';

test('forwards MCP requests and preserves the user authorization header', async () => {
  const originalFetch = globalThis.fetch;
  let forwardedRequest;
  globalThis.fetch = async (request) => {
    forwardedRequest = request;
    return new Response('ok');
  };

  try {
    const response = await worker.fetch(new Request('https://www.kaliai.fun/mcp/tools?cursor=next', {
      headers: { Authorization: 'Bearer user-token' },
    }), {
      ASSETS: { fetch: () => new Response('asset') },
    });

    assert.equal(await response.text(), 'ok');
    assert.equal(forwardedRequest.url, 'https://yixiuapi.xyaip.fun/mcp/tools?cursor=next');
    assert.equal(forwardedRequest.headers.get('Authorization'), 'Bearer user-token');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('keeps non-API routes on the static asset binding', async () => {
  const response = await worker.fetch(new Request('https://www.kaliai.fun/en/'), {
    ASSETS: { fetch: () => new Response('asset') },
  });

  assert.equal(await response.text(), 'asset');
});
