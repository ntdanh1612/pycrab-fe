-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop existing trigger functions if they exist
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Enhanced function to handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name TEXT;
  last_name TEXT;
  name TEXT;
BEGIN
  -- Handle metadata for names
  first_name := NEW.raw_user_meta_data->>'first_name';
  last_name := NEW.raw_user_meta_data->>'last_name';
  
  -- If first_name is null, try to extract from name
  IF first_name IS NULL THEN
    name := NEW.raw_user_meta_data->>'name';
    IF name IS NOT NULL THEN
      first_name := split_part(name, ' ', 1);
      last_name := substr(name, length(first_name) + 2);
    END IF;
  END IF;
  
  -- Create a record in the users table
  INSERT INTO public.users (id, email, password_hash, email_verified)
  VALUES (
    NEW.id, 
    NEW.email, 
    'MANAGED_BY_SUPABASE_AUTH', 
    NEW.email_confirmed_at IS NOT NULL
  );
  
  -- Create a profile for the new user
  INSERT INTO public.profiles (
    id, 
    user_id, 
    first_name, 
    last_name, 
    avatar_url, 
    role
  )
  VALUES (
    uuid_generate_v4(),
    NEW.id,
    first_name,
    last_name,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details to the PostgreSQL log
    RAISE NOTICE 'Error in handle_new_user trigger: %, SQLSTATE: %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated function to update user profiles when auth user is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user record
  UPDATE public.users
  SET 
    email = NEW.email,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details to the PostgreSQL log
    RAISE NOTICE 'Error in handle_user_update trigger: %, SQLSTATE: %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the triggers with the fixed functions
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Insert into migrations table
INSERT INTO migrations (name) VALUES ('002_fix_auth_triggers.sql') ON CONFLICT (name) DO NOTHING; 