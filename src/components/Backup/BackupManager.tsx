
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Archive, 
  Download, 
  Trash2, 
  Clock, 
  HardDrive, 
  Shield,
  AlertTriangle,
  CheckCircle,
  History
} from 'lucide-react';
import { useBackup } from '../../contexts/BackupContext';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

const BackupManager: React.FC = () => {
  const { 
    changeLogs, 
    backups, 
    createBackup, 
    downloadBackup, 
    downloadChangeLogs,
    clearOldData,
    getStorageStats 
  } = useBackup();
  const { selectedRepos, repositories } = useGitHub();
  const { toast } = useToast();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const storageStats = getStorageStats();
  const storagePercentage = (storageStats.used / (50 * 1024 * 1024)) * 100;

  const selectedRepositories = repositories.filter(repo => 
    selectedRepos.includes(repo.id.toString())
  );

  const handleCreateBackup = async () => {
    if (selectedRepositories.length === 0) {
      toast({
        title: "No Repositories Selected",
        description: "Please select repositories to backup.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingBackup(true);
    try {
      const backupId = await createBackup(selectedRepositories.map(r => r.full_name));
      toast({
        title: "Backup Created",
        description: `Successfully backed up ${selectedRepositories.length} repositories.`,
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async (backupId: string) => {
    try {
      await downloadBackup(backupId);
      toast({
        title: "Download Started",
        description: "Backup file download has started.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download backup.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadLogs = async (days: number) => {
    try {
      await downloadChangeLogs(days);
      toast({
        title: "Export Complete",
        description: `Change logs for the last ${days} days have been exported.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export change logs.",
        variant: "destructive",
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'scan': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'auto-fix': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'backup': return <Archive className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="w-5 h-5" />
          Backup & Change Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Storage Usage</span>
            <span className="text-sm text-muted-foreground">
              {formatBytes(storageStats.used)} / 50 MB
            </span>
          </div>
          <Progress value={storagePercentage} className="w-full" />
          {storagePercentage > 80 && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Storage is getting full. Consider cleaning up old data.
            </div>
          )}
        </div>

        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backups</TabsTrigger>
            <TabsTrigger value="changes">Change Log</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-blue-600">
                  We recommend backing up your repositories before using auto-fix features.
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateBackup} 
                  disabled={isCreatingBackup}
                  className="flex-1"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {isCreatingBackup ? 'Creating...' : 'Create Backup'}
                </Button>
                <Button 
                  onClick={() => handleDownloadLogs(7)}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Recent Backups</p>
                {backups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No backups created yet.</p>
                ) : (
                  backups.slice(0, 5).map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {backup.repositories.length} repositories
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(backup.timestamp).toLocaleString()} • {formatBytes(backup.size)}
                        </p>
                      </div>
                      <Button 
                        onClick={() => handleDownloadBackup(backup.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="changes" className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDownloadLogs(7)}
                size="sm"
                variant="outline"
              >
                Last 7 Days
              </Button>
              <Button 
                onClick={() => handleDownloadLogs(30)}
                size="sm"
                variant="outline"
              >
                Last 30 Days
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {changeLogs.slice(0, 20).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getActionIcon(log.action)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {log.repository && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Repository: {log.repository}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Storage Used</span>
                </div>
                <p className="text-lg font-bold">{formatBytes(storageStats.used)}</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Total Records</span>
                </div>
                <p className="text-lg font-bold">
                  {storageStats.logs + storageStats.backups}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Storage Breakdown</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Change Logs ({storageStats.logs})</span>
                  <span>{Math.round((storageStats.logs / (storageStats.logs + storageStats.backups)) * 100) || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Backups ({storageStats.backups})</span>
                  <span>{Math.round((storageStats.backups / (storageStats.logs + storageStats.backups)) * 100) || 0}%</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={clearOldData}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clean Up Old Data
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Data older than 7 days is automatically archived and compressed</p>
              <p>• Archived data is permanently deleted after 14 days</p>
              <p>• Critical security logs are retained longer</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BackupManager;
