"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Zap, Building2, Bot } from 'lucide-react';

const plans = [
  {
    name: 'Early Access',
    icon: Zap,
    priceLabel: 'Free',
    description: 'Perfect for individuals and early adopters to experience the future of payments.',
    cta: 'Get Started',
    ctaHref: '/auth/signup',
    featured: false,
    features: [
      'Basic ZPAY ID & Wallet',
      'Instant Stellar Settlements',
      'Deploy 1 Basic AI Agent',
      'Community Support',
      'Web Dashboard Access',
    ],
  },
  {
    name: 'Professional',
    icon: Bot,
    priceLabel: 'Coming Soon',
    description: 'For power users and merchants who need scale and advanced AI agent workflows.',
    cta: 'Join Waitlist',
    ctaHref: '/waitlist',
    featured: true,
    features: [
      'Custom ZPAY Domain ID',
      'Unlimited AI Agents',
      'Automated Split Contracts',
      'API & Webhook Access',
      'Advanced Analytics',
      'Priority Email Support',
    ],
  },
  {
    name: 'Enterprise',
    icon: Building2,
    priceLabel: 'Custom',
    description: 'Tailored infrastructure for financial institutions and large-scale applications.',
    cta: 'Contact Sales',
    ctaHref: '/support',
    featured: false,
    features: [
      'Dedicated Stellar Node',
      'SLA Guarantee (99.99%)',
      'Custom Compliance Rules',
      'White-label Integration',
      'On-premise Deployment',
      'Dedicated Account Manager',
    ],
  },
];

const faqs = [
  { q: 'What is a ZPAY transaction?', a: 'Any payment sent, received, or processed through the ZPAY protocol — including cross-border transfers, Stellar settlements, and autonomous AI agent-initiated payments.' },
  { q: 'Are there per-transaction fees?', a: 'Currently, early access users only pay the underlying Stellar network fees (approximately $0.00001 per transaction). ZPAY platform fees will be introduced for Professional and Enterprise tiers.' },
  { q: 'When will the Professional tier be available?', a: 'We are currently rolling out the Professional tier to a limited set of beta testers. You can join the waitlist to get early access when it becomes publicly available.' },
  { q: 'Do I need crypto experience to use ZPAY?', a: 'Not at all. ZPAY abstracts away the complexity of the Stellar network. You interact with simple fiat values and ZPAY IDs, while our infrastructure handles the blockchain routing instantly in the background.' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <div className="relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle 800px at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 100%)',
        }} />

        {/* Header section with lots of breathing room */}
        <div className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-12 sm:mb-16 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to ZPAY
          </Link>

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Simple Pricing</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black tracking-tighter text-white mb-8 leading-[0.9]">
            Pricing that scales<br />
            <span className="bg-gradient-to-r from-zinc-300 via-white to-zinc-500 bg-clip-text text-transparent pb-2">with your agents</span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
            Start for free during early access. Upgrade when you need advanced AI routing, high-volume APIs, or enterprise SLAs.
          </p>
        </div>

        {/* Plans - Spaced out and elegant */}
        <div className="relative px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto pb-24 sm:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {plans.map((plan) => {
              const { icon: Icon } = plan;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-[2rem] p-8 sm:p-10 transition-all duration-500 ${
                    plan.featured
                      ? 'bg-white/[0.05] border border-white/[0.15] shadow-[0_0_100px_rgba(255,255,255,0.03)] scale-100 md:scale-105 z-10'
                      : 'bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold text-black text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/70">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-white font-black text-2xl tracking-tight">{plan.name}</h3>
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                      {plan.priceLabel}
                    </span>
                  </div>

                  <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-10 min-h-[60px]">
                    {plan.description}
                  </p>

                  <Link
                    href={plan.ctaHref}
                    className={`w-full h-14 rounded-full flex items-center justify-center text-sm font-black uppercase tracking-wider transition-all duration-300 mb-10 hover:scale-[1.02] active:scale-[0.98] ${
                      plan.featured
                        ? 'bg-gold text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]'
                        : 'border border-white/[0.12] bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/[0.2]'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-6">Includes</p>
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-white/60 text-sm">
                        <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ - Elegant and spacious */}
        <div className="relative px-4 sm:px-6 md:px-8 max-w-[900px] mx-auto pb-32">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-16 sm:mb-20" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-12 sm:mb-16 tracking-tight">
            Frequently asked
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-3xl border border-white/[0.06] bg-[#0a0a0a] p-8 sm:p-10 hover:border-white/[0.1] transition-colors duration-300">
                <h4 className="text-white font-bold text-lg mb-4 leading-tight">{faq.q}</h4>
                <p className="text-white/40 text-sm sm:text-base leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
