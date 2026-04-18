import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import { AuthContext } from "../auth/AuthContext";

import "./Checkout.css";

function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const API =
    import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  useEffect(() => {
    if (!user || !token) {
      navigate("/login", {
        state: { from: `/checkout/${id}` },
      });
    }
  }, [user, token, navigate, id]);

  useEffect(() => {
    if (!user) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product || null);
      } catch (err) {
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id, API, user]);

  const handlePayment = async () => {
    try {
      if (!product) return;

      if (!window.Razorpay) {
        toast.error("Payment SDK not loaded");
        return;
      }

      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }
        return toast.error(data.error || "Failed to create order");
      }

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: product.title,
        order_id: order.id,
        handler: async function (response) {
          const loadingToast = toast.loading("Verifying payment...");
          try {
            const verifyRes = await fetch(
              `${API}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              toast.dismiss(loadingToast);
              return toast.error("Payment verification failed ❌");
            }

            const orderRes = await fetch(`${API}/api/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                product: id,
                paymentId: response.razorpay_payment_id,
              }),
            });

            const orderData = await orderRes.json();
            toast.dismiss(loadingToast);

            if (orderData.success) {
              toast.success("Payment successful 🎉");
              navigate("/my-purchases");
            } else {
              toast.error("Order saving failed ❌");
            }
          } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Error after payment");
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment failed ❌");
      });
      rzp.open();
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  if (!user || !product) {
    return <h2 className="checkout__loading">Loading...</h2>;
  }

  return (
    <div className="checkout__wrapper">
      <div className="checkout__header">
        <h1>Secure Checkout</h1>
      </div>

      <div className="checkout__grid">
        <div className="checkout__left">
          <div className="checkout__section">
            <h3>1. Digital Delivery Address</h3>
            <p className="checkout__delivery-text">
              Access will be granted immediately to your account:{" "}
              <strong>{user?.email}</strong>
            </p>
          </div>

          <div className="checkout__section">
            <h3>2. Review Item</h3>
            <div className="checkout__product">
              <img src={product.image} alt={product.title} />
              <div className="checkout__product-info">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <p className="checkout__product-price">₹{product.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout__right">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items:</span>
            <span>₹{product.price}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee:</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-total">
            <span>Order Total:</span>
            <span>₹{product.price}</span>
          </div>

          <button className="checkout__btn" onClick={handlePayment}>
            Place Your Order
          </button>

          <div className="trust-badge">🔒 Secured by Razorpay.</div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;