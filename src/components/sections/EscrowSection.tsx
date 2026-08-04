"use client";

import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, FileCode2, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

const milestones = [
  { step: 1, title: 'Contract Deployed', desc: 'Soroban WASM compiled & funded on-chain', time: '12:04:01 PM', status: 'done' },
  { step: 2, title: 'Deliverable Submitted', desc: 'Hash of milestone artifact anchored', time: '12:04:03 PM', status: 'done' },
  { step: 3, title: 'Cryptographic Audit', desc: 'Proof verified across Stellar validators', time: '12:04:06 PM', status: 'done' },
  { step: 4, title: 'Capital Released', desc: '$50,000 USDC transferred to vendor', time: '12:04:08 PM', status: 'done' },
];

const pillars = [
  {
    icon: FileCode2,
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10',
    title: 'Soroban WASM Architecture',
    desc: 'Written in Rust and compiled to WebAssembly. Executes with sub-second finality and formal verification on the Stellar network.',
  },
  {
    icon: ShieldCheck,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    title: 'Milestone-Based Verification',
    desc: 'Connect API webhooks or multi-sig arbiter keys. Funds unlock programmatically when cryptographic proof conditions pass.',
  },
  {
    icon: Cpu,
    accent: 'text-white',
    border: 'border-white/10',
    bg: 'bg-white/5',
    title: 'Sub-Cent Settlement Fees',
    desc: 'Execute enterprise escrows or freelance milestones for $0.00001 in network gas — regardless of contract size or capital locked.',
  },
];

export default function EscrowSection() {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    milestones.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleSteps(i + 1), i * 600 + 400));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden border-t border-white/5 font-[family-name:var(--font-jakarta)]">
      <Spotlight className="-top-40 right-0 md:right-60 md:-top-20" fill="white" />

      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[700px] aspect-square rounded-full bg-gradient-to-br from-amber-500/8 via-amber-500/3 to-transparent blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Badge & Title */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md mb-6">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Soroban Smart Escrow</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            Trustless Escrows.{' '}
            <br />
            <span className="text-zinc-400">
              Zero Counterparty Risk.
            </span>
          </h2>

          <p className="text-white/55 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
            Lock capital on-chain inside audited Soroban smart contracts. Release funds programmatically when milestone deliverables or API triggers are cryptographically verified — no humans in the loop.
          </p>
        </div>

        {/* Two-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: Feature Pillars */}
          <div className="lg:col-span-5 space-y-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="group rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-7 hover:border-white/15 transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${p.accent}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { val: '$0.00001', label: 'Gas per tx' },
                { val: '< 3s', label: 'Settlement' },
                { val: '100%', label: 'Non-custodial' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-4 text-center">
                  <div className="text-lg font-black text-amber-300 mb-1">{s.val}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Contract Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[2rem] border border-white/[0.09] bg-[#080808] p-6 sm:p-10 shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.07] mb-8 relative z-10">
                <div>
                  <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest block mb-1">Soroban Contract</span>
                  <span className="text-sm font-mono font-bold text-amber-300">escrow_soroban_9901a1</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Executed</span>
                </div>
              </div>

              {/* Locked Balance */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 mb-8 flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] text-white/35 uppercase font-semibold tracking-wider block mb-1.5">Total Capital Settled</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    $50,000.00 <span className="text-sm font-normal text-white/35">USDC</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/35 block mb-1">Network Fee</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">0.00001 XLM</span>
                </div>
              </div>

              {/* Execution Trail */}
              <div className="space-y-3 mb-6 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/35 block mb-3">Execution Trail</span>

                {milestones.map((m) => {
                  const isVisible = m.step <= visibleSteps;
                  return (
                    <div
                      key={m.step}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                        isVisible
                          ? 'border-emerald-500/25 bg-emerald-500/5 opacity-100 translate-y-0'
                          : 'border-white/5 bg-white/[0.01] opacity-0 translate-y-2'
                      }`}
                      style={{ transitionDelay: `${m.step * 80}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isVisible ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/40'
                        }`}>
                          {isVisible ? <CheckCircle2 size={14} /> : m.step}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{m.title}</div>
                          <div className="text-xs text-white/40">{m.desc}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-semibold text-emerald-400/80 shrink-0 ml-2">
                        {isVisible ? m.time : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA strip */}
              <div className="flex items-center gap-3 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 relative z-10">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-xs text-white/60 font-medium leading-relaxed">
                  Every step is immutably recorded on the Stellar ledger. No human can override, delay, or intercept the capital release once conditions are met.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
