import { useEffect, useRef, useState } from 'react';
import { AudioLines, Download, FileVideo, RefreshCw } from 'lucide-react';
import { extractVideoAudio } from './videoAudio.js';

export default function VideoAudioPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const active = useRef(true);
  const locked = useRef(false);
  const outputUrl = useRef('');
  const input = useRef(null);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
    };
  }, []);

  const clearResult = () => {
    if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
    outputUrl.current = '';
    setResult(null);
    setMessage('');
  };

  const extract = async () => {
    if (!file || locked.current) return;
    locked.current = true;
    clearResult();
    setBusy(true);
    try {
      const audio = await extractVideoAudio(file);
      if (!active.current) return;
      outputUrl.current = URL.createObjectURL(audio.blob);
      setResult({ ...audio, url: outputUrl.current });
    } catch (error) {
      if (active.current) setMessage(error.message);
    } finally {
      locked.current = false;
      if (active.current) setBusy(false);
    }
  };

  return (
    <div className="tts-page video-audio-page">
      <section className="tts-hero">
        <div><h1>Video to Audio</h1><p>从本地视频提取音轨，试听后下载 WAV。文件仅在当前浏览器中处理。</p></div>
        <div className="tts-hero__signal" aria-hidden="true"><AudioLines size={36} /></div>
      </section>
      <section className="tts-compose-card video-audio-card" aria-busy={busy}>
        <div>
          <input ref={input} type="file" accept=".mp4,.mov,video/mp4,video/quicktime" hidden disabled={busy} onChange={(event) => {
            const video = event.target.files?.[0];
            event.target.value = '';
            if (!video) return;
            clearResult();
            setFile(video);
          }} />
          <button className="outline-button" type="button" disabled={busy} onClick={() => input.current?.click()}><FileVideo size={18} />选择视频</button>
          {file && <p className="video-audio-filename" translate="no">{file.name}</p>}
          <p>支持 MP4、MOV，最多 5 分钟、100 MB。</p>
        </div>
        <button className="primary-button" type="button" disabled={!file || busy} onClick={extract}>
          {busy ? <><RefreshCw size={17} className="is-spinning" />正在提取音频…</> : <><AudioLines size={17} />提取音频</>}
        </button>
      </section>
      {message && <div role="alert" className="video-list-message is-error">{message}</div>}
      {result && <section className="tts-compose-card video-audio-card" aria-label="提取结果">
        <strong className="video-audio-filename" translate="no">{result.name}</strong>
        <audio src={result.url} controls preload="metadata" aria-label="试听音频" />
        <a className="primary-button" href={result.url} download={result.name}><Download size={17} />下载 WAV</a>
      </section>}
    </div>
  );
}
