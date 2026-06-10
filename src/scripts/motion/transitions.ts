// ClientRouter 换页幕布：离场拉起「酸性薄边 + 墨色主幕」，新页就绪后揭开。
// 监听器随首次整页加载注册一次、跨 swap 持续存活；reduced-motion 时不拦截 loader。
import { gsap } from 'gsap';
import { MOTION_OK } from './tokens';

let registered = false;
let curtain: HTMLElement | null = null;
let covering = false;

function ensureCurtain(): { acid: HTMLElement; ink: HTMLElement } {
  if (!curtain || !curtain.isConnected) {
    curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.setAttribute('aria-hidden', 'true');
    const acid = document.createElement('div');
    acid.className = 'curtain-layer curtain-layer--acid';
    const ink = document.createElement('div');
    ink.className = 'curtain-layer curtain-layer--ink';
    curtain.append(acid, ink);
    document.body.appendChild(curtain);
  }
  const [acid, ink] = Array.from(curtain.children) as HTMLElement[];
  return { acid: acid!, ink: ink! };
}

function curtainIn(): Promise<void> {
  return new Promise((resolve) => {
    const { acid, ink } = ensureCurtain();
    covering = true;
    gsap
      .timeline({ onComplete: resolve })
      .fromTo(acid, { yPercent: 102 }, { yPercent: 0, duration: 0.45, ease: 'power3.in' }, 0)
      .fromTo(ink, { yPercent: 102 }, { yPercent: 0, duration: 0.45, ease: 'power3.in' }, 0.07);
  });
}

function curtainOut(): void {
  if (!covering || !curtain) return;
  covering = false;
  const { acid, ink } = ensureCurtain();
  gsap
    .timeline({
      onComplete: () => {
        gsap.set([acid, ink], { yPercent: 102 });
      },
    })
    .to(ink, { yPercent: -102, duration: 0.55, ease: 'power3.inOut' }, 0)
    .to(acid, { yPercent: -102, duration: 0.55, ease: 'power3.inOut' }, 0.06);
}

const motionOk = () => window.matchMedia(MOTION_OK).matches;

export function initTransitions(): void {
  if (registered) return;
  registered = true;

  document.addEventListener('astro:before-preparation', (event) => {
    if (!motionOk()) return;
    // 把幕布动画织进 router 的加载流程：盖严了才允许 swap
    const e = event as unknown as { loader: () => Promise<void> };
    const original = e.loader;
    e.loader = async () => {
      await curtainIn();
      await original.call(e);
    };
  });

  document.addEventListener('astro:page-load', () => {
    curtainOut();
  });
}
