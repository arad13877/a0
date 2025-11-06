import { useState, useEffect, useMemo } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, X, Camera, Terminal, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generatePreviewHTML } from "@/utils/preview";

interface FileData {
  id: number;
  name: string;
  path: string;
  content: string;
}

interface PreviewPanelProps {
  files?: FileData[];
  onClose?: () => void;
  url?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

export default function PreviewPanel({ files = [], onClose }: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [key, setKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<Array<{type: string; message: string; timestamp: number}>>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleLogs(prev => [...prev, {
          type: event.data.level,
          message: event.data.message,
          timestamp: Date.now()
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const previewHTML = useMemo(() => {
    if (files.length === 0) {
      return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Preview</title></head>
<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#666;">
  <div style="text-align:center;">
    <p style="font-size:1.2rem;">No files to preview</p>
    <p style="font-size:0.9rem;">Generate some code to see it here!</p>
  </div>
</body></html>`;
    }
    return generatePreviewHTML(files);
  }, [files]);

  useEffect(() => {
    setKey((k) => k + 1);
    setConsoleLogs([]);
  }, [previewHTML]);

  const refresh = () => {
    setKey((k) => k + 1);
    setConsoleLogs([]);
  };

  const takeScreenshot = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `screenshot-${timestamp}.png`;
    alert(`Screenshot feature coming soon! Will save as: ${screenshotName}`);
  };

  return (
    <div className="flex flex-col h-full border-l bg-background">
      <div className="h-10 border-b flex items-center justify-between px-3">
        <span className="text-sm font-medium" data-testid="preview-header">
          Preview & Testing
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className={`w-7 h-7 ${device === "desktop" ? "bg-accent" : ""}`}
            onClick={() => setDevice("desktop")}
            data-testid="button-device-desktop"
            title="Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-7 h-7 ${device === "tablet" ? "bg-accent" : ""}`}
            onClick={() => setDevice("tablet")}
            data-testid="button-device-tablet"
            title="Tablet view"
          >
            <Tablet className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-7 h-7 ${device === "mobile" ? "bg-accent" : ""}`}
            onClick={() => setDevice("mobile")}
            data-testid="button-device-mobile"
            title="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            onClick={refresh}
            data-testid="button-refresh"
            title="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            onClick={takeScreenshot}
            data-testid="button-screenshot"
            title="Take screenshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            data-testid="button-external"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
          {onClose && (
            <Button
              size="icon"
              variant="ghost"
              className="w-7 h-7"
              onClick={onClose}
              data-testid="button-close-preview"
              title="Close preview"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-2" data-testid="preview-tabs">
          <TabsTrigger value="preview" className="gap-1" data-testid="tab-preview">
            <Monitor className="w-3.5 h-3.5" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="console" className="gap-1" data-testid="tab-console">
            <Terminal className="w-3.5 h-3.5" />
            Console
            {consoleLogs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {consoleLogs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tests" className="gap-1" data-testid="tab-tests">
            <FlaskConical className="w-3.5 h-3.5" />
            Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 m-0 p-4 overflow-auto bg-muted" data-testid="content-preview">
          <div className="mx-auto transition-all duration-200" style={{ width: deviceWidths[device] }}>
            <div className="bg-background border rounded-md h-full min-h-[500px] flex items-center justify-center">
              <iframe
                key={key}
                srcDoc={previewHTML}
                className="w-full h-full rounded-md"
                title="Preview"
                sandbox="allow-scripts"
                data-testid="preview-iframe"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0" data-testid="content-console">
          <ScrollArea className="h-full p-4">
            <div className="space-y-1 font-mono text-sm">
              {consoleLogs.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">
                  <Terminal className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No console logs yet</p>
                  <p className="text-xs mt-1">Logs will appear here when your code runs</p>
                </div>
              ) : (
                consoleLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border-l-2 ${
                      log.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' :
                      log.type === 'warn' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-900 dark:text-yellow-200' :
                      'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    }`}
                    data-testid={`console-log-${i}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="flex-1 break-all">{log.message}</span>
                      <span className="text-xs opacity-50 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tests" className="flex-1 m-0" data-testid="content-tests">
          <ScrollArea className="h-full p-4">
            <div className="text-center py-8 text-muted-foreground">
              <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No tests available</p>
              <p className="text-xs mt-1">Generate tests for your components to see results here</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
