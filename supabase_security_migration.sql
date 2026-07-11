-- ============================================================
-- Z-Pay – Security Migration
-- pin_lockouts, admin_audit_log, security_alerts
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. PIN Lockouts ──────────────────────────────────────────
-- Tracks failed PIN attempts per user; enforces progressive lockouts.
CREATE TABLE IF NOT EXISTS pin_lockouts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  failed_attempts INT         NOT NULL DEFAULT 0,
  locked_until    TIMESTAMPTZ,            -- NULL = not locked
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pin_lockouts_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS pin_lockouts_user_idx ON pin_lockouts(user_id);
CREATE INDEX IF NOT EXISTS pin_lockouts_locked_idx ON pin_lockouts(locked_until) WHERE locked_until IS NOT NULL;

-- RLS: only service role can read/write
ALTER TABLE pin_lockouts ENABLE ROW LEVEL SECURITY;
-- No user-facing policies — always accessed via service role key

-- ── 2. Admin Audit Log ───────────────────────────────────────
-- Immutable log of every admin action.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT        NOT NULL,  -- e.g. 'resolve_dispute', 'view_logs', 'view_metrics'
  target_id   TEXT,                  -- contract_id, user_id, etc.
  target_type TEXT,                  -- 'contract', 'user', 'transaction'
  details     JSONB       DEFAULT '{}',
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_idx  ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_action_idx ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS admin_audit_log_time_idx   ON admin_audit_log(created_at DESC);

-- Immutable: disable update and delete via RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit log" ON admin_audit_log;
CREATE POLICY "Admins can view audit log"
  ON admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
-- No INSERT/UPDATE/DELETE policies for users — always via service role

-- ── 3. Security Alerts ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS security_alerts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  alert_type   TEXT        NOT NULL,  -- 'pin_brute_force', 'unusual_volume', 'admin_action', 'key_rotation'
  severity     TEXT        NOT NULL DEFAULT 'medium',  -- 'low','medium','high','critical'
  details      JSONB       DEFAULT '{}',
  resolved     BOOLEAN     NOT NULL DEFAULT FALSE,
  resolved_by  UUID        REFERENCES profiles(id),
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS security_alerts_user_idx     ON security_alerts(user_id);
CREATE INDEX IF NOT EXISTS security_alerts_type_idx     ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS security_alerts_resolved_idx ON security_alerts(resolved);
CREATE INDEX IF NOT EXISTS security_alerts_time_idx     ON security_alerts(created_at DESC);

ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage alerts" ON security_alerts;
CREATE POLICY "Admins can manage alerts"
  ON security_alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================
-- ROLLBACK:
--   DROP TABLE IF EXISTS security_alerts;
--   DROP TABLE IF EXISTS admin_audit_log;
--   DROP TABLE IF EXISTS pin_lockouts;
-- ============================================================
