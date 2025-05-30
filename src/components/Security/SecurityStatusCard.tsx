
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSecurity } from '../../contexts/SecurityContext';

interface SecurityStatusCardProps {
  expanded?: boolean;
}

const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({ expanded = false }) => {
  const { status } = useSecurity();
  
  const totalVulnerabilities = Object.values(status.vulnerabilities).reduce((a, b) => a + b, 0);
  const criticalIssues = status.vulnerabilities.critical + status.vulnerabilities.high;

  const getStatusIcon = () => {
    if (criticalIssues === 0) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (criticalIssues <= 2) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (criticalIssues === 0) return "Secure";
    if (criticalIssues <= 2) return "Attention Needed";
    return "Critical Issues";
  };

  const getStatusVariant = () => {
    if (criticalIssues === 0) return "default";
    if (criticalIssues <= 2) return "secondary";
    return "destructive";
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security Status
          </div>
          {!expanded && (
            <Link to="/security">
              <Button variant="outline" size="sm">View Details</Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Badge variant={getStatusVariant()}>
            {totalVulnerabilities} Issues
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {status.vulnerabilities.critical}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {status.vulnerabilities.high}
            </div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-500">
                  {status.vulnerabilities.medium}
                </div>
                <div className="text-xs text-muted-foreground">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">
                  {status.vulnerabilities.low}
                </div>
                <div className="text-xs text-muted-foreground">Low</div>
              </div>
            </div>

            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">IP Monitoring</span>
                <Badge variant={status.ipMonitoring.active ? "default" : "destructive"}>
                  {status.ipMonitoring.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {status.ipMonitoring.suspiciousIPs.length} suspicious IPs detected
              </div>
              <div className="text-xs text-muted-foreground">
                {status.ipMonitoring.blockedIPs.length} IPs currently blocked
              </div>
            </div>

            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Dependencies</span>
                <Badge variant={status.dependencies.vulnerable > 0 ? "destructive" : "default"}>
                  {status.dependencies.vulnerable} Vulnerable
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {status.dependencies.outdated} of {status.dependencies.total} packages outdated
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          Last scan: {status.lastScan ? status.lastScan.toLocaleString() : 'Never'}
        </div>

        {status.isScanning && (
          <div className="flex items-center gap-2 text-xs text-blue-500">
            <div className="animate-spin w-3 h-3 border border-blue-500 border-t-transparent rounded-full"></div>
            Security scan in progress...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityStatusCard;
