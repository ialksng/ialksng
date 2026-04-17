import { useContext } from "react";
import { CartContext } from "../features/cart/CartContext";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { AuthContext } from "../features/auth/AuthContext";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ FIX 1: fallback API
  const API =
    import.meta.env.VITE_API_URL || "https://your-backend.onrender.com";

  const token = localStorage.getItem("token");

  // 🔹 remove ONE item
  const removeItem = (id) => {
    const index = cart.findIndex(item => item._id === id);

    if (index !== -1) {
      const updated = [...cart];
      updated.splice(index, 1);
      setCart(updated);
    }
  };

  // 🔹 total price
  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

  // 🔥 CHECKOUT ALL (RAZORPAY)
  const handleCheckout = async () => {

    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    try {
      // 1️⃣ Create Razorpay order
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => item._id)
        })
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.error || "Checkout failed ❌");
      }

      const order = data.order;

      // ⚠️ FIX 2: check Razorpay exists
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
            // 3️⃣ Verify payment
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

            // 4️⃣ Save orders in DB
            const orderRes = await fetch(`${API}/api/orders/checkout-cart`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                items: cart,
                paymentId: response.razorpay_payment_id
              })
            });

            const orderData = await orderRes.json();

            if (orderData.success) {
              alert("Payment successful 🎉");
              setCart([]);
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
        console.log("Payment Failed:", response);
        alert("Payment failed ❌");
      });

      rzp.open();

    } catch (err) {
      console.log("Checkout error:", err);
      alert("Checkout failed ❌");
    }
  };

  return (
    <div className="cart__container">
      <div className="cart__card">
        <h2>Your Cart 🛒</h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>Cart is empty 🛒</p>

            <HashLink smooth to="/#shop">
              <button className="cart__checkout">
                Go Shopping
              </button>
            </HashLink>
          </div>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="cart__item">
                <img src={item.image} alt={item.title} />

                <div>
                  <h3>{item.title}</h3>
                  <p>₹{item.price}</p>
                </div>

                <button onClick={() => removeItem(item._id)}>
                  Remove
                </button>
              </div>
            ))}

            <h3 className="cart__total">
              Total: ₹{total}
            </h3>

            <button
              className="cart__checkout"
              onClick={handleCheckout}
            >
              Checkout All
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;