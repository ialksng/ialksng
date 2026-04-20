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
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const API =
    import.meta.env.VITE_API_URL ||
    "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (user && user.role === "admin") {
          const res = await axios.get(`/products/${id}`);
          setProduct(res.data.product || res.data);
          setLoading(false);
          return;
        }

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
    } catch {
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
      loading: "Posting...",
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
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span>Delete this comment?</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting...");
              try {
                const res = await axios.delete(
                  `/products/${id}/comment/${commentId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                updateComments(res.data);
                toast.success("Deleted", { id: loadingToast });
              } catch {
                toast.error("Failed", { id: loadingToast });
              }
            }}
            style={{
              flex: 1,
              padding: "6px",
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
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
      loading: "Saving...",
      success: (res) => {
        updateComments(res.data);
        setEditingCommentId(null);
        setEditText("");
        return "Updated!";
      },
      error: "Failed",
    });
  };

  if (loading) return <Loader />;

  if (denied) {
    return (
      <div className="access__denied">
        <h2>Access Denied 🔒</h2>
        <button onClick={() => navigate("/store")} className="btn-primary">
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
        onClick={() => navigate("/store")}
      >
        ⬅ Back
      </button>

      <h1 className="access__title">{product.title}</h1>
      <p className="access__desc">{product.description}</p>

      <button
        className="btn-primary"
        onClick={() => window.open("https://gurukul.ialksng.me", "_self")}
        style={{
          width: "100%",
          padding: "14px",
          margin: "20px 0",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        🎓 Open Course
      </button>

      <div className="social-container">
        <div className="social-actions-bar">
          <button
            className={`like-btn ${
              product.likes?.includes(user?._id) ? "liked" : ""
            }`}
            onClick={handleLike}
          >
            {product.likes?.includes(user?._id) ? "❤️" : "🤍"}{" "}
            {product.likes?.length || 0}
          </button>

          <button
            className="like-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
          >
            🔗 Share
          </button>
        </div>

        <div className="comments-wrapper">
          <h2>Discussion ({product.comments?.length || 0})</h2>

          {user ? (
            <form onSubmit={handleComment}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write something..."
                required
              />
              <button type="submit" className="btn-primary">
                Post
              </button>
            </form>
          ) : (
            <p onClick={() => navigate("/login")}>Login to comment</p>
          )}

          {!product.comments?.length ? (
            <p>No comments yet</p>
          ) : (
            product.comments
              .slice()
              .reverse()
              .map((c) => (
                <div key={c._id}>
                  <b>{c.user}</b>

                  {editingCommentId === c._id ? (
                    <form
                      onSubmit={(e) =>
                        handleEditCommentSubmit(e, c._id)
                      }
                    >
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button type="submit">Save</button>
                      <button onClick={() => setEditingCommentId(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>{c.text}</p>
                      {user && user._id === c.userId && (
                        <>
                          <button
                            onClick={() => {
                              setEditingCommentId(c._id);
                              setEditText(c.text);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AccessProduct;