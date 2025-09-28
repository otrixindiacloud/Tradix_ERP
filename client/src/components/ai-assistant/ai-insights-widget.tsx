import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { RiRobot2Line } from "react-icons/ri";
import { useAI } from './ai-context';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  action?: string;
  priority: number;
}

interface AIInsightsWidgetProps {
  page?: string;
  data?: any;
  className?: string;
}

export default function AIInsightsWidget({ page, data, className }: AIInsightsWidgetProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openAssistant } = useAI();

  useEffect(() => {
    generateInsights();
  }, [page, data]);

  const generateInsights = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI-generated insights based on page and data
      const generatedInsights = await getPageInsights(page, data);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleAskAI = (insight: Insight) => {
    openAssistant();
    // You could also pre-populate a question about this insight
  };

  if (insights.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-purple-500 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Insights
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openAssistant()}
            className=""
          >
            <RiRobot2Line className="h-4 w-4 mr-1" />
            Ask AI
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
            Analyzing data...
          </div>
        ) : (
          insights.slice(0, 3).map((insight) => (
            <div 
              key={insight.id}
              className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleAskAI(insight)}
            >
              <div className="mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {insight.title}
                  </h4>
                  <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                    P{insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{insight.description}</p>
                {insight.action && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs p-0 h-auto text-purple-600 hover:text-purple-700"
                  >
                    {insight.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
        
        {insights.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-purple-600 hover:text-purple-700"
            onClick={() => openAssistant()}
          >
            View all insights ({insights.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Simulate AI-generated insights based on page context
async function getPageInsights(page?: string, data?: any): Promise<Insight[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const baseInsights: Record<string, Insight[]> = {
    '/dashboard': [
      {
        id: '1',
        type: 'info',
        title: 'Sales Trend Analysis',
        description: 'Your sales are up 15% this month compared to last month.',
        action: 'View detailed report',
        priority: 1
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Stock Alert',
        description: '5 items are running low and may need reordering soon.',
        action: 'Review inventory',
        priority: 2
      },
      {
        id: '3',
        type: 'success',
        title: 'Customer Satisfaction',
        description: 'Customer response time improved by 20% this week.',
        priority: 3
      }
    ],
    '/enquiries': [
      {
        id: '1',
        type: 'info',
        title: 'Conversion Opportunity',
        description: '3 enquiries have been pending for over 48 hours.',
        action: 'Follow up on enquiries',
        priority: 1
      },
      {
        id: '2',
        type: 'success',
        title: 'Response Time',
        description: 'Average enquiry response time is 12 minutes - excellent!',
        priority: 2
      }
    ],
    '/quotations': [
      {
        id: '1',
        type: 'warning',
        title: 'Pending Approvals',
        description: '2 quotations are waiting for approval beyond normal time.',
        action: 'Review approvals',
        priority: 1
      },
      {
        id: '2',
        type: 'info',
        title: 'Pricing Analysis',
        description: 'Consider reviewing markup on electronics category.',
        action: 'Analyze pricing',
        priority: 2
      }
    ],
    '/inventory': [
      {
        id: '1',
        type: 'error',
        title: 'Stock Shortage',
        description: '2 items are completely out of stock.',
        action: 'Immediate reorder needed',
        priority: 1
      },
      {
        id: '2',
        type: 'info',
        title: 'Inventory Turnover',
        description: 'Electronics category has 30% faster turnover than average.',
        priority: 2
      }
    ]
  };
  
  return baseInsights[page || '/dashboard'] || [
    {
      id: '1',
      type: 'info',
      title: 'AI Assistant Ready',
      description: 'Ask me anything about your ERP system.',
      action: 'Start conversation',
      priority: 1
    }
  ];
}
