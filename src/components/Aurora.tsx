import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

export const Aurora = ({ className = '' }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const orbs = gsap.utils.toArray<HTMLElement>('.aurora-orb');
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-120, 120)`,
          y: `random(-80, 80)`,
          scale: () => gsap.utils.random(0.85, 1.2),
          duration: gsap.utils.random(8, 14),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="aurora-orb absolute top-[10%] left-[8%] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="aurora-orb absolute top-[40%] right-[5%] w-[460px] h-[460px] rounded-full bg-violet-600/20 blur-[140px]" />
      <div className="aurora-orb absolute bottom-[5%] left-[35%] w-[380px] h-[380px] rounded-full bg-cyan-500/15 blur-[120px]" />
    </div>
  );
};

export const Stars = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let stars: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 18000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.4 + 0.3) * dpr,
        vx: (Math.random() - 0.5) * 0.04 * dpr,
        vy: (Math.random() - 0.5) * 0.04 * dpr,
        a: Math.random() * 0.6 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${s.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    if (!reduced) draw();
    else {
      // single frame for static look
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${s.a})`;
        ctx.fill();
      });
    }

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 opacity-50"
      aria-hidden="true"
    />
  );
};
