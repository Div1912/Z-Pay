import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@/lib/x402/gateway";
import { getBalances } from "@/lib/stellar";

async function balanceDataHandler(req: NextRequest) {
  const address = "GCF74YZF5V4HEEKVGP4NFOYJ56Y2KZ4D5DR3XTJFXTWF7UTSMILJC245";
  try {
    const balances = await getBalances(address);
    const xlmBalance = balances.find((b: any) => b.asset === 'XLM')?.balance || '0';
    return NextResponse.json({
      success: true,
      data: {
        address: address,
        balances: balances,
        message: `Your current mainnet Z-Pay balance is ${xlmBalance} XLM!`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withX402(balanceDataHandler, {
  priceXLM: "0.01", // A small fee sent back to your own wallet
  destinationAddress: "GCF74YZF5V4HEEKVGP4NFOYJ56Y2KZ4D5DR3XTJFXTWF7UTSMILJC245"
});
