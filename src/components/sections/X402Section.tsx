"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Terminal, Zap, CheckCircle2, ArrowRight, Play, Server, ShieldCheck, Database } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

const x402Steps = [
  {
    step: 1,
    title: '1. Agent Request',
    actor: 'AI Agent (LangChain)',
    action: 'GET /api/valuable-dataset',
    detail: 'Agent requests data without pre-paid API subscription',
    icon: Bot,
    color: 'border-blue-500/30 bg-blue-500/10 text-blue-400'
  },
  {
    step: 2,
    title: '2. 402 Challenge',
    actor: 'Server Response',
    action: 'HTTP 402 Payment Required',
    detail: 'Headers specify micro-fee: 0.001 USDC via Stellar',
    icon: Server,
    color: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
  },
  {
    step: 3,
    title: '3. ZPAY Auto-Routing',
    actor: 'ZPAY SDK Engine',
    action: 'X-Payment-Proof Attached',
    detail: 'Stellar path payment settled in 1.8s ($0.00001 gas)',
    icon: Zap,
    color: 'border-gold/40 bg-gold/10 text-gold'
  },
  {
    step: 4,
    title: '4. Resource Unlocked',
    actor: 'API Gateway',
    action: 'HTTP 200 OK + Payload Stream',
    detail: 'Data payload unlocked and delivered to LLM agent context',
    icon: CheckCircle2,
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  }
];

export default function X402Section() {
  const [activeStep, setActiveStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = () => {
    setIsRunning(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 700);
    setTimeout(() => setActiveStep(3), 1500);
    setTimeout(() => {
      setActiveStep(4);
      setIsRunning(false);
    }, 2300);
  };

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden border-t border-white/5 font-[family-name:var(--font-jakarta)]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[60vw] max-w-[700px] aspect-square rounded-full bg-gradient-to-tl from-blue-600/10 via-purple-600/5 to-transparent blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-md mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Machine Micro-Commerce</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            The Native <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-white bg-clip-text text-transparent">
              x402 Protocol
            </span>
          </h2>

          <p className="text-white/60 text-lg sm:text-xl font-medium leading-relaxed">
            Eliminate subscriptions. Allow AI agents to pay fractions of a cent per API call directly via HTTP status header interception.
          </p>
        </div>

        {/* Interactive Visualization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {x402Steps.map((item) => {
            const Icon = item.icon;
            const isActive = activeStep === item.step;
            const isCompleted = activeStep > item.step;

            return (
              <div
                key={item.step}
                className={`relative rounded-3xl border p-6 sm:p-8 transition-all duration-500 flex flex-col justify-between ${
                  isActive 
                    ? 'border-gold bg-[#111111] shadow-[0_0_40px_rgba(212,175,55,0.2)] scale-105 z-10' 
                    : isCompleted
                    ? 'border-emerald-500/40 bg-[#0a0a0a]'
                    : 'border-white/[0.08] bg-[#070707] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'bg-gold/20 text-gold animate-pulse' : 'bg-white/5 text-white/40'
                    }`}>
                      {isCompleted ? 'PASSED' : isActive ? 'ACTIVE' : 'WAITING'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="text-xs font-mono text-white/50 mb-3">{item.actor}</div>
                  
                  <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs text-gold mb-4 overflow-x-auto">
                    <code>{item.action}</code>
                  </div>

                  <p className="text-white/50 text-xs leading-relaxed font-medium">
                    {item.detail}
                  </p>
                </div>

                {item.step < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-white/20">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Simulation Trigger Bar */}
        <div className="rounded-3xl border border-white/10 bg-[#090909] p-8 sm:p-10 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Terminal size={18} className="text-gold" /> See x402 Protocol in Action
            </h4>
            <p className="text-white/50 text-sm">Run a live simulated AI agent micro-transaction sequence across the Stellar network.</p>
          </div>

          <button
            onClick={runDemo}
            disabled={isRunning}
            className="h-14 rounded-full bg-blue-500 hover:bg-blue-400 text-black font-black text-xs sm:text-sm uppercase tracking-widest px-8 transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Zap size={16} className="animate-spin" /> Executing Step {activeStep}/4...
              </>
            ) : (
              <>
                <Play size={16} fill="black" /> Run x402 Micro-Transaction Demo
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
