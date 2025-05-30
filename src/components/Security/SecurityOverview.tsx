
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SecurityStatusCard from './SecurityStatusCard';

const SecurityOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Security Center</h1>
        <p className="text-muted-foreground">Comprehensive security monitoring and management</p>
      </div>
      
      <SecurityStatusCard expanded />
    </div>
  );
};

export default SecurityOverview;
