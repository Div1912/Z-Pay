-- ============================================================
-- Zpay X402 Feature — Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS x402_payments (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id         UUID        REFERENCES profiles(id) ON DELETE CASCADE,
  invoice_id          TEXT        UNIQUE NOT NULL,
  amount              NUMERIC(20, 7) NOT NULL,
  fee                 NUMERIC(20, 7) NOT NULL,
  tx_hash             TEXT        NOT NULL,
  endpoint            TEXT        NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS x402_merchant_idx ON x402_payments(merchant_id);
CREATE INDEX IF NOT EXISTS x402_created_idx ON x402_payments(created_at DESC);

ALTER TABLE x402_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Merchants can view own x402 payments" ON x402_payments;
CREATE POLICY "Merchants can view own x402 payments"
  ON x402_payments FOR SELECT
  USING (
    auth.uid() = merchant_id
  );
