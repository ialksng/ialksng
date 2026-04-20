import React, { useMemo } from 'react';
import './VideoEmbed.css';

const VideoEmbed = ({ embedUrl, title }) => {
  
  // Automatically formats the URL based on the platform
  const processedUrl = useMemo(() => {
    if (!embedUrl) return '';

    // Twitch requires the current domain as a parent parameter to allow embedding
    const hostname = window.location.hostname; 
    
    // 1. Check for YouTube
    const ytMatch = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }

    // 2. Check for Twitch Live Channel
    const twitchChannelMatch = embedUrl.match(/twitch\.tv\/([a-zA-Z0-9_]+)$/);
    if (twitchChannelMatch && twitchChannelMatch[1] && !embedUrl.includes('/videos/')) {
      return `https://player.twitch.tv/?channel=${twitchChannelMatch[1]}&parent=${hostname}&autoplay=true`;
    }

    // 3. Check for Twitch VOD/Video
    const twitchVideoMatch = embedUrl.match(/twitch\.tv\/videos\/([0-9]+)/);
    if (twitchVideoMatch && twitchVideoMatch[1]) {
      return `https://player.twitch.tv/?video=${twitchVideoMatch[1]}&parent=${hostname}&autoplay=true`;
    }

    // Fallback: If it doesn't match above, assume it's already a correctly formatted embed link
    return embedUrl;
  }, [embedUrl]);

  if (!processedUrl) {
    return <div className="video-placeholder">No video URL provided</div>;
  }

  return (
    <div className="video-container">
      <iframe
        src={processedUrl}
        title={title || "Video Stream"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="video-iframe"
      ></iframe>
    </div>
  );
};

export default VideoEmbed;