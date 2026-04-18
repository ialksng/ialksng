import React, { useState, useEffect } from "react";
import axios from "../../../core/utils/axios";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa"; 
import "./admin.css";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); 
  const [formData, setFormData] = useState({ name: "", role: "", message: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/testimonials");
      setTestimonials(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this testimonial?")) {
      try {
        await axios.delete(`/testimonials/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setTestimonials(testimonials.filter(t => t._id !== id));
      } catch (err) { alert("Failed to delete."); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/testimonials", formData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      await fetchTestimonials();
      setView("list");
      setFormData({ name: "", role: "", message: "" });
    } catch (err) { alert("Failed to save."); } finally { setSaving(false); }
  };

  if (loading) return <div className="admin-container p-6"><h2>Loading...</h2></div>;

  return (
    <div className="admin-container">
      {view === "list" ? (
        <>
          <div className="admin-header">
            <h2>Manage Testimonials</h2>
            <button className="btn primary" onClick={() => setView("form")}><FaPlus style={{ marginRight: '8px' }}/> Add Testimonial</button>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Role</th><th>Message</th><th>Actions</th></tr></thead>
              <tbody>
                {testimonials.length === 0 ? <tr><td colSpan="4" style={{ textAlign: "center" }}>No testimonials yet.</td></tr> : (
                  testimonials.map(t => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 500, color: "#fff" }}>{t.name}</td>
                      <td>{t.role}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.message}</td>
                      <td>
                        <button className="btn-icon delete" onClick={() => handleDelete(t._id)}><FaTrash /></button>
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
            <h2>Add Testimonial</h2>
            <button className="btn secondary" onClick={() => setView("list")}><FaTimes style={{ marginRight: '8px' }}/> Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group"><label>Client Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
            <div className="form-group"><label>Client Role / Company</label><input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} /></div>
            <div className="form-group"><label>Message</label><textarea rows="4" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} /></div>
            <button type="submit" className="btn primary w-full mt-4" disabled={saving}>{saving ? "Saving..." : "Publish Testimonial"}</button>
          </form>
        </>
      )}
    </div>
  );
};
export default AdminTestimonials;