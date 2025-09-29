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
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TableViewerProps {
  tableName: string;
  onClose?: () => void;
}

interface TableColumn {
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

interface TableStats {
  size: {
    total_size: string;
    table_size: string;
    indexes_size: string;
  };
  statistics: {
    inserts: number;
    updates: number;
    deletes: number;
    live_tuples: number;
    dead_tuples: number;
    last_vacuum: string | null;
    last_autovacuum: string | null;
    last_analyze: string | null;
    last_autoanalyze: string | null;
  };
  indexes: Array<{
    indexname: string;
    indexdef: string;
    size: string;
  }>;
}

const TableViewer: React.FC<TableViewerProps> = ({ tableName, onClose }) => {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [data, setData] = useState<TableData | null>(null);
  const [stats, setStats] = useState<TableStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [activeTab, setActiveTab] = useState('data');

  // Fetch table structure
  const fetchStructure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/table-validation/tables/${tableName}/structure`);
      const result = await response.json();
      
      if (result.success) {
        setColumns(result.columns);
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
  const fetchData = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/table-validation/tables/${tableName}/data?page=${page}&limit=50`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
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

  // Fetch table statistics
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/table-validation/tables/${tableName}/stats`);
      const result = await response.json();
      
      if (result.success) {
        setStats(result);
      } else {
        setError(result.error || 'Failed to fetch table statistics');
      }
    } catch (err) {
      setError('Network error while fetching table statistics');
      console.error('Error fetching table statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort
  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  // Handle edit row
  const handleEditRow = (index: number, rowData: any) => {
    setEditingRow(index);
    setEditingData({ ...rowData });
  };

  // Handle save row
  const handleSaveRow = async () => {
    // Implementation for saving edited row
    console.log('Saving row:', editingData);
    setEditingRow(null);
    setEditingData({});
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingData({});
  };

  // Format data type for display
  const formatDataType = (column: TableColumn) => {
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

  // Format cell value for display
  const formatCellValue = (value: any) => {
    if (value === null) {
      return <span className="text-muted-foreground italic">null</span>;
    }
    if (typeof value === 'object') {
      return <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>;
    }
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'true' : 'false'}</Badge>;
    }
    return String(value);
  };

  // Get sort icon
  const getSortIcon = (columnName: string) => {
    if (sortColumn !== columnName) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  useEffect(() => {
    fetchStructure();
    fetchData();
    fetchStats();
  }, [tableName]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TableIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">{tableName}</h2>
          {data && (
            <Badge variant="outline">
              {data.pagination.total.toLocaleString()} rows
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => fetchData(currentPage)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => fetchStats()} disabled={loading}>
            <Settings className="h-4 w-4 mr-2" />
            Stats
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
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
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in table data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Table Data</CardTitle>
              {data && (
                <p className="text-sm text-muted-foreground">
                  Showing {data.data.length} of {data.pagination.total.toLocaleString()} rows
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pagination Controls */}
                {data && (
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => fetchData(currentPage - 1)}
                        disabled={!data.pagination.hasPrev || loading}
                        variant="outline"
                        size="sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        onClick={() => fetchData(currentPage + 1)}
                        disabled={!data.pagination.hasNext || loading}
                        variant="outline"
                        size="sm"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Page {data.pagination.page} of {data.pagination.totalPages}
                    </div>
                  </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead 
                            key={column.column_name}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort(column.column_name)}
                          >
                            <div className="flex items-center space-x-1">
                              <span>{column.column_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {getSortIcon(column.column_name)}
                              </span>
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data.map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell key={column.column_name}>
                              {editingRow === index ? (
                                <Input
                                  value={editingData[column.column_name] || ''}
                                  onChange={(e) => setEditingData({
                                    ...editingData,
                                    [column.column_name]: e.target.value
                                  })}
                                  className="h-8"
                                />
                              ) : (
                                formatCellValue(row[column.column_name])
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            {editingRow === index ? (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleSaveRow}
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEditRow(index, row)}>
                                    <Edit className="h-3 w-3 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Structure</CardTitle>
              <p className="text-sm text-muted-foreground">
                {columns.length} columns
              </p>
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
                  {columns.map((column) => (
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
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Table Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.size.table_size}</div>
                    <p className="text-xs text-muted-foreground">Data only</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.size.total_size}</div>
                    <p className="text-xs text-muted-foreground">Including indexes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Indexes Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.size.indexes_size}</div>
                    <p className="text-xs text-muted-foreground">Index data</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Table Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Inserts</p>
                      <p className="text-lg font-semibold">{stats.statistics.inserts?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Updates</p>
                      <p className="text-lg font-semibold">{stats.statistics.updates?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deletes</p>
                      <p className="text-lg font-semibold">{stats.statistics.deletes?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Live Tuples</p>
                      <p className="text-lg font-semibold">{stats.statistics.live_tuples?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {stats.indexes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Indexes ({stats.indexes.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Index Name</TableHead>
                          <TableHead>Definition</TableHead>
                          <TableHead>Size</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.indexes.map((index) => (
                          <TableRow key={index.indexname}>
                            <TableCell className="font-medium">{index.indexname}</TableCell>
                            <TableCell className="font-mono text-xs">{index.indexdef}</TableCell>
                            <TableCell>{index.size}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableViewer;
