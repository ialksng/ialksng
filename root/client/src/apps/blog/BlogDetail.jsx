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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

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

  const updateComments = (comments) => {
    setBlogData((prev) => ({
      ...prev,
      blog: { ...prev.blog, comments }
    }));
  };

  const handleLike = async () => {
    if (!user) return alert("Login required");

    try {
      const res = await axios.post(`/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setBlogData((prev) => ({
        ...prev,
        blog: { ...prev.blog, likes: res.data }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/blogs/${id}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      updateComments(res.data);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await axios.delete(`/blogs/${id}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      updateComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCommentSubmit = async (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      const res = await axios.put(
        `/blogs/${id}/comment/${commentId}`,
        { text: editText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      updateComments(res.data);
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;
  if (!blogData || !blogData.blog) return <h2>Not found</h2>;

  const { blog, notionContent } = blogData;

  return (
    <div className="blogdetail">
      <div className="blogdetail__container">

        <button onClick={() => navigate("/blog")} className="blogdetail__back-btn">
          ← Back
        </button>

        <h1>{blog.title}</h1>

        <div className="blogdetail__content">
          {notionContent ? (
            <NotionRenderer content={notionContent} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {blog.content}
            </ReactMarkdown>
          )}
        </div>

        <div className="blogdetail__social">
          <button onClick={handleLike}>
            ❤️ {blog.likes?.length || 0}
          </button>
        </div>

        <div className="comments-section">
          <h3>Comments ({blog.comments?.length || 0})</h3>

          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
          ) : (
            <p>
              <Link to="/login">Login</Link> to comment
            </p>
          )}

          <div className="comments-list">
            {blog.comments?.slice().reverse().map((c) => (
              <div key={c._id} className="comment">

                <div className="comment-avatar">
                  {c.user?.charAt(0).toUpperCase()}
                </div>

                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="comment-author">
                      {c.user} {user?._id === c.userId && "(You)"}
                    </span>

                    {user && user._id === c.userId && (
                      <div className="comment-actions">
                        <button
                          onClick={() => {
                            setEditingCommentId(c._id);
                            setEditText(c.text);
                          }}
                        >
                          Edit
                        </button>

                        <button onClick={() => handleDeleteComment(c._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === c._id ? (
                    <form onSubmit={(e) => handleEditCommentSubmit(e, c._id)}>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditingCommentId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p>{c.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default BlogDetail;