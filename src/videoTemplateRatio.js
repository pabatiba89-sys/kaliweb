export const DEFAULT_VIDEO_TEMPLATE_ASPECT_RATIO = '9:16';

export const VIDEO_TEMPLATE_ASPECT_RATIOS = ['9:16', '16:9'];

const normalizeRatioValue = (value) => {
  const text = String(value ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/：/g, ':');
  if (!text) return '';
  if (/portrait|vertical|竖|豎|纵|縱/.test(text)) return '9:16';
  if (/landscape|horizontal|横|橫/.test(text)) return '16:9';

  const match = text.match(/(\d+(?:\.\d+)?)[x×:/](\d+(?:\.\d+)?)/);
  if (!match) return '';
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return '';

  const valueRatio = width / height;
  if (Math.abs(valueRatio - 9 / 16) <= 0.04) return '9:16';
  if (Math.abs(valueRatio - 16 / 9) <= 0.08) return '16:9';
  return '';
};

export const getVideoTemplateAspectRatio = (item = {}) => {
  const candidates = [
    item.aspectRatio,
    item.aspect_ratio,
    item.ratio,
    item.videoRatio,
    item.video_ratio,
    item.screenRatio,
    item.screen_ratio,
    item.orientation,
    item.direction,
    item.size,
    item.resolution,
  ];
  for (const candidate of candidates) {
    const ratio = normalizeRatioValue(candidate);
    if (ratio) return ratio;
  }

  const width = Number(item.width || item.videoWidth || item.video_width || item.templateWidth || item.template_width);
  const height = Number(item.height || item.videoHeight || item.video_height || item.templateHeight || item.template_height);
  return width && height ? normalizeRatioValue(`${width}:${height}`) : '';
};

export const filterVideoTemplatesByAspectRatio = (templates = [], aspectRatio = DEFAULT_VIDEO_TEMPLATE_ASPECT_RATIO) => (
  templates.filter((template) => (template.aspectRatio || getVideoTemplateAspectRatio(template.raw || template)) === aspectRatio)
);
