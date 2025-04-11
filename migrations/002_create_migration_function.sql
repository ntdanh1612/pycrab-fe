-- Create function to create migration tracking table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_migration_table_if_not_exists(migration_table text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )', migration_table);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 