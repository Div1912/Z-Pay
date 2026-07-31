"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[900px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <FileText className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-white/40 text-sm">Last Updated: July 30, 2026</p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[800px] mx-auto text-white/70 space-y-8 leading-relaxed font-medium">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the ZPAY protocol, website, developer SDKs, or API services, you agree to be bound by these Terms of Service and all applicable laws.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. Non-Custodial Protocol</h2>
          <p>
            ZPAY is a software protocol and routing layer. We do not act as a bank, financial institution, or custodian of your digital assets. You maintain sole ownership and control of your private cryptographic keys.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Acceptable Use</h2>
          <p>
            You agree not to use ZPAY for any illegal activities, including but not limited to money laundering, terror financing, or circumventing global economic sanctions.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Limitation of Liability</h2>
          <p>
            The software is provided "as is" without warranty of any kind. ZPAY shall not be liable for any direct, indirect, or consequential losses resulting from blockchain network congestion or smart contract errors.
          </p>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
