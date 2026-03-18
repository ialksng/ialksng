import { useEffect, useState } from "react";
import axios from "../../utils/axios"; // 👈 use your interceptor
import { useNavigate } from "react-router-dom";

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/blogs");

      const blogArray = Array.isArray(data)
        ? data
        : data.blogs || [];

      setBlogs(blogArray);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await axios.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>📝 Manage Blogs</h1>

      <button onClick={() => navigate("/admin/blog/create")}>
        ➕ Create Blog
      </button>

      {blogs.length === 0 && <p>No blogs yet</p>}

      {blogs.map((blog) => (
        <div key={blog._id} style={{ margin: "20px 0" }}>
          <h3>{blog.title}</h3>

          <button onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}>
            Edit
          </button>

          <button onClick={() => deleteBlog(blog._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminBlog;