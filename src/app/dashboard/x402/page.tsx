"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, ExternalLink, Activity, DollarSign, Database, Server, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function X402DashboardPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/merchant/x402");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data || []);
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
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
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
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#FBBF24] rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="relative bg-white/[0.03] border border-[#D4AF37]/20 p-6 sm:p-8 rounded-[1.5rem] overflow-hidden flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
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
