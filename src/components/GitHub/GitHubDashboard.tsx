import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Shield, GitBranch, Settings } from 'lucide-react';
import GitHubAuthFlow from '../Auth/GitHubAuthFlow';
import RepositorySelector from './RepositorySelector';
import RepositoryScanner from './RepositoryScanner';
import IgnoreListManager from './IgnoreListManager';
import { useGitHub } from '../../contexts/GitHubContext';
import BackupManager from '../Backup/BackupManager';

const GitHubDashboard: React.FC = () => {
  const { isAuthenticated } = useGitHub();

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Github className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">GitHub Integration</h1>
            <p className="text-muted-foreground">
              Connect your GitHub account to enable advanced security scanning and auto-healing features
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <GitHubAuthFlow />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">GitHub Integration</h1>
          <p className="text-muted-foreground">
            Manage repository access and automated security features
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GitHubAuthFlow />
            <Card className="panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Connected Repositories:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Scan:</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Auto-Fixes Created:</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="repositories">
          <RepositorySelector />
        </TabsContent>

        <TabsContent value="scanner">
          <RepositoryScanner />
        </TabsContent>

        <TabsContent value="backup">
          <BackupManager />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GitHubAuthFlow />
            <IgnoreListManager />
            <Card className="panel lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Integration Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scan Frequency</label>
                    <select className="w-full p-2 border rounded">
                      <option>Every 6 hours</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Manual only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notification Preferences</label>
                    <select className="w-full p-2 border rounded">
                      <option>All vulnerabilities</option>
                      <option>Critical only</option>
                      <option>High & Critical</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-Fix Settings</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Create pull requests for security fixes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Update vulnerable dependencies</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Auto-merge low-risk fixes</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GitHubDashboard;
