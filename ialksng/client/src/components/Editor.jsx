import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEffect } from "react";

function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    // ✅ Leave this empty. If we pass Markdown here, Tiptap thinks it's plain text.
    content: "", 
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      setContent(markdown);
    },
  });

  // ✅ Inject the markdown after the editor loads so the Markdown extension can parse it
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.storage.markdown.getMarkdown();
      if (content !== currentContent) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;