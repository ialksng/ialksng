import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import { AuthContext } from "../auth/AuthContext";

// Optional: Keep or remove depending on your migration to Tailwind
// import "./Checkout.css";

function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

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
        name: "Ialksng Resources",
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
              toast.success("Payment successful 🎉 Redirecting...");
              // Redirect exactly to gurukul.ialksng.com upon success
              window.location.href = "https://gurukul.ialksng.com";
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
        theme: { color: "#f97316" }, // Adjusted theme color to match the orange Buy button
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-medium text-gray-600 animate-pulse">Loading secure checkout...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Delivery & Item Info */}
          <div className="flex-1 space-y-6">
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Digital Delivery Address</h3>
              <p className="text-gray-600 text-sm">
                Access will be granted immediately to your account:<br/>
                <strong className="text-gray-900 block mt-1">{user?.email}</strong>
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Review Item</h3>
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-semibold text-gray-900">{product.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold text-red-600 mt-2">₹{product.price}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>
              
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>₹{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Order Total:</span>
                  <span>₹{product.price}</span>
                </div>
              </div>

              <button 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-md font-medium shadow-sm transition-colors mb-3" 
                onClick={handlePayment}
              >
                Place Your Order
              </button>

              <div className="text-center">
                <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                  Secured by Razorpay
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;