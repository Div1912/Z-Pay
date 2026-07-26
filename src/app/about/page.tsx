"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Terminal, Lightbulb, Rocket } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37]/30 overflow-x-hidden relative">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[150px]" />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10 min-h-[60vh] flex flex-col justify-center">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl w-fit mb-8 shadow-2xl mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-pulse" />
              <span className="text-white/80 text-[11px] font-bold tracking-[0.2em] uppercase">
                Our Origin Story
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black mb-8 tracking-tighter leading-[1.05]">
              We built the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-600 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                missing piece
              </span>
              <br /> for AI.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-16 font-medium max-w-2xl mx-auto">
              Agents are smart, fast, and capable. But without a wallet, they are trapped in a sandbox. We're fixing that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Sections */}
      <section className="pb-32 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          
          {/* The Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32"
          >
            <div className="order-2 lg:order-1 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">The Wall.</h2>
              <div className="space-y-4 text-lg text-white/60 leading-relaxed font-medium">
                <p>
                  A few months ago, we were building autonomous AI workflows and kept hitting the exact same wall: payments. Every time our agents needed to fetch premium data, spin up a server, or call an external API, they had to stop completely and ask a human for a credit card.
                </p>
                <p>
                  The traditional financial system is built for humans. It relies on monthly subscriptions, flat fees, and manual checkout pages. If you're an AI agent making 10,000 micro-decisions a minute, a $20/month subscription model is completely broken.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent mix-blend-overlay z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop" 
                alt="Coding late at night" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out"
              />
            </div>
          </motion.div>

          {/* The Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32"
          >
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent mix-blend-overlay z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop" 
                alt="Global Network" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out"
              />
            </div>
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">The Bridge.</h2>
              <div className="space-y-4 text-lg text-white/60 leading-relaxed font-medium">
                <p>
                  We realized that for the agentic economy to actually work, machines needed their own native payment layer. They needed the ability to pay exactly for what they consume, in real-time, down to a fraction of a cent.
                </p>
                <p>
                  That's why we built Z-Pay. By leveraging the speed and low costs of the Stellar network, and integrating deeply with the x402 (Payment Required) protocol, we created a router that lets AI transact autonomously. No credit cards. No subscriptions. Just pure, frictionless, machine-to-machine value transfer.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Looking Forward */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-white/[0.02] p-12 lg:p-20 text-center backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-8">
                <Rocket className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">The Future.</h2>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                We believe that in the next 5 years, the majority of transactions on the internet won't be made by humans, but by agents negotiating and trading resources with each other. Z-Pay is the infrastructure for that future.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
