import { useEffect, useState } from "react";
import axios from "../utils/axios"; // ✅ Use custom configured axios
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/blog.css"; 

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Since we are using custom axios, we just need "/blogs"
        const res = await axios.get("/blogs");

        // ✅ normalize safely
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
    return (
      <section className="blog" id="blog">
        <h2 style={{ textAlign: "center", color: "white" }}>Loading blogs...</h2>
      </section>
    );
  }

  return (
    <section className="blog" id="blog">
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2rem" }}>Latest Articles</h2>

      {blogs.length > 0 ? (
        <div className="blog__grid">
          {blogs.map((blog, index) => {
            // ✅ Strip HTML tags from content for the preview excerpt
            let textContent = "";
            if (typeof blog?.content === "string") {
              textContent = blog.content.replace(/<[^>]+>/g, "");
            }

            // ✅ Format the database timestamp into a readable date (e.g., "Oct 24, 2024")
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
                      <span></span> /* Empty span to keep date pushed to the right if no category */
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