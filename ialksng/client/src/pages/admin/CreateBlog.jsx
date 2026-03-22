import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "../../styles/admin.css"; // Reuse our nice admin styles
import Editor from "../../components/Editor"; // ✅ Import the Editor

function CreateBlog() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  // State matching your Mongoose Blog Model
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    author: "Alok Singh", // Defaulting to you
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Send data to the backend
      await axios.post("/blogs", formData);
      alert("Blog created successfully!");
      navigate("/admin/blog"); // Go back to blog list
    } catch (err) {
      console.error(err);
      alert("Failed to create blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-container p-6">
      <button onClick={() => navigate(-1)} className="btn secondary mb-6">
        ⬅ Back
      </button>
      
      <h2>Create New Blog</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Blog Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="flex gap-2">
          <div className="form-group w-full">
            <label>Category (e.g., Tech, Tutorial, Personal)</label>
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
          {saving ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;