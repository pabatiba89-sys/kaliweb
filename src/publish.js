const trimText = (value) => String(value || '').trim();

export const LOCAL_PUBLISHER_BASE_URL = 'http://127.0.0.1:5409';

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

const normalizeLocalPublishDate = (value) => {
  const normalized = trimText(value).replace('T', ' ');
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(normalized)) return `${normalized}:00`;
  return normalized;
};

const normalizeLocalAccount = (account) => {
  if (Array.isArray(account)) {
    return {
      id: account[0],
      type: Number(account[1]),
      cookie: trimText(account[2]),
      name: trimText(account[3]),
      status: account[4],
    };
  }
  return {
    id: account?.id,
    type: Number(account?.type ?? account?.platformType ?? account?.platform_type),
    cookie: trimText(account?.cookie ?? account?.cookieFile ?? account?.cookie_file),
    name: trimText(account?.userName ?? account?.username ?? account?.name),
    status: account?.status,
  };
};

const isActiveLocalAccount = (status) => status === true || Number(status) === 1 || trimText(status).toLowerCase() === 'active';

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

  const accountResult = await requestLocalPublisher('/getAccounts?nocheck=1', {
    timeoutMs: 15000,
    fetchImpl,
    baseUrl,
  });
  const matchingAccounts = (Array.isArray(accountResult?.data) ? accountResult.data : [])
    .map(normalizeLocalAccount)
    .filter((account) => account.name === normalizedAccountName && isActiveLocalAccount(account.status) && account.cookie && Number.isInteger(account.type) && account.type > 0);
  if (!matchingAccounts.length) throw localPublisherError('', `本地没有找到有效账号“${normalizedAccountName}”`);

  const accountsByType = new Map();
  matchingAccounts.forEach((account) => {
    accountsByType.set(account.type, (accountsByType.get(account.type) || []).concat(account.cookie));
  });

  for (const [type, accountCookies] of accountsByType) {
    await requestLocalPublisher('/postVideo', {
      method: 'POST',
      body: buildLocalPublishPayload({ type, title, topics, filePath, accountCookies, publishAt, publishNow }),
      timeoutMs: 300000,
      fetchImpl,
      baseUrl,
    });
  }

  return {
    filePath,
    accountCount: matchingAccounts.length,
    platformCount: accountsByType.size,
  };
}

export function normalizePublishTopics(value) {
  const topics = Array.isArray(value) ? value : String(value || '').split(/[#,，、;；\n]+/);
  return [...new Set(topics.map(trimText).filter(Boolean))];
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
