// 作品横向陈列：桌面端 pin 住整节，纵向滚动转水平滚过 track。
// 移动端/无 JS：CSS 基础态本身可横向滚动或纵向堆叠，此模块不创建。
import { gsap } from 'gsap';
import { noop, type Cleanup } from './tokens';

export function initGallery(): Cleanup {
  const panel = document.querySelector<HTMLElement>('.work-panel');
  const gallery = panel?.querySelector<HTMLElement>('.work-gallery');
  const track = panel?.querySelector<HTMLElement>('.work-track');
  if (!panel || !gallery || !track) return noop;

  gallery.classList.add('is-pinned');
  gallery.scrollLeft = 0;
  const dist = () => Math.max(0, track.scrollWidth - gallery.clientWidth);

  gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: panel,
      start: 'top top',
      end: () => '+=' + dist(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  return () => gallery.classList.remove('is-pinned');
}
