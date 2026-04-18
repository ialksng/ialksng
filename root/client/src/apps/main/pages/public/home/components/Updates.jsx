import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../../../core/utils/axios';
import './Updates.css';

const Updates = ({ heading }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await axios.get('/blogs?limit=3');
        setBlogs(res.data?.blogs || []);
      } catch (err) {
        console.error("Failed to fetch latest blogs", err);
      }
    };
    fetchLatestBlogs();
  }, []);

  if (!blogs || blogs.length === 0) return null; 

  return (
    <section className="updates-preview" style={{ padding: '60px 0' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2>{heading || "Latest Articles"}</h2>
        </div>
        <Link to="/blog" className="btn secondary" style={{ fontSize: '13px' }}>View All →</Link>
      </div>

      <div className="updates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {blogs.map(blog => {
          const safeTitle = blog?.title || "Untitled";
          const safeDate = blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Recent";
          
          return (
            <div key={blog._id} className="update-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s' }}>
              {blog.coverImage && <img src={blog.coverImage} alt={safeTitle} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
              <div style={{ padding: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{blog.category || "Article"}</span>
                <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{safeTitle}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{safeDate}</span>
                  <Link to={`/blog/${blog._id}`} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Read →</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Updates;