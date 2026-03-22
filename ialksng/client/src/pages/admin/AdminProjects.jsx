import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import "../../styles/admin.css";
import Loader from "../../components/Loader";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    tools: "" // We'll store as a comma-separated string in the form, and convert to array for the DB
  });

  // Fetch all projects on load
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Populate form for editing
  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      tools: project.tools.join(", ") // Convert array back to comma-separated string for the input
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel Editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", imageUrl: "", githubUrl: "", liveUrl: "", tools: "" });
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Convert comma-separated string into an array of strings, trimming whitespace
    const toolsArray = formData.tools.split(",").map(tool => tool.trim()).filter(tool => tool !== "");
    const payload = { ...formData, tools: toolsArray };

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

      if (editingId) {
        await axios.put(`/projects/${editingId}`, payload, config);
        setMessage("Project updated successfully!");
      } else {
        await axios.post("/projects", payload, config);
        setMessage("Project added successfully!");
      }
      
      handleCancel(); // Reset form
      fetchProjects(); // Refresh list
    } catch (error) {
      console.error("Error saving project:", error);
      setMessage(error.response?.data?.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      await axios.delete(`/projects/${id}`, config);
      setMessage("Project deleted.");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setMessage("Failed to delete project.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-container p-6">
      <h2>Manage Projects</h2>
      {message && <div className="alert">{message}</div>}

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="admin-form mb-6">
        <h3>{editingId ? "Edit Project" : "Add New Project"}</h3>
        
        <div className="form-group">
          <label>Project Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Tools Used (Comma separated, e.g., React, Node.js, MongoDB)</label>
          <input type="text" name="tools" value={formData.tools} onChange={handleChange} />
        </div>

        <div className="flex gap-2">
          <div className="form-group w-full">
            <label>Live URL (Optional)</label>
            <input type="text" name="liveUrl" value={formData.liveUrl} onChange={handleChange} />
          </div>
          <div className="form-group w-full">
            <label>GitHub URL (Optional)</label>
            <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn primary w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn secondary w-full">Cancel</button>
          )}
        </div>
      </form>

      {/* LIST SECTION */}
      <div className="form-section">
        <h3>Existing Projects ({projects.length})</h3>
        {projects.length === 0 ? <p>No projects found.</p> : (
          <div className="grid gap-4 mt-4">
            {projects.map(project => (
              <div key={project._id} className="border p-4 flex justify-between items-center" style={{ backgroundColor: "#161b22", borderRadius: "8px" }}>
                <div>
                  <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.tools.join(" • ")}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="btn secondary">Edit</button>
                  <button onClick={() => handleDelete(project._id)} className="btn danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;