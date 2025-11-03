import CodeEditor from "../CodeEditor";
import { useState } from "react";

const mockTabs = [
  {
    id: "app",
    name: "App.tsx",
    content: `import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default App;`,
  },
  {
    id: "header",
    name: "Header.tsx",
    content: `export default function Header() {
  return (
    <header className="bg-white shadow">
      <h1>My App</h1>
    </header>
  );
}`,
  },
];

export default function CodeEditorExample() {
  const [tabs, setTabs] = useState(mockTabs);
  const [activeTab, setActiveTab] = useState("app");

  const handleClose = (tabId: string) => {
    setTabs(tabs.filter((t) => t.id !== tabId));
    if (activeTab === tabId && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  };

  return (
    <div className="h-[600px]">
      <CodeEditor
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClose={handleClose}
      />
    </div>
  );
}
