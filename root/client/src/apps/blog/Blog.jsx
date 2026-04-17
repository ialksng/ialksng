import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import axios from "../../core/utils/axios"; 
import Loader from "../../core/components/Loader";

import "./Blog.css"; 

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs");
        const data = res?.data;

        const blogArray =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.blogs)
            ? data.blogs
            : [];

        setBlogs(blogArray);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="blog" id="blog">
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2rem" }}>Latest Articles</h2>

      {blogs.length > 0 ? (
        <div className="blog__grid">
          {blogs.map((blog, index) => {
            
            // ✅ Clean up BOTH HTML tags (old posts) and Markdown symbols (new posts)
            let textContent = "";
            if (typeof blog?.content === "string") {
              textContent = blog.content
                .replace(/<[^>]+>/g, "") // Remove HTML tags
                .replace(/#{1,6}\s/g, "") // Remove Markdown headings (##)
                .replace(/[*_~`>]/g, "") // Remove Markdown bold, italic, code, quotes
                .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert Markdown links to just text
                .trim();
            }

            // ✅ Format the database timestamp into a readable date
            const formattedDate = blog.createdAt 
              ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              : "Recently";

            return (
              <motion.div
                key={blog._id || Math.random()}
                className="blog__card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* 🖼 IMAGE (Fallback if missing) */}
                <img
                  src={blog.image || "https://via.placeholder.com/400x250?text=Blog+Post"}
                  alt={blog?.title || "Blog Post"}
                />

                <div className="blog__card-content">
                  
                  {/* ✅ Meta container for Category and Date */}
                  <div className="blog__card-meta">
                    {blog.category ? (
                      <span className="blog__category-badge">{blog.category}</span>
                    ) : (
                      <span></span>
                    )}
                    <span className="blog__date">{formattedDate}</span>
                  </div>
                  
                  <h3 style={{ marginTop: "8px", marginBottom: "12px", color: "white" }}>
                    {blog?.title || "Untitled Post"}
                  </h3>

                  <p style={{ marginBottom: "15px", lineHeight: "1.5" }}>
                    {textContent
                      ? textContent.substring(0, 100) + "..."
                      : "No content available"}
                  </p>

                  {/* ✅ safe link */}
                  {blog?._id && (
                    <Link to={`/blog/${blog._id}`}>
                      Read More →
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#aaa" }}>No blogs found yet.</p>
      )}
    </section>
  );
}

export default Blog;