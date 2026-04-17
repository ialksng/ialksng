import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

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
    const index = cart.findIndex(item => item._id === id);

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
          items: cart.map(item => item._id)
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