"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, ArrowDownLeft, ArrowUpRight, FileText,
  CheckCircle2, AlertTriangle, RefreshCw, DollarSign, Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type:
    | "payment_received"
    | "payment_sent"
    | "contract_created"
    | "contract_delivered"
    | "contract_released"
    | "contract_disputed"
    | "contract_refunded"
    | "contract_resolved";
  title: string;
  body: string;
  href: string;       // page to navigate to on click
  read: boolean;
  createdAt: Date;
  raw?: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildTransactionNotification(tx: any, currentUserId: string): AppNotification | null {
  const isReceived = tx.recipient_id === currentUserId;
  const amount = parseFloat(tx.amount || "0").toFixed(2);
  const currency = tx.currency || "XLM";

  if (tx.status === "refunded") {
    return {
      id: `tx-${tx.id}`,
      type: "contract_refunded",
      title: "Refund Received",
      body: `+${amount} ${currency} returned to your wallet`,
      href: "/dashboard/history",
      read: false,
      createdAt: new Date(tx.created_at || Date.now()),
      raw: tx,
    };
  }

  if (isReceived) {
    const sender = tx.sender_universal_id || "Someone";
    return {
      id: `tx-${tx.id}`,
      type: "payment_received",
      title: "Payment Received",
      body: `+${amount} ${currency} from ${sender}@Zp`,
      href: "/dashboard/history",
      read: false,
      createdAt: new Date(tx.created_at || Date.now()),
      raw: tx,
    };
  } else {
    const recipient = tx.recipient_universal_id || "someone";
    return {
      id: `tx-${tx.id}`,
      type: "payment_sent",
      title: "Payment Sent",
      body: `-${amount} ${currency} to ${recipient}@Zp`,
      href: "/dashboard/history",
      read: false,
      createdAt: new Date(tx.created_at || Date.now()),
      raw: tx,
    };
  }
}

function buildContractNotification(contract: any, currentUserId: string): AppNotification | null {
  const isFreelancer = contract.freelancer_id === currentUserId;
  const isPayer = contract.payer_id === currentUserId;
  const status: string = contract.status || "";
  const title = contract.title || "Contract";
  const amount = parseFloat(contract.amount || "0").toFixed(2);
  const currency = contract.currency || "XLM";

  const map: Record<string, { type: AppNotification["type"]; title: string; body: string }> = {
    funded: {
      type: "contract_created",
      title: isFreelancer ? "New Contract" : "Contract Funded",
      body: isFreelancer
        ? `${contract.payer_universal_id}@Zp locked ${amount} ${currency} for "${title}"`
        : `Your contract "${title}" is live — ${amount} ${currency} in escrow`,
    },
    delivered: {
      type: "contract_delivered",
      title: isPayer ? "Work Delivered!" : "Marked as Delivered",
      body: isPayer
        ? `${contract.freelancer_universal_id}@Zp completed "${title}". Review & release funds.`
        : `You marked "${title}" as delivered. Awaiting client approval.`,
    },
    released: {
      type: "contract_released",
      title: "Funds Released",
      body: `${amount} ${currency} released for "${title}"`,
    },
    disputed: {
      type: "contract_disputed",
      title: "Dispute Raised",
      body: `"${title}" is under review by the Arbiter`,
    },
    refunded: {
      type: "contract_refunded",
      title: "Contract Refunded",
      body: `${amount} ${currency} returned for "${title}"`,
    },
  };

  const cfg = map[status];
  if (!cfg) return null;

  return {
    id: `contract-${contract.id}-${status}`,
    type: cfg.type,
    title: cfg.title,
    body: cfg.body,
    href: "/dashboard/contracts",
    read: false,
    createdAt: new Date(contract.updated_at || contract.created_at || Date.now()),
    raw: contract,
  };
}

// ─── Icon per type ────────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: AppNotification["type"] }) {
  const map: Record<AppNotification["type"], { icon: React.ReactNode; bg: string }> = {
    payment_received:   { icon: <ArrowDownLeft className="w-4 h-4 text-green-400" />,   bg: "bg-green-500/15 border-green-500/25" },
    payment_sent:       { icon: <ArrowUpRight  className="w-4 h-4 text-blue-400"  />,   bg: "bg-blue-500/15  border-blue-500/25"  },
    contract_created:   { icon: <FileText      className="w-4 h-4 text-[#D4AF37]" />,   bg: "bg-[#D4AF37]/15 border-[#D4AF37]/25" },
    contract_delivered: { icon: <CheckCircle2  className="w-4 h-4 text-amber-400" />,   bg: "bg-amber-500/15 border-amber-500/25" },
    contract_released:  { icon: <DollarSign    className="w-4 h-4 text-green-400" />,   bg: "bg-green-500/15 border-green-500/25" },
    contract_disputed:  { icon: <AlertTriangle className="w-4 h-4 text-red-400"   />,   bg: "bg-red-500/15   border-red-500/25"   },
    contract_refunded:  { icon: <RefreshCw     className="w-4 h-4 text-blue-400"  />,   bg: "bg-blue-500/15  border-blue-500/25"  },
    contract_resolved:  { icon: <CheckCircle2  className="w-4 h-4 text-purple-400"/>,   bg: "bg-purple-500/15 border-purple-500/25"},
  };
  const { icon, bg } = map[type] ?? { icon: <Bell className="w-4 h-4" />, bg: "bg-white/10" };
  return (
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
      {icon}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  currentUserId: string;
  currentUniversalId: string;
}

export function NotificationCenter({ currentUserId, currentUniversalId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const addNotif = useCallback((n: AppNotification | null) => {
    if (!n) return;
    setNotifications(prev => {
      // deduplicate by id
      if (prev.find(p => p.id === n.id)) return prev;
      return [n, ...prev].slice(0, 50);
    });
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    // ── Transactions channel ──────────────────────────────────────────────────
    const txChannel = supabase
      .channel(`notif-tx-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions", filter: `recipient_id=eq.${currentUserId}` },
        payload => addNotif(buildTransactionNotification(payload.new, currentUserId))
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions", filter: `sender_id=eq.${currentUserId}` },
        payload => addNotif(buildTransactionNotification(payload.new, currentUserId))
      )
      .subscribe();

    // ── Contracts channel (payer) ─────────────────────────────────────────────
    const contractPayerChannel = supabase
      .channel(`notif-contracts-payer-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contracts", filter: `payer_id=eq.${currentUserId}` },
        payload => addNotif(buildContractNotification(payload.new, currentUserId))
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contracts", filter: `payer_id=eq.${currentUserId}` },
        payload => addNotif(buildContractNotification(payload.new, currentUserId))
      )
      .subscribe();

    // ── Contracts channel (freelancer) ────────────────────────────────────────
    const contractFreelancerChannel = supabase
      .channel(`notif-contracts-freelancer-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contracts", filter: `freelancer_id=eq.${currentUserId}` },
        payload => addNotif(buildContractNotification(payload.new, currentUserId))
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contracts", filter: `freelancer_id=eq.${currentUserId}` },
        payload => addNotif(buildContractNotification(payload.new, currentUserId))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(txChannel);
      supabase.removeChannel(contractPayerChannel);
      supabase.removeChannel(contractFreelancerChannel);
    };
  }, [currentUserId, addNotif]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const handleClick = (n: AppNotification) => {
    setNotifications(prev => prev.map(p => p.id === n.id ? { ...p, read: true } : p));
    setOpen(false);
    router.push(n.href);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* ── Bell button ── */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-white/70" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-black text-[9px] font-black rounded-full flex items-center justify-center"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="absolute right-0 top-14 w-[340px] max-h-[520px] bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-black text-sm uppercase tracking-wider">Notifications</span>
                {unread > 0 && (
                  <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black rounded-full uppercase tracking-widest">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-wider"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Bell className="w-10 h-10 text-zinc-800" />
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">All caught up</p>
                  <p className="text-zinc-700 text-[10px]">New payments & contract updates will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map(n => (
                    <motion.button
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleClick(n)}
                      className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-white/5 transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}
                    >
                      <NotifIcon type={n.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-white leading-none">{n.title}</p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 leading-snug truncate">{n.body}</p>
                        <p className="text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
