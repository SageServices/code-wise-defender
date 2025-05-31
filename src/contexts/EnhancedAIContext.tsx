
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AIModel {
  id: string;
  name: string;
  type: 'text' | 'image' | 'speech' | 'code';
  provider: 'openai' | 'elevenlabs';
  capabilities: string[];
}

export interface AICommand {
  id: string;
  command: string;
  action: string;
  parameters?: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  voiceId: string;
  autoListen: boolean;
  wakeWord: string;
}

interface EnhancedAIContextType {
  // Models
  availableModels: AIModel[];
  currentModel: AIModel | null;
  switchModel: (modelId: string) => void;
  
  // Commands
  commands: AICommand[];
  executeCommand: (command: string) => Promise<void>;
  
  // Voice
  voiceSettings: VoiceSettings;
  isListening: boolean;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  
  // AI Capabilities
  generateImage: (prompt: string) => Promise<string>;
  analyzeCode: (code: string, language: string) => Promise<string>;
  generateReport: (type: string, data: any) => Promise<string>;
  
  // System Control
  isAIActive: boolean;
  aiStatus: string;
  systemAccess: boolean;
  
  // API Keys (will be stored in Supabase secrets)
  hasOpenAIKey: boolean;
  hasElevenLabsKey: boolean;
}

const EnhancedAIContext = createContext<EnhancedAIContextType | undefined>(undefined);

export const EnhancedAIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableModels] = useState<AIModel[]>([
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      type: 'text',
      provider: 'openai',
      capabilities: ['chat', 'code-analysis', 'reasoning', 'vision']
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      type: 'text',
      provider: 'openai',
      capabilities: ['chat', 'code-analysis', 'fast-response']
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      type: 'image',
      provider: 'openai',
      capabilities: ['image-generation', 'visual-reports']
    },
    {
      id: 'whisper-1',
      name: 'Whisper',
      type: 'speech',
      provider: 'openai',
      capabilities: ['speech-to-text', 'transcription']
    }
  ]);

  const [currentModel, setCurrentModel] = useState<AIModel | null>(availableModels[0]);
  const [commands, setCommands] = useState<AICommand[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAIActive, setIsAIActive] = useState(true);
  const [aiStatus, setAiStatus] = useState('Ready');
  
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    language: 'en-US',
    voiceId: 'default',
    autoListen: false,
    wakeWord: 'Hey AI'
  });

  // Simulated API key status - in production, check Supabase secrets
  const [hasOpenAIKey] = useState(false); // Will be true when user adds key
  const [hasElevenLabsKey] = useState(false); // Will be true when user adds key

  const switchModel = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model);
      console.log(`Switched to model: ${model.name}`);
    }
  };

  const executeCommand = async (command: string) => {
    const commandObj: AICommand = {
      id: Date.now().toString(),
      command,
      action: 'processing',
      timestamp: new Date(),
      status: 'pending'
    };

    setCommands(prev => [commandObj, ...prev]);
    setAiStatus('Processing command...');

    try {
      // Command processing logic will be implemented here
      // This is where we'll parse natural language and execute actions
      await processNaturalLanguageCommand(command, commandObj.id);
    } catch (error) {
      console.error('Command execution failed:', error);
      updateCommandStatus(commandObj.id, 'failed');
    }
  };

  const processNaturalLanguageCommand = async (command: string, commandId: string) => {
    updateCommandStatus(commandId, 'executing');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock command processing - will implement real GPT-4 processing
    if (command.toLowerCase().includes('scan')) {
      setAiStatus('Running security scan...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateCommandStatus(commandId, 'completed', 'Security scan completed');
    } else if (command.toLowerCase().includes('generate') && command.toLowerCase().includes('report')) {
      setAiStatus('Generating report...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateCommandStatus(commandId, 'completed', 'Report generated successfully');
    } else {
      updateCommandStatus(commandId, 'completed', 'Command processed');
    }
    
    setAiStatus('Ready');
  };

  const updateCommandStatus = (commandId: string, status: AICommand['status'], result?: any) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId ? { ...cmd, status, result } : cmd
    ));
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      setAiStatus('Listening...');
      console.log('Started voice recognition');
    } else {
      console.log('Speech recognition not supported');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setAiStatus('Ready');
    console.log('Stopped voice recognition');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const generateImage = async (prompt: string): Promise<string> => {
    setAiStatus('Generating image...');
    // Mock implementation - will implement real DALL-E integration
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAiStatus('Ready');
    return 'https://via.placeholder.com/512x512?text=AI+Generated+Image';
  };

  const analyzeCode = async (code: string, language: string): Promise<string> => {
    setAiStatus('Analyzing code...');
    // Mock implementation - will implement real GPT-4 code analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAiStatus('Ready');
    return `Code analysis complete for ${language}. Found 3 potential improvements and 1 security concern.`;
  };

  const generateReport = async (type: string, data: any): Promise<string> => {
    setAiStatus('Generating report...');
    // Mock implementation - will implement real report generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    setAiStatus('Ready');
    return `${type} report generated successfully with AI insights and recommendations.`;
  };

  return (
    <EnhancedAIContext.Provider value={{
      availableModels,
      currentModel,
      switchModel,
      commands,
      executeCommand,
      voiceSettings,
      isListening,
      isSpeaking,
      startListening,
      stopListening,
      speak,
      generateImage,
      analyzeCode,
      generateReport,
      isAIActive,
      aiStatus,
      systemAccess: true,
      hasOpenAIKey,
      hasElevenLabsKey
    }}>
      {children}
    </EnhancedAIContext.Provider>
  );
};

export const useEnhancedAI = () => {
  const context = useContext(EnhancedAIContext);
  if (!context) {
    throw new Error('useEnhancedAI must be used within an EnhancedAIProvider');
  }
  return context;
};
