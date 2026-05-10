import React, { ReactNode, useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

const tokenize = (text: string) => {
  const out: { value: string; highlight: boolean }[] = [];
  const re = /\{([^}]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ value: text.slice(last, m.index), highlight: false });
    out.push({ value: m[1], highlight: true });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ value: text.slice(last), highlight: false });
  return out;
};

type Props = {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  trigger?: 'mount' | 'scroll';
};

export const RevealText = ({ text, as: Tag = 'span', className = '', delay = 0, trigger = 'mount' }: Props) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const tokens = tokenize(text);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.querySelectorAll<HTMLElement>('.reveal-word').forEach(el => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.reveal-word', root);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      const animate = () =>
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.04,
          ease: 'power3.out',
          delay,
        });
      if (trigger === 'mount') animate();
      else {
        const obs = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                animate();
                obs.disconnect();
              }
            });
          },
          { threshold: 0.2 }
        );
        obs.observe(root);
        return () => obs.disconnect();
      }
    }, root);

    return () => ctx.revert();
  }, [delay, trigger]);

  const renderToken = (token: { value: string; highlight: boolean }, key: string): ReactNode => {
    const words = token.value.split(/(\s+)/);
    return words.map((word, i) => {
      if (/^\s+$/.test(word)) return word;
      return (
        <span key={`${key}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={`reveal-word inline-block will-change-transform ${token.highlight ? 'text-brand-blue' : ''}`}
          >
            {word}
          </span>
        </span>
      );
    });
  };

  return (
    <Tag ref={ref} className={className}>
      {tokens.map((tok, i) => (
        <span key={i}>{renderToken(tok, String(i))}</span>
      ))}
    </Tag>
  );
};
