import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEffect } from "react";
import { 
  FaBold, FaItalic, FaStrikethrough, FaHeading, 
  FaListUl, FaListOl, FaQuoteRight, FaCode 
} from "react-icons/fa";
import "./Editor.css";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="editor__toolbar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <FaStrikethrough />
      </button>
      <div className="divider"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <FaHeading />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <FaListUl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <FaListOl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <FaQuoteRight />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <FaCode />
      </button>
    </div>
  );
};

function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: content || "",
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      setContent(markdown);
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.storage.markdown.getMarkdown();
      if (content !== currentContent) {
        editor.commands.setContent(content, false); 
      }
    }
  }, [content, editor]);

  if (!editor) return <div className="editor__loading">Loading editor...</div>;

  return (
    <div className="editor__container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor__content" />
    </div>
  );
}

export default Editor;