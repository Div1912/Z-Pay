-- ============================================================
-- ZPay Unified Balance (ZUB) — Supabase Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Safe to run on top of existing schema — uses IF NOT EXISTS
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. UNIFIED BALANCE EVENTS (append-only event ledger)
--    Source of truth. Never update rows — only INSERT.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zub_balance_events (
  event_id        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  universal_id    TEXT         NOT NULL,
  delta           NUMERIC(20, 6) NOT NULL,  -- positive=credit, negative=debit
  chain           TEXT         NOT NULL CHECK (chain IN ('stellar', 'base', 'ethereum')),
  event_type      TEXT         NOT NULL CHECK (event_type IN ('deposit', 'spend', 'reconciliation_credit', 'reconciliation_debit')),
  tx_hash         TEXT,
  intent_id       UUID,        -- FK to zub_spend_intents (nullable for deposits)
  metadata        JSONB        DEFAULT '{}',
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS zub_events_user_idx      ON zub_balance_events(user_id);
CREATE INDEX IF NOT EXISTS zub_events_chain_idx     ON zub_balance_events(chain);
CREATE INDEX IF NOT EXISTS zub_events_type_idx      ON zub_balance_events(event_type);
CREATE INDEX IF NOT EXISTS zub_events_created_idx   ON zub_balance_events(created_at DESC);
CREATE INDEX IF NOT EXISTS zub_events_universal_idx ON zub_balance_events(universal_id);

-- RLS: users see only their own events
ALTER TABLE zub_balance_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ZUB events" ON zub_balance_events;
CREATE POLICY "Users can view own ZUB events"
  ON zub_balance_events FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert (used by backend)
DROP POLICY IF EXISTS "Service role can insert ZUB events" ON zub_balance_events;
CREATE POLICY "Service role can insert ZUB events"
  ON zub_balance_events FOR INSERT
  TO service_role
  WITH CHECK (true);


-- ────────────────────────────────────────────────────────────
-- 2. SPEND INTENTS
--    Records a user's intent to spend from their unified balance.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zub_spend_intents (
  intent_id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  universal_id        TEXT         NOT NULL,
  amount_usdc         NUMERIC(20, 6) NOT NULL,
  destination_chain   TEXT         NOT NULL CHECK (destination_chain IN ('stellar', 'base', 'ethereum')),
  recipient           TEXT         NOT NULL,
  memo                TEXT,
  status              TEXT         NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'released', 'failed', 'expired')),
  release_authorization JSONB,     -- signed auth payload sent to vault
  tx_hash             TEXT,        -- settlement tx hash (filled on release)
  error_message       TEXT,
  expires_at          TIMESTAMPTZ  NOT NULL,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS zub_intents_user_idx    ON zub_spend_intents(user_id);
CREATE INDEX IF NOT EXISTS zub_intents_status_idx  ON zub_spend_intents(status);
CREATE INDEX IF NOT EXISTS zub_intents_created_idx ON zub_spend_intents(created_at DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS zub_intents_updated_at ON zub_spend_intents;
CREATE TRIGGER zub_intents_updated_at
  BEFORE UPDATE ON zub_spend_intents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE zub_spend_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ZUB intents" ON zub_spend_intents;
CREATE POLICY "Users can view own ZUB intents"
  ON zub_spend_intents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage ZUB intents" ON zub_spend_intents;
CREATE POLICY "Service role can manage ZUB intents"
  ON zub_spend_intents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ────────────────────────────────────────────────────────────
-- 3. RECONCILIATION OBLIGATIONS
--    Tracks backfill obligations created when a vault releases
--    from reserve and needs CCTP to rebalance.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zub_reconciliation_obligations (
  obligation_id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  deficit_chain       TEXT         NOT NULL CHECK (deficit_chain IN ('stellar', 'base', 'ethereum')),
  surplus_chain       TEXT         NOT NULL CHECK (surplus_chain IN ('stellar', 'base', 'ethereum')),
  amount_usdc         NUMERIC(20, 6) NOT NULL,
  status              TEXT         NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'batched', 'cctp_burn_submitted', 'cctp_attested', 'settled', 'failed')),
  batch_id            UUID,
  cctp_message_hash   TEXT,
  intent_id           UUID         REFERENCES zub_spend_intents(intent_id),
  error_message       TEXT,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  settled_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS zub_obligations_status_idx  ON zub_reconciliation_obligations(status);
CREATE INDEX IF NOT EXISTS zub_obligations_created_idx ON zub_reconciliation_obligations(created_at DESC);
CREATE INDEX IF NOT EXISTS zub_obligations_batch_idx   ON zub_reconciliation_obligations(batch_id) WHERE batch_id IS NOT NULL;

-- RLS: service role only (internal use)
ALTER TABLE zub_reconciliation_obligations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage ZUB obligations" ON zub_reconciliation_obligations;
CREATE POLICY "Service role can manage ZUB obligations"
  ON zub_reconciliation_obligations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ────────────────────────────────────────────────────────────
-- 4. VAULT RESERVE CONFIG (Phase 0: static config)
--    One row per chain — tracks virtual reserve levels.
--    Phase 1: replace with dynamic forecast-driven targets.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zub_vault_config (
  chain               TEXT         PRIMARY KEY CHECK (chain IN ('stellar', 'base', 'ethereum')),
  enabled             BOOLEAN      NOT NULL DEFAULT TRUE,
  reserve_usdc        NUMERIC(20, 6) NOT NULL DEFAULT 0,  -- current virtual reserve balance
  target_reserve_usdc NUMERIC(20, 6) NOT NULL DEFAULT 1000,
  low_reserve_threshold NUMERIC(20, 6) NOT NULL DEFAULT 300,  -- trigger reconciliation below this
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Seed chains
INSERT INTO zub_vault_config (chain, enabled, reserve_usdc, target_reserve_usdc, low_reserve_threshold) VALUES
  ('stellar',  true, 0, 1000, 300),
  ('base',     true, 0, 1000, 300),
  ('ethereum', false, 0, 2000, 600)  -- disabled in Phase 0
ON CONFLICT (chain) DO NOTHING;

-- RLS: service role only
ALTER TABLE zub_vault_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage ZUB vault config" ON zub_vault_config;
CREATE POLICY "Service role can manage ZUB vault config"
  ON zub_vault_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read vault config
DROP POLICY IF EXISTS "Admins can read ZUB vault config" ON zub_vault_config;
CREATE POLICY "Admins can read ZUB vault config"
  ON zub_vault_config FOR SELECT
  USING (true);


-- ────────────────────────────────────────────────────────────
-- 5. MATERIALIZED BALANCE VIEW (derived, for fast reads)
--    Aggregates event log into per-user, per-chain balances.
--    Refresh: called by the reconciliation cron job.
-- ────────────────────────────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS zub_balances AS
  SELECT
    user_id,
    universal_id,
    chain,
    COALESCE(SUM(delta), 0)::NUMERIC(20, 6) AS balance_usdc,
    MAX(created_at) AS last_event_at
  FROM zub_balance_events
  GROUP BY user_id, universal_id, chain
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS zub_balances_user_chain_idx ON zub_balances(user_id, chain);

-- ============================================================
-- ROLLBACK (if needed):
--   DROP MATERIALIZED VIEW IF EXISTS zub_balances;
--   DROP TABLE IF EXISTS zub_vault_config;
--   DROP TABLE IF EXISTS zub_reconciliation_obligations;
--   DROP TABLE IF EXISTS zub_spend_intents;
--   DROP TABLE IF EXISTS zub_balance_events;
-- ============================================================
