"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Terminal, Zap, Shield, Globe, Bot } from 'lucide-react';

const categories = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Set up your ZPAY account, create your ID, and make your first payment in minutes.',
    links: ['Quick Start', 'Authentication', 'Your First Payment', 'ZPAY ID Guide'],
  },
  {
    icon: Terminal,
    title: 'API Reference',
    description: 'Full REST and WebSocket API documentation for integrating ZPAY into your application.',
    links: ['API Overview', 'Payments API', 'Webhooks', 'Rate Limits'],
  },
  {
    icon: Bot,
    title: 'AI Agent SDK',
    description: 'Build autonomous payment agents that transact on your behalf using our Agent SDK.',
    links: ['Agent SDK Intro', 'Deploying Agents', 'Agent Permissions', 'Agent Receipts'],
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Learn how ZPAY secures your funds with bank-grade encryption and Stellar\'s consensus.',
    links: ['Security Model', 'Key Management', 'Audit Logs', 'Compliance'],
  },
  {
    icon: Globe,
    title: 'Integrations',
    description: 'Connect ZPAY with Stripe, PayPal, UPI, and 100+ other payment providers.',
    links: ['Stripe Bridge', 'UPI Connect', 'Circle USDC', 'Wise Payout'],
  },
  {
    icon: BookOpen,
    title: 'Guides',
    description: 'In-depth tutorials for payroll, escrow, split payments, and recurring billing.',
    links: ['Global Payroll', 'Smart Escrow', 'Split Contracts', 'Recurring Billing'],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 100%)',
        }} />

        {/* Header */}
        <div className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-10 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to ZPAY
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <BookOpen size={12} className="text-white/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Documentation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-[0.95]">
            ZPAY Docs
          </h1>
          <p className="text-white/45 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
            Everything you need to build with ZPAY — from quick start guides to deep API references and AI agent tutorials.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span className="text-white/25 text-sm">Search documentation...</span>
              <span className="ml-auto text-[10px] font-mono text-white/20 border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px mx-4 sm:mx-6 md:mx-8 max-w-[1200px] mx-auto bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* Categories grid */}
        <div className="relative px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto py-14 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categories.map((cat) => {
              const { icon: Icon } = cat;
              return (
                <div
                  key={cat.title}
                  className="group relative bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 sm:p-7 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/55 group-hover:text-white/85 group-hover:border-white/[0.14] transition-all duration-300 mb-4">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2">{cat.title}</h3>
                    <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-5">{cat.description}</p>
                    <ul className="space-y-1.5">
                      {cat.links.map((link) => (
                        <li key={link}>
                          <a href="#" className="text-white/35 text-xs sm:text-[0.8rem] hover:text-white/65 transition-colors flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto pb-20 text-center">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10">
            <p className="text-white/50 text-sm sm:text-base mb-4">Need help getting started?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/support" className="px-5 py-2.5 rounded-full border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-all">
                Contact Support
              </Link>
              <a href="https://discord.gg/zpay" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-white/5 text-white/60 text-sm font-medium hover:text-white hover:bg-white/10 transition-all">
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
