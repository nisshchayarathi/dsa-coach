import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import client from "@/lib/db"; // Prisma client

// 🟢 Save chat (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sender, text, conversationId, conversationTitle } =
      await req.json();

    // Ensure sender and either conversationId or conversationTitle exist
    if (!sender || (!conversationId && !conversationTitle)) {
      return NextResponse.json(
        { error: "Missing sender or conversationId/conversationTitle" },
        { status: 400 }
      );
    }

    // Validate sender
    if (sender !== "user" && sender !== "bot") {
      return NextResponse.json(
        { error: "Invalid sender value" },
        { status: 400 }
      );
    }

    // Find user
    const user = await client.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🟡 Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await client.conversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      // Create new conversation if title provided (allow duplicate titles)
      conversation = await client.conversation.create({
        data: { userId: user.id, title: conversationTitle! },
      });
    }

    // 💾 Save message only if text is non-empty
    let savedChat = null;
    if (text && text.trim() !== "") {
      savedChat = await client.chat.create({
        data: {
          sender,
          text,
          conversationId: conversation.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      chat: savedChat,
      conversationId: conversation.id,
    });
  } catch (error: any) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}

// 🟢 Fetch all conversations for sidebar
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await client.user.findUnique({
      where: { email: session.user.email },
      include: {
        conversations: {
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, createdAt: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return array directly
    return NextResponse.json(user.conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
