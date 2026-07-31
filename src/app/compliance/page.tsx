"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Scale, ShieldCheck, Globe, FileCheck } from 'lucide-react';

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Scale className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Regulatory Standard</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Global Compliance &amp; Standards
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Built to integrate seamlessly with regulated Stellar anchors, SEP standards, and global financial frameworks.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Globe className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Stellar SEP-12 &amp; SEP-24</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Standardized KYC/AML identity exchange protocols integrated directly with licensed fiat anchors worldwide.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <ShieldCheck className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Sanctions Screening</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Real-time OFAC and international sanctions list screening before processing fiat bridge settlements.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <FileCheck className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Audit Trails</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Immutable on-chain transaction records providing cryptographic proof of payment for business tax &amp; accounting compliance.
            </p>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
