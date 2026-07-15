-- ============================================================
-- Z-Pay – Stripe Fiat Onramp/Offramp Migration
-- tracking fiat transactions (buy/withdraw)
-- ============================================================

CREATE TABLE IF NOT EXISTS fiat_transactions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_session_id TEXT        NOT NULL UNIQUE, -- The Stripe Onramp or Offramp session ID
  type              TEXT        NOT NULL,        -- 'onramp' (buy crypto) or 'offramp' (withdraw fiat)
  status            TEXT        NOT NULL DEFAULT 'pending',
  -- status can be 'pending', 'fulfillment_processing', 'fulfilled', 'failed'
  fiat_amount       NUMERIC(20, 6),
  fiat_currency     TEXT,
  crypto_amount     NUMERIC(20, 6),
  crypto_currency   TEXT,
  wallet_address    TEXT,
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS fiat_tx_user_idx    ON fiat_transactions(user_id);
CREATE INDEX IF NOT EXISTS fiat_tx_status_idx  ON fiat_transactions(status);
CREATE INDEX IF NOT EXISTS fiat_tx_session_idx ON fiat_transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS fiat_tx_time_idx    ON fiat_transactions(created_at DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS fiat_transactions_updated_at ON fiat_transactions;
CREATE TRIGGER fiat_transactions_updated_at
  BEFORE UPDATE ON fiat_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: users see only their own fiat transactions
ALTER TABLE fiat_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own fiat transactions" ON fiat_transactions;
CREATE POLICY "Users can view own fiat transactions"
  ON fiat_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- ROLLBACK:
--   DROP TABLE IF EXISTS fiat_transactions;
-- ============================================================
