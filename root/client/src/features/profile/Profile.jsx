import React, { useState, useContext, useEffect } from "react";
import axios from "../../core/utils/axios";
import { AuthContext } from "../auth/AuthContext";
import MyPurchases from "../products/MyPurchases";
import "./Profile.css";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("personal");

  const [profileData, setProfileData] = useState({ name: "", avatar: "", mobile: "", address: "" });
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });
  const [feedback, setFeedback] = useState({ subject: "", message: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        avatar: user.avatar || "",
        mobile: user.mobile || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/profile", profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (dispatch) dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.data, token: localStorage.getItem("token") } });
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/change-password", passData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMsg(res.data.msg);
      setPassData({ currentPassword: "", newPassword: "" });
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to change password.");
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/feedback", feedback, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMsg(res.data.msg);
      setFeedback({ subject: "", message: "" });
      setTimeout(() => setMsg(""), 3000);
    } catch {
      alert("Failed to submit feedback.");
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!user) return <div style={{padding:'100px', textAlign:'center', color:'white'}}>Please login to view profile.</div>;

  return (
    <div className="profile__wrapper">
      
      <div className="profile__sidebar">
        <div className="profile__user-card">
          {profileData.avatar ? (
            <img src={profileData.avatar} alt="Avatar" className="profile__avatar" />
          ) : (
            <div className="profile__avatar">{user.name.charAt(0).toUpperCase()}</div>
          )}
          <h3 style={{ margin: "0 0 5px 0" }}>{user.name}</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>{user.email}</p>
        </div>

        <button className={`profile__nav-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>👤 Personal Info</button>
        <button className={`profile__nav-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>🛍️ My Purchases</button>
        <button className={`profile__nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
        <button className={`profile__nav-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>🔒 Change Password</button>
        <button className={`profile__nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>💬 Feedback / Report</button>
      </div>

      <div className="profile__content">
        {msg && <div style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "10px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>{msg}</div>}

        {activeTab === 'personal' && (
          <form onSubmit={handleUpdateProfile}>
            <h2>Personal Information</h2>
            <div className="profile__form-group"><label>Full Name</label><input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} /></div>
            <div className="profile__form-group"><label>Avatar Image URL</label><input type="text" value={profileData.avatar} onChange={e => setProfileData({...profileData, avatar: e.target.value})} /></div>
            <div className="profile__form-group"><label>Mobile Number</label><input type="text" value={profileData.mobile} onChange={e => setProfileData({...profileData, mobile: e.target.value})} /></div>
            <div className="profile__form-group"><label>Shipping / Billing Address</label><textarea value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} rows="3" /></div>
            <button type="submit" className="btn primary w-full">Save Changes</button>
          </form>
        )}

        {activeTab === 'purchases' && (
          <div style={{ marginTop: "-40px" }}>
            <MyPurchases />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2>App Settings</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "#020617", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>App Theme</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Switch between Dark and Light mode.</p>
              </div>
              <button onClick={toggleTheme} className="btn secondary">Toggle Theme</button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword}>
            <h2>Change Password</h2>
            <div className="profile__form-group"><label>Current Password</label><input type="password" value={passData.currentPassword} onChange={e => setPassData({...passData, currentPassword: e.target.value})} required /></div>
            <div className="profile__form-group"><label>New Password</label><input type="password" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} required /></div>
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