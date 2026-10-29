import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Maximize2, Minimize2, RefreshCw, Video, Music2, Image, Pause, Play } from 'lucide-react';
import { apiFetch, getAccessToken } from '../api.js';
import { OutputNumber, OutputVisual, useWorkspaceMotion } from './WorkspaceMotion.jsx';
import { localDay, loadProductionSource, productionSources, summarizeProduction } from '../productionStats.js';

export default function ProductionDashboard({ authVersion, language, onLogin, onCreate }) {
  const panel = useRef(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);
  const [full, setFull] = useState(false);
  const [day, setDay] = useState(localDay);
  const [paused, setPaused] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const running = useWorkspaceMotion(panel, paused);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActiveMetric((index) => (index + 1) % 3), 4200);
    return () => clearInterval(timer);
  }, [running]);
  const authed = Boolean(getAccessToken());
  useEffect(() => {
    const timer = setInterval(() => { setDay(localDay()); if (!document.hidden) setRevision((n) => n + 1); }, 60000);
    const updateFull = () => setFull(document.fullscreenElement === panel.current);
    document.addEventListener('fullscreenchange', updateFull);
    return () => { clearInterval(timer); document.removeEventListener('fullscreenchange', updateFull); };
  }, []);
  useEffect(() => { setResults({}); }, [authed, authVersion, day]);
  useEffect(() => {
    let current = true;
    if (!authed) { setResults({}); setLoading(false); return; }
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
  return <section ref={panel} className={`production-dashboard ${full ? 'is-fullscreen' : ''}`} data-motion-running={running} aria-label="创作数据大屏">
    <div className="production-dashboard__ambient" aria-hidden="true"><i /><i /><i /></div>
    <div className="production-dashboard__header">
      <div className="production-dashboard__intro"><span>KALI · STUDIO</span><h1>持续创作，让品牌被看见。</h1></div>
      <div className="production-dashboard__tools">
        <time translate="no">{new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(new Date())}</time>
        <button key={paused ? 'resume' : 'pause'} className="icon-button" title={paused ? '播放动画' : '暂停动画'} aria-label={paused ? '播放动画' : '暂停动画'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
        <button className="icon-button" title="刷新" aria-label="刷新" disabled={loading || !authed} onClick={() => setRevision((n) => n + 1)}><RefreshCw size={16} className={loading ? 'is-spinning' : ''} /></button>
        <button key={full ? 'exit' : 'enter'} className="icon-button" title={full ? '退出大屏' : '全屏展示'} aria-label={full ? '退出大屏' : '全屏展示'} onClick={toggleFull}>{full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
      </div>
    </div>
    <div className="production-dashboard__section-label"><h2>创作数据大屏</h2><span className={`production-dashboard__sync ${loading ? 'is-syncing' : ''}`}><i aria-hidden="true" /><span>{!authed ? '登录查看创作数据' : loading ? '正在同步创作数据' : pending ? '加载失败' : '每分钟自动同步'}</span></span></div>
    <div className="production-dashboard__metrics">
      {[[Video, '视频', 'video'], [Music2, '音乐', 'music'], [Image, '图片', 'image']].map(([Icon, label, kind], index) => {
        const value = metric(kind);
        return <article key={kind} className={`production-metric ${activeMetric === index ? 'is-active' : ''}`} onMouseEnter={() => setActiveMetric(index)}>
          <div className="production-metric__label"><Icon size={18} /><span>{label}</span><span className="production-metric__total-label">累计完成</span></div>
          <strong><OutputNumber value={value?.total} language={language} running={running} /></strong>
          <OutputVisual kind={kind} />
          <footer><span>今日完成</span><b><OutputNumber value={value?.today} language={language} running={running} /></b><span className="production-metric__track" aria-hidden="true"><i /></span></footer>
        </article>;
      })}
    </div>
    {!authed ? <div className="production-dashboard__signin"><span><Video size={18} /><span>每日视频目标</span><b translate="no">3</b><span>个视频</span></span><button className="primary-button" onClick={onLogin}>登录查看创作数据</button></div>
      : video ? <div className={`production-goal ${remaining ? 'needs-attention' : 'is-complete'}`} role="status">
        {remaining ? <AlertCircle size={27} /> : <CheckCircle2 size={27} />}
        <div><strong>{remaining ? '今日视频目标未达成' : '今日视频目标已达成'}</strong>
          <p><span>每日视频目标</span> <b translate="no">{video.today} / 3</b>{remaining > 0 && <><span>还需制作</span> <b translate="no">{remaining}</b> <span>个视频</span></>}</p>
          <progress max="3" value={Math.min(video.today, 3)} />
        </div><button className="primary-button" onClick={onCreate}>制作视频</button>
      </div> : <p className="production-dashboard__status" role="status">{loading ? '正在同步创作数据' : '视频数据暂不可用，目标待确认'}</p>}
    {pending && <p className="production-dashboard__status"><span>加载失败</span> <button onClick={() => setRevision((n) => n + 1)}>重试</button></p>}
    <p className="production-dashboard__note">统计当前账号及团队可见的成功作品；今日按作品创建日期统计。</p>
  </section>;
}
