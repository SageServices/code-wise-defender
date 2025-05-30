
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, Brain, ChevronUp, ChevronDown } from 'lucide-react';

interface WidgetProps {
  apiEndpoint?: string;
  theme?: 'light' | 'dark' | 'auto';
  compact?: boolean;
}

const EmbeddableWidget: React.FC<WidgetProps> = ({ 
  apiEndpoint = 'http://localhost:8000', 
  theme = 'auto',
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('Ready');

  const runSecurityScan = async () => {
    setIsLoading(true);
    setStatus('Running security scan...');
    
    try {
      const response = await fetch(`${apiEndpoint}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: window.location.origin })
      });
      
      const result = await response.json();
      setStatus(result.status === 'success' ? 'Scan completed' : 'Scan failed');
    } catch (error) {
      setStatus('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const runMaintenance = async () => {
    setIsLoading(true);
    setStatus('Running maintenance...');
    
    try {
      const response = await fetch(`${apiEndpoint}/api/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      setStatus(result.status === 'success' ? 'Maintenance completed' : 'Maintenance failed');
    } catch (error) {
      setStatus('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = async () => {
    setIsLoading(true);
    setStatus('Generating AI insights...');
    
    try {
      const response = await fetch(`${apiEndpoint}/api/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      setStatus(result.status === 'success' ? 'Insights generated' : 'Generation failed');
    } catch (error) {
      setStatus('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 ${theme === 'dark' ? 'dark' : ''} panel shadow-2xl`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Security & Maintenance</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          Status: {status}
        </div>

        {isExpanded && (
          <div className="space-y-2">
            <Button
              onClick={runSecurityScan}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>

            <Button
              onClick={runMaintenance}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Run Maintenance
            </Button>

            <Button
              onClick={generateInsights}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>

            <div className="pt-2 border-t border-border">
              <Button
                variant="link"
                size="sm"
                className="w-full text-xs"
                onClick={() => window.open('/dashboard', '_blank')}
              >
                Open Full Dashboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmbeddableWidget;
