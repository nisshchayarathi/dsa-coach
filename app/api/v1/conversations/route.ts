import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import client from "@/lib/db";

export async function GET() {
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

  // 👇 Return wrapped in an object (so the frontend can do data.conversations)
  return NextResponse.json(user.conversations || []);
}
