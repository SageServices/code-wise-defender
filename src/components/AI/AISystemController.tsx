
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Shield, 
  Wrench, 
  Github, 
  Database,
  Eye,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity
} from 'lucide-react';
import { useEnhancedAI } from '../../contexts/EnhancedAIContext';
import { useSecurity } from '../../contexts/SecurityContext';
import { useGitHub } from '../../contexts/GitHubContext';

interface SystemAction {
  id: string;
  type: 'security' | 'maintenance' | 'github' | 'analysis' | 'backup';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  timestamp: Date;
  result?: string;
}

const AISystemController: React.FC = () => {
  const { aiStatus, systemAccess, hasOpenAIKey } = useEnhancedAI();
  const { status: securityStatus, runVulnerabilityScan } = useSecurity();
  const { selectedRepos, isAuthenticated } = useGitHub();
  
  const [systemActions, setSystemActions] = useState<SystemAction[]>([]);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [systemHealth, setSystemHealth] = useState(98);

  // Simulate system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Update system health based on various factors
      const baseHealth = 95;
      const securityIssues = Object.values(securityStatus.vulnerabilities).reduce((a, b) => a + b, 0);
      const githubConnected = isAuthenticated ? 5 : -5;
      const calculatedHealth = Math.max(85, baseHealth - (securityIssues * 0.5) + githubConnected);
      setSystemHealth(Math.round(calculatedHealth));
    }, 5000);

    return () => clearInterval(interval);
  }, [securityStatus, isAuthenticated]);

  const executeSystemAction = async (actionType: string, description: string) => {
    const action: SystemAction = {
      id: Date.now().toString(),
      type: actionType as any,
      description,
      status: 'running',
      progress: 0,
      timestamp: new Date()
    };

    setSystemActions(prev => [action, ...prev]);

    // Simulate action execution with progress
    const progressInterval = setInterval(() => {
      setSystemActions(prev => prev.map(a => 
        a.id === action.id 
          ? { ...a, progress: Math.min(100, a.progress + Math.random() * 20) }
          : a
      ));
    }, 500);

    try {
      // Execute actual system actions based on type
      switch (actionType) {
        case 'security':
          await runVulnerabilityScan('all-systems');
          break;
        case 'github':
          // Simulate GitHub operations
          await new Promise(resolve => setTimeout(resolve, 3000));
          break;
        case 'maintenance':
          // Simulate maintenance tasks
          await new Promise(resolve => setTimeout(resolve, 2500));
          break;
        default:
          await new Promise(resolve => setTimeout(resolve, 2000));
      }

      clearInterval(progressInterval);
      
      setSystemActions(prev => prev.map(a => 
        a.id === action.id 
          ? { 
              ...a, 
              status: 'completed', 
              progress: 100,
              result: `${description} completed successfully`
            }
          : a
      ));

    } catch (error) {
      clearInterval(progressInterval);
      
      setSystemActions(prev => prev.map(a => 
        a.id === action.id 
          ? { 
              ...a, 
              status: 'failed', 
              result: `Failed to ${description.toLowerCase()}`
            }
          : a
      ));
    }
  };

  const runFullSystemScan = async () => {
    if (!hasOpenAIKey) {
      return;
    }

    await executeSystemAction('security', 'Run comprehensive security scan');
    await executeSystemAction('maintenance', 'Check system maintenance status');
    await executeSystemAction('github', 'Analyze GitHub repositories');
    await executeSystemAction('analysis', 'Perform AI code analysis');
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'github': return <Github className="w-4 h-4 text-gray-500" />;
      case 'analysis': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'backup': return <Database className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'running': return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-500';
    if (health >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI System Controller
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {aiStatus}
            </Badge>
            {!hasOpenAIKey && (
              <Badge variant="destructive" className="text-xs">
                Limited Mode
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* System Health Overview */}
        <div className="p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">System Health</span>
            <span className={`text-lg font-bold ${getHealthColor(systemHealth)}`}>
              {systemHealth}%
            </span>
          </div>
          <Progress value={systemHealth} className="h-2" />
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="text-center">
              <div className="font-medium">{Object.values(securityStatus.vulnerabilities).reduce((a, b) => a + b, 0)}</div>
              <div className="text-muted-foreground">Vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{selectedRepos.length}</div>
              <div className="text-muted-foreground">Repositories</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{systemActions.filter(a => a.status === 'completed').length}</div>
              <div className="text-muted-foreground">Tasks Done</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI System Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => executeSystemAction('security', 'Security scan')}
              variant="outline"
              size="sm"
              disabled={!hasOpenAIKey}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>
            
            <Button
              onClick={() => executeSystemAction('maintenance', 'System maintenance')}
              variant="outline"
              size="sm"
              disabled={!hasOpenAIKey}
            >
              <Wrench className="w-4 h-4 mr-2" />
              Maintenance
            </Button>
            
            <Button
              onClick={() => executeSystemAction('github', 'GitHub analysis')}
              variant="outline"
              size="sm"
              disabled={!hasOpenAIKey || !isAuthenticated}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub Scan
            </Button>
            
            <Button
              onClick={() => executeSystemAction('backup', 'Create backup')}
              variant="outline"
              size="sm"
              disabled={!hasOpenAIKey}
            >
              <Database className="w-4 h-4 mr-2" />
              Backup
            </Button>
          </div>
          
          <Button
            onClick={runFullSystemScan}
            variant="default"
            className="w-full"
            disabled={!hasOpenAIKey}
          >
            <Eye className="w-4 h-4 mr-2" />
            Run Full AI Analysis
          </Button>
        </div>

        {/* System Access Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center gap-1 ${systemAccess ? 'text-green-500' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${systemAccess ? 'bg-green-500' : 'bg-red-500'}`} />
            System Access
          </div>
          <div className={`flex items-center gap-1 ${isAuthenticated ? 'text-green-500' : 'text-yellow-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'}`} />
            GitHub Connected
          </div>
        </div>

        {/* Action History */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Actions</h4>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {systemActions.slice(0, 5).map((action) => (
                <div key={action.id} className="p-2 bg-background/30 rounded border border-border/30">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action.type)}
                      <span className="text-xs font-medium">{action.description}</span>
                    </div>
                    {getStatusIcon(action.status)}
                  </div>
                  
                  {action.status === 'running' && (
                    <Progress value={action.progress} className="h-1 mb-1" />
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{action.timestamp.toLocaleTimeString()}</span>
                    {action.result && (
                      <span className="truncate ml-2">{action.result}</span>
                    )}
                  </div>
                </div>
              ))}
              {systemActions.length === 0 && (
                <p className="text-muted-foreground text-xs">No actions performed yet</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISystemController;
