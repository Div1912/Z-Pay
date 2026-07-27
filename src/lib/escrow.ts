import * as StellarSdk from '@stellar/stellar-sdk';
import { NETWORK_PASSPHRASE, server, PLATFORM_MERCHANT_WALLET } from './stellar';

const CONTRACT_ID       = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || process.env.ESCROW_CONTRACT_ID || 'CDQBFXZXYW5ZEXDFB2HR7M3HBDYFF6WY46SHPTQBHHC6JMIOKTAOTYX2';
const TOKEN_CONTRACT_ID = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ID  || process.env.TOKEN_CONTRACT_ID  || 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// Arbiter / platform wallet — used as the dispute arbiter for all escrows
// Points to PLATFORM_MERCHANT_WALLET so only the platform admin can resolve disputes
const ARBITER_ADDRESS = process.env.NEXT_PUBLIC_PLATFORM_MERCHANT_WALLET || PLATFORM_MERCHANT_WALLET;

export type EscrowStatus = 'Funded' | 'Delivered' | 'Released' | 'Disputed' | 'Refunded';

export interface EscrowData {
  client:     string;
  freelancer: string;
  token:      string;
  amount:     bigint;
  funded:     boolean;
  delivered:  boolean;
  released:   boolean;
  disputed:   boolean;
  cancelled:  boolean;
  status:     EscrowStatus;
}

// ─── helpers ────────────────────────────────────────────────────────────────

async function signAndSubmitTransaction(
  transaction: StellarSdk.Transaction,
  keypair: StellarSdk.Keypair
): Promise<{ hash: string; result?: StellarSdk.xdr.ScVal }> {
  transaction.sign(keypair);

  const sendRes = await server.sendTransaction(transaction);

  if (sendRes.status === 'ERROR') {
    const errXdr = sendRes.errorResult?.toXDR('base64') ?? 'unknown';
    throw new Error(`Transaction submission failed: ${errXdr}`);
  }

  // Poll until ledger confirms
  let getRes = await server.getTransaction(sendRes.hash);
  let attempts = 0;
  while (getRes.status === 'NOT_FOUND' && attempts < 30) {
    await new Promise(r => setTimeout(r, 1000));
    getRes = await server.getTransaction(sendRes.hash);
    attempts++;
  }

  if (getRes.status !== 'SUCCESS') {
    throw new Error(`Transaction failed on-chain: ${getRes.status}`);
  }

  return { hash: sendRes.hash, result: getRes.returnValue };
}

// Build a single-operation Soroban transaction, simulate it, and return the
// prepared transaction ready for signing.
async function buildAndPrepare(
  sourcePublicKey: string,
  method: string,
  args: StellarSdk.xdr.ScVal[]
): Promise<StellarSdk.Transaction> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account  = await server.getAccount(sourcePublicKey);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .setTimeout(60)
    .addOperation(contract.call(method, ...args))
    .build();

  return (await server.prepareTransaction(tx)) as StellarSdk.Transaction;
}

// ─── public API ─────────────────────────────────────────────────────────────

/**
 * createEscrow
 * Matches the Rust contract signature:
 *   create(env, escrow_id: String, client: Address, freelancer: Address,
 *          amount: i128, token_id: Address, arbiter: Address)
 * Then immediately calls fund(env, escrow_id: String).
 *
 * Both operations are sent as separate transactions so that the contract
 * can validate the funded flag between them.
 */
export async function createEscrow(
  buyerSecret:    string,
  buyerAddress:   string,
  sellerAddress:  string,
  amount:         bigint,
  // deadlineLedger kept in signature for API route compatibility but unused on-chain
  _deadlineLedger?: bigint
): Promise<{ txHash: string; escrowId: string }> {
  const keypair   = StellarSdk.Keypair.fromSecret(buyerSecret);
  const escrowId  = `escrow-${Date.now()}`;
  const contract  = new StellarSdk.Contract(CONTRACT_ID);
  const account   = await server.getAccount(buyerAddress);

  // ── Step 1: create ──────────────────────────────────────────────────────
  // Args must match Rust exactly (env is implicit, not passed from SDK):
  //   escrow_id: String, client: Address, freelancer: Address,
  //   amount: i128, token_id: Address, arbiter: Address
  const createTx = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .setTimeout(60)
    .addOperation(
      contract.call(
        'create',
        StellarSdk.nativeToScVal(escrowId, { type: 'string' }),
        new StellarSdk.Address(buyerAddress).toScVal(),
        new StellarSdk.Address(sellerAddress).toScVal(),
        StellarSdk.nativeToScVal(amount, { type: 'i128' }),
        new StellarSdk.Address(TOKEN_CONTRACT_ID).toScVal(),
        new StellarSdk.Address(ARBITER_ADDRESS).toScVal(),
      )
    )
    .build();

  const preparedCreate = (await server.prepareTransaction(createTx)) as StellarSdk.Transaction;
  await signAndSubmitTransaction(preparedCreate, keypair);

  // ── Step 2: fund ────────────────────────────────────────────────────────
  // Refresh sequence number before next tx
  const accountRefreshed = await server.getAccount(buyerAddress);
  const fundTx = new StellarSdk.TransactionBuilder(accountRefreshed, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .setTimeout(60)
    .addOperation(
      contract.call(
        'fund',
        StellarSdk.nativeToScVal(escrowId, { type: 'string' }),
      )
    )
    .build();

  const preparedFund = (await server.prepareTransaction(fundTx)) as StellarSdk.Transaction;
  const { hash } = await signAndSubmitTransaction(preparedFund, keypair);

  return { txHash: hash, escrowId };
}

/**
 * deliverEscrow
 * Rust: deliver(env, escrow_id: String)
 * Called by the freelancer to mark work as delivered.
 */
export async function deliverEscrow(escrowId: string | number, sellerSecret: string): Promise<string> {
  const keypair       = StellarSdk.Keypair.fromSecret(sellerSecret);
  const sellerAddress = keypair.publicKey();
  const id            = String(escrowId);

  const tx = await buildAndPrepare(sellerAddress, 'deliver', [
    StellarSdk.nativeToScVal(id, { type: 'string' }),
  ]);
  const { hash } = await signAndSubmitTransaction(tx, keypair);
  return hash;
}

/**
 * releaseEscrow
 * Rust: release_funds(env, escrow_id: String)
 * Called by the client to release payment to the freelancer.
 */
export async function releaseEscrow(escrowId: string | number, buyerSecret: string): Promise<string> {
  const keypair      = StellarSdk.Keypair.fromSecret(buyerSecret);
  const buyerAddress = keypair.publicKey();
  const id           = String(escrowId);

  const tx = await buildAndPrepare(buyerAddress, 'release_funds', [
    StellarSdk.nativeToScVal(id, { type: 'string' }),
  ]);
  const { hash } = await signAndSubmitTransaction(tx, keypair);
  return hash;
}

/**
 * disputeEscrow
 * Rust: dispute(env, escrow_id: String, caller: Address)
 * Either party can raise a dispute; caller address is required by the contract.
 */
export async function disputeEscrow(escrowId: string | number, callerSecret: string): Promise<string> {
  const keypair       = StellarSdk.Keypair.fromSecret(callerSecret);
  const callerAddress = keypair.publicKey();
  const id            = String(escrowId);

  const tx = await buildAndPrepare(callerAddress, 'dispute', [
    StellarSdk.nativeToScVal(id, { type: 'string' }),
    new StellarSdk.Address(callerAddress).toScVal(),
  ]);
  const { hash } = await signAndSubmitTransaction(tx, keypair);
  return hash;
}

/**
 * refundEscrow
 * Rust: cancel_escrow(env, escrow_id: String)
 * Cancels escrow and, if funded, returns tokens to the client.
 */
export async function refundEscrow(escrowId: string | number, buyerSecret: string): Promise<string> {
  const keypair      = StellarSdk.Keypair.fromSecret(buyerSecret);
  const buyerAddress = keypair.publicKey();
  const id           = String(escrowId);

  const tx = await buildAndPrepare(buyerAddress, 'cancel_escrow', [
    StellarSdk.nativeToScVal(id, { type: 'string' }),
  ]);
  const { hash } = await signAndSubmitTransaction(tx, keypair);
  return hash;
}

/**
 * resolveEscrow
 * Rust: resolve(env, escrow_id: String, pay_freelancer: bool)
 * Called by the arbiter (platform admin) to settle a disputed escrow.
 */
export async function resolveEscrow(
  escrowId:      string | number,
  arbiterSecret: string,
  payFreelancer: boolean
): Promise<string> {
  const keypair        = StellarSdk.Keypair.fromSecret(arbiterSecret);
  const arbiterAddress = keypair.publicKey();
  const id             = String(escrowId);

  const tx = await buildAndPrepare(arbiterAddress, 'resolve', [
    StellarSdk.nativeToScVal(id,            { type: 'string' }),
    StellarSdk.nativeToScVal(payFreelancer, { type: 'bool'   }),
  ]);
  const { hash } = await signAndSubmitTransaction(tx, keypair);
  return hash;
}

/**
 * getEscrow
 * Rust: get_escrow(env, escrow_id: String) -> Escrow
 * Returns the on-chain state of an escrow as EscrowData.
 */
export async function getEscrow(escrowId: string | number): Promise<EscrowData | null> {
  try {
    const id             = String(escrowId);
    const contract       = new StellarSdk.Contract(CONTRACT_ID);
    const sourceAccount  = await server.getAccount(PLATFORM_MERCHANT_WALLET);

    const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .setTimeout(30)
      .addOperation(
        contract.call(
          'get_escrow',
          StellarSdk.nativeToScVal(id, { type: 'string' }),
        )
      )
      .build();

    const simRes = await server.simulateTransaction(tx);

    if (!('result' in simRes) || !simRes.result) return null;

    // The Rust struct fields: escrow_id, client, freelancer, amount, token,
    // funded, delivered, released, disputed, cancelled, arbiter
    const raw = StellarSdk.scValToNative(simRes.result.retval) as Record<string, unknown>;

    // Derive a human-readable status from the boolean flags (priority order)
    let status: EscrowStatus = 'Funded';
    if (raw.cancelled)  status = 'Refunded';
    else if (raw.released)  status = 'Released';
    else if (raw.disputed)  status = 'Disputed';
    else if (raw.delivered) status = 'Delivered';
    else if (raw.funded)    status = 'Funded';

    return {
      client:     raw.client     as string,
      freelancer: raw.freelancer as string,
      token:      raw.token      as string,
      amount:     BigInt(raw.amount as string | number | bigint),
      funded:     raw.funded     as boolean,
      delivered:  raw.delivered  as boolean,
      released:   raw.released   as boolean,
      disputed:   raw.disputed   as boolean,
      cancelled:  raw.cancelled  as boolean,
      status,
    };
  } catch (e) {
    console.error('getEscrow error:', e);
    return null;
  }
}

// ─── utility helpers (unchanged) ────────────────────────────────────────────

export async function getCurrentLedger(): Promise<number> {
  try {
    const health = await server.getHealth();
    return health.latestLedger || 0;
  } catch {
    return 0;
  }
}

export function calculateDeadlineLedger(daysFromNow: number): bigint {
  const ledgersPerDay = 17280;
  return BigInt(Math.floor(daysFromNow * ledgersPerDay));
}

/**
 * transferExpoToken
 * Direct SEP-41 token transfer — used by the admin resolve route when
 * siding with the freelancer (refund escrow → payer, then forward → freelancer).
 */
export async function transferExpoToken(
  fromSecret:    string,
  toAddress:     string,
  amountStroops: bigint
): Promise<string> {
  const keypair       = StellarSdk.Keypair.fromSecret(fromSecret);
  const fromAddress   = keypair.publicKey();
  const tokenContract = new StellarSdk.Contract(TOKEN_CONTRACT_ID);
  const account       = await server.getAccount(fromAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .setTimeout(60)
    .addOperation(
      tokenContract.call(
        'transfer',
        new StellarSdk.Address(fromAddress).toScVal(),
        new StellarSdk.Address(toAddress).toScVal(),
        StellarSdk.nativeToScVal(amountStroops, { type: 'i128' }),
      )
    )
    .build();

  const prepared = (await server.prepareTransaction(tx)) as StellarSdk.Transaction;
  const { hash } = await signAndSubmitTransaction(prepared, keypair);
  return hash;
}
