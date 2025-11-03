import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface FileExplorerProps {
  files?: FileNode[];
  selectedFile?: string;
  onFileSelect?: (fileId: string) => void;
  onNewFile?: () => void;
  onNewFolder?: () => void;
}

function FileTreeItem({
  node,
  level = 0,
  selectedFile,
  onFileSelect,
}: {
  node: FileNode;
  level?: number;
  selectedFile?: string;
  onFileSelect?: (fileId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const isSelected = selectedFile === node.id;

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect?.(node.id);
    }
  };

  return (
    <div>
      <div
        className={`h-7 flex items-center gap-2 px-2 hover-elevate active-elevate-2 cursor-pointer rounded-md ${
          isSelected ? "bg-accent" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        data-testid={`file-item-${node.id}`}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )}
          </>
        ) : (
          <>
            <div className="w-4" />
            <FileCode className="w-4 h-4 text-muted-foreground" />
          </>
        )}
        <span className="text-sm font-mono truncate">{node.name}</span>
      </div>
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({
  files = [],
  selectedFile,
  onFileSelect,
  onNewFile,
  onNewFolder,
}: FileExplorerProps) {
  return (
    <div className="w-64 min-w-[240px] border-r bg-sidebar flex flex-col h-full">
      <div className="h-10 border-b flex items-center justify-between px-3">
        <span className="text-sm font-medium" data-testid="files-header">
          Files
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            onClick={onNewFile}
            data-testid="button-new-file"
          >
            <File className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            onClick={onNewFolder}
            data-testid="button-new-folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((node) => (
          <FileTreeItem
            key={node.id}
            node={node}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}
