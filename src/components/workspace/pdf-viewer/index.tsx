"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";

const PdfViewer = ({ fileId }: { fileId: string }) => {
  const pdfRecord = useQuery(api.fileStorage.getPdfRecord, {
    fileId: fileId,
  });

  return (
    <div>
      {pdfRecord === undefined ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <iframe
          src={pdfRecord![0].fileUrl + "#toolbar=0"}
          width={"100%"}
          className="h-screen"
        />
      )}
    </div>
  );
};
export default PdfViewer;
