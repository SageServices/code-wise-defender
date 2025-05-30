
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileX, Plus, Trash2, Shield } from 'lucide-react';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

const IgnoreListManager: React.FC = () => {
  const { accessLevel } = useGitHub();
  const { toast } = useToast();
  const [ignoreList, setIgnoreList] = useState<string[]>([
    '.env',
    '.env.local',
    'secrets.json',
    'private-key.pem',
    'node_modules/',
    '.git/',
  ]);
  const [newPattern, setNewPattern] = useState('');

  const addPattern = () => {
    if (newPattern.trim() && !ignoreList.includes(newPattern.trim())) {
      setIgnoreList([...ignoreList, newPattern.trim()]);
      setNewPattern('');
      toast({
        title: "Pattern Added",
        description: `Added "${newPattern.trim()}" to ignore list.`,
      });
    }
  };

  const removePattern = (pattern: string) => {
    setIgnoreList(ignoreList.filter(p => p !== pattern));
    toast({
      title: "Pattern Removed",
      description: `Removed "${pattern}" from ignore list.`,
    });
  };

  if (accessLevel !== 'write') {
    return null;
  }

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileX className="w-5 h-5" />
          File Ignore List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Shield className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-blue-600">
            Files matching these patterns will be scanned but never modified during auto-fixes.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add pattern (e.g., *.env, config/)"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPattern()}
            />
            <Button onClick={addPattern} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Protected Files & Patterns:</p>
          <div className="flex flex-wrap gap-2">
            {ignoreList.map((pattern) => (
              <Badge
                key={pattern}
                variant="outline"
                className="flex items-center gap-1"
              >
                <span>{pattern}</span>
                <button
                  onClick={() => removePattern(pattern)}
                  className="ml-1 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Use * for wildcards (*.env matches all .env files)</p>
          <p>• End with / for directories (node_modules/)</p>
          <p>• Default patterns protect common sensitive files</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IgnoreListManager;
