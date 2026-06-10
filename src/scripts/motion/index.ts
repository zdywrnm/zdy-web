// 动效系统唯一入口。
// - 基础上下文：prefers-reduced-motion: no-preference（reduced-motion 时 DOM 一字不动）
// - 桌面上下文：再叠 pointer:fine + min-width:861px（smoother / pin 横滚 / 磁吸 / 光标）
// - 每个模块返回 cleanup；SplitText/监听器/动态 DOM 必须手动回收，tween 由 matchMedia 自动回收
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import { DESKTOP, MOTION_OK, type Cleanup } from './tokens';
import { initHero } from './hero';
import { initPreloader } from './preloader';
import { initScrollScenes } from './scroll';
import { initTicker } from './ticker';
import { initGallery } from './gallery';
import { initSmoother } from './smoother';
import {
  initAnchors,
  initClock,
  initCursor,
  initHoverPreview,
  initMagnetic,
  initNavProgress,
} from './interactions';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother, SplitText, ScrambleTextPlugin);

let mm: gsap.MatchMedia | null = null;
let globalCleanups: Cleanup[] = [];

export function initMotion(): void {
  destroyMotion();

  // 时钟与锚点不依赖动效偏好：reduced-motion 用户也需要可用的锚点（走原生跳转语义的平滑替代）
  globalCleanups.push(initClock());

  mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    const preloader = initPreloader();
    const cleanups = [
      preloader.cleanup,
      initHero(preloader.delay),
      initScrollScenes(),
      initTicker(),
      initNavProgress(),
      initAnchors(),
    ];
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      cleanups.forEach((fn) => fn());
    };
  });

  mm.add(DESKTOP, () => {
    const cleanups = [initSmoother(), initGallery(), initMagnetic(), initCursor(), initHoverPreview()];
    return () => cleanups.forEach((fn) => fn());
  });
}

export function destroyMotion(): void {
  globalCleanups.forEach((fn) => fn());
  globalCleanups = [];
  mm?.revert();
  mm = null;
}

export { initTransitions } from './transitions';
