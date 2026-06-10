// 微交互：导航进度条 / 锚点平滑滚动 / 时钟 / 磁吸按钮 / 自定义光标 / 索引悬停预览。
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { EASE_ELASTIC, EASE_MICRO, noop, type Cleanup } from './tokens';

/* —— 基础上下文 —— */

export function initNavProgress(): Cleanup {
  const bar = document.querySelector<HTMLElement>('.nav-progress');
  if (!bar) return noop;
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 0, end: 'max', scrub: 0.3 },
  });
  return noop; // tween 由 matchMedia 上下文自动回收
}

/** 同页锚点 / 回到顶部：桌面走 smoother，其余 ScrollToPlugin；无 JS 时原生跳转兜底。 */
export function initAnchors(): Cleanup {
  const onClick = (event: MouseEvent) => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    const toTop = link.hasAttribute('data-back-to-top') || link.getAttribute('href') === '#';
    let target: Element | number | null = toTop ? 0 : null;
    if (!toTop && url.hash) {
      try {
        target = document.querySelector(url.hash);
      } catch {
        return;
      }
    }
    if (target === null) return;
    event.preventDefault();
    const smoother = ScrollSmoother.get();
    // 用与 #smooth-content 的 rect 差求布局位置：smoother 的内容 transform 同时作用于
    // 两个 rect 并相互抵消，即使在平滑滚动中途点击也不会算错落点
    let y = 0;
    if (target !== 0) {
      const content = document.querySelector('#smooth-content');
      const base = smoother && content ? content.getBoundingClientRect().top : -window.scrollY;
      y = Math.max(0, (target as Element).getBoundingClientRect().top - base - 72);
    }
    if (smoother) {
      smoother.scrollTo(y, true);
    } else {
      gsap.to(window, { scrollTo: y, duration: 0.9, ease: 'power2.inOut' });
    }
    if (!toTop && url.hash) history.pushState(null, '', url.hash);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/** 导航时钟（NINGBO 本地时间）。装饰位，不进 matchMedia 门控。 */
export function initClock(): Cleanup {
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!el) return noop;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  });
  const tick = () => {
    el.textContent = fmt.format(new Date());
  };
  tick();
  const timer = window.setInterval(tick, 30_000);
  return () => window.clearInterval(timer);
}

/* —— 桌面上下文 —— */

export function initMagnetic(): Cleanup {
  const cleanups: Cleanup[] = [];
  const targets = new Set<HTMLElement>(gsap.utils.toArray<HTMLElement>('[data-magnetic], .button'));
  targets.forEach((el) => {
    el.classList.add('magnetic');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: EASE_MICRO });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: EASE_MICRO });
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      xTo(gsap.utils.clamp(-90, 90, dx) * 0.32);
      yTo(gsap.utils.clamp(-90, 90, dy) * 0.32);
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: EASE_ELASTIC });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.classList.remove('magnetic');
      gsap.set(el, { clearProps: 'x,y' });
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

/** 自定义光标：酸性圆点近贴 + 描边圈拖尾；悬停可点元素时圈放大。JS 动态建 DOM，无 JS 零痕迹。 */
export function initCursor(): Cleanup {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-cursor');
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' });

  const onMove = (event: PointerEvent) => {
    dotX(event.clientX);
    dotY(event.clientY);
    ringX(event.clientX);
    ringY(event.clientY);
  };
  const isInteractive = (el: Element | null) => Boolean(el?.closest('a, button, [data-cursor]'));
  const onOver = (event: PointerEvent) => {
    if (!isInteractive(event.target instanceof Element ? event.target : null)) return;
    gsap.to(ring, { scale: 1.8, duration: 0.3, ease: EASE_MICRO });
    gsap.to(dot, { scale: 0.5, duration: 0.3, ease: EASE_MICRO });
  };
  const onOut = (event: PointerEvent) => {
    if (!isInteractive(event.target instanceof Element ? event.target : null)) return;
    gsap.to([ring, dot], { scale: 1, duration: 0.3, ease: EASE_MICRO });
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver);
  document.addEventListener('pointerout', onOut);

  return () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('pointerout', onOut);
    document.documentElement.classList.remove('has-cursor');
    dot.remove();
    ring.remove();
  };
}

/** 作品索引悬停预览：单个复用的浮动封面随光标拖尾，换行换图，速度带一点倾斜。 */
export function initHoverPreview(): Cleanup {
  const preview = document.querySelector<HTMLElement>('.index-preview');
  const img = preview?.querySelector<HTMLImageElement>('img');
  const list = document.querySelector<HTMLElement>('.index-list');
  if (!preview || !img || !list) return noop;

  preview.classList.add('is-armed');
  gsap.set(preview, { xPercent: 4, yPercent: -50, x: -9999, y: -9999 });
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: EASE_MICRO });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: EASE_MICRO });
  const rotTo = gsap.quickTo(preview, 'rotation', { duration: 0.5, ease: EASE_MICRO });

  let lastX = 0;
  const onMove = (event: PointerEvent) => {
    xTo(event.clientX + 28);
    yTo(event.clientY);
    rotTo(gsap.utils.clamp(-6, 6, (event.clientX - lastX) * 0.4));
    lastX = event.clientX;
  };
  const open = (src: string) => {
    if (img.getAttribute('src') !== src) img.src = src;
    gsap.to(preview, { clipPath: 'inset(0% 0 0% 0)', duration: 0.45, ease: EASE_MICRO, overwrite: true });
  };
  const close = () => {
    gsap.to(preview, { clipPath: 'inset(50% 0 50% 0)', duration: 0.35, ease: 'power2.in', overwrite: true });
    rotTo(0);
  };
  const onOver = (event: PointerEvent) => {
    const row = event.target instanceof Element ? event.target.closest<HTMLElement>('.index-row') : null;
    if (!row) return;
    const src = row.dataset.preview;
    if (src) open(src);
    else close();
  };

  list.addEventListener('pointermove', onMove, { passive: true });
  list.addEventListener('pointerover', onOver);
  list.addEventListener('pointerleave', close);

  return () => {
    list.removeEventListener('pointermove', onMove);
    list.removeEventListener('pointerover', onOver);
    list.removeEventListener('pointerleave', close);
    preview.classList.remove('is-armed');
    gsap.set(preview, { clearProps: 'all' });
  };
}
