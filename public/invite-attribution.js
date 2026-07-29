(() => {
  const CODE_KEY = 'kali_pending_invite_code';
  const CAPTURED_AT_KEY = 'kali_pending_invite_captured_at';
  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
  const normalize = (value) => String(value || '')
    .trim()
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 6);

  try {
    const params = new URLSearchParams(window.location.search);
    const incoming = normalize(params.get('inviteCode') || params.get('invite_code') || params.get('invite'));
    if (!incoming) return;

    const existing = normalize(window.localStorage.getItem(CODE_KEY));
    const capturedAt = Number(window.localStorage.getItem(CAPTURED_AT_KEY)) || 0;
    const isFresh = existing && capturedAt > 0 && Date.now() - capturedAt < MAX_AGE_MS;
    const code = isFresh ? existing : incoming;

    if (!isFresh) {
      window.localStorage.setItem(CODE_KEY, code);
      window.localStorage.setItem(CAPTURED_AT_KEY, String(Date.now()));
    }

    window.dispatchEvent(new CustomEvent('kali-invite-code-captured', { detail: { code } }));
  } catch {
    // Attribution must never prevent the page from loading.
  }
})();
