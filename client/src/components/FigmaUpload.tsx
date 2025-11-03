import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FigmaUploadProps {
  onAnalyze?: (images: File[]) => void;
}

export default function FigmaUpload({ onAnalyze }: FigmaUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages((prev) => [...prev, ...files]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (images.length > 0) {
      onAnalyze?.(images);
      console.log("Analyzing", images.length, "designs");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        data-testid="dropzone"
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2" data-testid="upload-title">
          Upload Figma Designs
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your design screenshots or click to browse
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          data-testid="input-file"
        />
        <label htmlFor="file-upload">
          <Button asChild variant="outline" data-testid="button-browse">
            <span>Browse Files</span>
          </Button>
        </label>
      </div>

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group" data-testid={`image-preview-${index}`}>
                <div className="aspect-video bg-muted rounded-lg border flex items-center justify-center overflow-hidden">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  data-testid={`button-remove-${index}`}
                >
                  <X className="w-3 h-3" />
                </Button>
                <p className="text-xs font-mono mt-1 truncate">{image.name}</p>
              </div>
            ))}
          </div>
          <Button onClick={handleAnalyze} className="w-full" data-testid="button-analyze">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Designs & Generate Code
          </Button>
        </>
      )}
    </div>
  );
}
