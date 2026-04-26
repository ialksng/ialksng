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

  return (
    <div className="notification-banner-container">
      <div className="notification-banner-content">
        {announcements.map((item, index) => (
          <span key={item._id || index} className="banner-item">
            <span className="banner-badge">{item.type === 'live' ? '🔴' : '🌱'}</span>
            <strong>{item.title}</strong>: {item.message}
            {index < announcements.length - 1 && <span className="separator">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NotificationBanner;