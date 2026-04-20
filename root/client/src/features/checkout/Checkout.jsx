import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import { AuthContext } from "../auth/AuthContext";
import "./Checkout.css";

function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  // 1. Check Auth and Redirect to Login if needed
  useEffect(() => {
    if (!user || !token) {
      navigate("/login", {
        state: { from: `/checkout/${id}` },
      });
    }
  }, [user, token, navigate, id]);

  // 2. Check Ownership OR Fetch Product for Purchase
  useEffect(() => {
    if (!user || !token) return;

    const verifyAndFetch = async () => {
      try {
        // A. Admin Bypass
        if (user.role === "admin") {
          toast.success("Admin access granted.");
          navigate(`/access/${id}`, { replace: true });
          return;
        }

        // B. Check if user already purchased the item
        const accessRes = await fetch(`${API}/api/orders/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const accessData = await accessRes.json();

        if (accessData.msg === "Access granted") {
          toast.success("You already have access to this course!");
          navigate(`/access/${id}`, { replace: true });
          return;
        }

        // C. If not owned, fetch product details to display the Checkout page
        const productRes = await fetch(`${API}/api/products/${id}`);
        const productData = await productRes.json();
        setProduct(productData.product || null);

      } catch (err) {
        setProduct(null);
        toast.error("Failed to load product information.");
      } finally {
        setIsCheckingAccess(false);
      }
    };

    verifyAndFetch();
  }, [id, API, user, token, navigate]);

  const handlePayment = async () => {
    try {
      if (!product) return;

      if (!window.Razorpay) {
        toast.error("Payment SDK not loaded", {
          style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)' }
        });
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
          toast.error("Session expired. Please login again.", {
            style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)' }
          });
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
        name: "Ialksng Resources",
        description: product.title,
        order_id: order.id,
        handler: async function (response) {
          const loadingToast = toast.loading("Verifying payment...", {
            style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)' }
          });
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
              toast.success("Payment successful 🎉 Redirecting...");
              
              // Local redirect restored here
              navigate(`/access/${product._id}`);
              
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
        theme: { color: "#38bdf8" }, 
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

  if (!user || isCheckingAccess || !product) {
    return (
      <div className="checkout-loader">
        <h2 className="loading-text">Loading secure checkout...</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-header">
        <h1>Secure Checkout</h1>
      </div>

      <div className="checkout-layout">
        <div className="checkout-left">
          
          <div className="checkout-section">
            <div className="section-title">
              <span className="icon-badge">1</span>
              <h3>Digital Delivery Address</h3>
            </div>
            <div className="section-content">
              <p className="delivery-note">Access will be granted immediately to your account:</p>
              <p className="delivery-email">{user?.email}</p>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-title">
              <span className="icon-badge">2</span>
              <h3>Review Item</h3>
            </div>
            <div className="section-content">
              <div className="checkout-product-card">
                <div className="product-thumb">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-details">
                  <span className="product-cat">{product.category}</span>
                  <h4>{product.title}</h4>
                  <p className="product-desc">{product.description}</p>
                  <span className="product-price">₹{product.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="summary-box">
            <h3>Order Summary</h3>
            
            <div className="summary-lines">
              <div className="line-item">
                <span>Item Subtotal:</span>
                <span>₹{product.price}</span>
              </div>
              <div className="line-item">
                <span>Platform Fee:</span>
                <span className="text-green">Free</span>
              </div>
            </div>
            
            <div className="summary-total">
              <span>Total:</span>
              <span>₹{product.price}</span>
            </div>

            <button className="checkout-btn-pay" onClick={handlePayment}>
              Proceed to Payment
            </button>

            <div className="secure-badge">
              <span>🔒 256-bit Secure Checkout by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;