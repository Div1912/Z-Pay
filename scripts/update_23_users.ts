import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const indianNames = [
  "Aarav Patel", "Vihaan Sharma", "Aditya Verma", "Sai Kumar", "Arjun Singh",
  "Rohan Gupta", "Krishna Reddy", "Ishaan Joshi", "Shaurya Desai", "Dhruv Mehta",
  "Ananya Iyer", "Aadhya Menon", "Diya Nair", "Saanvi Rao", "Kavya Pillai",
  "Meera Das", "Riya Sen", "Nisha Kapoor", "Neha Ahuja", "Pooja Bhatt",
  "Kabir Malhotra", "Vivaan Saxena", "Aarohi Kulkarni"
];

async function main() {
  const { supabaseAdmin } = await import('../src/lib/supabase');
  
  console.log('Fetching the 23 recently created users...');
  
  // Get all users created with the mainnet_user prefix
  const { data: profiles, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, stellar_address')
    .like('email', 'mainnet_user_%@zpay.app');
    
  if (fetchError) {
    console.error('Error fetching users:', fetchError);
    return;
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No users found to update.');
    return;
  }

  console.log(`Found ${profiles.length} users. Updating with Indian names, no underscores, and pin 1912...`);
  
  const markdownLines = [];
  markdownLines.push('| # | Email | Z-Pay ID | Full Name | Stellar Wallet Address |');
  markdownLines.push('|---|-------|----------|-----------|------------------------|');

  for (let i = 0; i < profiles.length && i < indianNames.length; i++) {
    const profile = profiles[i];
    const fullName = indianNames[i];
    
    // Create a Z-Pay ID without underscores: e.g. "Aarav Patel" -> "aaravpatel"
    const universal_id = fullName.toLowerCase().replace(/\s+/g, '');
    
    // Update the profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        universal_id: universal_id,
        full_name: fullName,
        app_pin: '1912'
      })
      .eq('id', profile.id);
      
    if (updateError) {
      console.error(`Error updating ${profile.email}:`, updateError.message);
    } else {
      console.log(`[${i+1}/${profiles.length}] Updated ${profile.email} -> Z-Pay ID: ${universal_id}, Pin: 1912`);
      markdownLines.push(`| ${i+1} | \`${profile.email}\` | \`${universal_id}\` | ${fullName} | \`${profile.stellar_address}\` |`);
    }
  }
  
  // Output the markdown table to console
  console.log('\n--- MARKDOWN TABLE ---\n');
  console.log(markdownLines.join('\n'));
  console.log('\n----------------------\n');
  
  console.log('Done!');
}

main().catch(console.error);
