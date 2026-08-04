"use client";

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Zap, Bot, Server, CheckCircle2, ArrowRight, Code2, Globe, Lock } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

const steps = [
  {
    step: '01',
    icon: Bot,
    title: 'Agent Makes Request',
    actor: 'AI Agent (LangChain / AutoGen)',
    action: 'GET /api/dataset',
    desc: 'Agent calls a paid API endpoint without a pre-purchased subscription or credit card.',
    accent: 'text-blue-400',
    border: 'group-hover:border-blue-500/30',
    iconBg: 'group-hover:bg-blue-500/10 group-hover:text-blue-400',
  },
  {
    step: '02',
    icon: Server,
    title: 'Server Issues 402',
    actor: 'HTTP Response Header',
    action: 'HTTP 402 Payment Required',
    desc: 'Server responds with a standard 402 header specifying micro-fee: 0.001 USDC via Stellar.',
    accent: 'text-amber-400',
    border: 'group-hover:border-amber-500/30',
    iconBg: 'group-hover:bg-amber-500/10 group-hover:text-amber-400',
  },
  {
    step: '03',
    icon: Zap,
    title: 'ZPAY Auto-Settle',
    actor: 'ZPAY SDK Interceptor',
    action: 'Stellar Path Payment → 1.8s',
    desc: 'The ZPAY SDK intercepts the 402, signs a Stellar payment in milliseconds, attaches proof to the retry.',
    accent: 'text-emerald-400',
    border: 'group-hover:border-emerald-500/30',
    iconBg: 'group-hover:bg-emerald-500/10 group-hover:text-emerald-400',
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'Resource Unlocked',
    actor: 'API Gateway Settle',
    action: 'HTTP 200 OK + Payload',
    desc: 'Verified payment unlocks the data payload, delivered instantly to the LLM agent context.',
    accent: 'text-purple-400',
    border: 'group-hover:border-purple-500/30',
    iconBg: 'group-hover:bg-purple-500/10 group-hover:text-purple-400',
  },
];

const highlights = [
  { icon: Globe, label: 'No Subscriptions', desc: 'Pay per call. Not per month.' },
  { icon: Lock, label: 'Cryptographically Proven', desc: 'Every payment includes a verifiable Stellar tx hash.' },
  { icon: Code2, label: 'SDK-Native', desc: '2 lines of code in your agent\'s HTTP client.' },
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

export default function X402Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-black py-20 sm:py-28 md:py-40 overflow-hidden border-t border-white/5 font-[family-name:var(--font-jakarta)]"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Ambient subtle glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 100%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="max-w-3xl mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <Zap className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Machine Micro Commerce</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            The Native{' '}
            <br />
            <span className="text-zinc-400">
              x402 Protocol
            </span>
          </h2>

          <p className="text-white/55 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
            Eliminate API subscriptions. Let your AI agents pay fractions of a cent per call autonomously via native HTTP 402 header interception with zero humans, zero credit cards, and zero friction.
          </p>
        </motion.div>

        {/* Flow Steps — horizontal on desktop, vertical on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative mb-14"
        >
          {/* Connector line across steps on large screens */}
          <div className="hidden lg:block absolute top-[76px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-white/[0.08] pointer-events-none" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.step} variants={cardVariants} className="group relative">
                <div className={`relative h-full bg-[#0c0c0c] border border-white/[0.08] ${item.border} rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] group-hover:shadow-[0_15px_45px_rgba(0,0,0,0.7)]`}>
                  
                  {/* Top: Step Number + Icon */}
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-5xl sm:text-6xl font-black leading-none tracking-tighter text-white/20 select-none">
                        {item.step}
                      </span>

                      <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/60 ${item.iconBg} transition-all duration-300`}>
                        <Icon size={22} strokeWidth={1.5} />
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1.5 leading-tight group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <div className={`text-[10px] font-mono font-bold ${item.accent} mb-4 uppercase tracking-wider`}>
                      {item.actor}
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-black/60 px-3.5 py-2.5 font-mono text-[11px] text-white/80 mb-4 border-l-2 border-l-white/30">
                      {item.action}
                    </div>
                  </div>

                  <p className="text-white/45 text-xs sm:text-[13px] leading-relaxed font-medium">
                    {item.desc}
                  </p>

                  {/* Arrow connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-[15px] top-[76px] z-10 w-7 h-7 rounded-full bg-black border border-white/[0.12] group-hover:border-white/40 items-center justify-center transition-colors">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white transition-colors">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom highlights row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.label}
                className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-6 flex items-start gap-4 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 text-white/70">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">{h.label}</div>
                  <div className="text-xs text-white/45 leading-relaxed">{h.desc}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Code snippet terminal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mt-8 rounded-2xl border border-white/[0.08] bg-[#080808] p-6 sm:p-8 overflow-x-auto shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-xs font-mono text-white/30">zpay-agent.ts</span>
          </div>
          <pre className="font-mono text-xs sm:text-sm leading-relaxed text-emerald-400 whitespace-pre">
{`import { ZPay } from '@zpay/sdk';

const client = new ZPay({ apiKey: process.env.ZPAY_SECRET_KEY });

// 3 lines. Your agent now pays per API call autonomously.
const response = await client.x402.fetch('https://api.data-vendor.com/v1/query');

// ZPAY intercepts HTTP 402, settles 0.001 USDC via Stellar in 1.8s,
// and retries the request with zero human intervention.`}
          </pre>
        </motion.div>

      </div>
    </section>
  );
}
