import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AccessProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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
          alert(data.message || "Access denied");
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id, API]);

  if (!product) return <p style={{ color: "white" }}>Loading...</p>;

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