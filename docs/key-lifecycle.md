# Key Lifecycle Management

This document details the lifecycle, rotation, and disaster recovery processes for the platform's symmetric encryption key used to protect `stellar_secret` values at rest.

## Environment Variables

*   `STELLAR_SECRET_ENCRYPTION_KEY`: The current active key. Used for all *new* encryptions and decryption of rows matching its version.
*   `STELLAR_SECRET_ENCRYPTION_KEY_v<N>`: Previous keys retained for decrypting legacy rows before they are rotated.

### Key Format

*   **Bare Hex (Legacy)**: `64 hex characters` (implicitly treated as `v1`)
*   **Versioned (Current)**: `v<N>:64 hex characters` (e.g., `v2:abc123...`)

## Key Rotation Runbook

To achieve zero-downtime key rotation:

1.  **Generate a new key**:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```
2.  **Update Environment Variables**:
    *   Move the current key to a versioned variable (e.g., `STELLAR_SECRET_ENCRYPTION_KEY_v1=old_key_hex`).
    *   Set the new key with an incremented version (e.g., `STELLAR_SECRET_ENCRYPTION_KEY=v2:new_key_hex`).
    *   Restart the application server to load the new environment.
3.  **Perform Dry Run**:
    *   Verify the rotation script correctly identifies rows needing re-encryption without modifying the database.
    ```bash
    npx tsx scripts/rotate-encryption-key.ts --dry-run
    ```
4.  **Execute Rotation**:
    *   Run the rotation script to decrypt with the old key and re-encrypt with the new key.
    ```bash
    npx tsx scripts/rotate-encryption-key.ts
    ```
5.  **Cleanup**:
    *   Once the script completes successfully and reports 0 rows failing, the old key (`STELLAR_SECRET_ENCRYPTION_KEY_v1`) can be safely removed from the environment.
    *   Restart the application server.

## Failure Modes & Graceful Handling

*   **Missing Key Version**: If a row is encrypted with `vX`, but `STELLAR_SECRET_ENCRYPTION_KEY_vX` is not in the environment, `decryptSecret` will fail. `safeDecryptSecret` catches this and returns `null`, causing the API to return a 503 "Wallet temporarily unavailable" error rather than crashing or exposing plaintext keys.
*   **Tampered Ciphertext**: AES-GCM includes an authentication tag. If the ciphertext in the database is modified, decryption will fail, triggering the same 503 response.

## Security Alerts

The `rotate-encryption-key.ts` script should ideally be run by an administrator. Any failed decryption attempts in production (e.g., during API requests if a key is prematurely removed) should trigger a `decrypt_failure` alert via `src/lib/security-alerts.ts` (future enhancement).
