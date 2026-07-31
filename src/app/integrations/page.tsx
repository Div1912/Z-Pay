"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Cpu, Code2, Globe, Database, Shield, Zap, ArrowUpRight } from 'lucide-react';

const integrationsList = [
  { name: 'Stellar Network', category: 'Blockchain Core', desc: 'Native SCP integration for instant asset movement and path payment routing.', icon: Zap, status: 'Active' },
  { name: 'Soroban Smart Contracts', category: 'Execution Engine', desc: 'Rust-based smart contract execution for multi-party split payments and escrows.', icon: Code2, status: 'Active' },
  { name: 'Circle (USDC)', category: 'Settlement Anchor', desc: '1:1 USD backed stablecoin liquidity for cross-border institutional settlement.', icon: Globe, status: 'Active' },
  { name: 'UPI Gateway Bridge', category: 'Fiat On/Off Ramp', desc: 'Direct merchant QR code resolution and instant INR settlement for physical commerce.', icon: Database, status: 'Active' },
  { name: 'LangChain AI SDK', category: 'Agent Ecosystem', desc: 'Native tools and plugins for autonomous LangChain agents to manage wallets and pay API fees.', icon: Cpu, status: 'Active' },
  { name: 'AutoGen Framework', category: 'Multi-Agent Support', desc: 'Multi-agent consensus payment handlers for complex workflow execution.', icon: Shield, status: 'Active' },
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Code2 className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Ecosystem</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Integrations &amp; Protocols
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Connect ZPAY seamlessly with leading blockchain networks, fiat rails, and AI agent frameworks.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrationsList.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="group rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      {item.status}
                    </span>
                  </div>
                  <span className="text-xs text-white/40 font-semibold tracking-wide uppercase">{item.category}</span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-3">{item.name}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-white/70 group-hover:text-gold transition-colors">
                  <span>View Technical Specs</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
