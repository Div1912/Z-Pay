-- ============================================================
-- Z-Pay – Admin Role Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- MUST be run BEFORE deploying the new admin route code.
-- ============================================================

-- 1. Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Create index for fast admin lookups
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON profiles(is_admin) WHERE is_admin = TRUE;

-- 3. Seed existing admins from the old hardcoded list
--    Adjust email addresses as needed.
UPDATE profiles
SET is_admin = TRUE
WHERE email IN (
  'admin@zpay.app',
  'support@zpay.app',
  'bkbhaia@gmail.com'
);

-- 4. Verify
SELECT id, email, is_admin FROM profiles WHERE is_admin = TRUE;

-- ============================================================
-- ROLLBACK (run only if needed):
--   ALTER TABLE profiles DROP COLUMN IF EXISTS is_admin;
-- ============================================================
