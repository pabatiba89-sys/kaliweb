import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Edit3, ScanFace, FileVideo, Music2, Image, Clapperboard, Send, Pause, Play } from 'lucide-react';
import { useWorkspaceMotion } from './WorkspaceMotion.jsx';

const creativeRoutes = [
  { label: '数字人', icon: ScanFace, page: 'video' },
  { label: 'AI 视频', icon: FileVideo, page: 'ai-video' },
  { label: '音乐', icon: Music2, page: 'music' },
  { label: '图片', icon: Image, page: 'image' },
];

export default function WorkspaceWorkflow({ onSelect, onStartVideo }) {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const running = useWorkspaceMotion(root, paused);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setHighlight((value) => (value + 1) % 4), 3600);
    return () => clearInterval(timer);
  }, [running]);
  const openResource = (page) => {
    if (page === 'video') onStartVideo({ productionType: 'oral' });
    else onSelect(page);
  };
  const singleStep = (index, title, Icon, open) => <li className={highlight === index ? 'is-highlighted' : ''}>
    <button type="button" className="workspace-workflow__card" onClick={open}>
      <span className="workspace-workflow__number" translate="no">{String(index + 1).padStart(2,'0')}</span>
      <span className="workspace-workflow__icon"><Icon size={23} /></span>
      <strong>{title}</strong>
    </button>
    {index < 3 && <span className="workspace-workflow__arrow" aria-hidden="true"><ArrowRight size={18} /></span>}
  </li>;
  return <section ref={root} className="workspace-workflow" data-motion-running={running} aria-label="制作流程">
    <div className="workspace-workflow__heading"><h2>制作流程</h2>
      <button type="button" key={paused ? 'play' : 'pause'} className="icon-button" aria-label={paused ? '播放动画' : '暂停动画'} title={paused ? '播放动画' : '暂停动画'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
    </div>
    <ol className="workspace-workflow__track">
      {singleStep(0,'文案',Edit3,() => onSelect('assistant'))}
      <li className={highlight === 1 ? 'is-highlighted' : ''}>
        <div className="workspace-workflow__card workspace-workflow__choices" role="group" aria-label="选择创作方式">
          <span className="workspace-workflow__number" translate="no">02</span>
          <h3>选择创作方式</h3>
          <div>{creativeRoutes.map(({label,icon:Icon,page}) => <button type="button" key={page} onClick={() => openResource(page)}><Icon size={17} /><span>{label}</span></button>)}</div>
        </div>
        <span className="workspace-workflow__arrow" aria-hidden="true"><ArrowRight size={18} /></span>
      </li>
      {singleStep(2,'智能剪辑',Clapperboard,() => onStartVideo({ productionType:'materialPackage' }))}
      {singleStep(3,'自动发布',Send,() => onSelect('publish'))}
    </ol>
  </section>;
}
