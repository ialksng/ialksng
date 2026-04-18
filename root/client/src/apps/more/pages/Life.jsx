import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import '../More.css';

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

  if (loading) return <div className="more-layout container"><p>Loading updates...</p></div>;

  return (
    <div className="more-layout container animated-fade-in">
      <div className="sub-page-header">
        <h1>Life & Fitness</h1>
        <p className="subtitle">Personal updates, gym progress, and quick thoughts.</p>
      </div>

      <div className="life-feed" style={{ maxWidth: '700px', margin: '0 auto' }}>
        {posts.map((post) => (
          <div key={post._id} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="tag" style={{ background: 'rgba(255,255,255,0.1)' }}>{post.category}</span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{post.title}</h3>
            <p style={{ margin: 0, color: '#a8b2d1', lineHeight: '1.6' }}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Life;