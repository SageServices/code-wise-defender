
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Play, Settings, Download, Key, ArrowLeft, Home } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { useToast } from '@/hooks/use-toast';

const SecurityOverview: React.FC = () => {
  const { status, runVulnerabilityScan, toggleIPMonitoring, blockIP, unblockIP } = useSecurity();
  const { toast } = useToast();
  const [scanTarget, setScanTarget] = useState(window.location.origin);
  const [apiKeys, setApiKeys] = useState({
    zapApiKey: localStorage.getItem('zap_api_key') || '',
    snykToken: localStorage.getItem('snyk_token') || '',
    virustotalApiKey: localStorage.getItem('virustotal_api_key') || ''
  });

  const handleApiKeyUpdate = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value);
    toast({
      title: "API Key Updated",
      description: `${key} has been saved locally.`,
    });
  };

  const runScan = async () => {
    if (!scanTarget) {
      toast({
        title: "Error",
        description: "Please enter a target URL to scan.",
        variant: "destructive",
      });
      return;
    }

    try {
      await runVulnerabilityScan(scanTarget);
      toast({
        title: "Scan Completed",
        description: "Security scan has finished. Check the results below.",
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to complete security scan. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const downloadGuide = () => {
    const guideContent = `
Security & Maintenance Setup Guide

1. OWASP ZAP Integration:
   - Download OWASP ZAP from https://www.zaproxy.org/download/
   - Start ZAP in daemon mode: zap.sh -daemon -port 8080
   - Get API key from ZAP > Tools > Options > API
   - Enter API key in the Security settings

2. Snyk Integration:
   - Sign up at https://snyk.io/
   - Get your API token from Account Settings
   - Enter token in the Security settings

3. VirusTotal Integration:
   - Sign up at https://www.virustotal.com/
   - Get your API key from your profile
   - Enter API key in the Security settings

4. IP Monitoring Setup:
   - Configure your firewall to log IP addresses
   - Set up log parsing for suspicious activity detection
   - Enable real-time monitoring in the dashboard

5. Automated Maintenance:
   - Configure dependency update schedules
   - Set up automated security patches
   - Enable AI-powered code analysis

For detailed setup instructions, visit our documentation.
    `;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-maintenance-guide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Guide Downloaded",
      description: "Setup guide has been downloaded to your device.",
    });
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
          <span>Security Center</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Security Center</h1>
          <p className="text-muted-foreground">Comprehensive security monitoring and vulnerability management</p>
        </div>
        <Button onClick={downloadGuide} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Setup Guide
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="scanner">Vulnerability Scanner</TabsTrigger>
          <TabsTrigger value="monitoring">IP Monitoring</TabsTrigger>
          <TabsTrigger value="settings">API Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">
                  {status.vulnerabilities.critical}
                </div>
                <p className="text-sm text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card className="panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  High Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">
                  {status.vulnerabilities.high}
                </div>
                <p className="text-sm text-muted-foreground">Should be addressed soon</p>
              </CardContent>
            </Card>

            <Card className="panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Medium & Low
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {status.vulnerabilities.medium + status.vulnerabilities.low}
                </div>
                <p className="text-sm text-muted-foreground">Monitor and plan fixes</p>
              </CardContent>
            </Card>
          </div>

          <Card className="panel">
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">Last vulnerability scan</p>
                    <p className="text-sm text-muted-foreground">
                      {status.lastScan ? status.lastScan.toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <Badge variant={status.lastScan ? "outline" : "destructive"}>
                    {status.lastScan ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">IP Monitoring</p>
                    <p className="text-sm text-muted-foreground">
                      {status.ipMonitoring.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <Badge variant={status.ipMonitoring.active ? "default" : "destructive"}>
                    {status.ipMonitoring.active ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card className="panel">
            <CardHeader>
              <CardTitle>Vulnerability Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scanTarget">Target URL</Label>
                <Input
                  id="scanTarget"
                  value={scanTarget}
                  onChange={(e) => setScanTarget(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <Button 
                onClick={runScan} 
                disabled={status.isScanning}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {status.isScanning ? 'Scanning...' : 'Start Security Scan'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="panel">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                IP Monitoring
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleIPMonitoring}
                >
                  {status.ipMonitoring.active ? 'Disable' : 'Enable'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Suspicious IPs</h4>
                <div className="space-y-2">
                  {status.ipMonitoring.suspiciousIPs.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                      <span className="font-mono">{ip}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => blockIP(ip)}
                      >
                        Block
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Blocked IPs</h4>
                <div className="space-y-2">
                  {status.ipMonitoring.blockedIPs.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2 bg-red-500/10 rounded">
                      <span className="font-mono">{ip}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unblockIP(ip)}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="zapKey">OWASP ZAP API Key</Label>
                <Input
                  id="zapKey"
                  type="password"
                  value={apiKeys.zapApiKey}
                  onChange={(e) => handleApiKeyUpdate('zap_api_key', e.target.value)}
                  placeholder="Enter ZAP API key"
                />
              </div>
              <div>
                <Label htmlFor="snykToken">Snyk API Token</Label>
                <Input
                  id="snykToken"
                  type="password"
                  value={apiKeys.snykToken}
                  onChange={(e) => handleApiKeyUpdate('snyk_token', e.target.value)}
                  placeholder="Enter Snyk token"
                />
              </div>
              <div>
                <Label htmlFor="vtKey">VirusTotal API Key</Label>
                <Input
                  id="vtKey"
                  type="password"
                  value={apiKeys.virustotalApiKey}
                  onChange={(e) => handleApiKeyUpdate('virustotal_api_key', e.target.value)}
                  placeholder="Enter VirusTotal API key"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityOverview;
