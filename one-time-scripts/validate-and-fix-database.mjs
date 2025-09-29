#!/usr/bin/env node

/**
 * Comprehensive Database Validation and Fix Script
 * 
 * This script performs a complete validation of all database tables,
 * identifies issues, and attempts to fix common problems automatically.
 * 
 * Usage: node validate-and-fix-database.mjs [--fix] [--verbose]
 * 
 * Options:
 *   --fix      Attempt to fix common issues automatically
 *   --verbose  Show detailed output for each table
 *   --export   Export validation report to JSON file
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

// Configure Neon
const neonConfig = {
  webSocketConstructor: ws
};

// Database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ...neonConfig
});

const db = drizzle({ client: pool, schema });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class DatabaseValidator {
  constructor(db) {
    this.db = db;
  }

  async getAllTables() {
    const result = await this.db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    return result.rows.map(row => row.table_name);
  }

  async validateTable(tableName, verbose = false) {
    const result = {
      tableName,
      exists: false,
      rowCount: 0,
      hasData: false,
      issues: [],
      warnings: [],
      recommendations: [],
      isValid: true,
      fixed: [],
      errors: []
    };

    try {
      if (verbose) {
        console.log(`${colors.blue}Validating table: ${tableName}${colors.reset}`);
      }

      // Check if table exists
      const existsResult = await this.db.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);
      
      result.exists = existsResult.rows[0].exists;
      
      if (!result.exists) {
        result.issues.push('Table does not exist');
        result.isValid = false;
        return result;
      }

      // Get row count
      const countResult = await this.db.execute(`SELECT COUNT(*) as count FROM "${tableName}"`);
      result.rowCount = parseInt(countResult.rows[0].count);
      result.hasData = result.rowCount > 0;

      // Check for common issues
      await this.checkTableIssues(tableName, result, verbose);

      // Generate recommendations
      this.generateRecommendations(result);

      if (verbose) {
        console.log(`  ${colors.green}✓${colors.reset} Row count: ${result.rowCount}`);
        if (result.issues.length > 0) {
          console.log(`  ${colors.red}✗${colors.reset} Issues: ${result.issues.join(', ')}`);
        }
        if (result.warnings.length > 0) {
          console.log(`  ${colors.yellow}⚠${colors.reset} Warnings: ${result.warnings.join(', ')}`);
        }
      }

    } catch (error) {
      result.issues.push(`Error validating table: ${error.message}`);
      result.isValid = false;
      if (verbose) {
        console.log(`  ${colors.red}✗${colors.reset} Error: ${error.message}`);
      }
    }

    return result;
  }

  async checkTableIssues(tableName, result, verbose = false) {
    try {
      // Check for missing primary key
      const pkResult = await this.db.execute(`
        SELECT COUNT(*) as count
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = $1
        AND tc.constraint_type = 'PRIMARY KEY'
      `, [tableName]);
      
      if (parseInt(pkResult.rows[0].count) === 0) {
        result.issues.push('Missing primary key');
        result.isValid = false;
      }

      // Check for missing created_at/updated_at columns
      const timestampResult = await this.db.execute(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1
        AND column_name IN ('created_at', 'updated_at')
      `, [tableName]);
      
      const timestampColumns = timestampResult.rows.map(row => row.column_name);
      
      if (!timestampColumns.includes('created_at')) {
        result.warnings.push('Missing created_at column');
      }
      
      if (!timestampColumns.includes('updated_at')) {
        result.warnings.push('Missing updated_at column');
      }

      // Check for orphaned foreign keys
      await this.checkOrphanedForeignKeys(tableName, result, verbose);

      // Check for duplicate rows (if table has data)
      if (result.hasData) {
        await this.checkDuplicateRows(tableName, result, verbose);
      }

      // Check for NULL values in required fields
      await this.checkNullValues(tableName, result, verbose);

    } catch (error) {
      result.warnings.push(`Could not perform all checks: ${error.message}`);
    }
  }

  async checkOrphanedForeignKeys(tableName, result, verbose = false) {
    try {
      const fkResult = await this.db.execute(`
        SELECT 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = $1
      `, [tableName]);

      for (const fk of fkResult.rows) {
        const orphanedResult = await this.db.execute(`
          SELECT COUNT(*) as count
          FROM "${tableName}" t
          WHERE t."${fk.column_name}" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM "${fk.foreign_table_name}" f
            WHERE f."${fk.foreign_column_name}" = t."${fk.column_name}"
          )
        `);
        
        const orphanedCount = parseInt(orphanedResult.rows[0].count);
        if (orphanedCount > 0) {
          result.issues.push(`Found ${orphanedCount} orphaned records in ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check foreign key constraints: ${error.message}`);
    }
  }

  async checkDuplicateRows(tableName, result, verbose = false) {
    try {
      // Get primary key columns
      const pkResult = await this.db.execute(`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = $1
        AND tc.constraint_type = 'PRIMARY KEY'
        ORDER BY kcu.ordinal_position
      `, [tableName]);

      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => `"${row.column_name}"`).join(', ');
        
        const duplicateResult = await this.db.execute(`
          SELECT COUNT(*) as count
          FROM (
            SELECT ${pkColumns}, COUNT(*) as cnt
            FROM "${tableName}"
            GROUP BY ${pkColumns}
            HAVING COUNT(*) > 1
          ) duplicates
        `);
        
        const duplicateCount = parseInt(duplicateResult.rows[0].count);
        if (duplicateCount > 0) {
          result.issues.push(`Found ${duplicateCount} duplicate primary key combinations`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for duplicates: ${error.message}`);
    }
  }

  async checkNullValues(tableName, result, verbose = false) {
    try {
      const nullResult = await this.db.execute(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1
        AND is_nullable = 'NO'
        AND column_default IS NULL
      `, [tableName]);

      for (const column of nullResult.rows) {
        const nullCountResult = await this.db.execute(`
          SELECT COUNT(*) as count
          FROM "${tableName}"
          WHERE "${column.column_name}" IS NULL
        `);
        
        const nullCount = parseInt(nullCountResult.rows[0].count);
        if (nullCount > 0) {
          result.issues.push(`Found ${nullCount} NULL values in required column ${column.column_name}`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for NULL values: ${error.message}`);
    }
  }

  generateRecommendations(result) {
    if (!result.hasData) {
      result.recommendations.push('Consider adding sample data for testing');
    }

    if (result.warnings.some(w => w.includes('created_at'))) {
      result.recommendations.push('Add created_at column for audit trail');
    }

    if (result.warnings.some(w => w.includes('updated_at'))) {
      result.recommendations.push('Add updated_at column for change tracking');
    }

    if (result.rowCount > 10000) {
      result.recommendations.push('Consider adding indexes for better performance');
    }

    if (result.issues.length === 0 && result.warnings.length === 0) {
      result.recommendations.push('Table is in good condition');
    }
  }

  async fixCommonIssues(tableName, verbose = false) {
    const fixed = [];
    const errors = [];

    try {
      if (verbose) {
        console.log(`${colors.cyan}Fixing issues for table: ${tableName}${colors.reset}`);
      }

      // Add missing created_at column if it doesn't exist
      const hasCreatedAt = await this.columnExists(tableName, 'created_at');
      if (!hasCreatedAt) {
        try {
          await this.db.execute(`ALTER TABLE "${tableName}" ADD COLUMN created_at TIMESTAMP DEFAULT NOW()`);
          fixed.push('Added created_at column');
          if (verbose) {
            console.log(`  ${colors.green}✓${colors.reset} Added created_at column`);
          }
        } catch (error) {
          errors.push(`Failed to add created_at column: ${error.message}`);
          if (verbose) {
            console.log(`  ${colors.red}✗${colors.reset} Failed to add created_at column: ${error.message}`);
          }
        }
      }

      // Add missing updated_at column if it doesn't exist
      const hasUpdatedAt = await this.columnExists(tableName, 'updated_at');
      if (!hasUpdatedAt) {
        try {
          await this.db.execute(`ALTER TABLE "${tableName}" ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()`);
          fixed.push('Added updated_at column');
          if (verbose) {
            console.log(`  ${colors.green}✓${colors.reset} Added updated_at column`);
          }
        } catch (error) {
          errors.push(`Failed to add updated_at column: ${error.message}`);
          if (verbose) {
            console.log(`  ${colors.red}✗${colors.reset} Failed to add updated_at column: ${error.message}`);
          }
        }
      }

    } catch (error) {
      errors.push(`Error fixing issues for table ${tableName}: ${error.message}`);
      if (verbose) {
        console.log(`  ${colors.red}✗${colors.reset} Error: ${error.message}`);
      }
    }

    return { fixed, errors };
  }

  async columnExists(tableName, columnName) {
    try {
      const result = await this.db.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_name = $1
          AND column_name = $2
        )
      `, [tableName, columnName]);
      return result.rows[0].exists;
    } catch (error) {
      return false;
    }
  }

  async validateAllTables(verbose = false) {
    const startTime = Date.now();
    const tables = await this.getAllTables();
    const tableResults = [];
    
    console.log(`${colors.bright}Starting validation of ${tables.length} tables...${colors.reset}`);

    // Validate each table
    for (const tableName of tables) {
      const result = await this.validateTable(tableName, verbose);
      tableResults.push(result);
    }

    // Calculate overall health
    const validTables = tableResults.filter(r => r.isValid).length;
    const tablesWithIssues = tableResults.filter(r => !r.isValid).length;
    const totalIssues = tableResults.reduce((sum, r) => sum + r.issues.length, 0);
    const totalRows = tableResults.reduce((sum, r) => sum + r.rowCount, 0);

    let overallHealth;
    if (tablesWithIssues === 0 && totalIssues === 0) {
      overallHealth = 'excellent';
    } else if (tablesWithIssues <= 2 && totalIssues <= 5) {
      overallHealth = 'good';
    } else if (tablesWithIssues <= 5 && totalIssues <= 15) {
      overallHealth = 'fair';
    } else {
      overallHealth = 'poor';
    }

    // Generate overall recommendations
    const recommendations = this.generateOverallRecommendations(tableResults);

    const report = {
      overallHealth,
      totalTables: tables.length,
      validTables,
      tablesWithIssues,
      totalRows,
      totalIssues,
      tableResults,
      recommendations,
      timestamp: new Date().toISOString()
    };

    const duration = Date.now() - startTime;
    console.log(`${colors.bright}Validation completed in ${duration}ms${colors.reset}`);
    console.log(`${colors.bright}Overall health: ${colors.reset}${this.getHealthColor(overallHealth)}${overallHealth}${colors.reset}`);
    console.log(`${colors.bright}Valid tables: ${colors.reset}${colors.green}${validTables}${colors.reset}/${colors.blue}${tables.length}${colors.reset}`);
    console.log(`${colors.bright}Total issues: ${colors.reset}${colors.red}${totalIssues}${colors.reset}`);

    return report;
  }

  generateOverallRecommendations(tableResults) {
    const recommendations = [];
    
    const tablesWithoutData = tableResults.filter(r => !r.hasData).length;
    if (tablesWithoutData > 0) {
      recommendations.push(`${tablesWithoutData} tables are empty - consider adding sample data`);
    }

    const tablesWithOrphanedData = tableResults.filter(r => 
      r.issues.some(i => i.includes('orphaned'))
    ).length;
    if (tablesWithOrphanedData > 0) {
      recommendations.push(`${tablesWithOrphanedData} tables have orphaned foreign key references - consider cleanup`);
    }

    const tablesWithDuplicates = tableResults.filter(r => 
      r.issues.some(i => i.includes('duplicate'))
    ).length;
    if (tablesWithDuplicates > 0) {
      recommendations.push(`${tablesWithDuplicates} tables have duplicate records - consider deduplication`);
    }

    const tablesMissingTimestamps = tableResults.filter(r => 
      r.warnings.some(w => w.includes('created_at') || w.includes('updated_at'))
    ).length;
    if (tablesMissingTimestamps > 0) {
      recommendations.push(`${tablesMissingTimestamps} tables are missing audit timestamp columns`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Database is in excellent condition - no major issues found');
    }

    return recommendations;
  }

  getHealthColor(health) {
    switch (health) {
      case 'excellent': return colors.green;
      case 'good': return colors.blue;
      case 'fair': return colors.yellow;
      case 'poor': return colors.red;
      default: return colors.reset;
    }
  }

  async fixAllTables(verbose = false) {
    const tables = await this.getAllTables();
    const results = [];
    
    console.log(`${colors.bright}Fixing issues for ${tables.length} tables...${colors.reset}`);

    for (const tableName of tables) {
      const result = await this.fixCommonIssues(tableName, verbose);
      results.push({
        tableName,
        ...result
      });
    }

    const totalFixed = results.reduce((sum, r) => sum + r.fixed.length, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    console.log(`${colors.bright}Fix completed:${colors.reset}`);
    console.log(`  ${colors.green}Fixed: ${totalFixed} issues${colors.reset}`);
    console.log(`  ${colors.red}Errors: ${totalErrors} issues${colors.reset}`);

    return results;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const verbose = args.includes('--verbose');
  const shouldExport = args.includes('--export');

  console.log(`${colors.bright}${colors.cyan}Database Validation and Fix Tool${colors.reset}`);
  console.log(`${colors.bright}=====================================${colors.reset}`);

  try {
    const validator = new DatabaseValidator(db);

    // Validate all tables
    const report = await validator.validateAllTables(verbose);

    // Show summary
    console.log(`\n${colors.bright}Summary:${colors.reset}`);
    console.log(`  Total Tables: ${report.totalTables}`);
    console.log(`  Valid Tables: ${colors.green}${report.validTables}${colors.reset}`);
    console.log(`  Tables with Issues: ${colors.red}${report.tablesWithIssues}${colors.reset}`);
    console.log(`  Total Rows: ${report.totalRows.toLocaleString()}`);
    console.log(`  Total Issues: ${colors.red}${report.totalIssues}${colors.reset}`);

    // Show recommendations
    if (report.recommendations.length > 0) {
      console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
      report.recommendations.forEach(rec => {
        console.log(`  ${colors.yellow}•${colors.reset} ${rec}`);
      });
    }

    // Fix issues if requested
    if (shouldFix) {
      console.log(`\n${colors.bright}Attempting to fix common issues...${colors.reset}`);
      const fixResults = await validator.fixAllTables(verbose);
      
      // Show fix results
      const tablesWithFixes = fixResults.filter(r => r.fixed.length > 0);
      if (tablesWithFixes.length > 0) {
        console.log(`\n${colors.bright}Tables Fixed:${colors.reset}`);
        tablesWithFixes.forEach(result => {
          console.log(`  ${colors.green}${result.tableName}${colors.reset}: ${result.fixed.join(', ')}`);
        });
      }

      const tablesWithErrors = fixResults.filter(r => r.errors.length > 0);
      if (tablesWithErrors.length > 0) {
        console.log(`\n${colors.bright}Tables with Errors:${colors.reset}`);
        tablesWithErrors.forEach(result => {
          console.log(`  ${colors.red}${result.tableName}${colors.reset}: ${result.errors.join(', ')}`);
        });
      }
    }

    // Export report if requested
    if (shouldExport) {
      const reportPath = path.join(process.cwd(), 'database-validation-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n${colors.green}Report exported to: ${reportPath}${colors.reset}`);
    }

    // Show tables with issues
    const tablesWithIssues = report.tableResults.filter(r => !r.isValid);
    if (tablesWithIssues.length > 0) {
      console.log(`\n${colors.bright}Tables with Issues:${colors.reset}`);
      tablesWithIssues.forEach(table => {
        console.log(`  ${colors.red}${table.tableName}${colors.reset}:`);
        table.issues.forEach(issue => {
          console.log(`    ${colors.red}•${colors.reset} ${issue}`);
        });
      });
    }

  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch(console.error);
