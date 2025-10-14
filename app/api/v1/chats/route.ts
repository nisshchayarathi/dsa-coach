import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

// helper
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 503 && attempt < maxRetries) {
        console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached without success"); // ✅ ensures return
}

export async function POST(req: Request) {
  console.log("🤖 Chat API called");

  // Check session (but don't block if no session - allow anonymous usage)
  const session = await getServerSession(authOptions);
  console.log(
    "👤 Session status:",
    session
      ? `Logged in as ${session.user?.email} (${(session.user as any)?.role})`
      : "No session (anonymous)"
  );

  try {
    const { question, history } = await req.json();
    console.log("📝 Question received:", question);
    console.log("📚 History length:", history?.length || 0);

    // embed question
    const queryVector = await embeddings.embedQuery(question);

    // search Pinecone
    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map((m) => String(m.metadata?.text ?? "")) // safe string
      .filter((t) => t.trim().length > 0)
      .join("\n\n---\n\n");

    const historyText = Array.isArray(history)
      ? history.map((h: any) => `${h.sender}: ${h.text}`).join("\n")
      : "";
    // system instruction
    const systemInstruction = `You are AyurBot, a friendly expert in Ayurveda, yoga, and health.
Here is the conversation so far:
${historyText || "No previous history."}
Context: ${context || "No specific context retrieved for this query."}`;

    // generate response
    console.log("🔮 Generating AI response...");
    const response = await withRetry(() =>
      model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction + "\n\nQuestion: " + question }],
          },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      })
    );

    console.log("🎯 Raw AI response received:", response);
    const answer = response.response.text();
    console.log("✅ Successfully generated response, length:", answer.length);
    console.log(
      "📄 Response content preview:",
      answer.substring(0, 100) + "..."
    );

    // If empty response, provide a fallback
    if (!answer || answer.trim().length === 0) {
      console.log("⚠️ Empty response detected, using fallback");
      const fallbackAnswer =
        "I understand you're asking about health concerns. For fever, it's important to rest, stay hydrated, and consult a healthcare professional if symptoms persist or worsen. Would you like some general wellness advice from Ayurvedic practices?";
      return NextResponse.json({
        answer: fallbackAnswer,
        fallback: true,
      });
    }

    return NextResponse.json({
      answer: answer,
    });
  } catch (error: any) {
    console.error("❌ Chat API error:", error);
    console.error("Error details:", error.message, error.status);
    console.error("Full error object:", JSON.stringify(error, null, 2));

    // Check if it's an API key or service issue
    if (error.message?.includes("API key") || error.status === 403) {
      console.error("🔑 API Key issue detected");
      return NextResponse.json(
        {
          error: "Configuration issue with AI service",
          details: "API key problem",
        },
        { status: 500 }
      );
    }

    if (error.message?.includes("quota") || error.status === 429) {
      console.error("📊 Quota exceeded");
      return NextResponse.json(
        {
          error: "Service temporarily unavailable due to quota limits",
          details: "Try again later",
        },
        { status: 503 }
      );
    }

    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Chat service temporarily unavailable",
        details: error.message || "Unknown error",
        errorType: error.constructor.name,
      },
      { status: 500 }
    );
  }
}
