import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';

const Live = () => {
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data } = await axios.get('/api/more/streams/live');
        setStreamData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStream();
  }, []);

  if (loading) return <div className="more-layout container"><p>Loading stream...</p></div>;

  return (
    <div className="more-layout container">
      <div className="sub-page-header">
        <h1>{streamData?.status === 'live' ? "🔴 Live Now" : "Stream Archive"}</h1>
        <p>{streamData ? streamData.title : "Currently no active streams."}</p>
      </div>
      
      {streamData && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
            <iframe 
              src={streamData.embedUrl} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              frameBorder="0" 
              allowFullScreen 
              title={streamData.title}
            ></iframe>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{streamData.category === 'gaming' ? '🎮 Gaming' : '💬 Just Chatting'}</h3>
            <p style={{ margin: 0, color: '#a0a0a0' }}>Platform: {streamData.platform}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;