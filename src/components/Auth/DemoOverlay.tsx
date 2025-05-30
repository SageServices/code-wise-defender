
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Shield, Lock, X } from 'lucide-react';
import { useGitHub } from '../../contexts/GitHubContext';

interface DemoOverlayProps {
  onDismiss?: () => void;
  trigger?: string;
}

const DemoOverlay: React.FC<DemoOverlayProps> = ({ onDismiss, trigger }) => {
  const { authenticateWithGitHub, isLoading } = useGitHub();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-2 relative">
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={onDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">
            {trigger ? 'Sign in Required' : 'Security Dashboard Demo'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {trigger 
              ? `To ${trigger}, please sign in with GitHub for real-time security analysis.`
              : 'You\'re viewing a demonstration. Sign in with GitHub for real-time security analysis of your repositories.'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-green-500" />
              <span>Secure GitHub OAuth authentication</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Real-time vulnerability scanning</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Github className="w-4 h-4 text-purple-500" />
              <span>Automated security fixes</span>
            </div>
          </div>
          
          <Button 
            onClick={authenticateWithGitHub}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Github className="w-5 h-5 mr-2" />
            {isLoading ? 'Connecting...' : 'Sign in with GitHub'}
          </Button>
          
          {onDismiss && (
            <Button 
              onClick={onDismiss}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Continue Demo Mode
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground">
            Access your repositories securely with granular permissions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoOverlay;
