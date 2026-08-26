const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const AUTH_KEYS = ['access_token', 'token', 'accessToken'];
const EMAIL_LOGIN_URL = '/api/user/email_login';
const PENDING_INVITE_CODE_KEY = 'kali_pending_invite_code';
const PENDING_INVITE_CAPTURED_AT_KEY = 'kali_pending_invite_captured_at';
const PENDING_INVITE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const AUTH_ENDPOINTS = {
  forgotPassword: ['/api/user/password/forgot', '/api/user/forgot-password', '/api/user/reset-password/request'],
  resetPassword: ['/api/user/password/reset', '/api/user/password/reset-with-code', '/api/user/reset-password/confirm', '/api/user/reset-password'],
  changePassword: ['/api/user/password/change', '/api/user/change-password', '/api/user/reset-password'],
  sendPhoneCode: ['/api/user/phone/send-code', '/api/user/send-phone-code', '/api/sms/send'],
  bindPhone: ['/api/user/phone/bind', '/api/user/bind-phone', '/api/user/mobile/bind'],
  refreshToken: ['/api/user/token/refresh', '/api/user/refresh-token'],
};
const PAYMENT_ENDPOINTS = {
  evonetOneTimeSession: ['/api/pay/evonet/create_session'],
  evonetOneTimeSync: ['/api/pay/evonet/sync'],
};

export const getAccessToken = () => {
  for (const key of AUTH_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }
  return '';
};

export const normalizeInviteCode = (value) => String(value || '')
  .trim()
  .replace(/[^a-z0-9]/gi, '')
  .toUpperCase()
  .slice(0, 6);

export function clearPendingInviteCode() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PENDING_INVITE_CODE_KEY);
  window.localStorage.removeItem(PENDING_INVITE_CAPTURED_AT_KEY);
}

export function getPendingInviteCode() {
  if (typeof window === 'undefined') return '';
  const code = normalizeInviteCode(window.localStorage.getItem(PENDING_INVITE_CODE_KEY));
  const capturedAt = Number(window.localStorage.getItem(PENDING_INVITE_CAPTURED_AT_KEY)) || 0;
  if (!code || !capturedAt || Date.now() - capturedAt >= PENDING_INVITE_MAX_AGE_MS) {
    clearPendingInviteCode();
    return '';
  }
  return code;
}

export function rememberInviteCode(value, { overwrite = false } = {}) {
  if (typeof window === 'undefined') return '';
  const code = normalizeInviteCode(value);
  if (!code) return getPendingInviteCode();
  const existing = getPendingInviteCode();
  if (existing && !overwrite) return existing;
  window.localStorage.setItem(PENDING_INVITE_CODE_KEY, code);
  window.localStorage.setItem(PENDING_INVITE_CAPTURED_AT_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent('kali-invite-code-captured', { detail: { code } }));
  return code;
}

export function captureInviteCodeFromLocation() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const incoming = normalizeInviteCode(params.get('inviteCode') || params.get('invite_code') || params.get('invite'));
  return incoming ? rememberInviteCode(incoming) : getPendingInviteCode();
}

const normalizeUrl = (path) => {
  if (/^https?:\/\//.test(path)) return path;
  if (!API_BASE) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

export async function apiFetch(path, { method = 'GET', body, auth = true, params, timeoutMs = 4500 } = {}) {
  const token = getAccessToken();

  if (auth && !token) {
    return { ok: false, authMissing: true, status: 0, message: 'Sign in required', data: null };
  }

  const url = new URL(normalizeUrl(path), window.location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isFormData = body instanceof FormData;
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { 'content-type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    });
    const payload = await response.json().catch(() => ({}));
    const code = payload?.code;
    const businessOk = code === undefined || code === null || code === 0 || code === 200 || code === '0' || code === '200';

    return {
      ok: response.ok && businessOk,
      status: response.status,
      message: payload?.message || payload?.msg || payload?.error || response.statusText,
      data: unwrapPayload(payload),
      raw: payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message: error.name === 'AbortError' ? 'Request timed out' : error.message || 'Network request failed',
      data: null,
    };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function uploadFile(file, { source = 'material', timeoutMs = 180000, onProgress } = {}) {
  const token = getAccessToken();

  if (!token) {
    return { ok: false, authMissing: true, status: 0, message: 'Sign in required', data: null };
  }

  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('filename', file.name);
  formData.append('file_name', file.name);
  formData.append('name', file.name);
  formData.append('source', source);
  formData.append('data_size', String(file.size || 0));

  if (typeof onProgress === 'function' && typeof XMLHttpRequest !== 'undefined') {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const timer = window.setTimeout(() => xhr.abort(), timeoutMs);
      const url = new URL(normalizeUrl('/api/file/upload'), window.location.origin);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        onProgress(Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100))));
      };
      xhr.onload = () => {
        window.clearTimeout(timer);
        const payload = (() => {
          try {
            return JSON.parse(xhr.responseText || '{}');
          } catch {
            return {};
          }
        })();
        const code = payload?.code;
        const businessOk = code === undefined || code === null || code === 0 || code === 200 || code === '0' || code === '200';
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300 && businessOk,
          status: xhr.status,
          message: payload?.message || payload?.msg || payload?.error || xhr.statusText,
          data: unwrapPayload(payload),
          raw: payload,
        });
      };
      xhr.onerror = () => {
        window.clearTimeout(timer);
        resolve({ ok: false, status: 0, message: 'Network request failed', data: null });
      };
      xhr.onabort = () => {
        window.clearTimeout(timer);
        resolve({ ok: false, status: 0, message: 'Request timed out', data: null });
      };
      xhr.open('POST', url.toString());
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  }

  return apiFetch('/api/file/upload', {
    method: 'POST',
    body: formData,
    timeoutMs,
  });
}

export async function emailLogin({ email, password, nickname, inviteCode, autoCreate = true }) {
  const normalizedInviteCode = String(inviteCode || '').trim().toUpperCase();
  return apiFetch(EMAIL_LOGIN_URL, {
    method: 'POST',
    auth: false,
    timeoutMs: 10000,
    body: {
      email,
      password,
      ...(nickname ? { nickname } : {}),
      ...(normalizedInviteCode ? {
        inviteCode: normalizedInviteCode,
        invite_code: normalizedInviteCode,
      } : {}),
      autoCreate,
      auto_create: autoCreate,
    },
  });
}

async function apiFetchAny(paths, options, fallbackMessage) {
  let lastResult = null;
  for (const path of paths) {
    const result = await apiFetch(path, options);
    if (result.ok) return result;
    lastResult = result;
    if (result.authMissing) return result;
    if (result.status && result.status !== 404 && result.status !== 405) return result;
  }
  return lastResult || { ok: false, status: 0, message: fallbackMessage, data: null };
}

const hasBoundInviter = (user = {}) => {
  const inviterId = user.inviter_user_id ?? user.inviterUserId;
  return inviterId !== undefined && inviterId !== null && inviterId !== '';
};

const updateStoredInviteRelation = (data = {}) => {
  const user = readStoredUserInfo();
  const inviterId = data.inviter_user_id ?? data.inviterUserId ?? data.inviter?.id;
  const invitedAt = data.invited_at ?? data.invitedAt;
  if (inviterId === undefined && !invitedAt) return;
  window.localStorage.setItem('user_info', JSON.stringify({
    ...user,
    ...(inviterId !== undefined ? { inviter_user_id: inviterId } : {}),
    ...(invitedAt ? { invited_at: invitedAt } : {}),
  }));
};

export async function bindInviteCode(value, { remember = true } = {}) {
  const inviteCode = normalizeInviteCode(value);
  if (!inviteCode) {
    return { ok: false, status: 0, message: '请输入邀请码', data: null, reason: 'missing' };
  }

  if (remember) rememberInviteCode(inviteCode, { overwrite: true });
  if (!getAccessToken()) {
    return { ok: false, authMissing: true, status: 0, message: 'Sign in required', data: null, reason: 'auth' };
  }

  const user = readStoredUserInfo();
  if (hasBoundInviter(user)) {
    clearPendingInviteCode();
    return { ok: true, skipped: true, status: 200, message: 'Invite relationship already exists', data: null, reason: 'already_bound' };
  }

  if (normalizeInviteCode(user.invite_code ?? user.inviteCode) === inviteCode) {
    clearPendingInviteCode();
    return { ok: false, skipped: true, status: 200, message: '不能填写自己的邀请码', data: null, reason: 'self' };
  }

  const result = await apiFetchAny([
    '/api/agent/bind-invite-code',
    '/api/agent/invite-code/bind',
  ], {
    method: 'POST',
    timeoutMs: 10000,
    body: { inviteCode, invite_code: inviteCode },
  }, 'Invite code could not be bound.');

  if (result.ok) {
    updateStoredInviteRelation(result.data || {});
    clearPendingInviteCode();
    return { ...result, reason: 'bound' };
  }

  const message = String(result.message || '');
  if (/已经绑定|不能重复|不能改绑/i.test(message)) {
    clearPendingInviteCode();
    return { ...result, ok: true, skipped: true, reason: 'already_bound' };
  }
  if (/自己的邀请码/i.test(message)) {
    clearPendingInviteCode();
    return { ...result, skipped: true, reason: 'self' };
  }
  if (/邀请码无效|最多6位|请输入邀请码/i.test(message)) {
    clearPendingInviteCode();
    return { ...result, reason: 'invalid' };
  }
  return { ...result, reason: 'retryable' };
}

export async function requestPasswordReset({ email }) {
  return apiFetchAny(AUTH_ENDPOINTS.forgotPassword, {
    method: 'POST',
    auth: false,
    timeoutMs: 10000,
    body: { email },
  }, 'Password reset is not available yet');
}

export async function confirmPasswordReset({ email, code, newPassword }) {
  return apiFetchAny(AUTH_ENDPOINTS.resetPassword, {
    method: 'POST',
    auth: false,
    timeoutMs: 10000,
    body: {
      email,
      code,
      verificationCode: code,
      verification_code: code,
      newPassword,
      new_password: newPassword,
      password: newPassword,
    },
  }, 'Password reset is not available yet');
}

export async function changePassword({ currentPassword, newPassword }) {
  return apiFetchAny(AUTH_ENDPOINTS.changePassword, {
    method: 'POST',
    timeoutMs: 10000,
    body: {
      currentPassword,
      current_password: currentPassword,
      oldPassword: currentPassword,
      old_password: currentPassword,
      newPassword,
      new_password: newPassword,
      password: newPassword,
    },
  }, 'Password change is not available yet');
}

export async function sendPhoneVerificationCode({ countryCode, phone }) {
  return apiFetchAny(AUTH_ENDPOINTS.sendPhoneCode, {
    method: 'POST',
    timeoutMs: 10000,
    body: {
      countryCode,
      country_code: countryCode,
      phone,
      mobile: phone,
      scene: 'bind_phone',
    },
  }, 'Phone verification is not available yet');
}

export async function bindPhoneNumber({ countryCode, phone, code }) {
  return apiFetchAny(AUTH_ENDPOINTS.bindPhone, {
    method: 'POST',
    timeoutMs: 10000,
    body: {
      countryCode,
      country_code: countryCode,
      phone,
      mobile: phone,
      code,
      verificationCode: code,
      verification_code: code,
    },
  }, 'Phone binding is not available yet');
}

export async function refreshUserToken() {
  const result = await apiFetchAny(AUTH_ENDPOINTS.refreshToken, {
    method: 'POST',
    timeoutMs: 10000,
  }, 'Token refresh is not available yet');

  if (!result.ok) return result;

  const nextToken = result.data?.token || result.data?.access_token || result.data?.accessToken;
  if (!nextToken) {
    return {
      ...result,
      ok: false,
      message: 'Token refresh returned no token',
    };
  }

  storeSession({ ...result.data, token: nextToken });
  return { ...result, token: nextToken };
}

export async function createEvonetOneTimePaymentSession({ plan, locale }) {
  const planId = plan?.id || plan?.plan_id || plan?.planId || plan?.package_id || plan?.packageId;
  const userInfo = readStoredUserInfo();
  const email = userInfo.email || userInfo.user_email || userInfo.userEmail || userInfo.account || userInfo.username || '';
  return apiFetchAny(PAYMENT_ENDPOINTS.evonetOneTimeSession, {
    method: 'POST',
    timeoutMs: 20000,
    body: {
      plan_id: planId,
      ...(email ? { email } : {}),
      currency: 'USD',
      locale,
    },
  }, 'Payment checkout is not available yet');
}

export async function reportEvonetOneTimePaymentEvent({ session, event }) {
  const orderNo = session?.order_no || session?.orderNo || session?.merchantOrderID || session?.merchantOrderId || session?.merchant_order_id;
  return apiFetchAny(PAYMENT_ENDPOINTS.evonetOneTimeSync, {
    method: 'POST',
    timeoutMs: 12000,
    body: {
      order_no: orderNo,
      payload: event,
    },
  }, 'Payment result could not be recorded');
}

function readStoredUserInfo() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem('user_info') || '{}') || {};
  } catch {
    return {};
  }
}

export function storeSession(data = {}) {
  const token = data.token || data.access_token || data.accessToken;
  if (!token) return false;

  window.localStorage.setItem('access_token', token);
  window.localStorage.setItem('token', token);
  if (data.user) window.localStorage.setItem('user_info', JSON.stringify(data.user));
  if (data.user_plan) window.localStorage.setItem('user_plan', JSON.stringify(data.user_plan));
  window.dispatchEvent(new Event('yixiu-auth-change'));
  return true;
}

export function clearSession() {
  AUTH_KEYS.concat(['user_info', 'user_plan']).forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new Event('yixiu-auth-change'));
}

export function unwrapPayload(payload) {
  let data = payload?.data ?? payload;
  let depth = 0;

  while (data && !Array.isArray(data) && data.data && typeof data.data === 'object' && depth < 4) {
    data = data.data;
    depth += 1;
  }

  return data;
}

export function toList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];
  return data.materials || data.results || data.list || data.items || data.records || data.rows || data.data || data.instruction_sets || data.instructionSets || [];
}
