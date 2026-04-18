import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "../../core/utils/axios";
import { AuthContext } from "../auth/AuthContext";
import MyPurchases from "../products/MyPurchases";
import "./Profile.css";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("personal");
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({ 
    name: "", username: "", mobile: "", avatar: "", 
    address: { street: "", landmark: "", city: "", state: "", pincode: "", country: "" } 
  });
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });
  const [feedback, setFeedback] = useState({ subject: "", message: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        username: user.username || "",
        mobile: user.mobile || "",
        avatar: user.avatar || "",
        address: user.address || { street: "", landmark: "", city: "", state: "", pincode: "", country: "" }
      });
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMsg({ text: "Image must be less than 2MB", type: "error" });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setProfileData((prev) => ({ ...prev, avatar: base64Image }));
        
        try {
          const res = await axios.put("/auth/profile", { ...profileData, avatar: base64Image }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          if(dispatch) dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.data, token: localStorage.getItem("token") } });
          setMsg({ text: "Avatar saved successfully!", type: "success" });
        } catch (err) {
          console.error(err);
          setMsg({ text: "Failed to save avatar.", type: "error" });
        }
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/profile", profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if(dispatch) dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.data, token: localStorage.getItem("token") } });
      setMsg({ text: "Profile updated successfully!", type: "success" });
    } catch (err) { 
      setMsg({ text: err.response?.data?.msg || "Failed to update profile.", type: "error" }); 
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/change-password", passData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMsg({ text: res.data.msg, type: "success" });
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (err) { 
      setMsg({ text: err.response?.data?.msg || "Failed to change password.", type: "error" }); 
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/feedback", feedback, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMsg({ text: res.data.msg, type: "success" });
      setFeedback({ subject: "", message: "" });
    } catch (err) { 
      setMsg({ text: "Failed to submit feedback.", type: "error" }); 
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  if (!user) return <div style={{padding:'100px', textAlign:'center', color:'white'}}>Please login to view profile.</div>;

  return (
    <div className="profile__wrapper">
      <div className="profile__sidebar">
        <div className="profile__user-card">
          <div 
            onClick={() => fileInputRef.current.click()} 
            style={{ cursor: "pointer", position: "relative", display: "inline-block" }}
            title="Click to change avatar"
          >
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="profile__avatar" style={{ border: '2px solid var(--accent-primary)', objectFit: 'cover' }} />
            ) : (
              <div className="profile__avatar">{user.name?.charAt(0).toUpperCase()}</div>
            )}
            <div style={{ position: "absolute", bottom: "10px", right: "0", background: "var(--accent-primary)", borderRadius: "50%", padding: "4px 6px", fontSize: "12px", color: "#000" }}>📷</div>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
          </div>
          <h3 style={{ margin: "10px 0 5px 0" }}>{user.name}</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>@{user.username || "user"}</p>
        </div>

        <button className={`profile__nav-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>👤 Personal Info</button>
        <button className={`profile__nav-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>🛍️ My Purchases</button>
        <button className={`profile__nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
        <button className={`profile__nav-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>🔒 Change Password</button>
        <button className={`profile__nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>💬 Feedback / Report</button>
      </div>

      <div className="profile__content">
        {msg.text && (
          <div style={{ background: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: msg.type === "success" ? "#10b981" : "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }}>
            {msg.text}
          </div>
        )}

        {activeTab === 'personal' && (
          <form onSubmit={handleUpdateProfile}>
            <h2>Personal Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="profile__form-group">
                <label>Full Name</label>
                <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required />
              </div>
              <div className="profile__form-group">
                <label>Mobile Number</label>
                <input type="text" value={profileData.mobile} onChange={e => setProfileData({...profileData, mobile: e.target.value})} placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="profile__form-group" style={{ background: "rgba(245, 158, 11, 0.05)", padding: "16px", borderRadius: "8px", border: "1px dashed rgba(245, 158, 11, 0.3)" }}>
              <label style={{ color: "#f59e0b", fontWeight: "bold" }}>Username (Can only be changed ONCE)</label>
              <input 
                type="text" 
                value={profileData.username} 
                onChange={e => setProfileData({...profileData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} 
                disabled={user.usernameChanged}
                style={{ opacity: user.usernameChanged ? 0.6 : 1, cursor: user.usernameChanged ? 'not-allowed' : 'text' }}
              />
              {user.usernameChanged && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>You have already changed your username and cannot change it again.</p>}
            </div>

            <h3 style={{ marginTop: "30px", marginBottom: "15px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>Detailed Address</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="profile__form-group"><label>Street / House No.</label><input type="text" value={profileData.address.street} onChange={e => setProfileData({...profileData, address: {...profileData.address, street: e.target.value}})} /></div>
              <div className="profile__form-group"><label>Landmark</label><input type="text" value={profileData.address.landmark} onChange={e => setProfileData({...profileData, address: {...profileData.address, landmark: e.target.value}})} /></div>
              <div className="profile__form-group"><label>City</label><input type="text" value={profileData.address.city} onChange={e => setProfileData({...profileData, address: {...profileData.address, city: e.target.value}})} /></div>
              <div className="profile__form-group"><label>State</label><input type="text" value={profileData.address.state} onChange={e => setProfileData({...profileData, address: {...profileData.address, state: e.target.value}})} /></div>
              <div className="profile__form-group"><label>Pincode / Zip</label><input type="text" value={profileData.address.pincode} onChange={e => setProfileData({...profileData, address: {...profileData.address, pincode: e.target.value}})} /></div>
              <div className="profile__form-group"><label>Country</label><input type="text" value={profileData.address.country} onChange={e => setProfileData({...profileData, address: {...profileData.address, country: e.target.value}})} /></div>
            </div>

            <button type="submit" className="btn primary w-full mt-4">Save Changes</button>
          </form>
        )}

        {activeTab === 'purchases' && (
          <div style={{ marginTop: "-40px" }}><MyPurchases /></div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2>App Settings</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <div>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "var(--text-primary)" }}>Theme Preference</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>Current Theme: <strong style={{ textTransform: 'capitalize' }}>{theme}</strong></p>
              </div>
              <button onClick={toggleTheme} className="btn secondary" style={{ padding: "10px 20px" }}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword}>
            <h2>Change Password</h2>
            <div className="profile__form-group"><label>Current Password</label><input type="password" value={passData.currentPassword} onChange={e => setPassData({...passData, currentPassword: e.target.value})} required /></div>
            <div className="profile__form-group"><label>New Password</label><input type="password" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} required minLength="6" /></div>
            <button type="submit" className="btn primary w-full">Update Password</button>
          </form>
        )}

        {activeTab === 'feedback' && (
          <form onSubmit={handleSubmitFeedback}>
            <h2>Feedback & Bug Reports</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Help us improve! Let us know if you found a bug or have a suggestion.</p>
            <div className="profile__form-group"><label>Subject</label><input type="text" value={feedback.subject} onChange={e => setFeedback({...feedback, subject: e.target.value})} required /></div>
            <div className="profile__form-group"><label>Message</label><textarea value={feedback.message} onChange={e => setFeedback({...feedback, message: e.target.value})} rows="5" required /></div>
            <button type="submit" className="btn primary w-full">Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;