import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err);
  process.exit(-1);
});

// Run migrations
async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...');

    const migrationFile = path.join(__dirname, 'migrations', '001_create_notes.sql');
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');

    await client.query(migrationSQL);
    console.log('✅ Database migrations completed successfully');
  } catch (err) {
    console.error('❌ Error running migrations:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Initialize database
async function initDatabase() {
  try {
    await runMigrations();
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

export default {
  pool,
  initDatabase,
  query: (text, params) => pool.query(text, params)
};
