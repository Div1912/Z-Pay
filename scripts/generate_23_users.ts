import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load environment variables before importing modules that depend on them
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const { supabaseAdmin } = await import('../src/lib/supabase');
  const { createStellarAccount } = await import('../src/lib/stellar');

  console.log('Generating 23 random mainnet users...');
  
  for (let i = 0; i < 23; i++) {
    const randomString = crypto.randomBytes(4).toString('hex');
    const email = `mainnet_user_${randomString}@zpay.app`;
    const password = '1912Div@';
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError || !authData.user) {
      console.error(`[${i+1}/23] Error creating auth user ${email}:`, authError?.message);
      continue;
    }
    
    const userId = authData.user.id;
    
    // 2. Generate stellar wallet
    const { publicKey, secretKey } = await createStellarAccount();
    
    // 3. Generate ZPay ID
    const universal_id = `user_${randomString}`;
    
    // 4. Upsert profile (handles both cases where a trigger might have created the row or not)
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email: email,
      universal_id: universal_id,
      stellar_address: publicKey,
      stellar_secret: secretKey,
      full_name: `Mainnet User ${randomString}`,
      app_pin: '1234', // Default PIN for testing
      preferred_currency: 'XLM',
    });
    
    if (profileError) {
      console.error(`[${i+1}/23] Error updating profile for ${email}:`, profileError.message);
    } else {
      console.log(`[${i+1}/23] Created: Email: ${email}, ZPay ID: ${universal_id}, Wallet: ${publicKey}`);
    }
  }
  
  console.log('Done!');
}

main().catch(console.error);
