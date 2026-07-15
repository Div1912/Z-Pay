-- Migration: Add Fiat Balance and Stripe Connect ID to Profiles

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS fiat_balance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS fiat_currency TEXT DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT UNIQUE;

-- Create an index on stripe_connect_id for faster lookups during webhooks
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_connect_id ON public.profiles(stripe_connect_id);
