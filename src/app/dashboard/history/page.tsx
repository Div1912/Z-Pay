"use client";

import { useEffect, useState, useCallback } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, ArrowDownLeft, ExternalLink, Search, Loader2,
  History, Calendar, Globe, Store, Download, RefreshCw,
  CheckCircle2, Clock, XCircle, Layers, AlertCircle, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  type: 'p2p' | 'merchant' | 'deposit';
  sender_id?: string;
  recipient_id?: string;
  sender_universal_id?: string;
  recipient_universal_id?: string;
  merchant_name?: string;
  merchant_upi_id?: string;
  amount: number;
  currency?: string;
  asset?: string;
  inr_amount?: number;
  xlm_amount?: number;
  status: string;
  tx_hash: string;
  created_at: string;
  note?: string;
  // Deposit-specific
  deposit_type?: string;
  source_chain?: string;
  bridge_status?: string;
  credited?: boolean;
  from_address?: string;
}

interface PendingIntent {
  id: string;
  source_chain: string;
  amount_usdc: number | null;
  status: string;
  source_tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

type FilterTab = 'all' | 'p2p' | 'merchant' | 'deposits';

// ── Deposit status badge ──────────────────────────────────────────────────────

function DepositStatusBadge({ deposit }: { deposit: Transaction }) {
  const isCctp = deposit.deposit_type === 'cctp_usdc';
  const isPending = !deposit.credited || deposit.bridge_status === 'pending';
  const isFailed  = deposit.bridge_status === 'failed';

  if (isFailed) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-400">
      <XCircle className="w-3 h-3" /> Failed
    </span>
  );
  if (isPending) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-yellow-400">
      <Clock className="w-3 h-3 animate-pulse" /> Pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-400">
      <CheckCircle2 className="w-3 h-3" /> {isCctp ? 'Bridge Complete' : 'Confirmed'}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [transactions, setTransactions]         = useState<Transaction[]>([]);
  const [pendingIntents, setPendingIntents]     = useState<PendingIntent[]>([]);
  const [profile, setProfile]                   = useState<any>(null);
  const [loading, setLoading]                   = useState(true);
  const [backfilling, setBackfilling]           = useState(false);
  const [backfillMsg, setBackfillMsg]           = useState('');
  const [search, setSearch]                     = useState('');
  const [filter, setFilter]                     = useState<FilterTab>('all');
  const [depositPage, setDepositPage]           = useState(1);
  const [depositTotal, setDepositTotal]         = useState(0);
  const [lastRefresh, setLastRefresh]           = useState<Date | null>(null);

  const fetchData = useCallback(async (opts?: { depositPageOverride?: number }) => {
    try {
      const dPage = opts?.depositPageOverride ?? depositPage;

      const [profileRes, historyRes, merchantRes, depositsRes] = await Promise.all([
        fetch("/api/zpay/profile"),
        fetch("/api/payments/history"),
        fetch("/api/merchant/history"),
        fetch(`/api/zpay/deposits?page=${dPage}`),
      ]);

      const profileData  = await profileRes.json();
      const historyData  = await historyRes.json();
      const merchantData = await merchantRes.json();
      const depositsData = await depositsRes.json();

      const p2pTx: Transaction[] = Array.isArray(historyData)
        ? historyData.map((tx: any) => ({ ...tx, type: 'p2p' as const }))
        : [];

      const merchantTx: Transaction[] = Array.isArray(merchantData)
        ? merchantData.map((tx: any) => ({ ...tx, type: 'merchant' as const, amount: tx.xlm_amount }))
        : [];

      const depositTx: Transaction[] = Array.isArray(depositsData.deposits)
        ? depositsData.deposits.map((d: any) => ({
            id:           d.id,
            type:         'deposit' as const,
            amount:       d.amount,
            currency:     d.asset,
            asset:        d.asset,
            status:       d.credited ? 'confirmed' : 'pending',
            tx_hash:      d.tx_hash ?? '',
            created_at:   d.created_at,
            deposit_type: d.deposit_type,
            source_chain: d.source_chain,
            bridge_status: d.bridge_status,
            credited:     d.credited,
            from_address: d.from_address,
          }))
        : [];

      const allTx = [...p2pTx, ...merchantTx, ...depositTx].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setProfile(profileData);
      setTransactions(allTx);
      setPendingIntents(depositsData.pending_intents ?? []);
      setDepositTotal(depositsData.total ?? 0);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('[history] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [depositPage]);

  useEffect(() => {
    fetchData();

    // Realtime subscriptions
    const channel = supabase
      .channel('history-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'merchant_payments' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stellar_deposits' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cctp_deposit_intents' }, () => fetchData())
      .subscribe();

    // Lighter polling (10s) for pending deposit states
    const poll = setInterval(() => fetchData(), 10_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [fetchData]);

  const handleBackfill = async () => {
    setBackfilling(true);
    setBackfillMsg('');
    try {
      const res = await fetch('/api/zpay/deposits', { method: 'POST' });
      const data = await res.json();
      setBackfillMsg(data.message ?? 'Done');
      await fetchData();
    } catch {
      setBackfillMsg('Backfill failed. Please try again.');
    } finally {
      setBackfilling(false);
    }
  };

  // ── Filter & search ─────────────────────────────────────────────────────────

  const filtered = transactions.filter(tx => {
    const matchFilter = filter === 'all' || tx.type === filter
      || (filter === 'deposits' && tx.type === 'deposit');
    const matchSearch =
      tx.sender_universal_id?.toLowerCase().includes(search.toLowerCase()) ||
      tx.recipient_universal_id?.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchant_name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.from_address?.toLowerCase().includes(search.toLowerCase()) ||
      tx.amount?.toString().includes(search) ||
      tx.asset?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── Counts for filter badges ────────────────────────────────────────────────
  const depositCount = transactions.filter(t => t.type === 'deposit').length;
  const pendingCount = pendingIntents.length;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">
          Retrieving Ledger History
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 uppercase leading-none">
            HISTORY
          </h1>
          <p className="text-zinc-500 font-medium">
            Immutable proof of global transactions
            {lastRefresh && (
              <span className="ml-3 text-xs text-zinc-700">
                · Updated {formatDistanceToNow(lastRefresh, { addSuffix: true })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search by user, amount, asset…"
              className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500/50 transition-all font-bold tracking-tight text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleBackfill}
            disabled={backfilling}
            title="Sync missed deposits from Stellar network"
            className="h-12 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all font-bold disabled:opacity-50"
          >
            {backfilling
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />
            }
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {backfillMsg && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-sm text-blue-400">
          {backfillMsg}
        </div>
      )}

      {/* ── Pending CCTP intents banner ─────────────────────────────────────── */}
      {pendingIntents.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            {pendingIntents.length} Cross-Chain Deposit{pendingIntents.length > 1 ? 's' : ''} In Progress
          </div>
          <div className="space-y-2">
            {pendingIntents.map(intent => (
              <div key={intent.id} className="flex items-center justify-between text-xs text-zinc-400">
                <span className="capitalize font-semibold">{intent.source_chain}</span>
                <span>{intent.amount_usdc ? `${intent.amount_usdc} USDC` : 'Amount pending'}</span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-black">
                  {intent.status}
                </span>
                <span className="text-zinc-600">{formatDistanceToNow(new Date(intent.created_at), { addSuffix: true })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: 'all',      label: 'All',         icon: null },
          { id: 'p2p',      label: 'User to User', icon: null },
          { id: 'merchant', label: 'Merchant',     icon: Store },
          { id: 'deposits', label: `Deposits${depositCount > 0 ? ` (${depositCount})` : ''}`, icon: Download },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2",
              filter === id
                ? "bg-white text-black"
                : "bg-white/5 text-zinc-500 hover:bg-white/10"
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
          </button>
        ))}
      </div>

      {/* ── Transaction list ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 glass-card rounded-[2.5rem] border-dashed flex flex-col items-center gap-6"
            >
              <History className="w-16 h-16 text-zinc-800" />
              <div className="space-y-1">
                <p className="text-xl font-black uppercase tracking-tight text-zinc-600">No records found</p>
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-800">
                  {filter === 'deposits' ? 'No deposits yet — use Add Funds to deposit' : 'Initiate a payment to see it here'}
                </p>
              </div>
            </motion.div>
          ) : (
            filtered.map((tx, index) => {
              const isReceived  = tx.type === 'p2p' && tx.recipient_id === profile?.id;
              const isMerchant  = tx.type === 'merchant';
              const isDeposit   = tx.type === 'deposit';
              const isCctp      = isDeposit && tx.deposit_type === 'cctp_usdc';

              const explorerBase = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
                ? 'https://stellar.expert/explorer/public'
                : 'https://stellar.expert/explorer/testnet';

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group glass-card p-5 md:p-7 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all relative overflow-hidden"
                >
                  {/* Icon */}
                  <div className="flex items-center gap-5 md:gap-6 relative z-10 min-w-0">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-transform group-hover:scale-105",
                      isDeposit
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : isMerchant
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : isReceived
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    )}>
                      {isDeposit ? (
                        isCctp ? <Layers className="w-7 h-7" /> : <Download className="w-7 h-7" />
                      ) : isMerchant ? (
                        <Store className="w-7 h-7" />
                      ) : isReceived ? (
                        <ArrowDownLeft className="w-7 h-7" />
                      ) : (
                        <ArrowUpRight className="w-7 h-7" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none">
                          {isDeposit
                            ? isCctp ? `${tx.source_chain?.toUpperCase()} Bridge` : 'Stellar Deposit'
                            : isMerchant
                            ? tx.merchant_name
                            : isReceived
                            ? (tx.sender_universal_id || 'EXTERNAL')
                            : (tx.recipient_universal_id || 'EXTERNAL')
                          }
                        </span>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.2em]",
                          isDeposit ? "text-purple-400"
                            : isMerchant ? "text-green-500"
                            : "text-blue-500"
                        )}>
                          {isDeposit ? (isCctp ? 'CCTP' : 'STELLAR') : isMerchant ? 'UPI' : '@Zp'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {isDeposit && (
                          <DepositStatusBadge deposit={tx} />
                        )}
                        {!isDeposit && (
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest",
                            tx.status === 'completed' || tx.status === 'confirmed'
                              ? "text-green-500" : "text-zinc-500"
                          )}>
                            {tx.status}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-zinc-600">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {format(new Date(tx.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {isDeposit && tx.from_address && (
                          <span className="text-[9px] text-zinc-700 font-mono truncate max-w-[120px]">
                            {tx.from_address.slice(0, 8)}…{tx.from_address.slice(-6)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount + explorer link */}
                  <div className="flex items-center gap-3 md:gap-6 relative z-10 shrink-0 ml-4">
                    <div className="text-right">
                      {isMerchant ? (
                        <>
                          <p className="text-xl md:text-2xl font-black tracking-tighter leading-none mb-1 text-green-500">
                            ₹{parseFloat(tx.inr_amount?.toString() || '0').toLocaleString('en-IN')}
                          </p>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-black">
                            {parseFloat(tx.xlm_amount?.toString() || '0').toFixed(2)} XLM
                          </p>
                        </>
                      ) : (
                        <>
                          <p className={cn(
                            "text-xl md:text-2xl font-black tracking-tighter leading-none mb-1",
                            isDeposit ? "text-purple-400"
                              : isReceived ? "text-green-500"
                              : "text-white"
                          )}>
                            {(isReceived || isDeposit) ? '+' : '-'}{tx.amount}
                            <span className="text-xs text-zinc-500 ml-1 uppercase tracking-wider">
                              {tx.currency || tx.asset || 'XLM'}
                            </span>
                          </p>
                          {tx.note?.startsWith('XLM:') && (
                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-black">
                              {tx.note.replace('XLM:', '')} XLM on-chain
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {tx.tx_hash && !tx.tx_hash.startsWith('CCTP_SIMULATED') && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={`${explorerBase}/tx/${tx.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 rounded-2xl hover:bg-white/20 text-zinc-500 hover:text-white transition-all border border-white/5"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/0 to-blue-500/0 group-hover:via-blue-500/5 transition-all duration-500" />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ── Deposit pagination ────────────────────────────────────────────────── */}
      {filter === 'deposits' && depositTotal > 30 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={depositPage === 1}
            onClick={() => { setDepositPage(p => p - 1); fetchData({ depositPageOverride: depositPage - 1 }); }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold disabled:opacity-30 transition-all"
          >
            ← Previous
          </button>
          <span className="text-sm text-zinc-500">Page {depositPage}</span>
          <button
            disabled={depositPage * 30 >= depositTotal}
            onClick={() => { setDepositPage(p => p + 1); fetchData({ depositPageOverride: depositPage + 1 }); }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold disabled:opacity-30 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
