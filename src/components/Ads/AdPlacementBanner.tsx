
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

const AdPlacementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="panel relative bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Place Your Ad Here
              </h3>
              <p className="text-sm text-muted-foreground">
                Reach developers and security professionals using our platform
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-primary/20"
              onClick={() => window.open('#', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Learn More
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPlacementBanner;
