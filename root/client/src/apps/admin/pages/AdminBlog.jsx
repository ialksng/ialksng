import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa"; 
import toast from "react-hot-toast";

import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";
import Editor from "../../../core/components/Editor"; 

import "./admin.css";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState("list"); 
  const [currentBlogId, setCurrentBlogId] = useState(null);
  
  const [formData, setFormData] = useState({ title: "", category: "", coverImage: "", excerpt: "", content: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/blogs?limit=50"); 
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (blog = null) => {
    if (blog) {
      setFormData({ 
        title: blog.title, 
        category: blog.category || "", 
        coverImage: blog.coverImage || "", 
        excerpt: blog.excerpt || "", 
        content: blog.content || ""
      });
      setCurrentBlogId(blog._id);
    } else {
      setFormData({ title: "", category: "", coverImage: "", excerpt: "", content: "" });
      setCurrentBlogId(null);
    }
    setView("form");
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Delete this post?</span>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const deletePromise = axios.delete(`/blogs/${id}`);
              
              toast.promise(deletePromise, {
                loading: 'Deleting...',
                success: () => {
                  setBlogs(blogs.filter(b => b._id !== id));
                  return "Post deleted.";
                },
                error: "Failed to delete post."
              });
            }} 
            style={{ flex: 1, padding: '6px 12px', background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            style={{ flex: 1, padding: '6px 12px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for empty Tiptap output
    const cleanContent = formData.content.replace(/<p><\/p>/g, '').trim();
    if (!formData.title || !cleanContent) {
      return toast.error("Title and Content are required.");
    }

    setSaving(true);
    try {
      if (currentBlogId) {
        await axios.put(`/blogs/${currentBlogId}`, formData);
      } else {
        await axios.post("/blogs", formData);
      }
      toast.success(currentBlogId ? "Post updated!" : "Post published!");
      await fetchBlogs();
      setView("list");
    } catch (err) {
      toast.error("Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && view === "list") {
     return (
       <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Loader />
       </div>
     );
  }
  return (
    <div className="admin-container">
      {view === "list" ? (
        <>
          <div className="admin-header">
            <h2>Manage Blog Posts</h2>
            <button className="btn primary" onClick={() => handleOpenForm()}>
              <FaPlus style={{ marginRight: '8px' }}/> Create New Post
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  blogs.map(blog => (
                    <tr key={blog._id}>
                      <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{blog.title}</td>
                      <td>
                        <span style={{ background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {blog.category || "Uncategorized"}
                        </span>
                      </td>
                      <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon edit" onClick={() => handleOpenForm(blog)} title="Edit">
                            <FaEdit />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete(blog._id)} title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="admin-header">
            <h2>{currentBlogId ? "Edit Post" : "Create New Post"}</h2>
            <button className="btn secondary" onClick={() => setView("list")}>
              <FaTimes style={{ marginRight: '8px' }}/> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h3>Post Details</h3>
              <div className="form-group">
                <label>Post Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    placeholder="e.g., Technology"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input 
                    type="text" 
                    value={formData.coverImage} 
                    placeholder="https://..."
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} 
                  />
                </div>
              </div>

              {formData.coverImage && (
                <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', height: '150px', width: '100%', border: '1px solid var(--border-color)' }}>
                  <img src={formData.coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div className="form-group">
                <label>Excerpt (Short Description)</label>
                <textarea 
                  rows="2"
                  value={formData.excerpt} 
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-section mt-4">
              <h3>Main Content</h3>
              <div className="form-group">
                <Editor 
                  content={formData.content} 
                  setContent={(newContent) => setFormData({ ...formData, content: newContent })} 
                />
              </div>
            </div>

            <button type="submit" className="btn primary mt-4" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }} disabled={saving}>
              {saving ? "Saving Post..." : (currentBlogId ? "Update Post" : "Publish Post")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminBlog;