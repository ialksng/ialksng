import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa"; 

import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";

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
        content: blog.content 
      });
      setCurrentBlogId(blog._id);
    } else {
      setFormData({ title: "", category: "", coverImage: "", excerpt: "", content: "" });
      setCurrentBlogId(null);
    }
    setView("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      if (currentBlogId) {
        await axios.put(`/blogs/${currentBlogId}`, formData, config);
      } else {
        await axios.post("/blogs", formData, config);
      }
      await fetchBlogs();
      setView("list");
    } catch (err) {
      alert("Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && view === "list") return <div className="admin-container"><Loader /></div>;
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
                      <td style={{ fontWeight: 500, color: "#fff" }}>{blog.title}</td>
                      <td>{blog.category || "Uncategorized"}</td>
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

              <div className="flex gap-4">
                <div className="form-group w-1/2">
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  />
                </div>
                <div className="form-group w-1/2">
                  <label>Cover Image URL</label>
                  <input 
                    type="text" 
                    value={formData.coverImage} 
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} 
                  />
                </div>
              </div>

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
              <h3>Main Content (Markdown / Text)</h3>
              <div className="form-group">
                <textarea 
                  required 
                  rows="15" 
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  style={{ fontFamily: "monospace" }}
                />
              </div>
            </div>

            <button type="submit" className="btn primary w-full mt-4" disabled={saving}>
              {saving ? "Saving Post..." : (currentBlogId ? "Update Post" : "Publish Post")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminBlog;