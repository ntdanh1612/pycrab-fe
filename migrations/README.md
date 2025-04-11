# Database Migrations

This folder contains database migrations for the Gift & Souvenir e-commerce project.

## How to Run Migrations

These migrations are designed to be run against a Supabase database. 

### Option 1: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of the migration file you want to run
5. Execute the query

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push
```

## Migration Order

Please run migrations in the following order:

1. `001_create_auth_tables.sql` - Sets up basic authentication tables
2. `002_create_migration_function.sql` - Creates the function for migration tracking

## Manual Migration Tracking

After running each migration, you should record it in the migrations table:

```sql
INSERT INTO migrations (name, applied_at) 
VALUES ('001_create_auth_tables.sql', NOW());
```

## Troubleshooting

If you encounter any issues with migrations:

1. Check that you're running them in the correct order
2. Ensure you have the necessary permissions
3. Look for any error messages in the Supabase dashboard logs 