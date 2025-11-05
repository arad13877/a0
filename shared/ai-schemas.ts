import { z } from "zod";

export const codeReviewResultSchema = z.object({
  overallRating: z.number().min(0).max(10),
  summary: z.string(),
  issues: z.array(z.object({
    severity: z.enum(["critical", "warning", "info"]),
    category: z.string(),
    message: z.string(),
    suggestion: z.string().optional(),
    line: z.number().optional(),
  })).optional(),
  strengths: z.array(z.string()).optional(),
  improvements: z.array(z.string()).optional(),
});

export const codeExplanationResultSchema = z.object({
  summary: z.string(),
  purpose: z.string(),
  components: z.array(z.object({
    type: z.string(),
    name: z.string(),
    description: z.string(),
  })).optional(),
  keyFeatures: z.array(z.string()).optional(),
  usage: z.string().optional(),
});

export const refactoringResultSchema = z.object({
  priority: z.enum(["low", "medium", "high"]),
  suggestions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    before: z.string(),
    after: z.string(),
    benefit: z.string(),
    effort: z.enum(["low", "medium", "high"]),
  })),
});

export const bugDetectionResultSchema = z.object({
  bugsFound: z.number(),
  bugs: z.array(z.object({
    severity: z.enum(["critical", "major", "minor"]),
    type: z.string(),
    description: z.string(),
    fix: z.string(),
    impact: z.string(),
    line: z.number().optional(),
  })).optional(),
  potentialIssues: z.array(z.string()).optional(),
});

export const documentationResultSchema = z.object({
  documentedCode: z.string(),
});

export const performanceResultSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(z.object({
    category: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    description: z.string(),
    recommendation: z.string(),
    estimatedImpact: z.string(),
  })).optional(),
  optimizations: z.array(z.string()).optional(),
});

export const securityResultSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  vulnerabilities: z.array(z.object({
    type: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    description: z.string(),
    location: z.string(),
    fix: z.string(),
    cve: z.string().optional(),
  })).optional(),
  recommendations: z.array(z.string()).optional(),
});

export const accessibilityResultSchema = z.object({
  score: z.number().min(0).max(100),
  wcagLevel: z.string().optional(),
  issues: z.array(z.object({
    rule: z.string(),
    impact: z.enum(["minor", "moderate", "serious", "critical"]),
    description: z.string(),
    element: z.string().optional(),
    fix: z.string(),
  })).optional(),
  passed: z.array(z.string()).optional(),
});

export type CodeReviewResult = z.infer<typeof codeReviewResultSchema>;
export type CodeExplanationResult = z.infer<typeof codeExplanationResultSchema>;
export type RefactoringResult = z.infer<typeof refactoringResultSchema>;
export type BugDetectionResult = z.infer<typeof bugDetectionResultSchema>;
export type DocumentationResult = z.infer<typeof documentationResultSchema>;
export type PerformanceResult = z.infer<typeof performanceResultSchema>;
export type SecurityResult = z.infer<typeof securityResultSchema>;
export type AccessibilityResult = z.infer<typeof accessibilityResultSchema>;

export type AIAnalysisResult =
  | CodeReviewResult
  | CodeExplanationResult
  | RefactoringResult
  | BugDetectionResult
  | DocumentationResult
  | PerformanceResult
  | SecurityResult
  | AccessibilityResult;

export function validateAnalysisResult(type: string, data: unknown): AIAnalysisResult {
  switch (type) {
    case "review":
      return codeReviewResultSchema.parse(data);
    case "explain":
      return codeExplanationResultSchema.parse(data);
    case "refactor":
      return refactoringResultSchema.parse(data);
    case "bugs":
      return bugDetectionResultSchema.parse(data);
    case "document":
      return documentationResultSchema.parse(data);
    case "performance":
      return performanceResultSchema.parse(data);
    case "security":
      return securityResultSchema.parse(data);
    case "accessibility":
      return accessibilityResultSchema.parse(data);
    default:
      throw new Error(`Unknown analysis type: ${type}`);
  }
}

export function isCodeReviewResult(result: AIAnalysisResult): result is CodeReviewResult {
  return 'overallRating' in result;
}

export function isCodeExplanationResult(result: AIAnalysisResult): result is CodeExplanationResult {
  return 'purpose' in result && 'summary' in result;
}

export function isRefactoringResult(result: AIAnalysisResult): result is RefactoringResult {
  return 'priority' in result && 'suggestions' in result;
}

export function isBugDetectionResult(result: AIAnalysisResult): result is BugDetectionResult {
  return 'bugsFound' in result;
}

export function isDocumentationResult(result: AIAnalysisResult): result is DocumentationResult {
  return 'documentedCode' in result;
}

export function isPerformanceResult(result: AIAnalysisResult): result is PerformanceResult {
  return 'score' in result && 'optimizations' in result;
}

export function isSecurityResult(result: AIAnalysisResult): result is SecurityResult {
  return 'riskLevel' in result;
}

export function isAccessibilityResult(result: AIAnalysisResult): result is AccessibilityResult {
  return 'score' in result && 'wcagLevel' in result;
}
