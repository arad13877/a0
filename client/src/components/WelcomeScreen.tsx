import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, MessageSquare, Layout, Zap, X } from "lucide-react";

interface WelcomeScreenProps {
  open: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export default function WelcomeScreen({ open, onClose, onGetStarted }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);

  const features = [
    {
      icon: <MessageSquare className="w-12 h-12 text-blue-500" />,
      title: "Chat with AI",
      titleFa: "چت با هوش مصنوعی",
      description: "Talk to our AI assistant to generate code, fix bugs, and get coding help.",
      descriptionFa: "با دستیار هوش مصنوعی ما صحبت کنید تا کد بنویسید، باگ‌ها را برطرف کنید و کمک کدنویسی دریافت کنید.",
    },
    {
      icon: <Code className="w-12 h-12 text-green-500" />,
      title: "Code Editor",
      titleFa: "ادیتور کد",
      description: "Write and edit your code with syntax highlighting and auto-complete.",
      descriptionFa: "کدهای خود را با syntax highlighting و تکمیل خودکار بنویسید و ویرایش کنید.",
    },
    {
      icon: <Layout className="w-12 h-12 text-purple-500" />,
      title: "Live Preview",
      titleFa: "پیش‌نمایش زنده",
      description: "See your changes in real-time with our live preview panel.",
      descriptionFa: "تغییرات خود را به صورت زنده در پنل پیش‌نمایش مشاهده کنید.",
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      title: "Quick Actions",
      titleFa: "اقدامات سریع",
      description: "Use keyboard shortcuts (Ctrl+K) for quick access to all features.",
      descriptionFa: "از کلیدهای میانبر (Ctrl+K) برای دسترسی سریع به تمام قابلیت‌ها استفاده کنید.",
    },
  ];

  const quickTips = [
    {
      shortcut: "Ctrl+/",
      action: "Toggle Chat View",
      actionFa: "چت را نمایش/مخفی کن",
    },
    {
      shortcut: "Ctrl+B",
      action: "Toggle Editor View",
      actionFa: "ادیتور را نمایش/مخفی کن",
    },
    {
      shortcut: "Ctrl+F",
      action: "Search in Files",
      actionFa: "جستجو در فایل‌ها",
    },
    {
      shortcut: "Ctrl+K",
      action: "Command Palette",
      actionFa: "پنل دستورات",
    },
    {
      shortcut: "Ctrl+S",
      action: "Save All Files",
      actionFa: "ذخیره همه فایل‌ها",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Welcome to AI Code Generator</DialogTitle>
          <DialogDescription>
            Your intelligent coding assistant powered by AI - Learn about features and keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          data-testid="button-close-welcome"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="glass-card p-4 rounded-full">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome to AI Code Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-1">
              به ژنراتور کد هوش مصنوعی خوش آمدید
            </p>
            <p className="text-sm text-muted-foreground">
              Your intelligent coding assistant powered by AI
            </p>
          </div>

          {step === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-xl hover:scale-105 transition-transform"
                    data-testid={`feature-card-${index}`}
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 text-right" dir="rtl">
                      {feature.titleFa}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 text-right" dir="rtl">
                      {feature.descriptionFa}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setStep(1)}
                  size="lg"
                  data-testid="button-next-step"
                >
                  Quick Tips →
                </Button>
                <Button
                  onClick={onGetStarted}
                  variant="outline"
                  size="lg"
                  data-testid="button-skip-welcome"
                >
                  Skip & Start
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Keyboard Shortcuts</h2>
                <p className="text-sm text-muted-foreground" dir="rtl">
                  کلیدهای میانبر
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-3">
                {quickTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    data-testid={`shortcut-item-${index}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-background border border-border rounded shadow-sm min-w-[80px] text-center">
                        {tip.shortcut}
                      </kbd>
                      <span className="text-sm">{tip.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground" dir="rtl">
                      {tip.actionFa}
                    </span>
                  </div>
                ))}
              </div>

              <div className="glass-card p-6 rounded-xl bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Pro Tip
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Press <kbd className="px-2 py-1 text-xs bg-background border rounded">Ctrl+K</kbd> anytime to open the command palette and access all features quickly!
                </p>
                <p className="text-xs text-muted-foreground text-right" dir="rtl">
                  برای دسترسی سریع به تمام قابلیت‌ها، هر زمان <kbd className="px-2 py-1 text-xs bg-background border rounded">Ctrl+K</kbd> را فشار دهید!
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setStep(0)}
                  variant="outline"
                  size="lg"
                  data-testid="button-back-step"
                >
                  ← Back
                </Button>
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  data-testid="button-get-started"
                >
                  Get Started 🚀
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
