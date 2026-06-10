// 技能跑马灯：-50% 无缝循环，滚动速度临时加速。无 JS 时是静态一排词条。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { noop, type Cleanup } from './tokens';

export function initTicker(): Cleanup {
  const track = document.querySelector<HTMLElement>('.ticker-track');
  if (!track) return noop;

  const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 32, repeat: -1 });
  const surge = gsap.timeline();
  const st = ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 1400, 2.5);
      surge
        .clear()
        .to(loop, { timeScale: boost, duration: 0.25, ease: 'power1.out' })
        .to(loop, { timeScale: 1, duration: 1.2 }, '>0.15');
    },
  });

  return () => {
    st.kill();
    surge.kill();
    loop.kill();
    gsap.set(track, { clearProps: 'all' });
  };
}
