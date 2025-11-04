import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import FileExplorer from "@/components/FileExplorer";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import TemplatesModal from "@/components/TemplatesModal";
import FigmaUpload from "@/components/FigmaUpload";
import { Button } from "@/components/ui/button";
import { MessageSquare, Code, Image, PanelRightClose, PanelRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Project, File as ProjectFile, Message } from "@shared/schema";
import { exportProjectAsZip } from "@/utils/export";

type ViewMode = "chat" | "editor" | "figma";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

export default function Home() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("chat");
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !currentProject,
  });

  const { data: files = [] } = useQuery<ProjectFile[]>({
    queryKey: ["/api/projects", currentProject?.id, "files"],
    enabled: !!currentProject,
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/projects", currentProject?.id, "messages"],
    enabled: !!currentProject,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; template?: string }) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return await res.json();
    },
    onSuccess: (project) => {
      setCurrentProject(project);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", {
        projectId: currentProject?.id,
        message,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", currentProject?.id, "messages"],
      });
    },
  });

  const generateCodeMutation = useMutation({
    mutationFn: async (data: { prompt: string; context?: any }) => {
      const res = await apiRequest("POST", "/api/generate-code", {
        projectId: currentProject?.id,
        ...data,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", currentProject?.id, "files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", currentProject?.id, "messages"],
      });
      setViewMode("editor");
    },
  });

  const updateFileMutation = useMutation({
    mutationFn: async ({ fileId, content }: { fileId: number; content: string }) => {
      const res = await apiRequest("PATCH", `/api/files/${fileId}`, { content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", currentProject?.id, "files"],
      });
    },
  });

  useEffect(() => {
    if (!currentProject && projects && projects.length === 0) {
      createProjectMutation.mutate({ name: "my-project" });
    } else if (!currentProject && projects && projects.length > 0) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject]);

  useEffect(() => {
    if (files.length > 0 && !activeTab) {
      setActiveTab(files[0].id);
    }
  }, [files, activeTab]);

  const buildFileTree = (projectFiles: ProjectFile[]): FileNode[] => {
    const pathMap = new Map<string, FileNode>();
    const roots: FileNode[] = [];

    projectFiles.forEach((file) => {
      const parts = file.path.split("/").filter(Boolean);
      let currentPath = "";

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!pathMap.has(currentPath)) {
          const node: FileNode = {
            id: isLast ? file.id.toString() : currentPath,
            name: part,
            type: isLast ? "file" : "folder",
            children: isLast ? undefined : [],
          };

          pathMap.set(currentPath, node);

          if (index === 0) {
            roots.push(node);
          } else {
            const parentPath = parts.slice(0, index).join("/");
            const parent = pathMap.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(node);
            }
          }
        }
      });
    });

    return roots;
  };

  const fileTree = buildFileTree(files);

  const editorTabs = files.map((file) => ({
    id: file.id.toString(),
    name: file.name,
    content: file.content,
    fileId: file.id,
  }));

  const chatMessages = messages.map((msg) => ({
    id: msg.id.toString(),
    role: msg.role as "user" | "assistant",
    content: msg.content,
    metadata: msg.metadata,
  }));

  const handleSendMessage = async (message: string) => {
    if (message.toLowerCase().includes("create") || message.toLowerCase().includes("build")) {
      await generateCodeMutation.mutateAsync({ prompt: message });
    } else {
      await sendMessageMutation.mutateAsync(message);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    createProjectMutation.mutate({
      name: `${templateId}-project`,
      template: templateId,
    });
  };

  const handleContentChange = (tabId: string, content: string) => {
    const fileId = parseInt(tabId);
    updateFileMutation.mutate({ fileId, content });
  };

  const handleDownload = async () => {
    if (!currentProject) return;
    
    try {
      await exportProjectAsZip(files, currentProject.name);
    } catch (error) {
      console.error('Failed to export project:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        projectName={currentProject?.name || "Untitled Project"}
        projectId={currentProject?.id}
        onNewProject={() => setShowTemplates(true)}
        onSettings={() => console.log("Settings")}
        onDownload={handleDownload}
      />

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        <div className="glass-sidebar rounded-2xl overflow-hidden">
          <FileExplorer
            files={fileTree}
            selectedFile={selectedFile?.toString()}
            onFileSelect={(id) => {
              const fileId = parseInt(id);
              setSelectedFile(fileId);
              setActiveTab(fileId);
              setViewMode("editor");
            }}
            onNewFile={() => console.log("New file")}
            onNewFolder={() => console.log("New folder")}
          />
        </div>

        <div className="flex-1 flex flex-col glass-float rounded-2xl overflow-hidden">
          <div className="glass-nav h-12 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("chat")}
                data-testid="button-view-chat"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "chat"
                    ? "glass-card text-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => setViewMode("editor")}
                data-testid="button-view-editor"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "editor"
                    ? "glass-card text-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Editor
              </button>
              <button
                onClick={() => setViewMode("figma")}
                data-testid="button-view-figma"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "figma"
                    ? "glass-card text-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Image className="w-4 h-4 inline mr-2" />
                Figma Import
              </button>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              data-testid="button-toggle-preview"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              {showPreview ? (
                <>
                  <PanelRightClose className="w-4 h-4 inline mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <PanelRight className="w-4 h-4 inline mr-2" />
                  Show Preview
                </>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {viewMode === "chat" && (
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending || generateCodeMutation.isPending}
              />
            )}
            {viewMode === "editor" && (
              <CodeEditor
                tabs={editorTabs}
                activeTab={activeTab?.toString()}
                onTabChange={(id) => setActiveTab(parseInt(id))}
                onTabClose={() => console.log("Close tab")}
                onContentChange={handleContentChange}
              />
            )}
            {viewMode === "figma" && (
              <FigmaUpload
                onAnalyze={(images) => {
                  console.log("Analyzing", images.length, "designs");
                  setViewMode("chat");
                }}
              />
            )}
          </div>
        </div>

        {showPreview && (
          <div className="w-1/2 glass-float rounded-2xl overflow-hidden">
            <PreviewPanel files={files} onClose={() => setShowPreview(false)} />
          </div>
        )}
      </div>

      <TemplatesModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}
