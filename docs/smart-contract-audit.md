# Z-Pay / StellarRail — Internal Smart Contract Security Audit

**Status:** Internal Review — Not a Professional Audit  
**Network:** Stellar Testnet (pre-mainnet)  
**Date:** July 2026  
**Scope:** All Soroban contracts invoked or deployed by the platform

---

## Executive Summary

Z-Pay's smart contract surface area consists of **custodian-controlled Soroban escrow contracts** on Stellar, called by the server-side backend (never directly by end users). The CCTP cross-chain flow uses Circle's audited protocol. No EVM smart contracts are deployed by this platform.

**Overall Risk Rating: MEDIUM** — acceptable for testnet / beta, requires the fixes below before mainnet.

---

## 1. Escrow Contract (Soroban)

### 1.1 Architecture

The escrow contract (`src/lib/escrow.ts` + Soroban contract) implements a 3-party escrow:
- **Payer** funds escrow on contract creation
- **Freelancer** triggers delivery via `deliver()`
- **Payer** releases via `release()` or opens dispute via `dispute()`
- **Admin** resolves disputes via `resolve()` with verdict

### 1.2 Findings

| Severity | ID | Finding | Status |
|---|---|---|---|
| 🔴 Critical | SC-01 | Admin key compromise = all disputed funds at risk | Open |
| 🟠 High | SC-02 | `releaseEscrow()` called with platform key in `refund/route.ts` | Open |
| 🟡 Medium | SC-03 | No time-lock between dispute and resolution | Open |
| 🟡 Medium | SC-04 | `escrowId` is auto-generated integer — enumerable | Open |
| 🟢 Low | SC-05 | Missing emitted events for off-chain indexing | Mitigated |
| 🟢 Low | SC-06 | Ledger deadline not validated server-side vs. current time | Open |

#### SC-01 (Critical): Admin key privilege

**Description**: The `resolve()` function in the escrow contract accepts any call signed by the admin keypair. If the server's `STELLAR_SECRET_ENCRYPTION_KEY` is compromised, or if the admin Stellar secret is exfiltrated, an attacker can resolve all disputed contracts in their favor.

**Recommendation**:
- Require **multi-sig** for dispute resolution (2-of-3 admin key rotation)
- Implement a `timelock` on resolutions (minimum 24h after dispute open)
- Store admin key in a Stellar **HSM or multisig account** separate from the API server

**Workaround (implemented)**: Admin API routes are protected by `isAdmin()` check + immutable audit log. `safeDecryptSecret` prevents silent decryption failures.

---

#### SC-02 (High): `refundEscrow` + `releaseEscrow` called with payer's key

**Description**: In `contracts/refund/route.ts`, when the freelancer requests a release (non-dispute path), we call `releaseEscrow()` with the *payer's* Stellar secret — meaning the payer's key signs a transaction they didn't explicitly authorize at that moment.

**Recommendation**: The contract's `release()` function should accept the **freelancer's** key for the auto-release path (the payer already pre-authorized escrow creation). Alternatively, the contract should expose a `completeByDelivery()` function that freelancer can call, with the payer having pre-signed via authorization on escrow creation.

---

#### SC-03 (Medium): No time-lock between dispute open and admin resolution

**Description**: A malicious admin (or compromised admin key) can resolve a dispute immediately after it is opened, with no waiting period.

**Recommendation**: Enforce a minimum 48-hour window between `dispute()` and `resolve()` on-chain via ledger number comparison.

---

#### SC-04 (Medium): Enumerable escrowId

**Description**: `escrow_id` is auto-incremented. An attacker who discovers the numeric range could probe contract IDs to enumerate active escrows.

**Recommendation**: Use UUID-based or random salt-derived escrow IDs in the contract.

---

### 1.3 Savings / Staking Contract (Soroban)

| Severity | ID | Finding | Status |
|---|---|---|---|
| 🟡 Medium | SC-07 | Yield rate is hardcoded in server (not on-chain) | Open |
| 🟡 Medium | SC-08 | No cap on total pool deposits | Open |
| 🟢 Low | SC-09 | Rewards computed off-chain — frontend could show stale values | Mitigated |

#### SC-07 (Medium): Yield rate not on-chain

**Description**: `stakeExpo()` reward APR is computed server-side in `savings/stake/route.ts` as a hardcoded BPS table. If the server is compromised, rewards could be manipulated without on-chain evidence.

**Recommendation**: Move yield computation on-chain into the Soroban savings contract. The contract should store `rewardBps` as a storage entry controlled by the admin key.

#### SC-08 (Medium): No pool deposit cap

**Description**: Users can deposit arbitrarily large amounts to the savings pool. Without a TVL cap, a single large withdrawal event could cause liquidity issues.

**Recommendation**: Add `MAX_POOL_SIZE` constant to the pool contract, rejecting deposits that would exceed it.

---

## 2. CCTP Bridge

### 2.1 Threat Model

Z-Pay does not deploy any CCTP contracts — it uses Circle's audited `TokenMessenger` and `MessageTransmitter` contracts. Our surface area is limited to:

1. **Server-side attestation polling** (`src/lib/cctp.ts`)
2. **Stellar CCTP mint completion** (pending Circle Stellar launch)
3. **Intent tracking** in `cctp_deposit_intents` table

### 2.2 Findings

| Severity | ID | Finding | Status |
|---|---|---|---|
| 🟠 High | CC-01 | No amount validation between source TX and credited amount | Open |
| 🟡 Medium | CC-02 | CCTP webhook not rate-limited against replay | Mitigated |
| 🟢 Low | CC-03 | `source_tx_hash` not verified on-chain before crediting | Open |

#### CC-01 (High): Amount not validated

**Description**: When the webhook credits a CCTP deposit, `amount_usdc` is taken from the intent (user-provided) rather than from the Circle attestation payload, which contains the authoritative burned amount.

**Recommendation**: When `completeStellarMint()` is implemented with the real Circle attestation, extract the amount from the signed `message` bytes and use that as the authoritative credit amount — never trust the user-submitted value.

#### CC-03 (Low): Source tx hash not verified

**Description**: `source_tx_hash` is user-provided. We don't verify it corresponds to an actual `depositForBurn` transaction on the source chain.

**Recommendation**: When Circle Iris provides the message hash, verify it corresponds to the provided source tx by checking the `MessageSent` event on the source chain. This is a defense-in-depth measure; the Circle attestation itself is the primary trust anchor.

---

## 3. Overall Recommendations Before Mainnet

### Priority 1 (Required before real funds)

1. **Fix SC-01**: Move admin key to Stellar multisig account (2-of-3 signers)
2. **Fix CC-01**: Source the credited USDC amount from the Circle-signed attestation message, not the intent
3. **External audit**: Commission an audit from an established Soroban-specialized firm (e.g., OtterSec, Halborn) before mainnet launch

### Priority 2 (Required within 30 days of mainnet)

4. **Fix SC-02**: Refactor auto-release to not require payer's live secret
5. **Fix SC-03**: Add on-chain time-lock for dispute resolution
6. **Fix SC-07**: Move yield rate on-chain

### Priority 3 (Best practice)

7. **Fix SC-04**: Switch to UUID-based escrow IDs
8. **Fix SC-08**: Add pool TVL cap
9. **Penetration test**: Contract + API surface before production traffic

---

## 4. Controls Already in Place

| Control | Status |
|---|---|
| `stellar_secret` encrypted with AES-256-GCM | ✅ |
| Versioned key envelope with rotation scripts | ✅ |
| `safeDecryptSecret` prevents crash-on-failure | ✅ |
| PIN lockout (5/10/15/20 tier) persisted in DB | ✅ |
| Rate limiting on all auth endpoints | ✅ |
| Admin actions immutably logged in `admin_audit_log` | ✅ |
| Security alerts table with severity levels | ✅ |
| Duplicate deposit prevention (idempotent upsert on tx_hash) | ✅ |
| RLS enabled on all sensitive tables | ✅ |
| CRON_SECRET protecting webhook endpoint | ✅ |

---

*This is an internal security review by the engineering team. It does not constitute a professional security audit and should not be represented as such. All findings are pre-production and subject to change.*
