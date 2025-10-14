import { CreateUserSchema } from "@/lib/validation";
import client from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedData = CreateUserSchema.safeParse(body);
  if (!parsedData.success) {
    return NextResponse.json({
      message: "Incorrect inputs",
    });
  }

  try {
    const user = await client.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    return NextResponse.json({
      userId: user.id,
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Email already exists",
      },
      {
        status: 411,
      }
    );
  }
}
