import { Router } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import DatabaseValidator from "../utils/database-validator";

const router = Router();

// Get all tables in the database
router.get("/tables", async (req, res) => {
  try {
    const tables = await db.execute(sql`
      SELECT 
        table_name,
        table_type,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    res.json({
      success: true,
      tables: tables.rows,
      count: tables.rows.length
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tables",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get table structure (columns, types, constraints)
router.get("/tables/:tableName/structure", async (req, res) => {
  try {
    const { tableName } = req.params;
    
    const columns = await db.execute(sql`
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
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    const constraints = await db.execute(sql`
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_name = ${tableName}
      AND tc.table_schema = 'public'
    `);

    const indexes = await db.execute(sql`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = ${tableName}
      AND schemaname = 'public'
    `);

    res.json({
      success: true,
      tableName,
      columns: columns.rows,
      constraints: constraints.rows,
      indexes: indexes.rows,
      columnCount: columns.rows.length
    });
  } catch (error) {
    console.error(`Error fetching structure for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table structure",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get table data with pagination
router.get("/tables/:tableName/data", async (req, res) => {
  try {
    const { tableName } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.execute(sql.raw(`SELECT COUNT(*) as total FROM "${tableName}"`));
    const total = parseInt(countResult.rows[0].total);

    // Get data with pagination
    const data = await db.execute(sql.raw(`
      SELECT * FROM "${tableName}" 
      ORDER BY created_at DESC NULLS LAST, id DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `));

    res.json({
      success: true,
      tableName,
      data: data.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(`Error fetching data for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Validate table integrity
router.get("/tables/:tableName/validate", async (req, res) => {
  try {
    const { tableName } = req.params;
    
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `);

    if (!tableExists.rows[0].exists) {
      return res.status(404).json({
        success: false,
        error: "Table not found"
      });
    }

    // Get table statistics
    const stats = await db.execute(sql.raw(`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation,
        most_common_vals,
        most_common_freqs
      FROM pg_stats 
      WHERE tablename = '${tableName}'
    `));

    // Check for orphaned records (basic check)
    const orphanedChecks = await db.execute(sql.raw(`
      SELECT 
        'orphaned_check' as check_type,
        COUNT(*) as count
      FROM "${tableName}" t
      WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = '${tableName}'
      )
    `));

    // Get row count
    const rowCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));

    res.json({
      success: true,
      tableName,
      validation: {
        exists: true,
        rowCount: parseInt(rowCount.rows[0].count),
        statistics: stats.rows,
        orphanedRecords: parseInt(orphanedChecks.rows[0].count),
        isValid: true
      }
    });
  } catch (error) {
    console.error(`Error validating table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to validate table",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get all tables with their row counts and basic info
router.get("/tables/summary", async (req, res) => {
  try {
    const tables = await db.execute(sql`
      SELECT 
        t.table_name,
        t.table_type,
        COALESCE(s.n_tup_ins, 0) as insert_count,
        COALESCE(s.n_tup_upd, 0) as update_count,
        COALESCE(s.n_tup_del, 0) as delete_count,
        COALESCE(s.n_live_tup, 0) as live_tuples,
        COALESCE(s.n_dead_tup, 0) as dead_tuples,
        s.last_vacuum,
        s.last_autovacuum,
        s.last_analyze,
        s.last_autoanalyze
      FROM information_schema.tables t
      LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
      WHERE t.table_schema = 'public' 
      AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name
    `);

    // Get actual row counts for each table
    const tableNames = tables.rows.map((row: any) => row.table_name);
    const rowCounts = await Promise.all(
      tableNames.map(async (tableName: string) => {
        try {
          const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
          return {
            tableName,
            rowCount: parseInt(result.rows[0].count)
          };
        } catch (error) {
          return {
            tableName,
            rowCount: 0,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      })
    );

    const summary = tables.rows.map((table: any) => {
      const rowCount = rowCounts.find(rc => rc.tableName === table.table_name);
      return {
        ...table,
        actualRowCount: rowCount?.rowCount || 0,
        hasError: !!rowCount?.error,
        error: rowCount?.error
      };
    });

    res.json({
      success: true,
      tables: summary,
      totalTables: summary.length,
      totalRows: summary.reduce((sum, table) => sum + (table.actualRowCount || 0), 0)
    });
  } catch (error) {
    console.error("Error fetching tables summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tables summary",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Check database health
router.get("/health", async (req, res) => {
  try {
    // Check database connection
    const connectionTest = await db.execute(sql`SELECT 1 as test`);
    
    // Get database size
    const dbSize = await db.execute(sql`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);

    // Get table count
    const tableCount = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    // Get total row count across all tables
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    let totalRows = 0;
    const tableRowCounts = [];
    
    for (const table of tables.rows) {
      try {
        const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${table.table_name}"`));
        const count = parseInt(result.rows[0].count);
        totalRows += count;
        tableRowCounts.push({
          tableName: table.table_name,
          rowCount: count
        });
      } catch (error) {
        tableRowCounts.push({
          tableName: table.table_name,
          rowCount: 0,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    res.json({
      success: true,
      health: {
        connected: true,
        databaseSize: dbSize.rows[0].size,
        tableCount: parseInt(tableCount.rows[0].count),
        totalRows,
        tableRowCounts,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error checking database health:", error);
    res.status(500).json({
      success: false,
      error: "Database health check failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Comprehensive database validation
router.get("/validate", async (req, res) => {
  try {
    const validator = DatabaseValidator.getInstance();
    const report = await validator.validateAllTables();
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error("Error validating database:", error);
    res.status(500).json({
      success: false,
      error: "Failed to validate database",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Validate specific table
router.get("/tables/:tableName/validate-detailed", async (req, res) => {
  try {
    const { tableName } = req.params;
    const validator = DatabaseValidator.getInstance();
    const result = await validator.validateTable(tableName);
    
    res.json({
      success: true,
      validation: result
    });
  } catch (error) {
    console.error(`Error validating table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to validate table",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Fix common issues for a table
router.post("/tables/:tableName/fix", async (req, res) => {
  try {
    const { tableName } = req.params;
    const validator = DatabaseValidator.getInstance();
    const result = await validator.fixCommonIssues(tableName);
    
    res.json({
      success: true,
      tableName,
      fixed: result.fixed,
      errors: result.errors
    });
  } catch (error) {
    console.error(`Error fixing issues for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fix table issues",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get table statistics and performance metrics
router.get("/tables/:tableName/stats", async (req, res) => {
  try {
    const { tableName } = req.params;
    
    // Get table size
    const sizeResult = await db.execute(sql.raw(`
      SELECT 
        pg_size_pretty(pg_total_relation_size('${tableName}')) as total_size,
        pg_size_pretty(pg_relation_size('${tableName}')) as table_size,
        pg_size_pretty(pg_indexes_size('${tableName}')) as indexes_size
    `));

    // Get row count and statistics
    const statsResult = await db.execute(sql.raw(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables 
      WHERE relname = '${tableName}'
    `));

    // Get index information
    const indexesResult = await db.execute(sql.raw(`
      SELECT 
        indexname,
        indexdef,
        pg_size_pretty(pg_relation_size(indexname::regclass)) as size
      FROM pg_indexes 
      WHERE tablename = '${tableName}'
    `));

    res.json({
      success: true,
      tableName,
      size: sizeResult.rows[0],
      statistics: statsResult.rows[0] || {},
      indexes: indexesResult.rows
    });
  } catch (error) {
    console.error(`Error fetching stats for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table statistics",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
