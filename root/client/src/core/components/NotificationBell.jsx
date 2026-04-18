import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { AuthContext } from '../../features/auth/AuthContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/notifications'); // Remember, no /api needed here!
      setNotifications(data);
    } catch (err) { console.error("Failed to fetch notifications"); }
  };

  const handleMarkAsRead = async (id, link) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setIsOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return null; 

  return (
    <div className="notification-wrapper">
      <button className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && <button onClick={handleMarkAllRead}>Mark all read</button>}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">You're all caught up!</p>
            ) : (
              notifications.map(notif => (
                <Link 
                  key={notif._id} 
                  to={notif.link} 
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(notif._id)}
                >
                  <div className="notif-icon">
                    {notif.type === 'live' ? '🔴' : notif.type === 'update' ? '🌱' : '⚡'}
                  </div>
                  <div className="notif-content">
                    <strong>{notif.title}</strong>
                    <p>{notif.message}</p>
                    <span className="notif-time">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;