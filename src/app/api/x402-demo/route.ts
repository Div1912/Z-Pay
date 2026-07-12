import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@/lib/x402/gateway";

// Demo premium handler that returns valuable AI data or content
async function premiumDataHandler(req: NextRequest) {
  // If the code reaches here, the X402 gateway has verified the payment!
  return NextResponse.json({
    success: true,
    data: {
      message: "Welcome to the Premium X402 API!",
      secret: "The meaning of life is 42.",
      marketPrediction: "XLM will go to the moon.",
      timestamp: new Date().toISOString(),
    }
  });
}

// Wrap the handler with the X402 gateway
// We require a payment of 1 XLM to the specified testnet merchant address
export const GET = withX402(premiumDataHandler, {
  priceXLM: "1",
  destinationAddress: "GBSUOSW53YYIK2DDF3L2HED6X6D4MOMVXVHDEYQTVBYCVM464LIXB2S2" // Replace with a real Z-Pay merchant address
});
