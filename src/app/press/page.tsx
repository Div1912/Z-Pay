"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Download, FileText, Mail, Image as ImageIcon, Quote, ExternalLink, Newspaper, Mic, ArrowRight } from 'lucide-react';

const mediaCoverage = [
  {
    outlet: 'CoinDesk',
    headline: 'ZPAY Is Building the Payment Layer That Lets AI Agents Pay Each Other',
    date: 'July 2026',
    type: 'Feature',
    url: '#',
  },
  {
    outlet: 'The Block',
    headline: 'Stellar-Based ZPAY Launches x402 Protocol for Autonomous Agent Micropayments',
    date: 'June 2026',
    type: 'News',
    url: '#',
  },
  {
    outlet: 'TechCrunch',
    headline: 'Sub-Cent Cross-Border Payments: How ZPAY is Rethinking Global Remittance',
    date: 'May 2026',
    type: 'Interview',
    url: '#',
  },
];

const pressQuotes = [
  {
    quote: 'ZPAY represents the first serious attempt at a machine-native financial rails — one built for the agentic internet, not retrofitted from banking.',
    attribution: 'Senior Protocol Analyst, CoinDesk',
  },
  {
    quote: 'The x402 integration alone makes this the most developer-forward payment protocol we have reviewed in three years of covering Web3 infra.',
    attribution: 'Technical Reporter, The Block',
  },
];

const brandAssets = [
  {
    icon: ImageIcon,
    title: 'Official Logo & Vector Package',
    desc: 'SVG, PNG, and EPS formats of the ZPAY logotype in light, dark, and monochrome variants — across all approved sizes and clearspace specifications.',
    action: 'Download Logo Kit (.ZIP)',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Brand Guidelines PDF',
    desc: 'Full brand identity documentation including typography, color system, spacing rules, co-branding guidelines, and logo misuse examples.',
    action: 'Download Guidelines (.PDF)',
    href: '#',
  },
  {
    icon: Newspaper,
    title: 'Product Screenshots & Media',
    desc: 'High-resolution dashboard screenshots, architecture diagrams, and approved product imagery for editorial use in articles and presentations.',
    action: 'Download Media Pack (.ZIP)',
    href: '#',
  },
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-44 pb-20 px-4 sm:px-6 text-center max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Press & Media</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
          Brand Assets &{' '}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">
            Media Kit
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/55 max-w-3xl mx-auto font-medium leading-relaxed">
          Official ZPAY brand guidelines, logos, media resources, press coverage, and direct contact for editorial inquiries.
        </p>
      </section>

      {/* Media Coverage */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-8 pl-1">As Seen In</h2>
        <div className="space-y-4">
          {mediaCoverage.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-6 sm:p-8 hover:border-white/15 transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-black text-amber-400 uppercase tracking-widest">{item.outlet}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/50">{item.type}</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white/85 group-hover:text-white transition-colors leading-snug">
                  {item.headline}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-white/35 font-medium">{item.date}</span>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-amber-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Press Quotes */}
      <section className="py-8 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-8 pl-1">What Journalists Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pressQuotes.map((q, idx) => (
            <div key={idx} className="rounded-3xl border border-white/[0.07] bg-[#0a0a0a] p-8">
              <Quote className="w-6 h-6 text-amber-400/40 mb-4" />
              <p className="text-white/80 text-base font-medium leading-relaxed mb-6 italic">
                &ldquo;{q.quote}&rdquo;
              </p>
              <span className="text-xs text-white/40 font-semibold">— {q.attribution}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-8 pl-1">Brand Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brandAssets.map((asset) => {
            const Icon = asset.icon;
            return (
              <div key={asset.title} className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 flex flex-col justify-between">
                <div>
                  <Icon className="w-10 h-10 text-amber-400 mb-6" />
                  <h3 className="text-xl font-bold mb-3">{asset.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8">{asset.desc}</p>
                </div>
                <a
                  href={asset.href}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/8 hover:bg-white/15 text-white font-bold text-sm transition-colors w-fit"
                >
                  <Download className="w-4 h-4" /> {asset.action}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-8 pb-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#111111] to-[#0a0a0a] p-10 sm:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Press Inquiries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Talk to the team</h2>
            <p className="text-white/55 text-base leading-relaxed max-w-xl">
              For interview requests, executive quotes, product announcements, or editorial partnerships — our communications team responds within one business day.
            </p>
          </div>
          <a
            href="mailto:press@zpay.route"
            className="inline-flex h-14 items-center justify-center rounded-full bg-amber-400 text-black font-black text-sm uppercase tracking-widest px-10 hover:scale-105 transition-all shadow-[0_0_30px_rgba(251,191,36,0.2)] shrink-0 gap-2"
          >
            <Mail className="w-4 h-4" /> press@zpay.route
          </a>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
