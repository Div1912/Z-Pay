"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Shield, Zap, Globe, Cpu, Sparkles, ArrowRight, Layers, Compass, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const timelineEvents = [
  {
    year: '2025',
    title: 'The Friction Point',
    subtitle: 'Why Legacy Banking Failed AI',
    description: 'Autonomous AI agents began writing code, calling APIs, and generating value. But every API required a human credit card, a manual 2FA SMS code, or high-fee payment processors. The machine economy was stuck in a 1970s banking paradigm.'
  },
  {
    year: 'Q1 2026',
    title: 'The Stellar Breakthrough',
    subtitle: 'Sub-Cent Subseconds',
    description: 'We chose the Stellar Consensus Protocol for its unmatched sub-cent fees ($0.00001 per tx) and sub-3 second settlement times. We built the ZPAY core pathfinding engine to route cross-currency payments without intermediary spreads.'
  },
  {
    year: 'Q2 2026',
    title: 'x402 & UPI Bridge',
    subtitle: 'Machine-to-Machine + Real World',
    description: 'We integrated native HTTP 402 Payment Required headers into our SDKs, enabling pay-per-use API calls. Simultaneously, we built the Indian UPI Bridge, allowing users to spend crypto balances at any offline merchant QR code.'
  },
  {
    year: 'Present',
    title: 'The Autonomous Layer',
    subtitle: 'Powering 24/7 Commerce',
    description: 'Today ZPAY routes transactions for developers, AI agents, and global merchants — powering trustless Soroban smart escrows, instant split payouts, and gasless user transactions.'
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      {/* Storyline Hero */}
      <section className="pt-36 sm:pt-44 pb-20 px-4 sm:px-6 relative z-10 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">The ZPAY Story</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
          Architecting the <br />
          <span className="bg-gradient-to-r from-gold via-amber-300 to-white bg-clip-text text-transparent">
            Machine Economy
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">
          ZPAY is the autonomous financial routing layer designed for a world where humans and AI agents transact seamlessly, instantly, and at near-zero cost.
        </p>
      </section>

      {/* Narrative Storyline Section */}
      <section className="py-20 px-4 sm:px-6 max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-3">Evolution &amp; Roadmap</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Our Journey</h2>
        </div>

        <div className="relative border-l border-white/10 pl-6 sm:pl-12 space-y-16">
          {timelineEvents.map((item, idx) => (
            <div key={item.year} className="relative group">
              {/* Glow Dot */}
              <div className="absolute -left-[31px] sm:-left-[55px] top-1.5 w-4 h-4 rounded-full bg-gold shadow-[0_0_15px_#d4af37] group-hover:scale-125 transition-transform" />
              
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold">
                  {item.year}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{item.title}</h3>
              </div>

              <span className="text-sm font-semibold text-white/40 uppercase tracking-wide block mb-4">{item.subtitle}</span>

              <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 hover:border-white/20 transition-all duration-300">
                <p className="text-white/60 text-base sm:text-lg leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-10 sm:p-16">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-16">Built Different By Design</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white">Stellar Consensus Core</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Settles transactions in &lt; 3 seconds with sub-cent fees. No energy-wasting mining or multi-dollar gas spikes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Soroban Smart Escrow</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Rust-based, formal-verified smart contracts handling automated multi-party splits and conditional milestone payouts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Native x402 Micropayments</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Implemented directly into AI SDKs to let LLMs pay per API call seamlessly without human intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl sm:text-6xl font-black mb-8">Join the Autonomous Economy</h2>
        <Link 
          href="/auth/signup"
          className="inline-flex h-14 items-center justify-center rounded-full bg-gold px-10 text-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          Start Building Now <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </section>

      <FooterCTA />
    </main>
  );
}
