"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Cpu, Code2, Globe, Database, Shield, Zap, ArrowUpRight, Layers, Lock, GitBranch, Bot, Link2 } from 'lucide-react';

const categories = [
  {
    label: 'Blockchain Core',
    integrations: [
      {
        name: 'Stellar Network',
        desc: 'Native SCP integration for sub-3s settlement, path payment routing, and DEX liquidity arbitration across asset pairs.',
        icon: Zap,
        status: 'Active',
        accent: 'text-blue-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
      {
        name: 'Soroban Smart Contracts',
        desc: 'Rust-based WASM execution engine for multi-party split payments, trustless escrows, and time-locked capital release.',
        icon: Code2,
        status: 'Active',
        accent: 'text-purple-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
    ]
  },
  {
    label: 'Stablecoins & Settlement',
    integrations: [
      {
        name: 'Circle (USDC)',
        desc: '1:1 USD backed stablecoin liquidity powering institutional cross-border settlement with instant conversion to fiat.',
        icon: Globe,
        status: 'Active',
        accent: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
      {
        name: 'UPI Gateway Bridge',
        desc: 'Direct merchant QR code resolution and instant INR settlement via SEP-24 compliant anchors for physical commerce.',
        icon: Link2,
        status: 'Active',
        accent: 'text-amber-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
    ]
  },
  {
    label: 'AI Agent Ecosystem',
    integrations: [
      {
        name: 'LangChain SDK',
        desc: 'Native ZPAY tools and plugins enabling autonomous LangChain agents to create wallets, route payments, and pay API fees via x402.',
        icon: Bot,
        status: 'Active',
        accent: 'text-green-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
      {
        name: 'AutoGen Framework',
        desc: 'Multi-agent consensus payment handlers for orchestrated workflow execution across collaborative agent pipelines.',
        icon: Layers,
        status: 'Active',
        accent: 'text-blue-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
    ]
  },
  {
    label: 'Developer Tooling',
    integrations: [
      {
        name: 'Stellar Anchor SEP-24',
        desc: 'Compliant deposit/withdrawal flows for regulated fiat gateways, enabling users to on- and off-ramp from any jurisdiction.',
        icon: Shield,
        status: 'Active',
        accent: 'text-teal-400',
        badgeBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
      },
      {
        name: 'GitHub Actions CI',
        desc: 'Deploy and verify Soroban contracts, run SDK integration tests, and automate audit checks directly inside your CI pipeline.',
        icon: GitBranch,
        status: 'Beta',
        accent: 'text-white/70',
        badgeBorder: 'border-amber-500/30',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-400',
      },
    ]
  },
];

const stats = [
  { val: '6+', label: 'Active Integrations' },
  { val: '140+', label: 'Countries Supported' },
  { val: '< 3s', label: 'Settlement Finality' },
  { val: '$0.00001', label: 'Per Transaction' },
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-44 pb-16 px-4 sm:px-6 text-center max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Ecosystem</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
          Integrations &{' '}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">
            Protocols
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/55 max-w-3xl mx-auto font-medium leading-relaxed">
          Connect ZPAY seamlessly with leading blockchain networks, fiat settlement rails, and autonomous AI agent frameworks.
        </p>
      </section>

      {/* Stats Row */}
      <section className="pb-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6 text-center">
              <div className="text-3xl font-black text-amber-300 mb-1">{s.val}</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Categories */}
      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto space-y-12">
        {categories.map((cat) => (
          <div key={cat.label}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-5 pl-1">{cat.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cat.integrations.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="group rounded-3xl border border-white/[0.07] bg-[#0c0c0c] p-8 hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className={`w-6 h-6 ${item.accent}`} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${item.badgeBorder} ${item.badgeBg} ${item.badgeText}`}>
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.name}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs font-bold text-white/50 group-hover:text-amber-400 transition-colors">
                      <span>View Technical Docs</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <FooterCTA />
    </main>
  );
}
