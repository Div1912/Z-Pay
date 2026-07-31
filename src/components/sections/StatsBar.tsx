"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  prefix: string;
  label: string;
}

const stats: StatItem[] = [
  { prefix: '$', value: 2, suffix: 'B+', label: 'Transacted' },
  { prefix: '', value: 140, suffix: '+', label: 'Countries' },
  { prefix: '', value: 500, suffix: 'K+', label: 'Active Users' },
  { prefix: '', value: 99.99, suffix: '%', label: 'Uptime SLA' },
];

function AnimatedCounter({ value, prefix, suffix, label, isVisible }: StatItem & { isVisible: boolean }) {
  const [display, setDisplay] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1800;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = value / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatted = isDecimal ? display.toFixed(2) : Math.floor(display).toLocaleString();

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 px-6 sm:px-8 md:px-12 lg:px-16 first:pl-0 last:pr-0">
      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white tabular-nums">
        {prefix}{formatted}{suffix}
      </span>
      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-white/40 uppercase tracking-[0.15em] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="relative w-full bg-black overflow-hidden">
      {/* Top border with shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[200px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.4) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      <div ref={ref} className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px] py-10 sm:py-12 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center flex-wrap gap-y-8"
        >
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <AnimatedCounter {...stat} isVisible={isInView} />
              {idx < stats.length - 1 && (
                <div className="w-px h-10 sm:h-12 bg-white/[0.08] hidden sm:block flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Micro-caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center text-[10px] sm:text-xs text-white/25 mt-5 sm:mt-6 tracking-widest uppercase"
        >
          Trusted by builders, traders, and enterprises worldwide
        </motion.p>
      </div>
    </section>
  );
};

export default StatsBar;
