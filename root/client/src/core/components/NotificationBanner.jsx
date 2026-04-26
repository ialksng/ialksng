// root/client/src/core/components/NotificationBanner.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios'; // Make sure this path matches your setup
import './NotificationBanner.css';

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Adjust this endpoint to match the one used by NotificationBell.jsx
        const response = await axiosInstance.get('/api/notifications'); 
        
        // Filter for unread notifications, or however you define "active" announcements
        // Adjust response.data mapping based on your actual API response structure
        const unread = response.data?.data?.filter(n => !n.isRead) || [];
        setNotifications(unread);
      } catch (error) {
        console.error("Failed to load banner notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Don't render the banner if there's nothing to show
  if (loading || notifications.length === 0) return null;

  return (
    <div className="notification-banner-container">
      <div className="notification-banner-content">
        {notifications.map((notification, index) => (
          <span key={notification._id || index} className="banner-item">
            {/* Adjust .title or .message based on your notification.model.js */}
            {notification.title || notification.message} 
            
            {/* Add a bullet separator between multiple notifications */}
            {index < notifications.length - 1 && <span className="separator">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NotificationBanner;