"use client";

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { UserPlus, ArrowLeftRight, BotMessageSquare } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your ZPAY ID',
    description: 'Link any bank account or UPI handle in under 60 seconds. Your universal identity on the Stellar network — one ID for every payment on Earth.',
    Icon: UserPlus,
  },
  {
    number: '02',
    title: 'Send or Request',
    description: 'Transact with anyone worldwide — a colleague in Tokyo, a contractor in Lagos, a merchant in São Paulo. Instant settlement, sub-cent fees, no friction.',
    Icon: ArrowLeftRight,
  },
  {
    number: '03',
    title: 'AI Agents Transact',
    description: 'Deploy autonomous AI agents that pay, collect, and reconcile on your behalf — 24/7, fully programmable, with cryptographic receipts for every action.',
    Icon: BotMessageSquare,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-20 sm:py-28 md:py-40 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.025) 0%, transparent 100%)',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">How It Works</span>
          </div>

          <h2 className="font-black leading-[0.9] tracking-tight mb-5 sm:mb-6">
            <span className="block text-white text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">
              Three steps to
            </span>
            <span className="block bg-gradient-to-r from-zinc-100 via-neutral-300 to-neutral-600 bg-clip-text text-transparent text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">
              smarter payments
            </span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
            From setup to autonomous AI transactions — the entire stack in three steps.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative"
        >
          {/* Connector line */}
          <div className="hidden md:block absolute top-[76px] left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-px bg-gradient-to-r from-white/[0.05] via-white/[0.12] to-white/[0.05] pointer-events-none" />

          {steps.map((step, idx) => {
            const { Icon } = step;
            return (
              <motion.div key={step.number} variants={cardVariants} className="group relative">
                {/* Glowing Premium Border Halo */}
                <div className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gold/40 via-amber-500/20 to-gold/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />

                <div className="relative h-full bg-[#0c0c0c] border border-white/[0.08] group-hover:border-gold/40 rounded-2xl sm:rounded-3xl p-7 sm:p-8 md:p-10 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_0_0_1px_rgba(212,175,55,0.05)] group-hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)]">
                  {/* Step number + icon */}
                  <div className="flex items-start justify-between mb-7 sm:mb-8">
                    <span className="text-6xl sm:text-7xl font-black leading-none tracking-tighter select-none"
                      style={{ 
                        background: 'linear-gradient(180deg, rgba(212,175,55,0.4) 0%, rgba(255,255,255,0.03) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {step.number}
                    </span>

                    <div className="flex-shrink-0 w-14 h-14 sm:w-15 sm:h-15 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/60 group-hover:text-gold group-hover:border-gold/30 group-hover:bg-gold/10 transition-all duration-300">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-[1.35rem] mb-3 sm:mb-4 leading-tight group-hover:text-gold transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-white/45 text-sm sm:text-[0.9rem] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-[17px] top-[76px] z-10 w-8 h-8 rounded-full bg-black border border-white/[0.12] group-hover:border-gold/50 items-center justify-center transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-gold transition-colors">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
