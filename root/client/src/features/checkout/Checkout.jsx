import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import { AuthContext } from "../auth/AuthContext";

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
        toast.error("Payment SDK not loaded", { style: { background: '#334155', color: '#fff' }});
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
          toast.error("Session expired. Please login again.", { style: { background: '#334155', color: '#fff' }});
          navigate("/login");
          return;
        }
        return toast.error(data.error || "Failed to create order", { style: { background: '#334155', color: '#fff' }});
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
          const loadingToast = toast.loading("Verifying payment...", { style: { background: '#334155', color: '#fff' }});
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
              return toast.error("Payment verification failed ❌", { style: { background: '#334155', color: '#fff' }});
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
              toast.success("Payment successful 🎉 Redirecting...", { style: { background: '#334155', color: '#fff' }});
              window.location.href = "https://gurukul.ialksng.com";
            } else {
              toast.error("Order saving failed ❌", { style: { background: '#334155', color: '#fff' }});
            }
          } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Error after payment", { style: { background: '#334155', color: '#fff' }});
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled", { icon: "ℹ️", style: { background: '#334155', color: '#fff' } });
          },
        },
        theme: { color: "#0ea5e9" }, // Adjusted to match the sky-500 Tailwind color used in the UI
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment failed ❌", { style: { background: '#334155', color: '#fff' }});
      });
      rzp.open();
    } catch (err) {
      toast.error("Payment failed", { style: { background: '#334155', color: '#fff' }});
    }
  };

  if (!user || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h2 className="text-xl font-medium text-slate-400 animate-pulse">Loading secure checkout...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Delivery & Item Info */}
          <div className="flex-1 space-y-6">
            
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-500/20 text-sky-400 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Digital Delivery Address</h3>
              </div>
              <p className="text-slate-400 text-sm ml-11">
                Access will be granted immediately to your account:<br/>
                <strong className="text-white block mt-1.5 text-base">{user?.email}</strong>
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-sky-500/20 text-sky-400 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Review Item</h3>
              </div>

              <div className="flex gap-5 ml-2">
                <div className="w-28 h-28 flex-shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">{product.category}</span>
                  <h4 className="font-bold text-white text-lg">{product.title}</h4>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2 max-w-sm">{product.description}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-80">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-5 border-b border-slate-700 pb-3">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Item Subtotal:</span>
                  <span className="text-white font-medium">₹{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Platform Fee:</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-5 mb-8">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Total:</span>
                  <span>₹{product.price}</span>
                </div>
              </div>

              <button 
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98] mb-4" 
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>

              <div className="text-center bg-slate-900/50 py-3 rounded-lg border border-slate-700/50">
                <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                  256-bit Secure Checkout
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