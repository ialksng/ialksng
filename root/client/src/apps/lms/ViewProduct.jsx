import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShareAlt, FaGraduationCap, FaLock } from "react-icons/fa";

import axios from "../../core/utils/axios";
import { AuthContext } from "../../features/auth/AuthContext";
import Loader from "../../core/components/Loader";
import toast from "react-hot-toast";

import "./ViewProduct.css";

function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndAccess = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data.product || data);
        setComments((data.product || data).comments || []);
        
        if (user) {
          setIsLiked((data.product || data).likes?.includes(user._id));
          
          if (user.role === "admin") {
            setHasAccess(true);
          } else {
            const accessRes = await axios.get(`/orders/check/${id}`);
            if (accessRes.data.msg === "Access granted") {
              setHasAccess(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndAccess();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like this course.");
    
    setIsLiked(!isLiked);
    try {
      await axios.post(`/products/${id}/like`);
    } catch (err) {
      setIsLiked(isLiked); // revert on fail
      toast.error("Failed to update like.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Course link copied to clipboard!");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const toastId = toast.loading("Posting comment...");
    try {
      const res = await axios.post(`/products/${id}/comment`, { text: commentText });
      setComments(res.data);
      setCommentText("");
      toast.success("Comment posted!", { id: toastId });
    } catch (err) {
      toast.error("Failed to post comment", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="vp-loader-wrapper">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="vp-not-found">
        <h2>Course Not Found</h2>
        <button onClick={() => navigate("/store")} className="vp-btn-secondary">Back to Store</button>
      </div>
    );
  }

  return (
    <div className="vp-page-wrapper">
      <div className="vp-container">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="vp-main-content">
          <div className="vp-hero-image">
            <img src={product.image || "/default-product.png"} alt={product.title} />
            <span className="vp-badge-category">{product.category}</span>
          </div>

          <div className="vp-header-info">
            <h1 className="vp-title">{product.title}</h1>
            <p className="vp-description">{product.description}</p>
          </div>

          <div className="vp-discussion-section">
            <div className="vp-discussion-header">
              <h2><FaComment /> Discussion ({comments.length})</h2>
              <div className="vp-social-actions">
                <button className={`vp-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                  {isLiked ? <FaHeart /> : <FaRegHeart />} {isLiked ? "Liked" : "Like"}
                </button>
                <button className="vp-action-btn" onClick={handleShare}>
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>

            <div className="vp-comment-box">
              {user ? (
                <form onSubmit={handleCommentSubmit} className="vp-comment-form">
                  <div className="vp-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                  <div className="vp-input-group">
                    <textarea
                      placeholder="Ask a question or share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows="3"
                    />
                    <button type="submit" className="vp-btn-primary" disabled={!commentText.trim()}>Post</button>
                  </div>
                </form>
              ) : (
                <div className="vp-login-prompt">
                  <p>Join the conversation!</p>
                  <button onClick={() => navigate("/login")} className="vp-btn-secondary">Log in to comment</button>
                </div>
              )}
            </div>

            <div className="vp-comments-list">
              {comments.length === 0 ? (
                <div className="vp-empty-comments">No comments yet. Be the first to start the discussion!</div>
              ) : (
                [...comments].reverse().map((c) => (
                  <div key={c._id} className="vp-comment-item">
                    <div className="vp-avatar">{c.user.charAt(0).toUpperCase()}</div>
                    <div className="vp-comment-content">
                      <div className="vp-comment-meta">
                        <span className="vp-comment-author">{c.user}</span>
                        <span className="vp-comment-date">{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      <p className="vp-comment-text">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Action Sidebar */}
        <div className="vp-sidebar">
          <div className="vp-action-card">
            <div className="vp-price-block">
              {hasAccess ? (
                <div className="vp-status-owned">
                  <span className="vp-owned-badge">✓ Owned</span>
                  <span className="vp-access-text">You have full access to this material.</span>
                </div>
              ) : (
                <>
                  <span className="vp-price-label">Enrollment Fee</span>
                  <div className="vp-price-amount">
                    {product.price === 0 ? "Free" : `₹${product.price}`}
                  </div>
                </>
              )}
            </div>

            <div className="vp-card-actions">
              {hasAccess ? (
                 <button 
                    className="vp-btn-course"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }}
                    onClick={() => {
                      const category = (product.category || "").toLowerCase();
                      // ⬇️ Redirect to Gurukul ONLY if it's LMS content
                      if (category === "course" || category === "roadmap" || category === "notes") {
                        const token = localStorage.getItem("token");
                        if (token) {
                            window.location.href = `https://gurukul.ialksng.me/auth-bridge?token=${token}&productId=${product._id}`;
                        } else {
                            window.location.href = "https://gurukul.ialksng.me/login";
                        }
                      } else {
                         // Fallback for standalone files
                         navigate(`/access/${product._id}`);
                      }
                    }}
                  >
                    <FaGraduationCap size={18} /> Start Learning in Gurukul
                  </button>
              ) : (
                <button 
                  className="vp-btn-buy"
                  onClick={() => navigate(`/checkout/${id}`)}
                >
                  <FaLock /> Unlock Now
                </button>
              )}
            </div>

            <ul className="vp-features-list">
              <li>✓ Full lifetime access</li>
              <li>✓ Access to community discussion</li>
              <li>✓ Secure 256-bit checkout</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ViewProduct;