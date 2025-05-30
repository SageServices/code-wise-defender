
import { useEffect } from 'react';
import { useBackup } from '../../contexts/BackupContext';

const BackupContextBridge: React.FC = () => {
  const backupContext = useBackup();

  useEffect(() => {
    // Make backup context available globally for GitHub context integration
    (window as any).backupContext = backupContext;
    
    return () => {
      delete (window as any).backupContext;
    };
  }, [backupContext]);

  return null;
};

export default BackupContextBridge;
