import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge, { StatusType, getStatusColorClass, getStatusIcon } from '@/components/ui/status-badge';
import { StatusPill } from '@/components/status/status-pill';

/**
 * StatusBadge Examples
 * 
 * This page demonstrates how to use the new StatusBadge component
 * with all available status types and their color mappings.
 */
export default function StatusBadgeExamples() {
  // All available status types with their exact color mappings
  const statusTypes: { status: StatusType; description: string }[] = [
    { status: 'Completed', description: 'Task or process is finished successfully' },
    { status: 'Approved', description: 'Item has been reviewed and approved' },
    { status: 'In Progress', description: 'Currently being worked on' },
    { status: 'Open', description: 'Available for processing or review' },
    { status: 'Pending', description: 'Waiting for action or approval' },
    { status: 'Cancelled', description: 'Process has been cancelled' },
    { status: 'Rejected', description: 'Item has been reviewed and rejected' },
    { status: 'On Hold', description: 'Temporarily paused or suspended' },
    { status: 'Overdue', description: 'Past the expected completion date' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Status Badge Components</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive examples of the StatusBadge and enhanced StatusPill components
          with predefined color mappings for common business status types.
        </p>
      </div>

      {/* New StatusBadge Component Examples */}
      <Card>
        <CardHeader>
          <CardTitle>StatusBadge Component</CardTitle>
          <CardDescription>
            New reusable component with precise color mapping for business status types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Default Size with Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Default Size (with icons)</h3>
            <div className="flex flex-wrap gap-3">
              {statusTypes.map(({ status }) => (
                <StatusBadge key={status} status={status} />
              ))}
            </div>
          </div>

          {/* Without Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Without Icons</h3>
            <div className="flex flex-wrap gap-3">
              {statusTypes.map(({ status }) => (
                <StatusBadge key={status} status={status} showIcon={false} />
              ))}
            </div>
          </div>

          {/* Different Sizes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Size Variants</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600 w-16">Small:</span>
                <StatusBadge status="Completed" size="sm" />
                <StatusBadge status="In Progress" size="sm" />
                <StatusBadge status="Pending" size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600 w-16">Default:</span>
                <StatusBadge status="Completed" />
                <StatusBadge status="In Progress" />
                <StatusBadge status="Pending" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600 w-16">Large:</span>
                <StatusBadge status="Completed" size="lg" />
                <StatusBadge status="In Progress" size="lg" />
                <StatusBadge status="Pending" size="lg" />
              </div>
            </div>
          </div>

          {/* Minimal Variant for Tables */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Minimal Variant (Perfect for Tables)</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Simple colored text without background - ideal for table cells where highlighting would be too prominent</p>
              <div className="flex flex-wrap gap-3">
                {statusTypes.map(({ status }) => (
                  <StatusBadge key={status} status={status} variant="minimal" />
                ))}
              </div>
            </div>
          </div>

          {/* Color Mapping Reference */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Color Mapping Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusTypes.map(({ status, description }) => (
                <div key={status} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="text-xs text-gray-500">
                      {getStatusColorClass(status).split(' ').find(c => c.startsWith('bg-'))}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced StatusPill Component Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced StatusPill Component</CardTitle>
          <CardDescription>
            Existing component updated with new status mappings (backward compatible)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* StatusPill Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-3">StatusPill with New Mappings</h3>
            <div className="flex flex-wrap gap-3">
              <StatusPill status="completed" />
              <StatusPill status="approved" />
              <StatusPill status="in-progress" />
              <StatusPill status="open" />
              <StatusPill status="pending" />
              <StatusPill status="cancelled" />
              <StatusPill status="rejected" />
              <StatusPill status="on-hold" />
              <StatusPill status="overdue" />
            </div>
          </div>

          {/* Fuzzy Matching Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Fuzzy Status Matching</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm text-gray-600">Variations:</span>
                <StatusPill status="Complete" />
                <StatusPill status="COMPLETED" />
                <StatusPill status="Task Completed" />
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm text-gray-600">Progress:</span>
                <StatusPill status="In Progress" />
                <StatusPill status="progress" />
                <StatusPill status="Working in progress" />
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm text-gray-600">Hold:</span>
                <StatusPill status="On Hold" />
                <StatusPill status="hold" />
                <StatusPill status="Put on hold" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            Code examples for implementing status badges in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Basic StatusBadge Usage</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`import StatusBadge from '@/components/ui/status-badge';

// Basic usage
<StatusBadge status="Completed" />

// Without icon
<StatusBadge status="In Progress" showIcon={false} />

// Different sizes
<StatusBadge status="Pending" size="lg" />

// With custom className
<StatusBadge status="Approved" className="ml-2" />`}
              </pre>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Enhanced StatusPill Usage</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`import { StatusPill } from '@/components/status/status-pill';

// Works with exact status names
<StatusPill status="completed" />

// Fuzzy matching for variations
<StatusPill status="Task Completed" />
<StatusPill status="In Progress" />
<StatusPill status="On Hold" />`}
              </pre>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Helper Functions</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`import { getStatusColorClass, getStatusIcon } from '@/components/ui/status-badge';

// Get color class for custom styling
const colorClass = getStatusColorClass('Completed');
// Returns: "bg-green-600 text-white"

// Get status icon for custom components
const icon = getStatusIcon('In Progress');
// Returns: <Clock className="h-3 w-3" />`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Examples of using status badges in tables and lists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            {/* Table Example */}
            <div>
              <h4 className="font-medium mb-3">In Data Tables (Minimal Variant)</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3">Task</th>
                      <th className="text-left p-3">Assignee</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3">Design Review</td>
                      <td className="p-3">John Doe</td>
                      <td className="p-3"><StatusBadge status="Completed" variant="minimal" /></td>
                      <td className="p-3">2024-01-15</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Code Implementation</td>
                      <td className="p-3">Jane Smith</td>
                      <td className="p-3"><StatusBadge status="In Progress" variant="minimal" /></td>
                      <td className="p-3">2024-01-20</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Testing Phase</td>
                      <td className="p-3">Mike Johnson</td>
                      <td className="p-3"><StatusBadge status="Pending" variant="minimal" /></td>
                      <td className="p-3">2024-01-25</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Documentation</td>
                      <td className="p-3">Sarah Wilson</td>
                      <td className="p-3"><StatusBadge status="Overdue" variant="minimal" /></td>
                      <td className="p-3">2024-01-10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Table Example */}
            <div>
              <h4 className="font-medium mb-3">Variant Comparison in Tables</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Default Badges */}
                <div>
                  <h5 className="text-sm font-medium mb-2 text-gray-600">Default Badges (Highlighted)</h5>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Task</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">Task 1</td>
                          <td className="p-2"><StatusBadge status="Completed" size="sm" /></td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Task 2</td>
                          <td className="p-2"><StatusBadge status="In Progress" size="sm" /></td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Task 3</td>
                          <td className="p-2"><StatusBadge status="Pending" size="sm" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Minimal Badges */}
                <div>
                  <h5 className="text-sm font-medium mb-2 text-gray-600">Minimal Badges (Simple Text)</h5>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Task</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">Task 1</td>
                          <td className="p-2"><StatusBadge status="Completed" variant="minimal" /></td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Task 2</td>
                          <td className="p-2"><StatusBadge status="In Progress" variant="minimal" /></td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Task 3</td>
                          <td className="p-2"><StatusBadge status="Pending" variant="minimal" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Example */}
            <div>
              <h4 className="font-medium mb-3">In Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">Project Alpha</CardTitle>
                    <StatusBadge status="In Progress" size="sm" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Frontend development for the new dashboard interface.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">API Integration</CardTitle>
                    <StatusBadge status="Completed" size="sm" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Backend API integration with third-party services.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}