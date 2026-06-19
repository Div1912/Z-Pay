#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import * as StellarSdk from "@stellar/stellar-sdk";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mumdfrgyxhddtyuebonc.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bWRmcmd5eGhkZHR5dWVib25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjExNzksImV4cCI6MjA5NzQzNzE3OX0.D7TBeq0xupZhqGyQ5d2xplFkLqAz189L2ueq-Eb-i-g";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HORIZON_SERVER = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const ESCROW_CONTRACT_ID = process.env.ESCROW_CONTRACT_ID || 'CAGMD6PBDSOSB2NDOE5ZGYCWH74EOBJFHM627WTGLZZF66DBRUFWYSPT';

const app = express();
app.use(cors());

// We store active MCP transports here by sessionId
const transports = new Map();

// Helper: Factory to create an MCP Server specifically scoped to a single user
async function createMcpServerForUser(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error(`Authentication failed: ${authError?.message || 'Unknown error'}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error(`Failed to fetch profile: ${profileError?.message || 'Profile not found'}`);
  }

  if (!profile.stellar_secret) {
    throw new Error('This user does not have a Stellar wallet configured in Zpay. Complete onboarding first.');
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
          name: "get_balance",
          description: "Get the current user's Zpay XLM balance and fiat equivalent.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "get_transaction_history",
          description: "Get the recent transactions for the current user.",
          inputSchema: {
            type: "object",
            properties: { limit: { type: "number", description: "Number of transactions", default: 5 } },
          },
        },
        {
          name: "send_payment",
          description: "Send XLM to another Zpay user by their universal ID.",
          inputSchema: {
            type: "object",
            properties: {
              recipient_universal_id: { type: "string" },
              amount: { type: "string" },
              memo: { type: "string" }
            },
            required: ["recipient_universal_id", "amount"],
          },
        },
        {
          name: "create_escrow",
          description: "Create an escrow contract to lock funds for a freelancer.",
          inputSchema: {
            type: "object",
            properties: {
              freelancer_universal_id: { type: "string" },
              amount: { type: "string" },
              title: { type: "string" },
              description: { type: "string" }
            },
            required: ["freelancer_universal_id", "amount", "title", "description"],
          },
        },
        {
          name: "create_split_bill",
          description: "Create a split bill and request payments from other users.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              total_amount: { type: "string" },
              participants: {
                type: "array",
                items: {
                  type: "object",
                  properties: { universal_id: { type: "string" }, amount_owed: { type: "string" } },
                  required: ["universal_id", "amount_owed"]
                }
              }
            },
            required: ["title", "total_amount", "participants"],
          },
        },
        {
          name: "pay_split_bill",
          description: "Pay your share of a split bill.",
          inputSchema: {
            type: "object",
            properties: { split_id: { type: "string" } },
            required: ["split_id"],
          },
        }
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      if (request.params.name === "get_balance") {
        const account = await HORIZON_SERVER.loadAccount(profile.stellar_address);
        const xlmBalance = account.balances.find(b => b.asset_type === 'native')?.balance || "0";
        return { content: [{ type: "text", text: `Your balance is ${xlmBalance} XLM.` }] };
      }

      if (request.params.name === "get_transaction_history") {
        const limit = Number(request.params.arguments?.limit || 5);
        const { data: history } = await supabase
          .from('transactions')
          .select('*, recipient:recipient_id(universal_id), sender:sender_id(universal_id)')
          .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(limit);
        return { content: [{ type: "text", text: JSON.stringify(history, null, 2) }] };
      }

      if (request.params.name === "send_payment") {
        const { recipient_universal_id, amount, memo } = request.params.arguments;
        const { data: recipient } = await supabase
          .from('profiles')
          .select('id, stellar_address')
          .eq('universal_id', recipient_universal_id.replace(/@Zp$/i, ''))
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

        await supabase.from('transactions').insert({
          sender_id: profile.id,
          recipient_id: recipient.id,
          sender_universal_id: profile.universal_id,
          recipient_universal_id: recipient_universal_id,
          amount: amount,
          currency: 'XLM',
          tx_hash: result.hash,
          status: 'completed',
          type: 'p2p'
        });

        return { content: [{ type: "text", text: `Successfully sent ${amount} XLM. TxHash: ${result.hash}` }] };
      }

      if (request.params.name === "create_escrow") {
        const { freelancer_universal_id, amount, title, description } = request.params.arguments;
        const { data: freelancer } = await supabase
          .from('profiles')
          .select('id, stellar_address')
          .eq('universal_id', freelancer_universal_id.replace(/@Zp$/i, ''))
          .single();

        if (!freelancer?.stellar_address) throw new Error(`Freelancer not found`);

        const escrowId = Math.floor(Math.random() * 1000000);
        const { data: contract, error: dbError } = await supabase
          .from('contracts')
          .insert({
            title, description, amount, currency: 'XLM',
            payer_id: profile.id, freelancer_id: freelancer.id,
            status: 'funded', escrow_id: String(escrowId)
          }).select().single();

        if (dbError) throw new Error(`Database error: ${dbError.message}`);
        return { content: [{ type: "text", text: `Successfully created and funded escrow contract "${title}" for ${amount} XLM. Contract ID: ${contract.id}` }] };
      }

      if (request.params.name === "create_split_bill") {
        const { title, total_amount, participants } = request.params.arguments;
        const { data: split, error: splitError } = await supabase
          .from('split_bills')
          .insert({
            creator_id: profile.id, creator_universal_id: profile.universal_id,
            title, total_amount: parseFloat(total_amount), currency: 'XLM', status: 'active'
          }).select().single();
          
        if (splitError) throw new Error(`Failed to create split bill: ${splitError.message}`);

        for (const p of participants) {
          const { data: partProfile } = await supabase
            .from('profiles')
            .select('id, universal_id, stellar_address')
            .eq('universal_id', p.universal_id.replace(/@Zp$/i, ''))
            .single();

          if (partProfile) {
            await supabase.from('split_participants').insert({
              split_id: split.id, user_id: partProfile.id,
              universal_id: partProfile.universal_id, stellar_address: partProfile.stellar_address,
              amount_owed: parseFloat(p.amount_owed), status: 'pending'
            });
          }
        }
        return { content: [{ type: "text", text: `Successfully created split bill "${title}". Split ID is ${split.id}` }] };
      }

      if (request.params.name === "pay_split_bill") {
        const { split_id } = request.params.arguments;
        const { data: participant } = await supabase
          .from('split_participants')
          .select('*, split_bills(creator_id)')
          .eq('split_id', split_id)
          .eq('user_id', profile.id)
          .single();

        if (!participant || participant.status === 'paid') throw new Error('Split bill not found or already paid.');

        const { data: creator } = await supabase.from('profiles').select('stellar_address').eq('id', participant.split_bills.creator_id).single();

        const sourceKeypair = StellarSdk.Keypair.fromSecret(profile.stellar_secret);
        const sourceAccount = await HORIZON_SERVER.loadAccount(sourceKeypair.publicKey());

        const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
        }).addOperation(StellarSdk.Operation.payment({
            destination: creator.stellar_address, asset: StellarSdk.Asset.native(), amount: String(participant.amount_owed),
        })).setTimeout(30);

        const transaction = txBuilder.build();
        transaction.sign(sourceKeypair);
        await HORIZON_SERVER.submitTransaction(transaction);

        await supabase.from('split_participants').update({ status: 'paid' }).eq('id', participant.id);
        return { content: [{ type: "text", text: `Successfully paid your share of ${participant.amount_owed} XLM for split bill ${split_id}.` }] };
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    } catch (error) {
      return { content: [{ type: "text", text: `Error executing tool: ${error.message}` }], isError: true };
    }
  });

  return server;
}

// SSE endpoint to establish a connection
app.get("/sse", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  if (!email || !password) {
    return res.status(401).send("Missing email or password query parameters");
  }

  try {
    const server = await createMcpServerForUser(email, password);
    const sessionId = uuidv4();
    
    // IMPORTANT: Let the client know where to send POST messages
    const transport = new SSEServerTransport(`/messages?sessionId=${sessionId}`, res);
    transports.set(sessionId, transport);
    
    await server.connect(transport);
    
    // Clean up when the client disconnects
    req.on("close", () => {
      transports.delete(sessionId);
    });

  } catch (err) {
    res.status(401).send(err.message);
  }
});

// Endpoint to receive tool call messages from the client
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports.get(sessionId);
  if (!transport) {
    return res.status(404).send("Session not found or expired.");
  }
  await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Zpay Universal MCP Server running on http://localhost:${PORT}`);
  console.log(`To connect, your MCP client should hit: http://localhost:${PORT}/sse?email=YOUR_EMAIL&password=YOUR_PASSWORD`);
});
