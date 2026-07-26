"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Terminal, Lightbulb, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-[#D4AF37]/30 overflow-x-hidden">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              We built the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
                missing piece
              </span>
              <br /> for AI.
            </h1>
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-16 font-medium max-w-2xl mx-auto">
              Agents are smart, fast, and capable. But without a wallet, they are trapped in a sandbox. We're fixing that.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-12 text-lg text-white/80 leading-relaxed font-medium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight">The Problem</h2>
              <p>
                A few months ago, we were building autonomous AI workflows and kept hitting the same wall: payments. Every time our agents needed to fetch premium data, spin up a server, or call an external API, they had to stop and ask a human for a credit card. 
              </p>
              <p>
                The traditional financial system is built for humans. It relies on monthly subscriptions, flat fees, and manual checkout pages. If you're an AI agent making 10,000 micro-decisions a minute, a $20/month subscription model is completely broken. 
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight">The Solution</h2>
              <p>
                We realized that for the agentic economy to actually work, machines needed their own native payment layer. They needed the ability to pay exactly for what they consume, in real-time, down to a fraction of a cent.
              </p>
              <p>
                That's why we built Z-Pay. By leveraging the speed and low costs of the Stellar network, and integrating deeply with the x402 (Payment Required) protocol, we created a router that lets AI transact autonomously. No credit cards. No subscriptions. Just pure, frictionless, machine-to-machine value transfer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 pb-20"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight">Looking Forward</h2>
              <p>
                We believe that in the next 5 years, the majority of transactions on the internet won't be made by humans, but by agents negotiating and trading resources with each other. Z-Pay is the infrastructure for that future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
