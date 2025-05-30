
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Shield, Eye, Edit, CheckCircle, LogOut } from 'lucide-react';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

const GitHubAuthFlow: React.FC = () => {
  const {
    user,
    isAuthenticated,
    accessLevel,
    setAccessLevel,
    logout
  } = useGitHub();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleAccessUpgrade = async (level: 'read' | 'write') => {
    setIsUpgrading(true);
    try {
      setAccessLevel(level);
      toast({
        title: "Access Level Updated",
        description: `Upgraded to ${level === 'read' ? 'Read Only' : 'Read & Write'} access.`,
      });
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade access level.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Access Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.login}</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Connected
          </Badge>
        </div>

        {!accessLevel && (
          <div className="space-y-3">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Choose your access level:</p>
              <p className="text-xs text-muted-foreground">
                You can upgrade permissions later if needed
              </p>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={() => handleAccessUpgrade('read')}
                disabled={isUpgrading}
                variant="outline"
                className="w-full justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                Read Only Access
                <span className="ml-auto text-xs text-muted-foreground">Scan & Analyze</span>
              </Button>
              
              <Button
                onClick={() => handleAccessUpgrade('write')}
                disabled={isUpgrading}
                className="w-full justify-start"
              >
                <Edit className="w-4 h-4 mr-2" />
                Read & Write Access
                <span className="ml-auto text-xs text-muted-foreground">Auto-Fix</span>
              </Button>
            </div>
          </div>
        )}

        {accessLevel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Access:</span>
              <Badge variant={accessLevel === 'write' ? 'default' : 'secondary'}>
                {accessLevel === 'read' ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Read Only
                  </>
                ) : (
                  <>
                    <Edit className="w-3 h-3 mr-1" />
                    Read & Write
                  </>
                )}
              </Badge>
            </div>
            
            {accessLevel === 'read' && (
              <Button
                onClick={() => handleAccessUpgrade('write')}
                disabled={isUpgrading}
                size="sm"
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Upgrade to Auto-Fix
              </Button>
            )}
          </div>
        )}

        <Button onClick={logout} variant="outline" size="sm" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default GitHubAuthFlow;
