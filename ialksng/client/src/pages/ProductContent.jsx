import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductContent() {
  const { id } = useParams();
  const [allowed, setAllowed] = useState(null);

  const API = import.meta.env.VITE_API_URL; // ✅ backend URL

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`${API}/api/orders/check/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (res.status === 403) {
          setAllowed(false);
        } else if (res.ok) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }

      } catch (err) {
        console.log("Access check error:", err);
        setAllowed(false);
      }
    };

    checkAccess();
  }, [id, API]);

  if (allowed === null) return <h2>Checking access...</h2>;

  if (!allowed) {
    return <h2 style={{ color: "red" }}>Access Denied ❌</h2>;
  }

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Premium Content 🔓</h2>
      <p>This is your paid content (notes, code, etc.)</p>
    </div>
  );
}

export default ProductContent;