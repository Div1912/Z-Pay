"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Network, Fingerprint, Store, Lock, Users, TrendingUp, Zap } from 'lucide-react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import Link from 'next/link';

const FeatureRow = ({ 
  title, 
  description, 
  icon: Icon, 
  imageSrc, 
  reverse = false, 
  delay = 0 
}: { 
  title: string, 
  description: string, 
  icon: any, 
  imageSrc: string, 
  reverse?: boolean,
  delay?: number
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
    className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 py-20 border-b border-white/5 last:border-0`}
  >
    {/* Text Content */}
    <div className="flex-1 space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-8">
        <Icon className="w-7 h-7 text-[#D4AF37]" />
      </div>
      <h2 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h2>
      <p className="text-xl text-white/60 leading-relaxed font-medium">
        {description}
      </p>
    </div>

    {/* Image Container */}
    <div className="flex-1 w-full">
      <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Subtle gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent mix-blend-overlay z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Image */}
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0"
        />
        
        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20 z-20 group-hover:border-[#D4AF37] transition-colors duration-500" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20 z-20 group-hover:border-[#D4AF37] transition-colors duration-500" />
      </div>
    </div>
  </motion.div>
);

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-[#D4AF37]/30 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-10 relative px-6 z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-8 inline-block shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              The Protocol
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95]">
              Architected for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#FBBF24]">
                Dominance.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-white/50 mb-12 font-medium max-w-2xl mx-auto">
              ZPAY replaces legacy financial plumbing with a unified, agentic, globally distributed execution engine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Rows */}
      <section className="py-12 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          
          <FeatureRow 
            title="Agentic Pathfinding AI"
            description="Our artificial intelligence continuously analyzes global liquidity pools and AMMs in real-time, instantly routing your payments through the absolute cheapest and fastest path available on the Stellar network. Zero human intervention."
            icon={Network}
            imageSrc="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop"
            delay={0.1}
          />

          <FeatureRow 
            title="Universal IDs & P2P"
            description="Ditch the 56-character addresses. Send instant cross-currency payments globally to simple identifiers like alice@Zp. Settles in XLM, USDC, or INR natively in under 3 seconds."
            icon={Fingerprint}
            imageSrc="https://images.unsplash.com/photo-1516322073321-4f10118eb3d3?q=80&w=1600&auto=format&fit=crop"
            reverse={true}
            delay={0.1}
          />

          <FeatureRow 
            title="Indian UPI Bridge"
            description="The ultimate physical-to-digital bridge. Walk into any local shop in India, scan their UPI QR code, and pay with your crypto balance. The merchant receives fiat (INR) instantly."
            icon={Store}
            imageSrc="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop"
            delay={0.1}
          />

          <FeatureRow 
            title="Soroban Smart Escrow"
            description="Trustless B2B and freelance payments. Lock funds on-chain within a smart contract, release upon delivery, and rely on our built-in decentralized arbiter resolution protocol if disputes arise."
            icon={Lock}
            imageSrc="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop"
            reverse={true}
            delay={0.1}
          />
          
          <FeatureRow 
            title="On-Chain Bill Splitting"
            description="Split expenses with friends securely. Enjoy real-time on-chain tracking, custom or equal fractional shares, and instant one-tap participant settlements that update the ledger live."
            icon={Users}
            imageSrc="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1600&auto=format&fit=crop"
            delay={0.1}
          />
          
          <FeatureRow 
            title="Yield Vault & Staking"
            description="Put your capital to work. Lock ZPAY for up to 24% APR, or pool XLM with zero lock-up. Features a live compound-interest projection engine to visualize your decentralized earnings."
            icon={TrendingUp}
            imageSrc="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop"
            reverse={true}
            delay={0.1}
          />

          <FeatureRow 
            title="Gasless Transactions"
            description="Absolute zero friction. Utilizing Stellar's fee_bump_transaction, ZPAY sponsors the network fees on your behalf. You pay precisely zero gas to execute transactions."
            icon={Zap}
            imageSrc="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"
            delay={0.1}
          />

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 px-6 relative z-10 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight">Ready to integrate?</h2>
          <Link 
            href="/auth/signup"
            className="inline-flex h-16 items-center justify-center rounded-full bg-[#D4AF37] px-12 text-black font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)]"
          >
            Create Developer Account
          </Link>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
