"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BuildingLibraryIcon, CurrencyDollarIcon, LinkIcon } from "@heroicons/react/24/outline";

export default function WithdrawCryptoPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Sell state
  const [sellAmount, setSellAmount] = useState("");
  const [selling, setSelling] = useState(false);
  
  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/zpay/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellAmount || isNaN(Number(sellAmount))) return toast.error("Enter a valid amount");

    setSelling(true);
    try {
      const res = await fetch("/api/exchange/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: sellAmount,
          currency: "USDC",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Sale successful! Fiat balance credited.");
      setSellAmount("");
      fetchProfile(); // Refresh fiat balance
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSelling(false);
    }
  };

  const handleLinkBank = async () => {
    setLinking(true);
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to Stripe Onboarding
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message);
      setLinking(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) return toast.error("Enter a valid amount");

    setWithdrawing(true);
    try {
      const res = await fetch("/api/stripe/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: withdrawAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Withdrawal successful! Funds sent to bank.");
      setWithdrawAmount("");
      fetchProfile(); // Refresh fiat balance
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white/50">Loading...</div>;
  }

  const fiatBalance = parseFloat(profile?.fiat_balance || "0");
  const hasBankLinked = !!profile?.stripe_connect_id;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sell & Withdraw</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* SELL CRYPTO CARD */}
        <Card className="bg-[#1a1a1a] border-zinc-800 text-white h-fit">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <CurrencyDollarIcon className="h-6 w-6 text-zinc-400" />
              <CardTitle>Sell Crypto to Fiat</CardTitle>
            </div>
            <CardDescription className="text-zinc-400">
              Convert your USDC crypto balance into withrawable Fiat USD.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSell} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sellAmount" className="text-zinc-200">Amount to Sell (USDC)</Label>
                <Input
                  id="sellAmount"
                  placeholder="100.00"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Estimated Rate</span>
                  <span className="text-zinc-200">1 USDC = $1.00</span>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold" 
                disabled={selling}
              >
                {selling ? "Processing..." : "Sell for Fiat"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* WITHDRAW FIAT CARD */}
        <Card className="bg-[#1a1a1a] border-zinc-800 text-white h-fit">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BuildingLibraryIcon className="h-6 w-6 text-green-400" />
              <CardTitle>Withdraw to Bank</CardTitle>
            </div>
            <CardDescription className="text-zinc-400">
              Transfer your Fiat balance directly to your connected bank account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-green-500">Available Fiat Balance</span>
              <span className="text-lg font-bold text-green-400">${fiatBalance.toFixed(2)} USD</span>
            </div>

            {!hasBankLinked ? (
              <div className="text-center p-6 border border-zinc-800 border-dashed rounded-lg bg-zinc-900/30">
                <LinkIcon className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">No Bank Account Linked</h3>
                <p className="text-xs text-zinc-500 mb-4">
                  You must link a bank account via Stripe Connect before you can withdraw funds.
                </p>
                <Button 
                  onClick={handleLinkBank} 
                  disabled={linking}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  {linking ? "Redirecting to Stripe..." : "Link Bank Account"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount" className="text-zinc-200">Amount to Withdraw (USD)</Label>
                  <Input
                    id="withdrawAmount"
                    placeholder="100.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" 
                  disabled={withdrawing || fiatBalance <= 0}
                >
                  {withdrawing ? "Processing..." : "Withdraw to Bank"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
