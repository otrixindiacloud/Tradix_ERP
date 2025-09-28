import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function BlueThemeTest() {
  const { toast } = useToast();

  const showToast = (variant: 'success' | 'info' | 'warning' | 'error') => {
    toast({
      title: "Success",
      description: "Enquiry created successfully",
      variant: variant,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-900">Blue Theme Test</h1>
          <p className="text-blue-600 text-lg">Testing the enhanced blue UI theme</p>
        </div>

        {/* Toast Notifications Test */}
        <Card className="blue-border">
          <CardHeader>
            <CardTitle className="text-blue-900">Toast Notifications</CardTitle>
            <CardDescription className="text-blue-600">
              Test different toast notification variants with blue theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => showToast('success')} className="btn-success">
                Success Toast
              </Button>
              <Button onClick={() => showToast('info')} className="btn-primary">
                Info Toast
              </Button>
              <Button onClick={() => showToast('warning')} className="btn-warning">
                Warning Toast
              </Button>
              <Button onClick={() => showToast('error')} className="btn-danger">
                Error Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Badges Test */}
        <Card className="blue-border">
          <CardHeader>
            <CardTitle className="text-blue-900">Status Badges</CardTitle>
            <CardDescription className="text-blue-600">
              Blue-themed status indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge className="status-new">New</Badge>
              <Badge className="status-in-progress">In Progress</Badge>
              <Badge className="status-pending">Pending</Badge>
              <Badge className="status-completed">Completed</Badge>
              <Badge className="status-cancelled">Cancelled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-icon">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
            <div className="kpi-card-content">
              <div className="kpi-value">1,234</div>
              <div className="kpi-label">Total Enquiries</div>
            </div>
          </Card>

          <Card className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-icon">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="kpi-card-content">
              <div className="kpi-value">567</div>
              <div className="kpi-label">Completed Orders</div>
            </div>
          </Card>

          <Card className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-icon">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="kpi-card-content">
              <div className="kpi-value">$89,432</div>
              <div className="kpi-label">Total Revenue</div>
            </div>
          </Card>
        </div>

        {/* Table Test */}
        <Card className="blue-border">
          <CardHeader>
            <CardTitle className="text-blue-900">Sample Data Table</CardTitle>
            <CardDescription className="text-blue-600">
              Blue-themed table with hover effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell-header">ID</th>
                    <th className="table-cell-header">Name</th>
                    <th className="table-cell-header">Status</th>
                    <th className="table-cell-header">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="table-cell">001</td>
                    <td className="table-cell">Sample Enquiry</td>
                    <td className="table-cell">
                      <Badge className="status-new">New</Badge>
                    </td>
                    <td className="table-cell">2024-01-15</td>
                  </tr>
                  <tr className="table-row">
                    <td className="table-cell">002</td>
                    <td className="table-cell">Another Item</td>
                    <td className="table-cell">
                      <Badge className="status-in-progress">In Progress</Badge>
                    </td>
                    <td className="table-cell">2024-01-16</td>
                  </tr>
                  <tr className="table-row">
                    <td className="table-cell">003</td>
                    <td className="table-cell">Third Item</td>
                    <td className="table-cell">
                      <Badge className="status-completed">Completed</Badge>
                    </td>
                    <td className="table-cell">2024-01-17</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Utility Classes Test */}
        <Card className="blue-border">
          <CardHeader>
            <CardTitle className="text-blue-900">Utility Classes</CardTitle>
            <CardDescription className="text-blue-600">
              Test blue-themed utility classes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="blue-gradient p-4 rounded-lg text-white">
                <h3 className="font-semibold">Blue Gradient</h3>
                <p>This uses the blue-gradient class</p>
              </div>
              <div className="blue-gradient-light p-4 rounded-lg blue-text-dark">
                <h3 className="font-semibold">Light Blue Gradient</h3>
                <p>This uses the blue-gradient-light class</p>
              </div>
              <div className="blue-bg-light p-4 rounded-lg blue-border border">
                <h3 className="font-semibold blue-text-dark">Light Blue Background</h3>
                <p className="blue-text">This uses blue-bg-light and blue-text classes</p>
              </div>
              <div className="blue-bg-medium p-4 rounded-lg blue-border border blue-hover">
                <h3 className="font-semibold blue-text-dark">Medium Blue Background</h3>
                <p className="blue-text">This uses blue-bg-medium with hover effects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
