const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mumdfrgyxhddtyuebonc.supabase.co';
const supabaseKey = 'sb_secret_GjX76to1Jg_B8NuL1ty30Q_pZZkiZaZ';
const supabase = createClient(supabaseUrl, supabaseKey);

const wallets = [
  "GAMGWD4L5BF6WFMTUXYDEL5M527B2RBHCR5QI7XDWKSJWCECFV2KJCH2", // Ujjwal
  "GDLOGDZZ6LNST5MWU7SGNGRJH2OX7RV23JNVBIHR7WFGAH3YXMMQ7UCT", // Raghu
  "GB4AVIHKU7BZHE56ZH6VWT2XRSVXY3YDFV6ANZTB5BX4TXGA4E52AZD2", // Krishna
  "GCF55BBS6NK7SMGBXDN3TA3FTVITDKQ54NFWFONM2DSNJJKWHJ4PPXMB", // Liza
  "GDAGTCA3ZNX2FAT6MIXO6KBXZAPDLKPM2Y7JUF5U3ZWCXVHW3RVWWUA6", // Sinhajee
  "GBCV4R7RKYY2SUFQ6WIF7LKBDDX7CFCY4THZF3IWSAFXUI5LG5CGS6EZ"  // Hritik Raj
];

async function main() {
  for (const wallet of wallets) {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, universal_id')
      .eq('stellar_address', wallet)
      .single();
      
    if (error) {
      console.log(`Error for ${wallet}:`, error.message);
    } else {
      console.log(`Wallet ${wallet} -> Email: ${data.email} | ID: ${data.universal_id}`);
    }
  }
}

main();
