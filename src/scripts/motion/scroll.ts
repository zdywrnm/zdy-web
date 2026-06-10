// 滚动叙事：标线绘制、分区差异化编排、数字滚码、时间线生长、data-speed 视差。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitRise } from './hero';
import { EASE_OUT, SCRAMBLE_DIGITS, type Cleanup } from './tokens';

/** 容器进入视口时，子项错峰入场（一次性）。 */
function cascade(containerSel: string, childSel: string | null, vars: gsap.TweenVars): void {
  gsap.utils.toArray<HTMLElement>(containerSel).forEach((container) => {
    const items = childSel ? gsap.utils.toArray<HTMLElement>(childSel, container) : [container];
    if (!items.length) return;
    gsap.from(items, {
      duration: 0.8,
      ease: EASE_OUT,
      ...vars,
      scrollTrigger: { trigger: container, start: 'top 86%', once: true },
    });
  });
}

export function initScrollScenes(): Cleanup {
  const cleanups: Cleanup[] = [];

  // 章节标线：1px 线从左画出 + 两端标签升起
  gsap.utils.toArray<HTMLElement>('.rule-header').forEach((header) => {
    gsap.fromTo(
      header,
      { '--rule-scale': 0 },
      {
        '--rule-scale': 1,
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: header, start: 'top 88%', once: true },
      },
    );
    gsap.from(header.children, {
      autoAlpha: 0,
      y: 14,
      duration: 0.7,
      ease: EASE_OUT,
      stagger: 0.1,
      scrollTrigger: { trigger: header, start: 'top 88%', once: true },
    });
  });

  // 卡片簇：微旋转落定（签名动作）
  cascade('.focus-grid', '.focus-card', { autoAlpha: 0, y: 40, rotate: -1.2, transformOrigin: 'left bottom', stagger: 0.09 });
  cascade('.path-grid', '.path-card', { autoAlpha: 0, y: 40, rotate: -1.2, transformOrigin: 'left bottom', stagger: 0.12 });
  // 索引行：横轴滑入（与卡片区分轴向）
  cascade('.index-list', '.index-row', { autoAlpha: 0, x: -36, duration: 0.7, stagger: 0.07 });
  cascade('.stat-grid', '.stat', { autoAlpha: 0, y: 24, stagger: 0.08 });
  cascade('.summary-row', null, { autoAlpha: 0, y: 26 });
  cascade('.timeline', '.timeline-entry', { autoAlpha: 0, y: 32, stagger: 0.1 });
  cascade('.contact-cta', null, { autoAlpha: 0, y: 40 });

  // 宣言体：逐行遮罩升起
  gsap.utils.toArray<HTMLElement>('.manifesto').forEach((el) => {
    cleanups.push(splitRise(el, { stagger: 0.1, trigger: el, type: 'lines' }));
  });

  // 数字滚码定格
  gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((el) => {
    const text = el.textContent ?? '';
    gsap.to(el, {
      duration: 1.2,
      scrambleText: { text, chars: SCRAMBLE_DIGITS, speed: 0.3 },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // 经历时间线标线随滚动生长
  const rail = document.querySelector<HTMLElement>('.timeline-rail');
  if (rail) {
    gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 80%', end: 'bottom 65%', scrub: 0.5 },
      },
    );
  }

  // 详情页封面：揭幕 + 内部视差防露边
  gsap.utils.toArray<HTMLElement>('.media-frame').forEach((frame) => {
    gsap.fromTo(
      frame,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: frame, start: 'top 92%', once: true },
      },
    );
    const img = frame.querySelector<HTMLElement>('[data-parallax-cover]');
    if (img) {
      gsap.set(img, { scale: 1.12 });
      gsap.fromTo(
        img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }
  });

  // data-speed 视差（幽灵水印 / 页脚 wordmark）：负值更慢、有「后退」感
  gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed ?? '0');
    if (!speed || !el.parentElement) return;
    gsap.fromTo(
      el,
      { yPercent: -7 * speed },
      {
        yPercent: 7 * speed,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // 兜底批次：未被上面认领的次级元素
  const batchTargets = gsap.utils.toArray<HTMLElement>(
    ['.rule-copy', '.contact-meta', '.stack-tag', '.detail-meta > div', '.tech-list', '.next-project', '.prose'].join(', '),
  );
  if (batchTargets.length) {
    gsap.set(batchTargets, { autoAlpha: 0, y: 26 });
    ScrollTrigger.batch(batchTargets, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.08, overwrite: true }),
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
