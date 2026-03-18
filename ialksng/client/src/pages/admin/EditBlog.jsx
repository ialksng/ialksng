import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../components/Editor";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/blogs/${id}`);
        setForm(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/blogs/${id}`, form);
      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Blog</h1>

      <input
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <Editor
        content={form.content}
        setContent={(value) =>
          setForm({ ...form, content: value })
        }
      />

      <button type="submit">Update</button>
    </form>
  );
}

export default EditBlog;