import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import toast from "react-hot-toast";

import { AuthContext } from "../auth/AuthContext";
import { CartContext } from "./CartContext";

import "./Cart.css";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API =
    import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

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
      toast.error("Please login to checkout");
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
        return toast.error(data.error || "Checkout failed ❌");
      }

      const order = data.order;

      if (!window.Razorpay) {
        toast.error("Payment SDK not loaded");
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
          const loadingToast = toast.loading("Verifying payment...");
          try {
            const verifyRes = await fetch(
              `${API}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response)
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              toast.dismiss(loadingToast);
              return toast.error("Payment verification failed ❌");
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
            toast.dismiss(loadingToast);

            if (orderData.success) {
              toast.success("Payment successful 🎉");
              setCart([]);
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
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment failed ❌");
      });
      rzp.open();
    } catch (err) {
      toast.error("Checkout failed ❌");
    }
  };

  return (
    <div className="cart__wrapper">
      <div className="cart__header">
        <h1>Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-msg">
          <h2>Your cart is empty.</h2>
          <HashLink smooth to="/#shop">
            <button className="cart__checkout-btn continue-btn">
              Continue Shopping
            </button>
          </HashLink>
        </div>
      ) : (
        <div className="cart__grid">
          <div className="cart__left">
            <div className="cart__items-container">
              {cart.map((item, index) => (
                <div key={index} className="cart__item">
                  <img src={item.image} alt={item.title} />
                  <div className="cart__item-info">
                    <h3>{item.title}</h3>
                    <p className="cart__item-price">₹{item.price}</p>
                    <button
                      className="cart__remove-btn"
                      onClick={() => removeItem(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart__right">
            <h3>Subtotal ({cart.length} items)</h3>
            <div className="summary-row">
              <span>Items Total:</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span className="delivery-status">Instant Digital</span>
            </div>
            <div className="summary-total">
              <span>Order Total:</span>
              <span>₹{total}</span>
            </div>

            <button className="cart__checkout-btn" onClick={handleCheckout}>
              Proceed to Buy
            </button>

            <p className="cart__secure-msg">🔒 Safe and secure payments.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;