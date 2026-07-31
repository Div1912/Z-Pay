"use client";

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
