import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Octokit } from '@octokit/rest';

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

interface GitHubContextType {
  user: GitHubUser | null;
  repositories: Repository[];
  selectedRepos: string[];
  accessLevel: 'read' | 'write' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authenticateWithGitHub: () => Promise<void>;
  logout: () => void;
  selectRepository: (repoId: string) => void;
  unselectRepository: (repoId: string) => void;
  setAccessLevel: (level: 'read' | 'write') => void;
  scanRepository: (repoName: string) => Promise<any>;
  createAutoFix: (repoName: string, fix: any) => Promise<any>;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [accessLevel, setAccessLevel] = useState<'read' | 'write' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [octokit, setOctokit] = useState<Octokit | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('github_token');
    const savedAccessLevel = localStorage.getItem('github_access_level') as 'read' | 'write' | null;
    if (token) {
      initializeOctokit(token);
      if (savedAccessLevel) {
        setAccessLevel(savedAccessLevel);
      }
    }
  }, []);

  const initializeOctokit = async (token: string) => {
    try {
      const octokitInstance = new Octokit({ auth: token });
      setOctokit(octokitInstance);
      
      const { data: userData } = await octokitInstance.rest.users.getAuthenticated();
      setUser(userData as GitHubUser);
      setIsAuthenticated(true);
      
      const { data: reposData } = await octokitInstance.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'updated',
        affiliation: 'owner,collaborator'
      });
      setRepositories(reposData as Repository[]);
    } catch (err) {
      setError('Failed to authenticate with GitHub');
      localStorage.removeItem('github_token');
      localStorage.removeItem('github_access_level');
    }
  };

  const authenticateWithGitHub = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate proper OAuth flow with better UX
      const token = prompt(
        'For demo purposes, please enter your GitHub Personal Access Token.\n\n' +
        'In production, this would use secure OAuth flow.\n\n' +
        'Generate a token at: https://github.com/settings/tokens\n' +
        'Required scopes: repo, read:user'
      );
      
      if (token) {
        localStorage.setItem('github_token', token);
        await initializeOctokit(token);
      } else {
        setError('Authentication cancelled');
      }
    } catch (err) {
      setError('Authentication failed. Please check your token and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_access_level');
    setUser(null);
    setRepositories([]);
    setSelectedRepos([]);
    setAccessLevel(null);
    setIsAuthenticated(false);
    setOctokit(null);
    setError(null);
  };

  const selectRepository = (repoId: string) => {
    setSelectedRepos(prev => [...prev, repoId]);
  };

  const unselectRepository = (repoId: string) => {
    setSelectedRepos(prev => prev.filter(id => id !== repoId));
  };

  const handleSetAccessLevel = (level: 'read' | 'write') => {
    const previousLevel = accessLevel;
    setAccessLevel(level);
    localStorage.setItem('github_access_level', level);
    
    // Log the permission change
    if (window.backupContext) {
      window.backupContext.addChangeLog({
        action: 'permission-change',
        details: `Access level changed from ${previousLevel || 'none'} to ${level}`,
        beforeState: { accessLevel: previousLevel },
        afterState: { accessLevel: level }
      });
    }
  };

  const scanRepository = async (repoName: string) => {
    if (!octokit) throw new Error('Not authenticated');
    
    try {
      const [owner, repo] = repoName.split('/');
      
      // Verify ownership/access before scanning
      const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
      if (!repoData.permissions?.pull) {
        throw new Error('Insufficient permissions to scan this repository');
      }
      
      // Log the scan action
      if (window.backupContext) {
        window.backupContext.addChangeLog({
          action: 'scan',
          repository: repoName,
          details: `Scanned repository for vulnerabilities and dependencies`,
          beforeState: { action: 'scan_start' },
          afterState: { action: 'scan_complete', repository: repoName }
        });
      }
      
      // Simulate comprehensive security scan
      const vulnerabilities = Math.floor(Math.random() * 15);
      const dependencies = Math.floor(Math.random() * 80) + 20;
      const codeQuality = Math.floor(Math.random() * 30) + 70;
      
      return {
        vulnerabilities,
        dependencies,
        codeQuality,
        lastScan: new Date().toISOString(),
        issues: [
          { type: 'security', severity: 'high', description: 'Outdated dependency with known CVE' },
          { type: 'quality', severity: 'medium', description: 'Code complexity exceeds threshold' },
          { type: 'security', severity: 'low', description: 'Missing security headers' }
        ]
      };
    } catch (err) {
      throw new Error(`Failed to scan repository: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const createAutoFix = async (repoName: string, fix: any) => {
    if (!octokit || accessLevel !== 'write') {
      throw new Error('Write access required for auto-fix');
    }
    
    try {
      const [owner, repo] = repoName.split('/');
      
      // Verify write permissions
      const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
      if (!repoData.permissions?.push) {
        throw new Error('Insufficient permissions to create fixes for this repository');
      }

      // Log the auto-fix action
      if (window.backupContext) {
        window.backupContext.addChangeLog({
          action: 'auto-fix',
          repository: repoName,
          details: `Created automated security fix: ${fix.title}`,
          beforeState: { repository: repoName, issues: fix.issues },
          afterState: { repository: repoName, fix: fix.title, status: 'pr_created' }
        });
      }
      
      // Create a new branch for the fix
      const branchName = `security-fix-${Date.now()}`;
      const { data: ref } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: 'heads/main'
      });
      
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: ref.object.sha
      });
      
      // Create pull request with fix
      const { data: pr } = await octokit.rest.pulls.create({
        owner,
        repo,
        title: `🔒 Security Fix: ${fix.title}`,
        head: branchName,
        base: 'main',
        body: `## Automated Security Fix\n\n${fix.description}\n\n---\n\n*This PR was created automatically by the Security Platform. Please review changes before merging.*`
      });
      
      return pr;
    } catch (err) {
      throw new Error(`Failed to create auto-fix: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <GitHubContext.Provider value={{
      user,
      repositories,
      selectedRepos,
      accessLevel,
      isAuthenticated,
      isLoading,
      error,
      authenticateWithGitHub,
      logout,
      selectRepository,
      unselectRepository,
      setAccessLevel: handleSetAccessLevel,
      scanRepository,
      createAutoFix
    }}>
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};
