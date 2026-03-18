import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/checkout.css";

function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // 🔹 fetch product (FIXED)
  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("PRODUCT DATA:", data);
        setProduct(data.product); // ✅ FIX
      })
      .catch(err => console.log(err));
  }, [id]);

  const handlePayment = async () => {
    try {
      if (!product) return;

      console.log("START PAYMENT");

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
          console.log("PAYMENT RESPONSE:", response);

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
            console.log("VERIFY RESPONSE:", verifyData);

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
            console.log("ORDER SAVE RESPONSE:", orderData);

            if (orderData.success) {
              alert("Payment successful 🎉");

              // ✅ redirect to purchases
              navigate("/my-purchases");
            } else {
              alert("Order saving failed ❌");
            }

          } catch (err) {
            console.log(err);
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
      console.log(err);
      alert("Payment failed");
    }
  };

  if (!product) return <h2 style={{ color: "white" }}>Loading...</h2>;

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
      </div>
    </div>
  );
}

export default Checkout;