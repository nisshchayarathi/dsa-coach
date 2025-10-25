import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";

interface ChatHistory {
  role: string;
  parts: any;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

// Retry helper
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
  throw new Error("Max retries reached without success");
}

export async function POST(req: Request) {
  console.log("🤖 Chat API called");

  const session = await getServerSession(authOptions);
  console.log(
    "👤 Session:",
    session ? `Logged in as ${session.user?.email}` : "No session (anonymous)"
  );

  try {
    const { question, history } = await req.json();

    // 1️⃣ Filter and format history
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

    // 3️⃣ Generate enhanced question
    const enhancedQuestionResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "model",
          parts: [
            {
              text: `You are a query rewriting expert. 
Rephrase the follow-up question into a standalone question. 
Only output the rewritten question, no explanations. 
If it is a greeting like hi, hello, or how can you help me, keep the meaning the same.`,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Previous user messages:\n${userHistory.join(
                "\n"
              )}\nFollow-up question: ${question}`,
            },
          ],
        },
      ],
    });

    const enhancedQuestion = enhancedQuestionResp.text;
    console.log("✨ Enhanced Question:", enhancedQuestion);

    // 4️⃣ Update chat history
    if (
      formattedHistory.length > 0 &&
      formattedHistory[formattedHistory.length - 1].role === "user"
    ) {
      formattedHistory.pop();
    }
    formattedHistory.push({
      role: "user",
      parts: [{ text: enhancedQuestion }],
    });

    // 5️⃣ Pinecone vector search
    if (!enhancedQuestion) return;
    const queryVector = await embeddings.embedQuery(enhancedQuestion);
    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map((m) => String(m.metadata?.text ?? "")) // cast to string
      .filter((t) => t.trim().length > 0)
      .join("\n\n---\n\n");

    // 6️⃣ AI response streaming
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "model",
          parts: [
            {
              text: `You are a Data Structures & Algorithms expert.
Answer ONLY from the provided context.
If the answer is not in the context, reply: "I could not find the answer in the provided document. Are you sure this is related to DSA?"
Context:
${context}`,
            },
          ],
        },
        ...formattedHistory,
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (!chunk) continue; // skip undefined chunks
          const text = chunk.text; // safely call text()
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("❌ Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
