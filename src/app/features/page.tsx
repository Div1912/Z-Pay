"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Network, Fingerprint, Store, Lock, Users, Zap, Bot, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";

const bentoFeatures = [
  {
    title: 'Agentic Pathfinding AI',
    description: 'Our AI continuously analyzes global liquidity pools in real-time, instantly routing payments through the absolute cheapest path on Stellar.',
    icon: Network,
    colSpan: 'md:col-span-2',
    gradient: 'from-purple-500/10 to-transparent',
  },
  {
    title: 'Zero Gas Fees',
    description: 'Absolute zero friction. ZPAY sponsors the Stellar network fees on your behalf.',
    icon: Zap,
    colSpan: 'md:col-span-1',
    gradient: 'from-amber-500/10 to-transparent',
  },
  {
    title: 'Universal IDs',
    description: 'Ditch the 56-character addresses. Send instant cross-currency payments to simple identifiers like alice@zpay.',
    icon: Fingerprint,
    colSpan: 'md:col-span-1',
    gradient: 'from-emerald-500/10 to-transparent',
  },
  {
    title: 'Native x402 Protocol',
    description: 'Built for machine-to-machine micropayments. When AI agents hit a paywall, ZPAY handles the 402 Payment Required response autonomously.',
    icon: Bot,
    colSpan: 'md:col-span-2',
    gradient: 'from-blue-500/10 to-transparent',
  },
  {
    title: 'Soroban Smart Escrow',
    description: 'Trustless B2B payments. Lock funds on-chain within a smart contract, release upon delivery.',
    icon: Lock,
    colSpan: 'md:col-span-1',
    gradient: 'from-rose-500/10 to-transparent',
  },
  {
    title: 'Indian UPI Bridge',
    description: 'Walk into any shop in India, scan a UPI QR code, and pay with your crypto balance instantly.',
    icon: Store,
    colSpan: 'md:col-span-1',
    gradient: 'from-orange-500/10 to-transparent',
  },
  {
    title: 'On-Chain Bill Splitting',
    description: 'Real-time on-chain tracking, custom fractional shares, and instant participant settlements.',
    icon: Users,
    colSpan: 'md:col-span-1',
    gradient: 'from-cyan-500/10 to-transparent',
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black text-white font-[family-name:var(--font-jakarta)] selection:bg-white/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative px-4 sm:px-6 z-10 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle 800px at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%)',
        }} />

        <div className="container mx-auto max-w-[1000px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <Cpu size={12} className="text-white/50" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">The Protocol</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              Architected for <br />
              <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent pb-2">
                performance
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/50 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              ZPAY replaces legacy financial plumbing with a unified, agentic, globally distributed execution engine built on Stellar.
            </p>

            <div className="flex justify-center gap-4">
              <Link 
                href="/auth/signup"
                className="group h-12 sm:h-14 rounded-full bg-gold text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                <span className="flex items-center gap-2">
                  Start Building
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Box Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {bentoFeatures.map((feature, idx) => {
              const { icon: Icon, title, description, colSpan, gradient } = feature;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                  className={`group relative rounded-[2rem] bg-[#0d0d0d] border border-white/[0.06] p-8 sm:p-10 overflow-hidden hover:border-white/[0.12] transition-colors duration-500 ${colSpan}`}
                >
                  {/* Subtle Gradient Glow */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center mb-16 sm:mb-24 group-hover:bg-white/[0.06] group-hover:border-white/[0.15] transition-all duration-300">
                      <Icon size={22} className="text-white/70 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                      <p className="text-white/45 text-sm sm:text-base leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto max-w-[1000px]">
          <div className="rounded-[2.5rem] border border-emerald-500/20 bg-[#050505] p-10 sm:p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
              <ShieldCheck size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Bank-grade security, <br className="hidden sm:block" />by default.
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Every transaction is cryptographically signed and verified on the Stellar consensus protocol. We never hold your private keys.
            </p>
            <Link 
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-white font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Read Security Docs
            </Link>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
