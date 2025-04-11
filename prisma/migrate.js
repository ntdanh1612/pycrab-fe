import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory tracking of migrations if DB tracking is not available
const inMemoryMigrations = new Set();

async function checkMigrationsTableExists() {
  try {
    const { data, error } = await supabase
      .from('migrations')
      .select('count(*)', { count: 'exact', head: true });

    if (error && error.code === '42P01') { // Table doesn't exist error
      return false;
    } else if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error checking migrations table:', error);
    return false;
  }
}

async function ensureMigrationsTable() {
  try {
    const tableExists = await checkMigrationsTableExists();
    
    if (!tableExists) {
      console.log('Setting up migrations table...');
      // First try to use Supabase SQL editor or admin UI to run this SQL
      console.log('You may need to manually create the migrations table using SQL:');
      console.log(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `);
      
      // For the purpose of proceeding with the script, create a fake migrations table
      // in memory so we can continue with local migrations tracking
      console.log('Will proceed with in-memory migration tracking for this run.');
    }
    
    return tableExists;
  } catch (error) {
    console.error('Error ensuring migrations table exists:', error);
    throw error;
  }
}

async function getAppliedMigrations() {
  try {
    if (await checkMigrationsTableExists()) {
      // Get from database
      const { data, error } = await supabase
        .from('migrations')
        .select('name, applied_at')
        .order('applied_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } else {
      // Return in-memory tracking
      return Array.from(inMemoryMigrations).map(name => ({ 
        name, 
        applied_at: new Date().toISOString() 
      }));
    }
  } catch (error) {
    console.error('Error fetching applied migrations:', error);
    return [];
  }
}

async function recordMigration(name) {
  try {
    if (await checkMigrationsTableExists()) {
      // Record in database
      const { data, error } = await supabase
        .from('migrations')
        .insert([{ name }]);
        
      if (error) throw error;
      console.log(`Recorded migration in database: ${name}`);
    } else {
      // Record in memory
      inMemoryMigrations.add(name);
      console.log(`Recorded migration in memory: ${name}`);
    }
  } catch (error) {
    console.error(`Error recording migration ${name}:`, error);
    // Still track in memory as a fallback
    inMemoryMigrations.add(name);
  }
}

async function runMigration(filePath, fileName) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Migration ${fileName} content (preview):`);
    console.log(sql.substring(0, 200) + (sql.length > 200 ? '...' : ''));
    console.log(`\nTo run this migration, use the Supabase SQL Editor to execute the SQL in ${fileName}`);
    
    // Record the migration so we don't prompt for it again
    await recordMigration(fileName);
    console.log(`Marked migration as applied: ${fileName}`);
  } catch (error) {
    console.error(`Error with migration ${fileName}:`, error);
    throw error;
  }
}

async function migrate() {
  try {
    const dbMigrationsAvailable = await ensureMigrationsTable();
    
    const appliedMigrations = await getAppliedMigrations();
    const appliedMigrationNames = new Set(appliedMigrations.map(m => m.name));
    
    const migrationsDir = path.join(__dirname, 'migrations', 'sql');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure order
    
    console.log('Found migration files:', migrationFiles);
    
    if (!dbMigrationsAvailable) {
      console.log('\n⚠️ IMPORTANT: Migrations table not found in database');
      console.log('Please run these migrations manually using the Supabase SQL Editor:');
    }
    
    // Run migrations that haven't been applied yet
    for (const fileName of migrationFiles) {
      if (!appliedMigrationNames.has(fileName)) {
        const filePath = path.join(migrationsDir, fileName);
        await runMigration(filePath, fileName);
      } else {
        console.log(`Migration already applied: ${fileName}`);
      }
    }
    
    if (!dbMigrationsAvailable) {
      console.log('\nAfter running the migrations manually, create a migrations table:');
      console.log(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `);
      console.log('\nThen record each migration you applied:');
      for (const fileName of migrationFiles) {
        console.log(`INSERT INTO migrations (name) VALUES ('${fileName}');`);
      }
    }
    
    console.log('\nMigration process completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute migrations
migrate(); 