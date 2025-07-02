import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const PDFUrl = "https://elated-wildcat-240.convex.cloud/api/storage/52991ed7-ce27-4976-8891-234e09784b9e"

export async function GET(req) {
    const response = await fetch(PDFUrl)
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let PDFTextContent = ""
    docs.forEach(docs => {
        PDFTextContent = PDFTextContent + docs.pageContent;
    });

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20
    })
    const output = await splitter.createDocuments( [PDFTextContent ]);

    let splitterList = [];
    output.forEach(docs=>{
        splitterList.push(docs.pageContent)
    })
    return NextResponse.json({ result: splitterList })
}