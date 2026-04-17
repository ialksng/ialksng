import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../core/utils/axios";
import Loader from "../../core/components/Loader";
import Pagination from "../../core/components/Pagination";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [email, setEmail] = useState("");
  const [nlMessage, setNlMessage] = useState("");
  const [nlLoading, setNlLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/blogs?page=${currentPage}&limit=6`);
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setNlLoading(true);
    setNlMessage("");
    try {
      const res = await axios.post("/newsletter/subscribe", { email });
      setNlMessage({ type: "success", text: res.data.msg });
      setEmail("");
    } catch (err) {
      setNlMessage({
        type: "error",
        text: err.response?.data?.msg || "Subscription failed.",
      });
    } finally {
      setNlLoading(false);
    }
  };

  return (
    <div className="blog-page container">
      <section className="newsletter-banner">
        <div className="newsletter-content">
          <h2>Join the Newsletter</h2>
          <p>
            Get the latest articles on Full-Stack MERN, AI integrations, and tech tutorials delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={nlLoading}>
              {nlLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {nlMessage && (
            <p className={`newsletter-msg ${nlMessage.type}`}>
              {nlMessage.text}
            </p>
          )}
        </div>
      </section>

      <section className="blog-list-section">
        <h1 className="section-title">Latest Articles</h1>

        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <p className="empty-msg">
            No blog posts available right now. Check back soon!
          </p>
        ) : (
          <>
            <div className="blog-grid">
              {blogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="blog-image"
                    />
                  )}
                  <div className="blog-content">
                    <span className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <h3>{blog.title}</h3>
                    <p className="blog-excerpt">
                      {blog.excerpt || (blog.content ? blog.content.substring(0, 100) + "..." : "No preview available.")}
                    </p>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="read-more"
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;