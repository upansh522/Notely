"use client";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import EditorElements from "./EditorElements";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const TextEditor = () => {
  const { fileId } = useParams();
  const addNotes = useMutation(api.notes.saveNotes);
  const { user } = useUser();
  const notes = useQuery(api.notes.getNotes, {
    fileId: fileId as string,
  }) as string;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write here...",
      }),
      Highlight,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5 w-full scrollbar-hide overflow-y-auto",
      },
    },
  });

  useEffect(() => {
    editor?.commands.setContent(notes);
  }, [editor && notes]);

  useEffect(() => {
    const handleSave = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!editor || !user?.primaryEmailAddress?.emailAddress) return;

        try {
          await addNotes({
            fileId: fileId as string,
            notes: editor.getHTML(),
            createdBy: user.primaryEmailAddress.emailAddress,
          });
          toast.success("Notes saved successfully");
        } catch (error) {
          toast.error("Failed to save notes");
          console.error(error);
        }
      }
    };

    document.addEventListener("keydown", handleSave);
    return () => {
      document.removeEventListener("keydown", handleSave);
    };
  }, [editor, fileId, user, addNotes]);

  return (
    <div className="scrollbar-hide">
      <div>
        <EditorElements editor={editor} />
      </div>
      <div className="h-[88vh] overflow-y-auto scrollbar-hide">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
export default TextEditor;
