
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Search, MessageSquare, Plus, Brain, ArrowLeft, Home } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';
import AIChat from './AIChat';

const KnowledgeBase: React.FC = () => {
  const { knowledgeBase, searchKnowledge, addKnowledge } = useAI();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(knowledgeBase);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResults(searchKnowledge(searchQuery));
    } else {
      setSearchResults(knowledgeBase);
    }
  };

  const addNewKnowledge = () => {
    const title = prompt('Enter knowledge title:');
    const content = prompt('Enter knowledge content:');
    const category = prompt('Enter category:');
    
    if (title && content && category) {
      addKnowledge({
        title,
        content,
        category,
        tags: [],
        learned: false,
        source: 'manual'
      });
      setSearchResults(knowledgeBase);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            <Home className="w-4 h-4 inline mr-1" />
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span>Knowledge Base</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">AI-powered knowledge management and chat assistant</p>
        </div>
        <Button onClick={addNewKnowledge} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Knowledge
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Knowledge</TabsTrigger>
          <TabsTrigger value="chat">AI Chat Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search */}
          <Card className="panel">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {searchResults.map((item) => (
              <Card key={item.id} className="panel">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="w-5 h-5 text-primary" />
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.learned && (
                        <Brain className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{item.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Source: {item.source === 'manual' ? 'Manual Entry' : item.source === 'ai-generated' ? 'AI Generated' : 'Scan Result'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchResults.length === 0 && (
            <Card className="panel">
              <CardContent className="p-8 text-center">
                <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No knowledge items found. Try a different search term.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="chat">
          <AIChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;
