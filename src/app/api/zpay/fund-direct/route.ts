import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import * as StellarSdk from '@stellar/stellar-sdk';
import { horizonServer, NETWORK_PASSPHRASE } from '@/lib/stellar';

export async function POST(req: Request) {
  try {
    const { stellarAddress, utr, amount } = await req.json();

    if (!stellarAddress || !utr || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (utr.length < 10) {
      return NextResponse.json({ error: 'Invalid UTR format. Must be at least 10 digits.' }, { status: 400 });
    }

    // In a real app, verify UTR with Razorpay/Cashfree APIs here.
    // We will simulate verification logic.

    const platformSecret = process.env.PLATFORM_SECRET_KEY;
    if (!platformSecret) {
      console.error('PLATFORM_SECRET_KEY is missing in env');
      return NextResponse.json({ error: 'Platform funding is currently unavailable' }, { status: 503 });
    }

    // ACID Database Constraint: Lock UTR to prevent double-spending
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stellar_address', stellarAddress)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Wallet profile not found.' }, { status: 404 });
    }

    const { error: dbErr } = await supabaseAdmin
      .from('deposits')
      .insert({
        user_id: profile.id,
        utr: utr,
        amount: amount,
        status: 'pending'
      });

    if (dbErr) {
      if (dbErr.code === '23505') { // Postgres Unique Violation code
        return NextResponse.json({ error: 'This UTR has already been processed.' }, { status: 400 });
      }
      console.error('Deposit insert error', dbErr);
      return NextResponse.json({ error: 'Transaction lock failed.' }, { status: 500 });
    }

    // 1. Fetch real-time XLM to INR rate from CoinGecko
    let xlmAmount = 12.0; // Fallback
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=inr');
      const data = await res.json();
      if (data?.stellar?.inr) {
        // Calculate how many XLM for the requested INR. Floor it to 1 decimal place to be safe with fees.
        const rate = data.stellar.inr;
        xlmAmount = Math.floor((amount / rate) * 10) / 10;
      }
    } catch (e) {
      console.error('Failed to fetch CoinGecko rate', e);
    }

    // 2. Prepare Stellar Transaction
    const sourceKeypair = StellarSdk.Keypair.fromSecret(platformSecret);
    const sourceAccount = await horizonServer.loadAccount(sourceKeypair.publicKey());

    // Check if the destination account already exists
    let accountExists = true;
    try {
      await horizonServer.loadAccount(stellarAddress);
    } catch (err: any) {
      if (err.response?.status === 404) {
        accountExists = false;
      } else {
        throw err;
      }
    }

    const operation = accountExists
      ? StellarSdk.Operation.payment({
          destination: stellarAddress,
          asset: StellarSdk.Asset.native(),
          amount: xlmAmount.toString(),
        })
      : StellarSdk.Operation.createAccount({
          destination: stellarAddress,
          startingBalance: xlmAmount.toString(),
        });

    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30);

    // Memo to mark it as ZPay Direct
    txBuilder.addMemo(StellarSdk.Memo.text(`ZPay Direct: ${utr.substring(0, 10)}`));

    const transaction = txBuilder.build();
    transaction.sign(sourceKeypair);

    // 3. Submit to Stellar Network
    const result = await horizonServer.submitTransaction(transaction);

    // 4. Complete the ACID transaction
    await supabaseAdmin
      .from('deposits')
      .update({ status: 'completed' })
      .eq('utr', utr);

    return NextResponse.json({
      success: true,
      fundedAmount: xlmAmount.toString(),
      txHash: result.hash
    });

  } catch (error: any) {
    console.error('ZPay Direct Funding Error:', error?.response?.data || error);
    return NextResponse.json(
      { error: 'Failed to process funding. Please contact support.' },
      { status: 500 }
    );
  }
}
