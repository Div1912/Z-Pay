#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import * as StellarSdk from "@stellar/stellar-sdk";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mumdfrgyxhddtyuebonc.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bWRmcmd5eGhkZHR5dWVib25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjExNzksImV4cCI6MjA5NzQzNzE3OX0.D7TBeq0xupZhqGyQ5d2xplFkLqAz189L2ueq-Eb-i-g";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_GjX76to1Jg_B8NuL1ty30Q_pZZkiZaZ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const IS_MAINNET = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet';
const HORIZON_SERVER = new StellarSdk.Horizon.Server(
  IS_MAINNET ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org'
);
const NETWORK_PASSPHRASE = IS_MAINNET ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET;

async function runMcpServer() {
  const email = process.env.ZPAY_EMAIL;
  const password = process.env.ZPAY_PASSWORD;

  if (!email || !password) {
    console.error("Missing ZPAY_EMAIL or ZPAY_PASSWORD environment variables.");
    process.exit(1);
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.error(`Authentication failed: ${authError?.message || 'Unknown error'}`);
    process.exit(1);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    console.error(`Failed to fetch profile: ${profileError?.message || 'Profile not found'}`);
    process.exit(1);
  }

  if (!profile.stellar_secret) {
    console.error('This user does not have a Stellar wallet configured in Zpay.');
    process.exit(1);
  }

  const server = new Server(
    {
      name: `zpay-mcp-server-${profile.universal_id}`,
      version: "1.0.0",
    },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "zpay_get_balance",
          description: "Get the current user's Z-Pay XLM balance.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "zpay_resolve_user",
          description: "Lookup a user by their @Zp universal ID to check if they exist.",
          inputSchema: {
            type: "object",
            properties: {
              universal_id: { type: "string", description: "The @Zp ID of the user" }
            },
            required: ["universal_id"],
          },
        },
        {
          name: "zpay_send_payment",
          description: "Send a payment (XLM) to another Z-Pay user. This enables autonomous payment for API access (X402 protocol).",
          inputSchema: {
            type: "object",
            properties: {
              recipient_universal_id: { type: "string", description: "The @Zp ID of the recipient" },
              amount: { type: "string", description: "Amount in XLM to send" },
              memo: { type: "string", description: "Optional transaction memo or purpose" }
            },
            required: ["recipient_universal_id", "amount"],
          },
        },
        {
          name: "zpay_get_history",
          description: "Fetch the user's transaction history.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "zpay_get_profile",
          description: "Get the current authenticated user's profile details (including their universal ID and stellar address).",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "zpay_pay_x402",
          description: "Pay an X402/L402 invoice to access a premium API. Automatically handles platform fees if required.",
          inputSchema: {
            type: "object",
            properties: {
              merchant_address: { type: "string", description: "The Stellar address of the merchant" },
              amount: { type: "string", description: "Amount in XLM to pay the merchant" },
              invoice_id: { type: "string", description: "The invoice ID (memo) from the WWW-Authenticate header" },
              fee_address: { type: "string", description: "Optional platform fee Stellar address" },
              fee_amount: { type: "string", description: "Optional platform fee amount in XLM" }
            },
            required: ["merchant_address", "amount", "invoice_id"],
          },
        },
        {
          name: "zpay_create_split_contract",
          description: "Execute a split contract by sending XLM to multiple recipients atomically in a single transaction.",
          inputSchema: {
            type: "object",
            properties: {
              splits: { 
                type: "array", 
                items: {
                  type: "object",
                  properties: {
                    address: { type: "string", description: "Stellar address of recipient" },
                    amount: { type: "string", description: "Amount in XLM" }
                  },
                  required: ["address", "amount"]
                },
                description: "Array of recipients and amounts" 
              },
              memo: { type: "string", description: "Optional transaction memo" }
            },
            required: ["splits"],
          },
        },
        {
          name: "zpay_transaction_history",
          description: "Fetch the recent Stellar on-chain transaction history for the user's wallet.",
          inputSchema: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Number of recent transactions to fetch (default 5)" }
            }
          },
        },
        {
          name: "zpay_create_time_lock_contract",
          description: "Create an escrow/time-locked payment that cannot be submitted until a specific future timestamp.",
          inputSchema: {
            type: "object",
            properties: {
              destination: { type: "string", description: "The recipient's Stellar address" },
              amount: { type: "string", description: "Amount in XLM" },
              unlock_timestamp_seconds: { type: "number", description: "Unix timestamp (in seconds) when the funds unlock" }
            },
            required: ["destination", "amount", "unlock_timestamp_seconds"],
          },
        }
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      if (request.params.name === "zpay_get_balance") {
        const account = await HORIZON_SERVER.loadAccount(profile.stellar_address);
        const xlmBalance = account.balances.find((b) => b.asset_type === 'native')?.balance || "0";
        return { content: [{ type: "text", text: `Your Z-Pay balance is ${xlmBalance} XLM.` }] };
      }

      if (request.params.name === "zpay_resolve_user") {
        const { universal_id } = request.params.arguments;
        const { data: user } = await supabase
          .from('profiles')
          .select('universal_id, full_name')
          .ilike('universal_id', universal_id.replace(/@Zp$/i, ''))
          .single();
        if (!user) return { content: [{ type: "text", text: "User not found." }] };
        return { content: [{ type: "text", text: `User found: ${user.full_name} (${user.universal_id}@Zp)` }] };
      }

      if (request.params.name === "zpay_send_payment") {
        const { recipient_universal_id, amount, memo } = request.params.arguments;
        const { data: recipient } = await supabaseAdmin
          .from('profiles')
          .select('id, stellar_address, universal_id')
          .ilike('universal_id', recipient_universal_id.replace(/@Zp$/i, ''))
          .single();

        if (!recipient?.stellar_address) throw new Error(`Recipient not found`);

        const sourceKeypair = StellarSdk.Keypair.fromSecret(profile.stellar_secret);
        const sourceAccount = await HORIZON_SERVER.loadAccount(sourceKeypair.publicKey());

        const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK_PASSPHRASE,
        }).addOperation(
          StellarSdk.Operation.payment({
            destination: recipient.stellar_address,
            asset: StellarSdk.Asset.native(),
            amount: String(amount),
          })
        ).setTimeout(30);

        if (memo) txBuilder.addMemo(StellarSdk.Memo.text(memo.substring(0, 28)));

        const transaction = txBuilder.build();
        transaction.sign(sourceKeypair);
        const result = await HORIZON_SERVER.submitTransaction(transaction);

        await supabaseAdmin.from('transactions').insert({
          sender_id: profile.id,
          recipient_id: recipient.id,
          sender_universal_id: profile.universal_id,
          recipient_universal_id: recipient.universal_id || recipient_universal_id,
          amount: amount,
          currency: 'XLM',
          tx_hash: result.hash,
          status: 'completed'
        });

        return { content: [{ type: "text", text: `Successfully sent ${amount} XLM to ${recipient_universal_id}. TxHash: ${result.hash}` }] };
      }

      if (request.params.name === "zpay_get_history") {
        // Fetch outgoing transactions
        const { data: sent } = await supabaseAdmin
          .from('transactions')
          .select('*')
          .eq('sender_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // Fetch incoming transactions
        const { data: received } = await supabaseAdmin
          .from('transactions')
          .select('*')
          .eq('recipient_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(20);

        const allMap = new Map();
        for (const tx of [...(sent || []), ...(received || [])]) {
          allMap.set(tx.id, tx);
        }
        const merged = Array.from(allMap.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 20);

        if (merged.length === 0) {
          return { content: [{ type: "text", text: "No transactions found." }] };
        }

        const lines = merged.map(tx => {
          const type = tx.sender_id === profile.id ? "SENT" : "RECEIVED";
          const otherId = type === "SENT" ? tx.recipient_universal_id : tx.sender_universal_id;
          return `[${tx.created_at}] ${type} ${tx.amount} ${tx.currency} (Hash: ${tx.tx_hash}, Peer: ${otherId}@Zp, Status: ${tx.status})`;
        });

        return { content: [{ type: "text", text: "Transaction History:\n" + lines.join("\n") }] };
      }

      if (request.params.name === "zpay_get_profile") {
        const details = `Universal ID: ${profile.universal_id}@Zp\nFull Name: ${profile.full_name}\nEmail: ${profile.email}\nStellar Address: ${profile.stellar_address}`;
        return { content: [{ type: "text", text: details }] };
      }

      if (request.params.name === "zpay_pay_x402") {
        const { merchant_address, amount, invoice_id, fee_address, fee_amount } = request.params.arguments;

        const sourceKeypair = StellarSdk.Keypair.fromSecret(profile.stellar_secret);
        const sourceAccount = await HORIZON_SERVER.loadAccount(sourceKeypair.publicKey());

        const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK_PASSPHRASE,
        }).addOperation(
          StellarSdk.Operation.payment({
            destination: merchant_address,
            asset: StellarSdk.Asset.native(),
            amount: String(amount),
          })
        );

        if (fee_address && fee_amount && Number(fee_amount) > 0) {
          txBuilder.addOperation(
            StellarSdk.Operation.payment({
              destination: fee_address,
              asset: StellarSdk.Asset.native(),
              amount: String(fee_amount),
            })
          );
        }

        txBuilder.addMemo(StellarSdk.Memo.text(invoice_id.substring(0, 28)));
        txBuilder.setTimeout(30);

        const transaction = txBuilder.build();
        transaction.sign(sourceKeypair);
        const result = await HORIZON_SERVER.submitTransaction(transaction);

        return { content: [{ type: "text", text: `Successfully paid X402 invoice! TxHash: ${result.hash}. You can now replay your API request using this TxHash as proof.` }] };
      }

      if (request.params.name === "zpay_create_split_contract") {
        const { splits, memo } = request.params.arguments;
        
        const sourceKeypair = StellarSdk.Keypair.fromSecret(profile.stellar_secret);
        const sourceAccount = await HORIZON_SERVER.loadAccount(sourceKeypair.publicKey());

        const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK_PASSPHRASE,
        });

        for (const split of splits) {
          txBuilder.addOperation(
            StellarSdk.Operation.payment({
              destination: split.address,
              asset: StellarSdk.Asset.native(),
              amount: String(split.amount),
            })
          );
        }

        if (memo) txBuilder.addMemo(StellarSdk.Memo.text(memo.substring(0, 28)));
        txBuilder.setTimeout(30);

        const transaction = txBuilder.build();
        transaction.sign(sourceKeypair);
        const result = await HORIZON_SERVER.submitTransaction(transaction);

        return { content: [{ type: "text", text: `Successfully executed split contract! TxHash: ${result.hash}` }] };
      }

      if (request.params.name === "zpay_transaction_history") {
        const { limit = 5 } = request.params.arguments;
        const page = await HORIZON_SERVER.payments()
          .forAccount(profile.stellar_address)
          .order("desc")
          .limit(limit)
          .call();
          
        const history = page.records.map(r => {
          if (r.type === 'payment' && r.asset_type === 'native') {
            const isSender = r.from === profile.stellar_address;
            return `${r.created_at}: ${isSender ? 'SENT' : 'RECEIVED'} ${r.amount} XLM ${isSender ? 'to ' + r.to : 'from ' + r.from} (Hash: ${r.transaction_hash})`;
          }
          return null;
        }).filter(Boolean);

        return { content: [{ type: "text", text: `Recent transactions:\n${history.join('\n') || 'No recent native XLM payments found.'}` }] };
      }

      if (request.params.name === "zpay_create_time_lock_contract") {
        const { destination, amount, unlock_timestamp_seconds } = request.params.arguments;

        const sourceKeypair = StellarSdk.Keypair.fromSecret(profile.stellar_secret);
        const sourceAccount = await HORIZON_SERVER.loadAccount(sourceKeypair.publicKey());

        const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK_PASSPHRASE,
          timebounds: {
            minTime: String(unlock_timestamp_seconds),
            maxTime: "0"
          }
        });

        txBuilder.addOperation(
          StellarSdk.Operation.payment({
            destination: destination,
            asset: StellarSdk.Asset.native(),
            amount: String(amount),
          })
        );

        const transaction = txBuilder.build();
        transaction.sign(sourceKeypair);
        const xdr = transaction.toEnvelope().toXDR('base64');

        return { content: [{ type: "text", text: `Time-locked contract created! This transaction CANNOT be submitted until timestamp ${unlock_timestamp_seconds}.\n\nTransaction XDR to submit later:\n${xdr}` }] };
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    } catch (error) {
      return { content: [{ type: "text", text: `Error executing tool: ${error.message}` }], isError: true };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runMcpServer().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
