"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Shield, Lock, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Trust &amp; Security</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Security Architecture
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Bank-grade encryption, audited Soroban smart contracts, and zero-custody protocol design.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <Lock className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Non-Custodial Guarantee</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your private keys never touch our servers. Transactions are signed locally on your device or hardware wallet before broadcast.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <Cpu className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Audited Soroban Contracts</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Our automated split contracts and smart escrows are independently audited and formal-verified to eliminate vulnerability vectors.
            </p>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#080808] p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-8">Security Controls &amp; Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              'End-to-End TLS 1.3 Encryption',
              'MPC Multi-Party Computation Key Shares',
              '24/7 Automated On-Chain Anomaly Detection',
              'Bug Bounty Program (up to $50,000 reward)',
              'Stellar SEP-10 Authentication Protocol',
              'Automated Rate-Limiting & DDoS Shield'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/80 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
