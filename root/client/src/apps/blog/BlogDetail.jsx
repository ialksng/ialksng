import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "../../core/utils/axios";
import Loader from "../../core/components/Loader";
import NotionRenderer from "../lms/NotionRenderer";
import { AuthContext } from "../../features/auth/AuthContext";
import "./BlogDetail.css";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/blogs/${id}`);
        setBlogData(data.blog ? data : { blog: data, notionContent: null });
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const updateComments = (comments) => {
    setBlogData((prev) => ({
      ...prev,
      blog: { ...prev.blog, comments }
    }));
  };

  const handleLike = async () => {
    if (!user) return alert("Login required");
    const res = await axios.post(`/blogs/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setBlogData((prev) => ({
      ...prev,
      blog: { ...prev.blog, likes: res.data }
    }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await axios.post(`/blogs/${id}/comment`, { text: commentText }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    updateComments(res.data);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    const res = await axios.delete(`/blogs/${id}/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    updateComments(res.data);
  };

  const handleEditCommentSubmit = async (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const res = await axios.put(`/blogs/${id}/comment/${commentId}`, { text: editText }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    updateComments(res.data);
    setEditingCommentId(null);
    setEditText("");
  };

  if (loading) return <Loader />;
  if (!blogData || !blogData.blog) return <h2>Not found</h2>;

  const { blog, notionContent } = blogData;

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">

        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
          ← Back
        </button>

        <h1>{blog.title}</h1>

        <div className="blogdetail__content">
          {notionContent ? (
            <NotionRenderer content={notionContent} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {blog.content}
            </ReactMarkdown>
          )}
        </div>

        <div className="social-container">
          <div className="social-actions-bar">
            <button 
              className={`like-btn ${blog.likes?.includes(user?._id) ? 'liked' : ''}`} 
              onClick={handleLike}
            >
              {blog.likes?.includes(user?._id) ? '❤️' : '🤍'} 
              <span>{blog.likes?.length || 0} Likes</span>
            </button>
            
            <button className="like-btn" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}>
              🔗 Share
            </button>
          </div>

          <div className="comments-wrapper">
            <h2 className="comments-header">Discussion ({blog.comments?.length || 0})</h2>

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
              {(!blog.comments || blog.comments.length === 0) ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
                  Be the first to leave a comment!
                </p>
              ) : (
                blog.comments.slice().reverse().map((c) => (
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
    </div>
  );
}

export default BlogDetail;