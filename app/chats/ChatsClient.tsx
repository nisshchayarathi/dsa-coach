"use client";

import { useState, useEffect } from "react";
import ChatbotPage from "../chatbot/ChatBotPage";
import LogoutButton from "../signout/page";
import { Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

interface ChatsClientProps {
  sessionName: string;
}

export default function ChatsClient({ sessionName }: ChatsClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const res = await fetch("/api/v1/conversations");
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
        if (!selectedConversation && data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } else setConversations([]);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewConversation = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/v1/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sender: "user",
          text: "",
          conversationTitle: newTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.conversationId)
        throw new Error(data.error || "Failed to create conversation");

      const newConv = {
        id: data.conversationId,
        title: newTitle.trim(),
        createdAt: new Date().toISOString(),
      };
      setNewTitle("");
      setSelectedConversation(newConv);
      fetchConversations();
      setSidebarOpen(false);
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-40 top-0 left-0 h-full bg-gray-100 dark:bg-gray-700 flex flex-col w-64 p-4
          transition-transform transform
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
        `}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate pr-2">
            Welcome, {sessionName}
          </h2>
          <button
            className="md:hidden text-2xl font-bold text-gray-700 dark:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {loadingConversations ? (
            <p className="text-gray-500 dark:text-gray-300">
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              No conversations yet. Start a new one!
            </p>
          ) : (
            conversations.map((conv) => (
              <div key={conv.id} className="flex justify-between items-center">
                <button
                  className={`flex-1 text-left p-2 rounded ${
                    selectedConversation?.id === conv.id
                      ? "bg-green-500 text-white"
                      : "hover:bg-green-200 dark:hover:bg-green-600"
                  }`}
                  onClick={() => {
                    setSelectedConversation(conv);
                    setSidebarOpen(false);
                  }}
                >
                  {conv.title || "Untitled"}
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await fetch(`/api/v1/conversations/${conv.id}`, {
                        method: "DELETE",
                        credentials: "include",
                      });
                      setConversations((prev) =>
                        prev.filter((c) => c.id !== conv.id)
                      );
                      if (selectedConversation?.id === conv.id)
                        setSelectedConversation(null);
                    } catch (err) {
                      console.error("Failed to delete conversation", err);
                    }
                  }}
                  className="p-2 bg-transparent rounded  transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* New conversation + logout */}
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            placeholder="New conversation title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-2 py-1 rounded mb-2 border border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={handleNewConversation}
            className="w-full bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700"
          >
            Create
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Hamburger button for mobile */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden p-2 bg-green-600 text-white rounded-lg shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Chat area */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {/* Fullscreen Loader */}
        {loadingConversations && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-300 text-lg">
              Loading chat...
            </p>
          </div>
        )}

        {/* Chat content */}
        {!loadingConversations && selectedConversation && (
          <div className="absolute inset-0 overflow-auto">
            <ChatbotPage
              key={selectedConversation.id}
              selectedConversation={selectedConversation}
            />
          </div>
        )}

        {/* No conversation selected */}
        {!loadingConversations && !selectedConversation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-300 text-center">
              Select a conversation or create a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
