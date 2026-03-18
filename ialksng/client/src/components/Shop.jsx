import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/shop.css";
import toast from "react-hot-toast";

function Shop() {
  const [products, setProducts] = useState([]);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // ✅ FIX 1: fallback API (prevents crash)
  const API =
    import.meta.env.VITE_API_URL || "https://your-backend.onrender.com";

  // 🔹 fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();

        // ✅ FIX 2: safe handling
        setProducts(data.products || []);
      } catch (err) {
        console.log("Products fetch error:", err);
        setProducts([]); // prevent crash
      }
    };

    fetchProducts();
  }, [API]);

  // 🔹 fetch purchased products
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        // ✅ FIX 3: safe mapping
        const ids = (data.orders || []).map(o => o.product?._id);
        setOwnedProducts(ids);
      } catch (err) {
        console.log("Orders fetch error:", err);
      }
    };

    fetchOrders();
  }, [user, API]);

  // 🔹 handle add to cart
  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/shop" } });
      return;
    }

    addToCart(product);
    toast.success("Added to cart 🛒");

    setAddedId(product._id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  return (
    <section id="shop" className="shop">
      <h2>Shop</h2>

      <div className="shop__grid">
        {products.length === 0 ? (
          <p style={{ color: "white" }}>No products available</p>
        ) : (
          products.map((product) => (
            <div className="shop__card" key={product._id}>
              <img src={product.image} alt={product.title} />

              <h3>{product.title}</h3>
              <p>{product.description}</p>

              <h4>₹{product.price}</h4>

              {ownedProducts.includes(product._id) ? (
                <button
                  onClick={() => navigate(`/access/${product._id}`)}
                  className="shop__btn view"
                >
                  View Product
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addedId === product._id}
                  className={`shop__btn ${
                    addedId === product._id ? "added" : ""
                  }`}
                >
                  {addedId === product._id
                    ? "✅ Added!"
                    : `🔒 Buy for ₹${product.price}`}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Shop;