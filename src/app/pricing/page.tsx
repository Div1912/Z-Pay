"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Zap, Building2, Bot } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for individuals and side projects. Get started with ZPAY for free.',
    cta: 'Get Started Free',
    ctaHref: '/auth/signup',
    featured: false,
    features: [
      '100 transactions/month',
      'Stellar network payments',
      'Basic ZPAY ID',
      'Standard settlement speed',
      'Community support',
      'API access (100 req/day)',
    ],
  },
  {
    name: 'Pro',
    icon: Bot,
    price: { monthly: 29, annual: 23 },
    description: 'For growing teams and serious builders who need scale and AI agent access.',
    cta: 'Start Free Trial',
    ctaHref: '/auth/signup',
    featured: true,
    features: [
      'Unlimited transactions',
      '1 AI payment agent',
      'Custom ZPAY domain ID',
      'Priority settlement',
      'Webhook events',
      'API access (10k req/day)',
      'Email + chat support',
      'Advanced analytics',
    ],
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: null, annual: null },
    description: 'Custom infrastructure for financial institutions, fintechs, and large organizations.',
    cta: 'Contact Sales',
    ctaHref: '/support',
    featured: false,
    features: [
      'Everything in Pro',
      'Unlimited AI agents',
      'Dedicated Stellar node',
      'SLA guarantee (99.99%)',
      'Custom compliance rules',
      'Unlimited API access',
      'Dedicated account manager',
      'On-premise deployment option',
    ],
  },
];

const faqs = [
  { q: 'What is a ZPAY transaction?', a: 'Any payment sent, received, or processed through the ZPAY protocol — including UPI transfers, Stellar settlements, and AI agent-initiated payments.' },
  { q: 'Are there per-transaction fees?', a: 'ZPAY charges 0.01% per transaction with a maximum of $0.50. Stellar network fees are approximately $0.00001 per transaction.' },
  { q: 'Can I switch plans anytime?', a: 'Yes. You can upgrade, downgrade, or cancel at any time. Changes take effect immediately for upgrades, and at the end of the billing cycle for downgrades.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, bank transfers, and USDC via Circle.' },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 100%)',
        }} />

        {/* Header */}
        <div className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6 md:px-8 max-w-[1100px] mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-10 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to ZPAY
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Simple Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-[0.95]">
            Pricing that scales<br />
            <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent">with you</span>
          </h1>
          <p className="text-white/45 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Start free. Upgrade when you need AI agents, priority settlement, or enterprise-grade SLAs.
          </p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all min-h-0 ${!annual ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all min-h-0 flex items-center gap-2 ${annual ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'}`}
            >
              Annual
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${annual ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50'}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="relative px-4 sm:px-6 md:px-8 max-w-[1100px] mx-auto pb-16 sm:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {plans.map((plan) => {
              const { icon: Icon } = plan;
              const price = annual ? plan.price.annual : plan.price.monthly;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                    plan.featured
                      ? 'bg-white/[0.06] border border-white/[0.2] shadow-[0_0_80px_rgba(255,255,255,0.04)]'
                      : 'bg-[#0d0d0d] border border-white/[0.06] hover:border-white/[0.1]'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold text-black text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/60">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-white font-black text-lg">{plan.name}</h3>
                  </div>

                  <div className="mb-4">
                    {price === null ? (
                      <span className="text-3xl sm:text-4xl font-black text-white">Custom</span>
                    ) : price === 0 ? (
                      <span className="text-3xl sm:text-4xl font-black text-white">Free</span>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-white">${price}</span>
                        <span className="text-white/40 text-sm mb-1.5">/mo</span>
                      </div>
                    )}
                    {annual && price && price > 0 && (
                      <p className="text-white/35 text-xs mt-1">billed annually</p>
                    )}
                  </div>

                  <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-6">{plan.description}</p>

                  <Link
                    href={plan.ctaHref}
                    className={`w-full h-11 rounded-full flex items-center justify-center text-sm font-black uppercase tracking-wider transition-all duration-200 mb-7 hover:scale-[1.02] active:scale-[0.98] ${
                      plan.featured
                        ? 'bg-gold text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                        : 'border border-white/[0.1] bg-white/[0.03] text-white hover:bg-white/[0.07]'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-white/55 text-xs sm:text-sm">
                        <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="relative px-4 sm:px-6 md:px-8 max-w-[800px] mx-auto pb-24">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-12 sm:mb-14" />
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 sm:mb-10 tracking-tight">
            Frequently asked
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-5 sm:p-6">
                <h4 className="text-white font-semibold text-sm sm:text-base mb-2">{faq.q}</h4>
                <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
