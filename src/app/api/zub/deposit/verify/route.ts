import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { creditDeposit } from '@/lib/zub/ledger';
import { ethers } from 'ethers';
import { ZUB_TREASURY_ADDRESS, EVM_NETWORKS, ERC20_ABI } from '@/lib/zub/web3';
import type { ZubChain } from '@/lib/zub/types';

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { chain: string; tx_hash: string; expected_amount: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { chain, tx_hash, expected_amount } = body;

  if (!chain || !tx_hash || !expected_amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const networkConfig = EVM_NETWORKS[chain];
  if (!networkConfig) {
    return NextResponse.json({ error: 'Unsupported network' }, { status: 400 });
  }

  try {
    // 1. Check if tx_hash already exists to prevent replay attacks
    const { data: existingTx } = await supabaseAdmin
      .from('zub_balance_events')
      .select('event_id')
      .eq('tx_hash', tx_hash)
      .maybeSingle();

    if (existingTx) {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
    }

    // 2. Connect to RPC and fetch transaction receipt
    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    
    // Wait for the transaction to be mined (just in case)
    let receipt = await provider.getTransactionReceipt(tx_hash);
    if (!receipt) {
      // Give it a moment to confirm if it just broadcasted
      await provider.waitForTransaction(tx_hash, 1, 10000); // wait up to 10s
      receipt = await provider.getTransactionReceipt(tx_hash);
    }

    if (!receipt) {
      return NextResponse.json({ error: 'Transaction not found on chain' }, { status: 404 });
    }

    if (receipt.status !== 1) {
      return NextResponse.json({ error: 'Transaction failed on chain' }, { status: 400 });
    }

    // 3. Verify the Transfer event
    const iface = new ethers.Interface(ERC20_ABI);
    let validTransferFound = false;
    let actualAmountStr = '0';

    for (const log of receipt.logs) {
      // Must be from the correct USDC contract
      if (log.address.toLowerCase() !== networkConfig.usdcAddress.toLowerCase()) {
        continue;
      }

      try {
        const parsedLog = iface.parseLog({
          topics: log.topics as string[],
          data: log.data
        });

        if (parsedLog && parsedLog.name === 'Transfer') {
          const [from, to, value] = parsedLog.args;
          
          if (to.toLowerCase() === ZUB_TREASURY_ADDRESS.toLowerCase()) {
            validTransferFound = true;
            // value is a BigInt for USDC (6 decimals)
            // Convert to regular float USDC amount
            const actualAmount = Number(ethers.formatUnits(value, networkConfig.decimals));
            actualAmountStr = actualAmount.toString();
            
            // Allow slight precision differences just in case, but must be basically equal
            if (Math.abs(actualAmount - expected_amount) > 0.001) {
              return NextResponse.json({ 
                error: `Amount mismatch. Expected ${expected_amount}, but received ${actualAmount}` 
              }, { status: 400 });
            }
            break; // Found the matching transfer
          }
        }
      } catch (e) {
        // Log may not match the ABI, safe to ignore and continue
        continue;
      }
    }

    if (!validTransferFound) {
      return NextResponse.json({ error: 'No valid USDC transfer to Treasury found in this transaction' }, { status: 400 });
    }

    // 4. Fetch the user's universal ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('universal_id')
      .eq('id', user.id)
      .single();

    if (!profile?.universal_id) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // 5. Credit the ledger
    const result = await creditDeposit({
      userId: user.id,
      universalId: profile.universal_id,
      chain: chain as ZubChain,
      amount_usdc: expected_amount,
      tx_hash
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, event_id: result.event_id });

  } catch (error: any) {
    console.error('[Verify Deposit Error]', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
