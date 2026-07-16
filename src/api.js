const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const AUTH_KEYS = ['access_token', 'token', 'accessToken'];
const EMAIL_LOGIN_URL = '/api/user/email_login';
const AUTH_ENDPOINTS = {
  forgotPassword: ['/api/user/password/forgot', '/api/user/forgot-password', '/api/user/reset-password/request'],
  resetPassword: ['/api/user/password/reset', '/api/user/password/reset-with-code', '/api/user/reset-password/confirm', '/api/user/reset-password'],
  changePassword: ['/api/user/password/change', '/api/user/change-password', '/api/user/reset-password'],
  sendPhoneCode: ['/api/user/phone/send-code', '/api/user/send-phone-code', '/api/sms/send'],
  bindPhone: ['/api/user/phone/bind', '/api/user/bind-phone', '/api/user/mobile/bind'],
};
const PAYMENT_ENDPOINTS = {
  evonetOneTimeSession: [
    '/api/payment/evonet/one-time/session',
    '/api/payments/evonet/one-time/session',
    '/api/billing/evonet/one-time/session',
    '/api/evonet/interaction',
  ],
  evonetOneTimeCallback: [
    '/api/payment/evonet/one-time/callback',
    '/api/payments/evonet/one-time/callback',
    '/api/billing/evonet/one-time/callback',
  ],
};

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

export async function createEvonetOneTimePaymentSession({ plan, locale }) {
  const planId = plan?.id || plan?.plan_id || plan?.planId || plan?.package_id || plan?.packageId;
  return apiFetchAny(PAYMENT_ENDPOINTS.evonetOneTimeSession, {
    method: 'POST',
    timeoutMs: 20000,
    body: {
      paymentType: 'one_time',
      payment_type: 'one_time',
      recurring: false,
      locale,
      planId,
      plan_id: planId,
      packageId: plan?.package_id || plan?.packageId || planId,
      package_id: plan?.package_id || plan?.packageId || planId,
      productName: plan?.name || plan?.title || plan?.plan_name || plan?.planName || plan?.package_name || plan?.packageName,
      product_name: plan?.name || plan?.title || plan?.plan_name || plan?.planName || plan?.package_name || plan?.packageName,
      amount: plan?.price ?? plan?.amount ?? plan?.sale_price ?? plan?.salePrice ?? plan?.pay_amount ?? plan?.payAmount,
      currency: plan?.currency || plan?.currency_code || plan?.currencyCode || 'USD',
    },
  }, 'Payment checkout is not available yet');
}

export async function reportEvonetOneTimePaymentEvent({ session, event }) {
  return apiFetchAny(PAYMENT_ENDPOINTS.evonetOneTimeCallback, {
    method: 'POST',
    timeoutMs: 12000,
    body: {
      paymentType: 'one_time',
      payment_type: 'one_time',
      sessionID: session?.sessionID || session?.sessionId || session?.session_id,
      sessionId: session?.sessionID || session?.sessionId || session?.session_id,
      merchantOrderID: session?.merchantOrderID || session?.merchantOrderId || session?.merchant_order_id,
      merchantOrderId: session?.merchantOrderID || session?.merchantOrderId || session?.merchant_order_id,
      merchantTransID: event?.merchantTransID || event?.merchantTransId || event?.merchant_trans_id,
      merchantTransId: event?.merchantTransID || event?.merchantTransId || event?.merchant_trans_id,
      type: event?.type,
      code: event?.code,
      message: event?.message,
      event,
    },
  }, 'Payment result could not be recorded');
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
