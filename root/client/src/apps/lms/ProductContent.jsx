import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaLock } from "react-icons/fa";
import axios from "../../core/utils/axios";
import Loader from "../../core/components/Loader";

function ProductContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSecureProduct = async () => {
      try {
        const res = await axios.get(`/products/secure/${id}`);
        
        if (res.data.success) {
          setProductData(res.data.data);
        } else {
          setError("Access Denied");
        }
      } catch (err) {
        console.error("Access check error:", err);
        setError(err.response?.data?.message || "You do not have permission to view this.");
      } finally {
        setLoading(false);
      }
    };

    fetchSecureProduct();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader /></div>;

  if (error || !productData) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", color: "white" }}>
        <FaLock size={50} color="#ef4444" style={{ marginBottom: "20px" }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Access Denied</h2>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>{error}</p>
        <button 
          onClick={() => navigate(`/checkout/${id}`)}
          style={{ background: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          View Purchase Options
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "2rem", backgroundColor: "#1e293b", borderRadius: "12px", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "10px" }}>
           Premium Content 🔓
        </h2>
        <p style={{ color: "#9ca3af", marginTop: "10px" }}>{productData.title}</p>
      </div>

      <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "8px" }}>
        <p style={{ marginBottom: "20px", color: "#e2e8f0" }}>
          Thank you for your purchase. Your digital files are ready for download.
        </p>
        
        {productData.fileUrl ? (
          <a 
            href={productData.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#10b981", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", transition: "all 0.3s" }}
          >
            <FaDownload /> Download Resources
          </a>
        ) : (
          <p style={{ color: "#fbbf24" }}>No downloadable files were attached to this product.</p>
        )}
      </div>
    </div>
  );
}

export default ProductContent;