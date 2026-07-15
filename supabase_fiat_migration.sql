-- Migration: Add Fiat Balance and Razorpay Fund Account ID to Profiles

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS fiat_balance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS fiat_currency TEXT DEFAULT 'inr',
ADD COLUMN IF NOT EXISTS razorpay_fund_account_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS razorpay_contact_id TEXT UNIQUE;

-- Create indexes for faster lookups during webhooks
CREATE INDEX IF NOT EXISTS idx_profiles_razorpay_fund_account_id ON public.profiles(razorpay_fund_account_id);
CREATE INDEX IF NOT EXISTS idx_profiles_razorpay_contact_id ON public.profiles(razorpay_contact_id);
