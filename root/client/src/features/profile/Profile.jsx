import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "../../core/utils/axios";
import { AuthContext } from "../auth/AuthContext";
import MyPurchases from "../products/MyPurchases";
import toast from "react-hot-toast"; // <-- Imported toast
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
        toast.error("Image must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setProfileData((prev) => ({ ...prev, avatar: base64Image }));
        
        const uploadPromise = axios.put("/auth/profile", { ...profileData, avatar: base64Image }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        toast.promise(uploadPromise, {
          loading: 'Uploading avatar...',
          success: (res) => {
            if(dispatch) dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.data, token: localStorage.getItem("token") } });
            return 'Avatar saved successfully!';
          },
          error: 'Failed to save avatar.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatePromise = axios.put("/auth/profile", profileData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    toast.promise(updatePromise, {
      loading: 'Updating profile...',
      success: (res) => {
        if(dispatch) dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.data, token: localStorage.getItem("token") } });
        return 'Profile updated successfully!';
      },
      error: (err) => err.response?.data?.msg || 'Failed to update profile.',
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const passPromise = axios.put("/auth/change-password", passData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    toast.promise(passPromise, {
      loading: 'Updating password...',
      success: (res) => {
        setPassData({ currentPassword: "", newPassword: "" });
        return res.data.msg;
      },
      error: (err) => err.response?.data?.msg || 'Failed to change password.',
    });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const feedbackPromise = axios.post("/auth/feedback", feedback, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    toast.promise(feedbackPromise, {
      loading: 'Submitting feedback...',
      success: (res) => {
        setFeedback({ subject: "", message: "" });
        return res.data.msg;
      },
      error: 'Failed to submit feedback.',
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  if (!user) return <div className="profile__login-prompt">Please login to view profile.</div>;

  return (
    <div className="profile__wrapper">
      <div className="profile__sidebar">
        <div className="profile__user-card">
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="profile__avatar-container"
            title="Click to change avatar"
          >
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="profile__avatar" style={{ border: '2px solid var(--accent-primary)' }} />
            ) : (
              <div className="profile__avatar">{user.name?.charAt(0).toUpperCase()}</div>
            )}
            <div className="profile__avatar-icon">📷</div>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
          </div>
          <h3 className="profile__username-display">{user.name}</h3>
          <p className="profile__handle-display">@{user.username || "user"}</p>
        </div>

        <button className={`profile__nav-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>👤 Personal Info</button>
        <button className={`profile__nav-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>🛍️ My Purchases</button>
        <button className={`profile__nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
        <button className={`profile__nav-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>🔒 Change Password</button>
        <button className={`profile__nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>💬 Feedback / Report</button>
      </div>

      <div className="profile__content">
        {/* Notice we completely removed the inline msg box here! */}

        {activeTab === 'personal' && (
          <form onSubmit={handleUpdateProfile}>
            <h2>Personal Information</h2>
            
            <div className="profile__grid-2">
              <div className="profile__form-group">
                <label>Full Name</label>
                <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required />
              </div>
              <div className="profile__form-group">
                <label>Mobile Number</label>
                <input type="text" value={profileData.mobile} onChange={e => setProfileData({...profileData, mobile: e.target.value})} placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="profile__form-group profile__username-warning">
              <label className="profile__username-label">Username (Can only be changed ONCE)</label>
              <input 
                type="text" 
                value={profileData.username} 
                onChange={e => setProfileData({...profileData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} 
                disabled={user.usernameChanged}
                style={{ opacity: user.usernameChanged ? 0.6 : 1, cursor: user.usernameChanged ? 'not-allowed' : 'text' }}
              />
              {user.usernameChanged && <p className="profile__username-note">You have already changed your username and cannot change it again.</p>}
            </div>

            <h3 className="profile__section-title">Detailed Address</h3>
            
            <div className="profile__grid-2">
              <div className="profile__form-group"><label>Street / House No.</label><input type="text" value={profileData.address.street} onChange={e => setProfileData({...profileData, address: {...profileData.address, street: e.target.value}})} /></div>
              <div className="profile__form-group"><label>Landmark</label><input type="text" value={profileData.address.landmark} onChange={e => setProfileData({...profileData, address: {...profileData.address, landmark: e.target.value}})} /></div>
              <div className="profile__form-group"><label>City</label><input type="text" value={profileData.address.city} onChange={e => setProfileData({...profileData, address: {...profileData.address, city: e.target.value}})} /></div>
              <div className="profile__form-group"><label>State</label><input type="text" value={profileData.address.state} onChange={e => setProfileData({...profileData, address: {...profileData.address, state: e.target.value}})} /></div>
              <div className="profile__form-group"><label>Pincode / Zip</label><input type="text" value={profileData.address.pincode} onChange={e => setProfileData({...profileData, address: {...profileData.address, pincode: e.target.value}})} /></div>
              <div className="profile__form-group"><label>Country</label><input type="text" value={profileData.address.country} onChange={e => setProfileData({...profileData, address: {...profileData.address, country: e.target.value}})} /></div>
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>Save Changes</button>
          </form>
        )}

        {activeTab === 'purchases' && (
          <div style={{ marginTop: "-40px" }}><MyPurchases /></div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2>App Settings</h2>
            <div className="profile__settings-box">
              <div>
                <h4 className="profile__settings-title">Theme Preference</h4>
                <p className="profile__settings-desc">Current Theme: <strong style={{ textTransform: 'capitalize' }}>{theme}</strong></p>
              </div>
              <button onClick={toggleTheme} className="btn-secondary" style={{ padding: "10px 20px" }}>
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
            <button type="submit" className="btn-primary" style={{width: '100%'}}>Update Password</button>
          </form>
        )}

        {activeTab === 'feedback' && (
          <form onSubmit={handleSubmitFeedback}>
            <h2>Feedback & Bug Reports</h2>
            <p className="profile__feedback-desc">Help us improve! Let us know if you found a bug or have a suggestion.</p>
            <div className="profile__form-group"><label>Subject</label><input type="text" value={feedback.subject} onChange={e => setFeedback({...feedback, subject: e.target.value})} required /></div>
            <div className="profile__form-group"><label>Message</label><textarea value={feedback.message} onChange={e => setFeedback({...feedback, message: e.target.value})} rows="5" required /></div>
            <button type="submit" className="btn-primary" style={{width: '100%'}}>Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;