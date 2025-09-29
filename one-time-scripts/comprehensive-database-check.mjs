#!/usr/bin/env node

/**
 * Comprehensive Database Check and Fix Script
 * 
 * This script performs a complete check of all database tables,
 * validates schema integrity, checks data consistency, and fixes common issues.
 * 
 * Usage: node comprehensive-database-check.mjs [--fix] [--verbose] [--export]
 * 
 * Options:
 *   --fix      Attempt to fix common issues automatically
 *   --verbose  Show detailed output for each table
 *   --export   Export detailed report to JSON file
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

class ComprehensiveDatabaseChecker {
  constructor(db) {
    this.db = db;
    this.fixedIssues = [];
    this.errors = [];
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

  async checkTableExists(tableName) {
    try {
      const result = await this.db.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);
      
      return result.rows[0].exists;
    } catch (error) {
      return false;
    }
  }

  async getTableRowCount(tableName) {
    try {
      const result = await this.db.execute(`SELECT COUNT(*) as count FROM "${tableName}"`);
      return parseInt(result.rows[0].count);
    } catch (error) {
      return 0;
    }
  }

  async getTableColumns(tableName) {
    try {
      const result = await this.db.execute(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale,
          ordinal_position
        FROM information_schema.columns 
        WHERE table_name = $1
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  async getTableConstraints(tableName) {
    try {
      const result = await this.db.execute(`
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = $1
        AND tc.table_schema = 'public'
      `, [tableName]);
      
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  async getTableIndexes(tableName) {
    try {
      const result = await this.db.execute(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1
        AND schemaname = 'public'
      `, [tableName]);
      
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  async checkTableHealth(tableName, verbose = false) {
    const result = {
      tableName,
      exists: false,
      rowCount: 0,
      hasData: false,
      columns: [],
      constraints: [],
      indexes: [],
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
      result.exists = await this.checkTableExists(tableName);
      
      if (!result.exists) {
        result.issues.push('Table does not exist');
        result.isValid = false;
        result.healthScore = 0;
        return result;
      }

      // Get table details
      result.rowCount = await this.getTableRowCount(tableName);
      result.hasData = result.rowCount > 0;
      result.columns = await this.getTableColumns(tableName);
      result.constraints = await this.getTableConstraints(tableName);
      result.indexes = await this.getTableIndexes(tableName);

      // Check for common issues
      await this.checkTableIssues(tableName, result, verbose);

      // Calculate health score
      result.healthScore = this.calculateHealthScore(result);

      // Generate recommendations
      this.generateRecommendations(result);

      if (verbose) {
        console.log(`  ${colors.green}✓${colors.reset} Row count: ${result.rowCount}`);
        console.log(`  ${colors.green}✓${colors.reset} Columns: ${result.columns.length}`);
        console.log(`  ${colors.green}✓${colors.reset} Constraints: ${result.constraints.length}`);
        console.log(`  ${colors.green}✓${colors.reset} Indexes: ${result.indexes.length}`);
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
      const hasPrimaryKey = result.constraints.some(c => c.constraint_type === 'PRIMARY KEY');
      if (!hasPrimaryKey) {
        result.issues.push('Missing primary key');
        result.isValid = false;
      }

      // Check for missing created_at/updated_at columns
      const columnNames = result.columns.map(c => c.column_name);
      if (!columnNames.includes('created_at')) {
        result.warnings.push('Missing created_at column');
      }
      if (!columnNames.includes('updated_at')) {
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

      // Check for data type consistency
      await this.checkDataTypeConsistency(tableName, result, verbose);

    } catch (error) {
      result.warnings.push(`Could not perform all checks: ${error.message}`);
    }
  }

  async checkOrphanedForeignKeys(tableName, result, verbose = false) {
    try {
      const foreignKeys = result.constraints.filter(c => c.constraint_type === 'FOREIGN KEY');
      
      for (const fk of foreignKeys) {
        if (fk.foreign_table_name && fk.foreign_column_name) {
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
      }
    } catch (error) {
      result.warnings.push(`Could not check foreign key constraints: ${error.message}`);
    }
  }

  async checkDuplicateRows(tableName, result, verbose = false) {
    try {
      const primaryKeyColumns = result.constraints
        .filter(c => c.constraint_type === 'PRIMARY KEY')
        .map(c => c.column_name);

      if (primaryKeyColumns.length > 0) {
        const pkColumns = primaryKeyColumns.map(col => `"${col}"`).join(', ');
        
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
      const requiredColumns = result.columns.filter(c => 
        c.is_nullable === 'NO' && c.column_default === null
      );

      for (const column of requiredColumns) {
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
      const foreignKeyColumns = result.constraints
        .filter(c => c.constraint_type === 'FOREIGN KEY')
        .map(c => c.column_name);

      const indexedColumns = result.indexes
        .map(i => i.indexdef)
        .join(' ');

      for (const fkColumn of foreignKeyColumns) {
        const hasIndex = indexedColumns.includes(fkColumn) && 
                        !indexedColumns.includes('PRIMARY KEY');
        
        if (!hasIndex) {
          result.warnings.push(`Missing index on foreign key column ${fkColumn}`);
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for missing indexes: ${error.message}`);
    }
  }

  async checkDataTypeConsistency(tableName, result, verbose = false) {
    try {
      // Check for inconsistent data types in columns
      for (const column of result.columns) {
        if (column.data_type === 'character varying' && !column.character_maximum_length) {
          result.warnings.push(`Column ${column.column_name} has unlimited length - consider setting a limit`);
        }
        
        if (column.data_type === 'numeric' && !column.numeric_precision) {
          result.warnings.push(`Column ${column.column_name} has unlimited precision - consider setting limits`);
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check data type consistency: ${error.message}`);
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
    
    // Deduct points for missing primary key
    if (result.issues.some(i => i.includes('primary key'))) {
      score -= 30;
    }
    
    // Deduct points for missing audit columns
    if (result.warnings.some(w => w.includes('created_at') || w.includes('updated_at'))) {
      score -= 5;
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

    if (result.warnings.some(w => w.includes('unlimited'))) {
      result.recommendations.push('Set appropriate limits on variable-length columns');
    }

    if (result.rowCount > 10000) {
      result.recommendations.push('Consider adding indexes for better performance');
    }

    if (result.issues.length === 0 && result.warnings.length === 0) {
      result.recommendations.push('Table is in excellent condition');
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

      // Add missing indexes on foreign keys
      await this.addMissingIndexes(tableName, fixed, errors, verbose);

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

  async addMissingIndexes(tableName, fixed, errors, verbose = false) {
    try {
      const constraints = await this.getTableConstraints(tableName);
      const foreignKeyColumns = constraints
        .filter(c => c.constraint_type === 'FOREIGN KEY')
        .map(c => c.column_name);

      const indexes = await this.getTableIndexes(tableName);
      const indexedColumns = indexes
        .map(i => i.indexdef)
        .join(' ');

      for (const fkColumn of foreignKeyColumns) {
        const hasIndex = indexedColumns.includes(fkColumn) && 
                        !indexedColumns.includes('PRIMARY KEY');
        
        if (!hasIndex) {
          try {
            const indexName = `idx_${tableName}_${fkColumn}`;
            await this.db.execute(`CREATE INDEX IF NOT EXISTS "${indexName}" ON "${tableName}" ("${fkColumn}")`);
            fixed.push(`Added index on ${fkColumn}`);
            if (verbose) {
              console.log(`  ${colors.green}✓${colors.reset} Added index on ${fkColumn}`);
            }
          } catch (error) {
            errors.push(`Failed to add index on ${fkColumn}: ${error.message}`);
            if (verbose) {
              console.log(`  ${colors.red}✗${colors.reset} Failed to add index on ${fkColumn}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      errors.push(`Could not add missing indexes: ${error.message}`);
    }
  }

  async runComprehensiveCheck(verbose = false, shouldFix = false) {
    const startTime = Date.now();
    
    console.log(`${colors.bright}${colors.cyan}Comprehensive Database Check${colors.reset}`);
    console.log(`${colors.bright}==============================${colors.reset}`);

    // Get all tables
    const tables = await this.getAllTables();
    
    if (tables.length === 0) {
      console.log(`${colors.red}No tables found in database${colors.reset}`);
      return null;
    }

    console.log(`${colors.green}✓${colors.reset} Found ${tables.length} tables`);
    
    // Check each table
    const tableResults = [];
    
    console.log(`\n${colors.bright}Checking ${tables.length} tables...${colors.reset}`);

    for (const tableName of tables) {
      const result = await this.checkTableHealth(tableName, verbose);
      tableResults.push(result);
    }

    // Fix issues if requested
    if (shouldFix) {
      console.log(`\n${colors.bright}Fixing common issues...${colors.reset}`);
      
      for (const tableName of tables) {
        const fixResult = await this.fixCommonIssues(tableName, verbose);
        this.fixedIssues.push(...fixResult.fixed);
        this.errors.push(...fixResult.errors);
      }
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
      totalIssues,
      totalWarnings,
      averageHealthScore: Math.round(averageHealthScore),
      tableResults,
      recommendations,
      fixedIssues: this.fixedIssues,
      errors: this.errors,
      timestamp: new Date().toISOString()
    };

    const duration = Date.now() - startTime;
    
    // Display summary
    console.log(`\n${colors.bright}Check Summary:${colors.reset}`);
    console.log(`${colors.bright}==============${colors.reset}`);
    console.log(`Overall Health: ${this.getHealthColor(overallHealth)}${overallHealth.toUpperCase()}${colors.reset}`);
    console.log(`Valid Tables: ${colors.green}${validTables}${colors.reset}/${colors.blue}${tables.length}${colors.reset}`);
    console.log(`Tables with Issues: ${colors.red}${tablesWithIssues}${colors.reset}`);
    console.log(`Total Issues: ${colors.red}${totalIssues}${colors.reset}`);
    console.log(`Total Warnings: ${colors.yellow}${totalWarnings}${colors.reset}`);
    console.log(`Average Health Score: ${colors.blue}${Math.round(averageHealthScore)}/100${colors.reset}`);
    
    if (shouldFix) {
      console.log(`Fixed Issues: ${colors.green}${this.fixedIssues.length}${colors.reset}`);
      console.log(`Fix Errors: ${colors.red}${this.errors.length}${colors.reset}`);
    }
    
    console.log(`Duration: ${duration}ms`);

    // Show recommendations
    if (recommendations.length > 0) {
      console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
      recommendations.forEach(rec => {
        console.log(`  ${colors.yellow}•${colors.reset} ${rec}`);
      });
    }

    // Show fixed issues
    if (shouldFix && this.fixedIssues.length > 0) {
      console.log(`\n${colors.bright}Fixed Issues:${colors.reset}`);
      this.fixedIssues.forEach(issue => {
        console.log(`  ${colors.green}✓${colors.reset} ${issue}`);
      });
    }

    // Show errors
    if (this.errors.length > 0) {
      console.log(`\n${colors.bright}Errors:${colors.reset}`);
      this.errors.forEach(error => {
        console.log(`  ${colors.red}✗${colors.reset} ${error}`);
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
  const shouldFix = args.includes('--fix');
  const verbose = args.includes('--verbose');
  const shouldExport = args.includes('--export');

  try {
    const checker = new ComprehensiveDatabaseChecker(db);
    const report = await checker.runComprehensiveCheck(verbose, shouldFix);

    if (!report) {
      console.log(`${colors.red}Database check failed${colors.reset}`);
      process.exit(1);
    }

    // Export report if requested
    if (shouldExport) {
      const reportPath = path.join(process.cwd(), 'comprehensive-database-report.json');
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
