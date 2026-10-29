import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Maximize2, Minimize2, RefreshCw, Video, Music2, Image, Pause, Play, Library, ScanFace, Mic2, AudioLines, ChevronDown } from 'lucide-react';
import { apiFetch, getAccessToken } from '../api.js';
import { translateStatic, useLocaleCatalog } from '../i18n.js';
import { OutputNumber, OutputVisual, useWorkspaceMotion } from './WorkspaceMotion.jsx';
import { buildStatisticsQueries, loadStatisticsDashboard, normalizeStatisticsOptions, statisticsDay, statisticsPeriodLabel, statisticsRequest } from '../productionStats.js';

const resourceIcons = { video: Video, music: Music2, image: Image, material: Library, digital_human: ScanFace, voice: Mic2, speech: AudioLines };
const previewResources = [{value:'video',label:'视频'}, {value:'music',label:'音乐'}, {value:'image',label:'图片'}];
const errorLabels = { auth: '登录已失效，请重新登录', forbidden: '无权查看所选成员或团队的数据', validation: '请选择有效日期范围，最多 366 天', unavailable: '统计数据暂不可用，请重试' };
const initialRequest = { key: '', data: null, error: null, loading: false };

export default function ProductionDashboard({ authVersion, language, onLogin, onCreate }) {
  const panel = useRef(null);
  const [optionsState, setOptionsState] = useState({data:null,error:null});
  const [filters, setFilters] = useState(null);
  const [report, setReport] = useState(initialRequest);
  const [todayReport, setTodayReport] = useState(initialRequest);
  const [revision, setRevision] = useState(0);
  const [optionsRevision, setOptionsRevision] = useState(0);
  const [full, setFull] = useState(false);
  const [day, setDay] = useState(statisticsDay);
  const [paused, setPaused] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const running = useWorkspaceMotion(panel, paused);
  const authed = Boolean(getAccessToken());
  const catalog = useLocaleCatalog(language);
  const tr = (value) => language === 'zh-CN' ? value : translateStatic(value, language, catalog);
  const options = optionsState.data;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActiveMetric((index) => (index + 1) % 3), 4200);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    const updateFull = () => setFull(document.fullscreenElement === panel.current);
    document.addEventListener('fullscreenchange', updateFull);
    return () => { document.removeEventListener('fullscreenchange', updateFull); };
  }, []);
  useEffect(() => {
    setDay(statisticsDay());
    setOptionsState({data:null,error:null});
    setFilters(null);
  }, [authed, authVersion]);
  useEffect(() => {
    let current = true;
    if (!authed) return;
    statisticsRequest('/api/statistics/options', undefined, apiFetch).then(normalizeStatisticsOptions).then((data) => {
      if (!current) return;
      setOptionsState({data,error:null});
      setFilters((value) => value || {...data.defaults, user_id: data.members.find((member) => member.is_self)?.value || ''});
    }).catch((error) => { if (current) setOptionsState({data:null,error:error.kind || 'unavailable'}); });
    return () => { current = false; };
  }, [authed, authVersion, optionsRevision]);

  const queries = useMemo(() => buildStatisticsQueries(filters, options, day), [options, filters, day]);
  const queryKey = queries.main ? `${authVersion}:${day}:${JSON.stringify(queries.main)}` : '';
  const todayKey = queries.today ? `${authVersion}:${day}:${JSON.stringify(queries.today)}` : '';
  const reuseToday = queries.reuseToday;
  useEffect(() => {
    let current = true;
    if (!authed || !queryKey) return;
    setReport((old) => ({key:queryKey,data:old.key === queryKey ? old.data : null,error:null,loading:true}));
    loadStatisticsDashboard(queries.main, apiFetch).then((data) => {
      if (current) setReport({key:queryKey,data,error:null,loading:false});
    }).catch((error) => { if (current) setReport({key:queryKey,data:null,error:error.kind || 'unavailable',loading:false}); });
    return () => { current = false; };
  }, [authed, queryKey, revision]);
  useEffect(() => {
    let current = true;
    if (!authed || !todayKey || reuseToday) return;
    setTodayReport({key:todayKey,data:null,error:null,loading:true});
    loadStatisticsDashboard(queries.today, apiFetch).then((data) => {
      if (current) setTodayReport({key:todayKey,data,error:null,loading:false});
    }).catch((error) => { if (current) setTodayReport({key:todayKey,data:null,error:error.kind || 'unavailable',loading:false}); });
    return () => { current = false; };
  }, [authed, todayKey, revision, reuseToday]);

  const data = authed && queryKey && report.key === queryKey ? report.data : null;
  const todayData = reuseToday ? data : (authed && todayReport.key === todayKey ? todayReport.data : null);
  // The daily goal always uses a separate today result when viewing history.
  const todayVideo = todayData?.summary.find((row) => row.value === 'video')?.period_count;
  const remaining = todayVideo == null ? null : Math.max(0, 3 - todayVideo);
  const error = optionsState.error || queries.error || (report.key === queryKey ? report.error : null);
  const loading = authed && !error && (!options || !queryKey || report.key !== queryKey || report.loading);
  const selectedResources = options?.resource_types.filter((item) => filters?.resource_types.includes(item.value)) || previewResources;
  const primary = selectedResources.filter((item) => ['video','music','image'].includes(item.value));
  const secondary = selectedResources.filter((item) => !['video','music','image'].includes(item.value));
  const periodLabel = data ? statisticsPeriodLabel(data, day) : filters?.period === 'today' ? '今日完成' : filters?.period === 'yesterday' ? '当日完成' : '期间完成';
  const refresh = () => { setDay(statisticsDay()); if (!options) setOptionsRevision((n) => n + 1); setRevision((n) => n + 1); };
  const updateFilter = (values) => { setDay(statisticsDay()); setFilters((value) => ({...value,...values})); };
  const toggleFull = async () => {
    if (full && !document.fullscreenElement) { setFull(false); return; }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (panel.current?.requestFullscreen) await panel.current.requestFullscreen();
      else setFull(true);
    } catch { setFull((value) => !value); }
  };
  const renderMetric = (resource, index, compact = false) => {
    const row = data?.summary.find((item) => item.value === resource.value);
    const Icon = resourceIcons[resource.value];
    return <article key={resource.value} className={`production-metric ${compact ? 'is-compact' : ''} ${activeMetric === index && !compact ? 'is-active' : ''}`} onMouseEnter={() => !compact && setActiveMetric(index)}>
      <div className="production-metric__label"><Icon size={18} /><span translate="no">{tr(resource.label)}</span><span className="production-metric__total-label">累计完成</span></div>
      <strong><OutputNumber value={row?.total_count} language={language} running={running} /><span className="production-metric__unit" translate="no">{language.startsWith('zh') ? tr(resource.unit || '') : ''}</span></strong>
      {!compact && <OutputVisual kind={resource.value} />}
      <footer><span key={periodLabel}>{periodLabel}</span><b><OutputNumber value={row?.period_count} language={language} running={running} /></b>{!compact && <span className="production-metric__track" aria-hidden="true"><i /></span>}</footer>
    </article>;
  };
  return <section ref={panel} className={`production-dashboard ${full ? 'is-fullscreen' : ''}`} data-motion-running={running} aria-label="创作数据大屏">
    <div className="production-dashboard__ambient" aria-hidden="true"><i /><i /><i /></div>
    <div className="production-dashboard__header">
      <div className="production-dashboard__intro"><span>KALI · STUDIO</span><h1>持续创作，让品牌被看见。</h1></div>
      <div className="production-dashboard__tools">
        <time translate="no">{new Intl.DateTimeFormat(language, { dateStyle:'medium', timeZone:'Asia/Shanghai' }).format(new Date(`${day}T12:00:00+08:00`))}</time>
        <button key={paused ? 'resume' : 'pause'} className="icon-button" title={paused ? '播放动画' : '暂停动画'} aria-label={paused ? '播放动画' : '暂停动画'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
        <button className="icon-button" title="刷新" aria-label="刷新" disabled={loading || !authed} onClick={refresh}><RefreshCw size={16} className={loading ? 'is-spinning' : ''} /></button>
        <button key={full ? 'exit' : 'enter'} className="icon-button" title={full ? '退出大屏' : '全屏展示'} aria-label={full ? '退出大屏' : '全屏展示'} onClick={toggleFull}>{full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
      </div>
    </div>
    <div className="production-dashboard__section-label"><h2>创作数据大屏</h2><span className={`production-dashboard__sync ${loading ? 'is-syncing' : ''}`}><i aria-hidden="true" /><span>{!authed ? '登录查看创作数据' : loading ? '正在同步创作数据' : error ? '加载失败' : '手动刷新'}</span></span></div>
    {authed && options && filters && <div className="statistics-filters">
      <label><span>统计范围</span><select aria-label={tr('统计范围')} value={filters.scope} onChange={(event) => updateFilter({scope:event.target.value})} translate="no">{options.scopes.map((item) => <option key={item.value} value={item.value}>{tr(item.label)}</option>)}</select></label>
      {filters.scope === 'personal' && <label><span>成员</span><select aria-label={tr('成员')} value={filters.user_id} onChange={(event) => updateFilter({user_id:Number(event.target.value)})} translate="no">{options.members.map((member) => <option key={member.value} value={member.value}>{member.label}</option>)}</select></label>}
      <label><span>日期范围</span><select aria-label={tr('日期范围')} value={filters.period} onChange={(event) => updateFilter({period:event.target.value,start_date:'',end_date:''})} translate="no">{options.periods.map((item) => <option key={item.value} value={item.value}>{tr(item.label)}</option>)}</select></label>
      {filters.period === 'custom' && <><label><span>开始日期</span><input aria-label={tr('开始日期')} type="date" max={day} value={filters.start_date || ''} onChange={(event) => updateFilter({start_date:event.target.value})} /></label><label><span>结束日期</span><input aria-label={tr('结束日期')} type="date" min={filters.start_date} max={day} value={filters.end_date || ''} onChange={(event) => updateFilter({end_date:event.target.value})} /></label></>}
    </div>}
    {error && <div className="production-dashboard__status" role="alert"><span key={error}>{errorLabels[error] || errorLabels.unavailable}</span> <button onClick={error === 'auth' ? onLogin : refresh}>{error === 'auth' ? '登录查看创作数据' : '重试'}</button></div>}
    {primary.length > 0 && <div className="production-dashboard__metrics">{primary.map((resource,index) => renderMetric(resource,index))}</div>}
    {secondary.length > 0 && <div className="production-dashboard__metrics production-dashboard__secondary">{secondary.map((resource,index) => renderMetric(resource,index,true))}</div>}
    {!authed ? <div className="production-dashboard__signin"><span><Video size={18} /><span>每日视频目标</span><b translate="no">3</b><span>个视频</span></span><button className="primary-button" onClick={onLogin}>登录查看创作数据</button></div>
      : todayVideo != null ? <div className={`production-goal ${remaining ? 'needs-attention' : 'is-complete'}`} role="status">
        {remaining ? <AlertCircle size={27} /> : <CheckCircle2 size={27} />}
        <div><strong>{remaining ? '今日视频目标未达成' : '今日视频目标已达成'}</strong><p><span>每日视频目标</span> <b translate="no">{todayVideo} / 3</b>{remaining > 0 && <><span>还需制作</span> <b translate="no">{remaining}</b> <span>个视频</span></>}</p><progress max="3" value={Math.min(todayVideo,3)} /></div><button className="primary-button" onClick={onCreate}>制作视频</button>
      </div> : <p className="production-dashboard__status" role="status">{loading || todayReport.loading ? '正在同步创作数据' : '视频数据暂不可用，目标待确认'}</p>}
    {authed && options && filters && <details className="statistics-report"><summary><span>查看报表</span><ChevronDown size={14} /></summary>
      <div className="statistics-report__controls"><label><span>统计方式</span><select aria-label={tr('统计方式')} translate="no" value={filters.group_by} onChange={(event) => updateFilter({group_by:event.target.value})}>{options.group_by.map((item) => <option key={item.value} value={item.value}>{tr(item.label)}</option>)}</select></label>
        <fieldset><legend>资源类型</legend>{options.resource_types.map((item) => <label key={item.value}><input type="checkbox" checked={filters.resource_types.includes(item.value)} disabled={filters.resource_types.length === 1 && filters.resource_types[0] === item.value} onChange={(event) => updateFilter({resource_types:event.target.checked ? options.resource_types.map((type) => type.value).filter((key) => key === item.value || filters.resource_types.includes(key)) : filters.resource_types.filter((key) => key !== item.value)})} /><span translate="no">{tr(item.label)}</span></label>)}</fieldset>
      </div>
      {data && <div className="statistics-report__table-wrap"><table><caption translate="no">{data.start_date} — {data.end_date} · {data.timezone}</caption><thead><tr><th>{data.group_by === 'day' ? '日期' : '成员'}</th>{selectedResources.map((item) => <th key={item.value} translate="no">{tr(item.label)}</th>)}</tr></thead><tbody>{data.series.map((row) => <tr key={row.date || row.user_id}><th translate="no">{data.group_by === 'day' ? row.date : options.members.find((member) => member.value === row.user_id)?.label || `${tr('用户')} ${row.user_id}`}</th>{selectedResources.map((item) => <td key={item.value} translate="no">{new Intl.NumberFormat(language).format(row.counts[item.value])}</td>)}</tr>)}</tbody></table>{data.series.length === 0 && <p>暂无数据</p>}</div>}
    </details>}
    <p className="production-dashboard__note">按北京时间及创建日期统计当前可见资产；历史累计截至所选结束日期，数据会随资产及团队变更调整。</p>
  </section>;
}
