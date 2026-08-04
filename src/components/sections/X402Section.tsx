"use client";

import React from 'react';
import { Zap, Bot, Server, CheckCircle2, ArrowRight, Code2, Globe, Lock } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

const steps = [
  {
    step: '01',
    icon: Bot,
    title: 'Agent Makes Request',
    actor: 'AI Agent (LangChain / AutoGen)',
    action: 'GET /api/dataset',
    desc: 'Agent calls a paid API endpoint without a pre-purchased subscription or credit card.',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/8',
  },
  {
    step: '02',
    icon: Server,
    title: 'Server Issues 402',
    actor: 'HTTP Response',
    action: 'HTTP 402 Payment Required',
    desc: 'Server responds with a standard 402 header specifying micro-fee: 0.001 USDC via Stellar.',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/8',
  },
  {
    step: '03',
    icon: Zap,
    title: 'ZPAY Auto-Settle',
    actor: 'ZPAY SDK Engine',
    action: 'Stellar Path Payment → 1.8s',
    desc: 'The ZPAY SDK intercepts the 402, signs a Stellar payment in milliseconds, attaches proof to the retry.',
    accent: 'text-amber-300',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/8',
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'Resource Unlocked',
    actor: 'API Gateway',
    action: 'HTTP 200 OK + Payload',
    desc: 'Verified payment unlocks the data payload, delivered instantly to the LLM agent context.',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/8',
  },
];

const highlights = [
  { icon: Globe, label: 'No Subscriptions', desc: 'Pay per call. Not per month.' },
  { icon: Lock, label: 'Cryptographically Proven', desc: 'Every payment includes a verifiable Stellar tx hash.' },
  { icon: Code2, label: 'SDK-Native', desc: '2 lines of code in your agent\'s HTTP client.' },
];

export default function X402Section() {
  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden border-t border-white/5 font-[family-name:var(--font-jakarta)]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-md mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Machine Micro-Commerce</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            The Native{' '}
            <br />
            <span className="text-zinc-400">
              x402 Protocol
            </span>
          </h2>

          <p className="text-white/55 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
            Eliminate API subscriptions. Let your AI agents pay fractions of a cent per call autonomously via native HTTP 402 header interception with zero humans, zero credit cards, and zero friction.
          </p>
        </div>

        {/* Flow Steps — horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative">
                {/* Connector arrow */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-12 z-10 items-center text-white/15">
                    <ArrowRight size={16} />
                  </div>
                )}
                <div className={`rounded-2xl border ${item.border} ${item.bg} p-6 h-full flex flex-col`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl border ${item.border} bg-black/30 flex items-center justify-center`}>
                      <Icon className={`${item.accent}`} size={20} />
                    </div>
                    <span className={`text-3xl font-black ${item.accent} opacity-20 font-mono`}>{item.step}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <div className={`text-[10px] font-mono font-bold ${item.accent} mb-3 uppercase tracking-wider`}>{item.actor}</div>

                  <div className={`rounded-lg border ${item.border} bg-black/50 px-3 py-2 font-mono text-[11px] ${item.accent} mb-4`}>
                    {item.action}
                  </div>

                  <p className="text-white/45 text-xs leading-relaxed font-medium flex-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom highlights row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.label}
                className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6 flex items-start gap-4 hover:border-white/15 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">{h.label}</div>
                  <div className="text-xs text-white/45 leading-relaxed">{h.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Code snippet */}
        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#080808] p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-xs font-mono text-white/30">zpay-agent.ts</span>
          </div>
          <pre className="font-mono text-xs sm:text-sm leading-relaxed text-emerald-400 whitespace-pre">
{`import { ZPay } from '@zpay/sdk';

const client = new ZPay({ apiKey: process.env.ZPAY_SECRET_KEY });

// 3 lines. Your agent now pays per API call autonomously.
const response = await client.x402.fetch('https://api.data-vendor.com/v1/query');

// ZPAY intercepts HTTP 402, settles 0.001 USDC via Stellar in 1.8s,
// and retries the request with zero human intervention.`}
          </pre>
        </div>

      </div>
    </section>
  );
}
