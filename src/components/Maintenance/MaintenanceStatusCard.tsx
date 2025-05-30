
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wrench, Package, RefreshCw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MaintenanceStatusCardProps {
  expanded?: boolean;
}

const MaintenanceStatusCard: React.FC<MaintenanceStatusCardProps> = ({ expanded = false }) => {
  const maintenanceData = {
    systemHealth: 92,
    pendingUpdates: 8,
    lastMaintenance: '2 hours ago',
    nextScheduled: 'Tonight at 2:00 AM',
    criticalTasks: 2
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            System Maintenance
          </div>
          {!expanded && (
            <Link to="/maintenance">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">System Health</span>
            <Badge variant={maintenanceData.systemHealth > 90 ? "default" : "destructive"}>
              {maintenanceData.systemHealth}%
            </Badge>
          </div>
          <Progress value={maintenanceData.systemHealth} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {maintenanceData.pendingUpdates}
            </div>
            <div className="text-xs text-muted-foreground">Pending Updates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {maintenanceData.criticalTasks}
            </div>
            <div className="text-xs text-muted-foreground">Critical Tasks</div>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3">
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Dependencies</span>
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">
                {maintenanceData.pendingUpdates} packages need updating
              </div>
              <Button size="sm" className="mt-2 w-full">
                <RefreshCw className="w-3 h-3 mr-1" />
                Update All
              </Button>
            </div>

            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Critical Issues</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-xs text-muted-foreground">
                {maintenanceData.criticalTasks} issues require immediate attention
              </div>
              <Button size="sm" variant="destructive" className="mt-2 w-full">
                View Issues
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Last Maintenance:</span>
                <span className="text-muted-foreground">{maintenanceData.lastMaintenance}</span>
              </div>
              <div className="flex justify-between">
                <span>Next Scheduled:</span>
                <span className="text-muted-foreground">{maintenanceData.nextScheduled}</span>
              </div>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Last maintenance: {maintenanceData.lastMaintenance}</div>
            <div>Next scheduled: {maintenanceData.nextScheduled}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceStatusCard;
