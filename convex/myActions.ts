import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI as GeminiClient } from "@google/generative-ai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,
      { fileId: args.fileId },
      new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    // Search with a larger k to reduce empty results after filtering by file
    const k = 8;
    let results = (
      await vectorStore.similaritySearch(args.query, k)
    ).filter((q) => q.metadata.fileId === args.fileId);

    // If nothing found, do lightweight, model-driven query expansion (domain-agnostic)
    if (results.length === 0) {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (apiKey) {
        try {
          const client = new GeminiClient(apiKey);
          const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
          const prompt = `You are a retrieval query rewriter. Given a natural-language query, produce 4-6 diverse alternative queries and keyword-style searches that could retrieve the most relevant passages.\n\n- Be concise (max ~6 words each).\n- Cover synonyms, paraphrases, abbreviations, and core keywords.\n- Output ONLY a JSON array of strings (no extra text).\n\nQuery: ${args.query}`;
          const resp = await model.generateContent(prompt);
          const out = resp.response.text();
          let variants: string[] = [];
          try {
            variants = JSON.parse(out);
          } catch {
            variants = out
              .split("\n")
              .map((s) => s.trim().replace(/^[-•]\s*/, ""))
              .filter(Boolean);
          }

          const unique = new Set<string>();
          const aggregated: typeof results = [];
          for (const v of variants.slice(0, 6)) {
            const r = (
              await vectorStore.similaritySearch(v, k)
            ).filter((q) => q.metadata.fileId === args.fileId);
            for (const doc of r) {
              const key = doc.pageContent;
              if (!unique.has(key)) {
                unique.add(key);
                aggregated.push(doc);
              }
            }
            // Stop early if we already gathered something meaningful
            if (aggregated.length > 0) break;
          }
          if (aggregated.length > 0) results = aggregated;
        } catch (e) {
          // If expansion fails for any reason, fall back to no results
        }
      }
    }

    return JSON.stringify(results);
  },
});
