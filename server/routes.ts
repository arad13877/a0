import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCode, chatWithAI, analyzeDesign } from "./gemini";
import { insertProjectSchema, insertFileSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.get("/api/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.post("/api/files", async (req: Request, res: Response) => {
    try {
      const data = insertFileSchema.parse(req.body);
      const file = await storage.createFile(data);
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: "Invalid file data" });
    }
  });

  app.get("/api/projects/:projectId/files", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const files = await storage.getFilesByProject(projectId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  app.patch("/api/files/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { content } = req.body;
      const file = await storage.updateFile(id, content);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFile(id);
      if (!deleted) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  app.get("/api/projects/:projectId/messages", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const messages = await storage.getMessagesByProject(projectId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { projectId, message } = req.body;

      if (!projectId || !message) {
        return res.status(400).json({ error: "Missing projectId or message" });
      }

      const history = await storage.getMessagesByProject(projectId);
      const conversationHistory = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatWithAI(message, conversationHistory);

      await storage.createMessage({
        projectId,
        role: "user",
        content: message,
      });

      const assistantMessage = await storage.createMessage({
        projectId,
        role: "assistant",
        content: response,
      });

      res.json(assistantMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.post("/api/generate-code", async (req: Request, res: Response) => {
    try {
      const { projectId, prompt, context } = req.body;

      if (!projectId || !prompt) {
        return res.status(400).json({ error: "Missing projectId or prompt" });
      }

      const result = await generateCode({ prompt, context });

      for (const file of result.files) {
        await storage.createFile({
          projectId,
          name: file.name,
          path: file.path,
          content: file.content,
          type: file.type,
        });
      }

      await storage.createMessage({
        projectId,
        role: "assistant",
        content: result.explanation,
      });

      res.json(result);
    } catch (error) {
      console.error("Code generation error:", error);
      res.status(500).json({ error: "Failed to generate code" });
    }
  });

  app.post("/api/analyze-design", async (req: Request, res: Response) => {
    try {
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const analysis = await analyzeDesign(imageData);
      res.json({ analysis });
    } catch (error) {
      console.error("Design analysis error:", error);
      res.status(500).json({ error: "Failed to analyze design" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
