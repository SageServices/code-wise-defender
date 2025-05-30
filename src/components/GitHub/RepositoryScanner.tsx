
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, AlertTriangle, CheckCircle, Clock, GitBranch, Shield } from 'lucide-react';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  repoName: string;
  vulnerabilities: number;
  dependencies: number;
  codeQuality: number;
  lastScan: string;
  status: 'scanning' | 'complete' | 'error';
}

const RepositoryScanner: React.FC = () => {
  const { repositories, selectedRepos, scanRepository, createAutoFix, accessLevel } = useGitHub();
  const { toast } = useToast();
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const selectedRepositories = repositories.filter(repo => 
    selectedRepos.includes(repo.id.toString())
  );

  const runScan = async () => {
    if (selectedRepositories.length === 0) {
      toast({
        title: "No Repositories Selected",
        description: "Please select repositories to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    const newResults: ScanResult[] = [];

    for (const repo of selectedRepositories) {
      try {
        setScanResults(prev => [...prev.filter(r => r.repoName !== repo.full_name), {
          repoName: repo.full_name,
          vulnerabilities: 0,
          dependencies: 0,
          codeQuality: 0,
          lastScan: '',
          status: 'scanning'
        }]);

        const result = await scanRepository(repo.full_name);
        
        newResults.push({
          repoName: repo.full_name,
          vulnerabilities: result.vulnerabilities,
          dependencies: result.dependencies,
          codeQuality: result.codeQuality,
          lastScan: result.lastScan,
          status: 'complete'
        });
        
        setScanResults(prev => [...prev.filter(r => r.repoName !== repo.full_name), ...newResults]);
      } catch (error) {
        newResults.push({
          repoName: repo.full_name,
          vulnerabilities: 0,
          dependencies: 0,
          codeQuality: 0,
          lastScan: '',
          status: 'error'
        });
      }
    }

    setIsScanning(false);
    toast({
      title: "Scan Complete",
      description: `Scanned ${selectedRepositories.length} repositories.`,
    });
  };

  const handleAutoFix = async (repoName: string) => {
    if (accessLevel !== 'write') {
      toast({
        title: "Write Access Required",
        description: "Enable write access to use auto-fix features.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fix = {
        title: "Security Vulnerability Fix",
        description: "Automated fix for detected security vulnerabilities"
      };
      
      await createAutoFix(repoName, fix);
      toast({
        title: "Auto-Fix Created",
        description: `Pull request created for ${repoName}.`,
      });
    } catch (error) {
      toast({
        title: "Auto-Fix Failed",
        description: "Failed to create automated fix.",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (vulnerabilities: number) => {
    if (vulnerabilities === 0) return 'text-green-500';
    if (vulnerabilities < 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Repository Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedRepositories.length} repositories selected
          </p>
          <Button onClick={runScan} disabled={isScanning} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </Button>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <Progress value={Math.random() * 100} className="w-full" />
            <p className="text-xs text-muted-foreground text-center">
              Scanning repositories for vulnerabilities...
            </p>
          </div>
        )}

        {scanResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Scan Results</h4>
            {scanResults.map((result) => (
              <div key={result.repoName} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{result.repoName}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.status === 'complete' && `Last scan: ${new Date(result.lastScan).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.status === 'scanning' && <Clock className="w-4 h-4 text-blue-500" />}
                    {result.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {result.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>

                {result.status === 'complete' && (
                  <Tabs defaultValue="security" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                      <TabsTrigger value="quality">Quality</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="security" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vulnerabilities Found:</span>
                        <Badge variant={result.vulnerabilities === 0 ? "default" : "destructive"}>
                          {result.vulnerabilities}
                        </Badge>
                      </div>
                      {result.vulnerabilities > 0 && accessLevel === 'write' && (
                        <Button 
                          onClick={() => handleAutoFix(result.repoName)}
                          size="sm" 
                          className="w-full"
                        >
                          <GitBranch className="w-4 h-4 mr-2" />
                          Create Auto-Fix PR
                        </Button>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="dependencies" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Outdated Dependencies:</span>
                        <Badge variant="outline">{result.dependencies}</Badge>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="quality" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Code Quality Score:</span>
                        <Badge variant="outline">{result.codeQuality}%</Badge>
                      </div>
                      <Progress value={result.codeQuality} className="w-full" />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepositoryScanner;
