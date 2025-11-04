import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Code } from "lucide-react";
import type { File as ProjectFile } from "@shared/schema";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  files: ProjectFile[];
  onFileSelect: (fileId: number) => void;
}

interface SearchResult {
  file: ProjectFile;
  matches: {
    line: number;
    text: string;
    matchIndex: number;
  }[];
}

export default function SearchDialog({ open, onClose, files, onFileSelect }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    files.forEach((file) => {
      const lines = file.content.split('\n');
      const matches: SearchResult['matches'] = [];

      lines.forEach((line, index) => {
        const lowerLine = line.toLowerCase();
        const matchIndex = lowerLine.indexOf(query);
        
        if (matchIndex !== -1) {
          matches.push({
            line: index + 1,
            text: line.trim(),
            matchIndex,
          });
        }
      });

      if (matches.length > 0) {
        results.push({ file, matches });
      }
    });

    return results;
  }, [searchQuery, files]);

  const handleResultClick = (fileId: number) => {
    onFileSelect(fileId);
    onClose();
  };

  const totalMatches = searchResults.reduce((acc, result) => acc + result.matches.length, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            جستجو در فایل‌ها
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-search-query"
              placeholder="جستجو در کدها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchQuery && (
            <div className="text-sm text-muted-foreground" data-testid="text-search-stats">
              {totalMatches} نتیجه در {searchResults.length} فایل
            </div>
          )}

          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-results">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>نتیجه‌ای پیدا نشد</p>
                </div>
              ) : searchQuery === "" ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>چیزی را جستجو کنید...</p>
                </div>
              ) : (
                searchResults.map((result) => (
                  <div
                    key={result.file.id}
                    data-testid={`search-result-${result.file.id}`}
                    className="glass-card rounded-lg p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handleResultClick(result.file.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        <span className="font-medium">{result.file.name}</span>
                      </div>
                      <Badge variant="secondary" data-testid={`badge-matches-${result.file.id}`}>
                        {result.matches.length} مورد
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground mb-2">
                      {result.file.path}
                    </div>

                    <div className="space-y-1">
                      {result.matches.slice(0, 3).map((match, idx) => (
                        <div
                          key={idx}
                          className="text-sm font-mono bg-muted/50 rounded px-2 py-1 overflow-x-auto"
                          data-testid={`match-line-${result.file.id}-${idx}`}
                        >
                          <span className="text-muted-foreground mr-2">
                            {match.line}:
                          </span>
                          <span className="text-foreground">
                            {match.text.substring(0, match.matchIndex)}
                            <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100">
                              {match.text.substring(
                                match.matchIndex,
                                match.matchIndex + searchQuery.length
                              )}
                            </span>
                            {match.text.substring(match.matchIndex + searchQuery.length)}
                          </span>
                        </div>
                      ))}
                      {result.matches.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          و {result.matches.length - 3} مورد دیگر...
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
