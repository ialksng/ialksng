import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown"; // ✅ Import the markdown extension
import { useEffect } from "react";

function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown, // ✅ Add Markdown to extensions
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      // ✅ Get Markdown instead of HTML
      const markdown = editor.storage.markdown.getMarkdown();
      console.log("EDITOR MARKDOWN:", markdown);
      setContent(markdown);
    },
  });

  // ✅ IMPORTANT: sync external content (for edit page)
  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  // ✅ prevent crash if editor not ready
  if (!editor) return <p>Loading editor...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;