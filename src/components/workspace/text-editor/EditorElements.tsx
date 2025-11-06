import { useAction, useMutation } from "convex/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  Sparkles,
  Strikethrough,
} from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { startChat } from "@/config/Gemini";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const EditorElements = ({ editor }: { editor: any }) => {
  const { fileId } = useParams();
  const vectorSearch = useAction(api.myActions.search);
  const { user } = useUser();
  const addNotes = useMutation(api.notes.saveNotes);
  if (!editor) {
    return null;
  }

  const onAIAssist = async () => {
    toast("AI is generating your answer please wait...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ""
    );

    const vectors = await vectorSearch({
      fileId: fileId as string,
      query: selectedText,
    });

    const jsonParsed = JSON.parse(vectors);
    let textContent = "";

    jsonParsed &&
      jsonParsed.forEach((d: any) => {
        textContent += d.pageContent;
      });

        const prompt =
      textContent === ""
        ? "The user is asking a question but no relevant content was found in the document. Please inform the user that you cannot answer the question without the relevant information from the document. Please provide the output in HTML format, using only the body section."
        : `For given question: ${selectedText} format the content: ${textContent} like an answer to the question in points and use bullets if necessary, give proper length answer based on the content provided Note: please give output in html format and give body section only also keep the answer to the point dont go out of the question's context`;
        const chatSession = startChat();
    const answer = await chatSession.sendMessage(prompt);
    const allText = editor.getHTML();
    const finalAns = answer.response
      .text()
      .replaceAll("```", "")
      .replaceAll("html", "");
    console.log(finalAns);
    editor.commands.setContent(allText + "<strong>Answer:</strong>" + finalAns);

    await addNotes({
      fileId: fileId as string,
      notes: editor.getHTML(),
      createdBy: user?.primaryEmailAddress?.emailAddress as string,
    });
  };

  return (
    <div className="control-group p-2 sm:p-5">
      <div className="button-group flex flex-wrap gap-2 sm:gap-4 items-center justify-start">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "is-active text-blue-500" : ""
          }`}
        >
          <Heading1 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "is-active text-blue-500" : ""
          }`}
        >
          <Heading2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "is-active text-blue-500" : ""
          }`}
        >
          <Heading3 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("bold") ? "is-active text-blue-500" : ""
          }`}
        >
          <Bold className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("italic") ? "is-active text-blue-500" : ""
          }`}
        >
          <Italic className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("strike") ? "is-active text-blue-500" : ""
          }`}
        >
          <Strikethrough className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("highlight") ? "is-active text-blue-500" : ""
          }`}
        >
          <Highlighter className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("bulletList") ? "is-active text-blue-500" : ""
          }`}
        >
          <List className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            editor.isActive("codeBlock") ? "is-active text-blue-500" : ""
          }`}
        >
          <Code className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button 
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors hover:text-blue-500"
          onClick={onAIAssist}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
export default EditorElements;
