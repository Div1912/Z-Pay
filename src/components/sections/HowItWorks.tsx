"use client";

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Create Your ZPAY ID',
    description: 'Link any bank account or UPI handle in under 60 seconds. Your universal identity on the Stellar network — one ID for every payment on Earth.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Send or Request',
    description: 'Transact with anyone worldwide — a colleague in Tokyo, a contractor in Lagos, a merchant in São Paulo. Instant settlement, sub-cent fees, no friction.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 8l4 4-4 4" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'AI Agents Transact',
    description: 'Deploy autonomous AI agents that pay, collect, and reconcile on your behalf — 24/7, fully programmable, with cryptographic receipts for every action.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <path d="M7 14v3" />
        <path d="M12 14v3" />
        <path d="M17 14v3" />
        <path d="M3 19h18" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-20 sm:py-28 md:py-40 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1000px] aspect-square rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">How It Works</span>
          </div>

          <h2 className="font-black leading-[0.9] tracking-tight mb-5 sm:mb-6">
            <span className="block text-white text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">Three steps to</span>
            <span className="block bg-gradient-to-r from-zinc-100 via-neutral-300 to-neutral-600 bg-clip-text text-transparent text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">smarter payments</span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
            From setup to autonomous AI transactions — the entire stack in three simple steps.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[72px] left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px bg-gradient-to-r from-white/[0.06] via-white/[0.15] to-white/[0.06] pointer-events-none" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="group relative"
            >
              {/* Card hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-[#0d0d0d] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-7 sm:p-8 md:p-10 h-full hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1">
                {/* Step number + icon row */}
                <div className="flex items-start justify-between mb-6 sm:mb-8">
                  {/* Large gradient step number */}
                  <span
                    className="text-6xl sm:text-7xl font-black leading-none tracking-tighter bg-gradient-to-b from-white/20 to-white/[0.04] bg-clip-text text-transparent select-none"
                  >
                    {step.number}
                  </span>

                  {/* Icon circle */}
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/[0.15] group-hover:bg-white/[0.07] transition-all duration-300">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 leading-tight">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow indicator for last two cards */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-[72px] z-10 w-8 h-8 rounded-full bg-black border border-white/[0.1] items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
