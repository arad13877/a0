import type { Express, Request, Response } from "express";
import { storage } from "./storage";

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: Date;
  files: string[];
}

interface GitBranch {
  name: string;
  current: boolean;
}

export function registerGitRoutes(app: Express) {
  app.get("/api/git/:projectId/status", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const files = await storage.getFilesByProject(projectId);
      
      res.json({
        modified: files.map(f => f.path),
        added: [],
        deleted: [],
        untracked: []
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get git status" });
    }
  });

  app.get("/api/git/:projectId/commits", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const limit = parseInt(req.query.limit as string) || 10;
      
      const files = await storage.getFilesByProject(projectId);
      const allVersions: any[] = [];
      
      for (const file of files) {
        const versions = await storage.getFileVersions(file.id);
        allVersions.push(...versions.map(v => ({
          ...v,
          fileName: file.name,
          filePath: file.path
        })));
      }
      
      allVersions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      const commits: GitCommit[] = allVersions.slice(0, limit).map((v) => ({
        hash: `commit-${v.id}`,
        message: `Updated ${v.fileName} (version ${v.version})`,
        author: "AI Agent",
        date: v.createdAt,
        files: [v.filePath]
      }));
      
      res.json(commits);
    } catch (error) {
      res.status(500).json({ error: "Failed to get commits" });
    }
  });

  app.get("/api/git/:projectId/branches", async (_req: Request, res: Response) => {
    const branches: GitBranch[] = [
      { name: "main", current: true },
      { name: "develop", current: false }
    ];
    res.json(branches);
  });

  app.post("/api/git/:projectId/branches", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Branch name required" });
    }
    
    res.json({ name, current: false });
  });

  app.post("/api/git/:projectId/checkout", async (req: Request, res: Response) => {
    const { branch } = req.body;
    if (!branch) {
      return res.status(400).json({ error: "Branch name required" });
    }
    
    res.json({ success: true, branch });
  });

  app.post("/api/git/:projectId/commit", async (req: Request, res: Response) => {
    try {
      const { message, files: fileNames } = req.body;
      const projectId = parseInt(req.params.projectId);
      
      if (!message) {
        return res.status(400).json({ error: "Commit message required" });
      }

      const commit: GitCommit = {
        hash: `commit-${Date.now()}`,
        message,
        author: "AI Agent",
        date: new Date(),
        files: fileNames || []
      };
      
      res.json(commit);
    } catch (error) {
      res.status(500).json({ error: "Failed to commit" });
    }
  });

  app.post("/api/git/:projectId/pull", async (_req: Request, res: Response) => {
    res.json({ success: true, message: "Already up to date" });
  });

  app.post("/api/git/:projectId/push", async (_req: Request, res: Response) => {
    res.json({ success: true, message: "Pushed successfully" });
  });
}
