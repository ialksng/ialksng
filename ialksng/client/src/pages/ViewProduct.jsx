import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/viewProduct.css";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/products/access/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => {
        alert("You don't have access ❌");
        navigate("/");
      });
  }, [id]);

  if (!product) return <h2 style={{ color: "white" }}>Loading...</h2>;

  return (
    <div className="view__container">
      <div className="view__card">

        {/* 🔙 back */}
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

        {/* 🔥 download */}
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