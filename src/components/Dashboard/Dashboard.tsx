
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Wrench, Brain, Book, Palette, AlertTriangle, CheckCircle, Clock, TrendingUp, Github } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { useAI } from '../../contexts/AIContext';
import { useGitHub } from '../../contexts/GitHubContext';
import SecurityStatusCard from '../Security/SecurityStatusCard';
import MaintenanceStatusCard from '../Maintenance/MaintenanceStatusCard';
import AIInsightsCard from '../AI/AIInsightsCard';
import AdPlacementBanner from '../Ads/AdPlacementBanner';
import QuickActions from './QuickActions';
import InstallPWA from '../PWA/InstallPWA';

const Dashboard: React.FC = () => {
  const { status: securityStatus } = useSecurity();
  const { insights, isAnalyzing } = useAI();
  const { isAuthenticated: isGitHubConnected, selectedRepos } = useGitHub();
  const [activeTab, setActiveTab] = useState('overview');

  const totalVulnerabilities = Object.values(securityStatus.vulnerabilities).reduce((a, b) => a + b, 0);
  const criticalIssues = securityStatus.vulnerabilities.critical + securityStatus.vulnerabilities.high;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Security & Maintenance Dashboard</h1>
          <p className="text-muted-foreground">Monitor, protect, and optimize your applications with AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          <Link to="/github">
            <Button variant="outline" size="sm">
              <Github className="w-4 h-4 mr-2" />
              GitHub Integration
            </Button>
          </Link>
          <Link to="/themes">
            <Button variant="outline" size="sm">
              <Palette className="w-4 h-4 mr-2" />
              Customize Theme
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="panel hover:scale-105 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Status</p>
                <p className="text-2xl font-bold text-foreground">
                  {criticalIssues === 0 ? 'Secure' : `${criticalIssues} Issues`}
                </p>
              </div>
              <div className={`p-2 rounded-full ${criticalIssues === 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {criticalIssues === 0 ? 
                  <CheckCircle className="w-6 h-6 text-green-500" /> : 
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="panel hover:scale-105 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GitHub Repos</p>
                <p className="text-2xl font-bold text-foreground">
                  {isGitHubConnected ? selectedRepos.length : 0}
                </p>
              </div>
              <div className={`p-2 rounded-full ${isGitHubConnected ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                <Github className={`w-6 h-6 ${isGitHubConnected ? 'text-green-500' : 'text-gray-500'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="panel hover:scale-105 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold text-foreground">{insights.length}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Brain className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="panel hover:scale-105 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-foreground">98%</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PWA Install Banner */}
      <InstallPWA />

      {/* Ad Placement Banner */}
      <AdPlacementBanner />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityStatusCard />
            <MaintenanceStatusCard />
            <AIInsightsCard />
            <QuickActions />
          </div>
        </TabsContent>

        <TabsContent value="security">
          <SecurityStatusCard expanded />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceStatusCard expanded />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsCard expanded />
        </TabsContent>
      </Tabs>

      {/* Navigation Links */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <Link to="/security" className="block">
          <Card className="panel hover:scale-105 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Security Center</h3>
              <p className="text-sm text-muted-foreground">Full security dashboard</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/maintenance" className="block">
          <Card className="panel hover:scale-105 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Maintenance</h3>
              <p className="text-sm text-muted-foreground">System maintenance tools</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/ai-insights" className="block">
          <Card className="panel hover:scale-105 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
              <p className="text-sm text-muted-foreground">AI-powered analysis</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/github" className="block">
          <Card className="panel hover:scale-105 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Github className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">GitHub</h3>
              <p className="text-sm text-muted-foreground">Repository integration</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/knowledge" className="block">
          <Card className="panel hover:scale-105 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Knowledge Base</h3>
              <p className="text-sm text-muted-foreground">Documentation & AI chat</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
