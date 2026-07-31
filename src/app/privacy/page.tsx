"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[900px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-white/40 text-sm">Last Updated: July 30, 2026</p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[800px] mx-auto text-white/70 space-y-8 leading-relaxed font-medium">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          <p>
            ZPAY operates on a privacy-first, non-custodial architecture. We do not collect or store your private cryptographic keys, seed phrases, or master wallet passwords.
          </p>
          <p>
            When you use our web dashboard or API, we may process minimal operational data, including public wallet addresses, transaction hashes, and basic telemetry to optimize sub-cent routing performance.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. Blockchain Transparency</h2>
          <p>
            Please note that transactions executed on the Stellar blockchain are inherently public. Your public address and transaction ledger entries are permanently recorded on-chain.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Data Security &amp; Encryption</h2>
          <p>
            All off-chain communication between your client application and ZPAY API endpoints is encrypted using TLS 1.3 standards. We employ zero-knowledge principles wherever possible.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact our privacy compliance team at <span className="text-gold font-mono">privacy@zpay.route</span>.
          </p>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
