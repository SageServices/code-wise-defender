
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Send, 
  Brain, 
  Image, 
  Code, 
  Volume2, 
  VolumeX,
  Settings,
  Zap,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useEnhancedAI } from '../../contexts/EnhancedAIContext';
import { useToast } from '@/hooks/use-toast';

const AICommandCenter: React.FC = () => {
  const {
    currentModel,
    availableModels,
    switchModel,
    commands,
    executeCommand,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    aiStatus,
    hasOpenAIKey,
    hasElevenLabsKey
  } = useEnhancedAI();

  const { toast } = useToast();
  const [commandInput, setCommandInput] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commands]);

  const handleSendCommand = async () => {
    if (!commandInput.trim()) return;
    
    const command = commandInput;
    setCommandInput('');
    
    try {
      await executeCommand(command);
      toast({
        title: "Command Sent",
        description: "AI is processing your request...",
      });
    } catch (error) {
      toast({
        title: "Command Failed",
        description: "Failed to process command. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getCommandStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'executing': return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'speech': return <Volume2 className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const quickCommands = [
    "Scan all repositories for vulnerabilities",
    "Generate a security report with visualizations",
    "Analyze the current codebase for improvements",
    "Check system health and maintenance status",
    "Create a backup of all configurations",
    "Update all dependencies and packages"
  ];

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Command Center
            <Badge variant="outline" className="text-xs">
              {aiStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!hasOpenAIKey && (
              <Badge variant="destructive" className="text-xs">
                API Key Required
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Model Selector */}
        {showModelSelector && (
          <div className="p-3 bg-background/50 rounded-lg border border-border/50">
            <p className="text-sm font-medium mb-2">Select AI Model:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableModels.map((model) => (
                <Button
                  key={model.id}
                  variant={currentModel?.id === model.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchModel(model.id)}
                  className="justify-start"
                >
                  {getModelIcon(model.type)}
                  <span className="ml-2">{model.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* API Key Warning */}
        {!hasOpenAIKey && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600">
              <strong>OpenAI API Key Required:</strong> Connect to Supabase and add your OpenAI API key to enable full AI capabilities.
            </p>
          </div>
        )}

        {/* Current Model Display */}
        {currentModel && (
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
            {getModelIcon(currentModel.type)}
            <span className="text-sm font-medium">{currentModel.name}</span>
            <Badge variant="outline" className="text-xs">
              {currentModel.provider}
            </Badge>
          </div>
        )}

        {/* Quick Commands */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Commands:</p>
          <div className="grid grid-cols-1 gap-1">
            {quickCommands.slice(0, 3).map((cmd, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setCommandInput(cmd)}
                className="justify-start text-xs h-8"
              >
                {cmd}
              </Button>
            ))}
          </div>
        </div>

        {/* Command History */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Commands:</p>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {commands.slice(0, 5).map((command) => (
                <div key={command.id} className="flex items-center gap-2 p-2 bg-background/30 rounded text-xs">
                  {getCommandStatusIcon(command.status)}
                  <span className="flex-1 truncate">{command.command}</span>
                  <span className="text-muted-foreground">
                    {command.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {commands.length === 0 && (
                <p className="text-muted-foreground text-xs">No commands yet</p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Command Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell the AI what to do... (e.g., 'scan repositories', 'generate report')"
              className="flex-1"
            />
            <Button
              onClick={toggleVoice}
              variant={isListening ? "default" : "outline"}
              size="sm"
              disabled={!hasOpenAIKey}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={handleSendCommand} 
              disabled={!commandInput.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Voice/Speaking Indicators */}
          <div className="flex items-center gap-2">
            {isListening && (
              <Badge variant="default" className="text-xs">
                <Mic className="w-3 h-3 mr-1" />
                Listening...
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="text-xs">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking...
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICommandCenter;
