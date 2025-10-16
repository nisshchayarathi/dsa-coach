"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  time?: string;
}

interface Conversation {
  id: string;
  title: string;
}

interface ChatbotPageProps {
  selectedConversation: Conversation;
}

function formatBotText(text: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("*") ? "• " + line.slice(1) : line));
}

export default function ChatbotPage({
  selectedConversation,
}: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset and fetch messages whenever conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/v1/messages?conversationId=${selectedConversation.id}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(
            data.map((msg: any) => ({
              id: msg.id,
              sender: msg.sender,
              text: msg.text,
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          );
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveChatToDB = async (sender: "user" | "bot", text: string) => {
    try {
      await fetch("/api/v1/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sender,
          text,
          conversationId: selectedConversation.id,
        }),
      });
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return; // <-- prevent sending while loading

    // Capture input value and immediately set loading to prevent race conditions
    const userInput = input.trim();
    setLoading(true);
    setInput("");

    const newUserMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      await saveChatToDB("user", newUserMsg.text);

      const res = await fetch("/api/v1/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: userInput,
          conversationId: selectedConversation.id,
          history: updatedMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })),
        }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.answer || "Sorry, I couldn't find an answer.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // always reset loading
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 shadow p-4 border dark:border-gray-700">
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
                <div>
                  {formatBotText(msg.text).map((line, idx) => (
                    <p key={idx}>{line}</p>
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
          placeholder="Ask about DSA..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 text-black dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              e.preventDefault();
              handleSend();
            } else if (e.key === "Enter" && loading) {
              e.preventDefault(); // prevent submission while bot is responding
            }
          }}
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
