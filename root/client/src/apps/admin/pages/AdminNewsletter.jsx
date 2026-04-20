import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";
import Editor from "../../../core/components/Editor";

import "./admin.css";

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get("/newsletter/subscribers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSubscribers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    // Prevent submitting if the editor is completely empty or just contains an empty tag
    const cleanContent = content.replace(/<p><\/p>/g, '').trim();
    if (!subject || !cleanContent) {
      return toast.error("Please fill out subject and content.");
    }

    if (window.confirm(`Are you sure you want to send this to ${subscribers.length} subscribers?`)) {
      setSending(true);
      try {
        // Calls the actual backend NodeMailer route
        const res = await axios.post(
          "/newsletter/send", 
          { subject, content },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        toast.success(res.data.msg || "Newsletter sent successfully!");
        setSubject("");
        setContent("");
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to send.");
      } finally {
        setSending(false);
      }
    }
  };

  if (loading) {
     return (
       <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Loader />
       </div>
     );
  }

  return (
    <div className="admin-container p-6">
      <h2>Newsletter Management</h2>

      <div className="admin-grid">
        <div className="admin-form" style={{ margin: 0 }}>
          <div className="form-section">
            <h3>Compose Broadcast</h3>
            <p className="text-sm text-gray-500">
              This will be sent to all {subscribers.length} active subscribers.
            </p>

            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <label>Email Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="New Blog Post: How to Master React..."
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label>Email Content (Rich Text HTML)</label>
                {/* Replaced Textarea with Editor */}
                <Editor 
                  content={content} 
                  setContent={setContent} 
                />
              </div>

              <button
                type="submit"
                className="btn primary w-full mt-4"
                disabled={sending || subscribers.length === 0}
              >
                {sending
                  ? "Sending Broadcast..."
                  : `Send to ${subscribers.length} Subscribers`}
              </button>
            </form>
          </div>
        </div>

        <div className="admin-form" style={{ margin: 0 }}>
          <div className="form-section">
            <h3>Subscriber List ({subscribers.length})</h3>

            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "15px" }}>
              {subscribers.map((sub, idx) => (
                <div
                  key={sub._id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid var(--border-color)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {idx + 1}. {sub.email}
                  </span>

                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}

              {subscribers.length === 0 && <p>No subscribers yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;