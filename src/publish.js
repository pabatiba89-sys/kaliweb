const trimText = (value) => String(value || '').trim();

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
