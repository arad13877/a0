import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import FileExplorer from "@/components/FileExplorer";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import TemplatesModal from "@/components/TemplatesModal";
import FigmaUpload from "@/components/FigmaUpload";
import SearchDialog from "@/components/SearchDialog";
import { CommandPalette, useCommandPalette } from "@/components/CommandPalette";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Code, Image, PanelRightClose, PanelRight, Download, Play, FileText, Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Project, File as ProjectFile, Message } from "@shared/schema";
import { exportProjectAsZip } from "@/utils/export";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";

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
  const [showSearch, setShowSearch] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const { toast } = useToast();
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();

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

  const createFileMutation = useMutation({
    mutationFn: async (data: { name: string; path: string; type: string }) => {
      const res = await apiRequest("POST", "/api/files", {
        projectId: currentProject?.id,
        name: data.name,
        path: data.path,
        content: "",
        type: data.type,
      });
      return await res.json();
    },
    onSuccess: (newFile) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", currentProject?.id, "files"],
      });
      if (newFile.type === "file") {
        setActiveTab(newFile.id);
        setViewMode("editor");
      }
      toast({
        title: "Success",
        description: `${newFile.type === "folder" ? "Folder" : "File"} "${newFile.name}" created successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to create ${isCreatingFolder ? "folder" : "file"}`,
        variant: "destructive",
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
          const nodeType = isLast ? file.type : "folder";
          const node: FileNode = {
            id: isLast ? file.id.toString() : currentPath,
            name: part,
            type: nodeType as "file" | "folder",
            children: nodeType === "folder" ? [] : undefined,
          };

          pathMap.set(currentPath, node);

          if (index === 0) {
            roots.push(node);
          } else {
            const parentPath = parts.slice(0, index).join("/");
            const parent = pathMap.get(parentPath);
            if (parent && parent.children) {
              if (!parent.children.find(child => child.id === node.id)) {
                parent.children.push(node);
              }
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
      toast({
        title: "Success",
        description: "Project exported successfully",
      });
    } catch (error) {
      console.error('Failed to export project:', error);
      toast({
        title: "Error",
        description: "Failed to export project",
        variant: "destructive",
      });
    }
  };

  const handleSaveAll = () => {
    toast({
      title: "Saved",
      description: "All files saved successfully",
    });
  };

  const handleCreateFile = () => {
    if (!currentProject) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive",
      });
      return;
    }

    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: `${isCreatingFolder ? "Folder" : "File"} name cannot be empty`,
        variant: "destructive",
      });
      return;
    }

    const type = isCreatingFolder ? "folder" : "file";
    const path = `src/${newFileName}`;
    createFileMutation.mutate({ name: newFileName, path, type });
    setNewFileName("");
    setShowNewFileDialog(false);
    setIsCreatingFolder(false);
  };

  useKeyboardShortcuts([
    { key: '/', ctrl: true, action: () => setViewMode('chat') },
    { key: 's', ctrl: true, action: handleSaveAll },
    { key: 'p', ctrl: true, action: () => setShowPreview(!showPreview) },
    { key: 'b', ctrl: true, action: () => setViewMode('editor') },
    { key: 'e', ctrl: true, shift: true, action: handleDownload },
    { key: 'f', ctrl: true, action: () => setShowSearch(true) },
  ]);

  const commands = [
    {
      id: 'toggle-chat',
      label: 'Toggle Chat View',
      icon: MessageSquare,
      shortcut: 'Ctrl+/',
      action: () => setViewMode('chat'),
      keywords: ['chat', 'conversation', 'ai'],
    },
    {
      id: 'toggle-editor',
      label: 'Toggle Editor View',
      icon: Code,
      shortcut: 'Ctrl+B',
      action: () => setViewMode('editor'),
      keywords: ['editor', 'code', 'edit'],
    },
    {
      id: 'save-all',
      label: 'Save All Files',
      icon: FileText,
      shortcut: 'Ctrl+S',
      action: handleSaveAll,
      keywords: ['save', 'write', 'persist'],
    },
    {
      id: 'toggle-preview',
      label: 'Toggle Preview Panel',
      icon: Play,
      shortcut: 'Ctrl+P',
      action: () => setShowPreview(!showPreview),
      keywords: ['preview', 'show', 'hide'],
    },
    {
      id: 'export',
      label: 'Export Project',
      icon: Download,
      shortcut: 'Ctrl+Shift+E',
      action: handleDownload,
      keywords: ['export', 'download', 'zip'],
    },
    {
      id: 'new-project',
      label: 'New Project',
      icon: FileText,
      action: () => setShowTemplates(true),
      keywords: ['new', 'create', 'project'],
    },
    {
      id: 'find',
      label: 'Find in Files',
      icon: Search,
      shortcut: 'Ctrl+F',
      action: () => setShowSearch(true),
      keywords: ['search', 'find', 'grep'],
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        projectName={currentProject?.name || "Untitled Project"}
        projectId={currentProject?.id}
        onNewProject={() => setShowTemplates(true)}
        onSettings={() => console.log("Settings")}
        onDownload={handleDownload}
      />

      <div className="flex-1 flex overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
        <div className="hidden lg:block glass-sidebar rounded-2xl overflow-hidden">
          <FileExplorer
            files={fileTree}
            selectedFile={selectedFile?.toString()}
            onFileSelect={(id) => {
              const fileId = parseInt(id);
              setSelectedFile(fileId);
              setActiveTab(fileId);
              setViewMode("editor");
            }}
            onNewFile={() => {
              setIsCreatingFolder(false);
              setShowNewFileDialog(true);
            }}
            onNewFolder={() => {
              setIsCreatingFolder(true);
              setShowNewFileDialog(true);
            }}
          />
        </div>

        <div className="flex-1 flex flex-col glass-float rounded-xl md:rounded-2xl overflow-hidden">
          <div className="glass-nav h-12 flex items-center justify-between px-2 md:px-4">
            <div className="flex items-center gap-1 md:gap-2 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setViewMode("chat")}
                data-testid="button-view-chat"
                className={`px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  viewMode === "chat"
                    ? "glass-card text-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-1 md:mr-2" />
                <span className="hidden sm:inline">Chat</span>
              </button>
              <button
                onClick={() => setViewMode("editor")}
                data-testid="button-view-editor"
                className={`px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  viewMode === "editor"
                    ? "glass-card text-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Code className="w-4 h-4 inline mr-1 md:mr-2" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                onClick={() => setViewMode("figma")}
                data-testid="button-view-figma"
                className={`px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  viewMode === "figma"
                    ? "glass-card text-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Image className="w-4 h-4 inline mr-1 md:mr-2" />
                <span className="hidden sm:inline">Figma</span>
              </button>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              data-testid="button-toggle-preview"
              className="hidden md:flex px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              {showPreview ? (
                <>
                  <PanelRightClose className="w-4 h-4 inline mr-2" />
                  <span className="hidden lg:inline">Hide Preview</span>
                </>
              ) : (
                <>
                  <PanelRight className="w-4 h-4 inline mr-2" />
                  <span className="hidden lg:inline">Show Preview</span>
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
          <div className="hidden md:block md:w-1/2 glass-float rounded-2xl overflow-hidden">
            <PreviewPanel files={files} onClose={() => setShowPreview(false)} />
          </div>
        )}
      </div>

      <TemplatesModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        commands={commands}
      />

      <SearchDialog
        open={showSearch}
        onClose={() => setShowSearch(false)}
        files={files}
        onFileSelect={(fileId) => {
          setSelectedFile(fileId);
          setActiveTab(fileId);
          setViewMode("editor");
        }}
      />

      <Dialog open={showNewFileDialog} onOpenChange={(open) => {
        setShowNewFileDialog(open);
        if (!open) {
          setNewFileName("");
          setIsCreatingFolder(false);
        }
      }}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {isCreatingFolder ? "Create New Folder" : "Create New File"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fileName" className="text-gray-700 dark:text-gray-300">
                {isCreatingFolder ? "Folder Name" : "File Name"}
              </Label>
              <Input
                id="fileName"
                data-testid="input-file-name"
                placeholder={isCreatingFolder ? "e.g. components or utils" : "e.g. App.tsx or styles.css"}
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFile();
                  }
                }}
                className="glass-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewFileDialog(false);
                setNewFileName("");
                setIsCreatingFolder(false);
              }}
              data-testid="button-cancel-file"
              className="glass-button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFile}
              disabled={createFileMutation.isPending}
              data-testid="button-create-file"
              className="glass-button"
            >
              {createFileMutation.isPending ? "Creating..." : `Create ${isCreatingFolder ? "Folder" : "File"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
