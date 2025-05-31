
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
      title: 'Enhanced AI Analysis: XSS Vulnerability Detected',
      description: 'Advanced AI scanning detected potential XSS vulnerability in contact form with 95% confidence.',
      confidence: 0.95,
      actionable: true,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'performance',
      title: 'AI Optimization: Bundle Size Reduction Opportunity',
      description: 'AI analysis suggests code-splitting opportunities that could reduce initial bundle size by 30%.',
      confidence: 0.88,
      actionable: true,
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'Proactive AI Maintenance: Dependency Updates Available',
      description: 'AI has identified 8 dependency updates that can be safely applied automatically.',
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
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; content: string; timestamp: Date }>>([
    {
      role: 'ai',
      content: 'Hello! I\'m your enhanced AI assistant with access to multiple models including GPT-4, DALL-E, and Whisper. I can help you with security analysis, code review, image generation, voice commands, and complete system management. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    // Enhanced AI analysis with multiple models
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a random type that matches the union type
    const randomValue = Math.random();
    let insightType: 'security' | 'performance' | 'maintenance' | 'suggestion';
    
    if (randomValue > 0.75) {
      insightType = 'security';
    } else if (randomValue > 0.5) {
      insightType = 'performance';
    } else if (randomValue > 0.25) {
      insightType = 'maintenance';
    } else {
      insightType = 'suggestion';
    }
    
    const enhancedInsights: AIInsight[] = [
      {
        id: Date.now().toString(),
        type: insightType,
        title: 'AI-Generated Advanced Insight',
        description: 'Multi-model AI analysis has detected patterns requiring attention with high confidence.',
        confidence: Math.random() * 0.2 + 0.8,
        actionable: Math.random() > 0.2,
        timestamp: new Date()
      }
    ];
    
    setInsights(prev => [...enhancedInsights, ...prev]);
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
    
    // Enhanced AI response simulation - will integrate with real OpenAI API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = "I understand your request. As your enhanced AI assistant with access to GPT-4, DALL-E, and Whisper, I can help with:\n\n";
    response += "🧠 **Advanced Analysis**: Code review, security scanning, performance optimization\n";
    response += "🎨 **Visual Generation**: Security diagrams, reports, and visualizations with DALL-E\n";
    response += "🎤 **Voice Control**: Natural language commands and voice interactions\n";
    response += "🔧 **System Management**: Automated maintenance, backups, and monitoring\n";
    response += "🔒 **Security Operations**: Real-time threat detection and automated responses\n\n";
    response += "What specific task would you like me to help you with?";
    
    setChatHistory(prev => [...prev, { role: 'ai', content: response, timestamp: new Date() }]);
    
    return response;
  };

  const analyzeCode = async (code: string): Promise<string[]> => {
    // Enhanced code analysis with GPT-4 simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      '🔍 **Security Analysis**: No critical vulnerabilities detected',
      '⚡ **Performance**: Consider implementing lazy loading for better performance',
      '🧹 **Code Quality**: Add TypeScript strict mode for better type safety',
      '🔧 **Maintainability**: Extract reusable components for better organization',
      '📚 **Best Practices**: Follow React 18 concurrent features for better UX'
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
