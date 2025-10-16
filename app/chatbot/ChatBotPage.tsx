"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  time?: string;
  usedRAG?: boolean;
  sourcesCount?: number;
}

// Helper to format AI text neatly
function formatBotText(text: string) {
  if (!text) return [];
  // Split by line breaks first
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => {
    // Detect markdown bullets (starts with * or -) or bold headings (**)
    if (line.startsWith("*")) {
      line = line.replace(/^\*\s*/, "• "); // replace * with bullet
    }
    line = line.replace(/\*\*/g, ""); // remove bold markers
    return line;
  });
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm DsaBot, your AI assistant for teaching and answering all your dsa questions. How can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    const saveChatToDB = async (sender: "user" | "bot", text: string) => {
      try {
        await fetch("/api/v1/save-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sender, text }),
        });
      } catch (err) {
        console.error("Failed to save chat:", err);
      }
    };

    try {
      const res = await fetch("/api/v1/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: input,
          history: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })),
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.answer || "Sorry, I couldn't find an answer.",
        usedRAG: data.usedRAG || false,
        sourcesCount: data.sourcesCount || 0,
      };

      if (data.fallback) {
        botMsg.text +=
          "\n\n💡 Note: I'm running in fallback mode due to AI service issues.";
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: `⚠️ Error: ${error.message || "Something went wrong."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-gray-700">
      <div className="flex-1 overflow-y-auto space-y-4 p-2 text-black dark:text-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" ? (
              <div className="bg-white dark:bg-gray-700 shadow p-3 rounded-lg max-w-[70%] text-sm border dark:border-gray-600">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-1">
                  <Bot size={14} /> DsaBot
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  {formatBotText(msg.text).map((line, idx) => (
                    <p key={idx} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-600 dark:bg-green-500 text-white p-3 rounded-lg max-w-[70%] text-sm">
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            DsaBot is typing...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Ask about dsa..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 text-black dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
