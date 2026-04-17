import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm"; 
import rehypeRaw from "rehype-raw"; 

import axios from "../../core/utils/axios";
import Loader from "../../core/components/Loader";
import NotionRenderer from "../lms/NotionRenderer";

import "./BlogDetail.css";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  if (!blogData || !blogData.blog) {
    return (
      <div className="blogdetail__loading">
        <h2>Article not found.</h2>
        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
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
        day: "numeric",
      })
    : "Recently Published";

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">
        
        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
          ← Back to Blogs
        </button>

        <div className="blogdetail__image-wrapper">
          <img
            src={blog.image || "https://via.placeholder.com/800x400?text=Blog+Post"}
            alt={blog.title}
            className="blogdetail__image"
          />
        </div>

        <div className="blogdetail__header">
          {blog.category && <span className="blogdetail__category">{blog.category}</span>}
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

        <div className="blogdetail__content" style={{ marginTop: "30px", lineHeight: "1.6" }}>
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
        
      </div>
    </div>
  );
}

export default BlogDetail;