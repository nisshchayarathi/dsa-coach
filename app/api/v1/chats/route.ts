import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

interface ChatHistory {
  role: string;
  parts: any;
}

const ai = new GoogleGenAI({});

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
    console.log("📚 History length:", history || 0);

    // 1️⃣ Filter and format history from front-end
    const formattedHistory: ChatHistory[] = (history || [])
      .filter(
        (msg: any) =>
          msg &&
          msg.role &&
          Array.isArray(msg.parts) &&
          msg.parts.length > 0 &&
          msg.parts[0].text
      )
      .map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.parts[0].text }],
      }));

    // 2️⃣ Extract previous user messages
    const userHistory = formattedHistory
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.parts[0].text);

    const followUpQuestion = question; // current question from front-end

    // 3️⃣ Generate enhanced question
    console.log("🔮 Generating Enhanced Question...");
    const enhancedQuestion = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Previous user messages:\n${userHistory.join(
                "\n"
              )}\nFollow-up question: ${followUpQuestion}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a query rewriting expert. Rephrase the Follow-up question into a standalone question. Only output the rewritten question, no explanations.
    If it is a greeting like hi or hello or how can you help me, keep the meaning same.`,
      },
    });

    // 4️⃣ Log enhanced question
    console.log("✨ Enhanced Question:", enhancedQuestion.text);

    // Remove the last user message
    if (
      formattedHistory.length > 0 &&
      formattedHistory[formattedHistory.length - 1].role === "user"
    ) {
      formattedHistory.pop();
    }
    {
      // Add system message or placeholder to avoid empty array
      formattedHistory.push({
        role: "user",
        parts: [{ text: enhancedQuestion.text }],
      });
    }
    console.log(
      "📜 Final History sent to model:",
      JSON.stringify(formattedHistory, null, 2)
    );

    // 6️⃣ Proceed with embeddings, Pinecone search, system instruction, and model response
    const queryVector = await embeddings.embedQuery(
      enhancedQuestion.text || "Could not generate question"
    );

    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map((m) => String(m.metadata?.text ?? ""))
      .filter((t) => t.trim().length > 0)
      .join("\n\n---\n\n");

    const systemInstruction = `You have to behave like a Data Structure and Algorithm Expert.
You will be given a context of relevant information and a user question.
Your task is to answer the user's question based ONLY on the provided context.
If it is a greeting like hi or hello or how can you help me reply what all you can do in short 2-3 lines.
If the answer is not in the context, you must say "I could not find the answer in the provided document.Are you sure this is related to dsa?"
Keep your answers clear, concise, and educational.
Context: ${context}`;

    // Generate AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedHistory,
      config: { systemInstruction },
    });

    const answer = response.text || "I understand you're asking about DSA.";

    return NextResponse.json({ answer });
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
