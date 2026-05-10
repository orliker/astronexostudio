import { useEffect, useRef, RefObject } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

type Selector = string;

export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
  selector: Selector = '[data-reveal]',
  options: { stagger?: number; y?: number; duration?: number; start?: string } = {}
) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.querySelectorAll<HTMLElement>(selector).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(selector);
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: options.y ?? 32 });
      ScrollTrigger.batch(items, {
        start: options.start ?? 'top 85%',
        onEnter: batch =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: options.duration ?? 0.9,
            stagger: options.stagger ?? 0.08,
            ease: 'power3.out',
            overwrite: 'auto',
          }),
      });
    }, root);

    return () => ctx.revert();
  }, [selector, options.stagger, options.y, options.duration, options.start]);

  return ref;
};

export const useParallax = (
  selector: Selector = '[data-parallax]'
) => {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
        const speed = parseFloat(el.dataset.parallax || '0.3');
        gsap.fromTo(
          el,
          { y: () => -window.innerHeight * speed * 0.4 },
          {
            y: () => window.innerHeight * speed * 0.4,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [selector]);
};

export const useTilt = (ref: RefObject<HTMLElement | null>, max = 8) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const sTo = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3.out' });

    gsap.set(el, { transformPerspective: 800, transformStyle: 'preserve-3d' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(px * max);
      yTo(-py * max);
      sTo(1.02);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      sTo(1);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, max]);
};

export const useMagnetic = (ref: RefObject<HTMLElement | null>, strength = 0.35) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);
};

export const useCountUp = (
  ref: RefObject<HTMLElement | null>,
  end: number,
  options: { duration?: number; suffix?: string; prefix?: string } = {}
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { value: 0 };
    const tween = gsap.to(obj, {
      value: end,
      duration: options.duration ?? 2,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        el.textContent = `${options.prefix ?? ''}${Math.round(obj.value)}${options.suffix ?? ''}`;
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => tween.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [ref, end, options.duration, options.suffix, options.prefix]);
};
