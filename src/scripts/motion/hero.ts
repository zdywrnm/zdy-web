// 首屏入场与退场。原则：内容默认在 HTML 中可见，隐藏只由 JS 在创建 tween 时完成，
// 脚本不跑/跑得慢最坏只是少动画，绝不白屏。
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { EASE_OUT, SCRAMBLE_CHARS, noop, type Cleanup } from './tokens';

/** 巨字逐字遮罩升起。等字体就绪再切，避免错误换行；resize 重切不再重播。 */
function splitRise(
  el: HTMLElement,
  vars: { stagger: number; delay?: number; trigger?: HTMLElement; type?: 'chars' | 'lines' },
): Cleanup {
  let cancelled = false;
  let split: SplitText | null = null;
  let played = false;
  document.fonts.ready.then(() => {
    if (cancelled) return;
    split = SplitText.create(el, {
      type: vars.type === 'lines' ? 'lines' : 'chars,lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'st-line',
      onSplit(self) {
        if (played) return;
        played = true;
        const targets = vars.type === 'lines' ? self.lines : self.chars;
        return gsap.from(targets, {
          yPercent: 115,
          duration: 1.1,
          ease: EASE_OUT,
          stagger: vars.stagger,
          delay: vars.delay ?? 0,
          ...(vars.trigger
            ? { scrollTrigger: { trigger: vars.trigger, start: 'top 85%', once: true } }
            : {}),
        });
      },
    });
  });
  return () => {
    cancelled = true;
    split?.revert();
  };
}

/** 内页页头：标题逐字 + kicker/导语跟进。 */
function initPageHead(wait = 0): Cleanup {
  const title = document.querySelector<HTMLElement>('.page-title');
  if (!title) return noop;
  const cleanup = splitRise(title, { stagger: 0.035, delay: wait + 0.1 });
  const followers = gsap.utils.toArray<HTMLElement>('.page-kicker, .page-copy');
  if (followers.length) {
    gsap.from(followers, { autoAlpha: 0, y: 18, duration: 0.8, ease: EASE_OUT, stagger: 0.1, delay: wait + 0.4 });
  }
  return cleanup;
}

/** @param wait 额外顺延（preloader 揭幕时巨字正好开始升起） */
export function initHero(wait = 0): Cleanup {
  const title = document.querySelector<HTMLElement>('.hero-title');
  if (!title) return initPageHead(wait);

  const cleanups: Cleanup[] = [splitRise(title, { stagger: 0.05, delay: wait + 0.15 })];

  gsap.from('.hero-kicker', { autoAlpha: 0, y: 18, duration: 0.7, ease: EASE_OUT, delay: wait + 0.1 });
  const followers = gsap.utils.toArray<HTMLElement>('.hero-subtitle, .hero-actions > *');
  if (followers.length) {
    gsap.from(followers, { autoAlpha: 0, y: 24, duration: 0.9, ease: EASE_OUT, stagger: 0.08, delay: wait + 0.55 });
  }

  // mono 装饰行乱码解码（拉丁字符，双语相同；含中文的文本禁用 scramble）
  const deco = document.querySelector<HTMLElement>('[data-scramble]');
  if (deco) {
    const text = deco.textContent ?? '';
    gsap.to(deco, { duration: 1.4, delay: wait + 0.7, scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.4 } });
  }

  // 滚动退场：入场动子元素、退场动容器，互不抢 transform
  gsap
    .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
    .to('.hero > .container', { yPercent: -20, autoAlpha: 0, ease: 'none' }, 0)
    .to('.hero-canvas, .hero-fallback', { yPercent: 10, scale: 1.06, autoAlpha: 0.3, ease: 'none' }, 0)
    .to('.hero-side', { autoAlpha: 0, ease: 'none' }, 0);

  return () => cleanups.forEach((fn) => fn());
}

export { splitRise };
