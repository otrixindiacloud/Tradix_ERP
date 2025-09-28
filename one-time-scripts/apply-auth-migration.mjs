#!/usr/bin/env node
import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const sqlText = fs.readFileSync('one-time-scripts/migration-add-auth-columns.sql','utf8');
const dbUrl = process.env.DATABASE_URL;
if(!dbUrl){
  console.error('DATABASE_URL not set');
  process.exit(1);
}
const client = neon(dbUrl);
console.log('Applying auth migration...');
try {
  const statements = sqlText
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length && !s.startsWith('--'));
  for (const stmt of statements) {
    console.log('Executing:', stmt.substring(0,80) + (stmt.length>80?'...':''));
    await client(stmt);
  }
  console.log('Migration applied successfully.');
} catch (e){
  console.error('Migration failed', e);
  process.exit(1);
}