import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Pagination from "../../core/components/Pagination";
import Loader from "../../core/components/Loader";
import "./MyPurchases.css";

function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API]);

  const handleDownloadInvoice = (order) => {
    const date = new Date(order.createdAt).toLocaleDateString();

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${order.paymentId}</title>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #2563eb; }
            .details { margin-bottom: 40px; }
            .details p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; }
            .total { text-align: right; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>IALKSNG STORE</h1>
            <p>Order Invoice</p>
          </div>
          <div class="details">
            <p><strong>Billed To:</strong> ${user?.name || user?.email || "Customer"}</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Payment Ref:</strong> ${order.paymentId}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.product?.title || "Digital Product"}</td>
                <td>INR ${order.price}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Paid: INR ${order.price}
          </div>
          <p style="text-align:center;margin-top:50px;font-size:12px;color:#666;">
            Thank you for your purchase
          </p>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentOrders = orders.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div className="purchases__container">
      <div className="purchases__header">
        <h2>My Library</h2>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "var(--bg-card)",
            borderRadius: "16px"
          }}
        >
          <h3 style={{ color: "var(--text-secondary)" }}>
            Your library is empty
          </h3>
          <button
            className="btn primary mt-4"
            onClick={() => navigate("/store")}
          >
            Browse Store
          </button>
        </div>
      ) : (
        <>
          <div className="purchases__grid">
            {currentOrders.map((order) => (
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
                    <span>Ref:</span>
                    <span style={{ fontFamily: "monospace" }}>
                      {order.paymentId
                        ? order.paymentId.substring(0, 10) + "..."
                        : "N/A"}
                    </span>
                  </div>

                  <div
                    className="purchase__action"
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "auto",
                      paddingTop: "20px"
                    }}
                  >
                    {order.status === "Paid" && order.product?._id && (
                      <button
                        className="btn-access"
                        style={{ flex: 2 }}
                        onClick={() =>
                          navigate(`/access/${order.product._id}`)
                        }
                      >
                        Access
                      </button>
                    )}

                    <button
                      className="btn-access"
                      style={{
                        flex: 1,
                        background: "transparent",
                        borderColor: "var(--border-color)",
                        color: "var(--text-muted)"
                      }}
                      onClick={() => handleDownloadInvoice(order)}
                    >
                      📄
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: "40px" }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyPurchases;