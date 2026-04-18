import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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
  const [nlLoading, setNlLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/blogs?page=${currentPage}&limit=6`);
        setBlogs(res.data?.blogs || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching blogs", err);
        toast.error("Failed to load blog posts.");
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
    
    const subPromise = axios.post("/newsletter/subscribe", { email });

    toast.promise(subPromise, {
      loading: 'Subscribing...',
      success: (res) => {
        setEmail("");
        return res.data?.msg || "Success! Welcome to the newsletter.";
      },
      error: (err) => err.response?.data?.msg || "Subscription failed."
    }).finally(() => {
      setNlLoading(false);
    });
  };

  return (
    <div className="blog-page container">
      <section className="newsletter-banner">
        <div className="newsletter-content">
          <h2>Join the Newsletter</h2>
          <p>
            Get the latest articles on Full-Stack MERN, AI integrations, and tech
            tutorials delivered straight to your inbox.
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
        </div>
      </section>

      <section className="blog-list-section">
        <h1 className="section-title">Latest Articles</h1>

        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-msg">No blog posts available right now. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="blog-grid">
              {blogs.map((blog) => {
                if (!blog) return null;

                const safeTitle = blog?.title || "Untitled Post";
                const safeDate = blog?.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : "Recent";
                const safeImage = blog?.coverImage || blog?.image || null;
                const safeExcerpt =
                  blog?.excerpt ||
                  (blog?.content
                    ? blog.content.substring(0, 100) + "..."
                    : "No preview available.");
                const category = blog?.category || "General";

                return (
                  <div key={blog._id} className="blog-card">
                    {safeImage ? (
                      <div className="blog-image-wrapper">
                        <img src={safeImage} alt={safeTitle} className="blog-image" />
                        <span className="blog-category-badge">{category}</span>
                      </div>
                    ) : (
                      <div className="blog-image-placeholder">
                        <span className="blog-category-badge">{category}</span>
                      </div>
                    )}
                    <div className="blog-content">
                      <span className="blog-date">{safeDate}</span>
                      <h3>{safeTitle}</h3>
                      <p className="blog-excerpt">{safeExcerpt}</p>
                      <Link to={`/blog/${blog._id}`} className="read-more">
                        Read Article <span>→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
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