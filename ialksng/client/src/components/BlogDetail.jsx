import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import "../styles/blogdetail.css";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="blogdetail__loading">
        <h2>Loading Article...</h2>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blogdetail__loading">
        <h2>Article not found.</h2>
        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
          ← Back to Blogs
        </button>
      </div>
    );
  }

  // Format the date if it exists
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Published";

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">
        
        {/* Navigation */}
        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
          ← Back to Blogs
        </button>

        {/* 🖼 HERO IMAGE */}
        <div className="blogdetail__image-wrapper">
          <img
            src={blog.image || "https://via.placeholder.com/800x400?text=Blog+Post"}
            alt={blog.title}
            className="blogdetail__image"
          />
        </div>

        {/* 📝 HEADER INFO */}
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

        {/* 📝 CONTENT */}
        {/* We use dangerouslySetInnerHTML because the content is saved as HTML from the rich text editor */}
        <div
          className="blogdetail__content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
      </div>
    </div>
  );
}

export default BlogDetail;