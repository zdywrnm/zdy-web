// 桌面端惯性平滑滚动。wrapper/content 是 BaseLayout 里的惰性 div，
// 仅在桌面 matchMedia 上下文内创建，窗口缩小/换页/reduced-motion 时销毁。
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { noop, type Cleanup } from './tokens';

export function initSmoother(): Cleanup {
  const wrapper = document.querySelector<HTMLElement>('#smooth-wrapper');
  const content = document.querySelector<HTMLElement>('#smooth-content');
  if (!wrapper || !content) return noop;

  const smoother = ScrollSmoother.create({
    wrapper,
    content,
    smooth: 1,
    effects: false,
    normalizeScroll: false,
  });

  // 跨页 hash（如 /about/#experience）：smoother 建好后校正一次落点
  if (location.hash) {
    try {
      const target = document.querySelector(location.hash);
      if (target) requestAnimationFrame(() => smoother.scrollTo(target, false, 'top 72px'));
    } catch {
      /* 非法 hash 忽略 */
    }
  }

  return () => smoother.kill();
}
