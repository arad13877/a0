import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Bug,
  Shield,
  Zap,
  RefreshCw,
  FileText,
  Eye,
  Accessibility,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AIAnalysisResult } from "@shared/ai-schemas";

interface AIAssistantPanelProps {
  fileId: number | null;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
}

type AnalysisType =
  | "review"
  | "explain"
  | "refactor"
  | "bugs"
  | "document"
  | "performance"
  | "security"
  | "accessibility";

const analysisOptions = [
  {
    type: "review" as AnalysisType,
    label: "Code Review",
    icon: Eye,
    description: "Get detailed feedback on code quality",
    color: "text-blue-500",
  },
  {
    type: "explain" as AnalysisType,
    label: "Explain Code",
    icon: BookOpen,
    description: "Understand what this code does",
    color: "text-purple-500",
  },
  {
    type: "refactor" as AnalysisType,
    label: "Refactoring",
    icon: RefreshCw,
    description: "Get suggestions to improve code",
    color: "text-green-500",
  },
  {
    type: "bugs" as AnalysisType,
    label: "Bug Detection",
    icon: Bug,
    description: "Find potential bugs and issues",
    color: "text-red-500",
  },
  {
    type: "document" as AnalysisType,
    label: "Documentation",
    icon: FileText,
    description: "Generate comprehensive docs",
    color: "text-yellow-500",
  },
  {
    type: "performance" as AnalysisType,
    label: "Performance",
    icon: Zap,
    description: "Analyze performance issues",
    color: "text-orange-500",
  },
  {
    type: "security" as AnalysisType,
    label: "Security Scan",
    icon: Shield,
    description: "Check for vulnerabilities",
    color: "text-pink-500",
  },
  {
    type: "accessibility" as AnalysisType,
    label: "Accessibility",
    icon: Accessibility,
    description: "Check WCAG compliance",
    color: "text-cyan-500",
  },
];

export default function AIAssistantPanel({
  fileId,
  fileName,
  isOpen,
  onClose,
}: AIAssistantPanelProps) {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisType | null>(null);
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (type: AnalysisType) => {
      if (!fileId) throw new Error("No file selected");
      const res = await apiRequest("POST", `/api/files/${fileId}/ai/${type}`, {});
      return await res.json();
    },
    onSuccess: (data, type) => {
      setAnalysisResult(data.result || data);
      setCurrentAnalysis(type);
      toast({
        title: "Analysis Complete",
        description: `${analysisOptions.find((o) => o.type === type)?.label} finished successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code",
        variant: "destructive",
      });
    },
  });

  const handleAnalysis = (type: AnalysisType) => {
    setAnalysisResult(null);
    setCurrentAnalysis(null);
    analysisMutation.mutate(type);
  };

  const renderResult = () => {
    if (!analysisResult || !currentAnalysis) return null;

    switch (currentAnalysis) {
      case "review":
        return (
          <div className="space-y-4" data-testid="result-review">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Code Quality Rating</h3>
              <Badge variant={analysisResult.overallRating >= 7 ? "default" : "destructive"}>
                {analysisResult.overallRating}/10
              </Badge>
            </div>
            <p className="text-muted-foreground">{analysisResult.summary}</p>
            
            {analysisResult.issues?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Issues Found</h4>
                <div className="space-y-2">
                  {analysisResult.issues.map((issue: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border bg-card"
                      data-testid={`issue-${i}`}
                    >
                      <div className="flex items-start gap-2">
                        {issue.severity === "critical" && (
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        )}
                        {issue.severity === "warning" && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        )}
                        {issue.severity === "info" && (
                          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {issue.category}
                            </Badge>
                            {issue.line && (
                              <span className="text-xs text-muted-foreground">
                                Line {issue.line}
                              </span>
                            )}
                          </div>
                          <p className="text-sm mb-1">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-xs text-muted-foreground">
                              💡 {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.strengths?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Strengths
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.strengths.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.improvements?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.improvements.map((imp: string, i: number) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "explain":
        return (
          <div className="space-y-4" data-testid="result-explain">
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{analysisResult.summary}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Purpose</h4>
              <p className="text-sm text-muted-foreground">{analysisResult.purpose}</p>
            </div>

            {analysisResult.components?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Components</h4>
                <div className="space-y-2">
                  {analysisResult.components.map((comp: any, i: number) => (
                    <div key={i} className="p-2 rounded border bg-card" data-testid={`component-${i}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{comp.type}</Badge>
                        <span className="font-mono text-sm">{comp.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.keyFeatures?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.keyFeatures.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.usage && (
              <div>
                <h4 className="font-semibold mb-2">How to Use</h4>
                <p className="text-sm text-muted-foreground">{analysisResult.usage}</p>
              </div>
            )}
          </div>
        );

      case "refactor":
        return (
          <div className="space-y-4" data-testid="result-refactor">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Refactoring Suggestions</h3>
              <Badge>{analysisResult.priority} priority</Badge>
            </div>
            
            {analysisResult.suggestions?.map((sug: any, i: number) => (
              <div key={i} className="p-4 rounded-lg border bg-card" data-testid={`suggestion-${i}`}>
                <h4 className="font-semibold mb-2">{sug.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{sug.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold mb-1">Before:</p>
                    <pre className="p-2 rounded bg-muted text-xs overflow-x-auto">
                      <code>{sug.before}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold mb-1">After:</p>
                    <pre className="p-2 rounded bg-muted text-xs overflow-x-auto">
                      <code>{sug.after}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">
                    <strong>Benefit:</strong> {sug.benefit}
                  </span>
                  <Badge variant="outline">{sug.effort} effort</Badge>
                </div>
              </div>
            ))}
          </div>
        );

      case "bugs":
        return (
          <div className="space-y-4" data-testid="result-bugs">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Bug Detection Results</h3>
              <Badge variant={analysisResult.bugsFound > 0 ? "destructive" : "default"}>
                {analysisResult.bugsFound} bugs found
              </Badge>
            </div>

            {analysisResult.bugs?.map((bug: any, i: number) => (
              <div
                key={i}
                className="p-4 rounded-lg border bg-card"
                data-testid={`bug-${i}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 ${
                      bug.severity === "critical"
                        ? "text-red-500"
                        : bug.severity === "major"
                        ? "text-orange-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{bug.type}</Badge>
                      <Badge variant="destructive">{bug.severity}</Badge>
                      {bug.line && (
                        <span className="text-xs text-muted-foreground">Line {bug.line}</span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{bug.description}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        <strong>Fix:</strong> {bug.fix}
                      </p>
                      <p>
                        <strong>Impact:</strong> {bug.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {analysisResult.potentialIssues?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Potential Issues</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.potentialIssues.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "document":
        return (
          <div className="space-y-4" data-testid="result-document">
            <h3 className="text-lg font-semibold">Generated Documentation</h3>
            <pre className="p-4 rounded-lg border bg-card text-xs overflow-x-auto">
              <code>{analysisResult.documentedCode || analysisResult}</code>
            </pre>
          </div>
        );

      case "performance":
        return (
          <div className="space-y-4" data-testid="result-performance">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Performance Score</h3>
              <Badge variant={analysisResult.score >= 75 ? "default" : "destructive"}>
                {analysisResult.score}/100
              </Badge>
            </div>

            {analysisResult.issues?.map((issue: any, i: number) => (
              <div key={i} className="p-4 rounded-lg border bg-card" data-testid={`perf-issue-${i}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{issue.category}</Badge>
                  <Badge variant={issue.severity === "high" ? "destructive" : "outline"}>
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{issue.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </p>
                  <p>
                    <strong>Impact:</strong> {issue.estimatedImpact}
                  </p>
                </div>
              </div>
            ))}

            {analysisResult.optimizations?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Quick Wins</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.optimizations.map((opt: string, i: number) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "security":
        return (
          <div className="space-y-4" data-testid="result-security">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Security Scan</h3>
              <Badge
                variant={
                  analysisResult.riskLevel === "critical" || analysisResult.riskLevel === "high"
                    ? "destructive"
                    : "default"
                }
              >
                {analysisResult.riskLevel} risk
              </Badge>
            </div>

            {analysisResult.vulnerabilities?.map((vuln: any, i: number) => (
              <div
                key={i}
                className="p-4 rounded-lg border bg-card"
                data-testid={`vulnerability-${i}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{vuln.type}</Badge>
                  <Badge
                    variant={
                      vuln.severity === "critical" || vuln.severity === "high"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {vuln.severity}
                  </Badge>
                  {vuln.cve && <Badge variant="secondary">{vuln.cve}</Badge>}
                </div>
                <p className="text-sm mb-2">{vuln.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Location:</strong> {vuln.location}
                  </p>
                  <p>
                    <strong>Fix:</strong> {vuln.fix}
                  </p>
                </div>
              </div>
            ))}

            {analysisResult.recommendations?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Security Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-4" data-testid="result-accessibility">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Accessibility Score</h3>
              <Badge variant={analysisResult.score >= 75 ? "default" : "destructive"}>
                {analysisResult.score}/100
              </Badge>
              <Badge variant="outline">{analysisResult.wcagLevel || "N/A"}</Badge>
            </div>

            {analysisResult.issues?.map((issue: any, i: number) => (
              <div key={i} className="p-4 rounded-lg border bg-card" data-testid={`a11y-issue-${i}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{issue.rule}</Badge>
                  <Badge
                    variant={
                      issue.impact === "critical" || issue.impact === "serious"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {issue.impact}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{issue.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {issue.element && (
                    <p>
                      <strong>Element:</strong> {issue.element}
                    </p>
                  )}
                  <p>
                    <strong>Fix:</strong> {issue.fix}
                  </p>
                </div>
              </div>
            ))}

            {analysisResult.passed?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Passed Checks
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analysisResult.passed.map((check: string, i: number) => (
                    <li key={i}>{check}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return (
          <pre className="p-4 rounded-lg border bg-card text-xs overflow-x-auto">
            <code>{JSON.stringify(analysisResult, null, 2)}</code>
          </pre>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" data-testid="ai-assistant-dialog">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription>
            Analyze your code with advanced AI features {fileName && `- ${fileName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-4">
          {analysisOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.type}
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                onClick={() => handleAnalysis(option.type)}
                disabled={!fileId || analysisMutation.isPending}
                data-testid={`button-${option.type}`}
              >
                <Icon className={`w-6 h-6 ${option.color}`} />
                <span className="text-xs font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>

        {analysisMutation.isPending && (
          <div className="flex items-center justify-center py-8" data-testid="loading-indicator">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Analyzing...</span>
          </div>
        )}

        {analysisResult && (
          <ScrollArea className="flex-1 pr-4">
            <div className="py-4">{renderResult()}</div>
          </ScrollArea>
        )}

        {!fileId && !analysisMutation.isPending && !analysisResult && (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a file to start analyzing</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
