"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Shield, Zap, Globe, Cpu, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-40 pb-20 px-4 sm:px-6 relative z-10 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Globe className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">About ZPAY</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.05]">
          Pioneering the Autonomous <br />
          <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent">
            Financial Layer
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
          ZPAY was founded on a singular premise: as AI agents become autonomous economic actors, traditional banking rails are too slow, fragmented, and expensive to support them.
        </p>
      </section>

      {/* Mission & Stats */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <h3 className="text-4xl font-black text-white mb-2">&lt; 3s</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Settlement Time</p>
            <p className="text-white/40 text-sm leading-relaxed">Global finality powered by the Stellar Consensus Protocol with zero chargeback risk.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <h3 className="text-4xl font-black text-gold mb-2">$0.00001</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Base Transaction Fee</p>
            <p className="text-white/40 text-sm leading-relaxed">Sub-cent execution costs allowing autonomous micro-payments at massive scale.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <h3 className="text-4xl font-black text-white mb-2">100%</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Non-Custodial Architecture</p>
            <p className="text-white/40 text-sm leading-relaxed">Cryptographically secured with user-controlled keys and Soroban smart escrows.</p>
          </div>
        </div>

        {/* Pillars */}
        <div className="space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/[0.06] bg-[#080808] p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Machine-Native Payments</h3>
              <p className="text-white/50 leading-relaxed">
                We design protocols tailored for software agents, API consumers, and automated micro-subscriptions via the x402 HTTP standard.
              </p>
            </div>
            <div className="rounded-3xl border border-white/[0.06] bg-[#080808] p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Trustless Verification</h3>
              <p className="text-white/50 leading-relaxed">
                Every transaction and split contract is verified on-chain. Smart contracts ensure funds move only when precise conditions are met.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
