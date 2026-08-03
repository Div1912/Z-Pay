"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Shield, Lock, Cpu, CheckCircle2, Eye, Key, FileSearch, Server, Globe, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const securityPillars = [
  {
    icon: Lock,
    title: 'Non-Custodial by Design',
    desc: 'Your private keys never touch our infrastructure. Every transaction is signed locally on your device or HSM before it is broadcast to the Stellar network. We hold zero custody over user funds at any point.',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/8',
  },
  {
    icon: Cpu,
    title: 'Audited Soroban Contracts',
    desc: 'All escrow, split, and routing smart contracts are written in formally-verified Rust, compiled to WASM, and independently audited by third-party security firms. Contract source is open and immutable once deployed.',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/8',
  },
  {
    icon: Eye,
    title: 'Real-Time Threat Monitoring',
    desc: '24/7 automated on-chain anomaly detection continuously monitors transaction patterns. Unusual activity triggers instant circuit breakers — pausing contract execution without requiring human intervention.',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/8',
  },
  {
    icon: Key,
    title: 'MPC Key Architecture',
    desc: 'Multi-Party Computation distributes cryptographic key shares across geographically separated nodes. No single server holds a complete key, eliminating single points of compromise at the infrastructure layer.',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/8',
  },
];

const controls = [
  'End-to-End TLS 1.3 Encryption on all API channels',
  'Stellar SEP-10 challenge-response Authentication Protocol',
  'MPC key share distribution across 5+ geographies',
  'Automated rate-limiting, DDoS mitigation & IP allowlisting',
  'Immutable on-chain audit trail for every transaction event',
  'Bug Bounty Program with payouts up to $50,000 USD',
  'Automated circuit-breaker smart contract kill switches',
  'GDPR-compliant data residency controls for EU users',
];

const auditLog = [
  { time: '14:31:02', event: 'Payment signed & broadcast', hash: 'a3f4e1...b91c', status: 'success' },
  { time: '14:31:03', event: 'Stellar ledger confirmed', hash: 'a3f4e1...b91c', status: 'success' },
  { time: '14:31:04', event: 'Escrow contract verified', hash: '7d2c09...a40e', status: 'success' },
  { time: '14:31:05', event: 'Anomaly scan completed', hash: 'system', status: 'success' },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-44 pb-20 px-4 sm:px-6 text-center max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 mb-8 backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Trust & Security</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
          Security{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
            Architecture
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/55 max-w-3xl mx-auto font-medium leading-relaxed">
          ZPAY is built with a zero-trust, non-custodial architecture from the ground up. No user funds ever touch our servers — the protocol enforces this at the cryptographic layer.
        </p>
      </section>

      {/* Security Pillars */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className={`rounded-3xl border ${p.border} bg-[#0a0a0a] p-8 sm:p-10`}>
                <div className={`w-12 h-12 rounded-2xl ${p.bg} border ${p.border} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${p.accent}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-col: Controls + Audit Log */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Security Controls */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#080808] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <FileSearch className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Security Controls & Standards</h2>
            </div>
            <div className="space-y-4">
              {controls.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Audit Log Visual */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#080808] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Server className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Immutable Audit Trail</h2>
            </div>
            <div className="space-y-3 mb-6">
              {auditLog.map((entry, idx) => (
                <div key={idx} className="rounded-xl border border-white/[0.06] bg-black/40 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white/85 truncate">{entry.event}</div>
                      <div className="text-xs font-mono text-white/35 truncate">hash: {entry.hash}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-white/40 shrink-0">{entry.time}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-white/60 leading-relaxed font-medium">
              All audit events are written to the Stellar ledger in real time. They cannot be altered, deleted, or suppressed by any party including ZPAY.
            </div>
          </div>
        </div>
      </section>

      {/* Bug Bounty CTA */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent p-10 sm:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Bug Bounty Program</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Found a vulnerability?</h2>
            <p className="text-white/55 text-base leading-relaxed max-w-xl">
              Responsible disclosure is rewarded. Critical vulnerabilities in our smart contracts or API infrastructure qualify for payouts up to $50,000 USD.
            </p>
          </div>
          <Link
            href="mailto:security@zpay.route"
            className="inline-flex h-14 items-center justify-center rounded-full bg-amber-400 text-black font-black text-sm uppercase tracking-widest px-10 hover:scale-105 transition-all shadow-[0_0_30px_rgba(251,191,36,0.25)] shrink-0 gap-2"
          >
            Report Security Issue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
