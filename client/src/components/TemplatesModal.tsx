import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Newspaper, LayoutDashboard, FileText, Sparkles } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

interface TemplatesModalProps {
  open?: boolean;
  onClose?: () => void;
  onSelectTemplate?: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: "ecommerce",
    name: "E-commerce Store",
    description: "Complete online store with product listings, cart, and checkout",
    icon: <ShoppingCart className="w-8 h-8" />,
    tags: ["React", "Tailwind", "Node.js"],
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "Modern landing page with hero, features, and CTA sections",
    icon: <Sparkles className="w-8 h-8" />,
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    id: "news",
    name: "News/Blog Site",
    description: "Article-based website with categories and search",
    icon: <Newspaper className="w-8 h-8" />,
    tags: ["React", "MongoDB", "Tailwind"],
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Analytics dashboard with charts and data tables",
    icon: <LayoutDashboard className="w-8 h-8" />,
    tags: ["React", "Tailwind", "Charts"],
  },
  {
    id: "blank",
    name: "Blank Project",
    description: "Start from scratch with a basic React + Tailwind setup",
    icon: <FileText className="w-8 h-8" />,
    tags: ["React", "Tailwind"],
  },
];

export default function TemplatesModal({
  open = false,
  onClose,
  onSelectTemplate,
}: TemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="templates-title">Choose a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => {
                onSelectTemplate?.(template.id);
                onClose?.();
              }}
              data-testid={`template-${template.id}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {template.icon}
                </div>
                <h3 className="font-semibold text-base flex-1">{template.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
