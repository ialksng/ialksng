import React, { useEffect } from 'react';

const AdBanner = ({
  dataAdSlot = "4143392198", 
  dataAdFormat = "auto",
  fullWidthResponsive = "true"
}) => {

  useEffect(() => {
    try {
      const timeout = setTimeout(() => {
        if (window.adsbygoogle && typeof window.adsbygoogle.push === "function") {
          window.adsbygoogle.push({});
        }
      }, 100);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("AdSense Error:", error);
    }
  }, [dataAdSlot]);

  return (
    <div 
      className="ad-banner-wrapper" 
      style={{ 
        margin: '2rem auto', 
        minHeight: '120px', 
        width: '100%',
        backgroundColor: 'color-mix(in srgb, var(--text-muted) 10%, transparent)',
        border: '1px dashed color-mix(in srgb, var(--text-muted) 30%, transparent)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span style={{ 
        position: 'absolute', 
        color: 'var(--text-muted)', 
        fontSize: '0.85rem', 
        fontWeight: '600',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        zIndex: 0 
      }}>
        Advertisement
      </span>
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', zIndex: 1, position: 'relative', width: '100%' }}
          data-ad-client="ca-pub-4303485576958542"
          data-ad-slot={dataAdSlot} 
          data-ad-format={dataAdFormat} 
          data-full-width-responsive={fullWidthResponsive} 
        ></ins>
    </div>
  );
};

export default AdBanner;