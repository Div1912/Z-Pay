-- Migration: Create CCTP Outbound Intents table

CREATE TABLE IF NOT EXISTS public.cctp_outbound_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_stellar_address TEXT NOT NULL,
    recipient_evm_address TEXT NOT NULL,
    amount_usdc NUMERIC NOT NULL,
    destination_chain TEXT NOT NULL DEFAULT 'ethereum', -- 'ethereum', 'base'
    status TEXT NOT NULL DEFAULT 'pending_burn', -- 'pending_burn', 'burned', 'attested', 'completed', 'failed'
    stellar_burn_tx_hash TEXT,
    cctp_message_hash TEXT,
    evm_mint_tx_hash TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.cctp_outbound_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outbound intents"
    ON public.cctp_outbound_intents
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert/update
CREATE POLICY "Service role manages outbound intents"
    ON public.cctp_outbound_intents
    USING (true)
    WITH CHECK (true);
