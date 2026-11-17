import { useEffect, useRef, useState } from 'react';
import { apiFetch, uploadFile } from './api.js';
import { fetchRealmanVideoFile, groupRealmanSubtitles, editRealmanSubtitleCharacters } from './realmanSubtitles.js';
import { extractVideoAudio } from './videoAudio.js';

export function useRealmanSubtitles(getUploadedUrl, scope) {
  const [groups, setGroups] = useState([]);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [canResume, setCanResume] = useState(false);
  const active = useRef(null);
  const task = useRef(null);

  const clear = () => {
    active.current?.abort();
    active.current = null;
    task.current = null;
    setGroups([]);
    setStage('');
    setError('');
    setCanResume(false);
  };

  useEffect(() => {
    clear();
    return () => { active.current?.abort(); active.current = null; };
  }, [scope]);

  const recognize = async ({ file, url, language }, resume = false) => {
    if (active.current) return;
    const controller = new AbortController();
    const { signal } = controller;
    active.current = controller;
    setError('');
    setCanResume(false);
    let timer;
    let timedOut = false;
    try {
      if (!resume || !task.current) {
        task.current = null;
        setStage('正在提取音频…');
        let video = file;
        if (!video) {
          timer = setTimeout(() => controller.abort(), 45000);
          try {
            video = await fetchRealmanVideoFile(url, signal);
          } catch {
            if (active.current !== controller) return;
            throw new Error('无法读取在线成片，请下载视频后从本地选择。');
          } finally {
            clearTimeout(timer);
          }
        }
        if (signal.aborted) return;
        const { blob } = await extractVideoAudio(video);
        if (signal.aborted) return;
        setStage('正在上传识别用音频…');
        const upload = await uploadFile(new File([blob], 'subtitle-audio.wav', { type: 'audio/wav' }), { source: 'realman-subtitle-audio' });
        if (signal.aborted) return;
        const audioUrl = upload.ok && getUploadedUrl(upload);
        if (!audioUrl) throw new Error('音频上传失败，请重试。');
        setStage('正在识别字幕…');
        const created = await apiFetch('/api/shanjian/asr', { method: 'POST', body: { audioUrl, language }, timeoutMs: 40000 });
        if (signal.aborted) return;
        if (!created.ok || !created.data?.task_id) throw new Error(created.message || '字幕识别提交失败，请重试。');
        task.current = created.data.task_id;
      }

      setStage('正在识别字幕…');
      const deadline = Date.now() + 180000;
      let attempt = 0;
      let failedChecks = 0;
      while (!signal.aborted && Date.now() < deadline) {
        // Prefer the stored callback result; ask the provider periodically if it has not arrived.
        const result = await apiFetch('/api/shanjian/asr/' + encodeURIComponent(task.current), { params: attempt++ % 5 === 4 ? { refresh: 1 } : {}, timeoutMs: 23000 });
        if (signal.aborted) return;
        if (result.ok) {
          failedChecks = 0;
          if (result.data?.status === 'succeeded') {
            task.current = null;
            const next = groupRealmanSubtitles(result.data.subtitle ?? result.data.subtitles);
            if (!next.length) throw new Error('未识别出可编辑的字幕，请检查视频中的人声。');
            setGroups(next);
            return;
          }
          if (result.data?.status === 'failed') {
            task.current = null;
            throw new Error(result.data.error_msg || '字幕识别失败，请重试。');
          }
        } else if (++failedChecks >= 3) {
          throw new Error('暂时无法查询识别结果，请继续查询。');
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      if (!signal.aborted) {
        timedOut = true;
        throw new Error('字幕还在识别，可以继续查询。');
      }
    } catch (failure) {
      if (active.current === controller) {
        setError(failure.message);
        setCanResume(timedOut || Boolean(task.current));
      }
    } finally {
      if (active.current === controller) {
        active.current = null;
        setStage('');
      }
    }
  };

  return {
    groups, stage, error, canResume, clear, recognize,
    isBusy: () => Boolean(active.current),
    editCharacters: (groupIndex, itemIndex, text) => setGroups((current) => editRealmanSubtitleCharacters(current, groupIndex, itemIndex, text)),
  };
}
