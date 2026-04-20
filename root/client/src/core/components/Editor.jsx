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
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import "./Editor.css";

const useEditor = TiptapReact.useEditor || TiptapReact.default?.useEditor;
const EditorContent = TiptapReact.EditorContent || TiptapReact.default?.EditorContent;
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
        {/* Undo / Redo */}
        <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
        
        <div className="toolbar-divider"></div>

        {/* The New Dropdown Menu */}
        <select 
          className="editor-dropdown"
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('blockquote') ? 'quote' :
            editor.isActive('codeBlock') ? 'code' : 'p'
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === 'quote') editor.chain().focus().toggleBlockquote().run();
            else if (val === 'code') editor.chain().focus().toggleCodeBlock().run();
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="quote">Quote Block</option>
          <option value="code">Code Block</option>
        </select>

        <div className="toolbar-divider"></div>
        
        {/* Basic Text Formatting */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
        
        <div className="toolbar-divider"></div>

        {/* Lists & Alignment */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Numbered</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive('taskList') ? 'is-active' : ''}>Task List</button>
        
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>Right</button>
        
        <div className="toolbar-divider"></div>

        {/* Inserts */}
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>Divider</button>
        <button onClick={insertImage}>Image</button>
        <label className="color-picker-label">🎨<input type="color" onInput={(e) => editor.chain().focus().setColor(e.target.value).run()} /></label>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>Highlight</button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>

        {/* Dynamic Table Controls */}
        {editor.isActive('table') && (
          <>
            <div className="toolbar-divider"></div>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()}>+Col</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()}>+Row</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()}>-Col</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()}>-Row</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} style={{ color: 'var(--danger-color, #ef4444)' }}>Del Table</button>
          </>
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