import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { FloatingMenu } from "@tiptap/extension-floating-menu";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
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

import SlashCommand from "./SlashCommand";

import { useEffect } from "react";
import "./Editor.css";

function Editor({ content, setContent }) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      Image.configure({ allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight,
      Placeholder.configure({
        placeholder: "Type '/' for commands…"
      }),
      CharacterCount,
      TaskList,
      TaskItem.configure({ nested: true }),
      SlashCommand
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

  if (!editor) {
    return <div style={{ padding: 20 }}>Loading editor...</div>;
  }

  const insertImage = () => {
    const url = prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertLink = () => {
    const url = prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const handleDrop = (e) => {
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const file = e.clipboardData.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleAI = async () => {
    const text = editor.getText();

    const res = await fetch("/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: text })
    });

    const data = await res.json();
    editor.chain().focus().insertContent(data.output).run();
  };

  return (
    <div
      className="premium-editor-container"
      onDrop={handleDrop}
      onPaste={handlePaste}
    >

      <FloatingMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
        <button onClick={insertImage}>Image</button>
      </FloatingMenu>

      <BubbleMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button onClick={insertLink}>Link</button>
      </BubbleMenu>

      <div className="premium-toolbar">
        <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>

        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Number
        </button>

        <button onClick={insertImage}>Image</button>

        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code
        </button>

        <button onClick={handleAI}>AI ✨</button>
      </div>

      <EditorContent editor={editor} className="premium-editor-content" />

      <div className="premium-editor-footer">
        {editor.storage.characterCount.words()} words •{" "}
        {editor.storage.characterCount.characters()} chars
      </div>
    </div>
  );
}

export default Editor;