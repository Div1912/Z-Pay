CREATE TABLE IF NOT EXISTS public.waitlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into the waitlist
CREATE POLICY "Allow public insert on waitlists" 
ON public.waitlists FOR INSERT 
TO public
WITH CHECK (true);

-- Only allow service role (admin) to view the waitlist
CREATE POLICY "Allow service role read on waitlists" 
ON public.waitlists FOR SELECT 
TO service_role 
USING (true);
