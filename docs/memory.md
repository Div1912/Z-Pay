# Z-Pay / StellarRail — Project Memory

_Last updated: 2026-07-11_

## Architecture
- **Next.js 15** App Router, deployed on Vercel
- **Supabase** (Postgres + Auth + Storage). Service-role key used in all server-side routes.
- **Stellar testnet** (HORIZON_URL → testnet.stellar.org)
- Custodial wallet: backend stores `stellar_secret` (now encrypted) in `profiles` table

## Security Status (Phase 1 & 2 — COMPLETE ✅)

### AES-256-GCM Secret Encryption (Versioned Envelope)
- **Library**: `src/lib/crypto.ts` — `encryptSecret()`, `decryptSecret()`, `safeDecryptSecret()`
- **Key env var**: `STELLAR_SECRET_ENCRYPTION_KEY` (format: `v<N>:<64-char-hex>`)
- **Key Rotation**: `scripts/rotate-encryption-key.ts` for zero-downtime key rotation.
- **Docs**: `docs/key-lifecycle.md`

### bcrypt PIN hashing (silent/transparent upgrade)
- **Library**: `bcryptjs` (npm installed), salt rounds = 10
- All PIN verify paths do `bcrypt.compare()` with fallback to plaintext comparison for legacy rows.

### PIN Lockout & Abuse Hardening
- **Library**: `src/lib/pin-lockout.ts` — persistent DB-backed progressive lockout (5/10/15/20 tiers)
- **Library**: `src/lib/security-alerts.ts` — DB-backed security alerts
- **Library**: `src/lib/admin.ts` — `logAdminAction` and `extractRequestMeta` for audit trails

## Feature: Deposits & Cross-Chain (Phase 1 & 2 — COMPLETE ✅)

### Stellar Direct Deposit
- **API route**: `src/app/api/zpay/deposit-stream/route.ts` (SSE)
- **API route**: `src/app/api/zpay/deposits/route.ts` (GET paginated history, POST manual backfill from Horizon)

### Cross-Chain Deposits (Circle CCTP)
- **Library**: `src/lib/cctp.ts` — Circle Iris attestation polling, mint simulation
- **API routes**:
  - `src/app/api/cctp/deposit-address/route.ts` — Get deposit instructions / create intent
  - `src/app/api/cctp/verify/route.ts` — Poll for intent status
  - `src/app/api/cctp/webhook/route.ts` — Process intents and credit deposits
- **Cron**: Vercel cron in `vercel.json` calls `/api/cctp/webhook` every 2 minutes
- UI: "Cross-Chain USDC" tab in `src/app/dashboard/add-funds/page.tsx`

## Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STELLAR_SECRET_ENCRYPTION_KEY=v1:<64 hex chars>
```

## Pending / Next Steps
- [ ] Execute `supabase_cctp_migration.sql` and `supabase_security_migration.sql` in Supabase
- [ ] Execute `scripts/rotate-encryption-key.ts` after migrating to versioned envelope
- [ ] Review and address findings in `docs/smart-contract-audit.md` before Mainnet
- [ ] Real UPI settlement via licensed PA — Future Phase
