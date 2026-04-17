import { useState, useEffect } from "react";

import axios from "../../../core/utils/axios";

import "./admin.css";

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    imageUrl: "",
    resumeLink: "",
    paragraphs: [],
    skills: [],
    experiences: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data } = await axios.get("/about");
        setFormData(data || {
          name: "", role: "", imageUrl: "", resumeLink: "", paragraphs: [], skills: [], experiences: []
        });
      } catch (error) {
        console.error("Error fetching about data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...formData.paragraphs];
    updated[index] = value;
    setFormData({ ...formData, paragraphs: updated });
  };
  const addParagraph = () => setFormData({ ...formData, paragraphs: [...formData.paragraphs, ""] });
  const removeParagraph = (index) => {
    const updated = formData.paragraphs.filter((_, i) => i !== index);
    setFormData({ ...formData, paragraphs: updated });
  };

  const handleSkillChange = (index, field, value) => {
    const updated = [...formData.skills];
    updated[index][field] = value;
    setFormData({ ...formData, skills: updated });
  };
  const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, { name: "", category: "Frontend", iconName: "" }] });
  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

  const handleExpChange = (index, field, value) => {
    const updated = [...formData.experiences];
    updated[index][field] = value;
    setFormData({ ...formData, experiences: updated });
  };
  const addExperience = () => setFormData({ ...formData, experiences: [...formData.experiences, { title: "", duration: "", description: "" }] });
  const removeExperience = (index) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await axios.put("/admin/about", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setMessage("About section updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Failed to update. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container p-6">
      <h2>Manage About Section</h2>
      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Profile Image URL</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Resume Drive Link</label>
          <input type="text" name="resumeLink" value={formData.resumeLink} onChange={handleChange} />
        </div>

        <div className="form-section mt-4">
          <h3>Bio Paragraphs</h3>
          {formData.paragraphs.map((para, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea 
                value={para} 
                onChange={(e) => handleParagraphChange(index, e.target.value)} 
                className="w-full p-2 border"
                rows="2"
              />
              <button type="button" onClick={() => removeParagraph(index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={addParagraph} className="btn secondary mt-2">+ Add Paragraph</button>
        </div>

        <div className="form-section mt-4">
          <h3>Skills</h3>
          <p className="text-sm text-gray-500">For Icon Name, use names from your iconMap (e.g., FaReact, SiMongodb)</p>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input type="text" placeholder="Skill Name (e.g., React)" value={skill.name} onChange={(e) => handleSkillChange(index, "name", e.target.value)} className="p-2 border" />
              <select value={skill.category} onChange={(e) => handleSkillChange(index, "category", e.target.value)} className="p-2 border">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Databases">Databases</option>
                <option value="Languages">Languages</option>
                <option value="Tools">Tools</option>
              </select>
              <input type="text" placeholder="Icon Name (e.g., FaReact)" value={skill.iconName} onChange={(e) => handleSkillChange(index, "iconName", e.target.value)} className="p-2 border" />
              <button type="button" onClick={() => removeSkill(index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={addSkill} className="btn secondary mt-2">+ Add Skill</button>
        </div>

        <div className="form-section mt-4">
          <h3>Experience Timeline</h3>
          {formData.experiences.map((exp, index) => (
            <div key={index} className="border p-4 mb-2 relative">
              <button type="button" onClick={() => removeExperience(index)} className="btn danger absolute top-2 right-2">X</button>
              <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => handleExpChange(index, "title", e.target.value)} className="w-full p-2 mb-2 border" />
              <input type="text" placeholder="Duration (e.g., 2023 - Present)" value={exp.duration} onChange={(e) => handleExpChange(index, "duration", e.target.value)} className="w-full p-2 mb-2 border" />
              <textarea placeholder="Description" value={exp.description} onChange={(e) => handleExpChange(index, "description", e.target.value)} className="w-full p-2 border" rows="2" />
            </div>
          ))}
          <button type="button" onClick={addExperience} className="btn secondary mt-2">+ Add Experience</button>
        </div>

        <button type="submit" className="btn primary mt-6 w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminAbout;