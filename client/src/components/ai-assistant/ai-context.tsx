import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface AIContextType {
  isOpen: boolean;
  isMinimized: boolean;
  currentPage: string;
  toggleAssistant: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleMinimize: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [location] = useLocation();

  const toggleAssistant = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const openAssistant = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeAssistant = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        isMinimized,
        currentPage: location,
        toggleAssistant,
        openAssistant,
        closeAssistant,
        toggleMinimize,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}
