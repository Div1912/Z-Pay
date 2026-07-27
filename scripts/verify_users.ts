import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const { supabaseAdmin } = await import('../src/lib/supabase');
  
  console.log('Fetching all mainnet users from the database for verification...');
  
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('email, universal_id, full_name, stellar_address')
    .like('email', 'mainnet_user_%@zpay.app')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No mainnet users found.');
    return;
  }

  console.log(`Found ${profiles.length} users. Generating verified table...\n`);
  
  const markdownLines = [];
  markdownLines.push('| # | Email | Z-Pay ID | Full Name | Stellar Wallet Address |');
  markdownLines.push('|---|-------|----------|-----------|------------------------|');

  profiles.forEach((profile, i) => {
    markdownLines.push(`| ${i+1} | \`${profile.email}\` | \`${profile.universal_id}\` | ${profile.full_name} | \`${profile.stellar_address}\` |`);
  });
  
  console.log('--- START MARKDOWN TABLE ---');
  console.log(markdownLines.join('\n'));
  console.log('--- END MARKDOWN TABLE ---');
}

main().catch(console.error);
