const cleanTopic = (value) => String(value || '').replace(/\s+/g, '').trim();

export function normalizePublishTopics(value) {
  const topics = Array.isArray(value) ? value : String(value || '').split(/[#,，、;；\n]+/);
  return [...new Set(topics.map(cleanTopic).filter(Boolean))];
}
