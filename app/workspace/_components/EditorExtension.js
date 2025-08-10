import { useAction } from 'convex/react';
import { Bold, Italic, Underline, Strikethrough, Quote, Code, List, ListOrdered, Heading1, Heading2, Heading3, Minus, Sparkles, Sparkle } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { getGeminiResponse } from '@/configs/AIModel'; // Import Gemini

function EditorExtension({ editor }) {
    const { fileId } = useParams();
    const searchAi = useAction(api.myAction.search);

    const onAiClick = async () => {
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        );
        console.log(`selectedText: ${selectedText}`);
        const result = await searchAi({
            query: selectedText,
            fileId: fileId,
        });

        const UnformattedAns = JSON.parse(result);
        console.log(UnformattedAns);
        let allUnformattedAns = "";
        UnformattedAns && UnformattedAns.forEach(item => {
            allUnformattedAns += item.pageContent;
        });

        const prompt = `For question: ${selectedText} and with the given content as answer, please give appropriate answer in HTML format. The answer content is: ${allUnformattedAns}`;
        
        // Get Gemini response
        const geminiAnswer = await getGeminiResponse(prompt);
        console.log("Gemini HTML Answer:", geminiAnswer);
        
        const finalAns = await geminiAnswer.response.text();
        const AllText = editor.getHTML();
        editor.commands.insertContent  (AllText+'<p> <strong> Answer:</string>'+ finalAns +'</p>')
        // You can now use geminiAnswer, e.g., insert into editor or display
        // editor.commands.insertContent(geminiAnswer); // Example usage
    };
    const [hovered, setHovered] = useState(false);

    return editor && (
        <div className='p-5 flex gap-3 flex-wrap'>
            {/* Headings */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'text-amber-300' : ''}
                title="Heading 1"
            >
                <Heading1 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'text-amber-300' : ''}
                title="Heading 2"
            >
                <Heading2 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'text-amber-300' : ''}
                title="Heading 3"
            >
                <Heading3 />
            </button>
            {/* Bold */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'text-amber-300' : ''}
                title="Bold"
            >
                <Bold />
            </button>
            {/* Italic */}
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'text-amber-300' : ''}
                title="Italic"
            >
                <Italic />
            </button>
            {/* Underline */}
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'text-amber-300' : ''}
                title="Underline"
            >
                <Underline />
            </button>
            {/* Strike */}
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'text-amber-300' : ''}
                title="Strikethrough"
            >
                <Strikethrough />
            </button>
            {/* Blockquote */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'text-amber-300' : ''}
                title="Blockquote"
            >
                <Quote />
            </button>
            {/* Code */}
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'text-amber-300' : ''}
                title="Inline Code"
            >
                <Code />
            </button>
            {/* Code Block */}
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'text-amber-300' : ''}
                title="Code Block"
            >
                {'</>'}
            </button>
            {/* Bullet List */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'text-amber-300' : ''}
                title="Bullet List"
            >
                <List />
            </button>
            {/* Ordered List */}
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'text-amber-300' : ''}
                title="Ordered List"
            >
                <ListOrdered />
            </button>
            {/* Horizontal Rule */}
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus />
            </button>
            <button
                onClick={onAiClick}
                title="AI"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {hovered ? <Sparkles /> : <Sparkle />}
            </button>
        </div>
    );
}

export default EditorExtension;