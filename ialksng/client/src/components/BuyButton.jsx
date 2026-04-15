import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";

function BuyButton({ productId }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBuy = () => {
    if (!user) {
      // 🔒 redirect to login with return path
      navigate("/login", {
        state: { from: `/product/${productId}` }
      });
    } else {
      // ✅ go to checkout
      navigate(`/checkout/${productId}`);
    }
  };

  return (
    <button onClick={handleBuy}>
      Buy Now
    </button>
  );
}

export default BuyButton;