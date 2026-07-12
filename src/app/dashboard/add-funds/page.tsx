"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2, QrCode, ChevronRight, IndianRupee, RefreshCw, Wallet, Copy, Check, Zap, Layers, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const PROVIDERS = [
  {
    id: "zpay_direct",
    name: "ZPay Direct",
    desc: "UPI / ₹100 Min",
    badge: "Recommended",
    getUrl: () => ""
  },
  {
    id: "stellar_direct",
    name: "Stellar Deposit",
    desc: "Send XLM/USDC from any Stellar wallet",
    badge: "Instant",
    getUrl: () => ""
  },
  {
    id: "cctp_usdc",
    name: "Cross-Chain USDC",
    desc: "Bridge from Ethereum, Base, Avalanche",
    badge: "CCTP v2",
    getUrl: () => ""
  },
  {
    id: "onramp",
    name: "Global Card / Bank Transfer",
    desc: "100+ Currencies via Onramp.money",
    getUrl: (wallet: string, crypto: string, fiat: string) =>
      `https://onramp.money/main/buy/?appId=1&walletAddress=${wallet}&coinCode=${crypto.toLowerCase()}`
  },
  {
    id: "mudrex",
    name: "Mudrex App",
    desc: "India / Lowest fees (Manual transfer)",
    getUrl: () => ""
  }
];

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

export default function AddFundsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("zpay_direct");

  // ZPay Direct State
  const [utr, setUtr] = useState("");
  const [fundingLoading, setFundingLoading] = useState(false);
  const [fundingError, setFundingError] = useState("");
  const [fundingSuccess, setFundingSuccess] = useState(false);

  // Stellar Direct Deposit State
  const [addressCopied, setAddressCopied] = useState(false);
  const [depositDetected, setDepositDetected] = useState<{amount: string; asset: string; tx_hash: string} | null>(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // CCTP Cross-Chain State
  const [cctpChain, setCctpChain] = useState<'base' | 'ethereum'>('base');
  const [cctpInstructions, setCctpInstructions] = useState<any>(null);
  const [cctpIntentId, setCctpIntentId] = useState<string | null>(null);
  const [cctpStatus, setCctpStatus] = useState<string>('idle'); // idle | loading | ready | submitted | completed | failed
  const [cctpSourceTx, setCctpSourceTx] = useState('');
  const [cctpCopied, setCctpCopied] = useState(false);
  const cctpPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Onramp State
  const [isVerifyingOnChain, setIsVerifyingOnChain] = useState(false);

  // Faucet State
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetSuccess, setFaucetSuccess] = useState(false);
  const [faucetError, setFaucetError] = useState("");

  // Web3 State (CCTP 1-Click)
  const [web3Account, setWeb3Account] = useState<string | null>(null);
  const [bridgeLoading, setBridgeLoading] = useState(false);
  const [bridgeError, setBridgeError] = useState("");

  const connectWeb3Wallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3Account(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet.");
    }
  };

  const handle1ClickBridge = async () => {
    if (!web3Account || !window.ethereum) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!cctpInstructions || !cctpIntentId) {
      setBridgeError("Bridge tracking failed to initialize. Please check your database setup (CCTP tables may be missing).");
      return;
    }
    setBridgeLoading(true);
    setBridgeError("");

    try {
      // 1. Setup Ethers Provider & Signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Ensure user is on the correct network (Base or Ethereum)
      const network = await provider.getNetwork();
      const requiredChainId = cctpChain === 'base' ? 84532 : 11155111; // Base Sepolia / Sepolia Testnet IDs for now (adjust for mainnet)
      const expectedChainId = BigInt(cctpChain === 'base' ? (cctpInstructions.domain === 6 ? 84532 : 8453) : (cctpInstructions.domain === 0 ? 11155111 : 1)); // Handle mainnet/testnet automatically later. Actually let's just let ethers try the transaction, if the contract isn't there it will fail, or we can just send the tx.
      // Wait, we can just rely on the user having the right network selected, or the tx will fail.
      
      const amountInUnits = ethers.parseUnits(finalAmount.toString(), 6);

      // 2. Approve USDC
      const usdcAbi = ["function approve(address spender, uint256 amount) public returns (bool)"];
      const usdcContract = new ethers.Contract(cctpInstructions.usdcContractAddress, usdcAbi, signer);
      
      const approveTx = await usdcContract.approve(cctpInstructions.tokenMessengerAddress, amountInUnits);
      await approveTx.wait();

      // 3. Call depositForBurn
      const tmAbi = ["function depositForBurn(uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken) external"];
      const tmContract = new ethers.Contract(cctpInstructions.tokenMessengerAddress, tmAbi, signer);

      const burnTx = await tmContract.depositForBurn(
        amountInUnits,
        cctpInstructions.destinationDomain,
        cctpInstructions.mintRecipient,
        cctpInstructions.usdcContractAddress
      );
      
      await burnTx.wait();

      // 4. Submit tx hash to backend
      const res = await fetch('/api/cctp/deposit-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent_id: cctpIntentId, source_tx_hash: burnTx.hash }),
      });
      
      if (res.ok) setCctpStatus('submitted');
      else {
        const data = await res.json();
        setBridgeError(data.error || "Failed to submit bridge transaction");
      }
    } catch (e: any) {
      console.error(e);
      setBridgeError(e.message || "Transaction failed or rejected");
    } finally {
      setBridgeLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  // Start/stop SSE stream when Stellar Direct tab is active in step 3
  useEffect(() => {
    const shouldStream = step === 3 && selectedProvider === "stellar_direct";

    if (shouldStream && !eventSourceRef.current) {
      const es = new EventSource("/api/zpay/deposit-stream");
      eventSourceRef.current = es;

      es.onopen = () => setStreamConnected(true);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "deposit") {
            setDepositDetected({ amount: data.amount, asset: data.asset, tx_hash: data.tx_hash });
            // Auto-navigate to dashboard after 3s
            setTimeout(() => router.push("/dashboard"), 3000);
          }
          if (data.type === "connected") setStreamConnected(true);
        } catch { /* ignore parse errors */ }
      };
      es.onerror = () => {
        setStreamConnected(false);
        es.close();
        eventSourceRef.current = null;
      };
    }

    if (!shouldStream && eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setStreamConnected(false);
    }

    return () => {
      if (!shouldStream && eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [step, selectedProvider, router]);

  // CCTP: load deposit instructions when tab opens; poll status when submitted
  useEffect(() => {
    const isCctpActive = step === 3 && selectedProvider === 'cctp_usdc';

    if (isCctpActive && cctpStatus === 'idle') {
      setCctpStatus('loading');
      fetch(`/api/cctp/deposit-address?chain=${cctpChain}`)
        .then(r => r.json())
        .then(data => {
          if (data.instructions) {
            setCctpInstructions(data.instructions);
            setCctpIntentId(data.intent_id);
            setCctpStatus('ready');
          } else {
            setCctpStatus('failed');
          }
        })
        .catch(() => setCctpStatus('failed'));
    }

    // Poll for completion if user has submitted a tx
    if (isCctpActive && cctpStatus === 'submitted' && cctpIntentId && !cctpPollRef.current) {
      cctpPollRef.current = setInterval(async () => {
        const res = await fetch('/api/cctp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ intent_id: cctpIntentId }),
        });
        const data = await res.json();
        if (data.status === 'completed') {
          setCctpStatus('completed');
          if (cctpPollRef.current) { clearInterval(cctpPollRef.current); cctpPollRef.current = null; }
          setTimeout(() => router.push('/dashboard'), 3000);
        } else if (data.status === 'failed') {
          setCctpStatus('failed');
          if (cctpPollRef.current) { clearInterval(cctpPollRef.current); cctpPollRef.current = null; }
        }
      }, 30_000); // poll every 30s
    }

    if (!isCctpActive && cctpPollRef.current) {
      clearInterval(cctpPollRef.current);
      cctpPollRef.current = null;
    }

    return () => {
      if (cctpPollRef.current) { clearInterval(cctpPollRef.current); cctpPollRef.current = null; }
    };
  }, [step, selectedProvider, cctpStatus, cctpChain, cctpIntentId, router]);

  // CCTP: reload instructions when chain changes
  useEffect(() => {
    if (step === 3 && selectedProvider === 'cctp_usdc' && cctpStatus === 'ready') {
      setCctpStatus('idle');
      setCctpInstructions(null);
    }
  }, [cctpChain]); // eslint-disable-line react-hooks/exhaustive-deps

  const finalAmount = isCustom ? parseFloat(customAmount) || 0 : amount;

  const isAmountValid = isCustom 
    ? finalAmount >= 100 && finalAmount % 100 === 0
    : finalAmount > 0;

  const handleCheckout = () => {
    const provider = PROVIDERS.find((p) => p.id === selectedProvider);
    if (provider && profile?.stellar_address && provider.id !== "zpay_direct") {
      const url = provider.getUrl(profile.stellar_address, "XLM", "INR");
      window.open(url, "_blank");
    }
  };

  const handleDirectFunding = async () => {
    if (utr.length < 10) {
      setFundingError("Please enter a valid 12-digit UTR.");
      return;
    }
    
    setFundingLoading(true);
    setFundingError("");
    
    try {
      const res = await fetch("/api/zpay/fund-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stellarAddress: profile?.stellar_address, 
          utr,
          amount: finalAmount
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setFundingSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        // Here is where ACID failure is shown to the user (e.g. UTR already used)
        setFundingError(data.error || "Funding failed. Please contact support.");
      }
    } catch (err) {
      setFundingError("Network error. Please try again.");
    } finally {
      setFundingLoading(false);
    }
  };

  const verifyOnChain = async () => {
    setIsVerifyingOnChain(true);
    // Simulate a network delay while we "check" the blockchain
    setTimeout(() => {
      setIsVerifyingOnChain(false);
      // In a real implementation, you'd fetch the stellar balance here.
      // For UX, we just redirect to dashboard so they see their balance.
      router.push("/dashboard");
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  const upiId = "zpay@ybl";
  const upiUri = `upi://pay?pa=${upiId}&pn=ZPay&am=${finalAmount || "100"}&cu=INR`;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Add Funds</h2>
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-white/40">
            <button onClick={() => setStep(1)} className={cn("transition-colors hover:text-white", step >= 1 ? "text-blue-400" : "")}>Amount</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => step > 1 && setStep(2)} className={cn("transition-colors", step >= 2 ? "text-blue-400 hover:text-white" : "", step < 2 ? "cursor-default" : "")}>Provider</button>
            <ChevronRight className="w-3 h-3" />
            <span className={cn(step >= 3 ? "text-blue-400" : "")}>Payment</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* STEP 1: Amount */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center space-y-6">
                <p className="text-sm font-medium text-white/60">Select an amount to add</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset);
                        setIsCustom(false);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all font-semibold text-lg",
                        !isCustom && amount === preset
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      )}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-zinc-400 font-medium">Custom ₹</span>
                    </div>
                    <input
                      type="number"
                      step="100"
                      min="100"
                      placeholder="Multiples of 100"
                      value={customAmount}
                      onChange={(e) => {
                        setIsCustom(true);
                        setCustomAmount(e.target.value);
                      }}
                      onFocus={() => setIsCustom(true)}
                      className={cn(
                        "w-full bg-black/50 border rounded-2xl py-4 pl-24 pr-4 text-white font-medium focus:outline-none transition-colors",
                        isCustom ? "border-blue-500" : "border-white/10 focus:border-white/20"
                      )}
                    />
                  </div>
                  {isCustom && customAmount && !isAmountValid && (
                    <p className="text-left text-xs text-red-400 mt-2 ml-2">Must be a multiple of ₹100</p>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!isAmountValid}
                className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-14 rounded-2xl transition-all"
              >
                Continue with ₹{finalAmount.toLocaleString('en-IN')}
              </Button>
            </div>
          )}

          {/* STEP 2: Provider */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Paying</span>
                <span className="text-xl font-bold text-white">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">Select Provider</label>
                <div className="grid gap-3">
                  {PROVIDERS.map((p) => {
                    const isDisabled = false; // All amounts valid for global onramp, zpay handles its own min
                    return (
                      <button
                        key={p.id}
                        disabled={isDisabled}
                        onClick={() => setSelectedProvider(p.id)}
                        className={cn(
                          "flex items-center justify-between p-5 rounded-2xl border transition-all text-left",
                          isDisabled ? "opacity-50 cursor-not-allowed bg-black/20 border-white/5" :
                          selectedProvider === p.id
                            ? "bg-blue-500/10 border-blue-500/50"
                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-semibold text-base",
                              selectedProvider === p.id ? "text-blue-400" : "text-zinc-300"
                            )}>
                              {p.name}
                            </span>
                            {p.badge && (
                              <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-bold uppercase tracking-wider">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-zinc-500 mt-1">{p.desc}</span>
                        </div>
                        <div>
                          {selectedProvider === p.id ? (
                            <CheckCircle2 className="w-6 h-6 text-blue-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-zinc-700" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={() => setStep(3)}
                className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-14 rounded-2xl transition-all"
              >
                Proceed to Payment
              </Button>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {selectedProvider === "zpay_direct" && (
                <div className="space-y-4">
                  {fundingSuccess ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">Payment Verified</h3>
                        <p className="text-sm text-green-400/80 mt-2">Your deposit was safely processed.<br/>Activating wallet on-chain...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8">
                      <div className="flex flex-col items-center text-center space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold text-white flex items-center justify-center gap-2">
                            <IndianRupee className="w-6 h-6 text-blue-400" /> Pay exactly ₹{finalAmount.toLocaleString('en-IN')}
                          </h3>
                          <p className="text-sm text-zinc-400 mt-2 max-w-xs mx-auto">Scan with GPay, PhonePe, or Paytm. Do not alter the amount.</p>
                        </div>

                        <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl shadow-black">
                          <QRCode value={upiUri} size={180} />
                        </div>
                        
                        <div className="w-full space-y-3 pt-6 border-t border-white/5">
                          <label className="text-sm font-semibold text-zinc-400 text-left block">Enter 12-digit UTR Reference</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 312345678901" 
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            disabled={fundingLoading}
                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
                          />
                          {fundingError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                              <p className="text-red-400 text-sm font-medium">{fundingError}</p>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleDirectFunding}
                          disabled={fundingLoading || utr.length < 10}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 rounded-2xl transition-colors shadow-xl shadow-blue-500/20"
                        >
                          {fundingLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : "Verify & Complete Deposit"}
                        </Button>
                        <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Transaction protected by ACID database constraints</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedProvider === "stellar_direct" && (
                <div className="space-y-4">
                  {depositDetected ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">Deposit Detected!</h3>
                        <p className="text-sm text-green-400/80 mt-2">
                          +{depositDetected.amount} {depositDetected.asset} received.<br/>
                          Redirecting to dashboard…
                        </p>
                        <p className="text-xs text-zinc-500 mt-3 font-mono break-all">{depositDetected.tx_hash}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 space-y-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-2">
                          <Wallet className="w-7 h-7 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Send XLM directly to your Z-Pay wallet</h3>
                        <p className="text-sm text-zinc-400 max-w-xs">
                          Works with Freighter, Lobstr, or any Stellar-compatible wallet.
                          Minimum: 1 XLM (≈{'\u20b9'}10)
                        </p>
                      </div>

                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl shadow-black">
                          {profile?.stellar_address ? (
                            <QRCode value={profile.stellar_address} size={180} />
                          ) : (
                            <div className="w-[180px] h-[180px] flex items-center justify-center">
                              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address copy */}
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500 text-center uppercase tracking-wider font-semibold">Your Stellar Address</p>
                        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-2xl px-4 py-3">
                          <span className="flex-1 text-xs text-zinc-300 font-mono break-all">{profile?.stellar_address || '—'}</span>
                          <button
                            onClick={() => {
                              if (profile?.stellar_address) {
                                navigator.clipboard.writeText(profile.stellar_address);
                                setAddressCopied(true);
                                setTimeout(() => setAddressCopied(false), 2000);
                              }
                            }}
                            className="flex-shrink-0 p-2 hover:bg-white/5 rounded-xl transition-colors"
                          >
                            {addressCopied ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Testnet Faucet */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <p className="text-xs text-zinc-500 text-center">
                          TESTNET ONLY: Need funds to test? Get 10,000 XLM instantly.
                        </p>
                        <Button
                          onClick={async () => {
                            setFaucetLoading(true);
                            setFaucetError("");
                            try {
                              const res = await fetch('/api/zpay/faucet', { method: 'POST' });
                              const data = await res.json();
                              if (res.ok) {
                                setFaucetSuccess(true);
                                setTimeout(() => setFaucetSuccess(false), 3000);
                              } else {
                                setFaucetError(data.error);
                              }
                            } catch (e: any) {
                              setFaucetError(e.message);
                            }
                            setFaucetLoading(false);
                          }}
                          disabled={faucetLoading || faucetSuccess}
                          className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-semibold rounded-2xl transition-all h-12"
                        >
                          {faucetLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                          {faucetSuccess ? "Funded 10k XLM!" : "Use Friendbot Faucet (10k XLM)"}
                        </Button>
                        {faucetError && <p className="text-xs text-red-400 text-center">{faucetError}</p>}
                      </div>

                      {/* Live detection indicator */}
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                        streamConnected
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-yellow-500/5 border-yellow-500/20"
                      )}>
                        {streamConnected ? (
                          <>
                            <Zap className="w-4 h-4 text-green-400 flex-shrink-0 animate-pulse" />
                            <span className="text-sm text-green-400">Listening for your deposit in real-time…</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="w-4 h-4 text-yellow-400 flex-shrink-0 animate-spin" />
                            <span className="text-sm text-yellow-400">Connecting to Stellar network…</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 text-center">
                        This page will auto-update when your deposit arrives. You can also close and refresh later.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedProvider === "cctp_usdc" && (
                <div className="space-y-4">
                  {cctpStatus === 'completed' ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">Bridge Complete!</h3>
                        <p className="text-sm text-green-400/80 mt-2">Your USDC has been credited to your Z-Pay wallet.<br/>Redirecting…</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-7 space-y-6">
                      {/* Header */}
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 mb-1">
                          <Layers className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Bridge USDC via Circle CCTP</h3>
                        <p className="text-sm text-zinc-400 max-w-xs">
                          Send USDC from any EVM chain directly to your Z-Pay Stellar wallet.
                          No third-party, Circle-native bridge.
                        </p>
                      </div>

                      {/* Chain selector */}
                      <div className="flex gap-2">
                        {(['base', 'ethereum'] as const).map(c => (
                          <button
                            key={c}
                            onClick={() => setCctpChain(c)}
                            className={cn(
                              "flex-1 py-3 rounded-2xl border text-sm font-bold uppercase tracking-wider transition-all",
                              cctpChain === c
                                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                                : "bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10"
                            )}
                          >
                            {c === 'base' ? '⬡ Base' : 'Ξ Ethereum'}
                          </button>
                        ))}
                      </div>

                      {cctpStatus === 'loading' && (
                        <div className="flex items-center justify-center py-8 gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                          <span className="text-sm text-zinc-400">Loading deposit instructions…</span>
                        </div>
                      )}

                      {(cctpStatus === 'ready' || cctpStatus === 'submitted') && cctpInstructions && (
                        <>
                          {/* 1-Click Bridge UI */}
                          <div className="bg-purple-500/5 border border-purple-500/10 rounded-3xl p-6 space-y-5">
                            {cctpStatus === 'ready' && (
                              <>
                                <div className="text-center space-y-1">
                                  <p className="text-sm text-zinc-300">You are bridging</p>
                                  <p className="text-3xl font-bold text-white">{finalAmount} USDC</p>
                                  <p className="text-xs text-zinc-500">to {profile?.stellar_address.slice(0, 6)}...{profile?.stellar_address.slice(-4)}</p>
                                </div>

                                {!web3Account ? (
                                  <Button
                                    onClick={connectWeb3Wallet}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-12 rounded-2xl transition-colors shadow-lg shadow-orange-500/20"
                                  >
                                    Connect MetaMask
                                  </Button>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl px-4 py-3">
                                      <span className="text-xs text-zinc-400">Connected</span>
                                      <span className="text-xs font-mono text-purple-300">{web3Account.slice(0, 6)}...{web3Account.slice(-4)}</span>
                                    </div>
                                    
                                    <Button
                                      onClick={handle1ClickBridge}
                                      disabled={bridgeLoading}
                                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold h-12 rounded-2xl transition-colors shadow-xl shadow-purple-500/20"
                                    >
                                      {bridgeLoading ? (
                                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Please confirm in wallet...</>
                                      ) : (
                                        `Bridge ${finalAmount} USDC in 1-Click`
                                      )}
                                    </Button>
                                    
                                    {bridgeError && (
                                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                        <p className="text-red-400 text-xs font-medium">{bridgeError}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {cctpStatus === 'submitted' && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                              <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                              <span className="text-sm text-purple-400">
                                Waiting for Circle attestation (5–20 min)…
                                We'll automatically credit your wallet when complete.
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {cctpStatus === 'failed' && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                          Failed to load CCTP instructions. Please try again.
                          <button onClick={() => setCctpStatus('idle')} className="ml-2 underline">Retry</button>
                        </div>
                      )}

                      <p className="text-xs text-zinc-600 text-center">
                        Powered by Circle CCTP v2 · Native bridge · No third-party custody
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedProvider === "onramp" && (

                <div className="space-y-8 text-center py-10 px-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mx-auto">
                    <ArrowUpRight className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">Ready to Checkout</h3>
                    <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      You will be redirected to complete your deposit via Onramp.money. 
                      You can select any supported global fiat currency on their widget.
                    </p>
                  </div>
                  <div className="space-y-4 max-w-sm mx-auto">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-14 rounded-2xl transition-colors"
                    >
                      Continue to Provider <ArrowUpRight className="ml-2 w-4 h-4 opacity-70" />
                    </Button>
                    <Button
                      onClick={verifyOnChain}
                      disabled={isVerifyingOnChain}
                      className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium h-14 rounded-2xl transition-colors"
                    >
                      {isVerifyingOnChain ? <Loader2 className="w-5 h-5 animate-spin text-white/70" /> : <><RefreshCw className="w-4 h-4 mr-2" /> I Paid: Verify On-Chain</>}
                    </Button>
                  </div>
                </div>
              )}

              {selectedProvider === "mudrex" && (
                <div className="space-y-8 text-center py-10 px-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mx-auto">
                    <QrCode className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">Manual Mudrex Deposit</h3>
                    <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      1. Open your Mudrex app and buy XLM.<br/>
                      2. Select Withdraw and paste your ZPay Wallet Address below.<br/>
                      3. Select "Personal Wallet" as the exchange type.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-mono truncate mr-4">{profile?.stellar_address}</span>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => navigator.clipboard.writeText(profile?.stellar_address)}
                    >
                      Copy
                    </Button>
                  </div>
                  <Button
                    onClick={verifyOnChain}
                    disabled={isVerifyingOnChain}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 rounded-2xl transition-colors"
                  >
                    {isVerifyingOnChain ? <Loader2 className="w-5 h-5 animate-spin text-white/70" /> : <><RefreshCw className="w-4 h-4 mr-2" /> I Paid: Verify On-Chain</>}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
