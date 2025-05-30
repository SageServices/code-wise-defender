
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SecurityStatus {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastScan: Date | null;
  isScanning: boolean;
  ipMonitoring: {
    active: boolean;
    suspiciousIPs: string[];
    blockedIPs: string[];
  };
  dependencies: {
    outdated: number;
    vulnerable: number;
    total: number;
  };
}

interface SecurityContextType {
  status: SecurityStatus;
  runVulnerabilityScan: (target: string) => Promise<void>;
  toggleIPMonitoring: () => void;
  blockIP: (ip: string) => void;
  unblockIP: (ip: string) => void;
  updateDependencies: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SecurityStatus>({
    vulnerabilities: { critical: 0, high: 2, medium: 5, low: 12 },
    lastScan: null,
    isScanning: false,
    ipMonitoring: {
      active: true,
      suspiciousIPs: ['192.168.1.100', '10.0.0.50'],
      blockedIPs: ['172.16.0.25']
    },
    dependencies: { outdated: 8, vulnerable: 3, total: 156 }
  });

  const runVulnerabilityScan = async (target: string) => {
    setStatus(prev => ({ ...prev, isScanning: true }));
    
    try {
      // Simulate real scan - in production, this would call actual security tools
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results - replace with real OWASP ZAP/Snyk integration
      const mockResults = {
        critical: Math.floor(Math.random() * 3),
        high: Math.floor(Math.random() * 5),
        medium: Math.floor(Math.random() * 10),
        low: Math.floor(Math.random() * 20)
      };
      
      setStatus(prev => ({
        ...prev,
        vulnerabilities: mockResults,
        lastScan: new Date(),
        isScanning: false
      }));
    } catch (error) {
      setStatus(prev => ({ ...prev, isScanning: false }));
    }
  };

  const toggleIPMonitoring = () => {
    setStatus(prev => ({
      ...prev,
      ipMonitoring: {
        ...prev.ipMonitoring,
        active: !prev.ipMonitoring.active
      }
    }));
  };

  const blockIP = (ip: string) => {
    setStatus(prev => ({
      ...prev,
      ipMonitoring: {
        ...prev.ipMonitoring,
        blockedIPs: [...prev.ipMonitoring.blockedIPs, ip],
        suspiciousIPs: prev.ipMonitoring.suspiciousIPs.filter(suspiciousIP => suspiciousIP !== ip)
      }
    }));
  };

  const unblockIP = (ip: string) => {
    setStatus(prev => ({
      ...prev,
      ipMonitoring: {
        ...prev.ipMonitoring,
        blockedIPs: prev.ipMonitoring.blockedIPs.filter(blockedIP => blockedIP !== ip)
      }
    }));
  };

  const updateDependencies = async () => {
    // Mock dependency update - replace with real dependency management
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus(prev => ({
      ...prev,
      dependencies: {
        ...prev.dependencies,
        outdated: Math.max(0, prev.dependencies.outdated - 3),
        vulnerable: Math.max(0, prev.dependencies.vulnerable - 1)
      }
    }));
  };

  return (
    <SecurityContext.Provider value={{
      status,
      runVulnerabilityScan,
      toggleIPMonitoring,
      blockIP,
      unblockIP,
      updateDependencies
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
