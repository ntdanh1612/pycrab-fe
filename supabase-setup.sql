-- SUPABASE AUTHENTICATION SETUP
-- This file contains the complete setup for authentication with Supabase
-- It creates the necessary tables, functions, triggers, and policies
-- Plus adds a default admin account

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create password reset tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID NOT NULL,
  token TEXT UNIQUE NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create verification tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID NOT NULL,
  token TEXT UNIQUE NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create function to automatically update updated_at field
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_verified)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS policies for tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Password reset tokens are only accessible to the specific user" ON public.password_reset_tokens;
CREATE POLICY "Password reset tokens are only accessible to the specific user"
  ON public.password_reset_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Verification tokens are only accessible to the specific user" ON public.verification_tokens;
CREATE POLICY "Verification tokens are only accessible to the specific user"
  ON public.verification_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Add admin access policy for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Allow public to read verification tokens by token (for verification without login)
DROP POLICY IF EXISTS "Anyone can read verification tokens by token" ON public.verification_tokens;
CREATE POLICY "Anyone can read verification tokens by token"
  ON public.verification_tokens
  FOR SELECT
  USING (true);

-- Add migration tracking table
CREATE TABLE IF NOT EXISTS public.migrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- IMPORTANT: To create the default admin user, follow these steps in the Supabase dashboard:

-- 1. Go to Authentication > Users section
-- 2. Click "Add User" button
-- 3. Enter the email: thanhdanhit17@gmail.com
-- 4. Enter a secure password
-- 5. After creating the user, note the UUID of the created user
-- 6. Run the following SQL query with the correct UUID:

-- UPDATE public.profiles 
-- SET role = 'admin', is_verified = true, name = 'Admin User'
-- WHERE email = 'thanhdanhit17@gmail.com';

-- Alternatively, you can use this SQL to create the admin user directly:
-- Replace 'your-secure-password' with an actual secure password

/*
-- This part should be run manually in the Supabase SQL editor when ready

-- Create admin user with Supabase auth functions
SELECT supabase_admin.create_user(
  email := 'thanhdanhit17@gmail.com',
  password := 'your-secure-password',
  email_confirm := true,
  data := '{"name":"Admin User"}'
);

-- Get the user's UUID
DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'thanhdanhit17@gmail.com';
  
  -- Update the user's profile to admin role
  UPDATE public.profiles
  SET role = 'admin', is_verified = true
  WHERE id = user_id;
END $$;
*/

-- Record this migration
INSERT INTO public.migrations (name) 
VALUES ('001_auth_tables_with_admin_setup')
ON CONFLICT (name) DO NOTHING; 