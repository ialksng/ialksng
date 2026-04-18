import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyPurchases.css";

function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const API =
    import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [API]);

  return (
    <div className="purchases__container">
      <div className="purchases__header">
        <button className="btn secondary" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
        <h2>My Library</h2>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "var(--bg-card)",
            borderRadius: "16px",
            border: "1px dashed var(--border-color)"
          }}
        >
          <h3 style={{ color: "var(--text-secondary)" }}>
            Your library is empty
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            Products you purchase will appear here securely.
          </p>
          <button
            className="btn primary mt-4"
            onClick={() => navigate("/store")}
          >
            Browse Store
          </button>
        </div>
      ) : (
        <div className="purchases__grid">
          {orders.map(order => (
            <div key={order._id} className="purchase__card">
              <img
                src={
                  order.product?.image ||
                  "https://via.placeholder.com/400x200"
                }
                alt=""
                className="purchase__img"
              />

              <div className="purchase__content">
                <h3 className="purchase__title">
                  {order.product?.title || "Product Removed"}
                </h3>

                <div className="purchase__meta">
                  <span>Status:</span>
                  <span
                    className={`status-badge ${
                      order.status === "Paid"
                        ? "status-paid"
                        : "status-pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="purchase__meta">
                  <span>Order ID:</span>
                  <span style={{ fontFamily: "monospace" }}>
                    {order.paymentId
                      ? order.paymentId.substring(0, 10) + "..."
                      : "N/A"}
                  </span>
                </div>

                <div className="purchase__action">
                  {order.status === "Paid" && order.product?._id ? (
                    <button
                      className="btn-access"
                      onClick={() =>
                        navigate(`/access/${order.product._id}`)
                      }
                    >
                      Access Content
                    </button>
                  ) : (
                    <button
                      className="btn-access"
                      disabled
                      style={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      Processing...
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPurchases;