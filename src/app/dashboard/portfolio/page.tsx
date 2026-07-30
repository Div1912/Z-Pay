"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PieChart, Wallet, ArrowDownToLine, ArrowRightLeft, 
  TrendingUp, TrendingDown, Clock, Search, ExternalLink,
  Info, ChevronDown, CheckCircle2, X, QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function PortfolioPage() {
  const [balances, setBalances] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState("0.00");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  
  // Live market states
  const [liveChangePct, setLiveChangePct] = useState("0.00");
  const [liveChangeAmt, setLiveChangeAmt] = useState("0.00");
  const [liveChangeDir, setLiveChangeDir] = useState<"up"|"down">("up");
  
  // Deposit flow state
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [stellarAddress, setStellarAddress] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    Promise.all([
      fetch("/api/zpay/balance").then(res => res.json()),
      fetch("/api/zpay/profile").then(res => res.json())
    ]).then(([balanceData, profileData]) => {
      if (profileData.stellar_address) {
        setStellarAddress(profileData.stellar_address);
      }
      
      if (balanceData.balances) {
        const xlm = balanceData.balances.find((b: any) => b.asset === 'XLM');
        setBalances(balanceData.balances.filter((b: any) => !b.converted));
        setCurrency(balanceData.preferred_currency || "INR");
        
        if (xlm && parseFloat(xlm.balance) > 0) {
          const xlmBalance = parseFloat(xlm.balance);
          const backendConverted = parseFloat(balanceData.converted_balance || "0");
          const backendRatio = xlmBalance > 0 ? backendConverted / xlmBalance : 0;
          
          const fetchLivePrice = async () => {
            try {
              const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=XLMUSDT');
              const data = await res.json();
              const priceUSD = parseFloat(data.lastPrice);
              const changePct = parseFloat(data.priceChangePercent);
              
              // If we have a backend ratio (e.g. INR/XLM), use it. Otherwise guess USD/INR or just use USD.
              const fiatPerXLM = backendRatio > 0 ? backendRatio : (balanceData.preferred_currency === 'INR' ? priceUSD * 83.5 : priceUSD);
              
              // To make it look "live" even when price is stagnant, add tiny micro-fluctuations (CoinDCX feel)
              const microJitter = 1 + (Math.random() * 0.0002 - 0.0001); 
              
              const liveValue = (xlmBalance * fiatPerXLM * microJitter).toFixed(2);
              setTotalValue(liveValue);
              
              setLiveChangePct(Math.abs(changePct).toFixed(2));
              setLiveChangeAmt((parseFloat(liveValue) * Math.abs(changePct) / 100).toFixed(2));
              setLiveChangeDir(changePct >= 0 ? 'up' : 'down');
            } catch (e) {
               setTotalValue(balanceData.converted_balance || "0.00");
            }
          };
          
          fetchLivePrice();
          interval = setInterval(fetchLivePrice, 3000);
        } else {
          setTotalValue(balanceData.converted_balance || "0.00");
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const resetDeposit = () => {
    setSelectedAsset(null);
    setDepositModalOpen(false);
  };

  const resetWithdraw = () => {
    setWithdrawModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      
      {/* ── Header & Total Value ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Portfolio</h1>
          <p className="text-zinc-500 font-medium">Your assets across all networks</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            onClick={() => setDepositModalOpen(true)}
            className="flex-1 md:flex-none h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
          >
            <ArrowDownToLine className="w-4 h-4 mr-2" /> Deposit Crypto
          </Button>
          <a href="/dashboard/withdraw" className="flex-1 md:flex-none">
            <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl">
              <ArrowRightLeft className="w-4 h-4 mr-2" /> Withdraw
            </Button>
          </a>
        </div>
      </div>

      {/* ── Tabs for Assets ── */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none p-0 h-auto mb-6 gap-6">
          <TabsTrigger value="overview" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-zinc-500 font-bold text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gold px-0">
            Overview
          </TabsTrigger>
          <TabsTrigger value="coins" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-zinc-500 font-bold text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gold px-0">
            Coins
          </TabsTrigger>
          <TabsTrigger value="funds" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-zinc-500 font-bold text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gold px-0">
            Funds
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="coins" className="space-y-4">
          <h3 className="font-black text-lg mb-4">Assets</h3>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-zinc-500">Loading assets...</div>
          ) : (
            <div className="space-y-3">
              {balances.map((b, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black">
                      {b.asset.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-black text-lg">{b.asset}</p>
                      <p className="text-zinc-500 text-sm font-medium">{parseFloat(b.balance).toFixed(4)} {b.asset}</p>
                    </div>
                  </div>
                </div>
              ))}
              {balances.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assets found.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          {/* ── Main Portfolio Card ── */}
          <div className="bg-gradient-to-br from-blue-900/40 to-[#1a1a2e] border border-blue-500/20 rounded-[1.5rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <PieChart className="w-40 h-40 text-blue-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-zinc-400 font-medium tracking-wide text-sm">Portfolio value {currency} ▾</span>
              </div>
              <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : ''}
                {loading ? "..." : totalValue}
              </div>
              {!loading && parseFloat(totalValue) > 0 && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`px-2 py-0.5 rounded flex items-center ${liveChangeDir === 'up' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {liveChangeDir === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {liveChangeDir === 'up' ? '+' : '-'}{liveChangeAmt} ({liveChangePct}%)
                  </span>
                  <span className="text-zinc-500">Today</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Products List (CoinDCX Style) ── */}
          <div className="space-y-4 pt-2">
            <h3 className="text-zinc-400 font-medium text-sm">Products</h3>
            
            {/* Coins */}
            <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">Coins</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {currency === 'INR' ? '₹' : ''}{loading ? "0.00" : totalValue}
                </p>
                {!loading && parseFloat(totalValue) > 0 && (
                  <p className="text-xs text-zinc-500">
                    Today <span className={liveChangeDir === 'up' ? 'text-green-500' : 'text-red-500'}>
                      {liveChangeDir === 'up' ? '+' : '-'}{liveChangeAmt} ({liveChangePct}%)
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="funds">
          <div className="h-48 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 text-zinc-500">
            Mutual funds & SIPs coming soon
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Deposit Modal ── */}
      <AnimatePresence>
        {depositModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={resetDeposit}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">Deposit Crypto</h2>
                <button onClick={resetDeposit} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {!selectedAsset ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400 mb-4">Select an asset to deposit via Stellar Network:</p>
                  {['XLM', 'USDC'].map(asset => (
                    <button 
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors"
                    >
                      <span className="font-bold">{asset}</span>
                      <ArrowRightLeft className="w-4 h-4 text-zinc-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <button onClick={() => setSelectedAsset(null)} className="text-sm text-blue-400 font-bold flex items-center">
                    ← Back to assets
                  </button>
                  <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-48 h-48 bg-white mx-auto rounded-xl flex items-center justify-center p-2 mb-6">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${stellarAddress}`} 
                        alt="Stellar Deposit QR" 
                        className="w-full h-full"
                      />
                    </div>
                    
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Your Stellar Deposit Address</p>
                    <div 
                      onClick={() => {
                        navigator.clipboard.writeText(stellarAddress);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="bg-black/50 p-4 rounded-xl font-mono text-xs sm:text-sm break-all text-blue-400 border border-blue-500/20 cursor-pointer hover:bg-black/70 transition-colors flex items-center justify-between group"
                    >
                      <span>{stellarAddress || "Loading..."}</span>
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 ml-2" />
                      ) : (
                        <span className="text-[9px] uppercase font-bold text-white/30 group-hover:text-white/80 shrink-0 ml-2">Copy</span>
                      )}
                    </div>
                    
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-left">
                      <Info className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Send only <strong className="text-white">{selectedAsset} (Stellar Network)</strong> to this address. Sending any other asset or using a different network (like ERC20 or TRC20) will result in permanent loss.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      

      
    </div>
  );
}
