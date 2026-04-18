import React, { useState, useEffect } from "react";
import axios from "../../../core/utils/axios";
import "./admin.css";

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    name: "", role: "", imageUrl: "", resumeLink: "", ctaText: "", ctaLink: "",
    paragraphs: [], skills: [], experiences: [], profiles: [], education: [], achievements: [], stats: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data } = await axios.get("/about");
        if (data) setFormData({ ...formData, ...data });
      } catch (error) {
        console.error("Error fetching about data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (arrayName, index, field, value) => {
    const updated = [...formData[arrayName]];
    if (field === null) updated[index] = value;
    else updated[index][field] = value;
    setFormData({ ...formData, [arrayName]: updated });
  };

  const addArrayItem = (arrayName, emptyObject) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObject] });
  };

  const removeArrayItem = (arrayName, index) => {
    const updated = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put("/admin/about", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("About Page updated successfully!");
    } catch (error) {
      alert("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-container p-6">
      <div className="admin-header"><h2>Loading About Data...</h2></div>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Manage About Page</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '1000px' }}>
        
        <div className="form-section">
          <h3>Hero & Basic Info</h3>
          <div className="flex gap-4">
            <div className="form-group w-1/2"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
            <div className="form-group w-1/2"><label>Role</label><input type="text" name="role" value={formData.role} onChange={handleChange} /></div>
          </div>
          <div className="flex gap-4">
            <div className="form-group w-1/2"><label>Profile Image URL</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} /></div>
            <div className="form-group w-1/2"><label>Resume Drive Link</label><input type="text" name="resumeLink" value={formData.resumeLink} onChange={handleChange} /></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Hero Stats (e.g., 50+ Projects)</h3>
          {formData.stats.map((stat, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Value (e.g., 50+)" value={stat.value} onChange={(e) => handleArrayChange("stats", index, "value", e.target.value)} className="w-1/3" />
              <input type="text" placeholder="Label (e.g., Projects)" value={stat.label} onChange={(e) => handleArrayChange("stats", index, "label", e.target.value)} className="w-full" />
              <button type="button" onClick={() => removeArrayItem("stats", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("stats", { label: "", value: "" })} className="btn secondary mt-2">+ Add Stat</button>
        </div>

        <div className="form-section">
          <h3>Bio Paragraphs</h3>
          {formData.paragraphs.map((para, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea value={para} onChange={(e) => handleArrayChange("paragraphs", index, null, e.target.value)} className="w-full" rows="2" />
              <button type="button" onClick={() => removeArrayItem("paragraphs", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("paragraphs", "")} className="btn secondary mt-2">+ Add Paragraph</button>
        </div>

        <div className="form-section">
          <h3>Skills</h3>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Skill Name" value={skill.name} onChange={(e) => handleArrayChange("skills", index, "name", e.target.value)} className="w-1/3" />
              <select value={skill.category} onChange={(e) => handleArrayChange("skills", index, "category", e.target.value)} className="w-1/3">
                <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Databases">Databases</option><option value="Languages">Languages</option><option value="Tools">Tools</option>
              </select>
              <input type="text" placeholder="React Icon Name (e.g., FaReact)" value={skill.iconName} onChange={(e) => handleArrayChange("skills", index, "iconName", e.target.value)} className="w-1/3" />
              <button type="button" onClick={() => removeArrayItem("skills", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("skills", { name: "", category: "Frontend", iconName: "" })} className="btn secondary mt-2">+ Add Skill</button>
        </div>

        <div className="form-section">
          <h3>Experience</h3>
          {formData.experiences.map((exp, index) => (
            <div key={index} className="relative mb-4 p-4 border" style={{ borderColor: 'var(--border-color)', borderRadius: '8px' }}>
              <button type="button" onClick={() => removeArrayItem("experiences", index)} className="btn danger absolute top-2 right-2" style={{position:'absolute', top:'10px', right:'10px'}}>X</button>
              <div className="flex gap-4 mb-2">
                <div className="form-group w-1/2"><label>Job Title</label><input type="text" value={exp.title} onChange={(e) => handleArrayChange("experiences", index, "title", e.target.value)} /></div>
                <div className="form-group w-1/2"><label>Duration</label><input type="text" value={exp.duration} onChange={(e) => handleArrayChange("experiences", index, "duration", e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Description</label><textarea value={exp.description} onChange={(e) => handleArrayChange("experiences", index, "description", e.target.value)} rows="2" /></div>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("experiences", { title: "", duration: "", description: "" })} className="btn secondary mt-2">+ Add Experience</button>
        </div>

        <div className="form-section">
          <h3>Final Call To Action</h3>
          <div className="flex gap-4">
            <div className="form-group w-1/2"><label>CTA Text</label><input type="text" name="ctaText" value={formData.ctaText} onChange={handleChange} /></div>
            <div className="form-group w-1/2"><label>CTA Link</label><input type="text" name="ctaLink" value={formData.ctaLink} onChange={handleChange} /></div>
          </div>
        </div>

        <button type="submit" className="btn primary w-full mt-4" disabled={saving}>
          {saving ? "Saving Changes..." : "Publish Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminAbout;