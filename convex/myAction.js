"use node"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { v } from "convex/values";

export const ingest = action({
    args: {
        splitText:v.any(),
        fileId:v.string()
    },
    handler: async (ctx,args) => {
        await ConvexVectorStore.fromTexts(
            args.splitText,
            args.fileId,
            new GoogleGenerativeAIEmbeddings({
                apiKey: process.env.GOOGLE_API_KEY,
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_DOCUMENT,
                title: "Document title",
            }),
            {ctx}
        );
        return "Completed..."
    },
});