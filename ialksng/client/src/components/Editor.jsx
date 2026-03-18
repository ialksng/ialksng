import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "<p>Start writing...</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log("EDITOR HTML:", html);
      setContent(html);
    },
  });

  // ✅ IMPORTANT: sync external content (for edit page)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "<p></p>");
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