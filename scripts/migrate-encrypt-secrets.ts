/**
 * migrate-encrypt-secrets.ts
 *
 * One-shot migration: reads all profiles that have a plaintext stellar_secret,
 * encrypts each one with AES-256-GCM, and writes it back.
 *
 * SAFE: Skips rows already encrypted (detected by "iv:" prefix).
 * IDEMPOTENT: Can be run multiple times without harm.
 *
 * Run with:
 *   npx tsx scripts/migrate-encrypt-secrets.ts
 *
 * Required env vars (in .env.local or export):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   STELLAR_SECRET_ENCRYPTION_KEY  (64-char hex)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { encryptSecret, isEncrypted } from '../src/lib/crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  console.log('🔐 Starting stellar_secret encryption migration...\n');

  // Fetch all profiles that have a stellar_secret
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, stellar_secret')
    .not('stellar_secret', 'is', null);

  if (error) {
    console.error('❌ Failed to fetch profiles:', error.message);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log('✅ No profiles with stellar_secret found. Nothing to migrate.');
    return;
  }

  console.log(`Found ${profiles.length} profile(s) with stellar_secret.\n`);

  let skipped = 0;
  let migrated = 0;
  let failed = 0;

  for (const profile of profiles) {
    const { id, stellar_secret } = profile;

    if (!stellar_secret) {
      skipped++;
      continue;
    }

    // Already encrypted — skip
    if (isEncrypted(stellar_secret)) {
      console.log(`  ⏭  ${id} — already encrypted, skipping`);
      skipped++;
      continue;
    }

    try {
      const encrypted = encryptSecret(stellar_secret);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stellar_secret: encrypted })
        .eq('id', id);

      if (updateError) {
        console.error(`  ❌ ${id} — update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  ✅ ${id} — encrypted successfully`);
        migrated++;
      }
    } catch (err: any) {
      console.error(`  ❌ ${id} — encryption error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`Migration complete:`);
  console.log(`  Migrated : ${migrated}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Failed   : ${failed}`);

  if (failed > 0) {
    console.error('\n⚠️  Some rows failed. Check output above and retry.');
    process.exit(1);
  }

  console.log('\n✅ All secrets encrypted. Update your code to use decryptSecret() before deploying.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
