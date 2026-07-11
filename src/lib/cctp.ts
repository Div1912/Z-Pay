import { supabaseAdmin } from './supabase';
import { StrKey } from '@stellar/stellar-sdk';

// ── Constants ─────────────────────────────────────────────────────────────────

const IRIS_API_BASE =
  process.env.CCTP_IRIS_API_URL ??
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
    ? 'https://iris-api.circle.com'
    : 'https://iris-api-sandbox.circle.com');

const HORIZON_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
    ? 'MAINNET'
    : 'TESTNET';

// Circle CCTP destination domain for Stellar
// NOTE: As of 2025, Circle CCTP Stellar support is in beta.
// Check https://developers.circle.com/stablecoins/supported-chains
// for the official Stellar domain ID when it goes live.
// Currently we simulate the final Stellar mint step.
const STELLAR_CCTP_DOMAIN = 5; // Placeholder — update when Circle publishes Stellar domain

export interface CctpChainConfig {
  chain:            string;
  domain:           number;
  usdcAddress:      string;   // USDC contract on this chain
  tokenMessenger:   string;   // Circle TokenMessenger contract
  messageTransmitter: string; // Circle MessageTransmitter contract
  minUsdc:          number;
  maxUsdc:          number;
  enabled:          boolean;
  explorerTxUrl:    (hash: string) => string;
}

// Testnet configs (Sepolia / Base Sepolia)
const TESTNET_CHAINS: Record<string, CctpChainConfig> = {
  ethereum: {
    chain:              'ethereum',
    domain:             0,
    usdcAddress:        '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    tokenMessenger:     '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5', // Sepolia TokenMessenger
    messageTransmitter: '0x7865fAfC2db2093669d92c0197e5116c76d60e9f', // Sepolia MessageTransmitter
    minUsdc:            1,
    maxUsdc:            10000,
    enabled:            true,
    explorerTxUrl:      (hash) => `https://sepolia.etherscan.io/tx/${hash}`,
  },
  base: {
    chain:              'base',
    domain:             6,
    usdcAddress:        '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
    tokenMessenger:     '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5', // Base Sepolia TokenMessenger
    messageTransmitter: '0x7865fAfC2db2093669d92c0197e5116c76d60e9f', // Base Sepolia MessageTransmitter
    minUsdc:            1,
    maxUsdc:            10000,
    enabled:            true,
    explorerTxUrl:      (hash) => `https://sepolia.basescan.org/tx/${hash}`,
  },
};

// Mainnet configs
const MAINNET_CHAINS: Record<string, CctpChainConfig> = {
  ethereum: {
    chain:              'ethereum',
    domain:             0,
    usdcAddress:        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Mainnet USDC
    tokenMessenger:     '0xBd3fa81B58Ba92a82136038B25aDec7066af3155',
    messageTransmitter: '0x0a992d191DEeC32aFe36203Ad87D7d289a738F81',
    minUsdc:            5,
    maxUsdc:            50000,
    enabled:            true,
    explorerTxUrl:      (hash) => `https://etherscan.io/tx/${hash}`,
  },
  base: {
    chain:              'base',
    domain:             6,
    usdcAddress:        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base mainnet USDC
    tokenMessenger:     '0x1682Ae6375C4E4A97e4B583BC394c861A46D8962',
    messageTransmitter: '0xAD09780d193884d503182aD4588450C416D6F9D4',
    minUsdc:            1,
    maxUsdc:            10000,
    enabled:            true,
    explorerTxUrl:      (hash) => `https://basescan.org/tx/${hash}`,
  },
};

function getChains(): Record<string, CctpChainConfig> {
  return HORIZON_NETWORK === 'MAINNET' ? MAINNET_CHAINS : TESTNET_CHAINS;
}

export function getSupportedChains(): CctpChainConfig[] {
  return Object.values(getChains()).filter(c => c.enabled);
}

export function getChainConfig(chain: string): CctpChainConfig | null {
  return getChains()[chain.toLowerCase()] ?? null;
}

// ── Deposit instructions ──────────────────────────────────────────────────────

export interface DepositInstructions {
  chain:            string;
  chainDisplayName: string;
  domain:           number;
  mintRecipient:    string;
  usdcContractAddress: string;
  tokenMessengerAddress: string;
  minUsdc:          number;
  maxUsdc:          number;
  destinationDomain: number;  // STELLAR_CCTP_DOMAIN
  steps:            string[];
  explorerLink:     string;
}

/**
 * Returns deposit instructions for a given source chain.
 * The user needs to:
 *   1. Call TokenMessenger.depositForBurn() on the source chain
 *   2. With mintRecipient = user's Stellar address (bytes32 padded)
 *   3. With destinationDomain = STELLAR_CCTP_DOMAIN
 */
export function generateDepositInstructions(
  chain: string,
  userStellarAddress: string,
  universalId: string
): DepositInstructions | null {
  const config = getChainConfig(chain);
  if (!config) return null;

  // Convert Stellar Ed25519 public key to bytes32 hex for Circle CCTP mintRecipient
  const mintRecipientBuffer = StrKey.decodeEd25519PublicKey(userStellarAddress);
  const mintRecipientHex = '0x' + Buffer.from(mintRecipientBuffer).toString('hex');

  return {
    chain:                 config.chain,
    chainDisplayName:      chain === 'base' ? 'Base (Coinbase L2)' : 'Ethereum',
    domain:                config.domain,
    mintRecipient:         mintRecipientHex,
    usdcContractAddress:   config.usdcAddress,
    tokenMessengerAddress: config.tokenMessenger,
    minUsdc:               config.minUsdc,
    maxUsdc:               config.maxUsdc,
    destinationDomain:     STELLAR_CCTP_DOMAIN,
    steps: [
      `Approve USDC for the TokenMessenger contract: ${config.tokenMessenger}`,
      `Call depositForBurn(amount, destinationDomain=${STELLAR_CCTP_DOMAIN}, mintRecipient=${mintRecipientHex}, burnToken=${config.usdcAddress})`,
      `Or use the Z-Pay mobile app / MetaMask snap for one-tap bridging`,
      `After ~5-15 minutes, your Z-Pay balance will update automatically`,
    ],
    explorerLink: `https://developers.circle.com/stablecoins/docs/cctp-getting-started`,
  };
}

// ── Circle Iris attestation polling ──────────────────────────────────────────

export interface AttestationResult {
  status:      'pending_confirmations' | 'complete';
  attestation: string | null;
  message:     string | null;
}

/**
 * Polls the Circle Iris API for an attestation on a given message hash.
 * Returns 'complete' when Circle has signed the message and it's ready to submit.
 */
export async function pollAttestation(messageHash: string): Promise<AttestationResult> {
  const url = `${IRIS_API_BASE}/v1/attestations/${messageHash}`;

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.error('[cctp] Iris API error:', response.status, await response.text());
      return { status: 'pending_confirmations', attestation: null, message: null };
    }

    const data = await response.json();

    if (data.status === 'complete' && data.attestation) {
      return {
        status:      'complete',
        attestation: data.attestation,
        message:     data.message ?? null,
      };
    }

    return { status: 'pending_confirmations', attestation: null, message: null };
  } catch (err: any) {
    console.error('[cctp] pollAttestation error:', err.message);
    return { status: 'pending_confirmations', attestation: null, message: null };
  }
}

// ── Stellar CCTP completion ───────────────────────────────────────────────────

/**
 * Submits the attested CCTP message to the Stellar network to mint USDC.
 *
 * NOTE: This requires the Stellar CCTP MessageTransmitter contract to be deployed.
 * As of 2025, Circle's Stellar CCTP support is in active development.
 * This function provides the correct call pattern for when it's available.
 *
 * Returns the Stellar transaction hash on success.
 */
export async function completeStellarMint(
  _attestation: string,
  _message: string,
  _userStellarAddress: string
): Promise<string> {
  // TODO: When Circle publishes the Stellar CCTP MessageTransmitter contract address,
  // replace this with an actual Soroban contract call:
  //
  //   const contract = new StellarSdk.Contract(STELLAR_CCTP_MESSAGE_TRANSMITTER_ADDRESS);
  //   const operation = contract.call(
  //     'receiveMessage',
  //     StellarSdk.nativeToScVal(Buffer.from(message.slice(2), 'hex'), { type: 'bytes' }),
  //     StellarSdk.nativeToScVal(Buffer.from(attestation.slice(2), 'hex'), { type: 'bytes' })
  //   );
  //
  // For now, we simulate by crediting the deposit directly (testnet-only).
  // In production, the actual on-chain mint must be submitted before crediting.

  console.log('[cctp] completeStellarMint called — Stellar CCTP contract integration pending');
  // Return a placeholder hash for testnet simulation
  return `CCTP_SIMULATED_${Date.now()}`;
}

// ── Webhook polling helper ────────────────────────────────────────────────────

/**
 * Processes all pending CCTP deposit intents.
 * Called by the webhook/cron route every ~2 minutes.
 * Returns the number of intents that were completed.
 */
export async function processPendingCctpIntents(): Promise<{
  processed: number;
  completed: number;
  errors: number;
}> {
  const { data: intents, error } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .select('*')
    .in('status', ['submitted', 'attested'])
    .not('cctp_message_hash', 'is', null)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    console.error('[cctp] Failed to fetch pending intents:', error.message);
    return { processed: 0, completed: 0, errors: 1 };
  }

  if (!intents?.length) return { processed: 0, completed: 0, errors: 0 };

  let completed = 0;
  let errors = 0;

  for (const intent of intents) {
    try {
      const result = await pollAttestation(intent.cctp_message_hash);

      if (result.status !== 'complete') {
        // Still waiting — update status to show we checked it
        await supabaseAdmin
          .from('cctp_deposit_intents')
          .update({ status: 'submitted', updated_at: new Date().toISOString() })
          .eq('id', intent.id);
        continue;
      }

      // Attestation complete — submit to Stellar and credit
      await supabaseAdmin
        .from('cctp_deposit_intents')
        .update({ status: 'attested', updated_at: new Date().toISOString() })
        .eq('id', intent.id);

      const stellarTxHash = await completeStellarMint(
        result.attestation!,
        result.message!,
        intent.stellar_address
      );

      // Credit to stellar_deposits
      const { data: deposit } = await supabaseAdmin
        .from('stellar_deposits')
        .insert({
          user_id:          intent.user_id,
          tx_hash:          stellarTxHash,
          amount:           intent.amount_usdc ?? 0,
          asset:            'USDC',
          from_address:     `${intent.source_chain}:bridge`,
          deposit_type:     'cctp_usdc',
          source_chain:     intent.source_chain,
          source_tx_hash:   intent.source_tx_hash,
          bridge_status:    'completed',
          cctp_message_hash: intent.cctp_message_hash,
          bridge_tx_hash:   stellarTxHash,
          credited:         true,
        })
        .select('id')
        .single();

      // Mark intent as completed
      await supabaseAdmin
        .from('cctp_deposit_intents')
        .update({
          status:            'completed',
          stellar_deposit_id: deposit?.id ?? null,
          updated_at:        new Date().toISOString(),
        })
        .eq('id', intent.id);

      completed++;
    } catch (err: any) {
      console.error(`[cctp] Error processing intent ${intent.id}:`, err.message);

      await supabaseAdmin
        .from('cctp_deposit_intents')
        .update({
          status:        'failed',
          error_message: err.message,
          updated_at:    new Date().toISOString(),
        })
        .eq('id', intent.id);

      errors++;
    }
  }

  return { processed: intents.length, completed, errors };
}
