const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const AUTH_KEYS = ['access_token', 'token', 'accessToken'];
const EMAIL_LOGIN_URL = '/api/user/email_login';

export const getAccessToken = () => {
  for (const key of AUTH_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }
  return '';
};

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

export async function uploadFile(file, { source = 'material', timeoutMs = 180000 } = {}) {
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

  return apiFetch('/api/file/upload', {
    method: 'POST',
    body: formData,
    timeoutMs,
  });
}

export async function emailLogin({ email, password, nickname, autoCreate = true }) {
  return apiFetch(EMAIL_LOGIN_URL, {
    method: 'POST',
    auth: false,
    timeoutMs: 10000,
    body: {
      email,
      password,
      ...(nickname ? { nickname } : {}),
      autoCreate,
      auto_create: autoCreate,
    },
  });
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
