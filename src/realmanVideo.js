const cleanText = (value) => String(value ?? '').trim();

const getMediaUrl = (item = {}) => cleanText(
  item.url
  || item.fileUrl
  || item.file_url
  || item.imageUrl
  || item.image_url
  || item.videoUrl
  || item.video_url,
);

export const buildRealmanPackagingPayload = ({ sourceVideo = {}, title = '', topic = '', language = 'zh-CN', template = {}, music = {}, cover = {}, coverTemplate = {}, materials = [] } = {}) => {
  const videoUrl = cleanText(sourceVideo.videoUrl || sourceVideo.video_url || sourceVideo.url);
  const templateId = cleanText(template.id || template.styleId || template.style_id || template.videoTemplateId || template.video_template_id);
  const coverTemplateId = cleanText(coverTemplate.id || coverTemplate.templateId || coverTemplate.template_id || coverTemplate.coverTemplateId || coverTemplate.cover_template_id);
  const coverTemplateName = cleanText(coverTemplate.title || coverTemplate.name || coverTemplate.templateName || coverTemplate.template_name);
  const coverTemplatePreviewUrl = getMediaUrl(coverTemplate) || cleanText(coverTemplate.cover || coverTemplate.previewUrl || coverTemplate.preview_url);
  const coverUrl = coverTemplateId ? '' : (typeof cover === 'string' ? cleanText(cover) : getMediaUrl(cover));
  const normalizedTopic = cleanText(topic);
  const duration = Math.max(1, Math.ceil(Number(sourceVideo.duration || sourceVideo.durationSeconds || sourceVideo.duration_seconds) || 1));
  const normalizedMaterials = materials.map((item) => ({
    type: item.type === 'video' ? 'video' : 'image',
    fileUrl: getMediaUrl(item),
  })).filter((item) => item.fileUrl);
  const audioUrl = cleanText(music.audioUrl || music.audio_url || music.url);
  const packRules = {
    headerSwitch: true,
    materialSwitch: normalizedMaterials.length > 0,
    ...(audioUrl ? { backgroundMusic: { audioSwitch: true, audioUrl, url: audioUrl, volume: 0.3 } } : {}),
  };
  const processRules = coverUrl || coverTemplateId ? {
    firstFrameCover: {
      coverSwitch: true,
      ...(coverTemplateId ? { templateId: coverTemplateId } : { imageUrl: coverUrl }),
    },
  } : {};

  return {
    title: cleanText(title),
    topic: normalizedTopic,
    tags: normalizedTopic,
    tag: normalizedTopic,
    styleId: templateId,
    videoTemplateId: templateId,
    videoUrl,
    sourceVideoUrl: videoUrl,
    coverUrl,
    cover: coverUrl,
    cover_url: coverUrl,
    coverTemplateId,
    coverplate: coverTemplateId,
    coverTemplateName,
    coverTemplateImageUrl: coverTemplatePreviewUrl,
    coverTemplatePreviewUrl,
    language: cleanText(language) || 'zh-CN',
    duration,
    durationSeconds: duration,
    videoDurationSeconds: duration,
    materials: normalizedMaterials,
    materialSoundSwitch: false,
    packRules,
    processRules,
    shanjianData: {
      title: cleanText(title),
      styleId: templateId,
      videoUrl,
      coverTemplateId,
      coverTemplateName,
      language: cleanText(language) || 'zh-CN',
      materials: normalizedMaterials,
      materialSoundSwitch: false,
      packRules,
      processRules,
    },
  };
};
