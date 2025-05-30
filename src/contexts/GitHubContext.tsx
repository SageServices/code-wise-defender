
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
    if (token) {
      initializeOctokit(token);
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
        sort: 'updated'
      });
      setRepositories(reposData as Repository[]);
    } catch (err) {
      setError('Failed to authenticate with GitHub');
      localStorage.removeItem('github_token');
    }
  };

  const authenticateWithGitHub = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use OAuth flow
      // For now, we'll simulate with a prompt for personal access token
      const token = prompt('Enter your GitHub Personal Access Token:');
      if (token) {
        localStorage.setItem('github_token', token);
        await initializeOctokit(token);
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    setUser(null);
    setRepositories([]);
    setSelectedRepos([]);
    setAccessLevel(null);
    setIsAuthenticated(false);
    setOctokit(null);
  };

  const selectRepository = (repoId: string) => {
    setSelectedRepos(prev => [...prev, repoId]);
  };

  const unselectRepository = (repoId: string) => {
    setSelectedRepos(prev => prev.filter(id => id !== repoId));
  };

  const scanRepository = async (repoName: string) => {
    if (!octokit) throw new Error('Not authenticated');
    
    try {
      const [owner, repo] = repoName.split('/');
      const { data: contents } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: ''
      });
      
      // Simulate security scan
      return {
        vulnerabilities: Math.floor(Math.random() * 10),
        dependencies: Math.floor(Math.random() * 50),
        codeQuality: Math.floor(Math.random() * 100),
        lastScan: new Date().toISOString()
      };
    } catch (err) {
      throw new Error('Failed to scan repository');
    }
  };

  const createAutoFix = async (repoName: string, fix: any) => {
    if (!octokit || accessLevel !== 'write') {
      throw new Error('Write access required for auto-fix');
    }
    
    try {
      const [owner, repo] = repoName.split('/');
      
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
        title: `Security Fix: ${fix.title}`,
        head: branchName,
        base: 'main',
        body: `Automated security fix:\n\n${fix.description}`
      });
      
      return pr;
    } catch (err) {
      throw new Error('Failed to create auto-fix');
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
      setAccessLevel,
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
