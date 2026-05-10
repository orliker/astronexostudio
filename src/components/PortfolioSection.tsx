import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Droplets,
  PenTool,
  Utensils,
  ShoppingBag,
  Scissors,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

const cn = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

type Category = 'beauty' | 'cleaning' | 'tattoo' | 'restaurant' | 'store' | 'barber';

type Demo = {
  id: string;
  name: string;
  niche: string;
  category: Category;
  desc: string;
  cta: string;
  url: string;
};

type FilterKey = 'all' | Category;

const filterOrder: FilterKey[] = ['all', 'beauty', 'cleaning', 'tattoo', 'restaurant', 'store', 'barber'];

// Visual style per category — gradient + ring + accent text
const categoryStyle: Record<Category, {
  gradient: string;
  ring: string;
  glow: string;
  accentText: string;
  badgeBg: string;
  iconBg: string;
}> = {
  beauty: {
    gradient: 'from-pink-500/25 via-fuchsia-500/15 to-violet-500/10',
    ring: 'group-hover:border-pink-400/40',
    glow: 'group-hover:shadow-pink-500/20',
    accentText: 'text-pink-300',
    badgeBg: 'bg-pink-500/15 border-pink-400/25 text-pink-200',
    iconBg: 'bg-pink-500/15 text-pink-300 border-pink-400/30',
  },
  cleaning: {
    gradient: 'from-cyan-500/25 via-sky-500/15 to-blue-500/10',
    ring: 'group-hover:border-cyan-400/40',
    glow: 'group-hover:shadow-cyan-500/20',
    accentText: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/15 border-cyan-400/25 text-cyan-200',
    iconBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
  },
  tattoo: {
    gradient: 'from-slate-700/40 via-blue-900/30 to-slate-900/30',
    ring: 'group-hover:border-blue-400/40',
    glow: 'group-hover:shadow-blue-500/20',
    accentText: 'text-blue-200',
    badgeBg: 'bg-blue-500/10 border-blue-400/20 text-blue-100',
    iconBg: 'bg-slate-800/60 text-blue-200 border-blue-400/20',
  },
  restaurant: {
    gradient: 'from-amber-500/25 via-orange-500/15 to-red-500/10',
    ring: 'group-hover:border-amber-400/40',
    glow: 'group-hover:shadow-amber-500/20',
    accentText: 'text-amber-300',
    badgeBg: 'bg-amber-500/15 border-amber-400/25 text-amber-200',
    iconBg: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  },
  store: {
    gradient: 'from-rose-300/20 via-amber-200/15 to-yellow-300/10',
    ring: 'group-hover:border-amber-300/40',
    glow: 'group-hover:shadow-amber-300/20',
    accentText: 'text-amber-200',
    badgeBg: 'bg-amber-300/10 border-amber-200/20 text-amber-100',
    iconBg: 'bg-amber-200/10 text-amber-200 border-amber-200/25',
  },
  barber: {
    gradient: 'from-yellow-600/20 via-amber-700/15 to-slate-900/30',
    ring: 'group-hover:border-amber-500/40',
    glow: 'group-hover:shadow-amber-500/20',
    accentText: 'text-amber-300',
    badgeBg: 'bg-amber-700/15 border-amber-600/30 text-amber-200',
    iconBg: 'bg-amber-700/15 text-amber-300 border-amber-600/30',
  },
};

const CategoryIcon = ({ category, className }: { category: Category; className?: string }) => {
  const props = { size: 18, className };
  switch (category) {
    case 'beauty':
      return <Sparkles {...props} />;
    case 'cleaning':
      return <Droplets {...props} />;
    case 'tattoo':
      return <PenTool {...props} />;
    case 'restaurant':
      return <Utensils {...props} />;
    case 'store':
      return <ShoppingBag {...props} />;
    case 'barber':
      return <Scissors {...props} />;
  }
};

// Abstract CSS mockup of a browser window with niche-specific accents
const DemoMockup = ({ category, name }: { category: Category; name: string }) => {
  const style = categoryStyle[category];
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 shadow-inner">
      {/* Browser bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-slate-900/80 border-b border-white/5 flex items-center gap-1.5 px-3 z-10">
        <span className="w-2 h-2 rounded-full bg-red-400/40" />
        <span className="w-2 h-2 rounded-full bg-yellow-400/40" />
        <span className="w-2 h-2 rounded-full bg-green-400/40" />
        <span className="ml-3 h-2 w-32 max-w-[40%] bg-white/5 rounded-full" />
      </div>

      {/* Page surface */}
      <div className={cn('absolute inset-0 pt-7 bg-gradient-to-br', style.gradient)}>
        {/* Soft glow accent */}
        <div className={cn('absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-60 bg-gradient-to-br', style.gradient)} />

        {/* Content layout */}
        <div className="relative h-full p-4 sm:p-5 flex flex-col gap-3">
          {/* Top row: avatar + lines */}
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black', style.iconBg)}>
              {initials}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-1/2 bg-white/15 rounded-full" />
              <div className="h-1.5 w-1/3 bg-white/8 rounded-full" />
            </div>
          </div>

          {/* Hero block */}
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-3 flex flex-col gap-2 flex-1">
            <div className="h-2 w-3/4 bg-white/20 rounded-full" />
            <div className="h-2 w-2/3 bg-white/12 rounded-full" />
            <div className="h-2 w-1/2 bg-white/10 rounded-full" />
            <div className="mt-auto flex items-center gap-2">
              <div className={cn('h-6 px-3 rounded-full flex items-center text-[9px] font-bold uppercase tracking-widest border', style.badgeBg)}>
                {category}
              </div>
              <div className="h-6 w-16 rounded-full bg-white/10 border border-white/10" />
            </div>
          </div>

          {/* Tile row */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={cn(
                  'aspect-square rounded-lg border border-white/10 backdrop-blur-sm bg-gradient-to-br',
                  style.gradient
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type PortfolioCardProps = { demo: Demo; t: any };
const PortfolioCard: React.FC<PortfolioCardProps> = ({ demo, t }) => {
  const style = categoryStyle[demo.category];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex flex-col gap-5 p-5 sm:p-6 rounded-[1.75rem] md:rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-all duration-700',
        'hover:-translate-y-1.5 hover:bg-white/[0.05] shadow-xl shadow-black/40',
        style.ring,
        style.glow
      )}
    >
      {/* Mockup */}
      <div className="overflow-hidden rounded-2xl">
        <div className="transition-transform duration-700 group-hover:scale-[1.04]">
          <DemoMockup category={demo.category} name={demo.name} />
        </div>
      </div>

      {/* Header: badge */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest',
            style.badgeBg
          )}
        >
          <CategoryIcon category={demo.category} className="w-3 h-3" />
          {demo.niche}
        </span>
      </div>

      {/* Title + desc */}
      <div className="space-y-2.5">
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
          {demo.name}
        </h3>
        <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
          {demo.desc}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-2.5">
        <a
          href={demo.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${demo.cta} (${demo.name})`}
          className={cn(
            'group/btn relative inline-flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl bg-brand-blue text-white font-bold uppercase tracking-widest text-[10px] md:text-[11px] shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/50 hover:scale-[1.02] active:scale-95 transition-all duration-500 overflow-hidden'
          )}
        >
          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1100ms] ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
          <span className="relative">{demo.cta}</span>
          <ExternalLink size={12} className="relative" aria-hidden="true" />
        </a>
        <a
          href="#contact"
          aria-label={t.portfolio.buttons.wantSimilar}
          className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold uppercase tracking-widest text-[10px] md:text-[11px] transition-all duration-500 active:scale-95"
        >
          <span>{t.portfolio.buttons.wantSimilar}</span>
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
};

export const PortfolioSection = ({ t }: { t: any }) => {
  const [active, setActive] = useState<FilterKey>('all');
  const demos = (t.portfolio.demos as Demo[]) ?? [];

  const filtered = useMemo(
    () => (active === 'all' ? demos : demos.filter(d => d.category === active)),
    [active, demos]
  );

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8 py-24 md:py-40 bg-[#050816]"
    >
      {/* Soft background accents — kept inside overflow-hidden, no overflow leak */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] max-w-[90%] aspect-square bg-brand-blue/[0.06] blur-[160px] rounded-full" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] w-[500px] max-w-[60%] aspect-square bg-violet-600/[0.05] blur-[140px] rounded-full" aria-hidden="true" />

      <div className="relative z-10 container mx-auto w-full max-w-7xl">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <div
            data-reveal
            className="bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6 md:mb-8 shadow-sm"
          >
            {t.portfolio.tag}
          </div>
          <h2
            data-reveal
            className="text-[32px] sm:text-5xl md:text-6xl font-bold mb-6 md:mb-8 leading-[1.05] md:leading-[0.98] text-white tracking-tighter break-words px-1"
          >
            {t.portfolio.headline.split(/\{|\}/).map((part: string, i: number) =>
              i % 2 === 1 ? (
                <span key={i} className="text-brand-blue">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p data-reveal className="text-base md:text-lg text-slate-400 leading-relaxed font-medium">
            {t.portfolio.subheadline}
          </p>
          <p data-reveal className="mt-5 text-xs md:text-sm text-slate-500 italic leading-relaxed max-w-2xl mx-auto">
            {t.portfolio.note}
          </p>
        </div>

        {/* Filters — horizontal scroll on mobile, no global overflow */}
        <div
          className="mb-10 md:mb-14 -mx-5 sm:-mx-6 lg:mx-0 px-5 sm:px-6 lg:px-0 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Portfolio filters"
        >
          <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm whitespace-nowrap">
            {filterOrder.map(key => {
              const label = t.portfolio.filters[key] as string;
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(key)}
                  className={cn(
                    'px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500',
                    isActive
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((demo: Demo) => (
              <PortfolioCard key={demo.id} demo={demo} t={t} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 md:mt-24 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-brand-blue/15 via-white/[0.03] to-violet-500/10 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-brand-blue/10"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-brand-blue/15 blur-3xl rounded-full" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" aria-hidden="true" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                {t.portfolio.ctaBlock.title}
              </h3>
              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                {t.portfolio.ctaBlock.text}
              </p>
            </div>
            <a
              href="#contact"
              aria-label={t.portfolio.ctaBlock.button}
              className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl hover:scale-[1.04] active:scale-95 transition-all duration-500 overflow-hidden flex-shrink-0 w-full lg:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] ease-out bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" aria-hidden="true" />
              <span className="relative">{t.portfolio.ctaBlock.button}</span>
              <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform duration-500" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
