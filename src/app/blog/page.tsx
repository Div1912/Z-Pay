"use client";

import React, { useState } from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { BookOpen, Calendar, Clock, ArrowRight, X, User, ArrowLeft, Share2, Sparkles } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      text: string;
      code?: string;
    }[];
    takeaway: string;
  };
}

const blogArticles: Article[] = [
  {
    id: 'x402-protocol',
    title: 'How HTTP 402 Payment Required Unlocks Autonomous AI Micro-Transactions',
    category: 'Protocol Architecture',
    date: 'July 24, 2026',
    readTime: '6 min read',
    author: 'Div (Lead Architect)',
    excerpt: 'The web has lacked a native payment code for decades. Here is how ZPAY leverages Stellar and HTTP 402 headers to let LLMs pay per API call without credit cards.',
    content: {
      intro: 'When RFC 7231 defined the HTTP/1.1 protocol standard in the 1990s, status code 402 was reserved as "Payment Required" for future use. For thirty years, that status code sat largely dormant as subscriptions and credit card forms took over the web. Today, as AI agents execute millions of automated API calls every second, traditional 3% + $0.30 credit card fees render machine micropayments impossible.',
      sections: [
        {
          heading: 'The Problem with API Subscriptions',
          text: 'Traditional SaaS relies on monthly subscription tiers. An AI agent needing a single data query from a vendor must either subscribe for $99/month or be blocked by a paywall. This model fundamentally fails autonomous agentic workflows.'
        },
        {
          heading: 'How ZPAY x402 Header Interception Works',
          text: 'When a ZPAY-enabled client receives a 402 Payment Required HTTP response, the ZPAY SDK intercepts the response, inspects the requested payment amount (e.g. 0.001 USDC), signs a Stellar path payment, and attaches the transaction hash to the retried request header.',
          code: `// Agent Client Auto-Retry on HTTP 402
const res = await fetch("https://api.valuable-data.com/query");
if (res.status === 402) {
  const payHeader = res.headers.get("X-Payment-Required");
  const txHash = await zpay.payMicro(payHeader);
  return fetch(req.url, { headers: { "X-PAYMENT-PROOF": txHash } });
}`
        },
        {
          heading: 'Sub-Cent Economics',
          text: 'By settling on the Stellar network, base transaction fees remain fixed at 0.00001 XLM (less than $0.00001). An agent can perform 100,000 micro-transactions for less than ten cents total network cost.'
        }
      ],
      takeaway: 'HTTP 402 status codes combined with Stellar lightning-fast finality create a seamless pay-per-query internet for AI agents.'
    }
  },
  {
    id: 'stellar-routing',
    title: 'Building Sub-Cent Cross-Border Remittance Routes on Stellar',
    category: 'Engineering',
    date: 'June 19, 2026',
    readTime: '8 min read',
    author: 'ZPAY Core Team',
    excerpt: 'A technical deep-dive into path payment algorithms, liquidity pool arbitration, and how we achieve under 3-second global finality.',
    content: {
      intro: 'Cross-border remittances have historically suffered from multi-day SWIFT delays and 5-7% intermediary bank fees. ZPAY utilizes Stellar built-in DEX orderbooks and liquidity pools to route fiat and crypto assets globally in under 3 seconds.',
      sections: [
        {
          heading: 'Path Payment Arbitration',
          text: 'When a user in Europe sends EUR to a vendor in Japan requiring JPY, ZPAY evaluates up to 10 liquidity paths in parallel across USDC, XLM, and EUR anchors to execute the swap with minimal slippage.'
        },
        {
          heading: 'Soroban Smart Contract Guarantees',
          text: 'Soroban smart contracts hold liquidity in multi-sig escrows. If the target currency pool fails to fill within 10 seconds, the contract automatically rolls back the transaction, guaranteeing zero capital loss.'
        }
      ],
      takeaway: 'Instant global finality without intermediary spreads is now live on Stellar mainnet.'
    }
  },
  {
    id: 'upi-crypto-bridge',
    title: 'Bridging Crypto Liquidity to Indian UPI Merchant Payments',
    category: 'Product & Scaling',
    date: 'May 30, 2026',
    readTime: '5 min read',
    author: 'Product Team',
    excerpt: 'How ZPAY maps 56-character Stellar addresses to UPI QR payloads in real-time, allowing users to spend crypto at millions of offline vendors.',
    content: {
      intro: 'India Unified Payments Interface (UPI) processes over 10 billion transactions monthly across millions of street vendors, retail shops, and online stores. ZPAY bridges on-chain crypto balances directly to instant UPI merchant payouts.',
      sections: [
        {
          heading: 'QR Payload Parsing',
          text: 'When a user scans a standard BharatPE or Google Pay UPI QR code with the ZPAY app, the parser extracts the VPA handle (e.g. merchant@okaxis) and requested INR amount.'
        },
        {
          heading: 'Instant Anchor Liquidity Off-Ramp',
          text: 'ZPAY settles the crypto equivalent in USDC via an SEP-24 compliant anchor, which instantly deposits INR into the merchant bank account within 2 seconds.'
        }
      ],
      takeaway: 'Real-world crypto usability is achieved when users can pay for daily chai with their crypto balance.'
    }
  }
];

export default function BlogPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-36 sm:pt-44 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <BookOpen className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">ZPAY Engineering Blog</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Engineering &amp; Insights
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Deep dives into decentralization, agentic finance, and sub-cent payment routing. Click any article to read.
        </p>
      </section>

      {/* Blog Cards Grid */}
      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogArticles.map((article) => (
            <article 
              key={article.id} 
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 flex flex-col justify-between hover:border-gold/40 hover:bg-[#111111] transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold mb-4 block">{article.category}</span>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-medium">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                </div>
                <span className="text-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-10 my-8 shadow-2xl overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-xs text-white/50 font-medium">
                <span className="px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold font-bold uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title & Author */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {selectedArticle.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-white/60 mb-8 font-medium">
              <User size={16} className="text-gold" />
              <span>By {selectedArticle.author}</span>
            </div>

            {/* Article Body */}
            <div className="space-y-8 text-white/80 text-base sm:text-lg leading-relaxed font-medium">
              <p className="text-xl text-white/90 font-semibold leading-relaxed border-l-2 border-gold pl-4 italic">
                {selectedArticle.content.intro}
              </p>

              {selectedArticle.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4 pt-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{sec.heading}</h3>
                  <p className="text-white/70">{sec.text}</p>
                  {sec.code && (
                    <div className="rounded-2xl border border-white/10 bg-black p-5 font-mono text-sm text-emerald-400 overflow-x-auto my-4">
                      <pre><code>{sec.code}</code></pre>
                    </div>
                  )}
                </div>
              ))}

              <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 mt-8">
                <div className="flex items-center gap-2 text-gold font-bold text-sm uppercase tracking-wider mb-2">
                  <Sparkles size={16} /> Key Takeaway
                </div>
                <p className="text-white/80 text-base font-semibold">
                  {selectedArticle.content.takeaway}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to All Articles
              </button>
            </div>

          </div>
        </div>
      )}

      <FooterCTA />
    </main>
  );
}
