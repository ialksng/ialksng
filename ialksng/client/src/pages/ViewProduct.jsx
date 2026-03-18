import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/viewproduct.css";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  // ✅ FIX 1: fallback API
  const API =
    import.meta.env.VITE_API_URL || "https://your-backend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/access/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) throw new Error("Not authorized");

        const data = await res.json();

        // ✅ FIX 2: safe data
        setProduct(data || null);

      } catch (err) {
        console.log("Access error:", err);

        alert("You don't have access ❌");
        navigate("/");
      }
    };

    fetchProduct();
  }, [id, API, navigate]);

  if (!product) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  return (
    <div className="view__container">
      <div className="view__card">

        <button className="view__back" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <h1 className="view__title">{product.title}</h1>

        <img
          src={product.image}
          alt=""
          className="view__image"
        />

        <p className="view__desc">{product.description}</p>

        {product.fileUrl && (
          <a
            href={product.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="view__btn"
          >
            Download / View File
          </a>
        )}
      </div>
    </div>
  );
}

export default ViewProduct;