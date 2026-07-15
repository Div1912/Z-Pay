"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function BuySellCryptoPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return toast.error("Enter a valid amount");

    setLoading(true);
    try {
      // In a real implementation, we'd fetch the user's wallet address from context
      const mockWalletAddress = "GB...MOCKADDRESS"; 
      
      const res = await fetch("/api/stripe/onramp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destCurrency: "usdc",
          destNetwork: "stellar",
          destAmount: amount,
          walletAddress: mockWalletAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setClientSecret(data.clientSecret);
      toast.success("Stripe session created! (Mocked UI transition)");
      
      // Here you would mount the Stripe Elements Crypto Elements with the clientSecret
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Buy Crypto</h2>
      </div>

      <Card className="max-w-md mt-6 bg-[#1a1a1a] border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Buy USDC</CardTitle>
          <CardDescription className="text-zinc-400">
            Use your debit card or bank account to buy USDC instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!clientSecret ? (
            <form onSubmit={handleBuy} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-zinc-200">Amount (USD)</Label>
                <Input
                  id="amount"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={loading}
              >
                {loading ? "Initializing..." : "Continue to Payment"}
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
              <p className="text-sm text-zinc-400 mb-4">
                Stripe Crypto Elements Widget would render here.
              </p>
              <p className="text-xs text-zinc-500 break-all">
                Client Secret: {clientSecret}
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setClientSecret(null)}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
