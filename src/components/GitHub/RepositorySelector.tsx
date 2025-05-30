
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Repository, Search, Shield, Edit, Eye } from 'lucide-react';
import { useGitHub } from '../../contexts/GitHubContext';
import { useToast } from '@/hooks/use-toast';

const RepositorySelector: React.FC = () => {
  const {
    repositories,
    selectedRepos,
    accessLevel,
    selectRepository,
    unselectRepository,
    setAccessLevel
  } = useGitHub();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccessLevelChange = (level: 'read' | 'write') => {
    setAccessLevel(level);
    toast({
      title: "Access Level Updated",
      description: `Set to ${level} access for selected repositories.`,
    });
  };

  const handleRepoToggle = (repoId: string, checked: boolean) => {
    if (checked) {
      selectRepository(repoId);
    } else {
      unselectRepository(repoId);
    }
  };

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repository className="w-5 h-5" />
          Repository Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={accessLevel || 'read'} onValueChange={(value) => handleAccessLevelChange(value as 'read' | 'write')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="read" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Read Only
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Read & Write
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="read" className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan repositories for vulnerabilities and security issues without making changes.
            </p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• View repository contents</li>
              <li>• Scan for security vulnerabilities</li>
              <li>• Analyze code quality</li>
              <li>• Generate security reports</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="write" className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enable auto-healing features to automatically fix security issues and vulnerabilities.
            </p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• All read-only features</li>
              <li>• Create automated security fixes</li>
              <li>• Update vulnerable dependencies</li>
              <li>• Submit pull requests with fixes</li>
            </ul>
          </TabsContent>
        </Tabs>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedRepos.includes(repo.id.toString())}
                    onCheckedChange={(checked) => handleRepoToggle(repo.id.toString(), checked as boolean)}
                  />
                  <div>
                    <p className="font-medium text-sm">{repo.name}</p>
                    <p className="text-xs text-muted-foreground">{repo.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {repo.private && (
                    <Badge variant="secondary" className="text-xs">
                      Private
                    </Badge>
                  )}
                  {repo.permissions?.admin && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedRepos.length > 0 && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm font-medium">
                {selectedRepos.length} repositories selected for {accessLevel} access
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositorySelector;
