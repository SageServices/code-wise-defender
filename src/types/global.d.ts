
import { BackupContextType } from '../contexts/BackupContext';

declare global {
  interface Window {
    backupContext?: BackupContextType;
  }

  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }

  interface ServiceWorkerGlobalScope {
    addEventListener(type: 'sync', listener: (event: SyncEvent) => void): void;
  }

  interface SyncEvent extends Event {
    tag: string;
    waitUntil(promise: Promise<any>): void;
  }
}

export {};
