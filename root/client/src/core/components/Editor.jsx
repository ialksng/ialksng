import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import { useEffect } from "react";

function Editor({ content, setContent }) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight,
      Youtube,
      Placeholder.configure({
        placeholder: "Start writing something beautiful..."
      }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight })
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter link");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="premium-editor-container">

      <FloatingMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button onClick={addImage}>Image</button>
      </FloatingMenu>

      <BubbleMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button onClick={addLink}>Link</button>
      </BubbleMenu>

      <div className="premium-toolbar">
        <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>

        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered</button>

        <button onClick={addImage}>Image</button>
        <button onClick={addYoutube}>Video</button>
      </div>

      <EditorContent editor={editor} className="premium-editor-content" />

      <div className="premium-editor-footer">
        {editor.storage.characterCount.characters()} chars • {editor.storage.characterCount.words()} words
      </div>
    </div>
  );
}

export default Editor;