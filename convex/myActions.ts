import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI as GeminiClient } from "@google/generative-ai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

class GoogleGenerativeAIEmbeddings768 extends GoogleGenerativeAIEmbeddings {
  async embedQuery(text: string): Promise<number[]> {
    const res = await super.embedQuery(text);
    return res.slice(0, 768);
  }
  async embedDocuments(documents: string[]): Promise<number[][]> {
    const res = await super.embedDocuments(documents);
    return res.map((v) => v.slice(0, 768));
  }
}

export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("No API key found for embeddings. Set NEXT_PUBLIC_GEMINI_API_KEY or GOOGLE_API_KEY in Convex.");
    }

    console.log(`Starting ingestion for file ${args.fileId} with ${args.splitText.length} chunks.`);

    const embeddings = new GoogleGenerativeAIEmbeddings768({
      apiKey: apiKey,
      model: "gemini-embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    });

    // Process in batches to avoid timeouts and transaction limits
    const batchSize = 30;
    for (let i = 0; i < args.splitText.length; i += batchSize) {
      const batch = args.splitText.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(args.splitText.length / batchSize)}`);
      try {
        await ConvexVectorStore.fromTexts(
          batch,
          batch.map(() => ({ fileId: args.fileId })),
          embeddings,
          { ctx }
        );
      } catch (error) {
        console.error(`Batch processing failed at index ${i}:`, error);
        throw new Error(`Failed to embed documents at batch ${i}. ${error instanceof Error ? error.message : ""}`);
      }
    }

    console.log(`Successfully ingested file ${args.fileId}`);
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("No API key found for embeddings. Set NEXT_PUBLIC_GEMINI_API_KEY or GOOGLE_API_KEY in Convex.");
    }

    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings768({
        apiKey: apiKey,
        model: "gemini-embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    console.log(`Starting search for query: "${args.query}" in file: ${args.fileId}`);

    // Search with a larger k to reduce empty results after filtering by file
    const k = 8;
    let results = (
      await vectorStore.similaritySearch(args.query, k)
    ).filter((q) => q.metadata.fileId === args.fileId);

    console.log(`Initial search found ${results.length} results.`);

    // If nothing found, do lightweight, model-driven query expansion (domain-agnostic)
    if (results.length === 0 && apiKey) {
      console.log("No results found. Attempting query expansion...");
      try {
        const client = new GeminiClient(apiKey);
        // Corrected model name from gemini-2.5-flash to gemini-1.5-flash
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
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

        console.log(`Expansion generated variants: ${variants.join(", ")}`);

        const unique = new Set<string>();
        const aggregated: typeof results = [];

        // Process up to 4 variants in parallel to speed up and avoid timeouts
        const variantQueries = variants.slice(0, 4);
        const allVariantResults = await Promise.all(
          variantQueries.map(v => vectorStore.similaritySearch(v, k))
        );

        for (const r of allVariantResults) {
          const filtered = r.filter((q) => q.metadata.fileId === args.fileId);
          for (const doc of filtered) {
            const key = doc.pageContent;
            if (!unique.has(key)) {
              unique.add(key);
              aggregated.push(doc);
            }
          }
        }

        console.log(`Expansion found ${aggregated.length} additional unique results.`);
        if (aggregated.length > 0) results = aggregated;
      } catch (e) {
        console.error("Query expansion failed:", e);
      }
    }

    return JSON.stringify(results);
  },
});
