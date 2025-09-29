#!/usr/bin/env node

/**
 * Database Health Check Script
 * 
 * This script performs a comprehensive health check of the database,
 * identifies issues, and provides detailed recommendations.
 * 
 * Usage: node database-health-check.mjs [--verbose] [--export] [--fix]
 * 
 * Options:
 *   --verbose  Show detailed output for each table
 *   --export   Export health report to JSON file
 *   --fix      Attempt to fix common issues automatically
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
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

class DatabaseHealthChecker {
  constructor(db) {
    this.db = db;
  }

  async getDatabaseInfo() {
    try {
      // Get database size
      const sizeResult = await this.db.execute(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);

      // Get table count
      const tableCountResult = await this.db.execute(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `);

      // Get total row count
      const tables = await this.getAllTables();
      let totalRows = 0;
      const tableRowCounts = [];

      for (const table of tables) {
        try {
          const result = await this.db.execute(`SELECT COUNT(*) as count FROM "${table}"`);
          const count = parseInt(result.rows[0].count);
          totalRows += count;
          tableRowCounts.push({
            tableName: table,
            rowCount: count
          });
        } catch (error) {
          tableRowCounts.push({
            tableName: table,
            rowCount: 0,
            error: error.message
          });
        }
      }

      return {
        connected: true,
        databaseSize: sizeResult.rows[0].size,
        tableCount: parseInt(tableCountResult.rows[0].count),
        totalRows,
        tableRowCounts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getAllTables() {
    try {
      const result = await this.db.execute(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      return result.rows.map(row => row.table_name);
    } catch (error) {
      console.error('Error fetching tables:', error);
      return [];
    }
  }

  async checkTableHealth(tableName, verbose = false) {
    const result = {
      tableName,
      exists: false,
      rowCount: 0,
      hasData: false,
      issues: [],
      warnings: [],
      recommendations: [],
      isValid: true,
      healthScore: 0
    };

    try {
      if (verbose) {
        console.log(`${colors.blue}Checking table: ${tableName}${colors.reset}`);
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
        result.healthScore = 0;
        return result;
      }

      // Get row count
      const countResult = await this.db.execute(`SELECT COUNT(*) as count FROM "${tableName}"`);
      result.rowCount = parseInt(countResult.rows[0].count);
      result.hasData = result.rowCount > 0;

      // Check for common issues
      await this.checkTableIssues(tableName, result, verbose);

      // Calculate health score
      result.healthScore = this.calculateHealthScore(result);

      // Generate recommendations
      this.generateRecommendations(result);

      if (verbose) {
        console.log(`  ${colors.green}✓${colors.reset} Row count: ${result.rowCount}`);
        console.log(`  ${colors.blue}✓${colors.reset} Health score: ${result.healthScore}/100`);
        if (result.issues.length > 0) {
          console.log(`  ${colors.red}✗${colors.reset} Issues: ${result.issues.join(', ')}`);
        }
        if (result.warnings.length > 0) {
          console.log(`  ${colors.yellow}⚠${colors.reset} Warnings: ${result.warnings.join(', ')}`);
        }
      }

    } catch (error) {
      result.issues.push(`Error checking table: ${error.message}`);
      result.isValid = false;
      result.healthScore = 0;
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

      // Check for missing indexes on foreign keys
      await this.checkMissingIndexes(tableName, result, verbose);

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

  async checkMissingIndexes(tableName, result, verbose = false) {
    try {
      // Get foreign key columns
      const fkResult = await this.db.execute(`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = $1
      `, [tableName]);

      // Get existing indexes
      const indexResult = await this.db.execute(`
        SELECT indexdef
        FROM pg_indexes 
        WHERE tablename = $1
      `, [tableName]);

      const existingIndexes = indexResult.rows.map(row => row.indexdef);

      for (const fk of fkResult.rows) {
        const hasIndex = existingIndexes.some(index => 
          index.includes(fk.column_name) && !index.includes('PRIMARY KEY')
        );
        
        if (!hasIndex) {
          result.warnings.push(`Missing index on foreign key column ${fk.column_name}`);
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for missing indexes: ${error.message}`);
    }
  }

  calculateHealthScore(result) {
    let score = 100;
    
    // Deduct points for issues
    score -= result.issues.length * 20;
    
    // Deduct points for warnings
    score -= result.warnings.length * 5;
    
    // Deduct points for empty tables
    if (!result.hasData) {
      score -= 10;
    }
    
    // Ensure score doesn't go below 0
    return Math.max(0, score);
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

    if (result.warnings.some(w => w.includes('index'))) {
      result.recommendations.push('Add indexes on foreign key columns for better performance');
    }

    if (result.rowCount > 10000) {
      result.recommendations.push('Consider adding indexes for better performance');
    }

    if (result.issues.length === 0 && result.warnings.length === 0) {
      result.recommendations.push('Table is in excellent condition');
    }
  }

  async runHealthCheck(verbose = false) {
    const startTime = Date.now();
    
    console.log(`${colors.bright}${colors.cyan}Database Health Check${colors.reset}`);
    console.log(`${colors.bright}====================${colors.reset}`);

    // Get database info
    const dbInfo = await this.getDatabaseInfo();
    
    if (!dbInfo.connected) {
      console.log(`${colors.red}✗${colors.reset} Database connection failed: ${dbInfo.error}`);
      return null;
    }

    console.log(`${colors.green}✓${colors.reset} Database connected`);
    console.log(`${colors.blue}ℹ${colors.reset} Database size: ${dbInfo.databaseSize}`);
    console.log(`${colors.blue}ℹ${colors.reset} Total tables: ${dbInfo.tableCount}`);
    console.log(`${colors.blue}ℹ${colors.reset} Total rows: ${dbInfo.totalRows.toLocaleString()}`);

    // Check each table
    const tables = await this.getAllTables();
    const tableResults = [];
    
    console.log(`\n${colors.bright}Checking ${tables.length} tables...${colors.reset}`);

    for (const tableName of tables) {
      const result = await this.checkTableHealth(tableName, verbose);
      tableResults.push(result);
    }

    // Calculate overall health
    const validTables = tableResults.filter(r => r.isValid).length;
    const tablesWithIssues = tableResults.filter(r => !r.isValid).length;
    const totalIssues = tableResults.reduce((sum, r) => sum + r.issues.length, 0);
    const totalWarnings = tableResults.reduce((sum, r) => sum + r.warnings.length, 0);
    const averageHealthScore = tableResults.reduce((sum, r) => sum + r.healthScore, 0) / tableResults.length;

    let overallHealth;
    if (tablesWithIssues === 0 && totalIssues === 0 && averageHealthScore >= 90) {
      overallHealth = 'excellent';
    } else if (tablesWithIssues <= 2 && totalIssues <= 5 && averageHealthScore >= 70) {
      overallHealth = 'good';
    } else if (tablesWithIssues <= 5 && totalIssues <= 15 && averageHealthScore >= 50) {
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
      totalRows: dbInfo.totalRows,
      totalIssues,
      totalWarnings,
      averageHealthScore: Math.round(averageHealthScore),
      tableResults,
      recommendations,
      databaseInfo: dbInfo,
      timestamp: new Date().toISOString()
    };

    const duration = Date.now() - startTime;
    
    // Display summary
    console.log(`\n${colors.bright}Health Check Summary:${colors.reset}`);
    console.log(`${colors.bright}====================${colors.reset}`);
    console.log(`Overall Health: ${this.getHealthColor(overallHealth)}${overallHealth.toUpperCase()}${colors.reset}`);
    console.log(`Valid Tables: ${colors.green}${validTables}${colors.reset}/${colors.blue}${tables.length}${colors.reset}`);
    console.log(`Tables with Issues: ${colors.red}${tablesWithIssues}${colors.reset}`);
    console.log(`Total Issues: ${colors.red}${totalIssues}${colors.reset}`);
    console.log(`Total Warnings: ${colors.yellow}${totalWarnings}${colors.reset}`);
    console.log(`Average Health Score: ${colors.blue}${Math.round(averageHealthScore)}/100${colors.reset}`);
    console.log(`Duration: ${duration}ms`);

    // Show recommendations
    if (recommendations.length > 0) {
      console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
      recommendations.forEach(rec => {
        console.log(`  ${colors.yellow}•${colors.reset} ${rec}`);
      });
    }

    // Show tables with issues
    const tablesWithIssuesList = tableResults.filter(r => !r.isValid);
    if (tablesWithIssuesList.length > 0) {
      console.log(`\n${colors.bright}Tables with Issues:${colors.reset}`);
      tablesWithIssuesList.forEach(table => {
        console.log(`  ${colors.red}${table.tableName}${colors.reset} (Score: ${table.healthScore}/100):`);
        table.issues.forEach(issue => {
          console.log(`    ${colors.red}•${colors.reset} ${issue}`);
        });
      });
    }

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

    const tablesMissingIndexes = tableResults.filter(r => 
      r.warnings.some(w => w.includes('index'))
    ).length;
    if (tablesMissingIndexes > 0) {
      recommendations.push(`${tablesMissingIndexes} tables are missing indexes on foreign keys - consider adding for performance`);
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
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const shouldExport = args.includes('--export');

  try {
    const checker = new DatabaseHealthChecker(db);
    const report = await checker.runHealthCheck(verbose);

    if (!report) {
      console.log(`${colors.red}Health check failed${colors.reset}`);
      process.exit(1);
    }

    // Export report if requested
    if (shouldExport) {
      const reportPath = path.join(process.cwd(), 'database-health-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n${colors.green}Report exported to: ${reportPath}${colors.reset}`);
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
