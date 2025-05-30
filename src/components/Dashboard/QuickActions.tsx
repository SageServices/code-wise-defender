
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, RefreshCw, Shield, Zap } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { useAI } from '../../contexts/AIContext';

const QuickActions: React.FC = () => {
  const { runVulnerabilityScan, updateDependencies, status } = useSecurity();
  const { generateInsights, isAnalyzing } = useAI();

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => runVulnerabilityScan('localhost')}
          disabled={status.isScanning}
          className="w-full justify-start"
          variant="outline"
        >
          <Scan className="w-4 h-4 mr-2" />
          {status.isScanning ? 'Scanning...' : 'Run Security Scan'}
        </Button>

        <Button 
          onClick={updateDependencies}
          className="w-full justify-start"
          variant="outline"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Dependencies
        </Button>

        <Button 
          onClick={generateInsights}
          disabled={isAnalyzing}
          className="w-full justify-start"
          variant="outline"
        >
          <Shield className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
