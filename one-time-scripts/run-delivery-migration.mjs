#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the migration SQL file
const migrationPath = join(__dirname, 'migration-delivery-note-to-deliveries.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('🚀 Running delivery note to deliveries migration...');
console.log('📄 Migration SQL:');
console.log(migrationSQL);
console.log('\n⚠️  Please run this SQL in your PostgreSQL database to complete the migration.');
console.log('💡 You can copy the SQL above and run it in your database client (pgAdmin, psql, etc.)');
console.log('\n✅ After running the migration, restart your application server.');
