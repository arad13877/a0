import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { History, RotateCcw, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FileVersion } from "@shared/schema";

interface VersionHistoryProps {
  fileId: number;
  currentContent: string;
}

export default function VersionHistory({ fileId, currentContent }: VersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: versions = [] } = useQuery<FileVersion[]>({
    queryKey: ["/api/files", fileId, "versions"],
    enabled: open && !!fileId,
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const res = await apiRequest("POST", `/api/files/${fileId}/restore/${versionId}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Version restored",
        description: "File has been restored to the selected version",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restore version",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          data-testid="button-version-history"
        >
          <History className="w-4 h-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" data-testid="dialog-version-history">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            <div className="p-3 border rounded-lg bg-muted/50" data-testid="version-current">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Current Version</span>
                </div>
                <span className="text-xs text-muted-foreground">Latest</span>
              </div>
              <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-32">
                {currentContent.substring(0, 200)}
                {currentContent.length > 200 && '...'}
              </pre>
            </div>

            {versions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No version history yet</p>
                <p className="text-xs mt-1">Previous versions will appear here when you edit the file</p>
              </div>
            )}

            {versions.map((version, index) => (
              <div
                key={version.id}
                className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                data-testid={`version-${version.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Version {version.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreMutation.mutate(version.id)}
                      disabled={restoreMutation.isPending}
                      className="h-7 gap-1"
                      data-testid={`button-restore-${version.id}`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </Button>
                  </div>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {version.content.substring(0, 200)}
                  {version.content.length > 200 && '...'}
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
