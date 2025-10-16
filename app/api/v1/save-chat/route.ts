import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import client from "@/lib/db"; // Prisma client

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sender, text } = body;

    if (!sender || !text) {
      return NextResponse.json({ error: "Missing sender or text" }, { status: 400 });
    }

    if (sender !== "user" && sender !== "bot") {
      return NextResponse.json({ error: "Invalid sender value" }, { status: 400 });
    }

    // Fetch user's ID from the database
    const user = await client.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const savedChat = await client.chat.create({
      data: {
        userId: user.id,
        sender,
        text,
      },
    });

    return NextResponse.json({ success: true, chat: savedChat });
  } catch (error: any) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}
