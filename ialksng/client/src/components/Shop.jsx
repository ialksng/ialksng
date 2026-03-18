import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/shop.css";
import toast from "react-hot-toast";

function Shop() {
  const [products, setProducts] = useState([]);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [addedId, setAddedId] = useState(null); // 🔥 NEW

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // 🔹 fetch products
  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.log(err));
  }, []);

  // 🔹 fetch purchased products
  useEffect(() => {
    if (!user) return;

    fetch(`${API}/api/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const ids = data.orders.map(o => o.product._id);
        setOwnedProducts(ids);
      })
      .catch(() => {});
  }, [user]);

  // 🔹 handle add to cart
  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/shop" } });
      return;
    }

    addToCart(product);
    toast.success("Added to cart 🛒");

    // 🔥 visual feedback
    setAddedId(product._id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  return (
    <section id="shop" className="shop">
      <h2>Shop</h2>

      <div className="shop__grid">
        {products.map((product) => (
          <div className="shop__card" key={product._id}>
            
            <img src={product.image} alt={product.title} />

            <h3>{product.title}</h3>
            <p>{product.description}</p>

            <h4>₹{product.price}</h4>

            {/* 🔥 BUTTON LOGIC */}
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
                disabled={addedId === product._id} // 🔥 disable briefly
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
        ))}
      </div>
    </section>
  );
}

export default Shop;