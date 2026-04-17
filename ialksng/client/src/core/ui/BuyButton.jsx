import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../features/auth/AuthContext";

function BuyButton({ productId }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBuy = () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/product/${productId}` }
      });
    } else {
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