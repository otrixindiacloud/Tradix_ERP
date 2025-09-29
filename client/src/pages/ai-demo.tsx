import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIInsightsWidget from '@/components/ai-assistant/ai-insights-widget';
import { useAI } from '@/components/ai-assistant/ai-context';
import { NotificationDemoEnhanced } from '@/components/notifications/notification-demo-enhanced';
import { 
  Bot, 
  MessageCircle, 
  Mic, 
  Volume2, 
  Brain, 
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Users,
  Package,
  FileText,
  BarChart3,
  Lightbulb,
  Rocket,
  Bell
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: "Interactive Chat",
    description: "Natural language conversations about your ERP data and processes",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    icon: Mic,
    title: "Voice Commands",
    description: "Speak to your AI assistant using speech recognition technology",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    icon: Brain,
    title: "Smart Insights",
    description: "AI-generated business intelligence and actionable recommendations",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "One-click access to common tasks and workflows",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  {
    icon: Target,
    title: "Context Aware",
    description: "Understands your current page and provides relevant assistance",
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    icon: Volume2,
    title: "Voice Responses",
    description: "Listen to AI responses with text-to-speech capability",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  }
];

const useCases = [
  {
    title: "Enquiry Management",
    description: "Get help creating enquiries, tracking status, and converting to quotations",
    example: "Help me create a new enquiry for electronics items"
  },
  {
    title: "Inventory Insights",
    description: "Monitor stock levels, get reorder alerts, and manage suppliers",
    example: "What items are running low and need reordering?"
  },
  {
    title: "Sales Analytics",
    description: "Analyze performance, identify trends, and get growth recommendations",
    example: "Show me this month's sales performance vs last month"
  },
  {
    title: "Customer Support",
    description: "Manage customer profiles, payment terms, and relationships",
    example: "How do I set up payment terms for a new wholesale customer?"
  },
  {
    title: "Process Guidance",
    description: "Step-by-step assistance for complex workflows and procedures",
    example: "Guide me through the quotation approval process"
  },
  {
    title: "Data Analysis",
    description: "Generate reports, identify patterns, and get business insights",
    example: "Analyze my inventory turnover by category"
  }
];

export default function AIDemoPage() {
  const { openAssistant } = useAI();

  const handleTryFeature = (example: string) => {
    openAssistant();
    // You could also pre-populate the chat with the example
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            ERP AI Assistant
          </h1>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Sparkles className="h-4 w-4 mr-1" />
            Powered by AI
          </Badge>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your intelligent business companion that understands your ERP system and helps you work more efficiently
        </p>
        <Button 
          onClick={openAssistant}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          size="lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Start Conversation
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Demo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Smart Insights Demo
        </h2>
        <AIInsightsWidget page="/dashboard" />
      </div>

      {/* Notification System Demo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          Notification System Demo
        </h2>
        <NotificationDemoEnhanced />
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
          What Can the AI Assistant Help You With?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">{useCase.description}</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 italic">"{useCase.example}"</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTryFeature(useCase.example)}
                  className="w-full"
                >
                  Try This Example
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Click the floating AI button in the bottom-right corner</li>
                <li>Type your question or click the microphone for voice input</li>
                <li>Use quick action buttons for common tasks</li>
                <li>Click on suggestions to explore related topics</li>
              </ol>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Pro Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>Be specific about what you need help with</li>
                <li>Ask follow-up questions for more detailed guidance</li>
                <li>Use voice commands for hands-free operation</li>
                <li>Check the insights widget for proactive recommendations</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <Button onClick={openAssistant} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Try AI Assistant Now
            </Button>
            <Button variant="outline" className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Benefits for Your Business
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Increased Efficiency</h3>
              <p className="text-sm text-gray-600">Reduce time spent searching for information and completing routine tasks</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Better Decisions</h3>
              <p className="text-sm text-gray-600">Make data-driven decisions with AI-powered insights and recommendations</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Improved Training</h3>
              <p className="text-sm text-gray-600">New users can learn the system faster with guided assistance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
