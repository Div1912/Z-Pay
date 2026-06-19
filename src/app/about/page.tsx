"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Server, ShieldAlert, Cpu } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-[#D4AF37]/30 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-8 inline-block shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              Our Vision
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95]">
              Decentralizing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#FBBF24]">
                Global Wealth.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-16 font-medium">
              ZPAY is not just another payment app. It is an agentic, zero-trust protocol engineered to completely eradicate the exorbitant fees and delays of correspondent banking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent mix-blend-overlay z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="/images/vision_core.png" 
                alt="ZPAY Core Architecture" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            </motion.div>
            
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight">The Origin</h2>
              <p className="text-white/60 text-lg leading-relaxed font-medium">
                The legacy financial system is fundamentally broken. Trillions of dollars are trapped in transit daily, incurring massive fees just to move between borders. We realized that by combining the absolute finality of the Stellar blockchain with advanced agentic routing AI, we could bypass this entire infrastructure.
              </p>
              <p className="text-white/60 text-lg leading-relaxed font-medium">
                Today, ZPAY serves as the backbone for thousands of transactions globally, providing 100% uptime, mathematical security proofs, and zero geographic boundaries.
              </p>
            </div>
          </div>

          {/* Architecture of Tomorrow Section */}
          <div className="mb-32">
            <div className="text-center mb-20">
              <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-black uppercase tracking-[0.2em] text-white/80 mb-6 inline-block">
                Infrastructure
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">The Architecture of Tomorrow</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Node 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group p-1"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-8 relative border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-[#D4AF37]/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                  <img 
                    src="/images/circuit_nodes.png" 
                    alt="Decentralized Nodes" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-20">
                    <div className="w-12 h-12 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                      <Cpu className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3">Decentralized Nodes</h3>
                <p className="text-white/50 leading-relaxed font-medium">Our infrastructure runs on a globally distributed network of validators, ensuring 100% fault tolerance and absolute zero downtime.</p>
              </motion.div>

              {/* Node 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group p-1"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-8 relative border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-[#D4AF37]/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                  <img 
                    src="/images/gold_liquidity.png" 
                    alt="Deep Liquidity Pools" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-20">
                    <div className="w-12 h-12 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                      <Server className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3">Deep Liquidity Pools</h3>
                <p className="text-white/50 leading-relaxed font-medium">ZPAY's automated market makers handle massive volumes, allowing instant cross-currency FX conversion at mid-market rates.</p>
              </motion.div>

              {/* Node 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group p-1"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-8 relative border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-[#D4AF37]/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                  <img 
                    src="/images/crypto_vault.png" 
                    alt="Zero Trust Security" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-20">
                    <div className="w-12 h-12 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                      <ShieldAlert className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3">Zero Trust Security</h3>
                <p className="text-white/50 leading-relaxed font-medium">Every transaction, escrow contract, and vault stake is protected by unbreakable Soroban smart contracts and cryptographic proofs.</p>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
