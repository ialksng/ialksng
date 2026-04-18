import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
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
      } catch (err) {
        toast.error("Failed to load blog.");
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
    if (!user) return toast.error("Please log in to like this post.");
    try {
      const res = await axios.post(`/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBlogData((prev) => ({
        ...prev,
        blog: { ...prev.blog, likes: res.data }
      }));
    } catch (err) {
      toast.error("Failed to like post.");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to join the conversation.");
      navigate("/login", { state: { from: `/blog/${id}` } });
      return;
    }

    if (!commentText.trim()) return;

    const commentPromise = axios.post(`/blogs/${id}/comment`, { text: commentText }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    toast.promise(commentPromise, {
      loading: 'Posting...',
      success: (res) => {
        updateComments(res.data);
        setCommentText("");
        return "Comment posted!";
      },
      error: "Failed to post comment",
    });
  };

  const handleDeleteComment = (commentId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Delete this comment?</span>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting...");
              try {
                const res = await axios.delete(`/blogs/${id}/comment/${commentId}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                updateComments(res.data);
                toast.success("Comment deleted", { id: loadingToast });
              } catch (err) {
                toast.error("Failed to delete", { id: loadingToast });
              }
            }} 
            style={{ flex: 1, padding: '6px 12px', background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            style={{ flex: 1, padding: '6px 12px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleEditCommentSubmit = async (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const editPromise = axios.put(`/blogs/${id}/comment/${commentId}`, { text: editText }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    toast.promise(editPromise, {
      loading: 'Saving edit...',
      success: (res) => {
        updateComments(res.data);
        setEditingCommentId(null);
        setEditText("");
        return "Comment updated!";
      },
      error: "Failed to update comment",
    });
  };

  if (loading) return <Loader />;
  if (!blogData || !blogData.blog) return <h2 style={{textAlign: "center", color: "var(--text-muted)", marginTop: "5rem"}}>Blog Not found</h2>;

  const { blog, notionContent } = blogData;

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">

        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
          ← Back to Blogs
        </button>

        <h1 className="blogdetail__title">{blog.title}</h1>

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
              toast.success("Link copied to clipboard!");
            }}>
              🔗 Share
            </button>
          </div>

          <div className="comments-wrapper">
            <h2 className="comments-header">Discussion ({blog.comments?.length || 0})</h2>

            <form onSubmit={handleComment} className="comment-input-area">
              <textarea 
                className="comment-textarea"
                placeholder={user ? "Share your thoughts..." : "Please log in to join the conversation..."} 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
                readOnly={!user}
                onClick={() => !user && toast.error("Please log in to comment.")}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ alignSelf: "flex-end", padding: "10px 20px" }}
              >
                Post Comment
              </button>
            </form>

            <div className="comment-list">
              {(!blog.comments || blog.comments.length === 0) ? (
                <p className="blogdetail__empty-comments">
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
                            <button type="submit" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Save</button>
                            <button type="button" onClick={() => setEditingCommentId(null)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>Cancel</button>
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