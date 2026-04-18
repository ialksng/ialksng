import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import axios from "../../core/utils/axios";
import Loader from "../../core/components/Loader";
import NotionRenderer from "../lms/NotionRenderer";
import { AuthContext } from "../../features/auth/AuthContext";

import "./BlogDetail.css";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/blogs/${id}`);
        setBlogData(data.blog ? data : { blog: data, notionContent: null });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Please login to like this post.");
    try {
      const res = await axios.post(
        `/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const { blog } = blogData;

      setBlogData({
        ...blogData,
        blog: { ...blog, likes: res.data }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `/blogs/${id}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const { blog } = blogData;

      setBlogData({
        ...blogData,
        blog: { ...blog, comments: res.data }
      });

      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogData.blog.title,
          url: window.location.href
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <Loader />;

  if (!blogData || !blogData.blog) {
    return (
      <div className="blogdetail__loading">
        <h2>Article not found.</h2>
        <button
          onClick={() => navigate("/blog")}
          className="blogdetail__back-btn"
        >
          ← Back to Blogs
        </button>
      </div>
    );
  }

  const { blog, notionContent } = blogData;

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Recently Published";

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">
        <button
          onClick={() => navigate("/blog")}
          className="blogdetail__back-btn"
        >
          ← Back to Blogs
        </button>

        <div className="blogdetail__image-wrapper">
          <img
            src={
              blog.image ||
              "https://via.placeholder.com/800x400?text=Blog+Post"
            }
            alt={blog.title}
            className="blogdetail__image"
          />
        </div>

        <div className="blogdetail__header">
          {blog.category && (
            <span className="blogdetail__category">{blog.category}</span>
          )}
          <h1 className="blogdetail__title">{blog.title}</h1>

          <div className="blogdetail__meta">
            <div className="meta-item">
              <span className="meta-label">Written by</span>
              <span className="meta-value">{blog.author || "Admin"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Published</span>
              <span className="meta-value">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div
          className="blogdetail__content"
          style={{ marginTop: "30px", lineHeight: "1.6" }}
        >
          {notionContent ? (
            <NotionRenderer content={notionContent} />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {blog.content || ""}
            </ReactMarkdown>
          )}
        </div>

        <div className="blogdetail__social">
          <div className="social-actions">
            <button
              className={`action-btn ${
                blog.likes?.includes(user?._id) ? "liked" : ""
              }`}
              onClick={handleLike}
            >
              ❤️ {blog.likes?.length || 0} Likes
            </button>
            <button className="action-btn" onClick={handleShare}>
              🔗 Share
            </button>
          </div>

          <div className="comments-section">
            <h3>Comments ({blog.comments?.length || 0})</h3>

            {user ? (
              <form className="comment-form" onSubmit={handleComment}>
                <textarea
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  rows="3"
                />
                <button type="submit" disabled={!commentText.trim()}>
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="login-prompt">
                <p>
                  Please{" "}
                  <Link to="/login" style={{ color: "#38bdf8" }}>
                    log in
                  </Link>{" "}
                  to join the conversation.
                </p>
              </div>
            )}

            <div className="comments-list">
              {blog.comments?.slice().reverse().map((c, idx) => (
                <div key={idx} className="comment">
                  <div className="comment-avatar">
                    {c.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <span className="comment-author">{c.user}</span>
                      <span className="comment-date">
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;