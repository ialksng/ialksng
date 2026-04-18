import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Loader from "../../core/components/Loader";
import axios from "../../core/utils/axios";

function AccessProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/access/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          setDenied(true);
        }
      } catch {
        setDenied(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API]);

  const updateComments = (comments) => {
    setProduct((prev) => ({ ...prev, comments }));
  };

  const handleDownload = async (e, url, title) => {
    e.preventDefault();
    setDownloading(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `${title.replace(/\s+/g, "_")}_Download`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobURL);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return alert("Please login.");

    const res = await axios.post(`/products/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setProduct((prev) => ({ ...prev, likes: res.data }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await axios.post(`/products/${id}/comment`, { text: commentText }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    updateComments(res.data);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    const res = await axios.delete(`/products/${id}/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    updateComments(res.data);
  };

  const handleEditCommentSubmit = async (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const res = await axios.put(`/products/${id}/comment/${commentId}`, { text: editText }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    updateComments(res.data);
    setEditingCommentId(null);
    setEditText("");
  };

  if (loading) return <Loader />;

  if (denied) {
    return (
      <div style={{ color: "white", padding: "100px 20px", textAlign: "center" }}>
        <h2 style={{ color: "#ef4444" }}>Access Denied 🔒</h2>
        <button onClick={() => navigate("/store")} className="btn primary">
          Browse Store
        </button>
      </div>
    );
  }

  if (!product) return <div style={{ color: "white" }}>Product not found</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      
      <button className="btn secondary" onClick={() => navigate("/my-purchases")}>
        ⬅ Back
      </button>

      <h1>{product.title}</h1>
      <p>{product.description}</p>

      {product.fileUrl && (
        <button onClick={(e) => handleDownload(e, product.fileUrl, product.title)}>
          {downloading ? "Downloading..." : "Download"}
        </button>
      )}

      <div className="social-container">
        <div className="social-actions-bar">
          <button 
            className={`like-btn ${product.likes?.includes(user?._id) ? 'liked' : ''}`} 
            onClick={handleLike}
          >
            {product.likes?.includes(user?._id) ? '❤️' : '🤍'} 
            <span>{product.likes?.length || 0} Likes</span>
          </button>
          
          <button className="like-btn" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }}>
            🔗 Share
          </button>
        </div>

        <div className="comments-wrapper">
          <h2 className="comments-header">Discussion ({product.comments?.length || 0})</h2>

          {user ? (
            <form onSubmit={handleComment} className="comment-input-area">
              <textarea 
                className="comment-textarea"
                placeholder="Share your thoughts..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows="3"
              />
              <button type="submit" disabled={!commentText.trim()} className="btn primary" style={{ alignSelf: "flex-end" }}>
                Post Comment
              </button>
            </form>
          ) : (
            <div style={{ marginBottom: "30px", padding: "16px", background: "rgba(56, 189, 248, 0.1)", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              <p style={{ margin: 0, color: "#e2e8f0" }}>
                Please <span onClick={() => navigate("/login")} style={{color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold'}}>log in</span> to join the conversation.
              </p>
            </div>
          )}

          <div>
            {(!product.comments || product.comments.length === 0) ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
                Be the first to leave a comment!
              </p>
            ) : (
              product.comments.slice().reverse().map((c) => (
                <div key={c._id} className="comment-card">
                  <div className="comment-avatar">
                    {c.user.charAt(0).toUpperCase()}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div className="comment-meta">
                      <div>
                        <span className="comment-author">{c.user}</span>
                        <span className="comment-date">{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      
                      {user && user._id === c.userId && (
                        <div className="comment-actions">
                          <button onClick={() => { setEditingCommentId(c._id); setEditText(c.text); }} className="comment-action-btn edit">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteComment(c._id)} className="comment-action-btn delete">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editingCommentId === c._id ? (
                      <form onSubmit={(e) => handleEditCommentSubmit(e, c._id)} style={{ marginTop: "10px" }}>
                        <textarea 
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="comment-textarea"
                          rows="2"
                          style={{ marginBottom: "10px" }}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button type="submit" className="btn primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Save</button>
                          <button type="button" onClick={() => setEditingCommentId(null)} className="btn secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <p className="comment-text">{c.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessProduct;