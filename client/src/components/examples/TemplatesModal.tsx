import TemplatesModal from "../TemplatesModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TemplatesModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)} data-testid="button-open-templates">
        Open Templates
      </Button>
      <TemplatesModal
        open={open}
        onClose={() => setOpen(false)}
        onSelectTemplate={(id) => console.log("Selected template:", id)}
      />
    </div>
  );
}
