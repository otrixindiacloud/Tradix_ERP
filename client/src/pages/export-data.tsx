import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, CalendarIcon, RefreshCw, Database, FileText, Archive, CheckCircle, Clock, XCircle, BarChart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ExportJob {
  id: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}

const EXPORT_TYPES = [
  { value: "enquiries", label: "Enquiries", description: "Customer enquiry data" },
  { value: "quotations", label: "Quotations", description: "Quotation and pricing data" },
  { value: "sales_orders", label: "Sales Orders", description: "Sales order information" },
  { value: "invoices", label: "Invoices", description: "Invoice and payment data" },
  { value: "customers", label: "Customers", description: "Customer master data" },
  { value: "suppliers", label: "Suppliers", description: "Supplier information" },
  { value: "inventory", label: "Inventory", description: "Product and stock data" },
  { value: "audit_logs", label: "Audit Logs", description: "System audit trail" },
  { value: "users", label: "Users", description: "User account data" },
  { value: "all", label: "Complete Database", description: "All data tables" }
];

const FORMAT_OPTIONS = [
  { value: "csv", label: "CSV", description: "Comma-separated values" },
  { value: "excel", label: "Excel", description: "Microsoft Excel format" },
  { value: "json", label: "JSON", description: "JavaScript Object Notation" },
  { value: "xml", label: "XML", description: "Extensible Markup Language" }
];

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom Range" }
];

export default function ExportDataPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("30d");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [includeArchived, setIncludeArchived] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);

  const { toast } = useToast();

  const fetchExportJobs = async () => {
    setJobsLoading(true);
    try {
      // This would typically fetch from an API endpoint
      // For now, we'll simulate with mock data
      const mockJobs: ExportJob[] = [
        {
          id: "1",
          type: "enquiries",
          status: "completed",
          progress: 100,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3500000).toISOString(),
          downloadUrl: "/exports/enquiries_2024-01-15.csv"
        },
        {
          id: "2",
          type: "all",
          status: "processing",
          progress: 65,
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: "3",
          type: "customers",
          status: "failed",
          progress: 0,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          error: "Database connection timeout"
        }
      ];
      setExportJobs(mockJobs);
    } catch (error) {
      console.error("Error fetching export jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchExportJobs();
  }, []);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === EXPORT_TYPES.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(EXPORT_TYPES.map(t => t.value));
    }
  };

  const handleExport = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one data type to export",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const exportData = {
        types: selectedTypes,
        format: exportFormat,
        dateRange: dateRange === "custom" ? {
          from: customDateRange.from?.toISOString().split('T')[0],
          to: customDateRange.to?.toISOString().split('T')[0]
        } : dateRange,
        includeArchived
      };

      const response = await fetch("/api/export/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(exportData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Export job started successfully"
        });
        fetchExportJobs();
      } else {
        throw new Error("Failed to start export job");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start export job",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (job: ExportJob) => {
    if (job.downloadUrl) {
      const link = document.createElement("a");
      link.href = job.downloadUrl;
      link.download = `${job.type}_${format(new Date(job.completedAt!), "yyyy-MM-dd")}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing": return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed": return <Database className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
          <p className="text-muted-foreground">
            Export and backup your data in various formats
          </p>
        </div>
        <Button onClick={fetchExportJobs} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>
              Select data types and configure export options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Types Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Data Types</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedTypes.length === EXPORT_TYPES.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {EXPORT_TYPES.map((type) => (
                  <div key={type.value} className="flex items-start space-x-3">
                    <Checkbox
                      id={type.value}
                      checked={selectedTypes.includes(type.value)}
                      onCheckedChange={() => handleTypeToggle(type.value)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={type.value}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {type.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Export Format */}
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {dateRange === "custom" && (
              <div className="space-y-2">
                <Label>Custom Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customDateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange.from ? (
                        customDateRange.to ? (
                          <>
                            {format(customDateRange.from, "LLL dd, y")} -{" "}
                            {format(customDateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(customDateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={customDateRange.from}
                      selected={customDateRange}
                      onSelect={(range) => setCustomDateRange({ from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeArchived"
                  checked={includeArchived}
                  onCheckedChange={(checked) => setIncludeArchived(checked as boolean)}
                />
                <Label htmlFor="includeArchived" className="text-sm">
                  Include archived records
                </Label>
              </div>
            </div>

            <Separator />

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={loading || selectedTypes.length === 0}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Starting Export..." : "Start Export"}
            </Button>
          </CardContent>
        </Card>

        {/* Export Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Export Jobs</CardTitle>
            <CardDescription>
              Track your export jobs and download completed exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : exportJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No export jobs found
              </div>
            ) : (
              <div className="space-y-4">
                {exportJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span className="font-medium">
                          {EXPORT_TYPES.find(t => t.value === job.type)?.label || job.type}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </div>

                    {job.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}

                    {job.status === "failed" && job.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Error: {job.error}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Created: {format(new Date(job.createdAt), "MMM dd, yyyy HH:mm")}
                      </span>
                      {job.status === "completed" && job.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(job)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Exports</p>
                <p className="text-2xl font-bold text-green-600">
                  {exportJobs.filter(j => j.status === "completed").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Successfully exported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {exportJobs.filter(j => j.status === "processing").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Currently in progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Exports</p>
                <p className="text-2xl font-bold text-red-600">
                  {exportJobs.filter(j => j.status === "failed").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Export failures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exportJobs.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">All export jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
