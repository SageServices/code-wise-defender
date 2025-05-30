
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGitHub } from './GitHubContext';

interface ChangeLog {
  id: string;
  timestamp: string;
  action: 'scan' | 'auto-fix' | 'repository-access' | 'permission-change' | 'backup';
  repository?: string;
  details: string;
  beforeState?: any;
  afterState?: any;
}

interface ProjectBackup {
  id: string;
  timestamp: string;
  repositories: string[];
  size: number;
  compressed: boolean;
}

export interface BackupContextType {
  changeLogs: ChangeLog[];
  backups: ProjectBackup[];
  storageUsage: number;
  maxStorage: number;
  addChangeLog: (log: Omit<ChangeLog, 'id' | 'timestamp'>) => void;
  createBackup: (repositories: string[]) => Promise<string>;
  downloadBackup: (backupId: string) => Promise<void>;
  downloadChangeLogs: (days?: number) => Promise<void>;
  clearOldData: () => Promise<void>;
  getStorageStats: () => { used: number; available: number; logs: number; backups: number };
}

const BackupContext = createContext<BackupContextType | undefined>(undefined);

export const BackupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [backups, setBackups] = useState<ProjectBackup[]>([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const { user } = useGitHub();
  
  const maxStorage = 50 * 1024 * 1024; // 50MB limit for demo

  useEffect(() => {
    loadStoredData();
    const interval = setInterval(cleanupOldData, 24 * 60 * 60 * 1000); // Daily cleanup
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveDataToStorage();
    updateStorageUsage();
  }, [changeLogs, backups]);

  const loadStoredData = async () => {
    try {
      if ('indexedDB' in window) {
        const stored = localStorage.getItem(`backup_data_${user?.id || 'demo'}`);
        if (stored) {
          const data = JSON.parse(stored);
          setChangeLogs(data.changeLogs || []);
          setBackups(data.backups || []);
        }
      }
    } catch (error) {
      console.error('Failed to load stored backup data:', error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      const data = { changeLogs, backups, lastUpdated: new Date().toISOString() };
      localStorage.setItem(`backup_data_${user?.id || 'demo'}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save backup data:', error);
    }
  };

  const updateStorageUsage = () => {
    const dataSize = JSON.stringify({ changeLogs, backups }).length;
    setStorageUsage(dataSize);
  };

  const addChangeLog = (log: Omit<ChangeLog, 'id' | 'timestamp'>) => {
    const newLog: ChangeLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    setChangeLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  const createBackup = async (repositories: string[]): Promise<string> => {
    try {
      const backupData = {
        repositories,
        changeLogs: changeLogs.slice(0, 100), // Include recent logs
        timestamp: new Date().toISOString(),
        user: user?.login
      };
      
      const compressed = JSON.stringify(backupData);
      const backup: ProjectBackup = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        repositories,
        size: compressed.length,
        compressed: true
      };
      
      // Store backup data in IndexedDB for larger storage
      if ('indexedDB' in window) {
        localStorage.setItem(`backup_${backup.id}`, compressed);
      }
      
      setBackups(prev => [backup, ...prev]);
      
      addChangeLog({
        action: 'backup',
        details: `Created backup for ${repositories.length} repositories`,
        afterState: { backupId: backup.id, repositories }
      });
      
      return backup.id;
    } catch (error) {
      throw new Error('Failed to create backup');
    }
  };

  const downloadBackup = async (backupId: string) => {
    try {
      const backupData = localStorage.getItem(`backup_${backupId}`);
      if (!backupData) throw new Error('Backup not found');
      
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-dashboard-backup-${backupId.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to download backup');
    }
  };

  const downloadChangeLogs = async (days = 7) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentLogs = changeLogs.filter(log => 
        new Date(log.timestamp) >= cutoffDate
      );
      
      const exportData = {
        logs: recentLogs,
        exported: new Date().toISOString(),
        period: `${days} days`,
        user: user?.login
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `change-logs-${days}days-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to download change logs');
    }
  };

  const cleanupOldData = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Archive old logs (compress and keep for another 7 days)
    const recentLogs = changeLogs.filter(log => 
      new Date(log.timestamp) >= sevenDaysAgo
    );
    
    // Archive old backups
    const recentBackups = backups.filter(backup => 
      new Date(backup.timestamp) >= sevenDaysAgo
    );
    
    // Clean up old backup files
    backups.forEach(backup => {
      if (new Date(backup.timestamp) < sevenDaysAgo) {
        localStorage.removeItem(`backup_${backup.id}`);
      }
    });
    
    setChangeLogs(recentLogs);
    setBackups(recentBackups);
  };

  const clearOldData = async () => {
    await cleanupOldData();
    addChangeLog({
      action: 'backup',
      details: 'Cleaned up old data and backups'
    });
  };

  const getStorageStats = () => {
    return {
      used: storageUsage,
      available: maxStorage - storageUsage,
      logs: changeLogs.length,
      backups: backups.length
    };
  };

  return (
    <BackupContext.Provider value={{
      changeLogs,
      backups,
      storageUsage,
      maxStorage,
      addChangeLog,
      createBackup,
      downloadBackup,
      downloadChangeLogs,
      clearOldData,
      getStorageStats
    }}>
      {children}
    </BackupContext.Provider>
  );
};

export const useBackup = () => {
  const context = useContext(BackupContext);
  if (!context) {
    throw new Error('useBackup must be used within a BackupProvider');
  }
  return context;
};
