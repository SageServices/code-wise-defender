
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wrench, Package, AlertCircle } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';

interface MaintenanceStatusCardProps {
  expanded?: boolean;
}

const MaintenanceStatusCard: React.FC<MaintenanceStatusCardProps> = ({ expanded = false }) => {
  const { status, updateDependencies } = useSecurity();

  const healthPercentage = Math.round(
    ((status.dependencies.total - status.dependencies.outdated - status.dependencies.vulnerable) / status.dependencies.total) * 100
  );

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          Maintenance Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Health */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">System Health</h4>
            <Badge className={healthPercentage > 90 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
              {healthPercentage}%
            </Badge>
          </div>
          <Progress value={healthPercentage} className="h-2" />
        </div>

        {/* Dependencies */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Dependencies</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-foreground">{status.dependencies.total}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Outdated</span>
              <Badge className={status.dependencies.outdated > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}>
                {status.dependencies.outdated}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Vulnerable</span>
              <Badge className={status.dependencies.vulnerable > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}>
                {status.dependencies.vulnerable}
              </Badge>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="space-y-4">
            {/* Update Action */}
            <Button 
              onClick={updateDependencies} 
              className="w-full"
              disabled={status.dependencies.outdated === 0 && status.dependencies.vulnerable === 0}
            >
              <Package className="w-4 h-4 mr-2" />
              Update Dependencies
            </Button>

            {/* Maintenance Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommendations</h4>
              <div className="space-y-2">
                {status.dependencies.outdated > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">Update outdated dependencies</p>
                      <p className="text-muted-foreground">{status.dependencies.outdated} packages need updating</p>
                    </div>
                  </div>
                )}
                
                {status.dependencies.vulnerable > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">Security vulnerabilities detected</p>
                      <p className="text-muted-foreground">{status.dependencies.vulnerable} vulnerable packages found</p>
                    </div>
                  </div>
                )}

                {status.dependencies.outdated === 0 && status.dependencies.vulnerable === 0 && (
                  <div className="flex items-start gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                    <AlertCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">All dependencies up to date</p>
                      <p className="text-muted-foreground">No maintenance required at this time</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceStatusCard;
