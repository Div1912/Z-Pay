# ZPAY UNIFIED BALANCE — ENGINEERING BUILD SPECIFICATION

**Codename:** Zpay Unified Balance (ZUB)
**One-line description:** A self-owned, Circle-Gateway-style unified USDC balance layer spanning EVM chains (Ethereum, Base) and Stellar, exposed natively to AI agents via MCP and x402 — built on top of CCTP as the neutral settlement rail, not dependent on Circle's private Gateway infrastructure.

**Use this document as a build prompt.** Feed it directly to an engineering agent (Claude Code or otherwise), or use it as the working spec for your own build. Each component section is written as a standalone directive with enough context to implement without re-deriving the architecture.

---

## 1. System Context — what already exists in Zpay

Before building ZUB, assume the following is already true of the Zpay codebase:

- Soroban escrow contracts exist and are functional (used for agentic payment holds).
- x402 payment gateway is implemented — the first on Stellar — handling HTTP 402-based payment intents.
- MCP server exists, exposing payment tools to AI agents.
- A funded Stellar mainnet master wallet exists (via onramp.money) for development/testing capital.
- Universal IDs are the addressing scheme used across the router.

ZUB is a new subsystem that sits **underneath** the existing router logic. It does not replace x402 or the MCP server — it becomes the balance/liquidity substrate those layers call into.

---

## 2. Objective

Give a Zpay user (human or AI agent) a single spendable USDC balance, regardless of which chain that USDC physically sits on (Ethereum, Base, or Stellar), with:

- **Instant-feeling spend** (target: sub-2-second perceived latency, ideally sub-second on the happy path)
- **No manual bridging step ever exposed to the caller**
- **Trust-minimized custody** — Zpay never holds sole custody of funds without a user-accessible fallback
- **CCTP as the only external dependency** — permissionless, free at the protocol level, works across all three target chains as of May 2026

Explicitly **not** the objective: reimplementing CCTP's burn-and-mint logic, or building a validator-set bridge. Those are solved problems and reinventing them is a security liability, not a feature.

---

## 3. High-Level Architecture

```
                         ┌─────────────────────────────┐
                         │   Unified Ledger Service      │
                         │  (source of truth: user →     │
                         │   aggregate spendable balance)│
                         └───────────────┬───────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 │                       │                       │
        ┌────────▼────────┐    ┌─────────▼─────────┐   ┌─────────▼─────────┐
        │ Zpay Vault (ETH)  │    │ Zpay Vault (Base)  │   │ Zpay Vault (XLM)   │
        │ Solidity contract │    │ Solidity contract  │   │ Soroban contract   │
        │ + reserve capital │    │ + reserve capital  │   │ + reserve capital  │
        └────────┬──────────┘    └─────────┬──────────┘  └─────────┬──────────┘
                 │                          │                       │
                 └──────────────┬───────────┴───────────────────────┘
                                │
                    ┌────────────▼─────────────┐
                    │  Reconciliation Engine     │
                    │  (background service,      │
                    │   CCTP burn/mint calls,     │
                    │   netting + batching)       │
                    └────────────┬─────────────┘
                                │
                    ┌────────────▼─────────────┐
                    │   Attestation & Intent      │
                    │   Service (signs spend       │
                    │   authorizations, checks     │
                    │   ledger sufficiency)        │
                    └────────────┬─────────────┘
                                │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌─────────▼────────┐ ┌───────▼────────┐ ┌────────▼─────────┐
     │  x402 Gateway      │ │  MCP Server     │ │  Solvency /       │
     │  (human/app calls) │ │  (agent calls)  │ │  Collateral Engine │
     └────────────────────┘ └────────────────┘ └───────────────────┘
```

**Flow for a spend (happy path):**
1. Caller (human via x402, or agent via MCP) signs a spend intent: `{from: universal_id, amount, destination_chain, recipient}`.
2. Attestation Service checks the Unified Ledger for sufficient aggregate balance.
3. Attestation Service signs a release authorization scoped to the destination chain's vault.
4. Destination Vault contract verifies the signature and releases funds from its **local reserve** to the recipient — this is what makes it instant; no cross-chain call blocks the payment.
5. Unified Ledger debits the user's aggregate balance immediately.
6. Reconciliation Engine records a backfill obligation and settles it asynchronously via CCTP, batched with other pending obligations.

---

## 4. Component Specifications

### 4.1 Zpay Vault — EVM (Solidity)

Deploy identical vault contracts on Ethereum and Base.

**Responsibilities:**
- Accept USDC deposits, emit `Deposited(address user, uint256 amount)`.
- Hold Zpay's reserve capital (separately tracked from user deposits — do not commingle accounting, even though funds sit in the same contract).
- Verify attestation signatures from the Attestation Service's signing key (or threshold multisig — see §6).
- Release funds to a recipient on instruction, decrementing local reserve.
- Expose a **direct withdrawal function** callable by any user for their own real, locally-deposited balance, with no attestation required — this is the trust-minimization fallback (see §6).
- Emit events for every state change (`Released`, `ReserveTopUp`, `WithdrawalFallbackUsed`) — the Reconciliation Engine and Solvency Engine both index off these events.

**Interface sketch:**
```solidity
interface IZpayVault {
    function deposit(uint256 amount) external;
    function releaseFromReserve(address recipient, uint256 amount, bytes calldata attestationSig) external;
    function topUpReserve(uint256 amount) external; // called by Reconciliation Engine's hot wallet
    function withdrawDirect(uint256 amount) external; // trustless fallback, no attestation needed
    function reserveBalance() external view returns (uint256);
    function userDepositBalance(address user) external view returns (uint256);
}
```

Build this with OpenZeppelin's `ReentrancyGuard` and `Pausable`. Signature verification should use EIP-712 typed data so attestations are human-readable in wallets during testing.

### 4.2 Zpay Vault — Stellar (Soroban / Rust)

Same responsibilities as §4.1, translated to Soroban's contract model.

**Stellar-specific notes:**
- Stellar's native asset model (trustlines) means USDC on Stellar is a classic Stellar asset, not an arbitrary ERC-20-style token. The Soroban contract needs to interact with the classic asset via Soroban's token interface (SEP-41), not assume ERC-20 semantics.
- Use Soroban's native authorization framework (`require_auth`) for the direct-withdrawal fallback, and a custom signature-verification path (Ed25519, since that's Stellar's native curve) for attestation-gated releases.
- You already have Soroban escrow contract experience from earlier Zpay work — reuse those patterns for the escrow/hold semantics; the vault is functionally an escrow with a reserve-fronting feature added.

**Interface sketch (Rust/Soroban):**
```rust
pub trait ZpayVaultTrait {
    fn deposit(env: Env, from: Address, amount: i128);
    fn release_from_reserve(env: Env, recipient: Address, amount: i128, attestation_sig: BytesN<64>);
    fn top_up_reserve(env: Env, amount: i128);
    fn withdraw_direct(env: Env, user: Address, amount: i128);
    fn reserve_balance(env: Env) -> i128;
    fn user_deposit_balance(env: Env, user: Address) -> i128;
}
```

### 4.3 Unified Ledger Service

An off-chain service (do not put this fully on-chain for the MVP — the accounting logic is complex and needs iteration speed; anchor periodic state roots on-chain later for auditability if needed).

**Responsibilities:**
- Single source of truth for `universal_id → aggregate spendable balance`.
- Debits on spend authorization, credits on confirmed deposit events (indexed from vault contract events across all three chains).
- Must be idempotent and replay-safe — use a event-sourced design: append-only ledger of `(event_id, universal_id, delta, chain, tx_hash)`, aggregate balance is a derived view, never mutated directly.

**Recommended stack:** Postgres for the event log (you already have Postgres experience from other Zpay/JARVIS work), a simple reconciliation job that re-derives balances from the event log on a schedule to catch drift.

**Critical invariant to enforce in code, with tests:** `sum(all vault reserve balances) + sum(all vault user-deposit balances) >= sum(all unified ledger aggregate balances)` at all times except during the brief window of an in-flight reconciliation. Violating this invariant means the system is insolvent — build an alert on this check, not just a test.

### 4.4 Attestation & Intent Service

**Responsibilities:**
- Receives signed spend intents from x402 or MCP callers.
- Validates the intent against the Unified Ledger (sufficient balance check).
- Signs a release authorization (EIP-712 for EVM targets, Ed25519 for Stellar targets) scoped to a specific vault, amount, and recipient, with an expiry timestamp (5-10 seconds — short-lived, single-use).
- Publishes the authorization back to the caller, who submits it to the destination vault.

**Security note:** this service's signing key is the single point of failure for the "instant" path. Start with a single key for the hackathon MVP, but design the signing interface so it can be swapped for a threshold signature scheme (e.g. FROST or a 2-of-3 multisig) without changing the vault contracts' verification logic — the vault just checks a signature against a known public key/address; whether that key is held by one service or reconstructed via threshold signing is invisible to the contract.

### 4.5 Reconciliation Engine

**Responsibilities:**
- Watches vault events across all three chains for `Released` events that drew down reserve.
- Batches backfill obligations per (source-chain-with-surplus, destination-vault-needing-topup) pair over a short window (e.g. 60-second or N-obligation batches — net multiple obligations before settling, this is where fee savings actually come from).
- Executes CCTP burn on the surplus chain, waits for attestation, executes mint + `topUpReserve` call on the deficit chain's vault.
- CCTP Standard Transfer is free at the protocol level (gas only) — use Standard Transfer for reconciliation since it's not user-facing latency, and reserve CCTP V2 Fast Transfer (paid, ~30s) only for cases where a reserve is critically low and needs emergency top-up before the next batch window.

**This is where your netting/graph logic lives long-term:** if you extend to agent-to-agent payment flows, this is the component that should implement cycle-cancellation on the obligation graph before touching CCTP at all — i.e., if chain A owes chain B and chain B owes chain A, cancel the overlap first, only move the net delta.

### 4.6 Solvency & Collateral Engine

**Responsibilities:**
- Decides target reserve levels per vault (starting point: static config, e.g. 20% of trailing 24h volume per chain; upgrade path: forecast-driven using historical flow data).
- Triggers Reconciliation Engine top-ups when a vault's reserve drops below a threshold (e.g. 30% of target).
- Enforces a hard cap: total fronted-but-not-yet-reconciled exposure per vault must never exceed a configured collateralization ratio against Zpay's total working capital.
- This is the component to eventually feed with your ML/forecasting background — corridor-level demand prediction (e.g. "Base→Stellar tends to spike Tuesday mornings") to pre-position reserve ahead of demand instead of reacting after a shortfall. Out of scope for hackathon MVP; stub it as a config file, architect the interface so it can be replaced with a model later.

### 4.7 x402 Integration Layer

Extend the existing x402 gateway so a 402 Payment Required response can be resolved directly against a caller's Unified Ledger balance instead of requiring a single-chain payment. Concretely: the x402 challenge response should include a `zpay_unified_balance: true` capability flag; clients that support it sign a spend intent (per §4.4) instead of a raw on-chain transfer.

### 4.8 MCP Server Integration

Add a new MCP tool: `zpay_unified_spend(amount, destination_chain, recipient)`. This is the tool an AI agent calls when it wants to pay someone — the agent never needs to reason about which chain has enough balance; that's resolved entirely inside ZUB. This is the actual differentiator versus Circle Gateway (which has no agent-native interface) — make sure the tool description and error messages are written for an LLM caller, not a human developer (clear, structured, no ambiguity about partial failure states).

---

## 5. Data Models

```
UnifiedBalanceEvent {
  event_id: uuid
  universal_id: string
  delta: decimal          // positive for deposit, negative for spend
  chain: enum(ETHEREUM, BASE, STELLAR)
  tx_hash: string
  created_at: timestamp
}

SpendIntent {
  intent_id: uuid
  universal_id: string
  amount: decimal
  destination_chain: enum(ETHEREUM, BASE, STELLAR)
  recipient: string
  signed_by_caller: bytes
  expires_at: timestamp
}

ReleaseAuthorization {
  intent_id: uuid  // FK
  vault_chain: enum(ETHEREUM, BASE, STELLAR)
  amount: decimal
  recipient: string
  attestation_sig: bytes
  expires_at: timestamp
}

ReconciliationObligation {
  obligation_id: uuid
  deficit_chain: enum(ETHEREUM, BASE, STELLAR)
  surplus_chain: enum(ETHEREUM, BASE, STELLAR)
  amount: decimal
  status: enum(PENDING, BATCHED, CCTP_BURN_SUBMITTED, CCTP_ATTESTED, SETTLED)
  created_at: timestamp
}
```

---

## 6. Security & Trust Model

State this explicitly in your documentation and pitch — it's the difference between "we built a payment router" and "we built an unaudited custodial black box":

1. **Every vault supports direct, attestation-free withdrawal of a user's own locally-deposited funds at all times.** If the Attestation Service or Reconciliation Engine goes down entirely, users can still recover their real, physically-deposited balance from whichever vault holds it — they just lose the "instant unified spend" convenience, not their money. This mirrors Circle Gateway's own 7-day trustless withdrawal fallback; copy the shape of that guarantee.
2. **Reserve capital and user deposits are accounted separately, even in the same contract.** A reserve shortfall must never be able to touch user-deposited funds.
3. **Attestation signing key(s) should move to threshold signing before any real capital is at risk.** Single-key signing is acceptable only for testnet/hackathon demo.
4. **Set and enforce a hard collateralization ceiling** — total exposure fronted-and-unreconciled must be bounded and monitored, with automatic pausing of instant-release (falling back to CCTP-speed settlement) if the ceiling is approached.
5. **Do not market or architect this as "trustless."** It isn't — it's trust-minimized, same as Gateway. Be precise about this distinction in any pitch material; overclaiming trustlessness on a custodial reserve system is the fastest way to lose credibility with a technical judge.

---

## 7. API Surface (external, for x402/MCP callers)

```
POST /v1/spend-intent
  body: { universal_id, amount, destination_chain, recipient, signature }
  returns: { intent_id, status }

GET /v1/balance/:universal_id
  returns: { aggregate_balance, per_chain_breakdown }

GET /v1/intent/:intent_id
  returns: { status: PENDING | RELEASED | FAILED, tx_hash? }

POST /v1/vault/:chain/withdraw-direct   (fallback path, bypasses ledger)
  body: { universal_id, amount, signature }
```

---

## 8. Build Phases

**Phase 0 — Hackathon MVP (target: Citadel demo scope)**
- Two chains only: Base + Stellar.
- Single signing key for Attestation Service (documented as a known limitation with a clear upgrade path).
- Static reserve targets (no forecasting).
- Manual/scheduled reconciliation (cron every 60s), no netting optimization yet.
- Demonstrate: deposit on Base, deposit on Stellar, spend more than either individual chain balance against the aggregate, instant release, background CCTP reconciliation visible in logs/dashboard.

**Phase 1 — Post-hackathon hardening**
- Add Ethereum as third chain.
- Threshold signing for attestation.
- Netting/cycle-cancellation in Reconciliation Engine.
- On-chain event-sourced ledger anchoring for auditability.

**Phase 2 — Product**
- Forecast-driven Solvency Engine.
- Multi-user agent-to-agent netting at scale.
- Formal audit of vault contracts before any non-testnet capital at risk.

---

## 9. Recommended Tech Stack

- **EVM contracts:** Solidity + Foundry (fast iteration, good fuzzing support for the solvency invariants).
- **Soroban contracts:** Rust + Soroban SDK, reuse existing escrow contract patterns.
- **Off-chain services:** Node/TypeScript (consistent with your existing MCP server and x402 gateway) or Python if you want faster integration with a future forecasting model.
- **Ledger storage:** Postgres, event-sourced table + materialized balance view.
- **CCTP integration:** Circle's public CCTP contracts/SDK directly — do not proxy through a third-party aggregator for the MVP, keep the dependency surface minimal and auditable.

---

## 10. Definition of Done (Hackathon Demo)

- [ ] User can deposit USDC into both a Base vault and a Stellar vault.
- [ ] Unified Ledger correctly reflects aggregate balance across both.
- [ ] A spend request for an amount exceeding either single chain's balance succeeds instantly against the aggregate.
- [ ] The Reconciliation Engine visibly settles the resulting obligation via CCTP within the demo window.
- [ ] Direct withdrawal fallback works and is demonstrated live (kill the Attestation Service, show the user can still withdraw their real deposited funds).
- [ ] An AI agent, via the MCP tool, can trigger a unified spend without knowing which chain the funds physically sit on.
- [ ] Solvency invariant (§4.3) holds at every step, verified live or via test suite.

---

## 11. Open Risks to Flag Explicitly in the Pitch

- Reserve capital requires real working capital — this is a balance-sheet-dependent product, not a zero-capital protocol. Be upfront about this; it's the same constraint Circle itself has, not a flaw unique to your design.
- Attestation Service is a centralization point until threshold signing ships — name this as a known, staged limitation, not a hidden one.
- Circle could ship Gateway-on-Stellar at any time, which would compress this into a commodity feature. The pitch should lean on the agent-native interface (MCP/x402) as the durable differentiator, not the unified-balance mechanism itself, which is inherently time-limited as a moat.
