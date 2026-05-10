import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

export const SmoothScroll = () => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -88, duration: 1.4 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return null;
};
