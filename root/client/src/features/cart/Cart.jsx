import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import { AuthContext } from "../auth/AuthContext";
import { CartContext } from "./CartContext";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";
  const token = localStorage.getItem("token");

  const removeItem = (id) => {
    const index = cart.findIndex((item) => item._id === id);
    if (index !== -1) {
      const updated = [...cart];
      updated.splice(index, 1);
      setCart(updated);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    try {
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map((item) => item._id)
        })
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.error || "Checkout failed ❌");
      }

      const order = data.order;

      if (!window.Razorpay) {
        alert("Payment SDK not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Cart Purchase",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(response)
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              return alert("Payment verification failed ❌");
            }

            const orderRes = await fetch(
              `${API}/api/orders/checkout-cart`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  items: cart,
                  paymentId: response.razorpay_payment_id
                })
              }
            );

            const orderData = await orderRes.json();

            if (orderData.success) {
              alert("Payment successful 🎉");
              setCart([]);
              navigate("/my-purchases");
            } else {
              alert("Order saving failed ❌");
            }
          } catch (err) {
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

      rzp.on("payment.failed", function () {
        alert("Payment failed ❌");
      });

      rzp.open();
    } catch (err) {
      alert("Checkout failed ❌");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 text-slate-50 min-h-[80vh]">
      <div className="mb-[30px] border-b border-white/10 pb-[15px]">
        <h1 className="text-[28px] font-semibold m-0">Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-[60px] px-5 flex flex-col items-center">
          <h2 className="text-slate-300 mb-5 text-[24px] font-medium">
            Your cart is empty.
          </h2>
          <HashLink smooth to="/#shop">
            <button className="w-full max-w-[250px] p-4 bg-amber-500 text-black rounded-lg font-semibold text-[16px] cursor-pointer transition-all hover:bg-amber-600 active:scale-95 border-none">
              Continue Shopping
            </button>
          </HashLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-[30px] items-start">
          <div className="flex flex-col gap-5">
            <div className="bg-slate-800/40 border border-white/10 rounded-xl p-6">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-5 pb-5 mb-5 border-b border-white/5 last:border-none last:mb-0 last:pb-0">
                  <img src={item.image} alt={item.title} className="w-[120px] h-[120px] object-cover rounded-lg border border-white/10" />
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-[18px] m-0 mb-2">{item.title}</h3>
                    <p className="text-[20px] font-bold text-sky-400 m-0 mb-3">₹{item.price}</p>
                    <button
                      className="self-start bg-transparent text-red-500 border border-red-500/30 py-1.5 px-3 rounded-md text-[13px] font-semibold cursor-pointer transition-colors hover:bg-red-500/10"
                      onClick={() => removeItem(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/10 rounded-xl p-6 lg:sticky lg:top-[100px]">
            <h3 className="text-[18px] m-0 mb-5 border-b border-white/10 pb-2.5">Subtotal ({cart.length} items)</h3>
            
            <div className="flex justify-between mb-3 text-[14px] text-slate-300">
              <span>Items Total:</span>
              <span>₹{total}</span>
            </div>
            
            <div className="flex justify-between mb-3 text-[14px] text-slate-300">
              <span>Delivery:</span>
              <span className="text-emerald-500">Instant Digital</span>
            </div>
            
            <div className="flex justify-between mt-5 pt-5 border-t border-dashed border-white/10 text-[20px] font-bold text-white [&>span:last-child]:text-sky-400">
              <span>Order Total:</span>
              <span>₹{total}</span>
            </div>

            <button
              className="w-full block mx-auto p-4 bg-amber-500 text-black rounded-lg font-semibold text-[16px] cursor-pointer mt-6 border-none transition-all hover:bg-amber-600 active:scale-95"
              onClick={handleCheckout}
            >
              Proceed to Buy
            </button>

            <p className="text-[12px] text-emerald-500 text-center mt-4 mb-0 font-medium">
              🔒 Safe and secure payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;