"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Users, Heart, Zap, Globe, Briefcase } from 'lucide-react';

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Briefcase className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Careers at ZPAY</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Build the Future of <br />
          <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent">
            Automated Commerce
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          We are a distributed team of engineers, cryptographers, and product builders working on the next generation of payment infrastructure.
        </p>
      </section>

      {/* Specific user requirement banner */}
      <section className="py-12 px-4 sm:px-6 max-w-[900px] mx-auto">
        <div className="rounded-3xl border border-gold/20 bg-gold/5 p-10 sm:p-12 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-6">
            No Open Positions Right Now
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            We are not actively hiring at this moment
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed mb-8">
            Our core engineering team is currently full. However, we are always excited to meet exceptional talent passionate about Stellar, Soroban, and Agentic Finance.
          </p>
          <a
            href="mailto:careers@zpay.route"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white text-black font-bold px-8 text-sm hover:bg-gold transition-colors"
          >
            Submit General Application
          </a>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Globe className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Remote</h3>
            <p className="text-white/50 text-sm leading-relaxed">Work from anywhere in the world with flexible asynchronous hours.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Zap className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Competitive Compensation</h3>
            <p className="text-white/50 text-sm leading-relaxed">Top-tier salary package with token equity grants.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Heart className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Cutting-Edge Stack</h3>
            <p className="text-white/50 text-sm leading-relaxed">Rust, Soroban, TypeScript, Next.js, and cutting-edge LLM frameworks.</p>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
