import React, { useRef, ComponentPropsWithoutRef } from 'react';
import { useMagnetic } from '../lib/hooks';

const cn = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

type AnchorProps = ComponentPropsWithoutRef<'a'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'light';
  shine?: boolean;
  magnetic?: boolean;
  className?: string;
};

const baseClasses = 'group relative inline-flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 active:scale-95 overflow-hidden will-change-transform';

const variantClasses: Record<NonNullable<AnchorProps['variant']>, string> = {
  primary:
    'bg-brand-blue text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/60 hover:scale-[1.04]',
  secondary:
    'bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20',
  ghost:
    'bg-transparent text-white border border-white/10 hover:bg-white/5',
  light:
    'bg-white text-black shadow-2xl hover:shadow-white/30 hover:scale-[1.04]',
};

export const PremiumLink = ({
  variant = 'primary',
  shine = true,
  magnetic = true,
  className,
  children,
  ...rest
}: AnchorProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(magnetic ? ref : { current: null }, 0.25);

  return (
    <a
      ref={ref}
      {...rest}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {shine && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}
      <span className="relative inline-flex items-center gap-3">{children}</span>
    </a>
  );
};

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'light';
  shine?: boolean;
  magnetic?: boolean;
  className?: string;
};

export const PremiumButton = ({
  variant = 'primary',
  shine = true,
  magnetic = true,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  useMagnetic(magnetic ? ref : { current: null }, 0.25);

  return (
    <button
      ref={ref}
      type={type}
      {...rest}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {shine && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}
      <span className="relative inline-flex items-center gap-3">{children}</span>
    </button>
  );
};
