-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Donors table (for all donations)
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  pan_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  receive_newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interns table (must be created BEFORE donations table since donations references it)
CREATE TABLE IF NOT EXISTS public.interns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Donations table (consolidated - all payment info included)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  intern_id UUID REFERENCES public.interns(id) ON DELETE SET NULL,
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  message TEXT,
  referral_code TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  receipt_sent BOOLEAN DEFAULT FALSE,
  receipt_number TEXT UNIQUE,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Intern sessions table
CREATE TABLE IF NOT EXISTS public.intern_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id UUID NOT NULL REFERENCES public.interns(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Managers table for authentication
CREATE TABLE IF NOT EXISTS public.managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO public.managers (email, password_hash, full_name, is_active)
VALUES ('admin@b.c', 'password', 'Admin User', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_intern_id ON public.donations(intern_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_referral_code ON public.donations(referral_code);
CREATE INDEX IF NOT EXISTS idx_interns_email ON public.interns(email);
CREATE INDEX IF NOT EXISTS idx_interns_referral_code ON public.interns(referral_code);
CREATE INDEX IF NOT EXISTS idx_intern_sessions_token ON public.intern_sessions(token);

-- Enable RLS (Row Level Security)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (without IF NOT EXISTS - PostgreSQL doesn't support it for policies)
-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Donations are viewable by anyone (for public stats)" ON public.donations;

CREATE POLICY "Donations are viewable by anyone (for public stats)"
  ON public.donations FOR SELECT
  USING (true);
