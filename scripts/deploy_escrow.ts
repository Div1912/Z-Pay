import * as StellarSdk from '@stellar/stellar-sdk';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Force mainnet settings
const SOROBAN_RPC_URL = 'https://mainnet.sorobanrpc.com';
const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;

const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

async function deployContract(wasmPath: string, keypair: StellarSdk.Keypair): Promise<string> {
    console.log(`\nDeploying from ${wasmPath}...`);
    const wasm = fs.readFileSync(wasmPath);
    let account = await server.getAccount(keypair.publicKey());

    // 1. Upload Wasm
    console.log('Uploading WASM...');
    let tx = new StellarSdk.TransactionBuilder(account, {
        fee: '10000000',
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(StellarSdk.Operation.uploadContractWasm({ wasm }))
    .setTimeout(300)
    .build();

    let prepared = await server.prepareTransaction(tx);
    prepared.sign(keypair);
    let sendRes = await server.sendTransaction(prepared);

    if (sendRes.status === 'ERROR') {
        throw new Error(`Upload failed: ${sendRes.errorResult?.toXDR('base64')}`);
    }

    let getRes = await server.getTransaction(sendRes.hash);
    while (getRes.status === 'NOT_FOUND') {
        await new Promise(r => setTimeout(r, 2000));
        getRes = await server.getTransaction(sendRes.hash);
    }

    if (getRes.status !== 'SUCCESS') {
        throw new Error(`Upload transaction failed: ${getRes.status}`);
    }

    let wasmId;
    if (getRes.returnValue) {
        wasmId = (getRes.returnValue.value() as Buffer).toString('hex');
    } else {
        throw new Error('Failed to retrieve wasmId');
    }
    console.log(`Wasm ID: ${wasmId}`);

    // 2. Create Contract
    console.log('Creating contract instance...');
    account = await server.getAccount(keypair.publicKey());
    
    const salt = crypto.randomBytes(32);
    
    tx = new StellarSdk.TransactionBuilder(account, {
        fee: '10000000',
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(StellarSdk.Operation.createCustomContract({
        address: new StellarSdk.Address(keypair.publicKey()),
        wasmHash: Buffer.from(wasmId, 'hex'),
        salt: salt
    }))
    .setTimeout(300)
    .build();

    prepared = await server.prepareTransaction(tx);
    prepared.sign(keypair);
    sendRes = await server.sendTransaction(prepared);

    if (sendRes.status === 'ERROR') {
        throw new Error(`Create failed: ${sendRes.errorResult?.toXDR('base64')}`);
    }

    getRes = await server.getTransaction(sendRes.hash);
    while (getRes.status === 'NOT_FOUND') {
        await new Promise(r => setTimeout(r, 2000));
        getRes = await server.getTransaction(sendRes.hash);
    }

    if (getRes.status !== 'SUCCESS') {
        throw new Error(`Create transaction failed: ${getRes.status}`);
    }

    const contractIdStr = StellarSdk.Address.fromScAddress(getRes.returnValue!.address()).toString();
    console.log(`Contract Deployed: ${contractIdStr}`);
    
    return contractIdStr;
}

async function run() {
    const secret = process.env.DEPLOYER_SECRET_KEY;
    if (!secret) {
        console.error('Error: DEPLOYER_SECRET_KEY must be set.');
        process.exit(1);
    }
    
    const deployer = StellarSdk.Keypair.fromSecret(secret);
    console.log(`Using mainnet deployer: ${deployer.publicKey()}`);
    
    try {
        const wasmPath = path.join(process.cwd(), 'contracts/escrow/target/wasm32-unknown-unknown/release/soroban_escrow_contract.optimized.wasm');
        
        if (!fs.existsSync(wasmPath)) {
             console.error(`Error: WASM not found at ${wasmPath}`);
             process.exit(1);
        }
        
        const escrowContractId = await deployContract(wasmPath, deployer);
        
        console.log('\n======================================================');
        console.log('DEPLOYMENT COMPLETE!');
        console.log(`ESCROW_CONTRACT_ID=${escrowContractId}`);
        console.log('======================================================\n');
        
    } catch (e) {
        console.error('Deployment error:', e);
    }
}

run();
