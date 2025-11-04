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
            <div className="glass-card w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-gray-800 dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white" data-testid="empty-state-title">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-600 dark:text-white/70 max-w-md" data-testid="empty-state-description">
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
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-gray-800 dark:text-white" />
                </div>
              )}
              <div
                className={`flex-1 px-5 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "glass-heavy text-gray-800 dark:text-white"
                    : "glass-card text-gray-800 dark:text-white"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-800 dark:text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-gray-800 dark:text-white" />
            </div>
            <div className="flex-1 px-5 py-3 rounded-2xl glass-card">
              <Loader2 className="w-5 h-5 animate-spin text-gray-800 dark:text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="relative glass-card rounded-2xl overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to create something..."
            className="w-full min-h-[120px] px-4 py-3 bg-transparent text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 resize-none outline-none"
            data-testid="input-chat"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute bottom-3 right-3 glass-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
