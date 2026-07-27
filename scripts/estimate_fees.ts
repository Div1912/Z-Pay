import * as StellarSdk from '@stellar/stellar-sdk';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const SOROBAN_RPC_URL = 'https://mainnet.sorobanrpc.com';
const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;

const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

async function estimateContractCost(wasmPath: string, contractName: string, keypair: StellarSdk.Keypair) {
    if (!fs.existsSync(wasmPath)) {
        console.log(`Skipping ${contractName} - WASM not found at ${wasmPath}`);
        return null;
    }

    const wasm = fs.readFileSync(wasmPath);
    let account = await server.getAccount(keypair.publicKey());

    // 1. Simulate Upload Wasm
    let uploadTx = new StellarSdk.TransactionBuilder(account, {
        fee: '1000000', // Mock high fee for simulation
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(StellarSdk.Operation.uploadContractWasm({ wasm }))
    .setTimeout(300)
    .build();

    let preparedUpload = await server.prepareTransaction(uploadTx);
    
    // The fee added by prepareTransaction is the resource fee + base fee
    const uploadFeeStroops = BigInt(preparedUpload.fee);
    const uploadFeeXLM = Number(uploadFeeStroops) / 10000000;

    // We can't strictly simulate Create without actually uploading, because the wasmHash doesn't exist on ledger yet.
    // However, the cost of createCustomContract is generally very small and predictable (~0.005 XLM).
    // The major cost is the upload.
    // So we'll estimate Create as a fixed small fee, plus state reserves.
    
    const createFeeXLM = 0.05; // safe upper bound for create call resource fee
    
    const ledgerReserveXLM = 1.5; // 1 XLM for WASM entry, 0.5 XLM for Contract instance entry
    
    const totalCostXLM = uploadFeeXLM + createFeeXLM + ledgerReserveXLM;

    console.log(`--- ${contractName.toUpperCase()} CONTRACT ---`);
    console.log(`Upload Tx Fee (Network + Resources): ${uploadFeeXLM.toFixed(4)} XLM`);
    console.log(`Create Tx Fee (Network + Resources): ~${createFeeXLM.toFixed(4)} XLM`);
    console.log(`State Storage Reserve (Refundable):  ${ledgerReserveXLM.toFixed(4)} XLM`);
    console.log(`TOTAL COST ESTIMATE:                 ~${totalCostXLM.toFixed(4)} XLM`);
    console.log(``);

    return totalCostXLM;
}

async function run() {
    const secret = process.env.DEPLOYER_SECRET_KEY;
    if (!secret) {
        console.error('Error: DEPLOYER_SECRET_KEY must be set.');
        process.exit(1);
    }
    
    const deployer = StellarSdk.Keypair.fromSecret(secret);
    console.log(`\nEstimating for deployer: ${deployer.publicKey()}\n`);
    
    let totalAll = 0;
    
    const escrowPath = path.join(process.cwd(), 'contracts/escrow/target/wasm32-unknown-unknown/release/soroban_escrow_contract.optimized.wasm');
    const escrowCost = await estimateContractCost(escrowPath, 'Escrow', deployer);
    if (escrowCost) totalAll += escrowCost;
    
    const poolPath = path.join(process.cwd(), 'contracts/pool/target/wasm32-unknown-unknown/release/soroban_pool_contract.optimized.wasm');
    const poolCost = await estimateContractCost(poolPath, 'Pool', deployer);
    if (poolCost) totalAll += poolCost;
    
    const stakingPath = path.join(process.cwd(), 'contracts/staking/target/wasm32-unknown-unknown/release/soroban_staking_contract.optimized.wasm');
    const stakingCost = await estimateContractCost(stakingPath, 'Staking', deployer);
    if (stakingCost) totalAll += stakingCost;
    
    console.log(`======================================================`);
    console.log(`TOTAL ESTIMATED COST FOR ALL 3 CONTRACTS: ~${totalAll.toFixed(4)} XLM`);
    
    // Also consider the deployer account base reserve: 1 XLM (base) + 0.5 (per trustline).
    // But since the account already exists, we just need the delta.
    
    console.log(`======================================================\n`);
}

run().catch(console.error);
