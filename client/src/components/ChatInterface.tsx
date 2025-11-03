import { useState } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInterface({
  messages = [],
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage?.(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2" data-testid="empty-state-title">
              Start a conversation
            </h3>
            <p className="text-sm text-muted-foreground max-w-md" data-testid="empty-state-description">
              Ask me to create components, pages, or entire applications. I
              specialize in React, Next.js, Tailwind, and modern web
              development.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 max-w-3xl ${
                message.role === "user" ? "ml-auto" : "mr-auto"
              }`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={`flex-1 px-4 py-2.5 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-vazirmatn">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 px-4 py-2.5 rounded-2xl bg-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to create something..."
            className="min-h-[120px] pr-12 resize-none font-vazirmatn"
            data-testid="input-chat"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute bottom-3 right-3"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
