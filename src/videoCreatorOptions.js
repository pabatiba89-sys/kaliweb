const hasValue = (value) => value !== undefined && value !== null && value !== '';

const parseBoolean = (value, fallback = true) => {
  if (!hasValue(value)) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value).trim().toLowerCase();
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  return fallback;
};

const findFlag = (sources, keys) => {
  for (const source of sources) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
    for (const key of keys) {
      if (hasValue(source[key])) return source[key];
    }
  }
  return undefined;
};

export const resolveCreatorOptionalMedia = (...sources) => ({
  useBackgroundMusic: parseBoolean(findFlag(sources, ['useBackgroundMusic', 'use_background_music']), true),
  useCover: parseBoolean(findFlag(sources, ['useCover', 'use_cover']), true),
});

export const buildCreatorOptionalMedia = ({
  useBackgroundMusic = true,
  useCover = true,
  musicUrl = '',
  musicVolume = 1,
  coverTemplateId = '',
  coverUrl = '',
} = {}) => {
  const backgroundMusicEnabled = Boolean(useBackgroundMusic);
  const coverEnabled = Boolean(useCover);
  const activeMusicUrl = backgroundMusicEnabled ? String(musicUrl || '').trim() : '';
  const activeCoverTemplateId = coverEnabled ? String(coverTemplateId || '').trim() : '';
  const activeCoverUrl = coverEnabled ? String(coverUrl || '').trim() : '';

  return {
    useBackgroundMusic: backgroundMusicEnabled,
    useCover: coverEnabled,
    musicUrl: activeMusicUrl,
    coverTemplateId: activeCoverTemplateId,
    coverUrl: activeCoverUrl,
    bgmusic: { url: activeMusicUrl },
    backgroundMusic: {
      audioSwitch: backgroundMusicEnabled && Boolean(activeMusicUrl),
      audioUrl: activeMusicUrl,
      url: activeMusicUrl,
      volume: musicVolume,
    },
    firstFrameCover: coverEnabled
      ? { coverSwitch: true, templateId: activeCoverTemplateId, imageUrl: activeCoverUrl }
      : { coverSwitch: false },
  };
};
