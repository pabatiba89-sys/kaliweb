import { normalizePublishTopics } from './publishTopics.js';

export { normalizePublishTopics } from './publishTopics.js';

const trimText = (value) => String(value || '').trim();

export const LOCAL_PUBLISHER_BASE_URL = 'http://127.0.0.1:5409';
export const PUBLISH_ACCOUNT_BINDINGS_KEY = 'kali_publish_account_bindings_v1';

export const LOCAL_PUBLISH_PLATFORMS = {
  1: '小红书',
  2: '视频号',
  3: '抖音',
  4: '快手',
  5: 'TikTok',
  6: 'YouTube',
};

const buildLocalAccountsPath = (accountName) => {
  const params = new URLSearchParams();
  const normalizedAccountName = trimText(accountName);
  if (normalizedAccountName) params.set('name', normalizedAccountName);
  params.set('nocheck', '1');
  return `/getAccounts?${params.toString()}`;
};

const localPublisherError = (message, fallback) => new Error(trimText(message) || fallback);

const parseLocalPublisherResponse = async (response, fallback) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
    throw localPublisherError('', fallback);
  }

  if (!response.ok || (data?.code !== undefined && Number(data.code) !== 200)) {
    throw localPublisherError(data?.msg || data?.message, fallback);
  }
  return data;
};

const requestLocalPublisher = async (
  path,
  { method = 'GET', body, timeoutMs = 300000, fetchImpl = globalThis.fetch, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {},
) => {
  if (typeof fetchImpl !== 'function') throw localPublisherError('', '当前环境无法访问本地发布服务');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${String(baseUrl).replace(/\/$/, '')}${path}`, {
      method,
      mode: 'cors',
      cache: 'no-store',
      signal: controller.signal,
      ...(body === undefined ? {} : {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    });
    return await parseLocalPublisherResponse(response, '本地发布服务返回异常');
  } catch (error) {
    if (error?.name === 'AbortError') throw localPublisherError('', '本地发布服务响应超时');
    if (error instanceof TypeError) throw localPublisherError('', '无法连接本地发布服务，请确认 5409 服务已启动');
    if (error instanceof Error) throw error;
    throw localPublisherError('', '无法连接本地发布服务，请确认 5409 服务已启动');
  } finally {
    clearTimeout(timer);
  }
};

export async function checkLocalPublisher({ accountName, accountTargets, fetchImpl = globalThis.fetch, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {}) {
  try {
    const hasExplicitTargets = Array.isArray(accountTargets);
    const result = await requestLocalPublisher(buildLocalAccountsPath(hasExplicitTargets ? '' : accountName), {
      timeoutMs: 5000,
      fetchImpl,
      baseUrl,
    });
    const accountRecords = Array.isArray(result?.data) ? result.data : [];
    if (hasExplicitTargets) {
      if (!accountTargets.length) {
        return { ok: false, message: '该发布账号尚未匹配本机账号，请先完成发布设置', accounts: [] };
      }
      const accounts = selectBoundLocalAccounts(accountRecords, accountTargets);
      const requestedCount = new Set(accountTargets.map(bindingTargetKey)).size;
      if (accounts.length !== requestedCount) {
        return { ok: false, message: '本机账号匹配已失效，请到发布设置重新匹配', accounts: [] };
      }
      return { ok: true, message: '', accounts };
    }
    return {
      ok: true,
      message: '',
      accounts: accountRecords,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '未检测到本地发布服务',
      accounts: [],
    };
  }
}

const normalizeLocalPublishDate = (value) => {
  const normalized = trimText(value).replace('T', ' ');
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(normalized)) return `${normalized}:00`;
  return normalized;
};

export const normalizeLocalAccount = (account) => {
  if (Array.isArray(account)) {
    return {
      id: String(account[0] ?? ''),
      type: Number(account[1]),
      cookie: trimText(account[2]),
      name: trimText(account[3]),
      status: account[4],
      platform: LOCAL_PUBLISH_PLATFORMS[Number(account[1])] || '未知平台',
    };
  }
  return {
    id: String(account?.id ?? ''),
    type: Number(account?.type ?? account?.platformType ?? account?.platform_type),
    cookie: trimText(account?.cookie ?? account?.cookieFile ?? account?.cookie_file),
    name: trimText(account?.userName ?? account?.username ?? account?.name),
    status: account?.status,
    platform: trimText(account?.platform) || LOCAL_PUBLISH_PLATFORMS[Number(account?.type ?? account?.platformType ?? account?.platform_type)] || '未知平台',
  };
};

const normalizeBindingTarget = (target) => ({
  id: String(target?.id ?? ''),
  type: Number(target?.type),
  name: trimText(target?.name),
});

const bindingTargetKey = (target) => `${Number(target?.type)}:${String(target?.id ?? '')}`;

export function loadPublishAccountBindings(storage = globalThis.localStorage) {
  if (!storage?.getItem) return {};
  try {
    const parsed = JSON.parse(storage.getItem(PUBLISH_ACCOUNT_BINDINGS_KEY) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).map(([accountId, targets]) => [
      String(accountId),
      (Array.isArray(targets) ? targets : [])
        .map(normalizeBindingTarget)
        .filter((target) => target.id && Number.isInteger(target.type) && target.type > 0),
    ]));
  } catch {
    return {};
  }
}

export function savePublishAccountBindings(bindings, storage = globalThis.localStorage) {
  if (!storage?.setItem) return false;
  const normalized = Object.fromEntries(Object.entries(bindings || {}).map(([accountId, targets]) => [
    String(accountId),
    (Array.isArray(targets) ? targets : [])
      .map(normalizeBindingTarget)
      .filter((target) => target.id && Number.isInteger(target.type) && target.type > 0),
  ]));
  storage.setItem(PUBLISH_ACCOUNT_BINDINGS_KEY, JSON.stringify(normalized));
  return true;
}

export function getPublishAccountBinding(accountId, storage = globalThis.localStorage) {
  return loadPublishAccountBindings(storage)[String(accountId)] || [];
}

const selectBoundLocalAccounts = (accountRecords, accountTargets) => {
  const requested = new Set((accountTargets || []).map(bindingTargetKey));
  return (Array.isArray(accountRecords) ? accountRecords : [])
    .map(normalizeLocalAccount)
    .filter((account) => requested.has(bindingTargetKey(account)) && account.cookie && Number.isInteger(account.type) && account.type > 0);
};

export async function listLocalPublisherAccounts({ fetchImpl = globalThis.fetch, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {}) {
  try {
    const result = await requestLocalPublisher('/getValidAccounts', {
      timeoutMs: 30000,
      fetchImpl,
      baseUrl,
    });
    return {
      ok: true,
      message: '',
      accounts: (Array.isArray(result?.data) ? result.data : [])
        .map(normalizeLocalAccount)
        .filter((account) => account.id && account.name && Number.isInteger(account.type) && account.type > 0)
        .map(({ cookie, ...account }) => ({ ...account, configured: Boolean(cookie) })),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '未检测到本地发布服务',
      accounts: [],
    };
  }
}

export function buildLocalPublishPayload({ type, title, topics, filePath, accountCookies, publishAt, publishNow = false } = {}) {
  const normalizedPublishAt = normalizeLocalPublishDate(publishAt);
  return {
    type: Number(type),
    title: trimText(title),
    tags: normalizePublishTopics(topics),
    fileList: [trimText(filePath)],
    accountList: [...new Set((accountCookies || []).map(trimText).filter(Boolean))],
    enableTimer: 1,
    videosPerDay: 1,
    sendnow: publishNow ? 'now' : 'schedule',
    dailyTimes: [normalizedPublishAt],
    endpublishTime: normalizedPublishAt,
    startDays: 0,
    category: 0,
    productLink: '',
    productTitle: '',
  };
}

export async function triggerLocalPublish({
  videoUrl,
  title,
  topics,
  accountName,
  accountTargets,
  localAccounts,
  publishAt,
  publishNow = false,
  fetchImpl = globalThis.fetch,
  baseUrl = LOCAL_PUBLISHER_BASE_URL,
} = {}) {
  const normalizedVideoUrl = trimText(videoUrl);
  const normalizedAccountName = trimText(accountName);
  const hasExplicitTargets = Array.isArray(accountTargets);
  if (!normalizedVideoUrl) throw localPublisherError('', '没有可供本地发布的视频地址');
  if (!normalizedAccountName && !hasExplicitTargets) throw localPublisherError('', '没有可供本地匹配的发布账号');

  const uploadResult = await requestLocalPublisher('/uploadFromUrl', {
    method: 'POST',
    body: { videoUrl: normalizedVideoUrl },
    timeoutMs: 300000,
    fetchImpl,
    baseUrl,
  });
  const filePath = trimText(uploadResult?.data?.filepath ?? uploadResult?.data);
  if (!filePath) throw localPublisherError(uploadResult?.msg, '本地服务未返回视频文件路径');

  const accountRecords = Array.isArray(localAccounts)
    ? localAccounts
    : (await requestLocalPublisher(buildLocalAccountsPath(hasExplicitTargets ? '' : normalizedAccountName), {
        timeoutMs: 15000,
        fetchImpl,
        baseUrl,
      }))?.data;
  const matchingAccounts = hasExplicitTargets
    ? selectBoundLocalAccounts(accountRecords, accountTargets)
    : (Array.isArray(accountRecords) ? accountRecords : [])
      .map(normalizeLocalAccount)
      .filter((account) => account.name === normalizedAccountName && account.cookie && Number.isInteger(account.type) && account.type > 0);
  if (!matchingAccounts.length) {
    throw localPublisherError('', hasExplicitTargets ? '本机账号匹配已失效，请到发布设置重新匹配' : `本地没有返回账号“${normalizedAccountName}”`);
  }

  const accountsByType = new Map();
  matchingAccounts.forEach((account) => {
    accountsByType.set(account.type, (accountsByType.get(account.type) || []).concat(account.cookie));
  });

  await Promise.all([...accountsByType].map(([type, accountCookies]) => (
    requestLocalPublisher('/postVideo', {
      method: 'POST',
      body: buildLocalPublishPayload({ type, title, topics, filePath, accountCookies, publishAt, publishNow }),
      timeoutMs: 300000,
      fetchImpl,
      baseUrl,
    })
  )));

  return {
    filePath,
    accountCount: matchingAccounts.length,
    platformCount: accountsByType.size,
  };
}

const buildCommonPublishFields = ({ title, topics, accountId, accountName, publishAt, publishNow = false } = {}) => {
  const topicList = normalizePublishTopics(topics);
  const normalizedAccountId = Number(accountId);
  const normalizedAccountName = trimText(accountName);
  const normalizedPublishAt = trimText(publishAt).replace('T', ' ');

  return {
    title: trimText(title),
    topics: topicList,
    tags: topicList,
    publish_account_id: normalizedAccountId,
    publishAccountId: normalizedAccountId,
    account: normalizedAccountName,
    account_name: normalizedAccountName,
    accountName: normalizedAccountName,
    publish_time: normalizedPublishAt,
    publishTime: normalizedPublishAt,
    publish_now: Boolean(publishNow),
    publishNow: Boolean(publishNow),
  };
};

export function buildProductionVideoPublishPayload({ videoId, ...fields } = {}) {
  const normalizedVideoId = Number(videoId);
  return {
    id: normalizedVideoId,
    video_id: normalizedVideoId,
    videoId: normalizedVideoId,
    ...buildCommonPublishFields(fields),
  };
}

export function buildUploadedVideoPublishPayload({ videoUrl, uploadKey, fileName, fileSize, duration, ...fields } = {}) {
  return {
    source: 'upload',
    video_url: trimText(videoUrl),
    videoUrl: trimText(videoUrl),
    upload_key: trimText(uploadKey),
    file_name: trimText(fileName),
    file_size: Number(fileSize) || 0,
    duration: Number(duration) || 0,
    ...buildCommonPublishFields(fields),
  };
}
