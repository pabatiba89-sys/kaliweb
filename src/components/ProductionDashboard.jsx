import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Maximize2, Minimize2, RefreshCw, Video, Music2, Image } from 'lucide-react';
import { apiFetch, getAccessToken } from '../api.js';
import { localDay, loadProductionSource, productionSources, summarizeProduction } from '../productionStats.js';

export default function ProductionDashboard({ authVersion, language, onLogin, onCreate }) {
  const panel = useRef(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);
  const [full, setFull] = useState(false);
  const [day, setDay] = useState(localDay);
  const authed = Boolean(getAccessToken());
  useEffect(() => {
    const timer = setInterval(() => { setDay(localDay()); if (!document.hidden) setRevision((n) => n + 1); }, 60000);
    const updateFull = () => setFull(document.fullscreenElement === panel.current);
    document.addEventListener('fullscreenchange', updateFull);
    return () => { clearInterval(timer); document.removeEventListener('fullscreenchange', updateFull); };
  }, []);
  useEffect(() => {
    let current = true;
    setResults({});
    if (!authed) return;
    setLoading(true);
    Promise.all(productionSources.map(async (source) => {
      try {
        const rows = await loadProductionSource(source, apiFetch, () => current);
        return [source.key, summarizeProduction(source, rows, day)];
      } catch { return [source.key, null]; }
    })).then((entries) => { if (current) { setResults(Object.fromEntries(entries)); setLoading(false); } });
    return () => { current = false; };
  }, [authed, authVersion, revision, day]);
  const metric = (kind) => {
    if (!authed) return null;
    const values = productionSources.filter((source) => source.kind === kind).map((source) => results[source.key]);
    return values.every(Boolean) ? values.reduce((sum, value) => ({ total: sum.total + value.total, today: sum.today + value.today }), { total: 0, today: 0 }) : null;
  };
  const video = metric('video');
  const remaining = video ? Math.max(0, 3 - video.today) : null;
  const pending = authed && !loading && productionSources.some((source) => !results[source.key]);
  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (panel.current?.requestFullscreen) await panel.current.requestFullscreen();
      else setFull((value) => !value);
    } catch { setFull((value) => !value); }
  };
  return <section ref={panel} className={`production-dashboard ${full ? 'is-fullscreen' : ''}`} aria-label="创作数据大屏">
    <div className="production-dashboard__header"><div><span>KALI · CREATIVE OUTPUT</span><h2>创作数据大屏</h2></div><div className="production-dashboard__tools"><time translate="no">{new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(new Date())}</time><button className="icon-button" title="刷新" aria-label="刷新" disabled={loading || !authed} onClick={() => setRevision((n) => n + 1)}><RefreshCw size={18} className={loading ? 'is-spinning' : ''} /></button><button key={full ? 'exit' : 'enter'} className="icon-button" title={full ? '退出大屏' : '全屏展示'} aria-label={full ? '退出大屏' : '全屏展示'} onClick={toggleFull}>{full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button></div></div>
    <div className="production-dashboard__metrics">{[['video', Video, '视频'], ['music', Music2, '音乐'], ['image', Image, '图片']].map(([kind, Icon, label]) => { const value = metric(kind); return <article key={kind}><div><Icon size={22} /><span>{label}</span></div><strong translate="no">{value ? new Intl.NumberFormat(language).format(value.total) : '—'}</strong><footer><span>今日完成</span><b translate="no">{value?.today ?? '—'}</b><span>累计完成</span></footer></article>; })}</div>
    {!authed ? <button className="primary-button" onClick={onLogin}>登录查看创作数据</button> : video ? <div className={`production-goal ${remaining ? 'needs-attention' : 'is-complete'}`} role="status">{remaining ? <AlertCircle size={27} /> : <CheckCircle2 size={27} />}<div><strong>{remaining ? '今日视频目标未达成' : '今日视频目标已达成'}</strong><p><span>每日视频目标</span> <b translate="no">{video.today} / 3</b>{remaining > 0 && <><span>还需制作</span> <b translate="no">{remaining}</b> <span>个视频</span></>}</p><progress max="3" value={Math.min(video.today, 3)} /></div><button className="primary-button" onClick={onCreate}>制作视频</button></div> : <p className="production-dashboard__status" role="status">{loading ? '正在同步创作数据' : '视频数据暂不可用，目标待确认'}</p>}
    {pending && <p className="production-dashboard__status"><span>加载失败</span> <button onClick={() => setRevision((n) => n + 1)}>重试</button></p>}
    <p className="production-dashboard__note">统计当前账号及团队可见的成功作品；今日按作品创建日期统计。</p>
  </section>;
}
