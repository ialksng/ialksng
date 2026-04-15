import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import "../styles/checkout.css";

function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Get user from AuthContext
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // ✅ FIX 1: fallback API
  const API =
    import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  // ✅ FIX: Redirect unauthenticated users immediately
  useEffect(() => {
    if (!user || !token) {
      navigate("/login", {
        state: { from: `/checkout/${id}` },
      });
    }
  }, [user, token, navigate, id]);

  // 🔹 fetch product
  useEffect(() => {
    // Prevent fetching if not logged in
    if (!user) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`);
        const data = await res.json();

        console.log("PRODUCT DATA:", data);

        // ✅ FIX 2: safe handling
        setProduct(data.product || null);
      } catch (err) {
        console.log("Product fetch error:", err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id, API, user]);

  const handlePayment = async () => {
    try {
      if (!product) return;

      // ⚠️ FIX 3: check Razorpay loaded
      if (!window.Razorpay) {
        alert("Payment SDK not loaded");
        return;
      }

      // 1️⃣ Create order
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });

      const data = await res.json();
      console.log("CREATE ORDER RESPONSE:", data);

      if (!data.success) {
        // Prevent crash if user token is invalid/expired
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }
        return alert(data.error || "Failed to create order");
      }

      const order = data.order;

      // 2️⃣ Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: product.title,
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3️⃣ Verify
            const verifyRes = await fetch(`${API}/api/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              return alert("Payment verification failed ❌");
            }

            // 4️⃣ Save order
            const orderRes = await fetch(`${API}/api/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                product: id,
                paymentId: response.razorpay_payment_id
              })
            });

            const orderData = await orderRes.json();

            if (orderData.success) {
              alert("Payment successful 🎉");
              navigate("/my-purchases");
            } else {
              alert("Order saving failed ❌");
            }

          } catch (err) {
            console.log("Post-payment error:", err);
            alert("Error after payment");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          }
        },

        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.log("PAYMENT FAILED:", response);
        alert("Payment failed ❌");
      });

      rzp.open();

    } catch (err) {
      console.log("Payment error:", err);
      alert("Payment failed");
    }
  };

  if (!user || !product) {
    return <h2 style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>Loading...</h2>;
  }

  return (
    <div className="checkout__container">
      <div className="checkout__card">
        <h2>Checkout</h2>

        <img
          src={product.image}
          alt={product.title}
          style={{ width: "100%", borderRadius: "10px" }}
        />

        <div className="checkout__info">
          <p><strong>{product.title}</strong></p>
          <p>{product.description}</p>
        </div>

        <div className="checkout__price">
          ₹{product.price}
        </div>

        <button className="checkout__btn" onClick={handlePayment}>
          Pay Now
        </button>
        
        {/* ✅ Explicit Delivery Timeline & Trust Line */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <p style={{ fontSize: "12px", color: "#cbd5f5", marginBottom: "5px" }}>
            ⚡ Upon successful payment, you will receive <strong>instant access</strong> to the digital product/service in your dashboard.
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8" }}>
            🔒 All payments are secured and processed via Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;