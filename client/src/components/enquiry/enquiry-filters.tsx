import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnquiryFiltersProps {
  onFiltersChange: (filters: any) => void;
  customers?: any[];
}

export default function EnquiryFilters({ onFiltersChange, customers = [] }: EnquiryFiltersProps) {
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    customerId: "",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    search: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert dates to strings for API
    const apiFilters = {
      ...newFilters,
      dateFrom: newFilters.dateFrom ? format(newFilters.dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: newFilters.dateTo ? format(newFilters.dateTo, "yyyy-MM-dd") : undefined,
    };
    
    // Remove empty values and "all" values
    Object.keys(apiFilters).forEach(key => {
      const val = apiFilters[key as keyof typeof apiFilters];
      if (!val || val === "" || val === "all") {
        delete apiFilters[key as keyof typeof apiFilters];
      }
    });
    
    onFiltersChange(apiFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "",
      source: "",
      customerId: "",
      dateFrom: null,
      dateTo: null,
      search: "",
    };
    setFilters(clearedFilters);
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== "" && value !== null
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Badge variant="secondary" className="gap-1">
                Filtered
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
       

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
                data-testid="select-status"
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Quoted">Quoted</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select
                value={filters.source}
                onValueChange={(value) => handleFilterChange("source", value)}
                data-testid="select-source"
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Web Form">Web Form</SelectItem>
                  <SelectItem value="Walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Select
                value={filters.customerId}
                onValueChange={(value) => handleFilterChange("customerId", value)}
                data-testid="select-customer"
              >
                <SelectTrigger>
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All customers</SelectItem>
                  {customers.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                      data-testid="button-date-from"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom || undefined}
                      onSelect={(date) => handleFilterChange("dateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                      data-testid="button-date-to"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo || undefined}
                      onSelect={(date) => handleFilterChange("dateTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}