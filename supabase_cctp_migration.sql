-- ============================================================
-- Z-Pay – CCTP Migration
-- cctp_deposit_intents table + stellar_deposits upgrades
-- Run AFTER supabase_deposit_stream_migration.sql
-- ============================================================

-- ── 1. Upgrade stellar_deposits with CCTP columns ────────────
ALTER TABLE stellar_deposits ADD COLUMN IF NOT EXISTS deposit_type TEXT NOT NULL DEFAULT 'stellar_native';
-- Values: 'stellar_native' | 'cctp_usdc' | 'cctp_usdc_pending'

ALTER TABLE stellar_deposits ADD COLUMN IF NOT EXISTS source_chain     TEXT;    -- 'base','ethereum','avalanche'
ALTER TABLE stellar_deposits ADD COLUMN IF NOT EXISTS source_tx_hash   TEXT;    -- source chain tx hash
ALTER TABLE stellar_deposits ADD COLUMN IF NOT EXISTS bridge_status    TEXT;    -- 'pending','attested','completed','failed'
ALTER TABLE stellar_deposits ADD COLUMN IF NOT EXISTS cctp_message_hash TEXT;   -- Circle message hash for polling
ALTER TABLE stellar_deposits ADD COLUMN IF NOT EXISTS bridge_tx_hash   TEXT;    -- Stellar completion tx hash

-- ── 2. CCTP Deposit Intents ──────────────────────────────────
-- Records a user's intent to bridge USDC. The webhook polls these.
CREATE TABLE IF NOT EXISTS cctp_deposit_intents (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stellar_address   TEXT        NOT NULL,
  source_chain      TEXT        NOT NULL,   -- 'base','ethereum'
  source_tx_hash    TEXT,                   -- filled after user broadcasts tx
  cctp_message_hash TEXT,                   -- Circle attestation message hash
  amount_usdc       NUMERIC(20, 6),
  status            TEXT        NOT NULL DEFAULT 'pending',
  -- 'pending' → 'submitted' → 'attested' → 'completed' | 'failed'
  error_message     TEXT,
  stellar_deposit_id UUID       REFERENCES stellar_deposits(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cctp_intents_user_idx    ON cctp_deposit_intents(user_id);
CREATE INDEX IF NOT EXISTS cctp_intents_status_idx  ON cctp_deposit_intents(status);
CREATE INDEX IF NOT EXISTS cctp_intents_msg_idx     ON cctp_deposit_intents(cctp_message_hash) WHERE cctp_message_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS cctp_intents_time_idx    ON cctp_deposit_intents(created_at DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS cctp_intents_updated_at ON cctp_deposit_intents;
CREATE TRIGGER cctp_intents_updated_at
  BEFORE UPDATE ON cctp_deposit_intents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: users see only their own intents
ALTER TABLE cctp_deposit_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own CCTP intents" ON cctp_deposit_intents;
CREATE POLICY "Users can view own CCTP intents"
  ON cctp_deposit_intents FOR SELECT
  USING (auth.uid() = user_id);

-- ── 3. Platform CCTP config helper ───────────────────────────
-- Stores per-chain receiver addresses (set by admin, read by API)
CREATE TABLE IF NOT EXISTS cctp_platform_config (
  chain         TEXT    PRIMARY KEY,   -- 'base','ethereum'
  domain        INT     NOT NULL,      -- Circle domain ID
  receiver_address TEXT NOT NULL,      -- Platform EVM wallet that receives USDC
  min_usdc      NUMERIC(20, 6) NOT NULL DEFAULT 1.0,
  max_usdc      NUMERIC(20, 6) NOT NULL DEFAULT 10000.0,
  enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default chains (update receiver_address with your actual platform wallet)
INSERT INTO cctp_platform_config (chain, domain, receiver_address, min_usdc, max_usdc) VALUES
  ('base',     6, '0x0000000000000000000000000000000000000000', 1.0, 10000.0),
  ('ethereum', 0, '0x0000000000000000000000000000000000000000', 5.0, 50000.0)
ON CONFLICT (chain) DO NOTHING;

-- ============================================================
-- ROLLBACK:
--   DROP TABLE IF EXISTS cctp_platform_config;
--   DROP TABLE IF EXISTS cctp_deposit_intents;
--   -- Columns added to stellar_deposits cannot be easily removed;
--   -- ALTER TABLE stellar_deposits DROP COLUMN IF EXISTS deposit_type; etc.
-- ============================================================
