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

export const buildRealmanPackagingPayload = ({
  sourceVideo = {},
  title = '',
  topic = '',
  language = 'zh-CN',
  template = {},
  music = {},
  cover = {},
  coverTemplate = {},
  materials = [],
  useBackgroundMusic = true,
  useCover = true,
} = {}) => {
  const videoUrl = cleanText(sourceVideo.videoUrl || sourceVideo.video_url || sourceVideo.url);
  const templateId = cleanText(template.id || template.styleId || template.style_id || template.videoTemplateId || template.video_template_id);
  const backgroundMusicEnabled = Boolean(useBackgroundMusic);
  const coverEnabled = Boolean(useCover);
  const coverTemplateId = coverEnabled ? cleanText(coverTemplate.id || coverTemplate.templateId || coverTemplate.template_id || coverTemplate.coverTemplateId || coverTemplate.cover_template_id) : '';
  const coverTemplateName = coverEnabled ? cleanText(coverTemplate.title || coverTemplate.name || coverTemplate.templateName || coverTemplate.template_name) : '';
  const coverTemplatePreviewUrl = coverEnabled ? getMediaUrl(coverTemplate) || cleanText(coverTemplate.cover || coverTemplate.previewUrl || coverTemplate.preview_url) : '';
  const coverUrl = coverEnabled ? (typeof cover === 'string' ? cleanText(cover) : getMediaUrl(cover)) : '';
  const normalizedTopic = cleanText(topic);
  const duration = Math.max(1, Math.ceil(Number(sourceVideo.duration || sourceVideo.durationSeconds || sourceVideo.duration_seconds) || 1));
  const normalizedMaterials = materials.map((item) => ({
    type: item.type === 'video' ? 'video' : 'image',
    fileUrl: getMediaUrl(item),
  })).filter((item) => item.fileUrl);
  const audioUrl = backgroundMusicEnabled ? cleanText(music.audioUrl || music.audio_url || music.url) : '';
  const packRules = {
    headerSwitch: true,
    materialSwitch: normalizedMaterials.length > 0,
    ...(!backgroundMusicEnabled
      ? { backgroundMusic: { audioSwitch: false, audioUrl: '', url: '', volume: 0.3 } }
      : audioUrl
        ? { backgroundMusic: { audioSwitch: true, audioUrl, url: audioUrl, volume: 0.3 } }
        : {}),
  };
  const processRules = !coverEnabled
    ? { firstFrameCover: { coverSwitch: false } }
    : coverUrl || coverTemplateId
      ? {
          firstFrameCover: {
            coverSwitch: true,
            ...(coverTemplateId ? { templateId: coverTemplateId } : {}),
            ...(coverUrl ? { imageUrl: coverUrl } : {}),
          },
        }
      : {};

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
    useBackgroundMusic: backgroundMusicEnabled,
    useCover: coverEnabled,
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
      useBackgroundMusic: backgroundMusicEnabled,
      useCover: coverEnabled,
      packRules,
      processRules,
    },
  };
};
