"use client";

import { useState, useEffect } from "react";
import ChatbotPage from "../chatbot/ChatBotPage";
import LogoutButton from "../signout/page"; // adjust the path if needed

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
  const [loadingConversations, setLoadingConversations] = useState(true); // new loading state

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
      } else {
        setConversations([]);
      }
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
      if (!res.ok || !data.conversationId) {
        throw new Error(data.error || "Failed to create conversation");
      }

      const title = newTitle.trim();
      setNewTitle("");
      const newConv = {
        id: data.conversationId,
        title,
        createdAt: new Date().toISOString(),
      };
      setSelectedConversation(newConv);
      fetchConversations();
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-700 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
          Welcome, {sessionName}
        </h2>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
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
                  className={`text-left p-2 rounded flex-1 ${
                    selectedConversation?.id === conv.id
                      ? "bg-green-500 text-white"
                      : "hover:bg-green-200 dark:hover:bg-green-600"
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  {conv.title || "Untitled"}
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation(); // prevent selecting the conversation
                    try {
                      await fetch(`/api/v1/conversations/${conv.id}`, {
                        method: "DELETE",
                        credentials: "include",
                      });
                      // Remove from local state
                      setConversations((prev) =>
                        prev.filter((c) => c.id !== conv.id)
                      );
                      if (selectedConversation?.id === conv.id)
                        setSelectedConversation(null);
                    } catch (err) {
                      console.error("Failed to delete conversation", err);
                    }
                  }}
                  className="text-red-500 px-2"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2">
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
          {/* Logout button */}
          <LogoutButton />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4">
        {loadingConversations ? (
          <p className="text-gray-500 dark:text-gray-300">Loading chat...</p>
        ) : selectedConversation ? (
          <ChatbotPage
            key={selectedConversation.id}
            selectedConversation={selectedConversation}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            Select a conversation or create a new one
          </p>
        )}
      </div>
    </div>
  );
}
