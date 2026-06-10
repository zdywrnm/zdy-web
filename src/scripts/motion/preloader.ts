// 开场序列：墨色遮罩 + mono 计数 0→100 + 名字乱码定格，随后整体上拉揭幕。
// 约束：每会话一次（sessionStorage）、全程 ≤1.6s、点击/按键可跳过、
// JS 动态建 DOM —— 无 JS / reduced-motion（不进基础上下文）完全不出现。
import { gsap } from 'gsap';
import { SCRAMBLE_CHARS, noop, type Cleanup } from './tokens';

const KEY = 'zdy-preloader-shown';

export function initPreloader(): { delay: number; cleanup: Cleanup } {
  let shown = false;
  try {
    shown = Boolean(sessionStorage.getItem(KEY));
    sessionStorage.setItem(KEY, '1');
  } catch {
    shown = true; // 无 storage 权限时宁可不播，避免每次导航都来一遍
  }
  if (shown) return { delay: 0, cleanup: noop };

  const overlay = document.createElement('div');
  overlay.className = 'preloader';
  overlay.setAttribute('aria-hidden', 'true');
  const name = document.createElement('div');
  name.className = 'preloader-name';
  const nameText = 'ZHAO DINGYI — PORTFOLIO';
  name.textContent = nameText;
  const count = document.createElement('div');
  count.className = 'preloader-count';
  count.textContent = '000';
  overlay.append(name, count);
  document.body.appendChild(overlay);

  const state = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => overlay.remove() });
  tl.to(state, {
    v: 100,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => {
      count.textContent = String(Math.round(state.v)).padStart(3, '0');
    },
  })
    .to(name, { duration: 0.9, scrambleText: { text: nameText, chars: SCRAMBLE_CHARS, speed: 0.5 } }, 0)
    .to(overlay, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '+=0.1');

  const skip = () => tl.progress(1);
  window.addEventListener('pointerdown', skip, { once: true });
  window.addEventListener('keydown', skip, { once: true });

  return {
    delay: 1.0, // 英雄区入场顺延：幕布上拉时巨字正好开始升起
    cleanup: () => {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      tl.kill();
      overlay.remove();
    },
  };
}
