import * as StellarSdk from '@stellar/stellar-sdk';

async function runTest() {
  console.log("1. Requesting protected API endpoint...");
  const res1 = await fetch("http://localhost:3000/api/x402-demo");
  
  if (res1.status !== 402) {
    console.error("Expected 402 Payment Required, got", res1.status);
    console.log(await res1.text());
    return;
  }
  
  const authHeader = res1.headers.get("www-authenticate");
  console.log("2. Received 402 Challenge:");
  console.log("   WWW-Authenticate:", authHeader);
  
  // Extract details
  const matchMacaroon = authHeader.match(/macaroon="([^"]+)"/);
  const matchInvoice = authHeader.match(/invoice="([^"]+)"/);
  const matchAmount = authHeader.match(/amount="([^"]+)"/);
  const matchDest = authHeader.match(/destination="([^"]+)"/);
  
  const mac = matchMacaroon[1];
  const invoiceId = matchInvoice[1];
  const amount = matchAmount[1];
  const dest = matchDest[1];
  
  console.log(`\n3. Paying Invoice: ${invoiceId} for ${amount} XLM to ${dest}`);
  
  const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
  
  // Generate and fund a temporary testnet account using Friendbot
  console.log("   Generating temporary Stellar account and funding via Friendbot...");
  const sourceKeypair = StellarSdk.Keypair.random();
  await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(sourceKeypair.publicKey())}`);
  
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  
  const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  }).addOperation(
    StellarSdk.Operation.payment({
      destination: dest,
      asset: StellarSdk.Asset.native(),
      amount: amount,
    })
  );
  
  txBuilder.addMemo(StellarSdk.Memo.text(invoiceId.substring(0, 28)));
  txBuilder.setTimeout(30);
  
  const transaction = txBuilder.build();
  transaction.sign(sourceKeypair);
  
  console.log("   Submitting payment to Stellar Testnet...");
  const txResult = await server.submitTransaction(transaction);
  console.log(`   Payment successful! TxHash: ${txResult.hash}`);
  
  console.log("   Waiting 5 seconds for Horizon to index...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log("\n4. Replaying API request with L402 Proof...");
  const authHeaderValue = `L402 ${mac}:${txResult.hash}`;
  
  const res2 = await fetch("http://localhost:3000/api/x402-demo", {
    headers: {
      "Authorization": authHeaderValue
    }
  });
  
  console.log(`\nFinal API Response Status: ${res2.status}`);
  const data = await res2.json();
  console.log("Response Body:", JSON.stringify(data, null, 2));
}

runTest().catch(console.error);
