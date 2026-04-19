import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { FaComment, FaPaperPlane, FaThumbsUp, FaHeart, FaLaughSquint, FaSurprise, FaSadTear } from 'react-icons/fa';
import axios from '../../../../../../core/utils/axios';
import { AuthContext } from '../../../../../../features/auth/AuthContext';
import Loader from '../../../../../../core/components/Loader';
import './Updates.css';

const REACTION_TYPES = {
  like: { icon: <FaThumbsUp />, color: '#3b82f6', label: 'Like' },
  love: { icon: <FaHeart />, color: '#ef4444', label: 'Love' },
  laugh: { icon: <FaLaughSquint />, color: '#f59e0b', label: 'Haha' },
  shock: { icon: <FaSurprise />, color: '#8b5cf6', label: 'Wow' },
  sad: { icon: <FaSadTear />, color: '#06b6d4', label: 'Sad' },
};

export default function Updates() {
  const { user } = useContext(AuthContext);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => { fetchUpdates(); }, []);

  const fetchUpdates = async () => {
    try {
      const { data } = await axios.get('/more/life?limit=10'); 
      setUpdates(data);
    } catch (err) {
      console.error("Failed to fetch updates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId, type) => {
    if (!user) return toast.error("Please log in to react.");
    try {
      const res = await axios.post(`/more/life/${postId}/react`, { type }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUpdates(updates.map(p => p._id === postId ? { ...p, reactions: res.data } : p));
    } catch (err) {
      toast.error("Failed to apply reaction.");
    }
  };

  const handleComment = async (e, postId) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to comment.");
    
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const commentPromise = axios.post(`/more/life/${postId}/comment`, { text }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    toast.promise(commentPromise, {
      loading: 'Posting...',
      success: (res) => {
        setUpdates(updates.map(p => p._id === postId ? { ...p, comments: res.data } : p));
        setCommentInputs({ ...commentInputs, [postId]: "" });
        return "Comment posted!";
      },
      error: "Failed to post comment."
    });
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const renderMedia = (post) => {
    if (!post.mediaUrl || post.mediaType === 'none') return null;

    switch(post.mediaType) {
      case 'image':
        return <img src={post.mediaUrl} alt="Update media" className="update__media-embed" loading="lazy" />;
      case 'video':
        return <video src={post.mediaUrl} controls preload="metadata" className="update__media-embed" />;
      case 'audio':
        return <audio src={post.mediaUrl} controls className="update__audio-embed" />;
      default:
        return null;
    }
  };

  return (
    <section className="home__section updates__section">
      <div className="container">
        <div className="section__header text-center">
          <h2>Social Feed & Dev Log</h2>
          <p>Real-time updates on what I am building, learning, and doing.</p>
        </div>

        {loading ? (
          <Loader />
        ) : updates.length === 0 ? (
          <div className="updates__empty">No recent updates. Check back later!</div>
        ) : (
          <div className="updates__feed-container">
            {updates.map((post) => {
              const reactions = post.reactions || [];
              const comments = post.comments || [];
              const userReaction = reactions.find(r => r.userId === user?._id)?.type;
              const activeReactionObj = userReaction ? REACTION_TYPES[userReaction] : null;

              return (
                <div className="update__feed-card" key={post._id}>
                  {/* Author Header */}
                  <div className="update__author-header">
                    <div className="update__author-avatar">A</div>
                    <div className="update__author-info">
                      <h4>Alok Singh</h4>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })} • {post.category || 'Update'}</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="update__body">
                    {post.title && <h3 className="update__title">{post.title}</h3>}
                    <p className="update__text">{post.content}</p>
                    {renderMedia(post)}
                  </div>

                  {/* Stats Bar */}
                  <div className="update__stats">
                    <span>{reactions.length} Reactions</span>
                    <span>{comments.length} Comments</span>
                  </div>

                  {/* Action Bar */}
                  <div className="update__actions">
                    <div className="reaction-wrapper">
                      <button 
                        className={`action-btn ${userReaction ? 'reacted' : ''}`} 
                        onClick={() => handleReaction(post._id, userReaction || 'like')}
                        style={{ color: activeReactionObj ? activeReactionObj.color : 'var(--text-secondary)' }}
                      >
                        {activeReactionObj ? activeReactionObj.icon : <FaThumbsUp />}
                        <span>{activeReactionObj ? activeReactionObj.label : 'React'}</span>
                      </button>

                      {/* Hover Reaction Picker */}
                      <div className="reaction-picker">
                        {Object.entries(REACTION_TYPES).map(([type, config]) => (
                          <button 
                            key={type} 
                            className="reaction-emoji" 
                            style={{ color: config.color }}
                            onClick={() => handleReaction(post._id, type)}
                            title={config.label}
                          >
                            {config.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button className="action-btn" onClick={() => toggleComments(post._id)}>
                      <FaComment />
                      <span>Comment</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[post._id] && (
                    <div className="update__comments-section">
                      <form onSubmit={(e) => handleComment(e, post._id)} className="update__comment-form">
                        <div className="update__comment-avatar">
                          {user ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <input 
                          type="text" 
                          placeholder={user ? "Write a comment..." : "Log in to comment..."}
                          value={commentInputs[post._id] || ""}
                          onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                          disabled={!user}
                          onClick={() => !user && toast.error("Please log in to comment.")}
                        />
                        <button type="submit" disabled={!user || !commentInputs[post._id]?.trim()}>
                          <FaPaperPlane />
                        </button>
                      </form>

                      <div className="update__comments-list">
                        {comments.slice().reverse().map((c, idx) => (
                          <div key={idx} className="update__comment-item">
                            <strong>{c.user}</strong> 
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}