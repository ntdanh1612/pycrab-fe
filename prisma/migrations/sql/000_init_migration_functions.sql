-- Create function to execute arbitrary SQL
-- This needs to be enabled by an admin user in Supabase dashboard
CREATE OR REPLACE FUNCTION exec(sql text) RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create migration tracking table
CREATE OR REPLACE FUNCTION create_migration_table_if_not_exists(migration_table text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )', migration_table);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 