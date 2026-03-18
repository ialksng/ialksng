import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");

        console.log("BLOG DATA:", res.data);

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

  // ✅ prevent blank crash
  if (loading) return <div>Loading blogs...</div>;

  return (
    <section id="blog">
      <h1>Blog</h1>

      {blogs.length > 0 ? (
        blogs.map((blog) => {
          // ✅ extra safe content handling
          let textContent = "";

          if (typeof blog?.content === "string") {
            textContent = blog.content.replace(/<[^>]+>/g, "");
          }

          return (
            <div key={blog._id || Math.random()}>
              <h2>{blog?.title || "No Title"}</h2>

              <p>
                {textContent
                  ? textContent.substring(0, 100) + "..."
                  : "No content available"}
              </p>

              {/* ✅ safe link */}
              {blog?._id && (
                <Link to={`/blog/${blog._id}`}>
                  Read More
                </Link>
              )}
            </div>
          );
        })
      ) : (
        <p>No blogs found</p>
      )}
    </section>
  );
}

export default Blog;