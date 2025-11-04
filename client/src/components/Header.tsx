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
    <header className="h-16 glass-nav flex items-center justify-between px-6 gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-float flex items-center justify-center">
            <Code2 className="w-5 h-5 text-gray-800 dark:text-white drop-shadow-lg" data-testid="logo-icon" />
          </div>
          <span className="text-xl font-bold drop-shadow-md gradient-text" data-testid="brand-name">
            AI Code Agent
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="glass-card px-4 py-2 rounded-full">
          <div className="text-sm font-mono text-gray-800 dark:text-white truncate max-w-xs" data-testid="project-name">
            {projectName}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDownload}
          data-testid="button-download"
          className="glass-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-800 dark:text-white transition-all"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="glass-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-800 dark:text-white transition-all"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={onSettings}
          data-testid="button-settings"
          className="glass-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-800 dark:text-white transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
