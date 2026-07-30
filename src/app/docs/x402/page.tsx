"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal, Code, CheckCircle, Zap, Shield, BookOpen } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function X402DocsPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-gold/30 font-[family-name:var(--font-jakarta)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-[100] border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/x402" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/Div1912/Z-Pay" target="_blank" className="text-sm font-bold text-white/50 hover:text-white transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" /> Official Documentation
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
            Z-Pay X402 SDK
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            The easiest way to monetize your APIs using Stellar. Let AI agents and users pay seamlessly for every request. Zero friction, instant settlement.
          </p>
        </motion.div>

        <div className="space-y-16">
          
          {/* Step 1: Concept */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="scroll-mt-24"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black text-xl">1</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">How it Works</h2>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 sm:p-10 text-white/70 leading-relaxed space-y-4 shadow-xl">
              <p>
                The X402 protocol works on a simple principle: <strong>"Payment Required"</strong>. 
                When someone tries to access your premium API, our gateway blocks them and asks for a small payment in XLM or USDC.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <Shield className="w-6 h-6 text-gold mb-3" />
                  <h3 className="text-white font-bold mb-1">Gate API</h3>
                  <p className="text-sm">Wrap your API with our SDK to lock it behind a paywall.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <Zap className="w-6 h-6 text-blue-400 mb-3" />
                  <h3 className="text-white font-bold mb-1">Agent Pays</h3>
                  <p className="text-sm">The Z-Pay Client SDK automatically sends a micro-payment.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <CheckCircle className="w-6 h-6 text-green-400 mb-3" />
                  <h3 className="text-white font-bold mb-1">Unlock</h3>
                  <p className="text-sm">The API validates the payment and returns the data!</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Step 2: Installation */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black text-xl">2</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Installation</h2>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-xl">
              <p className="text-white/70 mb-6">Install the SDK packages in your Next.js or Node.js project using your favorite package manager.</p>
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-black/40 rounded-t-xl border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="text-[10px] text-white/30 font-mono ml-2 uppercase tracking-widest">Terminal</span>
                </div>
                <pre className="bg-black/60 pt-12 pb-4 px-6 rounded-xl border border-white/10 overflow-x-auto">
                  <code className="text-sm text-green-400 font-mono">
                    npm install @zpayrouter/sdk @zpayrouter/x402-gateway
                  </code>
                </pre>
              </div>
            </div>
          </motion.section>

          {/* Step 3: Gateway */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black text-xl">3</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Protect Your API (Backend)</h2>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-xl">
              <p className="text-white/70 mb-6">
                Use the <code className="text-gold bg-gold/10 px-2 py-0.5 rounded font-mono text-sm">withX402</code> wrapper in your API routes to require payment before execution. 
                You'll need a Stellar wallet address where the funds will be deposited.
              </p>
              
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-black/40 rounded-t-xl border-b border-white/5 flex items-center px-4 gap-2">
                  <Terminal className="w-4 h-4 text-white/30" />
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">app/api/premium/route.ts</span>
                </div>
                <pre className="bg-black/60 pt-12 pb-4 px-6 rounded-xl border border-white/10 overflow-x-auto">
                  <code className="text-[13px] sm:text-sm text-blue-300 font-mono leading-loose">
{`import { withX402 } from '@zpayrouter/x402-gateway';
import { NextResponse } from 'next/server';

export const GET = withX402(
  async (req) => {
    // This code ONLY runs if the user has paid!
    const premiumData = { secret: "42", AI_Model: "Z-Pay v1" };
    return NextResponse.json(premiumData);
  },
  {
    priceXLM: "0.5", // Cost per request in XLM
    destinationAddress: "YOUR_STELLAR_WALLET_ADDRESS",
    macaroonSecret: process.env.MACAROON_SECRET || "fallback_secret"
  }
);`}
                  </code>
                </pre>
              </div>
            </div>
          </motion.section>

          {/* Step 4: Client SDK */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black text-xl">4</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Pay for Access (Frontend/Agent)</h2>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-xl">
              <p className="text-white/70 mb-6">
                Now, when your AI Agent or frontend needs to access that API, it uses the <code className="text-gold bg-gold/10 px-2 py-0.5 rounded font-mono text-sm">ZpayClient</code> to send the payment automatically!
              </p>
              
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-black/40 rounded-t-xl border-b border-white/5 flex items-center px-4 gap-2">
                  <Code className="w-4 h-4 text-white/30" />
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">agent.ts</span>
                </div>
                <pre className="bg-black/60 pt-12 pb-4 px-6 rounded-xl border border-white/10 overflow-x-auto">
                  <code className="text-[13px] sm:text-sm text-green-300 font-mono leading-loose">
{`import { ZpayClient } from '@zpayrouter/sdk';

// 1. Initialize the Z-Pay Client
const zpay = new ZpayClient({ apiKey: 'YOUR_API_KEY' });

// 2. Resolve a user's Universal ID (Optional)
const { address } = await zpay.users.resolve('merchant@Zp');

// 3. Send the payment
const response = await zpay.payments.send({
  to: address || 'YOUR_STELLAR_WALLET_ADDRESS',
  amount: '0.5',
  asset: 'XLM',
  memo: 'API Access'
});

if (response.success) {
  console.log('Payment complete! Hash:', response.hash);
  // Now you can fetch the API route and the payment will be verified!
  const data = await fetch('/api/premium');
}`}
                  </code>
                </pre>
              </div>
            </div>
          </motion.section>

        </div>
        
        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-white/30 text-sm">
            Need more help? Contact <a href="mailto:support@zpay.com" className="text-white/50 hover:text-white transition-colors">support@zpay.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}
