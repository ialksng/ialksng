import React, { useState, useEffect } from "react";
import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";
import toast from "react-hot-toast";
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
        toast.error("Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!subject || !content) {
      toast.error("Fill subject and content");
      return;
    }

    if (!window.confirm(`Send to ${subscribers.length} users?`)) return;

    setSending(true);
    const id = toast.loading("Sending...");

    try {
      const res = await axios.post(
        "/newsletter/send",
        { subject, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success(res.data.msg || "Sent", { id });
      setSubject("");
      setContent("");

    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed", { id });
    }

    setSending(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
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

            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Write subject..."
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <Editor content={content} setContent={setContent} />
              </div>

              <button
                type="submit"
                className="btn primary w-full"
                disabled={sending || subscribers.length === 0}
              >
                {sending ? "Sending..." : `Send to ${subscribers.length}`}
              </button>
            </form>
          </div>
        </div>

        <div className="admin-form" style={{ margin: 0 }}>
          <div className="form-section">
            <h3>Subscribers ({subscribers.length})</h3>

            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "15px" }}>
              {subscribers.map((sub, idx) => (
                <div
                  key={sub._id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid var(--border-color)",
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <span>{idx + 1}. {sub.email}</span>
                  <span style={{ fontSize: "11px" }}>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;