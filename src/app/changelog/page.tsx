"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { GitCommit, Tag, Sparkles, ShieldAlert, Cpu } from 'lucide-react';

const releases = [
  {
    version: 'v1.4.0',
    date: 'July 28, 2026',
    title: 'x402 Micropayment Engine & UPI Bridge v2',
    type: 'Major Feature',
    changes: [
      'Introduced autonomous HTTP 402 Payment Required middleware for Node.js & Python SDKs.',
      'Optimized Stellar pathfinding algorithms, cutting average routing latency down to 1.8 seconds.',
      'Added instant QR payload parser for Indian UPI merchants with auto-conversion to INR.',
      'Upgraded Soroban split contracts to support up to 50 parallel payout accounts.'
    ]
  },
  {
    version: 'v1.2.5',
    date: 'June 14, 2026',
    title: 'Soroban Escrow Protocol Upgrade',
    type: 'Security Release',
    changes: [
      'Audited multi-sig timeout locks for dispute resolution.',
      'Added automated gasless fee-sponsorship relayer node to prevent failed transactions.',
      'Enhanced dashboard analytics with real-time webhooks for failed payment retries.'
    ]
  },
  {
    version: 'v1.0.0',
    date: 'April 02, 2026',
    title: 'Initial Stellar Mainnet Launch',
    type: 'Release',
    changes: [
      'Official deployment of ZPAY core protocol on Stellar Mainnet.',
      'ZPAY Universal ID domain registry deployment.',
      'Full TypeScript & Python SDK launch with non-custodial wallet creation.'
    ]
  }
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <GitCommit className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Protocol Updates</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Changelog &amp; Release Notes
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Track the evolution of the ZPAY payment router, SDK updates, and protocol upgrades.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[900px] mx-auto">
        <div className="relative border-l border-white/10 pl-6 sm:pl-10 space-y-16">
          {releases.map((rel) => (
            <div key={rel.version} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-gold shadow-[0_0_12px_#d4af37]" />
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-2xl font-black text-white">{rel.version}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
                  {rel.type}
                </span>
                <span className="text-xs text-white/40 font-medium ml-auto">{rel.date}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white/90 mb-4">{rel.title}</h3>
              
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 sm:p-8 space-y-3">
                {rel.changes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
