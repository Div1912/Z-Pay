'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { ArrowLeft, Wallet, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { EVM_NETWORKS, ZUB_TREASURY_ADDRESS, ERC20_ABI } from '@/lib/zub/web3';

export default function ZubDepositPage() {
  const router = useRouter();
  
  const [amount, setAmount] = useState('10');
  const [network, setNetwork] = useState<string>('base');
  const [account, setAccount] = useState<string | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'connecting' | 'switching' | 'approving' | 'sending' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Check if wallet is connected on load
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (e) {
        console.error("Failed to check connection", e);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setErrorMsg('MetaMask is not installed!');
      setStatus('error');
      return;
    }
    try {
      setStatus('connecting');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setStatus('idle');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to connect wallet');
      setStatus('error');
    }
  };

  const switchNetwork = async (chainIdHex: string) => {
    if (!(window as any).ethereum) return;
    try {
      setStatus('switching');
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      setStatus('idle');
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        // We could prompt them to add it here, but keeping it simple for now
        throw new Error("Network not found in MetaMask. Please add it manually.");
      }
      throw switchError;
    }
  };

  const handleDeposit = async () => {
    if (!account) return connectWallet();
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Enter a valid amount');
      setStatus('error');
      return;
    }

    try {
      setErrorMsg('');
      const netConfig = EVM_NETWORKS[network];
      
      // 1. Ensure correct network
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const { chainId } = await provider.getNetwork();
      
      if (Number(chainId) !== netConfig.chainId) {
        await switchNetwork(netConfig.chainIdHex);
      }

      // Re-get provider/signer after switch
      const updatedProvider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await updatedProvider.getSigner();

      // 2. Execute Transfer
      setStatus('sending');
      const usdcContract = new ethers.Contract(netConfig.usdcAddress, ERC20_ABI, signer);
      
      const parsedAmount = ethers.parseUnits(amount, netConfig.decimals);
      
      const tx = await usdcContract.transfer(ZUB_TREASURY_ADDRESS, parsedAmount);
      
      setStatus('verifying');
      // We don't need to wait for full confirmation on frontend, backend handles verification
      // But we wait for at least broadcasting
      await tx.wait(1);
      
      // 3. Send to backend for verification
      const res = await fetch('/api/zub/deposit/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain: network,
          tx_hash: tx.hash,
          expected_amount: Number(amount)
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Backend verification failed');
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);

    } catch (e: any) {
      console.error(e);
      let prettyError = 'Transaction failed';
      
      if (e.code === 'ACTION_REJECTED' || e.info?.error?.code === 4001) {
        prettyError = 'Transaction rejected by user';
      } else if (e.message?.includes('transfer amount exceeds balance') || e.info?.error?.message?.includes('exceeds balance') || JSON.stringify(e).includes('exceeds balance')) {
        prettyError = 'Insufficient USDC balance in your wallet to complete this deposit.';
      } else if (e.message?.includes('insufficient funds for gas')) {
        prettyError = 'Insufficient ETH for gas fees.';
      } else if (e.message) {
        // try to extract just the revert reason if it's a long JSON string
        const match = e.message.match(/execution reverted: "(.*?)"/);
        prettyError = match ? match[1] : (e.shortMessage || 'Transaction failed');
      }

      setErrorMsg(prettyError);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-white p-4 sm:p-6 md:p-8 pt-20">
      <div className="max-w-md mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-widest text-gold">DEPOSIT ZUB</h1>
            <p className="text-xs text-white/40 tracking-widest uppercase">Cross-Chain Ledger Top Up</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="space-y-8 relative z-10">
            
            {/* Network Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 tracking-widest uppercase">Select Network</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(EVM_NETWORKS).map(([key, net]) => (
                  <button
                    key={key}
                    onClick={() => setNetwork(key)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                      network === key 
                        ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {net.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 tracking-widest uppercase">Amount (USDC)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-5 text-4xl font-black text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                  placeholder="0.00"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" className="w-8 h-8 opacity-50" alt="USDC" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl tracking-wide">
                {errorMsg}
              </div>
            )}

            {/* Action Button */}
            {status === 'success' ? (
              <div className="w-full py-4 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center gap-2 font-black tracking-widest border border-green-500/20">
                <CheckCircle2 className="w-5 h-5" />
                DEPOSIT SUCCESSFUL
              </div>
            ) : (
              <button
                onClick={handleDeposit}
                disabled={status !== 'idle' && status !== 'error'}
                className="w-full py-4 rounded-2xl bg-white text-black font-black tracking-widest uppercase text-sm hover:bg-gold transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {!account ? (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </>
                ) : status === 'connecting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : status === 'switching' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Switching Network...
                  </>
                ) : status === 'sending' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirm in Wallet
                  </>
                ) : status === 'verifying' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying Block...
                  </>
                ) : (
                  <>
                    Deposit {amount || '0'} USDC
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}

            {account && (
              <div className="text-center">
                <span className="text-[10px] text-white/30 tracking-widest font-mono">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
