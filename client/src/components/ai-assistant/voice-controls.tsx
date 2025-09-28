import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  onVoiceInput: (text: string) => void;
  onSpeech: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export default function VoiceControls({ 
  onVoiceInput, 
  onSpeech, 
  isListening, 
  setIsListening 
}: VoiceControlsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onVoiceInput, setIsListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current && speechEnabled) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      synthRef.current.speak(utterance);
      onSpeech(text);
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (!speechEnabled && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  // Auto-speak AI responses
  useEffect(() => {
    if (speechEnabled && synthRef.current) {
      // This will be called from the parent component when AI responds
    }
  }, [speechEnabled]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={isListening ? stopListening : startListening}
        className={cn(
          "h-8 w-8 p-0",
          isListening && "bg-red-100 text-red-600 animate-pulse"
        )}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSpeech}
        className={cn(
          "h-8 w-8 p-0",
          !speechEnabled && "text-gray-400"
        )}
        title={speechEnabled ? "Disable speech" : "Enable speech"}
      >
        {speechEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
