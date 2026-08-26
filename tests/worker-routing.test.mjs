import assert from 'node:assert/strict';
import test from 'node:test';

import worker from '../src/worker.js';

test('keeps MCP routes on the static binding because MCP uses its own Worker', async () => {
  const response = await worker.fetch(new Request('https://www.kaliai.fun/mcp'), {
    ASSETS: { fetch: () => new Response('asset') },
  });

  assert.equal(await response.text(), 'asset');
});

test('keeps non-API routes on the static asset binding', async () => {
  const response = await worker.fetch(new Request('https://www.kaliai.fun/en/'), {
    ASSETS: { fetch: () => new Response('asset') },
  });

  assert.equal(await response.text(), 'asset');
});

test('allows Google sign-in popups on the workspace page', async () => {
  const response = await worker.fetch(new Request('https://www.kaliai.fun/app/'), {
    ASSETS: { fetch: () => new Response('workspace') },
  });

  assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin-allow-popups');
  assert.equal(await response.text(), 'workspace');
});
