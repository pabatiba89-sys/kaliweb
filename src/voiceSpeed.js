export const VOICE_SPEED_MIN = 0.2;
export const VOICE_SPEED_MAX = 2;
export const VOICE_SPEED_STEP = 0.1;
export const DEFAULT_VOICE_SPEED = 1;

export const normalizeVoiceSpeed = (value, fallback = DEFAULT_VOICE_SPEED) => {
  const parsed = Number(value);
  const fallbackValue = Number(fallback);
  const speed = Number.isFinite(parsed) && parsed > 0
    ? parsed
    : Number.isFinite(fallbackValue) && fallbackValue > 0 ? fallbackValue : DEFAULT_VOICE_SPEED;

  return Number(Math.min(VOICE_SPEED_MAX, Math.max(VOICE_SPEED_MIN, speed)).toFixed(1));
};

export const formatVoiceSpeed = (value) => normalizeVoiceSpeed(value).toFixed(1);

export const buildVoiceSpeedPayload = (value) => {
  const speed = normalizeVoiceSpeed(value);
  return {
    speed,
    voice_speed: speed,
    voiceSpeed: speed,
  };
};
