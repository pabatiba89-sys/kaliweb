export const VIDEO_AUDIO_MAX_BYTES = 100 * 1024 * 1024;
export const VIDEO_AUDIO_MAX_SECONDS = 300;

export function encodeAudioWav(audio) {
  const { numberOfChannels: channels, length, sampleRate } = audio;
  const dataBytes = length * channels * 2;
  const header = new DataView(new ArrayBuffer(44));
  const write = (offset, text) => [...text].forEach((character, index) => header.setUint8(offset + index, character.charCodeAt(0)));
  write(0, 'RIFF');
  header.setUint32(4, 36 + dataBytes, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  header.setUint32(16, 16, true);
  header.setUint16(20, 1, true);
  header.setUint16(22, channels, true);
  header.setUint32(24, sampleRate, true);
  header.setUint32(28, sampleRate * channels * 2, true);
  header.setUint16(32, channels * 2, true);
  header.setUint16(34, 16, true);
  write(36, 'data');
  header.setUint32(40, dataBytes, true);
  const pcm = new DataView(new ArrayBuffer(dataBytes));
  const samples = Array.from({ length: channels }, (_, index) => audio.getChannelData(index));
  for (let frame = 0; frame < length; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, samples[channel][frame]));
      pcm.setInt16((frame * channels + channel) * 2, Math.round(sample * (sample < 0 ? 32768 : 32767)), true);
    }
  }
  return new Blob([header, pcm], { type: 'audio/wav' });
}

export async function extractVideoAudio(file) {
  if (!/\.(mp4|mov)$/i.test(file.name)) throw new Error('请选择 MP4 或 MOV 视频。');
  if (!globalThis.OfflineAudioContext) throw new Error('当前浏览器不支持提取音频。');

  const sourceUrl = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'metadata';
  let timer;
  try {
    await new Promise((resolve, reject) => {
      const invalid = () => reject(new Error('无法读取视频，请选择可播放的 MP4 或 MOV 文件。'));
      timer = setTimeout(invalid, 10000);
      video.onloadedmetadata = resolve;
      video.onerror = invalid;
      video.src = sourceUrl;
    });
    if (!video.videoWidth || !Number.isFinite(video.duration) || video.duration <= 0) {
      throw new Error('无法读取视频，请选择可播放的 MP4 或 MOV 文件。');
    }
    if (video.duration > VIDEO_AUDIO_MAX_SECONDS) throw new Error('视频不能超过 5 分钟。');
  } finally {
    clearTimeout(timer);
    video.onloadedmetadata = video.onerror = null;
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(sourceUrl);
  }

  let audio;
  try {
    audio = await new OfflineAudioContext(1, 1, 44100).decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new Error('未找到可提取的音轨，或当前浏览器不支持此音频编码。');
  }
  if (audio.duration > VIDEO_AUDIO_MAX_SECONDS + 0.1) throw new Error('视频不能超过 5 分钟。');
  if (audio.numberOfChannels > 2) throw new Error('请选择带有单声道或立体声音轨的视频。');
  return { blob: encodeAudioWav(audio), name: file.name.replace(/\.[^.]+$/, '') + '.wav', duration: audio.duration };
}
