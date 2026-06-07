// 客户端 GSAP 滚动进场动效。遵循 gsap-core / gsap-scrolltrigger / gsap-performance：
// - 用 gsap.matchMedia 把动画门控在 (prefers-reduced-motion: no-preference)
// - 只动 transform(y) + autoAlpha，错峰 ScrollTrigger.batch 进场
// - 防闪烁/留白：配合 BaseLayout 头部内联脚本的 .motion-ok 类与 __revealFallback 兜底
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 复用页面已有 class，不逐个改组件
const REVEAL_SELECTOR = [
  '.section-header',
  '.info-item',
  '.timeline-item',
  '.project-feature',
  '.project-row',
  '.summary-panel',
  '.skill-cloud',
  '.content-panel',
  '.project-cover--detail',
].join(', ');

declare global {
  interface Window {
    __revealFallback?: ReturnType<typeof setTimeout>;
  }
}

export function initReveal(): void {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 解除「内容预隐藏」的兜底。只在 Hero 入场真正播放完成后才解除，
    // 这样万一动画因后台标签/慢设备卡住，2.5s 兜底会强制显示全部，绝不把首屏关键内容半隐藏。
    const finishGate = () => {
      if (window.__revealFallback) clearTimeout(window.__revealFallback);
    };

    // Hero 入场（首屏，随加载播放）
    const heroEls = gsap.utils.toArray<HTMLElement>('.hero-content > *');
    if (heroEls.length) {
      gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 }, onComplete: finishGate })
        .set(heroEls, { y: 24 })
        .to(heroEls, { autoAlpha: 1, y: 0, stagger: 0.12, delay: 0.1 });
    } else {
      // 无 Hero 的页面（关于/作品/详情）：page-hero 标题本就一直可见，直接解除兜底。
      finishGate();
    }

    // 滚动进场（错峰淡入上移）
    const targets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR);
    if (targets.length) {
      gsap.set(targets, { y: 28 });
      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            overwrite: true,
          }),
      });
    }

    // 封面图 / 字体稳定后重算触发点
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      gsap.set([...heroEls, ...targets], { clearProps: 'all' });
    };
  });
}
