# Prisma Migrations for Supabase

This directory contains Prisma configuration for managing database migrations with Supabase.

## Setup

The Prisma schema (`schema.prisma`) is configured to connect to your Supabase PostgreSQL database. Connection details are stored in the `.env` file at the project root.

## Migration Process

Due to security restrictions in Supabase, this project uses a hybrid approach to migrations:

1. **SQL Migration Files**: Stored in `prisma/migrations/sql/`
2. **Migration Assistant**: The `prisma:migrate` script identifies needed migrations and guides you through applying them manually via the Supabase SQL Editor

## Directory Structure

- `prisma/schema.prisma` - The Prisma schema definition (for querying only, not for migrations)
- `prisma/migrations/sql/` - SQL migration files
- `prisma/migrate.js` - Migration assistant script

## Commands

Run these commands from the project root:

### Generate Prisma Client

```bash
pnpm prisma:generate
```

This generates the Prisma Client based on your schema definition.

### Run Migration Assistant

```bash
pnpm prisma:migrate
```

This will:
1. Check which SQL migrations in `prisma/migrations/sql/` haven't been applied yet
2. Display SQL content that needs to be manually executed in the Supabase SQL Editor
3. Track which migrations have been applied (in memory if the migrations table doesn't exist yet)
4. Provide instructions for creating the `migrations` tracking table

### Explore Database with Prisma Studio

```bash
pnpm prisma:studio
```

Opens Prisma Studio, a visual database explorer.

## Adding New Migrations

1. Create a new SQL file in the `prisma/migrations/sql/` directory
2. Name it with a numeric prefix for ordering (e.g., `003_add_products_table.sql`)
3. Write your SQL migration
4. Run `pnpm prisma:migrate` to see instructions for applying it
5. Copy and paste the SQL into the Supabase SQL Editor and execute it
6. After running the SQL, record the migration in the `migrations` table

## First-Time Setup

When running migrations for the first time:

1. Run `pnpm prisma:migrate`
2. Execute each SQL file in the Supabase SQL Editor in order
3. Create the migrations tracking table using the provided SQL
4. Record each applied migration using the INSERT statements shown by the script

## Using Prisma Client in Your Code

```typescript
import prisma from 'src/lib/prisma';

// Example: Get all profiles
const profiles = await prisma.profile.findMany();
```

## Troubleshooting

- If you encounter connection issues, check your `.env` file and ensure the `DATABASE_URL` is correct
- Make sure you have the necessary permissions for your Supabase database
- Check that you've run `pnpm prisma:generate` after schema changes
- If migrations fail to execute in Supabase, ensure you're using the SQL Editor with admin privileges 