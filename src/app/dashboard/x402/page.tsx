"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, ExternalLink, Activity, DollarSign, Database, Server, Link as LinkIcon, AlertCircle, Code } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function X402DashboardPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [stellarAddress, setStellarAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/merchant/x402");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data || []);

      const profileRes = await fetch("/api/zpay/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setStellarAddress(profileData.stellar_address || '');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
        <p className="text-white/40 font-black tracking-widest uppercase text-xs animate-pulse">Loading API Analytics</p>
      </div>
    );
  }

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalRequests = payments.length;

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-black tracking-tight mb-2 uppercase leading-[0.9]" style={{ fontFamily: 'var(--font-syne)' }}>
            X402 Merchant
          </h1>
          <p className="text-white/50 text-sm sm:text-base font-medium">Monetize your APIs seamlessly with AI Agents.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/docs/x402" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-bold text-white/80">
            <LinkIcon className="w-4 h-4" /> SDK Docs
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-gold to-[#FBBF24] rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="relative bg-white/[0.03] border border-gold/20 p-6 sm:p-8 rounded-[1.5rem] overflow-hidden flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-gold/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-gold" />
              </div>
              <span className="text-gold text-xs font-black uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                Revenue
              </span>
            </div>
            <div>
              <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Total Earned</p>
              <h2 className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight">
                {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xl text-white/30">XLM</span>
              </h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="relative bg-white/[0.03] border border-blue-500/20 p-6 sm:p-8 rounded-[1.5rem] overflow-hidden flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-400 text-xs font-black uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Traffic
              </span>
            </div>
            <div>
              <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Paid Requests Served</p>
              <h2 className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight">
                {totalRequests.toLocaleString()}
              </h2>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Integration Guide */}
      <section className="space-y-6 pt-6">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center gap-2" style={{ fontFamily: 'var(--font-syne)' }}>
          <Code className="w-6 h-6 text-gold" /> INTEGRATION CONFIG
        </h3>
        
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent" />
          
          <div className="mb-6">
            <h4 className="text-sm font-black text-white/50 uppercase tracking-widest mb-2">Your Destination Address</h4>
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/[0.05]">
              <code className="text-gold text-sm break-all">{stellarAddress || 'Loading...'}</code>
            </div>
            <p className="text-xs text-white/40 mt-2">Pass this address to the SDK. AI agents will automatically route micro-payments to this wallet before executing your code.</p>
          </div>

          <div>
             <h4 className="text-sm font-black text-white/50 uppercase tracking-widest mb-3">Next.js API Route Example</h4>
             <pre className="bg-black/60 p-4 rounded-xl border border-white/[0.05] overflow-x-auto">
               <code className="text-[13px] text-blue-300 font-mono leading-relaxed">
{`import { withX402 } from '@zpayrouter/x402-gateway';
import { NextResponse } from 'next/server';

export const GET = withX402(
  async (req) => {
    // Your actual API logic goes here
    return NextResponse.json({ data: "Premium data generated by your API!" });
  },
  {
    priceXLM: "0.5", // Price per request
    destinationAddress: "${stellarAddress || 'YOUR_STELLAR_ADDRESS'}",
    macaroonSecret: process.env.MACAROON_SECRET || "super_secret_key"
  }
);`}
               </code>
             </pre>
          </div>

          <div className="mt-8">
             <h4 className="text-sm font-black text-white/50 uppercase tracking-widest mb-3">Z-Pay SDK Client Example</h4>
             <pre className="bg-black/60 p-4 rounded-xl border border-white/[0.05] overflow-x-auto">
               <code className="text-[13px] text-green-300 font-mono leading-relaxed">
{`import { ZpayClient } from '@zpayrouter/sdk';

const zpay = new ZpayClient({ apiKey: 'YOUR_API_KEY' });

// Automatically pay for the X402-gated API route above
const response = await zpay.payments.send({
  to: '${stellarAddress || 'YOUR_STELLAR_ADDRESS'}',
  amount: '0.5',
  asset: 'XLM',
  memo: 'API Payment'
});

console.log(response.success ? 'Payment sent!' : 'Failed');`}
               </code>
             </pre>
          </div>
        </div>
      </section>

      {/* Activity Table */}
      <section className="space-y-6 pt-6">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase" style={{ fontFamily: 'var(--font-syne)' }}>API PAYMENTS</h3>
        
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="p-12 bg-white/[0.02] border border-white/[0.06] rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 border-dashed">
              <Server className="w-10 h-10 text-white/20" />
              <p className="text-sm font-bold uppercase tracking-widest text-white/30">No API payments yet</p>
              <p className="text-xs text-white/40">Integrate the X402 SDK into your Next.js routes to start earning.</p>
            </div>
          ) : (
            payments.map((tx, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={tx.id}
                className="group bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.05] transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-lg tracking-tight truncate max-w-[200px] sm:max-w-xs text-white">
                      {tx.endpoint}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:gap-6 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-black tracking-tight text-green-400">
                      +{parseFloat(tx.amount).toFixed(2)} <span className="text-[10px] text-white/40 uppercase">XLM</span>
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Fee: {parseFloat(tx.fee).toFixed(3)} XLM
                    </p>
                  </div>
                  <a 
                    href={`https://stellar.expert/explorer/${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'public' : 'testnet'}/tx/${tx.tx_hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    title="View on Stellar Expert"
                  >
                    <ExternalLink className="w-4 h-4 text-white/50" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
