/**
 * ZUB — TypeScript Types
 * Shared types for the Unified Balance system.
 */

export type ZubChain = 'stellar' | 'base' | 'ethereum';

export type ZubEventType =
  | 'deposit'
  | 'spend'
  | 'reconciliation_credit'
  | 'reconciliation_debit';

export type ZubIntentStatus = 'pending' | 'released' | 'failed' | 'expired';

export type ZubObligationStatus =
  | 'pending'
  | 'batched'
  | 'cctp_burn_submitted'
  | 'cctp_attested'
  | 'settled'
  | 'failed';

// ── DB Row Types ──────────────────────────────────────────────

export interface ZubBalanceEvent {
  event_id: string;
  user_id: string;
  universal_id: string;
  delta: number;
  chain: ZubChain;
  event_type: ZubEventType;
  tx_hash: string | null;
  intent_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ZubSpendIntent {
  intent_id: string;
  user_id: string;
  universal_id: string;
  amount_usdc: number;
  destination_chain: ZubChain;
  recipient: string;
  memo: string | null;
  status: ZubIntentStatus;
  release_authorization: ReleaseAuthorization | null;
  tx_hash: string | null;
  error_message: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface ZubReconciliationObligation {
  obligation_id: string;
  deficit_chain: ZubChain;
  surplus_chain: ZubChain;
  amount_usdc: number;
  status: ZubObligationStatus;
  batch_id: string | null;
  cctp_message_hash: string | null;
  intent_id: string | null;
  error_message: string | null;
  created_at: string;
  settled_at: string | null;
}

export interface ZubVaultConfig {
  chain: ZubChain;
  enabled: boolean;
  reserve_usdc: number;
  target_reserve_usdc: number;
  low_reserve_threshold: number;
  updated_at: string;
}

// ── Service Types ─────────────────────────────────────────────

export interface UnifiedBalance {
  total_usdc: number;
  per_chain: {
    stellar: number;
    base: number;
    ethereum: number;
  };
  last_event_at: string | null;
}

export interface ReleaseAuthorization {
  intent_id: string;
  user_id: string;
  amount_usdc: number;
  destination_chain: ZubChain;
  recipient: string;
  expires_at: string;
  issued_at: string;
  signature: string; // HMAC-SHA256 of the above fields
}

export interface SpendIntentRequest {
  userId: string;
  universalId: string;
  amount_usdc: number;
  destination_chain: ZubChain;
  recipient: string;
  memo?: string;
}

export interface SpendIntentResult {
  intent_id: string;
  status: ZubIntentStatus;
  release_authorization?: ReleaseAuthorization;
  error?: string;
}

export interface SolvencyCheck {
  solvent: boolean;
  total_ledger_usdc: number;
  total_vault_reserve_usdc: number;
  deficit_usdc: number; // 0 if solvent
}
