import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

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

  if (announcements.length === 0) return null;

  const bannerItems = announcements.map((item, index) => (
    <span key={item._id || index} className="inline-flex items-center gap-2 text-sm font-medium tracking-wide">
      <span className="text-xs">
        {item.type === 'live' ? '🔴' : item.type === 'update' ? '🌱' : '⚡'}
      </span>
      <strong className="text-[var(--text-primary)] font-bold">{item.title}</strong>
      {item.message && <span className="text-[var(--text-secondary)]">- {item.message}</span>}
      <span className="mx-10 text-[var(--accent-primary)] opacity-80 font-bold">•</span>
    </span>
  ));

  return (
    <div className="w-full bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden py-2.5 relative z-10 flex border-b border-[var(--border-color)] shadow-sm group">
      <div className="flex whitespace-nowrap animate-marquee group-hover:animate-marquee-paused">
        <div className="flex items-center">{bannerItems}</div>
        <div className="flex items-center" aria-hidden="true">{bannerItems}</div>
      </div>
    </div>
  );
};

export default NotificationBanner;