
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings,
  Waves,
  Brain,
  MessageSquare
} from 'lucide-react';
import { useEnhancedAI } from '../../contexts/EnhancedAIContext';
import { useToast } from '@/hooks/use-toast';

const VoiceInteraction: React.FC = () => {
  const {
    voiceSettings,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    executeCommand,
    hasOpenAIKey
  } = useEnhancedAI();

  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [speechRate, setSpeechRate] = useState([1.0]);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [transcript, setTranscript] = useState('');

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = voiceSettings.language;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        if (isWakeWordActive) {
          // Restart listening if wake word is active
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 100);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceSettings.language, isWakeWordActive]);

  const handleVoiceCommand = async (command: string) => {
    console.log('Voice command received:', command);
    
    // Check for wake word
    if (command.toLowerCase().includes(voiceSettings.wakeWord.toLowerCase())) {
      const actualCommand = command.toLowerCase().replace(voiceSettings.wakeWord.toLowerCase(), '').trim();
      if (actualCommand) {
        await executeCommand(actualCommand);
        speak(`Executing: ${actualCommand}`);
      } else {
        speak("Yes, I'm listening. What would you like me to do?");
      }
    } else if (isListening && !isWakeWordActive) {
      // Direct command when actively listening
      await executeCommand(command);
    }
  };

  const toggleListening = () => {
    if (!hasOpenAIKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key to use voice features.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      stopListening();
    } else {
      recognitionRef.current?.start();
      startListening();
    }
  };

  const toggleWakeWord = () => {
    if (!hasOpenAIKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key to use voice features.",
        variant: "destructive",
      });
      return;
    }

    setIsWakeWordActive(!isWakeWordActive);
    if (!isWakeWordActive) {
      recognitionRef.current?.start();
      toast({
        title: "Wake Word Activated",
        description: `Say "${voiceSettings.wakeWord}" followed by your command.`,
      });
    } else {
      recognitionRef.current?.stop();
    }
  };

  const testVoice = () => {
    speak("Voice synthesis is working correctly. I can hear you and respond to your commands.");
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            Voice Interaction
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* API Key Warning */}
        {!hasOpenAIKey && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600">
              <strong>Voice features require OpenAI API key.</strong> Connect to Supabase to add your API key.
            </p>
          </div>
        )}

        {/* Voice Controls */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={toggleListening}
            variant={isListening ? "default" : "outline"}
            disabled={!hasOpenAIKey}
            className="h-16"
          >
            <div className="flex flex-col items-center gap-1">
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="text-xs">
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </span>
            </div>
          </Button>

          <Button
            onClick={toggleWakeWord}
            variant={isWakeWordActive ? "default" : "outline"}
            disabled={!hasOpenAIKey}
            className="h-16"
          >
            <div className="flex flex-col items-center gap-1">
              <Brain className="w-6 h-6" />
              <span className="text-xs">
                {isWakeWordActive ? 'Wake Word On' : 'Wake Word Off'}
              </span>
            </div>
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          {isListening && (
            <Badge variant="default" className="animate-pulse">
              <Waves className="w-3 h-3 mr-1" />
              Listening
            </Badge>
          )}
          {isSpeaking && (
            <Badge variant="secondary">
              <Volume2 className="w-3 h-3 mr-1" />
              Speaking
            </Badge>
          )}
          {isWakeWordActive && (
            <Badge variant="outline">
              <Brain className="w-3 h-3 mr-1" />
              Wake Word Active
            </Badge>
          )}
        </div>

        {/* Live Transcript */}
        {transcript && (
          <div className="p-3 bg-background/50 rounded-lg border border-border/50">
            <p className="text-sm font-medium mb-1">Live Transcript:</p>
            <p className="text-sm text-muted-foreground">{transcript}</p>
          </div>
        )}

        {/* Voice Settings */}
        {showSettings && (
          <div className="space-y-4 p-3 bg-background/50 rounded-lg border border-border/50">
            <h4 className="text-sm font-medium">Voice Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Output</span>
                <Switch 
                  checked={voiceSettings.enabled} 
                  disabled={!hasOpenAIKey}
                />
              </div>
              
              <div className="space-y-2">
                <span className="text-sm">Volume: {Math.round(volume[0] * 100)}%</span>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  disabled={!hasOpenAIKey}
                />
              </div>
              
              <div className="space-y-2">
                <span className="text-sm">Speech Rate: {speechRate[0]}x</span>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  disabled={!hasOpenAIKey}
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm">Wake Word</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    {voiceSettings.wakeWord}
                  </code>
                  <Badge variant="outline" className="text-xs">
                    Say this to activate
                  </Badge>
                </div>
              </div>

              <Button
                onClick={testVoice}
                variant="outline"
                size="sm"
                disabled={!hasOpenAIKey}
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Voice
              </Button>
            </div>
          </div>
        )}

        {/* Voice Commands Help */}
        <div className="p-3 bg-primary/5 rounded-lg">
          <h5 className="text-sm font-medium mb-2">Voice Commands:</h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• "Hey AI, scan my repositories"</p>
            <p>• "Generate a security report"</p>
            <p>• "Show me system health"</p>
            <p>• "Analyze the code in main.tsx"</p>
            <p>• "Create a backup"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInteraction;
