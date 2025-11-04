export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: Date;
  files: string[];
}

export interface GitBranch {
  name: string;
  current: boolean;
}

export interface GitStatus {
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
}

export class GitClient {
  private projectId: number | null = null;

  setProject(projectId: number) {
    this.projectId = projectId;
  }

  async getStatus(): Promise<GitStatus> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/status`);
    if (!response.ok) throw new Error('Failed to get git status');
    return response.json();
  }

  async commit(message: string, files: string[]): Promise<GitCommit> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, files }),
    });
    
    if (!response.ok) throw new Error('Failed to commit');
    return response.json();
  }

  async getCommits(limit = 10): Promise<GitCommit[]> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/commits?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to get commits');
    return response.json();
  }

  async getBranches(): Promise<GitBranch[]> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/branches`);
    if (!response.ok) throw new Error('Failed to get branches');
    return response.json();
  }

  async createBranch(name: string): Promise<GitBranch> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) throw new Error('Failed to create branch');
    return response.json();
  }

  async switchBranch(name: string): Promise<void> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch: name }),
    });
    
    if (!response.ok) throw new Error('Failed to switch branch');
  }

  async pull(): Promise<void> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/pull`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to pull');
  }

  async push(): Promise<void> {
    if (!this.projectId) throw new Error('No project selected');
    
    const response = await fetch(`/api/git/${this.projectId}/push`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to push');
  }
}

export const gitClient = new GitClient();
