import { NextRequest, NextResponse } from "next/server";
import macaroon from "macaroon";
import * as StellarSdk from "@stellar/stellar-sdk";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const MACAROON_SECRET = process.env.MACAROON_SECRET || "zpay-x402-super-secret-key-change-in-prod";
const HORIZON_URL = "https://horizon.stellar.org";
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Supabase Admin Client for logging payments
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mumdfrgyxhddtyuebonc.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface X402Options {
  priceXLM: string;
  destinationAddress: string;
  merchantId?: string; // UUID from profiles table for DB logging
  platformFeeAddress?: string; // Z-Pay fee collection wallet
  platformFeeXLM?: string;
}

export function withX402(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse,
  options: X402Options
) {
  return async function (req: NextRequest, ...args: any[]) {
    const authHeader = req.headers.get("Authorization");

    // 1. Check for L402 challenge
    if (!authHeader || !authHeader.startsWith("L402 ")) {
      return issue402Challenge(options);
    }

    // 2. Parse the L402 header
    const tokenParts = authHeader.substring(5).split(":");
    if (tokenParts.length !== 2) {
      return NextResponse.json({ error: "Invalid L402 token format" }, { status: 400 });
    }

    const [macaroonBase64, txHash] = tokenParts;

    try {
      // 3. Verify Macaroon
      const m = macaroon.importMacaroon(macaroonBase64);
      m.verify(MACAROON_SECRET, () => null); 
      
      const invoiceId = Buffer.from(m.identifier).toString('utf8');

      // 4. Verify Stellar Transaction
      const tx = await server.transactions().transaction(txHash).call();
      
      if (!tx.successful) {
        return NextResponse.json({ error: "Transaction failed on network" }, { status: 402 });
      }

      if (tx.memo !== invoiceId) {
        return NextResponse.json({ error: "Transaction memo does not match invoice ID" }, { status: 402 });
      }

      const ops = await tx.operations();
      let merchantPaymentFound = false;
      let platformPaymentFound = !options.platformFeeAddress; // true if no fee required

      for (const op of ops.records) {
        if (op.type === "payment" || op.type === "path_payment_strict_receive" || op.type === "path_payment_strict_send") {
          const paymentOp = op as any;
          if (paymentOp.asset_type === "native") {
            // Check merchant payment
            if (
              paymentOp.to === options.destinationAddress &&
              parseFloat(paymentOp.amount) >= parseFloat(options.priceXLM)
            ) {
              merchantPaymentFound = true;
            }
            // Check platform fee
            if (
              options.platformFeeAddress &&
              options.platformFeeXLM &&
              paymentOp.to === options.platformFeeAddress &&
              parseFloat(paymentOp.amount) >= parseFloat(options.platformFeeXLM)
            ) {
              platformPaymentFound = true;
            }
          }
        }
      }

      if (!merchantPaymentFound) {
        return NextResponse.json({ error: "Merchant payment not found or insufficient amount" }, { status: 402 });
      }

      if (!platformPaymentFound) {
        return NextResponse.json({ error: "Platform fee not found or insufficient amount" }, { status: 402 });
      }

      // 5. Log the payment to the database (fire and forget)
      if (options.merchantId) {
        supabaseAdmin.from("x402_payments").insert({
          merchant_id: options.merchantId,
          invoice_id: invoiceId,
          amount: options.priceXLM,
          fee: options.platformFeeXLM || "0",
          tx_hash: txHash,
          endpoint: req.nextUrl.pathname
        }).then(({ error }) => {
          if (error) console.error("Failed to log X402 payment:", error);
        });
      }

      // 6. Success! Grant access.
      return handler(req, ...args);

    } catch (error: any) {
      console.error("X402 Verification error:", error);
      return issue402Challenge(options);
    }
  };
}

function issue402Challenge(options: X402Options) {
  const invoiceId = crypto.randomBytes(8).toString("hex");
  
  const m = macaroon.newMacaroon({
    version: 2,
    rootKey: MACAROON_SECRET,
    identifier: invoiceId,
    location: "zpay-x402-gateway"
  });

  const macaroonBase64 = Buffer.from(m.exportBinary()).toString('base64');

  const response = NextResponse.json(
    { 
      error: "Payment Required", 
      message: `Please pay ${options.priceXLM} XLM to ${options.destinationAddress} with memo '${invoiceId}'`,
      platformFeeRequired: !!options.platformFeeAddress,
      platformFeeAddress: options.platformFeeAddress,
      platformFeeAmount: options.platformFeeXLM
    },
    { status: 402 }
  );

  response.headers.set(
    "WWW-Authenticate",
    `L402 macaroon="${macaroonBase64}", invoice="${invoiceId}", amount="${options.priceXLM}", destination="${options.destinationAddress}", feeAddress="${options.platformFeeAddress || ''}", feeAmount="${options.platformFeeXLM || ''}"`
  );

  return response;
}
