const cleanText = (value) => String(value ?? '').trim();

const getMediaUrl = (item = {}) => cleanText(
  item.url
  || item.fileUrl
  || item.file_url
  || item.videoUrl
  || item.video_url,
);

export const buildRealmanPackagingPayload = ({ sourceVideo = {}, title = '', language = 'zh-CN', template = {}, music = {}, materials = [] } = {}) => {
  const videoUrl = cleanText(sourceVideo.videoUrl || sourceVideo.video_url || sourceVideo.url);
  const templateId = cleanText(template.id || template.styleId || template.style_id || template.videoTemplateId || template.video_template_id);
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

  return {
    title: cleanText(title),
    styleId: templateId,
    videoTemplateId: templateId,
    videoUrl,
    sourceVideoUrl: videoUrl,
    language: cleanText(language) || 'zh-CN',
    duration,
    durationSeconds: duration,
    videoDurationSeconds: duration,
    materials: normalizedMaterials,
    materialSoundSwitch: false,
    packRules,
    shanjianData: {
      title: cleanText(title),
      styleId: templateId,
      videoUrl,
      language: cleanText(language) || 'zh-CN',
      materials: normalizedMaterials,
      materialSoundSwitch: false,
      packRules,
    },
  };
};

