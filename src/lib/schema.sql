-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Donors table (for anonymous donations)
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

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  target_amount NUMERIC(15,2),
  current_amount NUMERIC(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  receipt_sent BOOLEAN DEFAULT FALSE,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Donation receipts table
CREATE TABLE IF NOT EXISTS public.donation_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  receipt_number TEXT UNIQUE NOT NULL,
  receipt_url TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Internships table
CREATE TABLE IF NOT EXISTS public.internships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  position TEXT NOT NULL,
  duration_weeks INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Impact updates/logs table
CREATE TABLE IF NOT EXISTS public.impact_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
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
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_status ON public.donations(status);
CREATE INDEX idx_payments_donation_id ON public.payments(donation_id);
CREATE INDEX idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX idx_internships_user_id ON public.internships(user_id);
CREATE INDEX idx_impact_updates_project_id ON public.impact_updates(project_id);

-- Create RLS (Row Level Security) policies

-- Users table policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Donations table policies
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are viewable by anyone (for public stats)"
  ON public.donations FOR SELECT
  USING (true);

-- Payments table policies (sensitive data)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can view payments"
  ON public.payments FOR SELECT
  USING (FALSE);

-- Projects table policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

-- Impact updates policies
ALTER TABLE public.impact_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Impact updates are viewable by everyone"
  ON public.impact_updates FOR SELECT
  USING (true);
