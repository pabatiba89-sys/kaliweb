const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
document.addEventListener('visibilitychange', () => {
  document.documentElement.dataset.motionPageHidden = String(document.hidden);
});

function trackPointer(root, onMove = () => {}) {
  const reset = () => {
    root.style.setProperty('--motion-x', '0deg');
    root.style.setProperty('--motion-y', '0deg');
    root.style.setProperty('--light-x', '50%');
    root.style.setProperty('--light-y', '50%');
    onMove(0, 0);
  };
  root.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const bounds = root.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    root.style.setProperty('--motion-x', `${(0.5 - y) * 7}deg`);
    root.style.setProperty('--motion-y', `${(x - 0.5) * 9}deg`);
    root.style.setProperty('--light-x', `${x * 100}%`);
    root.style.setProperty('--light-y', `${y * 100}%`);
    onMove((x - 0.5) * 2, (y - 0.5) * 2);
  });
  root.addEventListener('pointerleave', reset);
  reducedMotion.addEventListener('change', reset);
}

const cards = [...document.querySelectorAll('[data-motion-card]')];
if (cards.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.dataset.motionVisible = String(isIntersecting);
    });
  }, { threshold: 0.08 });
  cards.forEach((card) => { observer.observe(card); trackPointer(card); });
}

// Original point clouds: conversation sphere, script lines, video frame,
// editing timeline, and a distribution hub. No video or generation is simulated.
function pointFor(stage, i, count) {
  const u = (i + 0.5) / count;
  const angle = i * 2.3999632297;
  const v = 1 - 2 * u;
  const radius = Math.sqrt(1 - v * v);
  if (stage === 0) return [Math.cos(angle) * radius * 140, v * 140, Math.sin(angle) * radius * 140];
  if (stage === 1) {
    const row = i % 8;
    const fraction = Math.floor(i / 8) / Math.ceil(count / 8);
    return [(fraction - 0.5) * (row === 7 ? 180 : 265), (row - 3.5) * 29, Math.sin(angle) * 13];
  }
  if (stage === 2) {
    if (u < 0.65) {
      const edge = u / 0.65 * 4;
      const t = edge % 1;
      const corners = [[-148, -97], [148, -97], [148, 97], [-148, 97]];
      const a = corners[Math.floor(edge)];
      const b = corners[(Math.floor(edge) + 1) % 4];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.sin(angle) * 16];
    }
    const edge = (u - 0.65) / 0.35 * 3;
    const t = edge % 1;
    const corners = [[-33, -54], [59, 0], [-33, 54]];
    const a = corners[Math.floor(edge)];
    const b = corners[(Math.floor(edge) + 1) % 3];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 24 + Math.sin(angle) * 8];
  }
  if (stage === 3) {
    const row = i % 4;
    const fraction = Math.floor(i / 4) / Math.ceil(count / 4);
    const x = (fraction - 0.5) * 280;
    return [x, (row - 1.5) * 45 + Math.sin(fraction * 40) * (row === 3 ? 13 : 3), Math.sin(angle) * 16];
  }
  if (u < 0.24) return [Math.cos(angle) * radius * 44, v * 44, Math.sin(angle) * radius * 44];
  const node = i % 8;
  const theta = node / 8 * Math.PI * 2;
  if (u < 0.44) {
    const distance = 48 + (u - 0.24) / 0.2 * 90;
    return [Math.cos(theta) * distance, Math.sin(theta) * distance, 0];
  }
  return [Math.cos(theta) * 134 + Math.cos(angle) * 21, Math.sin(theta) * 134 + Math.sin(angle) * 21, Math.sin(angle * 0.6) * 22];
}

document.querySelectorAll('[data-flow-stage]').forEach((root) => {
  const canvas = root.querySelector('[data-flow-canvas]');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const buttons = [...root.querySelectorAll('[data-flow-select]')];
  const captions = [...root.querySelectorAll('[data-flow-caption]')];
  const toggle = root.querySelector('[data-motion-toggle]');
  const count = innerWidth < 760 ? 340 : 680;
  const points = Array.from({ length: count }, (_, i) => pointFor(0, i, count));
  const targets = buttons.map((_, stage) => Array.from({ length: count }, (_, i) => pointFor(stage, i, count)));
  const duration = 5400;
  let active = 0;
  let elapsed = 0;
  let phase = 0;
  let visible = false;
  let hovered = false;
  let focused = false;
  let paused = false;
  let frame = 0;
  let previousTime = 0;
  let previousPaint = 0;
  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;

  const canAnimate = () => visible && !document.hidden && !reducedMotion.matches && !paused;
  const canAdvance = () => canAnimate() && !hovered && !focused;
  const draw = (instant = false) => {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width / 370, height / 330) * 0.91;
    const yaw = (reducedMotion.matches ? 0 : Math.sin(phase * 0.3) * 0.22) + pointerX * 0.28;
    const pitch = pointerY * 0.18;
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    points.forEach((point, i) => {
      const target = targets[active][i];
      for (let axis = 0; axis < 3; axis++) point[axis] += (target[axis] - point[axis]) * (instant ? 1 : 0.075);
      const wave = reducedMotion.matches ? 0 : Math.sin(phase * 1.1 + i * 0.07) * 2.5;
      const x = point[0] * cos - point[2] * sin;
      const z = point[0] * sin + point[2] * cos;
      const y = (point[1] + wave) * cp - z * sp;
      const perspective = 600 / (600 - z);
      let px = width / 2 + x * scale * perspective;
      let py = height / 2 + y * scale * perspective;
      const dx = px - (pointerX + 1) / 2 * width;
      const dy = py - (pointerY + 1) / 2 * height;
      const distance = Math.hypot(dx, dy);
      if (hovered && distance > 0 && distance < 80) {
        const force = (80 - distance) * 0.2;
        px += dx / distance * force;
        py += dy / distance * force;
      }
      const alpha = clamp(0.56 + z / 340, 0.14, 1);
      context.fillStyle = i % 7 === 0 ? `rgba(238,255,225,${alpha})` : `rgba(105,235,192,${alpha})`;
      context.beginPath();
      context.arc(px, py, (i % 7 === 0 ? 1.9 : 1.2) * perspective, 0, Math.PI * 2);
      context.fill();
    });
    // A few slow-moving satellites keep depth visible between shape transitions.
    if (!reducedMotion.matches) {
      for (let i = 0; i < 18; i++) {
        const angle = i * 2.4 + phase * 0.08;
        const radius = 158 + i % 3 * 10;
        context.fillStyle = 'rgba(148,222,194,0.32)';
        context.fillRect(width / 2 + Math.cos(angle) * radius * scale, height / 2 + Math.sin(angle) * radius * scale * 0.8, 1.5, 1.5);
      }
    }
  };

  const select = (index) => {
    active = (index + buttons.length) % buttons.length;
    elapsed = 0;
    root.dataset.active = String(active);
    root.style.setProperty('--flow-progress', '0');
    root.querySelector('[data-flow-count]').textContent = `${String(active + 1).padStart(2, '0')} / ${String(buttons.length).padStart(2, '0')}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
    captions.forEach((caption, i) => caption.setAttribute('aria-hidden', String(i !== active)));
    if (!canAnimate()) draw(true);
  };

  const tick = (now) => {
    frame = 0;
    if (!canAnimate()) { previousTime = 0; return; }
    const delta = previousTime ? Math.min(now - previousTime, 100) : 0;
    previousTime = now;
    phase += delta / 1000;
    if (canAdvance()) {
      elapsed += delta;
      if (elapsed >= duration) select(active + 1);
    }
    if (now - previousPaint >= 32) {
      previousPaint = now;
      root.style.setProperty('--flow-progress', String(elapsed / duration));
      draw();
    }
    frame = requestAnimationFrame(tick);
  };

  const sync = () => {
    root.dataset.motionRunning = String(canAnimate());
    root.dataset.motionReduced = String(reducedMotion.matches);
    root.dataset.autoplay = String(canAdvance());
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-label', paused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('[data-motion-icon]').textContent = paused ? '▶' : 'Ⅱ';
    if (canAnimate() && !frame) frame = requestAnimationFrame(tick);
    if (!canAnimate()) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      if (visible) draw(true);
    }
  };

  const resize = new ResizeObserver(() => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(true);
  });
  resize.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.08 });
  visibility.observe(root);
  trackPointer(root, (x, y) => { pointerX = x; pointerY = y; if (!canAnimate()) draw(); });
  root.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') { hovered = true; sync(); } });
  root.addEventListener('pointerleave', () => { hovered = false; sync(); });
  root.addEventListener('focusin', () => { focused = true; sync(); });
  root.addEventListener('focusout', () => queueMicrotask(() => { focused = root.contains(document.activeElement); sync(); }));
  buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
  root.addEventListener('keydown', (event) => {
    if (!event.target.closest('[data-flow-select]')) return;
    const rtl = document.documentElement.dir === 'rtl';
    let index;
    if (event.key === 'ArrowRight') index = active + (rtl ? -1 : 1);
    if (event.key === 'ArrowLeft') index = active + (rtl ? 1 : -1);
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = buttons.length - 1;
    if (index !== undefined) { event.preventDefault(); select(index); buttons[active].focus(); }
  });
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
});
