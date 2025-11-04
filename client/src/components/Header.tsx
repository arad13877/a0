import { Code2, Settings, Download, Sun, Moon, ImagePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ProjectAnalysis } from "@shared/schema";

interface HeaderProps {
  projectName?: string;
  projectId?: number;
  onNewProject?: () => void;
  onSettings?: () => void;
  onDownload?: () => void;
}

export default function Header({
  projectName = "Untitled Project",
  projectId,
  onNewProject,
  onSettings,
  onDownload,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    console.log("Theme toggled:", !isDark ? "dark" : "light");
  };

  const handleBackgroundUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطا",
        description: "لطفاً یک فایل تصویری انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل باید کمتر از 5 مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      localStorage.setItem('customBackground', result);
      document.body.style.backgroundImage = `url(${result})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      
      toast({
        title: "موفق",
        description: "پس‌زمینه با موفقیت تنظیم شد",
      });
    };
    reader.readAsDataURL(file);
  };

  const resetBackground = () => {
    localStorage.removeItem('customBackground');
    document.body.style.backgroundImage = '';
    toast({
      title: "بازیابی",
      description: "پس‌زمینه به حالت پیش‌فرض برگشت",
    });
  };

  const handleAnalyzeProject = async () => {
    if (!projectId) {
      toast({
        title: "خطا",
        description: "هیچ پروژه‌ای انتخاب نشده است",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }

      const data = await response.json();
      setAnalysis(data);
      setShowAnalysis(true);
      
      toast({
        title: "موفق",
        description: "آنالیز پروژه با موفقیت انجام شد",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "خطا",
        description: "خطا در آنالیز پروژه",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          data-testid="input-background"
        />
        <button
          onClick={handleAnalyzeProject}
          data-testid="button-analyze"
          disabled={isAnalyzing}
          className="glass-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-800 dark:text-white transition-all disabled:opacity-50"
          title="آنالیز پروژه"
        >
          <Search className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={handleBackgroundUpload}
          data-testid="button-background-upload"
          className="glass-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-800 dark:text-white transition-all"
          title="تنظیم پس‌زمینه"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
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

      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              📊 تحلیل پروژه
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              نتایج آنالیز خودکار پروژه شما
            </DialogDescription>
          </DialogHeader>

          {analysis && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Framework
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white" data-testid="text-framework">
                    {analysis.framework}
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    زبان برنامه‌نویسی
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white" data-testid="text-language">
                    {analysis.language}
                  </div>
                </div>
              </div>

              {analysis.styling.length > 0 && (
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    🎨 سیستم استایل
                  </div>
                  <div className="flex flex-wrap gap-2" data-testid="list-styling">
                    {analysis.styling.map((style, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.libraries.length > 0 && (
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    📚 کتابخانه‌ها
                  </div>
                  <div className="flex flex-wrap gap-2" data-testid="list-libraries">
                    {analysis.libraries.map((lib, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                      >
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card p-4 rounded-xl space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ⚙️ Pattern های شناسایی شده
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">سبک کامپوننت:</span>
                    <span className="font-medium text-gray-800 dark:text-white" data-testid="text-component-style">
                      {analysis.patterns.componentStyle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">مدیریت State:</span>
                    <span className="font-medium text-gray-800 dark:text-white" data-testid="text-state-management">
                      {analysis.patterns.stateManagement}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Routing:</span>
                    <span className="font-medium text-gray-800 dark:text-white" data-testid="text-routing">
                      {analysis.patterns.routing}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  📁 ساختار فایل
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">تعداد فایل‌ها:</span>
                    <span className="font-medium text-gray-800 dark:text-white" data-testid="text-total-files">
                      {analysis.fileStructure.totalFiles}
                    </span>
                  </div>
                  {analysis.fileStructure.directories.length > 0 && (
                    <div className="mt-2">
                      <div className="text-gray-600 dark:text-gray-400 mb-1">پوشه‌ها:</div>
                      <div className="flex flex-wrap gap-2" data-testid="list-directories">
                        {analysis.fileStructure.directories.slice(0, 5).map((dir, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                          >
                            {dir}
                          </span>
                        ))}
                        {analysis.fileStructure.directories.length > 5 && (
                          <span className="text-gray-500 text-xs">
                            +{analysis.fileStructure.directories.length - 5} مورد دیگر
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {analysis.recommendations.length > 0 && (
                <div className="glass-card p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="text-sm text-green-800 dark:text-green-300 font-medium mb-2">
                    💡 پیشنهادات
                  </div>
                  <ul className="space-y-2" data-testid="list-recommendations">
                    {analysis.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2"
                      >
                        <span className="mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
