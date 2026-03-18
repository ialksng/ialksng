import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "15px",
          padding: "8px 14px",
          cursor: "pointer",
          borderRadius: "6px",
          border: "none",
          background: "#444"
        }}
      >
        ⬅ Back
      </button>

      <h2>My Purchases</h2>

      {orders.length === 0 ? (
        <p>No purchases yet</p>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            style={{
              border: "1px solid #555",
              margin: "15px 0",
              padding: "15px",
              borderRadius: "12px",
              display: "flex",
              gap: "15px",
              alignItems: "center"
            }}
          >
            {/* 📦 PRODUCT IMAGE */}
            <img
              src={order.product?.image}
              alt=""
              width="100"
              style={{ borderRadius: "8px" }}
            />

            <div>
              {/* 🏷 TITLE */}
              <p><strong>{order.product?.title}</strong></p>

              {/* 📊 STATUS */}
              <p>
                Status:{" "}
                <span style={{
                  color: order.status === "Paid" ? "limegreen" : "orange",
                  fontWeight: "bold"
                }}>
                  {order.status}
                </span>
              </p>

              {/* 💳 PAYMENT ID */}
              <p style={{ fontSize: "12px", opacity: 0.7 }}>
                Payment ID: {order.paymentId || "N/A"}
              </p>

              {/* 🔓 ACCESS BUTTON */}
              {order.status === "Paid" && (
                <button
                  onClick={() => navigate(`/access/${order.product._id}`)}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "none",
                    background: "#3399cc",
                    color: "white"
                  }}
                >
                  View Product
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyPurchases;