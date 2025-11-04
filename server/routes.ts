import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCode, chatWithAI, analyzeDesign, generateTests } from "./gemini";
import { insertProjectSchema, insertFileSchema, insertMessageSchema, insertFileVersionSchema, insertTestSchema, type ProjectAnalysis } from "@shared/schema";
import { registerGitRoutes } from "./git";

function handleApiError(error: unknown, res: Response, defaultMessage: string) {
  console.error(defaultMessage, error);
  
  if (error instanceof Error) {
    if (error.message.includes("GEMINI_API_KEY")) {
      return res.status(503).json({ 
        error: "AI service unavailable", 
        details: "Please configure GEMINI_API_KEY in your environment secrets",
        code: "AI_SERVICE_UNAVAILABLE"
      });
    }
    
    if (error.message.includes("validation") || error.message.includes("Invalid")) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.message,
        code: "VALIDATION_ERROR"
      });
    }
    
    return res.status(500).json({ 
      error: defaultMessage, 
      details: error.message,
      code: "INTERNAL_ERROR"
    });
  }
  
  res.status(500).json({ 
    error: defaultMessage,
    code: "UNKNOWN_ERROR"
  });
}

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

      const aiResponse = await chatWithAI(message, conversationHistory);

      await storage.createMessage({
        projectId,
        role: "user",
        content: message,
      });

      const assistantMessage = await storage.createMessage({
        projectId,
        role: "assistant",
        content: aiResponse.response,
        metadata: aiResponse.metadata,
      });

      res.json(assistantMessage);
    } catch (error) {
      handleApiError(error, res, "Failed to process chat message");
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
      handleApiError(error, res, "Failed to generate code");
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
      handleApiError(error, res, "Failed to analyze design");
    }
  });

  app.post("/api/analyze-project", async (req: Request, res: Response) => {
    try {
      const { projectId } = req.body;

      if (!projectId) {
        return res.status(400).json({ error: "Missing projectId" });
      }

      const files = await storage.getFilesByProject(projectId);
      
      const analysis: ProjectAnalysis = {
        framework: "Unknown",
        language: "Unknown",
        styling: [],
        libraries: [],
        patterns: {
          componentStyle: "Not detected",
          stateManagement: "Not detected",
          routing: "Not detected",
        },
        fileStructure: {
          totalFiles: files.length,
          directories: [],
        },
        recommendations: [],
      };

      const allContent = files.map(f => f.content).join("\n");
      const allPaths = files.map(f => f.path);
      const uniqueDirs = new Set(allPaths.map(p => p.split("/").slice(0, -1).join("/")).filter(Boolean));
      analysis.fileStructure.directories = Array.from(uniqueDirs);

      if (allContent.includes("import React") || allContent.includes("from 'react'") || allContent.includes("from \"react\"")) {
        analysis.framework = "React";
        analysis.language = "JavaScript/TypeScript";
      }

      if (allContent.includes("from 'next") || allContent.includes("from \"next")) {
        analysis.framework = "Next.js";
      }

      if (allContent.includes("from 'vue") || allContent.includes("from \"vue")) {
        analysis.framework = "Vue";
      }

      if (allContent.includes("interface ") || allContent.includes("type ") || files.some(f => f.name.endsWith(".ts") || f.name.endsWith(".tsx"))) {
        analysis.language = "TypeScript";
      }

      if (allContent.includes("tailwind") || allContent.includes("className=")) {
        analysis.styling.push("Tailwind CSS");
      }

      if (allContent.includes("styled-components") || allContent.includes("styled.")) {
        analysis.styling.push("Styled Components");
      }

      if (allContent.includes("@emotion")) {
        analysis.styling.push("Emotion");
      }

      if (allContent.includes("useState") || allContent.includes("useEffect")) {
        analysis.patterns.stateManagement = "React Hooks";
      }

      if (allContent.includes("useQuery") || allContent.includes("@tanstack/react-query")) {
        analysis.libraries.push("TanStack Query");
        analysis.patterns.stateManagement = "React Hooks + TanStack Query";
      }

      if (allContent.includes("wouter") || allContent.includes("react-router")) {
        analysis.patterns.routing = allContent.includes("wouter") ? "Wouter" : "React Router";
        analysis.libraries.push(allContent.includes("wouter") ? "Wouter" : "React Router");
      }

      if (allContent.includes("const ") && allContent.includes("= () =>")) {
        analysis.patterns.componentStyle = "Arrow Function Components";
      } else if (allContent.includes("function ") && allContent.includes("Component")) {
        analysis.patterns.componentStyle = "Function Declaration Components";
      }

      if (allContent.includes("shadcn") || allContent.includes("@/components/ui/")) {
        analysis.libraries.push("shadcn/ui");
      }

      if (allContent.includes("framer-motion")) {
        analysis.libraries.push("Framer Motion");
      }

      if (allContent.includes("lucide-react")) {
        analysis.libraries.push("Lucide Icons");
      }

      if (analysis.framework === "React" || analysis.framework === "Next.js") {
        analysis.recommendations.push("Continue using " + analysis.framework + " for consistency");
      }

      if (analysis.patterns.componentStyle === "Arrow Function Components") {
        analysis.recommendations.push("Maintain arrow function style: const Component = () => { ... }");
      }

      if (analysis.styling.includes("Tailwind CSS")) {
        analysis.recommendations.push("Use Tailwind CSS utility classes for styling");
      }

      if (analysis.libraries.includes("shadcn/ui")) {
        analysis.recommendations.push("Leverage existing shadcn/ui components instead of building from scratch");
      }

      if (files.length === 0) {
        analysis.recommendations.push("Start by generating some components to establish project patterns");
      }

      res.json(analysis);
    } catch (error) {
      console.error("Project analysis error:", error);
      res.status(500).json({ error: "Failed to analyze project" });
    }
  });

  app.post("/api/files/:fileId/generate-tests", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const file = await storage.getFile(fileId);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      const testCode = await generateTests({
        fileName: file.name,
        fileContent: file.content,
        framework: "React",
      });

      if (!testCode || testCode.length < 50) {
        return res.status(500).json({ 
          error: "Generated test code is too short or empty",
          code: "INVALID_TEST_CODE"
        });
      }

      const testFileName = file.name.replace(/\.(tsx?|jsx?)$/, ".test.$1");
      const testFile = await storage.createFile({
        projectId: file.projectId,
        name: testFileName,
        path: file.path.replace(/\.(tsx?|jsx?)$/, ".test.$1"),
        content: testCode,
        type: "test",
      });

      await storage.createTest({
        fileId: file.id,
        name: testFileName,
        content: testCode,
        status: "pending",
      });

      res.json({ testFile, testCode });
    } catch (error) {
      handleApiError(error, res, "Failed to generate tests");
    }
  });

  app.get("/api/files/:fileId/tests", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const tests = await storage.getTestsByFile(fileId);
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tests" });
    }
  });

  app.get("/api/files/:fileId/versions", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const versions = await storage.getFileVersions(fileId);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch file versions" });
    }
  });

  app.post("/api/files/:fileId/restore/:versionId", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const versionId = parseInt(req.params.versionId);
      const restoredFile = await storage.restoreFileVersion(fileId, versionId);
      
      if (!restoredFile) {
        return res.status(404).json({ error: "File or version not found" });
      }
      
      res.json(restoredFile);
    } catch (error) {
      res.status(500).json({ error: "Failed to restore file version" });
    }
  });

  registerGitRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
