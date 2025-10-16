"use client";

import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

export default function ChatSidebar({
  onSelectConversation,
}: {
  onSelectConversation: (conv: Conversation | null) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/v1/conversations", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setConversations(data.conversations || []);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    onSelectConversation(null);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Chats</h2>
        <button
          onClick={handleNewChat}
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm p-4">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm p-4">No chats yet.</p>
        ) : (
          <ul>
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <p className="font-medium truncate">{conv.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
