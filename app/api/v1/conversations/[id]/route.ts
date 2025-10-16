import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import client from "@/lib/db"; // Prisma client

// DELETE /api/v1/conversations/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Record<string, string> } // ✅ correct type
) {
  try {
    // 1️⃣ Check session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Get conversationId
    const conversationId = params.id;
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    // 3️⃣ Find user
    const user = await client.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 4️⃣ Ensure this conversation belongs to the user
    const conversation = await client.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation || conversation.userId !== user.id) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // 5️⃣ Delete all messages in this conversation first
    await client.chat.deleteMany({ where: { conversationId } });

    // 6️⃣ Delete the conversation
    await client.conversation.delete({ where: { id: conversationId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
