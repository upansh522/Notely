import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Strike from '@tiptap/extension-strike'
import EditorExtension from './EditorExtension'

function TextEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start taking your notes here"
            }),
            Underline,
            Heading.configure({ levels: [1, 2, 3] }),
            Blockquote,
            Code,
            CodeBlock,
            HorizontalRule,
            BulletList,
            OrderedList,
            ListItem,
            Strike,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5'
            }
        }
    })

    return (
        <div>
            <EditorExtension editor={editor}/>
            <div>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default TextEditor