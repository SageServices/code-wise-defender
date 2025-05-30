
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, Brain, Zap, Download, Settings } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { useAI } from '../../contexts/AIContext';
import { useToast } from '@/hooks/use-toast';

const QuickActions: React.FC = () => {
  const { runVulnerabilityScan, updateDependencies } = useSecurity();
  const { generateInsights } = useAI();
  const { toast } = useToast();

  const handleQuickScan = async () => {
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
    const data = {
      timestamp: new Date().toISOString(),
      security: {
        lastScan: new Date().toLocaleDateString(),
        vulnerabilities: "0 critical, 2 high, 5 medium, 12 low"
      },
      maintenance: {
        systemHealth: "92%",
        pendingUpdates: 8,
        lastMaintenance: "2 hours ago"
      },
      ai: {
        insights: "2 new insights available",
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
      description: "Dashboard data has been downloaded.",
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
          </Button>
          
          <Button onClick={handleQuickMaintenance} className="w-full justify-start" variant="outline">
            <Wrench className="w-4 h-4 mr-2" />
            Update Dependencies
          </Button>
          
          <Button onClick={handleGenerateInsights} className="w-full justify-start" variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Insights
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
