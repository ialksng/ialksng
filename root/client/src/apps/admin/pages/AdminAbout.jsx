import { useState, useEffect } from "react";

import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";

import "./admin.css";

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    name: "", role: "", imageUrl: "", resumeLink: "", ctaText: "", ctaLink: "",
    paragraphs: [], skills: [], experiences: [], profiles: [], education: [], achievements: [], stats: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data } = await axios.get("/about");
        if (data) setFormData({
          name: data.name || "", role: data.role || "", imageUrl: data.imageUrl || "", 
          resumeLink: data.resumeLink || "", ctaText: data.ctaText || "", ctaLink: data.ctaLink || "",
          paragraphs: data.paragraphs || [], skills: data.skills || [], experiences: data.experiences || [],
          profiles: data.profiles || [], education: data.education || [], achievements: data.achievements || [],
          stats: data.stats || []
        });
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
    setSaving(true); setMessage("");
    try {
      await axios.put("/admin/about", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage("About section updated successfully!");
    } catch (error) {
      setMessage("Failed to update. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-container"><Loader /></div>;

  return (
    <div className="admin-container p-6">
      <h2>Manage About Section</h2>
      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        
        <div className="form-section">
          <h3>Hero & Basic Info</h3>
          <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
          <div className="form-group"><label>Role</label><input type="text" name="role" value={formData.role} onChange={handleChange} /></div>
          <div className="form-group"><label>Profile Image URL</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} /></div>
          <div className="form-group"><label>Resume Drive Link</label><input type="text" name="resumeLink" value={formData.resumeLink} onChange={handleChange} /></div>
        </div>

        <div className="form-section mt-4">
          <h3>Hero Stats (e.g., 50+ Projects)</h3>
          {formData.stats.map((stat, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Value (e.g., 50+)" value={stat.value} onChange={(e) => handleArrayChange("stats", index, "value", e.target.value)} className="p-2 border w-1/3" />
              <input type="text" placeholder="Label (e.g., Projects)" value={stat.label} onChange={(e) => handleArrayChange("stats", index, "label", e.target.value)} className="p-2 border w-full" />
              <button type="button" onClick={() => removeArrayItem("stats", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("stats", { label: "", value: "" })} className="btn secondary mt-2">+ Add Stat</button>
        </div>

        <div className="form-section mt-4">
          <h3>Bio Paragraphs</h3>
          {formData.paragraphs.map((para, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea value={para} onChange={(e) => handleArrayChange("paragraphs", index, null, e.target.value)} className="w-full p-2 border" rows="2" />
              <button type="button" onClick={() => removeArrayItem("paragraphs", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("paragraphs", "")} className="btn secondary mt-2">+ Add Paragraph</button>
        </div>

        <div className="form-section mt-4">
          <h3>Skills</h3>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input type="text" placeholder="Skill Name" value={skill.name} onChange={(e) => handleArrayChange("skills", index, "name", e.target.value)} className="p-2 border" />
              <select value={skill.category} onChange={(e) => handleArrayChange("skills", index, "category", e.target.value)} className="p-2 border">
                <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Databases">Databases</option><option value="Languages">Languages</option><option value="Tools">Tools</option>
              </select>
              <input type="text" placeholder="Icon (e.g., FaReact)" value={skill.iconName} onChange={(e) => handleArrayChange("skills", index, "iconName", e.target.value)} className="p-2 border" />
              <button type="button" onClick={() => removeArrayItem("skills", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("skills", { name: "", category: "Frontend", iconName: "" })} className="btn secondary mt-2">+ Add Skill</button>
        </div>

        <div className="form-section mt-4">
          <h3>Experience</h3>
          {formData.experiences.map((exp, index) => (
            <div key={index} className="border p-4 mb-2 relative">
              <button type="button" onClick={() => removeArrayItem("experiences", index)} className="btn danger absolute top-2 right-2">X</button>
              <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayChange("experiences", index, "title", e.target.value)} className="w-full p-2 mb-2 border" />
              <input type="text" placeholder="Duration (e.g., 2023 - Present)" value={exp.duration} onChange={(e) => handleArrayChange("experiences", index, "duration", e.target.value)} className="w-full p-2 mb-2 border" />
              <textarea placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange("experiences", index, "description", e.target.value)} className="w-full p-2 border" rows="2" />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("experiences", { title: "", duration: "", description: "" })} className="btn secondary mt-2">+ Add Experience</button>
        </div>

        <div className="form-section mt-4">
          <h3>Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="border p-4 mb-2 relative">
              <button type="button" onClick={() => removeArrayItem("education", index)} className="btn danger absolute top-2 right-2">X</button>
              <input type="text" placeholder="Degree / Program" value={edu.degree} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} className="w-full p-2 mb-2 border" />
              <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)} className="w-full p-2 mb-2 border" />
              <input type="text" placeholder="Duration (e.g., 2018 - 2022)" value={edu.duration} onChange={(e) => handleArrayChange("education", index, "duration", e.target.value)} className="w-full p-2 mb-2 border" />
              <textarea placeholder="Description (Optional)" value={edu.description} onChange={(e) => handleArrayChange("education", index, "description", e.target.value)} className="w-full p-2 border" rows="2" />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("education", { degree: "", institution: "", duration: "", description: "" })} className="btn secondary mt-2">+ Add Education</button>
        </div>

        <div className="form-section mt-4">
          <h3>Achievements</h3>
          {formData.achievements.map((ach, index) => (
            <div key={index} className="border p-4 mb-2 relative">
              <button type="button" onClick={() => removeArrayItem("achievements", index)} className="btn danger absolute top-2 right-2">X</button>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Achievement Title" value={ach.title} onChange={(e) => handleArrayChange("achievements", index, "title", e.target.value)} className="w-full p-2 border" />
                <input type="text" placeholder="Date/Year" value={ach.date} onChange={(e) => handleArrayChange("achievements", index, "date", e.target.value)} className="p-2 border w-1/3" />
              </div>
              <input type="text" placeholder="Link (Optional)" value={ach.link} onChange={(e) => handleArrayChange("achievements", index, "link", e.target.value)} className="w-full p-2 mb-2 border" />
              <textarea placeholder="Description" value={ach.description} onChange={(e) => handleArrayChange("achievements", index, "description", e.target.value)} className="w-full p-2 border" rows="2" />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("achievements", { title: "", description: "", date: "", link: "" })} className="btn secondary mt-2">+ Add Achievement</button>
        </div>

        <div className="form-section mt-4">
          <h3>Coding Profiles</h3>
          {formData.profiles.map((prof, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input type="text" placeholder="Platform (e.g., LeetCode)" value={prof.platform} onChange={(e) => handleArrayChange("profiles", index, "platform", e.target.value)} className="p-2 border" />
              <input type="text" placeholder="Profile URL" value={prof.url} onChange={(e) => handleArrayChange("profiles", index, "url", e.target.value)} className="p-2 border w-full" />
              <input type="text" placeholder="Icon (e.g., SiLeetcode)" value={prof.iconName} onChange={(e) => handleArrayChange("profiles", index, "iconName", e.target.value)} className="p-2 border" />
              <button type="button" onClick={() => removeArrayItem("profiles", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("profiles", { platform: "", url: "", iconName: "" })} className="btn secondary mt-2">+ Add Profile</button>
        </div>

        <div className="form-section mt-4">
          <h3>Final CTA</h3>
          <div className="form-group"><label>CTA Text</label><input type="text" name="ctaText" value={formData.ctaText} onChange={handleChange} /></div>
          <div className="form-group"><label>CTA Button Link</label><input type="text" name="ctaLink" value={formData.ctaLink} onChange={handleChange} /></div>
        </div>

        <button type="submit" className="btn primary mt-6 w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminAbout;