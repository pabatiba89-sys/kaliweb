const withoutEmptyValues = (payload = {}) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ''),
);

const objectOf = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const listOf = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
};
const urlOf = (value) => typeof value === 'string' ? value : value?.url || value?.src || '';
const booleanOf = (value, fallback = true) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return !['0', 'false', 'no', 'off'].includes(String(value).trim().toLowerCase());
};

export function normalizeAIVideoTopics(value) {
  const topics = Array.isArray(value) ? value : String(value || '').split(/[#,，、;；\n]+/);
  return [...new Set(topics.map((topic) => String(topic || '').trim()).filter(Boolean))];
}

export function buildAIVideoPublishPayload({ videoId, title, topics, accountId, publishAt, publishNow = false } = {}) {
  return {
    ai_video_id: Number(videoId),
    title: String(title || '').trim(),
    topics: normalizeAIVideoTopics(topics),
    publish_account_id: Number(accountId),
    publish_time: String(publishAt || '').replace('T', ' ').trim(),
    publish_now: Boolean(publishNow),
  };
}

export function buildAIVideoPromptInstruction(prompt, context = {}) {
  const requirement = String(prompt || '').trim();
  const model = String(context.model || context.modelName || '').trim();
  const settings = [
    context.duration ? `${context.duration}s` : '',
    context.resolution ? String(context.resolution).toUpperCase() : '',
    context.aspectRatio || context.aspect_ratio || '',
    context.generateAudio === true ? 'audio enabled' : context.generateAudio === false ? 'silent output' : '',
  ].filter(Boolean).join(' · ');

  return [
    '你是专业的 AI 视频导演提示词助手。请把用户的想法改写成一段可直接提交给视频生成模型的完整提示词。',
    '提示词应具体描述主体、动作、环境、时间、光线、构图、镜头景别、镜头运动、节奏、视觉风格和氛围；需要声音时补充环境声、对白或音乐方向。',
    '保持用户需求的主要语言。只输出最终提示词正文，不要标题、前缀、解释、分析、Markdown、JSON 或多个方案，也不要改写成分镜编号列表。',
    model ? `当前模型：${model}` : '',
    settings ? `当前生成设置：${settings}` : '',
    '',
    `用户想法：${requirement}`,
  ].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join('\n');
}

export function getAIVideoRemakeDraft(record = {}) {
  const source = objectOf(record.raw || record);
  const input = objectOf(firstValue(source.input, source.input_json, record.input));
  const pricing = objectOf(firstValue(source.pricing_snapshot, source.pricingSnapshot, record.pricingSnapshot));
  const model = String(firstValue(record.model, source.model, source.model_key, source.modelKey) || 'seedance-2-fast');
  const prompt = String(firstValue(record.prompt, source.prompt, input.prompt) || '');
  const firstFrameUrl = String(firstValue(input.first_frame_url, input.firstFrameUrl) || '');
  const lastFrameUrl = String(firstValue(input.last_frame_url, input.lastFrameUrl) || '');
  const imageUrls = listOf(firstValue(input.reference_image_urls, input.referenceImageUrls, input.image_urls, input.imageUrls)).map(urlOf).filter(Boolean);
  const videoUrls = listOf(firstValue(input.reference_video_urls, input.referenceVideoUrls, input.video_list, input.videoList)).map(urlOf).filter(Boolean);
  const audioUrls = listOf(firstValue(input.reference_audio_urls, input.referenceAudioUrls)).map(urlOf).filter(Boolean);
  const explicitDurations = listOf(firstValue(input.reference_video_durations, input.referenceVideoDurations)).map(Number);
  const totalInputSeconds = Number(firstValue(pricing.input_video_seconds, pricing.inputVideoSeconds, input.reference_video_duration, input.referenceVideoDuration)) || 0;
  const sharedVideoDuration = videoUrls.length && totalInputSeconds > 0 ? totalInputSeconds / videoUrls.length : 0;
  const isKling = model === 'kling-2.6';
  const isOmni = model === 'gemini-omni-1.1-flash';
  let mode = String(firstValue(record.mode, source.mode) || '');

  if (isOmni) {
    mode = firstFrameUrl || lastFrameUrl
      ? 'first-last-frame'
      : imageUrls.length || videoUrls.length || listOf(input.character_ids || input.characterIds).length || listOf(input.audio_ids || input.audioIds).length
        ? 'multimodal'
        : 'text-to-video';
  } else if (!mode) {
    mode = firstFrameUrl || lastFrameUrl
      ? (isKling ? 'image-to-video' : 'first-last-frame')
      : imageUrls.length || videoUrls.length || audioUrls.length
        ? 'reference-to-video'
        : 'text-to-video';
  }

  const klingFrameUrl = isKling && mode === 'image-to-video' ? imageUrls[0] || firstFrameUrl : firstFrameUrl;
  const references = {
    images: isKling ? [] : imageUrls.map((url, index) => ({ id: `remake-image-${index}`, url, type: 'image', name: `Reference image ${index + 1}` })),
    videos: videoUrls.map((url, index) => ({
      id: `remake-video-${index}`,
      url,
      type: 'video',
      name: `Reference video ${index + 1}`,
      duration: explicitDurations[index] > 0 ? explicitDurations[index] : sharedVideoDuration,
    })),
    audios: audioUrls.map((url, index) => ({ id: `remake-audio-${index}`, url, type: 'audio', name: `Reference audio ${index + 1}` })),
  };

  return {
    form: {
      model,
      mode,
      prompt,
      duration: Number(firstValue(record.duration, source.duration, input.duration)) || 5,
      resolution: String(firstValue(record.resolution, source.resolution, input.resolution) || '').toLowerCase(),
      aspectRatio: String(firstValue(record.aspectRatio, source.aspect_ratio, source.aspectRatio, input.aspect_ratio, input.aspectRatio) || '9:16'),
      generateAudio: booleanOf(firstValue(source.generate_audio, source.generateAudio, input.generate_audio, input.generateAudio, input.sound), true),
      firstFrameUrl: klingFrameUrl,
      lastFrameUrl,
      seed: String(firstValue(input.seed) || ''),
      characterIds: listOf(firstValue(input.character_ids, input.characterIds)).join(', '),
      audioIds: listOf(firstValue(input.audio_ids, input.audioIds)).join(', '),
    },
    references,
  };
}

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
