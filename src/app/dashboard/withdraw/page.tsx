"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";

export default function WithdrawCryptoPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return toast.error("Enter a valid amount");

    setLoading(true);
    try {
      const mockWalletAddress = "GB...MOCKADDRESS"; 
      
      const res = await fetch("/api/stripe/offramp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCurrency: "usdc",
          sourceNetwork: "stellar",
          sourceAmount: amount,
          walletAddress: mockWalletAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.sessionId);
      toast.success("Withdrawal initiated!");
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Withdraw to Bank</h2>
      </div>

      <Card className="max-w-md mt-6 bg-[#1a1a1a] border-zinc-800 text-white">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BuildingLibraryIcon className="h-6 w-6 text-zinc-400" />
            <CardTitle>Cash Out</CardTitle>
          </div>
          <CardDescription className="text-zinc-400">
            Sell your USDC and transfer USD directly to your connected bank account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sessionId ? (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-zinc-200">Amount (USDC)</Label>
                <Input
                  id="amount"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Estimated Rate</span>
                  <span className="text-zinc-200">1 USDC = $1.00</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-zinc-400">Fee</span>
                  <span className="text-zinc-200">~$0.00</span>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Initiate Withdrawal"}
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
              <p className="text-sm text-green-400 mb-2">
                Withdrawal Session Created!
              </p>
              <p className="text-xs text-zinc-500 mb-4 break-all">
                Session ID: {sessionId}
              </p>
              <p className="text-xs text-zinc-400 mb-4">
                In a full implementation, you would be prompted to sign a Stellar transaction here to send funds to the offramp treasury.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setSessionId(null)}
              >
                Start New Withdrawal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
