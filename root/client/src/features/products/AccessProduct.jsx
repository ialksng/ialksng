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

    try {
      const res = await axios.post(`/products/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setProduct((prev) => ({ ...prev, likes: res.data }));
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/products/${id}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      updateComments(res.data);
      setCommentText("");
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await axios.delete(`/products/${id}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      updateComments(res.data);
    } catch {}
  };

  const handleEditCommentSubmit = async (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      const res = await axios.put(`/products/${id}/comment/${commentId}`, { text: editText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      updateComments(res.data);
      setEditingCommentId(null);
      setEditText("");
    } catch {}
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

      <hr />

      <h2>Discussion</h2>

      <button onClick={handleLike}>
        {product.likes?.includes(user?._id) ? "❤️" : "🤍"} {product.likes?.length || 0}
      </button>

      <form onSubmit={handleComment}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {product.comments?.slice().reverse().map((c) => (
        <div key={c._id} style={{ marginTop: "15px" }}>

          <strong>
            {c.user} {user?._id === c.userId && "(You)"}
          </strong>

          {editingCommentId === c._id ? (
            <form onSubmit={(e) => handleEditCommentSubmit(e, c._id)}>
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
              <button>Save</button>
              <button type="button" onClick={() => setEditingCommentId(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <p>{c.text}</p>
          )}

          {user && user._id === c.userId && (
            <>
              <button onClick={() => {
                setEditingCommentId(c._id);
                setEditText(c.text);
              }}>
                Edit
              </button>

              <button onClick={() => handleDeleteComment(c._id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AccessProduct;