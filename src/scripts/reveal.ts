// 客户端 GSAP 进场动效。遵循 gsap-core / gsap-scrolltrigger / gsap-performance：
// - gsap.matchMedia 把动画门控在 (prefers-reduced-motion: no-preference)
// - 只动 transform(y) + autoAlpha，错峰 ScrollTrigger.batch 进场
// 健壮性：内容默认就可见（不靠 CSS 预隐藏），隐藏只由 JS 完成。
// 因此 reduced-motion / 无 JS / 脚本加载慢时内容始终可见，绝不白屏——只可能在极慢加载时有一瞬轻微闪入。
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

export function initReveal(): void {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero 入场（首屏）。from() 默认 immediateRender：创建时同步把元素设为隐藏起点再渐入，
    // 内容本身在 HTML 里可见，脚本若没跑/跑得慢，最坏只是少了动画，不会白屏。
    const heroEls = gsap.utils.toArray<HTMLElement>('.hero-content > *');
    if (heroEls.length) {
      gsap.from(heroEls, {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        delay: 0.1,
      });
    }

    // 滚动进场：JS 先隐藏，进入视口再错峰渐入。目标多在首屏之下，隐藏不可见、无闪烁。
    const targets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR);
    if (targets.length) {
      gsap.set(targets, { autoAlpha: 0, y: 28 });
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

    // matchMedia 在条件失配/清理时会自动 revert 上面的 gsap 动画；再清掉残留内联样式。
    return () => {
      window.removeEventListener('load', onLoad);
      gsap.set([...heroEls, ...targets], { clearProps: 'all' });
    };
  });
}
