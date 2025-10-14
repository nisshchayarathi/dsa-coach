import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import LogoutButton from "../signout/page"; // client component
import ChatbotPage from "../chatbot/ChatBotPage"; // client component

export default async function ChatsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="h-screen w-screen p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between">
        <div>

      <h1 className="text-2xl font-bold text-black dark:text-gray-100 mb-2">
        Welcome, {session.user?.name} 👋
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        You are now logged in. Ask AyurBot anything about Ayurveda, yoga, or wellness!
      </p>
        </div>

      {/* Logout button */}
      <div className="mb-4">
        <LogoutButton />
      </div>
    </div>
      {/* Chatbot UI */}
      <ChatbotPage />
    </div>
  );
}
