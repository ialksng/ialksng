import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './NotificationBanner.css';

const NotificationBanner = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchPublicAnnouncements = async () => {
      try {
        const { data } = await axios.get('/notifications/public');
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load banner announcements", err);
      }
    };
    fetchPublicAnnouncements();
  }, []);

  // Hide banner completely if there's nothing to show
  if (announcements.length === 0) return null;

  // Pre-render the items so they can be duplicated for the seamless CSS loop
  const bannerItems = announcements.map((item, index) => (
    <span key={item._id || index} className="banner-item">
      <span className="banner-badge">
        {item.type === 'live' ? '🔴' : item.type === 'update' ? '🌱' : '⚡'}
      </span>
      <span className="banner-title">{item.title}</span>
      {item.message && <span className="banner-message">- {item.message}</span>}
      <span className="separator">•</span>
    </span>
  ));

  return (
    <div className="notification-banner-container">
      <div className="notification-banner-track">
        {/* Render the items TWICE to create a seamless infinite loop */}
        <div className="notification-banner-content">
          {bannerItems}
        </div>
        <div className="notification-banner-content" aria-hidden="true">
          {bannerItems}
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;