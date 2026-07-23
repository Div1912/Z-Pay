import { createClient } from "@supabase/supabase-js";
import * as StellarSdk from "@stellar/stellar-sdk";

const SUPABASE_URL = "https://mumdfrgyxhddtyuebonc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bWRmcmd5eGhkZHR5dWVib25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjExNzksImV4cCI6MjA5NzQzNzE3OX0.D7TBeq0xupZhqGyQ5d2xplFkLqAz189L2ueq-Eb-i-g";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HORIZON_SERVER = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

async function getBalance() {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'rajdivyanshu86@gmail.com',
      password: '1912Div@',
    });
    if (authError) throw authError;

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
    
    const account = await HORIZON_SERVER.loadAccount(profile.stellar_address);
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native')?.balance || "0";
    console.log(`Mainnet Balance: ${xlmBalance} XLM`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Account not found on mainnet (Balance is 0 or account is unfunded).");
    } else {
      console.error(error);
    }
  }
}
getBalance();
