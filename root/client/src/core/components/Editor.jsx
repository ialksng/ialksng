import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";

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

import { useEffect } from "react";
import "./Editor.css";

function Editor({ content, setContent }) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false
      }),
      Link.configure({
        openOnClick: false
      }),
      Image.configure({
        allowBase64: true
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      TextStyle,
      Color,
      Highlight,
      Placeholder.configure({
        placeholder: "Start writing something powerful..."
      }),
      CharacterCount,
      TaskList,
      TaskItem.configure({
        nested: true
      })
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
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
      </FloatingMenu>

      <BubbleMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
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

        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          Strike
        </button>

        <button onClick={() => editor.chain().focus().toggleCode().run()}>
          Inline Code
        </button>

        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code Block
        </button>

        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Numbered
        </button>

        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Divider
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          Left
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          Center
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          Right
        </button>

        <button onClick={insertImage}>Image</button>

        <button onClick={() => editor.chain().focus().toggleTaskList().run()}>
          Task List
        </button>

        <label>
          🎨
          <input
            type="color"
            onInput={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>

        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
          Highlight
        </button>

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