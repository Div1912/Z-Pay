# Z-Pay SDK

The Z-Pay SDK provides a simple interface for interacting with the Z-Pay platform. It allows developers to resolve Z-Pay handles (`name@Zp`), check balances, send payments, and fetch transaction history.

## Installation

Install the package via npm, yarn, or pnpm:

```bash
npm install @zpay/sdk
# or
yarn add @zpay/sdk
# or
pnpm add @zpay/sdk
```

## Initialization

Initialize the `ZpayClient` with your preferred configuration. 

```typescript
import { ZpayClient } from '@zpay/sdk';

// Uses the default production endpoint: https://zpayrouter.me/api
const zpay = new ZpayClient({
  apiKey: 'YOUR_API_KEY' // Optional, depending on endpoint security
});
```

---

## API Reference

### Users

Resolve a Z-Pay handle to its underlying Stellar public key and memo.

```typescript
const { address, memo, handle } = await zpay.users.resolve('alice@Zp');
console.log(`Sending to ${address}`);
```

### Payments

#### 1. Get Balance
Fetch the Stellar and asset balances for a wallet address.

```typescript
const balances = await zpay.payments.getBalance('GABCD...');
console.log(balances);
```

#### 2. Send Payment
Send a payment using an asset (e.g. XLM, USDC). The `to` parameter can be a Stellar address or a Universal ID.

```typescript
const response = await zpay.payments.send({
  to: 'bob@Zp',
  amount: '10.5',
  asset: 'USDC',
  memo: 'Lunch payment'
});

if (response.success) {
  console.log('Payment successful. Hash:', response.hash);
}
```

#### 3. Transaction History
Fetch the payment and transaction history for an address.

```typescript
const history = await zpay.payments.getHistory('GABCD...', {
  limit: 20
});
console.log(history);
```

---

## Advanced: Using custom endpoints

If you want to use the SDK with a local development server, you can override the base URL:

```typescript
const devClient = new ZpayClient({
  baseUrl: 'http://localhost:3000/api',
  apiKey: 'DEV_TEST_KEY'
});
```
