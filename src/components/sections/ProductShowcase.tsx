"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from "@/components/ui/spotlight";
import { LayoutDashboard, ArrowLeftRight, ShieldCheck, Bot, PiggyBank } from 'lucide-react';

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Your Financial Command Centre',
    description: 'Real-time balance, live transaction feed, and quick actions in one unified view. Built for speed, designed for clarity.',
    image: '/images/showcase_dashboard.png',
    badge: 'Live on Mainnet',
    badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    id: 'p2p',
    label: 'P2P Send',
    icon: ArrowLeftRight,
    title: 'Send to Names, Not Addresses',
    description: 'Type bob@Zp instead of a 56 character Stellar key. Cross currency sends with live FX quotes locked for 30 seconds.',
    image: '/images/showcase_p2p.png',
    badge: '~3s Settlement',
    badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  },
  {
    id: 'escrow',
    label: 'Escrow',
    icon: ShieldCheck,
    title: 'Trustless Escrow Contracts',
    description: 'Lock funds in a Soroban smart contract, mark delivered, and release on completion. Built-in arbiter for dispute resolution.',
    image: '/images/showcase_escrow.png',
    badge: 'On-Chain',
    badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: Bot,
    title: 'Autonomous Payment Agents',
    description: 'AI agents that hold balances, parse smart invoices, and autonomously execute payments on your behalf via the x402 protocol.',
    image: '/images/showcase_agents.png',
    badge: 'x402 Protocol',
    badgeColor: 'bg-gold/10 border-gold/20 text-gold',
  },
  {
    id: 'vault',
    label: 'Vault',
    icon: PiggyBank,
    title: 'On-Chain Yield Vault',
    description: 'Fixed-term ZPAY staking plus an instant XLM yield pool that mints ZPAY rewards daily on-chain.',
    image: '/images/showcase_vault.png',
    badge: 'Up to 6% APY',
    badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
];

const trustItems = [
  { dot: 'bg-emerald-400', text: 'Live on Stellar Mainnet' },
  { dot: 'bg-gold', text: 'Sub-cent fees' },
  { dot: 'bg-blue-400', text: 'Instant settlement' },
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-20 sm:py-28 md:py-40 overflow-hidden"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />



      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Product</span>
          </div>

          <h2 className="font-black leading-[0.9] tracking-tight mb-5">
            <span className="block text-white text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[4.5rem]">See it</span>
            <span className="block text-zinc-400 text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[4.5rem]">in action.</span>
          </h2>

          <p className="text-white/50 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Not a mockup. Not a prototype. A fully deployed product running live on Stellar Mainnet. Explore key features below.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
        >
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                    : 'bg-white/[0.03] text-white/50 border-white/10 hover:bg-white/[0.07] hover:text-white/80 hover:border-white/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Tab content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12 items-center"
            >
              {/* Left: text */}
              <div className="flex flex-col gap-5 order-2 lg:order-1">
                <span className={`self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${tabs[activeTab].badgeColor}`}>
                  {tabs[activeTab].badge}
                </span>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  {tabs[activeTab].title}
                </h3>

                <p className="text-white/55 text-sm sm:text-base md:text-lg leading-relaxed">
                  {tabs[activeTab].description}
                </p>

                <div className="flex flex-wrap gap-3 mt-2">
                  {trustItems.map((item) => (
                    <div key={item.text} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                      <span className="text-white/40 text-xs font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: screenshot */}
              <div className="relative order-1 lg:order-2 group">
                {/* Glow behind screenshot */}
                <div
                  className="absolute -inset-4 rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                />

                {/* Screenshot frame with browser chrome */}
                <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0d0d0d] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                  {/* Browser chrome bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-[#0a0a0a]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white/[0.05] rounded-md px-3 py-1 text-[10px] text-white/30 font-mono text-center max-w-[200px] mx-auto">
                        zpayrouter.me
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={tabs[activeTab].image}
                      alt={tabs[activeTab].title}
                      fill
                      className="object-cover object-top"
                      unoptimized
                      priority={activeTab === 0}
                    />
                  </div>
                </div>

                {/* Live badge on screenshot */}
                <div className="absolute top-14 right-3 sm:top-16 sm:right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span className="text-[10px] font-bold text-white/60">LIVE</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-14 sm:mt-20 text-center"
        >
          <LiquidMetalButton label="Explore the App" href="https://zpayrouter.me" />
        </motion.div>
      </div>
    </section>
  );
}
