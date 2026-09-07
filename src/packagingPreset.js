const firstText = (...values) => {
  for (const value of values) {
    const text = String(value ?? '').trim();
    if (text) return text;
  }
  return '';
};

export const getVoiceSpeakerId = (voice = {}) => firstText(
  voice.speakerId,
  voice.speaker_id,
  voice.raw?.speakerId,
  voice.raw?.speaker_id,
);

export const matchesVoiceIdentifier = (voice = {}, identifier = '') => {
  const target = firstText(identifier);
  return Boolean(target) && [voice.id, voice.speakerId, voice.speaker_id, voice.voiceId, voice.voice_id]
    .some((id) => firstText(id) === target);
};

export const buildPackagingPresetPayload = (editor = {}) => ({
  ...(editor.mode === 'edit' ? { id: editor.id } : {}),
  digitalHumanId: editor.human?.id,
  digitalHumanName: editor.human?.title,
  speakerId: getVoiceSpeakerId(editor.voice),
  coverUrl: editor.human?.cover || '',
  clipTemplateId: editor.videoTemplate?.id,
  clipTemplateName: editor.videoTemplate?.title,
  clipTemplateImageUrl: editor.videoTemplate?.cover || '',
  coverTemplateId: editor.coverTemplate?.id,
  coverTemplateName: editor.coverTemplate?.title,
  coverTemplateImageUrl: editor.coverTemplate?.cover || '',
  isDefault: Boolean(editor.isDefault),
});
