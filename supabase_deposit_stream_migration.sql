-- ============================================================
-- Z-Pay – Stellar Deposit Stream Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Table to store auto-detected on-chain deposits
CREATE TABLE IF NOT EXISTS stellar_deposits (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tx_hash       TEXT        NOT NULL UNIQUE,
  amount        NUMERIC(20, 7) NOT NULL,
  asset         TEXT        NOT NULL DEFAULT 'XLM',
  from_address  TEXT,
  detected_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  credited      BOOLEAN     NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX IF NOT EXISTS stellar_deposits_user_idx     ON stellar_deposits(user_id);
CREATE INDEX IF NOT EXISTS stellar_deposits_detected_idx ON stellar_deposits(detected_at DESC);
CREATE INDEX IF NOT EXISTS stellar_deposits_tx_hash_idx  ON stellar_deposits(tx_hash);

-- RLS: users can only see their own deposits
ALTER TABLE stellar_deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own deposits" ON stellar_deposits;
CREATE POLICY "Users can view own deposits"
  ON stellar_deposits FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- ROLLBACK:
--   DROP TABLE IF EXISTS stellar_deposits;
-- ============================================================
