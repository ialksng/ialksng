import React, { useEffect } from "react";
import * as TiptapReact from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

// --- NEW FEATURES IMPORTED HERE ---
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import "./Editor.css";

// 1. Safely extract components (handles Vite/Rolldown quirks)
const useEditor = TiptapReact.useEditor || TiptapReact.default?.useEditor;
const EditorContent = TiptapReact.EditorContent || TiptapReact.default?.EditorContent;

// 2. Bulletproof Fallbacks to prevent "Blank Page" crashes if exports are missing
const TiptapBubble = TiptapReact.BubbleMenu || TiptapReact.default?.BubbleMenu;
const TiptapFloating = TiptapReact.FloatingMenu || TiptapReact.default?.FloatingMenu;
const SafeBubbleMenu = TiptapBubble || (({ children }) => <>{children}</>);
const SafeFloatingMenu = TiptapFloating || (({ children }) => <>{children}</>);

function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight,
      Placeholder.configure({ placeholder: "Start writing something powerful..." }),
      CharacterCount,
      TaskList,
      TaskItem.configure({ nested: true }),
      // --- NEW EXTENSIONS REGISTERED ---
      Underline,
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  if (!editor) return <div style={{ padding: 20 }}>Loading editor...</div>;

  const insertImage = () => {
    const url = prompt("Enter Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertLink = () => {
    const url = prompt("Enter Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const handleDrop = (e) => {
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const file = e.clipboardData.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
    reader.readAsDataURL(file);
  };

  return (
    <div className="premium-editor-container" onDrop={handleDrop} onPaste={handlePaste}>
      
      {/* 3. Render using the Safe Wrappers */}
      <SafeFloatingMenu editor={editor} className="tiptap-floating-menu">
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
      </SafeFloatingMenu>

      <SafeBubbleMenu editor={editor} className="tiptap-bubble-menu">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button onClick={insertLink}>Link</button>
      </SafeBubbleMenu>

      <div className="premium-toolbar">
        <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
        
        {/* Basic Text Formatting */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
        
        {/* Scripts */}
        <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={editor.isActive('subscript') ? 'is-active' : ''}>Sub</button>
        <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={editor.isActive('superscript') ? 'is-active' : ''}>Super</button>

        {/* Blocks & Lists */}
        <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>Inline Code</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>Quote</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Numbered</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive('taskList') ? 'is-active' : ''}>Task List</button>
        
        {/* Alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>Right</button>
        
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>Divider</button>
        <button onClick={insertImage}>Image</button>

        {/* Colors */}
        <label>🎨<input type="color" onInput={(e) => editor.chain().focus().setColor(e.target.value).run()} /></label>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>Highlight</button>
        
        {/* Clear Formatting */}
        <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear Format</button>

        {/* Dynamic Table Controls (Only appear when a table is active) */}
        {editor.isActive('table') && (
          <div style={{ display: 'flex', gap: '4px', paddingLeft: '8px', borderLeft: '2px solid var(--border-color)' }}>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()}>+Col</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()}>+Row</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()}>-Col</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()}>-Row</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} style={{ color: 'var(--danger-color)' }}>Del Table</button>
          </div>
        )}

      </div>

      <EditorContent editor={editor} className="premium-editor-content" />

      <div className="premium-editor-footer">
        {editor.storage.characterCount.words()} words • {editor.storage.characterCount.characters()} chars
      </div>
    </div>
  );
}

export default Editor;