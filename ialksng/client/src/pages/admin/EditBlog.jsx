import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import "../../styles/admin.css";
import Loader from "../../components/Loader";
import Editor from "../../components/Editor"; // ✅ Import the Editor

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    author: "",
    content: "",
  });

  // Fetch the existing blog data when page loads
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/blogs/${id}`);
        // Safely handle both standard response and the updated Notion response
        const blogData = data.blog || data; 
        
        setFormData({
          title: blogData.title || "",
          category: blogData.category || "",
          image: blogData.image || "",
          author: blogData.author || "",
          content: blogData.content || "",
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/blogs/${id}`, formData);
      alert("Blog updated successfully!");
      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-container p-6">
      <button onClick={() => navigate(-1)} className="btn secondary mb-6">
        ⬅ Back
      </button>

      <h2>Edit Blog</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Blog Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="flex gap-2">
          <div className="form-group w-full">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </div>
          
          <div className="form-group w-full">
            <label>Author</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
        </div>

        {/* ✅ Replaced textarea with your Markdown Editor */}
        <div className="form-group">
          <label>Blog Content (Markdown only)</label>
          <Editor 
            content={formData.content} 
            setContent={(newContent) => setFormData({ ...formData, content: newContent })} 
          />
        </div>

        <button type="submit" className="btn primary w-full mt-4" disabled={saving}>
          {saving ? "Saving Updates..." : "Save Updates"}
        </button>
      </form>
    </div>
  );
}

export default EditBlog;