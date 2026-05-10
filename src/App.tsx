/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import { SmoothScroll } from './lib/SmoothScroll';
import { gsap, ScrollTrigger, prefersReducedMotion } from './lib/gsap';
import { useScrollReveal, useParallax, useTilt, useMagnetic, useCountUp } from './lib/hooks';
import { PremiumLink, PremiumButton } from './components/PremiumButton';
import { Aurora, Stars } from './components/Aurora';
import { RevealText } from './components/RevealText';
import {
  MessageSquare,
  Zap,
  BarChart3,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Globe,
  Mail,
  Smartphone,
  Search,
  Menu,
  X,
  Plus,
  Star,
  Clock,
  TrendingUp,
  LayoutDashboard,
  Bot,
  Layers,
  Sparkles,
  Workflow,
  Target,
  ArrowUpRight,
  Code2,
  Database,
  Rocket,
  Activity,
  UserPlus,
  Send,
  Loader2
} from 'lucide-react';
import { translations as allTranslations } from './constants';

const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(' ');

type Tab = "Inbox" | "Automation" | "Insights" | "Bookings";
type Lang = 'es' | 'en' | 'pt';

// --- Contact constants ---
const WHATSAPP_NUMBER = '351931056365';
const EMAIL_ADDRESS = 'orlaikerpo@gmail.com';

// Strip control characters and collapse whitespace before embedding user input into URLs.
const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;
const sanitize = (value: string, max = 500) =>
  value
    .replace(CONTROL_CHARS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const buildMailtoUrl = (subject: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  // URLSearchParams uses + for spaces; mailto clients prefer %20 — keep as-is, most clients accept both
  return `mailto:${EMAIL_ADDRESS}?${params.toString()}`;
};

const openLink = (url: string) => {
  // Use rel-safe window.open with noopener,noreferrer to prevent reverse tabnabbing
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    // Popup blocked — fallback to navigation in same tab
    window.location.href = url;
  }
};

const renderText = (text: string) => {
  const parts = text.split(/\{|\}/);
  return parts.map((part, i) => (
    i % 2 === 1 ? <span key={i} className="text-brand-blue">{part}</span> : part
  ));
};

// --- Helper Components ---
const SectionHeading = ({ tag, title, sub, align = "center" }: { tag: string, title: string, sub: string, align?: "center" | "left" }) => (
  <div className={cn(
    "max-w-3xl mb-16 md:mb-24",
    align === "center" ? "mx-auto text-center" : "text-left"
  )}>
    <div
      data-reveal
      className={cn(
        "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6 md:mb-8 shadow-sm",
      )}
    >
      {tag}
    </div>
    <RevealText
      text={title}
      as="h2"
      trigger="scroll"
      className="block text-[34px] sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-[1] md:leading-[0.95] text-white tracking-tighter break-words max-w-full px-1"
    />
    <p data-reveal className="text-base md:text-lg text-slate-400 leading-relaxed font-medium">
      {sub}
    </p>
  </div>
);

const Navbar = ({ lang, setLang, t }: { lang: Lang, setLang: (l: Lang) => void, t: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToContact = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLinks = [
    { name: t.nav.services, href: '#services' },
    { name: t.nav.process, href: '#process' },
    { name: t.nav.pricing, href: '#pricing' },
    { name: t.nav.faq, href: '#faq' }
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4",
      isScrolled ? "bg-dark-bg/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent h-20"
    )}>
        <div className="container mx-auto px-5 md:px-10 flex items-center justify-between h-full w-full max-w-7xl">
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-3 group shrink-0 h-12"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label="AstroNexo Studio - Inicio"
          >
            <div className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 shadow-lg shadow-blue-500/10 overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-110">
              <img
                src="/logo-icon.png"
                alt="AstroNexo Studio logo"
                width="44"
                height="44"
                decoding="async"
                fetchPriority="high"
                className="block h-9 w-9 md:h-10 md:w-10 max-w-none object-contain"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center text-base sm:text-lg md:text-xl font-black tracking-tighter leading-none translate-y-[2px]"
            >
              <span className="text-white">AstroNexo</span>
              <span className="text-brand-blue">Studio</span>
            </motion.div>
          </a>

        <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-400">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="hover:text-white transition-colors relative group uppercase tracking-widest text-[10px]"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-blue transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10" role="group" aria-label="Language">
            {(['es', 'en', 'pt'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                aria-label={`Switch to ${l.toUpperCase()}`}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all",
                  lang === l ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-white"
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goToContact}
            className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 uppercase tracking-widest cursor-pointer"
            aria-label={t.nav.cta}
          >
            {t.nav.cta}
          </button>
        </div>

        <button
          type="button"
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-dark-bg/95 border-b border-white/5 p-8 lg:hidden flex flex-col gap-5 backdrop-blur-2xl shadow-2xl z-50 overflow-y-auto max-h-[80vh]"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-2xl font-bold text-white/80 hover:text-white transition-colors py-2 border-b border-white/5 last:border-0"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Language</span>
                <div className="flex gap-2" role="group" aria-label="Language">
                  {(['es', 'en', 'pt'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLang(l)}
                      aria-pressed={lang === l}
                      aria-label={`Switch to ${l.toUpperCase()}`}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all",
                        lang === l ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 bg-white/5"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={goToContact}
                className="w-full py-5 text-center rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-[0.98] transition-all"
              >
                {t.nav.cta}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MouseGlow = () => {
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(0, springConfig);
  const mouseYSpring = useSpring(0, springConfig);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch / coarse pointer devices and when reduced motion is requested
    const fineMQ = window.matchMedia('(pointer: fine)');
    const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(fineMQ.matches && !reducedMQ.matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseXSpring.set(e.clientX);
      mouseYSpring.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, mouseXSpring, mouseYSpring]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden hidden lg:block"
      style={{ opacity: 0.15 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-brand-blue/30 blur-[120px]"
        style={{ x: mouseXSpring, y: mouseYSpring, translateX: '-50%', translateY: '-50%' }}
      />
    </motion.div>
  );
};

const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = end / (duration * 60);
    const handle = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(handle);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(handle);
  }, [end, duration, hasStarted]);

  return (
    <motion.span 
      ref={nodeRef}
      onViewportEnter={() => setHasStarted(true)}
    >
      {count}
    </motion.span>
  );
};

// 3D-tilt hover wrapper for cards
type TiltCardProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode };
const TiltCard = ({ children, className, ...rest }: TiltCardProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useTilt(ref, 6);
  return (
    <a ref={ref} {...rest} className={cn('will-change-transform', className)}>
      {children}
    </a>
  );
};

// Counter animated by ScrollTrigger
const AnimatedCounter = ({ end, prefix, suffix }: { end: number; prefix?: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  useCountUp(ref, end, { prefix, suffix, duration: 2.2 });
  return <span ref={ref}>{`${prefix ?? ''}0${suffix ?? ''}`}</span>;
};

const Hero = ({ t }: { t: any }) => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev % 4) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hero parallax: content drifts up, fades on scroll
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        y: -80,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 md:px-6 lg:px-8 bg-dark-bg" id="product">
      <Stars />
      <Aurora className="opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/30 to-[#050816] pointer-events-none" aria-hidden="true" />

      <main ref={contentRef} className="container mx-auto min-h-[calc(100vh-80px)] flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 w-full max-w-7xl pt-28 pb-16 lg:pt-0 lg:pb-0">
        {/* Left Content */}
        <div className="flex flex-col justify-center gap-8 text-left lg:text-left max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest font-black w-fit"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t.hero.badge}
          </motion.div>

          <RevealText
            text={t.hero.headline}
            as="h1"
            delay={0.1}
            className="text-[36px] sm:text-5xl md:text-7xl lg:text-[72px] xl:text-[84px] font-black leading-[1.1] sm:leading-[1] md:leading-[0.95] tracking-tighter text-white break-words max-w-full"
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl font-medium"
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <div className="w-10 h-[1px] bg-brand-blue/30" />
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand-blue" />
              {t.hero.microText}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 w-full sm:w-auto"
          >
            <PremiumLink
              href={buildWhatsAppUrl(t.contact.whatsappPrefill)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.hero.ctaPrimary}
              variant="primary"
              className="px-10 py-5 text-[11px]"
            >
              {t.hero.ctaPrimary}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
            </PremiumLink>
            <PremiumLink
              href="#services"
              aria-label={t.hero.ctaSecondary}
              variant="secondary"
              shine={false}
              className="px-10 py-5 text-[11px]"
            >
              {t.hero.ctaSecondary}
            </PremiumLink>
          </motion.div>

          <div className="flex items-center gap-6 md:gap-8 mt-10 opacity-30 grayscale flex-wrap">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t.hero.trustedBy}</div>
             <div className="text-xs md:text-sm font-bold text-white tracking-tighter uppercase italic">NovaCart</div>
             <div className="text-xs md:text-sm font-bold text-white tracking-tighter uppercase italic">StudioLoop</div>
             <div className="text-xs md:text-sm font-bold text-white tracking-tighter uppercase italic">BloomDesk</div>
          </div>
        </div>

        {/* Right Content - Bento Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto lg:mx-0">
          {/* Unified Inbox Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl flex flex-col group overflow-hidden relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-tighter">{t.hero.unifiedInbox}</h3>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
                <div className="w-2 h-2 rounded-full bg-green-400/40" />
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all cursor-default hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold ring-1 ring-white/5">JD</div>
                <div className="flex-1">
                  <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">WhatsApp</div>
                  <div className="text-xs font-medium text-white">{t.hero.newLead.replace('{name}', 'John Doe')}</div>
                </div>
                <div className="text-[10px] text-green-400 font-bold px-2 py-0.5 rounded-full bg-green-400/10 animate-pulse">HOT</div>
              </motion.div>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 opacity-60 hover:opacity-100 transition-all cursor-default hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">AS</div>
                <div className="flex-1">
                  <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Instagram</div>
                  <div className="text-xs font-medium text-white">{t.hero.pricingInquiry}</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2 }}
                className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 ring-1 ring-blue-500/30 group/msg"
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeStep > 2 ? 'ready' : 'gen'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 w-full"
                  >
                    {activeStep <= 2 ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <div className="text-xs font-bold text-blue-400">{t.hero.generatingReply}</div>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <div className="text-xs font-bold text-green-400">{t.hero.suggestedReply}</div>
                        <CheckCircle2 size={14} className="text-green-400 ml-auto" />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* Analytics Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-[2.5rem] p-6 lg:p-8 relative overflow-hidden group"
          >
            <h3 className="text-sm font-bold text-slate-200 mb-2">{t.hero.conversionImpact}</h3>
            <div className="text-5xl font-bold tracking-tighter text-white">
              <AnimatedCounter end={142} prefix="+" suffix="%" />
            </div>
            <div className="text-[10px] uppercase text-blue-400 font-bold tracking-widest mt-2">{t.hero.leadAcquisition}</div>
            <div className="mt-8 h-24 flex items-end gap-1.5 overflow-hidden">
              {[30, 45, 40, 65, 85, 100, 75, 90, 85, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + (i * 0.05), duration: 1.5, ease: "easeOut" }}
                  whileHover={{ height: '100%', backgroundColor: '#60a5fa' }}
                  className={cn(
                    "flex-1 rounded-t-lg transition-all duration-300",
                    i === 5 || i === 9 ? "bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" : "bg-blue-400/20"
                  )}
                />
              ))}
            </div>
            <div className="absolute bottom-4 right-8 text-[9px] font-mono text-white/30 tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {t.hero.liveMetric}
            </div>
          </motion.div>

          {/* AI Workflow Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-2 bg-[#0a0f1e] border border-white/10 rounded-[2.5rem] p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-sm font-bold text-slate-200">{t.hero.smartPipeline}</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold uppercase ring-1 ring-green-500/20">Live</span>
            </div>
            <div className="flex items-center justify-between py-6 relative px-4 z-10 h-32">
              <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-white/5 opacity-50"></div>
              
              {/* Dynamic light pulse traveling the line */}
              <motion.div 
                animate={{ left: ['10%', '90%'], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-[40%] -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-0"
              />

              {[
                { label: t.hero.pipeline.inbound, icon: <MessageSquare size={16} />, color: "text-slate-500", stepId: 1 },
                { label: t.hero.pipeline.aiScoring, icon: <Bot size={16} />, color: "text-blue-400", stepId: 2 },
                { label: t.hero.pipeline.booking, icon: <Calendar size={16} />, color: "text-purple-400", stepId: 3 },
                { label: t.hero.pipeline.growth, icon: <TrendingUp size={16} />, color: "text-slate-500", stepId: 4 }
              ].map((step, i) => (
                <motion.div 
                  key={i} 
                  className="flex flex-col items-center gap-3 relative z-10"
                  animate={activeStep === step.stepId ? { scale: 1.1 } : { scale: 1 }}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 border",
                    activeStep === step.stepId ? "bg-blue-600/20 border-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.3)] scale-110" : "bg-white/5 border-white/10 text-slate-400"
                  )}>
                    {React.cloneElement(step.icon as React.ReactElement, { 
                      className: cn(step.color, activeStep === step.stepId ? "animate-pulse" : "") 
                    })}
                  </div>
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider transition-colors duration-500", activeStep === step.stepId ? step.color : "text-slate-600")}>{step.label}</span>
                </motion.div>
              ))}
            </div>
            <motion.div 
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-[11px] text-slate-400 flex items-center gap-3 relative z-10 italic h-16"
            >
              <span className="text-blue-400 animate-pulse text-lg">●</span> 
              {activeStep === 1 && "Inbound lead detected from Instagram. Triage mode enabled."}
              {activeStep === 2 && "AI performing semantic analysis. Score: 94/100 (Booking intent)."}
              {activeStep === 3 && "Calendar availability proposed. Waiting for user confirmation."}
              {activeStep === 4 && "Conversion successful. Workflow recorded in Growth Dashboard."}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </section>
  );
};

const SocialProof = ({ t }: { t: any }) => {
  const logos = [
    { name: "NovaBase", icon: <Globe size={20} /> },
    { name: "FlowLab", icon: <Zap size={20} /> },
    { name: "ApexStore", icon: <ArrowUpRight size={20} /> },
    { name: "Lumina", icon: <Sparkles size={20} /> },
    { name: "Quantus", icon: <BarChart3 size={20} /> }
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.01]">
       <div className="container mx-auto px-6">
          <p className="text-center text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mb-12">
            {t.hero.trustedBy}
          </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
             {logos.map((logo, i) => (
               <div key={i} className="flex items-center gap-3 group cursor-default">
                  <div className="text-white group-hover:text-brand-blue transition-colors">
                    {React.cloneElement(logo.icon as React.ReactElement, { size: 18 })}
                  </div>
                  <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tighter group-hover:text-white transition-colors">{logo.name}</span>
               </div>
             ))}
          </div>
       </div>
    </section>
  );
};

const ProblemSection = ({ t }: { t: any }) => {
  const problems = [
    { 
      title: t.problem.p1Title, 
      desc: t.problem.p1Desc,
      icon: <Layers className="text-red-400" />,
      badge: t.problem.p1Title
    },
    { 
      title: t.problem.p2Title, 
      desc: t.problem.p2Desc,
      icon: <X className="text-red-400" />,
      badge: t.problem.p2Title
    },
    { 
      title: t.problem.p3Title, 
      desc: t.problem.p3Desc,
      icon: <Clock className="text-red-400" />,
      badge: t.problem.p3Title
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-dark-bg relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
          <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">{t.problem.tag}</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 text-white leading-[1.1] tracking-tighter">
              {renderText(t.problem.headline)}
            </h2>
            <p className="text-base md:text-lg text-slate-400 mb-8 md:mb-12 leading-relaxed font-medium max-w-lg">
              {t.problem.subheadline}
            </p>
            <div className="space-y-4">
              {problems.map(p => (
                <div key={p.title} className="flex gap-4 md:gap-5 items-start p-5 md:p-6 rounded-3xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group">
                  <div className="mt-1 transition-transform group-hover:scale-110 p-2.5 md:p-3 rounded-xl bg-red-500/10 border border-red-500/10 shrink-0">{p.icon}</div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors tracking-tight">{p.title}</h4>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="relative aspect-square max-w-[500px] mx-auto bg-gradient-to-br from-red-500/[0.05] to-transparent rounded-full border border-red-500/10 flex items-center justify-center p-4 md:p-8">
               
               {/* Redesigning the visual with cleaner badges */}
               <div className="absolute inset-0 z-0">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-dashed border-red-500/10 rounded-full"
                  />
               </div>

               <div className="relative z-10 w-full space-y-4">
                 {/* Lead lost card 1 */}
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.2 }}
                   className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl backdrop-blur-md flex items-center gap-4 relative group"
                 >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <UserPlus size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-red-500/20 rounded-full mb-2" />
                      <div className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest">{t.problem.leadUnresponsive}</div>
                    </div>
                    <div className="ml-auto text-red-500 opacity-50"><Clock size={16} /></div>
                 </motion.div>

                 {/* Central Error Box */}
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   whileInView={{ scale: 1, opacity: 1 }}
                   className="p-8 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden text-center shadow-2xl shadow-red-500/10"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={40} className="text-red-500" /></div>
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                      <X size={32} strokeWidth={3} />
                    </div>
                    <h4 className="text-red-500 font-black uppercase tracking-[0.2em] mb-2">{t.problem.stalled}</h4>
                    <p className="text-red-300/60 text-xs font-bold uppercase tracking-widest">System Efficiency Critical</p>
                 </motion.div>

                 {/* Lead lost card 2 */}
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.4 }}
                   className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl backdrop-blur-md flex items-center gap-4 ml-8 relative"
                 >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-32 bg-red-500/20 rounded-full mb-2" />
                      <div className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest">{t.problem.missedBooking}</div>
                    </div>
                    <div className="ml-auto text-red-500 opacity-50"><Clock size={16} /></div>
                 </motion.div>

                 {/* Floating badge */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="absolute -top-4 -right-4 bg-red-500 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-xl shadow-red-500/30 z-20"
                 >
                   {t.problem.pendingFollowup}
                 </motion.div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SolutionSection = ({ t }: { t: any }) => {
  const pillars = [
    { title: t.solution.s1, icon: <LayoutDashboard />, desc: t.solution.s1d, color: "text-brand-blue" },
    { title: t.solution.s2, icon: <Zap />, desc: t.solution.s2d, color: "text-brand-violet" },
    { title: t.solution.s3, icon: <Target />, desc: t.solution.s3d, color: "text-brand-cyan" },
    { title: t.solution.s4, icon: <BarChart3 />, desc: t.solution.s4d, color: "text-white" }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#050816] relative overflow-hidden">
       <div className="container mx-auto px-6 md:px-10 text-center">
         <SectionHeading 
           tag={t.solution.tag}
           title={t.solution.headline}
           sub={t.solution.subheadline}
         />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
           {pillars.map((p, i) => (
             <motion.div
               key={p.title}
               data-reveal
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="glass-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] group hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-700 hover:-translate-y-2 text-left"
             >
               <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-500", p.color)}>
                 {React.cloneElement(p.icon as React.ReactElement, { size: 28 })}
               </div>
               <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tighter uppercase italic">{p.title}</h3>
               <p className="text-slate-500 leading-relaxed text-xs md:text-sm font-medium">{p.desc}</p>
             </motion.div>
           ))}
         </div>
       </div>
    </section>
  );
};

const ServicesSection = ({ t }: { t: any }) => {
  const services = [
    { title: t.services.s1Title, desc: t.services.s1Desc, icon: <LayoutDashboard size={24} /> },
    { title: t.services.s2Title, desc: t.services.s2Desc, icon: <Sparkles size={24} /> },
    { title: t.services.s3Title, desc: t.services.s3Desc, icon: <Smartphone size={24} /> },
    { title: t.services.s4Title, desc: t.services.s4Desc, icon: <Globe size={24} /> },
    { title: t.services.s5Title, desc: t.services.s5Desc, icon: <Workflow size={24} /> }
  ];

  return (
    <section className="py-24 md:py-40 bg-dark-bg" id="services">
      <div className="container mx-auto px-6 md:px-10">
        <SectionHeading 
          tag={t.services.tag}
          title={t.services.headline}
          sub={t.services.subheadline}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-brand-blue/30 transition-all group flex flex-col items-start gap-6 md:gap-8"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                {React.cloneElement(s.icon as React.ReactElement, { size: 20 })}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tighter italic uppercase">{s.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.services.learnMore} <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Niche Specific Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-brand-blue/20 via-brand-violet/10 to-transparent border border-brand-blue/30 flex flex-col justify-center items-start text-left gap-6 md:gap-8 relative overflow-hidden group min-h-[300px]"
          >
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles className="text-brand-blue" size={80} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-2">{t.niches.tag}</p>
                <h3 className="text-3xl font-bold text-white tracking-tighter uppercase italic leading-tight">{t.niches.headline}</h3>
             </div>
             <div className="flex flex-wrap gap-2 relative z-10">
                {[t.niches.n1, t.niches.n2, t.niches.n3, t.niches.n4].map(n => (
                  <span key={n} className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-bold text-white uppercase tracking-widest border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                    {n}
                  </span>
                ))}
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = ({ t }: { t: any }) => {
  const features = [
    { title: t.solution.s1, icon: <LayoutDashboard className="text-brand-blue" />, desc: t.solution.s1d, tag: "Connectivity" },
    { title: t.solution.s2, icon: <Bot className="text-brand-violet" />, desc: t.solution.s2d, tag: "Intelligence" },
    { title: t.solution.s3, icon: <Target className="text-brand-cyan" />, desc: t.solution.s3d, tag: "Conversion" },
    { title: t.solution.s4, icon: <Database className="text-white" />, desc: t.solution.s4d, tag: "Data" }
  ];

  return (
    <section className="py-40 bg-dark-bg relative" id="features">
       <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-24">
             <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-8 shadow-sm"
                >
                  Core Capabilities
                </motion.div>
                <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-[0.95] text-white tracking-tighter">
                  {renderText("Your workflow, reimagined with {AI.}")}
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-xl font-medium">
                  {t.aiApproach.subheadline}
                </p>
             </div>
             <div className="hidden lg:flex justify-end">
                <a
                  href="#contact"
                  aria-label={t.services.learnMore}
                  className="px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-3 font-bold text-white hover:bg-white/10 transition-all group active:scale-95 text-xs uppercase tracking-widest"
                >
                   {t.services.learnMore} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {features.map((f, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1, duration: 0.8 }}
                 viewport={{ once: true }}
                 className="group relative glass-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] hover:border-brand-blue/40 border-white/5 transition-all duration-500 flex flex-col items-start h-full"
               >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-500 relative">
                     <div className="absolute inset-0 bg-brand-blue/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
                     {React.cloneElement(f.icon as React.ReactElement, { size: 28 })}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">{f.tag}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-brand-blue transition-colors tracking-tight italic uppercase">{f.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8 font-medium">{f.desc}</p>
                  <div className="mt-auto flex items-center gap-2 text-xs font-bold text-brand-blue group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100 uppercase tracking-widest">
                    {t.services.learnMore} <ArrowRight size={14} />
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};

const WorkflowVisual = ({ t }: { t: any }) => {
  return (
    <section className="py-24 md:py-40 bg-[#080B14] overflow-hidden" id="workflow">
       <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
             <div className="flex-1 w-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-[1.5/1] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-6 md:gap-10">
                   {[
                     { step: "01", title: t.solution.s1, icon: <MessageSquare size={18} />, flow: t.solution.s1d },
                     { step: "02", title: t.solution.s2, icon: <Bot size={18} />, flow: t.solution.s2d, active: true },
                     { step: "03", title: t.solution.s3, icon: <Zap size={18} />, flow: t.solution.s3d }
                   ].map((item, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.2 }}
                       viewport={{ once: true }}
                       className={cn(
                         "flex items-center gap-4 md:gap-8 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 max-w-lg shadow-2xl",
                         item.active ? "bg-brand-blue/10 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.1)] md:translate-x-6 scale-[1.02] md:scale-105 backdrop-blur-xl" : "bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100"
                       )}
                     >
                        <div className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500",
                          item.active ? "bg-brand-blue text-white shadow-lg" : "bg-white/5 text-slate-500"
                        )}>
                           {item.icon}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                              <span className={cn("text-[10px] font-bold", item.active ? "text-blue-400" : "text-slate-600")}>{item.step}</span>
                              <h4 className="font-bold text-white uppercase tracking-wider text-xs md:text-sm">{item.title}</h4>
                           </div>
                           <p className="text-slate-400 text-xs md:text-sm font-medium leading-tight">{item.flow}</p>
                        </div>
                        {item.active && <div className="ml-auto w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_#3b82f6]" />}
                     </motion.div>
                   ))}
                </div>
             </div>

             <div className="flex-1 w-full">
                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                >
                   <p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.4em] mb-6 md:mb-8">{t.process.tag}</p>
                   <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 md:mb-10 leading-[1.1] tracking-tighter">
                     {renderText(t.process.headline)}
                   </h2>
                   <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-8 md:mb-12 font-medium max-w-lg">
                     {t.process.subheadline}
                   </p>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-4 md:gap-y-6 gap-x-8">
                      {t.process.bullets.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 text-white/70 font-medium transition-colors hover:text-white text-xs md:text-sm">
                          <CheckCircle2 size={16} className="text-brand-blue shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                   </ul>
                </motion.div>
             </div>
          </div>
       </div>
    </section>
  );
};

const HowWeWork = ({ t }: { t: any }) => {
  return (
    <section className="py-24 md:py-40 bg-dark-bg relative overflow-hidden" id="process">
       <div className="container mx-auto px-6 md:px-10">
          <SectionHeading 
            tag={t.process.tag}
            title={t.process.headline}
            sub={t.process.subheadline}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {t.process.steps.map((step: any, i: number) => (
               <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-blue/30 transition-all group relative"
               >
                  <div className="text-4xl font-black text-white/5 absolute top-6 right-8 group-hover:text-brand-blue/10 transition-colors">0{i+1}</div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mb-8 group-hover:scale-110 transition-transform">
                     {i === 0 && <Search size={20} />}
                     {i === 1 && <Sparkles size={20} />}
                     {i === 2 && <Code2 size={20} />}
                     {i === 3 && <Rocket size={20} />}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{step.desc}</p>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};

const Showcase = ({ t }: { t: any }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Inbox");
  const tabs: { id: Tab, label: string }[] = [
    { id: "Inbox", label: t.showcase.tabs.inbox },
    { id: "Automation", label: t.showcase.tabs.automation },
    { id: "Insights", label: t.showcase.tabs.insights },
    { id: "Bookings", label: t.showcase.tabs.bookings }
  ];

  return (
    <section className="py-32 bg-dark-bg text-center">
      <div className="container mx-auto px-6">
        <SectionHeading 
          tag={t.showcase.tag}
          title={t.showcase.headline}
          sub={t.showcase.subheadline}
        />
        
        <div className="flex flex-col items-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            role="tablist"
            aria-label="Showcase sections"
            className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-wrap justify-center gap-1 max-w-full"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                   "px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-sm font-black transition-all duration-500 uppercase tracking-widest",
                  activeTab === tab.id ? "bg-brand-blue text-white shadow-xl" : "text-white/30 hover:text-white/60 hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="relative text-left">
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
               transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               className="glass-card rounded-[3rem] p-12 border border-white/5 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center min-h-0 lg:min-h-[400px]">
                   <div>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue mb-6 md:mb-8">
                         {activeTab === 'Inbox' && <MessageSquare size={28} />}
                         {activeTab === 'Automation' && <Zap size={28} />}
                         {activeTab === 'Insights' && <BarChart3 size={28} />}
                         {activeTab === 'Bookings' && <Calendar size={28} />}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 md:mb-6 uppercase tracking-tighter italic leading-none">
                        {tabs.find(p => p.id === activeTab)?.label}
                      </h3>
                      <p className="text-base md:text-xl text-white/50 leading-relaxed mb-8 md:mb-10 font-medium">
                        {activeTab === 'Inbox' && t.showcase.content.inbox}
                        {activeTab === 'Automation' && t.showcase.content.automation}
                        {activeTab === 'Insights' && t.showcase.content.insights}
                        {activeTab === 'Bookings' && t.showcase.content.bookings}
                      </p>
                      <a
                        href="#contact"
                        aria-label={t.services.learnMore}
                        className="inline-flex items-center gap-3 text-brand-blue font-black uppercase tracking-widest hover:gap-5 transition-all group text-xs"
                      >
                         {t.services.learnMore} <ArrowRight size={18} />
                      </a>
                   </div>
                   <div className="bg-dark-bg/60 rounded-3xl border border-white/5 aspect-square sm:aspect-[4/3] p-4 md:p-6 shadow-highlight flex flex-col gap-4 md:gap-6 relative group overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] opacity-[0.03] pointer-events-none" />
                      
                      <div className="flex items-center justify-between z-10">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/20" />
                            <div className="h-4 w-32 bg-white/5 rounded-full" />
                         </div>
                         <div className="h-4 w-12 bg-white/10 rounded-full" />
                      </div>

                      <div className="flex-1 flex flex-col justify-center items-center gap-8 z-10">
                         {activeTab === 'Inbox' && (
                           <div className="w-full space-y-4">
                              {[1, 2, 3].map(i => (
                                <motion.div 
                                  key={i} 
                                  initial={{ x: 20, opacity: 0 }} 
                                  animate={{ x: 0, opacity: 1 }} 
                                  transition={{ delay: i * 0.1 }}
                                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-center group-hover:border-white/20 transition-all"
                                >
                                   <div className="w-10 h-10 rounded-full bg-white/10" />
                                   <div className="flex-1 space-y-2">
                                      <div className="h-2 w-1/3 bg-white/10 rounded" />
                                      <div className="h-2 w-1/2 bg-white/5 rounded" />
                                   </div>
                                </motion.div>
                              ))}
                           </div>
                         )}
                         {activeTab === 'Automation' && (
                           <div className="relative w-full max-w-sm flex flex-col items-center gap-10">
                              <div className="p-4 rounded-xl border border-brand-blue bg-brand-blue/10 w-full text-center font-bold text-xs">New Lead Arrival</div>
                              <div className="h-10 w-px bg-gradient-to-b from-brand-blue to-brand-violet" />
                              <div className="p-4 rounded-xl border border-brand-violet bg-brand-violet/10 w-full text-center font-bold text-xs ring-4 ring-brand-violet/10">AI Classification</div>
                              <div className="h-10 w-px bg-white/10" />
                              <div className="grid grid-cols-2 gap-6 w-full">
                                 <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center text-[10px] font-bold">Book Meeting</div>
                                 <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center text-[10px] font-bold">Smart Reply</div>
                              </div>
                           </div>
                         )}
                         {activeTab === 'Insights' && (
                           <div className="w-full h-full flex flex-col justify-end gap-3 px-10 pb-10">
                              <div className="flex justify-between items-end gap-4 h-full">
                                 {[60, 40, 80, 50, 90, 30, 70].map((h, i) => (
                                   <motion.div 
                                    key={i} 
                                    initial={{ height: 0 }} 
                                    animate={{ height: `${h}%` }} 
                                    transition={{ delay: i * 0.1, duration: 1 }}
                                    className="flex-1 bg-gradient-to-t from-brand-blue/20 to-brand-blue/60 rounded-t-lg group-hover:brightness-125 transition-all"
                                   />
                                 ))}
                              </div>
                           </div>
                         )}
                         {activeTab === 'Bookings' && (
                           <div className="w-full h-full flex flex-col gap-6 py-4">
                              <div className="grid grid-cols-7 gap-2">
                                 {Array.from({ length: 14 }).map((_, i) => (
                                   <div key={i} className={cn(
                                     "aspect-square rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-bold",
                                     i === 6 ? "bg-brand-blue text-white" : "text-white/20"
                                   )}>{i+1}</div>
                                 ))}
                              </div>
                              <div className="p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex justify-between items-center group">
                                 <div>
                                   <p className="text-xs font-bold text-white uppercase tracking-widest">Discovery Call</p>
                                   <p className="text-[10px] text-white/40">10:00 AM • confirmed</p>
                                 </div>
                                 <CheckCircle2 size={24} className="text-brand-blue" />
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </motion.div>
         </AnimatePresence>
      </div>
   </div>
</section>
);
};

const Pricing = ({ t }: { t: any }) => {
  const plans = [
    { 
      name: t.pricing.p1Name, 
      price: t.pricing.p1Price, 
      desc: t.pricing.p1Desc,
      features: t.pricing.p1Features,
      cta: t.cta.requestProposal,
      pop: false
    },
    { 
      name: t.pricing.p2Name, 
      price: t.pricing.p2Price, 
      desc: t.pricing.p2Desc,
      features: t.pricing.p2Features,
      cta: t.cta.requestProposal,
      pop: true
    },
    { 
      name: t.pricing.p3Name, 
      price: t.pricing.p3Price, 
      desc: t.pricing.p3Desc,
      features: t.pricing.p3Features,
      cta: t.cta.requestProposal,
      pop: false
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-dark-bg relative" id="pricing">
       <div className="container mx-auto px-6 md:px-10">
          <SectionHeading 
            tag={t.pricing.tag}
            title={t.pricing.headline}
            sub={t.pricing.subheadline}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
             {plans.map((p, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 viewport={{ once: true }}
                 className={cn(
                   "group relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all duration-700 flex flex-col",
                   p.pop ? "bg-[#0c1229] border-brand-blue/50 shadow-[0_0_80px_rgba(59,130,246,0.1)] ring-1 ring-white/5 md:scale-105 z-10" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                 )}
               >
                  {p.pop && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-brand-blue text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                      {t.pricing.popular}
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tighter italic uppercase">{p.name}</h3>
                  <p className="text-xs md:text-sm text-slate-500 mb-8 md:mb-10 min-h-0 md:min-h-[40px] leading-relaxed font-medium">{p.desc}</p>
                  
                  <div className="mb-10 md:mb-12 flex items-baseline gap-2">
                     <span className="text-xl md:text-2xl font-bold text-white/40 tracking-tighter leading-none">€</span>
                     <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none">{p.price}</span>
                  </div>

                  <div className="space-y-4 md:space-y-5 mb-10 md:mb-14 flex-1">
                     {p.features.map((f: string, fi: number) => (
                       <div key={fi} className="flex items-center gap-4 group/item">
                          <CheckCircle2 size={16} className={cn("transition-all shrink-0", p.pop ? "text-brand-blue" : "text-white/10 group-hover/item:text-brand-blue")} />
                          <span className="text-xs md:text-sm text-slate-400 group-hover/item:text-white transition-colors font-medium">{f}</span>
                       </div>
                     ))}
                  </div>

                  <PremiumLink
                    href={buildWhatsAppUrl(`Hola, vi AstroNexo Studio y me interesa el plan ${p.name}. Me gustaría recibir más información.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.cta} - ${p.name}`}
                    variant={p.pop ? 'light' : 'secondary'}
                    shine={p.pop}
                    className="w-full py-4 md:py-5 text-xs md:text-sm"
                  >
                    {p.cta}
                  </PremiumLink>
               </motion.div>
             ))}
          </div>
          
          <p className="text-center mt-16 md:mt-24 text-slate-600 text-[10px] md:text-sm italic font-medium">{t.pricing.disclaimer}</p>

          {/* Modular Pricing Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 md:mt-32 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/[0.02] border border-white/5"
          >
             <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-16">
                <div className="max-w-xl text-center lg:text-left">
                   <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tighter uppercase italic">{t.pricing.buildModules}</h3>
                   <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">{t.pricing.custom.text}</p>
                </div>
                <PremiumLink
                  href={buildWhatsAppUrl(`Hola, vi AstroNexo Studio y me gustaría un presupuesto personalizado. ${t.contact.whatsappPrefill}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.pricing.custom.button}
                  variant="primary"
                  className="w-full sm:w-auto px-10 py-5 text-xs flex-shrink-0"
                >
                  {t.pricing.custom.button}
                </PremiumLink>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-16 gap-y-1">
                {t.pricing.modules.map((m: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-4 md:py-5 border-b border-white/5 hover:border-brand-blue/30 transition-all group cursor-default">
                     <span className="text-slate-500 group-hover:text-white transition-colors font-medium text-xs md:text-sm">{m.name}</span>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs text-slate-600 font-bold">€</span>
                        <span className="text-white font-bold tracking-tighter text-lg md:text-xl">{m.price}</span>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
       </div>
    </section>
  );
};

const Testimonials = ({ t }: { t: any }) => {
  const testimonials = [
    { 
      quote: t.testimonials.q1, 
      author: t.testimonials.a1, 
      role: t.testimonials.r1, 
      avatar: t.testimonials.av1 
    },
    { 
      quote: t.testimonials.q2, 
      author: t.testimonials.a2, 
      role: t.testimonials.r2, 
      avatar: t.testimonials.av2 
    },
    { 
      quote: t.testimonials.q3, 
      author: t.testimonials.a3, 
      role: t.testimonials.r3, 
      avatar: t.testimonials.av3 
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-[#050816]">
       <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             {testimonials.map((t, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-start gap-8 md:gap-10 hover:bg-white/[0.04] transition-all duration-500"
               >
                  <div className="flex gap-1 text-blue-400">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                  </div>
                  <p className="text-lg md:text-xl text-white italic font-medium leading-relaxed tracking-tight group-hover:text-blue-50 transition-colors">"{t.quote}"</p>
                  <div className="flex items-center gap-4 md:gap-5 mt-auto">
                     <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center font-bold text-blue-400 text-base md:text-lg">
                        {t.avatar}
                     </div>
                     <div>
                        <p className="font-bold text-white text-base md:text-lg tracking-tight leading-none mb-1 md:mb-2">{t.author}</p>
                        <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t.role}</p>
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};

const FAQ = ({ t }: { t: any }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = t.faq.items;

  return (
    <section className="py-24 md:py-40 bg-dark-bg" id="faq">
       <div className="container mx-auto px-6 md:px-10 max-w-4xl">
          <SectionHeading 
            tag={t.faq.tag}
            title={t.faq.headline}
            sub={t.faq.subheadline}
          />
          
          <div className="space-y-4 md:space-y-6">
             {faqs.map((faq: any, i: number) => (
                <div key={i} className={cn(
                   "rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
                   openIndex === i ? "bg-white/[0.04] border-white/10" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                )}>
                   <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full p-6 md:p-10 text-left flex justify-between items-center group"
                    aria-expanded={openIndex === i}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                   >
                      <span className={cn("text-lg md:text-xl font-bold transition-colors tracking-tight max-w-[80%]", openIndex === i ? "text-white" : "text-slate-400 group-hover:text-white")}>{faq.q}</span>
                      <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shrink-0",
                        openIndex === i ? "bg-brand-blue text-white rotate-45 shadow-lg shadow-brand-blue/30" : "bg-white/5 text-slate-600"
                      )}>
                        <Plus size={20} />
                      </div>
                   </button>
                   <AnimatePresence>
                      {openIndex === i && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-button-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                           <div className="px-6 md:px-10 pb-8 md:pb-10 pt-0 md:pt-2 text-slate-400 text-sm md:text-lg leading-relaxed font-medium">
                             {faq.a}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

const ContactSection = ({ t }: { t: any }) => {
  const [form, setForm] = useState({ name: '', business: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [status, setStatus] = useState<'idle' | 'preparing' | 'opening-wa' | 'opening-mail'>('idle');
  const formRef = useRef<HTMLFormElement | null>(null);

  const validate = () => {
    const next: { name?: string; message?: string } = {};
    if (!form.name.trim()) next.name = t.contact.errorName;
    if (!form.message.trim()) next.message = t.contact.errorMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildMessage = () => {
    const cleanName = sanitize(form.name, 80) || '—';
    const cleanBusiness = sanitize(form.business, 120) || '—';
    const cleanMessage = sanitize(form.message, 800);
    return (t.contact.whatsappTemplate as string)
      .replace('{name}', cleanName)
      .replace('{business}', cleanBusiness)
      .replace('{message}', cleanMessage);
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('preparing');
    const message = buildMessage();
    setTimeout(() => {
      setStatus('opening-wa');
      openLink(buildWhatsAppUrl(message));
      setTimeout(() => setStatus('idle'), 1500);
    }, 400);
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('preparing');
    const body = buildMessage();
    setTimeout(() => {
      setStatus('opening-mail');
      window.location.href = buildMailtoUrl(t.contact.emailSubject, body);
      setTimeout(() => setStatus('idle'), 1500);
    }, 400);
  };

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if ((field === 'name' || field === 'message') && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isBusy = status !== 'idle';
  const statusLabel =
    status === 'preparing' ? t.contact.preparing :
    status === 'opening-wa' ? t.contact.opening :
    status === 'opening-mail' ? t.contact.openingEmail : '';

  return (
    <section id="contact" className="py-24 md:py-40 bg-[#050816] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl aspect-square bg-brand-blue/[0.06] blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="container mx-auto px-6 md:px-10 max-w-5xl relative z-10">
        <SectionHeading
          tag={t.contact.tag}
          title={t.contact.headline}
          sub={t.contact.subheadline}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {/* Form Card */}
          <form
            ref={formRef}
            onSubmit={handleWhatsApp}
            noValidate
            className="lg:col-span-3 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl shadow-blue-500/5"
            aria-label="Contact form"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={80}
                  required
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder={t.contact.namePlaceholder}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  className={cn(
                    "w-full px-4 py-3.5 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60 transition-all text-sm font-medium",
                    errors.name ? "border-red-500/50" : "border-white/10 hover:border-white/20"
                  )}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-2 text-[11px] text-red-400 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-business" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {t.contact.businessLabel}
                </label>
                <input
                  id="contact-business"
                  type="text"
                  name="business"
                  autoComplete="organization"
                  maxLength={120}
                  value={form.business}
                  onChange={updateField('business')}
                  placeholder={t.contact.businessPlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60 transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  maxLength={800}
                  required
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder={t.contact.messagePlaceholder}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={cn(
                    "w-full px-4 py-3.5 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60 transition-all text-sm font-medium resize-none",
                    errors.message ? "border-red-500/50" : "border-white/10 hover:border-white/20"
                  )}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-2 text-[11px] text-red-400 font-medium">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <PremiumButton
                  type="submit"
                  disabled={isBusy}
                  aria-label={t.contact.whatsappCta}
                  variant="primary"
                  className="flex-1 px-6 py-4 text-xs disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isBusy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span>{statusLabel}</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} aria-hidden="true" />
                      <span>{t.contact.whatsappCta}</span>
                      <Send size={14} aria-hidden="true" />
                    </>
                  )}
                </PremiumButton>
                <PremiumButton
                  type="button"
                  onClick={handleEmail}
                  disabled={isBusy}
                  aria-label={t.contact.emailCta}
                  variant="secondary"
                  shine={false}
                  className="flex-1 px-6 py-4 text-xs disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Mail size={16} aria-hidden="true" />
                  <span>{t.contact.emailCta}</span>
                </PremiumButton>
              </div>

              <p className="text-[10px] text-slate-600 leading-relaxed pt-1">
                {t.contact.replyTime}
              </p>
            </div>
          </form>

          {/* Direct Channels */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            <TiltCard
              href={buildWhatsAppUrl(t.contact.whatsappPrefill)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.contact.whatsappLabel} +351 931 056 365`}
              className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-brand-blue/15 via-white/[0.02] to-transparent border border-brand-blue/20 hover:border-brand-blue/40 transition-colors duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-5 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare size={20} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-2">{t.contact.whatsappLabel}</p>
              <p className="text-base md:text-lg font-bold text-white mb-1 tracking-tight">+351 931 056 365</p>
              <p className="text-xs text-slate-400 leading-relaxed">{t.contact.replyTime}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest group-hover:gap-3 transition-all">
                {t.cta.talkOnWhatsapp} <ArrowRight size={12} />
              </div>
            </TiltCard>

            <TiltCard
              href={buildMailtoUrl(t.contact.emailSubject)}
              aria-label={`${t.contact.emailLabel} ${EMAIL_ADDRESS}`}
              className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 mb-5 group-hover:scale-110 transition-transform duration-500">
                <Mail size={20} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{t.contact.emailLabel}</p>
              <p className="text-sm md:text-base font-bold text-white mb-1 tracking-tight break-all">{EMAIL_ADDRESS}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{t.contact.emailSubject}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group-hover:gap-3 transition-all">
                {t.cta.emailInquiry} <ArrowRight size={12} />
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CTASection = ({ t }: { t: any }) => {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-dark-bg">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square bg-blue-600/5 blur-[180px] rounded-full pointer-events-none z-0" />
       <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
       
       <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-[34px] sm:text-6xl md:text-8xl font-black text-white mb-8 md:mb-12 tracking-tighter leading-[1] md:leading-[0.9]">
              {renderText(t.cta.headline)}
            </h2>
            <p className="text-base md:text-xl text-slate-400 mb-12 md:mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              {t.cta.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 md:gap-6 w-full max-w-lg mx-auto sm:max-w-none">
               <PremiumLink
                href={buildWhatsAppUrl(t.contact.whatsappPrefill)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.cta.whatsappDemo}
                variant="light"
                className="px-10 md:px-12 py-5 md:py-6 text-sm md:text-lg"
               >
                  {t.cta.whatsappDemo}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
               </PremiumLink>
               <PremiumLink
                href={buildMailtoUrl(t.contact.emailSubject)}
                aria-label={t.cta.emailInquiry}
                variant="secondary"
                shine={false}
                className="px-10 md:px-12 py-5 md:py-6 text-sm md:text-lg"
               >
                  {t.cta.emailInquiry}
               </PremiumLink>
            </div>
          </motion.div>
       </div>
    </section>
  );
};

const ComparisonSection = ({ t }: { t: any }) => {
  const beforeList = [t.comparison.b1, t.comparison.b2, t.comparison.b3, t.comparison.b4];
  const afterList = [t.comparison.a1, t.comparison.a2, t.comparison.a3, t.comparison.a4];

  return (
    <section className="py-24 md:py-32 bg-[#020617] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-10">
        <SectionHeading 
          tag={t.comparison.tag}
          title={t.comparison.headline}
          sub={t.comparison.subheadline}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Before */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/50 border border-red-500/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
              <TrendingUp size={60} className="rotate-180 text-red-500 md:w-20 md:h-20" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-red-400 mb-6 md:mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {t.comparison.before}
            </h3>
            <ul className="space-y-3 md:space-y-4">
              {beforeList.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-500 text-xs md:text-sm font-medium line-through decoration-red-500/30">
                  <X size={14} className="text-red-500/50 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-brand-blue/5 border border-brand-blue/20 relative overflow-hidden group shadow-2xl shadow-blue-500/5"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
              <TrendingUp size={60} className="text-brand-blue md:w-20 md:h-20" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-brand-blue mb-6 md:mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              {t.comparison.after}
            </h3>
            <ul className="space-y-3 md:space-y-4">
              {afterList.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white text-xs md:text-sm font-medium">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 md:mt-10 p-3 md:p-4 rounded-2xl bg-blue-500/10 border border-blue-500/10 text-brand-blue text-[10px] font-bold text-center uppercase tracking-widest leading-none">
              <span className="animate-pulse">●</span> {t.contact.replyTime}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ t, lang, setLang }: { t: any, lang: Lang, setLang: (l: Lang) => void }) => {
  const year = new Date().getFullYear();
  const platformLinks = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.pricing, href: '#pricing' }
  ];
  const companyLinks = [
    { label: t.nav.faq, href: '#faq' },
    { label: t.nav.cta, href: '#contact' }
  ];

  return (
    <footer className="py-20 border-t border-white/5 bg-[#050816] relative z-10">
       <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20">
             <div className="md:col-span-4">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-3 mb-8 cursor-pointer h-12 text-left"
                  aria-label="AstroNexo Studio - Back to top"
                >
                  <div className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 shadow-lg shadow-blue-500/10 overflow-hidden shrink-0">
                    <img
                      src="/logo-icon.png"
                      alt="AstroNexo Studio logo"
                      width="44"
                      height="44"
                      loading="lazy"
                      decoding="async"
                      className="block h-9 w-9 md:h-10 md:w-10 max-w-none object-contain"
                    />
                  </div>
                  <div className="flex items-center text-xl md:text-2xl font-black tracking-tight uppercase italic leading-none translate-y-[2px]">
                    <span className="text-white">AstroNexo</span>
                    <span className="text-brand-blue">Studio</span>
                  </div>
                </button>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  {t.footer.desc}
                </p>
                <div className="flex flex-col gap-4 mb-8">
                   <a
                    href={buildMailtoUrl(t.contact.emailSubject)}
                    className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                    aria-label={`${t.contact.emailLabel}: ${EMAIL_ADDRESS}`}
                   >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail size={14} />
                      </div>
                      <span className="text-sm font-medium">{EMAIL_ADDRESS}</span>
                   </a>
                   <a
                    href={buildWhatsAppUrl(t.contact.whatsappPrefill)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                    aria-label={`${t.contact.whatsappLabel}: +351 931 056 365`}
                   >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare size={14} />
                      </div>
                      <span className="text-sm font-medium">+351 931 056 365</span>
                   </a>
                </div>
                <div className="flex gap-4">
                   <a
                     href={buildWhatsAppUrl(t.contact.whatsappPrefill)}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label={t.contact.whatsappLabel}
                     className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                   >
                      <MessageSquare size={18} />
                   </a>
                   <a
                     href={buildMailtoUrl(t.contact.emailSubject)}
                     aria-label={t.contact.emailLabel}
                     className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                   >
                      <Mail size={18} />
                   </a>
                </div>
             </div>

             <div className="md:col-span-2">
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">{t.footer.platform}</h4>
                <ul className="space-y-4">
                   {platformLinks.map(item => (
                     <li key={item.label}>
                        <a href={item.href} className="text-slate-500 hover:text-brand-blue transition-colors text-sm font-medium">{item.label}</a>
                     </li>
                   ))}
                </ul>
             </div>

             <div className="md:col-span-2">
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">{t.footer.company}</h4>
                <ul className="space-y-4">
                   {companyLinks.map(item => (
                     <li key={item.label}>
                        <a href={item.href} className="text-slate-500 hover:text-brand-blue transition-colors text-sm font-medium">{item.label}</a>
                     </li>
                   ))}
                </ul>
             </div>

             <div className="md:col-span-4">
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">{t.footer.language}</h4>
                <div className="flex flex-wrap gap-3">
                   {([
                     { code: 'es' as const, name: 'ES' },
                     { code: 'en' as const, name: 'EN' },
                     { code: 'pt' as const, name: 'PT' }
                   ]).map(l => (
                     <button
                       key={l.code}
                       type="button"
                       onClick={() => setLang(l.code)}
                       aria-pressed={lang === l.code}
                       aria-label={`Switch language to ${l.name}`}
                       className={cn(
                         "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                         lang === l.code ? "bg-brand-blue border-brand-blue text-white" : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
                       )}
                     >
                       {l.name}
                     </button>
                   ))}
                </div>
                <div className="mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t.footer.studioNoteTitle}</p>
                   <p className="text-[10px] text-slate-600 leading-relaxed italic">
                     {t.footer.studioNote}
                   </p>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <span>{t.footer.legal}</span>
                <span>{t.footer.privacy}</span>
             </div>
             <p className="text-[10px] text-slate-600 font-medium tracking-wider">
                © {year} AstroNexo Studio • {t.footer.desc}
             </p>
          </div>
       </div>
    </footer>
  );
};

const FloatingWhatsApp = ({ t }: { t: any }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="floating-whatsapp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          href={buildWhatsAppUrl(t.contact.whatsappPrefill)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.talkOnWhatsapp}
          className="group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-blue text-white shadow-2xl shadow-brand-blue/40 hover:shadow-brand-blue/60 hover:scale-110 active:scale-95 transition-all duration-500"
        >
          <span className="absolute inset-0 rounded-full bg-brand-blue/40 animate-ping" aria-hidden="true" />
          <MessageSquare size={22} className="relative" aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

const STORAGE_KEY = 'astronexo:lang';

const detectInitialLang = (): Lang => {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en' || saved === 'pt') return saved;
  } catch {
    // localStorage unavailable (private mode / blocked) — fall back to navigator
  }
  const nav = navigator.language?.toLowerCase() ?? '';
  if (nav.startsWith('en')) return 'en';
  if (nav.startsWith('pt')) return 'pt';
  return 'es';
};

export default function App() {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);
  const t = useMemo(() => allTranslations[lang as keyof typeof allTranslations], [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore storage errors (private browsing, quota)
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const appRef = useScrollReveal<HTMLDivElement>('[data-reveal]', { y: 36, stagger: 0.06, duration: 1 });
  useParallax('[data-parallax]');

  return (
    <div ref={appRef} className="min-h-screen bg-dark-bg selection:bg-brand-blue/30 selection:text-white overflow-x-hidden relative font-sans">
      <SmoothScroll />
      <MouseGlow />
      <Navbar t={t} lang={lang} setLang={setLang} />
      <main>
        <Hero t={t} />
        <SocialProof t={t} />
        <ProblemSection t={t} />
        <ComparisonSection t={t} />
        <SolutionSection t={t} />
        <ServicesSection t={t} />
        <WorkflowVisual t={t} />
        <HowWeWork t={t} />
        <Pricing t={t} />
        <Testimonials t={t} />
        <FAQ t={t} />
        <ContactSection t={t} />
        <CTASection t={t} />
      </main>
      <Footer t={t} lang={lang} setLang={setLang} />
      <FloatingWhatsApp t={t} />
    </div>
  );
}
