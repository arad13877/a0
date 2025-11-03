import { useState, useEffect, useMemo } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

type DeviceType = "desktop" | "tablet" | "mobile";

export default function PreviewPanel({ files = [], onClose }: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [key, setKey] = useState(0);

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
  }, [previewHTML]);

  const refresh = () => setKey((k) => k + 1);

  return (
    <div className="flex flex-col h-full border-l bg-background">
      <div className="h-10 border-b flex items-center justify-between px-3">
        <span className="text-sm font-medium" data-testid="preview-header">
          Preview
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className={`w-7 h-7 ${device === "desktop" ? "bg-accent" : ""}`}
            onClick={() => setDevice("desktop")}
            data-testid="button-device-desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-7 h-7 ${device === "tablet" ? "bg-accent" : ""}`}
            onClick={() => setDevice("tablet")}
            data-testid="button-device-tablet"
          >
            <Tablet className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`w-7 h-7 ${device === "mobile" ? "bg-accent" : ""}`}
            onClick={() => setDevice("mobile")}
            data-testid="button-device-mobile"
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
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            data-testid="button-external"
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
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted p-4">
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
      </div>
    </div>
  );
}
