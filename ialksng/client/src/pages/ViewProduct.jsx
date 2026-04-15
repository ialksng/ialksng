import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../features/auth/AuthContext";
import { FaDownload, FaEye, FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import "../styles/viewproduct.css";
import Loader from "../components/Loader";

function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchProductAndAccess = async () => {
      try {
        // Fetch product
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data.product || data);

        // Check access
        if (user) {
          if (user.role === "admin") {
            setHasAccess(true);
          } else {
            const accessRes = await axios.get(`/orders/check/${id}`);
            if (accessRes.data.msg === "Access granted") {
              setHasAccess(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProductAndAccess();
  }, [id, user]);

  const handleDownload = () => {
    if (product?.fileUrl) {
      window.open(product.fileUrl, "_blank");
    } else {
      alert("No file available.");
    }
  };

  const handleLike = () => setIsLiked(!isLiked);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      text: comment,
      user: user?.name || "Anonymous",
      date: new Date().toLocaleDateString(),
    };

    setComments([newComment, ...comments]);
    setComment("");
  };

  if (!product) return <Loader />;

  return (
    <div className="viewproduct">
      <div className="viewproduct__container">

        {/* 🔥 MAIN PRODUCT */}
        <div className="viewproduct__main">
          <img
            src={product.image}
            alt={product.title}
            className="viewproduct__img"
          />

          <div className="viewproduct__details">
            <span className="category-tag">{product.category}</span>

            <h1>{product.title}</h1>
            <p className="description">{product.description}</p>

            {/* 🔥 UPDATED PRICE UI */}
            <h2 className={`price ${hasAccess ? "status-paid" : ""}`}>
              {hasAccess ? "PAID" : `₹${product.price}`}
            </h2>

            <div className="viewproduct__actions">
              {hasAccess ? (
                <>
                  <button onClick={handleDownload} className="btn-action download">
                    <FaDownload /> Download
                  </button>

                  <button
                    onClick={() => navigate(`/notes/${product._id}`)}
                    className="btn-action view"
                  >
                    <FaEye /> View
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(`/checkout/${id}`)}
                  className="btn-buy"
                >
                  Buy Now
                </button>
              )}

              <button
                className={`btn-icon ${isLiked ? "liked" : ""}`}
                onClick={handleLike}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 COMMENTS SECTION */}
        <div className="viewproduct__social">
          <h3>
            <FaComment /> Comments ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder={user ? "Write a comment..." : "Login to comment"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!user}
            />

            <button type="submit" disabled={!user || !comment.trim()}>
              Post Comment
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <strong>{c.user}</strong>
                  <span>{c.date}</span>
                  <p>{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ViewProduct;