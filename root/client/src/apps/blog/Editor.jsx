import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { useEffect } from "react";
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, 
  FaHeading, FaListUl, FaListOl, FaQuoteRight, 
  FaCode, FaImage, FaLink, FaUnlink,
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaUndo, FaRedo, FaHighlighter, FaPalette,
  FaSubscript, FaSuperscript, FaEraser, FaMinus
} from "react-icons/fa";
import "./Editor.css";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter the Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="editor__toolbar">

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><FaUndo /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><FaRedo /></button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""} title="Bold"><FaBold /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""} title="Italic"><FaItalic /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "is-active" : ""} title="Underline"><FaUnderline /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? "is-active" : ""} title="Strikethrough"><FaStrikethrough /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={editor.isActive("subscript") ? "is-active" : ""} title="Subscript"><FaSubscript /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={editor.isActive("superscript") ? "is-active" : ""} title="Superscript"><FaSuperscript /></button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <label className="color-picker-label" title="Text Color">
          <FaPalette style={{ color: editor.getAttributes('textStyle').color || 'inherit' }} />
          <input 
            type="color" 
            onInput={(e) => editor.chain().focus().setColor(e.target.value).run()} 
            value={editor.getAttributes('textStyle').color || "#ffffff"}
          />
        </label>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive("highlight") ? "is-active" : ""} title="Highlight Background"><FaHighlighter /></button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""} title="Heading 2"><FaHeading /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""} title="Bullet List"><FaListUl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""} title="Numbered List"><FaListOl /></button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? "is-active" : ""} title="Align Left"><FaAlignLeft /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? "is-active" : ""} title="Align Center"><FaAlignCenter /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? "is-active" : ""} title="Align Right"><FaAlignRight /></button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={addImage} title="Insert Image"><FaImage /></button>
        <button type="button" onClick={setLink} className={editor.isActive("link") ? "is-active" : ""} title="Insert Link"><FaLink /></button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Remove Link"><FaUnlink /></button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line"><FaMinus /></button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "is-active" : ""} title="Quote"><FaQuoteRight /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive("codeBlock") ? "is-active" : ""} title="Code Block"><FaCode /></button>
        <button type="button" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting"><FaEraser /></button>
      </div>
    </div>
  );
};

function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Markdown.configure({ html: true }), 
      Underline,
      TextStyle,
      Color,
      Highlight,
      Subscript,
      Superscript,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown?.getMarkdown();
      if (markdown !== undefined) {
        setContent(markdown);
      }
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.storage.markdown?.getMarkdown();
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