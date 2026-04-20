import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Loader from "../../core/components/Loader";
import axios from "../../core/utils/axios";
import toast from "react-hot-toast";
import "./AccessProduct.css";

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

  const API =
    import.meta.env.VITE_API_URL ||
    "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ADMIN BYPASS LOGIC
        if (user && user.role === "admin") {
          const res = await axios.get(`/products/${id}`);
          setProduct(res.data.product || res.data);
          setLoading(false);
          return;
        }

        // Regular User Paid Access Check
        const res = await fetch(`${API}/api/products/access/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
  }, [id, API, user]);

  const updateComments = (comments) => {
    setProduct((prev) => ({ ...prev, comments }));
  };

  const handleDownload = async (e, url, title) => {
    e.preventDefault();
    setDownloading(true);
    const downloadToast = toast.loading("Preparing download...");

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
      toast.success("Download started!", { id: downloadToast });
    } catch {
      window.open(url, "_blank");
      toast.success("Opened in new tab", { id: downloadToast });
    } finally {
      setDownloading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like items.");

    try {
      const res = await axios.post(
        `/products/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProduct((prev) => ({ ...prev, likes: res.data }));
    } catch (err) {
      toast.error("Failed to like product");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const commentPromise = axios.post(
      `/products/${id}/comment`,
      { text: commentText },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

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
                const res = await axios.delete(`/products/${id}/comment/${commentId}`, {
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

    const editPromise = axios.put(
      `/products/${id}/comment/${commentId}`,
      { text: editText },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

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

  if (denied) {
    return (
      <div className="access__denied">
        <h2>Access Denied 🔒</h2>
        <button
          onClick={() => navigate("/store")}
          className="btn-primary"
        >
          Browse Store
        </button>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="access__wrapper">
      <button
        className="access__back-btn"
        onClick={() => navigate("/my-purchases")}
      >
        ⬅ Back
      </button>

      <h1 className="access__title">{product.title}</h1>
      <p className="access__desc">{product.description}</p>

      {product.fileUrl && (
        <button
          className="access__download-btn"
          onClick={(e) =>
            handleDownload(e, product.fileUrl, product.title)
          }
        >
          {downloading ? "Downloading..." : "Download"}
        </button>
      )}

      <div className="social-container">
        <div className="social-actions-bar">
          <button
            className={`like-btn ${
              product.likes?.includes(user?._id) ? "liked" : ""
            }`}
            onClick={handleLike}
          >
            {product.likes?.includes(user?._id) ? "❤️" : "🤍"}
            <span>{product.likes?.length || 0} Likes</span>
          </button>

          <button
            className="like-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
          >
            🔗 Share
          </button>
        </div>

        <div className="comments-wrapper">
          <h2 className="comments-header">
            Discussion ({product.comments?.length || 0})
          </h2>

          {user ? (
            <form
              onSubmit={handleComment}
              className="comment-input-area"
            >
              <textarea
                className="comment-textarea"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                required
                rows="3"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="btn-primary"
                style={{ alignSelf: "flex-end" }}
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="access__login-prompt">
              <p style={{ margin: 0 }}>
                Please{" "}
                <span
                  className="access__login-link"
                  onClick={() => navigate("/login")}
                >
                  log in
                </span>{" "}
                to join the conversation.
              </p>
            </div>
          )}

          <div>
            {!product.comments || product.comments.length === 0 ? (
              <p className="access__empty-comments">
                Be the first to leave a comment!
              </p>
            ) : (
              product.comments
                .slice()
                .reverse()
                .map((c) => (
                  <div key={c._id} className="comment-card">
                    <div className="comment-avatar">
                      {c.user.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div className="comment-meta">
                        <div>
                          <span className="comment-author">
                            {c.user}
                          </span>
                          <span className="comment-date">
                            {new Date(c.date).toLocaleDateString()}
                          </span>
                        </div>

                        {user &&
                          user._id === c.userId && (
                            <div className="comment-actions">
                              <button
                                onClick={() => {
                                  setEditingCommentId(
                                    c._id
                                  );
                                  setEditText(c.text);
                                }}
                                className="comment-action-btn edit"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComment(c._id)
                                }
                                className="comment-action-btn delete"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                      </div>

                      {editingCommentId === c._id ? (
                        <form
                          onSubmit={(e) =>
                            handleEditCommentSubmit(
                              e,
                              c._id
                            )
                          }
                          className="comment-edit-form"
                        >
                          <textarea
                            value={editText}
                            onChange={(e) =>
                              setEditText(e.target.value)
                            }
                            className="comment-textarea"
                            rows="2"
                            style={{
                              marginBottom: "10px",
                            }}
                          />
                          <div className="comment-edit-actions">
                            <button
                              type="submit"
                              className="btn-primary"
                              style={{
                                padding: "8px 16px",
                                fontSize: "13px",
                              }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingCommentId(null)
                              }
                              className="btn-secondary"
                              style={{
                                padding: "8px 16px",
                                fontSize: "13px",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="comment-text">
                          {c.text}
                        </p>
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