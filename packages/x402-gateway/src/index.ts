import { NextRequest, NextResponse } from "next/server";
import macaroon from "macaroon";
import * as StellarSdk from "@stellar/stellar-sdk";
import crypto from "crypto";

export interface X402Options {
  priceXLM: string;
  destinationAddress: string;
  platformFeeAddress?: string;
  platformFeeXLM?: string;
  macaroonSecret: string;
  horizonUrl?: string;
}

export function withX402(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse,
  options: X402Options
) {
  const server = new StellarSdk.Horizon.Server(options.horizonUrl || "https://horizon-testnet.stellar.org");

  return async function (req: NextRequest, ...args: any[]) {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("L402 ")) {
      return issue402Challenge(options);
    }

    const tokenParts = authHeader.substring(5).split(":");
    if (tokenParts.length !== 2) {
      return NextResponse.json({ error: "Invalid L402 token format" }, { status: 400 });
    }

    const [macaroonBase64, txHash] = tokenParts;

    try {
      const m = macaroon.importMacaroon(macaroonBase64);
      m.verify(options.macaroonSecret, () => null); 
      
      const invoiceId = Buffer.from(m.identifier).toString('utf8');

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
            if (
              paymentOp.to === options.destinationAddress &&
              parseFloat(paymentOp.amount) >= parseFloat(options.priceXLM)
            ) {
              merchantPaymentFound = true;
            }
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
        return NextResponse.json({ error: "Merchant payment not found or insufficient" }, { status: 402 });
      }
      
      if (!platformPaymentFound) {
        return NextResponse.json({ error: "Platform fee payment not found or insufficient" }, { status: 402 });
      }

      return handler(req, ...args);

    } catch (error: any) {
      return issue402Challenge(options);
    }
  };
}

export function issue402Challenge(options: X402Options) {
  const invoiceId = crypto.randomBytes(8).toString("hex");
  
  const m = macaroon.newMacaroon({
    version: 2,
    rootKey: options.macaroonSecret,
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
    `L402 macaroon="${macaroonBase64}", invoice="${invoiceId}", amount="${options.priceXLM}", destination="${options.destinationAddress}"`
  );

  return response;
}
