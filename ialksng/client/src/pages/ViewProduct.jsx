import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { FaDownload, FaEye, FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import "../styles/viewproduct.css";

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
        // 1. Fetch Product Details
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data.product || data);

        // 2. Check Access (If user is logged in)
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
      alert("No file available for download.");
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

  if (!product) return <div className="loading">Loading Product Details...</div>;

  return (
    <div className="viewproduct">
      <div className="viewproduct__container">
        
        {/* Product Image & Main Info */}
        <div className="viewproduct__main">
          <img src={product.image} alt={product.title} className="viewproduct__img" />
          
          <div className="viewproduct__details">
            <span className="category-tag">{product.category}</span>
            <h1>{product.title}</h1>
            <p className="description">{product.description}</p>
            <h2 className="price">₹{product.price}</h2>

            <div className="viewproduct__actions">
              {hasAccess ? (
                <>
                  <button onClick={handleDownload} className="btn-action download">
                    <FaDownload /> Download File
                  </button>
                  <button onClick={handleDownload} className="btn-action view">
                    <FaEye /> View Content
                  </button>
                </>
              ) : (
                <button onClick={() => navigate(`/checkout/${id}`)} className="btn-buy">
                  Buy to Unlock Content
                </button>
              )}
              
              <button className={`btn-icon ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>

        {/* Social Section: Comments */}
        <div className="viewproduct__social">
          <h3><FaComment /> Comments ({comments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea 
              placeholder={user ? "Write a comment..." : "Please login to comment"} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!user}
            />
            <button type="submit" disabled={!user || !comment.trim()}>Post Comment</button>
          </form>

          <div className="comments-list">
            {comments.map((c, i) => (
              <div key={i} className="comment-item">
                <strong>{c.user}</strong> <span>{c.date}</span>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ViewProduct;