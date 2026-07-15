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
  
  // Deposit flow state
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [stellarAddress, setStellarAddress] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/zpay/balance").then(res => res.json()),
      fetch("/api/zpay/profile").then(res => res.json())
    ]).then(([balanceData, profileData]) => {
      if (balanceData.balances) {
        setBalances(balanceData.balances.filter((b: any) => !b.converted));
        setTotalValue(balanceData.converted_balance || "0.00");
        setCurrency(balanceData.preferred_currency || "INR");
      }
      if (profileData.stellar_address) {
        setStellarAddress(profileData.stellar_address);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const resetDeposit = () => {
    setSelectedAsset(null);
    setSelectedNetwork(null);
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
          <Button 
            onClick={() => setWithdrawModalOpen(true)}
            className="flex-1 md:flex-none h-12 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" /> Withdraw
          </Button>
        </div>
      </div>

      {/* ── Tabs for Assets ── */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none p-0 h-auto mb-6 gap-6">
          <TabsTrigger value="overview" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-zinc-500 font-bold text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#D4AF37] px-0">
            Overview
          </TabsTrigger>
          <TabsTrigger value="coins" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-zinc-500 font-bold text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#D4AF37] px-0">
            Coins
          </TabsTrigger>
          <TabsTrigger value="funds" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-zinc-500 font-bold text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#D4AF37] px-0">
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
                  <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded flex items-center">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -{(parseFloat(totalValue) * 0.042).toFixed(2)} (4.20%)
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
                    Today <span className="text-red-500">-{(parseFloat(totalValue) * 0.042).toFixed(2)} (4.20%)</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                  <p className="text-sm text-zinc-400 mb-4">Select an asset to deposit:</p>
                  {['USDC', 'XLM', 'USDT', 'BTC'].map(asset => (
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
              ) : !selectedNetwork ? (
                <div className="space-y-4">
                  <button onClick={() => setSelectedAsset(null)} className="text-sm text-[#D4AF37] font-bold mb-4 flex items-center">
                    ← Back to assets
                  </button>
                  <p className="text-sm text-zinc-400 mb-2">Select network for <strong>{selectedAsset}</strong>:</p>
                  
                  <button 
                    onClick={() => setSelectedNetwork('Stellar')}
                    className="w-full flex items-center justify-between p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-bold text-blue-400">Stellar Network</p>
                      <p className="text-xs text-blue-400/70">Fast, low fees</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </button>
                  
                  <button 
                    onClick={() => setSelectedNetwork('ERC20')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-white">Ethereum (ERC20)</p>
                      <p className="text-xs text-zinc-500">Cross-chain bridging</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setSelectedNetwork('TRC20')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-white">Tron (TRC20)</p>
                      <p className="text-xs text-zinc-500">Cross-chain bridging</p>
                    </div>
                  </button>
                </div>
              ) : selectedNetwork === 'Stellar' ? (
                <div className="space-y-6">
                  <button onClick={() => setSelectedNetwork(null)} className="text-sm text-[#D4AF37] font-bold flex items-center">
                    ← Back to networks
                  </button>
                  <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-48 h-48 bg-white mx-auto rounded-xl flex items-center justify-center p-2 mb-6">
                      <div className="w-full h-full border-4 border-dashed border-black/20 flex flex-col items-center justify-center text-black/50">
                        <QrCode className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase">QR Code</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Your Stellar Deposit Address</p>
                    <div className="bg-black/50 p-4 rounded-xl font-mono text-sm break-all text-blue-400 border border-blue-500/20 select-all cursor-text">
                      {stellarAddress || "Loading..."}
                    </div>
                    
                    <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                      Only send {selectedAsset} to this address via the Stellar network. Sending any other asset or using a different network will result in permanent loss.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <button onClick={() => setSelectedNetwork(null)} className="text-sm text-[#D4AF37] font-bold flex items-center">
                    ← Back to networks
                  </button>
                  <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center">
                    <Info className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-black text-lg text-orange-500 mb-2">Network Unavailable</h3>
                    <p className="text-orange-500/80 text-sm leading-relaxed mb-4">
                      To comply with current Indian Financial Intelligence Unit (FIU) regulations regarding virtual digital asset cross-chain bridges, non-Stellar network deposits are temporarily disabled until full KYC integration is complete.
                    </p>
                    <p className="text-sm text-zinc-400">
                      Please use the native <strong>Stellar Network</strong> to deposit your {selectedAsset}.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* ── Withdraw Modal ── */}
      <AnimatePresence>
        {withdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={resetWithdraw}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">Withdraw Crypto</h2>
                <button onClick={resetWithdraw} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center mb-6">
                <Info className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-black text-lg text-orange-500 mb-2">Withdrawals Restricted</h3>
                <p className="text-orange-500/80 text-sm leading-relaxed">
                  Direct external withdrawals to unregulated self-custodial wallets are currently restricted pending KYC verification as per FIU compliance guidelines. 
                  <br/><br/>
                  To transfer funds out, please use the <strong>Send Money</strong> feature to send directly to an FIU-registered exchange (like CoinDCX or Binance).
                </p>
              </div>
              
              <Button onClick={resetWithdraw} className="w-full h-12 bg-white text-black font-bold rounded-xl">
                Understood
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
