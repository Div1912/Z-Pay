import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const { supabaseAdmin } = await import('../src/lib/supabase');
  
  console.log('Reverting the first two users to Alice Smith and Bob Johnson...');
  
  // Update User 1 (Alice Smith)
  const email1 = 'mainnet_user_3c495de5@zpay.app';
  const { error: err1 } = await supabaseAdmin
    .from('profiles')
    .update({
      universal_id: 'alice_smith',
      full_name: 'Alice Smith'
    })
    .eq('email', email1);
    
  if (err1) console.error('Error updating User 1:', err1.message);
  else console.log(`Successfully reverted ${email1} to Alice Smith (alice_smith)`);

  // Update User 2 (Bob Johnson)
  const email2 = 'mainnet_user_f4dbae61@zpay.app';
  const { error: err2 } = await supabaseAdmin
    .from('profiles')
    .update({
      universal_id: 'bob_johnson',
      full_name: 'Bob Johnson'
    })
    .eq('email', email2);
    
  if (err2) console.error('Error updating User 2:', err2.message);
  else console.log(`Successfully reverted ${email2} to Bob Johnson (bob_johnson)`);

  console.log('Done!');
}

main().catch(console.error);
