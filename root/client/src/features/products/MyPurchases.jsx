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
    const addressStr = user.address?.street
      ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}, ${user.address.country}`
      : "Address not provided";

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${order.paymentId}</title>
          <style>
            body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
            .header-right { text-align: right; }
            .header h1 { margin: 0; color: #0ea5e9; font-size: 28px; }
            .header p { margin: 5px 0; color: #64748b; font-size: 14px; }
            .billing-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .billing-section h3 { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
            .billing-section p { margin: 4px 0; font-size: 14px; font-weight: 500; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 12px; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
            td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .total-row { display: flex; justify-content: flex-end; padding-top: 20px; }
            .total-box { width: 300px; background: #f8fafc; padding: 20px; border-radius: 8px; }
            .total-line { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #64748b; }
            .total-final { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 18px; font-weight: 700; color: #0f172a; }
            .footer { text-align: center; margin-top: 50px; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1>IALKSNG.ME</h1>
                <p>Digital Product Store & Services</p>
                <p>support@ialksng.me</p>
                <p>https://ialksng.me</p>
              </div>
              <div class="header-right">
                <h2 style="margin: 0; color: #0f172a;">INVOICE</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Transaction Ref:</strong> ${order.paymentId}</p>
                <p><strong>Date Issued:</strong> ${date}</p>
                <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID</span></p>
              </div>
            </div>

            <div class="billing-grid">
              <div class="billing-section">
                <h3>Billed To</h3>
                <p style="font-size: 16px;">${user?.name || "Valued Customer"}</p>
                <p style="color: #64748b;">${user?.email}</p>
                <p style="color: #64748b;">${user?.mobile || ""}</p>
                <p style="color: #64748b; max-width: 250px; line-height: 1.4; margin-top: 5px;">${addressStr}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${order.product?.title || "Digital Product"}</strong><br/>
                    <span style="color: #64748b; font-size: 12px;">Instant Digital Delivery</span>
                  </td>
                  <td style="text-align: right;">INR ${order.price.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="total-row">
              <div class="total-box">
                <div class="total-line"><span>Subtotal</span><span>INR ${order.price.toFixed(2)}</span></div>
                <div class="total-line"><span>Tax (0%)</span><span>INR 0.00</span></div>
                <div class="total-final"><span>Total Paid</span><span>INR ${order.price.toFixed(2)}</span></div>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>This is a computer-generated invoice and does not require a physical signature.</p>
            </div>
          </div>
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

  const handleAccessProduct = (product) => {
    // ⬇️ THIS IS THE FIX: Only route to the product page. No Gurukul links here.
    navigate(`/product/${product._id}`);
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
        <div className="purchases__empty">
          <h3>Your library is empty</h3>
          <button
            className="btn-primary"
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
                        order.status === "Paid" || order.status === "Completed" || order.isPaid
                          ? "status-paid"
                          : "status-pending"
                      }`}
                    >
                      Paid
                    </span>
                  </div>

                  <div className="purchase__meta">
                    <span>Ref:</span>
                    <span className="purchase__ref">
                      {order.paymentId
                        ? order.paymentId.substring(0, 10) + "..."
                        : "N/A"}
                    </span>
                  </div>

                  <div className="purchase__action">
                    {(order.status === "Paid" || order.status === "Completed" || order.isPaid) && order.product?._id && (
                      <button
                        className="btn-access"
                        onClick={() => handleAccessProduct(order.product)}
                      >
                        Access Now
                      </button>
                    )}

                    <button
                      className="btn-invoice"
                      onClick={() => handleDownloadInvoice(order)}
                      title="Download Invoice"
                    >
                      📄
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
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