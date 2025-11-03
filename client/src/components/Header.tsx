import { Code2, Settings, Download, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  projectName?: string;
  onNewProject?: () => void;
  onSettings?: () => void;
  onDownload?: () => void;
}

export default function Header({
  projectName = "Untitled Project",
  onNewProject,
  onSettings,
  onDownload,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    console.log("Theme toggled:", !isDark ? "dark" : "light");
  };

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" data-testid="logo-icon" />
          <span className="text-lg font-bold" data-testid="brand-name">
            AI Code Agent
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm font-mono text-muted-foreground truncate max-w-xs" data-testid="project-name">
          {projectName}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={onDownload}
          data-testid="button-download"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onSettings}
          data-testid="button-settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
