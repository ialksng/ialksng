import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import "../styles/blogdetail.css";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">

        {/* 🖼 IMAGE */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="blogdetail__image"
          />
        )}

        <h1>{blog.title}</h1>

        <p className="blogdetail__meta">
          Category: {blog.category} • Author: {blog.author}
        </p>

        {/* 📝 CONTENT */}
        <div
          className="blogdetail__content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}

export default BlogDetail;