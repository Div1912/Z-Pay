"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface StatItem {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { prefix: '', value: 50, suffix: '+', label: 'Mainnet Users' },
  { prefix: '', value: 140, suffix: '+', label: 'Countries Supported' },
  { prefix: '', value: 3, suffix: 's', label: 'Avg. Settlement' },
  { prefix: '', value: 99.99, suffix: '%', label: 'Uptime SLA' },
];

function AnimatedCounter({ prefix, value, suffix, label, isVisible }: StatItem & { isVisible: boolean }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isVisible) return;
    startRef.current = 0;
    const DURATION = 2000;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      // Ease out expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, value]);

  const formatted = isDecimal
    ? display.toFixed(2)
    : Math.floor(display).toLocaleString();

  return (
    <div className="flex flex-col items-center gap-2 px-6 sm:px-10 md:px-14 lg:px-16 py-2">
      <span className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-black leading-none tracking-tight text-white tabular-nums">
        {prefix}{formatted}{suffix}
      </span>
      <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Use amount:0 so it triggers as soon as ANY part of the section is visible
  const isInView = useInView(ref, { once: true, amount: 0 });

  return (
    <section
      className="relative w-full bg-black"
      style={{ zIndex: 30, position: 'relative' }}
    >
      {/* Top rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Ambient glow — inline so it doesn't affect layout */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 100%)',
        }}
      />

      <div ref={ref} className="relative py-12 sm:py-14 md:py-16">
        <div
          className="flex items-center justify-center flex-wrap gap-y-6 transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <AnimatedCounter {...stat} isVisible={isInView} />
              {idx < stats.length - 1 && (
                <div className="hidden sm:block w-px h-12 bg-white/[0.07] flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        <p
          className="text-center text-[9px] sm:text-[10px] text-white/20 mt-6 tracking-[0.22em] uppercase transition-opacity duration-700 delay-500"
          style={{ opacity: isInView ? 1 : 0 }}
        >
          Trusted by builders, traders &amp; enterprises worldwide
        </p>
      </div>

      {/* Bottom rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </section>
  );
};

export default StatsBar;
