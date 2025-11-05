import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  template: text("template"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileVersions = pgTable("file_versions", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull(),
  content: text("content").notNull(),
  version: integer("version").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(),
  result: text("result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull(),
  analysisType: text("analysis_type").notNull(),
  result: text("result").notNull(),
  severity: text("severity"),
  suggestions: text("suggestions"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertFileVersionSchema = createInsertSchema(fileVersions).omit({
  id: true,
  createdAt: true,
});

export const insertTestSchema = createInsertSchema(tests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiAnalysisSchema = createInsertSchema(aiAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertFileVersion = z.infer<typeof insertFileVersionSchema>;
export type FileVersion = typeof fileVersions.$inferSelect;

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;
export type AiAnalysis = typeof aiAnalyses.$inferSelect;

export interface SolutionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  code?: string;
  complexity: "simple" | "moderate" | "advanced";
}

export interface ProjectAnalysis {
  framework: string;
  language: string;
  styling: string[];
  libraries: string[];
  patterns: {
    componentStyle: string;
    stateManagement: string;
    routing: string;
  };
  fileStructure: {
    totalFiles: number;
    directories: string[];
  };
  recommendations: string[];
}

export interface TestResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  error?: string;
}

export interface ConsoleLog {
  type: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: number;
}

export interface NetworkRequest {
  method: string;
  url: string;
  status?: number;
  duration?: number;
  timestamp: number;
}

export type AnalysisType = 
  | "code-review"
  | "code-explain"
  | "refactor"
  | "bug-detect"
  | "documentation"
  | "performance"
  | "security"
  | "accessibility";

export interface CodeReviewResult {
  overallRating: number;
  summary: string;
  issues: Array<{
    line?: number;
    severity: "critical" | "warning" | "info";
    category: string;
    message: string;
    suggestion?: string;
  }>;
  strengths: string[];
  improvements: string[];
}

export interface CodeExplanation {
  summary: string;
  purpose: string;
  components: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  keyFeatures: string[];
  dependencies: string[];
  usage: string;
}

export interface RefactoringSuggestions {
  priority: "high" | "medium" | "low";
  suggestions: Array<{
    title: string;
    description: string;
    before: string;
    after: string;
    benefit: string;
    effort: "low" | "medium" | "high";
  }>;
}

export interface BugDetectionResult {
  bugsFound: number;
  bugs: Array<{
    severity: "critical" | "major" | "minor";
    type: string;
    line?: number;
    description: string;
    fix: string;
    impact: string;
  }>;
  potentialIssues: string[];
}

export interface PerformanceAnalysis {
  score: number;
  issues: Array<{
    category: string;
    severity: "high" | "medium" | "low";
    description: string;
    recommendation: string;
    estimatedImpact: string;
  }>;
  optimizations: string[];
}

export interface SecurityScanResult {
  riskLevel: "critical" | "high" | "medium" | "low" | "safe";
  vulnerabilities: Array<{
    type: string;
    severity: "critical" | "high" | "medium" | "low";
    description: string;
    location?: string;
    fix: string;
    cve?: string;
  }>;
  recommendations: string[];
}

export interface AccessibilityCheckResult {
  score: number;
  wcagLevel: "A" | "AA" | "AAA" | "None";
  issues: Array<{
    rule: string;
    impact: "critical" | "serious" | "moderate" | "minor";
    description: string;
    element?: string;
    fix: string;
  }>;
  passed: string[];
}
