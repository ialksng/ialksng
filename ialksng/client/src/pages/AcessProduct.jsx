import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AccessProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const API = import.meta.env.VITE_API_URL;

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
        console.log("Access error:", err);
        setDenied(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API]);

  // 🔄 Loading state
  if (loading) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>
        Loading product...
      </div>
    );
  }

  // ❌ Access denied UI
  if (denied) {
    return (
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You need to purchase this product first.</p>

        <button
          onClick={() => navigate("/shop")}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            background: "#38bdf8",
            border: "none",
            borderRadius: "8px",
            color: "#020617",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Go to Shop
        </button>
      </div>
    );
  }

  // ⚠️ Fallback safety
  if (!product) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>
        Product not found
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>

      {/* 🔥 DOWNLOAD / ACCESS */}
      {product.fileUrl ? (
        <a
          href={product.fileUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            background: "#38bdf8",
            padding: "0.7rem 1.2rem",
            borderRadius: "8px",
            color: "#020617",
            fontWeight: "600"
          }}
        >
          Download / Open File
        </a>
      ) : (
        <p>No file available</p>
      )}
    </div>
  );
}

export default AccessProduct;