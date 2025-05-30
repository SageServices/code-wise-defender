
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Shield, Code, LogOut } from 'lucide-react';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

const GitHubAuth: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    authenticateWithGitHub,
    logout
  } = useGitHub();
  const { toast } = useToast();

  const handleAuthenticate = async () => {
    try {
      await authenticateWithGitHub();
      toast({
        title: "Authentication Successful",
        description: "Connected to GitHub successfully.",
      });
    } catch (err) {
      toast({
        title: "Authentication Failed",
        description: "Failed to connect to GitHub.",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated && user) {
    return (
      <Card className="panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.login}</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              <Shield className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </div>
          
          <Button onClick={logout} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          Connect GitHub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your GitHub account to enable repository scanning and auto-healing features.
        </p>
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Code className="w-4 h-4 text-blue-500" />
            <span>Repository scanning and analysis</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Automated security fixes</span>
          </div>
        </div>
        
        <Button 
          onClick={handleAuthenticate} 
          disabled={isLoading}
          className="w-full"
        >
          <Github className="w-4 h-4 mr-2" />
          {isLoading ? 'Connecting...' : 'Connect to GitHub'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GitHubAuth;
