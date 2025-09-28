import { db } from "../db";
import { sql } from "drizzle-orm";

export interface TableValidationResult {
  tableName: string;
  exists: boolean;
  rowCount: number;
  hasData: boolean;
  issues: string[];
  warnings: string[];
  recommendations: string[];
  isValid: boolean;
}

export interface DatabaseValidationReport {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  totalTables: number;
  validTables: number;
  tablesWithIssues: number;
  totalRows: number;
  totalIssues: number;
  tableResults: TableValidationResult[];
  recommendations: string[];
  timestamp: string;
}

export class DatabaseValidator {
  private static instance: DatabaseValidator;
  
  public static getInstance(): DatabaseValidator {
    if (!DatabaseValidator.instance) {
      DatabaseValidator.instance = new DatabaseValidator();
    }
    return DatabaseValidator.instance;
  }

  /**
   * Get all tables in the database
   */
  async getAllTables(): Promise<string[]> {
    try {
      const result = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      return result.rows.map((row: any) => row.table_name);
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }

  /**
   * Validate a single table
   */
  async validateTable(tableName: string): Promise<TableValidationResult> {
    const result: TableValidationResult = {
      tableName,
      exists: false,
      rowCount: 0,
      hasData: false,
      issues: [],
      warnings: [],
      recommendations: [],
      isValid: true
    };

    try {
      // Check if table exists
      const existsResult = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        )
      `);
      
      result.exists = Boolean(existsResult.rows[0].exists);
      
      if (!result.exists) {
        result.issues.push('Table does not exist');
        result.isValid = false;
        return result;
      }

      // Get row count
      const countResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
      result.rowCount = parseInt(String(countResult.rows[0].count));
      result.hasData = result.rowCount > 0;

      // Check for common issues
      await this.checkTableIssues(tableName, result);

      // Generate recommendations
      this.generateRecommendations(result);

    } catch (error) {
      result.issues.push(`Error validating table: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Check for common table issues
   */
  private async checkTableIssues(tableName: string, result: TableValidationResult): Promise<void> {
    try {
      // Check for missing primary key
      const pkResult = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = ${tableName}
        AND tc.constraint_type = 'PRIMARY KEY'
      `);
      
      if (parseInt(String(pkResult.rows[0].count)) === 0) {
        result.issues.push('Missing primary key');
        result.isValid = false;
      }

      // Check for missing created_at/updated_at columns
      const timestampResult = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ${tableName}
        AND column_name IN ('created_at', 'updated_at')
      `);
      
      const timestampColumns = timestampResult.rows.map((row: any) => row.column_name);
      
      if (!timestampColumns.includes('created_at')) {
        result.warnings.push('Missing created_at column');
      }
      
      if (!timestampColumns.includes('updated_at')) {
        result.warnings.push('Missing updated_at column');
      }

      // Check for orphaned foreign keys
      await this.checkOrphanedForeignKeys(tableName, result);

      // Check for duplicate rows (if table has data)
      if (result.hasData) {
        await this.checkDuplicateRows(tableName, result);
      }

      // Check for NULL values in required fields
      await this.checkNullValues(tableName, result);

    } catch (error) {
      result.warnings.push(`Could not perform all checks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check for orphaned foreign keys
   */
  private async checkOrphanedForeignKeys(tableName: string, result: TableValidationResult): Promise<void> {
    try {
      const fkResult = await db.execute(sql`
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
        AND tc.table_name = ${tableName}
      `);

      for (const fk of fkResult.rows) {
        const orphanedResult = await db.execute(sql.raw(`
          SELECT COUNT(*) as count
          FROM "${tableName}" t
          WHERE t."${fk.column_name}" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM "${fk.foreign_table_name}" f
            WHERE f."${fk.foreign_column_name}" = t."${fk.column_name}"
          )
        `));
        
        const orphanedCount = parseInt(String(orphanedResult.rows[0].count));
        if (orphanedCount > 0) {
          result.issues.push(`Found ${orphanedCount} orphaned records in ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check foreign key constraints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check for duplicate rows
   */
  private async checkDuplicateRows(tableName: string, result: TableValidationResult): Promise<void> {
    try {
      // Get primary key columns
      const pkResult = await db.execute(sql`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = ${tableName}
        AND tc.constraint_type = 'PRIMARY KEY'
        ORDER BY kcu.ordinal_position
      `);

      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map((row: any) => `"${row.column_name}"`).join(', ');
        
        const duplicateResult = await db.execute(sql.raw(`
          SELECT COUNT(*) as count
          FROM (
            SELECT ${pkColumns}, COUNT(*) as cnt
            FROM "${tableName}"
            GROUP BY ${pkColumns}
            HAVING COUNT(*) > 1
          ) duplicates
        `));
        
        const duplicateCount = parseInt(String(duplicateResult.rows[0].count));
        if (duplicateCount > 0) {
          result.issues.push(`Found ${duplicateCount} duplicate primary key combinations`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for duplicates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check for NULL values in required fields
   */
  private async checkNullValues(tableName: string, result: TableValidationResult): Promise<void> {
    try {
      const nullResult = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ${tableName}
        AND is_nullable = 'NO'
        AND column_default IS NULL
      `);

      for (const column of nullResult.rows) {
        const nullCountResult = await db.execute(sql.raw(`
          SELECT COUNT(*) as count
          FROM "${tableName}"
          WHERE "${column.column_name}" IS NULL
        `));
        
        const nullCount = parseInt(String(nullCountResult.rows[0].count));
        if (nullCount > 0) {
          result.issues.push(`Found ${nullCount} NULL values in required column ${column.column_name}`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for NULL values: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(result: TableValidationResult): void {
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

  /**
   * Validate all tables in the database
   */
  async validateAllTables(): Promise<DatabaseValidationReport> {
    const startTime = Date.now();
    const tables = await this.getAllTables();
    const tableResults: TableValidationResult[] = [];
    
    console.log(`Starting validation of ${tables.length} tables...`);

    // Validate each table
    for (const tableName of tables) {
      console.log(`Validating table: ${tableName}`);
      const result = await this.validateTable(tableName);
      tableResults.push(result);
    }

    // Calculate overall health
    const validTables = tableResults.filter(r => r.isValid).length;
    const tablesWithIssues = tableResults.filter(r => !r.isValid).length;
    const totalIssues = tableResults.reduce((sum, r) => sum + r.issues.length, 0);
    const totalRows = tableResults.reduce((sum, r) => sum + r.rowCount, 0);

    let overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
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

    const report: DatabaseValidationReport = {
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
    console.log(`Validation completed in ${duration}ms`);
    console.log(`Overall health: ${overallHealth}`);
    console.log(`Valid tables: ${validTables}/${tables.length}`);
    console.log(`Total issues: ${totalIssues}`);

    return report;
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(tableResults: TableValidationResult[]): string[] {
    const recommendations: string[] = [];
    
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

  /**
   * Fix common issues automatically
   */
  async fixCommonIssues(tableName: string): Promise<{ fixed: string[]; errors: string[] }> {
    const fixed: string[] = [];
    const errors: string[] = [];

    try {
      // Add missing created_at column if it doesn't exist
      const hasCreatedAt = await this.columnExists(tableName, 'created_at');
      if (!hasCreatedAt) {
        try {
          await db.execute(sql.raw(`ALTER TABLE "${tableName}" ADD COLUMN created_at TIMESTAMP DEFAULT NOW()`));
          fixed.push('Added created_at column');
        } catch (error) {
          errors.push(`Failed to add created_at column: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Add missing updated_at column if it doesn't exist
      const hasUpdatedAt = await this.columnExists(tableName, 'updated_at');
      if (!hasUpdatedAt) {
        try {
          await db.execute(sql.raw(`ALTER TABLE "${tableName}" ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()`));
          fixed.push('Added updated_at column');
        } catch (error) {
          errors.push(`Failed to add updated_at column: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

    } catch (error) {
      errors.push(`Error fixing issues for table ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { fixed, errors };
  }

  /**
   * Check if a column exists in a table
   */
  private async columnExists(tableName: string, columnName: string): Promise<boolean> {
    try {
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_name = ${tableName}
          AND column_name = ${columnName}
        )
      `);
      return Boolean(result.rows[0].exists);
    } catch (error) {
      return false;
    }
  }
}

export default DatabaseValidator;
