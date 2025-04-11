# Setting Up Supabase for Gift & Souvenir Authentication

This guide will walk you through setting up Supabase for authentication in the Gift & Souvenir e-commerce project.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't have one
2. Create a new project
3. Note down your project URL and anon key, which you'll need later

## 2. Configure Environment Variables

1. Create a `.env` file in the root of your project by copying `.env.example`
2. Fill in the Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Run Database Migrations

The migrations need to be run directly in Supabase. Here's how:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor section
3. Create a new query
4. Copy the contents of `migrations/001_create_auth_tables.sql` and execute it
5. Create another query with the contents of `migrations/002_create_migration_function.sql` and execute it
6. Create the migrations tracking table:

```sql
SELECT create_migration_table_if_not_exists('migrations');
```

7. Record the applied migrations:

```sql
INSERT INTO migrations (name) 
VALUES ('001_create_auth_tables.sql'), ('002_create_migration_function.sql');
```

## 4. Configure Authentication Settings in Supabase

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Site URL", add your website's URL (e.g., `http://localhost:5173` for local development)
3. Under "Redirect URLs", add the following:
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/verify`
4. Enable "Email Confirmation" if you want users to verify their email address
5. Customize the email templates for Password Recovery and Email Confirmation if desired

## 5. Testing the Setup

1. Start your application with `npm run dev`
2. Try to register a new user
3. Check the Supabase dashboard to see if a new user was created
4. Verify that a corresponding entry was created in the `profiles` table

## Troubleshooting

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Check the Supabase logs for any backend errors
4. Ensure the SQL migrations were executed successfully
5. Make sure Row Level Security (RLS) policies are correctly set up

## Additional Configuration

### Enable Social Login (Optional)

1. Go to Authentication > Providers in the Supabase dashboard
2. Configure the providers you want to use (Google, Facebook, etc.)
3. Follow the provider-specific instructions to obtain client IDs and secrets
4. Update the redirect URLs as needed

### Custom Email Templates (Optional)

1. Go to Authentication > Email Templates in the Supabase dashboard
2. Customize the templates to match your brand

### SMS Verification (Optional)

1. Go to Authentication > SMS Templates in the Supabase dashboard
2. Configure a Twilio account for SMS verification
3. Customize the SMS templates

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signin)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 