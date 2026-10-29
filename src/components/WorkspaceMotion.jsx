import React, { useEffect, useRef, useState } from 'react';

// Share the public site's motion behavior: pause offscreen, in background tabs,
// and when reduced motion is requested. An explicit pause remains in control.
export function useWorkspaceMotion(root, paused = false) {
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReduced = () => setReduced(query.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    query.addEventListener('change', updateReduced);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); query.removeEventListener('change', updateReduced); document.removeEventListener('visibilitychange', updateVisibility); };
  }, [root]);
  return visible && pageVisible && !reduced && !paused;
}

export function OutputNumber({ value, language, running }) {
  const previous = useRef(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (value == null) { previous.current = null; setDisplay(null); return; }
    const from = previous.current ?? 0;
    previous.current = value;
    if (!running || from === value) { setDisplay(value); return; }
    const start = performance.now();
    let frame;
    const animate = (now) => {
      const t = Math.min(1, (now - start) / 850);
      setDisplay(Math.round(from + (value - from) * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, running]);
  return <span translate="no">{display == null ? '—' : new Intl.NumberFormat(language).format(display)}</span>;
}

export function OutputVisual({ kind }) {
  return <div className={`output-visual output-visual--${kind}`} aria-hidden="true">
    {kind === 'video' ? <><i className="output-visual__screen"><b /></i><i className="output-visual__timeline" /></>
      : kind === 'music' ? <div className="output-visual__wave">{Array.from({ length: 11 }, (_, i) => <i key={i} style={{ '--bar': i }} />)}</div>
        : <><i className="output-visual__photo output-visual__photo--back" /><i className="output-visual__photo"><b /></i><i className="output-visual__spark" /></>}
  </div>;
}
