const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app');

const files = {
  // 1. ABOUT PAGE
  'about/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Shield, Zap, Globe, Cpu, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-40 pb-20 px-4 sm:px-6 relative z-10 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Globe className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">About ZPAY</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.05]">
          Pioneering the Autonomous <br />
          <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent">
            Financial Layer
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
          ZPAY was founded on a singular premise: as AI agents become autonomous economic actors, traditional banking rails are too slow, fragmented, and expensive to support them.
        </p>
      </section>

      {/* Mission & Stats */}
      <section className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <h3 className="text-4xl font-black text-white mb-2">&lt; 3s</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Settlement Time</p>
            <p className="text-white/40 text-sm leading-relaxed">Global finality powered by the Stellar Consensus Protocol with zero chargeback risk.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <h3 className="text-4xl font-black text-gold mb-2">$0.00001</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Base Transaction Fee</p>
            <p className="text-white/40 text-sm leading-relaxed">Sub-cent execution costs allowing autonomous micro-payments at massive scale.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <h3 className="text-4xl font-black text-white mb-2">100%</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Non-Custodial Architecture</p>
            <p className="text-white/40 text-sm leading-relaxed">Cryptographically secured with user-controlled keys and Soroban smart escrows.</p>
          </div>
        </div>

        {/* Pillars */}
        <div className="space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/[0.06] bg-[#080808] p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Machine-Native Payments</h3>
              <p className="text-white/50 leading-relaxed">
                We design protocols tailored for software agents, API consumers, and automated micro-subscriptions via the x402 HTTP standard.
              </p>
            </div>
            <div className="rounded-3xl border border-white/[0.06] bg-[#080808] p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Trustless Verification</h3>
              <p className="text-white/50 leading-relaxed">
                Every transaction and split contract is verified on-chain. Smart contracts ensure funds move only when precise conditions are met.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 2. INTEGRATIONS PAGE
  'integrations/page.tsx': `"use client";

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
`,

  // 3. CHANGELOG PAGE
  'changelog/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { GitCommit, Tag, Sparkles, ShieldAlert, Cpu } from 'lucide-react';

const releases = [
  {
    version: 'v1.4.0',
    date: 'July 28, 2026',
    title: 'x402 Micropayment Engine & UPI Bridge v2',
    type: 'Major Feature',
    changes: [
      'Introduced autonomous HTTP 402 Payment Required middleware for Node.js & Python SDKs.',
      'Optimized Stellar pathfinding algorithms, cutting average routing latency down to 1.8 seconds.',
      'Added instant QR payload parser for Indian UPI merchants with auto-conversion to INR.',
      'Upgraded Soroban split contracts to support up to 50 parallel payout accounts.'
    ]
  },
  {
    version: 'v1.2.5',
    date: 'June 14, 2026',
    title: 'Soroban Escrow Protocol Upgrade',
    type: 'Security Release',
    changes: [
      'Audited multi-sig timeout locks for dispute resolution.',
      'Added automated gasless fee-sponsorship relayer node to prevent failed transactions.',
      'Enhanced dashboard analytics with real-time webhooks for failed payment retries.'
    ]
  },
  {
    version: 'v1.0.0',
    date: 'April 02, 2026',
    title: 'Initial Stellar Mainnet Launch',
    type: 'Release',
    changes: [
      'Official deployment of ZPAY core protocol on Stellar Mainnet.',
      'ZPAY Universal ID domain registry deployment.',
      'Full TypeScript & Python SDK launch with non-custodial wallet creation.'
    ]
  }
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <GitCommit className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Protocol Updates</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Changelog &amp; Release Notes
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Track the evolution of the ZPAY payment router, SDK updates, and protocol upgrades.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[900px] mx-auto">
        <div className="relative border-l border-white/10 pl-6 sm:pl-10 space-y-16">
          {releases.map((rel) => (
            <div key={rel.version} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-gold shadow-[0_0_12px_#d4af37]" />
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-2xl font-black text-white">{rel.version}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
                  {rel.type}
                </span>
                <span className="text-xs text-white/40 font-medium ml-auto">{rel.date}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white/90 mb-4">{rel.title}</h3>
              
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 sm:p-8 space-y-3">
                {rel.changes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 4. BLOG PAGE
  'blog/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    title: 'How HTTP 402 Payment Required Unlocks Autonomous AI Micro-Transactions',
    category: 'Protocol Architecture',
    date: 'July 24, 2026',
    readTime: '6 min read',
    excerpt: 'The web has lacked a native payment code for decades. Here is how ZPAY leverages Stellar and HTTP 402 headers to let LLMs pay per API call without credit cards.',
  },
  {
    title: 'Building Sub-Cent Cross-Border Remittance Routes on Stellar',
    category: 'Engineering',
    date: 'June 19, 2026',
    readTime: '8 min read',
    excerpt: 'A technical deep-dive into path payment algorithms, liquidity pool arbitration, and how we achieve under 3-second global finality.',
  },
  {
    title: 'Bridging Crypto Liquidity to Indian UPI Merch Payments',
    category: 'Product & Scaling',
    date: 'May 30, 2026',
    readTime: '5 min read',
    excerpt: 'How ZPAY maps 56-character Stellar addresses to UPI QR payloads in real-time, allowing users to spend crypto at millions of offline vendors.',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <BookOpen className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">ZPAY Blog</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Engineering &amp; Insights
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Deep dives into decentralization, agentic finance, and sub-cent payment routing.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.title} className="group rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold mb-4 block">{post.category}</span>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-medium">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 5. CAREERS PAGE (SPECIFIC USER REQUIREMENT: "only carrer page should ahve coming soon message saying no open position righ now")
  'careers/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Users, Heart, Zap, Globe, Briefcase } from 'lucide-react';

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Briefcase className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Careers at ZPAY</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Build the Future of <br />
          <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent">
            Automated Commerce
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          We are a distributed team of engineers, cryptographers, and product builders working on the next generation of payment infrastructure.
        </p>
      </section>

      {/* Specific user requirement banner */}
      <section className="py-12 px-4 sm:px-6 max-w-[900px] mx-auto">
        <div className="rounded-3xl border border-gold/20 bg-gold/5 p-10 sm:p-12 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-6">
            No Open Positions Right Now
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            We are not actively hiring at this moment
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed mb-8">
            Our core engineering team is currently full. However, we are always excited to meet exceptional talent passionate about Stellar, Soroban, and Agentic Finance.
          </p>
          <a
            href="mailto:careers@zpay.route"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white text-black font-bold px-8 text-sm hover:bg-gold transition-colors"
          >
            Submit General Application
          </a>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Globe className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Remote</h3>
            <p className="text-white/50 text-sm leading-relaxed">Work from anywhere in the world with flexible asynchronous hours.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Zap className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Competitive Compensation</h3>
            <p className="text-white/50 text-sm leading-relaxed">Top-tier salary package with token equity grants.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Heart className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Cutting-Edge Stack</h3>
            <p className="text-white/50 text-sm leading-relaxed">Rust, Soroban, TypeScript, Next.js, and cutting-edge LLM frameworks.</p>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 6. PRESS PAGE
  'press/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Download, FileText, Mail, Image as ImageIcon } from 'lucide-react';

export default function PressPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <FileText className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Press &amp; Brand</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Brand Assets &amp; Media Kit
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Official ZPAY brand guidelines, logos, screenshots, and press contact information.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <ImageIcon className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold mb-3">Official Logo &amp; Vector Package</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                Download SVG, PNG, and EPS formats of the ZPAY logo in light, dark, and monochrome variants.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors w-fit">
              <Download className="w-4 h-4" /> Download Logo Kit (.ZIP)
            </button>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <Mail className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold mb-3">Media &amp; Press Contact</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                For interview requests, executive quotes, or press inquiries, reach out directly to our communications team.
              </p>
            </div>
            <a href="mailto:press@zpay.route" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-black font-bold text-sm hover:scale-105 transition-all w-fit">
              Contact Press Team
            </a>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 7. PRIVACY PAGE
  'privacy/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[900px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-white/40 text-sm">Last Updated: July 30, 2026</p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[800px] mx-auto text-white/70 space-y-8 leading-relaxed font-medium">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          <p>
            ZPAY operates on a privacy-first, non-custodial architecture. We do not collect or store your private cryptographic keys, seed phrases, or master wallet passwords.
          </p>
          <p>
            When you use our web dashboard or API, we may process minimal operational data, including public wallet addresses, transaction hashes, and basic telemetry to optimize sub-cent routing performance.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. Blockchain Transparency</h2>
          <p>
            Please note that transactions executed on the Stellar blockchain are inherently public. Your public address and transaction ledger entries are permanently recorded on-chain.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Data Security &amp; Encryption</h2>
          <p>
            All off-chain communication between your client application and ZPAY API endpoints is encrypted using TLS 1.3 standards. We employ zero-knowledge principles wherever possible.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact our privacy compliance team at <span className="text-gold font-mono">privacy@zpay.route</span>.
          </p>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 8. TERMS PAGE
  'terms/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[900px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <FileText className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-white/40 text-sm">Last Updated: July 30, 2026</p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[800px] mx-auto text-white/70 space-y-8 leading-relaxed font-medium">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the ZPAY protocol, website, developer SDKs, or API services, you agree to be bound by these Terms of Service and all applicable laws.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. Non-Custodial Protocol</h2>
          <p>
            ZPAY is a software protocol and routing layer. We do not act as a bank, financial institution, or custodian of your digital assets. You maintain sole ownership and control of your private cryptographic keys.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Acceptable Use</h2>
          <p>
            You agree not to use ZPAY for any illegal activities, including but not limited to money laundering, terror financing, or circumventing global economic sanctions.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Limitation of Liability</h2>
          <p>
            The software is provided "as is" without warranty of any kind. ZPAY shall not be liable for any direct, indirect, or consequential losses resulting from blockchain network congestion or smart contract errors.
          </p>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 9. SECURITY PAGE
  'security/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Shield, Lock, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Trust &amp; Security</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Security Architecture
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Bank-grade encryption, audited Soroban smart contracts, and zero-custody protocol design.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <Lock className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Non-Custodial Guarantee</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your private keys never touch our servers. Transactions are signed locally on your device or hardware wallet before broadcast.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10">
            <Cpu className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Audited Soroban Contracts</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Our automated split contracts and smart escrows are independently audited and formal-verified to eliminate vulnerability vectors.
            </p>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#080808] p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-8">Security Controls &amp; Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              'End-to-End TLS 1.3 Encryption',
              'MPC Multi-Party Computation Key Shares',
              '24/7 Automated On-Chain Anomaly Detection',
              'Bug Bounty Program (up to $50,000 reward)',
              'Stellar SEP-10 Authentication Protocol',
              'Automated Rate-Limiting & DDoS Shield'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/80 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`,

  // 10. COMPLIANCE PAGE
  'compliance/page.tsx': `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Scale, ShieldCheck, Globe, FileCheck } from 'lucide-react';

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <Scale className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Regulatory Standard</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Global Compliance &amp; Standards
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Built to integrate seamlessly with regulated Stellar anchors, SEP standards, and global financial frameworks.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <Globe className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Stellar SEP-12 &amp; SEP-24</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Standardized KYC/AML identity exchange protocols integrated directly with licensed fiat anchors worldwide.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <ShieldCheck className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Sanctions Screening</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Real-time OFAC and international sanctions list screening before processing fiat bridge settlements.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8">
            <FileCheck className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-2">Audit Trails</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Immutable on-chain transaction records providing cryptographic proof of payment for business tax &amp; accounting compliance.
            </p>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${relPath} with production-grade content.`);
}
