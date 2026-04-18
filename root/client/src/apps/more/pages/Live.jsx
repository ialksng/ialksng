import React, { useState, useEffect } from 'react';
import VideoEmbed from '../components/VideoEmbed';
import axios from '../../../core/utils/axios';
import '../More.css';

const Live = () => {
  const [currentStream, setCurrentStream] = useState(null);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const liveRes = await axios.get('/more/streams/live');
        setCurrentStream(liveRes.data);

        const allRes = await axios.get('/more/streams/all');

        const filteredArchives = allRes.data.filter(
          (video) => video._id !== liveRes.data?._id
        );
        setArchives(filteredArchives);
      } catch (err) {
        console.error("Failed to load streams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamData();
  }, []);

  if (loading) return <div className="more-layout container"><p>Loading player...</p></div>;

  return (
    <div className="more-layout container animated-fade-in">
      <div className="sub-page-header">
        <h1>{currentStream?.status === 'live' ? "🔴 Live Now" : "Stream Archive"}</h1>
        <p className="subtitle">{currentStream ? currentStream.title : "No streams available."}</p>
      </div>

      {currentStream && (
        <div className="main-player-section">
          <VideoEmbed embedUrl={currentStream.embedUrl} title={currentStream.title} />

          <div className="stream-metadata">
            <div className="stream-tags">
              <span className="tag platform-tag">{currentStream.platform}</span>
              <span className="tag category-tag">
                {currentStream.category === 'gaming' ? '🎮 Gaming' : '💬 General'}
              </span>
              {currentStream.status === 'archived' && (
                <span className="tag archive-tag">Archived</span>
              )}
            </div>
            <h2>{currentStream.title}</h2>
          </div>
        </div>
      )}

      {archives.length > 0 && (
        <div className="archive-section">
          <h3 className="section-title">Past Streams</h3>
          <div className="archive-grid">
            {archives.map((video) => (
              <div
                key={video._id}
                className="archive-card"
                onClick={() => setCurrentStream(video)}
              >
                <div className="archive-thumbnail">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} />
                  ) : (
                    <div className="thumbnail-placeholder">▶</div>
                  )}
                </div>
                <div className="archive-info">
                  <h4>{video.title}</h4>
                  <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;