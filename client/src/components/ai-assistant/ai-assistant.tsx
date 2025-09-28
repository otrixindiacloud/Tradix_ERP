import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAI } from './ai-context';
import AIChatInterface from './ai-chat-interface';

export default function AIAssistant() {
  const { isOpen, isMinimized, toggleAssistant, toggleMinimize, closeAssistant } = useAI();

  const handleButtonClick = () => {
    console.log('AI Assistant button clicked!');
    toggleAssistant();
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button
            onClick={handleButtonClick}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-2 border-white hover:scale-105"
            size="lg"
            data-testid="ai-assistant-floating-button"
          >
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-green-500 hover:bg-green-500 animate-pulse">
                <Sparkles className="h-3 w-3" />
              </Badge>
            </div>
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI Assistant - Ask me anything!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        </div>
      )}

      {/* AI Chat Interface */}
      {isOpen && (
        <AIChatInterface
          isMinimized={isMinimized}
          onToggleMinimize={toggleMinimize}
          onClose={closeAssistant}
        />
      )}
    </>
  );
}
