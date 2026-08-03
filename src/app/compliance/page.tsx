"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Scale, ShieldCheck, Globe, FileCheck, CheckCircle2, Lock, AlertTriangle, Database } from 'lucide-react';

const standards = [
  {
    icon: Globe,
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/8',
    title: 'Stellar SEP-12 & SEP-24',
    shortTitle: 'KYC / AML Identity',
    desc: 'ZPAY integrates with SEP-12 (Know Your Customer) and SEP-24 (Deposit & Withdrawal) protocols through licensed Stellar anchor partners. These standards govern how user identity is securely exchanged with regulated fiat gateways without ZPAY holding KYC data directly.',
    items: ['ISO 20022 aligned identity exchange', 'Anchor KYC data never stored on ZPAY servers', 'Jurisdiction-specific anchor routing'],
  },
  {
    icon: ShieldCheck,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/8',
    title: 'Sanctions Screening',
    shortTitle: 'OFAC / AML Controls',
    desc: 'Every fiat-bridged transaction is screened against OFAC, UN, EU, and HMT sanctions lists in real time before settlement is authorized. Our compliance engine cross-references counterparty wallet addresses and rejects flagged transactions within milliseconds.',
    items: ['Real-time OFAC & UN list checks', 'Automated rejection for sanctioned addresses', 'Full audit log retained for regulatory review'],
  },
  {
    icon: Database,
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/8',
    title: 'Immutable Audit Trails',
    shortTitle: 'Tax & Accounting Proof',
    desc: 'Every transaction event is anchored to the Stellar ledger with a cryptographic hash. This creates a tamper-proof, permanent record suitable for business financial auditing, cross-border tax reporting, and enterprise accounting integrations.',
    items: ['Immutable on-chain transaction anchoring', 'CSV/JSON export for accounting software', 'Real-time webhook audit event stream'],
  },
  {
    icon: Lock,
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/8',
    title: 'GDPR & Data Residency',
    shortTitle: 'EU Privacy Compliance',
    desc: 'For users operating within the European Union, ZPAY applies GDPR-compliant data handling. Minimal operational data is retained, subject to user data deletion requests. No personal data is sold or shared with third-party advertising networks.',
    items: ['Right-to-deletion request support', 'EU-resident data processed in EU infrastructure', 'Data minimization by architectural design'],
  },
];

const checklist = [
  'Stellar Ecosystem Standard (SEP) compliance for all on/off-ramp flows',
  'OFAC real-time sanctions screening on all fiat bridge transactions',
  'AML transaction monitoring with automated alert thresholds',
  'ISO 20022 financial message formatting for anchor integrations',
  'TLS 1.3 end-to-end encryption on all API and dashboard channels',
  'GDPR-compliant data handling for EU-resident users',
  'Immutable Stellar ledger audit trail for every transaction event',
  'Bug Bounty Program with responsible disclosure incentives',
];

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-44 pb-20 px-4 sm:px-6 text-center max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Regulatory Standards</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
          Global Compliance &{' '}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">
            Standards
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/55 max-w-3xl mx-auto font-medium leading-relaxed">
          ZPAY is architected to integrate with global regulatory frameworks out of the box — from KYC identity exchange to OFAC sanctions screening and immutable tax audit trails.
        </p>
      </section>

      {/* Standards Grid */}
      <section className="py-8 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={`rounded-3xl border ${s.border} bg-[#0a0a0a] p-8 sm:p-10`}>
                <div className={`w-12 h-12 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${s.accent}`} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${s.accent} block mb-2`}>{s.shortTitle}</span>
                <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="space-y-2.5">
                  {s.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${s.accent} shrink-0`} />
                      <span className="text-white/65 text-xs font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full Checklist */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="rounded-3xl border border-white/[0.08] bg-[#080808] p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-8">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Compliance Checklist</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-6 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-white/55 text-sm leading-relaxed">
            ZPAY is a non-custodial protocol infrastructure provider. We do not hold funds, offer financial advice, or serve as a licensed money transmitter. Users are responsible for compliance with applicable laws in their jurisdiction. For enterprise compliance inquiries, contact{' '}
            <a href="mailto:compliance@zpay.route" className="text-amber-400 font-semibold hover:underline">compliance@zpay.route</a>.
          </p>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
