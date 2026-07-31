"use client";

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "How does ZPAY achieve sub-cent transaction fees?",
    a: "ZPAY is built natively on the Stellar consensus protocol. Instead of expensive Proof-of-Work networks or congested Layer 2s, we leverage Stellar's built-in order books and ultra-low fee structure. We also utilize 'fee bump transactions' to sponsor network fees for you, effectively making your transactions gasless.",
  },
  {
    q: "Can I send money to someone without a crypto wallet?",
    a: "Yes. ZPAY abstracts the blockchain entirely. You can send funds to a ZPAY ID, an email address, or even directly to an Indian UPI ID. The recipient receives fiat instantly, while the backend handles the crypto-to-fiat conversion via Circle and our liquidity partners.",
  },
  {
    q: "How do the AI Agents work?",
    a: "Our AI agents are autonomous scripts that you can deploy to monitor balances, split incoming payments automatically, handle escrow conditions, and route funds based on complex logic. They operate 24/7 on our distributed edge network and execute on-chain only when cryptographic conditions are met.",
  },
  {
    q: "What is the x402 Protocol?",
    a: "The x402 Protocol is our implementation of the HTTP 402 (Payment Required) status code. It allows machines and APIs to request micro-payments (fractions of a cent) from your ZPAY wallet before serving a resource, enabling a true pay-per-use internet without subscriptions.",
  },
  {
    q: "Is my money safe?",
    a: "Absolutely. We employ bank-grade security and never take custody of your private keys for self-hosted wallets. For managed wallets, funds are secured using multi-party computation (MPC) and backed 1:1 by USDC reserves held by regulated financial institutions.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-black py-24 sm:py-32 overflow-hidden border-t border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[900px] relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Support</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
            Common Questions
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
            Everything you need to know about the product and billing.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden transition-colors hover:border-white/[0.15]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full p-6 sm:p-8 text-left"
                >
                  <span className="text-lg sm:text-xl font-bold text-white pr-8">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-white text-black' : 'bg-white/5 text-white/50'}`}>
                    {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-8">
                        <p className="text-white/50 leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
