import { normalizePublishTopics } from './publishTopics.js';

export { normalizePublishTopics } from './publishTopics.js';

const trimText = (value) => String(value || '').trim();

export const LOCAL_PUBLISHER_BASE_URL = 'http://127.0.0.1:5409';

export const LOCAL_PUBLISH_PLATFORMS = {
  1: '小红书',
  2: '视频号',
  3: '抖音',
  4: '快手',
  5: 'TikTok',
  6: 'YouTube',
};

export const LOCAL_PUBLISH_LOGIN_TYPES = [1, 2, 3, 4, 5, 6];

export const SYSTEM_PUBLISH_ACCOUNT_ENDPOINTS = {
  create: '/api/team-notion/publish-account/create',
  update: '/api/team-notion/publish-account/update',
};

export function buildSystemPublishAccountMutation({ mode, id, name } = {}) {
  const normalizedName = trimText(name);
  if (!normalizedName) throw new Error('请输入系统账号名称');
  if (normalizedName.length > 80) throw new Error('系统账号名称不能超过 80 个字符');

  if (mode === 'create') {
    return {
      path: SYSTEM_PUBLISH_ACCOUNT_ENDPOINTS.create,
      body: { account_name: normalizedName },
    };
  }

  if (mode === 'update') {
    const normalizedId = Number(id);
    if (!Number.isInteger(normalizedId) || normalizedId <= 0) throw new Error('系统账号编号无效');
    return {
      path: SYSTEM_PUBLISH_ACCOUNT_ENDPOINTS.update,
      body: { id: normalizedId, account_name: normalizedName },
    };
  }

  throw new Error('系统账号操作无效');
}

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

export async function checkLocalPublisher({ accountName, fetchImpl = globalThis.fetch, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {}) {
  try {
    const normalizedAccountName = trimText(accountName);
    if (!normalizedAccountName) {
      return { ok: false, message: '发布账号名称为空，无法匹配本机账号', accounts: [] };
    }
    const result = await requestLocalPublisher(buildLocalAccountsPath(normalizedAccountName), {
      timeoutMs: 5000,
      fetchImpl,
      baseUrl,
    });
    const accounts = (Array.isArray(result?.data) ? result.data : [])
      .map(normalizeLocalAccount)
      .filter((account) => account.name === normalizedAccountName && account.cookie && Number.isInteger(account.type) && account.type > 0);
    if (!accounts.length) {
      return { ok: false, message: `本机没有与“${normalizedAccountName}”同名的已登录账号，请先到发布设置添加`, accounts: [] };
    }
    return {
      ok: true,
      message: '',
      accounts,
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

export function buildLocalPublisherLoginUrl({ type, name, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {}) {
  const normalizedType = Number(type);
  const normalizedName = trimText(name);
  if (!LOCAL_PUBLISH_LOGIN_TYPES.includes(normalizedType)) throw localPublisherError('', '当前本机发布服务不支持该平台登录');
  if (!normalizedName) throw localPublisherError('', '请输入账号名称');
  const params = new URLSearchParams({ type: String(normalizedType), id: normalizedName });
  return `${String(baseUrl).replace(/\/$/, '')}/login?${params.toString()}`;
}

export async function updateLocalPublisherAccount({ id, type, name, fetchImpl = globalThis.fetch, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {}) {
  const normalizedId = Number(id);
  const normalizedType = Number(type);
  const normalizedName = trimText(name);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) throw localPublisherError('', '本机账号编号无效');
  if (!Number.isInteger(normalizedType) || normalizedType <= 0) throw localPublisherError('', '本机账号平台无效');
  if (!normalizedName) throw localPublisherError('', '请输入账号名称');
  await requestLocalPublisher('/updateUserinfo', {
    method: 'POST',
    body: { id: normalizedId, type: normalizedType, userName: normalizedName },
    timeoutMs: 15000,
    fetchImpl,
    baseUrl,
  });
  return { id: String(normalizedId), type: normalizedType, name: normalizedName };
}

export async function deleteLocalPublisherAccount(id, { fetchImpl = globalThis.fetch, baseUrl = LOCAL_PUBLISHER_BASE_URL } = {}) {
  const normalizedId = Number(id);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) throw localPublisherError('', '本机账号编号无效');
  await requestLocalPublisher(`/deleteAccount?id=${encodeURIComponent(normalizedId)}`, {
    timeoutMs: 15000,
    fetchImpl,
    baseUrl,
  });
  return true;
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
  localAccounts,
  publishAt,
  publishNow = false,
  fetchImpl = globalThis.fetch,
  baseUrl = LOCAL_PUBLISHER_BASE_URL,
} = {}) {
  const normalizedVideoUrl = trimText(videoUrl);
  const normalizedAccountName = trimText(accountName);
  if (!normalizedVideoUrl) throw localPublisherError('', '没有可供本地发布的视频地址');
  if (!normalizedAccountName) throw localPublisherError('', '没有可供本地匹配的发布账号');

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
    : (await requestLocalPublisher(buildLocalAccountsPath(normalizedAccountName), {
        timeoutMs: 15000,
        fetchImpl,
        baseUrl,
      }))?.data;
  const matchingAccounts = (Array.isArray(accountRecords) ? accountRecords : [])
    .map(normalizeLocalAccount)
    .filter((account) => account.name === normalizedAccountName && account.cookie && Number.isInteger(account.type) && account.type > 0);
  if (!matchingAccounts.length) {
    throw localPublisherError('', `本地没有返回账号“${normalizedAccountName}”`);
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
