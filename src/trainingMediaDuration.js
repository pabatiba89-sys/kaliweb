export const TRAINING_MEDIA_MIN_DURATION = 30;
export const TRAINING_MEDIA_MAX_DURATION = 120;

export const getTrainingMediaDurationIssue = (duration) => {
  const seconds = Number(duration);
  if (!Number.isFinite(seconds) || seconds <= 0) return 'unreadable';
  if (seconds < TRAINING_MEDIA_MIN_DURATION) return 'too-short';
  if (seconds > TRAINING_MEDIA_MAX_DURATION) return 'too-long';
  return '';
};
