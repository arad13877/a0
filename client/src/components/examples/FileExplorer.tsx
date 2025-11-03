import FileExplorer from "../FileExplorer";
import { useState } from "react";

const mockFiles = [
  {
    id: "src",
    name: "src",
    type: "folder" as const,
    children: [
      {
        id: "app",
        name: "App.tsx",
        type: "file" as const,
      },
      {
        id: "components",
        name: "components",
        type: "folder" as const,
        children: [
          { id: "header", name: "Header.tsx", type: "file" as const },
          { id: "footer", name: "Footer.tsx", type: "file" as const },
        ],
      },
    ],
  },
  {
    id: "public",
    name: "public",
    type: "folder" as const,
    children: [{ id: "index", name: "index.html", type: "file" as const }],
  },
];

export default function FileExplorerExample() {
  const [selected, setSelected] = useState("app");

  return (
    <div className="h-[600px]">
      <FileExplorer
        files={mockFiles}
        selectedFile={selected}
        onFileSelect={setSelected}
        onNewFile={() => console.log("New file")}
        onNewFolder={() => console.log("New folder")}
      />
    </div>
  );
}
