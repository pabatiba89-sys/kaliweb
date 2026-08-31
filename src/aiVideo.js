const withoutEmptyValues = (payload = {}) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ''),
);

export function buildAIVideoPayload(form = {}, references = {}) {
  const images = Array.isArray(references.images) ? references.images : [];
  const videos = Array.isArray(references.videos) ? references.videos : [];
  const audios = Array.isArray(references.audios) ? references.audios : [];
  const imageUrls = images.map((item) => item?.url).filter(Boolean);
  const videoUrls = videos.map((item) => item?.url).filter(Boolean);
  const audioUrls = audios.map((item) => item?.url).filter(Boolean);
  const videoDurations = videos.map((item) => Number(item?.duration)).filter((value) => value > 0);
  const isKling = form.model === 'kling-2.6';
  const isOmni = form.model === 'gemini-omni-1.1-flash';
  const isH3 = form.model === 'minimax-h3';
  const usesFrames = form.mode === 'first-last-frame' || form.mode === 'image-to-video';
  const usesReferences = form.mode === 'reference-to-video' || form.mode === 'multimodal';
  const omniHasVideo = isOmni && videoUrls.length > 0;
  const common = {
    model: form.model,
    prompt: String(form.prompt || '').trim(),
    duration: omniHasVideo ? undefined : Number(form.duration),
    resolution: form.resolution || undefined,
    aspect_ratio: form.aspectRatio || undefined,
    generate_audio: Boolean(form.generateAudio),
  };

  if (isKling) {
    return withoutEmptyValues({
      ...common,
      mode: form.mode,
      sound: Boolean(form.generateAudio),
      image_urls: form.mode === 'image-to-video' && form.firstFrameUrl ? [form.firstFrameUrl] : undefined,
      resolution: undefined,
    });
  }

  if (isOmni) {
    return withoutEmptyValues({
      ...common,
      first_frame_url: form.mode === 'first-last-frame' ? form.firstFrameUrl : undefined,
      last_frame_url: form.mode === 'first-last-frame' ? form.lastFrameUrl : undefined,
      image_urls: form.mode === 'multimodal' && imageUrls.length ? imageUrls : undefined,
      video_list: form.mode === 'multimodal' && videoUrls.length ? videoUrls.map((url) => ({ url })) : undefined,
      character_ids: form.mode === 'multimodal' ? String(form.characterIds || '').split(',').map((value) => value.trim()).filter(Boolean) : undefined,
      audio_ids: form.mode === 'multimodal' ? String(form.audioIds || '').split(',').map((value) => value.trim()).filter(Boolean) : undefined,
      seed: form.seed ? Number(form.seed) : undefined,
    });
  }

  return withoutEmptyValues({
    ...common,
    ...(isH3 ? { mode: form.mode } : {}),
    first_frame_url: usesFrames ? form.firstFrameUrl : undefined,
    last_frame_url: usesFrames ? form.lastFrameUrl : undefined,
    reference_image_urls: usesReferences && imageUrls.length ? imageUrls : undefined,
    reference_video_urls: usesReferences && videoUrls.length ? videoUrls : undefined,
    reference_video_durations: usesReferences && videoDurations.length ? videoDurations : undefined,
    reference_audio_urls: usesReferences && audioUrls.length ? audioUrls : undefined,
  });
}
