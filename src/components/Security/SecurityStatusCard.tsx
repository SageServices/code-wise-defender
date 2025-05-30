
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';

interface SecurityStatusCardProps {
  expanded?: boolean;
}

const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({ expanded = false }) => {
  const { status, toggleIPMonitoring, blockIP, unblockIP } = useSecurity();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vulnerability Summary */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Vulnerabilities</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(status.vulnerabilities).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <span className="text-sm capitalize text-foreground">{severity}</span>
                <Badge className={getSeverityColor(severity)}>{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* IP Monitoring */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">IP Monitoring</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleIPMonitoring}
              className="h-8 w-8 p-0"
            >
              {status.ipMonitoring.active ? 
                <Eye className="w-4 h-4 text-green-500" /> : 
                <EyeOff className="w-4 h-4 text-red-500" />
              }
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge className={status.ipMonitoring.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                {status.ipMonitoring.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Suspicious IPs</span>
              <span className="text-foreground">{status.ipMonitoring.suspiciousIPs.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Blocked IPs</span>
              <span className="text-foreground">{status.ipMonitoring.blockedIPs.length}</span>
            </div>
          </div>
        </div>

        {expanded && (
          <>
            {/* Suspicious IPs List */}
            {status.ipMonitoring.suspiciousIPs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Suspicious IPs</h4>
                <div className="space-y-2">
                  {status.ipMonitoring.suspiciousIPs.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <span className="text-sm text-foreground font-mono">{ip}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => blockIP(ip)}
                      >
                        Block
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blocked IPs List */}
            {status.ipMonitoring.blockedIPs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Blocked IPs</h4>
                <div className="space-y-2">
                  {status.ipMonitoring.blockedIPs.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/20">
                      <span className="text-sm text-foreground font-mono">{ip}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unblockIP(ip)}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Last Scan Info */}
        {status.lastScan && (
          <div className="text-xs text-muted-foreground">
            Last scan: {status.lastScan.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityStatusCard;
