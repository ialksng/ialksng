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

  const API =
    import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/access/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          setDenied(true);
        }
      } catch (err) {
        setDenied(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API]);

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
      const res = await axios.post(
        `/products/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setProduct({ ...product, likes: res.data });
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `/products/${id}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setProduct({ ...product, comments: res.data });
      setCommentText("");
    } catch {}
  };

  if (loading) return <Loader />;

  if (denied) {
    return (
      <div
        style={{
          color: "white",
          padding: "100px 20px",
          textAlign: "center",
          minHeight: "60vh"
        }}
      >
        <h2 style={{ fontSize: "32px", color: "#ef4444" }}>
          Access Denied 🔒
        </h2>
        <p style={{ color: "#94a3b8", marginTop: "10px" }}>
          You must purchase this product to access its contents.
        </p>
        <button
          onClick={() => navigate("/store")}
          className="btn primary mt-4"
        >
          Browse Store
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>
        Product not found
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
        color: "var(--text-primary)",
        minHeight: "80vh"
      }}
    >
      <button
        className="btn secondary mb-4"
        onClick={() => navigate("/my-purchases")}
      >
        ⬅ Back to Library
      </button>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "40px"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "250px",
            background: "#020617"
          }}
        >
          <img
            src={
              product.image ||
              "https://via.placeholder.com/1000x250"
            }
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.8
            }}
          />
        </div>

        <div style={{ padding: "30px" }}>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "10px",
              color: "#fff"
            }}
          >
            {product.title}
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "30px"
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              background: "rgba(56, 189, 248, 0.05)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              padding: "20px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px"
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#fff" }}>
                Digital Delivery
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--text-muted)"
                }}
              >
                Your files are ready to download securely.
              </p>
            </div>

            {product.fileUrl ? (
              <button
                onClick={(e) =>
                  handleDownload(e, product.fileUrl, product.title)
                }
                className="btn primary"
                disabled={downloading}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px"
                }}
              >
                {downloading
                  ? "Downloading..."
                  : "⬇ Download Content"}
              </button>
            ) : (
              <p style={{ color: "#f59e0b", fontWeight: 600 }}>
                Content processing...
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          padding: "30px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "20px",
            marginBottom: "20px"
          }}
        >
          <h2 style={{ margin: 0 }}>Product Discussion</h2>

          <button
            onClick={handleLike}
            style={{
              background: product.likes?.includes(user?._id)
                ? "rgba(239, 68, 68, 0.1)"
                : "transparent",
              color: product.likes?.includes(user?._id)
                ? "#ef4444"
                : "var(--text-muted)",
              border: `1px solid ${
                product.likes?.includes(user?._id)
                  ? "#ef4444"
                  : "var(--border-color)"
              }`,
              padding: "8px 16px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            {product.likes?.includes(user?._id) ? "❤️" : "🤍"}{" "}
            {product.likes?.length || 0} Likes
          </button>
        </div>

        <form
          onSubmit={handleComment}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "30px"
          }}
        >
          <textarea
            placeholder="Leave a review or ask a question..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows="3"
            style={{
              width: "100%",
              background: "#020617",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "16px",
              color: "#fff"
            }}
          />

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="btn primary"
            style={{ alignSelf: "flex-end" }}
          >
            Post Comment
          </button>
        </form>

        {(!product.comments || product.comments.length === 0) ? (
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "20px"
            }}
          >
            Be the first to leave a review!
          </p>
        ) : (
          product.comments.slice().reverse().map((c, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--accent-primary)",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}
              >
                {c.user.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ marginBottom: "5px" }}>
                  <span style={{ fontWeight: 600 }}>
                    {c.user}
                  </span>{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)"
                    }}
                  >
                    {new Date(c.date).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ margin: 0 }}>{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AccessProduct;