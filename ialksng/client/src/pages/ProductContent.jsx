import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductContent() {
  const { id } = useParams();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/orders/check/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.status === 403) {
          setAllowed(false);
        } else {
          setAllowed(true);
        }
      })
      .catch(err => console.log(err));
  }, [id]);

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