
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIInsight {
  id: string;
  type: 'security' | 'performance' | 'maintenance' | 'suggestion';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  learned: boolean;
  source: 'manual' | 'ai-generated' | 'scan-result';
}

interface AIContextType {
  insights: AIInsight[];
  knowledgeBase: KnowledgeItem[];
  isAnalyzing: boolean;
  chatHistory: Array<{ role: 'user' | 'ai'; content: string; timestamp: Date }>;
  generateInsights: () => Promise<void>;
  addKnowledge: (item: Omit<KnowledgeItem, 'id'>) => void;
  searchKnowledge: (query: string) => KnowledgeItem[];
  chatWithAI: (message: string) => Promise<string>;
  analyzeCode: (code: string) => Promise<string[]>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'security',
      title: 'Potential XSS Vulnerability Detected',
      description: 'User input is not properly sanitized in the contact form component.',
      confidence: 0.85,
      actionable: true,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'performance',
      title: 'Bundle Size Optimization Opportunity',
      description: 'Large dependencies detected that could be code-split for better performance.',
      confidence: 0.92,
      actionable: true,
      timestamp: new Date()
    }
  ]);

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'XSS Prevention Best Practices',
      content: 'Cross-site scripting (XSS) attacks can be prevented by properly sanitizing user input...',
      category: 'Security',
      tags: ['xss', 'security', 'sanitization'],
      learned: true,
      source: 'ai-generated'
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; content: string; timestamp: Date }>>([]);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis - replace with real Claude/OpenAI integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsight: AIInsight = {
      id: Date.now().toString(),
      type: Math.random() > 0.5 ? 'maintenance' : 'suggestion',
      title: 'New AI-Generated Insight',
      description: 'AI has detected a pattern that requires attention.',
      confidence: Math.random() * 0.3 + 0.7,
      actionable: Math.random() > 0.3,
      timestamp: new Date()
    };
    
    setInsights(prev => [newInsight, ...prev]);
    setIsAnalyzing(false);
  };

  const addKnowledge = (item: Omit<KnowledgeItem, 'id'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: Date.now().toString()
    };
    setKnowledgeBase(prev => [newItem, ...prev]);
  };

  const searchKnowledge = (query: string): KnowledgeItem[] => {
    return knowledgeBase.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const chatWithAI = async (message: string): Promise<string> => {
    setChatHistory(prev => [...prev, { role: 'user', content: message, timestamp: new Date() }]);
    
    // Simulate AI response - replace with real AI integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = "I understand your request. As an AI assistant for your security and maintenance system, I can help you with various tasks including code analysis, security recommendations, and system optimization.";
    
    setChatHistory(prev => [...prev, { role: 'ai', content: response, timestamp: new Date() }]);
    
    return response;
  };

  const analyzeCode = async (code: string): Promise<string[]> => {
    // Simulate code analysis - replace with real RepairAgent integration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      'Consider using TypeScript for better type safety',
      'Add error handling for async operations',
      'Implement proper input validation'
    ];
  };

  return (
    <AIContext.Provider value={{
      insights,
      knowledgeBase,
      isAnalyzing,
      chatHistory,
      generateInsights,
      addKnowledge,
      searchKnowledge,
      chatWithAI,
      analyzeCode
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
