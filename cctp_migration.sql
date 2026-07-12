-- ────────────────────────────────────────────────────────────
-- CCTP & STELLAR DEPOSITS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stellar_deposits (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  tx_hash             TEXT        UNIQUE NOT NULL,
  amount              NUMERIC(20, 7) NOT NULL,
  asset               TEXT        NOT NULL,
  from_address        TEXT,
  deposit_type        TEXT        DEFAULT 'direct',
  source_chain        TEXT,
  source_tx_hash      TEXT,
  bridge_status       TEXT        DEFAULT 'completed',
  cctp_message_hash   TEXT,
  bridge_tx_hash      TEXT,
  credited            BOOLEAN     DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stellar_deposits_user_idx ON stellar_deposits(user_id);
CREATE INDEX IF NOT EXISTS stellar_deposits_tx_hash_idx ON stellar_deposits(tx_hash);

ALTER TABLE stellar_deposits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own deposits" ON stellar_deposits;
CREATE POLICY "Users can view own deposits"
  ON stellar_deposits FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS cctp_deposit_intents (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        REFERENCES profiles(id) ON DELETE CASCADE,
  stellar_address     TEXT        NOT NULL,
  source_chain        TEXT        NOT NULL,
  status              TEXT        DEFAULT 'pending',
  amount_usdc         NUMERIC(20, 7),
  source_tx_hash      TEXT,
  cctp_message_hash   TEXT,
  stellar_deposit_id  UUID        REFERENCES stellar_deposits(id) ON DELETE SET NULL,
  error_message       TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cctp_deposit_intents_user_idx ON cctp_deposit_intents(user_id);

ALTER TABLE cctp_deposit_intents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own intents" ON cctp_deposit_intents;
CREATE POLICY "Users can view own intents"
  ON cctp_deposit_intents FOR SELECT
  USING (auth.uid() = user_id);
