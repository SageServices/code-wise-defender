
import React from 'react';
import MaintenanceStatusCard from './MaintenanceStatusCard';

const MaintenancePanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Maintenance Center</h1>
        <p className="text-muted-foreground">System maintenance and optimization tools</p>
      </div>
      
      <MaintenanceStatusCard expanded />
    </div>
  );
};

export default MaintenancePanel;
