import React from 'react';
import './VideoEmbed.css';

const VideoEmbed = ({ embedUrl, title }) => {
  return (
    <div className="video-container">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="video-iframe"
      ></iframe>
    </div>
  );
};

export default VideoEmbed;