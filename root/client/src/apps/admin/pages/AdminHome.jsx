import React, { useState, useEffect } from "react";
import axios from "../../../core/utils/axios";
import "./admin.css";

const AdminHome = () => {
  const [formData, setFormData] = useState({
    heroTitle: "", heroSubtitle: "", heroPrimaryButtonText: "", heroPrimaryButtonLink: "",
    heroSecondaryButtonText: "", heroSecondaryButtonLink: "", servicesHeading: "",
    services: [], funExtras: [], ctaTitle: "", ctaButtonText: "", ctaButtonLink: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await axios.get("/home");
        if (data) setFormData({ ...formData, ...data });
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (arrayName, index, field, value) => {
    const updated = [...formData[arrayName]];
    updated[index][field] = value;
    setFormData({ ...formData, [arrayName]: updated });
  };

  const addArrayItem = (arrayName, emptyObject) => setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObject] });
  const removeArrayItem = (arrayName, index) => setFormData({ ...formData, [arrayName]: formData[arrayName].filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put("/admin/home", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Home Page updated successfully!");
    } catch (error) {
      alert("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-container p-6">
      <div className="admin-header"><h2>Loading Home Data...</h2></div>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Manage Home Page</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '1000px' }}>
        
        <div className="form-section">
          <h3>Hero Section</h3>
          <div className="form-group"><label>Hero Title</label><input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} /></div>
          <div className="form-group"><label>Hero Subtitle</label><textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows="2" /></div>
          
          <div className="flex gap-4">
            <div className="form-group w-1/2"><label>Primary Button Text</label><input type="text" name="heroPrimaryButtonText" value={formData.heroPrimaryButtonText} onChange={handleChange} /></div>
            <div className="form-group w-1/2"><label>Primary Button Link</label><input type="text" name="heroPrimaryButtonLink" value={formData.heroPrimaryButtonLink} onChange={handleChange} /></div>
          </div>
          <div className="flex gap-4">
            <div className="form-group w-1/2"><label>Secondary Button Text</label><input type="text" name="heroSecondaryButtonText" value={formData.heroSecondaryButtonText} onChange={handleChange} /></div>
            <div className="form-group w-1/2"><label>Secondary Button Link</label><input type="text" name="heroSecondaryButtonLink" value={formData.heroSecondaryButtonLink} onChange={handleChange} /></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Services Preview</h3>
          <div className="form-group"><label>Section Heading</label><input type="text" name="servicesHeading" value={formData.servicesHeading} onChange={handleChange} /></div>
          
          {formData.services.map((srv, index) => (
            <div key={index} className="relative mb-4 p-4 border" style={{ borderColor: 'var(--border-color)', borderRadius: '8px' }}>
              <button type="button" onClick={() => removeArrayItem("services", index)} className="btn danger absolute top-2 right-2" style={{position:'absolute', top:'10px', right:'10px'}}>X</button>
              <div className="flex gap-4 mb-2">
                <div className="form-group w-1/2"><label>Service Title</label><input type="text" value={srv.title} onChange={(e) => handleArrayChange("services", index, "title", e.target.value)} /></div>
                <div className="form-group w-1/2"><label>Icon Name (e.g. FaCode)</label><input type="text" value={srv.iconName} onChange={(e) => handleArrayChange("services", index, "iconName", e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Description</label><textarea value={srv.description} onChange={(e) => handleArrayChange("services", index, "description", e.target.value)} rows="2" /></div>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("services", { title: "", description: "", iconName: "" })} className="btn secondary mt-2">+ Add Service</button>
        </div>

        <div className="form-section">
          <h3>Fun Extras (Stats Bottom Row)</h3>
          {formData.funExtras.map((stat, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Value (e.g., 100K+)" value={stat.value} onChange={(e) => handleArrayChange("funExtras", index, "value", e.target.value)} className="w-1/4" />
              <input type="text" placeholder="Label (e.g., Lines of Code)" value={stat.label} onChange={(e) => handleArrayChange("funExtras", index, "label", e.target.value)} className="w-1/2" />
              <input type="text" placeholder="Suffix (Optional)" value={stat.suffix} onChange={(e) => handleArrayChange("funExtras", index, "suffix", e.target.value)} className="w-1/4" />
              <button type="button" onClick={() => removeArrayItem("funExtras", index)} className="btn danger">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("funExtras", { label: "", value: "", suffix: "" })} className="btn secondary mt-2">+ Add Fun Stat</button>
        </div>

        <div className="form-section">
          <h3>Final Call To Action</h3>
          <div className="form-group"><label>CTA Title</label><input type="text" name="ctaTitle" value={formData.ctaTitle} onChange={handleChange} /></div>
          <div className="flex gap-4">
            <div className="form-group w-1/2"><label>Button Text</label><input type="text" name="ctaButtonText" value={formData.ctaButtonText} onChange={handleChange} /></div>
            <div className="form-group w-1/2"><label>Button Link</label><input type="text" name="ctaButtonLink" value={formData.ctaButtonLink} onChange={handleChange} /></div>
          </div>
        </div>

        <button type="submit" className="btn primary w-full mt-4" disabled={saving}>
          {saving ? "Saving Changes..." : "Publish Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminHome;