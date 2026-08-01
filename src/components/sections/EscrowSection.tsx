"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Cpu, FileCode2 } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

const milestones = [
  { step: 1, title: 'Escrow Initiated', desc: 'Soroban contract compiled & funded', status: 'completed', time: '12:04:01 PM' },
  { step: 2, title: 'Milestone Submitted', desc: 'Deliverable hash submitted on-chain', status: 'completed', time: '12:04:03 PM' },
  { step: 3, title: 'Automated Audit', desc: 'Cryptographic proof verified 100%', status: 'active', time: 'In Progress' },
  { step: 4, title: 'Capital Released', desc: 'USDC transferred to vendor', status: 'pending', time: 'Awaiting Step 3' },
];

export default function EscrowSection() {
  const [activeStep, setActiveStep] = useState(3);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateRelease = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setActiveStep(4);
      setIsSimulating(false);
    }, 1200);
  };

  const resetSimulation = () => {
    setActiveStep(3);
  };

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden border-t border-white/5 font-[family-name:var(--font-jakarta)]">
      <Spotlight className="-top-40 right-0 md:right-60 md:-top-20" fill="white" />
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[700px] aspect-square rounded-full bg-gradient-to-br from-gold/10 via-amber-500/5 to-transparent blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Badge & Title */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-6">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Soroban Smart Escrow</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            Trustless Escrows. <br />
            <span className="bg-gradient-to-r from-gold via-amber-300 to-white bg-clip-text text-transparent">
              Zero Counterparty Risk.
            </span>
          </h2>

          <p className="text-white/60 text-lg sm:text-xl font-medium leading-relaxed">
            Lock funds on-chain within Soroban smart contracts. Release capital programmatically when milestone deliverables or API triggers are verified.
          </p>
        </div>

        {/* Two-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Feature Items */}
          <div className="lg:col-span-5 space-y-8">
            <div className="group rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 hover:border-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
                <FileCode2 className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Soroban WASM Architecture</h3>
              <p className="text-white/50 text-base leading-relaxed">
                Written in Rust and compiled to WebAssembly. Executes with sub-second finality on the Stellar network with formal verification.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Automated Milestone Verification</h3>
              <p className="text-white/50 text-base leading-relaxed">
                Connect API webhooks or multi-sig arbiter keys. Funds are unlocked instantly when cryptographic proof conditions pass.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sub-Cent Settlement Fees</h3>
              <p className="text-white/50 text-base leading-relaxed">
                Execute enterprise escrows or micro-freelance milestones for $0.00001 in network gas, regardless of contract size.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contract Card UI */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[2.5rem] border border-white/10 bg-[#080808] p-6 sm:p-10 shadow-2xl overflow-hidden group">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Contract ID</span>
                  <span className="text-sm font-mono font-bold text-gold">escrow_soroban_990141</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 font-bold">LOCKED ON-CHAIN</span>
                </div>
              </div>

              {/* Locked Balance Display */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-gold/10 via-white/[0.03] to-transparent p-6 mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs text-white/40 uppercase font-semibold tracking-wider block mb-1">Total Locked Capital</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">$50,000.00 <span className="text-sm font-normal text-white/40">USDC</span></div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/40 block mb-1">Fee Sponsored</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">0.00001 XLM</span>
                </div>
              </div>

              {/* Milestone Stepper Visual */}
              <div className="space-y-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-2">Milestone Execution Trail</span>
                
                {milestones.map((m) => {
                  const isDone = m.step < activeStep || (m.step === 4 && activeStep === 4);
                  const isCurrent = m.step === activeStep && activeStep !== 4;

                  return (
                    <div 
                      key={m.step}
                      className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                        isDone 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : isCurrent 
                          ? 'border-gold/50 bg-gold/10' 
                          : 'border-white/5 bg-white/[0.02] opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone 
                            ? 'bg-emerald-400 text-black' 
                            : isCurrent 
                            ? 'bg-gold text-black animate-pulse' 
                            : 'bg-white/10 text-white/40'
                        }`}>
                          {isDone ? <CheckCircle2 size={16} /> : m.step}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{m.title}</div>
                          <div className="text-xs text-white/40">{m.desc}</div>
                        </div>
                      </div>

                      <div className="text-xs font-mono font-semibold text-white/50">
                        {isDone ? 'Verified' : isCurrent ? 'Auditing...' : m.time}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Release Trigger Button */}
              <div className="flex items-center gap-4">
                {activeStep !== 4 ? (
                  <button
                    onClick={simulateRelease}
                    disabled={isSimulating}
                    className="flex-1 h-14 rounded-full bg-gold text-black font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Verifying On-Chain Proof...
                      </>
                    ) : (
                      <>
                        Simulate Milestone Release <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={resetSimulation}
                    className="flex-1 h-14 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold text-sm uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Capital Released ($50,000.00 USDC) • Reset Demo
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
