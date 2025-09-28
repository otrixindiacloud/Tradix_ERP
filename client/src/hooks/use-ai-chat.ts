import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface AIContext {
  currentPage?: string;
  userRole?: string;
  recentActivity?: any[];
}

interface UseChatOptions {
  initialMessages?: Message[];
  context?: AIContext;
}

export function useAIChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(
    options.initialMessages || [
      {
        id: '1',
        content: "Hello! I'm your ERP AI Assistant. I can help you with enquiries, quotations, inventory management, customer information, and much more. How can I assist you today?",
        role: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "Show me recent enquiries",
          "Help me create a quotation",
          "Check inventory levels",
          "Generate sales report"
        ]
      }
    ]
  );

  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async ({ message, context }: { message: string; context?: Message[] }) => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: context?.slice(-5), // Send last 5 messages for context
          pageContext: options.context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        suggestions: data.suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    },
  });

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    sendMessage.mutate({
      message: content,
      context: messages,
    });
  }, [messages, sendMessage]);

  // Get AI suggestions based on current context
  const getContextualSuggestions = useQuery({
    queryKey: ['ai-suggestions', options.context?.currentPage],
    queryFn: async () => {
      if (!options.context?.currentPage) return [];
      
      const response = await fetch(`/api/ai/suggestions?page=${options.context.currentPage}`);
      if (!response.ok) throw new Error('Failed to get suggestions');
      return response.json();
    },
    enabled: !!options.context?.currentPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    messages,
    isLoading,
    sendMessage: handleSendMessage,
    suggestions: getContextualSuggestions.data || [],
    clearMessages: () => setMessages([]),
  };
}
