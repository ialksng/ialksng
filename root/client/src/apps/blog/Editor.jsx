import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useState } from "react";
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, 
  FaListUl, FaListOl, FaQuoteRight, FaImage, FaLink, FaUnlink, FaYoutube,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaUndo, FaRedo, FaHighlighter, FaPalette, FaMinus
} from "react-icons/fa";
import "./Editor.css";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter the Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
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
    <div className="premium-toolbar">
      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><FaUndo /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><FaRedo /></button>
      </div>
      
      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <select 
          className="toolbar-dropdown"
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' : 'p'
          }
        >
          <option value="p">Normal text</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""} title="Bold"><FaBold /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""} title="Italic"><FaItalic /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "is-active" : ""} title="Underline"><FaUnderline /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? "is-active" : ""} title="Strikethrough"><FaStrikethrough /></button>
      </div>
      
      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <label className="toolbar-color-picker" title="Text Color">
          <FaPalette style={{ color: editor.getAttributes('textStyle').color || 'inherit' }} />
          <input type="color" onInput={(e) => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || "#000000"}/>
        </label>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive("highlight") ? "is-active" : ""} title="Highlight Background"><FaHighlighter /></button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={setLink} className={editor.isActive("link") ? "is-active" : ""} title="Insert Link"><FaLink /></button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Remove Link"><FaUnlink /></button>
        <button type="button" onClick={addImage} title="Insert Image"><FaImage /></button>
        <button type="button" onClick={addYoutubeVideo} title="Insert Video"><FaYoutube /></button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? "is-active" : ""} title="Align Left"><FaAlignLeft /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? "is-active" : ""} title="Align Center"><FaAlignCenter /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? "is-active" : ""} title="Align Right"><FaAlignRight /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? "is-active" : ""} title="Justify"><FaAlignJustify /></button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""} title="Numbered List"><FaListOl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""} title="Bullet List"><FaListUl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "is-active" : ""} title="Quote"><FaQuoteRight /></button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line"><FaMinus /></button>
      </div>
    </div>
  );
};

function Editor({ content, setContent }) {
  const [stats, setStats] = useState({ words: 0, chars: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Markdown,
      Underline, TextStyle, Color, Highlight, Subscript, Superscript,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ controls: true, nocookie: true }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      
      // Calculate stats safely
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setStats({ words, chars: text.length });
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, false);
        
        // Update stats on initial load
        const text = editor.getText();
        setStats({ 
          words: text.trim() ? text.trim().split(/\s+/).length : 0, 
          chars: text.length 
        });
      }
    }
  }, [content, editor]);

  if (!editor) return <div className="editor__loading">Loading premium editor...</div>;

  return (
    <div className="premium-editor-container">
      <MenuBar editor={editor} />
      
      <EditorContent editor={editor} className="premium-editor-content" />
      
      <div className="premium-editor-footer">
        <div className="editor-status">
          <span className="status-indicator online"></span> Document Ready
        </div>
        <div className="editor-stats">
          {stats.words} words • {stats.chars} characters
        </div>
      </div>
    </div>
  );
}

export default Editor;