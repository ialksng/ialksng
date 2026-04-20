import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import './Life.css';

const Life = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/more/life');
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="life-container animated-fade-in">
      <div className="life-hero">
        <div className="life-glow"></div>
        <h1 className="life-title">
          <span className="life-title-highlight">Dev Log</span> & Life
        </h1>
        <p className="life-subtitle">
          A personal journal. Gym progress, daily thoughts, bugs smashed, and everything in between.
        </p>
      </div>

      <div className="life-feed">
        <div className="timeline-line"></div>
        
        {loading ? (
          <div className="life-skeleton">Loading updates...</div>
        ) : posts.length === 0 ? (
          <div className="life-empty">No updates found.</div>
        ) : (
          posts.map((post, index) => (
            <div key={post._id} className="life-card-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="timeline-dot"></div>
              <div className="life-card">
                <div className="life-card-header">
                  <span className="life-category">{post.category || 'Update'}</span>
                  <span className="life-date">
                    {new Date(post.date).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="life-card-title">{post.title}</h3>
                <p className="life-card-content">{post.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Life;