import ChatInterface from "../ChatInterface";
import { useState } from "react";

const mockMessages = [
  {
    id: "1",
    role: "user" as const,
    content: "Create a landing page for a SaaS product with a hero section",
  },
  {
    id: "2",
    role: "assistant" as const,
    content:
      "I'll create a modern landing page with a hero section. The page will include a compelling headline, description, CTA buttons, and a feature showcase using Tailwind CSS and React components.",
  },
  {
    id: "3",
    role: "user" as const,
    content: "Make it responsive and add a pricing section",
  },
];

export default function ChatInterfaceExample() {
  const [messages, setMessages] = useState(mockMessages);
  const [loading, setLoading] = useState(false);

  const handleSend = (message: string) => {
    setMessages([...messages, { id: Date.now().toString(), role: "user", content: message }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've updated the landing page to be fully responsive and added a pricing section with three tiers.",
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[600px]">
      <ChatInterface messages={messages} onSendMessage={handleSend} isLoading={loading} />
    </div>
  );
}
