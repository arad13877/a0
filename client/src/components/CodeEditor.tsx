import Editor from "@monaco-editor/react";
import { X, Save, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import VersionHistory from "./VersionHistory";

interface Tab {
  id: string;
  name: string;
  content: string;
  fileId?: number;
}

interface CodeEditorProps {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onContentChange?: (tabId: string, content: string) => void;
}

const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'json': 'json',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rs': 'rust',
  };
  return languageMap[extension] || 'typescript';
};

export default function CodeEditor({
  tabs = [],
  activeTab,
  onTabChange,
  onTabClose,
  onContentChange,
}: CodeEditorProps) {
  const activeTabData = tabs.find((t) => t.id === activeTab);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentContent, setCurrentContent] = useState(activeTabData?.content || "");
  const { toast } = useToast();

  useEffect(() => {
    setCurrentContent(activeTabData?.content || "");
    setHasUnsavedChanges(false);
  }, [activeTab, activeTabData?.content]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentContent(value);
      setHasUnsavedChanges(value !== activeTabData?.content);
    }
  };

  const handleSave = () => {
    if (activeTab && onContentChange) {
      onContentChange(activeTab, currentContent);
      setHasUnsavedChanges(false);
    }
  };

  const generateTestsMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const res = await apiRequest("POST", `/api/files/${fileId}/generate-tests`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Tests generated",
        description: "Test file has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate tests",
        variant: "destructive",
      });
    },
  });

  const canGenerateTests = activeTabData && 
    (activeTabData.name.endsWith('.tsx') || 
     activeTabData.name.endsWith('.jsx') || 
     activeTabData.name.endsWith('.ts') || 
     activeTabData.name.endsWith('.js')) &&
    !activeTabData.name.includes('.test.');

  const language = activeTabData ? getLanguageFromFileName(activeTabData.name) : 'typescript';

  return (
    <div className="flex flex-col h-full bg-background">
      {tabs.length > 0 ? (
        <>
          <div className="h-10 border-b flex items-center overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`h-full px-4 flex items-center gap-2 border-r cursor-pointer hover-elevate active-elevate-2 ${
                  activeTab === tab.id ? "bg-accent" : ""
                }`}
                onClick={() => onTabChange?.(tab.id)}
                data-testid={`tab-${tab.id}`}
              >
                <span className="text-sm font-mono">{tab.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-5 h-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose?.(tab.id);
                  }}
                  data-testid={`button-close-${tab.id}`}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={currentContent}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                fontFamily: "JetBrains Mono, Menlo, monospace",
              }}
            />
          </div>
          <div className="h-8 border-t px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground" data-testid="status-file">{activeTabData?.name || ""}</span>
              {activeTabData?.fileId && (
                <VersionHistory fileId={activeTabData.fileId} currentContent={currentContent} />
              )}
              {canGenerateTests && activeTabData?.fileId && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 gap-1"
                  onClick={() => generateTestsMutation.mutate(activeTabData.fileId!)}
                  disabled={generateTestsMutation.isPending}
                  data-testid="button-generate-tests"
                >
                  <FlaskConical className="w-3 h-3" />
                  Generate Tests
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground" data-testid="status-language">{language}</span>
              {hasUnsavedChanges && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 gap-1"
                  onClick={handleSave}
                  data-testid="button-save"
                >
                  <Save className="w-3 h-3" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground" data-testid="empty-editor">
            No files open
          </p>
        </div>
      )}
    </div>
  );
}
