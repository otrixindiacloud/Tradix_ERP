import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Table as TableIcon, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import TableViewer from '@/components/TableViewer';

interface TableInfo {
  table_name: string;
  table_type: string;
  table_schema: string;
  actualRowCount?: number;
  hasError?: boolean;
  error?: string;
}

interface TableStructure {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  ordinal_position: number;
}

interface TableData {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface DatabaseHealth {
  connected: boolean;
  databaseSize: string;
  tableCount: number;
  totalRows: number;
  tableRowCounts: Array<{
    tableName: string;
    rowCount: number;
    error?: string;
  }>;
  timestamp: string;
}

const TableValidation: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableStructure, setTableStructure] = useState<TableStructure[]>([]);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [databaseHealth, setDatabaseHealth] = useState<DatabaseHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTableViewer, setSelectedTableViewer] = useState<string | null>(null);

  // Fetch all tables
  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/table-validation/tables');
      const result = await response.json();
      
      if (result.success) {
        setTables(result.tables);
      } else {
        setError(result.error || 'Failed to fetch tables');
      }
    } catch (err) {
      setError('Network error while fetching tables');
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch table summary with row counts
  const fetchTableSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/table-validation/tables/summary');
      const result = await response.json();
      
      if (result.success) {
        setTables(result.tables);
      } else {
        setError(result.error || 'Failed to fetch table summary');
      }
    } catch (err) {
      setError('Network error while fetching table summary');
      console.error('Error fetching table summary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch database health
  const fetchDatabaseHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/table-validation/health');
      const result = await response.json();
      
      if (result.success) {
        setDatabaseHealth(result.health);
      } else {
        setError(result.error || 'Failed to fetch database health');
      }
    } catch (err) {
      setError('Network error while fetching database health');
      console.error('Error fetching database health:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch table structure
  const fetchTableStructure = async (tableName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/table-validation/tables/${tableName}/structure`);
      const result = await response.json();
      
      if (result.success) {
        setTableStructure(result.columns);
      } else {
        setError(result.error || 'Failed to fetch table structure');
      }
    } catch (err) {
      setError('Network error while fetching table structure');
      console.error('Error fetching table structure:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch table data
  const fetchTableData = async (tableName: string, page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/table-validation/tables/${tableName}/data?page=${page}&limit=50`);
      const result = await response.json();
      
      if (result.success) {
        setTableData(result);
        setCurrentPage(page);
      } else {
        setError(result.error || 'Failed to fetch table data');
      }
    } catch (err) {
      setError('Network error while fetching table data');
      console.error('Error fetching table data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle table selection
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setSelectedTableViewer(tableName);
    setActiveTab('tables');
  };

  // Filter tables based on search term
  const filteredTables = tables.filter(table =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge for table
  const getTableStatusBadge = (table: TableInfo) => {
    if (table.hasError) {
      return <Badge variant="destructive">Error</Badge>;
    }
    if (table.actualRowCount === 0) {
      return <Badge variant="secondary">Empty</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  // Format data type for display
  const formatDataType = (column: TableStructure) => {
    let type = column.data_type;
    if (column.character_maximum_length) {
      type += `(${column.character_maximum_length})`;
    } else if (column.numeric_precision) {
      type += `(${column.numeric_precision}`;
      if (column.numeric_scale) {
        type += `,${column.numeric_scale}`;
      }
      type += ')';
    }
    return type;
  };

  useEffect(() => {
    fetchTableSummary();
    fetchDatabaseHealth();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Database Table Validation</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchTableSummary} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={fetchDatabaseHealth} disabled={loading}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Health Check
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="structure" disabled={!selectedTable}>Structure</TabsTrigger>
          <TabsTrigger value="data" disabled={!selectedTable}>Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                <TableIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseHealth?.tableCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseHealth?.totalRows?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseHealth?.databaseSize || 'N/A'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {databaseHealth?.connected ? 'Connected' : 'Disconnected'}
                </div>
              </CardContent>
            </Card>
          </div>

          {databaseHealth && (
            <Card>
              <CardHeader>
                <CardTitle>Database Health Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Last Updated:</strong> {new Date(databaseHealth.timestamp).toLocaleString()}</p>
                  <p><strong>Connection Status:</strong> 
                    <Badge variant={databaseHealth.connected ? "default" : "destructive"} className="ml-2">
                      {databaseHealth.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </p>
                  <p><strong>Database Size:</strong> {databaseHealth.databaseSize}</p>
                  <p><strong>Total Tables:</strong> {databaseHealth.tableCount}</p>
                  <p><strong>Total Rows:</strong> {databaseHealth.totalRows.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          {selectedTableViewer ? (
            <TableViewer 
              tableName={selectedTableViewer} 
              onClose={() => setSelectedTableViewer(null)}
            />
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Tables ({filteredTables.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Row Count</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTables.map((table) => (
                        <TableRow key={table.table_name}>
                          <TableCell className="font-medium">{table.table_name}</TableCell>
                          <TableCell>{table.table_type}</TableCell>
                          <TableCell>
                            {table.actualRowCount?.toLocaleString() || 0}
                            {table.hasError && (
                              <span className="text-red-500 ml-2">({table.error})</span>
                            )}
                          </TableCell>
                          <TableCell>{getTableStatusBadge(table)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTableSelect(table.table_name)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle>Table Structure: {selectedTable}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nullable</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableStructure.map((column) => (
                      <TableRow key={column.column_name}>
                        <TableCell className="font-medium">{column.column_name}</TableCell>
                        <TableCell>{formatDataType(column)}</TableCell>
                        <TableCell>
                          <Badge variant={column.is_nullable === 'YES' ? 'secondary' : 'default'}>
                            {column.is_nullable}
                          </Badge>
                        </TableCell>
                        <TableCell>{column.column_default || '-'}</TableCell>
                        <TableCell>{column.ordinal_position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {selectedTable && tableData && (
            <Card>
              <CardHeader>
                <CardTitle>Table Data: {selectedTable}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing {tableData.data.length} of {tableData.pagination.total.toLocaleString()} rows
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => fetchTableData(selectedTable, currentPage - 1)}
                        disabled={!tableData.pagination.hasPrev || loading}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => fetchTableData(selectedTable, currentPage + 1)}
                        disabled={!tableData.pagination.hasNext || loading}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Page {tableData.pagination.page} of {tableData.pagination.totalPages}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableData.data.length > 0 && Object.keys(tableData.data[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.data.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {value === null ? (
                                  <span className="text-muted-foreground italic">null</span>
                                ) : typeof value === 'object' ? (
                                  <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>
                                ) : (
                                  String(value)
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableValidation;
