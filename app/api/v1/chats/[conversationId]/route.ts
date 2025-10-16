import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import client from "@/lib/db";

export async function GET(req: NextRequest, context: { params: { conversationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = context.params.conversationId;
  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
  }

  const conversation = await client.conversation.findFirst({
    where: { id: conversationId, user: { email: session.user.email } },
    include: { chats: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json(conversation.chats);
}
