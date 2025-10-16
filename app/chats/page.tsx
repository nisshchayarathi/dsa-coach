// app/chats/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import ChatsClient from "./ChatsClient"; // client component

export default async function ChatsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return <ChatsClient sessionName={session.user?.name || "User"} />;
}
