
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, Brain, Zap, Download, Settings } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { useAI } from '../../contexts/AIContext';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  onAuthRequired?: (actionName: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAuthRequired }) => {
  const { runVulnerabilityScan, updateDependencies } = useSecurity();
  const { generateInsights } = useAI();
  const { isAuthenticated } = useGitHub();
  const { toast } = useToast();

  const handleQuickScan = async () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired('run security scans');
      return;
    }

    try {
      await runVulnerabilityScan(window.location.origin);
      toast({
        title: "Quick Scan Complete",
        description: "Security scan finished. Check the Security tab for results.",
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to complete security scan.",
        variant: "destructive",
      });
    }
  };

  const handleQuickMaintenance = async () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired('perform maintenance tasks');
      return;
    }

    try {
      await updateDependencies();
      toast({
        title: "Maintenance Complete",
        description: "Dependencies updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Maintenance Failed",
        description: "Unable to complete maintenance tasks.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateInsights = async () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired('generate AI insights');
      return;
    }

    try {
      await generateInsights();
      toast({
        title: "Insights Generated",
        description: "New AI insights are available.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate AI insights.",
        variant: "destructive",
      });
    }
  };

  const downloadDashboardData = () => {
    // This action works in demo mode
    const data = {
      timestamp: new Date().toISOString(),
      mode: isAuthenticated ? 'authenticated' : 'demo',
      security: {
        lastScan: new Date().toLocaleDateString(),
        vulnerabilities: isAuthenticated ? "Real data" : "0 critical, 2 high, 5 medium, 12 low (demo)"
      },
      maintenance: {
        systemHealth: isAuthenticated ? "Real data" : "92% (demo)",
        pendingUpdates: isAuthenticated ? "Real data" : "8 (demo)",
        lastMaintenance: "2 hours ago"
      },
      ai: {
        insights: isAuthenticated ? "Real data" : "2 new insights available (demo)",
        confidence: "High accuracy analysis"
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: `Dashboard data has been downloaded${!isAuthenticated ? ' (demo data)' : ''}.`,
    });
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <Button onClick={handleQuickScan} className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Run Security Scan
            {!isAuthenticated && <span className="ml-auto text-xs opacity-70">Demo</span>}
          </Button>
          
          <Button onClick={handleQuickMaintenance} className="w-full justify-start" variant="outline">
            <Wrench className="w-4 h-4 mr-2" />
            Update Dependencies
            {!isAuthenticated && <span className="ml-auto text-xs opacity-70">Demo</span>}
          </Button>
          
          <Button onClick={handleGenerateInsights} className="w-full justify-start" variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Insights
            {!isAuthenticated && <span className="ml-auto text-xs opacity-70">Demo</span>}
          </Button>
          
          <Button onClick={downloadDashboardData} className="w-full justify-start" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Dashboard Data
          </Button>
        </div>

        <div className="pt-2 border-t border-border">
          <Button className="w-full justify-start" variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
