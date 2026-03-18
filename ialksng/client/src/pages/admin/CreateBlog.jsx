import { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor";

function CreateBlog() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("FORM DATA:", form);

      // ✅ CLEAN CONTENT (remove empty HTML)
      const cleanContent = form.content
        ?.replace(/<[^>]+>/g, "") // remove tags
        .trim();

      // ✅ VALIDATION
      if (!form.title.trim() || !cleanContent) {
        alert("Title and content are required ❌");
        setLoading(false);
        return;
      }

      // ✅ API CALL
      const res = await axios.post("/blogs", {
        title: form.title,
        content: form.content,
        category: form.category,
      });

      console.log("CREATED:", res.data);

      alert("Blog created ✅");

      // ✅ RESET FORM
      setForm({
        title: "",
        content: "",
        category: "",
      });

      navigate("/admin/blog");

    } catch (err) {
      console.error("CREATE ERROR:", err);

      // 🔥 show real backend message
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create blog ❌";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Blog</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* 🔥 EDITOR */}
      <Editor
        content={form.content}
        setContent={(value) =>
          setForm({ ...form, content: value })
        }
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}

export default CreateBlog;