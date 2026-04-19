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
    if (!user) return toast.error("Please log in to react.", { id: 'react-auth-error' });
    
    try {
      const res = await axios.post(`/more/life/${postId}/react`, { type });
      setUpdates(updates.map(p => p._id === postId ? { ...p, reactions: res.data } : p));
    } catch (err) {
      toast.error("Failed to apply reaction.", { id: 'react-fail-error' });
    }
  };

  const handleComment = async (e, postId) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to comment.", { id: 'comment-auth-error' });
    
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const toastId = toast.loading('Posting...', { id: `posting-${postId}` });

    try {
      const res = await axios.post(`/more/life/${postId}/comment`, { text });
      
      setUpdates(updates.map(p => p._id === postId ? { ...p, comments: res.data } : p));
      setCommentInputs({ ...commentInputs, [postId]: "" });
      
      toast.success("Comment posted!", { id: toastId });
    } catch (err) {
      toast.error("Failed to post comment.", { id: toastId });
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatContent = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const renderMedia = (post) => {
    let url = post.mediaUrl;
    let type = post.mediaType;

    if (!url || type === 'none') {
      const urlRegex = /(https?:\/\/[^\s]+)/;
      const match = post.content?.match(urlRegex);
      if (match) {
        url = match[0];
        if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) type = 'image';
        else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || url.includes('youtube.com') || url.includes('youtu.be')) type = 'video';
        else if (url.match(/\.(mp3|wav|m4a)(\?.*)?$/i)) type = 'audio';
        else type = 'link';
      }
    }

    if (!url || type === 'none') return null;

    if (type === 'image') {
      return <img src={url} alt="Update media" className="update__media-embed" loading="lazy" />;
    }

    if (type === 'video') {
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
      if (ytMatch && ytMatch[1]) {
        return (
          <iframe 
            style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '0.8rem' }}
            src={`https://www.youtube.com/embed/${ytMatch[1]}`} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title="YouTube video"
          ></iframe>
        );
      }
      return <video src={url} controls preload="metadata" className="update__media-embed" />;
    }

    if (type === 'audio') {
      return <audio src={url} controls className="update__audio-embed" />;
    }

    if (type === 'link') {
      return (
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="update__link-preview"
        >
          <div className="update__link-card">
            <div className="update__link-url">{url}</div>
            <div className="update__link-cta">Open Link ↗</div>
          </div>
        </a>
      );
    }

    return null;
  };

  return (
    <section className="home__section updates__section">
      <div className="container">
        <div className="section__header text-center">
          <h2>Updates</h2>
          <p>Real-time updates from everything I’m building, learning, and sharing—across all sections.</p>
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
                  <div className="update__author-header">
                    <div className="update__author-avatar">A</div>
                    <div className="update__author-info">
                      <h4>Alok Singh</h4>
                      <span>{new Date(post.createdAt || post.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })} • {post.category || 'Update'}</span>
                    </div>
                  </div>

                  <div className="update__body">
                    {post.title && <h3 className="update__title">{post.title}</h3>}
                    <p className="update__text">{formatContent(post.content)}</p>
                    {renderMedia(post)}
                  </div>

                  <div className="update__stats">
                    <span>{reactions.length} Reactions</span>
                    <span>{comments.length} Comments</span>
                  </div>

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